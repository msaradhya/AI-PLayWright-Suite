/**
 * Database Connection Test
 * Simple test to verify Azure SQL Server database connectivity
 *
 * Run with: npx playwright test db-connection-test.spec.ts
 */

import { test, expect, describe, afterAll } from '../../fixtures/test-wrapper';
import { 
    getConnectionPool, 
    executeQuery, 
    closeAllConnections,
    isConnected,
    getMssqlConfig,
    DbType
} from '../../utils/databaseUtils';
import { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';
import { HoonuitEtlDataHelper as AdminDataHelper } from './testdatamodel/HoonuitAdminDigitalLearningDashboardData';

describe('Database Connection Tests', () => {
    
    afterAll(async () => {
        // Cleanup all connections after tests
        await closeAllConnections();
    });

    test('DB-CONFIG-001', 'should display database configuration', async () => {
        console.log('\n========================================');
        console.log('DATABASE CONFIGURATION TEST');
        console.log('========================================\n');
        
        const dbTypes: DbType[] = ['azure_sql_server', 'azure_ps5'];
        
        for (const dbType of dbTypes) {
            const config = getMssqlConfig(dbType);
            console.log(`\n--- ${dbType.toUpperCase()} Configuration ---`);
            console.log(`Server: ${config.server}`);
            console.log(`Database: ${config.database}`);
            console.log(`Port: ${config.port}`);
            console.log(`User: ${config.user}`);
            console.log(`Password: ${config.password ? '***hidden***' : 'NOT SET'}`);
            console.log(`Encrypt: ${config.options?.encrypt}`);
        }
        
        // This test always passes - it just logs configuration
        expect(true).toBe(true);
    });

    test('DB-CONN-001', 'should connect to azure_sql_server database', async () => {
        console.log('\n========================================');
        console.log('AZURE_SQL_SERVER CONNECTION TEST');
        console.log('========================================\n');
        
        const dbType: DbType = 'azure_sql_server';
        
        try {
            console.log(`Attempting to connect to ${dbType}...`);
            const pool = await getConnectionPool(dbType);
            
            console.log(`✅ Successfully connected to ${dbType}!`);
            console.log(`Connection status: ${isConnected(dbType) ? 'CONNECTED' : 'NOT CONNECTED'}`);
            
            // Try a simple query
            console.log('\nExecuting test query: SELECT 1 AS test_value...');
            const result = await executeQuery<{ test_value: number }>(dbType, 'SELECT 1 AS test_value');
            
            console.log(`Query result: ${JSON.stringify(result.recordset)}`);
            expect(result.recordset[0].test_value).toBe(1);
            
            console.log('\n✅ Database connection test PASSED!');
            
        } catch (error: any) {
            console.error(`\n❌ Failed to connect to ${dbType}:`, error.message);
            console.error('\nFull error:', error);
            
            // Mark test as failed but don't throw - we want to see the error
            expect(error).toBeUndefined();
        }
    });

    test('DB-ETL-001', 'should initialize HoonuitEtlDataHelper and fetch data', async () => {
        console.log('\n========================================');
        console.log('HOONUIT ETL DATA HELPER TEST');
        console.log('========================================\n');
        
        try {
            // Initialize the data helper
            console.log('Initializing HoonuitEtlDataHelper...');
            await HoonuitEtlDataHelper.initialize();
            
            console.log(`Using database: ${HoonuitEtlDataHelper.isUsingDatabase() ? 'YES' : 'NO (fallback to in-memory)'}`);
            
            // Try to fetch Admin Digital Learning Dashboard data
            console.log('\nFetching Admin Digital Learning Dashboard data...');
            const data = await AdminDataHelper.getAdminDigitalLearningDashboardData();
            
            console.log('\n--- Fetched Data ---');
            console.log(`studentTotalLoginCount: ${data.studentTotalLoginCount}`);
            console.log(`staffTotalLoginCount: ${data.staffTotalLoginCount}`);
            console.log(`uihnMeetingStudentLoginCount: ${data.uihnMeetingStudentLoginCount}`);
            console.log(`uihnStudentLoginCount: ${data.uihnStudentLoginCount}`);
            
            console.log('\n✅ HoonuitEtlDataHelper test PASSED!');
            
            // Cleanup
            await HoonuitEtlDataHelper.cleanup();
            
        } catch (error: any) {
            console.error('\n❌ HoonuitEtlDataHelper test FAILED:', error.message);
            console.error('\nFull error:', error);
            
            // Cleanup even on failure
            try {
                await HoonuitEtlDataHelper.cleanup();
            } catch {}
            
            expect(error).toBeUndefined();
        }
    });

    test('DB-TABLE-001', 'should check if TestData table exists', async () => {
        console.log('\n========================================');
        console.log('TEST DATA TABLE CHECK');
        console.log('========================================\n');
        
        const dbType: DbType = 'azure_sql_server';
        
        try {
            console.log('Checking if TestData table exists...');
            
            const query = `
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME = 'TestData'
            `;
            
            const result = await executeQuery<{ TABLE_NAME: string }>(dbType, query);
            
            if (result.recordset.length > 0) {
                console.log('✅ TestData table EXISTS!');
                
                // Check table structure
                const structureQuery = `
                    SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME = 'TestData'
                `;
                const structureResult = await executeQuery(dbType, structureQuery);
                
                console.log('\n--- Table Structure ---');
                structureResult.recordset.forEach((col: any) => {
                    console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''}`);
                });
                
                // Count rows
                const countResult = await executeQuery<{ count: number }>(dbType, 'SELECT COUNT(*) as count FROM TestData');
                console.log(`\nTotal rows in TestData: ${countResult.recordset[0].count}`);
                
            } else {
                console.log('⚠️ TestData table DOES NOT EXIST!');
                console.log('\nYou need to create the table with this SQL:');
                console.log(`
CREATE TABLE TestData (
    Environment VARCHAR(50),
    DataClassName VARCHAR(100),
    JsonData NVARCHAR(MAX),
    LastUpdated DATETIME,
    PRIMARY KEY (Environment, DataClassName)
);
                `);
            }
            
            console.log('\n✅ Table check completed!');
            
        } catch (error: any) {
            console.error('\n❌ Table check FAILED:', error.message);
            expect(error).toBeUndefined();
        }
    });
});