/**
 * Playwright/TypeScript version of MtssCreateAStudentPlanTemplateDialog (converted from Java)
 * @author Ashok Garg (Converted to TypeScript/Playwright)
 * @since 10-08-2020
 */
import { Page, Locator, expect } from '@playwright/test';
import { MtssBaseDialog } from '../base/MtssBaseDialog';

export class MtssCreateAStudentPlanTemplateDialog extends MtssBaseDialog {
  // CSS Selector constants - equivalent to Java version
  private static readonly PLAN_TYPE_DROPDOWN = 'ng-select#planType';
  private static readonly DISTRICT_DROPDOWN = 'ng-select#district';
  private static readonly ARROW_ICON = 'span.ng-arrow-wrapper';
  private static readonly DROPDOWN_ITEMS = 'div.ng-dropdown-panel-items div[role="option"]';
  private static readonly TEMPLATE_NAME_TEXTBOX = '#name';
  private static readonly SAVE_NEW_PLAN_TYPE_LINK = 'button.btn-link';
  private static readonly PLAN_TYPE_SUCCESS_MESSAGE = 'small.form-text.text-success';
  private static readonly DROPDOWN_TEXTBOX = 'input[type="text"]';
  private static readonly SECURED_FLAG = '#isSecured';
  private static readonly ALL_DISTRICT_FLAG = '#selectAllDistricts';
  private static readonly STATE_LEVEL_FLAG = '#stateLevel';

  constructor(page: Page, dialogLocator: Locator) {
    super(page, dialogLocator);
  }

  protected dialogTitle(): string {
    return 'Create a Student Plan Template';
  }

  /**
   * Sets the template name
   * @param templateName The name for the template
   */
  public async setTemplateName(templateName: string): Promise<void> {
    const body = await this.$body();
    const templateNameInput = body.locator(MtssCreateAStudentPlanTemplateDialog.TEMPLATE_NAME_TEXTBOX);
    await expect(templateNameInput).toBeVisible();
    await templateNameInput.fill(templateName);
  }

  /**
   * Checks if template name textbox is available to edit
   * @returns true if enabled, false otherwise
   */
  public async isSetTemplateNameTextAvailableToEdit(): Promise<boolean> {
    const body = await this.$body();
    const templateNameInput = body.locator(MtssCreateAStudentPlanTemplateDialog.TEMPLATE_NAME_TEXTBOX);
    return await templateNameInput.isEnabled();
  }

  /**
   * Sets the plan type by typing and selecting the first matching option
   * @param planType The plan type to set
   */
  public async setPlanType(planType: string): Promise<void> {
    const body = await this.$body();
    const planTypeDropdown = body.locator(MtssCreateAStudentPlanTemplateDialog.PLAN_TYPE_DROPDOWN);
    const dropdownTextbox = planTypeDropdown.locator(MtssCreateAStudentPlanTemplateDialog.DROPDOWN_TEXTBOX);
    
    await expect(dropdownTextbox).toBeVisible();
    await dropdownTextbox.fill(planType);
    
    const markedOption = this.page.locator('div.ng-option.ng-option-marked');
    await expect(markedOption).toBeVisible();
    await markedOption.click();
  }

  /**
   * Clicks the Save New Plan Type link
   */
  public async clickSaveNewPlanTypeLink(): Promise<void> {
    const body = await this.$body();
    const saveLink = body.locator(MtssCreateAStudentPlanTemplateDialog.SAVE_NEW_PLAN_TYPE_LINK);
    
    await expect(saveLink).toBeVisible({ timeout: 30000 });
    
    // Use JavaScript click as fallback for complex interactions
    await saveLink.click();
    await this.page.waitForTimeout(5000);
    
    // Check if Save New Plan Type button is displayed and click it
    const saveButtons = body.locator('.btn').filter({ hasText: 'Save New Plan Type' });
    const isDisplayed = await saveButtons.first().isVisible();
    if (isDisplayed) {
      await saveButtons.first().click();
    }
  }

