/**
 * SnowFlake Database Helper
 * Central helper for Snowflake connectivity (key-pair / JWT) used by ETL validation tests.
 *
 * NOTE: Sensitive constants are hard-coded per user request; normally these should be externalized.
 *
 * @author aradhyas
 * @since 28/09/25
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const snowflake = require('snowflake-sdk');
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Configure snowflake-sdk logging
snowflake.configure({ logLevel: 'WARN' });

/**
 * Snowflake SDK types (since the package doesn't have proper TypeScript definitions)
 */
interface SnowflakeConnection {
  connect(callback: (err: Error | undefined, conn: SnowflakeConnection) => void): void;
  execute(options: SnowflakeStatementOptions): void;
  destroy(callback: (err: Error | undefined) => void): void;
}

interface SnowflakeStatementOptions {
  sqlText: string;
  binds?: any[];
  complete: (err: Error | undefined, stmt: SnowflakeStatement | undefined, rows: any[] | undefined) => void;
}

interface SnowflakeStatement {
  getColumns(): SnowflakeColumn[];
}

interface SnowflakeColumn {
  getName(): string;
  getType(): string;
}

interface SnowflakeConnectionOptions {
  account: string;
  username: string;
  privateKey?: string;
  privateKeyPath?: string;
  privateKeyPass?: string;
  warehouse: string;
  database: string;
  schema: string;
  role?: string;
  authenticator?: string;
}

/**
 * Interface for Build Status Result
 */
export interface BuildStatusResult {
  anyRow: boolean;
  observedDate: Date | null;
  multipleDates: boolean;
  statuses: Set<string>;
  containsFailure: boolean;
}

/**
 * Interface for ResultSet metadata column info
 */
export interface ColumnMetadata {
  index: number;
  name: string;
  type: string;
}

/**
 * SnowFlakeDBHelper Class
 * Provides Snowflake database connectivity and helper methods for ETL validation tests.
 */
export class SnowFlakeDBHelper {
  // Snowflake connection configuration (public for test access)
  public static readonly SF_URL = 'nua24869.us-east-1.privatelink.snowflakecomputing.com';
  public static readonly SF_ACCOUNT = 'nua24869.us-east-1.privatelink';
  public static readonly SF_WAREHOUSE = 'DV_UIHN_ETL_PROD_WH';
  public static readonly SF_DATABASE = 'DV_UIHN_SISGOLDPS5MIG01_PROD_K12INTEL_DW';
  public static readonly SF_SCHEMA = 'PUBLIC';
  public static readonly SF_USER = 'DV_UIHN_SISGOLDPS5MIG01_PROD_K12INTEL_ETL';
  public static readonly SF_ROLE = 'DV_UIHN_SISGOLDPS5MIG01_PROD_K12INTEL_DB_OWNER';

  public static readonly PRIVATE_KEY_RESOURCE = 'keys/rsa_key.pem';

  public static readonly MIN_DAYS = 1;
  public static readonly MAX_DAYS = 10;

  // Build status candidate names
  public static readonly BUILD_STATUS_CANDIDATES = [
    'BUILD_STATUS_ALL',
    'BUILD_STATUS',
    'BUILD_STATUS_LATEST',
    'BUILD_STATUS_CURRENT',
    'BUILD_STATUS_VIEW',
    'BUILD_STATUS_VW',
    'BUILD_STATUS_ALL_VW',
    'BUILD_STATUS_HISTORY',
    'STATUS_BUILD',
    'STATUS', // broad fallback
  ];

  /** Explicit preferred BUILD_STATUS object (checked before probing candidates). */
  public static readonly EXPLICIT_BUILD_STATUS_OBJECT = `${SnowFlakeDBHelper.SF_DATABASE}.K12INTEL_METADATA.BUILD_STATUS_ALL`;

