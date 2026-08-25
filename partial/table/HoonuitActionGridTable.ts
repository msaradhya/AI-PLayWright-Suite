import { Page, Locator } from '@playwright/test';
import HoonuitBaseTable from '../../base/table/HoonuitBaseTable';
import { HoonuitException } from '../../../exceptions/HoonuitException';
import { HoonuitTableException } from '../../../exceptions/HoonuitTableException';

/**
 * Action Grid Table implementation for Hoonuit dashboards
 * @author aradhyas (converted from Java by Sourav.Panda)
 * @since 18/05/2025 (original: 4/15/2021)
 */
export default class HoonuitActionGridTable extends HoonuitBaseTable {
  protected readonly tableTitle: string;
  protected readonly subTable?: string;

  // Selectors
  protected readonly tableTitleSelector = 'div.pds-panel-header';
  private readonly tableSelector = 'div.ag-root';
  private readonly headerSelector = 'div.ag-header div.ag-header-row-column div.ag-header-cell';
  private readonly rowSelector = 'div[role="rowgroup"] > div[role="row"]:not([class*="ag-header-row"])';
  private readonly newRowSelector = 'div[role="rowgroup"][ref="eContainer"] > div[role="row"]:not([class*="ag-header-row"])';
  private readonly selectRowSelector = 'div.ag-pinned-left-cols-container > div[role="row"]:not([class*="ag-header-row"])';
  private readonly cellSelector = 'div.ag-cell';
  private readonly tableBodySelector = 'div.ag-body-viewport';

  // Action buttons
  private readonly shareButtonSelector = 'button[ngbtooltip="Share group"]';
  private readonly editButtonSelector = 'button[aria-label="Edit this group"],button[aria-label*="Edit"] base-svg-icon.ng-star-inserted,button[aria-label*="Edit"]';
  private readonly deleteButtonSelector = 'button[aria-label="Delete this group"],button[aria-label*="delete"],button[aria-label*="Delete"] base-svg-icon.ng-star-inserted';
  private readonly viewButtonSelector = 'button[aria-label="View this groups details"]';
  private readonly copyButtonSelector = 'button[aria-label="Copy"] base-svg-icon';
  private readonly dropdownMenuSelector = 'div.dropdown-menu.show';
  private readonly dropdownItemSelector = 'button.dropdown-item';

  /**
   * Constructor
   * @param page - Playwright Page object
   * @param title - Table title
   * @param subTable - Optional sub-table title
   */
  constructor(page: Page, title: string, subTable?: string) {
    super(page, title); // Base constructor with page and title
    this.tableTitle = title.trim();
    this.subTable = subTable;
  }

  /**
   * Get the table element
   */
  protected async getTableElement(): Promise<Locator> {
    // Get table by title
    const tableContainer = this.page.locator('.pds-panel', {
      has: this.page.locator(this.tableTitleSelector, { hasText: this.tableTitle })
    });

    // If subTable is specified, find its parent container
    if (this.subTable) {
      const subTableElement = this.page.locator(`h3, h4, h5, h6, div, span`, { hasText: this.subTable });
      return subTableElement.locator('xpath=../../../..');
    }
    
    return tableContainer.locator(this.tableSelector);
  }

  /**
   * Implementation of abstract getHeaders method
   * Returns Locator for headers as required by base class
   */
  protected async getHeaders(): Promise<Locator> {
    const tableElement = await this.getTableElement();
    return tableElement.locator(this.headerSelector);
  }

  /**
   * Implementation of abstract getRows method
   * Returns Locator for rows as required by base class
   */
  protected async getRows(): Promise<Locator> {
    const tableElement = await this.getTableElement();
    const tableBody = tableElement.locator(this.tableBodySelector);
    return tableBody.locator(this.rowSelector);
  }

