import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';
import { MtssActionsGridTable } from './base/table/MtssActionsGridTable';
import { MtssHelper } from '../helpers/MtssHelper';
import { MtssException } from '../exceptions/MtssException';

/**
 * MTSS Attendance Overview Detail Page - TypeScript/Playwright version
 * Converted from Java MtssAttendanceOverviewDetailPage.java
 * @author Ashok Garg (Converted from Java to TypeScript/Playwright)
 * @since 10/08/2020
 */
export class MtssAttendanceOverviewDetailPage extends MtssBasePage {
  // Static CSS selectors - converted from Java static final fields
  private static readonly ACTION_DROPDOWN = 'app-checkbox-action-button > div.dropdown';
  private static readonly SELECT_INTERVENTION_DROPDOWN = "[class='ng-arrow-wrapper']";
  private static readonly ADD_NEW_BUTTON = '.pds-button';
  private static readonly FILTER_INPUT = 'div.ag-filter-body input.ag-text-field-input,div.ag-filter-body input.ag-number-field-input';
  private static readonly TOGGLE_DROPDOWN_MENU_BUTTON = 'button.dropdown-toggle';
  private static readonly DROPDOWN_MENU_BUTTON = 'div.dropdown-menu.show';
  private static readonly DROPDOWN_ITEM_BUTTON = 'button[ngbdropdownitem]';
  private static readonly INTERVENTION_PLAN_RADIO_BUTTON = "[class='custom-control custom-radio']";

  // Constants
  private static readonly SAVE_BUTTON_NAME = 'Save';
  private static readonly ADD_STUDENT_BUTTON_NAME = 'Add Students';

  // Locators
  private actionDropdown: Locator;
  private selectInterventionDropdown: Locator;
  private addNewButton: Locator;
  private filterInput: Locator;
  private toggleDropdownMenuButton: Locator;
  private dropdownMenuButton: Locator;
  private dropdownItemButton: Locator;
  private interventionPlanRadioButton: Locator;

  constructor(page: Page) {
    super(page);
    this.actionDropdown = page.locator(MtssAttendanceOverviewDetailPage.ACTION_DROPDOWN);
    this.selectInterventionDropdown = page.locator(MtssAttendanceOverviewDetailPage.SELECT_INTERVENTION_DROPDOWN);
    this.addNewButton = page.locator(MtssAttendanceOverviewDetailPage.ADD_NEW_BUTTON);
    this.filterInput = page.locator(MtssAttendanceOverviewDetailPage.FILTER_INPUT);
    this.toggleDropdownMenuButton = page.locator(MtssAttendanceOverviewDetailPage.TOGGLE_DROPDOWN_MENU_BUTTON);
    this.dropdownMenuButton = page.locator(MtssAttendanceOverviewDetailPage.DROPDOWN_MENU_BUTTON);
    this.dropdownItemButton = page.locator(MtssAttendanceOverviewDetailPage.DROPDOWN_ITEM_BUTTON);
    this.interventionPlanRadioButton = page.locator(MtssAttendanceOverviewDetailPage.INTERVENTION_PLAN_RADIO_BUTTON);
  }

  /**
   * Get expected page title for validation
   * @returns Expected page title
   */
  protected pageTitle(): string {
    return 'Detail';
  }

  /**
   * Get the currently enrolled students table
   * @returns MtssActionsGridTable instance for currently enrolled students
   */
  public getCurrentEnrolledStudentsTable(): MtssActionsGridTable {
    return new MtssActionsGridTable('# of Currently Enrolled Students');
  }

  /**
   * Apply header filter to dashboard with specific column, condition and filter value
   * @param columnName Name of the column to filter
   * @param condition Filter condition to apply
   * @param filterValue Value to filter by
   */
  public async headerFilterDashboard(columnName: string, condition: string, filterValue: string): Promise<void> {
    // Find the column header by text and click the menu button
    const columnHeaders = this.page.locator("span[ref='eText']");
    const targetColumn = columnHeaders.filter({ hasText: columnName });
    const parentCell = targetColumn.locator('..').locator('..');
    const menuButton = parentCell.locator('.ag-header-icon.ag-header-cell-menu-button');
    
    await menuButton.click();

    // Wait for filter body to be visible
    const filterBodyWrapper = this.page.locator('div.ag-filter-body-wrapper');
    await filterBodyWrapper.waitFor({ state: 'visible', timeout: 4000 });

    // Click the condition dropdown
    const conditionDropdown = this.page.locator('div.ag-filter-select span.ag-icon-small-down');
    await conditionDropdown.waitFor({ state: 'visible' });
    await conditionDropdown.click();

    // Wait for dropdown list and select the condition
    const dropdownList = this.page.locator('div.ag-list.ag-select-list');
    await dropdownList.waitFor({ state: 'visible' });

    const dropdownItems = this.page.locator('div.ag-select-list-item');
    const itemCount = await dropdownItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = dropdownItems.nth(i);
      const itemText = await item.textContent();
      if (itemText === condition) {
        await item.click();
        break;
      }
    }

