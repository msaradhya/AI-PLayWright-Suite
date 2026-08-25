// Converted from Java: HoonuitMtssRetrieveDataPage.java
// Playwright-compatible page object implementation
import { Page, Locator, expect } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';

/**
 * @author Ankit.Mohapatra (Converted to TypeScript/Playwright)
 * @since 29/11/2023
 */
export class HoonuitMtssRetrieveDataPage extends MtssBasePage {
  private readonly PAGE_TITLE = "div[data-slot='body'] h1";
  private readonly MEETING_DATE_TEXT = 'h1:nth-child(1)~p';
  private readonly INTERVENTION_NAME_HEADER = '#layout-detail-back-button-retrieve-data-layout';
  private readonly GOAL_DROPDOWN = '#input-field-retrieve-goal-picker';
  private readonly DROPDOWN_OPTIONS = "button[id^='neon-popper-button'] div div p.neon-list-item-text";
  private readonly DATA_TYPE_DROPDOWN = '#input-field-retrieve-select-data-type-picker';
  private readonly DATA_TYPE_DROPDOWN_PLACEHOLDER = "#input-field-retrieve-select-data-type-picker div span:nth-child(1)";
  private readonly BEHAVIOR_TYPE_DROPDOWN = '#input-field-retrieve-behavior-type-picker';
  private readonly ALL_RADIOS = 'div.neon-radio-single-radio + span';
  private readonly SPECIFIC_START_DATE_TEXTBOX = '#input-field-timeFrameStartDate';
  private readonly SPECIFIC_END_DATE_TEXTBOX = '#input-field-timeFrameEndDate';
  private readonly ROLLING_SCHOOL_DAYS_TEXTBOX = '#input-field-rollingSchoolDays-textField';
  private readonly RETRIEVE_DATA_BTN = '#button-retrieve-submit';
  private readonly CANCEL_BTN = '#button-retrieve-cancel';
  private readonly ACTION_INCIDENT_TYPE = '#filter-button';
  private readonly DROPDOWN_SELECT_ALL = '#primartSelectAll';
  private readonly DROPDOWN_MAIN_OPTION = '.list-item-btn-label';
  private readonly DROPDOWN_SUB_OPTION = '.pds-label-text';
  private readonly PREVIEW_ROW = 'tr.bd-bottom';
  private readonly PERIODS_DROPDOWN = '#periods-multiselect-main-button';
  private readonly PERIODS_OPTIONS = 'div.neon-list-item-text-block';
  private readonly SCHOOL_YEAR_DROPDOWN = '#input-field-filter_0';
  private readonly ASSESSMENT_SOURCE_DROPDOWN = '#input-field-filter_1';
  private readonly ASSESSMENT_SUBJECT_DROPDOWN = '#input-field-filter_2';
  private readonly ASSESSMENT_NAME_DROPDOWN = '#input-field-filter_3';
  private readonly SCORE_TYPE_DROPDOWN = '#input-field-filter_4';
  private readonly CHIPS_TEXT = '.neon-chip-text';
  private readonly CHIPS_COUNT = '.neon-chip-count';
  private readonly CONTINUE_WITHOUT_SAVING_BTN = '#button-dialog-cancel-custom';
  private readonly SAVE_SETTINGS_BTN = '#button-dialog-confirm';
  private readonly CLOSE_POPUP = '#button-dialog-confirmation-close-dialog';
  private readonly ASSESSMENT_OPTIONS = 'div.neon-list-item-text-block p';
  private readonly SELECTED_OPTION = 'div div > span:first-of-type';
  private readonly CLICKON_DATATYPE_PICKER = '#input-field-select-data-type-picker';
  private readonly SELECT_VALUE_FROM_DROPDOWNLIST = "button[id*='neon-popper-button']";

  constructor(page: Page) {
    super(page);
  }

  pageTitle(): string | null {
    return null;
  }

  async waitForPage(): Promise<void> {
    await this.page.locator(this.PAGE_TITLE).waitFor({ state: 'visible', timeout: 10000 });
  }

  async getInterventionFromHeader(): Promise<string> {
    const element = this.page.locator(this.INTERVENTION_NAME_HEADER);
    await element.waitFor({ state: 'visible' });
    return (await element.getAttribute('data-text'))?.trim() || '';
  }

