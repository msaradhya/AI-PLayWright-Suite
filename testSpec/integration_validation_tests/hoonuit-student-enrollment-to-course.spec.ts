/**
 * Hoonuit Student Enrollment To Course Test
 * Validates enrollment data in Hoonuit dashboards after ETL run
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitStudentEnrollmentToCourseTest
 *
 * @author amittiwari (original Java implementation)
 * @author aradhyas (converted to TypeScript/Playwright)
 * @since 30-10-2025
 * @jira TCM-65359, TCM-65407, TCM-65361
 */

import { test, expect, describe, beforeEach, afterEach, step } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitIntegrationUsers } from './users/HoonuitIntegrationUsers';
import { HoonuitStudentEnrollmentToCourseDataModel } from './testdatamodel/HoonuitStudentEnrollmentToCourseData';
import { HoonuitEnrollmentOverviewPage } from '../../shared/pages/essentials/enrollment/HoonuitEnrollmentOverviewPage';
import { HoonuitNewAdmissionsPage } from '../../shared/pages/essentials/enrollment/HoonuitNewAdmissionsPage';
import HoonuitMyStudentsOverviewPage from '../../shared/pages/classroom/mystudents/HoonuitMyStudentsOverviewPage';
import { DashboardTypes, EnrollmentNavTabs, MyStudentsNavTabs } from '../../types';

// Test suite for Student Enrollment To Course Validation
describe('Hoonuit Student Enrollment To Course', () => {
    // Test data constants
    const SCHOOL_FILTER = HoonuitStudentEnrollmentToCourseDataModel.SCHOOL_FILTER;
    const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = HoonuitStudentEnrollmentToCourseDataModel.UIHN_AUTOMATION_SCHOOL_FILTER_VALUE;

    // Page objects
    let enrollmentOverviewPage: HoonuitEnrollmentOverviewPage;
    let newAdmissionsPage: HoonuitNewAdmissionsPage;
    let myStudentsOverviewPage: HoonuitMyStudentsOverviewPage;

    // Test data instance
    let enrollmentData: HoonuitStudentEnrollmentToCourseDataModel;

    // Setup before each test
    beforeEach(async ({ page }) => {
        enrollmentOverviewPage = new HoonuitEnrollmentOverviewPage(page);
        newAdmissionsPage = new HoonuitNewAdmissionsPage(page);
        myStudentsOverviewPage = new HoonuitMyStudentsOverviewPage(page);

        // Create default test data (In Java, this comes from database via HoonuitEtlDataHelper)
        enrollmentData = HoonuitStudentEnrollmentToCourseDataModel.createDefaultData();
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
     * Test: New Enrollment Data After ETL
     * As Admin user, I should be able to validate new enrollment data after ETL
     * @jira TCM-65359
     */
    test('TCM-65359', 'Test New Enrollment Data After ETL', async ({ page }) => {
        // Login as ETL Admin user
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlAdmin_User1);
        
        // Navigate to Essentials > Enrollment > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.ESSENTIALS,
            EnrollmentNavTabs.ENROLLMENT_OVERVIEW
        );
        
        await enrollmentOverviewPage.waitForPage();
        
        // Apply school filter
        const schoolFilter: Record<string, string> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE
        };
        await enrollmentOverviewPage.getFilter().selectFilterData(schoolFilter);
        
        // Get enrollment information
        const enrollmentInformation = await enrollmentOverviewPage.getEnrollmentInformationTable().getEnrollmentInformation();
        
        // Validate total value is increased after ETL run
        await step('Validate Total Enrollment Value', async () => {
            expect(
                enrollmentInformation['Total'],
                'Total value is not increased by 1 after ETL run'
            ).toBe(String(enrollmentData.getTotalCount()));
        });
    });

    /**
     * Test: Enrollment Change After ETL As A Teacher
     * As a Teacher I should be able to validate Enrollment change after ETL
     * @jira TCM-65407
     */
    test('TCM-65407', 'Test Enrollment Change After ETL As A Teacher', async ({ page }) => {
        // Login as ETL Teacher user
        await HoonuitHelper.loginToHoonuitAsTeacher(page, HoonuitIntegrationUsers.etlTeacher_User1);
        
        // Navigate to Classroom > My Students > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.CLASSROOM,
            MyStudentsNavTabs.OVERVIEW
        );
        
        await myStudentsOverviewPage.waitForPage();
        
        // Apply school filter
        const schoolFilter: Record<string, string> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE
        };
        await myStudentsOverviewPage.getFilter().selectFilterData(schoolFilter);
        
        // Disable all legends except "Female"
        await myStudentsOverviewPage.getDemographicsInMyClassroomChart().disableAllLegendsExcept('Female');
        
        // Validate Female count in demographics chart
        await step('Validate Female Count In Demographics Chart', async () => {
            const chartValues = await myStudentsOverviewPage.getDemographicsInMyClassroomChart().getVerticalBarChartValues();
            const values = Array.from(chartValues.values());
            expect(
                values.includes(String(enrollmentData.getFemaleCount())),
                'Female count is not increased by 1 after ETL run'
            ).toBe(true);
        });
        
        // Validate ELL chart value
        await step('Validate ELL Chart Value', async () => {
            const specialProgramsChartValues = await myStudentsOverviewPage.getWhichStudentsAreInSpecialProgramsChart().getHorizontalBarChartValues();
            const ellValue = specialProgramsChartValues.get('English-Language Learner (ELL)');
            expect(
                ellValue,
                'English-Language Learner (ELL) chart value is different'
            ).toBe(String(enrollmentData.getEllCount()));
        });
    });

    /**
     * Test: New Admission Data After ETL
     * As a Admin user, I should be able to validate new admission data after ETL
     * @jira TCM-65361
     */
    test('TCM-65361', 'Test New Admission Data After ETL', async ({ page }) => {
        // Login as ETL Admin user
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlAdmin_User1);
        
        // Navigate to Essentials > Enrollment > Admissions
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.ESSENTIALS,
            EnrollmentNavTabs.ADMISSIONS
        );
        
        await newAdmissionsPage.waitForPage();
        
        // Apply school filter
        const schoolFilter: Record<string, string> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE
        };
        await newAdmissionsPage.getFilter().selectFilterData(schoolFilter);
        
        // Validate YTD New Admission card
        await step('Validate YTD New Admission Card', async () => {
            const ytdNewAdmissionValue = await newAdmissionsPage.getYtdNewAdmissionCard().getValue();
            expect(
                ytdNewAdmissionValue,
                'YTD New Admission card value is different'
            ).toBe(String(enrollmentData.getYtdNewAdmissions()));
        });
        
        // Validate Schools with most new students chart
        await step('Validate Schools With Most New Students Chart', async () => {
            const chartValues = await newAdmissionsPage.getSchoolsWithMostNewStudentChart().getHorizontalBarChartValues();
            const schoolValue = chartValues.get(UIHN_AUTOMATION_SCHOOL_FILTER_VALUE);
            expect(
                schoolValue,
                'School with most new student chart value is different for UIHN Automation School'
            ).toBe(String(enrollmentData.getYtdNewAdmissions()));
        });
    });
});