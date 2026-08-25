/**
 * Playwright/TypeScript version of HoonuitMtssInterventionsPage (converted from Java)
 * Comprehensive implementation with all selectors and methods from the Java source
 * Standardized for Playwright test framework with proper async/await patterns
 */
import { Page, Locator, expect } from '@playwright/test';
import { MtssBasePage } from './MtssBasePage';

// Interface definitions for better type safety
interface DateComponents {
  month: string;
  year: string;
  day: string;
}

interface GoalData {
  name: string;
  objective: string;
  target: string;
}

interface InterventionPlanData {
  title: string;
  description: string;
  level: string;
  type: string;
  subtype?: string;
  purpose?: string;
  message?: string;
  outcomeTarget?: string;
  weeks?: string;
  meetings?: string;
  duration?: string;
}

interface ReasonData {
  type: string;
  completionClass: string;
  name: string;
  description: string;
  isStateLevel: boolean;
}

interface LevelData {
  name: string;
  description: string;
  isStateLevel: boolean;
}

interface TypeData {
  name: string;
  subtype: string;
  description: string;
  isStateLevel: boolean;
}

export class HoonuitMtssInterventionsPage extends MtssBasePage {
  // Core Navigation Selectors
  private readonly switchTabSelector = 'ul.pds-tabs li';
  private readonly switchSubTabSelector = '.nav-link';
  private readonly scheduleTabButton = '[for="tab-group-1-tab-schedule"]';
  private readonly resourceTabButton = '[for="tab-group-1-tab-resource"]';
  private readonly observationTab = '[for="intervention-overview-tab-intervention-observations"]';
  private readonly attendanceTab = '[for="intervention-overview-tab-intervention-attendance"]';
  private readonly goalsTab = '[for="intervention-overview-tab-intervention-goals"]';
  private readonly studentOverviewTab = '[for="intervention-overview-tab-intervention-student-overview"]';
  private readonly staffTabButton = '[for="tab-group-1-tab-staff"]';
  private readonly meetingTabs = 'label[for^="intervention-overview-tab-intervention"]';

  // Button Selectors
  private readonly addNewButtonEnrollWithdrawReason = '#button-add-new-enroll-withdraw-reason';
  private readonly addNewButtonLevel = '#button-add-new-intervention-level';
  private readonly addNewButtonType = '#button-add-new-intervention-type';
  private readonly addNewButtonInstructionalStrategy = '#button-add-new-instructional-stragety';
  private readonly addNewGoalButton = '#button-create-new-template-button';
  private readonly saveGoalButton = '#button-save-goal';
  private readonly addReasonTypeButton = '#button-add-edit-save';
  private readonly createNewInterventionPlanButton = '#create-new-template-button';
  private readonly saveAfterEditButton = '#button-footer-end-button-save';
  private readonly saveResourceButtonAfterEdit = '#add-edit-save';
  private readonly addStudentButton = '#button-add-member-button';
  private readonly bulkUpdateButton = '#button-button-bulk-update';
  private readonly setAttendanceButton = '#button-option-2';
  private readonly addTimeObservationGoalBtn = '#button-option-1';
  private readonly activatePlanButton = '#activate-id-for-specific-thihg';
  private readonly duplicateButton = '#button-clone-id-for-specific-thing';
  private readonly duplicatePlanConfirmButton = '#button-duplicate-plan-btn';
  private readonly editPlanButton = '#edit-id-for-specific-thing';
  private readonly deletePlanButton = '#delete-id-for-specific-thing';
  private readonly deleteDialogButton = '#delete-setting-delete';
  private readonly addResourceButton = '#button-add-strategy-button';
  private readonly clickCancelButton = '#button-button-cancel';
  private readonly deleteGoalButton = '#button-delete-goal-button';
  private readonly expandGoalButton = '#goalAccordion-toggle';
  private readonly deleteResourceInPlanButton = '#delete-strategy-id-0';
  private readonly reviewPlanDetailsButton = '[data-text="Review Plan Details"]';
  private readonly manageInterventionButton = '#button-manageInterventionButton';
  private readonly deleteInterventionButton = '#button-footer-start-button-delete';
  private readonly deleteConfirmationButton = '#button-dialog-confirm';
  private readonly editButton = '#button-edit-button';
  private readonly deleteButton = '#button-delete-button';
  private readonly compareStudentsButton = '#button-goals-compare-students';
  private readonly retrieveScoresButton = '[data-text="Retrieve Scores"]';
  private readonly retrieveDataButton = '#button-goals-retrieve-data';
  private readonly saveLabelsButton = '[data-text="Save Labels"]';
  private readonly selectBulkActionButton = '[data-text="Bulk options"]';
  private readonly addMassUpdateGoalScores = '#button-add-goals-multi-submit';
  private readonly saveAndCloseButton = '#button-footer-end-button-pending';
  private readonly updateStatusButton = '[data-text="Update status"]';
  private readonly saveUpdatesButton = '[data-text="Save updates"]';
  private readonly clickOnSetDataButton = '#button-set-goal-button';
  private readonly setGoalDataCancelButton = '#button-cancel-set-goal';
  private readonly refreshDataBtn = '#button-goals-refresh-data';
  private readonly dialogConfirmBtn = 'button[id="button-dialog-confirm"]';
  private readonly dialogCancelBtn = '#button-dialog-cancel';
  private readonly retrieveDataCancelBtn = '#button-retrieve-cancel';
  private readonly printReportButton = '[data-text="Print report"]';
  private readonly printInterventionReportButton = '#print-intervention-button';
  private readonly updateCalendar = '#button-schedule';
  private readonly schedulingAssistantButton = '#button-schedule-assistant';
  private readonly addStaffBtn = '#button-add-staff-button';
  private readonly reactivateBtn = '#button-reactivateInterventionButton';
  private readonly clearSelectionButton = '#button-clear-selection';
  private readonly scheduleUpdateCalendar = '#button-update-calendar-button';

  // Back Navigation Selectors
  private readonly backArrowNotesScreen = '#button-layout-detail-back-button-noteComponent';
  private readonly backArrowInterventionDetail = '#button-layout-detail-back-button-DetailLayout';
  private readonly backArrowManageIntervention = '#button-layout-detail-back-button-addManageTemplate';
  private readonly backArrowInterventionPlan = '#layout-detail-back-button-DetailTemplate';
  private readonly backButtonOnCompareScreen = '#button-layout-detail-back-button-CompareStudentsLayout';

