// Converted from Java: MtssFilterData.java
// Playwright-compatible helper class implementation
import { Page, Locator } from '@playwright/test';

export class MtssFilterData {
  private page: Page;
  private readonly FILTER_DATA_DROPDOWN = 'app-filter-button';
  private readonly FILTER_DATA_BUTTON = 'button.pds-button-multi-action--primary';
  private readonly FILTER_DATA_MENU_ITEM = 'button.dropdown-item.filter-label span:not([class])';
  private readonly DROPDOWN_LIST = 'div.dropdown-list';
  private readonly SEARCH_TEXTBOX = "input[id^='cbSearch'],input[id^='radioSearch']";
  private readonly LIST_ITEM = 'li.dropdown-item';
  private readonly CLEAR_FILTER_LIST = 'div.align-items-baseline';
  private readonly CLEAR_FILTER_LABEL = 'span';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * It filters the data based on the menu name and it searches the item from the list.
   */
  async selectFilterData(filterMap: Record<string, string>): Promise<void> {
    await this.openFilterDataDropdown();

    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor({ state: 'visible' });

    for (const [menuName, filterValue] of Object.entries(filterMap)) {
      const menuItem = menuItems.filter({ hasText: menuName });
      await menuItem.scrollIntoViewIfNeeded();
      await menuItem.click();
      await this.selectFilter(filterValue);
    }

    await this.page.locator(this.FILTER_DATA_DROPDOWN).locator(this.FILTER_DATA_BUTTON).click();
    await this.waitForPageToLoad();
  }

  /**
   * It filters the data based on the menu name and it searches the list of items passed as the parameter from the list.
   */
  async selectMultiFiltersData(multiFiltersMap: Record<string, string[]>): Promise<void> {
    await this.openFilterDataDropdown();

    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor({ state: 'visible' });

    for (const [menuName, searchCriteria] of Object.entries(multiFiltersMap)) {
      const menuItem = menuItems.filter({ hasText: menuName });
      await this.page.waitForTimeout(500);
      await menuItem.click();

      for (const searchElement of searchCriteria) {
        await this.page.waitForTimeout(1000);
        await this.selectFilter(searchElement);
      }
    }

    await this.page.locator(this.FILTER_DATA_DROPDOWN).locator(this.FILTER_DATA_BUTTON).click();
    await this.waitForPageToLoad();
  }

  /**
   * Clears all the filter data enabled based on the filterNames passed
   */
  async clear(...filterNames: string[]): Promise<void> {
    const filterElements = this.page.locator(this.CLEAR_FILTER_LIST);
    await filterElements.first().waitFor({ state: 'visible' });
    
    const filterList = [...filterNames];
    const count = await filterElements.count();

    if (count >= filterList.length) {
      for (let i = count - 1; i >= 0; i--) {
        const filterElement = filterElements.nth(i);
        const text = await filterElement.locator(this.CLEAR_FILTER_LABEL).textContent();

        if (text && filterList.includes(text)) {
          filterList.splice(filterList.indexOf(text), 1);
          await filterElement.locator('button').click();
          await this.waitForPageToLoad();
        }
      }
      
      await this.waitForPageToLoad();
      
      if (filterList.length > 0) {
        throw new Error(`Could not find the filter name: ${filterList.join(', ')}`);
      }
    } else {
      throw new Error('The size of filter passed as parameter is more than the filter data enabled.');
    }
  }

  /**
   * Clears all the filter data enabled
   */
  async clearAll(): Promise<void> {
    const filterElements = this.page.locator(this.CLEAR_FILTER_LIST);
    const count = await filterElements.count();
    
    if (count > 0) {
      for (let i = count - 1; i >= 0; i--) {
        await filterElements.nth(i).locator('button').click();
        await this.waitForPageToLoad();
      }
    }
  }

  /**
   * Fetch All filters
   */
  async getAllFilter(): Promise<string[]> {
    const filterElements = this.page.locator(this.CLEAR_FILTER_LIST);
    const count = await filterElements.count();
    const filtersEnabled: string[] = [];

    for (let i = count - 1; i >= 0; i--) {
      const text = await filterElements.nth(i).textContent();
      if (text) {
        filtersEnabled.push(text);
      }
    }

    return filtersEnabled;
  }

  async selectFilterDataSingle(filterDateName: string, filterDateValue: string): Promise<void> {
    await this.openFilterDataDropdown();
    
    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor({ state: 'visible' });
    
    await menuItems.filter({ hasText: filterDateName }).scrollIntoViewIfNeeded();
    await menuItems.filter({ hasText: filterDateName }).click();
    await this.selectFilter(filterDateValue);
    
    const filterDropdown = this.page.locator(this.FILTER_DATA_DROPDOWN);
    const primaryButton = filterDropdown.locator(this.FILTER_DATA_BUTTON);
    const multiActionButton = filterDropdown.locator('button.pds-button-multi-action');
    
    if (await primaryButton.isVisible()) {
      await primaryButton.click();
    } else {
      await multiActionButton.click();
    }
    
    await this.waitForPageToLoad();
  }

  async selectFilterDataMultiple(filterDateName: string, ...filterDateValues: string[]): Promise<void> {
    await this.openFilterDataDropdown();

    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor({ state: 'visible' });
    
    await menuItems.filter({ hasText: filterDateName }).scrollIntoViewIfNeeded();
    await menuItems.filter({ hasText: filterDateName }).click();
    
    for (const filterData of filterDateValues) {
      await this.selectFilter(filterData);
    }
    
    await this.page.locator(this.FILTER_DATA_DROPDOWN).locator(this.FILTER_DATA_BUTTON).click();
    await this.waitForPageToLoad();
  }

