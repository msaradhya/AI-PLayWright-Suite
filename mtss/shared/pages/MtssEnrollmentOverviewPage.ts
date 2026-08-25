// Converted from Java: MtssEnrollmentOverviewPage.java
// Playwright-compatible page object implementation
import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';
import { HoonuitBarChart } from './base/HoonuitBarChart';
import { HoonuitPointChart } from './base/HoonuitPointChart';
import { HoonuitStackBarChart } from './base/HoonuitStackBarChart';

/**
 * @author Sourav.Panda (Converted to TypeScript/Playwright)
 * @since 4/8/2021
 */
export class MtssEnrollmentOverviewPage extends MtssBasePage {
  private readonly cellSelector = "div[role='gridcell']";
  private readonly mainCellSelector = "g.highcharts-axis-labels.highcharts-xaxis-labels";
  private readonly subCellSelector = "rect.highcharts-point.highcharts-color-0";
  private readonly childCellSelector = "div.dropdown-menu.dropdown-nested.show";
  private readonly subChildCellSelector = "button.dropdown-item";
  private readonly firstIdSelector = "div.ag-center-cols-container";
  private readonly secondIdSelector = "div.ellipsis-on-overflow";
  private readonly thirdIdSelector = "span.ng-star-inserted";
  private readonly subTitleSelector = "p.mb-6.ng-star-inserted";
  private readonly columnSelector = ".ag-header-cell-label";

  constructor(page: Page) {
    super(page);
  }

  pageTitle(): string {
    return 'Enrollment Overview';
  }

  getHowManyStudentsAreCurrentlyInEachSchoolChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "How many students are currently in each school?");
  }

  getGradesBeingServedByProgramsChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "What grades are being served by programs?");
  }

  getStudentDiversityChangeYearOverYearChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "How has our student diversity changed year over year?");
  }

  getStudentDiversityChangeYearOverYearTestOverrideChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "How has our student diversity changed year over year?-test Override");
  }

  getSEEnrollmentChangeYearOverYearChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "How has SE enrollment changed from year to year?");
  }

  getHowManyStudentsHaveChangedSchoolsChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "How many students have changed schools in the last 365 days?");
  }

  getHowManyStudentsAreCurrentlyInEachGradeChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "How many students are currently in each grade?");
  }

  getWhyAreStudentsMissingMyClassChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "Why are students missing my class? -test Override");
  }

  getHowManyStudentsHaveBeenEnrolledChart(): HoonuitPointChart {
    return new HoonuitPointChart(this.page, "How has our enrollment and exit numbers changed year over year?");
  }

  getEnrollmentInformationTable(): EnrollmentInformationTable {
    return new EnrollmentInformationTable(this.page, "Enrollment Information");
  }

  async getColorCode(fill: string, value: string): Promise<boolean> {
    const elements = this.page.locator("rect.highcharts-point");
    const count = await elements.count();
    
    for (let i = 0; i < count; i++) {
      const element = elements.nth(i);
      const attributeValue = await element.getAttribute(fill);
      if (attributeValue === value) {
        return true;
      }
    }
    return false;
  }

  async clickOnContextMenu(value: string): Promise<void> {
    const mainCells = this.page.locator(this.mainCellSelector);
    const targetCell = mainCells.filter({ hasText: value }).first();
    const parentElement = targetCell.locator('..');
    const subCell = parentElement.locator(this.subCellSelector).first();
    
    await subCell.scrollIntoViewIfNeeded();
    await subCell.click({ button: 'right' }); // Context click
    
    const childCell = this.page.locator(this.childCellSelector);
    const drillOption = childCell.locator(this.subChildCellSelector).filter({ hasText: ' Drill to School List ' }).first();
    await drillOption.click();
    
    await this.page.waitForTimeout(2000);
  }

  async getDataFromSchoolDetailPage(value: string): Promise<string> {
    await this.page.waitForTimeout(2000);
    const firstId = this.page.locator(this.firstIdSelector);
    const secondId = firstId.locator(this.secondIdSelector).filter({ hasText: value }).first();
    const thirdId = secondId.locator(this.thirdIdSelector);
    return await thirdId.textContent() || '';
  }

  async navigateToSchoolProfile(school: string): Promise<void> {
    await this.page.waitForTimeout(2000);
    const firstId = this.page.locator(this.firstIdSelector);
    const secondId = firstId.locator(this.secondIdSelector).filter({ hasText: school }).first();
    const thirdId = secondId.locator(this.thirdIdSelector);
    await thirdId.click();
    await this.page.waitForTimeout(10000);
  }

  async isExpectedColumnDisplayed(column: string): Promise<boolean> {
    const columnElements = this.page.locator(this.columnSelector);
    const targetColumn = columnElements.filter({ hasText: column });
    return await targetColumn.isVisible();
  }

  async isSubTitleDisplayed(subTitle: string): Promise<boolean> {
    const subTitleElements = this.page.locator(this.subTitleSelector);
    const targetSubTitle = subTitleElements.filter({ hasText: subTitle });
    return await targetSubTitle.isVisible();
  }

  getHowHasOurEnrollmentAndExitNumbersChangedYearOverYear(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, "How has our enrollment and exit numbers changed year over year?");
  }
}

