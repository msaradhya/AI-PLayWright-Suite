/**
 * Hoonuit Intervention List Helper
 * Helper class for intervention list validations
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
import { Page, Locator, expect } from '@playwright/test';

export interface InterventionListItem {
    name: string;
    type: string;
    subType?: string;
    level: string;
    status: string;
    enrolledCount: number;
    activeCount: number;
    completedCount: number;
}

export interface InterventionListSummary {
    totalInterventions: number;
    activeInterventions: number;
    archivedInterventions: number;
    totalEnrolled: number;
}

/**
 * Intervention List Helper
 * Provides methods for validating intervention list data
 */
export class HoonuitInterventionListHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the intervention list container
     * @returns Locator for the list container
     */
    private getListContainer(): Locator {
        return this.page.locator('[data-testid="intervention-list"], .intervention-list-container');
    }

    /**
     * Get the intervention list table
     * @returns Locator for the list table
     */
    private getListTable(): Locator {
        return this.page.locator('[data-testid="intervention-list-table"], table.intervention-list');
    }

    /**
     * Get all intervention rows
     * @returns Array of row locators
     */
    async getInterventionRows(): Promise<Locator[]> {
        const table = this.getListTable();
        await expect(table).toBeVisible();
        return await table.locator('tbody tr').all();
    }

    /**
     * Get intervention by name
     * @param name Intervention name
     * @returns Intervention list item or null
     */
    async getInterventionByName(name: string): Promise<InterventionListItem | null> {
        const rows = await this.getInterventionRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            if (nameCell && nameCell.trim() === name) {
                return await this.extractInterventionData(row);
            }
        }

        return null;
    }

    /**
     * Extract intervention data from a row
     * @param row Row locator
     * @returns Intervention list item
     */
    private async extractInterventionData(row: Locator): Promise<InterventionListItem> {
        const name = await row.locator('td[data-field="name"], td:first-child').textContent() || '';
        const type = await row.locator('td[data-field="type"]').textContent() || '';
        const subType = await row.locator('td[data-field="subType"]').textContent();
        const level = await row.locator('td[data-field="level"]').textContent() || '';
        const status = await row.locator('td[data-field="status"]').textContent() || '';
        const enrolledCount = await row.locator('td[data-field="enrolled"]').textContent() || '0';
        const activeCount = await row.locator('td[data-field="active"]').textContent() || '0';
        const completedCount = await row.locator('td[data-field="completed"]').textContent() || '0';

        return {
            name: name.trim(),
            type: type.trim(),
            subType: subType?.trim(),
            level: level.trim(),
            status: status.trim(),
            enrolledCount: parseInt(enrolledCount.replace(/[^0-9]/g, '')) || 0,
            activeCount: parseInt(activeCount.replace(/[^0-9]/g, '')) || 0,
            completedCount: parseInt(completedCount.replace(/[^0-9]/g, '')) || 0
        };
    }

    /**
     * Get all intervention names
     * @returns Array of intervention names
     */
    async getAllInterventionNames(): Promise<string[]> {
        const rows = await this.getInterventionRows();
        const names: string[] = [];

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            if (nameCell) {
                names.push(nameCell.trim());
            }
        }

        return names;
    }

    /**
     * Get interventions by type
     * @param type Intervention type
     * @returns Array of intervention names
     */
    async getInterventionsByType(type: string): Promise<string[]> {
        const rows = await this.getInterventionRows();
        const names: string[] = [];

        for (const row of rows) {
            const typeCell = await row.locator('td[data-field="type"]').textContent();
            if (typeCell && typeCell.trim().toLowerCase() === type.toLowerCase()) {
                const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
                if (nameCell) {
                    names.push(nameCell.trim());
                }
            }
        }

        return names;
    }

    /**
     * Get interventions by level
     * @param level Intervention level (Tier 1, Tier 2, Tier 3)
     * @returns Array of intervention names
     */
    async getInterventionsByLevel(level: string): Promise<string[]> {
        const rows = await this.getInterventionRows();
        const names: string[] = [];

        for (const row of rows) {
            const levelCell = await row.locator('td[data-field="level"]').textContent();
            if (levelCell && levelCell.trim().toLowerCase().includes(level.toLowerCase())) {
                const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
                if (nameCell) {
                    names.push(nameCell.trim());
                }
            }
        }

        return names;
    }

    /**
     * Get intervention list summary
     * @returns Summary object
     */
    async getListSummary(): Promise<InterventionListSummary> {
        const rows = await this.getInterventionRows();
        
        let activeCount = 0;
        let archivedCount = 0;
        let totalEnrolled = 0;

        for (const row of rows) {
            const statusCell = await row.locator('td[data-field="status"]').textContent();
            const status = statusCell?.trim().toLowerCase() || '';

            if (status === 'active') {
                activeCount++;
            } else if (status === 'archived') {
                archivedCount++;
            }

            const enrolledCell = await row.locator('td[data-field="enrolled"]').textContent();
            totalEnrolled += parseInt(enrolledCell?.replace(/[^0-9]/g, '') || '0');
        }

        return {
            totalInterventions: rows.length,
            activeInterventions: activeCount,
            archivedInterventions: archivedCount,
            totalEnrolled
        };
    }

    /**
     * Search interventions
     * @param searchTerm Search term
     */
    async searchInterventions(searchTerm: string): Promise<void> {
        const searchInput = this.page.locator('[data-testid="intervention-search"], input.search-interventions');
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Filter by type
     * @param type Intervention type
     */
    async filterByType(type: string): Promise<void> {
        const typeFilter = this.page.locator('[data-testid="type-filter"], select.type-filter');
        await typeFilter.selectOption(type);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Filter by level
     * @param level Intervention level
     */
    async filterByLevel(level: string): Promise<void> {
        const levelFilter = this.page.locator('[data-testid="level-filter"], select.level-filter');
        await levelFilter.selectOption(level);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Filter by status
     * @param status Intervention status
     */
    async filterByStatus(status: string): Promise<void> {
        const statusFilter = this.page.locator('[data-testid="status-filter"], select.status-filter');
        await statusFilter.selectOption(status);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Sort list
     * @param field Field to sort by
     * @param order Sort order
     */
    async sortList(field: string, order: 'asc' | 'desc' = 'asc'): Promise<void> {
        const headerCell = this.page.locator(`th[data-field="${field}"], th:has-text("${field}")`);
        await headerCell.click();
        
        if (order === 'desc') {
            await headerCell.click();
        }
        
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click on intervention
     * @param name Intervention name
     */
    async clickIntervention(name: string): Promise<void> {
        const rows = await this.getInterventionRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            if (nameCell && nameCell.trim() === name) {
                await row.click();
                return;
            }
        }

        throw new Error(`Intervention "${name}" not found`);
    }

    /**
     * Create new intervention
     */
    async clickCreateIntervention(): Promise<void> {
        const createButton = this.page.locator('[data-testid="create-intervention"], button:has-text("Create"), button:has-text("Add")');
        await createButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Delete intervention
     * @param name Intervention name
     */
    async deleteIntervention(name: string): Promise<void> {
        const rows = await this.getInterventionRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="name"], td:first-child').textContent();
            if (nameCell && nameCell.trim() === name) {
                const deleteButton = row.locator('[data-testid="delete-btn"], button.delete');
                await deleteButton.click();
                
                // Confirm deletion
                const confirmButton = this.page.locator('[data-testid="confirm-delete"], button:has-text("Confirm"), button:has-text("Yes")');
                await confirmButton.click();
                await this.page.waitForLoadState('networkidle');
                return;
            }
        }

        throw new Error(`Intervention "${name}" not found`);
    }

    /**
     * Get intervention count
     * @returns Number of interventions
     */
    async getInterventionCount(): Promise<number> {
        const rows = await this.getInterventionRows();
        return rows.length;
    }

    /**
     * Validate intervention exists
     * @param name Intervention name
     * @returns True if exists
     */
    async interventionExists(name: string): Promise<boolean> {
        const names = await this.getAllInterventionNames();
        return names.includes(name);
    }

    /**
     * Export list
     * @param format Export format
     */
    async exportList(format: 'csv' | 'pdf' | 'xlsx'): Promise<void> {
        const exportButton = this.page.locator('[data-testid="export-list"], button.export');
        await exportButton.click();

        const formatOption = this.page.locator(`[data-format="${format}"]`);
        await formatOption.click();

        await this.page.waitForTimeout(2000);
    }
}