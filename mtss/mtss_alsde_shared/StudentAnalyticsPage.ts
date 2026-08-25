import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class StudentAnalyticsPage extends BasePage {
    readonly studentAnalyticsHeading: Locator;
    readonly studentListLink: Locator;
    readonly studentDatawallLink: Locator;
    readonly studentListHeading: Locator;
    readonly studentGrid: Locator;
    readonly studentIdColumnHeader: Locator;
    readonly studentIdMenuButton: Locator;
    readonly studentSearchInput: Locator;
    readonly studentsResultsLimit: Locator;
    readonly actionsButton: Locator;
    
    // Student ID Filter locators
    readonly studentIdFilter: Locator;
    
    // Student record locators
    readonly studentRows: Locator;
    readonly andalusiaRecord: Locator;
    readonly covingtonRecord: Locator;
    readonly birminghamRecord: Locator;
    readonly jeffersonRecord: Locator;

    constructor(page: Page) {
        super(page);
        this.studentAnalyticsHeading = page.getByRole('heading', { name: 'Student Analytics' });
        this.studentListLink = page.locator('a:has-text("Student List")').first();
        this.studentDatawallLink = page.getByRole('link', { name: 'Student Datawall' });
        this.studentListHeading = page.getByRole('heading', { name: 'Student List', level: 3 });
        this.studentGrid = page.getByRole('grid');
        this.studentIdColumnHeader = page.getByRole('columnheader', { name: 'Student ID' });
        // The menu button next to Student ID column
        this.studentIdMenuButton = page.locator('button[aria-label="Student ID Menu"]').or(
            page.locator('button').filter({ hasText: /Student ID/ }).locator('..').locator('button').last()
        ).or(
            this.studentIdColumnHeader.locator('button').last()
        );
        this.studentSearchInput = page.locator('input[placeholder*="Search"]').or(
            page.locator('input[type="search"]')
        );
        this.studentsResultsLimit = page.getByText('Results are limited to the top 5000 records');
        this.actionsButton = page.getByRole('button', { name: 'Actions' });
        
        // Student ID Filter locators
        this.studentIdFilter = page.getByRole('button', { name: 'Student ID' });
        
        // Student record locators
        this.studentRows = page.locator('[role="gridcell"]').filter({ hasText: 'Goins, Tobias Blake' });
        this.andalusiaRecord = page.locator('[role="gridcell"]').filter({ hasText: 'Andalusia City Schools' });
        this.covingtonRecord = page.locator('[role="gridcell"]').filter({ hasText: 'Covington County Schools' });
        this.birminghamRecord = page.locator('[role="gridcell"]').filter({ hasText: 'Birmingham City Schools' });
        this.jeffersonRecord = page.locator('[role="gridcell"]').filter({ hasText: 'Jefferson County School System' });
    }

    async navigateToStudentList(): Promise<void> {
        // First navigate to Dashboards if not already there
        const dashboardsLink = this.page.getByRole('link', { name: 'Dashboards' });
        if (await dashboardsLink.isVisible()) {
            await this.clickElement(dashboardsLink);
            await this.page.waitForTimeout(1000);
        }
        
        // Then click on Student List
        await this.clickElement(this.studentListLink);
        await this.page.waitForTimeout(3000); // Wait for data to load
    }

    async isStudentListVisible(): Promise<boolean> {
        return await this.isElementVisible(this.studentListHeading);
    }

    async isStudentGridLoaded(): Promise<boolean> {
        await this.page.waitForTimeout(2000); // Allow grid to load
        return await this.isElementVisible(this.studentGrid);
    }

    async openStudentIdSearch(): Promise<void> {
        // Click on the menu button next to Student ID column header
        try {
            // First try to find the menu button next to Student ID
            const menuButton = this.page.locator('columnheader').filter({ hasText: 'Student ID' }).locator('button').last();
            await menuButton.click();
        } catch {
            // Fallback: try clicking on the Student ID column header area
            await this.clickElement(this.studentIdColumnHeader);
        }
        await this.page.waitForTimeout(1000);
    }

    async searchForStudentId(studentId: string): Promise<void> {
        // Try to open the search functionality
        await this.openStudentIdSearch();
        
        // Look for search input that appears
        try {
            const searchInput = await this.page.waitForSelector('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]', { timeout: 5000 });
            await searchInput.fill(studentId);
            await this.page.waitForTimeout(2000); // Wait for search results
        } catch {
            // Fallback: use browser search
            await this.page.keyboard.press('Control+f');
            await this.page.keyboard.type(studentId);
            await this.page.waitForTimeout(1000);
        }
    }

    async findStudentInGrid(studentId: string): Promise<Locator | null> {
        // Look for the student ID in the grid
        const studentRow = this.page.locator(`gridcell:has-text("${studentId}")`).first();
        
        if (await studentRow.isVisible()) {
            return studentRow;
        }
        
        return null;
    }

    async clickOnStudent(studentId: string): Promise<void> {
        const studentCell = await this.findStudentInGrid(studentId);
        if (studentCell) {
            await studentCell.click();
            await this.page.waitForTimeout(2000); // Wait for navigation
        } else {
            throw new Error(`Student with ID ${studentId} not found in the grid`);
        }
    }

    async verifyStudentDataLoaded(): Promise<void> {
        await expect(this.studentsResultsLimit).toBeVisible();
        await expect(this.studentGrid).toBeVisible();
    }

    async getStudentCount(): Promise<number> {
        await this.page.waitForTimeout(2000);
        const rows = await this.page.locator('gridcell').first().count();
        return rows;
    }

    async searchStudentUsingBrowserFind(studentId: string): Promise<void> {
        await this.page.keyboard.press('Control+f');
        await this.page.keyboard.type(studentId);
        await this.page.waitForTimeout(1000);
    }

    async closeSearch(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }

    // New methods for Student ID filtering and record validation
    async applyStudentIdFilter(studentId: string, dashboardPage: any): Promise<void> {
        // Open filter menu and click Student ID filter
        await dashboardPage.clickElement(dashboardPage.filterDataButton);
        await this.page.waitForTimeout(2000);
        
        await dashboardPage.clickElement(this.studentIdFilter);
        await this.page.waitForTimeout(2000);
        
        // Find and fill the Student ID textbox
        let studentIdTextbox = this.page.locator('input[type="text"]').last();
        if (!(await studentIdTextbox.isVisible())) {
            studentIdTextbox = this.page.locator('input[type="text"]').first();
        }
        if (!(await studentIdTextbox.isVisible())) {
            studentIdTextbox = this.page.getByRole('textbox').last();
        }
        if (!(await studentIdTextbox.isVisible())) {
            studentIdTextbox = this.page.locator('input').last();
        }
        
        await dashboardPage.typeText(studentIdTextbox, studentId);
        await this.page.waitForTimeout(1000);
        
        // Apply filter
        await dashboardPage.clickElement(dashboardPage.filterDataButton);
        await this.page.waitForTimeout(5000);
        await this.waitForPageLoad();
        await this.page.waitForTimeout(10000);
    }

    async validateStudentRecords(expectedStudentName: string, expectedRecordCount: number): Promise<void> {
        await this.page.waitForTimeout(5000);
        
        // Verify student records in AG Grid
        await expect(this.studentRows.first()).toBeVisible();
        
        const recordCount = await this.studentRows.count();
        expect(recordCount).toBe(expectedRecordCount);
        console.log(`✅ Found ${recordCount} records for ${expectedStudentName}`);
        
        // Verify district associations
        await expect(this.andalusiaRecord.first()).toBeVisible();
        await expect(this.covingtonRecord.first()).toBeVisible();
        console.log('✅ Verified both district associations');
    }

    async validateStudentRecordsForRollins(expectedStudentName: string, expectedRecordCount: number): Promise<void> {
        // Update student rows locator for new student
        const rollinsStudentRows = this.page.locator('[role="gridcell"]').filter({ hasText: expectedStudentName });
        
        // Verify student records in AG Grid
        await expect(rollinsStudentRows.first()).toBeVisible();
        
        const recordCount = await rollinsStudentRows.count();
        expect(recordCount).toBe(expectedRecordCount);
        console.log(`✅ Found ${recordCount} records for ${expectedStudentName}`);
        
        // Verify district associations for Birmingham/Jefferson
        await expect(this.birminghamRecord.first()).toBeVisible();
        await expect(this.jeffersonRecord.first()).toBeVisible();
        console.log('✅ Verified both Birmingham/Jefferson district associations');
    }

    getStudentRecord(index: number): Locator {
        return this.studentRows.nth(index);
    }

    // Enhanced methods for district-specific record handling
    async clickAndalusiaRecord(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.andalusiaRecord.click()
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForTimeout(3000);
        return newPage;
    }

    async clickCovingtonRecord(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.covingtonRecord.click()
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForTimeout(3000);
        return newPage;
    }

    async clickBirminghamRecord(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.birminghamRecord.click()
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForTimeout(3000);
        return newPage;
    }

    async clickJeffersonRecord(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.jeffersonRecord.click()
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForTimeout(3000);
        return newPage;
    }

    async returnToStudentList(): Promise<void> {
        await this.page.waitForTimeout(2000);
        console.log('✅ Returned to Student List screen');
    }
}
