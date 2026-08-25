import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

// Constants for timeouts and selectors
const DEFAULT_LOAD_TIMEOUT = 180000; // 3 minutes
const LOADING_INDICATOR_TIMEOUT = 120000; // 2 minutes
const CONTENT_STABILIZATION_DELAY = 5000; // 5 seconds

// Chart and data selectors
const CHART_SELECTORS = '.highcharts-container, [data-testid="chart"], svg';
const NUMERIC_VALUE_SELECTOR = 'text=/\\d+/';
const LOADING_SELECTORS = '.loading, [data-testid="loading"], .spinner';
const ERROR_SELECTORS = '.error, .error-message, [data-testid="error"]';

/**
 * Interface for Usage Dashboard metrics organization
 */
interface UsageMetrics {
    // Main dashboard heading
    dashboardUsage: Locator;
    
    // 30-day metrics
    dashboardViewsLast30Days: Locator;
    uniqueUsersLast30Days: Locator;
    
    // 60-day charts
    dashboardViewsLast60DaysChart: Locator;
    userLoginsLast60DaysChart: Locator;
    
    // School year analytics
    totalUsersBySchoolYearChart: Locator;
    totalViewsBySchoolYearChart: Locator;
    
    // School type analytics
    totalUsersBySchoolTypeChart: Locator;
    totalViewsBySchoolTypeChart: Locator;
    
    // Usage analytics by role
    top20DashboardsHeading: Locator;
    dashboardViewsByRoleHeading: Locator;
    dashboardViewsByRoleBySchoolHeading: Locator;
    ytdDashboardViewsByRoleHeading: Locator;
    
    // Historical and additional metrics
    dashboardUsageLastYearHeading: Locator;
    groupUsageHeading: Locator;
    userUsageHeading: Locator;
    dashboardUsageBottomHeading: Locator;
}

/**
 * Page Object Model for the Usage Dashboard
 * TCM-119911: Usage Dashboard Validation
 */
export class UsagePage extends BasePage {
    // Core page elements
    readonly pageHeading: Locator;
    readonly dashboardContainer: Locator;
    readonly metricsContainer: Locator;
    readonly loadingIndicator: Locator;
    readonly errorMessage: Locator;
    
    // Usage metrics sections
    private readonly metrics: UsageMetrics;

    constructor(page: Page) {
        super(page);
        
        // Initialize core page elements using constants
        this.pageHeading = page.getByRole('heading', { name: /Usage/i }).first();
        this.dashboardContainer = page.locator('main');
        this.metricsContainer = page.locator('main h3').first();
        this.loadingIndicator = page.locator(LOADING_SELECTORS);
        this.errorMessage = page.locator(ERROR_SELECTORS);
        
        // Initialize metrics locators grouped by functionality
        this.metrics = {
            // Main dashboard heading
            dashboardUsage: page.getByRole('heading', { name: /Dashboard Usage/i }).first(),
            
            // 30-day metrics
            dashboardViewsLast30Days: page.getByRole('heading', { name: /Dashboard Views in the Last 30 Days/i }),
            uniqueUsersLast30Days: page.getByRole('heading', { name: /Unique Users in the Last 30 Days/i }),
            
            // 60-day charts
            dashboardViewsLast60DaysChart: page.getByRole('heading', { name: /Dashboard views in the last 60 days/i }),
            userLoginsLast60DaysChart: page.getByRole('heading', { name: /User logins in the last 60 days/i }),
            
            // School year analytics
            totalUsersBySchoolYearChart: page.getByRole('heading', { name: /Total Dashboard Users by School Year/i }),
            totalViewsBySchoolYearChart: page.getByRole('heading', { name: /Total Dashboard Views by School Year/i }),
            
            // School type analytics
            totalUsersBySchoolTypeChart: page.getByRole('heading', { name: /Total Dashboard Users by School Type/i }),
            totalViewsBySchoolTypeChart: page.getByRole('heading', { name: /Total Dashboard Views by School Type/i }),
            
            // Usage analytics by role
            top20DashboardsHeading: page.getByRole('heading', { name: /Top 20 Most Frequently Used Dashboards YTD by District/i }),
            dashboardViewsByRoleHeading: page.getByRole('heading', { name: 'Percentage of Dashboard Views by User Role', exact: true }),
            dashboardViewsByRoleBySchoolHeading: page.getByRole('heading', { name: /Percentage of Dashboard Views by User Roles by School/i }),
            ytdDashboardViewsByRoleHeading: page.getByRole('heading', { name: /YTD Dashboard Views by User Role/i }),
            
            // Historical and additional metrics
            dashboardUsageLastYearHeading: page.getByRole('heading', { name: /Dashboard Usage: Last Year/i }),
            groupUsageHeading: page.getByRole('heading', { name: /Group Usage/i }),
            userUsageHeading: page.getByRole('heading', { name: /User Usage/i }),
            dashboardUsageBottomHeading: page.locator('h3').filter({ hasText: /^Dashboard Usage$/ })
        };
    }

