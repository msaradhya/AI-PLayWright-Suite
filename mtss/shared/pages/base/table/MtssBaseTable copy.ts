import { Page, Locator } from '@playwright/test';
import { MtssTableException } from '../../../exceptions/MtssTableException';

/**
 * Base class for MTSS tables
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default class MtssBaseTable {
  protected readonly page: Page;
  protected readonly tableElement: Locator;
  protected readonly cardElement?: Locator;
  
  // Selectors
  private readonly HEADER_DATE = 'thead tr th[class="dateCol"]';
  private readonly HEADER = 'thead tr th';
  private readonly TABLE = 'div.ag-root,app-crosstab-grid.crosstabGrid';
  private readonly ROWS = 'tbody tr';
  private readonly HEADER_CELL_MINUTES_TEXT_BOX = 'td input';
  private readonly HEADER_FILTER_MENU = 'span.ag-icon-menu';

  /**
   * Constructor with table element
   * @param page - Playwright Page object
   * @param tableSelector - Locator for the table element
   */
  constructor(page: Page, tableSelector: Locator | string) {
    this.page = page;
    
    if (typeof tableSelector === 'string') {
      this.tableElement = page.locator(tableSelector);
    } else {
      this.tableElement = tableSelector;
    }
  }

  /**
   * Constructor with table title (for use with MtssCard)
   * @param page - Playwright Page object
   * @param title - Title of the card containing the table
   * @param hasCard - Whether the table is within a card
   */
  constructor(page: Page, title: string, hasCard: boolean);
  constructor(page: Page, titleOrSelector: string | Locator, hasCard?: boolean) {
    this.page = page;
    
    if (typeof titleOrSelector === 'string' && hasCard) {
      // Initialize with card title
      const title = titleOrSelector;
      this.cardElement = page.locator('.pds-panel', { hasText: title });
      this.tableElement = this.cardElement.locator(this.TABLE);
    } else if (typeof titleOrSelector === 'string') {
      // Initialize with selector string
      this.tableElement = page.locator(titleOrSelector);
    } else {
      // Initialize with locator
      this.tableElement = titleOrSelector;
    }
  }

  /**
   * Get the table element from the card
   */
  protected getTableElement(): Locator {
    if (this.cardElement) {
      return this.cardElement.locator(this.TABLE);
    }
    return this.tableElement;
  }

  /**
   * Get all rows in the table
   */
  protected async rows(): Promise<Locator> {
    return this.tableElement.locator(this.ROWS);
  }

  /**
   * Get date headers in the table
   */
  protected async headers(): Promise<Locator> {
    return this.tableElement.locator(this.HEADER_DATE);
  }

  /**
   * Get all headers in the table
   */
  protected async headerNames(): Promise<Locator> {
    return this.tableElement.locator(this.HEADER);
  }

  /**
   * Get the index of a column header
   * @param columnHeader - The column header text to find
   */
  protected async getColumnHeaderIndex(columnHeader: string): Promise<number> {
    const headers = await this.headers();
    const count = await headers.count();
    
    for (let i = 0; i < count; i++) {
      const headerText = (await headers.nth(i).innerText()).trim();
      
      if (headerText.toLowerCase() === columnHeader.toLowerCase()) {
        return i;
      }
    }
    
    throw new MtssTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Get the index of a column header from all headers
   * @param columnHeader - The column header text to find
   */
  protected async getActualColumnHeaderIndex(columnHeader: string): Promise<number> {
    const headers = await this.headerNames();
    const count = await headers.count();
    
    for (let i = 0; i < count; i++) {
      const headerText = (await headers.nth(i).innerText()).trim();
      
      if (headerText.toLowerCase() === columnHeader.toLowerCase()) {
        return i;
      }
    }
    
    throw new MtssTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Get cell value from a specific row using actual headers
   * @param columnHeaderName - The column header name
   * @param rowNumber - The row number (1-based)
   */
  public async getCellValueFromRowForActualHeaders(columnHeaderName: string, rowNumber: number): Promise<string> {
    const rows = await this.rows();
    const headerIndex = await this.getActualColumnHeaderIndex(columnHeaderName);
    const cells = rows.nth(rowNumber - 1).locator('td');
    return await cells.nth(headerIndex - 1).innerText();
  }

  /**
   * Get cell value from a specific row
   * @param columnHeaderName - The column header name
   * @param rowNumber - The row number (1-based)
   */
  public async getCellValueFromRow(columnHeaderName: string, rowNumber: number): Promise<string> {
    const rows = await this.rows();
    const headerIndex = await this.getColumnHeaderIndex(columnHeaderName);
    const inputElements = rows.nth(rowNumber - 1).locator(this.HEADER_CELL_MINUTES_TEXT_BOX);
    const value = await inputElements.nth(headerIndex).inputValue();
    return value.trim();
  }

  /**
   * Clear attendance from a specific row
   * @param columnHeaderName - The column header name
   * @param rowNumber - The row number (1-based)
   */
  public async clearAttendanceFromRow(columnHeaderName: string, rowNumber: number): Promise<void> {
    const rows = await this.rows();
    const headerIndex = await this.getColumnHeaderIndex(columnHeaderName);
    
    // Clear the input field
    const inputElements = rows.nth(rowNumber - 1).locator(this.HEADER_CELL_MINUTES_TEXT_BOX);
    await inputElements.nth(headerIndex).clear();
    
    // Wait for the UI to update
    await this.page.waitForTimeout(5000);
    
    // Send a space character to trigger any validation
    await inputElements.nth(headerIndex).fill(" ");
    
    // Keep clicking until the SVG style indicates it's inactive (contains rgb(91, 116, 130))
    const svgElements = rows.nth(rowNumber - 1).locator('td svg');
    
    while (true) {
      const style = await svgElements.nth(headerIndex).getAttribute('style');
      if (style && style.includes('rgb(91, 116, 130)')) {
        break;
      }
      await svgElements.nth(headerIndex).click();
    }
  }

  /**
   * Set cell value for a specific row
   * @param columnHeaderName - The column header name
   * @param rowNumber - The row number (1-based)
   * @param value - The value to set
   */
  public async setCellValueForRow(columnHeaderName: string, rowNumber: number, value: string): Promise<void> {
    const rows = await this.rows();
    const headerIndex = await this.getColumnHeaderIndex(columnHeaderName);
    const inputElements = rows.nth(rowNumber - 1).locator(this.HEADER_CELL_MINUTES_TEXT_BOX);
    await inputElements.nth(headerIndex).fill(value);
  }

  /**
   * Get all rows in the table
   */
  public async getRows(): Promise<Locator> {
    return this.rows();
  }

  /**
   * Get date headers in the table
   */
  public async getHeaders(): Promise<Locator> {
    return this.headers();
  }

  /**
   * Get all headers in the table
   */
  public async getActualHeaders(): Promise<Locator> {
    return this.headerNames();
  }

  /**
   * Check if the table exists
   */
  public async exists(): Promise<boolean> {
    return await this.tableElement.count() > 0;
  }

  /**
   * Click an element using JavaScript
   * @param locator - The element to click
   */
  protected async clickByJavaScript(locator: Locator): Promise<void> {
    await this.page.evaluate(el => el.click(), await locator.elementHandle());
  }
}