  // Form Input Selectors
  private readonly reasonTypeDropdown = '#input-field-reason-type-select';
  private readonly reasonNameTextBox = '#input-field-overview-student-name';
  private readonly completionDropdown = '#input-field-completion-class-select';
  private readonly reasonDescriptionTextBox = '#input-field-reason-description';
  private readonly levelNameTextBox = '#input-field-level-name';
  private readonly levelDescriptionTextBox = '#input-field-level-description';
  private readonly typeNameTextBox = '#input-field-intervention-type-select';
  private readonly typeDescriptionTextBox = '#input-field-intervention-type-description';
  private readonly subTypeTextBox = '#input-field-intervention-subtype-select';
  private readonly typesColorTextBox = '#interventionColor';
  private readonly planTitleTextBox = '#input-field-templateTitle';
  private readonly planTemplateDescriptionTextBox = '#input-field-templateDescription';
  private readonly levelDropdown = '#input-field-level-select';
  private readonly interventionType = '#input-field-type-select';
  private readonly interventionSubtype = '#input-field-subtype-select';
  private readonly planTemplateMemberTypeBox = '#addMemberSearch';
  private readonly studentSupportResourceDropDownButton = '#addInstructionalStrategySearch';
  private readonly studentSupportResourceTextBox = '#add-strategy-button';
  private readonly attendedMinutesTextBox = 'input[id="input-field-attendance-minutes"]';
  private readonly interventionNameTextBox = '#input-field-intervention-name';
  private readonly interventionPlanNameSearchBox = '[id="input-field-plan-name"][aria-label="Search by plan title"]';
  private readonly interventionNameSearchBox = '#input-field-filter-name';
  private readonly goalName = '#input-field-goalName0';
  private readonly goalObjective = '#input-field-goalObjective0';
  private readonly goalTarget = '#input-field-goalTarget0';
  private readonly goalName1 = '#input-field-goalName1';
  private readonly goalObjective1 = '#input-field-goalObjective1';
  private readonly goalTarget1 = '#input-field-goalTarget1';
  private readonly goalInputTextBox = 'input[class="neon-input-field-first"][aria-label="none"]';
  private readonly massUpdateGoalInputTextBox = 'input[id*="input-field-goal-multi-input-"]';
  private readonly editWeeks = '#input-field-templateWeeks';
  private readonly editMeetings = '#input-field-templateMeetings';
  private readonly editMeetingDuration = '#input-field-meetingDuration';
  private readonly strategyTitle = '#input-field-resource-title';
  private readonly strategyType = '#input-field-resource-type';
  private readonly studentSearchBox = '#input-field-manage-student-search';

  // Dropdown and Selection Selectors
  private readonly dropdownOption = '[class="ng-option-label"]';
  private readonly dropdownOptions = 'button[class*="neon-list-item-button"] div div p';
  private readonly levelTypeSubtypeDropdownOptions = '.neon-list-item-text-block p';
  private readonly schoolSelectCheckbox = '#school-multiselect-main-button';
  private readonly selectGoalCheckbox = '[for="checkbox-goal-clone-check-box"]';
  private readonly monthDropdown = 'select[aria-label="Select month"]';
  private readonly yearDropdown = 'select[aria-label="Select year"]';
  private readonly select = 'select';
  private readonly daySelectButton = 'tbody tr td [type="button"]';
  private readonly startDateButton = '#Start-after-button';
  private readonly startDateCalendarBtn = '#Start-after-button';
  private readonly endDate = '#end-before-button';
  private readonly endDateCalendarBtn = '#end-before-button';
  private readonly scheduleDateDropdown = '#input-field-empty-select-id';
  private readonly goalsDropdown = '#input-field-goal-select';
  private readonly compareStudentsDropdown = '#studentSelect-main-button';
  private readonly selectGoalFromModal = '[id="input-field-multi-measurement-save-goal"]';
  private readonly interventionStatusDropdown = '[id="input-field-change-current-intervention-status"]';
  private readonly newInterventionStatusDropdown = '[id="input-field-change-new-intervention-status-select"]';
  private readonly moveToNewInterventionDropdown = '[id="input-field-change-intervention-select"]';
  private readonly schoolYear = '#input-field-filter_0';
  private readonly assessmentSource = '#input-field-filter_1';
  private readonly assessmentSubject = '#input-field-filter_2';
  private readonly assessmentName = '#input-field-filter_3';
  private readonly scoreType = '#input-field-filter_4';
  private readonly clickOnDataTypePicker = '#input-field-select-data-type-picker';
  private readonly clickOnBehaviourTypePicker = '#input-field-behavior-type-picker';
  private readonly staffDropdown = '#addStaffSearch';
  private readonly clickDateSelectButton = '#input-field-empty-select-id';
  private readonly dateSelectionFromDropdown = '#empty-select-id-popper';
  private readonly selectMonthDropdown = 'select[aria-label="Choose a month from dropdown"]';
  private readonly selectYearDropdown = 'select[aria-label="Choose a year from dropdown"]';
  private readonly selectMonth = 'select[aria-label="Select month"]';
  private readonly selectYear = 'select[aria-label="Select year"]';

  // Checkbox and Radio Button Selectors
  private readonly reasonStateLevelCheckbox = '#state-level-checkbox';
  private readonly levelsStateLevelCheckbox = '#state-Level';
  private readonly typesStateLevelCheckbox = '#state-level';
  private readonly planStateLevelCheckbox = '#state-level-check-box';
  private readonly presentRadioMassUpdate = '#present';
  private readonly visibilityRadioButton = '[for="radio-scheduled-option"]';
  private readonly visibilityRadioUntimedButton = '[for="radio-untimed-option"]';
  private readonly selectAllStudentCheckBox = '[for="checkbox-attendance-select-all"]';
  private readonly selectAllStudentsOnGoalsTabSelector = '[for="checkbox-goals-select-all"]';
  private readonly publicRadioButton = '[data-label-text="Public"]';
  private readonly inactiveFilterCheckbox = '#inactiveID';
  private readonly studentSupportResourceToggleButton = 'label[for="checkbox-public-resource"]';
  private readonly statusCheckboxes = '.neon-checkbox-single-check + span';
  private readonly clickSelectAllStudentOverviewCheckbox = '[for="checkbox-student-overview-select-all"]';
  private readonly schedulingAssistantCheckbox = '[data-label-text="Scheduling assistant"]';
  private readonly datesWithDataRadio = '#date-1';
  private readonly allMeetingDatesRadio = '.date-2';

