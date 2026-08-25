import { Page } from '@playwright/test';
import HoonuitBasePage from '../base/HoonuitBasePage';
import HoonuitStackBarChart from '../partial/chart/HoonuitStackBarChart';

/**
 * Page object for the State Subgroup Disproportionality dashboard
 * Converted from Java implementation: psqa.hoonuit.shared.pages.assessmentDasboard.HoonuitDisproportionalityPage
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default class HoonuitDisproportionalityPage extends HoonuitBasePage {
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
    return "State Subgroup Disproportionality";
  }
  
  /**
   * Get the Disproportionality Passing Rate Chart
   * @returns HoonuitStackBarChart instance for the passing rate chart
   */
  public getDisproportionalityPassingRateChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Are we experiencing disproportionality in our passing rates?");
  }
  
  /**
   * Get the Math Score Distribution Chart
   * @returns HoonuitStackBarChart instance for the math score distribution chart
   */
  public getMathScoreDistributionChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Math Score Distribution by Ethnicity For All Years");
  }
  
  /**
   * Get the ELA Score Distribution Chart
   * @returns HoonuitStackBarChart instance for the ELA score distribution chart
   */
  public getELAScoreDistributionChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Reading Score Distribution by Ethnicity For All Years");
  }
  
  /**
   * Get the Science Score Distribution Chart
   * @returns HoonuitStackBarChart instance for the science score distribution chart
   */
  public getScienceScoreDistributionChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Science Score Distribution by Ethnicity For All Years");
  }
  
  /**
   * Get the Social Science Score Distribution Chart
   * @returns HoonuitStackBarChart instance for the social science score distribution chart
   */
  public getSocialScienceScoreDistributionChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Social Studies Score Distribution by Ethnicity");
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