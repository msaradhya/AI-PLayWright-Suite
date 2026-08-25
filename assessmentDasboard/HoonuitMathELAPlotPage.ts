import { Page } from '@playwright/test';
import HoonuitBasePage from '../base/HoonuitBasePage';
import HoonuitStackBarChart from '../partial/chart/HoonuitStackBarChart';

/**
 * Page object for the State Math - Reading Comparison dashboard
 * Converted from Java implementation: psqa.hoonuit.shared.pages.assessmentDasboard.HoonuitMathELAPlotPage
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default class HoonuitMathELAPlotPage extends HoonuitBasePage {
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
    return "State Math - Reading Comparison";
  }
  
  /**
   * Get the State Math ELA Chart
   * @returns HoonuitStackBarChart instance for the state reading and math scores chart
   */
  public getStateMathELAChart(): HoonuitStackBarChart {
    return new HoonuitStackBarChart(this.page, "State Reading and Math Scores");
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