import { Page } from '@playwright/test';
import HoonuitBasePage from '../base/HoonuitBasePage';
import HoonuitStackBarChart from '../partial/chart/HoonuitStackBarChart';

/**
 * Page object for the State Passing Rate dashboard
 * Converted from Java implementation: psqa.hoonuit.shared.pages.assessmentDasboard.HoonuitStatePassingRatePage
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default class HoonuitStatePassingRatePage extends HoonuitBasePage {
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
    return "State Passing Rate";
  }
  
  /**
   * Get the Passing Rate Chart
   * @returns HoonuitStackBarChart instance for the passing rate chart
   */
  public getPassingRateChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Passing Rate");
  }
  
  /**
   * Get the ELA Passing Rate By Grade Chart
   * @returns HoonuitStackBarChart instance for the ELA passing rate by grade chart
   */
  public getELAPassingRateByGradeChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "ELA Passing Rate by Grade");
  }
  
  /**
   * Get the Mathematics Passing Rate By Grade Chart
   * @returns HoonuitStackBarChart instance for the mathematics passing rate by grade chart
   */
  public getMathematicsPassingRateByGradeChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Mathematics Passing Rate by Grade");
  }
  
  /**
   * Get the ELA Passing Rate By Race Chart
   * @returns HoonuitStackBarChart instance for the ELA passing rate by race chart
   */
  public getELAPassingRateByRaceChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "ELA Passing Rate by Race");
  }
  
  /**
   * Get the Mathematics Passing Rate By Race Chart
   * @returns HoonuitStackBarChart instance for the mathematics passing rate by race chart
   */
  public getMathematicsPassingRateByRaceChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Mathematics Passing Rate by Race");
  }
  
  /**
   * Get the ELA Passing Rate By School Chart
   * @returns HoonuitStackBarChart instance for the ELA passing rate by school chart
   */
  public getELAPassingRateBySchoolChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "ELA Passing Rate by School");
  }
  
  /**
   * Get the Mathematics Passing Rate By School Chart
   * @returns HoonuitStackBarChart instance for the mathematics passing rate by school chart
   */
  public getMathematicsPassingRateBySchoolChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "Mathematics Passing Rate by School");
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