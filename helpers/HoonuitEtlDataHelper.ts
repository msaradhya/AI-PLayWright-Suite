import { HoonuitJsonHelper } from './HoonuitJsonHelper';
import {
  executeQuery,
  executeParameterizedQuery,
  getConnectionPool,
  closeAllConnections,
  DbType
} from '../../utils/databaseUtils';

/**
 * Hoonuit ETL Data Helper
 * Provides helper methods for ETL data operations with Azure SQL Server database
 *
 * This class follows the same pattern as the Java HoonuitEtlDataHelper class,
 * storing and retrieving test data from the azure_sql_server database.
 *
 * Database Table Structure:
 * - Table: TestData
 * - Columns: Environment (VARCHAR), DataClassName (VARCHAR), JsonData (NVARCHAR(MAX)), LastUpdated (DATETIME)
 *
 * @author MSA Team
 * @since 2025-11-28
 */
export class HoonuitEtlDataHelper {
  
  // Database configuration
  private static readonly DB_TYPE: DbType = 'azure_sql_server';
  private static readonly TABLE_NAME = 'test_data';
  
  // In-memory store for testing purposes only
  private static testDataStore: Map<string, string> = new Map();
  private static useDatabaseConnection: boolean = true;

  /**
   * Initialize database connection
   * Call this before running tests that need database access
   * @throws Error if database connection fails
   */
  static async initialize(): Promise<void> {
    await getConnectionPool(this.DB_TYPE);
    this.useDatabaseConnection = true;
    console.log('HoonuitEtlDataHelper: Database connection initialized');
  }

  /**
   * Cleanup database connections
   * Call this after test suite completes
   */
  static async cleanup(): Promise<void> {
    await closeAllConnections();
  }

  /**
   * Update database with test data (simple version)
   * @param pojo Object of the data class
   */
  static async updateDatabase<T>(pojo: T): Promise<void> {
    return this.updateDatabaseInternal(pojo, false);
  }

  /**
   * Update database with test data using caller class for data class name
   * @param pojo Object of the data class
   * @param useCallerClassForDataClassName Whether to use caller class name
   */
  static async updateDatabaseWithCallerClass<T>(pojo: T, useCallerClassForDataClassName: boolean): Promise<void> {
    return this.updateDatabaseInternal(pojo, useCallerClassForDataClassName);
  }

  /**
   * Internal method to update database
   * @param pojo Object to store
   * @param useCallerClassForDataClassName Whether to use caller class name
   */
  private static async updateDatabaseInternal<T>(pojo: T, useCallerClassForDataClassName: boolean): Promise<void> {
    try {
      // Get environment and class name
      const environment = this.getEnvironmentName();
      const dataClassName = useCallerClassForDataClassName
        ? this.getCallerClassName(2)
        : (pojo as any).constructor?.name || 'Unknown';

      // Serialize object to JSON
      const jsonData = HoonuitJsonHelper.getJsonStringFromObject(pojo);

      console.log(`Updating database for environment: ${environment}, class: ${dataClassName}`);

      if (this.useDatabaseConnection) {
        // Use actual database
        await this.upsertToDatabase(environment, dataClassName, jsonData);
      } else {
        // Fallback to in-memory store
        this.storeTestData(environment, dataClassName, jsonData);
      }
      
    } catch (error) {
      console.error('Error updating database:', error);
      throw error;
    }
  }

  /**
   * Upsert data to the database (update if exists, insert if not)
   * Uses the existing test_data table structure with columns:
   * - environment (varchar)
   * - data_class_name (varchar)
   * - json_data (varchar(MAX))
   * - last_updated (datetime)
   */
  private static async upsertToDatabase(environment: string, dataClassName: string, jsonData: string): Promise<void> {
    const query = `
      MERGE INTO ${this.TABLE_NAME} AS target
      USING (SELECT @environment AS environment, @data_class_name AS data_class_name) AS source
      ON target.environment = source.environment AND target.data_class_name = source.data_class_name
      WHEN MATCHED THEN
        UPDATE SET json_data = @json_data, last_updated = GETUTCDATE()
      WHEN NOT MATCHED THEN
        INSERT (environment, data_class_name, json_data, last_updated)
        VALUES (@environment, @data_class_name, @json_data, GETUTCDATE());
    `;

    await executeParameterizedQuery(this.DB_TYPE, query, {
      environment: environment,
      data_class_name: dataClassName,
      json_data: jsonData
    });
  }

