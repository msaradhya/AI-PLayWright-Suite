/**
 * List Database Tables
 * Query to list all tables in TestDataQASISHoonuit database
 *
 * Run with: npx playwright test list-db-tables.spec.ts --reporter=list
 */

import { test, expect, describe, afterAll } from '../../fixtures/test-wrapper';
import { 
    executeQuery, 
    closeAllConnections,
    DbType
} from '../../utils/databaseUtils';

describe('List Database Tables', () => {
    
    afterAll(async () => {
        await closeAllConnections();
    });

    test('DB-LIST-001', 'should list all tables in TestDataQASISHoonuit database', async () => {
        console.log('\n========================================');
        console.log('LISTING ALL TABLES IN DATABASE');
        console.log('Server: 00generalqaautomation.database.windows.net');
        console.log('Database: TestDataQASISHoonuit');
        console.log('========================================\n');
        
        const dbType: DbType = 'azure_sql_server';
        
        try {
            // Query to get all tables
            const tablesQuery = `
                SELECT 
                    TABLE_SCHEMA,
                    TABLE_NAME,
                    TABLE_TYPE
                FROM INFORMATION_SCHEMA.TABLES
                ORDER BY TABLE_SCHEMA, TABLE_NAME
            `;
            
            const result = await executeQuery<{
                TABLE_SCHEMA: string;
                TABLE_NAME: string;
                TABLE_TYPE: string;
            }>(dbType, tablesQuery);
            
            console.log(`\n📊 Found ${result.recordset.length} tables:\n`);
            console.log('─'.repeat(70));
            console.log(`${'SCHEMA'.padEnd(20)} | ${'TABLE NAME'.padEnd(35)} | TYPE`);
            console.log('─'.repeat(70));
            
            for (const table of result.recordset) {
                console.log(`${table.TABLE_SCHEMA.padEnd(20)} | ${table.TABLE_NAME.padEnd(35)} | ${table.TABLE_TYPE}`);
            }
            
            console.log('─'.repeat(70));
            console.log(`\nTotal: ${result.recordset.length} tables\n`);
            
            // For each table, get row count
            console.log('\n📈 Table Row Counts:\n');
            console.log('─'.repeat(50));
            
            for (const table of result.recordset) {
                if (table.TABLE_TYPE === 'BASE TABLE') {
                    try {
                        const countQuery = `SELECT COUNT(*) as count FROM [${table.TABLE_SCHEMA}].[${table.TABLE_NAME}]`;
                        const countResult = await executeQuery<{ count: number }>(dbType, countQuery);
                        console.log(`${table.TABLE_NAME.padEnd(40)} | ${countResult.recordset[0].count} rows`);
                    } catch (e: any) {
                        console.log(`${table.TABLE_NAME.padEnd(40)} | Error: ${e.message}`);
                    }
                }
            }
            
            console.log('─'.repeat(50));
            
            // Check for any table that might contain test data
            console.log('\n\n🔍 Looking for potential test data tables...\n');
            
            const testDataTables = result.recordset.filter(t => 
                t.TABLE_NAME.toLowerCase().includes('test') ||
                t.TABLE_NAME.toLowerCase().includes('data') ||
                t.TABLE_NAME.toLowerCase().includes('etl') ||
                t.TABLE_NAME.toLowerCase().includes('hoonuit')
            );
            
            if (testDataTables.length > 0) {
                console.log('Found tables that might contain test data:');
                testDataTables.forEach(t => console.log(`  - ${t.TABLE_SCHEMA}.${t.TABLE_NAME}`));
            } else {
                console.log('No tables found with names containing "test", "data", "etl", or "hoonuit"');
            }
            
            expect(result.recordset.length).toBeGreaterThanOrEqual(0);
            
        } catch (error: any) {
            console.error('❌ Error listing tables:', error.message);
            throw error;
        }
    });

    test('DB-STRUCT-001', 'should show detailed structure of all tables', async () => {
        console.log('\n========================================');
        console.log('DETAILED TABLE STRUCTURES');
        console.log('========================================\n');
        
        const dbType: DbType = 'azure_sql_server';
        
        try {
            // Get all tables
            const tablesQuery = `
                SELECT TABLE_SCHEMA, TABLE_NAME
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_TYPE = 'BASE TABLE'
                ORDER BY TABLE_SCHEMA, TABLE_NAME
            `;
            
            const tablesResult = await executeQuery<{
                TABLE_SCHEMA: string;
                TABLE_NAME: string;
            }>(dbType, tablesQuery);
            
            for (const table of tablesResult.recordset) {
                console.log(`\n📋 Table: [${table.TABLE_SCHEMA}].[${table.TABLE_NAME}]`);
                console.log('─'.repeat(60));
                
                // Get columns
                const columnsQuery = `
                    SELECT 
                        COLUMN_NAME,
                        DATA_TYPE,
                        CHARACTER_MAXIMUM_LENGTH,
                        IS_NULLABLE,
                        COLUMN_DEFAULT
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_SCHEMA = '${table.TABLE_SCHEMA}' 
                      AND TABLE_NAME = '${table.TABLE_NAME}'
                    ORDER BY ORDINAL_POSITION
                `;
                
                const columnsResult = await executeQuery<{
                    COLUMN_NAME: string;
                    DATA_TYPE: string;
                    CHARACTER_MAXIMUM_LENGTH: number | null;
                    IS_NULLABLE: string;
                    COLUMN_DEFAULT: string | null;
                }>(dbType, columnsQuery);
                
                console.log(`${'Column'.padEnd(25)} | ${'Type'.padEnd(20)} | Nullable | Default`);
                console.log('─'.repeat(60));
                
                for (const col of columnsResult.recordset) {
                    const typeStr = col.CHARACTER_MAXIMUM_LENGTH 
                        ? `${col.DATA_TYPE}(${col.CHARACTER_MAXIMUM_LENGTH === -1 ? 'MAX' : col.CHARACTER_MAXIMUM_LENGTH})`
                        : col.DATA_TYPE;
                    console.log(`${col.COLUMN_NAME.padEnd(25)} | ${typeStr.padEnd(20)} | ${col.IS_NULLABLE.padEnd(8)} | ${col.COLUMN_DEFAULT || ''}`);
                }
                
                // Get sample data (first 3 rows)
                try {
                    const sampleQuery = `SELECT TOP 3 * FROM [${table.TABLE_SCHEMA}].[${table.TABLE_NAME}]`;
                    const sampleResult = await executeQuery(dbType, sampleQuery);
                    
                    if (sampleResult.recordset.length > 0) {
                        console.log(`\nSample data (${sampleResult.recordset.length} rows):`);
                        sampleResult.recordset.forEach((row: any, i: number) => {
                            console.log(`  Row ${i + 1}: ${JSON.stringify(row).substring(0, 200)}...`);
                        });
                    } else {
                        console.log('\n(Table is empty)');
                    }
                } catch (e) {
                    console.log('\n(Could not fetch sample data)');
                }
            }
            
            expect(true).toBe(true);
            
        } catch (error: any) {
            console.error('❌ Error:', error.message);
            throw error;
        }
    });
});