/**
 * Hoonuit Incident Behavior Action Validation Test
 * Validates behavior/incident dashboard data in Hoonuit dashboards after ETL run
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitIncidentBehaviorActionValidationTest
 *
 * @author dinesh (original Java implementation)
 * @author aradhyas (converted to TypeScript/Playwright)
 * @since 30-10-2025
 * @jira TCM-65402, TCM-65406
 */

import { test, expect, describe, beforeEach, afterEach, step } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitIntegrationUsers } from './users/HoonuitIntegrationUsers';
import { 
    HoonuitIncidentBehaviourActionData,
    HoonuitStudentEnrollmentToCourseData 
} from './testdatamodel/HoonuitIncidentBehaviourActionData';
import HoonuitMyStudentsOverviewPage from '../../shared/pages/classroom/mystudents/HoonuitMyStudentsOverviewPage';
import HoonuitBehaviourOverviewPage from '../../shared/pages/essentials/behaviour/HoonuitBehaviourOverviewPage';
import HoonuitSuspensionUsagePage from '../../shared/pages/essentials/behaviour/HoonuitSuspensionUsagePage';
import HoonuitSevereIncidentTrendsPage from '../../shared/pages/essentials/behaviour/HoonuitSevereIncidentTrendsPage';
import HoonuitIncidentAnalysisPage from '../../shared/pages/essentials/behaviour/HoonuitIncidentAnalysisPage';
import HoonuitEthnicityAnalysisPage from '../../shared/pages/essentials/behaviour/HoonuitEthnicityAnalysisPage';
import { 
    DashboardTypes, 
    BehaviorNavTabs, 
    MyStudentsNavTabs 
} from '../../types';