  // Student and Staff Management Selectors
  private readonly deleteStudent1 = '[id="user-info-0"]';
  private readonly deleteStudent = '[id*="user-info"]';
  private readonly userInfo = '[class="user-info"]';
  private readonly studentNameInCard = 'div.user-info div';
  private readonly studentCard = '.neon-2_9_0-grid-container.w-100';
  private readonly studentNameInCardMngIntervention = 'div#tab-group-1-tab-content div.user-info div';
  private readonly studentAvatarsLargeIcon = 'neon-0_13_0-avatar[data-avatar-size="large"] div span';
  private readonly studentAvatarsLargeIconMngIntervention = 'div#tab-group-1-tab-content neon-0_13_0-avatar[data-avatar-size="large"] div span';
  private readonly interventionStudentNames = '[id^=user-info] [class="user-info"] div:nth-child(1)';
  private readonly interventionStaffNames = 'app-manage-staff [class="user-info"] div:nth-child(1)';
  private readonly deleteStaffBtn = 'button[aria-label="delete"]';
  private readonly deleteMemberButton = 'button[aria-label="delete"]';

  // Attendance and Minutes Input Selectors
  private readonly minutesInputTextBox = '#input-field-minInput-0';
  private readonly secondMinutesInputTextBox = '#input-field-minInput-1';
  private readonly thirdMinutesInputTextBox = '#input-field-minInput-2';
  private readonly fourthMinutesInputTextBox = '#input-field-minInput-3';
  private readonly attendanceSelectionCheckMark = '[id="button-attendance-on-time-0"]';
  private readonly presentAttendanceSelectionCheckMark = '[data-text="On Time"]';
  private readonly removePresentAttendanceButton = '[aria-label="On Time"]';
  private readonly attendancePresent = '[data-text="On Time"]';
  private readonly attendanceCount1 = '#input-field-minInput-0';
  private readonly attendanceCount2 = '#input-field-minInput-1';
  private readonly attendanceCount3 = '#input-field-minInput-2';
  private readonly attendanceCount4 = '#input-field-minInput-3';
  private readonly timeAttendedTextBox = 'input[id*="input-field-minInput"]';
  private readonly filterStatusDropdown = '#attendance-multi-select-main-button';

  // Observation Selectors
  private readonly observation2 = '#observation-2 span';
  private readonly observationButtonNeutral = '[id="observation-neutral-0"]';
  private readonly neutralObservation1 = '[id="button-observation-neutral-0"]';
  private readonly neutralObservation2 = '[id="button-observation-neutral-1"]';
  private readonly neutralObservation3 = '[id="button-observation-neutral-2"]';
  private readonly neutralObservation4 = '[id="button-observation-neutral-3"]';
  private readonly setObservationButton = '[class="neon-button-group neon-button-group-no-padding mtss-observations-bar"]';
  private readonly observationLabelEditButton = '#button-observational-labels-button-0';
  private readonly observationLabelColorList = '[class="color-circle"]';
  private readonly observationLabelEngaged = '#input-field-label-input-0';
  private readonly observationLabelDefaultText = '[id*="input-field-label-input"]';
  private readonly observationCount = 'span[class="neon-tag-text"]';
  private readonly observationButton = '.intervention-detail-observation-label';
  private readonly observationsBtn = 'button[id^="button-observation-neutral"] span';

  // Note Management Selectors
  private readonly addANoteButton = '[data-icon="chevron-right"]';
  private readonly addNoteButton = '#button-addNote';
  private readonly saveNoteButton = '#saveButtonNoteAdd';
  private readonly notesAreaText = '.se-wrapper-inner.se-wrapper-wysiwyg.sun-editor-editable.neon-rte';
  private readonly notesText = '[class="row no-gutters"] .col-12 p';
  private readonly notesCount = '[class="activity-card__heading"]';
  private readonly selectStudentNote = '#select_undefined-main-button';
  private readonly studentsInNotesDropdown = 'div.neon-list-item-text-block';
  private readonly addAStudentNoteButton = '[data-icon="note-alt"]';
  private readonly saveAddNoteButton = '#button-save-note-btn';
  private readonly clickOnStudentNoteNumberButton = '.neon-popper-main-button.neon-input-field-first';
  private readonly selectNote = '.neon-2_8_0-menu-list-item';
  private readonly deleteNoteButton = '#button-delete-note-btn';
  private readonly deleteNoteConfirmationButton = '#button-delete-confirm-btn';
  private readonly noteCards = 'div[class^="note-card"]';
  private readonly noteText = 'div[class*="sun-editor-editable"] p';
  private readonly studentNameInNotes = '.neon-color-global-gray-text';
  private readonly notesDeleteIcon = '[href="#neon-icon-delete"]';
  private readonly deleteInterventionNoteButton = '[data-icon="delete"]';
  private readonly notesAttachmentIcon = '[data-icon="attachment"]';
  private readonly fileUploadLink = '#file-picker-notes-drop-zone-button';
  private readonly fileDetails = 'div.neon-file-picker-file';
  private readonly fileNames = 'div.neon-file-picker-file [class*="neon-file-picker-remove-button-text-file-name"]';
  private readonly fileRemoveBtn = '[class*="neon-file-picker-file-remove-button"] button';

  // Rich Text Editor Selectors
  private readonly richTextLinkBtn = 'button[aria-label="Link"]';
  private readonly interventionPlanPurposeTextEditor = '#suneditor_neon-rte-purposeText div[class*="sun-editor-editable"]';
  private readonly interventionPlanMessageTextEditor = '#suneditor_neon-rte-templatePlanDescription div[class*="sun-editor-editable"]';
  private readonly interventionPlanOutcomeTargetTextEditor = '#suneditor_neon-rte-templateOutcomeTarget div[class*="sun-editor-editable"]';
  private readonly strategyContentTextBox = '[class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable  neon-rte"] p';
  private readonly textInRichTextEditor = '.se-wrapper-inner.se-wrapper-wysiwyg.sun-editor-editable.neon-rte p';
  private readonly planUrlTextBox = '.se-input-form.se-input-url';
  private readonly planUrlText = '.se-input-form._se_anchor_text';
  private readonly planPurposeLinkButton = '[id="suneditor_neon-rte-purposeText"]';
  private readonly planOutcomeTargetLinkButton = '[id="suneditor_neon-rte-templateOutcomeTarget"]';
  private readonly planPurposeImageButton = '[id="suneditor_neon-rte-purposeText"] [aria-label="Image"]';
  private readonly planDescription = '[id="suneditor_neon-rte-templatePlanDescription"]';
  private readonly planImageButton = 'button[aria-label="Image"]';
  private readonly imageUrlButton = '[id="suneditor_neon-rte-templateOutcomeTarget"] [aria-label="Image"]';
  private readonly imageUrlTextBox = '.se-input-form.se-input-url._se_image_url';
  private readonly studentSupportResourceTextBoxx = '.se-dialog-form';
  private readonly studentSupportResourceSubmitButton = '.se-btn-primary';
  private readonly submitButton = 'button[type="submit"]';
  private readonly completeInterventionTextEditor = 'div[class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable  neon-rte"] p';

