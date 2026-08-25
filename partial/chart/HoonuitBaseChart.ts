import { Page, Locator } from '@playwright/test';

/**
 * Base class for all Hoonuit chart components
 * @author aradhyas (converted from Java by amittiwari)
 * @since 18/05/2025
 */
export abstract class HoonuitBaseChart {
  protected readonly page: Page;
  protected readonly chartTitle: string;
  protected readonly subChartTitle?: string;

  // Selectors
  protected readonly chartTitleSelector = 'div.pds-panel-header';
  protected readonly tooltipSelector = 'div.highcharts-tooltip-container';
  protected readonly legendItemsSelector = 'g.highcharts-legend-item';

  /**
   * Constructor
   * @param page - Playwright Page object
   * @param title - Chart title
   * @param subChart - Optional sub-chart title
   */
  constructor(page: Page, title: string, subChart?: string) {
    this.page = page;
    this.chartTitle = title.trim();
    this.subChartTitle = subChart;
  }

  /**
   * Get the chart element
   */
  protected async getGraphElement(): Promise<Locator> {
    // Get chart by title
    const chartContainer = this.page.locator('.pds-panel', {
      has: this.page.locator(this.chartTitleSelector, { hasText: this.chartTitle })
    });

    // If subChartTitle is specified, find its parent container
    if (this.subChartTitle) {
      const subChartElement = this.page.locator(`h3, h4, h5, h6, div, span`, { hasText: this.subChartTitle });
      return subChartElement.locator('xpath=../../../..');
    }
    
    return chartContainer;
  }

  /**
   * Get tooltip data when hovering over chart elements
   */
  protected async getToolTip(): Promise<string[]> {
    // Wait for tooltip to appear
    const tooltip = this.page.locator(this.tooltipSelector);
    await tooltip.waitFor({ state: 'visible', timeout: 5000 });
    
    // Get the tooltip text and split by lines
    const tooltipText = await tooltip.innerText();
    return tooltipText.split('\n');
  }

  /**
   * Get the X-axis labels from the chart
   */
  protected async getXAxisLabels(): Promise<string[]> {
    const chartElement = await this.getGraphElement();
    const xAxisLabels = chartElement.locator('g.highcharts-xaxis-labels text');
    
    // Get all labels
    const count = await xAxisLabels.count();
    const labels: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const labelText = await xAxisLabels.nth(i).innerText();
      labels.push(labelText.trim());
    }
    
    return labels;
  }

  /**
   * Get the stacked items (legend items) from the chart
   */
  protected async getStakedItems(): Promise<string[]> {
    const chartElement = await this.getGraphElement();
    const legendItems = chartElement.locator(this.legendItemsSelector);
    
    // Get all legend items
    const count = await legendItems.count();
    const items: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const itemText = await legendItems.nth(i).innerText();
      items.push(itemText.trim());
    }
    
    return items;
  }

  /**
   * Disable all legend items except the specified one
   * @param legendToKeep - The legend item to keep enabled
   */
  public async disableAllLegendsExcept(legendToKeep: string): Promise<void> {
    const chartElement = await this.getGraphElement();
    const legendItems = chartElement.locator(this.legendItemsSelector);
    
    const count = await legendItems.count();
    
    for (let i = 0; i < count; i++) {
      const itemText = await legendItems.nth(i).innerText();
      
      // If this isn't the legend we want to keep, click to disable it
      if (itemText.trim() !== legendToKeep) {
        await legendItems.nth(i).click();
      }
    }
  }

  /**
   * Get the card element containing the chart
   * @returns Locator for the card element
   */
  protected async getCardElement(): Promise<Locator> {
    return this.page.locator('.pds-panel', {
      has: this.page.locator(this.chartTitleSelector, { hasText: this.chartTitle })
    });
  }

  /**
   * Get vertical stacked chart tooltip data
   * This is a base implementation that can be overridden by child classes
   * @returns Array of tooltip data
   */
  protected async getVerticalStackedChartToolTip(): Promise<string[]> {
    return await this.getToolTip();
  }

  /**
   * Get chart values for any chart type (generic implementation)
   * @param xAxisLabels - Array of x-axis labels to get values for
   * @returns Map of label to tooltip data
   */
  public async getAnyChartValues(...xAxisLabels: string[]): Promise<Map<string, string[]>> {
    const chartMap = new Map<string, string[]>();
    
    for (const xAxisLabel of xAxisLabels) {
      // This is a generic implementation - child classes can override with specific logic
      const tooltipData = [xAxisLabel, '0']; // Default implementation
      chartMap.set(xAxisLabel, tooltipData);
    }
    
    return chartMap;
  }

  /**
   * Get X-axis labels for vertical graph (default implementation)
   * @returns Array of X-axis labels
   */
  protected async getXAxisLabelsForVerticalGraph(): Promise<string[]> {
    return await this.getXAxisLabels();
  }
}