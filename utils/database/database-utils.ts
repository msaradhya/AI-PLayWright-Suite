/**
 * Database utilities for Playwright tests
 * 
 * This module provides database connection and query abstractions for Oracle and MSSQL databases.
 * It enables test scripts to interact with databases without having to manage connection details.
 * 
 * USAGE:
 * 
 * 1. Define your database configuration in config/default.json:
 * ```
 * {
 *   "oracleDb": {
 *     "user": "your_oracle_user",
 *     "password": "your_oracle_password",
 *     "connectString": "your_oracle_connection_string"
 *   },
 *   "mssqlDb": {
 *     "user": "your_mssql_user",
 *     "password": "your_mssql_password",
 *     "server": "your_mssql_server",
 *     "database": "your_mssql_database",
 *     "port": "1433",
 *     "options": {
 *       "encrypt": true
 *     }
 *   }
 * }
 * 
 * 2. Create your implementation classes:
 * ```
 * class MyOracleDB extends OracleDatabase {
 *   constructor(dbConfig: OracleConfig) {
 *     super(dbConfig);
 *   }
 * }
 * 
 * class MyMSSqlDB extends MSSqlDatabase {
 *   constructor(dbConfig: MSSqlConfig) {
 *     super(dbConfig);
 *   }
 * }
 * ```
 * 
 * 3. Use in your test:
 * ```
 * test('Database test example', async ({ page }) => {
 *   // Skip test if oracleDb configuration is not available
 *   test.skip(!config.has('oracleDb'), 'Oracle DB configuration is not available');
 *   
 *   if (config.has('oracleDb')) {
 *     const oracleConfig = config.get<OracleConfig>('oracleDb');
 *     const oracleDb = new MyOracleDB(oracleConfig);
 *     
 *     // Execute a query
 *     await oracleDb.execute(async (connection) => {
 *       const result = await connection.execute('SELECT * FROM users');
 *       console.log(result.rows);
 *       expect(result.rows.length).toBeGreaterThan(0);
 *     });
 *   }
 * });
 * ```
 */

import oracledb from 'oracledb';
import sqldb, { ConnectionPool } from 'mssql';

/**
 * Configuration interface for Oracle database connections
 */
export interface OracleConfig {
    user: string;
    password: string;
    connectString: string;
}

/**
 * Configuration interface for MSSQL database connections
 */
export interface MSSqlConfig {
    user: string;
    password: string;
    server: string;
    database: string;
    port: string;
    options?: {
        encrypt: true, // If using SSL/TLS encryption
    },
}

type OracleQueryPredicate = (connection: oracledb.Connection) => Promise<void>;
type MSSqlQueryPredicate = (pool: ConnectionPool) => Promise<void>;

/**
 * Oracle database abstraction class
 * 
 * This class provides methods for executing queries and transactions on Oracle databases.
 * Always use this class by extending it with your own implementation.
 * 
 * @example
 * ```typescript
 * class MyOracleDB extends OracleDatabase {
 *   constructor(dbConfig: OracleConfig) {
 *     super(dbConfig);
 *   }
 * }
 * 
 * // Get config from node-config
 * const oracleConfig = config.get<OracleConfig>('oracleDb');
 * const oracleDb = new MyOracleDB(oracleConfig);
 * 
 * // Execute a query
 * await oracleDb.execute(async (connection) => {
 *   const result = await connection.execute('SELECT * FROM employees');
 *   console.log(result.rows);
 * });
 * ```
 */
export abstract class OracleDatabase implements Database {
    protected readonly dbConfig: OracleConfig;

    protected constructor(dbConfig: OracleConfig) {
        this.dbConfig = dbConfig;
    }

    /**
     * Executes a function that receives an Oracle connection
     * 
     * @param predicate - Function that receives a connection and returns a Promise
     * @example
     * ```typescript
     * await oracleDb.execute(async (connection) => {
     *   const result = await connection.execute('SELECT * FROM employees');
     *   console.log(result.rows);
     * });
     * ```
     */
    async execute(predicate: OracleQueryPredicate): Promise<void> {
        let pool: oracledb.Pool;
        let connection: oracledb.Connection;
        try {
            pool = await oracledb.createPool(this.dbConfig);
            connection = await pool.getConnection();
            await predicate(connection);
        } catch (e) {
            e.message = `Error while connecting to Oracle DB: ${e.message}`;
            throw e;
        } finally {
            await connection.commit();
            await connection.close();
            await pool.close();
        }
    }

