import { Page } from '@playwright/test';
import { MtssChart } from './MtssChart';

/**
 * Playwright/TypeScript version of HoonuitBarChart
 * Extends MtssChart to provide bar chart specific functionality
 */
export class HoonuitBarChart extends MtssChart {
  constructor(page: Page, title: string) {
    super(page, title);
  }

  // Add bar chart specific methods here
  async clickOnBar(barLabel: string): Promise<void> {
    // Implementation for clicking on a specific bar
    const barElement = this.page.locator(`g.highcharts-series`)
      .locator(`rect[aria-label*="${barLabel}"]`)
      .first();
    await barElement.click();
  }

  async getBarValues(): Promise<number[]> {
    // Implementation to get all bar values
    const dataLabels = await this.dataLabelElements();
    const values: number[] = [];
    
    for (const label of dataLabels) {
      const text = await label.textContent();
      if (text) {
        const value = parseFloat(text.trim());
        if (!isNaN(value)) {
          values.push(value);
        }
      }
    }
    
    return values;
  }
}