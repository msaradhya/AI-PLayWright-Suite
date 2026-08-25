import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { HoonuitException } from '../../exceptions/HoonuitException';

/**
 * FilterData - Consolidated Page Object for Filter Components
 *
 * This class provides comprehensive methods to interact with filter components in the UI.
 * It combines functionality from multiple filter implementations into a single, unified interface.
 *
 * Features:
 * - Single and multiple filter selection
 * - Filter clearing (individual and all)
 * - Filter value retrieval
 * - Text-based filter input
 * - Comprehensive loader handling
 *
 * @author Sourav.Panda (original Java version)
 * @author Consolidated from filter-data.page.ts, filter-data.ts, FilterData.ts
 * @since 4/7/2021
 */
export class FilterData {
  private readonly page: Page;

  // Locator selectors as private readonly constants
  private readonly FILTER_DATA_DROPDOWN = 'app-filter-button';
  private readonly FILTER_DATA_BUTTON = 'button.pds-button-multi-action--primary';
  private readonly FILTER_DATA_MULTI_ACTION_BUTTON = 'button.pds-button-multi-action';
  private readonly FILTER_DATA_MENU_ITEM = 'button.dropdown-item.filter-label span:not([class])';
  private readonly DROPDOWN_LIST = 'div.dropdown-list';
  private readonly SEARCH_TEXTBOX = 'input[id^="cbSearch"],input[id^="radioSearch"]';
  private readonly LIST_ITEM = 'li.dropdown-item';
  private readonly CLEAR_FILTER_LIST = 'div.align-items-baseline';
  private readonly CLEAR_FILTER_LABEL = 'span';
  private readonly CLEAR_ALL_BUTTON = '.d-print-none.pds-button.pds-button-blend.ng-star-inserted';
  private readonly PDS_LOADER = '.pds-loader-sm.style-scope.pds-loader';
  private readonly FORM_CONTROL = '.form-control';
  private readonly GLOBAL_TABS = '.pds-global-tabs';

  /**
   * Constructor for FilterData class
   * @param page The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  // ============================================
  // PUBLIC GETTER FOR PAGE (for subclass access)
  // ============================================

  /**
   * Get the Playwright Page object
   */
  protected getPage(): Page {
    return this.page;
  }

  /**
   * It filters the data based on the menu name and it searches the item from the list.
   * @param filterMap Map containing filter menu name as key and filter value as value
   */
  // ============================================
  // FILTER SELECTION METHODS
  // ============================================

  /**
   * Select filter data based on the provided filter map.
   * Filters the data based on the menu name and searches the item from the list.
   *
   * @param filterMap Map or Record containing filter menu name as key and filter value as value
   * @example
   * // Using Map
   * const filters = new Map<string, string>();
   * filters.set('School', 'Elementary School');
   * await filterData.selectFilterData(filters);
   *
   * // Using Record
   * await filterData.selectFilterData({ 'School': 'Elementary School' });
   */
  async selectFilterData(filterMap: Map<string, string> | Record<string, string>): Promise<void> {
    //await this.waitForAllLoaders();

    await this.openFilterDataDropdown();
    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor();

    // Convert to entries if filterMap is a Record object
    const entries = filterMap instanceof Map ?
      Array.from(filterMap.entries()) :
      Object.entries(filterMap);

    let lastFilter = '';
    for (const [menuName, value] of entries) {
      // Use exact text matching to avoid strict mode violations
      const menuLocator = menuItems.filter({ hasText: this.escapeRegex(menuName) });
      await menuLocator.scrollIntoViewIfNeeded();
      await menuLocator.click();
      await this.page.waitForTimeout(500);
      
      await this.selectFilter(value);
      lastFilter = value;
    }

    await this.closeFilterDropdown();
    
    // Wait for filter to be applied
    if (lastFilter) {
      await this.page.locator(`div[aria-label='Filter for ${lastFilter}']`).waitFor({ state: 'visible', timeout: 60000 });
    }
    
    await this.waitForAllLoaders();
  }

