import { Page } from '@playwright/test';
import { HoonuitBaseChart } from './HoonuitBaseChart';

/**
 * Point Chart implementation for Hoonuit dashboards
 * @author amittiwari (converted to TypeScript)
 * @since 06/05/21
 */
export default class HoonuitPointChart extends HoonuitBaseChart {
  
  constructor(page: Page, title: string) {
    super(page, title);
  }

  /**
   * Get the chart element by title
   * @returns Locator for the chart element
   */
  public async getChartElement() {
    return this.page.locator(`.point-chart-title`, { hasText: this.chartTitle });
  }
}
