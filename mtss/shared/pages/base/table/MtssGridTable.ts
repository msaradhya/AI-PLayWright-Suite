import { Locator } from '@playwright/test';
import { MtssBaseTable } from './MtssBaseTable';
import { MtssTableException } from '../../../exceptions/MtssTableException';

/**
 * Grid table class for MTSS - TypeScript/Playwright equivalent of Java MtssGridTable
 * Extends MtssBaseTable with grid-specific functionality for AG-Grid tables
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export class MtssGridTable extends MtssBaseTable {
  // Static selectors for AG-Grid components
  private static readonly GRID_TABLE_BODY = 'div.ag-body-viewport';
  private static readonly GRID_TABLE_HEADER = 'div.ag-header';
  private static readonly GRID_HEADER_CELLS = 'div.ag-header-cell:not([col-id="checkbox"])';
  private static readonly GRID_ROWS = 'div[role="rowgroup"] > div[role="row"]:not(.ag-header-row)';
  private static readonly GRID_NEW_ROWS = 'div[role="rowgroup"][ref="eContainer"] > div[role="row"]:not([class*="ag-header-row"])';
  private static readonly GRID_ROWS_CELL_LABEL = 'div.ag-cell div.ellipsis-on-overflow > span';
  private static readonly GRID_MENU_BUTTON = 'span.ag-header-icon.ag-header-cell-menu-button';
  private static readonly GRID_MENU_INPUT = 'input[class*="ag-text-field-input"]';
  private static readonly GRID_MENU_POPUP = 'div[class="ag-menu ag-ltr ag-popup-child"]';

  /**
   * Constructor implementation - supports both title and table element
   * @param titleOrElement - Either a string title or Locator for table element
   */
  constructor(titleOrElement: string | Locator) {
    super(titleOrElement);
  }

  /**
   * Override rows method to return AG-Grid specific rows
   * @returns Row locators for AG-Grid
   */
  protected rows(): Locator {
    const tableBody = this.tableElement.locator(MtssGridTable.GRID_TABLE_BODY);
    return tableBody.locator(MtssGridTable.GRID_NEW_ROWS);
  }

  /**
   * Alternative rows method for fallback
   * @returns Alternative row locators
   */
  protected rows1(): Locator {
    const tableBody = this.tableElement.locator(MtssGridTable.GRID_TABLE_BODY);
    return tableBody.locator(MtssGridTable.GRID_ROWS);
  }

  /**
   * Override headers method to return AG-Grid specific headers
   * @returns Header locators for AG-Grid
   */
  protected headers(): Locator {
    const headerRow = this.tableElement.locator(MtssGridTable.GRID_TABLE_HEADER);
    return headerRow.locator(MtssGridTable.GRID_HEADER_CELLS);
  }

  /**
   * Click on cell based on filter column and value
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to match in the filter column
   */
  public async clickOnCell(filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = this.getRows();
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      await row.scrollIntoViewIfNeeded();
      
      const cell = row.locator(`div[aria-colindex="${columnHeaderIndex}"]`);
      const cellText = await cell.innerText();
      
      if (cellText === filterColumnValue) {
        const clickTarget = row.locator('div[role="gridcell"] div.ellipsis-on-overflow').first();
        await this.clickByJavaScript(clickTarget);
        // Wait for any JavaScript to finish
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }

    throw new MtssTableException(`Unable to find: ${filterColumnValue} in column: ${filterColumnName}`);
  }

  /**
   * Get all records from the table
   * @returns Array of record objects with column headers as keys
   */
  public async getAllRecords(): Promise<Record<string, string>[]> {
    const records: Record<string, string>[] = [];
    const headers = this.headers();
    const headerCount = await headers.count();
    
    // Determine which rows to use
    let rows: Locator;
    const mainRowsCount = await this.rows().count();
    if (mainRowsCount > 0) {
      rows = this.rows();
    } else {
      rows = this.rows1();
    }

    const rowCount = await rows.count();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const record: Record<string, string> = {};
      const row = rows.nth(rowIndex);

      for (let headerIndex = 0; headerIndex < headerCount; headerIndex++) {
        const header = headers.nth(headerIndex);
        let headerText = await header.innerText();
        
        const ariaColindex = await header.getAttribute('aria-colindex');
        if (!ariaColindex) continue;
        
        const cell = row.locator(`div[aria-colindex="${ariaColindex}"]`);
        let value = await cell.innerText();

        // If cell is not visible, try getting innerText
        if (!headerText && !(await header.isVisible())) {
          headerText = (await header.innerText()).trim().toUpperCase();
          value = (await cell.innerText()).trim();
        }

        record[headerText] = value;
      }
      records.push(record);
    }

    return records;
  }

  /**
   * Get specified number of records from the table
   * @param noOfRows - Number of rows to retrieve
   * @param tableCount - Table count for multiple tables
   * @returns Array of record objects
   */
  public async getSpecificRecords(noOfRows: number, tableCount: number): Promise<Record<string, string>[]> {
    const records: Record<string, string>[] = [];
    
    // Wait for JavaScript and Angular to finish
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    const headers = this.headers();
    const headerCount = await headers.count();
    const rows = this.rows();

    for (let index = 0; index < noOfRows; index++) {
      const record: Record<string, string> = {};
      
      for (let i = 0; i < headerCount; i++) {
        const header = headers.nth(i);
        await header.scrollIntoViewIfNeeded();
        let headerText = await header.innerText();
        
        const rowIndex = index + 2;
        let value = '';
        
        const ariaColindex = await header.getAttribute('aria-colindex');
        if (!ariaColindex) continue;

        // Try to get value from specific row by aria-rowindex
        const specificRowSelector = `div[role="rowgroup"] > div[role="row"]:not(.ag-header-row)[aria-rowindex="${rowIndex}"]`;
        const specificRows = this.page.locator(specificRowSelector);
        const specificRowCount = await specificRows.count();

        if (specificRowCount > tableCount - 1) {
          const specificRow = specificRows.nth(tableCount - 1);
          const specificCell = specificRow.locator(`div[aria-colindex="${ariaColindex}"]`);
          
          if (await specificCell.isVisible()) {
            value = await specificCell.innerText();
          } else {
            // Fallback to regular row access
            const fallbackCell = rows.nth(index).locator(`div[aria-colindex="${ariaColindex}"]`);
            value = await fallbackCell.innerText();
          }
        } else {
          const fallbackCell = rows.nth(index).locator(`div[aria-colindex="${ariaColindex}"]`);
          value = await fallbackCell.innerText();
        }

        // Handle invisible headers
        if (!headerText && !(await header.isVisible())) {
          headerText = (await header.innerText()).trim().toUpperCase();
          const specificRow = specificRows.nth(tableCount - 1);
          const specificCell = specificRow.locator(`div[aria-colindex="${ariaColindex}"]`);
          await specificCell.scrollIntoViewIfNeeded();
          value = await specificCell.innerText();
        }

        record[headerText] = value;
      }
      records.push(record);
    }

    return records;
  }

  /**
   * Click on specific cell in a row
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to match in the filter column
   * @param columnToBeClicked - Column name to click
   */
  public async clickOnSpecificCell(filterColumnName: string, filterColumnValue: string, columnToBeClicked: string): Promise<void> {
    const indexOfFilterColumn = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const indexOfColumnToBeClicked = await this.getAriaColindexOfColumnHeader(columnToBeClicked);

    const rows = this.rows();
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      await row.scrollIntoViewIfNeeded();
      
      const filterCell = row.locator(`div[aria-colindex="${indexOfFilterColumn}"]`);
      const filterCellText = await filterCell.innerText();
      
      if (filterCellText === filterColumnValue) {
        const targetCell = row.locator(`div[aria-colindex="${indexOfColumnToBeClicked}"]`);
        await targetCell.scrollIntoViewIfNeeded();
        await this.clickByJavaScript(targetCell);
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }

    throw new MtssTableException(`Unable to find: ${filterColumnValue} in column: ${filterColumnName}`);
  }

  /**
   * Get row values for multiple filter values and specific columns
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValues - Array of values to match
   * @param columnNamesToGet - Array of column names to retrieve values from
   * @returns Map of filter values to their corresponding row data
   */
  public async getRowValues(
    filterColumnName: string, 
    filterColumnValues: string[], 
    ...columnNamesToGet: string[]
  ): Promise<Map<string, Record<string, string>>> {
    const columnNames = [...columnNamesToGet];
    const columnHeaderIndexes: number[] = [];
    const rowIndexes: number[] = [];
    const rowDatas = new Map<string, Record<string, string>>();

    // Get row index for each filter column value
    for (const columnValue of filterColumnValues) {
      const rowIndex = await this.getRowIndex(filterColumnName, columnValue);
      rowIndexes.push(rowIndex);
    }

    // Get column index for each column header
    for (const columnName of columnNames) {
      const index = await this.getAriaColindexOfColumnHeader(columnName);
      columnHeaderIndexes.push(index);
    }

    // Map data for each filter column value with required column values
    for (let i = 0; i < rowIndexes.length; i++) {
      const rowIndex = rowIndexes[i];
      const rowData: Record<string, string> = {};
      
      for (let j = 0; j < columnHeaderIndexes.length; j++) {
        const columnIndex = columnHeaderIndexes[j];
        const key = columnNames[j];
        
        const cell = this.tableElement.locator(`div[aria-rowindex="${rowIndex}"] div[class*="ag-cell"][aria-colindex="${columnIndex}"]`);
        const value = await cell.innerText();
        rowData[key] = value;
      }
      
      rowDatas.set(filterColumnValues[i], rowData);
    }

    return rowDatas;
  }

  /**
   * Get row index for a specific filter value
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to match
   * @returns Row index (aria-rowindex)
   */
  private async getRowIndex(filterColumnName: string, filterColumnValue: string): Promise<number> {
    const filterColumnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const columnValues = this.tableElement.locator(`div[class*="ag-cell"][aria-colindex="${filterColumnHeaderIndex}"]`);
    
    const count = await columnValues.count();
    for (let i = 0; i < count; i++) {
      const cell = columnValues.nth(i);
      const cellText = await cell.innerText();
      
      if (cellText === filterColumnValue) {
        const parent = cell.locator('..');
        const rowIndex = await parent.getAttribute('aria-rowindex');
        if (rowIndex) {
          return parseInt(rowIndex);
        }
      }
    }

    throw new MtssTableException(`Unable to find row for filter value: ${filterColumnValue}`);
  }

  /**
   * Sort and click on cell using filter menu
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to filter and click
   */
  public async sortAndClickOnCell(filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const header = await this.getHeader(filterColumnName);
    
    // Click menu button
    await header.locator(MtssGridTable.GRID_MENU_BUTTON).click();
    
    // Wait for popup and enter filter value
    await this.page.locator(MtssGridTable.GRID_MENU_POPUP).waitFor({ state: 'visible', timeout: 3000 });
    const menuInput = this.page.locator(MtssGridTable.GRID_MENU_POPUP).locator(MtssGridTable.GRID_MENU_INPUT);
    await menuInput.waitFor({ state: 'visible' });
    await menuInput.fill(filterColumnValue);
    
    // Wait for page to load
    await this.page.waitForLoadState('networkidle');
    
    const rows = this.rows();
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const rowCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnHeaderIndex}"]`);
      const cellText = await rowCell.innerText();
      
      if (filterColumnValue === cellText) {
        const clickTarget = rowCell.locator('div[role="gridcell"] div.ellipsis-on-overflow');
        await this.clickByJavaScript(clickTarget);
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }

    throw new Error(`Unable to find ${filterColumnValue} in column ${filterColumnName}`);
  }

  /**
   * Get header element by column name
   * @param columnName - Column name to find
   * @returns Header locator
   */
  private async getHeader(columnName: string): Promise<Locator> {
    const headers = this.page.locator(MtssGridTable.GRID_HEADER_CELLS);
    const count = await headers.count();
    
    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const headerText = await header.innerText();
      
      if (headerText.includes(columnName)) {
        await header.waitFor({ state: 'visible' });
        return header;
      }
    }

    throw new Error(`Header with column name ${columnName} not found`);
  }

  /**
   * Get cell value using filter criteria
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to match in filter column
   * @param columnNameToGet - Column name to get value from
   * @returns Cell value
   */
  public async getCellValue(filterColumnName: string, filterColumnValue: string, columnNameToGet: string): Promise<string> {
    const filterColumnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = this.rows();
    const columnCellToGetIndex = await this.getAriaColindexOfColumnHeader(columnNameToGet);
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const expectedTextCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${filterColumnHeaderIndex}"]`);
      const expectedText = await expectedTextCell.innerText();

      if (filterColumnValue.toLowerCase() === expectedText.toLowerCase()) {
        const valueCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnCellToGetIndex}"]`);
        return await valueCell.innerText();
      }
    }

    throw new Error(`Could not find row for column value: ${filterColumnValue}`);
  }

  /**
   * Check if values are present in a specific column
   * @param columnName - Column name to check
   * @param expectedRowValues - Values to check for
   * @returns Boolean indicating if all values are found
   */
  public async isValuePresentInColumn(columnName: string, ...expectedRowValues: string[]): Promise<boolean> {
    const rowValues = [...expectedRowValues];
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    const rows = this.rows();
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const expectedTextCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnHeaderIndex}"]`);
      const expectedText = await expectedTextCell.innerText();

      const index = rowValues.indexOf(expectedText);
      if (index > -1) {
        rowValues.splice(index, 1);
      }
    }

    return rowValues.length === 0;
  }

  /**
   * Get count of rows containing a specific value in a column
   * @param columnName - Column name to check
   * @param expectedRowValue - Value to search for
   * @returns Count of matching rows
   */
  public async getRowSize(columnName: string, expectedRowValue: string): Promise<number> {
    const rowValues: string[] = [];
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    const rows = this.rows();
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const batchNameCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnHeaderIndex}"]`);
      const batchName = await batchNameCell.innerText();

      if (batchName.includes(expectedRowValue)) {
        rowValues.push(batchName);
      }
    }

    return rowValues.length;
  }
}