  /** Fully-qualified workflow task queue table used across ETL validation tests. */
  public static readonly WORKFLOW_TASK_QUEUE_TABLE = `${SnowFlakeDBHelper.SF_DATABASE}.K12INTEL_USERDATA.XTBL_WORKFLOW_TASK_QUEUE`;

  // Cached private key
  private static cachedPrivateKey: string | null = null;

  // Cached connection
  private static cachedConnection: SnowflakeConnection | null = null;

  /**
   * Private constructor to prevent instantiation
   */
  private constructor() {}

  /**
   * Obtain a Snowflake connection using key-pair JWT authentication.
   * @returns Promise<SnowflakeConnection> - Snowflake connection
   */
  public static async getConnection(): Promise<SnowflakeConnection> {
    if (this.cachedConnection) {
      return this.cachedConnection;
    }

    const privateKey = await this.loadPrivateKey();

    const connectionOptions: SnowflakeConnectionOptions = {
      account: this.SF_ACCOUNT,
      username: this.SF_USER,
      privateKey: privateKey,
      warehouse: this.SF_WAREHOUSE,
      database: this.SF_DATABASE,
      schema: this.SF_SCHEMA,
      role: this.SF_ROLE,
      authenticator: 'SNOWFLAKE_JWT',
    };

    console.log(`Using Snowflake key-pair (JWT) auth for user=${this.SF_USER} role=${this.SF_ROLE}`);

    return new Promise((resolve, reject) => {
      const connection: SnowflakeConnection = snowflake.createConnection(connectionOptions);

      connection.connect((err: Error | undefined, conn: SnowflakeConnection) => {
        if (err) {
          if (err.message && err.message.toLowerCase().includes('jwt token is invalid')) {
            console.error('JWT invalid – verify registered public key, account host, and system clock.');
          }
          reject(new Error(`Failed to connect to Snowflake: ${err.message}`));
          return;
        }

        this.cachedConnection = conn;
        this.applyContext(conn)
          .then(() => resolve(conn))
          .catch((contextErr) => {
            console.warn('Context application warning:', contextErr.message);
            resolve(conn);
          });
      });
    });
  }

  /**
   * Best-effort context setting; failures are logged but not fatal.
   * @param conn - Snowflake connection
   */
  public static async applyContext(conn: SnowflakeConnection): Promise<void> {
    const contextQueries = [
      `USE WAREHOUSE ${this.SF_WAREHOUSE}`,
      `USE DATABASE ${this.SF_DATABASE}`,
      `USE SCHEMA ${this.SF_SCHEMA}`,
    ];

    for (const query of contextQueries) {
      try {
        await this.executeStatement(conn, query);
      } catch (err: any) {
        console.warn(`${query.split(' ')[1]} failed: ${err.message}`);
      }
    }
  }

