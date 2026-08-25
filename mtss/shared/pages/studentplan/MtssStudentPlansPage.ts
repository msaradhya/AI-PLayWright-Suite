import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from '../base/MtssBasePage';
import { MtssActionsGridTable } from '../base/table/MtssActionsGridTable';
import { MtssCreateAStudentPlanDialog } from '../dialog/MtssCreateAStudentPlanDialog';
import { MtssBulkEditStudentPlansDialog } from '../dialog/MtssBulkEditStudentPlansDialog';
import { MtssHelper } from '../../helpers/MtssHelper';
import { MtssException } from '../../exceptions/MtssException';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Student Plans Page - Playwright Implementation
 * Converted from Java: MtssStudentPlansPage.java
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 10-08-2020
 */
export class MtssStudentPlansPage extends MtssBasePage {
  private readonly grid: Locator;
  private readonly dialog: Locator;
  private readonly createNewPlanButton: Locator;
  private readonly bulkEditButton: Locator;
  private readonly planNameColumnTextbox: Locator;

  constructor(page: Page) {
    super(page);
    this.grid = page.locator('ag-grid-angular');
    this.dialog = page.locator("div[class*='modal-dialog']");
    this.createNewPlanButton = page.locator('button.pds-button.pds-primary');
    this.bulkEditButton = page.locator('button.pds-button');
    this.planNameColumnTextbox = page.locator("input[aria-label='Plan Name Filter Input']");
  }

  protected pageTitle(): string | null {
    return null;
  }

