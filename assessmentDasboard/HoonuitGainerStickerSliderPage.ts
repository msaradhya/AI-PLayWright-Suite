import { Page } from '@playwright/test';
import HoonuitBasePage from '../base/HoonuitBasePage';
import HoonuitCrossTabGridTable from '../partial/table/HoonuitCrossTabGridTable';
import HoonuitStackBarChart from '../partial/chart/HoonuitStackBarChart';
import HoonuitPieChart from '../partial/chart/HoonuitPieChart';

/**
 * Page object for the Proficiency Gainers, Stickers, and Sliders dashboard
 * Converted from Java implementation: psqa.hoonuit.shared.pages.assessmentDasboard.HoonuitGainerStickerSliderPage
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default class HoonuitGainerStickerSliderPage extends HoonuitBasePage {
  /**
   * Constructor
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Returns the page title
   * @returns The page title string
   */
  protected pageTitle(): string {
    return "Proficiency Gainers, Stickers, and Sliders";
  }
  
  /**
   * Get the Gained Stick Slide Chart (Cross Tab Grid Table)
   * @returns HoonuitCrossTabGridTable instance for the gained/stuck/slid chart
   */
  public getGainedStickSlideChart(): HoonuitCrossTabGridTable {
    return new HoonuitCrossTabGridTable(this.page, "Who gained, stuck, and slid between ELA testing years?");
  }
  
  /**
   * Get the Gaining Chart
   * @returns HoonuitStackBarChart instance for the gaining chart
   */
  public getGainingChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Gaining in ELA");
  }
  
  /**
   * Get the Sticking Chart
   * @returns HoonuitStackBarChart instance for the sticking chart
   */
  public getStickingChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Sticking in ELA");
  }
  
  /**
   * Get the Sliding Chart
   * @returns HoonuitStackBarChart instance for the sliding chart
   */
  public getSlidingChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Sliding in ELA");
  }
  
  /**
   * Get the Gained Stick Slide Percentage Chart
   * @returns HoonuitPieChart instance for the percentage chart
   */
  public getGainedStickSlidePercentageChart(): HoonuitPieChart {
    return new HoonuitPieChart(this.page, "What percentage of students gained, stuck, or slid?");
  }
  
  /**
   * Get the New Proficiency For Student Chart
   * @returns HoonuitPieChart instance for the new proficiency levels chart
   */
  public getNewProficiencyForStudentChart(): HoonuitPieChart {
    return new HoonuitPieChart(this.page, "What are the new proficiency levels of students that gained?");
  }
  
  /**
   * Click on the Back to Graduation link
   * Equivalent to Java: $(By.linkText("Back to")).shouldBe(Condition.visible).click();
   * @returns Promise<void>
   */
  public async clickBackToGraduationLink(): Promise<void> {
    const backLink = this.page.locator('a', { hasText: 'Back to' });
    await backLink.waitFor({ state: 'visible' });
    await backLink.click();
  }
}