  /**
   * It filters the data based on the menu name and it searches the list of items passed as the parameter(value of the map) from the list.
   * @param multiFiltersMap Map containing filter menu name as key and array of filter values as value
   */
  /**
   * Select multiple filter values for multiple filter categories.
   * Filters the data based on the menu name and searches the list of items passed as parameter.
   *
   * @param multiFiltersMap Map or Record containing filter menu name as key and array of filter values as value
   * @example
   * const filters = new Map<string, string[]>();
   * filters.set('Grade', ['9th', '10th', '11th']);
   * await filterData.selectMultiFiltersData(filters);
   */
  async selectMultiFiltersData(multiFiltersMap: Map<string, string[]> | Record<string, string[]>): Promise<void> {
    await this.waitForAllLoaders();

    await this.openFilterDataDropdown();
    await this.page.waitForTimeout(500);
    
    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor();

    // Convert to entries if multiFiltersMap is a Record object
    const entries = multiFiltersMap instanceof Map ?
      Array.from(multiFiltersMap.entries()) :
      Object.entries(multiFiltersMap);

    let lastFilter = '';
    for (const [menuName, searchCriteria] of entries) {
      const menuLocator = menuItems.filter({ hasText: this.escapeRegex(menuName) });
      await this.page.waitForTimeout(500);
      await menuLocator.click();
      
      for (const searchElement of searchCriteria) {
        await this.page.waitForTimeout(1000);
        await this.selectFilter(searchElement);
        lastFilter = searchElement;
      }
    }

    await this.closeFilterDropdown();
    
    // Wait for filter to be applied
    if (lastFilter) {
      await this.page.locator(`div[aria-label='Filter for ${lastFilter}']`).waitFor({ state: 'visible', timeout: 60000 });
    }
    
    await this.waitForAllLoaders();
  }

  /**
   * Select a single filter with a specific value.
   * Convenience method for single filter selection.
   *
   * @param filterName The name of the filter category
   * @param filterValue The value to select
   * @example
   * await filterData.selectFilterDataSingle('School', 'Elementary School');
   */
  async selectFilterDataSingle(filterName: string, filterValue: string): Promise<void> {
    await this.waitForAllLoaders();
    
    await this.openFilterDataDropdown();
    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor();
    
    const menuItem = menuItems.filter({ hasText: this.escapeRegex(filterName) });
    await menuItem.scrollIntoViewIfNeeded();
    await menuItem.click();
    
    await this.selectFilter(filterValue);
    await this.closeFilterDropdown();
    
    await this.waitForAllLoaders();
    await this.page.locator(this.PDS_LOADER).waitFor({ state: 'hidden' });
  }

  /**
   * Alias for selectFilterDataSingle - provides a simpler interface.
   *
   * @param menuName Name of the filter menu
   * @param filterValue Value to filter by
   */
  async selectSingleFilter(menuName: string, filterValue: string): Promise<void> {
    await this.selectFilterDataSingle(menuName, filterValue);
  }

  /**
   * Select a filter with multiple values.
   *
   * @param filterName The name of the filter category
   * @param filterValues Array of values to select
   * @example
   * await filterData.selectFilterDataMultiple('Grade', '9th', '10th', '11th');
   */
  async selectFilterDataMultiple(filterName: string, ...filterValues: string[]): Promise<void> {
    await this.waitForAllLoaders();
    
    await this.openFilterDataDropdown();
    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor();
    
    const menuItem = menuItems.filter({ hasText: this.escapeRegex(filterName) });
    await menuItem.scrollIntoViewIfNeeded();
    await menuItem.click();
    await this.page.waitForTimeout(500);
    
    for (const filterData of filterValues) {
      await this.selectFilter(filterData);
    }
    
    await this.closeFilterDropdown();
    await this.waitForAllLoaders();
  }

