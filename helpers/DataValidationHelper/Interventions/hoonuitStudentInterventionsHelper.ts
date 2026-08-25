/**
 * Hoonuit Student Interventions Helper
 * Helper class for student-level intervention validations
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
import { Page, Locator, expect } from '@playwright/test';

export interface StudentInterventionData {
    studentName: string;
    studentId: string;
    interventionName: string;
    interventionType: string;
    level: string;
    status: string;
    startDate: string;
    endDate?: string;
    enrollmentReason?: string;
    withdrawalReason?: string;
    progress?: number;
    goals?: string[];
}

export interface StudentInterventionSummary {
    studentName: string;
    studentId: string;
    totalInterventions: number;
    activeInterventions: number;
    completedInterventions: number;
    withdrawnInterventions: number;
    currentTier?: string;
}

export interface InterventionProgress {
    interventionName: string;
    progress: number;
    targetMet: boolean;
    lastUpdated: string;
}

/**
 * Student Interventions Helper
 * Provides methods for validating student-level intervention data
 */
export class HoonuitStudentInterventionsHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the student interventions container
     * @returns Locator for the container
     */
    private getContainer(): Locator {
        return this.page.locator('[data-testid="student-interventions"], .student-interventions-container');
    }

    /**
     * Get the interventions table
     * @returns Locator for the interventions table
     */
    private getInterventionsTable(): Locator {
        return this.page.locator('[data-testid="student-interventions-table"], table.student-interventions');
    }

    /**
     * Get all intervention rows for a student
     * @returns Array of row locators
     */
    async getInterventionRows(): Promise<Locator[]> {
        const table = this.getInterventionsTable();
        await expect(table).toBeVisible();
        return await table.locator('tbody tr').all();
    }

    /**
     * Get student intervention summary
     * @returns Student intervention summary object
     */
    async getStudentSummary(): Promise<StudentInterventionSummary> {
        const container = this.getContainer();

        const studentName = await container.locator('[data-field="studentName"], .student-name').textContent() || '';
        const studentId = await container.locator('[data-field="studentId"], .student-id').textContent() || '';
        const totalText = await container.locator('[data-metric="total"], .total-interventions').textContent() || '0';
        const activeText = await container.locator('[data-metric="active"], .active-interventions').textContent() || '0';
        const completedText = await container.locator('[data-metric="completed"], .completed-interventions').textContent() || '0';
        const withdrawnText = await container.locator('[data-metric="withdrawn"], .withdrawn-interventions').textContent() || '0';
        const tierText = await container.locator('[data-field="currentTier"], .current-tier').textContent();

        return {
            studentName: studentName.trim(),
            studentId: studentId.trim(),
            totalInterventions: parseInt(totalText.replace(/[^0-9]/g, '')) || 0,
            activeInterventions: parseInt(activeText.replace(/[^0-9]/g, '')) || 0,
            completedInterventions: parseInt(completedText.replace(/[^0-9]/g, '')) || 0,
            withdrawnInterventions: parseInt(withdrawnText.replace(/[^0-9]/g, '')) || 0,
            currentTier: tierText?.trim()
        };
    }

    /**
     * Get all interventions for the student
     * @returns Array of student intervention data
     */
    async getAllInterventions(): Promise<StudentInterventionData[]> {
        const rows = await this.getInterventionRows();
        const interventions: StudentInterventionData[] = [];

        for (const row of rows) {
            interventions.push(await this.extractInterventionData(row));
        }

        return interventions;
    }

    /**
     * Extract intervention data from a row
     * @param row Row locator
     * @returns Student intervention data
     */
    private async extractInterventionData(row: Locator): Promise<StudentInterventionData> {
        const studentName = await row.locator('td[data-field="studentName"]').textContent() || '';
        const studentId = await row.locator('td[data-field="studentId"]').textContent() || '';
        const interventionName = await row.locator('td[data-field="interventionName"]').textContent() || '';
        const interventionType = await row.locator('td[data-field="type"]').textContent() || '';
        const level = await row.locator('td[data-field="level"]').textContent() || '';
        const status = await row.locator('td[data-field="status"]').textContent() || '';
        const startDate = await row.locator('td[data-field="startDate"]').textContent() || '';
        const endDate = await row.locator('td[data-field="endDate"]').textContent();
        const enrollmentReason = await row.locator('td[data-field="enrollmentReason"]').textContent();
        const withdrawalReason = await row.locator('td[data-field="withdrawalReason"]').textContent();
        const progressText = await row.locator('td[data-field="progress"]').textContent();

        return {
            studentName: studentName.trim(),
            studentId: studentId.trim(),
            interventionName: interventionName.trim(),
            interventionType: interventionType.trim(),
            level: level.trim(),
            status: status.trim(),
            startDate: startDate.trim(),
            endDate: endDate?.trim(),
            enrollmentReason: enrollmentReason?.trim(),
            withdrawalReason: withdrawalReason?.trim(),
            progress: progressText ? parseFloat(progressText.replace(/[^0-9.-]/g, '')) : undefined
        };
    }

    /**
     * Get intervention by name
     * @param interventionName Name of the intervention
     * @returns Intervention data or null
     */
    async getInterventionByName(interventionName: string): Promise<StudentInterventionData | null> {
        const interventions = await this.getAllInterventions();
        return interventions.find(i => i.interventionName === interventionName) || null;
    }

    /**
     * Get active interventions
     * @returns Array of active intervention data
     */
    async getActiveInterventions(): Promise<StudentInterventionData[]> {
        const interventions = await this.getAllInterventions();
        return interventions.filter(i => i.status.toLowerCase() === 'active');
    }

    /**
     * Get interventions by status
     * @param status Intervention status
     * @returns Array of intervention data
     */
    async getInterventionsByStatus(status: string): Promise<StudentInterventionData[]> {
        const interventions = await this.getAllInterventions();
        return interventions.filter(i => i.status.toLowerCase() === status.toLowerCase());
    }

    /**
     * Get interventions by type
     * @param type Intervention type
     * @returns Array of intervention data
     */
    async getInterventionsByType(type: string): Promise<StudentInterventionData[]> {
        const interventions = await this.getAllInterventions();
        return interventions.filter(i => i.interventionType.toLowerCase() === type.toLowerCase());
    }

    /**
     * Get intervention progress data
     * @returns Array of intervention progress
     */
    async getInterventionProgress(): Promise<InterventionProgress[]> {
        const container = this.getContainer();
        const progressItems = await container.locator('.progress-item, [data-testid="intervention-progress"]').all();
        const progress: InterventionProgress[] = [];

        for (const item of progressItems) {
            const name = await item.locator('.intervention-name').textContent() || '';
            const progressValue = await item.locator('.progress-value').textContent() || '0';
            const targetMet = (await item.locator('.target-met, [data-target-met]').getAttribute('data-target-met')) === 'true';
            const lastUpdated = await item.locator('.last-updated').textContent() || '';

            progress.push({
                interventionName: name.trim(),
                progress: parseFloat(progressValue.replace(/[^0-9.-]/g, '')) || 0,
                targetMet,
                lastUpdated: lastUpdated.trim()
            });
        }

        return progress;
    }

    /**
     * Click on an intervention
     * @param interventionName Name of the intervention
     */
    async clickIntervention(interventionName: string): Promise<void> {
        const rows = await this.getInterventionRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="interventionName"]').textContent();
            if (nameCell && nameCell.trim() === interventionName) {
                await row.click();
                await this.page.waitForLoadState('networkidle');
                return;
            }
        }

        throw new Error(`Intervention "${interventionName}" not found for student`);
    }

    /**
     * Add student to intervention
     * @param interventionName Name of the intervention
     * @param enrollmentReason Reason for enrollment
     */
    async addToIntervention(interventionName: string, enrollmentReason?: string): Promise<void> {
        const addButton = this.page.locator('[data-testid="add-intervention"], button:has-text("Add to Intervention")');
        await addButton.click();

        // Select intervention
        const interventionSelect = this.page.locator('[data-testid="intervention-select"], select.intervention-select');
        await interventionSelect.selectOption(interventionName);

        // Enter enrollment reason if provided
        if (enrollmentReason) {
            const reasonInput = this.page.locator('[data-testid="enrollment-reason"], textarea.enrollment-reason');
            await reasonInput.fill(enrollmentReason);
        }

        // Submit
        const submitButton = this.page.locator('[data-testid="submit-enrollment"], button:has-text("Add"), button:has-text("Enroll")');
        await submitButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Remove student from intervention
     * @param interventionName Name of the intervention
     * @param withdrawalReason Reason for withdrawal
     */
    async removeFromIntervention(interventionName: string, withdrawalReason?: string): Promise<void> {
        const rows = await this.getInterventionRows();

        for (const row of rows) {
            const nameCell = await row.locator('td[data-field="interventionName"]').textContent();
            if (nameCell && nameCell.trim() === interventionName) {
                const removeButton = row.locator('[data-testid="remove-btn"], button.remove');
                await removeButton.click();
                break;
            }
        }

        // Enter withdrawal reason if required
        if (withdrawalReason) {
            const reasonInput = this.page.locator('[data-testid="withdrawal-reason"], textarea.withdrawal-reason');
            await reasonInput.fill(withdrawalReason);
        }

        // Confirm
        const confirmButton = this.page.locator('[data-testid="confirm-removal"], button:has-text("Confirm"), button:has-text("Remove")');
        await confirmButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Validate student is enrolled in intervention
     * @param interventionName Name of the intervention
     * @returns True if enrolled
     */
    async isEnrolledInIntervention(interventionName: string): Promise<boolean> {
        const intervention = await this.getInterventionByName(interventionName);
        return intervention !== null && intervention.status.toLowerCase() !== 'withdrawn';
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
     * Filter by type
     * @param type Intervention type
     */
    async filterByType(type: string): Promise<void> {
        const typeFilter = this.page.locator('[data-testid="type-filter"], select.type-filter');
        await typeFilter.selectOption(type);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get intervention history
     * @returns Array of historical intervention data
     */
    async getInterventionHistory(): Promise<StudentInterventionData[]> {
        // Click on history tab/button if exists
        const historyTab = this.page.locator('[data-testid="history-tab"], button:has-text("History")');
        if (await historyTab.isVisible()) {
            await historyTab.click();
            await this.page.waitForLoadState('networkidle');
        }

        return await this.getAllInterventions();
    }

    /**
     * Export student intervention data
     * @param format Export format
     */
    async exportData(format: 'csv' | 'pdf'): Promise<void> {
        const exportButton = this.page.locator('[data-testid="export-student-interventions"], button.export');
        await exportButton.click();

        const formatOption = this.page.locator(`[data-format="${format}"]`);
        await formatOption.click();

        await this.page.waitForTimeout(2000);
    }

    /**
     * View intervention details
     * @param interventionName Name of the intervention
     */
    async viewInterventionDetails(interventionName: string): Promise<void> {
        await this.clickIntervention(interventionName);
    }

    /**
     * Get goals for an intervention
     * @param interventionName Name of the intervention
     * @returns Array of goal names
     */
    async getInterventionGoals(interventionName: string): Promise<string[]> {
        await this.clickIntervention(interventionName);

        const goalElements = await this.page.locator('.goal-item, [data-testid="goal"]').all();
        const goals: string[] = [];

        for (const goalElement of goalElements) {
            const goalName = await goalElement.textContent();
            if (goalName) {
                goals.push(goalName.trim());
            }
        }

        return goals;
    }
}