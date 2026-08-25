/**
 * Teacher Workflows Test
 * Test for teacher workflows including creating assignments, assessments, discussions, pages, and media albums
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.setup.TeacherWorkFlowsTest
 *
 * @author Shamsh hyder (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 18-04-2022
 */

import { test, expect, describe, beforeAll } from '../../fixtures/test-wrapper';
import { Page } from '@playwright/test';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { RandomNumbers } from '../../shared/helpers/RandomNumbers';

// Test constants
const assignment = `auto_assignment_${RandomNumbers.getRandomAlphanumeric(10)}`;
const assessment = `auto_assessment_${RandomNumbers.getRandomAlphanumeric(10)}`;
const discussion = `auto_discussion_${RandomNumbers.getRandomAlphanumeric(10)}`;
const pageName = `auto_page_${RandomNumbers.getRandomAlphanumeric(10)}`;
const media = `auto_media_${RandomNumbers.getRandomAlphanumeric(10)}`;

// Excel file path
const EXCEL_FILE = 'uploads/LoadTest_new.xlsx';

/**
 * Interface for Excel test data
 */
interface TestUserData {
    userName: string;
    password: string;
    school: string;
    course: string;
    section: string;
}

/**
 * Helper class for reading Excel files
 */
class ExcelHelper {
    private workbook: XLSX.WorkBook | null = null;

    /**
     * Load Excel file
     * @param filePath - Path to Excel file
     */
    async loadExcelFile(filePath: string): Promise<void> {
        const absolutePath = path.resolve(__dirname, '../../shared/resources', filePath);
        if (fs.existsSync(absolutePath)) {
            this.workbook = XLSX.readFile(absolutePath);
        } else {
            console.warn(`Excel file not found: ${absolutePath}`);
            this.workbook = null;
        }
    }

    /**
     * Get data from Excel sheet
     * @param sheetName - Name of the sheet
     * @returns Array of test user data
     */
    getSheetData(sheetName: string): TestUserData[] {
        if (!this.workbook) {
            console.warn('Workbook not loaded');
            return [];
        }

        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) {
            console.warn(`Sheet not found: ${sheetName}`);
            return [];
        }

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
        const users: TestUserData[] = [];

        // Skip header row
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row && row.length >= 5) {
                users.push({
                    userName: row[0] || '',
                    password: row[1] || '',
                    school: row[2] || '',
                    course: row[3] || '',
                    section: row[4] || ''
                });
            }
        }

        return users;
    }
}

/**
 * Test Suite: Teacher Workflows
 * Creates assignments, assessments, discussions, pages, and media albums
 */
