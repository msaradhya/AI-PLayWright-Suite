/**
 * Hoonuit Admin Digital Learning Dashboard Test
 * Integration validation test for Digital Learning Dashboard data after ETL
 *
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitAdminDigitalLearningDashboardTest
 *
 * This test fetches expected values from the Azure SQL Server database using
 * the HoonuitEtlDataHelper. If database connection fails, it falls back to default values.
 *
 * @author poojitha (original Java implementation)
 * @author aradhyas (converted to TypeScript/Playwright)
 * @since 30-10-2025
 * @jira TCM-65405
 */

import { test, expect, describe, beforeAll, afterAll, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import HoonuitStudentActivityPage from '../../shared/pages/essentials/digitallearning/HoonuitStudentActivityPage';
import { HoonuitStaffActivityPage } from '../../shared/pages/essentials/digitallearning/HoonuitStaffActivityPage';
import { HoonuitStudentActivityDataWallPage } from '../../shared/pages/essentials/digitallearning/HoonuitStudentActivityDataWallPage';
import { FilterData } from '../../shared/pages/base/FilterData';
import { HoonuitIntegrationUsers } from './users/HoonuitIntegrationUsers';
import {
    HoonuitAdminDigitalLearningDashboardData,
    HoonuitEtlDataHelper
} from './testdatamodel/HoonuitAdminDigitalLearningDashboardData';
import { DashboardTypes, dashboardTypesUtils } from '../../types';
import { DigitalLearningNavTabs } from '../../types';

// Test constants
const SCHOOL_FILTER = 'School';
const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';

/**
 * Test Suite: Digital Learning Dashboard - New data validation - Admin
 * Validates digital learning dashboard data after ETL process
 *
 * Database Integration:
 * - Uses azure_sql_server database configuration from ConfigManager
 * - Fetches expected test data from TestData table
 * - Falls back to static default values if database is unavailable
 */
describe('Hoonuit Admin Digital Learning Dashboard Tests', () => {
    // Page objects
    let hoonuitStudentActivityPage: HoonuitStudentActivityPage;
    let staffActivityPage: HoonuitStaffActivityPage;
    let studentActivityDataWallPage: HoonuitStudentActivityDataWallPage;
    
    // Test data
    let adminDigitalLearningDashboardData: HoonuitAdminDigitalLearningDashboardData;
    let multiFilters: Record<string, string>;

    beforeAll(async () => {
        // Initialize database connection
        console.log('Initializing database connection for ETL data...');
        await HoonuitEtlDataHelper.initialize();
        
        // Fetch data from DB (or use default test data if DB unavailable)
        console.log('Fetching Admin Digital Learning Dashboard data from database...');
        adminDigitalLearningDashboardData = await HoonuitEtlDataHelper.getAdminDigitalLearningDashboardData();
        
        console.log('Test data loaded:', {
            studentTotalLoginCount: adminDigitalLearningDashboardData.studentTotalLoginCount,
            staffTotalLoginCount: adminDigitalLearningDashboardData.staffTotalLoginCount,
            uihnMeetingStudentLoginCount: adminDigitalLearningDashboardData.uihnMeetingStudentLoginCount,
            uihnStudentLoginCount: adminDigitalLearningDashboardData.uihnStudentLoginCount
        });
    });

    afterAll(async () => {
        // Cleanup database connections
        console.log('Cleaning up database connections...');
        await HoonuitEtlDataHelper.cleanup();
    });

    beforeEach(async ({ page }) => {
        // Initialize page objects
        hoonuitStudentActivityPage = new HoonuitStudentActivityPage(page);
        staffActivityPage = new HoonuitStaffActivityPage(page);
        studentActivityDataWallPage = new HoonuitStudentActivityDataWallPage(page);
        
        // Initialize multi-filters map
        multiFilters = {};
        
        // Login to Hoonuit as Administrator
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlAdmin_User1);
    });

    afterEach(async ({ page }) => {
        // Logout after each test
        try {
            await HoonuitHelper.logout(page);
        } catch (error) {
            console.warn('Logout failed:', error);
        }
    });

    /**
     * TCM-65405: Digital Learning Dashboard - New data validation - Admin
     * Validates student activity, staff activity, and student activity data wall data after ETL
     */
    test('TCM-65405', 'Validate Digital Learning Dashboard Data After ETL', async ({ page }) => {
        // Navigate from Essentials > Student Activity
        await HoonuitHelper.selectDashboard(
            page, 
            dashboardTypesUtils.getValue(DashboardTypes.ESSENTIALS),
            DigitalLearningNavTabs.STUDENT_ACTIVITY
        );

        // Set up multi-filters
        multiFilters[SCHOOL_FILTER] = UIHN_AUTOMATION_SCHOOL_FILTER_VALUE;
        multiFilters['Staff'] = 'UIHN 22-23, Teacher';
        multiFilters['Course'] = 'AP German I';

        // Wait for page and apply filters
        await hoonuitStudentActivityPage.waitForPage();
        const filter = hoonuitStudentActivityPage.getFilter();
        await filter.selectFilterData(multiFilters);

        // Get student activity data from the "Are Students Accessing the LMS" table
        const studentsAccessingLmsTable = hoonuitStudentActivityPage.getAreStudentsAccessingTheLMSTable();
        const studentRecords = await studentsAccessingLmsTable.getAllRecords();
        
        expect(studentRecords.length).toBeGreaterThan(0);
        
        const studentsAccessingLmsTableRecord = studentRecords[0];
        const studentTotalLogins = parseInt(studentsAccessingLmsTableRecord.get('TOTAL # OF LOGINS') || '0');
        const studentLoggedIn = studentsAccessingLmsTableRecord.get('# OF STUDENTS LOGGED IN') || '0';

        // Validate student activity dashboard data based on current month
        const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toUpperCase();
        
        if (currentMonth === 'JULY') {
            expect(
                studentTotalLogins,
                'UIHN Meeting, Student total login count is not same for July month'
            ).toBe(parseInt(adminDigitalLearningDashboardData.studentTotalLoginCount));
            expect(studentLoggedIn, 'Unexpected # OF STUDENTS LOGGED IN count').toBe('4');
        } else {
            expect(
                studentTotalLogins,
                'TOTAL # OF LOGINS is not increased for student by 6 after ETL'
            ).toBe(parseInt(adminDigitalLearningDashboardData.studentTotalLoginCount) + 6);
            expect(studentLoggedIn, 'Unexpected # OF STUDENTS LOGGED IN count').toBe('4');
        }

        // Navigate to Staff Activity
        await HoonuitHelper.clickSubNavTabLink(page, 'Staff Activity');
        await staffActivityPage.waitForPage();

        // Get staff activity data from the "Are Staff Accessing the LMS" table
        const staffAccessingLmsTable = staffActivityPage.getAreStaffAccessingLMSTable();
        const staffRecords = await staffAccessingLmsTable.getAllRecords();
        
        expect(staffRecords.length).toBeGreaterThan(0);
        
        const staffAccessingLmsTableRecord = staffRecords[0];
        const staffTotalLogins = parseInt(staffAccessingLmsTableRecord.get('TOTAL # OF LOGINS') || '0');
        const staffLoggedIn = staffAccessingLmsTableRecord.get('# OF STAFF LOGGED IN') || '0';

        // Validate staff activity dashboard data
        if (currentMonth === 'JULY') {
            expect(
                staffTotalLogins,
                'TOTAL # OF LOGINS is not same for staff in July month'
            ).toBe(parseInt(adminDigitalLearningDashboardData.staffTotalLoginCount));
            expect(staffLoggedIn, 'Unexpected # OF STAFF LOGGED IN count').toBe('1');
        } else {
            expect(
                staffTotalLogins,
                'TOTAL # OF LOGINS is not increased for staff by 2 after ETL'
            ).toBe(parseInt(adminDigitalLearningDashboardData.staffTotalLoginCount) + 2);
            expect(staffLoggedIn, 'Unexpected # OF STAFF LOGGED IN count').toBe('1');
        }

        // Navigate to Student Activity Data Wall
        await HoonuitHelper.clickSubNavTabLink(page, 'Student Activity Data Wall');
        await studentActivityDataWallPage.waitForPage();

        // Get data from the Data Wall table
        const dataWallTable = studentActivityDataWallPage.getDataWallTable();
        
        // Get specific cell values using getCellValue method
        const uihnMeetingStudentLogin = parseInt(
            await dataWallTable.getCellValue('Name', 'UIHN Meeting 22-23, Student', 'Total Logins')
        );
        const uihnStudentLogin = parseInt(
            await dataWallTable.getCellValue('Name', 'UIHN Student1 22-23, Student1', 'Total Logins')
        );

        // Validate student activity data wall dashboard data
        if (currentMonth === 'JULY') {
            expect(
                uihnMeetingStudentLogin,
                'UIHN Meeting, Student total login count is not same for July month'
            ).toBe(parseInt(adminDigitalLearningDashboardData.uihnMeetingStudentLoginCount));
            expect(
                uihnStudentLogin,
                'UIHN Student1, Student1 total login count is not same for July month'
            ).toBe(parseInt(adminDigitalLearningDashboardData.uihnStudentLoginCount));
        } else {
            expect(
                uihnMeetingStudentLogin,
                'UIHN Meeting, Student total login count is not increased by 3'
            ).toBe(parseInt(adminDigitalLearningDashboardData.uihnMeetingStudentLoginCount) + 3);
            expect(
                uihnStudentLogin,
                'UIHN Student1, Student1 total login count is not increased by 3'
            ).toBe(parseInt(adminDigitalLearningDashboardData.uihnStudentLoginCount) + 3);
        }
    });
});