  /**
   * Load RSA private key (PKCS#1 or PKCS#8).
   *
   * Priority:
   * 1. SNOWFLAKE_PRIVATE_KEY environment variable - can be:
   *    a) Direct key content (PEM format or base64)
   *    b) File path to a key file (if the value is a valid file path)
   * 2. SNOWFLAKE_PRIVATE_KEY_PATH environment variable (explicit path to key file)
   * 3. SF_KEY_RESOURCE environment variable (path to key file)
   * 4. Default file path: keys/rsa_key.pem
   *
   * @returns Promise<string> - Private key content
   */
  public static async loadPrivateKey(): Promise<string> {
    if (this.cachedPrivateKey) {
      return this.cachedPrivateKey;
    }

    let keyContent: string | null = null;

    // Priority 1: Check for SNOWFLAKE_PRIVATE_KEY environment variable
    const envKeyValue = process.env.SNOWFLAKE_PRIVATE_KEY;
    if (envKeyValue) {
      // Check if it's a file path (if the value points to an existing file)
      if (fs.existsSync(envKeyValue)) {
        try {
          keyContent = fs.readFileSync(envKeyValue, 'utf8');
          console.log(`Loaded RSA private key from file path in SNOWFLAKE_PRIVATE_KEY: ${envKeyValue}`);
        } catch (err: any) {
          console.warn(`Failed to read key file from SNOWFLAKE_PRIVATE_KEY path: ${err.message}`);
        }
      } else if (envKeyValue.includes('-----BEGIN') || envKeyValue.length > 100) {
        // It's key content directly (either PEM format or base64)
        keyContent = envKeyValue;
        console.log('Loaded RSA private key content from SNOWFLAKE_PRIVATE_KEY environment variable');
      }
    }

    // Priority 2: Check for SNOWFLAKE_PRIVATE_KEY_PATH environment variable (explicit path)
    if (!keyContent) {
      const envKeyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH;
      if (envKeyPath && fs.existsSync(envKeyPath)) {
        try {
          keyContent = fs.readFileSync(envKeyPath, 'utf8');
          console.log(`Loaded RSA private key from SNOWFLAKE_PRIVATE_KEY_PATH: ${envKeyPath}`);
        } catch (err: any) {
          console.warn(`Failed to read key file from SNOWFLAKE_PRIVATE_KEY_PATH: ${err.message}`);
        }
      }
    }

    // Priority 3 & 4: Load from SF_KEY_RESOURCE or default file paths
    if (!keyContent) {
      const resourcePath = process.env.SF_KEY_RESOURCE || this.PRIVATE_KEY_RESOURCE;
      
      // Try multiple paths to find the key file
      const possiblePaths = [
        path.resolve(process.cwd(), resourcePath),
        path.resolve(__dirname, '..', '..', resourcePath),
        path.resolve(__dirname, '..', '..', 'resources', resourcePath),
        resourcePath,
      ];

      for (const keyPath of possiblePaths) {
        try {
          if (fs.existsSync(keyPath)) {
            keyContent = fs.readFileSync(keyPath, 'utf8');
            console.log(`Loaded RSA private key from ${keyPath}`);
            break;
          }
        } catch (err) {
          // Continue to next path
        }
      }

      if (!keyContent) {
        const allPaths = [
          process.env.SNOWFLAKE_PRIVATE_KEY || '(not set)',
          process.env.SNOWFLAKE_PRIVATE_KEY_PATH || '(not set)',
          ...possiblePaths
        ];
        throw new Error(
          'Private key not found. Set SNOWFLAKE_PRIVATE_KEY environment variable with key content or file path, ' +
          'SNOWFLAKE_PRIVATE_KEY_PATH with explicit file path, ' +
          `or provide key file at one of: ${possiblePaths.join(', ')}. Checked locations: ${allPaths.join(', ')}`
        );
      }
    }

    // Process the key content
    this.cachedPrivateKey = this.processPrivateKey(keyContent);
    
    // Log diagnostics
    this.logKeyDiagnostics(this.cachedPrivateKey);

    return this.cachedPrivateKey;
  }

  /**
   * Process private key content - handle PKCS#1 and PKCS#8 formats
   * @param keyContent - Raw key file content
   * @returns Processed key content
   */
  private static processPrivateKey(keyContent: string): string {
    // Remove any extra whitespace/newlines at start/end
    keyContent = keyContent.trim();

    // If it's already in proper PEM format, return as-is
    if (keyContent.includes('-----BEGIN PRIVATE KEY-----') || 
        keyContent.includes('-----BEGIN RSA PRIVATE KEY-----') ||
        keyContent.includes('-----BEGIN ENCRYPTED PRIVATE KEY-----')) {
      return keyContent;
    }

    // If it's base64 without headers, wrap it in PKCS#8 headers
    const base64Content = keyContent.replace(/[\r\n\s]/g, '');
    return `-----BEGIN PRIVATE KEY-----\n${base64Content}\n-----END PRIVATE KEY-----`;
  }

