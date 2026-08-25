import { Page } from '@playwright/test';
import HoonuitBaseChart from './HoonuitBaseChart';

/**
 * HoonuitStackBarChart class for interacting with stacked bar chart components
 * @author aradhyas (converted from Java)
 * @since 22/05/2025
 */
export class HoonuitStackBarChart extends HoonuitBaseChart {
  /**
   * Constructor for stacked bar chart
   * @param page - Playwright Page object
   * @param title - Title of the card containing the chart
   * @param subChartHeader - Optional header of the sub-chart within the card
   */
  constructor(page: Page, title: string, subChartHeader?: string) {
    super(page, title, subChartHeader);
  }

  /**
   * Get stacked bar chart specific values
   */
  public async getStackedBarChartValues(): Promise<Map<string, string[]>> {
    return await this.getAnyChartValue();
  }

  /**
   * Get value for a specific stacked bar
   * @param barLabel - The label of the bar to get data for
   */
  public async getStackedBarValue(barLabel: string): Promise<string[]> {
    return await this.getAnyChartValueForLabel(barLabel);
  }

  /**
   * Get all stacked bar labels from X-axis
   */
  public async getStackedBarLabels(): Promise<string[]> {
    return await this.getXAxisLabels();
  }

  /**
   * Get all stack items (legend items)
   */
  public async getStackItems(): Promise<string[]> {
    return await this.getStackedItems();
  }

  /**
   * Disable all stack items except the specified one
   * @param stackItem - The stack item to keep enabled
   */
  public async disableAllStacksExcept(stackItem: string): Promise<void> {
    await this.disableAllLegendsExcept(stackItem);
  }

  /**
   * Get vertical stacked chart tooltip
   */
  public async getVerticalStackedTooltip(): Promise<string[]> {
    return await this.getVerticalStackedChartToolTip();
  }

  /**
   * Check if a specific stacked bar exists
   * @param barLabel - The label to check for
   */
  public async hasStackedBar(barLabel: string): Promise<boolean> {
    try {
      const labels = await this.getStackedBarLabels();
      return labels.includes(barLabel);
    } catch {
      return false;
    }
  }

  /**
   * Get the total value for a stacked bar
   * @param barLabel - The label of the bar
   */
  public async getStackedBarTotal(barLabel: string): Promise<number> {
    const barData = await this.getStackedBarValue(barLabel);
    let total = 0;

    for (const value of barData) {
      const numericValue = this.extractNumericValue(value);
      total += numericValue;
    }

    return total;
  }

  /**
   * Get values for all stacks in a specific bar
   * @param barLabel - The label of the bar
   */
  public async getStackValuesForBar(barLabel: string): Promise<Map<string, number>> {
    const barData = await this.getStackedBarValue(barLabel);
    const stackValues = new Map<string, number>();

    // Parse tooltip data to extract individual stack values
    for (const line of barData) {
      const match = line.match(/^(.+?):\s*(\d+\.?\d*)/);
      if (match) {
        const stackName = match[1].trim();
        const value = parseFloat(match[2]);
        stackValues.set(stackName, value);
      }
    }

    return stackValues;
  }

  /**
   * Extract numeric value from a string
   * @param value - String containing numeric value
   */
  private extractNumericValue(value: string): number {
    const match = value.match(/\d+\.?\d*/);
    return match ? parseFloat(match[0]) : 0;
  }

  /**
   * Get the percentage breakdown for a stacked bar
   * @param barLabel - The label of the bar
   */
  public async getStackedBarPercentages(barLabel: string): Promise<Map<string, number>> {
    const stackValues = await this.getStackValuesForBar(barLabel);
    const total = Array.from(stackValues.values()).reduce((sum, val) => sum + val, 0);
    const percentages = new Map<string, number>();

    for (const [stackName, value] of stackValues.entries()) {
      const percentage = total > 0 ? (value / total) * 100 : 0;
      percentages.set(stackName, Math.round(percentage * 100) / 100); // Round to 2 decimal places
    }

    return percentages;
  }
}

export default HoonuitStackBarChart;