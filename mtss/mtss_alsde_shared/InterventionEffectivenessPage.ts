import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InterventionEffectivenessPage extends BasePage {
    readonly pageHeading: Locator;
    readonly dashboardContainer: Locator;
    readonly metricsContainer: Locator;
    readonly loadingIndicator: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.pageHeading = page.getByRole('heading', { name: /Intervention Effectiveness/i });
        this.dashboardContainer = page.locator('main');
        this.metricsContainer = page.locator('main h3').first();
        this.loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner');
        this.errorMessage = page.locator('.error, .error-message, [data-testid="error"]');
    }

    /**
     * Wait for the Intervention Effectiveness page to load completely
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
     * Validate that the Intervention Effectiveness Dashboard is loaded properly
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
        console.log('🔍 Starting Intervention Effectiveness metrics validation...');
        
        // Wait for any loading to complete
        await this.page.waitForTimeout(10000);
        
        // Define the expected 3 metric sections for Intervention Effectiveness and validate each one
        const expectedMetrics = [
            { name: 'How successful are our interventions?', selector: this.page.getByRole('heading', { name: /How successful are our interventions/i }) },
            { name: 'How many interventions have staff administered?', selector: this.page.getByRole('heading', { name: /How many interventions have staff administered/i }) },
            { name: 'Which Intervention types are most effective?', selector: this.page.getByRole('heading', { name: /Which Intervention types are most effective/i }) }
        ];
        
        console.log('📊 Validating 3 distinct metric sections:');
        
        // Validate each expected metric
        for (let i = 0; i < expectedMetrics.length; i++) {
            const metric = expectedMetrics[i];
            try {
                await expect(metric.selector).toBeVisible();
                console.log(`${i + 1}. ${metric.name} - ✅ Loaded`);
            } catch (error) {
                console.log(`${i + 1}. ${metric.name} - ❌ Failed to load`);
                throw new Error(`Metric "${metric.name}" is not visible on the dashboard`);
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
        
        // Verify that the applied filters are visible (this confirms the filtering worked)
        const filterValidations = [
            { name: 'Acceleration Academy', selector: this.page.getByRole('button', { name: /Filter for Acceleration Academy/i }) },
            { name: 'ACCESS Virtual Learning', selector: this.page.getByRole('button', { name: /Filter for ACCESS Virtual Learning/i }) },
            { name: 'Alabama Aerospace', selector: this.page.getByRole('button', { name: /Filter for Alabama Aerospace/i }) },
            { name: 'Alabama Institute for Deaf and Blind', selector: this.page.getByRole('button', { name: /Filter for Alabama Institute for Deaf and Blind/i }) },
            { name: 'Alabama School of Cyber Technology', selector: this.page.getByRole('button', { name: /Filter for Alabama School of Cyber Technology/i }) }
        ];
        
        for (const filter of filterValidations) {
            await expect(filter.selector).toBeVisible();
        }
        
        console.log('✅ All 3 Intervention Effectiveness metrics validation completed successfully');
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
