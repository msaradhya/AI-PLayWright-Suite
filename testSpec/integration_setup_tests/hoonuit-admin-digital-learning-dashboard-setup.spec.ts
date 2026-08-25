/**
 * Hoonuit Admin Digital Learning Dashboard Setup Test
 * Setup test to fetch and store Digital Learning Dashboard data before ETL validation
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.setup.HoonuitAdminDigitalLearningDashboardSetupTest
 *
 * This test fetches data from the Digital Learning Dashboard and stores it in the database
 * for later validation after ETL runs.
 *
 * @author poojitha (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 21-07-2021
 * @jira TCM-65405
 */

import { test, expect, describe, beforeAll, afterAll, beforeEach } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';
import HoonuitStudentActivityPage from '../../shared/pages/essentials/digitallearning/HoonuitStudentActivityPage';
import { HoonuitStaffActivityPage } from '../../shared/pages/essentials/digitallearning/HoonuitStaffActivityPage';
import { HoonuitStudentActivityDataWallPage } from '../../shared/pages/essentials/digitallearning/HoonuitStudentActivityDataWallPage';
import { SISIntegrationUsers } from './users/SISIntegrationUsers';
import { HoonuitAdminDigitalLearningDashboardDataClass } from '../integration_validation_tests/testdatamodel/HoonuitAdminDigitalLearningDashboardData';
import { DashboardTypes, dashboardTypesUtils } from '../../types';
import { DigitalLearningNavTabs } from '../../types';
import { SISHelper } from '../../shared/helpers/SISHelper';
import { AppSwitcherHelper } from '../../shared/helpers/AppSwitcherHelper';

// Test constants
const SCHOOL_FILTER = 'School';
const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';

/**
 * Test Suite: Digital Learning Dashboard - Setup Test - Admin
 * Fetches and stores digital learning dashboard data for ETL validation
 */
describe('Hoonuit Admin Digital Learning Dashboard Setup Tests', () => {
    // Page objects
    let hoonuitStudentActivityPage: HoonuitStudentActivityPage;
    let staffActivityPage: HoonuitStaffActivityPage;
    let studentActivityDataWallPage: HoonuitStudentActivityDataWallPage;
    
    // Test data
    let adminDigitalLearningDashboardData: HoonuitAdminDigitalLearningDashboardDataClass;
    let multiFilters: Record<string, string>;

    beforeAll(async () => {
        // Initialize database connection
        console.log('Initializing database connection for ETL data...');
        await HoonuitEtlDataHelper.initialize();
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
        
        // Initialize test data object
        adminDigitalLearningDashboardData = new HoonuitAdminDigitalLearningDashboardDataClass();
        
        // Initialize multi-filters map
        multiFilters = {};
        
        // Login to SIS as Admin
        await SISHelper.startAdminTest(page, SISIntegrationUsers.etlAdmin_User1);
        await SISHelper.waitForAdminLoadingBarToDisappear(page);
    });

    /**
     * TCM-65405: Digital Learning Dashboard - New data setup - Admin
     * Fetches student activity, staff activity, and student activity data wall data
     * and stores it in the database for later ETL validation
     */
    test('TCM-65405', 'fetchInfoFromDigitalLearningDashboard', async ({ page }) => {
        // Open App Switcher and switch to Unified Insights
        await AppSwitcherHelper.openAppSwitcher(page);
        await AppSwitcherHelper.clickAppSwitcherOptionByName(page, 'Unified Insights');
        
        // Handle new window context
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
        ]);
        
        await newPage.waitForLoadState('networkidle');
        
        // Re-initialize page objects with new page context
        hoonuitStudentActivityPage = new HoonuitStudentActivityPage(newPage);
        staffActivityPage = new HoonuitStaffActivityPage(newPage);
        studentActivityDataWallPage = new HoonuitStudentActivityDataWallPage(newPage);
        
        // Navigate from Essentials > Student Activity
        await HoonuitHelper.selectDashboard(
            newPage, 
            dashboardTypesUtils.getValue(DashboardTypes.ESSENTIALS),
            DigitalLearningNavTabs.STUDENT_ACTIVITY
        );

        // Wait for page to load
        await hoonuitStudentActivityPage.waitForPage();

        // Set up multi-filters
        multiFilters[SCHOOL_FILTER] = UIHN_AUTOMATION_SCHOOL_FILTER_VALUE;
        multiFilters['Staff'] = 'UIHN 22-23, Teacher';
        multiFilters['Course'] = 'AP German I';
        
        // Apply filters
        const filter = hoonuitStudentActivityPage.getFilter();
        await filter.selectFilterData(multiFilters);

        // Fetch student activity dashboard data
        const studentsAccessingLmsTable = hoonuitStudentActivityPage.getAreStudentsAccessingTheLMSTable();
        const studentRecords = await studentsAccessingLmsTable.getAllRecords();
        
        expect(studentRecords.length).toBeGreaterThan(0);
        
        const studentTotalLoginCount = studentRecords[0].get('TOTAL # OF LOGINS') || '0';
        adminDigitalLearningDashboardData.studentTotalLoginCount = studentTotalLoginCount;
        
        console.log(`Fetched Student Total Login Count: ${studentTotalLoginCount}`);

        // Navigate to Staff Activity
        await HoonuitHelper.clickSubNavTabLink(newPage, 'Staff Activity');
        await staffActivityPage.waitForPage();

        // Fetch staff activity dashboard data
        const staffAccessingLmsTable = staffActivityPage.getAreStaffAccessingLMSTable();
        const staffRecords = await staffAccessingLmsTable.getAllRecords();
        
        expect(staffRecords.length).toBeGreaterThan(0);
        
        const staffTotalLoginCount = staffRecords[0].get('TOTAL # OF LOGINS') || '0';
        adminDigitalLearningDashboardData.staffTotalLoginCount = staffTotalLoginCount;
        
        console.log(`Fetched Staff Total Login Count: ${staffTotalLoginCount}`);

        // Navigate to Student Activity Data Wall
        await HoonuitHelper.clickSubNavTabLink(newPage, 'Student Activity Data Wall');
        await studentActivityDataWallPage.waitForPage();

        // Get data from the Data Wall table
        const dataWallTable = studentActivityDataWallPage.getDataWallTable();

        // Fetch student activity data wall dashboard data
        const uihnMeetingStudentLoginCount = await dataWallTable.getCellValue(
            'Name', 
            'UIHN Meeting 22-23, Student', 
            'Total Logins'
        );
        const uihnStudentLoginCount = await dataWallTable.getCellValue(
            'Name', 
            'UIHN Student1 22-23, Student1', 
            'Total Logins'
        );

        adminDigitalLearningDashboardData.uihnMeetingStudentLoginCount = uihnMeetingStudentLoginCount;
        adminDigitalLearningDashboardData.uihnStudentLoginCount = uihnStudentLoginCount;
        
        console.log(`Fetched UIHN Meeting Student Login Count: ${uihnMeetingStudentLoginCount}`);
        console.log(`Fetched UIHN Student Login Count: ${uihnStudentLoginCount}`);

        // Add Data to DB For Next Run
        console.log('Saving Admin Digital Learning Dashboard data to database...');
        await HoonuitEtlDataHelper.updateDatabase(adminDigitalLearningDashboardData);
        console.log('Data saved successfully.');

        // Logout from Hoonuit
        await HoonuitHelper.logout(newPage);
        
        // Close the new page
        await newPage.close();
    });
});