  /**
   * Get data from database
   * @param clazz Type of object to return
   * @returns Object of specified type
   */
  static async getData<T>(clazz: new () => T): Promise<T> {
    return this.getDataInternal(clazz, false);
  }

  /**
   * Get data from database using caller class for data class name
   * @param clazz Type of object to return
   * @param useCallerClassForDataClassName Whether to use caller class name
   * @returns Object of specified type
   */
  static async getDataWithCallerClass<T>(clazz: new () => T, useCallerClassForDataClassName: boolean): Promise<T> {
    return this.getDataInternal(clazz, useCallerClassForDataClassName);
  }

  /**
   * Internal method to get data from database
   * @param clazz Type of object to return
   * @param useCallerClassForDataClassName Whether to use caller class name
   * @returns Object of specified type
   * @throws Error if database connection fails or data is not found
   */
  private static async getDataInternal<T>(clazz: new () => T, useCallerClassForDataClassName: boolean): Promise<T> {
    // Get environment and class name
    const environment = this.getEnvironmentName();
    const dataClassName = useCallerClassForDataClassName
      ? this.getCallerClassName(2)
      : clazz.name;

    console.log(`Fetching data for environment: ${environment}, class: ${dataClassName}`);

    let jsonData: string | undefined;

    if (this.useDatabaseConnection) {
      // Fetch from database
      jsonData = await this.fetchFromDatabase(environment, dataClassName);
    } else {
      // In-memory store (for testing purposes only)
      jsonData = this.getTestData(environment, dataClassName);
    }

    if (jsonData) {
      return HoonuitJsonHelper.getObjectFromJsonString(jsonData, clazz);
    }
    
    // Throw error if no data found - no fallback to default values
    throw new Error(`No data found for ${dataClassName} in environment ${environment}. Database connection is required.`);
  }

  /**
   * Fetch data from the database
   * Uses the existing test_data table structure
   */
  private static async fetchFromDatabase(environment: string, dataClassName: string): Promise<string | undefined> {
    // Try exact match first
    let query = `
      SELECT json_data
      FROM ${this.TABLE_NAME}
      WHERE environment = @environment AND data_class_name = @data_class_name
    `;

    let result = await executeParameterizedQuery<{ json_data: string }>(this.DB_TYPE, query, {
      environment: environment,
      data_class_name: dataClassName
    });

    // If no exact match, try matching just the class name (without package prefix)
    if (!result.recordset || result.recordset.length === 0) {
      query = `
        SELECT json_data
        FROM ${this.TABLE_NAME}
        WHERE environment = @environment AND data_class_name LIKE @data_class_name_pattern
      `;
      
      result = await executeParameterizedQuery<{ json_data: string }>(this.DB_TYPE, query, {
        environment: environment,
        data_class_name_pattern: `%${dataClassName}`
      });
    }

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset[0].json_data;
    }

