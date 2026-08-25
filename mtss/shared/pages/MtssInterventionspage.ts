/**
 * Playwright/TypeScript version of MtssInterventionspage (converted from Java)
 * Comprehensive page object for MTSS Interventions functionality with complete
 * method coverage matching the Java source implementation.
 *
 * This implementation provides:
 * - Complete selector mapping from Java Selenide to Playwright
 * - All methods from the original Java class with proper async/await patterns
 * - Proper TypeScript interfaces and error handling
 * - Consistent wait strategies and element interaction patterns
 * - Enhanced support for Playwright test framework
 *
 * ========================================
 * COMPLETE FEATURE COVERAGE:
 * ========================================
 *
 * 🔧 TAB NAVIGATION:
 * - switchTab() - Switch between main tabs
 * - switchSettingsEnrollTab() - Navigate to Enroll/Withdraw Reasons
 * - switchSettingsLevelTab() - Navigate to Levels settings
 * - switchSettingsTypesTab() - Navigate to Types settings
 * - switchSettingsMemberTab() - Navigate to Member Types settings
 *
 * 🔘 BUTTON INTERACTIONS:
 * - clickAddNewButton() - Add new items
 * - clickSaveButton() - Save form data
 * - clickInterventionPlanCreateNewPlanButton() - Create new intervention plans
 * - clickAddStudentButton() - Add students to plans
 * - clickAddButton() - Generic add functionality
 * - closeButton() - Close dialogs/modals
 * - clickStartIntervention() - Start intervention process
 *
 * 📝 FORM INPUTS & DROPDOWNS:
 * - selectReasonType() - Select intervention reason types
 * - selectCompletionClass() - Select completion classifications
 * - setReasonName() - Set reason names
 * - setReasonDescription() - Set reason descriptions
 * - setLevelName() - Set intervention level names
 * - setLevelDescription() - Set level descriptions
 * - setTypeName() - Set intervention type names
 * - setTypeDescription() - Set type descriptions
 * - setSubType() - Set intervention sub-types
 * - setTypeColor() - Set type color coding
 *
 * 📅 DATE MANAGEMENT:
 * - setScheduleDays() - Set intervention schedule dates
 * - setCalendarYear() - Set calendar year selections
 * - setBeginDate() - Set intervention start dates
 * - setEndDate() - Set intervention end dates
 *
 * 📋 PLAN MANAGEMENT:
 * - setPlanTitle() - Set intervention plan titles
 * - getPlanStatus() - Get current plan status
 * - setRadioButton() - Set radio button selections
 * - setLevelDropDown() - Set level dropdown values
 * - selectInterventionType() - Select intervention types
 * - selectInterventionSubType() - Select intervention sub-types
 * - selectMultiTenantInterventionType() - Multi-tenant type selection
 * - setPlanDescription() - Set plan descriptions
 * - setPlanPurpose() - Set plan purposes
 * - setPlanMessage() - Set plan messages
 * - setOutcomeTarget() - Set outcome targets
 * - clickActivatePlanButton() - Activate specific plans
 * - clickUseThisPlanButton() - Use existing plan templates
 * - setWeeks() - Set intervention duration in weeks
 * - setMeetingsPerWeeks() - Set meeting frequency
 * - setMinutesPerWeeks() - Set meeting duration
 *
 * 👥 STUDENT MANAGEMENT:
 * - setStudentName() - Set student names for interventions
 * - setOtherDistrictStudentName() - Handle cross-district students
 * - getAllStudentNames() - Get list of all students in interventions
 * - searchByStudentIdOrName() - Search students by ID or name
 * - invalidStudentSearchGetMessage() - Get search error messages
 *
 * ✅ ATTENDANCE & OBSERVATIONS:
 * - setAttendance() - Mark student attendance
 * - setGrade() - Set observation grades
 * - setNotes() - Add intervention notes
 * - getNotes() - Retrieve intervention notes
 * - getStudentAttendance() - Check attendance status
 * - getObservation() - Get observation data
 *
 * 🎯 GOAL MANAGEMENT:
 * - setGoalName() - Set intervention goal names
 * - setGoalObjective() - Set goal objectives
 * - setGoalScoreType() - Set goal scoring types
 * - setGoalTargetScore() - Set target scores
 * - saveGoal() - Save goal configurations
 *
 * 🔄 INTERVENTION LIFECYCLE:
 * - clickManageStudentButton() - Manage student enrollments
 * - setEnrollStatusToComplete() - Complete student enrollments
 * - clickCompleteInterventionButton() - Complete interventions
 * - setCompleteIntervention() - Set completion descriptions
 * - deleteIntervention() - Delete interventions
 *
 * 🔍 FILTERING & SEARCH:
 * - clearFilters() - Clear all active filters
 * - selectActiveStatusIntervention() - Filter by active status
 * - deleteByItemName() - Delete items by name
 * - deleteReasons() - Delete intervention reasons
 * - deleteLevels() - Delete intervention levels
 * - deleteTypes() - Delete intervention types
 * - deleteInterventionPlans() - Delete intervention plans
 * - selectFilter() - Apply various filter types
 *
 * ✏️ EDITING CAPABILITIES:
 * - clickEditPlan() - Edit intervention plans
 * - multiTenantClickEditPlan() - Multi-tenant plan editing
 * - getRadioButtonStatus() - Check radio button states
 * - clickViewDetails() - View detailed information
 *
 * 📊 STATUS & DISPLAY:
 * - getInterventionPlanName() - Get plan names
 * - getInterventionStatus() - Get intervention status
 * - getStudentName() - Get student names
 * - getInterventionDate() - Get intervention dates
 * - getPlanStatus() - Get plan status information
 *
 * 🗂️ TAB NAVIGATION (Student Overview):
 * - clickOnStudentOverviewTab() - Navigate to student overview
 * - clickOnAttendanceTab() - Navigate to attendance tab
 * - clickOnObservationsTab() - Navigate to observations tab
 * - clickOnGoalsTab() - Navigate to goals tab
 *
 * 🔔 NOTIFICATION HANDLING:
 * - getSuccessfulMessage() - Get success notifications
 * - getNotificationMessageText() - Get general notifications
 * - getNeonNotificationMessageText() - Get Neon UI notifications
 * - getNeonNotificationMessageTextOfUpdatingStatus() - Get status update notifications
 *
 * ========================================
 * TECHNICAL IMPLEMENTATION DETAILS:
 * ========================================
 *
 * 🏗️ ARCHITECTURE:
 * - Extends MtssBasePage for common functionality
 * - Uses Playwright locator strategies for element selection
 * - Implements proper async/await patterns throughout
 * - Provides comprehensive error handling and timeout management
 *
 * 🎛️ SELECTOR STRATEGY:
 * - CSS selectors optimized for Playwright
 * - Consistent naming convention matching Java source
 * - Robust element identification using multiple selector types
 * - Support for dynamic content and Angular applications
 *
 * ⏱️ WAIT STRATEGIES:
 * - waitForPageToLoad() - Page loading synchronization
 * - waitForSpinnerToDisappear() - Loading indicator handling
 * - Element visibility and state waiting
 * - Network idle state management
 *
 * 🔧 HELPER METHODS:
 * - capitalizeWords() - Text formatting utility
 * - Comprehensive element interaction patterns
 * - State validation and verification methods
 * - Cross-browser compatibility considerations
 *
 * 📝 TESTING SUPPORT:
 * - Full Playwright Test framework integration
 * - Comprehensive method coverage for all user workflows
 * - Detailed error reporting and debugging support
 * - Parameterized methods for flexible test scenarios
 *
 * @example
 * ```typescript
 * // Basic usage example
 * const interventionsPage = new MtssInterventionspage(page);
 * await interventionsPage.switchTab('Plans');
 * await interventionsPage.clickInterventionPlanCreateNewPlanButton();
 * await interventionsPage.setPlanTitle('New Test Plan');
 * await interventionsPage.selectInterventionType('Academic');
 * await interventionsPage.clickSaveButton();
 *
 * // Student management example
 * await interventionsPage.clickAddStudentButton();
 * await interventionsPage.setStudentName('John Doe');
 * await interventionsPage.clickAddButton();
 * await interventionsPage.setBeginDate('2024-01-15');
 * await interventionsPage.clickStartIntervention();
 *
 * // Filtering and search example
 * await interventionsPage.clearFilters();
 * await interventionsPage.selectActiveStatusIntervention('My Plan');
 * await interventionsPage.searchByStudentIdOrName('12345');
 * ```
 *
 * @author Converted from Java to TypeScript/Playwright
 * @since 2025
 * @version 1.0.0
 * @see MtssBasePage for inherited functionality
 * @see MtssFilterData for advanced filtering capabilities
 */

