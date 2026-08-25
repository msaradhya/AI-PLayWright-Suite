/**
 * Hoonuit Withdrawn Data Validation Admin Test
 * Validates withdrawn data and program services in Hoonuit dashboards after ETL run as Admin
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitWithdrawnDataValidationAdminTest
 *
 * @author dinesh (original Java implementation)
 * @author aradhyas (converted to TypeScript/Playwright)
 * @since 30-10-2025
 * @jira TCM-65360
 */

import { test, expect, describe, beforeEach, afterEach, step } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitIntegrationUsers } from './users/HoonuitIntegrationUsers';
import { 
    HoonuitWithdrawnDataValidationDataModel
} from './testdatamodel/HoonuitWithdrawnDataValidationData';
import { HoonuitNewWithdrawalsPage } from '../../shared/pages/essentials/enrollment';
import { HoonuitProgramMembershipPage } from '../../shared/pages/essentials/enrollment';
import { DashboardTypes, EnrollmentNavTabs } from '../../types';

// Test suite for Withdrawn Data Validation Admin
describe('Hoonuit Withdrawn Data Validation Admin', () => {
    // Test data constants
    const SCHOOL_FILTER = HoonuitWithdrawnDataValidationDataModel.SCHOOL_FILTER;
    const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = HoonuitWithdrawnDataValidationDataModel.UIHN_AUTOMATION_SCHOOL_FILTER_VALUE;
    const YTD_WITHDRAWN_CARD_VALUE = HoonuitWithdrawnDataValidationDataModel.YTD_WITHDRAWN_CARD_VALUE;
    const HIGHEST_WITHDRAWALS_CHART_VALUE = HoonuitWithdrawnDataValidationDataModel.HIGHEST_WITHDRAWALS_CHART_VALUE;

    // Column constants
    const STUDENT_ID = HoonuitWithdrawnDataValidationDataModel.STUDENT_ID;
    const NAME = HoonuitWithdrawnDataValidationDataModel.NAME;
    const GRADE = HoonuitWithdrawnDataValidationDataModel.GRADE;
    const GENDER = HoonuitWithdrawnDataValidationDataModel.GENDER;
    const SPED = HoonuitWithdrawnDataValidationDataModel.SPED;
    const PROGRAM_GROUP = HoonuitWithdrawnDataValidationDataModel.PROGRAM_GROUP;
    const PROGRAM_NAME = HoonuitWithdrawnDataValidationDataModel.PROGRAM_NAME;
    const ELL = HoonuitWithdrawnDataValidationDataModel.ELL;
    const STATUS = HoonuitWithdrawnDataValidationDataModel.STATUS;
    const SCHOOL = HoonuitWithdrawnDataValidationDataModel.SCHOOL;

    // Page objects
    let hoonuitNewWithdrawalsPage: HoonuitNewWithdrawalsPage;
    let hoonuitProgramMembershipPage: HoonuitProgramMembershipPage;

    // Test data instance
    let withdrawnData: HoonuitWithdrawnDataValidationDataModel;

    // Setup before each test
    beforeEach(async ({ page }) => {
        hoonuitNewWithdrawalsPage = new HoonuitNewWithdrawalsPage(page);
        hoonuitProgramMembershipPage = new HoonuitProgramMembershipPage(page);

        // Create default test data
        withdrawnData = HoonuitWithdrawnDataValidationDataModel.createDefaultData();
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
     * Test: Verify Data In Hoonuit Dashboards As Admin
     * Validates withdrawn data and program services data in Hoonuit dashboards
     * @jira TCM-65360
     */
    test('TCM-65360', 'Verify Data In Hoonuit Dashboards As Admin', async ({ page }) => {
        // Login as ETL Admin user
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlAdmin_User1);

        // Navigate to Essentials > Enrollment > Withdrawals
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.ESSENTIALS,
            EnrollmentNavTabs.WITHDRAWALS
        );

        //await hoonuitNewWithdrawalsPage.waitForPage();

        // Apply school filter
        const schoolFilter: Record<string, string> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE
        };
        await page.pause();
        await hoonuitNewWithdrawalsPage.getFilter().selectFilterData(schoolFilter);

        // Validate YTD Withdrawn Card
        await step('Validate YTD Withdrawn Card', async () => {
            await page.pause();
            const ytdWithdrawnCardValue = await hoonuitNewWithdrawalsPage.getYtdWithdrawnCard().getValue();
            expect(
                ytdWithdrawnCardValue,
                'Incorrect YTD Withdrawn Card value'
            ).toBe(YTD_WITHDRAWN_CARD_VALUE);
        });

        // Validate Highest Number of Withdrawals Chart
        await step('Validate Highest Number of Withdrawals Chart', async () => {
            await page.pause();
            const chartValues = await hoonuitNewWithdrawalsPage.getHighestNumberOfWithdrawalsChart().getHorizontalBarChartValues();
            const schoolValue = chartValues.get(UIHN_AUTOMATION_SCHOOL_FILTER_VALUE);
            expect(
                schoolValue,
                `Incorrect value for UIHN Automation School in 'Which schools have the highest number of withdrawals' Chart`
            ).toBe(HIGHEST_WITHDRAWALS_CHART_VALUE);
        });

        // Navigate to Programs tab
        await HoonuitHelper.clickSubNavTabLink(page, EnrollmentNavTabs.PROGRAMS);
        await hoonuitProgramMembershipPage.waitForPage();

        // Validate Program Services Table
        await step('Validate Program Services Table', async () => {
            await page.pause();
            const programServicesTableRecords = await hoonuitProgramMembershipPage.getWhichStudentsAreReceivingProgramServicesTable().getAllRecords();
            const firstRecord = programServicesTableRecords[0];
            const expectedData = withdrawnData.getFirstProgramServicesRecord();

            expect(
                firstRecord.get(STUDENT_ID),
                'Student ID is different after applying filter'
            ).toBe(expectedData.studentID);

            expect(
                firstRecord.get(NAME),
                'Name is different after applying filter'
            ).toBe(expectedData.name);

            expect(
                firstRecord.get(GRADE),
                'Grade is different after applying filter'
            ).toBe(expectedData.grade);

            expect(
                firstRecord.get(GENDER),
                'Gender is different after applying filter'
            ).toBe(expectedData.gender);

            expect(
                firstRecord.get(ELL),
                'ELL is different after applying filter'
            ).toBe(expectedData.ell);

            expect(
                firstRecord.get(SPED),
                'SPED is different after applying filter'
            ).toBe(expectedData.sped);

            expect(
                firstRecord.get(SCHOOL),
                'School is different after applying filter'
            ).toBe(expectedData.school);

            expect(
                firstRecord.get(PROGRAM_GROUP),
                'Program Group is different after applying filter'
            ).toBe(expectedData.programGroup);

            expect(
                firstRecord.get(PROGRAM_NAME),
                'Program Name is different after applying filter'
            ).toBe(expectedData.programName);

            expect(
                firstRecord.get(STATUS),
                'Status is different after applying filter'
            ).toBe(expectedData.status);

            // Note: BeginDate and EndDate verification is not mandatory as discussed with Deva
        });
    });
});