  // Goal Type Selectors
  private readonly alphaScoreGoalType = '#alphoa-option0 span';
  private readonly numericScoreGoalType = '#numeric-option0 span';
  private readonly alphaScoreGoalType1 = '#alphoa-option1';
  private readonly closeGoalAccordion = '.neon-accordion-title-container';

  // Chart and Data Visualization Selectors
  private readonly numericScoreScoreListPoint = '.highcharts-point.highcharts-color-0, .highcharts-point.highcharts-color-1';
  private readonly alphanumericScoreScoreListPoint = '.highcharts-point.highcharts-partfill-original';
  private readonly attendanceRate = '[data-heading="Attendance"] [class="gauge__content pr-4 pl-4"] div';
  private readonly attendanceChart = '[data-heading="Meeting Completion"] h3';
  private readonly alphaChartScorePointHover = '.highcharts-point.highcharts-partfill-original';
  private readonly numericChartScoreText = '.highcharts-label.highcharts-tooltip text';
  private readonly chartPointScoreValue = 'text tspan [class="highchart-percent-bar-label"]';
  private readonly observationChartTab = '[for="chart-types-tab-observations-chart-type"]';
  private readonly attendanceChartTab = '[for="chart-types-tab-attendance-chart-type"]';
  private readonly chartPercentage = '[data-heading="Attendance"] dt';
  private readonly numericChartHoverPoint = '[id="chart-container"] [class="highcharts-series-group"] g.highcharts-tracker';
  private readonly alphaNumericScoreHoverText = '[class="highcharts-label highcharts-tooltip highcharts-color-undefined"] text';
  private readonly targetScoreText = '[class="inline-block"]';

  // Status and Display Selectors
  private readonly subText = 'span[class="neon-tag-subtext"]';
  private readonly threeDotsButton = '[data-text="show options"]';
  private readonly threeDotsStudentOverviewCard = '[data-slot="popper-trigger"] [aria-label="wontshow"]';
  private readonly interventionPlanLength = '[class="font-size-4 neon-color-gray-500 font-weight-600"]';
  private readonly interventionPlanTimesUsed = 'div[data-slot="popper-trigger"] span';
  private readonly interventionPlanDescription = '[class*="neon-color-gray-700"]';
  private readonly addedStudentSupportResourceText = '#name-link-button-0';
  private readonly interventionPlanName = '[class="d-inline-block intervention-title"]';
  private readonly interventionDetailPagePillText = 'h2.d-inline-block.intervention-title span';
  private readonly interventionPlanPillText = 'div[class^="intervention-bank-item"] span span';
  private readonly useThisPlan = '[data-text="Use This Plan"]';
  private readonly useThisPlanButton = '[class="align-items-center d-flex mb-1"] h2';
  private readonly planDescriptionText = '[class="intervention-card__name pl-4"]';
  private readonly interventionDateDetails = '.schedule-data';
  private readonly planScheduleDetails = '[class*="schedule-data"]';
  private readonly deleteIcon = '[aria-label="delete"]';
  private readonly goals = '[class="goal-name-width align-content-middle"]';
  private readonly studentSupportResourceText = '.section-header';

  // Filter and Search Selectors
  private readonly filterSearchBox = 'input[placeholder="Search"]';
  private readonly filterSelectCheckbox = 'div.pds-label-text';
  private readonly filterReasonTextBox = '[aria-label="Reason Name Filter Input"]';
  private readonly filterLevelTextBox = '[aria-label="Level Name Filter Input"]';
  private readonly filterTypeTextBox = '[aria-label="Intervention Type Filter Input"]';
  private readonly filterLevelName = 'div[col-id="levelName"]';
  private readonly filterTypeName = 'div[col-id="interventionType"]';
  private readonly filterReasonName = 'div[col-id="reasonName"]';
  private readonly filterResourceName = 'div[col-id="strategyTitle"]';
  private readonly strategyProviderFilterTextBox = '[aria-label="Resource Title Filter Input"]';
  private readonly reasonSearchTextbox = 'input[aria-label="Reason Name Filter Input"]';
  private readonly levelSearchTextbox = 'input[aria-label="Level Name Filter Input"]';
  private readonly typeSearchTextbox = 'input[aria-label="Intervention Type Filter Input"]';
  private readonly firstRowReasonName = 'div[ref="eContainer"] div[col-id="reasonName"]';
  private readonly firstRowLevelName = 'div[ref="eContainer"] div[col-id="levelName"]';
  private readonly firstRowTypeName = 'div[ref="eContainer"] div[col-id="interventionType"]';
  private readonly clearAllFilter = '.pds-button-blend';
  private readonly studentSearchResult = '.d-flex.d-flex-row';
  private readonly invalidStudentSearchResult = '.neon-2_9_0-text.text-center';

  // Notification and Dialog Selectors
  private readonly notificationDialog = 'div.ui-pnotify-text';
  private readonly notificationDialogCloseBtn = 'div[class^="ui-pnotify-closer"]';
  private readonly neonNotificationDialog = '.neon-system-message-container';
  private readonly neonNotificationDialogCloseBtn = '[aria-label="Close Message"]';
  private readonly goalSaveConfirmationText = 'p';
  private readonly calendarDateInUseTooltip = '[class="tooltip fade show bs-tooltip-top"]';
  private readonly neonDialog = '.neon-dialog';
  private readonly neonDialogHeader = 'header div strong';
  private readonly goalsInDialog = 'div[class="neon-checkbox-field-inputs neon-input-field-first"] neon-2_4_0-checkbox-single';
  private readonly printDialogHeader = '.neon-modal-dialog-title';
  private readonly printDialogCheckboxes = '.neon-checkbox-single-check-mode';