  /**
   * Selects a plan type from the dropdown
   * @param planType The plan type to select
   */
  public async selectPlanType(planType: string): Promise<void> {
    const body = await this.$body();
    const permissionDropdown = body.locator(MtssCreateAStudentPlanTemplateDialog.PLAN_TYPE_DROPDOWN);
    await expect(permissionDropdown).toBeVisible();
    
    await permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.ARROW_ICON).click();
    await permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.DROPDOWN_TEXTBOX).fill(planType);
    
    await this.page.waitForTimeout(1000);
    
    const dropdownItems = permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.DROPDOWN_ITEMS);
    await expect(dropdownItems.first()).toBeVisible();
    
    const targetPlanType = dropdownItems.filter({ hasText: planType });
    await targetPlanType.click();
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Selects a district from the dropdown
   * @param district The district to select
   */
  public async selectDistrict(district: string): Promise<void> {
    const body = await this.$body();
    const permissionDropdown = body.locator(MtssCreateAStudentPlanTemplateDialog.DISTRICT_DROPDOWN);
    await expect(permissionDropdown).toBeVisible();
    
    await permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.ARROW_ICON).click();
    await permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.DROPDOWN_TEXTBOX).fill(district);
    
    await this.page.waitForTimeout(1000);
    
    const dropdownItems = permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.DROPDOWN_ITEMS);
    await expect(dropdownItems.first()).toBeVisible();
    
    const targetDistrict = dropdownItems.filter({ hasText: district });
    await targetDistrict.click();
    
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clicks the select all districts checkbox
   */
  public async selectAllDistrictCheckBox(): Promise<void> {
    const allDistrictFlag = this.page.locator(MtssCreateAStudentPlanTemplateDialog.ALL_DISTRICT_FLAG);
    await allDistrictFlag.click();
  }

  /**
   * Clicks the secured flag checkbox
   */
  public async clickOnIsSecuredFlag(): Promise<void> {
    const securedFlag = this.page.locator(MtssCreateAStudentPlanTemplateDialog.SECURED_FLAG);
    await securedFlag.click();
  }

  /**
   * Clicks the state admin flag checkbox
   */
  public async clickOnStateAdminFlag(): Promise<void> {
    const stateLevelFlag = this.page.locator(MtssCreateAStudentPlanTemplateDialog.STATE_LEVEL_FLAG);
    await stateLevelFlag.click();
  }

  /**
   * Gets the list of districts from the dropdown
   * @returns Array of district names
   */
  public async getDistrict(): Promise<string[]> {
    const body = await this.$body();
    const permissionDropdown = body.locator(MtssCreateAStudentPlanTemplateDialog.DISTRICT_DROPDOWN);
    await expect(permissionDropdown).toBeVisible();
    
    await permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.ARROW_ICON).click();
    
    const dropdownItems = permissionDropdown.locator(MtssCreateAStudentPlanTemplateDialog.DROPDOWN_ITEMS);
    await expect(dropdownItems.first()).toBeVisible();
    
    const districtNames = await dropdownItems.allTextContents();
    
    await this.page.waitForTimeout(1000);
    
    return districtNames;
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
   * Gets the plan type saved message text
   * @returns The success message text
   */
  public async getPlanTypeSavedMessageText(): Promise<string> {
    const body = await this.$body();
    const successMessage = body.locator(MtssCreateAStudentPlanTemplateDialog.PLAN_TYPE_SUCCESS_MESSAGE);
    
    try {
      await expect(successMessage).toBeVisible();
      const messageText = await successMessage.textContent();
      return messageText?.trim() || '';
    } catch (error) {
      // If message is not visible, try clicking save link and retry
      await this.clickSaveNewPlanTypeLink();
      await expect(successMessage).toBeVisible();
      const messageText = await successMessage.textContent();
      return messageText?.trim() || '';
    }
  }

  /**
   * Sets the status by clicking on the corresponding label
   * @param status The status text to select
   */
  public async setStatus(status: string): Promise<void> {
    const body = await this.$body();
    const statusLabels = body.locator('div.pds-label-text').filter({ hasText: status });
    await statusLabels.first().click();
  }
}
