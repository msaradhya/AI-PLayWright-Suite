import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from '../base/MtssBasePage';
import { MtssActionsGridTable } from '../base/table/MtssActionsGridTable';
import { MtssBulkEditPlansDialog } from '../dialog/MtssBulkEditPlansDialog';
import { MtssCreateAStudentPlanDialog } from '../dialog/MtssCreateAStudentPlanDialog';
import { MtssCreatePlanCopyDialog } from '../dialog/MtssCreatePlanCopyDialog';
import { MtssHelper } from '../../helpers/MtssHelper';

/**
 * Plans Page - Playwright Implementation
 * Converted from Java: MtssPlansPage.java
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 10-08-2020
 */
export class MtssPlansPage extends MtssBasePage {
  private readonly newStudentPlanButton: Locator;
  private readonly bulkEditButton: Locator;
  private readonly dropdownOption: Locator;
  private readonly plansTable: Locator;
  private readonly dialog: Locator;
  private readonly templateNameColumnTextbox: Locator;
  private readonly planNameColumnTextbox: Locator;
  private readonly districtSelector: Locator;
  private readonly districtOption: Locator;

  constructor(page: Page) {
    super(page);
    this.newStudentPlanButton = page.locator('button.pds-button.pds-primary');
    this.bulkEditButton = page.locator('button.pds-button');
    this.dropdownOption = page.locator('.ng-option');
    this.plansTable = page.locator('ag-grid-angular.ag-theme-balham');
    this.dialog = page.locator("div[class*='modal-dialog']");
    this.templateNameColumnTextbox = page.locator("input[aria-label='Template Name Filter Input']");
    this.planNameColumnTextbox = page.locator("input[aria-label='Plan Name Filter Input']");
    this.districtSelector = page.locator('#district_selector');
    this.districtOption = page.locator('div.ng-option');
  }

  protected pageTitle(): string {
    return 'Plans';
  }

  /**
   * Click new student plan button
   */
  async clickNewStudentPlanButton(): Promise<void> {
    await this.newStudentPlanButton.click();
  }

  /**
   * Click bulk edit button
   */
  async clickBulkEditButton(): Promise<void> {
    await this.bulkEditButton.filter({ hasText: 'Bulk Edit' }).click();
  }

  /**
   * Get plan table
   * @returns MtssActionsGridTable instance
   */
  getPlanTable(): MtssActionsGridTable {
    return new MtssActionsGridTable(this.plansTable);
  }

  /**
   * Get create a student plan dialog
   * @returns MtssCreateAStudentPlanDialog instance
   */
  getCreateAStudentPlanDialog(): MtssCreateAStudentPlanDialog {
    return new MtssCreateAStudentPlanDialog(this.page, this.dialog);
  }

  /**
   * Get create plan copy dialog
   * @returns MtssCreatePlanCopyDialog instance
   */
  getCreatePlanCopyDialog(): MtssCreatePlanCopyDialog {
    return new MtssCreatePlanCopyDialog(this.page, this.dialog);
  }

  /**
   * Get bulk edit plans dialog
   * @returns MtssBulkEditPlansDialog instance
   */
  getBulkEditPlansDialog(): MtssBulkEditPlansDialog {
    return new MtssBulkEditPlansDialog(this.page, this.dialog);
  }

