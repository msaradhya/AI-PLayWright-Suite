/**
 * Hoonuit Teacher Digital Learning Dashboard Test
 * Validates digital learning data in Hoonuit dashboards after ETL run as a Teacher
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitTeacherDigitalLearningDashboardTest
 *
 * @author poojitha (original Java implementation)
 * @author aradhyas (converted to TypeScript/Playwright)
 * @since 30-10-2025
 * @jira TCM-65404
 */

import { test, expect, describe, beforeEach, afterEach, step } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitIntegrationUsers } from './users/HoonuitIntegrationUsers';
import { HoonuitTeacherDigitalLearningDashboardDataModel } from './testdatamodel/HoonuitTeacherDigitalLearningDashboardData';
import HoonuitStudentActivityPage from '../../shared/pages/classroom/digitallearning/HoonuitStudentActivityPage';
import HoonuitStudentActivityDataWallPage from '../../shared/pages/classroom/digitallearning/HoonuitStudentActivityDataWallPage';
import { DashboardTypes, DigitalLearningNavTabs } from '../../types';

// Test suite for Teacher Digital Learning Dashboard Validation
describe('Hoonuit Teacher Digital Learning Dashboard', () => {
    // Test data constants
    const SCHOOL_FILTER = HoonuitTeacherDigitalLearningDashboardDataModel.SCHOOL_FILTER;
    const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = HoonuitTeacherDigitalLearningDashboardDataModel.UIHN_AUTOMATION_SCHOOL_FILTER_VALUE;

    // Page objects
    let hoonuitStudentActivityPage: HoonuitStudentActivityPage;
    let studentActivityDataWallPage: HoonuitStudentActivityDataWallPage;

    // Test data instance
    let teacherDigitalLearningDashboardData: HoonuitTeacherDigitalLearningDashboardDataModel;

    // Setup before each test
    beforeEach(async ({ page }) => {
        hoonuitStudentActivityPage = new HoonuitStudentActivityPage(page);
        studentActivityDataWallPage = new HoonuitStudentActivityDataWallPage(page);

        // Create default test data (In Java, this comes from database via HoonuitEtlDataHelper)
        teacherDigitalLearningDashboardData = HoonuitTeacherDigitalLearningDashboardDataModel.createDefaultData();
    });

    // Cleanup after each test
    afterEach(async ({ page }) => {
        try {
            await HoonuitHelper.logout(page);
        } catch (error) {
            console.warn('Logout failed during cleanup:', error);
        }
    });

    /**
     * Test: Digital Learning Dashboard - New data validation - Teacher
     * Validates digital learning dashboard data for a teacher after ETL
     * @jira TCM-65404
     */
    test('TCM-65404', 'Validate Digital Learning Dashboard Data After ETL', async ({ page }) => {
        // Login as ETL Teacher user
        await HoonuitHelper.loginToHoonuitAsTeacher(page, HoonuitIntegrationUsers.etlTeacher_User1);

        // Navigate to Classroom > Digital Learning > Student Activity
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.CLASSROOM,
            DigitalLearningNavTabs.STUDENT_ACTIVITY
        );

        await hoonuitStudentActivityPage.waitForPage();

        // Apply school filter
        const schoolFilter: Record<string, string> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE
        };
        await hoonuitStudentActivityPage.getFilter().selectFilterData(schoolFilter);

        // Get students accessing LMS table records
        const studentsAccessingLmsTableRecords = await hoonuitStudentActivityPage.getStudentsAccessingLMSTable().getAllRecords();
        const studentsAccessingLmsTableRecord = studentsAccessingLmsTableRecords[0];
        const studentTotalLoginsStr = studentsAccessingLmsTableRecord.get('TOTAL # OF LOGINS') || '0';
        const studentTotalLogins = parseInt(studentTotalLoginsStr, 10);

        // Get current month
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const expectedBaseLoginCount = parseInt(teacherDigitalLearningDashboardData.getStudentTotalLoginCount(), 10);

        // Validate student total logins based on month
        await step('Validate Student Total Logins', async () => {
            if (currentMonth === 'JULY') {
                // For July, the count should equal the base value
                expect(
                    studentTotalLogins,
                    'TOTAL # OF LOGINS is not as expected for student in July'
                ).toBe(expectedBaseLoginCount);
            } else {
                // For other months, the count should be base + 6
                expect(
                    studentTotalLogins,
                    'TOTAL # OF LOGINS is not increased for student by 6 after ETL'
                ).toBe(expectedBaseLoginCount + 6);
            }
        });

        // Navigate to Student Activity Data Wall
        await HoonuitHelper.clickSubNavTabLink(page, 'Student Activity Data Wall');
        await studentActivityDataWallPage.waitForPage();

        // Get data wall table values
        const dataWallTable = studentActivityDataWallPage.getDataWallTable();
        const uihnMeetingStudentLoginStr = await dataWallTable.getCellValue('Name', 'UIHN Meeting 22-23, Student', 'Total Logins');
        const uihnStudentLoginStr = await dataWallTable.getCellValue('Name', 'UIHN Student1 22-23, Student1', 'Total Logins');
        
        const uihnMeetingStudentLogin = parseInt(uihnMeetingStudentLoginStr, 10);
        const uihnStudentLogin = parseInt(uihnStudentLoginStr, 10);

        // Expected base values
        const expectedMeetingStudentLoginCount = parseInt(teacherDigitalLearningDashboardData.getUihnMeetingStudentLoginCount(), 10);
        const expectedStudentLoginCount = parseInt(teacherDigitalLearningDashboardData.getUihnStudentLoginCount(), 10);

        // Validate student activity data wall dashboard data
        await step('Validate Student Activity Data Wall', async () => {
            if (currentMonth === 'JULY') {
                // For July, counts should equal the base values
                expect(
                    uihnMeetingStudentLogin,
                    'UIHN Meeting, Student total login count is not same for July month'
                ).toBe(expectedMeetingStudentLoginCount);

                expect(
                    uihnStudentLogin,
                    'UIHN Student1, Student1 total login count is not same for July month'
                ).toBe(expectedStudentLoginCount);
            } else {
                // For other months, counts should be base + 3
                expect(
                    uihnMeetingStudentLogin,
                    'UIHN Meeting, Student total login count is not increased by 3'
                ).toBe(expectedMeetingStudentLoginCount + 3);

                expect(
                    uihnStudentLogin,
                    'UIHN Student1, Student1 total login count is not increased by 3'
                ).toBe(expectedStudentLoginCount + 3);
            }
        });
    });
});