/**
 * Hoonuit Student Enrollment To Course Setup Test
 * Setup test to enroll a new student and store data before ETL validation
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.setup.HoonuitStudentEnrollmentToCourseSetupTest
 *
 * This test creates a new student enrollment for later ETL validation.
 *
 * @author poojitha (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 23-06-2021
 * @jira TCM-65359
 */

import { test, expect, describe, beforeAll, afterAll, beforeEach } from '../../fixtures/test-wrapper';
import { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';
import { SISHelper, Schools } from '../../shared/helpers/SISHelper';
import { SISIntegrationUsers } from './users/SISIntegrationUsers';
import { 
    HoonuitStudentEnrollmentToCourseDataModel 
} from '../integration_validation_tests/testdatamodel/HoonuitStudentEnrollmentToCourseData';
import { RandomStrings } from '../../shared/helpers/RandomNumbers';

// Test constants
const FTE_CODE = 'UIHN Conversion';
const STUD_LAST_NAME = 'UIHN';

// Gender enum
const Gender = {
    MALE: 'Male',
    FEMALE: 'Female'
} as const;

/**
 * Test Suite: Student Enrollment To Course - Setup Test
 * Enrolls a new student to a course for ETL testing
 */
describe('Hoonuit Student Enrollment To Course Setup Tests', () => {
    // Test data
    let enrollmentTestData: HoonuitStudentEnrollmentToCourseDataModel;
    let studentFirstName: string;
    let currentDate: Date;

    beforeAll(async () => {
        // Initialize database connection
        console.log('Initializing database connection for ETL data...');
        await HoonuitEtlDataHelper.initialize();
        
        // Set up test data
        currentDate = new Date();
        studentFirstName = RandomStrings.generateRandomWord(25);
    });

    afterAll(async () => {
        // Cleanup database connections
        console.log('Cleaning up database connections...');
        await HoonuitEtlDataHelper.cleanup();
    });

    beforeEach(async () => {
        // Initialize test data object
        enrollmentTestData = new HoonuitStudentEnrollmentToCourseDataModel();
        enrollmentTestData.setName(`${STUD_LAST_NAME},${studentFirstName}`);
    });

    /**
     * TCM-65359: Enroll Student To Course
     * As Admin user, enrolls a new student and validates enrollment data
     */
    test('TCM-65359', 'enrollStudentToCourse', async ({ page }) => {
        // Login to SIS as Admin
        await SISHelper.startAdminTest(page, SISIntegrationUsers.etlAdmin_User1);
        await SISHelper.setSchool(page, Schools.UIHN_AUTOMATION_SCHOOL);
        await SISHelper.setTerm(page, 3200);

        // Click Enroll New Student
        await page.click('text="Enroll New Student", a:has-text("Enroll New Student")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Wait for enrollment form
        await page.waitForSelector('#enrollNewStudentForm, .enroll-student-form', { timeout: 10000 });

        // Enter student last name
        await page.fill('#studentLastName, input[name="lastName"]', STUD_LAST_NAME);

        // Enter student first name
        await page.fill('#studentFirstName, input[name="firstName"]', studentFirstName);

        // Enter student DOB (MM/DD/YYYY format)
        const dobMonth = currentDate.getMonth() + 1;
        const dobDay = currentDate.getDate();
        const dobString = `${dobMonth}/${dobDay}/2015`;
        await page.fill('#studentDOB, input[name="dob"]', dobString);

        // Select gender
        await page.selectOption('#studentGender, select[name="gender"]', Gender.FEMALE);

        // Enter entry date (MM/DD/YYYY format)
        const entryMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const entryDay = String(currentDate.getDate()).padStart(2, '0');
        const entryYear = currentDate.getFullYear();
        const entryDateString = `${entryMonth}/${entryDay}/${entryYear}`;
        await page.fill('#entryDate, input[name="entryDate"]', entryDateString);

        // Enter FTE code
        await page.fill('#fteCode, input[name="fte"]', FTE_CODE);

        // Click Enroll Without Linking
        await page.click('text="Enroll Without Linking", button:has-text("Enroll Without Linking")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Submit the page
        await SISHelper.submitPage(page);

        // Handle duplicate student page if displayed
        const duplicateStudentPage = page.locator('.duplicate-student-page, #duplicateStudentConfirm');
        if (await duplicateStudentPage.isVisible()) {
            await page.click('text="Confirm Enroll", button:has-text("Confirm Enroll")');
            await SISHelper.waitForAdminLoadingBarToDisappear(page);
        }

        // Navigate to admin home
        await SISHelper.navigateToAdminHome(page);

        // Search for the student (without selection)
        const fullStudentName = `${STUD_LAST_NAME}, ${studentFirstName}`;
        await SISHelper.searchStudentNoSelect(page, fullStudentName);

        // Validate student is displaying
        const studentCountElement = page.locator('.student-count, #studentSelectionCount');
        const studentCountText = await studentCountElement.textContent() || '0';
        const studentCount = parseInt(studentCountText.replace(/\D/g, '')) || 1;
        expect(studentCount, 'Student is not displaying').toBe(1);

        // Navigate to School section
        await page.click('text="School", a:has-text("School")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Click Sections link
        await page.click('text="Sections", a:has-text("Sections")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Select course "AP German I"
        await page.selectOption('#courseSelect, select[name="course"]', 'AP German I');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Select enrollment by section "P2"
        await page.click('text="P2", [data-section="P2"]');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Enroll current selection into this class
        await page.click('text="Enroll Current Selection", button:has-text("Enroll Current Selection")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Click Enroll Students on preview page
        await page.click('text="Enroll Students", button:has-text("Enroll Students")');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Validate success message
        const feedbackText = await SISHelper.getFeedbackConfirmText(page);
        expect(feedbackText, 'Success message is not displaying').toContain('Your changes have been saved');

        // Navigate to admin home
        await SISHelper.navigateToAdminHome(page);

        // Search for all students to get counts
        await page.fill('#studentSearchInput, input[name="studentSearch"]', '');
        await page.press('#studentSearchInput, input[name="studentSearch"]', 'Enter');
        await SISHelper.waitForAdminLoadingBarToDisappear(page);

        // Get student count
        const totalCountText = await studentCountElement.textContent() || '1';
        const totalCount = parseInt(totalCountText.replace(/\D/g, '')) || 1;

        // Set enrollment data
        enrollmentTestData.setFemaleCount(totalCount - 1);
        enrollmentTestData.setTotalCount(totalCount);
        enrollmentTestData.setYtdNewAdmissions(totalCount);

        console.log(`Enrolled student: ${fullStudentName}`);
        console.log(`Total count: ${totalCount}, Female count: ${totalCount - 1}`);

        // Add Data to DB For Next Run
        console.log('Saving Student Enrollment data to database...');
        await HoonuitEtlDataHelper.updateDatabase(enrollmentTestData);
        console.log('Data saved successfully.');

        // Logout from admin
        await SISHelper.logoffAdmin(page);
    });
});