    /**
     * Executes a query and returns the first column of the first row as a number
     * 
     * @param sql - SQL query to execute
     * @returns The first column of the first row as a number, or 0 if no result
     * @example
     * ```typescript
     * const count = await oracleDb.queryForInt('SELECT COUNT(*) FROM employees');
     * ```
     */
    async queryForInt(sql: string): Promise<number> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows && result.rows.length > 0 && result.rows[0][0] !== null) {
                return result.rows[0][0];
            }
            return 0;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the first column of the first row as a Date
     * 
     * @param sql - SQL query to execute
     * @returns The first column of the first row as a Date, or null if no result
     * @example
     * ```typescript
     * const hireDate = await oracleDb.queryForDate('SELECT hire_date FROM employees WHERE id = 1');
     * ```
     */
    async queryForDate(sql: string): Promise<Date | null> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows && result.rows.length > 0 && result.rows[0][0] !== null) {
                return result.rows[0][0];
            }
            return null;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the first column of the first row as a long integer
     * 
     * @param sql - SQL query to execute
     * @returns The first column of the first row as a number, or 0 if no result
     * @example
     * ```typescript
     * const id = await oracleDb.queryForLong('SELECT id FROM employees WHERE name = "John"');
     * ```
     */
    async queryForLong(sql: string): Promise<number> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows && result.rows.length > 0 && result.rows[0][0] !== null) {
                return parseInt(result.rows[0][0]); // Assuming the result is a single row with a single column containing a long value
            }
            return 0; // Default value if no result is found
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the first column of the first row as a string
     * 
     * @param sql - SQL query to execute
     * @returns The first column of the first row as a string, or empty string if no result
     * @example
     * ```typescript
     * const name = await oracleDb.queryForString('SELECT name FROM employees WHERE id = 1');
     * ```
     */
    async queryForString(sql: string): Promise<string> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows && result.rows.length > 0 && result.rows[0][0] !== null) {
                return result.rows[0][0];
            }
            return '';
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns all rows
     * 
     * @param sql - SQL query to execute
     * @returns Array of rows from the query result
     * @example
     * ```typescript
     * const employees = await oracleDb.queryForList('SELECT * FROM employees WHERE department_id = 10');
     * ```
     */
    async queryForList(sql: string): Promise<any[]> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            // Assuming the result is an array of objects
            return result.rows;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes an update, insert, or delete SQL statement
     * 
     * @param sql - SQL statement to execute
     * @returns Number of rows affected
     * @example
     * ```typescript
     * const rowsAffected = await oracleDb.updateDB('UPDATE employees SET salary = 5000 WHERE id = 1');
     * ```
     */
    async updateDB(sql: string): Promise<number> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            // Assuming the result object contains affectedRows property
            return result.rowsAffected || 0;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the first column of each row as a string array
     * 
     * @param sql - SQL query to execute
     * @returns Array of strings from the first column of each row
     * @example
     * ```typescript
     * const names = await oracleDb.queryForStringList('SELECT name FROM employees');
     * ```
     */
    async queryForStringList(sql: string): Promise<string[]> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows) {
                return result.rows.map(row => row[0].toString());
            }
            return []; // Return an empty array if no rows are found
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the first column of each row as a number array
     * 
     * @param sql - SQL query to execute
     * @returns Array of numbers from the first column of each row
     * @example
     * ```typescript
     * const salaries = await oracleDb.queryForBigDecimalList('SELECT salary FROM employees');
     * ```
     */
    async queryForBigDecimalList(sql: string): Promise<number[]> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows) {
                return result.rows.map(row => parseFloat(row[0].toString())); // Assuming the first column contains BigDecimal values
            }
            return []; // Return an empty array if no rows are found
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the first column of the first row as a float
     * 
     * @param sql - SQL query to execute
     * @returns The first column of the first row as a float, or 0 if no result
     * @example
     * ```typescript
     * const avgSalary = await oracleDb.queryForFloat('SELECT AVG(salary) FROM employees');
     * ```
     */
    async queryForFloat(sql: string): Promise<number> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows && result.rows.length > 0 && result.rows[0][0] !== null) {
                return parseFloat(result.rows[0][0]); // Assuming the result is a single row with a single column containing a float value
            }
            return 0; // Default value if no result is found
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the first column of the first row as a double
     * 
     * @param sql - SQL query to execute
     * @returns The first column of the first row as a double, or 0 if no result
     * @example
     * ```typescript
     * const sumBudget = await oracleDb.queryForDouble('SELECT SUM(budget) FROM departments');
     * ```
     */
    async queryForDouble(sql: string): Promise<number> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(sql);
            if (result.rows && result.rows.length > 0 && result.rows[0][0] !== null) {
                return parseFloat(result.rows[0][0]); // Assuming the result is a single row with a single column containing a double value
            }
            return 0; // Default value if no result is found
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the full result set
     * 
     * @param sql - SQL query to execute
     * @returns The complete Oracle result object
     * @example
     * ```typescript
     * const result = await oracleDb.queryForResultSet('SELECT * FROM employees');
     * console.log(result.metaData); // Column information
     * console.log(result.rows);     // Row data
     * ```
     */
    async queryForResultSet(sql: string): Promise<oracledb.Result<any>> {
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            return await connection.execute(sql);
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    /**
     * Executes a query and returns the results formatted as a string table
     * 
     * @param query - SQL query to execute
     * @returns Formatted string with column names and values
     * @example
     * ```typescript
     * const table = await oracleDb.getTableOfValuesFromQueryAsString('SELECT * FROM employees LIMIT 5');
     * console.log(table);
     * ```
     */
    async getTableOfValuesFromQueryAsString(query: string): Promise<string> {
        let tableData: string = "";
        const connection = await oracledb.getConnection(this.dbConfig);
        try {
            const result = await connection.execute(query);
            if (result.rows) {
                for (let row of result.rows) {
                    const map: Record<string, any> = {};
                    for (let i = 0; i < result.metaData.length; i++) {
                        const fieldName = result.metaData[i].name;
                        const fieldValue = row[i] == null ? "" : row[i].toString();
                        map[fieldName] = fieldValue;
                    }
                    const fieldKeys = Object.keys(map).sort();
                    let lineData = "";
                    let separator = "";
                    for (const fieldName of fieldKeys) {
                        lineData += separator + fieldName + "=" + map[fieldName];
                        separator = ", ";
                    }
                    tableData += lineData + "\n";
                }
            }
            return tableData;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
}

/**
 * MSSQL database abstraction class
 * 
 * This class provides methods for executing queries and transactions on MSSQL databases.
 * Always use this class by extending it with your own implementation.
 * 
 * @example
 * ```typescript
 * class MyMSSqlDB extends MSSqlDatabase {
 *   constructor(dbConfig: MSSqlConfig) {
 *     super(dbConfig);
 *   }
 * }
 * 
 * // Get config from node-config
 * const mssqlConfig = config.get<MSSqlConfig>('mssqlDb');
 * const mssqlDb = new MyMSSqlDB(mssqlConfig);
 * 
 * // Execute a query
 * await mssqlDb.execute(async (pool) => {
 *   const result = await pool.query('SELECT * FROM Users');
 *   console.log(result);
 * });
 * ```
 */
export abstract class MSSqlDatabase implements Database {
    protected readonly dbConfig: MSSqlConfig;

    protected constructor(dbConfig: MSSqlConfig) {
        this.dbConfig = dbConfig;
    }

    /**
     * Executes a function that receives an MSSQL connection pool
     * 
     * @param predicate - Function that receives a connection pool and returns a Promise
     * @example
     * ```typescript
     * await mssqlDb.execute(async (pool) => {
     *   const result = await pool.query('SELECT * FROM Users');
     *   console.log(result);
     * });
     * ```
     */
    async execute(predicate: MSSqlQueryPredicate): Promise<void> {
        const pool: ConnectionPool = await sqldb.connect({ server: this.dbConfig.server, user: this.dbConfig.user, password: this.dbConfig.password, database: this.dbConfig.database });

        try {
            await predicate(pool);
        } catch (e) {
            e.message = `Error while connecting to MSSql DB: ${e.message}`;
            throw e;
        } finally {
            await pool.close();
        }
    }

    /**
     * Executes an update, insert, or delete SQL statement
     * 
     * @param sql - SQL statement to execute
     * @returns Number of rows affected
     * @example
     * ```typescript
     * const rowsAffected = await mssqlDb.updateDB('UPDATE Users SET Active = 1 WHERE UserId = 1');
     * ```
     */
    async updateDB(sql: string): Promise<number> {
        const pool: ConnectionPool = await sqldb.connect({ server: this.dbConfig.server, user: this.dbConfig.user, password: this.dbConfig.password, database: this.dbConfig.database });
        try {
            const result = await pool.query(sql);
            // Assuming the result object contains affectedRows property
            return result.rowsAffected.length || 0;
        } finally {
            if (pool) {
                await pool.close();
            }
        }
    }

}

/**
 * Database interface that both Oracle and MSSQL implementations must fulfill
 */
export interface Database {
    /**
     * Executes a function that receives a database connection
     * 
     * @param p - Function that receives a connection and returns a Promise
     */
    execute(p: any): Promise<void>;
}