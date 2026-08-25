/**
 * Search Test Data in Database
 * Query to find available test data classes for integration tests
 *
 * Run with: npx playwright test search-test-data.spec.ts --reporter=list
 */

import { test, expect, describe, beforeAll, afterAll } from '../../fixtures/test-wrapper';
import { 
    executeQuery, 
    closeAllConnections,
    DbType
} from '../../utils/databaseUtils';
import { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';

describe('Search Test Data', () => {
    
    beforeAll(async () => {
        await HoonuitEtlDataHelper.initialize();
    });

    afterAll(async () => {
        await HoonuitEtlDataHelper.cleanup();
        await closeAllConnections();
    });

    test('DB-SEARCH-001', 'should list all data classes for auto_aws_bronze environment', async () => {
        console.log('\n========================================');
        console.log('AVAILABLE DATA CLASSES IN DATABASE');
        console.log('Environment: auto_aws_bronze');
        console.log('========================================\n');
        
        const dataClasses = await HoonuitEtlDataHelper.listAvailableDataClasses();
        
        console.log(`Found ${dataClasses.length} data classes:\n`);
        
        dataClasses.forEach((dc, i) => {
            console.log(`  ${(i + 1).toString().padStart(3)}. ${dc}`);
        });
        
        expect(dataClasses.length).toBeGreaterThan(0);
    });

    test('DB-SEARCH-002', 'should search for DigitalLearning related data classes', async () => {
        console.log('\n========================================');
        console.log('SEARCHING FOR: DigitalLearning');
        console.log('========================================\n');
        
        const matches = await HoonuitEtlDataHelper.searchDataClasses('DigitalLearning');
        
        console.log(`Found ${matches.length} matching data classes:\n`);
        matches.forEach(dc => console.log(`  - ${dc}`));
        
        if (matches.length === 0) {
            console.log('  (No matches found)');
        }
    });

    test('DB-SEARCH-003', 'should search for Enrollment related data classes', async () => {
        console.log('\n========================================');
        console.log('SEARCHING FOR: Enrollment');
        console.log('========================================\n');
        
        const matches = await HoonuitEtlDataHelper.searchDataClasses('Enrollment');
        
        console.log(`Found ${matches.length} matching data classes:\n`);
        matches.forEach(dc => console.log(`  - ${dc}`));
        
        if (matches.length === 0) {
            console.log('  (No matches found)');
        }
    });

    test('DB-SEARCH-004', 'should search for Incident/Behaviour related data classes', async () => {
        console.log('\n========================================');
        console.log('SEARCHING FOR: Incident');
        console.log('========================================\n');
        
        const matches = await HoonuitEtlDataHelper.searchDataClasses('Incident');
        
        console.log(`Found ${matches.length} matching data classes:\n`);
        matches.forEach(dc => console.log(`  - ${dc}`));
        
        if (matches.length === 0) {
            console.log('  (No matches found)');
        }
    });

    test('DB-SEARCH-005', 'should search for Attendance related data classes', async () => {
        console.log('\n========================================');
        console.log('SEARCHING FOR: Attendance');
        console.log('========================================\n');
        
        const matches = await HoonuitEtlDataHelper.searchDataClasses('Attendance');
        
        console.log(`Found ${matches.length} matching data classes:\n`);
        matches.forEach(dc => console.log(`  - ${dc}`));
        
        if (matches.length === 0) {
            console.log('  (No matches found)');
        }
    });

    test('DB-SEARCH-006', 'should search for Academics related data classes', async () => {
        console.log('\n========================================');
        console.log('SEARCHING FOR: Academics');
        console.log('========================================\n');
        
        const matches = await HoonuitEtlDataHelper.searchDataClasses('Academics');
        
        console.log(`Found ${matches.length} matching data classes:\n`);
        matches.forEach(dc => console.log(`  - ${dc}`));
        
        if (matches.length === 0) {
            console.log('  (No matches found)');
        }
    });

    test('DB-SEARCH-007', 'should fetch data for a specific class if exists', async () => {
        console.log('\n========================================');
        console.log('FETCHING SPECIFIC DATA CLASS');
        console.log('========================================\n');
        
        const dbType: DbType = 'azure_sql_server';
        
        // Query to find a data class that might match our integration tests
        const query = `
            SELECT TOP 10 
                data_class_name,
                LEFT(json_data, 200) as json_preview,
                last_updated
            FROM test_data
            WHERE environment = 'auto_aws_bronze'
              AND (
                data_class_name LIKE '%DigitalLearning%'
                OR data_class_name LIKE '%Enrollment%'
                OR data_class_name LIKE '%Incident%'
                OR data_class_name LIKE '%Attendance%'
                OR data_class_name LIKE '%Academics%'
              )
            ORDER BY last_updated DESC
        `;
        
        try {
            const result = await executeQuery<{
                data_class_name: string;
                json_preview: string;
                last_updated: Date;
            }>(dbType, query);
            
            if (result.recordset.length > 0) {
                console.log('Found relevant test data:\n');
                result.recordset.forEach((row, i) => {
                    console.log(`${i + 1}. ${row.data_class_name}`);
                    console.log(`   Last Updated: ${row.last_updated}`);
                    console.log(`   Preview: ${row.json_preview}...`);
                    console.log('');
                });
            } else {
                console.log('No matching data classes found for integration tests.');
                console.log('\nThe database contains other test data (551 rows total)');
                console.log('but none matching: DigitalLearning, Enrollment, Incident, Attendance, Academics');
            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    });

    test('DB-SEARCH-008', 'should show sample data from existing test_data table', async () => {
        console.log('\n========================================');
        console.log('SAMPLE DATA FROM test_data TABLE');
        console.log('========================================\n');
        
        const dbType: DbType = 'azure_sql_server';
        
        const query = `
            SELECT TOP 5
                environment,
                data_class_name,
                LEFT(json_data, 300) as json_preview,
                last_updated
            FROM test_data
            WHERE environment = 'auto_aws_bronze'
            ORDER BY last_updated DESC
        `;
        
        try {
            const result = await executeQuery<{
                environment: string;
                data_class_name: string;
                json_preview: string;
                last_updated: Date;
            }>(dbType, query);
            
            console.log('Sample records:\n');
            result.recordset.forEach((row, i) => {
                console.log(`─── Record ${i + 1} ───`);
                console.log(`Environment: ${row.environment}`);
                console.log(`Data Class: ${row.data_class_name}`);
                console.log(`Last Updated: ${row.last_updated}`);
                console.log(`JSON Preview:\n${row.json_preview}...`);
                console.log('');
            });
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    });
});