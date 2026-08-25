/**
 * Hoonuit Intervention Overview Helper
 * Helper class for intervention overview dashboard validations
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
import { Page, Locator, expect } from '@playwright/test';

export interface OverviewMetrics {
    totalStudents: number;
    studentsWithInterventions: number;
    activeInterventions: number;
    completedInterventions: number;
    withdrawnInterventions: number;
    averageInterventionsPerStudent: number;
}

export interface InterventionBreakdown {
    type: string;
    count: number;
    percentage: number;
}

export interface TierDistribution {
    tier1: number;
    tier2: number;
    tier3: number;
    totalStudents: number;
}

/**
 * Intervention Overview Helper
 * Provides methods for validating intervention overview data
 */
export class HoonuitInterventionOverviewHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the overview dashboard container
     * @returns Locator for the dashboard container
     */
    private getDashboardContainer(): Locator {
        return this.page.locator('[data-testid="intervention-overview"], .intervention-overview-dashboard');
    }

    /**
     * Get overview metrics
     * @returns Overview metrics object
     */
    async getOverviewMetrics(): Promise<OverviewMetrics> {
        const container = this.getDashboardContainer();
        await expect(container).toBeVisible();

        const totalStudentsText = await container.locator('[data-metric="totalStudents"], .metric-total-students').textContent() || '0';
        const studentsWithInterventionsText = await container.locator('[data-metric="studentsWithInterventions"], .metric-students-with').textContent() || '0';
        const activeText = await container.locator('[data-metric="active"], .metric-active').textContent() || '0';
        const completedText = await container.locator('[data-metric="completed"], .metric-completed').textContent() || '0';
        const withdrawnText = await container.locator('[data-metric="withdrawn"], .metric-withdrawn').textContent() || '0';
        const avgText = await container.locator('[data-metric="average"], .metric-average').textContent() || '0';

        return {
            totalStudents: parseInt(totalStudentsText.replace(/[^0-9]/g, '')) || 0,
            studentsWithInterventions: parseInt(studentsWithInterventionsText.replace(/[^0-9]/g, '')) || 0,
            activeInterventions: parseInt(activeText.replace(/[^0-9]/g, '')) || 0,
            completedInterventions: parseInt(completedText.replace(/[^0-9]/g, '')) || 0,
            withdrawnInterventions: parseInt(withdrawnText.replace(/[^0-9]/g, '')) || 0,
            averageInterventionsPerStudent: parseFloat(avgText.replace(/[^0-9.-]/g, '')) || 0
        };
    }

    /**
     * Get intervention breakdown by type
     * @returns Array of intervention breakdown objects
     */
    async getInterventionBreakdown(): Promise<InterventionBreakdown[]> {
        const container = this.getDashboardContainer();
        const breakdownRows = await container.locator('.breakdown-row, [data-testid="breakdown-item"]').all();
        const breakdown: InterventionBreakdown[] = [];

        for (const row of breakdownRows) {
            const type = await row.locator('.breakdown-type, [data-field="type"]').textContent() || '';
            const count = await row.locator('.breakdown-count, [data-field="count"]').textContent() || '0';
            const percentage = await row.locator('.breakdown-percentage, [data-field="percentage"]').textContent() || '0';

            breakdown.push({
                type: type.trim(),
                count: parseInt(count.replace(/[^0-9]/g, '')) || 0,
                percentage: parseFloat(percentage.replace(/[^0-9.-]/g, '')) || 0
            });
        }

        return breakdown;
    }

    /**
     * Get tier distribution
     * @returns Tier distribution object
     */
    async getTierDistribution(): Promise<TierDistribution> {
        const container = this.getDashboardContainer();

        const tier1Text = await container.locator('[data-tier="1"], .tier-1-count').textContent() || '0';
        const tier2Text = await container.locator('[data-tier="2"], .tier-2-count').textContent() || '0';
        const tier3Text = await container.locator('[data-tier="3"], .tier-3-count').textContent() || '0';
        const totalText = await container.locator('[data-metric="tierTotal"], .tier-total').textContent() || '0';

        return {
            tier1: parseInt(tier1Text.replace(/[^0-9]/g, '')) || 0,
            tier2: parseInt(tier2Text.replace(/[^0-9]/g, '')) || 0,
            tier3: parseInt(tier3Text.replace(/[^0-9]/g, '')) || 0,
            totalStudents: parseInt(totalText.replace(/[^0-9]/g, '')) || 0
        };
    }

    /**
     * Get chart data points
     * @param chartType Chart type ('bar', 'pie', 'line')
     * @returns Array of data points
     */
    async getChartData(chartType: string): Promise<Array<{ label: string; value: number }>> {
        const chart = this.page.locator(`[data-chart-type="${chartType}"], .chart-${chartType}`);
        await expect(chart).toBeVisible();

        const dataPoints = await chart.locator('.data-point, [data-testid="chart-data"]').all();
        const data: Array<{ label: string; value: number }> = [];

        for (const point of dataPoints) {
            const label = await point.getAttribute('data-label') || await point.locator('.label').textContent() || '';
            const value = await point.getAttribute('data-value') || await point.locator('.value').textContent() || '0';

            data.push({
                label: label.trim(),
                value: parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
            });
        }

        return data;
    }

    /**
     * Get trend data
     * @returns Array of trend data points
     */
    async getTrendData(): Promise<Array<{ period: string; value: number }>> {
        const trendChart = this.page.locator('[data-testid="trend-chart"], .trend-chart');
        await expect(trendChart).toBeVisible();

        const trendPoints = await trendChart.locator('.trend-point, [data-testid="trend-data"]').all();
        const trends: Array<{ period: string; value: number }> = [];

        for (const point of trendPoints) {
            const period = await point.getAttribute('data-period') || await point.locator('.period').textContent() || '';
            const value = await point.getAttribute('data-value') || await point.locator('.value').textContent() || '0';

            trends.push({
                period: period.trim(),
                value: parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
            });
        }

        return trends;
    }

    /**
     * Click on a metric card
     * @param metricName Name of the metric
     */
    async clickMetric(metricName: string): Promise<void> {
        const metricCard = this.page.locator(`[data-metric="${metricName}"], .metric-card:has-text("${metricName}")`);
        await metricCard.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Apply school filter
     * @param schoolName School name
     */
    async filterBySchool(schoolName: string): Promise<void> {
        const schoolFilter = this.page.locator('[data-testid="school-filter"], select.school-filter');
        await schoolFilter.selectOption(schoolName);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Apply grade filter
     * @param grade Grade level
     */
    async filterByGrade(grade: string): Promise<void> {
        const gradeFilter = this.page.locator('[data-testid="grade-filter"], select.grade-filter');
        await gradeFilter.selectOption(grade);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Apply date range filter
     * @param startDate Start date (YYYY-MM-DD)
     * @param endDate End date (YYYY-MM-DD)
     */
    async filterByDateRange(startDate: string, endDate: string): Promise<void> {
        const startInput = this.page.locator('[data-testid="start-date"], input.start-date');
        const endInput = this.page.locator('[data-testid="end-date"], input.end-date');
        
        await startInput.fill(startDate);
        await endInput.fill(endDate);
        
        const applyButton = this.page.locator('[data-testid="apply-filter"], button:has-text("Apply")');
        await applyButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Validate metric value
     * @param metricName Metric name
     * @param expectedValue Expected value
     * @param tolerance Tolerance percentage
     * @returns True if value is within tolerance
     */
    async validateMetricValue(metricName: string, expectedValue: number, tolerance: number = 5): Promise<boolean> {
        const container = this.getDashboardContainer();
        const metricText = await container.locator(`[data-metric="${metricName}"], .metric-${metricName}`).textContent();
        const actualValue = parseInt(metricText?.replace(/[^0-9]/g, '') || '0');

        const lowerBound = expectedValue * (1 - tolerance / 100);
        const upperBound = expectedValue * (1 + tolerance / 100);

        return actualValue >= lowerBound && actualValue <= upperBound;
    }

    /**
     * Get intervention rate
     * @returns Intervention rate as percentage
     */
    async getInterventionRate(): Promise<number> {
        const metrics = await this.getOverviewMetrics();
        if (metrics.totalStudents === 0) {
            return 0;
        }
        return (metrics.studentsWithInterventions / metrics.totalStudents) * 100;
    }

    /**
     * Get completion rate
     * @returns Completion rate as percentage
     */
    async getCompletionRate(): Promise<number> {
        const metrics = await this.getOverviewMetrics();
        const totalInterventions = metrics.activeInterventions + metrics.completedInterventions + metrics.withdrawnInterventions;
        if (totalInterventions === 0) {
            return 0;
        }
        return (metrics.completedInterventions / totalInterventions) * 100;
    }

    /**
     * Refresh dashboard
     */
    async refreshDashboard(): Promise<void> {
        const refreshButton = this.page.locator('[data-testid="refresh"], button.refresh');
        await refreshButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Export overview report
     * @param format Export format
     */
    async exportOverview(format: 'csv' | 'pdf' | 'xlsx'): Promise<void> {
        const exportButton = this.page.locator('[data-testid="export-overview"], button.export');
        await exportButton.click();

        const formatOption = this.page.locator(`[data-format="${format}"]`);
        await formatOption.click();

        await this.page.waitForTimeout(2000);
    }

    /**
     * Navigate to detailed view
     * @param viewType View type ('students', 'interventions', 'effectiveness')
     */
    async navigateToDetailedView(viewType: string): Promise<void> {
        const viewLink = this.page.locator(`[data-view="${viewType}"], a:has-text("${viewType}")`);
        await viewLink.click();
        await this.page.waitForLoadState('networkidle');
    }
}