    // Enter the filter value
    const filterInputField = this.page.locator(MtssAttendanceOverviewDetailPage.FILTER_INPUT);
    await filterInputField.waitFor({ state: 'visible' });
    await filterInputField.fill(filterValue);
  }

  /**
   * Select action from dropdown menu
   * @param action Action to select from dropdown
   * @throws MtssException if action is not found in dropdown
   */
  public async selectActionFromDropDown(action: string): Promise<void> {
    // Find visible action dropdown and click toggle button
    await this.actionDropdown.waitFor({ state: 'visible' });
    const toggleButton = this.actionDropdown.locator(MtssAttendanceOverviewDetailPage.TOGGLE_DROPDOWN_MENU_BUTTON);
    await toggleButton.click();

    // Wait for dropdown menu to be visible
    const dropdownMenu = this.actionDropdown.locator(MtssAttendanceOverviewDetailPage.DROPDOWN_MENU_BUTTON);
    await dropdownMenu.waitFor({ state: 'visible' });

    // Find and click the specific action
    const actionMenuItems = this.actionDropdown.locator(MtssAttendanceOverviewDetailPage.DROPDOWN_ITEM_BUTTON);
    const itemCount = await actionMenuItems.count();

    for (let i = 0; i < itemCount; i++) {
      const actionMenu = actionMenuItems.nth(i);
      const actionText = await actionMenu.textContent();
      if (actionText === action) {
        await actionMenu.click();
        return;
      }
    }

    throw new MtssException(`Could not find the Action in dropdown:- ${action}`);
  }

  /**
   * Select intervention from dropdown
   * @param interventionName Name of the intervention to select
   */
  public async selectIntervention(interventionName: string): Promise<void> {
    // Click the intervention dropdown
    await this.selectInterventionDropdown.click();

    // Wait for options to appear and select the intervention
    const interventionOptions = this.page.locator('div.ng-option');
    await interventionOptions.first().waitFor({ state: 'visible' });
    
    // Verify options are available
    const optionCount = await interventionOptions.count();
    if (optionCount === 0) {
      throw new MtssException('No intervention options available in dropdown');
    }

    // Find and click the specific intervention
    const targetIntervention = interventionOptions.filter({ hasText: interventionName });
    await targetIntervention.click();

    // Wait for spinner to disappear
    await MtssHelper.waitForSpinnerToDisappear(this.page);
  }

  /**
   * Click the Add Students button
   */
  public async clickAddStudentsButton(): Promise<void> {
    const addStudentsButton = this.addNewButton.filter({
      hasText: MtssAttendanceOverviewDetailPage.ADD_STUDENT_BUTTON_NAME
    });
    await addStudentsButton.click();
  }

  /**
   * Click the Intervention Plan radio button
   */
  public async clickInterventionPlanRadioButton(): Promise<void> {
    const interventionPlanOption = this.interventionPlanRadioButton.filter({
      hasText: 'Intervention Plan (create new intervention)'
    });
    await interventionPlanOption.click();
  }

  /**
   * Click Save button (utility method)
   */
  public async clickSaveButton(): Promise<void> {
    const saveButton = this.addNewButton.filter({
      hasText: MtssAttendanceOverviewDetailPage.SAVE_BUTTON_NAME
    });
    await saveButton.click();
  }

  /**
   * Check if Add Students button is visible
   * @returns true if button is visible, false otherwise
   */
  public async isAddStudentsButtonVisible(): Promise<boolean> {
    const addStudentsButton = this.addNewButton.filter({
      hasText: MtssAttendanceOverviewDetailPage.ADD_STUDENT_BUTTON_NAME
    });
    try {
      await addStudentsButton.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all available intervention options
   * @returns Array of intervention option texts
   */
  public async getAvailableInterventions(): Promise<string[]> {
    await this.selectInterventionDropdown.click();
    
    const interventionOptions = this.page.locator('div.ng-option');
    await interventionOptions.first().waitFor({ state: 'visible' });
    
    const interventions = await interventionOptions.allTextContents();
    
    // Close dropdown by clicking outside
    await this.page.click('body');
    
    return interventions;
  }

  /**
   * Check if specific intervention is available
   * @param interventionName Name of intervention to check
   * @returns true if intervention is available, false otherwise
   */
  public async isInterventionAvailable(interventionName: string): Promise<boolean> {
    const availableInterventions = await this.getAvailableInterventions();
    return availableInterventions.includes(interventionName);
  }
}
