/**
 * Hoonuit Goal Datawall Helper
 * Helper class for intervention goal datawall validations
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
import { Page, Locator, expect } from '@playwright/test';

export interface GoalData {
    goalName: string;
    goalType: string;
    targetValue: number;
    currentValue: number;
    progress: number;
    status: string;
    startDate?: string;
    endDate?: string;
    studentCount?: number;
}

export interface DatawallSummary {
    totalGoals: number;
    onTrackCount: number;
    atRiskCount: number;
    offTrackCount: number;
    completedCount: number;
}

/**
 * Goal Datawall Helper
 * Provides methods for validating goal datawall data
 */
export class HoonuitGoalDatawallHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the goal datawall container
     * @returns Locator for the datawall container
     */
    private getDatawallContainer(): Locator {
        return this.page.locator('[data-testid="goal-datawall"], .goal-datawall, .datawall-container');
    }

    /**
     * Get all goal cards
     * @returns Array of goal card locators
     */
    async getGoalCards(): Promise<Locator[]> {
        const container = this.getDatawallContainer();
        await expect(container).toBeVisible();
        return await container.locator('.goal-card, [data-testid="goal-card"]').all();
    }

    /**
     * Get goal data by name
     * @param goalName Name of the goal
     * @returns Goal data object or null if not found
     */
    async getGoalByName(goalName: string): Promise<GoalData | null> {
        const cards = await this.getGoalCards();

        for (const card of cards) {
            const nameElement = await card.locator('.goal-name, [data-field="name"]').textContent();
            if (nameElement && nameElement.trim() === goalName) {
                return await this.extractGoalData(card);
            }
        }

        return null;
    }

    /**
     * Extract goal data from a card
     * @param card Goal card locator
     * @returns Goal data object
     */
    private async extractGoalData(card: Locator): Promise<GoalData> {
        const goalName = await card.locator('.goal-name, [data-field="name"]').textContent() || '';
        const goalType = await card.locator('.goal-type, [data-field="type"]').textContent() || '';
        const targetValue = await card.locator('.target-value, [data-field="target"]').textContent() || '0';
        const currentValue = await card.locator('.current-value, [data-field="current"]').textContent() || '0';
        const progress = await card.locator('.progress-value, [data-field="progress"]').textContent() || '0';
        const status = await card.locator('.goal-status, [data-field="status"]').textContent() || '';
        const startDate = await card.locator('.start-date, [data-field="startDate"]').textContent();
        const endDate = await card.locator('.end-date, [data-field="endDate"]').textContent();
        const studentCountText = await card.locator('.student-count, [data-field="studentCount"]').textContent();

        return {
            goalName: goalName.trim(),
            goalType: goalType.trim(),
            targetValue: parseFloat(targetValue.replace(/[^0-9.-]/g, '')) || 0,
            currentValue: parseFloat(currentValue.replace(/[^0-9.-]/g, '')) || 0,
            progress: parseFloat(progress.replace(/[^0-9.-]/g, '')) || 0,
            status: status.trim(),
            startDate: startDate?.trim(),
            endDate: endDate?.trim(),
            studentCount: studentCountText ? parseInt(studentCountText.replace(/[^0-9]/g, '')) : undefined
        };
    }

    /**
     * Get datawall summary
     * @returns Summary object with counts
     */
    async getDatawallSummary(): Promise<DatawallSummary> {
        const cards = await this.getGoalCards();
        
        let onTrackCount = 0;
        let atRiskCount = 0;
        let offTrackCount = 0;
        let completedCount = 0;

        for (const card of cards) {
            const statusText = await card.locator('.goal-status, [data-field="status"]').textContent();
            const status = statusText?.trim().toLowerCase() || '';

            if (status.includes('on track') || status.includes('ontrack')) {
                onTrackCount++;
            } else if (status.includes('at risk') || status.includes('atrisk')) {
                atRiskCount++;
            } else if (status.includes('off track') || status.includes('offtrack')) {
                offTrackCount++;
            } else if (status.includes('completed') || status.includes('met')) {
                completedCount++;
            }
        }

        return {
            totalGoals: cards.length,
            onTrackCount,
            atRiskCount,
            offTrackCount,
            completedCount
        };
    }

    /**
     * Get goals by status
     * @param status Goal status ('On Track', 'At Risk', 'Off Track', 'Completed')
     * @returns Array of goal names
     */
    async getGoalsByStatus(status: string): Promise<string[]> {
        const cards = await this.getGoalCards();
        const goalNames: string[] = [];

        for (const card of cards) {
            const statusText = await card.locator('.goal-status, [data-field="status"]').textContent();
            if (statusText && statusText.trim().toLowerCase().includes(status.toLowerCase())) {
                const nameText = await card.locator('.goal-name, [data-field="name"]').textContent();
                if (nameText) {
                    goalNames.push(nameText.trim());
                }
            }
        }

        return goalNames;
    }

    /**
     * Filter datawall by goal type
     * @param goalType Type to filter by
     */
    async filterByGoalType(goalType: string): Promise<void> {
        const typeFilter = this.page.locator('[data-testid="goal-type-filter"], select.goal-type-filter');
        await typeFilter.selectOption(goalType);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Filter datawall by status
     * @param status Status to filter by
     */
    async filterByStatus(status: string): Promise<void> {
        const statusFilter = this.page.locator('[data-testid="goal-status-filter"], select.goal-status-filter');
        await statusFilter.selectOption(status);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click on a goal card
     * @param goalName Name of the goal to click
     */
    async clickGoal(goalName: string): Promise<void> {
        const cards = await this.getGoalCards();

        for (const card of cards) {
            const nameElement = await card.locator('.goal-name, [data-field="name"]').textContent();
            if (nameElement && nameElement.trim() === goalName) {
                await card.click();
                return;
            }
        }

        throw new Error(`Goal "${goalName}" not found`);
    }

    /**
     * Validate goal progress
     * @param goalName Name of the goal
     * @param expectedProgress Expected progress percentage
     * @param tolerance Tolerance percentage (default 5%)
     * @returns True if progress is within tolerance
     */
    async validateGoalProgress(goalName: string, expectedProgress: number, tolerance: number = 5): Promise<boolean> {
        const goal = await this.getGoalByName(goalName);
        if (!goal) {
            return false;
        }

        const lowerBound = expectedProgress - tolerance;
        const upperBound = expectedProgress + tolerance;
        return goal.progress >= lowerBound && goal.progress <= upperBound;
    }

    /**
     * Get progress bar color for a goal
     * @param goalName Name of the goal
     * @returns Color value or null
     */
    async getProgressBarColor(goalName: string): Promise<string | null> {
        const cards = await this.getGoalCards();

        for (const card of cards) {
            const nameElement = await card.locator('.goal-name, [data-field="name"]').textContent();
            if (nameElement && nameElement.trim() === goalName) {
                const progressBar = card.locator('.progress-bar, [data-testid="progress-bar"]');
                const backgroundColor = await progressBar.evaluate(el => 
                    window.getComputedStyle(el).backgroundColor
                );
                return backgroundColor;
            }
        }

        return null;
    }

    /**
     * Sort datawall
     * @param sortBy Field to sort by
     * @param order Sort order ('asc' or 'desc')
     */
    async sortDatawall(sortBy: string, order: 'asc' | 'desc' = 'asc'): Promise<void> {
        const sortButton = this.page.locator(`[data-sort-field="${sortBy}"], button:has-text("${sortBy}")`);
        await sortButton.click();
        
        if (order === 'desc') {
            // Click again for descending order
            await sortButton.click();
        }
        
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Export datawall data
     * @param format Export format ('csv' or 'pdf')
     */
    async exportDatawall(format: 'csv' | 'pdf'): Promise<void> {
        const exportButton = this.page.locator('[data-testid="export-datawall"], button.export');
        await exportButton.click();

        const formatOption = this.page.locator(`[data-format="${format}"]`);
        await formatOption.click();

        await this.page.waitForTimeout(2000);
    }
}