    return undefined;
  }

  /**
   * Get data by class name string (useful when class constructor is not available)
   * @param dataClassName Name of the data class
   * @returns JSON data string or undefined
   */
  static async getDataByClassName(dataClassName: string): Promise<string | undefined> {
    const environment = this.getEnvironmentName();
    
    if (this.useDatabaseConnection) {
      return this.fetchFromDatabase(environment, dataClassName);
    }
    
    return this.getTestData(environment, dataClassName);
  }

  /**
   * Get data and parse to specific interface type
   * @param dataClassName Name of the data class
   * @returns Parsed data object or undefined
   */
  static async getDataAsObject<T>(dataClassName: string): Promise<T | undefined> {
    const jsonData = await this.getDataByClassName(dataClassName);
    
    if (jsonData) {
      return JSON.parse(jsonData) as T;
    }
    
    return undefined;
  }

  /**
   * Delete data from database
   * @param dataClassName Name of the data class to delete
   */
  static async deleteData(dataClassName: string): Promise<void> {
    const environment = this.getEnvironmentName();
    
    if (this.useDatabaseConnection) {
      const query = `
        DELETE FROM ${this.TABLE_NAME}
        WHERE environment = @environment AND data_class_name = @data_class_name
      `;
      
      await executeParameterizedQuery(this.DB_TYPE, query, {
        environment: environment,
        data_class_name: dataClassName
      });
    } else {
      const key = `${environment}:${dataClassName}`;
      this.testDataStore.delete(key);
    }
  }

  /**
   * List all available data classes in the database for the current environment
   * @returns Array of data class names
   */
  static async listAvailableDataClasses(): Promise<string[]> {
    const environment = this.getEnvironmentName();
    
    if (this.useDatabaseConnection) {
      const query = `
        SELECT DISTINCT data_class_name
        FROM ${this.TABLE_NAME}
        WHERE environment = @environment
        ORDER BY data_class_name
      `;
      
      const result = await executeParameterizedQuery<{ data_class_name: string }>(this.DB_TYPE, query, {
        environment: environment
      });
      
      return result.recordset.map(r => r.data_class_name);
    }
    
    return Array.from(this.testDataStore.keys())
      .filter(k => k.startsWith(`${environment}:`))
      .map(k => k.split(':')[1]);
  }

  /**
   * Search for data classes matching a pattern
   * @param pattern Search pattern (e.g., "DigitalLearning")
   * @returns Array of matching data class names
   */
  static async searchDataClasses(pattern: string): Promise<string[]> {
    const environment = this.getEnvironmentName();
    
    if (this.useDatabaseConnection) {
      const query = `
        SELECT DISTINCT data_class_name
        FROM ${this.TABLE_NAME}
        WHERE environment = @environment
          AND data_class_name LIKE @pattern
        ORDER BY data_class_name
      `;
      
      const result = await executeParameterizedQuery<{ data_class_name: string }>(this.DB_TYPE, query, {
        environment: environment,
        pattern: `%${pattern}%`
      });
      
      return result.recordset.map(r => r.data_class_name);
    }
    
    return [];
  }

  /**
   * Get the environment name from configuration
   * @returns Environment name
   */
  private static getEnvironmentName(): string {
    return process.env.TEST_ENV || 'auto_aws_bronze';
  }

  /**
   * Get the caller class name from stack trace
   * @param level The level of the caller class
   * @returns Caller class name
   */
  private static getCallerClassName(level: number): string {
    const stack = new Error().stack;
    if (!stack) return 'Unknown';

    const stackLines = stack.split('\n');
    if (stackLines.length <= level + 1) return 'Unknown';

    const callerLine = stackLines[level + 1];
    const match = callerLine.match(/at\s+(.+?)\s+\(/);
    
    return match ? match[1] : 'Unknown';
  }

  // ==========================================
  // In-Memory Fallback Methods (for testing)
  // ==========================================

  /**
   * Store data in memory for testing
   * @param environment Environment name
   * @param dataClassName Class name
   * @param jsonData JSON data to store
   */
  static storeTestData(environment: string, dataClassName: string, jsonData: string): void {
    const key = `${environment}:${dataClassName}`;
    this.testDataStore.set(key, jsonData);
  }

  /**
   * Retrieve data from memory for testing
   * @param environment Environment name
   * @param dataClassName Class name
   * @returns Stored JSON data
   */
  static getTestData(environment: string, dataClassName: string): string | undefined {
    const key = `${environment}:${dataClassName}`;
    return this.testDataStore.get(key);
  }

  /**
   * Clear all test data from memory
   */
  static clearTestData(): void {
    this.testDataStore.clear();
  }

  /**
   * Check if test data exists
   * @param environment Environment name
   * @param dataClassName Class name
   * @returns True if data exists
   */
  static hasTestData(environment: string, dataClassName: string): boolean {
    const key = `${environment}:${dataClassName}`;
    return this.testDataStore.has(key);
  }

  /**
   * Force use of in-memory store (for testing purposes)
   */
  static useInMemoryStore(): void {
    this.useDatabaseConnection = false;
  }

  /**
   * Force use of database connection
   */
  static useDatabaseStore(): void {
    this.useDatabaseConnection = true;
  }

  /**
   * Check if using database connection
   */
  static isUsingDatabase(): boolean {
    return this.useDatabaseConnection;
  }
}