  /**
   * Log key diagnostics for debugging
   * @param privateKey - Private key content
   */
  private static logKeyDiagnostics(privateKey: string): void {
    try {
      // Try to extract key info for logging
      const keyObj = crypto.createPrivateKey(privateKey);
      const publicKey = crypto.createPublicKey(keyObj);
      const keyDetails = keyObj.asymmetricKeyDetails;
      
      if (keyDetails) {
        const fingerprint = crypto
          .createHash('sha256')
          .update(publicKey.export({ type: 'spki', format: 'der' }))
          .digest('hex');
        
        console.log(`Private key info -> modulusBits=${keyDetails.modulusLength}, pubKeySHA256Fingerprint=${fingerprint}`);
      }
    } catch (err: any) {
      console.warn(`Key diagnostics failed: ${err.message}`);
    }
  }

  /**
   * Logs current Snowflake context values.
   * @param conn - Snowflake connection
   */
  public static async logCurrentContext(conn: SnowflakeConnection): Promise<void> {
    const query = 'SELECT CURRENT_ACCOUNT(), CURRENT_REGION(), CURRENT_ROLE(), CURRENT_WAREHOUSE(), CURRENT_DATABASE(), CURRENT_SCHEMA()';
    
    try {
      const rows = await this.executeQuery<any[]>(conn, query);
      if (rows && rows.length > 0) {
        const row = rows[0];
        console.log(
          `Context => acct=${row['CURRENT_ACCOUNT()']}, region=${row['CURRENT_REGION()']}, ` +
          `role=${row['CURRENT_ROLE()']}, wh=${row['CURRENT_WAREHOUSE()']}, ` +
          `db=${row['CURRENT_DATABASE()']}, schema=${row['CURRENT_SCHEMA()']}`
        );
      }
    } catch (err: any) {
      console.warn(`Context query failed: ${err.message}`);
    }
  }

  /**
   * Simple probe to confirm SELECT privilege.
   * @param conn - Snowflake connection
   * @param fullyQualified - Fully qualified table/view name
   * @returns Promise<boolean> - True if select is possible
   */
  public static async canSelectFrom(conn: SnowflakeConnection, fullyQualified: string): Promise<boolean> {
    const probe = `SELECT 1 FROM ${fullyQualified} LIMIT 1`;
    try {
      await this.executeQuery(conn, probe);
      return true;
    } catch (err: any) {
      console.debug(`Probe failed for ${fullyQualified}: ${err.message}`);
      return false;
    }
  }

  /**
   * Check if a database object exists
   * @param conn - Snowflake connection
   * @param type - Object type ('SCHEMA' or 'TABLE')
   * @param db - Database name
   * @param schema - Schema name
   * @param name - Object name
   * @returns Promise<boolean> - True if object exists
   */
  public static async objectExists(
    conn: SnowflakeConnection,
    type: 'SCHEMA' | 'TABLE',
    db: string,
    schema: string,
    name: string
  ): Promise<boolean> {
    let sql: string;

    switch (type) {
      case 'SCHEMA':
        sql = `SHOW SCHEMAS LIKE '${name}' IN DATABASE ${db}`;
        break;
      case 'TABLE':
        sql = `SHOW TABLES LIKE '${name}' IN SCHEMA ${db}.${schema}`;
        break;
      default:
        return false;
    }

    try {
      const rows = await this.executeQuery(conn, sql);
      return rows && rows.length > 0;
    } catch (err: any) {
      console.debug(`objectExists query failed ${sql}: ${err.message}`);
      return false;
    }
  }

  /**
   * Check if a schema exists in a database
   * @param conn - Snowflake connection
   * @param db - Database name
   * @param schema - Schema name
   * @returns Promise<boolean> - True if schema exists
   */
  public static async schemaExistsInDb(conn: SnowflakeConnection, db: string, schema: string): Promise<boolean> {
    const sql = `SHOW SCHEMAS LIKE '${schema}' IN DATABASE ${db}`;
    try {
      const rows = await this.executeQuery(conn, sql);
      return rows && rows.length > 0;
    } catch (err: any) {
      console.debug(`schemaExistsInDb failed ${sql}: ${err.message}`);
      return false;
    }
  }

