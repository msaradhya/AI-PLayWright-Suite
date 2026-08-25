/**
 * Hoonuit Intervention Effectiveness Helper
 * Helper class for intervention effectiveness validations
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
import { Page, Locator, expect } from '@playwright/test';

export interface EffectivenessData {
    interventionName: string;
    totalEnrolled: number;
    completedCount: number;
    successRate: number;
    averageDuration: number;
    improvementRate: number;
}

export interface EffectivenessSummary {
    totalInterventions: number;
    highEffectiveness: number;
    mediumEffectiveness: number;
    lowEffectiveness: number;
    averageSuccessRate: number;
}

export interface TrendData {
    period: string;
    successRate: number;
    enrollmentCount: number;
    completionCount: number;
}

/**
 * Intervention Effectiveness Helper
 * Provides methods for validating intervention effectiveness data
 */
export class HoonuitInterventionEffectivenessHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the effectiveness dashboard container
     * @returns Locator for the dashboard container
     */
    private getDashboardContainer(): Locator {
        return this.page.locator('[data-testid="effectiveness-dashboard"], .effectiveness-dashboard');
    }

    /**
     * Get the effectiveness table
     * @returns Locator for the effectiveness table
     */
    private getEffectivenessTable(): Locator {
        return this.page.locator('[data-testid="effectiveness-table"], .effectiveness-table, table.interventions-effectiveness');
    }

    /**
     * Get all effectiveness rows
     * @returns Array of row locators
     */
    async getEffectivenessRows(): Promise<Locator[]> {
        const table = this.getEffectivenessTable();
        await expect(table).toBeVisible();
        return await table.locator('tbody tr').all();
    }

    /**
     * Get effectiveness data by intervention name
     * @param interventionName Name of the intervention
     * @returns Effectiveness data object or null if not found
     */
    async getEffectivenessByName(interventionName: string): Promise<EffectivenessData | null> {
        const rows = await this.getEffectivenessRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            if (nameCell && nameCell.trim() === interventionName) {
                return await this.extractEffectivenessData(row);
            }
        }

        return null;
    }

    /**
     * Extract effectiveness data from a row
     * @param row Row locator
     * @returns Effectiveness data object
     */
    private async extractEffectivenessData(row: Locator): Promise<EffectivenessData> {
        const interventionName = await row.locator('td[data-field="name"], td:first-child').textContent() || '';
        const totalEnrolled = await row.locator('td[data-field="enrolled"]').textContent() || '0';
        const completedCount = await row.locator('td[data-field="completed"]').textContent() || '0';
        const successRate = await row.locator('td[data-field="successRate"]').textContent() || '0';
        const averageDuration = await row.locator('td[data-field="duration"]').textContent() || '0';
        const improvementRate = await row.locator('td[data-field="improvement"]').textContent() || '0';

        return {
            interventionName: interventionName.trim(),
            totalEnrolled: parseInt(totalEnrolled.replace(/[^0-9]/g, '')) || 0,
            completedCount: parseInt(completedCount.replace(/[^0-9]/g, '')) || 0,
            successRate: parseFloat(successRate.replace(/[^0-9.-]/g, '')) || 0,
            averageDuration: parseFloat(averageDuration.replace(/[^0-9.-]/g, '')) || 0,
            improvementRate: parseFloat(improvementRate.replace(/[^0-9.-]/g, '')) || 0
        };
    }

    /**
     * Get effectiveness summary
     * @returns Summary object with effectiveness metrics
     */
    async getEffectivenessSummary(): Promise<EffectivenessSummary> {
        const rows = await this.getEffectivenessRows();
        
        let highCount = 0;
        let mediumCount = 0;
        let lowCount = 0;
        let totalSuccessRate = 0;

        for (const row of rows) {
            const successRateText = await row.locator('td[data-field="successRate"]').textContent();
            const successRate = parseFloat(successRateText?.replace(/[^0-9.-]/g, '') || '0');
            totalSuccessRate += successRate;

            if (successRate >= 75) {
                highCount++;
            } else if (successRate >= 50) {
                mediumCount++;
            } else {
                lowCount++;
            }
        }

        return {
            totalInterventions: rows.length,
            highEffectiveness: highCount,
            mediumEffectiveness: mediumCount,
            lowEffectiveness: lowCount,
            averageSuccessRate: rows.length > 0 ? totalSuccessRate / rows.length : 0
        };
    }

    /**
     * Get top performing interventions
     * @param limit Number of top interventions to return
     * @returns Array of intervention names
     */
    async getTopPerformingInterventions(limit: number = 5): Promise<string[]> {
        const rows = await this.getEffectivenessRows();
        const interventions: Array<{ name: string; successRate: number }> = [];

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            const successRateText = await row.locator('td[data-field="successRate"]').textContent();
            
            if (nameCell && successRateText) {
                interventions.push({
                    name: nameCell.trim(),
                    successRate: parseFloat(successRateText.replace(/[^0-9.-]/g, '')) || 0
                });
            }
        }

        // Sort by success rate descending
        interventions.sort((a, b) => b.successRate - a.successRate);

        return interventions.slice(0, limit).map(i => i.name);
    }

    /**
     * Get interventions below threshold
     * @param threshold Success rate threshold
     * @returns Array of intervention names below threshold
     */
    async getInterventionsBelowThreshold(threshold: number): Promise<string[]> {
        const rows = await this.getEffectivenessRows();
        const interventions: string[] = [];

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            const successRateText = await row.locator('td[data-field="successRate"]').textContent();
            
            if (nameCell && successRateText) {
                const successRate = parseFloat(successRateText.replace(/[^0-9.-]/g, '')) || 0;
                if (successRate < threshold) {
                    interventions.push(nameCell.trim());
                }
            }
        }

        return interventions;
    }

    /**
     * Get trend data for an intervention
     * @param interventionName Name of the intervention
     * @returns Array of trend data points
     */
    async getInterventionTrends(interventionName: string): Promise<TrendData[]> {
        // Click on intervention to view details
        const rows = await this.getEffectivenessRows();
        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            if (nameCell && nameCell.trim() === interventionName) {
                await row.click();
                break;
            }
        }

        await this.page.waitForLoadState('networkidle');

        // Extract trend data from chart or table
        const trendRows = await this.page.locator('.trend-data tr, [data-testid="trend-row"]').all();
        const trends: TrendData[] = [];

        for (const trendRow of trendRows) {
            const period = await trendRow.locator('td:nth-child(1)').textContent() || '';
            const successRate = await trendRow.locator('td:nth-child(2)').textContent() || '0';
            const enrollmentCount = await trendRow.locator('td:nth-child(3)').textContent() || '0';
            const completionCount = await trendRow.locator('td:nth-child(4)').textContent() || '0';

            trends.push({
                period: period.trim(),
                successRate: parseFloat(successRate.replace(/[^0-9.-]/g, '')) || 0,
                enrollmentCount: parseInt(enrollmentCount.replace(/[^0-9]/g, '')) || 0,
                completionCount: parseInt(completionCount.replace(/[^0-9]/g, '')) || 0
            });
        }

        return trends;
    }

    /**
     * Filter by intervention type
     * @param type Intervention type
     */
    async filterByType(type: string): Promise<void> {
        const typeFilter = this.page.locator('[data-testid="type-filter"], select.type-filter');
        await typeFilter.selectOption(type);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Filter by time period
     * @param period Time period ('current_year', 'last_year', 'last_3_years')
     */
    async filterByTimePeriod(period: string): Promise<void> {
        const periodFilter = this.page.locator('[data-testid="period-filter"], select.period-filter');
        await periodFilter.selectOption(period);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Validate success rate
     * @param interventionName Name of the intervention
     * @param expectedRate Expected success rate
     * @param tolerance Tolerance percentage
     * @returns True if success rate is within tolerance
     */
    async validateSuccessRate(interventionName: string, expectedRate: number, tolerance: number = 5): Promise<boolean> {
        const data = await this.getEffectivenessByName(interventionName);
        if (!data) {
            return false;
        }

        const lowerBound = expectedRate - tolerance;
        const upperBound = expectedRate + tolerance;
        return data.successRate >= lowerBound && data.successRate <= upperBound;
    }

    /**
     * Compare effectiveness between two interventions
     * @param intervention1 First intervention name
     * @param intervention2 Second intervention name
     * @returns Object with comparison results
     */
    async compareInterventions(intervention1: string, intervention2: string): Promise<{
        winner: string | null;
        difference: number;
        intervention1Data: EffectivenessData | null;
        intervention2Data: EffectivenessData | null;
    }> {
        const data1 = await this.getEffectivenessByName(intervention1);
        const data2 = await this.getEffectivenessByName(intervention2);

        let winner: string | null = null;
        let difference = 0;

        if (data1 && data2) {
            if (data1.successRate > data2.successRate) {
                winner = intervention1;
                difference = data1.successRate - data2.successRate;
            } else if (data2.successRate > data1.successRate) {
                winner = intervention2;
                difference = data2.successRate - data1.successRate;
            }
        }

        return {
            winner,
            difference,
            intervention1Data: data1,
            intervention2Data: data2
        };
    }

    /**
     * Export effectiveness report
     * @param format Export format ('csv', 'pdf', 'xlsx')
     */
    async exportReport(format: 'csv' | 'pdf' | 'xlsx'): Promise<void> {
        const exportButton = this.page.locator('[data-testid="export-report"], button.export');
        await exportButton.click();

        const formatOption = this.page.locator(`[data-format="${format}"]`);
        await formatOption.click();

        await this.page.waitForTimeout(2000);
    }
}