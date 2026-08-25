import { Page } from '@playwright/test';
import { MtssChart } from './MtssChart';

/**
 * Playwright/TypeScript version of HoonuitPointChart
 * Extends MtssChart to provide point/line chart specific functionality
 */
export class HoonuitPointChart extends MtssChart {
  constructor(page: Page, title: string) {
    super(page, title);
  }

  // Add point chart specific methods here
  async clickOnPoint(seriesName: string, pointIndex: number): Promise<void> {
    // Implementation for clicking on a specific point in the chart
    const pointElement = this.page.locator(`g.highcharts-series`)
      .filter({ hasText: seriesName })
      .locator('circle.highcharts-point')
      .nth(pointIndex);
    await pointElement.click();
  }

  async getPointValues(seriesName: string): Promise<number[]> {
    // Implementation to get all point values for a specific series
    const seriesElement = this.page.locator(`g.highcharts-series`).filter({ hasText: seriesName });
    const points = seriesElement.locator('circle.highcharts-point');
    const values: number[] = [];
    
    const count = await points.count();
    for (let i = 0; i < count; i++) {
      const point = points.nth(i);
      const yValue = await point.getAttribute('cy');
      if (yValue) {
        // Convert screen coordinate to actual value (this is a simplified approach)
        values.push(parseFloat(yValue));
      }
    }
    
    return values;
  }

  async getPointCoordinates(seriesName: string): Promise<Array<{x: number, y: number}>> {
    // Get x,y coordinates of all points in a series
    const seriesElement = this.page.locator(`g.highcharts-series`).filter({ hasText: seriesName });
    const points = seriesElement.locator('circle.highcharts-point');
    const coordinates: Array<{x: number, y: number}> = [];
    
    const count = await points.count();
    for (let i = 0; i < count; i++) {
      const point = points.nth(i);
      const x = await point.getAttribute('cx');
      const y = await point.getAttribute('cy');
      
      if (x && y) {
        coordinates.push({
          x: parseFloat(x),
          y: parseFloat(y)
        });
      }
    }
    
    return coordinates;
  }

  async hoverOverPoint(seriesName: string, pointIndex: number): Promise<void> {
    // Hover over a specific point to show tooltip
    const pointElement = this.page.locator(`g.highcharts-series`)
      .filter({ hasText: seriesName })
      .locator('circle.highcharts-point')
      .nth(pointIndex);
    await pointElement.hover();
  }

  async getTooltipText(): Promise<string> {
    // Get the text from the chart tooltip
    const tooltip = this.page.locator('g.highcharts-tooltip');
    await tooltip.waitFor({ state: 'visible' });
    return await tooltip.textContent() || '';
  }
}