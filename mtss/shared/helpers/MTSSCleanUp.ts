import { Page, BrowserContext } from '@playwright/test';
import { HoonuitHelper } from '../../../helpers/hoonuitHelper';
import { MtssHelper } from './MtssHelper';
import { MtssInterventionspage } from '../pages/MtssInterventionspage';

/**
 * MTSS Clean Up Helper - converted from Java to TypeScript/Playwright
 * Handles cleanup operations for MTSS interventions, plans, and settings
 * @author Ankit.Mohapatra
 * @since 10/05/2023 (Converted to TypeScript/Playwright)
 */
export class MTSSCleanUp {
  private page: Page;
  private context: BrowserContext;
  private hoonuitMtssInterventionsPage: MtssInterventionspage;

  private constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    this.hoonuitMtssInterventionsPage = new MtssInterventionspage(page);
  }

  /**
   * Delete intervention plan and settings
   * If deletion required pass Name else null
   * @param page Playwright Page object
   * @param context Playwright Browser Context
   * @param interventionName Intervention name to delete
   * @param planName Plan name to delete
   * @param reason Reason to delete
   * @param level Level to delete
   * @param type Type to delete
   * @param strategy Strategy to delete
   */
  public static async deleteInterventionPlanAndSettings(
    page: Page,
    context: BrowserContext,
    interventionName: string | null,
    planName: string | null,
    reason: string | null,
    level: string | null,
    type: string | null,
    strategy: string | null
  ): Promise<void> {
    // Maximize window (Playwright equivalent)
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const mtssCleanUp = new MTSSCleanUp(page, context);
    
    // Select utility app (equivalent to HoonuitHelper.selectUtilityApp("MTSS Interventions"))
    await HoonuitHelper.selectUtilityApp("MTSS Interventions");
    
    // Handle new window context (Playwright equivalent of PSWindow.inNewWindow)
    const newPage = await context.newPage();
    try {
      await mtssCleanUp.clearConfigAndDeleteIntervention(newPage, interventionName);
      await mtssCleanUp.deletePlan(newPage, planName);
      await mtssCleanUp.deleteSettings(newPage, reason, level, type, strategy);
    } finally {
      await newPage.close();
    }
  }

  /**
   * Clear configuration and delete intervention
   * @param page Playwright Page object
   * @param interventionName Intervention name to delete
   */
  private async clearConfigAndDeleteIntervention(page: Page, interventionName: string | null): Promise<void> {
    if (interventionName !== null) {
      await HoonuitHelper.waitForSpinnerToDisappear();
      
      // Check if clear all filter is displayed and clear it
      const clearAllFilterSelector = '[aria-label="Clear All Filters"], button:has-text("Clear All")';
      try {
        const clearAllFilter = page.locator(clearAllFilterSelector);
        if (await clearAllFilter.isVisible({ timeout: 5000 })) {
          await clearAllFilter.click();
          await HoonuitHelper.waitForPageToLoad();
        }
      } catch (error) {
        // Filter button not found, continue
      }

      // Click status checkbox for "Completed"
      await this.clickStatusCheckbox(page, "Completed");
      
      // Search intervention by name
      await this.searchInterventionByNameOnAllInterventionsTab(page, interventionName);
      
      // Click on intervention by name
      await this.clickOnInterventionByName(page, interventionName);

      // Try to delete intervention directly
      const deleteResult = await this.deleteIntervention(page);
      if (deleteResult) {
        return;
      }

      // If direct deletion failed, clear intervention data first
      const meetingDates = await this.getMeetingDatesOptions(page);
      for (const meetingDate of meetingDates) {
        await this.selectDateFromScheduleDropDown(page, meetingDate);
        await HoonuitHelper.waitForPageToLoad();
        
        // Clear attendance
        await this.clearAttendance(page);
        
        // Clear observations
        await this.clearObservations(page);
        
        // Clear goals
        await this.clearGoals(page);
        
        // Delete notes
        await this.deleteNote(page);
      }
      
      // Final deletion attempt
      const finalDeleteResult = await this.deleteIntervention(page);
      if (!finalDeleteResult) {
        throw new Error("Intervention deletion button is not enabled.");
      }
    }
  }

  /**
   * Clear attendance data
   * @param page Playwright Page object
   */
  private async clearAttendance(page: Page): Promise<void> {
    await this.switchToAttendanceTab(page, "Attendance");
    await HoonuitHelper.waitForPageToLoad();
    await this.selectAllStudentsOnAttendanceTab(page);
    await this.selectBulkOptionButton(page);
    await this.massUpdateAttendance(page, "Present");
    await this.clearAttendanceTimeInBulk(page);
    await this.clickAllAttendanceBtn(page);
  }

  /**
   * Clear observations data
   * @param page Playwright Page object
   */
  private async clearObservations(page: Page): Promise<void> {
    await this.switchToObservationTab(page, "Observations");
    await this.selectBulkOptionButton(page);
    await this.massUpdateNeutralObservation(page);
    await this.clickAllNeutralBtn(page);
  }

  /**
   * Clear goals data
   * @param page Playwright Page object
   */
  private async clearGoals(page: Page): Promise<void> {
    const isGoalsTabEnabled = await this.isGoalsTabEnabled(page);
    if (isGoalsTabEnabled) {
      await this.switchToGoalsTab(page, "Goals");
      await this.setAllGoalsScore(page, "");
    }
  }

  /**
   * Delete plan
   * @param page Playwright Page object
   * @param planName Plan name to delete
   */
  private async deletePlan(page: Page, planName: string | null): Promise<void> {
    if (planName !== null) {
      await this.switchTab(page, "Intervention Bank");
      await this.deleteInterventionPlan(page, planName);
    }
  }

  /**
   * Delete settings (reasons, levels, types, strategies)
   * @param page Playwright Page object
   * @param reason Reason to delete
   * @param level Level to delete
   * @param type Type to delete
   * @param strategy Strategy to delete
   */
  private async deleteSettings(
    page: Page,
    reason: string | null,
    level: string | null,
    type: string | null,
    strategy: string | null
  ): Promise<void> {
    if (reason !== null) {
      await this.switchTab(page, "Settings");
      await this.deleteReasonByName(page, reason);
    }

    if (level !== null) {
      await this.switchTab(page, "Settings");
      await this.switchSettingsLevelTab(page);
      await this.deleteLevelByName(page, level);
    }

    if (type !== null) {
      await this.switchTab(page, "Settings");
      await this.switchSettingsTypesTab(page);
      await this.deleteTypeByName(page, type);
    }

    if (strategy !== null) {
      await this.switchTab(page, "Settings");
      await this.switchSettingsInstructionalStrategiesTab(page);
      await this.deleteResourceByName(page, strategy);
    }
  }

  /**
   * Clear intervention data implementation
   * @param page Playwright Page object
   * @param interventionName Intervention name
   */
  private async clearInterventionDataImplementation(page: Page, interventionName: string | null): Promise<void> {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    if (interventionName !== null) {
      await this.searchInterventionByNameOnAllInterventionsTab(page, interventionName);
      await this.clickOnInterventionByName(page, interventionName);
      
      const meetingDates = await this.getMeetingDatesOptions(page);
      for (const meetingDate of meetingDates) {
        await this.selectDateFromScheduleDropDown(page, meetingDate);
        await HoonuitHelper.waitForPageToLoad();
        
        // Clear attendance
        await this.clearAttendance(page);
        
        // Clear observations
        await this.clearObservations(page);
        
        // Clear goals
        await this.clearGoals(page);
      }
    }
  }

  /**
   * Public method to clear intervention data
   * @param page Playwright Page object
   * @param context Playwright Browser Context
   * @param interventionName Intervention name
   */
  public static async clearInterventionData(
    page: Page,
    context: BrowserContext,
    interventionName: string
  ): Promise<void> {
    const mtssCleanUp = new MTSSCleanUp(page, context);
    await mtssCleanUp.clearInterventionDataImplementation(page, interventionName);
  }

  /**
   * Delete notes
   * @param page Playwright Page object
   */
  private async deleteNote(page: Page): Promise<void> {
    const notesCount = await this.getNotesCount(page);
    if (notesCount > 0) {
      await this.deleteNoteImplementation(page);
    }
  }

  // Helper methods to be implemented based on page object patterns
  private async clickStatusCheckbox(page: Page, status: string): Promise<void> {
    const statusCheckbox = page.locator(`input[type="checkbox"][value="${status}"], [aria-label*="${status}"]`);
    if (await statusCheckbox.isVisible()) {
      await statusCheckbox.check();
    }
  }

  private async searchInterventionByNameOnAllInterventionsTab(page: Page, interventionName: string): Promise<void> {
    const searchInput = page.locator('[placeholder*="Search"], input[type="search"], [aria-label*="search"]').first();
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill(interventionName);
    await page.keyboard.press('Enter');
    await HoonuitHelper.waitForPageToLoad();
  }

  private async clickOnInterventionByName(page: Page, interventionName: string): Promise<void> {
    const interventionRow = page.locator(`tr:has-text("${interventionName}"), .intervention-row:has-text("${interventionName}")`);
    await interventionRow.waitFor({ state: 'visible' });
    await interventionRow.click();
    await HoonuitHelper.waitForPageToLoad();
  }

  private async deleteIntervention(page: Page): Promise<boolean> {
    try {
      const deleteButton = page.locator('button:has-text("Delete"), [aria-label*="Delete"], button[name="delete"]');
      if (await deleteButton.isVisible() && await deleteButton.isEnabled()) {
        await deleteButton.click();
        
        // Confirm deletion if confirmation dialog appears
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
        if (await confirmButton.isVisible({ timeout: 3000 })) {
          await confirmButton.click();
        }
        return true;
      }
    } catch (error) {
      console.log('Delete button not available or not enabled');
    }
    return false;
  }

  private async getMeetingDatesOptions(page: Page): Promise<string[]> {
    const dateDropdown = page.locator('select[aria-label*="date"], select[name*="date"], .date-dropdown select');
    await dateDropdown.waitFor({ state: 'visible' });
    
    const options = await dateDropdown.locator('option').allInnerTexts();
    return options.filter(option => option.trim() !== '');
  }

  private async selectDateFromScheduleDropDown(page: Page, meetingDate: string): Promise<void> {
    const dateDropdown = page.locator('select[aria-label*="date"], select[name*="date"], .date-dropdown select');
    await dateDropdown.selectOption({ label: meetingDate });
  }

  private async switchToAttendanceTab(page: Page, tabName: string): Promise<void> {
    const tab = page.locator(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}"), a:has-text("${tabName}")`);
    await tab.click();
  }

  private async selectAllStudentsOnAttendanceTab(page: Page): Promise<void> {
    const selectAllCheckbox = page.locator('input[type="checkbox"][aria-label*="Select All"], .select-all input[type="checkbox"]');
    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.check();
    }
  }

  private async selectBulkOptionButton(page: Page): Promise<void> {
    const bulkButton = page.locator('button:has-text("Bulk"), [aria-label*="Bulk"], .bulk-actions button');
    await bulkButton.click();
  }

  private async massUpdateAttendance(page: Page, status: string): Promise<void> {
    const statusOption = page.locator(`button:has-text("${status}"), [value="${status}"]`);
    await statusOption.click();
  }

  private async clearAttendanceTimeInBulk(page: Page): Promise<void> {
    const clearTimeButton = page.locator('button:has-text("Clear Time"), [aria-label*="Clear Time"]');
    if (await clearTimeButton.isVisible()) {
      await clearTimeButton.click();
    }
  }

  private async clickAllAttendanceBtn(page: Page): Promise<void> {
    const allAttendanceButton = page.locator('button:has-text("All"), .attendance-all button');
    if (await allAttendanceButton.isVisible()) {
      await allAttendanceButton.click();
    }
  }

  private async switchToObservationTab(page: Page, tabName: string): Promise<void> {
    const tab = page.locator(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}"), a:has-text("${tabName}")`);
    await tab.click();
  }

  private async massUpdateNeutralObservation(page: Page): Promise<void> {
    const neutralButton = page.locator('button:has-text("Neutral"), [value="Neutral"]');
    await neutralButton.click();
  }

  private async clickAllNeutralBtn(page: Page): Promise<void> {
    const allNeutralButton = page.locator('button:has-text("All Neutral"), .neutral-all button');
    if (await allNeutralButton.isVisible()) {
      await allNeutralButton.click();
    }
  }

  private async isGoalsTabEnabled(page: Page): Promise<boolean> {
    const goalsTab = page.locator('[role="tab"]:has-text("Goals"), .tab:has-text("Goals")');
    return await goalsTab.isVisible() && await goalsTab.isEnabled();
  }

  private async switchToGoalsTab(page: Page, tabName: string): Promise<void> {
    const tab = page.locator(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}"), a:has-text("${tabName}")`);
    await tab.click();
  }

  private async setAllGoalsScore(page: Page, score: string): Promise<void> {
    const scoreInputs = page.locator('input[type="number"][aria-label*="score"], input[name*="score"]');
    const count = await scoreInputs.count();
    for (let i = 0; i < count; i++) {
      await scoreInputs.nth(i).fill(score);
    }
  }

  private async switchTab(page: Page, tabName: string): Promise<void> {
    const tab = page.locator(`[role="tab"]:has-text("${tabName}"), .tab:has-text("${tabName}"), a:has-text("${tabName}")`);
    await tab.click();
    await HoonuitHelper.waitForPageToLoad();
  }

  private async deleteInterventionPlan(page: Page, planName: string): Promise<void> {
    const planRow = page.locator(`tr:has-text("${planName}"), .plan-row:has-text("${planName}")`);
    const deleteButton = planRow.locator('button:has-text("Delete"), [aria-label*="Delete"]');
    await deleteButton.click();
    
    // Confirm deletion
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click();
    }
  }

  private async deleteReasonByName(page: Page, reason: string): Promise<void> {
    const reasonRow = page.locator(`tr:has-text("${reason}"), .reason-row:has-text("${reason}")`);
    const deleteButton = reasonRow.locator('button:has-text("Delete"), [aria-label*="Delete"]');
    await deleteButton.click();
    
    // Confirm deletion
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click();
    }
  }

  private async switchSettingsLevelTab(page: Page): Promise<void> {
    const levelTab = page.locator('[role="tab"]:has-text("Level"), .tab:has-text("Level"), a:has-text("Level")');
    await levelTab.click();
  }

  private async deleteLevelByName(page: Page, level: string): Promise<void> {
    const levelRow = page.locator(`tr:has-text("${level}"), .level-row:has-text("${level}")`);
    const deleteButton = levelRow.locator('button:has-text("Delete"), [aria-label*="Delete"]');
    await deleteButton.click();
    
    // Confirm deletion
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click();
    }
  }

  private async switchSettingsTypesTab(page: Page): Promise<void> {
    const typesTab = page.locator('[role="tab"]:has-text("Types"), .tab:has-text("Types"), a:has-text("Types")');
    await typesTab.click();
  }

  private async deleteTypeByName(page: Page, type: string): Promise<void> {
    const typeRow = page.locator(`tr:has-text("${type}"), .type-row:has-text("${type}")`);
    const deleteButton = typeRow.locator('button:has-text("Delete"), [aria-label*="Delete"]');
    await deleteButton.click();
    
    // Confirm deletion
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click();
    }
  }

  private async switchSettingsInstructionalStrategiesTab(page: Page): Promise<void> {
    const strategiesTab = page.locator('[role="tab"]:has-text("Strategies"), .tab:has-text("Strategies"), a:has-text("Instructional")');
    await strategiesTab.click();
  }

  private async deleteResourceByName(page: Page, strategy: string): Promise<void> {
    const strategyRow = page.locator(`tr:has-text("${strategy}"), .strategy-row:has-text("${strategy}")`);
    const deleteButton = strategyRow.locator('button:has-text("Delete"), [aria-label*="Delete"]');
    await deleteButton.click();
    
    // Confirm deletion
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
    if (await confirmButton.isVisible({ timeout: 3000 })) {
      await confirmButton.click();
    }
  }

  private async getNotesCount(page: Page): Promise<number> {
    const notes = page.locator('.note-item, .intervention-note, [data-testid="note"]');
    return await notes.count();
  }

  private async deleteNoteImplementation(page: Page): Promise<void> {
    const deleteNoteButton = page.locator('button:has-text("Delete Note"), [aria-label*="Delete Note"]');
    if (await deleteNoteButton.isVisible()) {
      await deleteNoteButton.click();
      
      // Confirm deletion
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
      if (await confirmButton.isVisible({ timeout: 3000 })) {
        await confirmButton.click();
      }
    }
  }
}
