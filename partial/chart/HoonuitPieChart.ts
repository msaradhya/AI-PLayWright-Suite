import { Page, Locator } from '@playwright/test';
import { HoonuitBaseChart } from './HoonuitBaseChart';

/**
 * Pie Chart implementation for Hoonuit dashboards
 * @author poojitha (converted to TypeScript)
 * @since 08-06-2021
 */
export default class HoonuitPieChart extends HoonuitBaseChart {
  // Selectors
  private readonly pieSliceSelector = 'path.highcharts-point';
  private readonly dataLabelsSelector = 'g.highcharts-data-labels text';

  constructor(page: Page, title: string) {
    super(page, title);
  }

  /**
   * Get pie chart values
   * @returns Map of pie chart slice names to values
   */
  public async getPieChartValues(): Promise<Map<string, string>> {
    const chartValues = new Map<string, string>();
    
    // Get the chart element
    const chartElement = await this.getGraphElement();
    
    // Get all pie slices
    const pieSlices = chartElement.locator(this.pieSliceSelector);
    const pieSliceCount = await pieSlices.count();
    
    // Loop through each pie slice
    for (let i = 0; i < pieSliceCount; i++) {
      // Hover over the pie slice to get the tooltip
      await pieSlices.nth(i).hover();
      
      // Get tooltip data
      const tooltipData = await this.getToolTip();
      
      if (tooltipData.length >= 2) {
        const key = tooltipData[0].trim();
        const value = tooltipData[1].trim();
        chartValues.set(key, value);
      }
    }
    
    return chartValues;
  }

  /**
   * Get pie chart labels
   * @returns Array of pie chart slice labels
   */
  public async getPieChartLabels(): Promise<string[]> {
    const chartElement = await this.getGraphElement();
    const dataLabels = chartElement.locator(this.dataLabelsSelector);
    
    const count = await dataLabels.count();
    const labels: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const labelText = await dataLabels.nth(i).innerText();
      labels.push(labelText.trim());
    }
    
    return labels;
  }

  /**
   * Click on a specific slice in the pie chart
   * @param sliceName - The slice name to click on
   */
  public async clickOnPieSlice(sliceName: string): Promise<void> {
    // Get the chart element
    const chartElement = await this.getGraphElement();
    
    // Get all pie slices
    const pieSlices = chartElement.locator(this.pieSliceSelector);
    const pieSliceCount = await pieSlices.count();
    
    // Loop through each pie slice
    for (let i = 0; i < pieSliceCount; i++) {
      const pieSlice = pieSlices.nth(i);
      
      // Hover over the pie slice to get the tooltip
      await pieSlice.hover();
      
      // Get tooltip data
      const tooltipData = await this.getToolTip();
      
      // If the slice name matches, click on it
      if (tooltipData[0] && tooltipData[0].trim() === sliceName) {
        await pieSlice.click();
        return;
      }
    }
    
    throw new Error(`Pie slice with name ${sliceName} not found in chart`);
  }

  /**
   * Get the chart element based on the title
   * @returns Locator for the chart element
   */
  public async getChartElement() {
    return this.page.locator(`.pie-chart-title`, { hasText: this.chartTitle });
  }
}