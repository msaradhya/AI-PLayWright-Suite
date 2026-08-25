import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from '../base/MtssBasePage';
import { MtssActionsGridTable } from '../base/table/MtssActionsGridTable';
import { MtssCreateAStudentPlanTemplateDialog } from '../dialog/MtssCreateAStudentPlanTemplateDialog';
import { MtssBulkEditPlanTemplateDialog } from './MtssBulkEditPlanTemplateDialog';
import { MtssHelper } from '../../helpers/MtssHelper';

/**
 * Student Plan Templates Page - Playwright Implementation
 * Converted from Java: MtssStudentPlanTemplatesPage.java
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 27-07-2021
 */
export class MtssStudentPlanTemplatesPage extends MtssBasePage {
  private readonly templateNameColumnTextbox: Locator;
  private readonly buildTemplateButton: Locator;
  private readonly dialog: Locator;
  private readonly grid: Locator;
  private readonly bulkEditButton: Locator;

  constructor(page: Page) {
    super(page);
    this.templateNameColumnTextbox = page.locator("input[aria-label='Template Name Filter Input']");
    this.buildTemplateButton = page.locator('button.pds-button.pds-primary');
    this.dialog = page.locator("div[class*='modal-dialog']");
    this.grid = page.locator('ag-grid-angular');
    this.bulkEditButton = page.locator('button.pds-button');
  }

  protected pageTitle(): string {
    return 'Student Plan Templates';
  }

  /**
   * Click build template button
   */
  async clickBuildTemplateButton(): Promise<void> {
    await this.buildTemplateButton.click();
  }

  /**
   * Check if build template button is available
   * @returns true if button is available, false otherwise
   */
  async isBuildTemplateButtonAvailable(): Promise<boolean> {
    return await this.buildTemplateButton.isVisible();
  }