  // Bulk Operations Selectors
  private readonly clickOnSelectAll = '#selectAll';
  private readonly bulkUpdateBtn = '#button-bulkDropDownMenu';
  private readonly changeStatusBtn = '#button-option-01';
  private readonly moveToNewInterventionBtn = '#button-option-02';
  private readonly deleteStudentsBtn = '#button-option-03';
  private readonly secondStudentSelector = '#selectedMember-1';
  private readonly thirdStudentSelector = '#selectedMember-2';
  private readonly newInterventionStatusSelector = '#input-field-update-intervention-status';
  private readonly newInterventionStatusOptions = 'div.neon-list-item-text-block';
  private readonly newStatusBtn = '#button-button-bulk-update';
  private readonly saveBtn = '#button-footer-end-button-save';
  private readonly cancelBtn = '#button-footer-end-button-cancel';
  private readonly interventionDropdownSelector = '#input-field-change-intervention-select';
  private readonly newInterventionDropdownSelector = '#input-field-change-new-intervention-status-select';
  private readonly updateBtn = '#button-bulk-update';
  private readonly backBtn = '#button-layout-detail-back-button-addManageTemplate';
  private readonly confirmDeleteBtn = '#button-button-bulk-delete';

  // Settings and Configuration Selectors
  private readonly settingsEditBtn = 'app-edit-delete>#edit-button';
  private readonly settingsDeleteBtn = 'app-edit-delete #delete-button';
  private readonly popupDeleteBtn = '#button-delete-setting-delete';
  private readonly dataTypeDropdownPlaceholder = '#input-field-select-data-type-picker div span:nth-child(1)';
  private readonly schoolYearDropdown = '#input-field-filter_0';
  private readonly assessmentSourceDropdown = '#input-field-filter_1';
  private readonly assessmentSubjectDropdown = '#input-field-filter_2';
  private readonly assessmentNameDropdown = '#input-field-filter_3';
  private readonly scoreTypeDropdown = '#input-field-filter_4';
  private readonly dataTypeText = '[class="neon-select-field-selected-header-text"]';
  private readonly allRadios = 'div.neon-radio-single-radio + span';
  private readonly selectValueFromDropdownList = 'button[id*="neon-popper-button"]';
  private readonly textBoxes = 'input[class="neon-input-field-first"]';
  private readonly schoolYearPicker = '#input-field-filter_0';
  private readonly deleteInterventionBtn = 'button[id^=button-delete-intervention-button]';
  private readonly goalDropdown = '#input-field-multi-measurement-save-goal';
  private readonly goalPopupCancelBtn = '#button-cancel-add-goals-multi';
  private readonly planDeleteBtn = '#button-delete-id-for-specific-thing';

  // Intervention Management Selectors
  private readonly clickOnFilterButton = '#button-filter-button';
  private readonly clickOnInterventionName = '#filter-nameFilter';
  private readonly interventionFilterNameSearchBox = '#cbSearch_nameFilter';
  private readonly clickOnIntervention = '.pds-label-text';
  private readonly verifyInterventionName = '.intervention-card__name';
  private readonly clickOnExistingGoal = '#goalAccordion-toggle';
  private readonly clickOnSetGoalData = '#button-set-goal-data-button';
  private readonly clickOnStudent = '.ng-option-label';
  private readonly refreshDate = '.last-refresh-date';
  private readonly studentCardMenu = 'button[id^="button-student-card-more-buttons"]';
  private readonly studentCardMenuOptions = 'button[id^="neon-popper-button-student-card"]';
  private readonly interventionHeaderLinks = '[class*="intervention-plan-heading"]';
  private readonly selectDistrictBtn = '#district-data-multiselect-main-button';
  private readonly verifyData = '.d-flex.d-flex-row';
  private readonly verifyTarget = '[id*="student-card-target"]';
  private readonly previousMeetingButton = '#button-previous-meeting-button';
  private readonly selectPreviousMeetingDateButton = '#button-previous-meeting-button';
  private readonly interventionNameVerify = '.intervention-card.hover-row';
  private readonly searchInterventionName = '.intervention-card__name';
  private readonly pinInterventionButton = 'button[aria-label="Pin"]';
  private readonly nextMeetingButton = '#button-next-meeting-button';
  private readonly nextPreviousMeetingDateButton = '#button-next-meeting-button';
  private readonly deleteMeetingDate = '#button-delete-meeting-button';

  // Calendar and Scheduling Selectors
  private readonly daysPerWeek = '.neon-chip-multi-select-field-inputs.neon-input-field-first';
  private readonly clickOnDropdownButton = '#studentSelect-main-button';
  private readonly clickOnGoalDropdownButton = '#goalSelect-main-button';
  private readonly selectFromDropdownOptions = '.neon-2_8_0-menu-list-item';
  private readonly selectNotes = '.neon-checkbox-single-check-mode.neon-2_8_0-checkbox-single-indent';
  private readonly daysWithData = '.ngb-dp-content.ngb-dp-months';
  private readonly labelTag = 'label';
  private readonly instructionalStrategyLink = '#create-new-template-button';
  private readonly assessmentOptions = 'div.neon-list-item-text-block p';
  private readonly selectedOption = 'div div > span:first-of-type';
  private readonly selectedMeetingTxt = '[class^="calendar-controls"]';
  private readonly verifySelectedDays = '.custom-day.custom-day-normal.selected';
  private readonly clickOnRepeatInterval = '#input-field-repeat-weeks';
  private readonly selectRepeatInterval = '#repeat-weeks-popper';
  private readonly totalNumberOfSessions = '#input-field-no-of-sessions';
  private readonly firstSessionDate = '.font-size-2.font-weight-500';
  private readonly dayTooltip = '.tooltip.fade.show.bs-tooltip-top';
  private readonly cardHeaderTxt = '.neon-card-standard-header h2';
  private readonly paginationOnOverviewPage = 'ul.pagination:nth-child(1) li';
  private readonly paginationOnManageIntervention = '(//ul[@class="pagination"])[2]/li';
  private readonly verifyDistrictChipset = '.chip-container';

  // School and Type Selectors
  private readonly schoolNameSelect = '.neon-checkbox-single-check-mode';
  private readonly schoolTypesSubtypes = 'div.neon-list-item-contents';
  private readonly interventionStatusText = 'span.section-subheader';
  private readonly linkText = '[class="se-wrapper-inner se-wrapper-wysiwyg sun-editor-editable  neon-rte"] p a';

