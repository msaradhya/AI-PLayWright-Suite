import { Page, Locator } from '@playwright/test';
import HoonuitBaseTable from '../../base/table/HoonuitBaseTable';
import { HoonuitException } from '../../../exceptions/HoonuitException';
import { HoonuitTableException } from '../../../exceptions/HoonuitTableException';

/**
 * Cross Tab Grid Table implementation for Hoonuit dashboards
 * @author aradhyas (converted from Java by amittiwari)
 * @since 18/05/2025 (original: 19/04/21)
 */
export default class HoonuitCrossTabGridTable extends HoonuitBaseTable {
  protected readonly tableTitle: string;
  protected readonly hasActionDropdown: boolean;

  // Selectors
  private readonly headersSelector = 'div.pivotTopHeaderContainer thead td';
  private readonly leftHeadersSelector = 'div.pivotLeftHeaderContainer table.pvtTable tr.dataRow';
  private readonly leftHeaderHeaderNamesSelector = 'table.pvtTable th.dataHeader.dataHeaderLastRow';
  private readonly dataRowsSelector = 'div.pivotBodyContainer table.pvtTable tr.dataRow';
  private readonly clickableComponentSelector = 'span[class="clickableLabel"]';

  /**
   * Constructor with table title
   * @param page - Playwright Page object
   * @param title - Table title
   */
  constructor(page: Page, title: string);
  
  /**
   * Constructor with table title and action dropdown
   * @param page - Playwright Page object
   * @param title - Table title
   * @param hasActionDropdown - Whether table has action dropdown
   */
  constructor(page: Page, title: string, hasActionDropdown: boolean);
  
  constructor(page: Page, title: string, hasActionDropdown?: boolean) {
    super(page, title);
    this.tableTitle = title.trim();
    this.hasActionDropdown = hasActionDropdown || false;
  }

  /**
   * Implementation of abstract getRows method
   */
  protected async getRows(): Promise<Locator> {
    return this.tableElement.locator(this.dataRowsSelector);
  }

  /**
   * Implementation of abstract getHeaders method
   */
  protected async getHeaders(): Promise<Locator> {
    return this.tableElement.locator(this.headersSelector);
  }

  /**
   * Get left headers (row headers)
   */
  protected async getLeftHeaders(): Promise<Locator> {
    return this.tableElement.locator(this.leftHeadersSelector);
  }

  /**
   * Click on left header by name
   * @param headerName - Name of the header to click
   */
  public async clickLeftHeader(headerName: string): Promise<void> {
    const leftHeaders = await this.getLeftHeaders();
    const headerCount = await leftHeaders.count();
    
    for (let i = 0; i < headerCount; i++) {
      const header = leftHeaders.nth(i);
      const headerText = await header.innerText();
      
      if (headerText.includes(headerName)) {
        await header.locator(this.clickableComponentSelector).click();
        return;
      }
    }
    throw new HoonuitTableException(`Left header '${headerName}' not found`);
  }

  /**
   * Get record value by left and top header names
   * @param leftHeader - Left header name
   * @param topHeader - Top header name
   */
  public async getRecord(leftHeader: string, topHeader: string): Promise<string> {
    const leftIndex = await this.getLeftColumnHeaderIndex(leftHeader);
    const topIndex = await this.getGridColumnHeaderIndex(topHeader);
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    return await cells.nth(topIndex).innerText();
  }

  /**
   * Get record value by left header and column index
   * @param leftHeader - Left header name
   * @param columnIndex - Column index
   */
  public async getRecordByIndex(leftHeader: string, columnIndex: number): Promise<string> {
    const leftIndex = await this.getLeftColumnHeaderIndex(leftHeader);
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    return await cells.nth(columnIndex).innerText();
  }

  /**
   * Click on row cell record
   * @param leftHeader - Left header name
   * @param topHeader - Top header name
   */
  public async clickOnRowCellRecord(leftHeader: string, topHeader: string): Promise<void> {
    const leftIndex = await this.getLeftColumnHeaderIndex(leftHeader);
    const topIndex = await this.getGridColumnHeaderIndex(topHeader);
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    await cells.nth(topIndex).click();
  }

  /**
   * Get sub records for two-level headers
   * @param leftHeader - Left header name
   * @param subHeaders - Sub header names
   */
  public async getSubRecords(leftHeader: string, ...subHeaders: string[]): Promise<Map<string, string>> {
    const multipleRecords = new Map<string, string>();
    await this.page.waitForLoadState('networkidle');
    
    const leftIndex = await this.getLeftColumnHeaderIndex(leftHeader);
    
    for (const subHeader of subHeaders) {
      const subHeaderIndex = await this.getGridColumnHeaderIndex(subHeader) - 1;
      
      const rows = await this.getRows();
      const row = rows.nth(leftIndex);
      const cells = row.locator('td');
      const subHeaderValue = await cells.nth(subHeaderIndex).innerText();
      
      multipleRecords.set(subHeader, subHeaderValue);
    }
    
    return multipleRecords;
  }

