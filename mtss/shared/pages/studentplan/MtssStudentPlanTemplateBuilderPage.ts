import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from '../base/MtssBasePage';
import { MtssHelper } from '../../helpers/MtssHelper';

/**
 * Student Plan Template Builder Page - Playwright Implementation
 * Converted from Java: MtssStudentPlanTemplateBuilderPage.java
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 10-08-2020
 */
export class MtssStudentPlanTemplateBuilderPage extends MtssBasePage {
  // Locators - converted from Java static final fields
  private readonly closeIcon: Locator;
  private readonly formBuilderTargetElement: Locator;
  private readonly includeTabsCheckbox: Locator;
  private readonly labelButton: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly subNavTabs: Locator;
  private readonly createTabButton: Locator;
  private readonly addLabelButton: Locator;
  private readonly formBuilderIconsList: Locator;
  private readonly templateNameTextBox: Locator;
  private readonly textBox: Locator;
  private readonly saveFormButton: Locator;
  private readonly dragAndDropText: Locator;
  private readonly productList: Locator;
  private readonly monthDropdown: Locator;
  private readonly yearDropdown: Locator;
  private readonly radioBtnCheckboxes: Locator;
  private readonly dropdownBtn: Locator;
  private readonly dropdownOptions: Locator;
  private readonly selectAllProductList: Locator;
  private readonly addSecondLabelLocator: Locator;
  private readonly paragraphText: Locator;
  private readonly labelText: Locator;
  private readonly tab1: Locator;
  private readonly templateNameText: Locator;
  private readonly thirdTab: Locator;
  private readonly firstLabelValueSelectForm: Locator;
  private readonly secondLabelValueSelectForm: Locator;
  private readonly selectAllProduct: Locator;
  private readonly labelTextBox: Locator;
  private readonly paragraphTextBox: Locator;
  private readonly textInput: Locator;
  private readonly textArea: Locator;