// Test suite for Incident Behavior Action Validation
describe('Hoonuit Incident Behavior Action Validation', () => {
    // Test data constants
    const SCHOOL_YEAR = HoonuitIncidentBehaviourActionData.SCHOOL_YEAR;
    const THEFT = HoonuitIncidentBehaviourActionData.THEFT;
    const SCHOOL_FILTER = HoonuitIncidentBehaviourActionData.SCHOOL_FILTER;
    const STAFF_FILTER = HoonuitIncidentBehaviourActionData.STAFF_FILTER;
    const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = HoonuitIncidentBehaviourActionData.UIHN_AUTOMATION_SCHOOL_FILTER_VALUE;
    const UIHN_TEACHER_FILTER_VALUE = HoonuitIncidentBehaviourActionData.UIHN_TEACHER_FILTER_VALUE;

    // Page objects
    let myStudentsOverviewPage: HoonuitMyStudentsOverviewPage;
    let behaviourOverviewPage: HoonuitBehaviourOverviewPage;
    let suspensionUsagePage: HoonuitSuspensionUsagePage;
    let severeIncidentsPage: HoonuitSevereIncidentTrendsPage;
    let incidentAnalysisPage: HoonuitIncidentAnalysisPage;
    let ethnicityAnalysisPage: HoonuitEthnicityAnalysisPage;

    // Test data instances
    let incidentBehaviourData: HoonuitIncidentBehaviourActionData;
    let enrollmentData: HoonuitStudentEnrollmentToCourseData;

    // Setup before each test
    beforeEach(async ({ page }) => {
        myStudentsOverviewPage = new HoonuitMyStudentsOverviewPage(page);
        behaviourOverviewPage = new HoonuitBehaviourOverviewPage(page);
        suspensionUsagePage = new HoonuitSuspensionUsagePage(page);
        severeIncidentsPage = new HoonuitSevereIncidentTrendsPage(page);
        incidentAnalysisPage = new HoonuitIncidentAnalysisPage(page);
        ethnicityAnalysisPage = new HoonuitEthnicityAnalysisPage(page);

        // Create default test data (In Java, this comes from database via HoonuitEtlDataHelper)
        incidentBehaviourData = HoonuitIncidentBehaviourActionData.createDefaultData();
        enrollmentData = HoonuitStudentEnrollmentToCourseData.createDefaultData();
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
     * Test: Verify Data In Hoonuit As Admin
     * As an Admin user, I should be able to validate newly created Behavior data after ETL
     * @jira TCM-65402
     */
    test('TCM-65402', 'Verify Data In Hoonuit As Admin', async ({ page }) => {
        // Login as ETL Behavior Admin user
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlBehaviorAdmin_User1);
        
        // Navigate to Essentials > Behavior > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.ESSENTIALS,
            BehaviorNavTabs.BEHAVIOR_OVERVIEW
        );
        
        // Wait for page to load - Spinner loading for long time (TODO from Java)
        await page.waitForTimeout(60000);
        await behaviourOverviewPage.waitForPage();
        
        // Apply school filter
        const schoolFilter: Record<string, string> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE[0]
        };
        await behaviourOverviewPage.getFilter().selectFilterData(schoolFilter);
        
        // Apply staff filter (multiple values)
        const staffFilter: Record<string, string[]> = {
            [STAFF_FILTER]: UIHN_TEACHER_FILTER_VALUE
        };
        await behaviourOverviewPage.getFilter().selectMultiFiltersData(staffFilter);
        
        // Validate What is the change in incidents by year Table data after ETL run
        await step('Validate Change In Incidents By Year Table', async () => {
            const changeInIncident = await behaviourOverviewPage.getChangeInIncidentByYearTable().getRecord(THEFT, SCHOOL_YEAR);
            expect(
                parseInt(changeInIncident),
                'Theft count is not increased by 1 after ETL run in What is the change in incidents by year Table'
            ).toBe(incidentBehaviourData.getTheftCount());
        });
        
        // Validate What is the change in action usage by year Table data after ETL run
        await step('Validate Change In Action Usage By Year Table', async () => {
            const changeInAction = await behaviourOverviewPage.getChangeInActionUsageYearTable().getRecord(
                HoonuitIncidentBehaviourActionData.SUSPENSION_IN_SCHOOL, 
                SCHOOL_YEAR
            );
            expect(
                parseInt(changeInAction),
                'Suspension - In School count is not increased by 1 after ETL run in What is the change in action usage by year Table'
            ).toBe(incidentBehaviourData.getSuspensionInSchoolCount());
        });
        
        // Navigate to Suspension Usage tab
        await HoonuitHelper.clickSubNavTabLink(page, BehaviorNavTabs.SUSPENSION_USAGE);
        await suspensionUsagePage.waitForPage();
        
        // Validate ISS Rate card
        await step('Validate ISS Rate Card', async () => {
            const issRateValue = await suspensionUsagePage.getISSRateCard().getValue();
            expect(issRateValue, 'Unexpected ISS rate value').toBe('100%');
        });
        
        // Validate Theft chart in suspension usage
        await step('Validate Theft Chart In Suspension Usage', async () => {
            const theftChartValues = await suspensionUsagePage.getTheftChart().getHorizontalBarChartValues();
            const theftValue = theftChartValues.get(SCHOOL_YEAR) || '0';
            expect(
                parseInt(theftValue),
                'Count is not increased by 1 after ETL run in How has the use of suspensions as a response changed over time Theft Chart'
            ).toBe(incidentBehaviourData.getSuspensionInSchoolCountInTheftChart());
        });
        
        // Navigate to Severe Incidents tab
        await HoonuitHelper.clickSubNavTabLink(page, BehaviorNavTabs.SEVERE_INCIDENTS);
        await severeIncidentsPage.waitForPage();
        
        // Note: The severe incidents chart validation is commented out in Java source
        // Validating Are we reducing the occurrence of severe incidents Theft Chart data after ETL run
        // (Commented out in original Java implementation)
        
        // Navigate to Analysis tab
        await HoonuitHelper.clickSubNavTabLink(page, BehaviorNavTabs.ANALYSIS);
        await incidentAnalysisPage.waitForPage();
        
        // Validate Incidents by School Chart data after ETL run
        await step('Validate Incidents By School Chart', async () => {
            const incidentBySchoolChartValues = await incidentAnalysisPage.getIncidentBySchoolChart().getVerticalBarChartValues();
            const schoolValue = incidentBySchoolChartValues.get(HoonuitIncidentBehaviourActionData.UIHN_AUTOMATION_SCHOOL) || '0';
            expect(
                parseInt(schoolValue),
                'Count is not increased by 1 after ETL run in Incidents by School Chart'
            ).toBe(incidentBehaviourData.getIncidentBySchoolChartCount());
        });
        
        // Navigate to Ethnicity Analysis tab
        await HoonuitHelper.clickSubNavTabLink(page, BehaviorNavTabs.ETHNICITY_ANALYSIS);
        await ethnicityAnalysisPage.waitForPage();
        
        // Clear staff filter
        await behaviourOverviewPage.getFilter().clear(...UIHN_TEACHER_FILTER_VALUE);
        
        // Validate Incidents by Ethnicity YTD Chart
        await step('Validate Incidents By Ethnicity YTD Chart', async () => {
            // Wait for tooltip data to load
            await page.waitForTimeout(60000);
            
            // Get chart values using the base class method
            const chartValues = await ethnicityAnalysisPage.getIncidentsByEthnicityYTDChart().getAnyChartValues();
            
            // Get the first entry's tooltip data
            const tooltipData = chartValues.values().next().value as string[] | undefined;
            
            if (tooltipData && tooltipData.length > 2) {
                // Extract student count from tooltip (index 1)
                const studentCountText = tooltipData[1] || '';
                const studentCount = studentCountText.replace(/\w+\s+\w+:\s*/, '');
                expect(
                    parseInt(studentCount),
                    'Student count is not increased by 1 after ETL run in Incidents by Ethnicity - YTD Chart'
                ).toBe(enrollmentData.getTotalCount());
                
                // Extract incident count from tooltip (index 2)
                const incidentCountText = tooltipData[2] || '';
                const incidentCount = incidentCountText.replace(/\w+\s+\w+:\s*/, '');
                expect(
                    parseInt(incidentCount),
                    'Incident count is not increased by 1 after ETL run in Incidents by Ethnicity - YTD Chart'
                ).toBe(incidentBehaviourData.getIncidentCount());
            }
        });
        
        // Navigate to Classroom > My Students > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.CLASSROOM,
            MyStudentsNavTabs.OVERVIEW
        );
        await myStudentsOverviewPage.waitForPage();
        
        // Apply combined filters
        const combinedFilter: Record<string, string[]> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE,
            [STAFF_FILTER]: UIHN_TEACHER_FILTER_VALUE
        };
        await myStudentsOverviewPage.getFilter().selectMultiFiltersData(combinedFilter);
        
        // Validate What are the most common referrals for my students Chart
        await step('Validate Most Common Referrals Chart', async () => {
            const referralsChart = myStudentsOverviewPage.getWhatAreTheMostCommonReferralsForMyStudentsChart();
            const chartValues = await referralsChart.getAnyChartValues();
            
            // Get the first entry's tooltip data
            const tooltipData = chartValues.values().next().value as string[] | undefined;
            
            if (tooltipData && tooltipData.length > 1) {
                // Extract incident count from tooltip
                const incidentText = tooltipData[1] || '';
                const incidentCount = incidentText.replace('● # Incidents: ', '');
                expect(
                    parseInt(incidentCount),
                    'Incidents count is not increased by 1 after ETL run in What are the most common referrals for my students Chart'
                ).toBe(incidentBehaviourData.getMostCommonReferralsForMyStudentsChartCount());
            }
        });
    });

    /**
     * Test: Verify Data In Hoonuit As Teacher
     * As a Teacher user, I should be able to validate newly created Behavior data after ETL
     * @jira TCM-65406
     */
    test('TCM-65406', 'Verify Data In Hoonuit As Teacher', async ({ page }) => {
        // Login as ETL Teacher user
        await HoonuitHelper.loginToHoonuitAsTeacher(page, HoonuitIntegrationUsers.etlTeacher_User1);
        
        // Navigate to Classroom > My Students > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.CLASSROOM,
            MyStudentsNavTabs.OVERVIEW
        );
        
        await myStudentsOverviewPage.waitForPage();
        
        // Apply combined filters
        const combinedFilter: Record<string, string[]> = {
            [SCHOOL_FILTER]: UIHN_AUTOMATION_SCHOOL_FILTER_VALUE,
            [STAFF_FILTER]: UIHN_TEACHER_FILTER_VALUE
        };
        await myStudentsOverviewPage.getFilter().selectMultiFiltersData(combinedFilter);
        
        // Validate What are the most common referrals for my students Chart
        await step('Validate Most Common Referrals Chart As Teacher', async () => {
            const referralsChart = myStudentsOverviewPage.getWhatAreTheMostCommonReferralsForMyStudentsChart();
            const chartValues = await referralsChart.getAnyChartValues();
            
            // Get the first entry's tooltip data
            const tooltipData = chartValues.values().next().value as string[] | undefined;
            
            if (tooltipData && tooltipData.length > 1) {
                // Extract incident count from tooltip
                const incidentText = tooltipData[1] || '';
                const incidentCount = incidentText.replace('● # Incidents: ', '');
                expect(
                    parseInt(incidentCount),
                    'Incidents count is not increased by 1 after ETL run in What are the most common referrals for my students Chart'
                ).toBe(incidentBehaviourData.getMostCommonReferralsForMyStudentsChartCount());
            }
        });
    });
});