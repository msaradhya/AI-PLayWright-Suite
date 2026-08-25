import { Page } from '@playwright/test';
import { MtssChart } from './MtssChart';

/**
 * Playwright/TypeScript version of HoonuitStackBarChart
 * Extends MtssChart to provide stacked bar chart specific functionality
 */
export class HoonuitStackBarChart extends MtssChart {
  constructor(page: Page, title: string) {
    super(page, title);
  }

  // Add stacked bar chart specific methods here
  async clickOnStackedBar(seriesName: string, categoryLabel: string): Promise<void> {
    // Implementation for clicking on a specific segment of a stacked bar
    const stackElement = this.page.locator(`g.highcharts-series`)
      .locator(`rect[aria-label*="${seriesName}"][aria-label*="${categoryLabel}"]`)
      .first();
    await stackElement.click();
  }

  async getStackedBarValues(seriesName: string): Promise<number[]> {
    // Implementation to get values for a specific series in the stacked bar
    const seriesElements = this.page.locator(`g.highcharts-series`).filter({ hasText: seriesName });
    const dataLabels = seriesElements.locator('text.highcharts-data-label');
    const values: number[] = [];
    
    const count = await dataLabels.count();
    for (let i = 0; i < count; i++) {
      const text = await dataLabels.nth(i).textContent();
      if (text) {
        const value = parseFloat(text.trim());
        if (!isNaN(value)) {
          values.push(value);
        }
      }
    }
    
    return values;
  }

  async getSeriesNames(): Promise<string[]> {
    // Get all series names in the stacked bar chart
    const legendItems = this.page.locator('g.highcharts-legend-item text');
    const count = await legendItems.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await legendItems.nth(i).textContent();
      if (text) {
        names.push(text.trim());
      }
    }
    
    return names;
  }
}