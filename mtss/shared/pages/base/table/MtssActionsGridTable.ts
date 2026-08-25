import { Locator } from '@playwright/test';
import { MtssBaseTable } from './MtssBaseTable';
import { MtssTableException } from '../../../exceptions/MtssTableException';

/**
 * Actions Grid table class for MTSS - TypeScript/Playwright equivalent of Java MtssActionsGridTable
 * Extends MtssBaseTable with action-specific functionality for AG-Grid tables with action buttons
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export class MtssActionsGridTable extends MtssBaseTable {
  // Static selectors for AG-Grid action components
  private static readonly ACTION_TABLE_BODY = 'div.ag-body-viewport';
  private static readonly ACTION_TABLE_HEADERS = 'div.ag-header div.ag-header-row-column div.ag-header-cell';
  private static readonly ACTION_ROWS = 'div[role="rowgroup"] > div[role="row"]:not([class*="ag-header-row"])';
  private static readonly ACTION_HEADER_CELL_LABEL = 'span.ag-header-cell-text';
  private static readonly ACTION_SELECT_ROWS = 'div.ag-pinned-left-cols-container > div[role="row"]:not([class*="ag-header-row"])';
  private static readonly ACTION_SHARE_BUTTON = 'button[ngbtooltip="Share group"]';
  private static readonly ACTION_EDIT_BUTTON = 'button[aria-label="Edit this group"],button[aria-label*="Edit"] base-svg-icon.ng-star-inserted,button[aria-label*="Edit"]';
  private static readonly ACTION_DELETE_BUTTON = 'button[aria-label="Delete this group"],button[aria-label*="delete"],button[aria-label*="Delete"] base-svg-icon.ng-star-inserted';
  private static readonly ACTION_DROPDOWN_MENU = 'div.dropdown-menu.show';
  private static readonly ACTION_DROPDOWN_ITEM = 'button.dropdown-item';
  private static readonly ACTION_VIEW_BUTTON = 'button[aria-label="View this groups details"]';
  private static readonly ACTION_COPY_BUTTON = 'button[aria-label="Copy"] base-svg-icon';
  private static readonly ACTION_DROP_DOWN = 'class="dropdown"';
  private static readonly ACTION_NEW_ROWS = 'div[role="rowgroup"][ref="eContainer"] > div[role="row"]:not([class*="ag-header-row"])';

  /**
   * Constructor implementation - supports both title and table element
   * @param titleOrElement - Either a string title or Locator for table element
   */
  constructor(titleOrElement: string | Locator) {
    if (typeof titleOrElement === 'string') {
      super(titleOrElement, true);
    } else {
      super(titleOrElement);
    }
  }

  /**
   * Override rows method to return AG-Grid action table specific rows
   * @returns Row locators for AG-Grid action table
   */
  protected rows(): Locator {
    const tableBody = this.tableElement.locator(MtssActionsGridTable.ACTION_TABLE_BODY);
    return tableBody.locator(MtssActionsGridTable.ACTION_ROWS);
  }

  /**
   * Override headers method to return AG-Grid action table specific headers
   * @returns Header locators for AG-Grid action table
   */
  protected headers(): Locator {
    return this.tableElement.locator(MtssActionsGridTable.ACTION_TABLE_HEADERS);
  }

  /**
   * Get select rows (checkbox rows) for Select All Column
   * @returns Checkbox row locators
   */
  private selectRows(): Locator {
    const tableBody = this.tableElement.locator(MtssActionsGridTable.ACTION_TABLE_BODY);
    return tableBody.locator(MtssActionsGridTable.ACTION_SELECT_ROWS);
  }

  /**
   * Return Action Grid table Column header index using aria-colindex
   * @param columnHeader - Column header text to find
   * @returns aria-colindex value of the column header
   */
  protected async getAriaColindexOfColumnHeader(columnHeader: string): Promise<number> {
    const headers = this.headers();
    const count = await headers.count();

    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const labelElement = header.locator(MtssActionsGridTable.ACTION_HEADER_CELL_LABEL);
      
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
   * Select the checkboxes of the rows passed as parameters
   * @param columnName - Column name to filter by
   * @param rowValues - Array of row values to select
   */
  public async selectRowInView(columnName: string, ...rowValues: string[]): Promise<void> {
    const rowsToSelect = [...rowValues];
    const selectRowsIndex: number[] = [];
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    const rows = this.rows();
    const selectRows = this.selectRows();
    const rowCount = await rows.count();
    
    // Fetch all the rows index to select from the list of rows displayed based on the rowValue passed
    for (let i = 0; i < rowCount && selectRowsIndex.length < rowsToSelect.length; i++) {
      const cell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnHeaderIndex}"]`);
      const cellText = await cell.innerText();
      
      if (rowsToSelect.includes(cellText)) {
        selectRowsIndex.push(i);
      }
    }

    if (selectRowsIndex.length !== rowsToSelect.length) {
      throw new MtssTableException('Mismatch in rows to select sent as parameter and the rows fetched from the table');
    }

    // Click on the filtered row's checkboxes
    for (const rowIndex of selectRowsIndex) {
      const checkbox = selectRows.nth(rowIndex).locator('input.ag-checkbox-input');
      await checkbox.click();
    }
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
   * Check whether all values sent as parameter are present in specified column
   * @param columnName - Column name to check
   * @param expectedRowValues - Values to check for
   * @returns Boolean indicating if all values are found
   */
  public async isValuePresentInColumn(columnName: string, ...expectedRowValues: string[]): Promise<boolean> {
    const rowValues = [...expectedRowValues];
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(columnName);
    
    // Determine which rows to use
    let rows: Locator;
    const mainRowsCount = await this.rows().count();
    if (mainRowsCount > 0) {
      rows = this.rows1();
    } else {
      rows = this.rows();
    }

    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const expectedTextCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnHeaderIndex}"]`);
      await expectedTextCell.waitFor({ state: 'visible' });
      const expectedText = await expectedTextCell.innerText();

      const index = rowValues.indexOf(expectedText);
      if (index > -1) {
        rowValues.splice(index, 1);
      }
    }

    return rowValues.length === 0;
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
      await expectedTextCell.waitFor({ state: 'visible' });
      const expectedText = await expectedTextCell.innerText();

      if (filterColumnValue === expectedText) {
        const valueCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnCellToGetIndex}"]`);
        await valueCell.waitFor({ state: 'visible' });
        await valueCell.scrollIntoViewIfNeeded();
        return await valueCell.innerText();
      }
    }

    throw new Error(`Could not find row for column value: ${filterColumnValue}`);
  }

  /**
   * Click action column button (Delete, Edit, Copy, etc.)
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to match in filter column
   * @param actionColumnName - Action column name
   * @param action - Action to perform (Delete, Edit, Copy)
   */
  public async clickActionColumn(filterColumnName: string, filterColumnValue: string, actionColumnName: string, action: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    const rows = this.rows();
    const actionHeaderIndex = await this.getAriaColindexOfColumnHeader(actionColumnName);
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const expectedTextCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnHeaderIndex}"]`);
      await expectedTextCell.waitFor({ state: 'visible' });
      const expectedText = await expectedTextCell.innerText();

      if (expectedText.includes(filterColumnValue)) {
        const actionCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${actionHeaderIndex}"]`);
        
        if (action.includes('Delete')) {
          const deleteButton = actionCell.locator(MtssActionsGridTable.ACTION_DELETE_BUTTON);
          await this.clickByJavaScript(deleteButton);
          return;
        } else if (action.includes('Edit')) {
          const editButton = actionCell.locator(MtssActionsGridTable.ACTION_EDIT_BUTTON);
          await this.clickByJavaScript(editButton);
          return;
        } else if (action.includes('Copy')) {
          const copyButton = actionCell.locator(MtssActionsGridTable.ACTION_COPY_BUTTON);
          await this.clickByJavaScript(copyButton);
          return;
        }
      }
    }

    throw new Error(`Invalid action: ${action}`);
  }

  /**
   * Set header checkbox state
   * @param columnIndex - Column index of the checkbox
   * @param set - Whether to check or uncheck the checkbox
   */
  public async setHeaderCheckbox(columnIndex: number, set: boolean): Promise<void> {
    const headers = this.headers();
    const checkbox = headers.nth(columnIndex).locator('[type="checkbox"]');
    
    if (await checkbox.count() > 0) {
      const selected = await checkbox.isChecked();
      if (selected !== set) {
        const parent = checkbox.locator('..');
        await parent.click();
      }
    } else {
      throw new Error(`Could not find checkbox for column index: ${columnIndex}`);
    }
  }

  /**
   * Alternative rows method for fallback
   * @returns Alternative row locators
   */
  protected rows1(): Locator {
    const tableBody = this.tableElement.locator(MtssActionsGridTable.ACTION_TABLE_BODY);
    return tableBody.locator(MtssActionsGridTable.ACTION_NEW_ROWS);
  }

  /**
   * Click cell in view
   * @param filterColumnName - Column name to filter by
   * @param filterColumnValue - Value to match in filter column
   */
  public async clickCellInView(filterColumnName: string, filterColumnValue: string): Promise<void> {
    const columnHeaderIndex = await this.getAriaColindexOfColumnHeader(filterColumnName);
    await this.page.waitForLoadState('networkidle');
    
    // Determine which rows to use
    let rows: Locator;
    const mainRowsCount = await this.rows().count();
    if (mainRowsCount > 0) {
      rows = this.rows();
    } else {
      rows = this.rows1();
    }

    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const expectedCell = this.tableElement.locator(`div[row-index="${i}"] div[class*="ag-cell"][aria-colindex="${columnHeaderIndex}"]`);
      
      // Wait for element to be displayed
      await expectedCell.waitFor({ state: 'visible', timeout: 30000 });
      
      const cellText = await expectedCell.innerText();
      if (filterColumnValue === cellText) {
        await expectedCell.click();
        return;
      }
    }

    throw new Error(`Could not find the Column Values: ${filterColumnValue}`);
  }
}