  /**
   * Get sub records for multiple left headers
   * @param leftHeadersValues - Array of left header values
   * @param leftHeader - Left header name
   * @param subHeader - Sub header name
   */
  public async getSubRecordsForMultipleHeaders(leftHeadersValues: string[], leftHeader: string, subHeader: string): Promise<Map<string, string>> {
    const multipleRecords = new Map<string, string>();
    const subHeaderIndex = await this.getGridColumnHeaderIndex(subHeader) - 1;
    
    for (const leftValue of leftHeadersValues) {
      const leftIndex = await this.getLeftColumnHeaderIndexByValue(leftHeader, leftValue);
      
      const rows = await this.getRows();
      const row = rows.nth(leftIndex);
      const cells = row.locator('td');
      const subHeaderValue = await cells.nth(subHeaderIndex).innerText();
      
      multipleRecords.set(leftValue, subHeaderValue);
    }
    
    return multipleRecords;
  }

  /**
   * Click on cell by left and top headers
   * @param leftHeader - Left header name
   * @param topHeader - Top header name
   */
  public async clickOnCell(leftHeader: string, topHeader: string): Promise<void> {
    const leftIndex = await this.getLeftColumnHeaderIndex(leftHeader);
    const topIndex = await this.getGridColumnHeaderIndex(topHeader);
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    await cells.nth(topIndex).locator(this.clickableComponentSelector).click();
  }

  /**
   * Click on sub header cell (for two-level headers)
   * @param leftHeader - Left header name
   * @param subHeader - Sub header name
   */
  public async clickOnSubHeaderCell(leftHeader: string, subHeader: string): Promise<void> {
    const leftIndex = await this.getLeftColumnHeaderIndex(leftHeader);
    const topIndex = await this.getGridColumnHeaderIndex(subHeader) - 1;
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    await cells.nth(topIndex).locator(this.clickableComponentSelector).click();
  }

  /**
   * Click on sub header cell with specific left header value
   * @param leftHeader - Left header name
   * @param leftHeaderValue - Left header value
   * @param subHeader - Sub header name
   */
  public async clickOnSubHeaderCellWithValue(leftHeader: string, leftHeaderValue: string, subHeader: string): Promise<void> {
    const leftIndex = await this.getLeftColumnHeaderIndexByValue(leftHeader, leftHeaderValue);
    const topIndex = await this.getGridColumnHeaderIndex(subHeader) - 1;
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    await cells.nth(topIndex).locator(this.clickableComponentSelector).click();
  }