  /**
   * Click plan template link
   * Converts Java clickPlanTemplate() method
   */
  async clickPlanTemplate(): Promise<void> {
    // Wait for PDS loader to disappear (equivalent to WaitFor.waitForPDSLoaderToDisappear)
    await this.page.waitForLoadState('networkidle');
    
    // Wait for Plan Templates link to be displayed
    const planTemplatesLink = this.page.locator('a', { hasText: 'Plan Templates' });
    await planTemplatesLink.waitFor({ state: 'visible', timeout: 30000 });
    
    // Double click on Plan Templates link
    await planTemplatesLink.dblclick();
    
    // Wait for PDS loader to disappear again
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get create a student plan template dialog
   * @returns MtssCreateAStudentPlanTemplateDialog instance
   */
  getCreateAStudentPlanTemplateDialog(): MtssCreateAStudentPlanTemplateDialog {
    return new MtssCreateAStudentPlanTemplateDialog(this.page, this.dialog);
  }

  /**
   * Get student plan template table
   * @returns MtssActionsGridTable instance
   */
  getStudentPlanTemplateTable(): MtssActionsGridTable {
    return new MtssActionsGridTable(this.grid);
  }

  /**
   * Click bulk edit button
   */
  async clickBulkEditButton(): Promise<void> {
    await this.bulkEditButton.filter({ hasText: 'Bulk Edit' }).click();
  }

  /**
   * Get bulk edit plan template dialog
   * @returns MtssBulkEditPlanTemplateDialog instance
   */
  getBulkEditPlanTemplateDialog(): MtssBulkEditPlanTemplateDialog {
    return new MtssBulkEditPlanTemplateDialog(this.page, this.dialog);
  }

  /**
   * Set template name column filter
   * @param templateName - Template name to filter by
   */
  async setTemplateNameColumn(templateName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    // Wait for template name textbox to be displayed
    await this.templateNameColumnTextbox.waitFor({ state: 'visible', timeout: 30000 });
    await this.templateNameColumnTextbox.fill(templateName);
    
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Apply template filter and wait for results
   * @param templateName - Template name to filter by
   */
  async applyTemplateFilter(templateName: string): Promise<void> {
    await this.templateNameColumnTextbox.fill(templateName);
    
    // Wait for filtered row to appear - equivalent to Java's WaitFor.waitForIsDisplayed
    const filteredRow = this.page.locator("[col-id='templateName']").filter({ hasText: templateName });
    await filteredRow.waitFor({ state: 'visible', timeout: 60000 });
  }

  /**
   * Click delete confirm template button
   */
  async deleteConfirmTemplateButton(): Promise<void> {
    await this.page.locator("[class='trashIcon spinIcon']").click();
  }

  /**
   * Edit template from inside builder
   */
  async editTemplateFromInsideBuilder(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    
    const editButton = this.page
      .locator("button.btn-svg")
      .filter({ hasText: '' })
      .locator("[aria-label='Edit template properties']");
    
    // Use JavaScript click equivalent to Java's clickByJavaScript
    await editButton.evaluate((element) => (element as HTMLElement).click());
  }

  /**
   * Save edited template
   */
  async saveEditedTemplate(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator("button.pds-button.pds-primary").click();
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
   * Get total number of templates in table
   * @returns Number of templates
   */
  async getTotalTemplatesCount(): Promise<number> {
    const rows = this.grid.locator('.ag-row');
    return await rows.count();
  }

  /**
   * Check if templates table is visible
   * @returns true if table is visible, false otherwise
   */
  async isTemplatesTableVisible(): Promise<boolean> {
    return await this.grid.isVisible();
  }

  /**
   * Wait for templates table to load
   * @param timeout - Timeout in milliseconds (default: 30000)
   */
  async waitForTemplatesTableToLoad(timeout: number = 30000): Promise<void> {
    await this.grid.waitFor({ state: 'visible', timeout });
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
   * Get current template name filter value
   * @returns Current filter value
   */
  async getTemplateNameFilterValue(): Promise<string> {
    return await this.templateNameColumnTextbox.inputValue();
  }

  /**
   * Check if any templates are displayed
   * @returns true if templates are displayed, false otherwise
   */
  async hasTemplatesDisplayed(): Promise<boolean> {
    const rows = this.grid.locator('.ag-row');
    const rowCount = await rows.count();
    return rowCount > 0;
  }

  /**
   * Get template names from current view
   * @returns Array of template names currently visible
   */
  async getVisibleTemplateNames(): Promise<string[]> {
    const templateNames: string[] = [];
    
    try {
      const rows = this.grid.locator('.ag-row');
      const rowCount = await rows.count();
      
      for (let i = 0; i < rowCount; i++) {
        const templateNameCell = rows.nth(i).locator("[col-id='templateName']");
        const templateName = await templateNameCell.textContent();
        if (templateName?.trim()) {
          templateNames.push(templateName.trim());
        }
      }
    } catch (error) {
      console.warn('Error getting visible template names:', error);
    }
    
    return templateNames;
  }

  /**
   * Refresh templates table
   */
  async refreshTemplatesTable(): Promise<void> {
    await this.page.reload();
    await this.waitForTemplatesTableToLoad();
  }

  /**
   * Filter templates by name and wait for results
   * @param templateName - Template name to filter by
   * @param expectedCount - Expected number of results (optional)
   */
  async filterByTemplateNameAndWait(templateName: string, expectedCount?: number): Promise<void> {
    await this.applyTemplateFilter(templateName);
    
    if (expectedCount !== undefined) {
      // Wait for expected number of results
      await this.page.waitForFunction(
        (count) => {
          const table = document.querySelector('ag-grid-angular');
          const rows = table?.querySelectorAll('.ag-row');
          return rows?.length === count;
        },
        expectedCount,
        { timeout: 30000 }
      );
    }
  }

  /**
   * Select template by name
   * @param templateName - Name of the template to select
   */
  async selectTemplateByName(templateName: string): Promise<void> {
    const templateTable = this.getStudentPlanTemplateTable();
    await templateTable.clickCellInView('templateName', templateName);
  }

  /**
   * Edit template by name
   * @param templateName - Name of the template to edit
   */
  async editTemplateByName(templateName: string): Promise<void> {
    const templateTable = this.getStudentPlanTemplateTable();
    await templateTable.clickActionColumn('templateName', templateName, 'Actions', 'Edit');
  }

  /**
   * Delete template by name
   * @param templateName - Name of the template to delete
   */
  async deleteTemplateByName(templateName: string): Promise<void> {
    const templateTable = this.getStudentPlanTemplateTable();
    await templateTable.clickActionColumn('templateName', templateName, 'Actions', 'Delete');
  }

  /**
   * Copy template by name
   * @param templateName - Name of the template to copy
   */
  async copyTemplateByName(templateName: string): Promise<void> {
    const templateTable = this.getStudentPlanTemplateTable();
    await templateTable.clickActionColumn('templateName', templateName, 'Actions', 'Copy');
  }

  /**
   * Check if template exists in table
   * @param templateName - Name of the template to check
   * @returns true if template exists, false otherwise
   */
  async isTemplateExists(templateName: string): Promise<boolean> {
    try {
      const templateTable = this.getStudentPlanTemplateTable();
      return await templateTable.isValuePresentInColumn('templateName', templateName);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get template status by name
   * @param templateName - Name of the template
   * @returns Template status
   */
  async getTemplateStatus(templateName: string): Promise<string> {
    const templateTable = this.getStudentPlanTemplateTable();
    return await templateTable.getCellValue('templateName', templateName, 'status');
  }

  /**
   * Wait for template to appear in table
   * @param templateName - Name of the template to wait for
   * @param timeout - Timeout in milliseconds (default: 30000)
   */
  async waitForTemplateInTable(templateName: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForFunction(
      (name) => {
        const table = document.querySelector('ag-grid-angular');
        const cells = table?.querySelectorAll("[col-id='templateName']");
        return Array.from(cells || []).some(cell => cell.textContent?.includes(name));
      },
      templateName,
      { timeout }
    );
  }
}
