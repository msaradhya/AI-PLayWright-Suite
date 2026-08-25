import { Page } from '@playwright/test';
import HoonuitBaseChart from './HoonuitBaseChart';

/**
 * HoonuitPointChart class for interacting with point/line chart components
 * @author aradhyas (converted from Java)
 * @since 22/05/2025
 */
export class HoonuitPointChart extends HoonuitBaseChart {
  /**
   * Constructor for point chart
   * @param page - Playwright Page object
   * @param title - Title of the card containing the chart
   * @param subChartHeader - Optional header of the sub-chart within the card
   */
  constructor(page: Page, title: string, subChartHeader?: string) {
    super(page, title, subChartHeader);
  }

  /**
   * Get point chart specific values
   */
  public async getPointChartValues(): Promise<Map<string, string[]>> {
    return await this.getAnyChartValue();
  }

  /**
   * Get value for a specific point
   * @param pointLabel - The label of the point to get data for
   */
  public async getPointValue(pointLabel: string): Promise<string[]> {
    return await this.getAnyChartValueForLabel(pointLabel);
  }

  /**
   * Get all point labels from X-axis
   */
  public async getPointLabels(): Promise<string[]> {
    return await this.getXAxisLabels();
  }

  /**
   * Get Y-axis point labels
   */
  public async getYAxisPointLabels(): Promise<string[]> {
    return await this.getYAxisLabels();
  }

  /**
   * Check if a specific point exists
   * @param pointLabel - The label to check for
   */
  public async hasPoint(pointLabel: string): Promise<boolean> {
    try {
      const labels = await this.getPointLabels();
      return labels.includes(pointLabel);
    } catch {
      return false;
    }
  }

  /**
   * Get the highest point value
   */
  public async getHighestPoint(): Promise<{ label: string; value: string[] }> {
    const chartData = await this.getPointChartValues();
    let highestValue = -Infinity;
    let highestPoint = { label: '', value: [] as string[] };

    for (const [label, values] of chartData.entries()) {
      const numericValue = this.extractNumericValue(values);
      if (numericValue > highestValue) {
        highestValue = numericValue;
        highestPoint = { label, value: values };
      }
    }

    return highestPoint;
  }

  /**
   * Get the lowest point value
   */
  public async getLowestPoint(): Promise<{ label: string; value: string[] }> {
    const chartData = await this.getPointChartValues();
    let lowestValue = Infinity;
    let lowestPoint = { label: '', value: [] as string[] };

    for (const [label, values] of chartData.entries()) {
      const numericValue = this.extractNumericValue(values);
      if (numericValue < lowestValue) {
        lowestValue = numericValue;
        lowestPoint = { label, value: values };
      }
    }

    return lowestPoint;
  }

  /**
   * Get trend analysis (increasing, decreasing, stable)
   */
  public async getTrend(): Promise<'increasing' | 'decreasing' | 'stable'> {
    const chartData = await this.getPointChartValues();
    const values: number[] = [];
    
    for (const [, tooltipData] of chartData.entries()) {
      const numericValue = this.extractNumericValue(tooltipData);
      values.push(numericValue);
    }

    if (values.length < 2) return 'stable';

    let increasingCount = 0;
    let decreasingCount = 0;

    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) {
        increasingCount++;
      } else if (values[i] < values[i - 1]) {
        decreasingCount++;
      }
    }

    if (increasingCount > decreasingCount) return 'increasing';
    if (decreasingCount > increasingCount) return 'decreasing';
    return 'stable';
  }

  /**
   * Get points within a specific value range
   * @param min - Minimum value
   * @param max - Maximum value
   */
  public async getPointsInRange(min: number, max: number): Promise<Map<string, string[]>> {
    const allData = await this.getPointChartValues();
    const filteredData = new Map<string, string[]>();

    for (const [label, values] of allData.entries()) {
      const numericValue = this.extractNumericValue(values);
      if (numericValue >= min && numericValue <= max) {
        filteredData.set(label, values);
      }
    }

    return filteredData;
  }

  /**
   * Get average value of all points
   */
  public async getAverageValue(): Promise<number> {
    const chartData = await this.getPointChartValues();
    let total = 0;
    let count = 0;

    for (const [, values] of chartData.entries()) {
      const numericValue = this.extractNumericValue(values);
      total += numericValue;
      count++;
    }

    return count > 0 ? total / count : 0;
  }

  /**
   * Extract numeric value from tooltip data
   * @param values - Tooltip data array
   */
  private extractNumericValue(values: string[]): number {
    for (const value of values) {
      const match = value.match(/-?\d+\.?\d*/);
      if (match) {
        return parseFloat(match[0]);
      }
    }
    return 0;
  }
}

export default HoonuitPointChart;