  /**
   * Get left column header index by name
   * @param columnHeader - Column header name
   */
  private async getLeftColumnHeaderIndex(columnHeader: string): Promise<number> {
    const leftHeaders = await this.getLeftHeaders();
    const headerCount = await leftHeaders.count();
    
    for (let i = 0; i < headerCount; i++) {
      const header = leftHeaders.nth(i);
      const headerCell = header.locator('th');
      
      // Check first th element
      if (await headerCell.count() > 0) {
        const headerText = await headerCell.first().textContent();
        if (headerText?.trim().toLowerCase() === columnHeader.trim().toLowerCase()) {
          return i;
        }
      }
      
      // Check last th element
      const lastHeaderCell = header.locator('th').last();
      if (await lastHeaderCell.count() > 0) {
        const lastHeaderText = await lastHeaderCell.textContent();
        if (lastHeaderText?.trim().toLowerCase() === columnHeader.trim().toLowerCase()) {
          return i;
        }
      }
    }
    
    throw new HoonuitTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Get left column header index by name and value
   * @param columnHeaderName - Column header name
   * @param columnHeader - Column header value
   */
  private async getLeftColumnHeaderIndexByValue(columnHeaderName: string, columnHeader: string): Promise<number> {
    const headerIndex = await this.getLeftHeaderNameIndex(columnHeaderName);
    const leftHeaders = await this.getLeftHeaders();
    const headerCount = await leftHeaders.count();
    
    for (let i = 0; i < headerCount; i++) {
      const header = leftHeaders.nth(i);
      const headerCells = header.locator('th');
      
      if (await headerCells.count() > headerIndex) {
        const headerText = await headerCells.nth(headerIndex).textContent();
        if (headerText?.toLowerCase() === columnHeader.toLowerCase()) {
          return i;
        }
      }
    }
    
    throw new HoonuitTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Get left header name index
   * @param leftHeaderName - Left header name
   */
  private async getLeftHeaderNameIndex(leftHeaderName: string): Promise<number> {
    const leftHeaderNames = this.tableElement.locator(this.leftHeaderHeaderNamesSelector);
    const headerCount = await leftHeaderNames.count();
    
    for (let i = 0; i < headerCount; i++) {
      const headerName = leftHeaderNames.nth(i);
      const headerText = await headerName.textContent();
      
      if (headerText?.trim() === leftHeaderName.trim()) {
        return i;
      }
    }
    
    throw new HoonuitTableException(`Left header name '${leftHeaderName}' not found`);
  }

  /**
   * Get grid column header index
   * @param columnHeader - Column header name
   */
  protected async getGridColumnHeaderIndex(columnHeader: string): Promise<number> {
    const headers = await this.getHeaders();
    const headerCount = await headers.count();
    
    for (let i = 0; i < headerCount; i++) {
      const header = headers.nth(i);
      const headerText = await header.innerText();
      
      if (headerText.toLowerCase() === columnHeader.toLowerCase()) {
        return i;
      }
    }
    
    throw new HoonuitTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Get multiple records by left header and top headers
   * @param leftHeader - Left header name
   * @param topHeaders - Top header names
   */
  public async getRecords(leftHeader: string, ...topHeaders: string[]): Promise<string[]> {
    const leftIndex = await this.getLeftColumnHeaderIndex(leftHeader);
    const recordValues: string[] = [];
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    for (const topHeader of topHeaders) {
      const topIndex = await this.getGridColumnHeaderIndex(topHeader);
      const cellValue = await cells.nth(topIndex).innerText();
      recordValues.push(cellValue);
    }
    
    return recordValues;
  }

  /**
   * Get records by left header name and value with top headers
   * @param leftHeaderName - Left header name
   * @param leftHeaderValue - Left header value
   * @param topHeaders - Top header names
   */
  public async getRecordsByHeaderValue(leftHeaderName: string, leftHeaderValue: string, ...topHeaders: string[]): Promise<string[]> {
    const leftIndex = await this.getLeftColumnHeaderIndexByValue(leftHeaderName, leftHeaderValue);
    const recordValues: string[] = [];
    
    const rows = await this.getRows();
    const row = rows.nth(leftIndex);
    const cells = row.locator('td');
    
    for (const topHeader of topHeaders) {
      const topIndex = await this.getGridColumnHeaderIndex(topHeader);
      const cellValue = await cells.nth(topIndex).innerText();
      recordValues.push(cellValue);
    }
    
    return recordValues;
  }

  /**
   * Check if left header is displayed
   * @param columnHeader - Column header name
   */
  public async isLeftHeaderDisplayed(columnHeader: string): Promise<boolean> {
    try {
      await this.getLeftColumnHeaderIndex(columnHeader);
      return true;
    } catch (error) {
      if (error instanceof HoonuitTableException) {
        return false;
      }
      throw error;
    }
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
   * Get row headers as text array
   */
  public async getRowHeaders(): Promise<string[]> {
    const rows = await this.getRows();
    
    const count = await rows.count();
    const rowTexts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const rowText = await rows.nth(i).innerText();
      rowTexts.push(rowText.trim());
    }
    
    return rowTexts;
  }

  /**
   * Get cell value at specified row and column
   * @param rowIndex - Row index
   * @param colIndex - Column index
   */
  public async getCellValue(rowIndex: number, colIndex: number): Promise<string> {
    const rows = await this.getRows();
    
    if (rowIndex >= await rows.count()) {
      throw new Error(`Row index ${rowIndex} out of bounds`);
    }
    
    const row = rows.nth(rowIndex);
    const cells = row.locator('td');
    
    if (colIndex >= await cells.count()) {
      throw new Error(`Column index ${colIndex} out of bounds for row ${rowIndex}`);
    }
    
    return await cells.nth(colIndex).innerText();
  }

  /**
   * Get table data as a 2D array
   */
  public async getTableData(): Promise<string[][]> {
    const rowHeaders = await this.getRowHeaders();
    const colHeaders = await this.getHeaderTexts();
    const tableData: string[][] = [];
    
    // Add header row
    tableData.push([''].concat(colHeaders));
    
    // Add data rows
    for (let i = 0; i < rowHeaders.length; i++) {
      const row: string[] = [rowHeaders[i]];
      
      for (let j = 0; j < colHeaders.length; j++) {
        const cellValue = await this.getCellValue(i, j).catch(() => '');
        row.push(cellValue);
      }
      
      tableData.push(row);
    }
    
    return tableData;
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
    const cells = row.locator('td');
    
    if (colIndex >= await cells.count()) {
      throw new Error(`Column index ${colIndex} out of bounds for row ${rowIndex}`);
    }
    
    await cells.nth(colIndex).click();
  }
}