  /**
   * Enter text directly into a filter input field.
   * Used for filters that accept free-form text input.
   *
   * @param filterName Name of the filter category
   * @param filterValue Text value to enter
   * @example
   * await filterData.enterTextFilterData('Student ID', '12345');
   */
  async enterTextFilterData(filterName: string, filterValue: string): Promise<void> {
    await this.waitForAllLoaders();
    
    await this.openFilterDataDropdown();
    
    const menuItem = this.page.locator(this.FILTER_DATA_MENU_ITEM).filter({ hasText: filterName });
    await menuItem.scrollIntoViewIfNeeded();
    await menuItem.click();
    
    const formControl = this.page.locator(this.FORM_CONTROL);
    await formControl.waitFor({ state: 'visible' });
    await formControl.fill(filterValue);
    
    const globalTabs = this.page.locator(this.GLOBAL_TABS);
    await globalTabs.waitFor({ state: 'visible' });
    await globalTabs.click();
    
    await this.waitForAllLoaders();
  }

  // ============================================
  // FILTER CLEARING METHODS
  // ============================================

  /**
   * Clear specific filters by their names.
   *
   * @param filterNames Names of the filters to clear
   * @throws HoonuitException if filter names are not found or count mismatch
   * @example
   * await filterData.clear('School', 'Grade');
   */
  async clear(...filterNames: string[]): Promise<void> {
    const filterElements = this.page.locator(this.CLEAR_FILTER_LIST);
    await filterElements.first().waitFor();
    
    const filterList = [...filterNames];
    const filterCount = await filterElements.count();
    
    if (filterCount >= filterList.length) {
      for (let i = filterCount - 1; i >= 0; i--) {
        const labelElement = filterElements.nth(i).locator(this.CLEAR_FILTER_LABEL);
        const text = await labelElement.textContent() || '';
        
        if (filterList.includes(text)) {
          filterList.splice(filterList.indexOf(text), 1);
          await filterElements.nth(i).locator('button').click();
          await this.page.waitForTimeout(500);
          await this.waitForAllLoaders();
        }
      }
      
      await this.waitForAllLoaders();
      if (filterList.length > 0) {
        throw new HoonuitException(`Could not find the filter name: ${filterList.join(', ')}`);
      }
      
    } else {
      throw new HoonuitException('The size of filter passed as parameter is more than the filter data enabled.');
    }
    
    await this.waitForAllLoaders();
    await this.page.locator(this.PDS_LOADER).waitFor({ state: 'detached' });
  }

  /**
   * Clear all enabled filters at once.
   */
  async clearAll(): Promise<void> {
    const clearButton = this.page.locator(this.CLEAR_ALL_BUTTON);
    const isVisible = await clearButton.isVisible();
    
    if (isVisible) {
      await clearButton.click();
    }
    
    await this.waitForAllLoaders();
    await this.page.locator(this.PDS_LOADER).waitFor({ state: 'hidden' });
  }

  /**
   * Alias for clearAll - clears all applied filters.
   */
  async clearAllFilters(): Promise<void> {
    await this.clearAll();
  }

  // ============================================
  // FILTER RETRIEVAL METHODS
  // ============================================

  /**
   * Get all currently enabled/applied filters.
   *
   * @returns List of enabled filter names
   */
  async getAllFilter(): Promise<string[]> {
    const filterElements = this.page.locator(this.CLEAR_FILTER_LIST);
    const filtersEnabled: string[] = [];
    
    const filterCount = await filterElements.count();
    for (let i = filterCount - 1; i >= 0; i--) {
      const text = await filterElements.nth(i).textContent();
      if (text) filtersEnabled.push(text);
    }
    
    return filtersEnabled;
  }

  /**
   * Get all available filter category names from the dropdown.
   *
   * @returns List of filter category names
   */
  async getFilterKeys(): Promise<string[]> {
    await this.openFilterDataDropdown();
    
    const filterDataText = await this.page.locator(this.FILTER_DATA_MENU_ITEM).allTextContents();
    
    await this.closeFilterDropdown();
    await this.waitForAllLoaders();
    
    return filterDataText;
  }

  /**
   * Alias for getFilterKeys - get all available filter menu items.
   *
   * @returns List of available filter menu item names
   */
  async getAvailableFilterMenuItems(): Promise<string[]> {
    return this.getFilterKeys();
  }

