/**
 * Playwright/TypeScript version of MtssMTSSInterventionsPage (converted from Java)
 * Comprehensive page object for MTSS Interventions functionality with Playwright
 *
 * @author Converted from Java to TypeScript/Playwright
 * @since 2025
 */
import { Page, Locator, expect } from '@playwright/test';
import { MtssBasePage } from './MtssBasePage';
import { MtssHelper } from '../../helpers/MtssHelper';

export class MtssMTSSInterventionsPage extends MtssBasePage {
  // CSS Selectors - converted from Java static final fields
  private static readonly SWITCH_TAB = 'ul.pds-tabs li';
  private static readonly SWITCH_SUB_TAB = '.nav-link';
  private static readonly ADD_NEW_BUTTON = '.pds-button';
  private static readonly NEON_COMPONENT = '.neon-0_11_1-button-primary';
  private static readonly ADD_NEW_BUTTON_ENROLL_WITHDRAW_REASON_BUTTON = '#button-add-new-enroll-withdraw-reason';
  private static readonly ADD_NEW_BUTTON_LEVEL_BUTTON = '#button-add-new-intervention-level';
  private static readonly ADD_NEW_BUTTON_TYPE_BUTTON = '#button-add-new-intervention-type';
  private static readonly ADD_NEW_BUTTON_INSTRUCTIONAL_STRATEGY_BUTTON = '#button-add-new-instructional-stragety';
  private static readonly ADD_NEW_GOAL_BUTTON = '#button-create-new-template-button';
  private static readonly SAVE_GOAL_BUTTON = '#button-save-goal';
  private static readonly ADD_REASON_TYPE_BUTTON = '#button-add-edit-save';
  private static readonly CREATE_NEW_INTERVENTION_PLAN_BUTTON = '#create-new-template-button';
  private static readonly SAVE_AFTER_EDIT_BUTTON = '#button-footer-end-button-save';
  private static readonly SAVE_RESOURCE_BUTTON_AFTER_EDIT = '#add-edit-save';
  private static readonly DELETE_STUDENT_1 = '[id="user-info-0"]';
  private static readonly DELETE_STUDENT_2 = '[id="user-info-1"]';
  private static readonly LINK_TEXT = '[class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable  neon-rte"] p a';
  private static readonly SAVE_INTERVENTION_PLAN_BUTTON = '[class="pds-button pds-primary"][type="button"]';
  private static readonly ADD_STUDENT_BUTTON = '#button-add-member-button';
  private static readonly SAVE_2_GOAL = '[id="save-goal"]';
  private static readonly ADD_GOAL_TARGET_2 = '#input-field-goalTarget1';
  private static readonly ADD_GOAL_OBJECTIVE_2 = '#input-field-goalObjective1';
  private static readonly ALPHA_SCORE_TYPE_2 = '#alphoa-option1';
  private static readonly ADD_GOAL_NAME_2 = '#input-field-goalName1';
  private static readonly SCHEDULE_TAB_BUTTON = '[for="tab-group-1-tab-schedule"]';
  private static readonly RESOURCE_TAB_BUTTON = '[for="tab-group-1-tab-resource"]';
  private static readonly REASON_TYPE_DROPDOWN = '#reason-type-select';
  private static readonly DROPDOWN_OPTION = '[class="ng-option-label"]';
  private static readonly SCHOOL_NAME_SELECT = '#option_130';
  private static readonly REASON_NAME_TEXT_BOX = '#input-field-overview-student-name';
  private static readonly REASON_TYPE_DROPDOWN_OPTION = '#input-field-reason-type-select';
  private static readonly COMPLETION_DROPDOWN = '#completion-class-select';
  private static readonly COMPLETION_DROPDOWN_OPTION = '#input-field-completion-class-select';
  private static readonly REASON_DESCRIPTION_TEXT_BOX = '#input-field-reason-description';
  private static readonly PRESENT_RADIO_MASS_UPDATE = '#present';
  private static readonly BULK_UPDATE_BUTTON = '#button-button-bulk-update';
  private static readonly SET_ATTENDANCE_BUTTON = '#button-attendance-set-attendance';
  private static readonly ATTENDED_MINUTES_TEXT_BOX = 'input[id="input-field-attendance-minutes"]';
  private static readonly TIME_ATTENDED_BUTTON = '#button-attendance-add-time-attended';
  private static readonly OBSERVATION_2 = '#observation-2';
  private static readonly NOTES_TEXT = '[class="row no-gutters"] .col-12 p';
  private static readonly SUB_TEXT = 'span[class="neon-tag-subtext"]';
  private static readonly END_DATE = '#endDate-button';
  private static readonly SELECT = 'select';
  private static readonly LEVEL_NAME_TEXT_BOX = '#input-field-level-name';
  private static readonly LEVEL_DESCRIPTION_TEXT_BOX = '#input-field-level-description';
  private static readonly TYPE_NAME_TEXT_BOX = '#input-field-intervention-type-select';
  private static readonly TYPE_DESCRIPTION_TEXT_BOX = '#input-field-intervention-type-description';
  private static readonly SUB_TYPE_TEXT_BOX = '#input-field-intervention-subtype-select';
  private static readonly TYPES_COLOR_TEXT_BOX = '#interventionColor';
  private static readonly PLAN_TITLE_TEXT_BOX = '#input-field-templateTitle';
  private static readonly VISIBILITY_RADIO_BUTTON = '[for="radio-scheduled-option"]';
  private static readonly VISIBILITY_RADIO_UNTIMED_BUTTON = '[for="radio-untimed-option"]';
  private static readonly LEVEL_DROPDOWN = '#input-field-level-select';
  private static readonly LEVEL_DROPDOWN_VALUE_SELECT = '[id="input-field-level-select"] option';
  private static readonly OBSERVATION_COUNT = 'span[class="neon-tag-text"]';
  private static readonly SCHOOL_SELECT_CHECKBOX = '#schoolSelect-main-button';
  private static readonly INTERVENTION_TYPE = '#input-field-type-select';
  private static readonly INTERVENTION_TYPE_DROPDOWN_OPTION = '[id="input-field-type-select"] option';
  private static readonly INTERVENTION_SUBTYPE = '#input-field-subtype-select';
  private static readonly INTERVENTION_SUBTYPE_DROPDOWN_OPTION = '[id="input-field-subtype-select"] option';
  private static readonly PLAN_TEMPLATE_DESCRIPTION_TEXT_BOX = '#input-field-templateDescription';
  private static readonly ACTIVATE_PLAN_BUTTON = '#activate-id-for-specific-thihg';
  private static readonly EDIT_PLAN_BUTTON = '#edit-id-for-specific-thing';
  private static readonly DELETE_PLAN_BUTTON = '#delete-id-for-specific-thing';
  private static readonly DELETE_DIALOG_BUTTON = '#delete-setting-delete';
  private static readonly PLAN_TEMPLATE_MEMBER_TYPE_BOX = '#addMemberSearch';
  private static readonly STUDENT_SUPPORT_RESOURCE_DROP_DOWN_BUTTON = '#addInstructionalStrategySearch';
  private static readonly STUDENT_SUPPORT_RESOURCE_TEXT_BOX = '#add-strategy-button';
  private static readonly ADD_RESOURCE_BUTTON = '#button-add-strategy-button';
  private static readonly PLAN_URL_TEXT_BOX = '.se-input-form.se-input-url';
  private static readonly MONTH_DROPDOWN = 'select[aria-label="Select month"]';
  private static readonly YEAR_DROPDOWN = 'select[aria-label="Select year"]';
  private static readonly MTSS_NOTIFICATION_DIALOG = 'div.ui-pnotify-text';
  private static readonly GOAL_SAVE_CONFIRMATION_TEXT = 'p';
  private static readonly THREE_DOTS_BUTTON = '[data-text="show options"]';
  private static readonly INTERVENTION_PLAN_LENGTH = '[class="font-size-4 neon-color-gray-500 font-weight-600"]';
  private static readonly STUDENT_SUPPORT_RESOURCE_SUBMIT_BUTTON = '.se-btn-primary';
  private static readonly INTERVENTION_PLAN_DESCRIPTION = '[class="neon-color-gray-700"]';
  private static readonly INTERVENTION_SUBTYPE_TEXT = '[class="neon-tag-subtext"]';
  private static readonly ADDED_STUDENT_SUPPORT_RESOURCE_TEXT = '#name-link-button-0';
  private static readonly STUDENT_SUPPORT_RESOURCE_TOGGLE_BUTTON = '#public-resource';
  private static readonly INTERVENTION_PLAN_NAME = '[class="d-inline-block intervention-title"]';
  private static readonly OBSERVATION_TAB = '[for="intervention-overview-tab-intervention-observations"]';
  private static readonly ATTENDANCE_TAB = '[for="intervention-overview-tab-intervention-attendance"]';
  private static readonly GOALS_TAB = '[for="intervention-overview-tab-intervention-goals"]';
  private static readonly BACK_ARROW_NOTES_SCREEN = '#button-layout-detail-back-button-noteComponent';
  private static readonly BACK_ARROW_INTERVENTION_DETAIL = '#button-layout-detail-back-button-DetailLayout';
  private static readonly BACK_ARROW_MANAGE_INTERVENTION = '#button-layout-detail-back-button-addManageTemplate';
  private static readonly MINUTES_INPUT_TEXT_BOX = '#input-field-minInput-0';
  private static readonly SECOND_MINUTES_INPUT_TEXT_BOX = '#input-field-minInput-1';
  private static readonly THIRD_MINUTES_INPUT_TEXT_BOX = '#input-field-minInput-2';
  private static readonly FOURTH_MINUTES_INPUT_TEXT_BOX = '#input-field-minInput-3';
  private static readonly ATTENDANCE_SELECTION_CHECK_MARK = '[id="button-attendance-on-time-0"]';
  private static readonly PRESENT_ATTENDANCE_SELECTION_CHECK_MARK = '[data-text="On Time"]';
  private static readonly ADD_A_NOTE_BUTTON = '[data-icon="chevron-right"]';
  private static readonly ADD_NOTE_BUTTON = '#addNoteButton';
  private static readonly SAVE_NOTE_BUTTON = '#saveButtonNoteAdd';
  private static readonly NOTES_AREA_TEXT = '.se-wrapper-inner.se-wrapper-wysiwyg.sun-editor-editable.neon-rte';
  private static readonly ADD_MASS_UPDATE_GOAL_SCORES = '#button-add-goals-multi-submit';
  private static readonly SELECT_GOAL_FROM_MODAL = '[id="input-field-multi-measurement-save-goal"] option';
  private static readonly MASS_UPDATE_GOAL_BUTTON = '#button-goals-add-scores';
  private static readonly SELECT_STUDENT_NOTE = '#input-field-studentSelectNote';
  private static readonly PUBLIC_RADIO_BUTTON = '[for="radio-publicOption"]';
  private static readonly NOTES_COUNT = '[class="activity-card__heading"]';
  private static readonly DAY_SELECT_BUTTON = 'tbody tr td [type="button"]';
  private static readonly START_DATE_BUTTON = '#startDate-button';
  private static readonly FILTER_SEARCH_BOX = 'input[placeholder="Search"]';
  private static readonly FILTER_SELECT_CHECKBOX = 'div.pds-label-text';
  private static readonly FILTER_REASON_TEXT_BOX = '[aria-label="Reason Name Filter Input"]';
  private static readonly FILTER_LEVEL_TEXT_BOX = '[aria-label="Level Name Filter Input"]';
  private static readonly FILTER_TYPE_TEXT_BOX = '[aria-label="Intervention Type Filter Input"]';
  private static readonly FILTER_LEVEL_NAME = 'div[col-id="levelName"]';
  private static readonly FILTER_TYPE_NAME = 'div[col-id="interventionType"]';
  private static readonly FILTER_REASON_NAME = 'div[col-id="reasonName"]';
  private static readonly FILTER_RESOURCE_NAME = 'div[col-id="strategyTitle"]';
  private static readonly INTERVENTION_HEADER_LABEL = '.template-name';
  private static readonly DELETE_ICON = '[name="trash"]';
  private static readonly SET_OBSERVATION_BUTTON = '[class="neon-button-group neon-button-group-no-padding mtss-observations-bar"]';
  private static readonly INTERVENTION_NAME_DROPDOWN_BUTTON = 'button[aria-label="Plan Titles"]';
  private static readonly FILTER_PLANS_BUTTON = 'button[aria-label="Filter Plans"]';
  private static readonly FILTER_BUTTON = '#filter-button';
  private static readonly PLAN_URL_TEXT = '.se-input-form._se_anchor_text';
  private static readonly RETRIEVE_SCORE_BUTTON = '[id="button-retrieve-submit"] span';
  private static readonly INTERVENTION_STATUS_DROPDOWN = '[id="input-field-change-current-intervention-status"] option';
  private static readonly NEW_INTERVENTION_DROPDOWN = '[id="input-field-change-new-intervention-status-select"] option';
  private static readonly INTERVENTION_NAME_DROPDOWN = '[id="input-field-change-intervention-select"] option';
  private static readonly INTERVENTION_DETAIL_PAGE_PILL_TEXT = '[class="neon-tag-text"]';
  private static readonly DELETE_GOAL_BUTTON = '#delete-goal';
  private static readonly DELETE_RESOURCE_IN_PLAN_BUTTON = '#delete-strategy-id-0';
  private static readonly USE_THIS_PLAN = '[data-text="Use This Plan"]';
  private static readonly STRATEGY_TITLE = '#input-field-resource-title';
  private static readonly REVIEW_PLAN_DETAILS_BUTTON = '[data-text="Review Plan Details"]';
  private static readonly STRATEGY_CONTENT_LINK = 'button[aria-label="Link"]';
  private static readonly STRATEGY_CONTENT_TEXT_BOX = '[class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable  neon-rte"] p';
  private static readonly STRATEGY_PROVIDER_FILTER_TEXT_BOX = '[aria-label="Resource Title Filter Input"]';
  private static readonly GOAL_NAME = '#input-field-goalName0';
  private static readonly GOAL_OBJECTIVE = '#input-field-goalObjective0';
  private static readonly GOAL_TARGET = '#input-field-goalTarget0';
  private static readonly ALPHA_SCORE_GOAL_TYPE = '#alphoa-option0';
  private static readonly NUMERIC_SCORE_GOAL_TYPE = '#numeric-option0';
  private static readonly INTERVENTION_PLAN_PURPOSE_TEXT_EDITOR = '[id="suneditor_neon-rte-purposeText"] div [class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable   neon-rte"]';
  private static readonly INTERVENTION_PLAN_MESSAGE_TEXT_EDITOR = '[id="suneditor_neon-rte-templatePlanDescription"] div [class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable   neon-rte"]';
  private static readonly INTERVENTION_PLAN_OUTCOME_TARGET_TEXT_EDITOR = '[id="suneditor_neon-rte-templateOutcomeTarget"] div [class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable   neon-rte"]';
  private static readonly INTERVENTION_PLAN_NAME_SEARCH_BOX = '[id="input-field-plan-name"][aria-label="Search by plan title"]';
  private static readonly INTERVENTION_NAME_SEARCH_BOX = '#input-field-filter-name';
  private static readonly DELETE_INTERVENTION_BUTTON = '#button-footer-start-button-delete';
  private static readonly DELETE_CONFIRMATION_BUTTON = '#button-dialog-confirm';
  private static readonly INACTIVE_FILTER_CHECKBOX = '#inactiveID';
  private static readonly STRATEGY_TYPE = '#input-field-resource-type';
  private static readonly NUMERIC_SCORE_SCORE_LIST_POINT = '.highcharts-point.highcharts-color-0';
  private static readonly DELETE = '[aria-label="delete"]';
  private static readonly ATTENDANCE_RATE = '[data-heading="Attendance"] [class="gauge__content pr-4 pl-4"] div';
  private static readonly OBSERVATION_LABEL_EDIT_BUTTON = '#button-observational-labels-button-0';
  private static readonly OBSERVATION_LABEL_COLOR_LIST = '[class="color-circle"]';
  private static readonly OBSERVATION_LABEL_ENGAGED = '#input-field-label-input-0';
  private static readonly OBSERVATION_LABEL_DEFAULT_TEXT = '[class="neon-input-field-first"]';
  private static readonly EDIT_BUTTON = '#button-edit-button';
  private static readonly DELETE_BUTTON = '#button-delete-button';
  private static readonly OBSERVATION_BUTTON_NEUTRAL = '[id="observation-neutral-0"]';
  private static readonly NEUTRAL_OBSERVATION_1 = '[id="button-observation-neutral-0"]';
  private static readonly NEUTRAL_OBSERVATION_2 = '[id="button-observation-neutral-1"]';
  private static readonly NEUTRAL_OBSERVATION_3 = '[id="button-observation-neutral-2"]';
  private static readonly NEUTRAL_OBSERVATION_4 = '[id="button-observation-neutral-3"]';
  private static readonly REMOVE_PRESENT_ATTENDANCE_BUTTON = '[aria-label="On Time"]';
  private static readonly TOTAL_MINUTES_TEXT = '[class="d-inline-flex gap-16"] div';
  private static readonly SCORE = '[class="overflow-wrap-anywhere"]';
  private static readonly STUDENT_SUPPORT_RESOURCE_TEXT = '.section-header';
  private static readonly EDIT_WEEKS = '#input-field-templateWeeks';
  private static readonly EDIT_MEETINGS = '#input-field-templateMeetings';
  private static readonly EDIT_MEETING_DURATION = '#input-field-meetingDuration';
  private static readonly STUDENT_NAME_FILTER_CHART = '[data-icon="close"]';
  private static readonly BUTTON_TEXT_LINK = '.se-wrapper-inner.se-wrapper-wysiwyg.sun-editor-editable.neon-rte P';
  private static readonly NUMERIC_CHART_HOVER_POINT = '[id="chart-container"] [class="highcharts-series-group"] g.highcharts-tracker';
  private static readonly THREE_DOTS_STUDENT_OVERVIEW_CARD = '[data-slot="popper-trigger"] [aria-label="wontshow"]';
  private static readonly STUDENT_NAME_SCORE_WISE = '[class="w-100"] tbody tr th';
  private static readonly PLAN_PURPOSE_LINK_BUTTON = '[id="suneditor_neon-rte-purposeText"] [aria-label="Link"]';
  private static readonly PLAN_OUTCOME_TARGET_LINK_BUTTON = '[id="suneditor_neon-rte-templateOutcomeTarget"] [aria-label="Link"]';
  private static readonly PLAN_PURPOSE_IMAGE_BUTTON = '[id="suneditor_neon-rte-purposeText"] [aria-label="Image"]';
  private static readonly STUDENT_SUPPORT_RESOURCE_TEXT_BOXX = '.se-dialog-form';
  private static readonly SAVE_AND_CLOSE_BUTTON = '#button-footer-end-button-pending';
  private static readonly TARGET_SCORE_TEXT = '[class="inline-block"]';
  private static readonly INTERVENTION_DATE_DETAILS = '.schedule-data';
  private static readonly USE_THIS_PLAN_BUTTON = '[class="align-items-center d-flex mb-1"] h2';
  private static readonly ALPHA_NUMERIC_SCORE_HOVER_TEXT = '[class="highcharts-label highcharts-tooltip highcharts-color-undefined"] text';
  private static readonly GOAL_NAME_DROPDOWN = '[id="input-field-retrieve-goal-picker"] option';
  private static readonly PLAN_DESCRIPTION = '[id="suneditor_neon-rte-templatePlanDescription"]';
  private static readonly PLAN_IMAGE_BUTTON = 'button[aria-label="Image"]';
  private static readonly OBSERVATION_BUTTON = '.intervention-detail-observation-label';
  private static readonly MANAGE_INTERVENTION_BUTTON = '#button-manageInterventionButton';
  private static readonly PLAN_DESCRIPTION_TEXT = '[class="intervention-card__name pl-4"]';
  private static readonly IMAGE_URL_BUTTON = '[id="suneditor_neon-rte-templateOutcomeTarget"] [aria-label="Image"]';
  private static readonly IMAGE_URL_TEXT_BOX = '.se-input-form.se-input-url._se_image_url';
  private static readonly SUBMIT_BUTTON = 'button[title="Submit"]';
  private static readonly CALENDAR_DATE_IN_USE_TOOLTIP = '[class="tooltip fade show bs-tooltip-top"]';
  private static readonly SAVE_UPDATES_BUTTON = '[data-text="Save updates"]';
  private static readonly SCHOOL_YEAR = '[id="input-field-filter_0"] option';
  private static readonly ASSESSMENT_SOURCE = '[id="input-field-filter_1"] option';
  private static readonly ASSESSMENT_SUBJECT = '[id="input-field-filter_2"] option';
  private static readonly ASSESSMENT_NAME = '[id="input-field-filter_3"] option';
  private static readonly SCORE_TYPE = '[id="input-field-filter_4"] option';
  private static readonly UPDATE_STATUS_BUTTON = '[data-text="Update status"]';
  private static readonly USER_INFO = '[class="user-info"]';
  private static readonly ATTENDANCE_CHART = '[data-heading="Meeting Completion"] h3';
  private static readonly GOAL_INPUT_TEXT_BOX = 'input[class="neon-input-field-first"][aria-label="none"]';
  private static readonly SELECT_ALL_STUDENT_CHECK_BOX = '[for="checkbox-attendance-select-all"]';
  private static readonly COMPARE_STUDENTS_BUTTON = '[data-text="Compare Students"]';
  private static readonly RETRIEVE_SCORES_BUTTON = '[data-text="Retrieve Scores"]';
  private static readonly BACK_BUTTON_ON_COMPARE_SCREEN = '#button-layout-detail-back-button-CompareStudentsLayout';
  private static readonly GOAL_SELECT = '[id="input-field-goal-select"] option';
  private static readonly SET_OBSERVATIONS = '#button-observations-set-observations';
  private static readonly INTERVENTION_NAME_TEXT_BOX = '#input-field-intervention-name';
  private static readonly MASS_UPDATE_GOAL_INPUT_TEXT_BOX = 'input[id*="input-field-goal-multi-input-"]';
  private static readonly DATE_SELECTION_ICON = '[id="input-field-empty-select-id"] option';
  private static readonly SELECT_ALL_STUDENTS_ON_GOALS_TAB = '[for="checkbox-goals-select-all"]';
  private static readonly ALPHA_CHART_SCORE_POINT_HOVER = '.highcharts-point.highcharts-partfill-original';
  private static readonly NUMERIC_CHART_SCORE_TEXT = '.highcharts-label.highcharts-tooltip text';
  private static readonly CHART_POINT_SCORE_VALUE = 'text tspan [class="highchart-percent-bar-label"]';
  private static readonly OBSERVATION_CHART_TAB = '[for="chart-types-tab-observations-chart-type"]';
  private static readonly ATTENDANCE_CHART_TAB = '[for="chart-types-tab-attendance-chart-type"]';
  private static readonly CHART_PERCENTAGE = '[data-heading="Attendance"] dt';
  private static readonly SAVE_LABELS_BUTTON = '[data-text="Save Labels"]';
  private static readonly RETRIEVE_DATA_BUTTON = '#button-goals-retrieve-data';
  private static readonly CLICK_ON_GOAL = '#input-field-retrieve-goal-picker';
  private static readonly SELECT_VALUE_FROM_DROPDOWN = 'button[id*="neon-popper-button"]';
  private static readonly CLICK_ON_DATATYPE = '#input-field-retrieve-select-data-type-picker';
  private static readonly CLICK_ON_BEHAVIORTYPE = '#input-field-retrieve-behavior-type-picker';
  private static readonly SELECT_ACTIONTYPE_INCIDENTTYPE = '#filter-button';
  private static readonly SELECT_FILTER_FROM_DROPDOWN = '.list-item-btn-label';
  private static readonly SELECT_FROM_SUBDASHBOARD = '.pds-label-text';
  private static readonly SELECTALL_FROM_DROPDOWN = '#primartSelectAll';

