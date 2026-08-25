import { Page, Locator } from '@playwright/test';
import MtssBaseTable from './MtssBaseTable';
import { MtssTableException } from '../../../exceptions/MtssTableException';

/**
 * Specialized class for MTSS action-based grid tables
 * @author aradhyas (converted from Java by Ashok Garg)
 * @since 18/05/2025 (original: 10/08/2020)
 */
export default class MtssActionsGridTable extends MtssBaseTable {
  // Selectors
  private readonly TABLE_BODY = 'div.ag-body-viewport';
  private readonly TABLE_HEADERS = 'div.ag-header div.ag-header-row-column div.ag-header-cell';
  private readonly ROWS = 'div[role="rowgroup"] > div[role="row"]:not([class*="ag-header-row"])';
  private readonly HEADER_CELL_LABEL = 'span.ag-header-cell-text';
  private readonly SELECT_ROWS = 'div.ag-pinned-left-cols-container > div[role="row"]:not([class*="ag-header-row"])';
  private readonly SHARE_BUTTON = 'button[ngbtooltip="Share group"]';
  private readonly EDIT_BUTTON = 'button[aria-label="Edit this group"],button[aria-label*="Edit"] base-svg-icon.ng-star-inserted,button[aria-label*="Edit"]';
  private readonly DELETE_BUTTON = 'button[aria-label="Delete this group"],button[aria-label*="delete"],button[aria-label*="Delete"] base-svg-icon.ng-star-inserted';
  private readonly DROPDOWN_MENU = 'div.dropdown-menu.show';
  private readonly DROPDOWN_ITEM = 'button.dropdown-item';
  private readonly VIEW_BUTTON = 'button[aria-label="View this groups details"]';
  private readonly COPY_BUTTON = 'button[aria-label="Copy"] base-svg-icon';

  /**
   * Constructor with table element
   * @param page - Playwright Page object
   * @param tableSelector - Locator for the table element
   */
  constructor(page: Page, tableSelector: Locator);
  /**
   * Constructor with table title
   * @param page - Playwright Page object
   * @param title - Title of the card containing the table
   */
  constructor(page: Page, title: string);
  /**
   * Constructor with table title and card flag
   * @param page - Playwright Page object
   * @param title - Title of the card containing the table
   * @param hasCard - Flag indicating if the table is card-based
   */
  constructor(page: Page, title: string, hasCard: boolean);
  constructor(page: Page, titleOrSelector: string | Locator, hasCard?: boolean) {
    if (typeof titleOrSelector === 'string' && typeof hasCard === 'boolean') {
      super(page, titleOrSelector, hasCard);
    } else {
      super(page, titleOrSelector as any);
    }
  }

  /**
   * Override the rows method to get rows from this specific table type
   */
  protected async rows(): Promise<Locator> {
    const tableBody = this.tableElement.locator(this.TABLE_BODY);
    await tableBody.waitFor({ state: 'visible' });
    return tableBody.locator(this.ROWS);
  }

  /**
   * Override the headers method to get headers from this specific table type
   */
  protected async headers(): Promise<Locator> {
    const headers = this.tableElement.locator(this.TABLE_HEADERS);
    const count = await headers.count();
    if (count === 0) {
      throw new Error('No headers found in the table');
    }
    return headers;
  }

  /**
   * Get the select rows (checkboxes) in the table
   */
  private async selectRows(): Promise<Locator> {
    const tableBody = this.tableElement.locator(this.TABLE_BODY);
    await tableBody.waitFor({ state: 'visible' });
    const rows = tableBody.locator(this.SELECT_ROWS);
    const count = await rows.count();
    if (count === 0) {
      throw new Error('No selectable rows found in the table');
    }
    return rows;
  }

  /**
   * Get the aria-colindex attribute of a column header
   * @param columnHeader - The column header text to find
   */
  protected async getAriaColindexOfColumnHeader(columnHeader: string): Promise<number> {
    const headers = await this.headers();
    const count = await headers.count();
    
    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const headerText = await header.locator(this.HEADER_CELL_LABEL).innerText();
      
      if (headerText.toLowerCase() === columnHeader.toLowerCase()) {
        const ariaColindex = await header.getAttribute('aria-colindex');
        return parseInt(ariaColindex || '0', 10);
      }
    }
    
