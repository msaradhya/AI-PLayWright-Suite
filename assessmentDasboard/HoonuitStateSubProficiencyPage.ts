import { Page } from '@playwright/test';
import HoonuitBasePage from '../base/HoonuitBasePage';
import HoonuitStackBarChart from '../partial/chart/HoonuitStackBarChart';

/**
 * Page object for the State Subject Proficiency dashboard
 * Converted from Java implementation: psqa.hoonuit.shared.pages.assessmentDasboard.HoonuitStateSubProficiencyPage
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default class HoonuitStateSubProficiencyPage extends HoonuitBasePage {
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
    return "State Subject Proficiency";
  }
  
  /**
   * Get the State Achievement Mathematics Chart
   * @returns HoonuitStackBarChart instance for the state achievement mathematics chart
   */
  public getStateAchievementMathematicsChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Mathematics");
  }
  
  /**
   * Get the State Achievement ELA Chart
   * @returns HoonuitStackBarChart instance for the state achievement ELA chart
   */
  public getStateAchievementELAChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Reading & Literature");
  }
  
  /**
   * Get the State Achievement Science Chart
   * @returns HoonuitStackBarChart instance for the state achievement science chart
   */
  public getStateAchievementScienceChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Science");
  }
  
  /**
   * Get the Math Score Distribution Chart
   * @returns HoonuitStackBarChart instance for the math score distribution chart
   */
  public getMathScoreDistributionChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Math Score Distribution For All Years");
  }
  
  /**
   * Get the ELA Score Distribution Chart
   * @returns HoonuitStackBarChart instance for the ELA score distribution chart
   */
  public getELAScoreDistributionChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Reading Score Distribution For All Years");
  }
  
  /**
   * Get the Science Score Distribution Chart
   * @returns HoonuitStackBarChart instance for the science score distribution chart
   */
  public getScienceScoreDistributionChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Achievement: Science Score Distribution For All Years");
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