  /**
   * Attempts to select the explicitly preferred BUILD_STATUS object first (BUILD_STATUS_ALL) and,
   * if not accessible, falls back to resolveBuildStatusObject candidate probing.
   * @param conn - Snowflake connection
   * @returns Promise<string> - Fully qualified build status object name
   * @throws Error if none of the explicit or candidate objects are accessible
   */
  public static async chooseBuildStatusObject(conn: SnowflakeConnection): Promise<string> {
    const explicit = this.EXPLICIT_BUILD_STATUS_OBJECT;
    
    if (await this.canSelectFrom(conn, explicit)) {
      console.log(`Using explicit build status object: ${explicit}`);
      return explicit;
    }

    console.warn('Explicit BUILD_STATUS_ALL not accessible; attempting candidate resolution');
    const resolved = await this.resolveBuildStatusObject(conn);
    
    if (!resolved) {
      throw new Error('No accessible BUILD_STATUS* object (explicit + candidates)');
    }
    
    return resolved;
  }

  /**
   * Attempts to locate a usable BUILD_STATUS* table/view in the metadata schema by probing
   * a prioritized list of candidate object names.
   * @param conn - Snowflake connection
   * @returns Promise<string | null> - Fully qualified name or null if none found
   */
  public static async resolveBuildStatusObject(conn: SnowflakeConnection): Promise<string | null> {
    const schema = 'K12INTEL_METADATA';

    for (const candidate of this.BUILD_STATUS_CANDIDATES) {
      const fqn = `${this.SF_DATABASE}.${schema}.${candidate}`;
      const probe = `SELECT 1 FROM ${fqn} LIMIT 1`;

      try {
        await this.executeQuery(conn, probe);
        console.log(`Selected build status object: ${fqn}`);
        return fqn;
      } catch (err: any) {
        const msg = err.message?.toLowerCase() || '';
        if (!(msg.includes('does not exist') || msg.includes('not found') || msg.includes('invalid identifier'))) {
          console.debug(`Skipping candidate ${fqn} due to SQL error: ${err.message}`);
        } else {
          console.trace(`Candidate ${fqn} not present.`);
        }
      }
    }

    return null;
  }

  /**
   * Executes the provided build status SQL and evaluates row status/date consistency.
   * @param conn - Snowflake connection
   * @param sql - SQL query to execute
   * @returns Promise<BuildStatusResult> - Build status evaluation result
   */
  public static async executeBuildStatusQuery(conn: SnowflakeConnection, sql: string): Promise<BuildStatusResult> {
    const result: BuildStatusResult = {
      anyRow: false,
      observedDate: null,
      multipleDates: false,
      statuses: new Set<string>(),
      containsFailure: false,
    };

    const rows = await this.executeQuery<any[]>(conn, sql);

    for (const row of rows) {
      result.anyRow = true;
      const status = row['STATUS_NAME'] || row['status_name'];
      const createdTs = row['CREATED_UTC'] || row['created_utc'];

      if (!createdTs) {
        throw new Error('created_utc returned null');
      }

      const rowDate = new Date(createdTs);
      rowDate.setUTCHours(0, 0, 0, 0); // Normalize to date only

      if (!result.observedDate) {
        result.observedDate = rowDate;
      } else if (rowDate.getTime() !== result.observedDate.getTime()) {
        result.multipleDates = true;
      }

      if (status) {
        result.statuses.add(status);
        if (status.toUpperCase() === 'FAILURE') {
          result.containsFailure = true;
        }
      }
    }

    console.log(`Build status query evaluation => ${JSON.stringify({
      anyRow: result.anyRow,
      observedDate: result.observedDate?.toISOString(),
      multipleDates: result.multipleDates,
      containsFailure: result.containsFailure,
      statuses: Array.from(result.statuses),
    })}`);

    return result;
  }

