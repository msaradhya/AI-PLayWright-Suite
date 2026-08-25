import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from '../base/MtssBasePage';
import { MtssActionsGridTable } from '../base/table/MtssActionsGridTable';
import { MtssException } from '../../exceptions/MtssException';

/**
 * Playwright/TypeScript version of MtssStudentSearchPage (converted from Java)
 * Page object for Student Search functionality in MTSS application
 * Provides methods for filtering, selecting actions, and managing student interventions
 *
 * @author Converted from Java to TypeScript/Playwright
 * @since 10/08/2020
 */
export class MtssStudentSearchPage extends MtssBasePage {
  
  // CSS Selectors - converted from Java static final fields
  private static readonly ACTION_DROPDOWN = 'app-checkbox-action-button > div.dropdown';
  private static readonly SELECT_INTERVENTION_DROPDOWN = '[class="ng-arrow-wrapper"]';
  private static readonly ADD_NEW_BUTTON = '.pds-button';
  private static readonly FILTER_INPUT = 'div.ag-filter-body input.ag-text-field-input,div.ag-filter-body input.ag-number-field-input';
  private static readonly TOGGLE_DROPDOWN_MENU_BUTTON = 'button.dropdown-toggle';
  private static readonly DROPDOWN_MENU_BUTTON = 'div.dropdown-menu.show';
  private static readonly DROPDOWN_ITEM_BUTTON = 'button[ngbdropdownitem]';
  private static readonly INTERVENTION_PLAN_RADIO_BUTTON = '[class="custom-control custom-radio"]';

  // Constants - converted from Java static string fields
  private static readonly SAVE_BUTTON_NAME = 'Save';
  private static readonly ADD_STUDENT_BUTTON_NAME = 'Add Students';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Returns the expected page title for validation
   * Converts Java pageTitle() method
   * @returns Expected page title string
   */
  protected pageTitle(): string {
    return 'Student Search';
  }

  /**
   * Get the student list table instance
   * Converts Java getStudentListTable() method
   * @returns MtssActionsGridTable instance for student list
   */
  getStudentListTable(): MtssActionsGridTable {
    return new MtssActionsGridTable('Student List');
  }

  /**
   * Apply header filter to dashboard column
   * Converts Java headerFilterDashboard() method
   * @param columnName - Name of the column to filter
   * @param condition - Filter condition (e.g., "Contains", "Equals")
   * @param filterValue - Value to filter by
   */
  async headerFilterDashboard(columnName: string, condition: string, filterValue: string): Promise<void> {
    try {
      // Find column header and click menu button
      const columnHeaders = this.page.locator('span[ref="eText"]');
      const targetColumn = columnHeaders.filter({ hasText: columnName });
      const menuButton = targetColumn.locator('..').locator('..').locator('.ag-header-icon.ag-header-cell-menu-button');
      await menuButton.click();

      // Wait for filter body to appear
      const filterBody = this.page.locator('div.ag-filter-body-wrapper');
      await filterBody.waitFor({ state: 'visible', timeout: 4000 });

      // Click filter condition dropdown
      const conditionDropdown = this.page.locator('div.ag-filter-select span.ag-icon-small-down');
      await conditionDropdown.waitFor({ state: 'visible' });
      await conditionDropdown.click();

      // Select the condition from dropdown
      const selectList = this.page.locator('div.ag-list.ag-select-list');
      await selectList.waitFor({ state: 'visible' });
      
      const conditionItems = this.page.locator('div.ag-select-list-item');
      const count = await conditionItems.count();
      
      for (let i = 0; i < count; i++) {
        const item = conditionItems.nth(i);
        const itemText = await item.textContent();
        if (itemText?.trim() === condition) {
          await item.click();
          break;
        }
      }

      // Enter filter value
      const filterInput = this.page.locator(MtssStudentSearchPage.FILTER_INPUT);
      await filterInput.waitFor({ state: 'visible' });
      await filterInput.fill(filterValue);

    } catch (error) {
      throw MtssException.withTestContext(
        `Failed to apply header filter: column=${columnName}, condition=${condition}, value=${filterValue}`,
        'MtssStudentSearchPage.headerFilterDashboard',
        error as Error
      );
    }
  }

  /**
   * Select action from dropdown menu
   * Converts Java selectActionFromDropDown() method
   * @param action - Action name to select from dropdown
   * @throws MtssException if action is not found in dropdown
   */
  async selectActionFromDropDown(action: string): Promise<void> {
    try {
      // Find visible action dropdown and click toggle button
      const actionDropdowns = this.page.locator(MtssStudentSearchPage.ACTION_DROPDOWN);
      const visibleDropdown = actionDropdowns.first();
      const toggleButton = visibleDropdown.locator(MtssStudentSearchPage.TOGGLE_DROPDOWN_MENU_BUTTON);
      await toggleButton.click();

      // Wait for dropdown menu to appear
      const dropdownMenu = visibleDropdown.locator(MtssStudentSearchPage.DROPDOWN_MENU_BUTTON);
      await dropdownMenu.waitFor({ state: 'visible' });

      // Find and click the action item
      const actionButtons = visibleDropdown.locator(MtssStudentSearchPage.DROPDOWN_ITEM_BUTTON);
      const count = await actionButtons.count();
      
      for (let i = 0; i < count; i++) {
        const actionButton = actionButtons.nth(i);
        const buttonText = await actionButton.textContent();
        if (buttonText?.trim() === action) {
          await actionButton.click();
          return;
        }
      }

      throw new MtssException(`Could not find the Action in dropdown: ${action}`);

    } catch (error) {
      if (error instanceof MtssException) {
        throw error;
      }
      throw MtssException.withTestContext(
        `Failed to select action from dropdown: ${action}`,
        'MtssStudentSearchPage.selectActionFromDropDown',
        error as Error
      );
    }
  }