import { Page, Locator, expect } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';
import { MtssFilterData } from './MtssFilterData';

// ========================================
// INTERFACES AND TYPES
// ========================================

/**
 * Enum for sort filter types (converted from Java enum)
 */
export enum SORT_FILTER {
    SORT_BY_STUDENTS = 'SORT_BY_STUDENTS',
    SORT_BY_GOALS = 'SORT_BY_GOALS',
    SORT_BY_FILTERS = 'SORT_BY_FILTERS'
}

/**
 * Main MtssInterventionspage class extending MtssBasePage
 * Provides complete functionality for MTSS Interventions page interactions
 */
export class MtssInterventionspage extends MtssBasePage {

    // ========================================
    // CSS SELECTORS - CONVERTED FROM JAVA
    // ========================================
    
    // Core Navigation Selectors
    private static readonly SWITCH_TAB = 'ul.pds-tabs li';
    private static readonly SWITCH_SUB_TAB = '.nav-link';
    
    // Button Selectors
    private static readonly ADD_NEW_BUTTON = '.pds-button';
    private static readonly ADD_STUDENT_BUTTON = '[btntext="Add Students"] button';
    private static readonly SAVE_GOAL_BUTTON = 'button[aria-label="Save goal"]';
    private static readonly DELETE_CONFIRMATION_BUTTON = '.pds-button.pds-tertiary.pds-is-active';
    
    // Form Input Selectors
    private static readonly REASON_TYPE_DROPDOWN = '#reasonType';
    private static readonly REASON_NAME_TEXT_BOX = '#reasonName';
    private static readonly REASON_DESCRIPTION_TEXT_BOX = '#reasonDesc';
    private static readonly COMPLETION_DROPDOWN = '#comClass';
    private static readonly LEVEL_NAME_TEXT_BOX = '#levelName';
    private static readonly LEVEL_DESCRIPTION_TEXT_BOX = '#levelDesc';
    private static readonly TYPE_NAME_TEXT_BOX = '#interventionType';
    private static readonly TYPE_DESCRIPTION_TEXT_BOX = '#interventionTypeDesc';
    private static readonly SUB_TYPE_TEXT_BOX = '#interventionSubtype';
    private static readonly TYPES_COLOR_TEXT_BOX = '#interventionColor';
    private static readonly PLAN_TITLE_TEXT_BOX = '#templateTitle';
    private static readonly PLAN_TEMPLATE_DESCRIPTION_TEXT_BOX = '#templateDescription';
    private static readonly PLAN_TEMPLATE_PURPOSE_TEXT_BOX = '#templatePurposeText';
    private static readonly PLAN_TEMPLATE_MESSAGE_TEXT_BOX = '#templatePlanDescription';
    private static readonly PLAN_TEMPLATE_OUTCOME_TEXT_BOX = '#templateOutcomeTarget';
    private static readonly PLAN_TEMPLATE_MEMBER_TYPE_BOX = '#addMemberSearch';
    
    // Dropdown and Selection Selectors
    private static readonly DROPDOWN_OPTION = '.ng-option';
    private static readonly VISIBILITY_RADIO_BUTTON = '.custom-control-label';
    private static readonly LEVEL_DROPDOWN = '#templateLevel';
    private static readonly INTERVENTION_TYPE = '#typeFilter';
    private static readonly INTERVENTION_SUBTYPE = '#templateType';
    
    // Date and Calendar Selectors
    private static readonly PLAN_START_DATE = 'input[name="intStartDate"]';
    private static readonly PLAN_END_DATE = 'input[name="intEndDate"]';
    private static readonly START_DATE_TEXTBOX = 'input[name="intStartDate"]';
    private static readonly END_DATE_TEXTBOX = 'input[name="intEndDate"]';
    private static readonly MONTH_DROPDOWN = 'select[aria-label="Select month"]';
    private static readonly YEAR_DROPDOWN = 'select[aria-label="Select year"]';
    private static readonly DATE_PICKER_ICON = 'button.btn-primary';
    private static readonly SET_SCHEDULE_DAYS_CALENDAR_BUTTON = 'button[aria-label="Open date range picker"]';
    private static readonly CALENDAR_DROPDOWN = 'ng-select[labelforid="school-calendar"]';
    private static readonly CALENDAR_YEAR = '.ng-option-label';
    
    // Goal Management Selectors
    private static readonly GOAL_NAME_TEXTBOX = 'input[formcontrolname="goalName"]';
    private static readonly GOAL_OBJECTIVE_TEXTBOX = 'textarea[formcontrolname="goalDescription"]';
    private static readonly GOAL_SCORE_TEXTBOX = 'input[formcontrolname="goalScoreType"]';
    private static readonly GOAL_TARGET_TEXTBOX = 'input[formcontrolname="targetScore"]';
    
    // Plan Management Selectors
    private static readonly ACTIVATE_PLAN_BUTTON = '.card-title';
    private static readonly EDIT_WEEKS = '#templateWeeks';
    private static readonly EDIT_MEETINGS = '#templateMeetings';
    private static readonly EDIT_MEETING_DURATION = '#templateMeetingDuration';
    
    // Status and Display Selectors
    private static readonly PLAN_STATUS_TEXT = 'span.pl-2';
    private static readonly MESSAGE = '.ui-pnotify-text';
    private static readonly INTERVENTION_NOTIFICATION_DIALOG = 'div.ui-pnotify-text';
    private static readonly NEON_NOTIFICATION_DIALOG = '.neon-system-message-container';
    private static readonly NEON_NOTIFICATION_DIALOG_CLOSE_BTN = '[aria-label="Close Message"]';
    
    // Attendance and Notes Selectors
    private static readonly ATTENDANCE_SELECTION_ICON = 'base-svg-icon[name="circle-plus"]';
    private static readonly INTERVENTION_NOTES_TEXT_AREA = 'textarea[aria-label="add-note-textarea"]';
    private static readonly INTERVENTION_NOTES_ADD_BUTTON = '#addNoteButton';
    
    // Filter and Search Selectors
    private static readonly REASON_NAME_SEARCH_BOX = 'input[aria-label="Reason Name Filter Input"]';
    private static readonly LEVEL_NAME_SEARCH_BOX = 'input[aria-label="Level Name Filter Input"]';
    private static readonly INTERVENTION_TYPE_SEARCH_BOX = 'input[aria-label="Intervention Type Filter Input"]';
    private static readonly INPUT_STRATEGY_TITLE = 'input[aria-label="Filter Value"]';
    private static readonly FILTER_DATA_BUTTON = 'button[aria-label="Filter Data"]';
    private static readonly STATUSES_DROPDOWN_BUTTON = 'button[aria-label="Statuses"]';
    private static readonly FILTER_SEARCH_BOX = 'input[placeholder="Search"]';
    private static readonly FILTER_SELECT_CHECKBOX = 'div.pds-label-text';
    private static readonly INTERVENTION_NAMES_DROPDOWN_BUTTON = 'button[aria-label="Intervention Names"]';
    private static readonly INTERVENTION_LEVELS_DROPDOWN_BUTTON = 'button[aria-label="Intervention Levels"]';
    private static readonly FILTER_PLANS_BUTTON = 'button[aria-label="Filter Plans"]';
    private static readonly REMOVE_DATE_RANGE_FILTER = 'button[aria-label*="Filter for Date Range: All"]';
    private static readonly REMOVE_ACTIVE_FILTER = 'button[aria-label="Filter for Active"]';
    
