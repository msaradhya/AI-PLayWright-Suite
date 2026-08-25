import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PlanOverviewPage extends BasePage {
  readonly planOverviewHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.planOverviewHeading = page.getByRole('heading', { name: /Plan Overview/i });
  }

  async waitForLoad(timeout = 120000): Promise<void> {
    // Wait for the main Plan Overview heading or fallback to a unique chart heading
    await this.waitForTimeout(20000); // Give extra time for slow dashboards
    await this.planOverviewHeading.waitFor({ state: 'visible', timeout });
  }

  async validateAllMetrics(timeout = 60000) {
    // Wait and validate each metric/chart
    const chartHeadings = [
      'Active Plans by template',
      'Completed Plans by template',
      'Active plans by grade level',
      'Active plans by Ethnicity',
      'Active plans by school',
      'Active plans by SPED/ELL/Gen Ed',
      'Active plans by program',
    ];
    for (const chartName of chartHeadings) {
      // Try to find the heading by role, then fallback to any element containing the text
      let heading = this.page.getByRole('heading', { name: new RegExp(chartName, 'i') });
      try {
        await heading.waitFor({ state: 'visible', timeout });
      } catch {
        // Fallback: any element containing the text
        heading = this.page.locator(`:text-matches("${chartName}", "i")`).first();
        await heading.waitFor({ state: 'visible', timeout });
      }
      // Find the card container for this chart (parent of heading)
      const card = heading.locator('xpath=ancestor::*[contains(@class,"pds-panel")]').first();
      // Wait for both spinner types to disappear in this card
      await card.locator('.c-dashboard-object-container__spinner').waitFor({ state: 'detached', timeout });
      await card.locator('pds-loader').waitFor({ state: 'detached', timeout });
      // Pass the test if the SVG is present and visible, regardless of bar count
      const svg = card.locator('svg');
      await expect(svg.first()).toBeVisible({ timeout });
    }
  }
}
