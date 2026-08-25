import { Page, Locator } from '@playwright/test';
import { MtssTableException } from '../../../exceptions/MtssTableException';

/**
 * Base class for MTSS tables - TypeScript/Playwright equivalent of Java MtssBaseTable
 * Provides common functionality for table operations including headers, rows, filters, and cell operations
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export class MtssBaseTable {
  // Static selectors equivalent to Java constants
  private static readonly HEADER_DATE = 'thead tr th[class="dateCol"]';
  private static readonly HEADER = 'thead tr th';
  private static readonly TABLE = 'div.ag-root,app-crosstab-grid.crosstabGrid';
  private static readonly ROWS = 'tbody tr';
  private static readonly HEADER_CELL_LABEL = 'span.ag-header-cell-text';
  private static readonly HEADER_CELL_MINUTES_TEXT_BOX = 'td input';
  private static readonly HEADER_FILTER_MENU = 'span.ag-icon-menu';

  protected page: Page;
  protected tableElement: Locator;
  protected card?: any; // MtssCard equivalent - to be implemented

  /**
   * Constructor - supports both Locator and string-based initialization
   * @param titleOrElement - Either a Locator for the table element or a string title for card-based initialization
   * @param hasCard - Whether to use card-based initialization (only used when first param is string)
   */
  constructor(titleOrElement: string | Locator, hasCard?: boolean) {
    if (typeof titleOrElement === 'string') {
      // TODO: Initialize MtssCard and get page reference
      // This would require MtssCard implementation
      const title = titleOrElement;
      // For now, throw error as MtssCard is not implemented
      throw new Error('MtssCard-based constructor not yet implemented. Please use Locator-based constructor.');
    } else {
      this.page = titleOrElement.page();
      this.tableElement = titleOrElement;
      this.tableElement.scrollIntoViewIfNeeded();
    }
  }

  /**
   * Get table element from card (equivalent to Java $getTableElement)
   * @returns Table element locator
   */
  protected getTableElement(): Locator | null {
    if (this.card?.isExists()) {
      return this.card.cardElement().locator(MtssBaseTable.TABLE);
    }
    return null;
  }

  /**
   * Returns collection of row elements. Can be overridden to point to different elements.
   * @returns Row locators
   */
  protected rows(): Locator {
    return this.tableElement.locator(MtssBaseTable.ROWS);
  }

  /**
   * Returns collection of header elements (date headers). Can be overridden if different than default.
   * @returns Header locators
   */
  protected headers(): Locator {
    return this.tableElement.locator(MtssBaseTable.HEADER_DATE);
  }

  /**
   * Returns collection of all header elements. Can be overridden if different than default.
   * @returns All header locators
   */
  protected headerNames(): Locator {
    return this.tableElement.locator(MtssBaseTable.HEADER);
  }

  /**
   * Return column header index
   * @param columnHeader - Column header text to find
   * @returns Index of the column header
   */
  protected async getColumnHeaderIndex(columnHeader: string): Promise<number> {
    const headers = this.getHeaders();
    const count = await headers.count();

    for (let i = 0; i < count; i++) {
      const headerText = await headers.nth(i).innerText();
      if (headerText.trim().toLowerCase() === columnHeader.toLowerCase()) {
        return i;
      }
    }

    throw new Error(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Return Action Grid table column header index using aria-colindex
   * @param columnHeader - Column header text to find
   * @returns aria-colindex value of the column header
   */
  protected async getAriaColindexOfColumnHeader(columnHeader: string): Promise<number> {
    const headers = this.headers();
    const count = await headers.count();

    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const labelElement = header.locator(MtssBaseTable.HEADER_CELL_LABEL);
      
      if (await labelElement.count() > 0) {
        const innerText = await labelElement.innerText();
        if (innerText.toLowerCase() === columnHeader.toLowerCase()) {
          const ariaColindex = await header.getAttribute('aria-colindex');
          if (ariaColindex) {
            return parseInt(ariaColindex);
          }
        }
      }
    }

    throw new MtssTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Filter table's rows by passing condition and filter value to header's filter functionality
   * @param columnName - Name of the column to filter
   * @param condition - Filter condition (e.g., "equals", "contains")
   * @param filterValue - Value to filter by
   */
  public async headerFilters(columnName: string, condition: string, filterValue: string): Promise<void> {
    let headerCell: Locator | null = null;

    const headers = this.headers();
    const count = await headers.count();

    // Find the header cell with matching column name
    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const labelElement = header.locator(MtssBaseTable.HEADER_CELL_LABEL);
      
      if (await labelElement.count() > 0) {
        const text = await labelElement.innerText();
        if (text.toLowerCase() === columnName.toLowerCase()) {
          headerCell = header;
          break;
        }
      }
    }

    if (headerCell) {
      // Click filter menu
      await headerCell.locator(MtssBaseTable.HEADER_FILTER_MENU).click();

      // Wait for filter body to appear
      await this.page.locator('div.ag-filter-body-wrapper').waitFor({ state: 'visible', timeout: 4000 });
      
      // Click dropdown to select condition
      await this.page.locator('div.ag-filter-select span.ag-icon-small-down').waitFor({ state: 'visible' });
      await this.page.locator('div.ag-filter-select span.ag-icon-small-down').click();
      
      await this.page.locator('div.ag-list.ag-select-list').waitFor({ state: 'visible' });

      // Select the condition from dropdown
      const conditionItems = this.page.locator('div.ag-select-list-item');
      const conditionCount = await conditionItems.count();

      for (let i = 0; i < conditionCount; i++) {
        const item = conditionItems.nth(i);
        const itemText = await item.innerText();
        if (itemText === condition) {
          await item.click();
          break;
        }
      }

      // Enter filter value
      const filterInput = this.page.locator('div.ag-filter-body input.ag-text-field-input,div.ag-filter-body input.ag-number-field-input').first();
      await filterInput.waitFor({ state: 'visible' });
      await filterInput.fill(filterValue);

      // Click outside to close filter
      await headerCell.click();
      await this.page.waitForTimeout(2000);

    } else {
      throw new Error(`No column with column name ${columnName} is found in the table's header`);
    }
  }

  /**
   * Return actual column header index
   * @param columnHeader - Column header text to find
   * @returns Index of the column header from actual headers
   */
  protected async getActualColumnHeaderIndex(columnHeader: string): Promise<number> {
    const headers = this.getActualHeaders();
    const count = await headers.count();

    for (let i = 0; i < count; i++) {
      const headerText = await headers.nth(i).innerText();
      if (headerText.trim().toLowerCase() === columnHeader.toLowerCase()) {
        return i;
      }
    }

    throw new Error(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Get cell value from row using actual headers
   * @param columnHeaderName - Column header name
   * @param rowNumber - Row number (1-based)
   * @returns Cell value
   */
  public async getCellValueFromRowForActualHeaders(columnHeaderName: string, rowNumber: number): Promise<string> {
    const rows = this.getRows();
    const columnIndex = await this.getActualColumnHeaderIndex(columnHeaderName);
    const targetRow = rows.nth(rowNumber - 1);
    const cells = targetRow.locator('td');
    return await cells.nth(columnIndex - 1).innerText();
  }

  /**
   * Get cell value from row
   * @param columnHeaderName - Column header name
   * @param rowNumber - Row number (1-based)
   * @returns Cell value
   */
  public async getCellValueFromRow(columnHeaderName: string, rowNumber: number): Promise<string> {
    const rows = this.getRows();
    const columnIndex = await this.getColumnHeaderIndex(columnHeaderName);
    const targetRow = rows.nth(rowNumber - 1);
    const inputs = targetRow.locator(MtssBaseTable.HEADER_CELL_MINUTES_TEXT_BOX);
    const value = await inputs.nth(columnIndex).inputValue();
    return value.trim();
  }

  /**
   * Clear attendance from row
   * @param columnHeaderName - Column header name
   * @param rowNumber - Row number (1-based)
   */
  public async clearAttendanceFromRow(columnHeaderName: string, rowNumber: number): Promise<void> {
    const rows = this.getRows();
    const columnIndex = await this.getColumnHeaderIndex(columnHeaderName);
    const targetRow = rows.nth(rowNumber - 1);
    
    // Clear the input field
    const inputs = targetRow.locator(MtssBaseTable.HEADER_CELL_MINUTES_TEXT_BOX);
    await inputs.nth(columnIndex).clear();
    
    await this.page.waitForTimeout(5000);
    
    // Send space character
    await inputs.nth(columnIndex).fill(' ');
    
    // Keep clicking SVG until style contains the inactive color
    const svgElements = targetRow.locator('td svg');
    const targetSvg = svgElements.nth(columnIndex);
    
    while (true) {
      const style = await targetSvg.getAttribute('style');
      if (style && style.includes('rgb(91, 116, 130)')) {
        break;
      }
      await targetSvg.click();
    }
  }

  /**
   * Set cell value for row
   * @param columnHeaderName - Column header name
   * @param rowNumber - Row number (1-based)
   * @param value - Value to set
   */
  public async setCellValueForRow(columnHeaderName: string, rowNumber: number, value: string): Promise<void> {
    const rows = this.getRows();
    const columnIndex = await this.getColumnHeaderIndex(columnHeaderName);
    const targetRow = rows.nth(rowNumber - 1);
    const inputs = targetRow.locator(MtssBaseTable.HEADER_CELL_MINUTES_TEXT_BOX);
    await inputs.nth(columnIndex).fill(value);
  }

  /**
   * Get all rows
   * @returns Row locators
   */
  public getRows(): Locator {
    return this.rows();
  }

  /**
   * Get headers (date headers)
   * @returns Header locators
   */
  public getHeaders(): Locator {
    return this.headers();
  }

  /**
   * Get actual headers (all headers)
   * @returns All header locators
   */
  public getActualHeaders(): Locator {
    return this.headerNames();
  }

  /**
   * Check if table exists
   * @returns Boolean indicating if table exists
   */
  public async exists(): Promise<boolean> {
    return await this.tableElement.count() > 0;
  }

  /**
   * Click element using JavaScript
   * @param element - Element to click
   */
  protected async clickByJavaScript(element: Locator): Promise<void> {
    await this.page.evaluate((el) => {
      if (el && el instanceof HTMLElement) {
        el.click();
      }
    }, await element.elementHandle());
  }
}
