/**
 * Hoonuit Teacher Digital Learning Dashboard Setup Test
 * Setup test to fetch and store Digital Learning Dashboard data for teachers before ETL validation
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.setup.HoonuitTeacherDigitalLearningDashboardSetupTest
 *
 * This test fetches data from the Digital Learning Dashboard for teacher users
 * and stores it in the database for later validation after ETL runs.
 *
 * @author poojitha (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 21-07-2021
 * @jira TCM-65404
 */

import { test, expect, describe, beforeAll, afterAll, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';
import HoonuitStudentActivityPage from '../../shared/pages/essentials/digitallearning/HoonuitStudentActivityPage';
import { HoonuitStudentActivityDataWallPage } from '../../shared/pages/essentials/digitallearning/HoonuitStudentActivityDataWallPage';
import { HoonuitIntegrationUsers } from '../integration_validation_tests/users/HoonuitIntegrationUsers';
import { HoonuitTeacherDigitalLearningDashboardDataModel } from '../integration_validation_tests/testdatamodel/HoonuitTeacherDigitalLearningDashboardData';
import { DashboardTypes, dashboardTypesUtils } from '../../types';
import { DigitalLearningNavTabs } from '../../types';

// Test constants
const SCHOOL_FILTER = 'School';
const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';

/**
 * Test Suite: Digital Learning Dashboard - Setup Test - Teacher
 * Fetches and stores digital learning dashboard data for teacher ETL validation
 */
describe('Hoonuit Teacher Digital Learning Dashboard Setup Tests', () => {
    // Page objects
    let hoonuitStudentActivityPage: HoonuitStudentActivityPage;
    let studentActivityDataWallPage: HoonuitStudentActivityDataWallPage;
    
    // Test data
    let teacherDigitalLearningDashboardData: HoonuitTeacherDigitalLearningDashboardDataModel;

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
        studentActivityDataWallPage = new HoonuitStudentActivityDataWallPage(page);
        
        // Initialize test data object
        teacherDigitalLearningDashboardData = new HoonuitTeacherDigitalLearningDashboardDataModel();
        
        // Login to Hoonuit as Teacher
        await HoonuitHelper.loginToHoonuitAsTeacher(page, HoonuitIntegrationUsers.etlTeacher_User1);
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
     * TCM-65404: Digital Learning Dashboard - New data setup - Teacher
     * Fetches student activity and student activity data wall data
     * and stores it in the database for later ETL validation
     */
    test('TCM-65404', 'fetchInfoFromDigitalLearningDashboard', async ({ page }) => {
        // Navigate from Classroom > Student Activity (Teacher view uses CLASSROOM dashboard type)
        await HoonuitHelper.selectDashboard(
            page, 
            dashboardTypesUtils.getValue(DashboardTypes.CLASSROOM),
            DigitalLearningNavTabs.STUDENT_ACTIVITY
        );

        // Wait for page to load
        await hoonuitStudentActivityPage.waitForPage();

        // Apply school filter
        const filter = hoonuitStudentActivityPage.getFilter();
        await filter.selectFilterData({ [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE });

        // Fetch student activity dashboard data
        const studentsAccessingLmsTable = hoonuitStudentActivityPage.getAreStudentsAccessingTheLMSTable();
        const studentRecords = await studentsAccessingLmsTable.getAllRecords();
        
        expect(studentRecords.length).toBeGreaterThan(0);
        
        const studentTotalLoginCount = studentRecords[0].get('TOTAL # OF LOGINS') || '0';
        teacherDigitalLearningDashboardData.setStudentTotalLoginCount(studentTotalLoginCount);
        
        console.log(`Fetched Student Total Login Count: ${studentTotalLoginCount}`);

        // Navigate to Student Activity Data Wall
        await HoonuitHelper.clickSubNavTabLink(page, 'Student Activity Data Wall');
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

        teacherDigitalLearningDashboardData.setUihnMeetingStudentLoginCount(uihnMeetingStudentLoginCount);
        teacherDigitalLearningDashboardData.setUihnStudentLoginCount(uihnStudentLoginCount);
        
        console.log(`Fetched UIHN Meeting Student Login Count: ${uihnMeetingStudentLoginCount}`);
        console.log(`Fetched UIHN Student Login Count: ${uihnStudentLoginCount}`);

        // Add Data to DB For Next Run
        console.log('Saving Teacher Digital Learning Dashboard data to database...');
        await HoonuitEtlDataHelper.updateDatabase(teacherDigitalLearningDashboardData);
        console.log('Data saved successfully.');
    });
});