/**
 * Inner class converted from Java to TypeScript
 * Enrollment Information Table for the MTSS Enrollment Overview page
 */
export class EnrollmentInformationTable {
  private readonly cellSelector = "div[role='gridcell']";
  private readonly tableSelector = "div.ag-root, app-crosstab-grid.crosstabGrid";
  protected page: Page;
  protected tableElement: Locator;
  private title: string;

  constructor(page: Page, title: string) {
    this.page = page;
    this.title = title;
    // Find the card/section with the given title and locate the table within it
    this.tableElement = page.locator(`div.card:has-text("${title}"), section:has-text("${title}")`).locator(this.tableSelector).first();
  }

  async getEnrollmentInformation(): Promise<Record<string, string>> {
    const records: Record<string, string> = {};
    const rows = await this.getRowLocators();
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const cells = row.locator(this.cellSelector);
      const cellCount = await cells.count();
      
      if (cellCount >= 2) {
        const firstCellText = await cells.nth(0).textContent() || '';
        const secondCellText = await cells.nth(1).textContent() || '';
        const arrStr = secondCellText.split(' ', 2);
        records[firstCellText.trim()] = arrStr[0]?.trim() || '';
      }
    }
    
    return records;
  }

  async getEnrollmentInformationDrillAbility(): Promise<boolean> {
    const rows = this.getRowLocators();
    const count = await rows.count();
    
    if (count > 0) {
      const firstRow = rows.first();
      const cell = firstRow.locator(this.cellSelector).first();
      // Check if cell is clickable (enabled and visible)
      const isVisible = await cell.isVisible();
      const isEnabled = await cell.isEnabled();
      return isVisible && isEnabled;
    }
    
    return false;
  }

  /**
   * Get row locators from the table
   * @returns Locator for table rows
   */
  private getRowLocators(): Locator {
    // Try AG-Grid rows first, then fallback to standard table rows
    const agGridRows = this.tableElement.locator('div[role="rowgroup"] > div[role="row"]:not(.ag-header-row)');
    return agGridRows;
  }

  /**
   * Alternative method to get rows as standard HTML table rows
   * @returns Locator for standard table rows
   */
  private getStandardTableRows(): Locator {
    return this.tableElement.locator('tbody tr');
  }

  /**
   * Check if the table exists
   * @returns Boolean indicating if table exists
   */
  async exists(): Promise<boolean> {
    return await this.tableElement.count() > 0;
  }

  /**
   * Get all rows as Locator
   * @returns Locator for all rows
   */
  getRows(): Locator {
    return this.getRowLocators();
  }
}