  /**
   * Get rows using alternative selector (new rows)
   */
  private async getNewRows(): Promise<Locator> {
    const tableElement = await this.getTableElement();
    const tableBody = tableElement.locator(this.tableBodySelector);
    return tableBody.locator(this.newRowSelector);
  }

  /**
   * Get select rows (for checkbox selection)
   */
  private async getSelectRows(): Promise<Locator> {
    const tableElement = await this.getTableElement();
    const tableBody = tableElement.locator(this.tableBodySelector);
    return tableBody.locator(this.selectRowSelector);
  }

  /**
   * Get column headers as text array
   */
  public async getHeaderTexts(): Promise<string[]> {
    const headers = await this.getHeaders();
    
    const count = await headers.count();
    const headerTexts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const headerText = await headers.nth(i).innerText();
      if (headerText.trim()) {
        headerTexts.push(headerText.trim());
      }
    }
    
    return headerTexts;
  }

  /**
   * Get cell value at specified row and column by index
   * @param rowIndex - Row index
   * @param colIndex - Column index
   */
  public async getCellValueByIndex(rowIndex: number, colIndex: number): Promise<string> {
    const rows = await this.getRows();
    
    if (rowIndex >= await rows.count()) {
      throw new Error(`Row index ${rowIndex} out of bounds`);
    }
    
    const row = rows.nth(rowIndex);
    const cells = row.locator(this.cellSelector);
    
    if (colIndex >= await cells.count()) {
      throw new Error(`Column index ${colIndex} out of bounds for row ${rowIndex}`);
    }
    
    return await cells.nth(colIndex).innerText();
  }

  /**
   * Click on a cell at specified row and column
   * @param rowIndex - Row index
   * @param colIndex - Column index
   */
  public async clickCell(rowIndex: number, colIndex: number): Promise<void> {
    const rows = await this.getRows();
    
    if (rowIndex >= await rows.count()) {
      throw new Error(`Row index ${rowIndex} out of bounds`);
    }
    
    const row = rows.nth(rowIndex);
    const cells = row.locator(this.cellSelector);
    
    if (colIndex >= await cells.count()) {
      throw new Error(`Column index ${colIndex} out of bounds for row ${rowIndex}`);
    }
    
    await cells.nth(colIndex).click();
  }

  /**
   * Get table data as a 2D array
   */
  public async getTableData(): Promise<string[][]> {
    const headers = await this.getHeaderTexts();
    const rows = await this.getRows();
    const tableData: string[][] = [];
    
    // Add header row
    tableData.push(headers);
    
    // Add data rows
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const row: string[] = [];
      
      for (let j = 0; j < headers.length; j++) {
        const cellValue = await this.getCellValueByIndex(i, j).catch(() => '');
        row.push(cellValue);
      }
      
      tableData.push(row);
    }
    
    return tableData;
  }

  /**
   * Search for a value in the table and return its position
   * @param searchValue - Value to search for
   * @returns Object with row and column indices, or null if not found
   */
  public async findValue(searchValue: string): Promise<{row: number, col: number} | null> {
    const rows = await this.getRows();
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator(this.cellSelector);
      const cellCount = await cells.count();
      
      for (let j = 0; j < cellCount; j++) {
        const cellValue = await cells.nth(j).innerText();
        if (cellValue.trim() === searchValue.trim()) {
          return { row: i, col: j };
        }
      }
    }
    
    return null;
  }

  /**
   * Select rows by checkbox based on column value
   * @param columnName - The column to filter by
   * @param rowValues - The values to select
   */
  public async selectRowInView(columnName: string, ...rowValues: string[]): Promise<void> {
    const rowsToSelect = [...rowValues];
    const selectRowsIndexes: number[] = [];

    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    const rows = await this.getRows();
    const selectRows = await this.getSelectRows();

    // Find row indexes for the values to select
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount && selectRowsIndexes.length < rowsToSelect.length; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();
      
      if (rowsToSelect.includes(cellValue)) {
        selectRowsIndexes.push(i);
      }
    }

    if (selectRowsIndexes.length !== rowsToSelect.length) {
      throw new HoonuitTableException("Mismatch in rows to select sent as parameter and the rows fetched from the table");
    }

    // Click on the filtered row's checkboxes
    for (const rowIndex of selectRowsIndexes) {
      const selectRowsElements = await this.getSelectRows();
      await selectRowsElements.nth(rowIndex).locator('input.ag-checkbox-input').click();
    }
  }

  /**
   * Check if values are present in a specific column
   * @param columnName - The column to check
   * @param expectedRowValues - The values to look for
   */
  public async isValuePresentInColumn(columnName: string, ...expectedRowValues: string[]): Promise<boolean> {
    const rowValues = [...expectedRowValues];
    
    // Try to use filter if available
    const nameFilterInput = this.page.locator('[aria-label="Name Filter Input"]');
    if (await nameFilterInput.isVisible()) {
      await nameFilterInput.fill(expectedRowValues[0]);
    }

    // Wait for the filter to apply
    await this.page.waitForTimeout(1000);

    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    const rows = await this.getNewRows();
    const rowCount = await rows.count();
    
    if (rowCount === 0) {
      return false;
    }

    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();
      
      if (rowValues.includes(cellValue)) {
        rowValues.splice(rowValues.indexOf(cellValue), 1);
      }
      if (rowValues.length === 0) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Click action button in a specific row
   * @param action - The action to perform (Delete, Edit, etc.)
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   */
  public async clickActionColumn(action: string, filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = await this.getRows();
    const actionHeaderIndex = await this.getAriaColindexOfColumnHeader("ACTIONS");

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();

      if (filterColumnValue === cellValue) {
        const actionCell = tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${actionHeaderIndex}']`);
        
        if (action === "Delete") {
          await actionCell.locator(this.deleteButtonSelector).click();
          return;
        } else if (action === "Edit") {
          await actionCell.locator(this.editButtonSelector).click();
          return;
        }
      }
    }
    throw new HoonuitException(`Invalid action: ${action}`);
  }

  /**
   * Select from share action dropdown
   * @param shareAction - The share action to select
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   */
  public async selectFromShareActionDropdown(shareAction: string, filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = await this.getRows();
    const actionHeaderIndex = await this.getAriaColindexOfColumnHeader("ACTIONS");

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();
      
      if (filterColumnValue === cellValue) {
        const actionCell = tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${actionHeaderIndex}']`);
        await actionCell.locator(this.shareButtonSelector).click();
        
        await this.page.locator(this.dropdownMenuSelector).waitFor({ state: 'visible' });
        await this.page.locator(this.dropdownItemSelector).filter({ hasText: shareAction }).click();
        return;
      }
    }
  }

  /**
   * Click on a cell in the table
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   */
  public async clickCellInView(filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    
    // Try both row selectors
    let rows = await this.getRows();
    let rowCount = await rows.count();
    
    if (rowCount === 0) {
      rows = await this.getNewRows();
      rowCount = await rows.count();
    }

    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const expectedCell = tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`);
      
      await expectedCell.waitFor({ state: 'visible', timeout: 30000 });
      const cellValue = await expectedCell.innerText();
      
      if (filterColumnValue === cellValue) {
        await expectedCell.click();
        return;
      }
    }
    throw new HoonuitTableException(`Could not find the Column Values: ${filterColumnValue}`);
  }

  /**
   * Set header checkbox state
   * @param columnIndex - Index of the column
   * @param set - Whether to check or uncheck
   */
  public async setHeaderCheckbox(columnIndex: number, set: boolean): Promise<void> {
    const headers = await this.getHeaders();
    const checkbox = headers.nth(columnIndex).locator('[type="checkbox"]');
    
    if (await checkbox.count() > 0) {
      const isSelected = await checkbox.isChecked();
      if (isSelected !== set) {
        await checkbox.click();
      }
    } else {
      throw new HoonuitException(`Could not find checkbox for column index: ${columnIndex}`);
    }
  }

  /**
   * Check if action button is present in actions column
   * @param action - The action to check for
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   */
  public async isActionsColumnButtonPresent(action: string, filterColumnName: string, filterColumnValue: string): Promise<boolean> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = await this.getRows();
    const actionHeaderIndex = await this.getAriaColindexOfColumnHeader("ACTIONS");

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();

      if (filterColumnValue === cellValue) {
        const actionCell = tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${actionHeaderIndex}']`);
        
        switch (action) {
          case "Delete":
            return await actionCell.locator(this.deleteButtonSelector).count() > 0;
          case "Edit":
            return await actionCell.locator(this.editButtonSelector).count() > 0;
          case "Share":
            return await actionCell.locator(this.shareButtonSelector).count() > 0;
          case "View":
            return await actionCell.locator(this.viewButtonSelector).count() > 0;
          case "Copy":
            return await actionCell.locator(this.copyButtonSelector).count() > 0;
        }
      }
    }
    return false;
  }

  /**
   * Get group visibility column value by name
   * @param groupName - The group name to filter by
   */
  public async getGroupVisibilityColumnByName(groupName: string): Promise<string> {
    const nameFilterInput = this.page.locator('input[aria-label="Name Filter Input"]');
    if (await nameFilterInput.isVisible()) {
      await nameFilterInput.fill(groupName);
      
      // Wait for filtering to complete
      await this.page.waitForTimeout(2000);
    }
    
    const visibilityCell = this.page.locator('div[col-id="visibility"][role="gridcell"]');
    await visibilityCell.first().waitFor({ state: 'visible' });
    
    return await visibilityCell.first().innerText();
  }

  /**
   * Get cell value based on filter criteria
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   * @param columnNameToGet - Column to get value from
   */
  public async getCellValue(filterColumnName: string, filterColumnValue: string, columnNameToGet: string): Promise<string> {
    const nameFilterInput = this.page.locator('input[aria-label="Name Filter Input"]');
    if (await nameFilterInput.isVisible()) {
      await nameFilterInput.fill(filterColumnValue);
      await this.page.waitForTimeout(1000);
    }

    const filterColumnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = await this.getRows();
    const columnCellToGetIndex = await this.getAriaColindexOfColumnHeader(columnNameToGet);

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${filterColumnHeaderIndex}']`).innerText();

      if (filterColumnValue === cellValue) {
        return await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnCellToGetIndex}']`).innerText();
      }
    }
    throw new HoonuitTableException(`Could not find row for column value: ${filterColumnValue}`);
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
        
        const tableElement = await this.getTableElement();
        const cellValue = await tableElement.locator(`div[aria-rowindex='${rowIndex}'] div[class*='ag-cell'][aria-colindex='${columnIndex}']`).innerText();
        rowData.set(columnName, cellValue);
      }
      
      rowDatas.set(filterValue, rowData);
    }

    return rowDatas;
  }

  /**
   * Get total row count
   */
  public async getRowCount(): Promise<number> {
    const tableElement = await this.getTableElement();
    const ariaRowCount = await tableElement.getAttribute('aria-rowcount');
    return parseInt(ariaRowCount || '0', 10) - 1; // Subtract 1 for header
  }

  /**
   * Get row index for a specific filter value
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   */
  private async getRowIndex(filterColumnName: string, filterColumnValue: string): Promise<number> {
    const filterColumnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const tableElement = await this.getTableElement();
    
    const columnValues = tableElement.locator(`div[class*='ag-cell'][aria-colindex='${filterColumnHeaderIndex}']`);
    const matchingCell = columnValues.filter({ hasText: filterColumnValue }).first();
    
    const parentRow = matchingCell.locator('xpath=..');
    const rowIndex = await parentRow.getAttribute('aria-rowindex');
    return parseInt(rowIndex || '0', 10);
  }

  /**
   * Click on a specific cell
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   * @param columnToBeClicked - Column to click
   */
  public async clickOnCell(filterColumnName: string, filterColumnValue: string, columnToBeClicked: string): Promise<void> {
    const indexOfFilterColumn = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const indexOfColumnToBeClicked = await this.getAriaColindexOfColumnHeader(columnToBeClicked);
    
    // Try both row selectors
    let rows = await this.getRows();
    let rowCount = await rows.count();
    
    if (rowCount === 0) {
      rows = await this.getNewRows();
      rowCount = await rows.count();
    }

    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${indexOfFilterColumn}']`).innerText();

      if (filterColumnValue === cellValue) {
        const cellToClick = tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${indexOfColumnToBeClicked}']`);
        await cellToClick.click();
        await this.page.waitForTimeout(1000);
        return;
      }
    }
    throw new HoonuitTableException(`Could not find row for column value: ${filterColumnValue}`);
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
      rows = await this.getNewRows();
      rowCount = await rows.count();
    }

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const record = new Map<string, string>();
      
      for (let colIndex = 0; colIndex < headerCount; colIndex++) {
        const header = headers.nth(colIndex);
        let headerText = await header.innerText();
        const headerIndexAttr = await header.getAttribute('aria-colindex');
        const row = rows.nth(rowIndex);
        const rowIndexAttr = await row.getAttribute('row-index');
        
        const cellSelector = `div[role='row'][row-index='${rowIndexAttr}'] [aria-colindex='${headerIndexAttr}']`;
        let cellValue = await this.page.locator(cellSelector).innerText();

        // Handle cases where text is not visible
        if (!headerText && !(await header.isVisible())) {
          headerText = await header.textContent() || '';
          cellValue = await this.page.locator(cellSelector).textContent() || '';
        }
        
        record.set(headerText.trim(), cellValue.trim());
      }
      records.push(record);
    }
    
    return records;
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
        const headerText = await header.innerText();
        const headerIndexAttr = await header.getAttribute('aria-colindex');
        const row = rows.nth(rowIndex);
        const rowIndexAttr = await row.getAttribute('row-index');
        
        const cellSelector = `div[role='row'][row-index='${rowIndexAttr}'] [aria-colindex='${headerIndexAttr}']`;
        const cellElement = this.page.locator(cellSelector);
        await cellElement.scrollIntoViewIfNeeded();
        const cellValue = await cellElement.innerText();

        record.set(headerText.trim(), cellValue.trim());
      }
      records.push(record);
    }
    
    return records;
  }

  /**
   * Get all table records with specified number of rows
   * @param noOfRows - Number of rows to get
   */
  public async getAllTableRecords(noOfRows?: number): Promise<Map<string, string>[]> {
    const records: Map<string, string>[] = [];
    const headers = await this.getHeaders();
    const headerCount = await headers.count();
    
    // Cache header information
    const headerTexts: string[] = [];
    const headerIndices: string[] = [];
    
    for (let i = 0; i < headerCount; i++) {
      const header = headers.nth(i);
      await header.scrollIntoViewIfNeeded();
      headerTexts.push((await header.innerText()).trim());
      headerIndices.push(await header.getAttribute('aria-colindex') || '');
    }

    const rows = await this.getNewRows();
    const totalRows = noOfRows || await rows.count();

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const record = new Map<string, string>();
      const row = rows.nth(rowIndex);
      const rowIndexAttr = await row.getAttribute('row-index');

      for (let colIndex = 0; colIndex < headerCount; colIndex++) {
        const headerText = headerTexts[colIndex];
        const headerIndex = headerIndices[colIndex];
        
        const cellSelector = `div[role='row'][row-index='${rowIndexAttr}'] [aria-colindex='${headerIndex}']`;
        const cellValue = await this.page.locator(cellSelector).innerText();
        record.set(headerText, cellValue.trim());
      }
      records.push(record);
    }
    
    return records;
  }

  /**
   * Click action column with specific action column name
   * @param filterColumnName - Column to filter by
   * @param filterColumnValue - Value to filter by
   * @param actionColumnName - Action column name
   * @param action - Action to perform
   */
  public async clickActionColumnWithName(filterColumnName: string, filterColumnValue: string, actionColumnName: string, action: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = await this.getRows();
    const actionHeaderIndex = await this.getAriaColindexOfColumnHeader(actionColumnName);

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const tableElement = await this.getTableElement();
      const cellValue = await tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`).innerText();

      if (cellValue.includes(filterColumnValue)) {
        const actionCell = tableElement.locator(`div[row-index='${i}'] div[class*='ag-cell'][aria-colindex='${actionHeaderIndex}']`);
        
        if (action.includes("Delete")) {
          await actionCell.locator(this.deleteButtonSelector).click();
          return;
        } else if (action.includes("Edit")) {
          await actionCell.locator(this.editButtonSelector).click();
          return;
        } else if (action.includes("Copy")) {
          await actionCell.locator(this.copyButtonSelector).click();
          return;
        }
      }
    }
    throw new HoonuitException(`Invalid action: ${action}`);
  }

  /**
   * Get all table records with enhanced scrolling support
   */
  public async getAllTableRecordsWithScrolling(): Promise<Map<string, string>[]> {
    const records: Map<string, string>[] = [];
    const headers = await this.getHeaders();
    const headerCount = await headers.count();
    
    // Cache header information
    const headerTexts: string[] = [];
    const headerIndices: string[] = [];
    
    for (let i = 0; i < headerCount; i++) {
      const header = headers.nth(i);
      await header.scrollIntoViewIfNeeded();
      headerTexts.push((await header.innerText()).trim());
      headerIndices.push(await header.getAttribute('aria-colindex') || '');
    }

    const rows = await this.getNewRows();
    const totalRows = await rows.count();

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const record = new Map<string, string>();
      const row = rows.nth(rowIndex);
      const rowIndexAttr = await row.getAttribute('row-index');

      for (let colIndex = 0; colIndex < headerCount; colIndex++) {
        const headerElement = headers.nth(colIndex);
        
        // Scroll into view and wait for visibility
        await headerElement.waitFor({ state: 'visible', timeout: 30000 });
        await headerElement.scrollIntoViewIfNeeded();

        const headerText = headerTexts[colIndex];
        const headerIndex = headerIndices[colIndex];
        
        const cellSelector = `div[role='row'][row-index='${rowIndexAttr}'] [aria-colindex='${headerIndex}']`;
        const cellValue = await this.page.locator(cellSelector).innerText();
        record.set(headerText, cellValue.trim());
      }
      records.push(record);
    }
    
    return records;
  }

  /**
   * Scroll element into view (utility method)
   * @param element - Element to scroll into view
   */
  public async scrollElementIntoView(element: Locator): Promise<void> {
    await element.evaluate((el) => {
      el.scrollIntoView({ block: 'center', inline: 'center' });
    });
  }

  /**
   * Select action from action dropdown
   * @param action - The action to select
   */
  public async selectAction(action: string): Promise<void> {
    const actionDropDown = await this.getTableElement();
    await actionDropDown.locator('button.dropdown-toggle').click();
    await actionDropDown.locator('div.dropdown-menu.show').waitFor({ state: 'visible' });

    const actionMenus = actionDropDown.locator('button[ngbdropdownitem]');
    const menuCount = await actionMenus.count();
    
    for (let i = 0; i < menuCount; i++) {
      const menu = actionMenus.nth(i);
      const menuText = await menu.innerText();
      
      if (menuText === action) {
        await menu.click();
        return;
      }
    }
    
    throw new HoonuitException(`Could not find the Action in dropdown: ${action}`);
  }
}