    throw new MtssTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Select specific rows in the table view based on values in a column
   * @param columnName - The column name to look for values
   * @param rowValues - The values to select (one or more)
   */
  public async selectRowInView(columnName: string, ...rowValues: string[]): Promise<void> {
    // Get column index based on column name
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    
    // Find all row indices that need to be selected based on rowValues
    const rowIndices: number[] = [];
    
    // For each row value, find its index in the table
    for (const rowValue of rowValues) {
      // Find cell with matching text in specified column
      const cellSelector = `div[class*='ag-cell'][aria-colindex='${columnHeaderIndex}']`;
      const cells = this.tableElement.locator(cellSelector);
      const cellCount = await cells.count();
      
      let found = false;
      for (let i = 0; i < cellCount; i++) {
        const cellText = await cells.nth(i).innerText();
        if (cellText === rowValue) {
          // Get row index from the parent row element
          const rowIndex = parseInt(await cells.nth(i).getAttribute('row-index') || '0', 10);
          rowIndices.push(rowIndex);
          found = true;
          break;
        }
      }
      
      if (!found) {
        throw new MtssTableException(`Row with value '${rowValue}' not found in column '${columnName}'`);
      }
    }
    
    // Verify all requested rows were found
    if (rowIndices.length !== rowValues.length) {
      throw new MtssTableException('Mismatch in rows to select sent as parameter and the rows fetched from the table');
    }
    
    // Click on checkboxes for all identified rows
    const selectRowsLocator = await this.selectRows();
    for (const index of rowIndices) {
      await selectRowsLocator.nth(index).locator('input.ag-checkbox-input').click();
    }
  }

  /**
   * Get the row index of a cell based on its column name and value
   * @param filterColumnName - The column name
   * @param filterColumnValue - The value to find
   */
  private async getRowIndex(filterColumnName: string, filterColumnValue: string): Promise<number> {
    const filterColumnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const columnValues = this.tableElement.locator(`div[class*='ag-cell'][aria-colindex='${filterColumnHeaderIndex}']`);
    
    // Find the cell that has the exact text
    const count = await columnValues.count();
    for (let i = 0; i < count; i++) {
      const text = await columnValues.nth(i).innerText();
      if (text === filterColumnValue) {
        const row = columnValues.nth(i).locator('xpath=..');
        const rowIndex = await row.getAttribute('aria-rowindex');
        return parseInt(rowIndex || '0', 10);
      }
    }
    
    throw new MtssTableException(`Row with value '${filterColumnValue}' not found in column '${filterColumnName}'`);
  }
  
  /**
   * Click the share button for a row
   * @param rowNumber - The row number (0-based)
   */
  public async clickShareButton(rowNumber: number): Promise<void> {
    const rows = await this.rows();
    await rows.nth(rowNumber).locator(this.SHARE_BUTTON).click();
  }
  
  /**
   * Click the edit button for a row
   * @param rowNumber - The row number (0-based)
   */
  public async clickEditButton(rowNumber: number): Promise<void> {
    const rows = await this.rows();
    await rows.nth(rowNumber).locator(this.EDIT_BUTTON).click();
  }
  
  /**
   * Click the delete button for a row
   * @param rowNumber - The row number (0-based)
   */
  public async clickDeleteButton(rowNumber: number): Promise<void> {
    const rows = await this.rows();
    await rows.nth(rowNumber).locator(this.DELETE_BUTTON).click();
  }
  
  /**
   * Click the view button for a row
   * @param rowNumber - The row number (0-based)
   */
  public async clickViewButton(rowNumber: number): Promise<void> {
    const rows = await this.rows();
    await rows.nth(rowNumber).locator(this.VIEW_BUTTON).click();
  }
  
  /**
   * Click the copy button for a row
   * @param rowNumber - The row number (0-based)
   */
  public async clickCopyButton(rowNumber: number): Promise<void> {
    const rows = await this.rows();
    await rows.nth(rowNumber).locator(this.COPY_BUTTON).click();
  }
  
  /**
   * Select an option from a dropdown menu
   * @param option - The option text to select
   */
  public async selectDropdownOption(option: string): Promise<void> {
    const dropdownMenu = this.page.locator(this.DROPDOWN_MENU);
    await dropdownMenu.waitFor({ state: 'visible' });
    
    const items = dropdownMenu.locator(this.DROPDOWN_ITEM);
    const count = await items.count();
    
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).innerText();
      if (text === option) {
        await items.nth(i).click();
        return;
      }
    }
    
    throw new Error(`Dropdown option '${option}' not found`);
  }
}