  /**
   * Conditionally logs ResultSet column metadata if environment variable DEBUG_YEAR_META=true.
   * @param columns - Array of column metadata
   * @param tag - Tag for logging
   */
  public static maybeLogResultSetMetadata(columns: ColumnMetadata[], tag: string): void {
    const debug = process.env.DEBUG_YEAR_META || 'false';
    if (debug.toLowerCase() !== 'true') return;

    if (!columns || columns.length === 0) {
      console.warn(`[${tag}] No metadata available`);
      return;
    }

    const colsStr = columns
      .map((col) => `${col.index}:${col.name}(${col.type})`)
      .join(' ');
    
    console.log(`[${tag}] Columns => ${colsStr}`);
  }

  /**
   * Convenience method for tests: obtains a connection (key-pair), applies & logs context, then returns it.
   * @returns Promise<SnowflakeConnection> - Configured Snowflake connection
   */
  public static async openTestConnection(): Promise<SnowflakeConnection> {
    const conn = await this.getConnection();
    await this.logCurrentContext(conn);
    return conn;
  }

  /**
   * Close the cached connection
   */
  public static async closeConnection(): Promise<void> {
    if (this.cachedConnection) {
      return new Promise((resolve, reject) => {
        this.cachedConnection!.destroy((err: Error | undefined) => {
          if (err) {
            console.error('Error closing Snowflake connection:', err.message);
            reject(err);
          } else {
            this.cachedConnection = null;
            console.log('Snowflake connection closed');
            resolve();
          }
        });
      });
    }
  }

  /**
   * Execute a SQL statement (no result expected)
   * @param conn - Snowflake connection
   * @param sql - SQL statement to execute
   */
  private static executeStatement(conn: SnowflakeConnection, sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      conn.execute({
        sqlText: sql,
        complete: (err: Error | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      });
    });
  }

  /**
   * Execute a SQL query and return results
   * @param conn - Snowflake connection
   * @param sql - SQL query to execute
   * @returns Promise<T> - Query results
   */
  public static executeQuery<T = any[]>(conn: SnowflakeConnection, sql: string): Promise<T> {
    return new Promise((resolve, reject) => {
      conn.execute({
        sqlText: sql,
        complete: (err: Error | undefined, stmt: SnowflakeStatement | undefined, rows: any[] | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve((rows || []) as T);
          }
        },
      });
    });
  }

  /**
   * Execute a parameterized SQL query
   * @param conn - Snowflake connection
   * @param sql - SQL query with ? placeholders
   * @param binds - Array of parameter values
   * @returns Promise<T> - Query results
   */
  public static executeParameterizedQuery<T = any[]>(
    conn: SnowflakeConnection,
    sql: string,
    binds: any[]
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      conn.execute({
        sqlText: sql,
        binds: binds,
        complete: (err: Error | undefined, stmt: SnowflakeStatement | undefined, rows: any[] | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve((rows || []) as T);
          }
        },
      });
    });
  }

  /**
   * Get column metadata from a statement
   * @param conn - Snowflake connection
   * @param sql - SQL query
   * @returns Promise<ColumnMetadata[]> - Array of column metadata
   */
  public static async getColumnMetadata(conn: SnowflakeConnection, sql: string): Promise<ColumnMetadata[]> {
    return new Promise((resolve, reject) => {
      conn.execute({
        sqlText: sql,
        complete: (err: Error | undefined, stmt: SnowflakeStatement | undefined) => {
          if (err) {
            reject(err);
            return;
          }

          const columns: ColumnMetadata[] = [];
          if (stmt) {
            const cols = stmt.getColumns();
            cols.forEach((col: SnowflakeColumn, index: number) => {
              columns.push({
                index: index + 1,
                name: col.getName(),
                type: col.getType(),
              });
            });
          }
          resolve(columns);
        },
      });
    });
  }
}

// Export default for convenience
export default SnowFlakeDBHelper;