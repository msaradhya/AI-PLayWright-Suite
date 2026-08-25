/**
 * Playwright/TypeScript version of MtssCreateAStudentPlanDialog (converted from Java)
 * @author Ashok Garg (Converted to TypeScript/Playwright)
 * @since 10-08-2020
 */
import { Page, Locator, expect } from '@playwright/test';
import { MtssBaseDialog } from '../base/MtssBaseDialog';

export class MtssCreateAStudentPlanDialog extends MtssBaseDialog {
  // CSS Selector constants - equivalent to Java version
  private static readonly PLAN_TEMPLATE_DROPDOWN = 'ng-select[name="template"]';
  private static readonly ARROW_ICON = 'span.ng-arrow-wrapper';
  private static readonly DROPDOWN_ITEMS = 'div.ng-dropdown-panel-items div[role="option"]';
  private static readonly FIND_A_STUDENT_DROPDOWN = 'ng-select[name="student"]';
  private static readonly FIND_A_STAFF_DROPDOWN = 'ng-select[name="staff"]';
  private static readonly PLAN_NAME_TEXTBOX = '#planName';
  private static readonly START_DATE_TEXTBOX = '[name="startDate"]';
  private static readonly END_DATE_TEXTBOX = '[name="endDate"]';
  private static readonly MONTH_DROPDOWN = 'select[aria-label="Select month"]';
  private static readonly YEAR_DROPDOWN = 'select[aria-label="Select year"]';
  private static readonly DATE_PICKER_ICON = 'button.btn-primary';
  private static readonly DROPDOWN_TEXTBOX = 'input[type="text"]';

  constructor(page: Page, dialogLocator: Locator) {
    super(page, dialogLocator);
  }

  protected dialogTitle(): string {
    return 'Create a Student Plan';
  }