  async clickOnBackArrow(): Promise<void> {
    await this.page.locator(this.INTERVENTION_NAME_HEADER).click();
  }

  async clickRetrieveDataBtn2(): Promise<void> {
    const btn = this.page.locator(this.RETRIEVE_DATA_BTN);
    await btn.waitFor({ state: 'visible' });
    await expect(btn).toBeEnabled();
    await btn.click();
    // Wait for page to load and spinner to disappear
    await this.page.waitForTimeout(2000);
  }

  async clickCancelBtn(): Promise<void> {
    await this.page.locator(this.CANCEL_BTN).click();
  }

  async selectGoal(goalName: string): Promise<void> {
    await this.page.locator(this.GOAL_DROPDOWN).click();
    await this.page.locator(this.DROPDOWN_OPTIONS).filter({ hasText: goalName }).first().click();
  }

  async selectDataType(domain: string): Promise<void> {
    await this.page.locator(this.DATA_TYPE_DROPDOWN).click();
    await this.page.locator(this.DROPDOWN_OPTIONS).filter({ hasText: domain }).first().click();
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
  }

  async selectBehaviorType(behaviorType: string): Promise<void> {
    await this.page.locator(this.BEHAVIOR_TYPE_DROPDOWN).click();
    await this.page.locator(this.DROPDOWN_OPTIONS).filter({ hasText: behaviorType }).first().click();
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
  }

  /**
   * @param type Actions Type, Incidents Type
   */
  async clickOnTypeDropdown(type: string): Promise<void> {
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
    await this.page.locator(this.ACTION_INCIDENT_TYPE).filter({ hasText: type }).click();
  }

  async getChipSetText(index: number = 0): Promise<string> {
    const textElements = this.page.locator(this.CHIPS_TEXT);
    const countElements = this.page.locator(this.CHIPS_COUNT);
    
    // Wait for elements to be present
    await textElements.first().waitFor({ state: 'visible' });
    
    const text = await textElements.nth(index).textContent() || '';
    const count = await countElements.nth(index).textContent() || '';
    return text.trim() + count.trim();
  }

  async selectAllofDropdown(): Promise<void> {
    await this.page.locator(this.DROPDOWN_SELECT_ALL).click();
  }

  async clickMainOption(option: string): Promise<void> {
    await this.page.locator(this.DROPDOWN_MAIN_OPTION).filter({ hasText: option }).first().click();
  }

  async clickSubOption(option: string): Promise<void> {
    await this.page.locator(this.DROPDOWN_SUB_OPTION).filter({ hasText: option }).first().click();
  }

  /**
   * @param timeFrame Specific Dates, Rolling School Days etc.
   * @param datesOrRollingDays
   */
  async selectTimeFrame(timeFrame: string, ...datesOrRollingDays: string[]): Promise<void> {
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
    await this.selectRadioOption(timeFrame);
    
    switch (timeFrame) {
      case "Specific Dates":
        if (datesOrRollingDays.length >= 2) {
          await this.page.locator(this.SPECIFIC_START_DATE_TEXTBOX).fill(datesOrRollingDays[0]);
          await this.page.locator(this.SPECIFIC_END_DATE_TEXTBOX).fill(datesOrRollingDays[1]);
        }
        break;
      case "Rolling School Days":
        if (datesOrRollingDays.length >= 1) {
          await this.page.locator(this.ROLLING_SCHOOL_DAYS_TEXTBOX).fill(datesOrRollingDays[0]);
        }
        break;
    }
  }

  async getMeetingDate(): Promise<string> {
    await this.page.waitForLoadState('networkidle');
    const text = await this.page.locator(this.MEETING_DATE_TEXT).textContent();
    return text?.split(':')[1]?.trim() || '';
  }