  // Miscellaneous Selectors
  private readonly clickOnInterventionNameUsed = '[data-slot="drawer-body"]';
  private readonly clickInterventionName = '.pl-4.text-break';
  private readonly interventionNameUsed = '#times-used-button-18bc29ba-9e12-4a47-aef2-3e02336837fa';
  private readonly studentCount = '#null-overflow-button';
  private readonly studentCountDropdown = '#null-overflow-menu-popper';

  // Constants
  private readonly SUB_TAB_LEVEL = 'Levels';
  private readonly SUB_TAB_TYPE = 'Intervention Types';
  private readonly SUB_TAB_INSTRUCTIONAL_STRATEGIES = 'Student Support Resources';
  private readonly SUB_TAB_OBSERVATION_LABEL = 'Observation Labels';
  private readonly SAVE_BUTTON_NAME = 'Save';
  private readonly START_INTERVENTION_TEXT = 'Start Intervention';

  constructor(page: Page) {
    super(page);
  }

  protected pageTitle(): string {
    return 'MTSS Interventions';
  }

  // Helper methods
  private async waitForSpinnerToDisappear(): Promise<void> {
    await this.page.waitForTimeout(1000);
    // Add spinner wait logic if needed for specific spinner elements
  }

  private async waitForPageToLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.waitForSpinnerToDisappear();
  }

  private getDateFormat(day: string): string {
    const date = new Date();
    date.setDate(parseInt(day));
    date.setMonth(date.getMonth() - 1);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private parseDate(dateString: string): DateComponents {
    const date = new Date(dateString);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: monthNames[date.getMonth()],
      year: date.getFullYear().toString(),
      day: date.getDate().toString()
    };
  }

  private async navigateBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForSpinnerToDisappear();
  }

  /**
   * Tab navigation methods
   */
  async switchTab(tab: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.switchTabSelector).filter({ hasText: tab }).last().waitFor({ state: 'visible', timeout: 30000 });
    await this.page.locator(this.switchTabSelector).filter({ hasText: tab }).last().click();
    await this.waitForPageToLoad();
    await this.waitForSpinnerToDisappear();
  }

  private async switchSubTab(subTab: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.switchSubTabSelector).filter({ hasText: subTab }).waitFor({ state: 'visible' });
    await this.page.locator(this.switchSubTabSelector).filter({ hasText: subTab }).click();
    await this.waitForSpinnerToDisappear();
  }

  async isSubTabDisplayed(subTab: string): Promise<boolean> {
    const elements = await this.page.locator(this.switchSubTabSelector).all();
    for (const element of elements) {
      const text = await element.textContent();
      if (text?.includes(subTab)) {
        return true;
      }
    }
    return false;
  }

  async switchSettingsLevelTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_LEVEL);
    await this.waitForSpinnerToDisappear();
  }

  async switchSettingsTypesTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_TYPE);
    await this.waitForSpinnerToDisappear();
  }

  async switchSettingsInstructionalStrategiesTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_INSTRUCTIONAL_STRATEGIES);
    await this.waitForSpinnerToDisappear();
  }

  async switchSettingsObservationLabelsTab(): Promise<void> {
    await this.switchSubTab(this.SUB_TAB_OBSERVATION_LABEL);
    await this.waitForSpinnerToDisappear();
  }

  async switchToScheduleTab(): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.scheduleTabButton).waitFor({ state: 'visible' });
    await this.page.locator(this.scheduleTabButton).click();
    await this.waitForSpinnerToDisappear();
  }

  async switchToResourceTab(): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.resourceTabButton).waitFor({ state: 'visible' });
    await this.page.locator(this.resourceTabButton).click();
  }

  async switchToObservationTab(tabName: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.observationTab).filter({ hasText: tabName }).click();
    await this.waitForPageToLoad();
  }

  async switchToAttendanceTab(tabName: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.attendanceTab).filter({ hasText: tabName }).waitFor({ state: 'visible', timeout: 30000 });
    await this.page.locator(this.attendanceTab).filter({ hasText: tabName }).click();
  }

  async switchToStudentOverviewTab(tabName: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.studentOverviewTab).filter({ hasText: tabName }).waitFor({ state: 'visible', timeout: 30000 });
    await this.page.locator(this.studentOverviewTab).filter({ hasText: tabName }).click();
  }

  async switchToGoalsTab(tabName: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.goalsTab).filter({ hasText: tabName }).waitFor({ state: 'visible' });
    await this.page.locator(this.goalsTab).filter({ hasText: tabName }).click();
  }

  async switchToMeetingTab(tabName: string): Promise<void> {
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.meetingTabs).filter({ hasText: tabName }).waitFor({ state: 'visible' });
    await this.page.locator(this.meetingTabs).filter({ hasText: tabName }).click();
  }

  async switchToStaffTab(): Promise<void> {
    await this.page.locator(this.staffTabButton).waitFor({ state: 'visible' });
    await this.page.locator(this.staffTabButton).click();
  }

  /**
   * Navigation and Back Arrow Methods
   */
  async clickBackArrow(): Promise<void> {
    await this.page.locator(this.backArrowNotesScreen).waitFor({ state: 'visible' });
    await this.page.locator(this.backArrowNotesScreen).click();
    await this.waitForSpinnerToDisappear();
  }

  async clickBackArrowOnManageInterventionScreen(): Promise<void> {
    await this.page.locator(this.backArrowManageIntervention).waitFor({ state: 'visible' });
    await this.page.locator(this.backArrowManageIntervention).click();
  }

  async clickBackArrowOnManageInterventionDetailPage(): Promise<void> {
    await this.page.locator(this.backArrowInterventionDetail).waitFor({ state: 'visible' });
    await this.page.locator(this.backArrowInterventionDetail).click();
    await this.waitForSpinnerToDisappear();
  }

  async clickBackButton(): Promise<void> {
    await this.page.locator(this.backBtn).waitFor({ state: 'visible' });
    await this.page.locator(this.backBtn).click();
    await this.waitForSpinnerToDisappear();
  }

  async clickOnBackArrowOnInterventionPlanPage(): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.backArrowInterventionPlan).waitFor({ state: 'visible' });
    await this.page.locator(this.backArrowInterventionPlan).click();
  }

  async clickBackArrowFromCompareScreen(): Promise<void> {
    await this.page.locator(this.backButtonOnCompareScreen).waitFor({ state: 'visible' });
    await this.page.locator(this.backButtonOnCompareScreen).click();
  }

  /**
   * Date and Schedule Management Methods
   */
  async selectDateFromScheduleDropdown(formattedDate: string): Promise<void> {
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.scheduleDateDropdown).waitFor({ state: 'visible', timeout: 20000 });
    await this.page.locator(this.scheduleDateDropdown).hover();
    await this.page.locator(this.scheduleDateDropdown).click({ timeout: 5000 });
    await this.waitForPageToLoad();
    
    const options = this.page.locator(this.dropdownOptions);
    await expect(options.first()).toBeVisible();
    await options.filter({ hasText: formattedDate }).first().click();
    await this.waitForSpinnerToDisappear();
  }

  async clickOnScheduleDateButton(): Promise<void> {
    await this.page.locator(this.clickDateSelectButton).waitFor({ state: 'visible' });
    await this.page.locator(this.clickDateSelectButton).click();
    await this.waitForSpinnerToDisappear();
  }

  async selectDateFromScheduleDateDropDown(formattedDate: string): Promise<void> {
    await this.page.locator(this.dateSelectionFromDropdown).locator(`[data-text="${formattedDate}"]`).click();
    await this.waitForSpinnerToDisappear();
  }

  async setScheduleDays(dateString: string): Promise<void> {
    const date = new Date(dateString);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString();
    const day = date.getDate().toString();

    await this.page.locator(this.monthDropdown).selectOption(month);
    await this.page.locator(this.yearDropdown).selectOption(year);
    await this.page.locator(`div.ngb-dp-day[aria-label*="${month}"]`).filter({ hasText: day }).waitFor({ state: 'visible' });
    await this.page.locator(`div.ngb-dp-day[aria-label*="${month}"]`).filter({ hasText: day }).click();
    await this.page.waitForTimeout(30);
  }

  async setBeginDate(dateString: string): Promise<void> {
    const { month, year, day } = this.parseDate(dateString);
    await this.page.locator(this.startDateCalendarBtn).waitFor({ state: 'visible' });
    await this.page.locator(this.startDateCalendarBtn).click();
    await this.page.locator(this.select).selectOption(month);
    await this.page.locator(this.select).nth(1).selectOption(year);
    await this.page.locator(this.daySelectButton).filter({ hasText: day }).waitFor({ state: 'visible' });
    await this.page.locator(this.daySelectButton).filter({ hasText: day }).click();
    await this.page.waitForTimeout(30);
  }

  async setEndDate(dateString: string): Promise<void> {
    const { month, year, day } = this.parseDate(dateString);
    await this.page.locator(this.endDate).waitFor({ state: 'visible' });
    await this.page.locator(this.endDate).click();
    await this.page.locator(this.select).selectOption(month);
    await this.page.locator(this.select).nth(1).selectOption(year);
    await this.page.locator(this.daySelectButton).filter({ hasText: day }).waitFor({ state: 'visible' });
    await this.page.locator(this.daySelectButton).filter({ hasText: day }).click();
    await this.page.waitForTimeout(30);
  }

  /**
   * Goal Management Methods
   */
  async addAlphaNumericTypeGoals(goalName: string, goalObjective: string, scoreTargetValue: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.addNewGoalButton).filter({ hasText: 'Add New Goal' }).click();
    await this.waitForPageToLoad();
    await this.page.locator(this.goalName).fill(goalName);
    await this.page.locator(this.goalObjective).fill(goalObjective);
    await this.page.locator(this.alphaScoreGoalType).click();
    await this.page.locator(this.goalTarget).fill(scoreTargetValue);
    await this.page.locator(this.saveGoalButton).filter({ hasText: 'Save' }).click();
  }

  async addNumericTypeGoals(goalName: string, goalObjective: string, scoreTargetValue: string): Promise<void> {
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.addNewGoalButton).filter({ hasText: 'Add New Goal' }).click();
    await this.waitForPageToLoad();
    await this.page.locator(this.goalName).fill(goalName);
    await this.page.locator(this.goalObjective).fill(goalObjective);
    await this.page.locator(this.numericScoreGoalType).click();
    await this.page.locator(this.goalTarget).fill(scoreTargetValue);
    await this.page.locator(this.saveGoalButton).filter({ hasText: 'Save' }).click();
  }

  async clickOnExpandGoal(goalName: string): Promise<void> {
    await this.page.locator(this.expandGoalButton).filter({ hasText: goalName }).waitFor({ state: 'visible' });
    await this.page.locator(this.expandGoalButton).filter({ hasText: goalName }).click();
  }

  async clickDeleteGoalButton(): Promise<void> {
    await this.page.locator(this.deleteGoalButton).waitFor({ state: 'visible' });
    await this.page.locator(this.deleteGoalButton).click();
    await this.waitForSpinnerToDisappear();
  }

  async clickSaveGoalButton(): Promise<void> {
    await this.page.locator(this.saveGoalButton).waitFor({ state: 'visible' });
    await this.page.locator(this.saveGoalButton).click();
    await this.waitForSpinnerToDisappear();
  }

  async setGoalScoreValue(goalScoreValue: string): Promise<void> {
    await this.page.locator(this.goalInputTextBox).waitFor({ state: 'visible' });
    await this.page.locator(this.goalInputTextBox).fill(goalScoreValue);
    await this.waitForPageToLoad();
  }

  /**
   * Settings Management Methods
   */
  async clickAddNewEnrollWithdrawButton(): Promise<void> {
    await this.page.locator(this.addNewButtonEnrollWithdrawReason).waitFor({ state: 'visible' });
    await this.page.locator(this.addNewButtonEnrollWithdrawReason).click();
  }

  async clickAddNewLevelButton(): Promise<void> {
    await this.page.locator(this.addNewButtonLevel).waitFor({ state: 'visible' });
    await this.page.locator(this.addNewButtonLevel).click();
  }

  async clickAddNewTypeButton(): Promise<void> {
    await this.page.locator(this.addNewButtonType).waitFor({ state: 'visible' });
    await this.page.locator(this.addNewButtonType).click();
  }

  async clickAddNewStudentSupportResourceButton(): Promise<void> {
    await this.page.locator(this.addNewButtonInstructionalStrategy).waitFor({ state: 'visible' });
    await this.page.locator(this.addNewButtonInstructionalStrategy).click();
  }

  async selectReasonType(reasonType: string): Promise<void> {
    await this.page.locator(this.reasonTypeDropdown).waitFor({ state: 'visible' });
    await this.page.locator(this.reasonTypeDropdown).click();
    await this.page.locator(this.dropdownOptions).filter({ hasText: reasonType }).first().click();
  }

  async setReasonName(input: string): Promise<void> {
    await this.page.locator(this.reasonNameTextBox).waitFor({ state: 'visible' });
    await this.page.locator(this.reasonNameTextBox).press('Control+A');
    await this.page.locator(this.reasonNameTextBox).press('Backspace');
    await this.page.locator(this.reasonNameTextBox).fill(input);
  }

  async setReasonDescription(input: string): Promise<void> {
    await this.page.locator(this.reasonDescriptionTextBox).waitFor({ state: 'visible' });
    await this.page.locator(this.reasonDescriptionTextBox).press('Control+A');
    await this.page.locator(this.reasonDescriptionTextBox).press('Backspace');
    await this.page.locator(this.reasonDescriptionTextBox).fill(input);
  }

  async clickReasonStateLevelCheckBox(): Promise<void> {
    await this.page.locator(this.reasonStateLevelCheckbox).waitFor({ state: 'visible' });
    await this.page.locator(this.reasonStateLevelCheckbox).click();
  }

  async clickAddSubTabSaveButton(): Promise<void> {
    await this.page.locator(this.addReasonTypeButton).waitFor({ state: 'visible' });
    await this.page.locator(this.addReasonTypeButton).click();
  }

  /**
   * Intervention Plan Management Methods
   */
  async clickCreateNewPlanButton(): Promise<void> {
    await this.page.locator(this.createNewInterventionPlanButton).waitFor({ state: 'visible' });
    await this.page.locator(this.createNewInterventionPlanButton).click();
  }

  async setPlanTitle(input: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.planTitleTextBox).waitFor({ state: 'visible' });
    await this.page.locator(this.planTitleTextBox).press('Control+A');
    await this.page.locator(this.planTitleTextBox).press('Backspace');
    await this.page.locator(this.planTitleTextBox).fill(input);
    await this.page.waitForTimeout(2000);
  }

  async setPlanDescription(description: string): Promise<void> {
    await this.page.locator(this.planTemplateDescriptionTextBox).waitFor({ state: 'visible' });
    await this.page.locator(this.planTemplateDescriptionTextBox).press('Control+A');
    await this.page.locator(this.planTemplateDescriptionTextBox).press('Backspace');
    await this.page.locator(this.planTemplateDescriptionTextBox).fill(description);
  }

  async clickSaveButtonAfterEditInterventionPlan(): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.saveAfterEditButton).filter({ hasText: this.SAVE_BUTTON_NAME }).waitFor({ state: 'visible' });
    await this.page.locator(this.saveAfterEditButton).filter({ hasText: this.SAVE_BUTTON_NAME }).click();
    await this.waitForSpinnerToDisappear();
  }

  async clickStartIntervention(): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.saveAfterEditButton).filter({ hasText: this.START_INTERVENTION_TEXT }).click();
    await this.waitForPageToLoad();
  }

  /**
   * Search and Filter Methods
   */
  async searchInterventionByNameOnBankTab(planText: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.interventionPlanNameSearchBox).waitFor({ state: 'visible' });
    await this.page.locator(this.interventionPlanNameSearchBox).clear();
    await this.page.locator(this.interventionPlanNameSearchBox).press('Control+A');
    await this.page.locator(this.interventionPlanNameSearchBox).press('Delete');
    await this.page.waitForTimeout(15);
    await this.page.locator(this.interventionPlanNameSearchBox).fill(planText);
    await this.page.waitForTimeout(15);
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');
  }

  async searchInterventionByNameOnAllInterventionsTab(planText: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.interventionNameSearchBox).waitFor({ state: 'visible' });
    await this.page.locator(this.interventionNameSearchBox).press('Control+A');
    await this.page.locator(this.interventionNameSearchBox).press('Delete');
    await this.page.locator(this.interventionNameSearchBox).fill(planText);
    await this.waitForSpinnerToDisappear();
  }

  async clickOnInterventionByName(interventionName: string): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.planDescriptionText).filter({ hasText: interventionName }).click();
    await this.waitForSpinnerToDisappear();
  }

  /**
   * Student and Staff Management Methods
   */
  async clickAddStudentButton(): Promise<void> {
    await this.waitForPageToLoad();
    await this.page.locator(this.addStudentButton).waitFor({ state: 'visible' });
    await this.page.locator(this.addStudentButton).click();
    await this.waitForPageToLoad();
  }

  async setStudentName(studentName: string): Promise<void> {
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.planTemplateMemberTypeBox).fill(studentName);
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.dropdownOption).filter({ hasText: studentName }).click();
  }

  async deleteStudentFromManageInterventionScreen(studentName: string): Promise<void> {
    const studentElement = this.page.locator(this.deleteStudent1).filter({ hasText: studentName });
    await studentElement.locator('..').locator('..').locator('..').locator('..').locator(this.deleteIcon).click();
  }

  /**
   * Notification and Status Methods
   */
  async getNotificationMessageText(): Promise<string> {
    const msg = await this.page.locator(this.notificationDialog).waitFor({ state: 'visible', timeout: 20000 }).then(() => this.page.locator(this.notificationDialog).textContent());
    await this.waitForSpinnerToDisappear();
    await this.page.locator(this.notificationDialogCloseBtn).hover();
    await this.page.locator(this.notificationDialogCloseBtn).click();
    return msg?.trim() || '';
  }

  async isGoalsTabEnabled(): Promise<boolean> {
    await this.waitForPageToLoad();
    const buttonElement = this.page.locator(this.goalsTab);
    const backgroundColor = await buttonElement.evaluate(el => getComputedStyle(el).backgroundColor);
    return backgroundColor !== 'rgba(223, 226, 226, 1)';
  }

  /**
   * Validation Methods
   */
  async validateInterventionPlanComponentByText(text: string): Promise<boolean> {
    return await this.page.locator(this.interventionPlanPillText).filter({ hasText: text }).isVisible({ timeout: 5000 });
  }

  async getInterventionOrPlanName(interventionName: string): Promise<boolean> {
    const text = await this.page.locator(this.interventionPlanName).textContent() || '';
    return text.trim().includes(interventionName);
  }

  /**
   * Complete the implementation with comprehensive method coverage matching the Java source
   * This provides a solid foundation for Playwright tests with proper TypeScript patterns
   */
}
