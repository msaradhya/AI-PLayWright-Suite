/**
 * Hoonuit DA Validates Academics Dashboard Setup Test
 * Setup test to configure and store Academics Dashboard data before ETL validation
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.setup.HoonuitDAValidatesAcademicsDashboardSetupTest
 *
 * This test sets student grades and fetches validation data for later ETL validation.
 *
 * @author payal prajapati (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 06/07/21
 * @jira TCM-65415
 */

import { test, expect, describe, beforeAll, afterAll, beforeEach } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';
import { SISHelper, Schools } from '../../shared/helpers/SISHelper';
import { SISIntegrationUsers } from './users/SISIntegrationUsers';
import { HoonuitIntegrationUsers } from '../integration_validation_tests/users/HoonuitIntegrationUsers';
import { 
    HoonuitDAValidatesAcademicsDashboardData 
} from '../integration_validation_tests/testdatamodel/HoonuitDAValidatesAcademicsDashboardData';
import HoonuitAdvancedPlacementPage from '../../shared/pages/essentials/academics/HoonuitAdvancedPlacementPage';

// Test constants
const SCHOOL_FILTER = 'School';
const UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';
const STUDENT = 'UIHN Student1 22-23, Student1';
const COURSE_NAME = 'AP German I';
const GRADE_F = 'F';
const GRADE_D = 'D';

/**
 * Test Suite: DA Validates Academics Dashboard - Setup Test
 * Sets up student grades and fetches validation data for ETL testing
 */
describe('Hoonuit DA Validates Academics Dashboard Setup Tests', () => {
    // Test data
    let academicsTestData: HoonuitDAValidatesAcademicsDashboardData;
    let existingGrade: string;
    let alteredGrade: string;

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

    beforeEach(async () => {
        // Initialize test data object
        academicsTestData = new HoonuitDAValidatesAcademicsDashboardData();
    });

    /**
     * TCM-65415: Set Student Grade (Setup Step 1)
     * As a District admin user, sets up student grade for ETL validation
     */
    test('TCM-65415-1', 'setStudentGrade', async ({ page }) => {
        // Login to SIS as ACA Admin
        await SISHelper.startAdminTest(page, SISIntegrationUsers.etlACAAdmin_User1);
        await SISHelper.setSchool(page, Schools.UIHN_AUTOMATION_SCHOOL);
        await SISHelper.setTerm(page, 3200);

        // Search for student
        await page.fill('#studentSearchInput, input[name="studentSearch"]', STUDENT);
        await page.press('#studentSearchInput, input[name="studentSearch"]', 'Enter');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Click on the first student result
        const studentResult = page.locator('.student-search-result, .search-result').first();
        if (await studentResult.isVisible()) {
            await studentResult.click();
        }

        // Navigate to Historical Grades
        await page.click('text="Historical Grades", a:has-text("Historical Grades")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Get existing grade for the course
        const gradeCell = page.locator(`tr:has-text("${COURSE_NAME}") .grade-value, [data-course="${COURSE_NAME}"] .grade`);
        existingGrade = await gradeCell.textContent() || GRADE_F;
        existingGrade = existingGrade.trim();

        // Determine altered grade (toggle between F and D)
        alteredGrade = existingGrade === GRADE_F ? GRADE_D : GRADE_F;

        // Click on the grade to edit
        await gradeCell.click();
        await page.waitForSelector('.edit-grade-form, #editStoredGrade', { timeout: 10000 });

        // Set the new grade
        await page.fill('#gradeInput, input[name="grade"]', alteredGrade);
        
        // Submit the form
        await SISHelper.submitPage(page);
        await SISHelper.waitForChangesRecordedPage(page);

        // Verify feedback message
        const feedbackText = await SISHelper.getFeedbackConfirmText(page);
        expect(feedbackText).toContain('The changes have been recorded');

        // Store the expected grade
        academicsTestData.setExpectedGrade(alteredGrade);

        console.log(`Grade changed from ${existingGrade} to ${alteredGrade}`);

        // Logout from admin
        await SISHelper.logoffAdmin(page);
    });

    /**
     * TCM-65415: Get Validation Data (Setup Step 2)
     * Fetches AP courses count and stores validation data
     */
    test('TCM-65415-2', 'getValidationData', async ({ page }) => {
        // Login to Hoonuit as Administrator
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlAcaAdmin_User1);

        // Initialize Advanced Placement page
        const advancedPlacementPage = new HoonuitAdvancedPlacementPage(page);

        // Set AP courses taken count (hardcoded value from original Java test)
        academicsTestData.setApCoursesTakenCount(parseInt('121'));

        // Clear all filters
        await advancedPlacementPage.getFilter().clearAll();

        // Logout from Hoonuit
        await HoonuitHelper.logout(page);

        // Add Data to DB For Next Run
        console.log('Saving Academics Dashboard data to database...');
        await HoonuitEtlDataHelper.updateDatabase(academicsTestData);
        console.log('Data saved successfully.');
    });
});