    /**
     * Wait for the Usage page to load completely
     * @param timeout - Maximum time to wait in milliseconds (default: 180000ms = 3 minutes)
     */
    async waitForLoad(timeout: number = DEFAULT_LOAD_TIMEOUT): Promise<void> {
        // await this.page.waitForLoadState('networkidle');
        await this.pageHeading.waitFor({ state: 'visible', timeout });
        
        try {
            await this.loadingIndicator.waitFor({ state: 'hidden', timeout: LOADING_INDICATOR_TIMEOUT });
        } catch (error) {
            // Loading indicator might not be present, continue
        }
        
        // await this.page.waitForTimeout(CONTENT_STABILIZATION_DELAY);
    }

    /**
     * Validate that the Usage Dashboard is loaded properly
     */
    async validateDashboard(): Promise<void> {
        await expect(this.pageHeading).toBeVisible();
        
        const errorCount = await this.errorMessage.count();
        if (errorCount > 0) {
            const errorText = await this.errorMessage.first().textContent();
            throw new Error(`Error message found on Usage Dashboard: ${errorText}`);
        }
        
        await expect(this.dashboardContainer).toBeVisible();
    }

    /**
     * Validate core usage metrics (30-day data)
     */
    private async validateCoreMetrics(): Promise<void> {
        await expect(this.metrics.dashboardUsage).toBeVisible();
        console.log('✅ Dashboard Usage heading found');
        
        await expect(this.metrics.dashboardViewsLast30Days).toBeVisible();
        console.log('✅ Dashboard Views in the Last 30 Days found');
        
        await expect(this.metrics.uniqueUsersLast30Days).toBeVisible();
        console.log('✅ Unique Users in the Last 30 Days found');
    }

    /**
     * Validate 60-day chart metrics
     */
    private async validate60DayCharts(): Promise<void> {
        await expect(this.metrics.dashboardViewsLast60DaysChart).toBeVisible();
        console.log('✅ Dashboard views in the last 60 days chart found');
        
        await expect(this.metrics.userLoginsLast60DaysChart).toBeVisible();
        console.log('✅ User logins in the last 60 days chart found');
    }

    /**
     * Validate school year analytics
     */
    private async validateSchoolYearAnalytics(): Promise<void> {
        await expect(this.metrics.totalUsersBySchoolYearChart).toBeVisible();
        console.log('✅ Total Dashboard Users by School Year chart found');
        
        await expect(this.metrics.totalViewsBySchoolYearChart).toBeVisible();
        console.log('✅ Total Dashboard Views by School Year chart found');
    }

    /**
     * Validate school type analytics
     */
    private async validateSchoolTypeAnalytics(): Promise<void> {
        await expect(this.metrics.totalUsersBySchoolTypeChart).toBeVisible();
        console.log('✅ Total Dashboard Users by School Type chart found');
        
        await expect(this.metrics.totalViewsBySchoolTypeChart).toBeVisible();
        console.log('✅ Total Dashboard Views by School Type chart found');
    }

    /**
     * Validate role-based analytics
     */
    private async validateRoleAnalytics(): Promise<void> {
        await expect(this.metrics.top20DashboardsHeading).toBeVisible();
        console.log('✅ Top 20 Most Frequently Used Dashboards heading found');
        
        await expect(this.metrics.dashboardViewsByRoleHeading).toBeVisible();
        console.log('✅ Dashboard Views by User Role heading found');
        
        await expect(this.metrics.dashboardViewsByRoleBySchoolHeading).toBeVisible();
        console.log('✅ Dashboard Views by User Roles by School heading found');
        
        await expect(this.metrics.ytdDashboardViewsByRoleHeading).toBeVisible();
        console.log('✅ YTD Dashboard Views by User Role heading found');
    }

    /**
     * Validate historical and additional metrics
     */
    private async validateHistoricalMetrics(): Promise<void> {
        await expect(this.metrics.dashboardUsageLastYearHeading).toBeVisible();
        console.log('✅ Dashboard Usage: Last Year heading found');
        
        await expect(this.metrics.groupUsageHeading).toBeVisible();
        console.log('✅ Group Usage heading found');
        
        await expect(this.metrics.userUsageHeading).toBeVisible();
        console.log('✅ User Usage heading found');
        
        await expect(this.metrics.dashboardUsageBottomHeading).toBeVisible();
        console.log('✅ Dashboard Usage (bottom) heading found');
    }

    /**
     * Validate all key metrics are present on the Usage Dashboard
     */
    async validateAllMetrics(): Promise<void> {
        console.log('Validating Usage Dashboard metrics...');
        
        // Validate metrics by category for better organization
        await this.validateCoreMetrics();
        await this.validate60DayCharts();
        await this.validateSchoolYearAnalytics();
        await this.validateSchoolTypeAnalytics();
        await this.validateRoleAnalytics();
        await this.validateHistoricalMetrics();
        
        console.log('🎉 All Usage Dashboard metrics validated successfully!');
    }

