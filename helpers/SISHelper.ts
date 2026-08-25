/**
 * SIS Helper
 * Helper class for SIS-related operations in Playwright tests
 * Converted from Java: psqa.shared.sis.helpers.SISHelper
 * 
 * @author converted to TypeScript/Playwright
 */

import { Page, expect } from '@playwright/test';
import { User } from '../users/User';

/**
 * Schools enum for school selection
 */
export const Schools = {
    UIHN_AUTOMATION_SCHOOL: 'UIHN Automation School'
} as const;

export type SchoolType = typeof Schools[keyof typeof Schools];

/**
 * SIS Helper class with utility methods for SIS operations
 */
export class SISHelper {
    
    /**
     * Start an admin test session
     * @param page - Playwright page object
     * @param user - User credentials to login with
     */
    static async startAdminTest(page: Page, user: User): Promise<void> {
        // Navigate to the admin login page
        const baseUrl = process.env.SIS_BASE_URL || 'https://sis.powerschool.com';
        await page.goto(`${baseUrl}/admin/pw.html`);
        
        // Wait for login page to load
        await page.waitForSelector('#fieldUsername, input[name="username"]', { timeout: 30000 });
        
        // Enter credentials
        await page.fill('#fieldUsername, input[name="username"]', user.userName);
        await page.fill('#fieldPassword, input[name="password"]', user.password);
        
        // Click login button
        await page.click('#btnEnter, button[type="submit"]');
        
        // Wait for admin home page to load
        await page.waitForSelector('.admin-home, #content', { timeout: 30000 });
        
        console.log(`Successfully logged in as admin: ${user.userName}`);
    }

    /**
     * Wait for admin loading bar to disappear
     * @param page - Playwright page object
     */
    static async waitForAdminLoadingBarToDisappear(page: Page): Promise<void> {
        try {
            // Wait for loading bar to disappear
            await page.waitForSelector('.loading-bar, .ps-loading', { state: 'hidden', timeout: 30000 });
        } catch (error) {
            // Loading bar might not be present
            console.log('Loading bar not present or already hidden');
        }
    }

    /**
     * Set the current school context
     * @param page - Playwright page object
     * @param school - School to set
     */
    static async setSchool(page: Page, school: SchoolType): Promise<void> {
        // Click on school selector
        const schoolSelector = page.locator('.school-selector, #schoolSelect');
        if (await schoolSelector.isVisible()) {
            await schoolSelector.click();
            await page.click(`text="${school}"`);
            await this.waitForAdminLoadingBarToDisappear(page);
        }
    }

    /**
     * Set the current term
     * @param page - Playwright page object
     * @param termId - Term ID to set
     */
    static async setTerm(page: Page, termId: number): Promise<void> {
        // Click on term selector
        const termSelector = page.locator('.term-selector, #termSelect');
        if (await termSelector.isVisible()) {
            await termSelector.click();
            await page.click(`[data-term-id="${termId}"], text="${termId}"`);
            await this.waitForAdminLoadingBarToDisappear(page);
        }
    }

    /**
     * Navigate to admin home page
     * @param page - Playwright page object
     */
    static async navigateToAdminHome(page: Page): Promise<void> {
        await page.click('.home-link, a[href="/admin/home.html"]');
        await this.waitForAdminLoadingBarToDisappear(page);
    }

    /**
     * Search for a student (with selection)
     * @param page - Playwright page object
     * @param studentName - Name of the student to search
     */
    static async searchStudent(page: Page, studentName: string): Promise<void> {
        const searchInput = page.locator('#studentSearchInput, input[name="studentSearch"]');
        await searchInput.fill(studentName);
        await searchInput.press('Enter');
        await this.waitForAdminLoadingBarToDisappear(page);
        
        // Select the first result if found
        const firstResult = page.locator('.student-search-result, .search-result').first();
        if (await firstResult.isVisible()) {
            await firstResult.click();
        }
    }

    /**
     * Search for a student (without selection)
     * @param page - Playwright page object
     * @param studentName - Name of the student to search
     */
    static async searchStudentNoSelect(page: Page, studentName: string): Promise<void> {
        const searchInput = page.locator('#studentSearchInput, input[name="studentSearch"]');
        await searchInput.fill(studentName);
        await searchInput.press('Enter');
        await this.waitForAdminLoadingBarToDisappear(page);
    }

    /**
     * Submit the current page/form
     * @param page - Playwright page object
     */
    static async submitPage(page: Page): Promise<void> {
        await page.click('#btnSubmit, button[type="submit"], .submit-button');
        await this.waitForAdminLoadingBarToDisappear(page);
    }

    /**
     * Wait for the "Changes Recorded" page
     * @param page - Playwright page object
     */
    static async waitForChangesRecordedPage(page: Page): Promise<void> {
        await page.waitForSelector('.feedback-confirm, .changes-recorded', { timeout: 30000 });
    }

    /**
     * Get feedback confirmation text
     * @param page - Playwright page object
     * @returns Feedback confirmation text
     */
    static async getFeedbackConfirmText(page: Page): Promise<string> {
        const feedbackElement = page.locator('.feedback-confirm, .feedback-message');
        return await feedbackElement.textContent() || '';
    }

    /**
     * Logout from admin
     * @param page - Playwright page object
     */
    static async logoffAdmin(page: Page): Promise<void> {
        try {
            await page.click('.logout-link, a[href*="logout"]');
            await page.waitForSelector('#fieldUsername, input[name="username"]', { timeout: 10000 });
            console.log('Successfully logged out from admin');
        } catch (error) {
            console.warn('Logout failed or already logged out:', error);
        }
    }
}