  // String constants - converted from Java
  private static readonly SUB_TAB_ENROLL = 'Enroll/Withdraw Reasons';
  private static readonly SUB_TAB_LEVEL = 'Levels';
  private static readonly SUB_TAB_TYPE = 'Intervention Types';
  private static readonly SUB_TAB_INSTRUCTIONAL_STRATEGIES = 'Student Support Resources';
  private static readonly SUB_TAB_OBSERVATION_LABEL = 'Observation Labels';
  private static readonly SUB_TAB_MEMBER_TYPE = 'Member Types';
  private static readonly SAVE_BUTTON_NAME = 'Save';
  private static readonly START_INTERVENTION_TEXT = 'Start Intervention';

  // Instance variable for date tracking
  public previousDay: string = '';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Returns the expected page title for validation
   * @returns The page title string
   */
  protected pageTitle(): string | null {
    return 'MTSS Interventions';
  }

  /**
   * Switch to a specific tab by tab name
   * Converts Java switchTab() method
   * @param tab The tab name to switch to
   */
  async switchTab(tab: string): Promise<void> {
    const tabElements = this.page.locator(MtssMTSSInterventionsPage.SWITCH_TAB);
    await tabElements.filter({ hasText: tab }).last().click();
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Switch to a specific sub-tab by sub-tab name
   * Converts Java switchSubTab() method
   * @param subTab The sub-tab name to switch to
   */
  private async switchSubTab(subTab: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const subTabElements = this.page.locator(MtssMTSSInterventionsPage.SWITCH_SUB_TAB);
    await subTabElements.filter({ hasText: subTab }).first().waitFor({ state: 'visible' });
    await subTabElements.filter({ hasText: subTab }).first().click();
  }

  /**
   * Check if a sub-tab is displayed
   * Converts Java isSubTabDisplayed() method
   * @param subTab The sub-tab name to check
   * @returns true if the sub-tab is displayed
   */
  async isSubTabDisplayed(subTab: string): Promise<boolean> {
    const subTabElements = this.page.locator(MtssMTSSInterventionsPage.SWITCH_SUB_TAB);
    const matchingTab = subTabElements.filter({ hasText: subTab });
    return await matchingTab.count() > 0;
  }

  /**
   * Switch to the Settings Enroll tab
   * Converts Java switchSettingsEnrollTab() method
   */
  async switchSettingsEnrollTab(): Promise<void> {
    await this.switchSubTab(MtssMTSSInterventionsPage.SUB_TAB_ENROLL);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Switch to the Settings Level tab
   * Converts Java switchSettingsLevelTab() method
   */
  async switchSettingsLevelTab(): Promise<void> {
    await this.switchSubTab(MtssMTSSInterventionsPage.SUB_TAB_LEVEL);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Switch to the Settings Types tab
   * Converts Java switchSettingsTypesTab() method
   */
  async switchSettingsTypesTab(): Promise<void> {
    await this.switchSubTab(MtssMTSSInterventionsPage.SUB_TAB_TYPE);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Switch to the Settings Instructional Strategies tab
   * Converts Java switchSettingsInstructionalStrategiesTab() method
   */
  async switchSettingsInstructionalStrategiesTab(): Promise<void> {
    await this.switchSubTab(MtssMTSSInterventionsPage.SUB_TAB_INSTRUCTIONAL_STRATEGIES);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Switch to the Settings Observation Labels tab
   * Converts Java switchSettingsObservationLabelsTab() method
   */
  async switchSettingsObservationLabelsTab(): Promise<void> {
    await this.switchSubTab(MtssMTSSInterventionsPage.SUB_TAB_OBSERVATION_LABEL);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Switch to the Settings Member tab
   * Converts Java switchSettingsMemberTab() method
   */
  async switchSettingsMemberTab(): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    await this.switchSubTab(MtssMTSSInterventionsPage.SUB_TAB_MEMBER_TYPE);
  }

  /**
   * Navigate back using browser navigation
   * Converts Java navigateBack() method
   */
  async navigateBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Click a link by its text
   * Converts Java clickLink() method
   * @param link The link text to click
   */
  async clickLink(link: string): Promise<void> {
    const linkElement = this.page.locator(`a:has-text("${link}")`);
    await linkElement.waitFor({ state: 'visible' });
    await linkElement.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================
  // GOAL MANAGEMENT METHODS
  // ===========================

  /**
   * Add alpha numeric type goals
   * Converts Java addAlphaNumericTypeGoals() method
   * @param goalName The name of the goal
   * @param goalObjective The objective of the goal
   * @param scoreTargetValue The target score value
   */
  async addAlphaNumericTypeGoals(goalName: string, goalObjective: string, scoreTargetValue: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const addNewGoalButton = this.page.locator(MtssMTSSInterventionsPage.ADD_NEW_GOAL_BUTTON);
    await addNewGoalButton.filter({ hasText: 'Add New Goal' }).click();
    
    await this.page.locator(MtssMTSSInterventionsPage.GOAL_NAME).fill(goalName);
    await this.page.locator(MtssMTSSInterventionsPage.GOAL_OBJECTIVE).fill(goalObjective);
    
    const alphaScoreType = this.page.locator(MtssMTSSInterventionsPage.ALPHA_SCORE_GOAL_TYPE);
    await alphaScoreType.filter({ hasText: 'Alpha or Text Scoring' }).click();
    
    await this.page.locator(MtssMTSSInterventionsPage.GOAL_TARGET).fill(scoreTargetValue);
    
    const saveGoalButton = this.page.locator(MtssMTSSInterventionsPage.SAVE_GOAL_BUTTON);
    await saveGoalButton.filter({ hasText: 'Save' }).click();
  }

  /**
   * Add another alpha numeric type goal
   * Converts Java addAnotherAlphaNumericTypeGoals() method
   * @param goalName The name of the goal
   * @param goalObjective The objective of the goal
   * @param scoreTargetValue The target score value
   */
  async addAnotherAlphaNumericTypeGoals(goalName: string, goalObjective: string, scoreTargetValue: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const addNewGoalButton = this.page.locator(MtssMTSSInterventionsPage.ADD_NEW_GOAL_BUTTON);
    await addNewGoalButton.filter({ hasText: 'Add New Goal' }).click();
    
    await this.page.locator(MtssMTSSInterventionsPage.ADD_GOAL_NAME_2).fill(goalName);
    await this.page.locator(MtssMTSSInterventionsPage.ADD_GOAL_OBJECTIVE_2).fill(goalObjective);
    
    const alphaScoreType2 = this.page.locator(MtssMTSSInterventionsPage.ALPHA_SCORE_TYPE_2);
    await alphaScoreType2.filter({ hasText: 'Alpha or Text Scoring' }).click();
    
    await this.page.locator(MtssMTSSInterventionsPage.ADD_GOAL_TARGET_2).fill(scoreTargetValue);
    
    const save2GoalButtons = this.page.locator(MtssMTSSInterventionsPage.SAVE_2_GOAL);
    await save2GoalButtons.nth(1).click();
  }

  /**
   * Add numeric type goals
   * Converts Java addNumericTypeGoals() method
   * @param goalName The name of the goal
   * @param goalObjective The objective of the goal
   * @param scoreTargetValue The target score value
   */
  async addNumericTypeGoals(goalName: string, goalObjective: string, scoreTargetValue: string): Promise<void> {
    const addNewGoalButton = this.page.locator(MtssMTSSInterventionsPage.ADD_NEW_GOAL_BUTTON);
    await addNewGoalButton.filter({ hasText: 'Add New Goal' }).click();
    
    await this.page.locator(MtssMTSSInterventionsPage.GOAL_NAME).fill(goalName);
    await this.page.locator(MtssMTSSInterventionsPage.GOAL_OBJECTIVE).fill(goalObjective);
    
    const numericScoreType = this.page.locator(MtssMTSSInterventionsPage.NUMERIC_SCORE_GOAL_TYPE);
    await numericScoreType.filter({ hasText: 'Numeric Only Scoring' }).click();
    
    await this.page.locator(MtssMTSSInterventionsPage.GOAL_TARGET).fill(scoreTargetValue);
    
    const saveGoalButton = this.page.locator(MtssMTSSInterventionsPage.SAVE_GOAL_BUTTON);
    await saveGoalButton.filter({ hasText: 'Save' }).click();
  }

  /**
   * Set goal score value
   * Converts Java setGoalScoreValue() method
   * @param goalScoreValue The goal score value to set
   */
  async setGoalScoreValue(goalScoreValue: string): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.GOAL_INPUT_TEXT_BOX).fill(goalScoreValue);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Delete a goal
   * Converts Java clickDeleteGoalButton() method
   */
  async clickDeleteGoalButton(): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.DELETE_GOAL_BUTTON).click();
  }

  /**
   * Check if goal saved confirmation text is displayed
   * Converts Java isGoalSavedConfirmationText() method
   * @returns true if the confirmation text is displayed
   */
  async isGoalSavedConfirmationText(): Promise<boolean> {
    try {
      const confirmationElements = this.page.locator(MtssMTSSInterventionsPage.GOAL_SAVE_CONFIRMATION_TEXT);
      const confirmationElement = confirmationElements.filter({ hasText: 'This goal has been saved.' });
      await confirmationElement.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Select goal from dropdown
   * Converts Java selectGoalFromDropDown() method
   * @param goalName The goal name to select
   */
  async selectGoalFromDropDown(goalName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const goalNameDropdown = this.page.locator(MtssMTSSInterventionsPage.GOAL_NAME_DROPDOWN);
    await goalNameDropdown.filter({ hasText: goalName }).click();
  }

  /**
   * Add student score for goal by goal name and student name
   * Converts Java addStudentScoreForGoalByGoalNameAndStudentName() method
   * @param studentName The student name
   * @param goalName The goal name
   * @param studentScore The student score
   */
  async addStudentScoreForGoalByGoalNameAndStudentName(studentName: string, goalName: string, studentScore: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const goalRow = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator('tbody tr').filter({ hasText: goalName });
    const goalInput = goalRow.locator(MtssMTSSInterventionsPage.GOAL_INPUT_TEXT_BOX);
    await goalInput.fill(studentScore);
  }

  /**
   * Get student score for goal by goal name and student name
   * Converts Java getStudentScoreForGoalByGoalNameAndStudentName() method
   * @param studentName The student name
   * @param goalName The goal name
   * @returns The student score value
   */
  async getStudentScoreForGoalByGoalNameAndStudentName(studentName: string, goalName: string): Promise<string> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const scoreElement = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.SCORE).filter({ hasText: goalName });
    const inputElement = scoreElement.locator('..').locator('..').locator('..').locator('input[class="neon-input-field-first"]');
    return await inputElement.inputValue() || '';
  }

  /**
   * Remove added goal score
   * Converts Java removeAddedGoalScore() method
   */
  async removeAddedGoalScore(): Promise<void> {
    const goalInputBox = this.page.locator(MtssMTSSInterventionsPage.GOAL_INPUT_TEXT_BOX);
    const currentValue = await goalInputBox.inputValue();
    
    // Clear the input by selecting all and deleting
    await goalInputBox.selectText();
    await goalInputBox.press('Backspace');
    await goalInputBox.clear();
  }

  /**
   * Remove added goal score by goal name and student
   * Converts Java removeAddedGoalScoreByGoalNameAndStudent() method
   * @param studentName The student name
   * @param goalName The goal name
   */
  async removeAddedGoalScoreByGoalNameAndStudent(studentName: string, goalName: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const goalCell = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator('..').locator('td').filter({ hasText: goalName });
    const goalInput = goalCell.locator('..').locator(MtssMTSSInterventionsPage.GOAL_INPUT_TEXT_BOX);
    
    await goalInput.press('Control+a');
    await goalInput.press('Delete');
  }

  /**
   * Add mass goal with respect to goal name
   * Converts Java addMassGoalWithRespectToGoalName() method
   * @param goalName The goal name
   * @param goalValue The goal value
   */
  async addMassGoalWithRespectToGoalName(goalName: string, goalValue: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    await this.page.locator(MtssMTSSInterventionsPage.MASS_UPDATE_GOAL_BUTTON).click();
    
    const selectGoalFromModal = this.page.locator(MtssMTSSInterventionsPage.SELECT_GOAL_FROM_MODAL);
    await selectGoalFromModal.filter({ hasText: goalName }).click();
    
    const massUpdateInput = this.page.locator(MtssMTSSInterventionsPage.MASS_UPDATE_GOAL_INPUT_TEXT_BOX);
    await massUpdateInput.press('Control+a');
    await massUpdateInput.press('Delete');
    await massUpdateInput.fill(goalValue);
    
    const addMassUpdateGoalScores = this.page.locator(MtssMTSSInterventionsPage.ADD_MASS_UPDATE_GOAL_SCORES);
    await addMassUpdateGoalScores.filter({ hasText: 'Add Goal Scores' }).click();
  }

  /**
   * Switch to Goals tab
   * Converts Java switchToGoalsTab() method
   * @param tabName The tab name
   */
  async switchToGoalsTab(tabName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const goalsTab = this.page.locator(MtssMTSSInterventionsPage.GOALS_TAB);
    await goalsTab.filter({ hasText: tabName }).click();
  }

  /**
   * Select all students on Goals tab
   * Converts Java selectAllStudentsOnGoalsTab() method
   */
  async selectAllStudentsOnGoalsTab(): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    await this.page.locator(MtssMTSSInterventionsPage.SELECT_ALL_STUDENTS_ON_GOALS_TAB).click();
  }

  /**
   * Select goal on chart tab by goal name
   * Converts Java selectGoalOnChartTabByGoalName() method
   * @param goalName The goal name to select
   */
  async selectGoalOnChartTabByGoalName(goalName: string): Promise<void> {
    const goalSelect = this.page.locator(MtssMTSSInterventionsPage.GOAL_SELECT);
    await goalSelect.filter({ hasText: goalName }).click();
  }

  // ===========================
  // ATTENDANCE MANAGEMENT METHODS
  // ===========================

  /**
   * Mass update attendance
   * Converts Java massUpdateAttendance() method
   * @param attendanceStatus The attendance status to set
   */
  async massUpdateAttendance(attendanceStatus: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    await this.page.locator(MtssMTSSInterventionsPage.SET_ATTENDANCE_BUTTON).click();
    
    const presentRadio = this.page.locator(MtssMTSSInterventionsPage.PRESENT_RADIO_MASS_UPDATE);
    await presentRadio.filter({ hasText: attendanceStatus }).click();
    
    const bulkUpdateButton = this.page.locator(MtssMTSSInterventionsPage.BULK_UPDATE_BUTTON);
    await bulkUpdateButton.filter({ hasText: 'Set Attendance' }).click();
  }

  /**
   * Add mass update time attended
   * Converts Java addMassUpdateTimeAttended() method
   * @param meetingMinutes The meeting minutes to add
   */
  async addMassUpdateTimeAttended(meetingMinutes: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    await this.page.locator(MtssMTSSInterventionsPage.TIME_ATTENDED_BUTTON).click();
    await this.page.locator(MtssMTSSInterventionsPage.ATTENDED_MINUTES_TEXT_BOX).fill(meetingMinutes);
    await this.page.waitForTimeout(3000);
    
    const bulkUpdateButton = this.page.locator(MtssMTSSInterventionsPage.BULK_UPDATE_BUTTON);
    await bulkUpdateButton.filter({ hasText: 'Update minutes' }).click();
    await this.page.waitForTimeout(5000);
    await MtssHelper.waitForPageToLoad(this.page, 5000);
  }

  /**
   * Set minutes with respect to student name
   * Converts Java setMinutesWithRespectToStudentName() method
   * @param studentName The student name
   * @param minutes The minutes to set
   */
  async setMinutesWithRespectToStudentName(studentName: string, minutes: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const minutesInput = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.MINUTES_INPUT_TEXT_BOX);
    
    await minutesInput.fill(minutes);
    await MtssHelper.waitForPageToLoad(this.page, 120000);
  }

  /**
   * Delete minutes with respect to first student
   * Converts Java deleteMinutesWithRespectToFirstStudent() method
   * @param studentName The student name
   */
  async deleteMinutesWithRespectToFirstStudent(studentName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const minutesInput = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.MINUTES_INPUT_TEXT_BOX);
    
    await minutesInput.press('Control+a');
    await minutesInput.press('Delete');
    await MtssHelper.waitForPageToLoad(this.page, 120000);
  }

