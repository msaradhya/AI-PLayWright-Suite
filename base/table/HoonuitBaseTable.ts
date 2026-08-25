import { Page, Locator, ElementHandle } from '@playwright/test';
import { HoonuitException } from '../../../exceptions/HoonuitException';
import { HoonuitTableException } from '../../../exceptions/HoonuitTableException';

/**
 * Base class for all Hoonuit tables
 * @author aradhyas (converted from Java by Sourav.Panda)
 * @since 18/05/2025 (original: 4/8/2021)
 */
export default abstract class HoonuitBaseTable {
  protected readonly page: Page;
  protected readonly tableElement: Locator;
  protected readonly cardElement?: Locator;
  protected readonly actionDropDown?: Locator;
  
  // Selectors
  private readonly TABLE_SELECTOR = 'div.ag-root,app-crosstab-grid.crosstabGrid';
  private readonly ACTION_DROPDOWN = 'app-checkbox-action-button > div.dropdown';
  private readonly HEADER_CELL_LABEL = 'span.ag-header-cell-text';
  private readonly HEADER_FILTER_MENU = 'span.ag-icon-menu';

  /**
   * Constructor with table title
   * @param page - Playwright Page object
   * @param title - Title of the card containing the table
   */
  constructor(page: Page, title: string);

  /**
   * Constructor with table element
   * @param page - Playwright Page object
   * @param tableLocator - Locator for the table element
   */
  constructor(page: Page, tableLocator: Locator);

  /**
   * Constructor with table title and action dropdown
   * @param page - Playwright Page object
   * @param title - Title of the card containing the table
   * @param hasActionDropdown - Whether the table has an action dropdown
   */
  constructor(page: Page, titleOrLocator: string | Locator, hasActionDropdown?: boolean) {
    this.page = page;
    
    if (typeof titleOrLocator === 'string') {
      // Initialize with card title
      const title = titleOrLocator;
      this.cardElement = page.locator('.pds-panel', { hasText: title });
      this.tableElement = this.cardElement.locator(this.TABLE_SELECTOR);
      
      if (hasActionDropdown) {
        this.actionDropDown = this.cardElement.locator(this.ACTION_DROPDOWN);
      }
    } else {
      // Initialize with table locator
      this.tableElement = titleOrLocator;
    }
  }

  /**
   * Abstract method to get table rows
   * Returns collection of row elements. Should be overridden by subclasses.
   */
  protected abstract getRows(): Promise<Locator>;

  /**
   * Abstract method to get table headers
   * Returns collection of header elements. Should be overridden by subclasses.
   */
  protected abstract getHeaders(): Promise<Locator>;

  /**
   * Get the aria-colindex attribute of a column header
   * @param columnHeader - The column header text to find
   */
  protected async getAriaColindexOfColumnHeader(columnHeader: string): Promise<number> {
    const headers = await this.getHeaders();
    const count = await headers.count();
    
    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const headerText = await header.locator(this.HEADER_CELL_LABEL).innerText();
      
      if (headerText.toLowerCase() === columnHeader.toLowerCase()) {
        const ariaColindex = await header.getAttribute('aria-colindex');
        return parseInt(ariaColindex || '0', 10);
      }
    }
    
    throw new HoonuitTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Get the index of a column header
   * @param columnHeader - The column header text to find
   */
  protected async getGridColumnHeaderIndex(columnHeader: string): Promise<number> {
    const headers = await this.getHeaders();
    const count = await headers.count();
    
    for (let i = 0; i < count; i++) {
      const headerText = await headers.nth(i).locator(this.HEADER_CELL_LABEL).innerText();
      
      if (headerText.toLowerCase() === columnHeader.toLowerCase()) {
        return i;
      }
    }
    
    throw new HoonuitTableException(`${columnHeader} column header passed as parameter is not found in table's header`);
  }

  /**
   * Filter table's rows by passing condition and the filter value to the header's filter functionality
   * @param columnName - The column to filter
   * @param condition - The filter condition (equals, contains, etc.)
   * @param filterValue - The value to filter for
   */
  public async headerFilters(columnName: string, condition: string, filterValue: string): Promise<void> {
    const headers = await this.getHeaders();
    const count = await headers.count();
    let headerCell: Locator | null = null;
    
    // Find the header cell with matching column name
    for (let i = 0; i < count; i++) {
      const header = headers.nth(i);
      const headerText = await header.locator(this.HEADER_CELL_LABEL).innerText();
      
      if (headerText.toLowerCase() === columnName.toLowerCase()) {
        headerCell = header;
        break;
      }
    }
    
    if (headerCell) {
      // Click on the filter menu icon
      await headerCell.locator(this.HEADER_FILTER_MENU).click();
      
      // Wait for filter menu to appear
      await this.page.locator('div.ag-filter-body-wrapper').waitFor({ state: 'visible', timeout: 4000 });
      
      // Open filter condition dropdown
      const filterDropdownIcon = this.page.locator('div.ag-filter-select span.ag-icon-small-down');
      await filterDropdownIcon.waitFor({ state: 'visible' });
      await filterDropdownIcon.click();
      
      // Wait for filter options to be visible
      await this.page.locator('div.ag-list.ag-select-list').first().waitFor({ state: 'visible' });
      
      // Select the matching filter condition
      const filterOptions = this.page.locator('div.ag-select-list-item');
      const optionCount = await filterOptions.count();
      
      for (let i = 0; i < optionCount; i++) {
        const option = filterOptions.nth(i);
        const optionText = await option.innerText();
        
        if (optionText === condition) {
          await option.click();
          break;
        }
      }
      
      // Enter filter value
      const filterInput = this.page.locator('div.ag-filter-body input.ag-text-field-input,div.ag-filter-body input.ag-number-field-input').first();
      await filterInput.waitFor({ state: 'visible' });
      await filterInput.fill(filterValue);
      
      // Close the filter menu by clicking on the header
      await headerCell.click();
      
      // Wait for filter to apply
      await this.page.waitForTimeout(2000);
    } else {
      throw new HoonuitTableException(`No column with column name ${columnName} is found in the table's header`);
    }
  }

  /**
   * Get all rows in the table
   */
  public async getAllRows(): Promise<Locator> {
    return this.getRows();
  }

  /**
   * Get all headers in the table
   */
  public async getAllHeaders(): Promise<Locator> {
    return this.getHeaders();
  }

  /**
   * Check if the table exists
   */
  public async exists(): Promise<boolean> {
    return await this.tableElement.count() > 0;
  }

  /**
   * Check if the card exists
   */
  public async isCardExists(): Promise<boolean> {
    if (this.cardElement) {
      return await this.cardElement.count() > 0;
    }
    return false;
  }

  /**
   * Select an action from the action dropdown
   * @param action - The action to select
   */
  public async selectAction(action: string): Promise<void> {
    if (!this.actionDropDown) {
      throw new HoonuitException("Action dropdown is not available for this table");
    }
    
    // Open the dropdown
    await this.actionDropDown.locator('button.dropdown-toggle').click();
    
    // Wait for dropdown menu to be visible
    await this.actionDropDown.locator('div.dropdown-menu.show').waitFor({ state: 'visible' });
    
    // Find and click the requested action
    const actionItems = this.actionDropDown.locator('button[ngbdropdownitem]');
    const itemCount = await actionItems.count();
    
    for (let i = 0; i < itemCount; i++) {
      const item = actionItems.nth(i);
      const itemText = await item.innerText();
      
      if (itemText === action) {
        await item.click();
        return;
      }
    }
    
    throw new HoonuitException(`Could not find the Action in dropdown: ${action}`);
  }
}