    // Edit and Delete Selectors
    private static readonly EDIT_ICON = 'button[aria-label="Edit/View"]';
    private static readonly MULTITENANT_EDIT_ICON = 'button[name="edit"]';
    private static readonly DELETE_ICON = 'button[name="trash"]';
    private static readonly INTERVENTION_HEADER_LABEL = 'h1.pds-page-text-primary';
    
    // Student Overview Selectors
    private static readonly ALL_INTERVENTION_STUDENT_NAMES = 'div[class *= "student-link"]';
    private static readonly SEARCH_BY_STUDENT_NAME_OR_ID_TEXTBOX = '#input-field-overview-student-search';
    private static readonly INTERVENTION_OVERVIEW_TABS = '[for*="intervention-overview-tab"]';
    private static readonly SORT_STUDENTS_DROPDOWN = '#sort-select';
    private static readonly SELECT_GOAL_DROPDOWN = '#input-field-goal-select';
    private static readonly FILTER_STATUS_MULTI_FILTER_DROPDWON = '#student-overview-multi-select-main-button';
    private static readonly MTSS_SORT_FILTER_OPTIONS = '.neon-list-item-contents';
    private static readonly INTERVENTION_OVERVIEW_SEARCH_GET_TEXT = 'div[id="intervention-overview-tab-content"] p[class="searchCriteria"]';
    
    // Display Text Selectors
    private static readonly INTERVENTION_PLAN_TEXT = '.font-weight-normal';
    private static readonly INTERVENTION_STATUS_TEXT = '.activeColor';
    private static readonly INTERVENTION_STUDENT_NAME_TEXT = '.ml-2.text-truncate';
    private static readonly INTERVENTION_DATE_TEXT = '.text-secondary';

    // ========================================
    // STRING CONSTANTS - CONVERTED FROM JAVA
    // ========================================
    
    private static readonly SUB_TAB_ENROLL = 'Enroll/Withdraw Reasons';
    private static readonly SUB_TAB_LEVEL = 'Levels';
    private static readonly SUB_TAB_TYPE = 'Types';
    private static readonly SUB_TAB_MEMBER_TYPE = 'Member Types';
    private static readonly ADD_NEW_BUTTON_NAME = ' Add New';
    private static readonly SAVE_BUTTON_NAME = 'Save';
    private static readonly CREATE_NEW_BUTTON_NAME = 'Create a New Plan';
    private static readonly ADD_STUDENT_BUTTON_NAME = 'Add Students';
    private static readonly ADD_BUTTON_NAME = 'Add';
    private static readonly CLOSE_BUTTON_NAME = 'Close';
    private static readonly START_INTERVENTION_TEXT = 'Start Intervention';
    private static readonly FILTER_ITEM_REASON_NAME = 'Reason Name';
    private static readonly FILTER_ITEM_LEVEL_NAME = 'Level Name';
    private static readonly FILTER_ITEM_INTERVENTION_TYPE = 'Intervention Type';
    
    private static readonly STUDENT_OVERVIEW_TAB = 'Student Overview';
    private static readonly ATTENDANCE_TAB = 'Attendance';
    private static readonly GOALS_TAB = 'Goals';
    private static readonly OBSERVATION_TAB = 'Observations';

    // ========================================
    // CONSTRUCTOR
    // ========================================
    
    constructor(page: Page) {
        super(page);
    }

    /**
     * Returns the expected page title for validation
     * @returns The page title string
     */
    protected pageTitle(): string | null {
        return 'Interventions';
    }

    // ========================================
    // FILTER DATA METHOD
    // ========================================