  /**
   * Select intervention from intervention dropdown
   * Converts Java selectIntervention() method
   * @param interventionName - Name of the intervention to select
   */
  async selectIntervention(interventionName: string): Promise<void> {
    try {
      // Click intervention dropdown
      const interventionDropdown = this.page.locator(MtssStudentSearchPage.SELECT_INTERVENTION_DROPDOWN);
      await interventionDropdown.click();

      // Wait for options to appear and select the intervention
      const options = this.page.locator('div.ng-option');
      await options.first().waitFor({ state: 'visible' });
      
      // Ensure we have options available
      const optionCount = await options.count();
      if (optionCount === 0) {
        throw new MtssException(`No intervention options available in dropdown`);
      }

      // Find and click the target intervention
      const targetOption = options.filter({ hasText: interventionName });
      await targetOption.click();

    } catch (error) {
      throw MtssException.withTestContext(
        `Failed to select intervention: ${interventionName}`,
        'MtssStudentSearchPage.selectIntervention',
        error as Error
      );
    }
  }

  /**
   * Click the Add Students button
   * Converts Java clickAddStudentsButton() method
   */
  async clickAddStudentsButton(): Promise<void> {
    try {
      const addButtons = this.page.locator(MtssStudentSearchPage.ADD_NEW_BUTTON);
      const addStudentsButton = addButtons.filter({ hasText: MtssStudentSearchPage.ADD_STUDENT_BUTTON_NAME });
      await addStudentsButton.click();

    } catch (error) {
      throw MtssException.withTestContext(
        `Failed to click Add Students button`,
        'MtssStudentSearchPage.clickAddStudentsButton',
        error as Error
      );
    }
  }

  /**
   * Click the Intervention Plan radio button
   * Converts Java clickInterventionPlanRadioButton() method
   */
  async clickInterventionPlanRadioButton(): Promise<void> {
    try {
      const radioButtons = this.page.locator(MtssStudentSearchPage.INTERVENTION_PLAN_RADIO_BUTTON);
      const interventionPlanRadio = radioButtons.filter({ hasText: 'Intervention Plan (create new intervention)' });
      await interventionPlanRadio.click();

    } catch (error) {
      throw MtssException.withTestContext(
        `Failed to click Intervention Plan radio button`,
        'MtssStudentSearchPage.clickInterventionPlanRadioButton',
        error as Error
      );
    }
  }

  /**
   * Wait for page to load and verify it's the correct page
   * Enhanced version with additional validation
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForPage();
    
    // Additional validation that this is indeed the Student Search page
    const pageTitle = await this.getPageTitleText();
    if (!pageTitle.includes('Student Search')) {
      throw MtssException.withTestContext(
        `Expected Student Search page but found: ${pageTitle}`,
        'MtssStudentSearchPage.waitForPageToLoad'
      );
    }
  }

  /**
   * Check if student list table is visible and loaded
   * @returns true if table is visible and contains data
   */
  async isStudentListTableLoaded(): Promise<boolean> {
    try {
      const table = this.getStudentListTable();
      return await table.exists();
    } catch {
      return false;
    }
  }

  /**
   * Get count of students in the current view
   * @returns Number of students visible in the table
   */
  async getStudentCount(): Promise<number> {
    try {
      const table = this.getStudentListTable();
      const rows = table.getRows();
      return await rows.count();
    } catch {
      return 0;
    }
  }

  /**
   * Select multiple students by name
   * @param studentNames - Array of student names to select
   */
  async selectStudents(...studentNames: string[]): Promise<void> {
    try {
      const table = this.getStudentListTable();
      await table.selectRowInView('Student Name', ...studentNames);
    } catch (error) {
      throw MtssException.withTestContext(
        `Failed to select students: ${studentNames.join(', ')}`,
        'MtssStudentSearchPage.selectStudents',
        error as Error
      );
    }
  }

  /**
   * Check if specific students are present in the current view
   * @param studentNames - Array of student names to check
   * @returns true if all students are found
   */
  async areStudentsPresent(...studentNames: string[]): Promise<boolean> {
    try {
      const table = this.getStudentListTable();
      return await table.isValuePresentInColumn('Student Name', ...studentNames);
    } catch {
      return false;
    }
  }
}
