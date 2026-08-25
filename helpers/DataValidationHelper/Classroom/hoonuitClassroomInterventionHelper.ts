/**
 * Hoonuit Classroom Intervention Helper
 * Helper class for classroom intervention validations
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
import { Page, Locator, expect } from '@playwright/test';

export interface InterventionData {
    name: string;
    type: string;
    subType?: string;
    level?: string;
    status: string;
    startDate?: string;
    endDate?: string;
    enrollmentReason?: string;
    withdrawalReason?: string;
}

export interface ClassroomInterventionSummary {
    totalStudents: number;
    activeInterventions: number;
    completedInterventions: number;
    withdrawnInterventions: number;
}

/**
 * Classroom Intervention Helper
 * Provides methods for validating classroom intervention data
 */
export class HoonuitClassroomInterventionHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the intervention table locator
     * @returns Locator for the intervention table
     */
    private getInterventionTable(): Locator {
        return this.page.locator('[data-testid="intervention-table"], .intervention-table, table.interventions');
    }

    /**
     * Get all intervention rows
     * @returns Array of row locators
     */
    async getInterventionRows(): Promise<Locator[]> {
        const table = this.getInterventionTable();
        await expect(table).toBeVisible();
        return await table.locator('tbody tr').all();
    }

    /**
     * Get intervention count by status
     * @param status Status to filter by ('Active', 'Completed', 'Withdrawn')
     * @returns Count of interventions with the specified status
     */
    async getInterventionCountByStatus(status: string): Promise<number> {
        const rows = await this.getInterventionRows();
        let count = 0;

        for (const row of rows) {
            const statusCell = await row.locator('td[data-field="status"], td.status').textContent();
            if (statusCell && statusCell.trim().toLowerCase() === status.toLowerCase()) {
                count++;
            }
        }

        return count;
    }

    /**
     * Get all intervention names
     * @returns Array of intervention names
     */
    async getAllInterventionNames(): Promise<string[]> {
        const rows = await this.getInterventionRows();
        const names: string[] = [];

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td.name, td:first-child').textContent();
            if (nameCell) {
                names.push(nameCell.trim());
            }
        }

        return names;
    }

    /**
     * Get intervention data by name
     * @param interventionName Name of the intervention
     * @returns Intervention data object or null if not found
     */
    async getInterventionByName(interventionName: string): Promise<InterventionData | null> {
        const rows = await this.getInterventionRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td.name, td:first-child').textContent();
            if (nameCell && nameCell.trim() === interventionName) {
                return await this.extractInterventionData(row);
            }
        }

        return null;
    }

    /**
     * Extract intervention data from a row
     * @param row Row locator
     * @returns Intervention data object
     */
    private async extractInterventionData(row: Locator): Promise<InterventionData> {
        const cells = await row.locator('td').all();
        const data: InterventionData = {
            name: '',
            type: '',
            status: ''
        };

        // Extract data based on column position or data attributes
        for (const cell of cells) {
            const dataField = await cell.getAttribute('data-field');
            const text = (await cell.textContent())?.trim() || '';

            switch (dataField) {
                case 'name':
                    data.name = text;
                    break;
                case 'type':
                    data.type = text;
                    break;
                case 'subType':
                    data.subType = text;
                    break;
                case 'level':
                    data.level = text;
                    break;
                case 'status':
                    data.status = text;
                    break;
                case 'startDate':
                    data.startDate = text;
                    break;
                case 'endDate':
                    data.endDate = text;
                    break;
                case 'enrollmentReason':
                    data.enrollmentReason = text;
                    break;
                case 'withdrawalReason':
                    data.withdrawalReason = text;
                    break;
            }
        }

        // Fallback: extract by position if data-field not available
        if (!data.name && cells.length > 0) {
            data.name = (await cells[0].textContent())?.trim() || '';
        }
        if (!data.type && cells.length > 1) {
            data.type = (await cells[1].textContent())?.trim() || '';
        }
        if (!data.status && cells.length > 2) {
            data.status = (await cells[2].textContent())?.trim() || '';
        }

        return data;
    }

    /**
     * Get classroom intervention summary
     * @returns Summary object with counts
     */
    async getInterventionSummary(): Promise<ClassroomInterventionSummary> {
        const rows = await this.getInterventionRows();
        
        let activeCount = 0;
        let completedCount = 0;
        let withdrawnCount = 0;

        for (const row of rows) {
            const statusCell = await row.locator('td[data-field="status"], td.status').textContent();
            const status = statusCell?.trim().toLowerCase() || '';

            if (status === 'active') {
                activeCount++;
            } else if (status === 'completed') {
                completedCount++;
            } else if (status === 'withdrawn') {
                withdrawnCount++;
            }
        }

        return {
            totalStudents: rows.length,
            activeInterventions: activeCount,
            completedInterventions: completedCount,
            withdrawnInterventions: withdrawnCount
        };
    }

    /**
     * Validate intervention exists
     * @param interventionName Name of the intervention
     * @returns True if intervention exists
     */
    async interventionExists(interventionName: string): Promise<boolean> {
        const names = await this.getAllInterventionNames();
        return names.includes(interventionName);
    }

    /**
     * Click on an intervention row
     * @param interventionName Name of the intervention to click
     */
    async clickIntervention(interventionName: string): Promise<void> {
        const rows = await this.getInterventionRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td.name, td:first-child').textContent();
            if (nameCell && nameCell.trim() === interventionName) {
                await row.click();
                return;
            }
        }

        throw new Error(`Intervention "${interventionName}" not found`);
    }

    /**
     * Filter interventions by status
     * @param status Status to filter by
     */
    async filterByStatus(status: string): Promise<void> {
        const statusFilter = this.page.locator('[data-testid="status-filter"], select.status-filter, #statusFilter');
        await statusFilter.selectOption(status);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Search for interventions
     * @param searchTerm Search term
     */
    async searchInterventions(searchTerm: string): Promise<void> {
        const searchInput = this.page.locator('[data-testid="intervention-search"], input[type="search"], .search-input');
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Validate intervention status
     * @param interventionName Name of the intervention
     * @param expectedStatus Expected status
     * @returns True if status matches
     */
    async validateInterventionStatus(interventionName: string, expectedStatus: string): Promise<boolean> {
        const intervention = await this.getInterventionByName(interventionName);
        if (!intervention) {
            return false;
        }
        return intervention.status.toLowerCase() === expectedStatus.toLowerCase();
    }

    /**
     * Get interventions by type
     * @param type Intervention type
     * @returns Array of intervention names matching the type
     */
    async getInterventionsByType(type: string): Promise<string[]> {
        const rows = await this.getInterventionRows();
        const names: string[] = [];

        for (const row of rows) {
            const typeCell = await row.locator('td[data-field="type"], td.type').textContent();
            if (typeCell && typeCell.trim().toLowerCase() === type.toLowerCase()) {
                const nameCell = await row.locator('td[data-field="name"], td.name, td:first-child').textContent();
                if (nameCell) {
                    names.push(nameCell.trim());
                }
            }
        }

        return names;
    }

    /**
     * Export classroom intervention data
     * @param format Export format ('csv' or 'pdf')
     */
    async exportInterventions(format: 'csv' | 'pdf'): Promise<void> {
        const exportButton = this.page.locator('[data-testid="export-button"], button.export');
        await exportButton.click();

        const formatOption = this.page.locator(`[data-format="${format}"], button:has-text("${format.toUpperCase()}")`);
        await formatOption.click();

        // Wait for download to start
        await this.page.waitForTimeout(2000);
    }
}