  // Constants
  private static readonly TEST_PRODUCT_TEXT = "Test Product";

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.closeIcon = page.locator('[name="close-X"]');
    this.formBuilderTargetElement = page.locator("[class='builder-components drag-container formio-builder-form']");
    this.includeTabsCheckbox = page.locator('#includeTabs');
    this.labelButton = page.locator("[name='data[values][0][label]']");
    this.saveButton = page.locator("[class='btn btn-success']");
    this.cancelButton = page.locator("[class='btn btn-secondary']");
    this.subNavTabs = page.locator("div.pds-scoped-tabs ul.pds-tabs a:not(.ml-auto a)");
    this.createTabButton = page.locator("[ref='datagrid-components-addRow']");
    this.addLabelButton = page.locator("[class='btn btn-primary formio-button-add-row']");
    this.formBuilderIconsList = page.locator("[ref='sidebar-container'] span");
    this.templateNameTextBox = page.locator("[aria-label='Edit template properties']");
    this.textBox = page.locator("[role='textbox']");
    this.saveFormButton = page.locator("[aria-label='Save']");
    this.dragAndDropText = page.locator("[class='drag-and-drop-alert alert alert-info no-drag']");
    this.productList = page.locator("div.mb-3.ml-2");
    this.monthDropdown = page.locator("select[aria-label='Select month']");
    this.yearDropdown = page.locator("select[aria-label='Select year']");
    this.radioBtnCheckboxes = page.locator("[class='pds-label-text']");
    this.dropdownBtn = page.locator("[class='ng-arrow-wrapper']");
    this.dropdownOptions = page.locator("[role='option']");
    this.selectAllProductList = page.locator("[aria-autocomplete='list']");
    this.addSecondLabelLocator = page.locator("[name='data[values][1][label]']");
    this.paragraphText = page.locator("lib-render-paragraph div");
    this.labelText = page.locator("div.plan-label");
    this.tab1 = page.locator("[name='data[components][1][label]']");
    this.templateNameText = page.locator("[class='d-flex mb-3'] h2");
    this.thirdTab = page.locator("[name='data[components][2][label]']");
    this.firstLabelValueSelectForm = page.locator("[name='data[data.values][0][label]']");
    this.secondLabelValueSelectForm = page.locator("[name='data[data.values][1][label]']");
    this.selectAllProduct = page.locator("input[id*='selectAll']");
    this.labelTextBox = page.locator("input[id*='-description']");
    this.paragraphTextBox = page.locator("div.component-edit-container");
    this.textInput = page.locator("input.form-control");
    this.textArea = page.locator("[class='note-editable']");
  }

  protected pageTitle(): string {
    return 'Student Plan Template Builder';
  }

  /**
   * Set the include tabs checkbox
   * @param set - true to check, false to uncheck
   */
  async setIncludeTabsCheckbox(set: boolean): Promise<void> {
    const checkbox = this.includeTabsCheckbox;
    const selected = await checkbox.isChecked();
    if (selected !== set) {
      await checkbox.locator('..').click(); // Click parent like Java version
    }
  }

  /**
   * Drag and drop form builder icon
   * @param formBuilderIconName - Name of the icon to drag
   */
  async dragAndDropFormBuilderIcon(formBuilderIconName: string): Promise<void> {
    const dragElement = this.formBuilderIconsList
      .filter({ hasText: formBuilderIconName })
      .first();
    
    await dragElement.scrollIntoViewIfNeeded();
    
    // Perform drag and drop
    await dragElement.dragTo(this.formBuilderTargetElement);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Drag and drop form builder icon on tab
   * @param formBuilderIconName - Name of the icon to drag
   */
  async dragAndDropFormBuilderIconOnTab(formBuilderIconName: string): Promise<void> {
    const dragElement = this.formBuilderIconsList
      .filter({ hasText: formBuilderIconName })
      .first();
    
    await dragElement.scrollIntoViewIfNeeded();
    
    // Perform drag and drop on tab
    await dragElement.dragTo(this.dragAndDropText);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Get template name
   * @returns Template name text
   */
  async getTemplateName(): Promise<string> {
    return await this.templateNameText.textContent() || '';
  }

  /**
   * Drag and drop form builder icon on tab when component is present
   * @param formBuilderIconName - Name of the icon to drag
   */
  async dragAndDropFormBuilderIconOnTabWhenComponentPresent(formBuilderIconName: string): Promise<void> {
    const dragElement = this.formBuilderIconsList
      .filter({ hasText: formBuilderIconName })
      .first();
    
    await dragElement.scrollIntoViewIfNeeded();
    
    const targetElement = this.page.locator("[class='builder-component']");
    await dragElement.dragTo(targetElement);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Add content data
   * @param dataText - Text to add
   */
  async addContentData(dataText: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.paragraphTextBox.locator(this.textBox).fill(dataText);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add content in label
   * @param dataText - Text to add to label
   */
  async addContentInLabel(dataText: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.labelTextBox.fill(dataText);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select test product by name
   */
  async selectTestProductByName(): Promise<void> {
    const testProduct = this.productList.filter({ hasText: MtssStudentPlanTemplateBuilderPage.TEST_PRODUCT_TEXT });
    await testProduct.scrollIntoViewIfNeeded();
    await testProduct.locator(this.dropdownBtn).click();
    await this.selectAllProduct.click();
  }

  /**
   * Create tab
   * @param tabName - Name of the tab to create
   */
  async createTab(tabName: string): Promise<void> {
    await this.createTabButton.click();
    await this.tab1.fill(tabName);
  }

  /**
   * Create third tab
   * @param tabName - Name of the third tab to create
   */
  async createThirdTab(tabName: string): Promise<void> {
    await this.createTabButton.click();
    await this.thirdTab.fill(tabName);
  }

  /**
   * Add second label
   * @param labelName - Name of the second label
   */
  async addSecondLabel(labelName: string): Promise<void> {
    await this.addLabelButton.click();
    await this.addSecondLabelLocator.fill(labelName);
  }

  /**
   * Add label
   * @param labelName - Name of the label
   */
  async addLabel(labelName: string): Promise<void> {
    await this.labelButton.fill(labelName);
  }

  /**
   * Add label in select form
   * @param labelName - Name of the label
   */
  async addLabelInSelectForm(labelName: string): Promise<void> {
    await this.firstLabelValueSelectForm.fill(labelName);
  }

  /**
   * Add second label in select form
   * @param labelName - Name of the second label
   */
  async addSecondLabelInSelectForm(labelName: string): Promise<void> {
    await this.addLabelButton.click();
    await this.secondLabelValueSelectForm.fill(labelName);
  }

  /**
   * Switch tab by name
   * @param tabName - Name of the tab to switch to
   */
  async switchTabByName(tabName: string): Promise<void> {
    await this.page.locator("[ref='tabLi-tabs']").filter({ hasText: tabName }).click();
  }

  /**
   * Switch tab by name on student plan page
   * @param tabName - Name of the tab to switch to
   */
  async switchTabByNameOnStudentPlanPage(tabName: string): Promise<void> {
    await this.page.locator("[role='tab']").filter({ hasText: tabName }).click();
  }

  /**
   * Add value in text field
   * @param textValue - Value to add
   */
  async addValueInTextField(textValue: string): Promise<void> {
    const textBoxes = this.textBox;
    await textBoxes.first().click();
    await textBoxes.first().fill(textValue);
  }

  /**
   * Add value in text input
   * @param textValue - Value to add
   */
  async addValueInTextInput(textValue: string): Promise<void> {
    await this.textInput.fill(textValue);
  }

  /**
   * Get paragraph text
   * @returns Paragraph text content
   */
  async getParagraphText(): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    await this.paragraphText.waitFor({ state: 'visible' });
    return await this.paragraphText.textContent() || '';
  }

  /**
   * Get label text
   * @returns Label text content
   */
  async getLabelText(): Promise<string> {
    return await this.labelText.textContent() || '';
  }

  /**
   * Add value in text area
   * @param textValue - Value to add
   */
  async addValueInTextArea(textValue: string): Promise<void> {
    await this.textArea.fill(textValue);
  }

  /**
   * Add value in text area when single component exists
   * @param textValue - Value to add
   */
  async addValueInTextAreaWhenSingleComponentExists(textValue: string): Promise<void> {
    const textBoxes = this.textBox;
    await textBoxes.first().click();
    await textBoxes.first().fill(textValue);
  }

  /**
   * Select radio button by text
   * @param textValue - Text of the radio button to select
   */
  async selectRadioButtonByText(textValue: string): Promise<void> {
    await this.radioBtnCheckboxes.filter({ hasText: textValue }).click();
  }

  /**
   * Select value from dropdown
   * @param dropdownValue - Value to select from dropdown
   */
  async selectValueFromDropdown(dropdownValue: string): Promise<void> {
    await this.dropdownBtn.click();
    await this.dropdownOptions.filter({ hasText: dropdownValue }).click();
  }

  /**
   * Set schedule days using date picker
   * @param date - Date to set (format: YYYY-MM-DD)
   */
  async setScheduleDays(date: string): Promise<void> {
    await this.page.locator("[aria-label='Toggle Calendar']").click();
    
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear().toString();
    const day = dateObj.getDate().toString();
    
    await this.monthDropdown.selectOption(month);
    await this.yearDropdown.selectOption(year);
    
    const daySelector = `div.ngb-dp-day[aria-label*='${month}']`;
    await this.page.locator(daySelector).filter({ hasText: day }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click edit template name button
   */
  async editTemplateNameButton(): Promise<void> {
    await this.templateNameTextBox.click();
  }

  /**
   * Get sub nav tabs
   * @returns Array of tab texts
   */
  async getSubNavTabs(): Promise<string[]> {
    return await this.subNavTabs.allTextContents();
  }

  /**
   * Click save button
   */
  async clickSaveButton(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.saveButton.waitFor({ state: 'visible', timeout: 2000 });
    await this.saveButton.click();
  }

  /**
   * Click save form button
   */
  async clickSaveFormButton(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.saveFormButton.filter({ hasText: ' Save Form ' }).click();
  }

  /**
   * Check if save form button is enabled
   * @returns true if enabled, false otherwise
   */
  async isSaveFormButtonEnabled(): Promise<boolean> {
    return await this.saveFormButton.filter({ hasText: ' Save Form ' }).isEnabled();
  }

  /**
   * Click cancel button
   */
  async clickCancelButton(): Promise<void> {
    await this.cancelButton.filter({ hasText: 'Cancel' }).click();
  }

  /**
   * Click close icon
   */
  async clickCloseIcon(): Promise<void> {
    await this.closeIcon.click();
  }

  /**
   * Get value in field using JavaScript
   * @param element - Element to get value from
   * @returns Value of the element
   */
  async getValueInField(element: Locator): Promise<string> {
    return await element.evaluate((el: HTMLInputElement) => el.value) || '';
  }

  /**
   * Get value in text field
   * @returns Value in text field
   */
  async getValueInTextField(): Promise<string> {
    return await this.textInput.inputValue();
  }

  /**
   * Get value in text area
   * @returns Value in text area
   */
  async getValueInTextArea(): Promise<string> {
    return await this.textArea.textContent() || '';
  }

  /**
   * Check if radio or checkbox is selected
   * @param textValue - Text of the element to check
   * @returns true if selected, false otherwise
   */
  async isRadioOrCheckboxSelected(textValue: string): Promise<boolean> {
    const element = this.radioBtnCheckboxes.filter({ hasText: textValue });
    const inputElement = await element.locator('..').locator('input').first();
    return await inputElement.isChecked();
  }

  /**
   * Check if radio or checkbox is enabled
   * @param textValue - Text of the element to check
   * @returns true if enabled, false otherwise
   */
  async isRadioOrCheckboxIsEnabled(textValue: string): Promise<boolean> {
    const element = this.radioBtnCheckboxes.filter({ hasText: textValue });
    const inputElement = await element.locator('..').locator('input').first();
    return await inputElement.isEnabled();
  }

  /**
   * Check if dropdown option is selected
   * @param dropdownValue - Value to check
   * @returns true if selected, false otherwise
   */
  async isDropdownOptionSelected(dropdownValue: string): Promise<boolean> {
    await this.dropdownBtn.click();
    const option = this.dropdownOptions.filter({ hasText: dropdownValue });
    return await option.getAttribute('aria-selected') === 'true';
  }

  /**
   * Get inside template status
   * @returns Template status text
   */
  async getInsideTemplateStatus(): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    const statusElement = this.page.locator("div.d-flex")
      .filter({ hasText: "Plan status" })
      .locator(".mb-0.text-danger");
    return await statusElement.textContent() || '';
  }

  /**
   * Close template builder page
   */
  async closeTemplateBuilderPage(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator("button.btn.btn-secondary[title='Close']").click();
  }

  /**
   * Get template status
   * @returns Template status text
   */
  async getTemplateStatus(): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    const statusElement = this.page.locator("div[col-id='isEnabled'][role='gridcell']");
    return await statusElement.textContent() || '';
  }

  /**
   * Drag and drop component in form builder icon on tab
   * @param formBuilderIconName - Name of the icon to drag
   */
  async dragAndDropComponentInFormBuilderIconOnTab(formBuilderIconName: string): Promise<void> {
    const dragElement = this.formBuilderIconsList
      .filter({ hasText: formBuilderIconName })
      .first();
    
    await dragElement.scrollIntoViewIfNeeded();
    
    const targetElement = this.page.locator("div.card-body.tab-pane.active");
    await dragElement.dragTo(targetElement);
    await MtssHelper.waitForPageToLoad(this.page);
  }
}