  async getFilterKeys(): Promise<string[]> {
    await this.openFilterDataDropdown();

    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor({ state: 'visible' });
    
    const filterDataText = await menuItems.allTextContents();
    
    const filterDropdown = this.page.locator(this.FILTER_DATA_DROPDOWN);
    const primaryButton = filterDropdown.locator(this.FILTER_DATA_BUTTON);
    const multiActionButton = filterDropdown.locator('button.pds-button-multi-action');
    
    if (await primaryButton.isVisible()) {
      await primaryButton.click();
    } else {
      await multiActionButton.click();
    }
    
    await this.waitForPageToLoad();
    return filterDataText;
  }

  /**
   * It gets the value for Specific Filter Key
   * @param filterKey i.e. School, Ethnicity Gender, Staff
   */
  async getValuesOfFilterKey(filterKey: string): Promise<string[]> {
    await this.openFilterDataDropdown();

    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.filter({ hasText: filterKey }).first().click();

    await this.waitForPageToLoad();

    const listItems = this.page.locator(this.LIST_ITEM);
    await listItems.first().waitFor({ state: 'visible' });
    
    const filterDataText = await listItems.allTextContents();

    await this.page.locator(this.FILTER_DATA_DROPDOWN).locator(this.FILTER_DATA_BUTTON).click(); // to close the filter

    return filterDataText;
  }

  /**
   * It Searches the data from the list of items listen inside the Filter Data menu
   */
  private async selectFilter(filter: string): Promise<void> {
    const dropdownList = this.page.locator(this.DROPDOWN_LIST);
    await dropdownList.waitFor({ state: 'visible' });
    
    await this.page.waitForTimeout(500); // Wait for JS to finish
    
    await dropdownList.locator(this.SEARCH_TEXTBOX).fill(filter);
    await this.page.waitForTimeout(500); // Wait for search results
    
    const listItems = dropdownList.locator(this.LIST_ITEM);
    await listItems.first().waitFor({ state: 'visible' });
    
    const dropdownItem = listItems.filter({ hasText: filter });
    await this.page.waitForTimeout(500);
    
    const checkbox = dropdownItem.locator("input[type='checkbox'], input[type='radio']");
    
    if (!(await checkbox.isChecked())) {
      await dropdownItem.scrollIntoViewIfNeeded();
      await dropdownItem.click();
    }
  }

  /**
   * It activates the dropdown
   */
  private async openFilterDataDropdown(): Promise<void> {
    await this.page.waitForTimeout(500); // Wait for JS to finish
    
    const filterElement = this.page.locator(this.FILTER_DATA_DROPDOWN);
    await filterElement.waitFor({ state: 'visible' });
    
    const primaryButton = filterElement.locator(this.FILTER_DATA_BUTTON);
    const multiActionButton = filterElement.locator('button.pds-button-multi-action');
    
    if (await primaryButton.isVisible()) {
      await primaryButton.click();
      await this.page.waitForTimeout(500);
      
      const isExpanded = await primaryButton.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await primaryButton.click();
      }
    } else {
      await multiActionButton.click();
      await this.page.waitForTimeout(500);
      
      const isExpanded = await multiActionButton.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await multiActionButton.click();
      }
    }
  }

  async getFilterDataOptions(): Promise<Record<string, string[]>> {
    const filterDataOptions: Record<string, string[]> = {};
    
    await this.openFilterDataDropdown();
    
    const filters = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await filters.first().waitFor({ state: 'visible' });
    
    const count = await filters.count();
    
    for (let i = 0; i < count; i++) {
      const filter = filters.nth(i);
      const filterDataText = await filter.textContent();
      
      if (filterDataText) {
        await filter.click();
        
        const dropdownList = this.page.locator(this.DROPDOWN_LIST);
        await dropdownList.waitFor({ state: 'visible' });
        
        const listItems = dropdownList.locator(this.LIST_ITEM);
        await listItems.first().waitFor({ state: 'visible' });
        
        const filterDataOptionsText = await listItems.allTextContents();
        filterDataOptions[filterDataText] = filterDataOptionsText;
      }
    }
    
    const filterDropdown = this.page.locator(this.FILTER_DATA_DROPDOWN);
    const primaryButton = filterDropdown.locator(this.FILTER_DATA_BUTTON);
    const multiActionButton = filterDropdown.locator('button.pds-button-multi-action');
    
    if (await primaryButton.isVisible()) {
      await primaryButton.click();
    } else {
      await multiActionButton.click();
    }
    
    await this.waitForPageToLoad();
    return filterDataOptions;
  }

  async getFilterOption(filterName: string): Promise<string[]> {
    await this.openFilterDataDropdown();
    
    const menuItems = this.page.locator(this.FILTER_DATA_MENU_ITEM);
    await menuItems.first().waitFor({ state: 'visible' });
    
    await menuItems.filter({ hasText: filterName }).click();
    
    const dropdownList = this.page.locator(this.DROPDOWN_LIST);
    await dropdownList.waitFor({ state: 'visible' });
    
    const listItems = dropdownList.locator(this.LIST_ITEM);
    await listItems.first().waitFor({ state: 'visible' });
    
    const filterOption = await listItems.allTextContents();
    
    const filterDropdown = this.page.locator(this.FILTER_DATA_DROPDOWN);
    const primaryButton = filterDropdown.locator(this.FILTER_DATA_BUTTON);
    const multiActionButton = filterDropdown.locator('button.pds-button-multi-action');
    
    if (await primaryButton.isVisible()) {
      await primaryButton.click();
    } else {
      await multiActionButton.click();
    }
    
    await this.waitForPageToLoad();
    return filterOption;
  }

  private async waitForPageToLoad(): Promise<void> {
    // Implement page load wait logic - placeholder
    await this.page.waitForTimeout(1000);
  }
}
