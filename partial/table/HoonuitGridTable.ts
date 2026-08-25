import { Page, Locator } from '@playwright/test';
import HoonuitBaseTable from '../../base/table/HoonuitBaseTable';
import { HoonuitException } from '../../../exceptions/HoonuitException';
import { HoonuitTableException } from '../../../exceptions/HoonuitTableException';

/**
 * Grid Table implementation for Hoonuit dashboards
 * @author aradhyas (converted from Java by Sourav.Panda)
 * @since 18/05/2025 (original: 4/14/2021)
 */
export default class HoonuitGridTable extends HoonuitBaseTable {
  protected readonly tableTitle: string;

  /**
   * Constructor with table title
   * @param page - Playwright Page object
   * @param title - Table title
   */
  constructor(page: Page, title: string);
  
  /**
   * Constructor with table element
   * @param page - Playwright Page object
   * @param tableElement - Table element locator
   */
  constructor(page: Page, tableElement: Locator);
  
  constructor(page: Page, titleOrElement: string | Locator) {
    // Handle type checking and call appropriate super constructor
    if (typeof titleOrElement === 'string') {
      super(page, titleOrElement);
      this.tableTitle = titleOrElement.trim();
    } else {
      super(page, titleOrElement);
      this.tableTitle = '';
    }
  }

  // Selectors as getters to avoid initialization issues
  private get tableBodySelector() { return 'div.ag-body-viewport'; }
  private get tableHeaderSelector() { return 'div.ag-header'; }
  private get headerCellsSelector() { return 'div.ag-header-cell:not([col-id="checkbox"])'; }
  private get rowsSelector() { return 'div[role="rowgroup"] > div[role="row"]:not(.ag-header-row)'; }
  private get newRowsSelector() { return 'div[role="rowgroup"][ref="eContainer"] > div[role="row"]:not(.ag-header-row)'; }
  private get rowsCellLabelSelector() { return 'div.ag-cell div.ellipsis-on-overflow > span'; }
  private get menuButtonSelector() { return 'span.ag-header-icon.ag-header-cell-menu-button'; }
  private get menuInputSelector() { return 'input[class*="ag-text-field-input"]'; }
  private get menuPopupSelector() { return 'div[class="ag-menu ag-ltr ag-popup-child"]'; }

  /**
   * Implementation of abstract getRows method
   */
  protected async getRows(): Promise<Locator> {
    const tableBody = this.tableElement.locator(this.tableBodySelector);
    return tableBody.locator(this.newRowsSelector);
  }

  /**
   * Get rows using alternative selector
   */
  private async getRows1(): Promise<Locator> {
    const tableBody = this.tableElement.locator(this.tableBodySelector);
    return tableBody.locator(this.rowsSelector);
  }

  /**
   * Implementation of abstract getHeaders method
   */
  protected async getHeaders(): Promise<Locator> {
    const headerRow = this.tableElement.locator(this.tableHeaderSelector);
    return headerRow.locator(this.headerCellsSelector);
  }