  /**
   * Delete minutes with respect to second student
   * Converts Java deleteMinutesWithRespectToSecondStudent() method
   * @param studentName The student name
   */
  async deleteMinutesWithRespectToSecondStudent(studentName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const minutesInput = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.SECOND_MINUTES_INPUT_TEXT_BOX);
    
    await minutesInput.press('Control+a');
    await minutesInput.press('Delete');
    await MtssHelper.waitForPageToLoad(this.page, 120000);
  }

  /**
   * Delete minutes with respect to third student
   * Converts Java deleteMinutesWithRespectToThirdStudent() method
   * @param studentName The student name
   */
  async deleteMinutesWithRespectToThirdStudent(studentName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const minutesInput = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.THIRD_MINUTES_INPUT_TEXT_BOX);
    
    await minutesInput.press('Control+a');
    await minutesInput.press('Delete');
    await MtssHelper.waitForPageToLoad(this.page, 120000);
  }

  /**
   * Delete minutes with respect to fourth student
   * Converts Java deleteMinutesWithRespectToFourthStudent() method
   * @param studentName The student name
   */
  async deleteMinutesWithRespectToFourthStudent(studentName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const minutesInput = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.FOURTH_MINUTES_INPUT_TEXT_BOX);
    
    await minutesInput.press('Control+a');
    await minutesInput.press('Delete');
    await MtssHelper.waitForPageToLoad(this.page, 120000);
  }

  /**
   * Get minutes with respect to student name
   * Converts Java getMinutesWithRespectToStudentName() method
   * @param studentName The student name
   * @returns The minutes value
   */
  async getMinutesWithRespectToStudentName(studentName: string): Promise<string> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const minutesInput = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.MINUTES_INPUT_TEXT_BOX);
    
    return await minutesInput.inputValue() || '';
  }

  /**
   * Get total minutes with respect to student name
   * Converts Java getTotalMinutesWithRespectToStudentName() method
   * @param studentName The student name
   * @returns The total minutes value
   */
  async getTotalMinutesWithRespectToStudentName(studentName: string): Promise<string> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const totalMinutesElement = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.TOTAL_MINUTES_TEXT).filter({ hasText: 'Total Time Attended' });
    
    const text = await totalMinutesElement.textContent() || '';
    return text.replace(/[^\d.]/g, '');
  }

  /**
   * Remove minutes and attendance
   * Converts Java removeMinutesAndAttendance() method
   */
  async removeMinutesAndAttendance(): Promise<void> {
    const minutesInput = this.page.locator(MtssMTSSInterventionsPage.MINUTES_INPUT_TEXT_BOX);
    await minutesInput.clear();
    await this.page.waitForTimeout(2000);
    await minutesInput.fill(' ');
    await this.page.locator(MtssMTSSInterventionsPage.PRESENT_ATTENDANCE_SELECTION_CHECK_MARK).click();
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Set attendance to present
   * Converts Java setAttendanceToPresent() method
   */
  async setAttendanceToPresent(): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.PRESENT_ATTENDANCE_SELECTION_CHECK_MARK).click();
    await MtssHelper.waitForPageToLoad(this.page, 120000);
  }

  /**
   * Remove present attendance with respect to student
   * Converts Java removePresentAttendanceWithRespectToStudent() method
   * @param studentName The student name
   */
  async removePresentAttendanceWithRespectToStudent(studentName: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const attendanceButton = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.REMOVE_PRESENT_ATTENDANCE_BUTTON);
    await attendanceButton.click();
  }

  /**
   * Set present attendance with respect to student
   * Converts Java setPresentAttendanceWithRespectToStudent() method
   * @param studentName The student name
   */
  async setPresentAttendanceWithRespectToStudent(studentName: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const attendanceButton = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.REMOVE_PRESENT_ATTENDANCE_BUTTON);
    await attendanceButton.click();
  }

  /**
   * Get student present attendance status
   * Converts Java getStudentPresentAttendanceStatus() method
   * @returns true if attendance is present
   */
  async getStudentPresentAttendanceStatus(): Promise<boolean> {
    const attendanceElement = this.page.locator(MtssMTSSInterventionsPage.ATTENDANCE_SELECTION_CHECK_MARK);
    await expect(attendanceElement).toBeEnabled();
    return await attendanceElement.count() > 0;
  }

  /**
   * Switch to Attendance tab
   * Converts Java switchToAttendanceTab() method
   * @param tabName The tab name
   */
  async switchToAttendanceTab(tabName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const attendanceTab = this.page.locator(MtssMTSSInterventionsPage.ATTENDANCE_TAB);
    await attendanceTab.filter({ hasText: tabName }).waitFor({ state: 'visible', timeout: 30000 });
    await attendanceTab.filter({ hasText: tabName }).click();
  }

  /**
   * Select all students on Attendance tab
   * Converts Java selectAllStudentsOnAttendanceTab() method
   */
  async selectAllStudentsOnAttendanceTab(): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.SELECT_ALL_STUDENT_CHECK_BOX).click();
  }

  /**
   * Get meeting completion percentage
   * Converts Java getMeetingCompletionPercentage() method
   * @returns The meeting completion percentage
   */
  async getMeetingCompletionPercentage(): Promise<string> {
    const attendanceChart = this.page.locator(MtssMTSSInterventionsPage.ATTENDANCE_CHART);
    const meetingCompletionElement = attendanceChart.filter({ hasText: 'Meeting Completion' });
    await meetingCompletionElement.waitFor({ state: 'visible' });
    const spanElement = meetingCompletionElement.locator('..').locator('span');
    await spanElement.waitFor({ state: 'visible' });
    return await spanElement.textContent() || '';
  }

  /**
   * Get average meeting time
   * Converts Java getAverageMeetingTime() method
   * @returns The average meeting time
   */
  async getAverageMeetingTime(): Promise<string> {
    const attendanceChart = this.page.locator(MtssMTSSInterventionsPage.ATTENDANCE_CHART);
    const averageMeetingElement = attendanceChart.filter({ hasText: 'Average Meeting Time' });
    await averageMeetingElement.waitFor({ state: 'visible' });
    const spanElement = averageMeetingElement.locator('..').locator('span');
    await spanElement.waitFor({ state: 'visible' });
    return await spanElement.textContent() || '';
  }

  /**
   * Get not marked attendance percentage
   * Converts Java getNotMarkedAttendancePercentage() method
   * @returns The not marked attendance percentage
   */
  async getNotMarkedAttendancePercentage(): Promise<string> {
    const chartPercentage = this.page.locator(MtssMTSSInterventionsPage.CHART_PERCENTAGE);
    const notMarkedElement = chartPercentage.filter({ hasText: 'Not Marked' });
    await notMarkedElement.waitFor({ state: 'visible' });
    const ddElement = notMarkedElement.locator('..').locator('dd');
    await ddElement.waitFor({ state: 'visible' });
    return await ddElement.textContent() || '';
  }

  /**
   * Get attendance rate
   * Converts Java getAttendanceRate() method
   * @returns The attendance rate
   */
  async getAttendanceRate(): Promise<string> {
    const attendanceRateElements = this.page.locator(MtssMTSSInterventionsPage.ATTENDANCE_RATE);
    const attendanceRateElement = attendanceRateElements.nth(1);
    await attendanceRateElement.waitFor({ state: 'visible' });
    return await attendanceRateElement.textContent() || '';
  }

  /**
   * Get absent percentage rate
   * Converts Java getAbsentPercentageRate() method
   * @returns The absent percentage rate
   */
  async getAbsentPercentageRate(): Promise<string> {
    const chartPercentage = this.page.locator(MtssMTSSInterventionsPage.CHART_PERCENTAGE);
    const absentElement = chartPercentage.filter({ hasText: 'Absent' });
    await absentElement.waitFor({ state: 'visible' });
    const ddElement = absentElement.locator('..').locator('dd');
    await ddElement.waitFor({ state: 'visible' });
    return await ddElement.textContent() || '';
  }

  // ===========================
  // OBSERVATION MANAGEMENT METHODS
  // ===========================

  /**
   * Mass update neutral observation
   * Converts Java massUpdateNeutralObservation() method
   */
  async massUpdateNeutralObservation(): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    await this.page.locator(MtssMTSSInterventionsPage.SET_OBSERVATIONS).click();
    
    const observation2 = this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_2);
    await observation2.filter({ hasText: 'Neutral' }).click();
    
    const bulkUpdateButton = this.page.locator(MtssMTSSInterventionsPage.BULK_UPDATE_BUTTON);
    await bulkUpdateButton.filter({ hasText: 'Add Observations' }).click();
  }

  /**
   * Set observation with respect to student
   * Converts Java setObservationWithRespectToStudent() method
   * @param studentName The student name
   * @param observationName The observation name
   */
  async setObservationWithRespectToStudent(studentName: string, observationName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const observationButton = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.OBSERVATION_BUTTON_NEUTRAL).filter({ hasText: observationName });
    
    await observationButton.click();
  }

  /**
   * Remove observation with respect to first student
   * Converts Java removeObservationWithRespectToFirstStudent() method
   * @param studentName The student name
   * @param observationName The observation name
   */
  async removeObservationWithRespectToFirstStudent(studentName: string, observationName: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const neutralObservation = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.NEUTRAL_OBSERVATION_1).filter({ hasText: observationName });
    
    await neutralObservation.click();
  }

  /**
   * Remove observation with respect to second student
   * Converts Java removeObservationWithRespectToSecondStudent() method
   * @param studentName The student name
   * @param observationName The observation name
   */
  async removeObservationWithRespectToSecondStudent(studentName: string, observationName: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const neutralObservation = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.NEUTRAL_OBSERVATION_2).filter({ hasText: observationName });
    
    await neutralObservation.click();
  }

  /**
   * Remove observation with respect to third student
   * Converts Java removeObservationWithRespectToThirdStudent() method
   * @param studentName The student name
   * @param observationName The observation name
   */
  async removeObservationWithRespectToThirdStudent(studentName: string, observationName: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const neutralObservation = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.NEUTRAL_OBSERVATION_3).filter({ hasText: observationName });
    
    await neutralObservation.click();
  }

  /**
   * Remove observation with respect to fourth student
   * Converts Java removeObservationWithRespectToFourthStudent() method
   * @param studentName The student name
   * @param observationName The observation name
   */
  async removeObservationWithRespectToFourthStudent(studentName: string, observationName: string): Promise<void> {
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const neutralObservation = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.NEUTRAL_OBSERVATION_4).filter({ hasText: observationName });
    
    await neutralObservation.click();
  }

  /**
   * Set observation text for student
   * Converts Java setObservationTextForStudent() method
   * @param studentName The student name
   * @param customObservationName The custom observation name
   */
  async setObservationTextForStudent(studentName: string, customObservationName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const userInfoElements = this.page.locator(MtssMTSSInterventionsPage.USER_INFO);
    const studentElement = userInfoElements.filter({ hasText: studentName });
    const setObservationButton = studentElement.locator('..').locator('..').locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.SET_OBSERVATION_BUTTON).filter({ hasText: 'Neutral' });
    
    await setObservationButton.click();
  }

  /**
   * Switch to Observation tab
   * Converts Java switchToObservationTab() method
   * @param tabName The tab name
   */
  async switchToObservationTab(tabName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const observationTab = this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_TAB);
    await observationTab.filter({ hasText: tabName }).click();
  }

  /**
   * Get observation status count by set observation
   * Converts Java getObservationStatusCountBySetObservation() method
   * @param observationName The observation name
   * @returns The observation count
   */
  async getObservationStatusCountBySetObservation(observationName: string): Promise<string> {
    const observationCount = this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_COUNT);
    const observationElement = observationCount.filter({ hasText: observationName });
    const subTextElement = observationElement.locator('..').locator(MtssMTSSInterventionsPage.SUB_TEXT);
    
    return await subTextElement.textContent() || '';
  }

  /**
   * Get observation percentage by name
   * Converts Java getObservationPercentageByName() method
   * @param customObservationName The custom observation name
   * @returns The observation percentage
   */
  async getObservationPercentageByName(customObservationName: string): Promise<string> {
    const observationButton = this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_BUTTON);
    const observationElement = observationButton.filter({ hasText: customObservationName });
    await observationElement.waitFor({ state: 'visible' });
    const spanElement = observationElement.locator('..').locator('span');
    await spanElement.waitFor({ state: 'visible' });
    
    return await spanElement.textContent() || '';
  }

  /**
   * Edit observation one label
   * Converts Java editObservationOne() method
   * @param labelUpdated The updated label text
   */
  async editObservationOne(labelUpdated: string): Promise<void> {
    const observationLabelEngaged = this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_LABEL_ENGAGED);
    
    // Check if placeholder contains "Engaged"
    const placeholder = await observationLabelEngaged.getAttribute('placeholder');
    if (placeholder?.includes('Engaged')) {
      await observationLabelEngaged.press('Control+a');
      await observationLabelEngaged.press('Delete');
      await observationLabelEngaged.fill(labelUpdated);
      await MtssHelper.waitForPageToLoad(this.page, 2000);
    }
  }

  /**
   * Check if observation label is present
   * Converts Java isObservationLabelPresent() method
   * @returns true if observation labels are present
   */
  async isObservationLabelPresent(): Promise<boolean> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const observationLabelElements = this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_LABEL_DEFAULT_TEXT);
    
    try {
      const firstElement = observationLabelElements.nth(0);
      const secondElement = observationLabelElements.nth(1);
      const thirdElement = observationLabelElements.nth(2);
      
      const firstPlaceholder = await firstElement.getAttribute('placeholder');
      const secondPlaceholder = await secondElement.getAttribute('placeholder');
      const thirdPlaceholder = await thirdElement.getAttribute('placeholder');
      
      return firstPlaceholder?.includes('Engaged') === true &&
             secondPlaceholder?.includes('Neutral') === true &&
             thirdPlaceholder?.includes('Disengaged') === true;
    } catch {
      return false;
    }
  }

  /**
   * Set observation one label color
   * Converts Java setObservationOneLabelColor() method
   */
  async setObservationOneLabelColor(): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_LABEL_EDIT_BUTTON).click();
    
    // Selecting Yellow Color (3rd color)
    const colorList = this.page.locator(MtssMTSSInterventionsPage.OBSERVATION_LABEL_COLOR_LIST);
    await colorList.nth(3).click();
  }

  /**
   * Click save observation label button
   * Converts Java clickSaveObservationLabelButton() method
   */
  async clickSaveObservationLabelButton(): Promise<void> {
    const saveLabelsButton = this.page.locator(MtssMTSSInterventionsPage.SAVE_LABELS_BUTTON);
    await saveLabelsButton.filter({ hasText: 'Save Labels' }).click();
  }

  // ===========================
  // INTERVENTION PLAN MANAGEMENT METHODS
  // ===========================

  /**
   * Click create new plan button
   * Converts Java clickCreateNewPlanButton() method
   */
  async clickCreateNewPlanButton(): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.CREATE_NEW_INTERVENTION_PLAN_BUTTON).click();
  }

  /**
   * Set plan title
   * Converts Java SetPlanTitle() method
   * @param input The plan title to set
   */
  async setPlanTitle(input: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    await this.page.locator(MtssMTSSInterventionsPage.PLAN_TITLE_TEXT_BOX).fill(input);
    await this.page.waitForTimeout(2000);
  }

  /**
   * Set radio button for plan visibility
   * Converts Java SetRadioButton() method
   * @param value The radio button value to select
   */
  async setRadioButton(value: string): Promise<void> {
    const visibilityRadioButton = this.page.locator(MtssMTSSInterventionsPage.VISIBILITY_RADIO_BUTTON);
    await visibilityRadioButton.filter({ hasText: value }).click();
  }

  /**
   * Set untimed radio button
   * Converts Java SetUntimedRadioButton() method
   * @param value The radio button value to select
   */
  async setUntimedRadioButton(value: string): Promise<void> {
    const untimedRadioButton = this.page.locator(MtssMTSSInterventionsPage.VISIBILITY_RADIO_UNTIMED_BUTTON);
    await untimedRadioButton.filter({ hasText: value }).click();
  }

  /**
   * Set plan description
   * Converts Java setPlanDescription() method
   * @param memberType The plan description to set
   */
  async setPlanDescription(memberType: string): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.PLAN_TEMPLATE_DESCRIPTION_TEXT_BOX).fill(memberType);
  }

  /**
   * Set plan purpose
   * Converts Java setPlanPurpose() method
   * @param planText The plan purpose text
   */
  async setPlanPurpose(planText: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    await this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_PLAN_PURPOSE_TEXT_EDITOR).type(planText);
  }

  /**
   * Set plan message
   * Converts Java setPlanMessage() method
   * @param planText The plan message text
   */
  async setPlanMessage(planText: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    await this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_PLAN_MESSAGE_TEXT_EDITOR).type(planText);
  }

  /**
   * Set outcome target
   * Converts Java setOutComeTarget() method
   * @param planText The outcome target text
   */
  async setOutComeTarget(planText: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    await this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_PLAN_OUTCOME_TARGET_TEXT_EDITOR).type(planText);
  }

  /**
   * Click save intervention plan
   * Converts Java clickSaveInterventionPlan() method
   */
  async clickSaveInterventionPlan(): Promise<void> {
    const saveButton = this.page.locator(MtssMTSSInterventionsPage.SAVE_INTERVENTION_PLAN_BUTTON);
    await saveButton.filter({ hasText: MtssMTSSInterventionsPage.SAVE_BUTTON_NAME }).click();
  }

  /**
   * Click edit plan button
   * Converts Java clickEditPlanButton() method
   */
  async clickEditPlanButton(): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const editPlanButton = this.page.locator(MtssMTSSInterventionsPage.EDIT_PLAN_BUTTON);
    await editPlanButton.filter({ hasText: 'Edit Intervention Plan' }).click();
  }

  /**
   * Click delete plan button
   * Converts Java clickDeletePlanButton() method
   */
  async clickDeletePlanButton(): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const deletePlanButton = this.page.locator(MtssMTSSInterventionsPage.DELETE_PLAN_BUTTON);
    await deletePlanButton.filter({ hasText: 'Delete' }).click();
  }

  /**
   * Click activate plan button
   * Converts Java clickActivatePlanButton() method
   * @param planName The plan name to activate
   */
  async clickActivatePlanButton(planName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const activatePlanButton = this.page.locator(MtssMTSSInterventionsPage.ACTIVATE_PLAN_BUTTON);
    await activatePlanButton.filter({ hasText: 'Activate' }).click();
  }

  /**
   * Click use this plan button
   * Converts Java clickUseThisPlanButton() method
   * @param planName The plan name
   */
  async clickUseThisPlanButton(planName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const useThisPlanButtons = this.page.locator(MtssMTSSInterventionsPage.USE_THIS_PLAN_BUTTON);
    const planElement = useThisPlanButtons.filter({ hasText: planName });
    const useThisPlanButton = planElement.locator('..').locator('..').locator('..').locator(MtssMTSSInterventionsPage.USE_THIS_PLAN);
    await useThisPlanButton.click();
  }

  /**
   * Search intervention by name on bank tab
   * Converts Java searchInterventionByNameOnBankTab() method
   * @param planText The plan text to search for
   */
  async searchInterventionByNameOnBankTab(planText: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const searchBox = this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_PLAN_NAME_SEARCH_BOX);
    
    await searchBox.clear();
    await searchBox.press('Control+a');
    await searchBox.press('Delete');
    await MtssHelper.waitForPageToLoad(this.page, 15000);
    await searchBox.type(planText);
    await MtssHelper.waitForPageToLoad(this.page, 15000);
    await this.page.waitForTimeout(2000);
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Search intervention by name on all interventions tab
   * Converts Java searchInterventionByNameOnAllInterventionsTab() method
   * @param planText The plan text to search for
   */
  async searchInterventionByNameOnAllInterventionsTab(planText: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const searchBox = this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_NAME_SEARCH_BOX);
    
    await searchBox.press('Control+a');
    await searchBox.press('Delete');
    await searchBox.type(planText);
  }

  /**
   * Check if intervention exists by name on all interventions tab
   * Converts Java isInterventionByNameOnAllInterventionsTab() method
   * @param planText The plan text to check
   * @returns true if the intervention exists
   */
  async isInterventionByNameOnAllInterventionsTab(planText: string): Promise<boolean> {
    await MtssHelper.waitForPageToLoad(this.page);
    const searchBox = this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_NAME_SEARCH_BOX);
    
    await searchBox.clear();
    await searchBox.type(planText);
    
    const planDescriptionText = this.page.locator(MtssMTSSInterventionsPage.PLAN_DESCRIPTION_TEXT);
    const planElement = planDescriptionText.filter({ hasText: planText });
    
    return await planElement.isVisible();
  }

  /**
   * Click on intervention by name
   * Converts Java clickOnInterventionByName() method
   * @param interventionName The intervention name to click
   */
  async clickOnInterventionByName(interventionName: string): Promise<void> {
    const planDescriptionText = this.page.locator(MtssMTSSInterventionsPage.PLAN_DESCRIPTION_TEXT);
    await planDescriptionText.filter({ hasText: interventionName }).click();
  }

  /**
   * Click on three dots with respect to intervention plan
   * Converts Java clickOnThreeDotsWithRespectToInterventionPlan() method
   * @param planText The plan text
   */
  async clickOnThreeDotsWithRespectToInterventionPlan(planText: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    
    const templateNameElements = this.page.locator('[class="template-name"]');
    const planElement = templateNameElements.filter({ hasText: planText });
    await planElement.waitFor({ state: 'visible' });
    await MtssHelper.waitForPageToLoad(this.page, 5000);
    
    const threeDotsButton = this.page.locator(MtssMTSSInterventionsPage.THREE_DOTS_BUTTON);
    await expect(threeDotsButton).toBeEnabled();
    await expect(threeDotsButton).toBeVisible();
    await threeDotsButton.click();
  }

  /**
   * Get intervention plan name
   * Converts Java getInterventionPlanName() method
   * @param interventionName The intervention name to check
   * @returns true if the intervention plan name contains the text
   */
  async getInterventionPlanName(interventionName: string): Promise<boolean> {
    const interventionPlanName = this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_PLAN_NAME);
    const text = await interventionPlanName.textContent() || '';
    return text.includes(interventionName);
  }

  /**
   * Get intervention plan length
   * Converts Java getInterventionPlanLength() method
   * @returns The intervention plan length
   */
  async getInterventionPlanLength(): Promise<string> {
    const interventionPlanLength = this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_PLAN_LENGTH);
    return await interventionPlanLength.nth(0).textContent() || '';
  }

  /**
   * Get intervention plan times used
   * Converts Java getInterventionPlanTimesUsed() method
   * @returns The times used count
   */
  async getInterventionPlanTimesUsed(): Promise<string> {
    const interventionPlanLength = this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_PLAN_LENGTH);
    return await interventionPlanLength.nth(1).textContent() || '';
  }

  /**
   * Click manage intervention button
   * Converts Java clickManageInterventionButton() method
   */
  async clickManageInterventionButton(): Promise<void> {
    await this.page.locator(MtssMTSSInterventionsPage.MANAGE_INTERVENTION_BUTTON).click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click delete intervention button
   * Converts Java clickDeleteInterventionButton() method
   */
  async clickDeleteInterventionButton(): Promise<void> {
    const deleteInterventionButton = this.page.locator(MtssMTSSInterventionsPage.DELETE_INTERVENTION_BUTTON);
    await deleteInterventionButton.filter({ hasText: 'Delete Intervention' }).click();
    
    const deleteConfirmationButton = this.page.locator(MtssMTSSInterventionsPage.DELETE_CONFIRMATION_BUTTON);
    await deleteConfirmationButton.filter({ hasText: 'Delete Intervention' }).click();
  }

  /**
   * Set intervention name on schedule tab
   * Converts Java setInterventionNameOnScheduleTab() method
   * @param interventionName The intervention name to set
   */
  async setInterventionNameOnScheduleTab(interventionName: string): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const interventionNameTextBox = this.page.locator(MtssMTSSInterventionsPage.INTERVENTION_NAME_TEXT_BOX);
    await interventionNameTextBox.clear();
    await interventionNameTextBox.fill(interventionName);
  }

  /**
   * Click start intervention
   * Converts Java clickStartIntervention() method
   */
  async clickStartIntervention(): Promise<void> {
    await MtssHelper.waitForPageToLoad(this.page);
    const saveAfterEditButton = this.page.locator(MtssMTSSInterventionsPage.SAVE_AFTER_EDIT_BUTTON);
    await saveAfterEditButton.filter({ hasText: MtssMTSSInterventionsPage.START_INTERVENTION_TEXT }).click();
  }

  /**
   * Check if start intervention button is available for click
   * Converts Java isStartInterventionButtonAvailableForClick() method
   * @returns true if the button is NOT enabled (inverted logic from Java)
   */
  async isStartInterventionButtonAvailableForClick(): Promise<boolean> {
    await MtssHelper.waitForPageToLoad(this.page);
    const saveAfterEditButton = this.page.locator(MtssMTSSInterventionsPage.SAVE_AFTER_EDIT_BUTTON);
    const startInterventionButton = saveAfterEditButton.filter({ hasText: MtssMTSSInterventionsPage.START_INTERVENTION_TEXT });
    return !(await startInterventionButton.isEnabled());
  }
}