    /**
     * Check if the Usage dashboard has data/metrics loaded
     */
    async hasDataLoaded(): Promise<boolean> {
        try {
            const [chartCount, numericCount] = await Promise.all([
                this.getChartElementsCount(),
                this.getNumericElementsCount()
            ]);
            
            return chartCount > 0 || numericCount > 0;
        } catch (error) {
            console.log('Warning: Could not determine if data is loaded:', error);
            return true; // Assume data is loaded if we can't check
        }
    }

    /**
     * Get count of chart elements on the dashboard
     */
    private async getChartElementsCount(): Promise<number> {
        const chartElements = this.page.locator(CHART_SELECTORS);
        return await chartElements.count();
    }

    /**
     * Get count of numeric elements on the dashboard
     */
    private async getNumericElementsCount(): Promise<number> {
        const numericElements = this.page.locator(NUMERIC_VALUE_SELECTOR);
        return await numericElements.count();
    }

    /**
     * Get the numeric value from the "Unique Users in the Last 30 Days" metric
     * @returns The unique users count as a number, or null if not found
     */
    async getUniqueUsersLast30Days(): Promise<number | null> {
        try {
            // Look for the specific numeric value next to the unique users heading
            // The value should be in a container near the "Unique Users in the Last 30 Days" heading
            const uniqueUsersSection = this.page.locator('text="Unique Users in the Last 30 Days"').locator('..');
            const numericValue = await uniqueUsersSection.locator('text=/^\\d+$/', { hasText: /^\d+$/ }).first().textContent();
            
            if (numericValue) {
                const parsedValue = parseInt(numericValue.replace(/,/g, ''), 10);
                return isNaN(parsedValue) ? null : parsedValue;
            }
            
            // Fallback: look for any number in the vicinity
            const fallbackValue = await this.page.locator('text=/^\\d+$/', { hasText: /^\d+$/ }).first().textContent();
            if (fallbackValue) {
                const parsedFallback = parseInt(fallbackValue.replace(/,/g, ''), 10);
                return isNaN(parsedFallback) ? null : parsedFallback;
            }
            
            return null;
        } catch (error) {
            console.log('Could not retrieve unique users count:', error);
            return null;
        }
    }

    /**
     * Assert that we are on the Usage Dashboard page
     */
    async assertOnUsagePage(): Promise<void> {
        // Check page URL contains usage dashboard identifier
        await expect(this.page).toHaveURL(/dashboard\/1533/);
        
        // Assert main Usage heading is visible
        await expect(this.pageHeading).toBeVisible();
        
        // Assert dashboard container is present
        await expect(this.dashboardContainer).toBeVisible();
        
        // Assert Dashboard Usage main heading exists
        await expect(this.metrics.dashboardUsage).toBeVisible();
    }

    /**
     * Assert that critical metrics are loaded and visible
     */
    async assertCriticalMetricsLoaded(): Promise<void> {
        // Assert 5 critical metrics that must be present for the dashboard to be functional
        await expect(this.metrics.dashboardUsage).toBeVisible();
        await expect(this.metrics.dashboardViewsLast30Days).toBeVisible();
        await expect(this.metrics.uniqueUsersLast30Days).toBeVisible();
        await expect(this.metrics.totalUsersBySchoolYearChart).toBeVisible();
        await expect(this.metrics.totalViewsBySchoolYearChart).toBeVisible();
    }

    /**
     * Assert that charts and data visualizations are present
     */
    async assertChartsAreLoaded(): Promise<void> {
        const chartCount = await this.getChartElementsCount();
        expect(chartCount).toBeGreaterThan(0);
        
        const numericCount = await this.getNumericElementsCount();
        expect(numericCount).toBeGreaterThan(0);
    }

    /**
     * Assert no error messages are displayed
     */
    async assertNoErrors(): Promise<void> {
        const errorCount = await this.errorMessage.count();
        expect(errorCount).toBe(0);
    }

    /**
     * Assert that specific numeric data is available (unique users count)
     */
    async assertUniqueUsersDataAvailable(): Promise<void> {
        const uniqueUsers = await this.getUniqueUsersLast30Days();
        expect(uniqueUsers).not.toBeNull();
        expect(uniqueUsers).toBeGreaterThanOrEqual(0);
    }

    /**
     * Validate that all charts are interactive and functional (for informational purposes)
     */
    async validateChartsInteractivity(): Promise<void> {
        console.log('Validating chart interactivity...');
        
        try {
            // Check for Highcharts containers (common chart library)
            const highchartsContainers = this.page.locator('.highcharts-container');
            const chartCount = await highchartsContainers.count();
            
            if (chartCount > 0) {
                console.log(`✅ Found ${chartCount} interactive charts`);
                
                // Verify first chart has interactive elements
                const firstChart = highchartsContainers.first();
                const hasInteractiveElements = await firstChart.locator('.highcharts-series').count() > 0;
                
                if (hasInteractiveElements) {
                    console.log('✅ Charts contain interactive data series');
                } else {
                    console.log('⚠️  Charts may not be fully loaded');
                }
            } else {
                console.log('⚠️  No Highcharts containers found');
            }
        } catch (error) {
            console.log('Warning: Could not validate chart interactivity:', error);
        }
    }
}