  /**
   * Get file content from various file types
   * Converts Java static method getFileContent()
   * @param filePath - Path to the file
   * @returns File content as string
   */
  static async getFileContent(filePath: string): Promise<string> {
    try {
      const fileExtension = path.extname(filePath).toLowerCase();
      
      if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        // For Excel files, would need a library like 'xlsx' or 'exceljs'
        // This is a placeholder implementation
        const buffer = await fs.readFile(filePath);
        return buffer.toString('utf-8'); // Simplified - would need proper Excel parsing
      } else if (fileExtension === '.pdf') {
        // For PDF files, would need a library like 'pdf-parse'
        // This is a placeholder implementation
        const buffer = await fs.readFile(filePath);
        return buffer.toString('utf-8'); // Simplified - would need proper PDF parsing
      } else {
        // For text files
        const content = await fs.readFile(filePath, 'utf-8');
        return content.replace(/\r/g, ''); // Remove carriage returns like Java version
      }
    } catch (error) {
      throw new Error(`Error while reading the file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get student plans table
   * @returns MtssStudentPlanTable instance
   */
  getStudentPlansTable(): MtssStudentPlanTable {
    return new MtssStudentPlanTable(this.page, this.grid);
  }

  /**
   * Get create a student plan dialog
   * @returns MtssCreateAStudentPlanDialog instance
   */
  getCreateAStudentPlanDialog(): MtssCreateAStudentPlanDialog {
    return new MtssCreateAStudentPlanDialog(this.page, this.dialog);
  }

  /**
   * Click create new plan button
   */
  async clickCreateNewPlanButton(): Promise<void> {
    await this.createNewPlanButton.click();
  }

  /**
   * Click bulk edit button
   */
  async clickBulkEditButton(): Promise<void> {
    await this.bulkEditButton.filter({ hasText: 'Bulk Edit' }).first().click();
  }

  /**
   * Get bulk edit student plans dialog
   * @returns MtssBulkEditStudentPlansDialog instance
   */
  getBulkEditStudentPlansDialog(): MtssBulkEditStudentPlansDialog {
    return new MtssBulkEditStudentPlansDialog(this.page, this.dialog);
  }

  /**
   * Set plan name column filter
   * @param planName - Plan name to filter by
   */
  async setPlanNameColumn(planName: string): Promise<void> {
    // Wait for element to be displayed (equivalent to WaitFor.waitForIsDisplayed)
    await this.planNameColumnTextbox.waitFor({ state: 'visible', timeout: 30000 });
    await this.planNameColumnTextbox.fill(planName);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Click edit plan name button
   */
  async editPlanNameButton(): Promise<void> {
    await this.page.locator("[aria-label='Edit plan properties']").click();
  }

  /**
   * Get plan name
   * @returns Plan name text
   */
  async getPlanName(): Promise<string> {
    return await this.page.locator("[class='d-flex'] h1").textContent() || '';
  }
}

/**
 * Student Plan Table class - extends MtssActionsGridTable
 * Converted from Java inner class MtssStudentPlanTable
 */
export class MtssStudentPlanTable extends MtssActionsGridTable {
  protected page: Page;
  
  constructor(page: Page, tableElement: Locator) {
    super(tableElement);
    this.page = page;
  }

  /**
   * Set header checkbox for a specific column
   * Overrides parent method with specific logic for student plan table
   * @param columnIndex - Index of the column
   * @param set - true to check, false to uncheck
   */
  async setHeaderCheckbox(columnIndex: number, set: boolean): Promise<void> {
    const headers = await this.getHeadersArray();
    
    if (columnIndex >= headers.length) {
      throw new MtssException(`Column index ${columnIndex} is out of range. Available columns: ${headers.length}`);
    }

    const headerCell = headers[columnIndex];
    const checkbox = headerCell.locator("[type='checkbox']");
    
    if (await checkbox.count() > 0) {
      const isSelected = await checkbox.isChecked();
      if (isSelected !== set) {
        await headerCell.click();
        await headerCell.press('Tab'); // To trigger event like Java version
      }
    } else {
      throw new MtssException(`Could not find checkbox for column index: ${columnIndex}`);
    }
  }

  /**
   * Get all header cells as array
   * @returns Array of header cell locators
   */
  private async getHeadersArray(): Promise<Locator[]> {
    const headerRow = this.tableElement.locator('.ag-header-row').first();
    const headerCells = headerRow.locator('.ag-header-cell');
    const count = await headerCells.count();
    
    const headers: Locator[] = [];
    for (let i = 0; i < count; i++) {
      headers.push(headerCells.nth(i));
    }
    
    return headers;
  }

  /**
   * Get specific header cell by index
   * @param index - Index of the header cell
   * @returns Header cell locator
   */
  async getHeaderCell(index: number): Promise<Locator> {
    const headers = await this.getHeadersArray();
    if (index >= headers.length) {
      throw new MtssException(`Header index ${index} is out of range. Available headers: ${headers.length}`);
    }
    return headers[index];
  }

  /**
   * Get header cell by column name
   * @param columnName - Name of the column
   * @returns Header cell locator
   */
  async getHeaderCellByName(columnName: string): Promise<Locator> {
    const headerCell = this.tableElement
      .locator('.ag-header-cell')
      .filter({ hasText: columnName });
    
    if (await headerCell.count() === 0) {
      throw new MtssException(`Could not find header cell with name: ${columnName}`);
    }
    
    return headerCell.first();
  }

  /**
   * Check if header checkbox is selected for a column
   * @param columnIndex - Index of the column
   * @returns true if selected, false otherwise
   */
  async isHeaderCheckboxSelected(columnIndex: number): Promise<boolean> {
    const headerCell = await this.getHeaderCell(columnIndex);
    const checkbox = headerCell.locator("[type='checkbox']");
    
    if (await checkbox.count() > 0) {
      return await checkbox.isChecked();
    }
    
    return false;
  }

  /**
   * Get total number of rows in the table
   * @returns Number of rows
   */
  async getRowCount(): Promise<number> {
    const rows = this.tableElement.locator('.ag-row');
    return await rows.count();
  }

  /**
   * Get cell value by row and column index
   * @param rowIndex - Index of the row
   * @param columnIndex - Index of the column
   * @returns Cell value as string
   */
  async getCellValueByIndex(rowIndex: number, columnIndex: number): Promise<string> {
    const row = this.tableElement.locator('.ag-row').nth(rowIndex);
    const cell = row.locator('.ag-cell').nth(columnIndex);
    return await cell.textContent() || '';
  }

  /**
   * Get cell by row and column name
   * @param rowIndex - Index of the row
   * @param columnName - Name of the column
   * @returns Cell locator
   */
  async getCellByColumnName(rowIndex: number, columnName: string): Promise<Locator> {
    const row = this.tableElement.locator('.ag-row').nth(rowIndex);
    const cell = row.locator(`[col-id="${columnName}"]`);
    return cell;
  }

  /**
   * Click on a specific cell
   * @param rowIndex - Index of the row
   * @param columnIndex - Index of the column
   */
  async clickCell(rowIndex: number, columnIndex: number): Promise<void> {
    const row = this.tableElement.locator('.ag-row').nth(rowIndex);
    const cell = row.locator('.ag-cell').nth(columnIndex);
    await cell.click();
  }

  /**
   * Select row by index
   * @param rowIndex - Index of the row to select
   */
  async selectRow(rowIndex: number): Promise<void> {
    const row = this.tableElement.locator('.ag-row').nth(rowIndex);
    const checkbox = row.locator("[type='checkbox']").first();
    
    if (await checkbox.count() > 0) {
      await checkbox.check();
    } else {
      // If no checkbox, click the row to select it
      await row.click();
    }
  }

  /**
   * Check if row is selected
   * @param rowIndex - Index of the row
   * @returns true if selected, false otherwise
   */
  async isRowSelected(rowIndex: number): Promise<boolean> {
    const row = this.tableElement.locator('.ag-row').nth(rowIndex);
    const checkbox = row.locator("[type='checkbox']").first();
    
    if (await checkbox.count() > 0) {
      return await checkbox.isChecked();
    }
    
    // Check if row has selected class
    return await row.getAttribute('class').then(classes => 
      classes?.includes('ag-row-selected') || false
    );
  }
}