  /**
   * Selects a student from the Find a Student dropdown
   * @param studentName The name of the student to select
   */
  public async selectFindAStudent(studentName: string): Promise<void> {
    const body = await this.$body();
    const permissionDropdown = body.locator(MtssCreateAStudentPlanDialog.FIND_A_STUDENT_DROPDOWN);
    await expect(permissionDropdown).toBeVisible();
    
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.ARROW_ICON).click();
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_TEXTBOX).fill(studentName);
    
    // Wait for spinner to disappear
    await permissionDropdown.locator('div.ng-spinner-loader').waitFor({ state: 'detached' });
    
    const dropdownItems = permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_ITEMS);
    await expect(dropdownItems.first()).toBeVisible();
    
    const targetStudent = dropdownItems.filter({ hasText: studentName });
    await targetStudent.click();
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Checks if a student is displayed in the dropdown
   * @param studentName The name of the student to check
   * @returns The number of matching students found
   */
  public async isStudentDisplayed(studentName: string): Promise<number> {
    const body = await this.$body();
    const permissionDropdown = body.locator(MtssCreateAStudentPlanDialog.FIND_A_STUDENT_DROPDOWN);
    await expect(permissionDropdown).toBeVisible();
    
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.ARROW_ICON).click();
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_TEXTBOX).fill(studentName);
    
    // Wait for spinner to disappear
    await permissionDropdown.locator('div.ng-spinner-loader').waitFor({ state: 'detached' });
    
    const dropdownItems = permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_ITEMS);
    return await dropdownItems.count();
  }

  /**
   * Selects a plan template from the dropdown
   * @param planType The plan type/template to select
   */
  public async selectPlanTemplate(planType: string): Promise<void> {
    const body = await this.$body();
    const permissionDropdown = body.locator(MtssCreateAStudentPlanDialog.PLAN_TEMPLATE_DROPDOWN);
    await expect(permissionDropdown).toBeVisible();
    
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.ARROW_ICON).click();
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_TEXTBOX).fill(planType);
    
    await this.page.waitForTimeout(1000);
    
    const dropdownItems = permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_ITEMS);
    await expect(dropdownItems.first()).toBeVisible();
    
    const targetPlan = dropdownItems.filter({ hasText: planType });
    await targetPlan.click();
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Sets the plan name
   * @param planName The name for the plan
   */
  public async setPlanName(planName: string): Promise<void> {
    const body = await this.$body();
    const planNameInput = body.locator(MtssCreateAStudentPlanDialog.PLAN_NAME_TEXTBOX);
    await expect(planNameInput).toBeVisible();
    await planNameInput.fill(planName);
  }

  /**
   * Sets the start date using the date picker
   * @param date The start date (format: YYYY-MM-DD)
   */
  public async setStartDate(date: string): Promise<void> {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear().toString();
    const day = dateObj.getDate().toString();

    const body = await this.$body();
    const startDateParent = body.locator(MtssCreateAStudentPlanDialog.START_DATE_TEXTBOX).locator('..');
    await startDateParent.locator(MtssCreateAStudentPlanDialog.DATE_PICKER_ICON).click();
    
    await this.page.locator(MtssCreateAStudentPlanDialog.MONTH_DROPDOWN).selectOption(month);
    await this.page.locator(MtssCreateAStudentPlanDialog.YEAR_DROPDOWN).selectOption(year);
    
    const daySelector = `div.ngb-dp-day[aria-label*="${month}"]`;
    const dayElements = this.page.locator(daySelector);
    const targetDay = dayElements.filter({ hasText: new RegExp(`^${day}$`) });
    await expect(targetDay).toBeVisible();
    await targetDay.click();
  }

  /**
   * Sets the end date using the date picker
   * @param endDate The end date (format: YYYY-MM-DD)
   */
  public async setEndDate(endDate: string): Promise<void> {
    const dateObj = new Date(endDate);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear().toString();
    const day = dateObj.getDate().toString();

    const body = await this.$body();
    const endDateParent = body.locator(MtssCreateAStudentPlanDialog.END_DATE_TEXTBOX).locator('..');
    await endDateParent.locator(MtssCreateAStudentPlanDialog.DATE_PICKER_ICON).click();
    
    await this.page.locator(MtssCreateAStudentPlanDialog.MONTH_DROPDOWN).selectOption(month);
    await this.page.locator(MtssCreateAStudentPlanDialog.YEAR_DROPDOWN).selectOption(year);
    
    const daySelector = `div.ngb-dp-day[aria-label*="${month}"]`;
    const dayElements = this.page.locator(daySelector);
    const targetDay = dayElements.filter({ hasText: new RegExp(`^${day}$`) });
    await expect(targetDay).toBeVisible();
    await targetDay.click();
  }

  /**
   * Clicks the Continue button
   */
  public async clickContinueButton(): Promise<void> {
    const continueButton = await this.getFooterButton('Continue');
    await expect(continueButton).toBeVisible();
    await continueButton.click();
  }

  /**
   * Selects staff from the Find Staff dropdown
   * @param staffName The name of the staff to select
   */
  public async selectFindStaff(staffName: string): Promise<void> {
    const body = await this.$body();
    const permissionDropdown = body.locator(MtssCreateAStudentPlanDialog.FIND_A_STAFF_DROPDOWN);
    await expect(permissionDropdown).toBeVisible();
    
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.ARROW_ICON).click();
    await permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_TEXTBOX).fill(staffName);
    
    // Wait for spinner to disappear
    await permissionDropdown.locator('div.ng-spinner-loader').waitFor({ state: 'detached' });
    
    const dropdownItems = permissionDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_ITEMS);
    await expect(dropdownItems.first()).toBeVisible();
    
    const targetStaff = dropdownItems.filter({ hasText: staffName });
    await targetStaff.click();
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Checks if an inactive template is displayed
   * @param templateName The template name to check
   * @returns The number of matching templates found
   */
  public async isInactiveTemplateDisplayed(templateName: string): Promise<number> {
    const body = await this.$body();
    const templateDropdown = body.locator(MtssCreateAStudentPlanDialog.PLAN_TEMPLATE_DROPDOWN);
    await expect(templateDropdown).toBeVisible();
    
    await templateDropdown.locator(MtssCreateAStudentPlanDialog.ARROW_ICON).click();
    await templateDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_TEXTBOX).fill(templateName);
    
    await this.page.waitForTimeout(1000);
    
    // Wait for spinner to disappear
    await templateDropdown.locator('div.ng-spinner-loader').waitFor({ state: 'detached' });
    
    const dropdownItems = templateDropdown.locator(MtssCreateAStudentPlanDialog.DROPDOWN_ITEMS);
    return await dropdownItems.count();
  }

}
