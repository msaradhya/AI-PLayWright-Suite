/**
 * Hoonuit Incident Behavior Action Setup Test
 * Setup test to create incident behavior data before ETL validation
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.setup.HoonuitIncidentBehaviorActionSetupTest
 *
 * This test creates incident behavior data for later ETL validation.
 *
 * @author dinesh (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 29/06/21
 * @jira TCM-65402
 */

import { test, expect, describe, beforeAll, afterAll, beforeEach } from '../../fixtures/test-wrapper';
import { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';
import { SISHelper, Schools } from '../../shared/helpers/SISHelper';
import { SISIntegrationUsers } from './users/SISIntegrationUsers';
import { 
    HoonuitIncidentBehaviourActionData 
} from '../integration_validation_tests/testdatamodel/HoonuitIncidentBehaviourActionData';
import { DateTimeHelper } from '../../shared/helpers/DateTimeHelper';
import { RandomNumbers } from '../../shared/helpers/RandomNumbers';

// Test constants
const THEFT = 'Theft';
const INCIDENT_TITLE = `UIHN Student Incident ${RandomNumbers.getRandomInteger(3)}`;
const STUDENT_NAME = 'UIHN Student1 22-23, Student1';

/**
 * Test Suite: Incident Behavior Action - Setup Test
 * Creates incident behavior data for ETL testing
 */
describe('Hoonuit Incident Behavior Action Setup Tests', () => {
    // Test data
    let hoonuitIncidentBehaviourActionData: HoonuitIncidentBehaviourActionData;
    let todayDateInPST: string;

    beforeAll(async () => {
        // Initialize database connection
        console.log('Initializing database connection for ETL data...');
        await HoonuitEtlDataHelper.initialize();
        
        // Get current date in PST timezone
        todayDateInPST = DateTimeHelper.getCurrentDateAsPerGivenTimeZoneAndFormat('MM/dd/yyyy', 'PST');
    });

    afterAll(async () => {
        // Cleanup database connections
        console.log('Cleaning up database connections...');
        await HoonuitEtlDataHelper.cleanup();
    });

    beforeEach(async () => {
        // Initialize test data object
        hoonuitIncidentBehaviourActionData = new HoonuitIncidentBehaviourActionData();
    });

    /**
     * TCM-65402: Incident Behavior Action Setup Test
     * As an Admin user, creates Behavior data before ETL
     */
    test('TCM-65402', 'incidentBehaviorActionSetupTest', async ({ page }) => {
        // Login to SIS as Behavior Admin
        await SISHelper.startAdminTest(page, SISIntegrationUsers.etlBehaviorAdmin_User1);
        await SISHelper.setSchool(page, Schools.UIHN_AUTOMATION_SCHOOL);
        await SISHelper.setTerm(page, 3200);

        // Search for student
        await page.fill('#studentSearchInput, input[name="studentSearch"]', STUDENT_NAME);
        await page.press('#studentSearchInput, input[name="studentSearch"]', 'Enter');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Select the first student result
        const studentResult = page.locator('.student-search-result, .search-result').first();
        if (await studentResult.isVisible()) {
            await studentResult.click();
        }

        // Navigate to Incidents page
        await page.click('text="Incidents", a:has-text("Incidents")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Click Create Quick Incident
        await page.click('text="Create Quick Incident", button:has-text("Create Quick Incident")');
        await page.waitForSelector('.incident-widget, #incidentWidget', { timeout: 10000 });

        // Fill incident details - Step 1
        await page.fill('#incidentTitle, input[name="title"]', INCIDENT_TITLE);
        
        // Select Incident Type
        await page.selectOption('#incidentType, select[name="incidentType"]', 'Report to State');
        
        // Select Time Frame
        await page.selectOption('#timeFrame, select[name="timeFrame"]', 'During School');
        
        // Select Location Code
        await page.selectOption('#locationCode, select[name="locationCode"]', 'Cafeteria');
        
        // Click Next to go to behavior step
        await page.click('text="Next", button:has-text("Next")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Fill behavior details - Step 2
        // Select Behavior for Participant 1
        const behaviorSelect = page.locator('.behavior-select, select[name*="behavior"]').first();
        await behaviorSelect.selectOption(THEFT);

        // Set Primary Behavior Flag (false)
        const primaryBehaviorCheckbox = page.locator('input[name*="primaryBehavior"]').first();
        if (await primaryBehaviorCheckbox.isChecked()) {
            await primaryBehaviorCheckbox.uncheck();
        }

        // Set Allegation Flag (false)
        const allegationCheckbox = page.locator('input[name*="allegation"]').first();
        if (await allegationCheckbox.isChecked()) {
            await allegationCheckbox.uncheck();
        }

        // Add Action to Behavior
        const actionSelect = page.locator('.action-select, select[name*="action"]').first();
        await actionSelect.selectOption('Suspension');

        // Set Action Begin Date
        await page.fill('input[name*="actionBeginDate"]', todayDateInPST);

        // Set Action End Date
        await page.fill('input[name*="actionEndDate"]', todayDateInPST);

        // Click Save
        await page.click('text="Save", button:has-text("Save")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Submit the incident form
        await page.click('#btnSubmit, button[type="submit"]');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Navigate back to Incidents page to get count
        await page.click('text="Incidents", a:has-text("Incidents")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Get incident count from label
        const incidentCountLabel = page.locator('.incident-count, .count-label');
        const countText = await incidentCountLabel.textContent() || '1';
        const theftCount = parseInt(countText.replace(/\D/g, '')) || 1;

        // Set all the data model values
        hoonuitIncidentBehaviourActionData.setIncidentBySchoolChartCount(theftCount);
        hoonuitIncidentBehaviourActionData.setIncidentCount(theftCount);
        hoonuitIncidentBehaviourActionData.setMostCommonReferralsForMyStudentsChartCount(theftCount);
        hoonuitIncidentBehaviourActionData.setStudentCount(1);
        hoonuitIncidentBehaviourActionData.setSuspensionInSchoolCount(theftCount);
        hoonuitIncidentBehaviourActionData.setTheftCount(theftCount);
        hoonuitIncidentBehaviourActionData.setSevereIncidentsCountInTheftChart(theftCount);
        hoonuitIncidentBehaviourActionData.setSuspensionInSchoolCountInTheftChart(theftCount);

        console.log(`Created incident with theft count: ${theftCount}`);

        // Add Data to DB For Next Run
        console.log('Saving Incident Behavior Action data to database...');
        await HoonuitEtlDataHelper.updateDatabase(hoonuitIncidentBehaviourActionData);
        console.log('Data saved successfully.');

        // Logout from admin
        await SISHelper.logoffAdmin(page);
    });
});