  /**
   * Click on cell based on column and value criteria
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to filter by
   */
  public async clickOnCellByValue(filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = await this.getRows();
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      await row.scrollIntoViewIfNeeded();
      const cellValue = await row.locator(`div[aria-colindex='${columnHeaderIndex}']`).innerText();
      
      if (cellValue === filterColumnValue) {
        await row.locator('div[role="gridcell"] div.ellipsis-on-overflow').click();
        await this.page.waitForTimeout(1000);
        return;
      }
    }
    throw new HoonuitException(`Unable to find: ${filterColumnValue} in column: ${filterColumnName}`);
  }

  /**
   * Get all records from the table
   */
  public async getAllRecords(): Promise<Map<string, string>[]> {
    const records: Map<string, string>[] = [];
    const headers = await this.getHeaders();
    const headerCount = await headers.count();
    
    // Try both row selectors
    let rows = await this.getRows();
    let rowCount = await rows.count();
    
    if (rowCount === 0) {
      rows = await this.getRows1();
      rowCount = await rows.count();
    }

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const record = new Map<string, string>();
      const row = rows.nth(rowIndex);
      
      for (let colIndex = 0; colIndex < headerCount; colIndex++) {
        const header = headers.nth(colIndex);
        let headerText = await header.innerText();
        const headerIndexAttr = await header.getAttribute('aria-colindex');
        const cellValue = await row.locator(`div[aria-colindex='${headerIndexAttr}']`).innerText();

        // Handle cases where text is not visible
        if (!headerText && !(await header.isVisible())) {
          headerText = (await header.textContent() || '').trim().toUpperCase();
        }
        
        record.set(headerText, cellValue);
      }
      records.push(record);
    }
    
    return records;
  }

  /**
   * Get specified number of records with table count
   * @param noOfRows - Number of rows to get
   * @param tableCount - Table count parameter
   */
  public async getAllRecordsWithCount(noOfRows: number, tableCount: number): Promise<Map<string, string>[]> {
    const records: Map<string, string>[] = [];
    await this.page.waitForLoadState('networkidle');
    
    const headers = await this.getHeaders();
    const headerCount = await headers.count();
    
    // Try both row selectors
    let rows = await this.getRows();
    let rowCount = await rows.count();
    
    if (rowCount === 0) {
      rows = await this.getRows1();
      rowCount = await rows.count();
    }

    for (let index = 0; index < noOfRows; index++) {
      const record = new Map<string, string>();
      const rowIndex = index + 2;
      
      for (let i = 0; i < headerCount; i++) {
        const header = headers.nth(i);
        await header.scrollIntoViewIfNeeded();
        let headerText = await header.innerText();
        const headerIndexAttr = await header.getAttribute('aria-colindex');
        let cellValue = '';

        const specificRowSelector = `div[role='rowgroup'] > div[role='row']:not(.ag-header-row)[aria-rowindex='${rowIndex}']`;
        const specificRows = this.page.locator(specificRowSelector);
        
        if (await specificRows.nth(tableCount - 1).locator(`div[aria-colindex='${headerIndexAttr}']`).isVisible()) {
          cellValue = await specificRows.nth(tableCount - 1).locator(`div[aria-colindex='${headerIndexAttr}']`).innerText();
        } else {
          cellValue = await rows.nth(index).locator(`div[aria-colindex='${headerIndexAttr}']`).innerText();
        }

        // Handle cases where text is not visible
        if (!headerText && !(await header.isVisible())) {
          headerText = (await header.textContent() || '').trim().toUpperCase();
          cellValue = await specificRows.nth(tableCount - 1).locator(`div[aria-colindex='${headerIndexAttr}']`).scrollIntoViewIfNeeded().then(() => 
            specificRows.nth(tableCount - 1).locator(`div[aria-colindex='${headerIndexAttr}']`).innerText()
          );
        }
        
        record.set(headerText, cellValue);
      }
      records.push(record);
    }
    
    return records;
  }

  /**
   * Click on specific cell in a row
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   * @param columnToBeClicked - Column to click
   */
  public async clickOnCell(filterColumnName: string, filterColumnValue: string, columnToBeClicked: string): Promise<void> {
    const indexOfFilterColumn = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const indexOfColumnToBeClicked = await this.getAriaColindexOfColumnHeader(columnToBeClicked);
    
    const rows = await this.getRows();
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      await row.scrollIntoViewIfNeeded();
      const cellValue = await row.locator(`div[aria-colindex='${indexOfFilterColumn}']`).innerText();
      
      if (cellValue === filterColumnValue) {
        const cellToClick = row.locator(`div[aria-colindex='${indexOfColumnToBeClicked}']`);
        await cellToClick.scrollIntoViewIfNeeded();
        await cellToClick.click();
        await this.page.waitForTimeout(1000);
        return;
      }
    }
    throw new HoonuitException(`Unable to find: ${filterColumnValue} in column: ${filterColumnName}`);
  }

  /**
   * Get values for multiple rows and columns
   * @param filterColumnName - Column to filter by
   * @param filterColumnValues - Values to filter by
   * @param columnNamesToGet - Columns to get values from
   */
  public async getRowValues(filterColumnName: string, filterColumnValues: string[], ...columnNamesToGet: string[]): Promise<Map<string, Map<string, string>>> {
    const rowDatas = new Map<string, Map<string, string>>();
    
    // Get column indexes
    const columnHeaderIndexes: number[] = [];
    for (const columnName of columnNamesToGet) {
      columnHeaderIndexes.push(await this.getAriaColindexOfColumnHeader(columnName));
    }

    // Get row indexes for each filter value
    const rowIndexes: number[] = [];
    for (const filterValue of filterColumnValues) {
      rowIndexes.push(await this.getRowIndex(filterColumnName, filterValue));
    }

    // Extract data for each row
    for (let i = 0; i < rowIndexes.length; i++) {
      const rowIndex = rowIndexes[i];
      const filterValue = filterColumnValues[i];
      const rowData = new Map<string, string>();

      for (let j = 0; j < columnHeaderIndexes.length; j++) {
        const columnIndex = columnHeaderIndexes[j];
        const columnName = columnNamesToGet[j];
        
        const cellValue = await this.tableElement.locator(`div[aria-rowindex='${rowIndex}'] div[class*='ag-cell'][aria-colindex='${columnIndex}']`).innerText();
        rowData.set(columnName, cellValue);
      }
      
      rowDatas.set(filterValue, rowData);
    }

    return rowDatas;
  }

  /**
   * Get row index for a specific filter value
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   */
  private async getRowIndex(filterColumnName: string, filterColumnValue: string): Promise<number> {
    const filterColumnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    
    const columnValues = this.tableElement.locator(`div[class*='ag-cell'][aria-colindex='${filterColumnHeaderIndex}']`);
    const matchingCell = columnValues.filter({ hasText: filterColumnValue }).first();
    
    const parentRow = matchingCell.locator('xpath=..');
    const rowIndex = await parentRow.getAttribute('aria-rowindex');
    return parseInt(rowIndex || '0', 10);
  }

  /**
   * Sort and click on cell
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   */
  public async sortAndClickOnCell(filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const header = await this.getHeader(filterColumnName);
    
    await header.locator(this.menuButtonSelector).click();
    await this.page.locator(this.menuPopupSelector).waitFor({ state: 'visible', timeout: 3000 });
    await this.page.locator(this.menuInputSelector).fill(filterColumnValue);
    await this.page.waitForLoadState('networkidle');
    
    const rows = await this.getRows();
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const rowCell = this.tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`);
      const cellText = await rowCell.innerText();

      if (filterColumnValue === cellText) {
        await rowCell.locator('div[role="gridcell"] div.ellipsis-on-overflow').click();
        await this.page.waitForTimeout(1000);
        return;
      }
    }
    throw new HoonuitException(`Unable to find ${filterColumnValue} in column ${filterColumnName}`);
  }

  /**
   * Get header element by column name
   * @param columnName - Column name to find
   */
  private async getHeader(columnName: string): Promise<Locator> {
    const headers = await this.getHeaders();
    const headerCount = await headers.count();
    
    for (let i = 0; i < headerCount; i++) {
      const header = headers.nth(i);
      const headerText = await header.innerText();
      
      if (headerText.includes(columnName)) {
        return header;
      }
    }
    throw new HoonuitTableException(`Header ${columnName} not found`);
  }

  /**
   * Get cell value based on filter criteria
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   * @param columnNameToGet - Column to get value from
   */
  public async getCellValue(filterColumnName: string, filterColumnValue: string, columnNameToGet: string): Promise<string> {
    const filterColumnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const columnCellToGetIndex = await this.getAriaColindexOfColumnHeader(columnNameToGet);
    
    // Try both row selectors
    let rows = await this.getRows();
    let rowCount = await rows.count();
    
    if (rowCount === 0) {
      rows = await this.getRows1();
      rowCount = await rows.count();
    }

    for (let i = 0; i < rowCount; i++) {
      const expectedText = await this.tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${filterColumnHeaderIndex}']`).innerText();

      if (filterColumnValue.toLowerCase() === expectedText.toLowerCase()) {
        return await this.tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnCellToGetIndex}']`).innerText();
      }
    }
    throw new HoonuitTableException(`Could not find row for column value: ${filterColumnValue}`);
  }

  /**
   * Check if values are present in a specific column
   * @param columnName - Column to check
   * @param expectedRowValues - Values to look for
   */
  public async isValuePresentInColumn(columnName: string, ...expectedRowValues: string[]): Promise<boolean> {
    const rowValues = [...expectedRowValues];
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    const rows = await this.getRows();
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const expectedText = await this.tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();

      if (rowValues.includes(expectedText)) {
        rowValues.splice(rowValues.indexOf(expectedText), 1);
      }
    }

    return rowValues.length === 0;
  }

  /**
   * Get row size for specific column and value
   * @param columnName - Column to check
   * @param expectedRowValue - Value to look for
   */
  public async getRowSize(columnName: string, expectedRowValue: string): Promise<number> {
    const rowValues: string[] = [];
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    
    // Try both row selectors
    let rows = await this.getRows();
    let rowCount = await rows.count();
    
    if (rowCount === 0) {
      rows = await this.getRows1();
      rowCount = await rows.count();
    }

    for (let i = 0; i < rowCount; i++) {
      const batchName = await this.tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();

      if (batchName.includes(expectedRowValue)) {
        rowValues.push(batchName);
      }
    }
    return rowValues.length;
  }

  /**
   * Get records using scroll functionality
   * @param noOfRows - Number of rows to get
   */
  public async getRecordsUsingScroll(noOfRows: number): Promise<Map<string, string>[]> {
    const records: Map<string, string>[] = [];
    const headers = await this.getHeaders();
    const rows = await this.getRows();
    const headerCount = await headers.count();

    for (let rowIndex = 0; rowIndex < noOfRows; rowIndex++) {
      const record = new Map<string, string>();
      
      for (let colIndex = 0; colIndex < headerCount; colIndex++) {
        const header = headers.nth(colIndex);
        let headerText = await header.innerText();
        const headerIndexAttr = await header.getAttribute('aria-colindex');
        const row = rows.nth(rowIndex);
        const rowIndexAttr = await row.getAttribute('row-index');
        
        const cellSelector = `div[role='row'][row-index='${rowIndexAttr}'] [aria-colindex='${headerIndexAttr}']`;
        const cellElement = this.page.locator(cellSelector);
        await cellElement.scrollIntoViewIfNeeded();
        let cellValue = await cellElement.innerText();

        // Handle cases where text is not visible
        if (!headerText && !(await header.isVisible())) {
          headerText = (await header.textContent() || '').trim();
          cellValue = (await cellElement.textContent() || '').trim();
        }
        
        record.set(headerText, cellValue);
      }
      records.push(record);
    }
    
    return records;
  }
}
