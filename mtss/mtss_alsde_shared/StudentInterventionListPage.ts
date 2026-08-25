import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class StudentInterventionListPage extends BasePage {
    readonly pageHeading: Locator;
    readonly dashboardContainer: Locator;
    readonly metricsContainer: Locator;
    readonly loadingIndicator: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.pageHeading = page.locator('h1').filter({ hasText: /Student Intervention List/i });
        this.dashboardContainer = page.locator('main');
        this.metricsContainer = page.locator('main h3').first();
        this.loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner');
        this.errorMessage = page.locator('.error, .error-message, [data-testid="error"]');
    }

    /**
     * Wait for the Student Intervention List page to load completely
     * @param timeout - Maximum time to wait in milliseconds (default: 180000ms = 3 minutes)
     */
    async waitForLoad(timeout: number = 180000): Promise<void> {
        // Wait for page to load
        await this.page.waitForLoadState('domcontentloaded');
        
        // Wait for the page heading to be visible
        await this.pageHeading.waitFor({ state: 'visible', timeout });
        
        // Wait for loading indicators to disappear
        try {
            await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
        } catch (error) {
            // Loading indicator might not be present, continue
        }
        
        // Additional wait for content to stabilize
        await this.page.waitForTimeout(5000);
    }

    /**
     * Validate that the Student Intervention List Dashboard is loaded properly
     */
    async validateDashboard(): Promise<void> {
        // Check that the main heading is visible
        await expect(this.pageHeading).toBeVisible();
        
        // Verify no error messages are displayed
        const errorCount = await this.errorMessage.count();
        expect(errorCount).toBe(0);
        
        // Verify the main dashboard container is visible
        await expect(this.dashboardContainer).toBeVisible();
    }

    /**
     * Validate all metrics on the dashboard
     * @param timeout - Maximum time to wait for metrics to load
     */
    async validateAllMetrics(timeout: number = 180000): Promise<void> {
        console.log('📊 Validating metrics are loading without errors...');
        
        // Wait for any loading to complete
        await this.page.waitForTimeout(10000);
        
        // Check for error messages
        const errors = await this.page.locator('.error, .error-message, [class*="error"], [data-testid*="error"]').all();
        const errorMessages = [];
        
        for (const error of errors) {
            if (await error.isVisible()) {
                const text = await error.textContent();
                if (text && text.trim()) {
                    errorMessages.push(text.trim());
                }
            }
        }
        
        if (errorMessages.length > 0) {
            throw new Error(`Found error messages on dashboard: ${errorMessages.join(', ')}`);
        }
        
        // Check for timeout messages
        const timeoutMessages = await this.page.locator('[class*="timeout"], [data-testid*="timeout"]').all();
        const timeoutTexts = [];
        
        for (const timeout of timeoutMessages) {
            if (await timeout.isVisible()) {
                const text = await timeout.textContent();
                if (text && text.trim()) {
                    timeoutTexts.push(text.trim());
                }
            }
        }
        
        if (timeoutTexts.length > 0) {
            throw new Error(`Found timeout messages on dashboard: ${timeoutTexts.join(', ')}`);
        }
        
        console.log('✅ All metrics validation passed - no errors or timeouts found');
    }

    /**
     * Get the dashboard title
     */
    async getDashboardTitle(): Promise<string> {
        return await this.pageHeading.textContent() || '';
    }

    /**
     * Check if the dashboard is fully loaded
     */
    async isDashboardLoaded(): Promise<boolean> {
        try {
            await this.pageHeading.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}
