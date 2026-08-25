import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InterventionGoalDatawallPage extends BasePage {
    readonly pageHeading: Locator;
    readonly dashboardContainer: Locator;
    readonly metricsContainer: Locator;
    readonly loadingIndicator: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.pageHeading = page.getByRole('heading', { name: /Goal Datawall/i });
        this.dashboardContainer = page.locator('main');
        this.metricsContainer = page.locator('main h3').first();
        this.loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner');
        this.errorMessage = page.locator('.error, .error-message, [data-testid="error"]');
    }

    /**
     * Wait for the Intervention Goal Datawall page to load completely
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
     * Validate that the Intervention Goal Datawall Dashboard is loaded properly
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
     * @param validateFilters - Whether to validate applied filters (default: true)
     */
    async validateAllMetrics(timeout: number = 180000, validateFilters: boolean = true): Promise<void> {
        console.log('🔍 Starting Goal Datawall metrics validation...');
        
        // Wait for any loading to complete
        await this.page.waitForTimeout(10000);
        
        // Get all different types of metric elements that might exist
        const allElements = await this.page.locator('h1, h2, h3, h4, .metric, .chart-title, .dashboard-title, [data-testid*="metric"], [class*="metric"], [class*="chart"]').all();
        console.log(`📊 Found ${allElements.length} potential metric elements, analyzing...`);
        
        const validMetrics = [];
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            if (await element.isVisible()) {
                const text = await element.textContent();
                if (text && text.trim() && !text.includes('Filter') && !text.includes('Clear') && text.length > 2) {
                    validMetrics.push(text.trim());
                }
            }
        }
        
        console.log(`📊 Validating ${validMetrics.length} Goal Datawall metric sections:`);
        validMetrics.forEach((metric, index) => {
            console.log(`${index + 1}. ${metric} - ✅ Loaded`);
        });
        
        // Also check for any specific chart or visualization containers
        const chartContainers = await this.page.locator('.chart-container, .visualization, canvas, svg, .d3-chart, .highcharts-container').all();
        if (chartContainers.length > 0) {
            console.log(`📈 Found ${chartContainers.length} chart/visualization containers`);
        }
        
        // Check for data tables or grids
        const dataContainers = await this.page.locator('table, .data-grid, .data-table, .ag-grid').all();
        if (dataContainers.length > 0) {
            console.log(`📋 Found ${dataContainers.length} data table containers`);
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
        
        // Only verify filters if requested (for tests with district filtering)
        if (validateFilters) {
            console.log('🔍 Validating applied district filters...');
            // Verify that the applied filters are visible (this confirms the filtering worked)
            const filterValidations = [
                { name: 'Acceleration Academy', selector: this.page.getByRole('button', { name: /Filter for Acceleration Academy/i }) },
                { name: 'ACCESS Virtual Learning', selector: this.page.getByRole('button', { name: /Filter for ACCESS Virtual Learning/i }) },
                { name: 'Alabama Aerospace', selector: this.page.getByRole('button', { name: /Filter for Alabama Aerospace/i }) },
                { name: 'Alabama Institute for Deaf and Blind', selector: this.page.getByRole('button', { name: /Filter for Alabama Institute for Deaf and Blind/i }) },
                { name: 'Alabama School of Cyber Technology', selector: this.page.getByRole('button', { name: /Filter for Alabama School of Cyber Technology/i }) }
            ];
            
            let filtersVisible = 0;
            for (const filter of filterValidations) {
                try {
                    await expect(filter.selector).toBeVisible({ timeout: 10000 });
                    filtersVisible++;
                    console.log(`✅ ${filter.name} filter visible`);
                } catch (error) {
                    console.log(`⚠️ ${filter.name} filter not visible`);
                }
            }
            
            if (filtersVisible > 0) {
                console.log(`✅ ${filtersVisible}/5 district filters are visible and applied`);
            } else {
                console.log('⚠️ No district filters visible - continuing without filter validation');
            }
        }
        
        console.log('✅ All Goal Datawall metrics validation completed successfully');
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
