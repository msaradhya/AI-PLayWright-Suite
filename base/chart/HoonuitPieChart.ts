import { Page } from '@playwright/test';
import HoonuitBaseChart from './HoonuitBaseChart';

/**
 * HoonuitPieChart class for interacting with pie chart components
 * @author aradhyas (converted from Java)
 * @since 22/05/2025
 */
export class HoonuitPieChart extends HoonuitBaseChart {
  /**
   * Constructor for pie chart
   * @param page - Playwright Page object
   * @param title - Title of the card containing the chart
   * @param subChartHeader - Optional header of the sub-chart within the card
   */
  constructor(page: Page, title: string, subChartHeader?: string) {
    super(page, title, subChartHeader);
  }

  /**
   * Get pie chart specific values
   */
  public async getPieChartValues(): Promise<Map<string, string[]>> {
    return await this.getAnyChartValue();
  }

  /**
   * Get value for a specific pie slice
   * @param sliceLabel - The label of the slice to get data for
   */
  public async getSliceValue(sliceLabel: string): Promise<string[]> {
    return await this.getAnyChartValueForLabel(sliceLabel);
  }

  /**
   * Get all pie slice labels
   */
  public async getSliceLabels(): Promise<string[]> {
    const chartData = await this.getPieChartValues();
    return Array.from(chartData.keys());
  }

  /**
   * Check if a specific slice exists
   * @param sliceLabel - The label to check for
   */
  public async hasSlice(sliceLabel: string): Promise<boolean> {
    try {
      const labels = await this.getSliceLabels();
      return labels.includes(sliceLabel);
    } catch {
      return false;
    }
  }

  /**
   * Get the largest slice
   */
  public async getLargestSlice(): Promise<{ label: string; value: string[] }> {
    const chartData = await this.getPieChartValues();
    let largestValue = 0;
    let largestSlice = { label: '', value: [] as string[] };

    for (const [label, values] of chartData.entries()) {
      // Extract numeric value from the tooltip data
      const numericValue = this.extractNumericValue(values);
      if (numericValue > largestValue) {
        largestValue = numericValue;
        largestSlice = { label, value: values };
      }
    }

    return largestSlice;
  }

  /**
   * Get pie chart percentages
   */
  public async getSlicePercentages(): Promise<Map<string, number>> {
    const chartData = await this.getPieChartValues();
    const percentages = new Map<string, number>();

    for (const [label, values] of chartData.entries()) {
      const percentage = this.extractPercentage(values);
      percentages.set(label, percentage);
    }

    return percentages;
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

  /**
   * Extract percentage from tooltip data
   * @param values - Tooltip data array
   */
  private extractPercentage(values: string[]): number {
    for (const value of values) {
      const match = value.match(/(\d+\.?\d*)%/);
      if (match) {
        return parseFloat(match[1]);
      }
    }
    return 0;
  }
}

export default HoonuitPieChart;