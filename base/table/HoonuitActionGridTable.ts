import { Page, Locator } from '@playwright/test';
import HoonuitBaseTable from './HoonuitBaseTable';

/**
 * HoonuitActionGridTable class for interacting with action grid table components
 * @author aradhyas (converted from Java)
 * @since 22/05/2025
 */
export class HoonuitActionGridTable extends HoonuitBaseTable {
  
  /**
   * Constructor for action grid table
   * @param page - Playwright Page object
   * @param title - Title of the card containing the table
   */
  constructor(page: Page, title: string) {
    super(page, title);
  }

  /**
   * Get table rows implementation
   */
  protected async getRows(): Promise<Locator> {
    return this.tableElement.locator('div[role="row"]:not(.ag-header-row)');
  }

  /**
   * Get table headers implementation
   */
  protected async getHeaders(): Promise<Locator> {
    return this.tableElement.locator('div[role="columnheader"]');
  }

  /**
   * Get the number of rows in the table
   */
  public async getRowCount(): Promise<number> {
    const rows = await this.getRows();
    return await rows.count();
  }

  /**
   * Get the number of columns in the table
   */
  public async getColumnCount(): Promise<number> {
    const headers = await this.getHeaders();
    return await headers.count();
  }

  /**
   * Get all column headers text
   */
  public async getColumnHeaders(): Promise<string[]> {
    const headers = await this.getHeaders();
    const headerTexts: string[] = [];
    const count = await headers.count();
    
    for (let i = 0; i < count; i++) {
      const headerText = await headers.nth(i).locator('span.ag-header-cell-text').innerText();
      headerTexts.push(headerText);
    }
    
    return headerTexts;
  }

  /**
   * Get data from a specific row and column
   * @param rowIndex - Zero-based row index
   * @param columnIndex - Zero-based column index
   */
  public async getCellData(rowIndex: number, columnIndex: number): Promise<string> {
    const rows = await this.getRows();
    const row = rows.nth(rowIndex);
    const cells = row.locator('div[role="gridcell"]');
    return await cells.nth(columnIndex).innerText();
  }

  /**
   * Get all data from a specific row
   * @param rowIndex - Zero-based row index
   */
  public async getRowData(rowIndex: number): Promise<string[]> {
    const rows = await this.getRows();
    const row = rows.nth(rowIndex);
    const cells = row.locator('div[role="gridcell"]');
    const cellData: string[] = [];
    const cellCount = await cells.count();
    
    for (let i = 0; i < cellCount; i++) {
      const cellText = await cells.nth(i).innerText();
      cellData.push(cellText);
    }
    
    return cellData;
  }

  /**
   * Get all table data
   */
  public async getAllTableData(): Promise<string[][]> {
    const rows = await this.getRows();
    const rowCount = await rows.count();
    const tableData: string[][] = [];
    
    for (let i = 0; i < rowCount; i++) {
      const rowData = await this.getRowData(i);
      tableData.push(rowData);
    }
    
    return tableData;
  }

  /**
   * Check if table has data
   */
  public async hasData(): Promise<boolean> {
    const rowCount = await this.getRowCount();
    return rowCount > 0;
  }

  /**
   * Wait for table to load data
   */
  public async waitForTableToLoad(): Promise<void> {
    // Wait for the table to be visible
    await this.tableElement.waitFor({ state: 'visible' });
    
    // Wait for at least one row to be present or for "no data" message
    await this.page.waitForFunction(() => {
      const table = (globalThis as any).document?.querySelector('div.ag-root');
      if (!table) return false;
      
      const rows = table.querySelectorAll('div[role="row"]:not(.ag-header-row)');
      const noDataMessage = table.querySelector('div.ag-overlay-no-rows-center');
      
      return rows.length > 0 || noDataMessage;
    }, { timeout: 30000 });
  }
}

export default HoonuitActionGridTable;