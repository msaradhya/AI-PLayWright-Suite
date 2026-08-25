import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NumeracyLiteracyPage extends BasePage {
    readonly pageHeading: Locator;
    readonly dashboardContainer: Locator;
    readonly metricsContainer: Locator;
    readonly loadingIndicator: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.pageHeading = page.getByRole('heading', { name: /^Numeracy$/ });
        this.dashboardContainer = page.locator('main');
        this.metricsContainer = page.locator('main h3').first();
        this.loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner');
        this.errorMessage = page.locator('.error, .error-message, [data-testid="error"]');
    }

    /**
     * Wait for the Numeracy and Literacy page to load completely
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
     * Validate that the Numeracy and Literacy Dashboard is loaded properly
     */
    async validateDashboard(): Promise<void> {
        // Check that the main heading is visible
        await expect(this.pageHeading).toBeVisible();
        
        // Verify no error messages are displayed
        const errorCount = await this.errorMessage.count();
        expect(errorCount).toBe(0);
        
        // Verify dashboard content is present (main container and at least one metric heading)
        await expect(this.dashboardContainer).toBeVisible();
        await expect(this.metricsContainer).toBeVisible();
    }

    /**
     * Validate that all metrics are loading without errors
     * @param timeout - Maximum time to wait for metrics validation
     */
    async validateAllMetrics(timeout: number = 180000): Promise<void> {
        console.log('🔍 Starting Numeracy and Literacy metrics validation...');
        
        // Wait for any loading to complete
        await this.page.waitForTimeout(10000);
        
        // Count the total number of metric headings (level 3) to verify metrics are present
        const metricHeadings = await this.page.locator('h3').count();
        console.log(`📊 Found ${metricHeadings} metric sections on the dashboard`);
        
        // Verify we have a reasonable number of metrics (should be at least 8-10)
        if (metricHeadings < 8) {
            throw new Error(`Expected at least 8 metrics but found only ${metricHeadings}`);
        }
        
        // Validate a few key metrics that should always be present
        const essentialMetrics = [
            'Students Enrolled in Numeracy Summer Camp',
            'Overall Percentage of Numeracy Summer Camp Attendance', 
            'Students Enrolled in Numeracy Interventions During School Year',
            'Overall Percentage of Numeracy Intervention School Year Attendance'
        ];
        
        console.log('🎯 Validating essential metrics:');
        for (let i = 0; i < essentialMetrics.length; i++) {
            const metric = essentialMetrics[i];
            try {
                const metricHeading = this.page.getByRole('heading', { name: metric });
                await expect(metricHeading).toBeVisible();
                console.log(`${i + 1}. ${metric} - ✅ Loaded`);
            } catch (error) {
                console.log(`${i + 1}. ${metric} - ❌ Failed to load`);
                throw new Error(`Essential metric "${metric}" is not visible on the dashboard`);
            }
        }
        
        // Check for any error messages or timeout issues (excluding "No Data Found" which is expected)
        const errorElements = await this.page.locator('text=/error|timeout|failed/i').all();
        const visibleErrors = [];
        
        for (const errorElement of errorElements) {
            if (await errorElement.isVisible()) {
                const errorText = await errorElement.textContent();
                // Skip "No Data Found" as it's a legitimate data state, not an error
                if (errorText && !errorText.toLowerCase().includes('no data found')) {
                    visibleErrors.push(errorText);
                }
            }
        }
        
        // Assert no visible errors (excluding expected "No Data Found" messages)
        if (visibleErrors.length > 0) {
            throw new Error(`Metrics showing errors: ${visibleErrors.join(', ')}`);
        }
        
        // Verify the dashboard is functioning
        await this.validateDashboard();
        
        console.log(`✅ Numeracy and Literacy dashboard validation completed successfully with ${metricHeadings} metrics loaded`);
    }

    /**
     * Check if the page has loaded successfully
     */
    async isPageLoaded(): Promise<boolean> {
        try {
            await this.pageHeading.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}
