import { Page, Locator, ElementHandle } from '@playwright/test';
import MtssBasePage from './MtssBasePage';
import { capitalize } from '../../helpers/hoonuitHelper';

/**
 * Page object for MTSS Interventions page
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default class MtssMTSSInterventionsPage extends MtssBasePage {
  // Tab names
  private readonly SUB_TAB_ENROLL = "Enroll/Withdraw Reasons";
  private readonly SUB_TAB_LEVEL = "Levels";
  private readonly SUB_TAB_TYPE = "Types";
  private readonly SUB_TAB_INSTRUCTIONAL_STRATEGIES = "Student Support Resources";
  private readonly SUB_TAB_OBSERVATION_LABEL = "Observation Labels";
  private readonly SUB_TAB_MEMBER_TYPE = "Member Types";
  private readonly SUB_TAB_CHART = "Chart";
  private readonly SUB_TAB_STUDENT = "Student";

  // Button names
  private readonly ADD_NEW_BUTTON_NAME = " Add New";
  private readonly BULK_ADD_SCORES_BUTTON_NAME = " Retrieve Assessment Scores ";
  private readonly ADD_GOAL_SCORES_BUTTON = "Add Goal Scores";
  private readonly MANAGE_BUTTON_NAME = " Manage";
  private readonly SAVE_BUTTON_NAME = "Save";
  private readonly SAVE_GOAL_BUTTON_NAME = "Save Goal ";
  private readonly CREATE_NEW_BUTTON_NAME = "Create a New Plan";
  private readonly ADD_STUDENT_BUTTON_NAME = "Add Students";
  private readonly ADD_BUTTON_NAME = "Add";
  private readonly CLOSE_BUTTON_NAME = "Close";
  private readonly START_INTERVENTION_TEXT = "Start Intervention";

  // Filter items
  private readonly FILTER_ITEM_REASON_NAME = "Reason Name";
  private readonly FILTER_ITEM_LEVEL_NAME = "Level Name";
  private readonly FILTER_ITEM_INTERVENTION_TYPE = "Intervention Type";
  private readonly FILTER_ITEM_STRATEGY_TITLE = "Resource Title";
  private readonly FILTER_ITEM_DEFAULT_LABEL = "Default Label";

  // Selectors for elements
  private readonly SWITCH_TAB = 'ul.pds-tabs li';
  private readonly SWITCH_SUB_TAB = '.nav-link';
  private readonly ADD_NEW_BUTTON = '.pds-button';
  private readonly MODAL_ACTION_BUTTON = '[type="button"].pds-button';
  private readonly MANAGE_STUDENT_BUTTON = 'app-member-listing [class="pds-button"]';
  private readonly CLOSE_INSTRUCTIONAL_STRATEGY_BUTTON = '[class="pds-modal-close pds-button-round pds-button"] base-svg-icon[name="close-X"]';
  private readonly INSTRUCTIONAL_STRATEGY_TITLE_BUTTON = 'span[class="align-middle"]';
  private readonly INSTRUCTIONAL_STRATEGY_CONTENT_TEXT = '[id="displayInstructionalStrategyContent"] pds-rich-text-display';
  private readonly REASON_TYPE_DROPDOWN = '#reasonType';
  private readonly ADD_STUDENT_MEMBER_NOTES_DROPDOWN = '[bindvalue="membershipUuid"]';
  private readonly GOAL_DROPDOWN = '[bindvalue="id"]';
  private readonly DROPDOWN_OPTION = '.ng-option';
  private readonly COMPLETION_DROPDOWN = '#comClass';
  private readonly REASON_NAME_TEXTBOX = '#reasonName';
  private readonly REASON_DESCRIPTION_TEXTBOX = '#reasonDesc';
  private readonly LEVEL_NAME_TEXTBOX = '#levelName';
  private readonly LEVEL_DESCRIPTION_TEXTBOX = '#levelDesc';
  private readonly TYPE_NAME_TEXTBOX = '#interventionType';
  private readonly TYPE_DESCRIPTION_TEXTBOX = '#interventionTypeDesc';
  private readonly SUB_TYPE_TEXTBOX = '#interventionSubtype';
  private readonly TYPES_COLOR_TEXTBOX = '#interventionColor';
  private readonly OBSERVATION_LABEL_COLOR_TEXT_BOX = 'input[id="color"]';
  private readonly PLAN_TITLE_TEXTBOX = '#templateTitle';
  private readonly VISIBILITY_RADIO_BUTTON = '.custom-control-label';
  private readonly LEVEL_DROPDOWN = '#templateLevel';
  private readonly SCHOOL_DROPDOWN = '#templateSchool';
  private readonly INTERVENTION_TYPE = '#typeFilter';
  private readonly INTERVENTION_SUBTYPE = '#templateType';
  private readonly PLAN_TEMPLATE_DESCRIPTION_TEXTBOX = '#templateDescription';
  private readonly ACTIVATE_PLAN_BUTTON = '.card-title';
  private readonly PLAN_TEMPLATE_MEMBER_TYPE_BOX = '#addMemberSearch';
  private readonly INSTRUCTIONAL_STRATEGIES_TYPE_BOX = '[labelforid="addStrategySearch"] input';
  private readonly START_DATE_TEXTBOX = '[name="intStartDate"]';
  private readonly END_DATE_TEXTBOX = '[name="intEndDate"]';
  private readonly MONTH_DROPDOWN = 'select[aria-label="Select month"]';
  private readonly YEAR_DROPDOWN = 'select[aria-label="Select year"]';
  private readonly DATE_PICKER_ICON = 'button.btn-primary';
  private readonly NOTIFICATION_DIALOG = 'div.ui-pnotify-text';
  private readonly EDIT_ICON = 'button[aria-label="Edit/View"]';
  private readonly MULTITENANT_EDIT_ICON = '[name="edit"]';
  private readonly PLAN_STATUS_TEXT = 'span.pl-2';
  private readonly DELETE_ICON = '[name="trash"]';
  private readonly INTERVENTION_HEADER_LABEL = 'h1.pds-page-text-primary';
  private readonly FILTER_PLANS_BUTTON = 'button[aria-label="Filter Plans"]';
  private readonly INTERVENTION_PLAN_TEXT = '.font-weight-normal';
  private readonly HIDDEN_STUDENTS_TEXT = 'span[class="small"]';
  private readonly INTERVENTION_STATUS_TEXT = '.activeColor';
  private readonly INTERVENTION_STUDENT_NAME_TEXT = '.ml-2.text-truncate';
  private readonly INTERVENTION_NOTES_TEXT_AREA = 'textarea[aria-label="add-note-textarea"]';
  private readonly INTERVENTION_NOTES_ADD_BUTTON = '#addNoteButton';
  private readonly STUDENT_NAME_TEXT = '[class="ml-3 d-none d-sm-block"]';
  private readonly ADD_STUDENT_BUTTON = '[btntext="Add Students"] button';
  
  public previousDay: string = '';

  /**
   * Constructor
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Returns the page title
   */
  protected pageTitle(): string {
    return "MTSS Interventions";
  }

  /**
   * Switch to a tab by name
   * @param tab - Tab name to switch to
   */
  public async switchTab(tab: string): Promise<void> {
    const tabs = this.page.locator(this.SWITCH_TAB);
    const targetTab = tabs.filter({ hasText: tab }).last();
    await targetTab.click();
    
    // Wait for page to load and stabilize
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to a sub-tab by name
   * @param subTab - Sub-tab name to switch to
   */
  private async switchSubTab(subTab: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    const subTabs = this.page.locator(this.SWITCH_SUB_TAB);
    const targetSubTab = subTabs.filter({ hasText: subTab }).first();
    await targetSubTab.waitFor({ state: 'visible' });
    await targetSubTab.click();
  }

  /**
   * Check if a sub-tab is displayed
   * @param subTab - Sub-tab name to check
   */
  public async isSubTabDisplayed(subTab: string): Promise<boolean> {
    const subTabs = this.page.locator(this.SWITCH_SUB_TAB);
    const count = await subTabs.count();
    
    for (let i = 0; i < count; i++) {
      const text = await subTabs.nth(i).innerText();
      if (text.includes(subTab)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Switch to the Settings Enroll tab
   */
  public async switchSettingsEnrollTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_ENROLL);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to the Settings Level tab
   */
  public async switchSettingsLevelTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_LEVEL);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to the Settings Types tab
   */
  public async switchSettingsTypesTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_TYPE);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to the Settings Instructional Strategies tab
   */
  public async switchSettingsInstructionalStrategiesTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_INSTRUCTIONAL_STRATEGIES);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to the Settings Observation Labels tab
   */
  public async switchSettingsObservationLabelsTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_OBSERVATION_LABEL);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to the Settings Member tab
   */
  public async switchSettingsMemberTab(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.switchSubTab(this.SUB_TAB_MEMBER_TYPE);
  }

  /**
   * Switch to the Chart tab
   */
  public async switchChartTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_CHART);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to the Student tab
   */
  public async switchStudentTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_STUDENT);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click the Add New button
   */
  public async clickAddNewButton(): Promise<void> {
    const addNewButtons = this.page.locator(this.ADD_NEW_BUTTON);
    const targetButton = addNewButtons.filter({ hasText: this.ADD_NEW_BUTTON_NAME }).first();
    await targetButton.click();
  }

  /**
   * Select a reason type from dropdown
   * @param input - Reason type to select
   */
  public async selectReasonType(input: string): Promise<void> {
    await this.page.locator(this.REASON_TYPE_DROPDOWN).click();
    const options = this.page.locator(this.DROPDOWN_OPTION);
    const targetOption = options.filter({ hasText: input }).first();
    await targetOption.click();
  }

  /**
   * Set reason name
   * @param input - Reason name to set
   */
  public async setReasonName(input: string): Promise<void> {
    await this.page.locator(this.REASON_NAME_TEXTBOX).fill(input);
  }

  /**
   * Set reason description
   * @param input - Reason description to set
   */
  public async setReasonDescription(input: string): Promise<void> {
    await this.page.locator(this.REASON_DESCRIPTION_TEXTBOX).fill(input);
  }

  /**
   * Click the Save button
   */
  public async clickSaveButton(): Promise<void> {
    const saveButtons = this.page.locator(this.ADD_NEW_BUTTON);
    const targetButton = saveButtons.filter({ hasText: this.SAVE_BUTTON_NAME }).first();
    await targetButton.click();
  }

  /**
   * Get success message text
   */
  public async getSuccessfulMessage(): Promise<string> {
    const message = this.page.locator(this.NOTIFICATION_DIALOG);
    await message.waitFor({ state: 'visible' });
    return await message.innerText();
  }

  /**
   * Set level name
   * @param input - Level name to set
   */
  public async setLevelName(input: string): Promise<void> {
    await this.page.locator(this.LEVEL_NAME_TEXTBOX).fill(input);
  }

  /**
   * Set level description
   * @param input - Level description to set
   */
  public async setLevelDescription(input: string): Promise<void> {
    await this.page.locator(this.LEVEL_DESCRIPTION_TEXTBOX).fill(input);
  }

  /**
   * Set type name
   * @param input - Type name to set
   */
  public async setTypeName(input: string): Promise<void> {
    await this.page.locator(this.TYPE_NAME_TEXTBOX).fill(input);
  }

  /**
   * Set type description
   * @param input - Type description to set
   */
  public async setTypeDescription(input: string): Promise<void> {
    await this.page.locator(this.TYPE_DESCRIPTION_TEXTBOX).fill(input);
  }

  /**
   * Set sub type
   * @param input - Sub type to set
   */
  public async setSubType(input: string): Promise<void> {
    await this.page.locator(this.SUB_TYPE_TEXTBOX).fill(input);
  }

  /**
   * Set type color
   * @param input - Type color to set
   */
  public async setTypeColor(input: string): Promise<void> {
    await this.page.locator(this.TYPES_COLOR_TEXTBOX).fill(input);
  }

  /**
   * Set plan title
   * @param input - Plan title to set
   */
  public async setPlanTitle(input: string): Promise<void> {
    await this.page.locator(this.PLAN_TITLE_TEXTBOX).fill(input);
  }

  /**
   * Get plan status
   */
  public async getPlanStatus(): Promise<string> {
    const status = this.page.locator(this.PLAN_STATUS_TEXT);
    await status.waitFor({ state: 'visible' });
    return (await status.innerText()).trim();
  }

  /**
   * Set a radio button option
   * @param value - Radio button label to select
   */
  public async setRadioButton(value: string): Promise<void> {
    const radioButtons = this.page.locator(this.VISIBILITY_RADIO_BUTTON);
    const targetRadio = radioButtons.filter({ hasText: value }).first();
    await targetRadio.click();
  }

  /**
   * Set level from dropdown
   * @param memberType - Level to select
   */
  public async setLevelDropDown(memberType: string): Promise<void> {
    await this.page.locator(this.LEVEL_DROPDOWN).click();
    const options = this.page.locator(this.DROPDOWN_OPTION);
    const targetOption = options.filter({ hasText: memberType }).first();
    await targetOption.click();
  }

  /**
   * Select intervention type from dropdown
   * @param type - Intervention type to select
   */
  public async selectInterventionType(type: string): Promise<void> {
    await this.page.locator(this.INTERVENTION_TYPE).click();
    const options = this.page.locator(this.DROPDOWN_OPTION);
    const targetOption = options.filter({ hasText: type }).first();
    await targetOption.click();
  }

  /**
   * Click the Add Student button
   */
  public async clickAddStudentButton(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    const addStudentButton = this.page.locator(this.ADD_STUDENT_BUTTON);
    await addStudentButton.waitFor({ state: 'visible' });
    await addStudentButton.waitFor({ state: 'enabled' });
    await addStudentButton.click();
  }

  /**
   * Set student name 
   * @param studentName - Student name to set
   */
  public async setStudentName(studentName: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.PLAN_TEMPLATE_MEMBER_TYPE_BOX).fill(studentName);
    const options = this.page.locator(this.DROPDOWN_OPTION);
    const targetOption = options.filter({ hasText: studentName }).first();
    await targetOption.click();
  }

  /**
   * Click the Manage Student button
   */
  public async clickManageStudentButton(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    const manageStudentButton = this.page.locator(this.MANAGE_STUDENT_BUTTON);
    await manageStudentButton.waitFor({ state: 'enabled' });
    await manageStudentButton.click();
  }

  /**
   * Set notes and link them to a student
   * @param notes - Notes content
   * @param studentName - Student name to link notes to
   */
  public async setNotesAndLinkToStudent(notes: string, studentName: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    
    // Click add notes button
    const addNotesButton = this.page.locator(this.INTERVENTION_NOTES_ADD_BUTTON);
    await addNotesButton.waitFor({ state: 'visible' });
    await addNotesButton.click();
    
    // Enter notes text
    const notesTextarea = this.page.locator(this.INTERVENTION_NOTES_TEXT_AREA);
    await notesTextarea.waitFor({ state: 'visible' });
    await notesTextarea.fill(notes);
    
    // Select student from dropdown
    await this.page.locator(this.ADD_STUDENT_MEMBER_NOTES_DROPDOWN).click();
    const options = this.page.locator(this.DROPDOWN_OPTION);
    const targetOption = options.filter({ hasText: studentName }).first();
    await targetOption.click();
    
    // Click Post button
    const postButton = this.page.locator(this.ADD_NEW_BUTTON).filter({ hasText: 'Post' }).first();
    await postButton.click();
  }
  
  /**
   * Get student name text
   */
  public async getStudentName(): Promise<string> {
    const studentName = this.page.locator(this.INTERVENTION_STUDENT_NAME_TEXT);
    await studentName.waitFor({ state: 'visible' });
    return (await studentName.innerText()).trim();
  }

  /**
   * Check if an intervention is available by name
   * @param interventionName - Intervention name to check for
   */
  public async isInterventionAvailableByName(interventionName: string): Promise<boolean> {
    const headerElements = this.page.locator('[class="pds-panel-header"]');
    const targetHeader = headerElements.filter({ hasText: interventionName }).first();
    return await targetHeader.isVisible();
  }
}