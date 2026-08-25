/**
 * Database utilities for database configuration and connection management
 * Uses mssql package for Azure SQL Server connections
 *
 * Updated to use ConfigManager as the single source of truth
 *
 * @author MSA Team
 * @since 2025-11-29
 */

import * as sql from 'mssql';
import { ConfigManager, DatabaseConfig } from '../config/ConfigManager';

const configManager = ConfigManager.getInstance();

// Type for database types
export type DbType = 'azure_sql_server' | 'azure_ps5';

// Connection pool cache
const connectionPools: Map<DbType, sql.ConnectionPool> = new Map();

/**
 * Get database configuration by type
 * @param dbType - Database type ('azure_sql_server' or 'azure_ps5')
 * @returns Database configuration object
 */
export function getDbConfig(dbType: DbType): DatabaseConfig {
  return configManager.getDatabaseConfig(dbType);
}

/**
 * Generate a connection string for SQL Server
 * @param dbType - Database type
 * @returns Connection string
 */
export function generateConnectionString(dbType: DbType): string {
  const config = configManager.getDatabaseConfig(dbType);
  return `Server=${config.server},${config.port};Database=${config.name};User Id=${config.user};Password=${config.password};Encrypt=true;TrustServerCertificate=false;`;
}

/**
 * Get mssql connection configuration
 * @param dbType - Database type
 * @returns mssql config object
 */
export function getMssqlConfig(dbType: DbType): sql.config {
  const config = configManager.getDatabaseConfig(dbType);
  return {
    server: config.server,
    database: config.name,
    user: config.user,
    password: config.password,
    port: config.port,
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
}

/**
 * Get database connection parameters
 * @param dbType - Database type
 * @returns Object with connection parameters
 */
export function getConnectionParams(dbType: DbType): {
  server: string;
  database: string;
  user: string;
  password: string;
  port: number;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
} {
  const config = configManager.getDatabaseConfig(dbType);
  return {
    server: config.server,
    database: config.name,
    user: config.user,
    password: config.password,
    port: config.port,
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  };
}

/**
 * Get or create a connection pool for the specified database
 * @param dbType - Database type ('azure_sql_server' or 'azure_ps5')
 * @returns Connection pool
 */
export async function getConnectionPool(dbType: DbType): Promise<sql.ConnectionPool> {
  // Check if pool already exists and is connected
  const existingPool = connectionPools.get(dbType);
  if (existingPool && existingPool.connected) {
    return existingPool;
  }

  // Create new connection pool
  const config = getMssqlConfig(dbType);
  const pool = new sql.ConnectionPool(config);
  
  try {
    await pool.connect();
    connectionPools.set(dbType, pool);
    console.log(`Successfully connected to ${dbType} database`);
    return pool;
  } catch (error) {
    console.error(`Failed to connect to ${dbType} database:`, error);
    throw error;
  }
}

/**
 * Establish a database connection and return the pool
 * @param dbType - Database type ('azure_sql_server' or 'azure_ps5')
 * @returns Connection pool
 */
export async function connectToDatabase(dbType: DbType): Promise<sql.ConnectionPool> {
  return getConnectionPool(dbType);
}

/**
 * Execute a SQL query
 * @param dbType - Database type
 * @param query - SQL query string
 * @returns Query result
 */
export async function executeQuery<T = any>(dbType: DbType, query: string): Promise<sql.IResult<T>> {
  const pool = await getConnectionPool(dbType);
  const request = pool.request();
  return request.query<T>(query);
}

/**
 * Execute a parameterized SQL query
 * @param dbType - Database type
 * @param query - SQL query string with parameters (@param1, @param2, etc.)
 * @param params - Object with parameter values { param1: value1, param2: value2 }
 * @returns Query result
 */
export async function executeParameterizedQuery<T = any>(
  dbType: DbType,
  query: string,
  params: Record<string, any>
): Promise<sql.IResult<T>> {
  const pool = await getConnectionPool(dbType);
  const request = pool.request();
  
  // Add parameters to the request
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }
  
  return request.query<T>(query);
}

/**
 * Execute a stored procedure
 * @param dbType - Database type
 * @param procedureName - Name of the stored procedure
 * @param params - Object with parameter values
 * @returns Stored procedure result
 */
export async function executeStoredProcedure<T = any>(
  dbType: DbType,
  procedureName: string,
  params?: Record<string, any>
): Promise<sql.IProcedureResult<T>> {
  const pool = await getConnectionPool(dbType);
  const request = pool.request();
  
  // Add parameters if provided
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
  }
  
  return request.execute<T>(procedureName);
}

/**
 * Close a specific database connection pool
 * @param dbType - Database type
 */
export async function closeConnection(dbType: DbType): Promise<void> {
  const pool = connectionPools.get(dbType);
  if (pool) {
    await pool.close();
    connectionPools.delete(dbType);
    console.log(`Closed connection to ${dbType} database`);
  }
}

/**
 * Close all database connection pools
 */
export async function closeAllConnections(): Promise<void> {
  for (const [dbType, pool] of connectionPools) {
    if (pool) {
      await pool.close();
      console.log(`Closed connection to ${dbType} database`);
    }
  }
  connectionPools.clear();
}

/**
 * Check if a database connection is active
 * @param dbType - Database type
 * @returns True if connected
 */
export function isConnected(dbType: DbType): boolean {
  const pool = connectionPools.get(dbType);
  return pool?.connected ?? false;
}

/**
 * Alias for generateConnectionString for backward compatibility
 * @param dbType - Database type
 * @returns Connection string
 */
export function getConnectionString(dbType: DbType): string {
  return generateConnectionString(dbType);
}

// Export sql types for use in other modules
export { sql };