  /**
   * Set template name column filter
   * @param templateName - Template name to filter by
   */
  async setTemplateNameColumn(templateName: string): Promise<void> {
    await this.templateNameColumnTextbox.fill(templateName);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Apply plan filter
   * @param planName - Plan name to filter by
   */
  async applyPlanFilter(planName: string): Promise<void> {
    await this.planNameColumnTextbox.fill(planName);
    
    // Wait for filtered row to appear - equivalent to Java's WaitFor.waitForIsDisplayed
    const filteredRow = this.page.locator("[col-id='planName']").filter({ hasText: planName });
    await filteredRow.waitFor({ state: 'visible', timeout: 60000 });
    
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Set plan name column filter
   * @param planName - Plan name to filter by
   */
  async setPlanNameColumn(planName: string): Promise<void> {
    await this.planNameColumnTextbox.fill(planName);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Select district from dropdown
   * @param district - District name to select
   */
  async selectDistrict(district: string): Promise<void> {
    if (await this.districtSelector.isVisible()) {
      await this.districtSelector.click();
      await this.districtOption.filter({ hasText: district }).first().click();
    }
  }

  /**
   * Check if new student plan button is enabled
   * @returns true if button is enabled, false otherwise
   */
  async isNewStudentPlanButtonEnabled(): Promise<boolean> {
    return await this.newStudentPlanButton.isEnabled();
  }

  /**
   * Check if bulk edit button is enabled
   * @returns true if button is enabled, false otherwise
   */
  async isBulkEditButtonEnabled(): Promise<boolean> {
    const bulkEditBtn = this.bulkEditButton.filter({ hasText: 'Bulk Edit' });
    return await bulkEditBtn.isEnabled();
  }

  /**
   * Get total number of plans in table
   * @returns Number of plans
   */
  async getTotalPlansCount(): Promise<number> {
    const rows = this.plansTable.locator('.ag-row');
    return await rows.count();
  }

  /**
   * Check if plans table is visible
   * @returns true if table is visible, false otherwise
   */
  async isPlansTableVisible(): Promise<boolean> {
    return await this.plansTable.isVisible();
  }

  /**
   * Wait for plans table to load
   * @param timeout - Timeout in milliseconds (default: 30000)
   */
  async waitForPlansTableToLoad(timeout: number = 30000): Promise<void> {
    await this.plansTable.waitFor({ state: 'visible', timeout });
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Clear template name filter
   */
  async clearTemplateNameFilter(): Promise<void> {
    await this.templateNameColumnTextbox.clear();
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Clear plan name filter
   */
  async clearPlanNameFilter(): Promise<void> {
    await this.planNameColumnTextbox.clear();
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Get current template name filter value
   * @returns Current filter value
   */
  async getTemplateNameFilterValue(): Promise<string> {
    return await this.templateNameColumnTextbox.inputValue();
  }

  /**
   * Get current plan name filter value
   * @returns Current filter value
   */
  async getPlanNameFilterValue(): Promise<string> {
    return await this.planNameColumnTextbox.inputValue();
  }

  /**
   * Check if district selector is visible
   * @returns true if district selector is visible, false otherwise
   */
  async isDistrictSelectorVisible(): Promise<boolean> {
    return await this.districtSelector.isVisible();
  }

  /**
   * Get selected district
   * @returns Selected district name, or null if none selected
   */
  async getSelectedDistrict(): Promise<string | null> {
    if (await this.districtSelector.isVisible()) {
      return await this.districtSelector.textContent();
    }
    return null;
  }

  /**
   * Get available districts from dropdown
   * @returns Array of district names
   */
  async getAvailableDistricts(): Promise<string[]> {
    if (await this.districtSelector.isVisible()) {
      await this.districtSelector.click();
      
      const options = this.districtOption;
      const count = await options.count();
      const districts: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const optionText = await options.nth(i).textContent();
        if (optionText?.trim()) {
          districts.push(optionText.trim());
        }
      }
      
      // Close dropdown by clicking elsewhere
      await this.page.locator('body').click();
      
      return districts;
    }
    return [];
  }

  /**
   * Refresh plans table
   */
  async refreshPlansTable(): Promise<void> {
    await this.page.reload();
    await this.waitForPlansTableToLoad();
  }

  /**
   * Check if any plans are displayed
   * @returns true if plans are displayed, false otherwise
   */
  async hasPlansDisplayed(): Promise<boolean> {
    const rows = this.plansTable.locator('.ag-row');
    const rowCount = await rows.count();
    return rowCount > 0;
  }

  /**
   * Get plan names from current view
   * @returns Array of plan names currently visible
   */
  async getVisiblePlanNames(): Promise<string[]> {
    const planNames: string[] = [];
    
    try {
      const rows = this.plansTable.locator('.ag-row');
      const rowCount = await rows.count();
      
      for (let i = 0; i < rowCount; i++) {
        const planNameCell = rows.nth(i).locator("[col-id='planName']");
        const planName = await planNameCell.textContent();
        if (planName?.trim()) {
          planNames.push(planName.trim());
        }
      }
    } catch (error) {
      console.warn('Error getting visible plan names:', error);
    }
    
    return planNames;
  }

  /**
   * Filter plans by template name and wait for results
   * @param templateName - Template name to filter by
   * @param expectedCount - Expected number of results (optional)
   */
  async filterByTemplateNameAndWait(templateName: string, expectedCount?: number): Promise<void> {
    await this.setTemplateNameColumn(templateName);
    
    if (expectedCount !== undefined) {
      // Wait for expected number of results
      await this.page.waitForFunction(
        (count) => {
          const table = document.querySelector('ag-grid-angular.ag-theme-balham');
          const rows = table?.querySelectorAll('.ag-row');
          return rows?.length === count;
        },
        expectedCount,
        { timeout: 30000 }
      );
    }
  }

  /**
   * Filter plans by plan name and wait for results
   * @param planName - Plan name to filter by
   * @param expectedCount - Expected number of results (optional)
   */
  async filterByPlanNameAndWait(planName: string, expectedCount?: number): Promise<void> {
    await this.applyPlanFilter(planName);
    
    if (expectedCount !== undefined) {
      // Wait for expected number of results
      await this.page.waitForFunction(
        (count) => {
          const table = document.querySelector('ag-grid-angular.ag-theme-balham');
          const rows = table?.querySelectorAll('.ag-row');
          return rows?.length === count;
        },
        expectedCount,
        { timeout: 30000 }
      );
    }
  }
}