  async selectRadioOption(option: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.ALL_RADIOS).filter({ hasText: option }).first().click();
  }

  async getStudents(): Promise<string[]> {
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
    const rows = this.page.locator(this.PREVIEW_ROW);
    
    // Wait for at least one row to be present
    await rows.first().waitFor({ state: 'visible' });
    
    const students: string[] = [];
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const firstCell = row.locator('td:nth-child(1)');
      const text = await firstCell.textContent();
      if (text) {
        const studentName = text.split('\n')[1]?.trim();
        if (studentName) {
          students.push(studentName);
        }
      }
    }
    
    return students;
  }

  async getScores(): Promise<string[]> {
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
    const rows = this.page.locator(this.PREVIEW_ROW);
    
    // Wait for at least one row to be present
    await rows.first().waitFor({ state: 'visible' });
    
    const scores: string[] = [];
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const secondCell = row.locator('td:nth-child(2)');
      const text = await secondCell.textContent();
      if (text) {
        scores.push(text.trim());
      }
    }
    
    return scores;
  }

  async selectPeriod(...periods: string[]): Promise<void> {
    await this.page.locator(this.PERIODS_DROPDOWN).click();
    
    for (const period of periods) {
      await this.page.locator(this.PERIODS_OPTIONS).filter({ hasText: period }).click();
    }
    
    await this.page.locator(this.DATA_TYPE_DROPDOWN).click();
  }

  async selectSchoolYear(schoolYear: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.SCHOOL_YEAR_DROPDOWN).click();
    await this.selectAssessmentOption(schoolYear);
  }

  async selectAssessmentSource(assessmentSource: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.ASSESSMENT_SOURCE_DROPDOWN).click();
    await this.selectAssessmentOption(assessmentSource);
  }

  async selectAssessmentSubject(assessmentSubject: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.ASSESSMENT_SUBJECT_DROPDOWN).click();
    await this.selectAssessmentOption(assessmentSubject);
  }

  async selectAssessmentName(assessmentName: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.ASSESSMENT_NAME_DROPDOWN).click();
    await this.selectAssessmentOption(assessmentName);
  }

  async selectScoreType(scoreType: string): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.SCORE_TYPE_DROPDOWN).click();
    await this.selectAssessmentOption(scoreType);
  }

  async clickNewDataSettingsContinueWithoutSavingBtn(): Promise<void> {
    await this.page.locator(this.CONTINUE_WITHOUT_SAVING_BTN).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator(this.CONTINUE_WITHOUT_SAVING_BTN).click();
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
  }

  async clickNewDataSettingsSaveSettingsBtn(): Promise<void> {
    await this.page.locator(this.SAVE_SETTINGS_BTN).click();
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
  }

  async clickNewDataSettingsCloseBtn(): Promise<void> {
    await this.page.locator(this.CLOSE_POPUP).click();
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
  }

  async getSelectedDataType(): Promise<string> {
    return await this.page.locator(this.DATA_TYPE_DROPDOWN_PLACEHOLDER).textContent() || '';
  }

  async getSelectedSchoolYear(): Promise<string> {
    return await this.page.locator(this.SCHOOL_YEAR_DROPDOWN).locator(this.SELECTED_OPTION).textContent() || '';
  }

  async getSelectedAssessmentSource(): Promise<string> {
    return await this.page.locator(this.ASSESSMENT_SOURCE_DROPDOWN).locator(this.SELECTED_OPTION).textContent() || '';
  }

  async getSelectedAssessmentSubject(): Promise<string> {
    return await this.page.locator(this.ASSESSMENT_SUBJECT_DROPDOWN).locator(this.SELECTED_OPTION).textContent() || '';
  }

  async getSelectedAssessmentName(): Promise<string> {
    return await this.page.locator(this.ASSESSMENT_NAME_DROPDOWN).locator(this.SELECTED_OPTION).textContent() || '';
  }

  async getSelectedScoreType(): Promise<string> {
    return await this.page.locator(this.SCORE_TYPE_DROPDOWN).locator(this.SELECTED_OPTION).textContent() || '';
  }

  private async selectAssessmentOption(option: string): Promise<void> {
    await this.page.locator(this.ASSESSMENT_OPTIONS).filter({ hasText: option }).first().click();
    await this.page.waitForTimeout(1000); // Wait for spinner to disappear
  }

  async selectPeriods(...periods: string[]): Promise<void> {
    await this.page.locator(this.PERIODS_DROPDOWN).click();
    
    for (const period of periods) {
      // Scroll into view if needed
      const periodElement = this.page.locator(this.PERIODS_OPTIONS).filter({ hasText: period });
      await periodElement.scrollIntoViewIfNeeded();
      await periodElement.click();
    }
    
    await this.page.locator(this.CLICKON_DATATYPE_PICKER).click();
    await this.page.locator(this.SELECT_VALUE_FROM_DROPDOWNLIST).filter({ hasText: "Attendance" }).first().click();
  }
}
