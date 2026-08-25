import { Page } from '@playwright/test';
import HoonuitBaseChart from './HoonuitBaseChart';

/**
 * HoonuitBarChart class for interacting with bar chart components
 * @author aradhyas (converted from Java)
 * @since 22/05/2025
 */
export class HoonuitBarChart extends HoonuitBaseChart {
  /**
   * Constructor for bar chart
   * @param page - Playwright Page object
   * @param title - Title of the card containing the chart
   * @param subChartHeader - Optional header of the sub-chart within the card
   */
  constructor(page: Page, title: string, subChartHeader?: string) {
    super(page, title, subChartHeader);
  }

  /**
   * Get bar chart specific values
   */
  public async getBarChartValues(): Promise<Map<string, string[]>> {
    return await this.getAnyChartValue();
  }

  /**
   * Get value for a specific bar
   * @param barLabel - The label of the bar to get data for
   */
  public async getBarValue(barLabel: string): Promise<string[]> {
    return await this.getAnyChartValueForLabel(barLabel);
  }

  /**
   * Get all bar labels from X-axis
   */
  public async getBarLabels(): Promise<string[]> {
    return await this.getXAxisLabels();
  }

  /**
   * Check if a specific bar exists
   * @param barLabel - The label to check for
   */
  public async hasBar(barLabel: string): Promise<boolean> {
    try {
      const labels = await this.getBarLabels();
      return labels.includes(barLabel);
    } catch {
      return false;
    }
  }

  /**
   * Get the highest value bar
   */
  public async getHighestValueBar(): Promise<{ label: string; value: string[] }> {
    const chartData = await this.getBarChartValues();
    let highestValue = 0;
    let highestBar = { label: '', value: [] as string[] };

    for (const [label, values] of chartData.entries()) {
      // Extract numeric value from the tooltip data
      const numericValue = this.extractNumericValue(values);
      if (numericValue > highestValue) {
        highestValue = numericValue;
        highestBar = { label, value: values };
      }
    }

    return highestBar;
  }

  /**
   * Extract numeric value from tooltip data
   * @param values - Tooltip data array
   */
  private extractNumericValue(values: string[]): number {
    for (const value of values) {
      const match = value.match(/\d+\.?\d*/);
      if (match) {
        return parseFloat(match[0]);
      }
    }
    return 0;
  }
}

export default HoonuitBarChart;