describe('Teacher Workflows Tests', () => {
    const excelHelper = new ExcelHelper();

    beforeAll(async () => {
        // Load Excel file
        await excelHelper.loadExcelFile(EXCEL_FILE);
    });

    /**
     * Helper: Login to Schoology
     */
    async function loginToSchoology(page: Page, userName: string, password: string, school: string): Promise<void> {
        await page.goto('https://app.schoologytest.com/');
        
        // Enter username
        await page.fill('#edit-mail', userName);
        await page.waitForTimeout(2000);
        
        // Enter password
        await page.fill('#edit-pass', password);
        await page.waitForTimeout(2000);
        
        // Enter school
        await page.fill('#edit-school', school);
        await page.waitForTimeout(2000);
        
        // Click on school suggestion
        await page.click('.school-name');
        
        // Remember school
        await page.click('#remember-school');
        
        // Submit login
        await page.click('#edit-submit');
        await page.waitForTimeout(2000);
    }

    /**
     * Helper: Select course
     */
    async function selectCourse(page: Page, section: string, course: string, school: string): Promise<void> {
        await page.waitForTimeout(2000);
        
        // Wait for course options to load
        let retries = 10;
        while (retries > 0) {
            const options = await page.locator('[class*="_36sHx"]').all();
            if (options.length > 1) break;
            await page.waitForTimeout(500);
            retries--;
        }

        // Find and click the matching course
        const options = await page.locator('[class*="_36sHx"]').all();
        for (const option of options) {
            const text = await option.textContent() || '';
            if (text.includes(section) && text.includes(course) && text.includes(school)) {
                await option.click();
                break;
            }
        }
    }

    /**
     * Helper: Handle popup if present
     */
    async function handlePopup(page: Page): Promise<void> {
        const popup = page.locator("div[class*='_pendo-step-container-styles']");
        if (await popup.isVisible()) {
            await page.click('#pendo-button-8d83923a');
        }
    }

    /**
     * Helper: Create assignment
     */
    async function createAssignment(page: Page): Promise<void> {
        // Click Add Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'Add Materials' }).click();
        await page.waitForTimeout(2000);
        
        // Click create assignment
        await page.click('.action-create-assignment');
        await page.waitForTimeout(2000);
        
        // Enter title
        await page.fill('#edit-title', assignment);
        
        // Select grading category
        await page.selectOption('#edit-grading-category-id', { label: 'e.g. Homework' });
        
        // Submit
        await page.click('#edit-submit');
    }

    /**
     * Helper: Create assessment
     */
    async function createAssessment(page: Page): Promise<void> {
        // Click Add Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'Add Materials' }).click();
        
        // Click create assessment
        await page.click('.action-create-assessment-v2');
        
        // Enter title
        await page.fill('#edit-title', assessment);
        
        // Select availability type
        await page.selectOption('#edit-availability-type', { label: 'Enable' });
        
        // Select grading category
        await page.selectOption('#edit-grading-category-id', { label: 'e.g. Homework' });
        
        // Submit
        await page.click('#edit-submit');
        await page.waitForTimeout(2000);
        
        // Save
        await page.locator("[class*='save btn']").scrollIntoViewIfNeeded();
        await page.locator("[class*='save btn']").click();
        await page.waitForTimeout(2000);
        
        // Click Questions tab
        await page.locator('._2mytC').filter({ hasText: 'Questions' }).click();
        
        // Add Fill in the Blank question
        await page.locator('.ltq-add-content-sidebar__link').filter({ hasText: 'Fill in the Blank Text' }).click();
        await page.waitForTimeout(5000);
        
        // Enter question text
        await page.locator("[class*='cke_textarea_inline cke_editable']").fill('How are you_');
        await page.waitForTimeout(2000);
        
        // Enter answer
        await page.locator('.lrn_cloze_response').first().fill('doing');
        
        // Save question
        await page.locator("[class*='btn-primary']").last().click();
        await page.waitForTimeout(2000);
    }

    /**
     * Helper: Create discussion
     */
    async function createDiscussion(page: Page): Promise<void> {
        // Click Add Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'Add Materials' }).click();
        
        // Click create discussion
        await page.click('.action-create-discussion');
        
        // Enter title
        await page.fill('#edit-title', discussion);
        
        // Submit
        await page.click('#edit-submit');
    }

    /**
     * Helper: Create page
     */
    async function createPage(page: Page): Promise<void> {
        // Click Add Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'Add Materials' }).click();
        
        // Click create page
        await page.click('.action-create-page');
        
        // Enter title
        await page.fill('#edit-title', pageName);
        
        // Submit
        await page.click('#edit-submit');
    }

    /**
     * Helper: Create media album
     */
    async function createMediaAlbum(page: Page): Promise<void> {
        // Click Add Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'Add Materials' }).click();
        
        // Click create album
        await page.click('.action-create-album');
        
        // Enter title
        await page.fill('#edit-title', media);
        
        // Click create
        await page.click('#edit-create');
        
        // Submit
        await page.click('#edit-submit');
    }

    /**
     * Helper: Logout from Schoology
     */
    async function logout(page: Page): Promise<void> {
        await page.goto('https://app.schoologytest.com/');
        await page.waitForTimeout(2000);
        await page.click('.LGaPf');
        await page.click("a[href^='/logout?ltoken=']");
    }

    /**
     * Helper: Student submit assignment
     */
    async function studentAssignment(page: Page): Promise<void> {
        // Click All Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'All Materials' }).click();
        
        // Click view assignments
        await page.click('.action-view-assignments');
        
        // Scroll to find assignment
        await page.locator('.item-icon.assignment-icon').last().scrollIntoViewIfNeeded();
        
        // Click on the assignment
        await page.click(`text="${assignment}"`);
        await page.waitForTimeout(4000);
        
        // Click submit assignment
        await page.click('.submit-assignment');
        await page.waitForTimeout(2000);
        
        // Click create tab
        await page.click('#dropbox-submit-create-tab');
        await page.waitForTimeout(2000);
        
        // Switch to iframe and enter text
        const iframe = page.frameLocator('iframe').last();
        await iframe.locator('#tinymce').fill('test assignment submission');
        await page.waitForTimeout(2000);
        
        // Submit
        await page.locator('#edit-submit-1').last().click();
        await page.waitForTimeout(2000);
    }

    /**
     * Helper: Student submit assessment
     */
    async function studentAssessment(page: Page): Promise<void> {
        // Click All Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'All Materials' }).click();
        
        // Click view assessments
        await page.click('.action-view-course-assessment');
        
        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        // Find and click assessment
        await page.locator('.sExtlink-processed').filter({ hasText: assessment }).last().click();
        await page.waitForTimeout(2000);
        
        // Click Start Attempt
        let retries = 10;
        while (retries > 0) {
            const startButton = page.locator("[class*='_17Z60']").filter({ hasText: 'Start Attempt' });
            if (await startButton.isVisible()) {
                await startButton.click();
                break;
            }
            await page.waitForTimeout(500);
            retries--;
        }
        
        await page.waitForTimeout(2000);
        
        // Fill in answer
        await page.locator('.lrn_cloze_response').first().click();
        await page.locator('.lrn_cloze_response').first().fill('doing');
        
        await page.waitForTimeout(2000);
        
        // Click review
        await page.locator("[class*='test-review-screen']").last().click();
        await page.waitForTimeout(2000);
        
        // Click submit
        await page.locator("[class*='test-submit']").first().click();
        await page.waitForTimeout(2000);
        
        // Confirm submit
        await page.click("[class*='test-dialog-save-submit']");
        await page.waitForTimeout(3000);
    }

    /**
     * Helper: Student submit discussion
     */
    async function studentDiscussion(page: Page): Promise<void> {
        // Click All Materials
        await page.locator('.action-links-unfold-text').filter({ hasText: 'All Materials' }).click();
        
        // Click view discussions
        await page.click('.action-view-discussion');
        
        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        // Find and click discussion
        await page.locator('.sExtlink-processed').filter({ hasText: discussion }).last().click();
        await page.waitForTimeout(2000);
        
        // Click comment placeholder
        await page.click('#comment-placeholder');
        await page.waitForTimeout(2000);
        
        // Switch to iframe and enter comment
        const iframe = page.frameLocator('iframe').first();
        await iframe.locator('#tinymce').fill('test post discussion');
        await page.waitForTimeout(2000);
        
        // Submit
        await page.click('#edit-submit');
    }

    /**
     * Teacher Workflow Test
     * Creates materials for each teacher from Excel data
     */
    test('TEACHER-WORKFLOW-001', 'workFlow', async ({ page }) => {
        test.setTimeout(600000); // 10 minutes timeout
        
        const teachers = excelHelper.getSheetData('Teachers');
        
        if (teachers.length === 0) {
            console.log('No teacher data found in Excel file. Skipping test.');
            test.skip();
            return;
        }

        for (let i = 0; i < teachers.length; i++) {
            const teacher = teachers[i];
            console.log(`User logged in ${i + 1}: ${teacher.userName}`);
            
            try {
                // Login
                await loginToSchoology(page, teacher.userName, teacher.password, teacher.school);
                
                // Open course menu
                await page.click('._1D8fw');
                await page.waitForTimeout(2000);
                
                // Select course
                await selectCourse(page, teacher.section, teacher.course, teacher.school);
                await page.waitForTimeout(2000);
                
                await handlePopup(page);
                await page.waitForTimeout(2000);
                
                // Create assignment
                await createAssignment(page);
                await handlePopup(page);
                await page.waitForTimeout(2000);
                
                // Create assessment
                await createAssessment(page);
                await handlePopup(page);
                await page.waitForTimeout(2000);
                
                // Navigate back to course
                await page.click('._1D8fw');
                await page.waitForTimeout(2000);
                await selectCourse(page, teacher.section, teacher.course, teacher.school);
                await handlePopup(page);
                
                // Create discussion
                await createDiscussion(page);
                await page.waitForTimeout(2000);
                
                // Create page
                await createPage(page);
                await page.waitForTimeout(2000);
                
                // Create media album
                await createMediaAlbum(page);
                await page.waitForTimeout(2000);
                
            } finally {
                // Logout
                await logout(page);
            }
        }
    });

    /**
     * Student Workflow Test
     * Submits materials for each student from Excel data
     */
    test('STUDENT-WORKFLOW-001', 'StudentworkFlow', async ({ page }) => {
        test.setTimeout(600000); // 10 minutes timeout
        
        const students = excelHelper.getSheetData('Students');
        
        if (students.length === 0) {
            console.log('No student data found in Excel file. Skipping test.');
            test.skip();
            return;
        }

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            console.log(`User logged in ${i + 1}: ${student.userName}`);
            
            try {
                // Login
                await loginToSchoology(page, student.userName, student.password, student.school);
                
                // Open course menu
                await page.click('._1D8fw');
                console.log('Selecting Course before assignment');
                await selectCourse(page, student.section, student.course, student.school);
                console.log('Course selected');
                
                // Submit assignment
                await studentAssignment(page);
                
                // Navigate back to course
                await page.click('._1D8fw');
                console.log('Selecting Course before assessment');
                await selectCourse(page, student.section, student.course, student.school);
                await page.waitForTimeout(2000);
                
                // Submit assessment
                await studentAssessment(page);
                
                // Navigate back to course
                await page.click('._1D8fw');
                await page.waitForTimeout(2000);
                console.log('Selecting Course before discussion');
                await selectCourse(page, student.section, student.course, student.school);
                await page.waitForTimeout(2000);
                
                // Submit discussion
                await studentDiscussion(page);
                
            } finally {
                // Logout
                await logout(page);
            }
        }
    });
});