    /**
     * Get filter data instance (converted from Java getFilter method)
     * @returns New MtssFilterData instance
     */
    getFilter(): MtssFilterData {
        return new MtssFilterData(this.page);
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Helper method to wait for page load
     * Equivalent to MtssHelper.waitForPageToLoad() in Java
     */
    private async waitForPageToLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500); // Brief pause for stability
    }

    /**
     * Helper method to wait for spinner to disappear
     * Equivalent to HoonuitHelper.waitForSpinnerToDisappear() in Java
     */
    private async waitForSpinnerToDisappear(): Promise<void> {
        await this.page.waitForTimeout(1000);
        // Add specific spinner selector if available
        try {
            await this.page.waitForSelector('.spinner', { state: 'hidden', timeout: 5000 });
        } catch {
            // Spinner not found or already hidden
        }
    }

    /**
     * Capitalize first letter of each word (equivalent to WordUtils.capitalizeFully)
     * @param str Input string
     * @returns Capitalized string
     */
    private capitalizeWords(str: string): string {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    // ========================================
    // TAB NAVIGATION METHODS
    // ========================================

    /**
     * Switch to a specific tab by tab name
     * Converted from Java switchTab method
     * @param tab The tab name to switch to
     */
    async switchTab(tab: string): Promise<void> {
        await this.waitForPageToLoad();
        const tabElements = this.page.locator(MtssInterventionspage.SWITCH_TAB);
        await tabElements.filter({ hasText: tab }).last().click();
    }

    /**
     * Switch to a specific sub-tab by sub-tab name
     * Converted from Java switchSubTab method
     * @param subTab The sub-tab name to switch to
     */
    private async switchSubTab(subTab: string): Promise<void> {
        await this.waitForPageToLoad();
        const subTabElements = this.page.locator(MtssInterventionspage.SWITCH_SUB_TAB);
        await subTabElements.filter({ hasText: subTab }).waitFor({ state: 'visible' });
        await subTabElements.filter({ hasText: subTab }).click();
    }

    /**
     * Switch to the Settings Enroll tab
     * Converted from Java switchSettingsEnrollTab method
     */
    async switchSettingsEnrollTab(): Promise<void> {
        await this.waitForPageToLoad();
        await this.switchSubTab(MtssInterventionspage.SUB_TAB_ENROLL);
    }

    /**
     * Switch to the Settings Level tab
     * Converted from Java switchSettingsLevelTab method
     */
    async switchSettingsLevelTab(): Promise<void> {
        await this.switchSubTab(MtssInterventionspage.SUB_TAB_LEVEL);
        await this.waitForPageToLoad();
    }

    /**
     * Switch to the Settings Types tab
     * Converted from Java switchSettingsTypesTab method
     */
    async switchSettingsTypesTab(): Promise<void> {
        await this.switchSubTab(MtssInterventionspage.SUB_TAB_TYPE);
        await this.waitForPageToLoad();
    }

    /**
     * Switch to the Settings Member tab
     * Converted from Java switchSettingsMemberTab method
     */
    async switchSettingsMemberTab(): Promise<void> {
        await this.waitForPageToLoad();
        await this.switchSubTab(MtssInterventionspage.SUB_TAB_MEMBER_TYPE);
    }

    // ========================================
    // BUTTON INTERACTION METHODS
    // ========================================

    /**
     * Click the Add New button
     * Converted from Java clickAddNewButton method
     */
    async clickAddNewButton(): Promise<void> {
        const addNewButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await addNewButtons.filter({ hasText: MtssInterventionspage.ADD_NEW_BUTTON_NAME }).click();
    }

    /**
     * Click the Save button
     * Converted from Java clickSaveButton method
     */
    async clickSaveButton(): Promise<void> {
        const saveButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await saveButtons.filter({ hasText: MtssInterventionspage.SAVE_BUTTON_NAME }).click();
    }

    /**
     * Click Create New Plan button
     * Converted from Java clickCInterventionPlanCreateNewPlanButton method
     */
    async clickInterventionPlanCreateNewPlanButton(): Promise<void> {
        const createButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await createButtons.filter({ hasText: MtssInterventionspage.CREATE_NEW_BUTTON_NAME }).click();
    }

    /**
     * Click Add Student button
     * Converted from Java clickAddStudentButton method
     */
    async clickAddStudentButton(): Promise<void> {
        await this.waitForPageToLoad();
        const addStudentButton = this.page.locator(MtssInterventionspage.ADD_STUDENT_BUTTON);
        await addStudentButton.waitFor({ state: 'visible' });
        await addStudentButton.click();
    }

    /**
     * Click Add button
     * Converted from Java clickAddButton method
     */
    async clickAddButton(): Promise<void> {
        await this.waitForPageToLoad();
        const addButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await addButtons.filter({ hasText: MtssInterventionspage.ADD_BUTTON_NAME }).click();
    }

    /**
     * Click Close button
     * Converted from Java closeButton method
     */
    async closeButton(): Promise<void> {
        await this.waitForPageToLoad();
        const closeButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await closeButtons.filter({ hasText: MtssInterventionspage.CLOSE_BUTTON_NAME }).click();
    }

    /**
     * Click Start Intervention button
     * Converted from Java clickStartIntervention method
     */
    async clickStartIntervention(): Promise<void> {
        await this.waitForPageToLoad();
        const startButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await startButtons.filter({ hasText: MtssInterventionspage.START_INTERVENTION_TEXT }).click();
    }

    // ========================================
    // FORM INPUT METHODS
    // ========================================

    /**
     * Select reason type from dropdown
     * Converted from Java selectReasonType method
     * @param input The reason type to select
     */
    async selectReasonType(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.REASON_TYPE_DROPDOWN).click();
        const options = this.page.locator(MtssInterventionspage.DROPDOWN_OPTION);
        await options.filter({ hasText: input }).click();
    }

    /**
     * Select completion class from dropdown
     * Converted from Java selectCompletionClass method
     * @param input The completion class to select
     */
    async selectCompletionClass(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.COMPLETION_DROPDOWN).click();
        const options = this.page.locator(MtssInterventionspage.DROPDOWN_OPTION);
        await options.filter({ hasText: input }).click();
    }

    /**
     * Set reason name
     * Converted from Java setReasonName method
     * @param input The reason name to set
     */
    async setReasonName(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.REASON_NAME_TEXT_BOX).fill(input);
    }

    /**
     * Set reason description
     * Converted from Java setReasonDescription method
     * @param input The reason description to set
     */
    async setReasonDescription(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.REASON_DESCRIPTION_TEXT_BOX).fill(input);
    }

    /**
     * Get successful message text
     * Converted from Java getSuccessfulMessage method
     * @returns The success message text
     */
    async getSuccessfulMessage(): Promise<string> {
        const messageElement = this.page.locator(MtssInterventionspage.MESSAGE);
        return (await messageElement.textContent()) || '';
    }

    /**
     * Set level name
     * Converted from Java setLevelName method
     * @param input The level name to set
     */
    async setLevelName(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.LEVEL_NAME_TEXT_BOX).fill(input);
    }

    /**
     * Set level description
     * Converted from Java SetLevelDescription method
     * @param input The level description to set
     */
    async setLevelDescription(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.LEVEL_DESCRIPTION_TEXT_BOX).fill(input);
    }

    /**
     * Set type name
     * Converted from Java setTypeName method
     * @param input The type name to set
     */
    async setTypeName(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.TYPE_NAME_TEXT_BOX).fill(input);
    }

    /**
     * Set type description
     * Converted from Java SetTypeDescription method
     * @param input The type description to set
     */
    async setTypeDescription(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.TYPE_DESCRIPTION_TEXT_BOX).fill(input);
    }

    /**
     * Set sub type
     * Converted from Java setSubType method
     * @param input The sub type to set
     */
    async setSubType(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.SUB_TYPE_TEXT_BOX).fill(input);
    }

    /**
     * Set type color
     * Converted from Java SetTypeColor method
     * @param input The color value to set
     */
    async setTypeColor(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.TYPES_COLOR_TEXT_BOX).fill(input);
    }

    // ========================================
    // PLAN MANAGEMENT METHODS
    // ========================================

    /**
     * Set plan title
     * Converted from Java SetPlanTitle method
     * @param input The plan title to set
     */
    async setPlanTitle(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.PLAN_TITLE_TEXT_BOX).fill(input);
    }

    /**
     * Get plan status text
     * Converted from Java getPlanStatus method
     * @returns The plan status text
     */
    async getPlanStatus(): Promise<string> {
        const statusElement = this.page.locator(MtssInterventionspage.PLAN_STATUS_TEXT);
        await statusElement.waitFor({ state: 'visible' });
        return (await statusElement.textContent())?.trim() || '';
    }

    /**
     * Set radio button value
     * Converted from Java SetRadioButton method
     * @param value The radio button value to select
     */
    async setRadioButton(value: string): Promise<void> {
        const radioButtons = this.page.locator(MtssInterventionspage.VISIBILITY_RADIO_BUTTON);
        await radioButtons.filter({ hasText: value }).click();
    }

    /**
     * Set level dropdown value
     * Converted from Java SetLevelDropDown method
     * @param memberType The level to select
     */
    async setLevelDropDown(memberType: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.LEVEL_DROPDOWN).click();
        const options = this.page.locator(MtssInterventionspage.DROPDOWN_OPTION);
        await options.filter({ hasText: memberType }).click();
    }

    /**
     * Select intervention type
     * Converted from Java SelectInterventionType method
     * @param type The intervention type to select
     */
    async selectInterventionType(type: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.INTERVENTION_TYPE).click();
        const options = this.page.locator(MtssInterventionspage.DROPDOWN_OPTION);
        await options.filter({ hasText: type }).click();
    }

    /**
     * Select intervention sub type
     * Converted from Java SelectInterventionSubType method
     * @param type The intervention sub type to select
     */
    async selectInterventionSubType(type: string): Promise<void> {
        const subtypeDropdown = this.page.locator(MtssInterventionspage.INTERVENTION_SUBTYPE);
        await subtypeDropdown.waitFor({ state: 'visible' });
        await subtypeDropdown.click();
        const options = this.page.locator(MtssInterventionspage.DROPDOWN_OPTION);
        await options.filter({ hasText: type }).click();
    }

    /**
     * Select multi-tenant intervention type
     * Converted from Java SelectMultiTenantInterventionType method
     * @param type The intervention type to select
     */
    async selectMultiTenantInterventionType(type: string): Promise<void> {
        const subtypeDropdown = this.page.locator(MtssInterventionspage.INTERVENTION_SUBTYPE);
        await subtypeDropdown.waitFor({ state: 'visible' });
        await subtypeDropdown.click();
        const options = this.page.locator(MtssInterventionspage.DROPDOWN_OPTION);
        await options.filter({ hasText: type }).click();
    }

    /**
     * Set plan description
     * Converted from Java setPlanDescription method
     * @param memberType The plan description to set
     */
    async setPlanDescription(memberType: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.PLAN_TEMPLATE_DESCRIPTION_TEXT_BOX).fill(memberType);
    }

    /**
     * Set plan purpose
     * Converted from Java setPlanPurpose method
     * @param memberType The plan purpose to set
     */
    async setPlanPurpose(memberType: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.PLAN_TEMPLATE_PURPOSE_TEXT_BOX).fill(memberType);
    }

    /**
     * Set plan message
     * Converted from Java setPlanMessage method
     * @param memberType The plan message to set
     */
    async setPlanMessage(memberType: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.PLAN_TEMPLATE_MESSAGE_TEXT_BOX).fill(memberType);
    }

    /**
     * Set outcome target
     * Converted from Java setOutcomeTarget method
     * @param outcomeTarget The outcome target to set
     */
    async setOutcomeTarget(outcomeTarget: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.PLAN_TEMPLATE_OUTCOME_TEXT_BOX).fill(outcomeTarget);
    }

    /**
     * Click activate plan button for specific plan
     * Converted from Java clickActivatePlanButton method
     * @param planName The plan name to activate
     */
    async clickActivatePlanButton(planName: string): Promise<void> {
        const planElements = this.page.locator(MtssInterventionspage.ACTIVATE_PLAN_BUTTON);
        const planElement = planElements.filter({ hasText: planName });
        const parentContainer = planElement.locator('..').locator('..');
        const activateButton = parentContainer.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await activateButton.click();
    }

    /**
     * Click Use This Plan button for specific plan
     * Converted from Java clickUseThisPlanButton method
     * @param planName The plan name to use
     */
    async clickUseThisPlanButton(planName: string): Promise<void> {
        const planElements = this.page.locator(MtssInterventionspage.ACTIVATE_PLAN_BUTTON);
        const planElement = planElements.filter({ hasText: planName });
        const parentContainer = planElement.locator('..').locator('..').locator('..');
        const useThisPlanButtons = parentContainer.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await useThisPlanButtons.filter({ hasText: 'Use This Plan' }).click();
    }

    /**
     * Set weeks value
     * Converted from Java setWeeks method
     * @param input The weeks value to set
     */
    async setWeeks(input: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.EDIT_WEEKS).fill(input);
    }

    /**
     * Set meetings per week value
     * Converted from Java setMeetingsPerWeeks method
     * @param value The meetings per week value to set
     */
    async setMeetingsPerWeeks(value: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.EDIT_MEETINGS).fill(value);
    }

    /**
     * Set minutes per meeting value
     * Converted from Java setMinutesPerWeeks method
     * @param value The minutes per meeting value to set
     */
    async setMinutesPerWeeks(value: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.EDIT_MEETING_DURATION).fill(value);
    }

    // ========================================
    // DATE MANAGEMENT METHODS
    // ========================================

    /**
     * Set schedule days using LocalDate (converted from Java)
     * Converted from Java setScheduleDays method
     * @param dateString The date string (e.g., "2024-01-15")
     */
    async setScheduleDays(dateString: string): Promise<void> {
        const date = new Date(dateString);
        const month = this.capitalizeWords(date.toLocaleString('default', { month: 'short' }));
        const year = date.getFullYear().toString();
        const day = date.getDate().toString();
        
        const calendarButton = this.page.locator(MtssInterventionspage.SET_SCHEDULE_DAYS_CALENDAR_BUTTON);
        await calendarButton.waitFor({ state: 'visible' });
        await calendarButton.click();
        
        await this.page.locator(MtssInterventionspage.MONTH_DROPDOWN).selectOption(month);
        await this.page.locator(MtssInterventionspage.YEAR_DROPDOWN).selectOption(year);
        
        const dayElements = this.page.locator(`div.ngb-dp-day[aria-label*="${month}"]`);
        await dayElements.filter({ hasText: day }).waitFor({ state: 'visible' });
        await dayElements.filter({ hasText: day }).click();
    }

    /**
     * Set calendar year
     * Converted from Java setCalendarYear method
     * @param calendarYear The calendar year to set
     */
    async setCalendarYear(calendarYear: string): Promise<void> {
        const calendarDropdown = this.page.locator(MtssInterventionspage.CALENDAR_DROPDOWN);
        await calendarDropdown.waitFor({ state: 'visible' });
        await calendarDropdown.click();
        
        const yearOptions = this.page.locator(MtssInterventionspage.CALENDAR_YEAR);
        await yearOptions.filter({ hasText: calendarYear }).click();
    }

    /**
     * Set begin date using LocalDate (converted from Java)
     * Converted from Java setBeginDate method
     * @param dateString The date string
     */
    async setBeginDate(dateString: string): Promise<void> {
        const date = new Date(dateString);
        const month = this.capitalizeWords(date.toLocaleString('default', { month: 'short' }));
        const year = date.getFullYear().toString();
        const day = date.getDate().toString();
        
        const startDateContainer = this.page.locator(MtssInterventionspage.START_DATE_TEXTBOX).locator('..');
        const datePickerIcon = startDateContainer.locator(MtssInterventionspage.DATE_PICKER_ICON);
        await datePickerIcon.waitFor({ state: 'visible' });
        await datePickerIcon.click();
        
        await this.page.locator(MtssInterventionspage.MONTH_DROPDOWN).selectOption(month);
        await this.page.locator(MtssInterventionspage.YEAR_DROPDOWN).selectOption(year);
        
        const dayElements = this.page.locator(`div.ngb-dp-day[aria-label*="${month}"]`);
        await dayElements.filter({ hasText: day }).waitFor({ state: 'visible' });
        await dayElements.filter({ hasText: day }).click();
    }

    /**
     * Set end date using LocalDate (converted from Java)
     * Converted from Java setEndDate method
     * @param dateString The date string
     */
    async setEndDate(dateString: string): Promise<void> {
        const date = new Date(dateString);
        const month = this.capitalizeWords(date.toLocaleString('default', { month: 'short' }));
        const year = date.getFullYear().toString();
        const day = date.getDate().toString();
        
        const endDateContainer = this.page.locator(MtssInterventionspage.END_DATE_TEXTBOX).locator('..');
        const datePickerIcon = endDateContainer.locator(MtssInterventionspage.DATE_PICKER_ICON);
        await datePickerIcon.waitFor({ state: 'visible' });
        await datePickerIcon.click();
        
        await this.page.locator(MtssInterventionspage.MONTH_DROPDOWN).selectOption(month);
        await this.page.locator(MtssInterventionspage.YEAR_DROPDOWN).selectOption(year);
        
        const dayElements = this.page.locator(`div.ngb-dp-day[aria-label*="${month}"]`);
        await dayElements.filter({ hasText: day }).waitFor({ state: 'visible' });
        await dayElements.filter({ hasText: day }).click();
    }

    // ========================================
    // STUDENT MANAGEMENT METHODS
    // ========================================

    /**
     * Set student name in search box
     * Converted from Java setStudentName method
     * @param studentName The student name to set
     */
    async setStudentName(studentName: string): Promise<void> {
        await this.waitForPageToLoad();
        await this.page.locator(MtssInterventionspage.PLAN_TEMPLATE_MEMBER_TYPE_BOX).fill(studentName);
        const options = this.page.locator(MtssInterventionspage.DROPDOWN_OPTION);
        await options.filter({ hasText: studentName }).click();
    }

    /**
     * Set other district student name (returns disabled option text)
     * Converted from Java setOtherDistrictStudentName method
     * @param studentName The student name to search for
     * @returns The disabled option text
     */
    async setOtherDistrictStudentName(studentName: string): Promise<string> {
        await this.waitForPageToLoad();
        await this.page.locator(MtssInterventionspage.PLAN_TEMPLATE_MEMBER_TYPE_BOX).fill(studentName);
        const disabledOption = this.page.locator('.ng-option.ng-option-disabled.ng-star-inserted');
        await disabledOption.waitFor({ state: 'visible' });
        return (await disabledOption.textContent()) || '';
    }

    // ========================================
    // ATTENDANCE AND OBSERVATION METHODS
    // ========================================

    /**
     * Set attendance selection
     * Converted from Java setAttendance method
     */
    async setAttendance(): Promise<void> {
        await this.waitForPageToLoad();
        const attendanceIcons = this.page.locator(MtssInterventionspage.ATTENDANCE_SELECTION_ICON);
        await attendanceIcons.first().click();
    }

    /**
     * Set grade/observation (Good)
     * Converted from Java setGrade method
     */
    async setGrade(): Promise<void> {
        await this.waitForPageToLoad();
        const gradeButtons = this.page.locator('.btn');
        await gradeButtons.filter({ hasText: 'Good' }).click();
    }

    /**
     * Set intervention notes
     * Converted from Java setNotes method
     * @param notes The notes text to add
     */
    async setNotes(notes: string): Promise<void> {
        await this.waitForPageToLoad();
        const addNotesButton = this.page.locator(MtssInterventionspage.INTERVENTION_NOTES_ADD_BUTTON);
        await addNotesButton.waitFor({ state: 'visible' });
        await addNotesButton.click();
        
        const notesTextArea = this.page.locator(MtssInterventionspage.INTERVENTION_NOTES_TEXT_AREA);
        await notesTextArea.waitFor({ state: 'visible' });
        await notesTextArea.fill(notes);
        
        const postButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await postButtons.filter({ hasText: 'Post' }).click();
    }

    /**
     * Get notes text
     * Converted from Java getNotes method
     * @returns The notes text content
     */
    async getNotes(): Promise<string> {
        const notesElement = this.page.locator('p.pt-3');
        await notesElement.waitFor({ state: 'visible' });
        return (await notesElement.textContent())?.trim() || '';
    }

    // ========================================
    // INTERVENTION MANAGEMENT METHODS
    // ========================================

    /**
     * Click Manage Student button
     * Converted from Java clickManageStudentButton method
     */
    async clickManageStudentButton(): Promise<void> {
        await this.waitForPageToLoad();
        const manageButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await manageButtons.filter({ hasText: 'Manage' }).click();
    }

    /**
     * Set enroll status to complete
     * Converted from Java setEnrollStatusToComplete method
     */
    async setEnrollStatusToComplete(): Promise<void> {
        const enrollCell = this.page.locator('.ag-cell.ag-cell-not-inline-editing[col-id="0"]');
        await enrollCell.click();
        const dropdownIcon = this.page.locator('.ag-icon-small-down');
        await dropdownIcon.click();
    }

    /**
     * Click Complete Intervention button
     * Converted from Java clickCompleteInterventionButton method
     */
    async clickCompleteInterventionButton(): Promise<void> {
        await this.waitForPageToLoad();
        const completeButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await completeButtons.filter({ hasText: 'Complete Intervention' }).click();
    }

    /**
     * Set complete intervention description
     * Converted from Java setCompleteIntervention method
     * @param desc The completion description
     */
    async setCompleteIntervention(desc: string): Promise<void> {
        const descriptionField = this.page.locator('#shortDescription');
        await descriptionField.waitFor({ state: 'visible' });
        await descriptionField.fill(desc);
    }

    // ========================================
    // FILTER AND SEARCH METHODS
    // ========================================

    /**
     * Clear all filters
     * Converted from Java clearFilters method
     */
    async clearFilters(): Promise<void> {
        const dateRangeFilter = this.page.locator(MtssInterventionspage.REMOVE_DATE_RANGE_FILTER);
        await dateRangeFilter.waitFor({ state: 'visible' });
        await dateRangeFilter.click();
        
        const activeFilter = this.page.locator(MtssInterventionspage.REMOVE_ACTIVE_FILTER);
        await activeFilter.waitFor({ state: 'visible' });
        await activeFilter.click();
    }

    /**
     * Select active status intervention with specific plan name
     * Converted from Java selectActiveStatusIntervention method
     * @param planName The plan name to filter
     */
    async selectActiveStatusIntervention(planName: string): Promise<void> {
        const filterDataButton = this.page.locator(MtssInterventionspage.FILTER_DATA_BUTTON);
        await filterDataButton.waitFor({ state: 'visible' });
        await filterDataButton.click();

        const statusesDropdown = this.page.locator(MtssInterventionspage.STATUSES_DROPDOWN_BUTTON);
        await statusesDropdown.waitFor({ state: 'visible' });
        await statusesDropdown.click();

        const searchBox = this.page.locator(MtssInterventionspage.FILTER_SEARCH_BOX);
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('Active');

        const selectCheckbox = this.page.locator(MtssInterventionspage.FILTER_SELECT_CHECKBOX);
        await selectCheckbox.waitFor({ state: 'visible' });
        await selectCheckbox.click();

        const interventionNamesDropdown = this.page.locator(MtssInterventionspage.INTERVENTION_NAMES_DROPDOWN_BUTTON);
        await interventionNamesDropdown.waitFor({ state: 'visible' });
        await interventionNamesDropdown.click();

        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill(planName);
        await this.waitForPageToLoad();

        await selectCheckbox.waitFor({ state: 'visible' });
        await selectCheckbox.click();

        const headerLabel = this.page.locator(MtssInterventionspage.INTERVENTION_HEADER_LABEL);
        await headerLabel.waitFor({ state: 'visible' });
        await headerLabel.click();
    }

    /**
     * Get notification message text
     * Converted from Java getNotificationMessageText method
     * @returns The notification message text
     */
    async getNotificationMessageText(): Promise<string> {
        await this.waitForPageToLoad();
        const notificationDialog = this.page.locator(MtssInterventionspage.INTERVENTION_NOTIFICATION_DIALOG);
        await notificationDialog.waitFor({ state: 'visible' });
        return (await notificationDialog.textContent())?.trim() || '';
    }

    /**
     * Delete intervention
     * Converted from Java deleteIntervention method
     */
    async deleteIntervention(): Promise<void> {
        const deleteIcon = this.page.locator(MtssInterventionspage.DELETE_ICON);
        await deleteIcon.waitFor({ state: 'visible' });
        await deleteIcon.click();
        
        const deleteButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await deleteButtons.filter({ hasText: 'Delete' }).click();
    }

    /**
     * Delete by item name (helper method for filtering)
     * Converted from Java deleteByItemName method
     * @param itemName The item name to delete
     */
    async deleteByItemName(itemName: string): Promise<void> {
        // Wait for grid headers to load
        await this.page.waitForSelector('span[ref="eText"]', { timeout: 120000 });
        
        const headerTexts = this.page.locator('span[ref="eText"]');
        const targetHeader = headerTexts.filter({ hasText: itemName });
        const menuButton = targetHeader.locator('..').locator('..').locator('.ag-header-icon.ag-header-cell-menu-button');
        
        await menuButton.scrollIntoViewIfNeeded();
        await menuButton.waitFor({ state: 'visible' });
        await menuButton.click();
    }

    /**
     * Delete reasons by name
     * Converted from Java deleteReasons method
     * @param reasonName The reason name to delete
     * @returns true if deletion was unsuccessful (item still displayed)
     */
    async deleteReasons(reasonName: string): Promise<boolean> {
        await this.deleteByItemName(MtssInterventionspage.FILTER_ITEM_REASON_NAME);
        
        const strategyInput = this.page.locator(MtssInterventionspage.INPUT_STRATEGY_TITLE);
        await strategyInput.waitFor({ state: 'visible' });
        await strategyInput.fill(reasonName);
        
        const reasonCell = this.page.locator('div[col-id="reasonName"]').filter({ hasText: reasonName });
        const deleteIcon = reasonCell.locator('..').locator(MtssInterventionspage.DELETE_ICON);
        await deleteIcon.waitFor({ state: 'visible' });
        await deleteIcon.click();
        
        const confirmButton = this.page.locator(MtssInterventionspage.DELETE_CONFIRMATION_BUTTON);
        await confirmButton.click();
        
        // Check if item still exists
        try {
            await this.page.locator('div[col-id="reasonName"]').filter({ hasText: reasonName }).waitFor({
                state: 'visible',
                timeout: 2000
            });
            return true; // Item still displayed
        } catch {
            return false; // Item successfully deleted
        }
    }

    /**
     * Delete levels by name
     * Converted from Java deleteLevels method
     * @param levelName The level name to delete
     * @returns true if deletion was unsuccessful (item still displayed)
     */
    async deleteLevels(levelName: string): Promise<boolean> {
        await this.deleteByItemName(MtssInterventionspage.FILTER_ITEM_LEVEL_NAME);
        
        const strategyInput = this.page.locator(MtssInterventionspage.INPUT_STRATEGY_TITLE);
        await strategyInput.waitFor({ state: 'visible' });
        await strategyInput.fill(levelName);
        
        const levelCell = this.page.locator('div[col-id="levelName"]').filter({ hasText: levelName });
        const deleteIcon = levelCell.locator('..').locator(MtssInterventionspage.DELETE_ICON);
        await deleteIcon.waitFor({ state: 'visible' });
        await deleteIcon.click();
        
        const confirmButton = this.page.locator(MtssInterventionspage.DELETE_CONFIRMATION_BUTTON);
        await confirmButton.click();
        
        // Check if item still exists
        try {
            await this.page.locator('div[col-id="levelName"]').filter({ hasText: levelName }).waitFor({
                state: 'visible',
                timeout: 2000
            });
            return true; // Item still displayed
        } catch {
            return false; // Item successfully deleted
        }
    }

    /**
     * Delete types by name
     * Converted from Java deleteTypes method
     * @param types The intervention type name to delete
     * @returns true if deletion was unsuccessful (item still displayed)
     */
    async deleteTypes(types: string): Promise<boolean> {
        await this.deleteByItemName(MtssInterventionspage.FILTER_ITEM_INTERVENTION_TYPE);
        
        const strategyInput = this.page.locator(MtssInterventionspage.INPUT_STRATEGY_TITLE);
        await strategyInput.waitFor({ state: 'visible' });
        await strategyInput.fill(types);
        
        const typeCell = this.page.locator('div[col-id="interventionType"]').filter({ hasText: types });
        const deleteIcon = typeCell.locator('..').locator(MtssInterventionspage.DELETE_ICON);
        await deleteIcon.waitFor({ state: 'visible' });
        await deleteIcon.click();
        
        const confirmButton = this.page.locator(MtssInterventionspage.DELETE_CONFIRMATION_BUTTON);
        await confirmButton.click();
        
        // Check if item still exists
        try {
            await this.page.locator('div[col-id="interventionType"]').filter({ hasText: types }).waitFor({
                state: 'visible',
                timeout: 2000
            });
            return true; // Item still displayed
        } catch {
            return false; // Item successfully deleted
        }
    }

    /**
     * Delete intervention plans by level name
     * Converted from Java deleteInterventionPlans method
     * @param levelName The level name to filter and delete
     */
    async deleteInterventionPlans(levelName: string): Promise<void> {
        await this.waitForPageToLoad();
        
        const filterPlansButton = this.page.locator(MtssInterventionspage.FILTER_PLANS_BUTTON);
        await filterPlansButton.waitFor({ state: 'visible' });
        await filterPlansButton.click();

        const levelsDropdown = this.page.locator(MtssInterventionspage.INTERVENTION_LEVELS_DROPDOWN_BUTTON);
        await levelsDropdown.waitFor({ state: 'visible' });
        await levelsDropdown.click();

        const searchBox = this.page.locator(MtssInterventionspage.FILTER_SEARCH_BOX);
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill(levelName);
        await this.waitForPageToLoad();

        const selectCheckbox = this.page.locator(MtssInterventionspage.FILTER_SELECT_CHECKBOX);
        await selectCheckbox.waitFor({ state: 'visible' });
        await selectCheckbox.click();

        const headerLabel = this.page.locator(MtssInterventionspage.INTERVENTION_HEADER_LABEL);
        await headerLabel.waitFor({ state: 'visible' });
        await headerLabel.click();

        const deleteIcon = this.page.locator(MtssInterventionspage.DELETE_ICON);
        await deleteIcon.waitFor({ state: 'visible' });
        await deleteIcon.click();

        const deleteButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await deleteButtons.filter({ hasText: 'Delete' }).click();
    }

    /**
     * Click edit plan by level name
     * Converted from Java clickEditPlan method
     * @param levelName The level name to filter and edit
     */
    async clickEditPlan(levelName: string): Promise<void> {
        await this.waitForPageToLoad();
        
        const filterPlansButton = this.page.locator(MtssInterventionspage.FILTER_PLANS_BUTTON);
        await filterPlansButton.waitFor({ state: 'visible' });
        await filterPlansButton.click();

        const levelsDropdown = this.page.locator(MtssInterventionspage.INTERVENTION_LEVELS_DROPDOWN_BUTTON);
        await levelsDropdown.waitFor({ state: 'visible' });
        await levelsDropdown.click();

        const searchBox = this.page.locator(MtssInterventionspage.FILTER_SEARCH_BOX);
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill(levelName);
        await this.waitForPageToLoad();

        const selectCheckbox = this.page.locator(MtssInterventionspage.FILTER_SELECT_CHECKBOX);
        await selectCheckbox.waitFor({ state: 'visible' });
        await selectCheckbox.click();

        const headerLabel = this.page.locator(MtssInterventionspage.INTERVENTION_HEADER_LABEL);
        await headerLabel.waitFor({ state: 'visible' });
        await headerLabel.click();

        const editIcon = this.page.locator(MtssInterventionspage.EDIT_ICON);
        await editIcon.waitFor({ state: 'visible' });
        await editIcon.click();
        await this.waitForPageToLoad();
    }

    /**
     * Multi-tenant click edit plan by level name
     * Converted from Java multiTenantClickEditPlan method
     * @param levelName The level name to filter and edit
     */
    async multiTenantClickEditPlan(levelName: string): Promise<void> {
        await this.waitForPageToLoad();
        
        const filterPlansButton = this.page.locator(MtssInterventionspage.FILTER_PLANS_BUTTON);
        await filterPlansButton.waitFor({ state: 'visible' });
        await filterPlansButton.click();

        const levelsDropdown = this.page.locator(MtssInterventionspage.INTERVENTION_LEVELS_DROPDOWN_BUTTON);
        await levelsDropdown.waitFor({ state: 'visible' });
        await levelsDropdown.click();

        const searchBox = this.page.locator(MtssInterventionspage.FILTER_SEARCH_BOX);
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill(levelName);
        await this.waitForPageToLoad();

        const selectCheckbox = this.page.locator(MtssInterventionspage.FILTER_SELECT_CHECKBOX);
        await selectCheckbox.waitFor({ state: 'visible' });
        await selectCheckbox.click();

        const headerLabel = this.page.locator(MtssInterventionspage.INTERVENTION_HEADER_LABEL);
        await headerLabel.waitFor({ state: 'visible' });
        await headerLabel.click();

        const editIcon = this.page.locator(MtssInterventionspage.MULTITENANT_EDIT_ICON);
        await editIcon.waitFor({ state: 'visible' });
        await editIcon.click();
        await this.waitForPageToLoad();
    }

    // ========================================
    // STATUS AND UI STATE METHODS
    // ========================================

    /**
     * Get radio button status
     * Converted from Java getRadioButtonStatus method
     * @param radioButtonName The radio button name to check
     * @returns true if radio button is selected
     */
    async getRadioButtonStatus(radioButtonName: string): Promise<boolean> {
        const radioButtons = this.page.locator(MtssInterventionspage.VISIBILITY_RADIO_BUTTON);
        const targetRadioButton = radioButtons.filter({ hasText: radioButtonName });
        await targetRadioButton.waitFor({ state: 'attached' });
        
        const inputElement = targetRadioButton.locator('..').locator('input');
        return await inputElement.isChecked();
    }

    /**
     * Click View Details button
     * Converted from Java clickViewDetails method
     */
    async clickViewDetails(): Promise<void> {
        const viewDetailsButtons = this.page.locator(MtssInterventionspage.ADD_NEW_BUTTON);
        await viewDetailsButtons.filter({ hasText: 'View Details' }).click();
    }

    /**
     * Get intervention plan name
     * Converted from Java getInterventionPlanName method
     * @returns The intervention plan name text
     */
    async getInterventionPlanName(): Promise<string> {
        const planNameElement = this.page.locator(MtssInterventionspage.INTERVENTION_PLAN_TEXT);
        await planNameElement.waitFor({ state: 'visible' });
        return (await planNameElement.textContent())?.trim() || '';
    }

    /**
     * Get intervention status
     * Converted from Java getInterventionStatus method
     * @returns The intervention status text
     */
    async getInterventionStatus(): Promise<string> {
        const statusElement = this.page.locator(MtssInterventionspage.INTERVENTION_STATUS_TEXT);
        await statusElement.waitFor({ state: 'visible' });
        return (await statusElement.textContent())?.trim() || '';
    }

    /**
     * Get student name
     * Converted from Java getStudentName method
     * @returns The student name text
     */
    async getStudentName(): Promise<string> {
        const studentNameElement = this.page.locator(MtssInterventionspage.INTERVENTION_STUDENT_NAME_TEXT);
        await studentNameElement.waitFor({ state: 'visible' });
        return (await studentNameElement.textContent())?.trim() || '';
    }

    /**
     * Get student attendance status
     * Converted from Java getStudentAttendence method
     * @returns true if student has good attendance (green color)
     */
    async getStudentAttendance(): Promise<boolean> {
        const attendanceIcon = this.page.locator('svg.icon[style*="fill: rgb(35, 193, 65)"]');
        try {
            await attendanceIcon.waitFor({ state: 'visible', timeout: 2000 });
            const style = await attendanceIcon.getAttribute('style');
            return style?.includes('rgb(35, 193, 65)') || false;
        } catch {
            return false;
        }
    }

    /**
     * Get observation status
     * Converted from Java getObservation method
     * @param observation The observation type to check
     * @returns true if observation is active
     */
    async getObservation(observation: string): Promise<boolean> {
        const toggleButtons = this.page.locator('.btn');
        const observationButton = toggleButtons.filter({ hasText: observation });
        await observationButton.waitFor({ state: 'attached' });
        
        const classAttribute = await observationButton.getAttribute('class');
        return classAttribute?.includes('active') || false;
    }

    /**
     * Get intervention date
     * Converted from Java getInterventionDate method
     * @param date The date to search for
     * @returns The intervention date text
     */
    async getInterventionDate(date: string): Promise<string> {
        const dateElements = this.page.locator(MtssInterventionspage.INTERVENTION_DATE_TEXT);
        const dateElement = dateElements.filter({ hasText: date });
        const parentElement = dateElement.locator('..');
        const lastChild = parentElement.locator(':last-child');
        return (await lastChild.textContent()) || '';
    }

    // ========================================
    // STUDENT OVERVIEW AND NAVIGATION METHODS
    // ========================================

    /**
     * Get all student names from intervention list
     * Converted from Java getAllStudentNames method
     * @returns Array of student names
     */
    async getAllStudentNames(): Promise<string[]> {
        const studentNames: string[] = [];
        await this.waitForSpinnerToDisappear();
        
        const studentElements = this.page.locator(MtssInterventionspage.ALL_INTERVENTION_STUDENT_NAMES);
        const count = await studentElements.count();
        
        for (let i = 0; i < count; i++) {
            const studentName = await studentElements.nth(i).textContent();
            if (studentName) {
                studentNames.push(studentName.trim());
            }
        }
        
        return studentNames;
    }

    /**
     * Select filter option by type and dropdown text
     * Converted from Java selectFilter method
     * @param filter The filter type (SORT_BY_STUDENTS, SORT_BY_GOALS, SORT_BY_FILTERS)
     * @param dropDownTextName The dropdown option text to select
     */
    async selectFilter(filter: SORT_FILTER, dropDownTextName: string): Promise<void> {
        switch (filter) {
            case SORT_FILTER.SORT_BY_STUDENTS:
                await this.page.locator(MtssInterventionspage.SORT_STUDENTS_DROPDOWN).click();
                break;
            case SORT_FILTER.SORT_BY_GOALS:
                await this.page.locator(MtssInterventionspage.SELECT_GOAL_DROPDOWN).click();
                break;
            case SORT_FILTER.SORT_BY_FILTERS:
                await this.page.locator(MtssInterventionspage.FILTER_STATUS_MULTI_FILTER_DROPDWON).click();
                break;
        }
        
        const filterOptions = this.page.locator(MtssInterventionspage.MTSS_SORT_FILTER_OPTIONS);
        await filterOptions.filter({ hasText: dropDownTextName }).click();
        
        // Wait for Angular to finish (equivalent to WaitFor.waitForAngularToFinish())
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click on Student Overview tab
     * Converted from Java clickOnStudentOverviewTab method
     */
    async clickOnStudentOverviewTab(): Promise<void> {
        const overviewTabs = this.page.locator(MtssInterventionspage.INTERVENTION_OVERVIEW_TABS);
        await overviewTabs.filter({ hasText: MtssInterventionspage.STUDENT_OVERVIEW_TAB }).click();
        await this.waitForSpinnerToDisappear();
    }

    /**
     * Click on Attendance tab
     * Converted from Java clickOnAttendanceTab method
     */
    async clickOnAttendanceTab(): Promise<void> {
        const attendanceTabs = this.page.locator(MtssInterventionspage.INTERVENTION_OVERVIEW_TABS);
        await attendanceTabs.filter({ hasText: MtssInterventionspage.ATTENDANCE_TAB }).click();
        await this.waitForSpinnerToDisappear();
    }

    /**
     * Click on Observations tab
     * Converted from Java clickOnObservationsTab method
     */
    async clickOnObservationsTab(): Promise<void> {
        const observationTabs = this.page.locator(MtssInterventionspage.INTERVENTION_OVERVIEW_TABS);
        await observationTabs.filter({ hasText: MtssInterventionspage.OBSERVATION_TAB }).click();
        await this.waitForSpinnerToDisappear();
    }

    /**
     * Click on Goals tab
     * Converted from Java clickOnGoalsTab method
     */
    async clickOnGoalsTab(): Promise<void> {
        const goalsTabs = this.page.locator(MtssInterventionspage.INTERVENTION_OVERVIEW_TABS);
        await goalsTabs.filter({ hasText: MtssInterventionspage.GOALS_TAB }).click();
        await this.waitForSpinnerToDisappear();
    }

    /**
     * Search by student ID or name
     * Converted from Java searchByStudentIdOrName method
     * @param searchText The search text (student ID or name)
     */
    async searchByStudentIdOrName(searchText: string): Promise<void> {
        const searchTextbox = this.page.locator(MtssInterventionspage.SEARCH_BY_STUDENT_NAME_OR_ID_TEXTBOX);
        await searchTextbox.waitFor({ state: 'visible', timeout: 5000 });
        await searchTextbox.clear();
        await searchTextbox.fill(searchText);
        
        // Wait for Angular to finish (equivalent to HoonuitHelper.waitForAngularToFinish())
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Get invalid student search message
     * Converted from Java invalidStudentSearchGetMessage method
     * @returns The search error message text
     */
    async invalidStudentSearchGetMessage(): Promise<string> {
        const messageElement = this.page.locator(MtssInterventionspage.INTERVENTION_OVERVIEW_SEARCH_GET_TEXT);
        return (await messageElement.textContent()) || '';
    }

    // ========================================
    // NOTIFICATION METHODS
    // ========================================

    /**
     * Get Neon notification message text
     * Converted from Java getNeonNotificationMessageText method
     * @returns The notification message text
     */
    async getNeonNotificationMessageText(): Promise<string> {
        const notificationDialog = this.page.locator(MtssInterventionspage.NEON_NOTIFICATION_DIALOG);
        await notificationDialog.waitFor({ state: 'visible', timeout: 20000 });
        const messageText = (await notificationDialog.textContent())?.trim() || '';
        
        await this.waitForSpinnerToDisappear();
        
        const closeButton = this.page.locator(MtssInterventionspage.NEON_NOTIFICATION_DIALOG_CLOSE_BTN);
        await closeButton.hover();
        await closeButton.click();
        
        return messageText;
    }

    /**
     * Get Neon notification message text for updating status (without closing)
     * Converted from Java getNeonNotificationMessageTextOfUpdatingStatus method
     * @returns The notification message text
     */
    async getNeonNotificationMessageTextOfUpdatingStatus(): Promise<string> {
        const notificationDialog = this.page.locator(MtssInterventionspage.NEON_NOTIFICATION_DIALOG);
        await notificationDialog.waitFor({ state: 'visible', timeout: 20000 });
        const messageText = (await notificationDialog.textContent())?.trim() || '';
        
        await this.waitForSpinnerToDisappear();
        return messageText;
    }

    // ========================================
    // GOAL MANAGEMENT METHODS (MISSING FROM TYPESCRIPT)
    // ========================================

    /**
     * Set goal name
     * Additional method for goal management
     * @param goalName The goal name to set
     */
    async setGoalName(goalName: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.GOAL_NAME_TEXTBOX).fill(goalName);
    }

    /**
     * Set goal objective
     * Additional method for goal management
     * @param objective The goal objective to set
     */
    async setGoalObjective(objective: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.GOAL_OBJECTIVE_TEXTBOX).fill(objective);
    }

    /**
     * Set goal score type
     * Additional method for goal management
     * @param scoreType The goal score type to set
     */
    async setGoalScoreType(scoreType: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.GOAL_SCORE_TEXTBOX).fill(scoreType);
    }

    /**
     * Set goal target score
     * Additional method for goal management
     * @param targetScore The target score to set
     */
    async setGoalTargetScore(targetScore: string): Promise<void> {
        await this.page.locator(MtssInterventionspage.GOAL_TARGET_TEXTBOX).fill(targetScore);
    }

    /**
     * Save goal
     * Additional method for goal management
     */
    async saveGoal(): Promise<void> {
        await this.page.locator(MtssInterventionspage.SAVE_GOAL_BUTTON).click();
    }
}