  /**
   * Get all values available for a specific filter category.
   *
   * @param filterKey The filter category name (e.g., 'School', 'Ethnicity', 'Gender', 'Staff')
   * @returns List of available filter values
   */
  async getValuesOfFilterKey(filterKey: string): Promise<string[]> {
    await this.openFilterDataDropdown();
    
    const filterItem = this.page.locator(this.FILTER_DATA_MENU_ITEM).filter({ hasText: this.escapeRegex(filterKey) });
    await filterItem.first().click();
    
    await this.waitForAllLoaders();
    
    const filterDataText = await this.page.locator(this.LIST_ITEM).allTextContents();
    
    await this.closeFilterDropdown();
    
    return filterDataText;
  }

  /**
   * Get options for a specific filter category.
   *
   * @param filterName Name of the filter category
   * @returns List of available filter options
   */
  async getFilterOption(filterName: string): Promise<string[]> {
    await this.waitForAllLoaders();
    
    await this.openFilterDataDropdown();
    const menuItem = this.page.locator(this.FILTER_DATA_MENU_ITEM).filter({ hasText: filterName });
    await menuItem.click();
    
    const dropdownList = this.page.locator(this.DROPDOWN_LIST);
    await dropdownList.waitFor({ state: 'visible' });
    
    const filterOptions = await dropdownList.locator(this.LIST_ITEM).allTextContents();
    
    await this.closeFilterDropdown();
    await this.waitForAllLoaders();
    
    return filterOptions;
  }

