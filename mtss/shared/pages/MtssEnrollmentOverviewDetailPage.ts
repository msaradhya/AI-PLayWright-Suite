import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';
import { MtssActionsGridTable } from './base/table/MtssActionsGridTable';
import { MtssAddToGroupDialog } from './dialog/MtssAddToGroupDialog';

/**
 * MTSS Enrollment Overview Detail Page - TypeScript/Playwright version
 * Converted from Java MtssEnrollmentOverviewDetailPage.java
 *
 * This page provides access to enrollment detail functionality including
 * employee information grid, group management dialogs, and navigation back
 * to enrollment overview. Supports year-over-year enrollment and exit data analysis.
 *
 * @author Ashok Garg (Converted from Java to TypeScript/Playwright)
 * @since 10/08/2020
 */
export class MtssEnrollmentOverviewDetailPage extends MtssBasePage {
  // CSS Selectors - equivalent to Java static final fields
  private static readonly BACK_TO_ENROLLMENT_OVERVIEW_LINK = 'a[href*="enrollment"], a:has-text("Back to Enrollment Overview")';
  private static readonly ADD_TO_GROUP_DIALOG_SELECTOR = 'div.modal-dialog app-add-to-group, div.modal-dialog[aria-label*="Add to Group"]';
  
  // Locators for page elements
  private backToEnrollmentOverviewLink: Locator;
  private addToGroupDialogContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.backToEnrollmentOverviewLink = page.locator(MtssEnrollmentOverviewDetailPage.BACK_TO_ENROLLMENT_OVERVIEW_LINK);
    this.addToGroupDialogContainer = page.locator(MtssEnrollmentOverviewDetailPage.ADD_TO_GROUP_DIALOG_SELECTOR);
  }

  /**
   * Get the expected page title for validation
   * Overrides abstract method from MtssBasePage
   * @returns Expected page title string
   */
  protected pageTitle(): string {
    return 'Detail';
  }

  /**
   * Get the Employee Information grid table
   * Equivalent to Java method: getEmployeeInformation()
   *
   * @returns MtssActionsGridTable instance for "Enrollment Information" table
   */
  public getEmployeeInformation(): MtssActionsGridTable {
    return new MtssActionsGridTable('Enrollment Information');
  }

  /**
   * Get the Add to Group dialog instance
   * Equivalent to Java method: getAddToGroupDialog()
   *
   * @returns MtssAddToGroupDialog instance for group management
   */
  public getAddToGroupDialog(): MtssAddToGroupDialog {
    return new MtssAddToGroupDialog(this.page, this.addToGroupDialogContainer);
  }

  /**
   * Click the "Back to Enrollment Overview" link for navigation
   * Equivalent to Java method: clickBackToEnrollmentOverviewLink()
   *
   * @throws Error if the link is not visible or clickable
   */
  public async clickBackToEnrollmentOverviewLink(): Promise<void> {
    await this.backToEnrollmentOverviewLink.waitFor({ state: 'visible' });
    await this.backToEnrollmentOverviewLink.click();
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the year-over-year enrollment and exit numbers table
   * Equivalent to Java method: getHowHasOurEnrollmentAndExitNumbersChangedYearOverYear()
   *
   * @returns MtssActionsGridTable instance for year-over-year analysis table
   */
  public getHowHasOurEnrollmentAndExitNumbersChangedYearOverYear(): MtssActionsGridTable {
    return new MtssActionsGridTable('How has our enrollment and exit numbers changed year over year?');
  }

  /**
   * Check if the "Back to Enrollment Overview" link is visible
   * Additional utility method for validation
   *
   * @returns Promise<boolean> indicating if the link is visible
   */
  public async isBackToEnrollmentOverviewLinkVisible(): Promise<boolean> {
    try {
      await this.backToEnrollmentOverviewLink.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if Employee Information table exists on the page
   * Additional utility method for validation
   *
   * @returns Promise<boolean> indicating if the table is available
   */
  public async isEmployeeInformationTableVisible(): Promise<boolean> {
    const table = this.getEmployeeInformation();
    try {
      const tableElement = table['tableElement']; // Access protected property
      await tableElement.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if year-over-year table exists on the page
   * Additional utility method for validation
   *
   * @returns Promise<boolean> indicating if the table is available
   */
  public async isYearOverYearTableVisible(): Promise<boolean> {
    const table = this.getHowHasOurEnrollmentAndExitNumbersChangedYearOverYear();
    try {
      const tableElement = table['tableElement']; // Access protected property
      await tableElement.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to load and verify enrollment detail is displayed
   * Enhanced method combining page load wait with title validation
   *
   * @returns Promise<boolean> indicating if page loaded successfully
   */
  public async isEnrollmentDetailDisplayed(): Promise<boolean> {
    try {
      await this.waitForPage();
      return true;
    } catch (error) {
      console.error('Failed to load Enrollment Overview Detail page:', error);
      return false;
    }
  }

  /**
   * Get all available tables on the enrollment detail page
   * Additional utility method for comprehensive page validation
   *
   * @returns Promise<string[]> array of table titles found on the page
   */
  public async getAvailableTables(): Promise<string[]> {
    const tableElements = this.page.locator('div[class*="ag-theme"], table, div.table-container');
    const tableTitles: string[] = [];
    
    const count = await tableElements.count();
    for (let i = 0; i < count; i++) {
      const table = tableElements.nth(i);
      
      // Look for table headers or titles in various formats
      const titleSelectors = [
        'h3, h4, h5',
        'div.panel-heading',
        'div.table-title',
        '.ag-header-cell-text'
      ];
      
      for (const selector of titleSelectors) {
        const titleElement = table.locator(selector).first();
        if (await titleElement.isVisible()) {
          const title = await titleElement.textContent();
          if (title && title.trim() !== '') {
            tableTitles.push(title.trim());
            break; // Found a title for this table, move to next table
          }
        }
      }
    }
    
    return tableTitles;
  }

  /**
   * Verify that the expected tables are present on the page
   * Validation method to ensure page loaded correctly with expected content
   *
   * @param expectedTables Array of expected table titles
   * @returns Promise<boolean> indicating if all expected tables are present
   */
  public async verifyExpectedTablesPresent(expectedTables: string[]): Promise<boolean> {
    const availableTables = await this.getAvailableTables();
    
    return expectedTables.every(expectedTable =>
      availableTables.some(availableTable =>
        availableTable.toLowerCase().includes(expectedTable.toLowerCase())
      )
    );
  }

  /**
   * Open Add to Group dialog and return the dialog instance
   * Utility method to trigger and access the dialog
   *
   * @returns Promise<MtssAddToGroupDialog> dialog instance for interaction
   * @throws Error if dialog fails to open
   */
  public async openAddToGroupDialog(): Promise<MtssAddToGroupDialog> {
    // Look for buttons that might trigger the Add to Group dialog
    const addToGroupTriggers = this.page.locator('button:has-text("Add to Group"), button[aria-label*="Add to Group"], button:has-text("Add Students")');
    
    if (await addToGroupTriggers.count() > 0) {
      await addToGroupTriggers.first().click();
      
      // Wait for dialog to appear
      await this.addToGroupDialogContainer.waitFor({ state: 'visible', timeout: 10000 });
      
      return this.getAddToGroupDialog();
    } else {
      throw new Error('Could not find Add to Group trigger button on the page');
    }
  }
}