  /**
   * Get all filter options for all filter categories.
   * Returns a comprehensive map of all filters and their available values.
   *
   * @returns Map of filter categories and their available options
   */
  async getFilterDataOptions(): Promise<Map<string, string[]>> {
    const filterDataOptions = new Map<string, string[]>();
    
    await this.openFilterDataDropdown();
    const filters = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    const filterCount = await filters.count();
    
    for (let i = 0; i < filterCount; i++) {
      const filter = filters.nth(i);
      const filterText = await filter.textContent() || '';
      
      await filter.click();
      
      const dropdownList = this.page.locator(this.DROPDOWN_LIST);
      await dropdownList.waitFor({ state: 'visible' });
      
      const options = await dropdownList.locator(this.LIST_ITEM).allTextContents();
      filterDataOptions.set(filterText, options);
    }
    
    await this.closeFilterDropdown();
    await this.waitForAllLoaders();
    
    return filterDataOptions;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Check if the filter dropdown is currently open.
   *
   * @returns true if the dropdown is visible
   */
  async isFilterDropdownOpen(): Promise<boolean> {
    const dropdownList = this.page.locator(this.DROPDOWN_LIST);
    return await dropdownList.isVisible();
  }

  // ============================================
  // PRIVATE HELPER METHODS
  // ============================================

  /**
   * Open the filter data dropdown.
   * Handles both primary button and multi-action button scenarios.
   */
  private async openFilterDataDropdown(): Promise<void> {
    await this.page.waitForTimeout(500);
    
    const filterElement = this.page.locator(this.FILTER_DATA_DROPDOWN);
    await filterElement.waitFor({ state: 'visible' });
    
    const primaryButton = filterElement.locator(this.FILTER_DATA_BUTTON);
    const isPrimaryVisible = await primaryButton.isVisible();
    
    if (isPrimaryVisible) {
      await primaryButton.click();
      await this.page.waitForTimeout(500);
      
      // Check if the dropdown is expanded, click again if not
      const isExpanded = await primaryButton.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await primaryButton.click();
        await this.page.waitForTimeout(500);
      }
    } else {
      const multiActionButton = filterElement.locator(this.FILTER_DATA_MULTI_ACTION_BUTTON);
      await multiActionButton.click();
      await this.page.waitForTimeout(500);
      
      // Check if the dropdown is expanded
      const isExpanded = await multiActionButton.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await multiActionButton.click();
      }
    }
  }

  /**
   * Close the filter data dropdown.
   * Handles both primary button and multi-action button scenarios.
   */
  private async closeFilterDropdown(): Promise<void> {
    const filterDropdown = this.page.locator(this.FILTER_DATA_DROPDOWN);
    const primaryButton = filterDropdown.locator(this.FILTER_DATA_BUTTON);
    const isPrimaryVisible = await primaryButton.isVisible();
    
    if (isPrimaryVisible) {
      await primaryButton.click();
    } else {
      const multiActionButton = filterDropdown.locator(this.FILTER_DATA_MULTI_ACTION_BUTTON);
      await multiActionButton.click();
    }
    
    await this.page.waitForTimeout(500);
  }

  /**
   * Select a filter value from the dropdown list.
   * Searches for the value and clicks on it if not already selected.
   *
   * @param filter The filter value to select
   */
  private async selectFilter(filter: string): Promise<void> {
    await this.waitForAllLoaders();

    const dropdownList = this.page.locator(this.DROPDOWN_LIST);
    await dropdownList.waitFor({ state: 'visible' });
    
    await this.page.waitForTimeout(500);
    
    const searchTextbox = dropdownList.locator(this.SEARCH_TEXTBOX);
    await searchTextbox.waitFor({ state: 'visible' });
    await searchTextbox.fill(filter);
    
    await this.page.waitForTimeout(500);
    
    const listItems = dropdownList.locator(this.LIST_ITEM);
    await listItems.first().waitFor();
    
    const dropdownItem = listItems.filter({ hasText: filter });
    await this.page.waitForTimeout(500);
    
    const checkbox = dropdownItem.locator('input[type="checkbox"], input[type="radio"]');
    
    // Check if checkbox exists and is not checked
    const checkboxCount = await checkbox.count();
    if (checkboxCount > 0) {
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        await dropdownItem.scrollIntoViewIfNeeded();
        await dropdownItem.click();
      }
    } else {
      // No checkbox, just click the item
      await dropdownItem.scrollIntoViewIfNeeded();
      await dropdownItem.click();
    }
    
    // Wait for filter to be applied
    await this.page.locator(`div[aria-label='Filter for ${filter}']`).waitFor({ state: 'visible', timeout: 10000 });
    await this.waitForAllLoaders();
    await this.page.locator(this.PDS_LOADER).waitFor({ state: 'hidden' });
  }

  /**
   * Escape special regex characters in a string.
   * Used for exact text matching in locators.
   *
   * @param text The text to escape
   * @returns RegExp with escaped special characters for exact matching
   */
  private escapeRegex(text: string): RegExp {
    return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  }

  /**
   * Wait for all loaders and Angular to finish.
   * Comprehensive wait method that handles:
   * - Network idle state
   * - JavaScript ready state
   * - PDS loader disappearance
   * - Spinner disappearance
   * - Angular stability
   */
  private async waitForAllLoaders(): Promise<void> {
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle');
    
    // Wait for JavaScript to finish
    await this.page.waitForFunction(() => {
      return typeof window !== 'undefined' &&
             typeof document !== 'undefined' &&
             document.readyState === 'complete';
    });
    
    // Wait for PDS loader to disappear
    try {
      await this.page.waitForSelector('.pds-loader', { state: 'detached', timeout: 2000 });
    } catch {
      // Continue if PDS loader is not found
    }
    
    // Wait for spinner to disappear
    try {
      await this.page.waitForSelector('.spinner', { state: 'detached', timeout: 2000 });
    } catch {
      // Continue if spinner is not found
    }
    
    // Wait for Angular to stabilize
    try {
      await this.page.waitForFunction(() => {
        const win = window as any;
        return typeof win !== 'undefined' &&
               (win.getAllAngularTestabilities === undefined ||
                win.getAllAngularTestabilities().length === 0 ||
                win.getAllAngularTestabilities().every((testability: any) => testability.isStable()));
      }, { timeout: 2000 });
    } catch {
      // Continue if Angular is not available
    }
  }
}

// Re-export for backward compatibility
export default FilterData;
