import { Page, Locator } from '@playwright/test';
import HoonuitCard from '../../../../pages/HoonuitCard';
import { MtssException } from '../../exceptions/MtssException';
import { HoonuitHelper } from '../../../../helpers/hoonuitHelper';

/**
 * Playwright/TypeScript version of MtssBaseChart (converted from Java)
 * Base class for handling chart interactions in MTSS using Playwright
 * @author ashok garg (original Java), converted to TypeScript
 * @since 10/08/2020
 */
export abstract class MtssBaseChart {
  // Selectors - matching Java constants exactly
  private static readonly LEGENDS = 'g.highcharts-legend-item';
  private static readonly CHART = 'svg.highcharts-root';
  private static readonly SUB_CHART_HEADER = 'text.highcharts-subtitle';
  private static readonly TOOLTIP = 'div.highcharts-tooltip';
  private static readonly X_AXIS = 'g.highcharts-xaxis text';
  private static readonly Y_AXIS = 'g.highcharts-yaxis text';
  private static readonly X_AXIS_LABELS = 'g.highcharts-xaxis-labels text[opacity="1"]';
  private static readonly Y_AXIS_LABELS = 'g.highcharts-yaxis-labels text';
  private static readonly TOGGLE_BUTTON = 'button[class*="proxy-button"][class*="highcharts"]';
  private static readonly DROPDOWN_MENU_OPTIONS = 'div.dropdownMode div.dropdown-menu button.dropdown-item';
  private static readonly CARD_TOOLS_BUTTON = 'button.pds-button-square';

  protected readonly page: Page;
  private cardElement: Locator | null = null;
  private graphElement: Locator | null = null;
  protected readonly testContext: string;

  /**
   * Constructor for both single chart and sub-chart initialization
   * @param page Playwright page instance
   * @param title Chart/Card title
   * @param subChartHeader Optional sub-chart header text
   */
  constructor(page: Page, title: string, subChartHeader?: string) {
    this.page = page;
    this.testContext = subChartHeader ? `MtssBaseChart-${title}-${subChartHeader}` : `MtssBaseChart-${title}`;
    
    // Initialize based on whether subChartHeader is provided
    if (subChartHeader) {
      this.initializeSubChart(title, subChartHeader);
    } else {
      this.initializeChart(title);
    }
  }

  /**
   * Initialize chart for single chart scenario
   */
  private async initializeChart(title: string): Promise<void> {
    try {
      const card = new HoonuitCard(this.page, title);
      if (await card.isExists()) {
        this.cardElement = card.cardElement;
        await this.cardElement.scrollIntoViewIfNeeded();
        await this.cardElement.hover();
        
        this.graphElement = this.cardElement.locator(MtssBaseChart.CHART).first();
        await this.graphElement.scrollIntoViewIfNeeded();
        await this.graphElement.hover();
      } else {
        this.cardElement = null;
        this.graphElement = null;
      }
    } catch (error) {
      throw MtssException.withTestContext(
        `Failed to initialize chart with title: ${title}`,
        this.testContext,
        error as Error
      );
    }
  }

  /**
   * Initialize chart for sub-chart scenario
   */
  private async initializeSubChart(title: string, subChartHeader: string): Promise<void> {
    try {
      const card = new HoonuitCard(this.page, title);
      if (await card.isExists()) {
        this.cardElement = card.cardElement;
        await this.cardElement.hover();
        
        const charts = this.cardElement.locator(MtssBaseChart.CHART);
        const chartCount = await charts.count();
        
        for (let i = 0; i < chartCount; i++) {
          const subChart = charts.nth(i);
          const headerElement = subChart.locator(MtssBaseChart.SUB_CHART_HEADER);
          
          if (await headerElement.count() > 0) {
            await headerElement.hover();
            const headerText = await headerElement.innerText();
            
            if (headerText === subChartHeader) {
              this.graphElement = subChart;
              return;
            }
          }
        }
        
        throw new Error(`Sub-chart with header "${subChartHeader}" not found`);
      } else {
        this.cardElement = null;
        this.graphElement = null;
      }
    } catch (error) {
      throw MtssException.withTestContext(
        `No chart found inside the card. Please check the exception.`,
        this.testContext,
        error as Error
      );
    }
  }

  /**
   * Get X-axis label text
   * @returns Promise<string> X-axis label
   */
  async getXAxis(): Promise<string> {
    const graphElement = await this.getGraphElement();
    const xAxisElement = graphElement.locator(MtssBaseChart.X_AXIS);
    await xAxisElement.waitFor({ state: 'visible' });
    return await xAxisElement.innerText();
  }

  /**
   * Get Y-axis label text  
   * @returns Promise<string> Y-axis label
   */
  async getYAxis(): Promise<string> {
    const graphElement = await this.getGraphElement();
    const yAxisElement = graphElement.locator(MtssBaseChart.Y_AXIS);
    await yAxisElement.waitFor({ state: 'visible' });
    return await yAxisElement.innerText();
  }

  /**
   * Get all X-axis labels
   * @returns Promise<string[]> Array of X-axis labels
   */
  protected async getXAxisLabels(): Promise<string[]> {
    const graphElement = await this.getGraphElement();
    await graphElement.hover();
    await graphElement.scrollIntoViewIfNeeded();
    
    const xAxisLabels = graphElement.locator(MtssBaseChart.X_AXIS_LABELS);
    await xAxisLabels.first().waitFor({ state: 'visible', timeout: 30000 });
    
    const labelCount = await xAxisLabels.count();
    if (labelCount === 0) {
      throw MtssException.withTestContext('No X-axis labels found', this.testContext);
    }
    
    const texts: string[] = [];
    for (let i = 0; i < labelCount; i++) {
      const element = xAxisLabels.nth(i);
      
      // Check for tspan elements (multi-line labels)
      const tspanElements = element.locator('tspan');
      const tspanCount = await tspanElements.count();
      
      if (tspanCount > 0) {
        let label = '';
        for (let j = 0; j < tspanCount; j++) {
          const tspanText = await tspanElements.nth(j).innerText();
          label += tspanText + ' ';
        }
        texts.push(label.trim());
      } else {
        const innerText = await element.innerText();
        texts.push(innerText.trim());
      }
    }
    
    return texts;
  }

  /**
   * Get all Y-axis labels
   * @returns Promise<string[]> Array of Y-axis labels  
   */
  protected async getYAxisLabels(): Promise<string[]> {
    const graphElement = await this.getGraphElement();
    const yAxisLabels = graphElement.locator(MtssBaseChart.Y_AXIS_LABELS);
    
    const labelCount = await yAxisLabels.count();
    const texts: string[] = [];
    
    for (let i = 0; i < labelCount; i++) {
      const text = await yAxisLabels.nth(i).innerText();
      texts.push(text);
    }
    
    return texts;
  }

  /**
   * Get tooltip data
   * @returns Promise<string[]> Array of tooltip text lines
   */
  async getToolTip(): Promise<string[]> {
    const cardElement = await this.getCardElement();
    let tooltip: Locator;
    
    // Check if series is already hovered
    const seriesHover = this.page.locator('.highcharts-series-hover');
    if (await seriesHover.count() > 0) {
      tooltip = cardElement.locator(MtssBaseChart.TOOLTIP);
    } else {
      await cardElement.hover();
      tooltip = cardElement.locator(MtssBaseChart.TOOLTIP);
      await tooltip.waitFor({ state: 'visible', timeout: 30000 });
    }

    const data: string[] = [];
    
    // Check if tooltip has table structure
    const table = tooltip.locator('table');
    if (await table.count() > 0) {
      await tooltip.waitFor({ state: 'visible' });
      await tooltip.scrollIntoViewIfNeeded();
      
      const span = tooltip.locator('span').first();
      await span.scrollIntoViewIfNeeded();
      const spanText = await span.innerText();
      data.push(spanText.split('\n')[0]);
      
      const rows = tooltip.locator('tr');
      const rowCount = await rows.count();
      for (let i = 0; i < rowCount; i++) {
        const rowText = await rows.nth(i).innerText();
        data.push(rowText);
      }
    } else {
      const span = tooltip.locator('span').first();
      await span.scrollIntoViewIfNeeded();
      const spanText = await span.innerText();
      const lines = spanText.split('\n');
      data.push(...lines);
    }
    
    return data;
  }

  /**
   * Get chart values for all data points
   * @returns Promise<Map<string, string[]>> Map of chart data
   */
  async getAnyChartValues(): Promise<Map<string, string[]>> {
    const chartMap = new Map<string, string[]>();
    const xAxisLabelCount = (await this.getXAxisLabels()).length;
    
    // Wait for data labels to be visible
    await this.page.waitForSelector('g.highcharts-data-label', { timeout: 30000 });
    
    const graphElement = await this.getGraphElement();
    await graphElement.waitFor({ state: 'visible' });
    await graphElement.scrollIntoViewIfNeeded();
    await graphElement.hover();
    
    // Try path labels first, then data labels
    let barDataLabels = graphElement.locator('g.highcharts-markers path[fill*="rgb"]').locator('visible=true');
    let labelCount = await barDataLabels.count();
    
    if (labelCount === 0) {
      barDataLabels = graphElement.locator('g.highcharts-data-label').locator('visible=true');
      labelCount = await barDataLabels.count();
    }
    
    for (let i = 0; i < labelCount; i++) {
      await barDataLabels.nth(i).hover();
      await this.page.waitForTimeout(400);
      
      const tooltipData = await this.getToolTip();
      const key = tooltipData[0]
        .trim()
        .replace(/"/g, '')
        .replace(/:.*$/, '')
        .replace(/● /, '');
      
      if (!chartMap.has(key)) {
        chartMap.set(key, tooltipData);
      }
      
      if (xAxisLabelCount === chartMap.size) {
        break;
      }
    }
    
    return chartMap;
  }

  /**
   * Get chart values for specific X-axis label
   * @param xAxisLabel The X-axis label to find
   * @returns Promise<string[]> Tooltip data for the label
   */
  async getAnyChartValue(xAxisLabel: string): Promise<string[]> {
    const graphElement = await this.getGraphElement();
    await graphElement.scrollIntoViewIfNeeded();
    
    // Try data labels first, then path labels
    let barDataLabels = graphElement.locator('g.highcharts-data-label').locator('visible=true');
    let labelCount = await barDataLabels.count();
    
    if (labelCount === 0) {
      barDataLabels = graphElement.locator('g.highcharts-markers path[fill*="rgba"]').locator('visible=true');
      labelCount = await barDataLabels.count();
    }
    
    for (let i = 0; i < labelCount; i++) {
      await barDataLabels.nth(i).scrollIntoViewIfNeeded();
      await barDataLabels.nth(i).hover();
      await this.page.waitForTimeout(400);
      
      const tooltipData = await this.getToolTip();
      const key = tooltipData[0]
        .trim()
        .replace(/"/g, '')
        .replace(/:.*$/, '')
        .replace(/● /, '');
      
      if (key === xAxisLabel) {
        return tooltipData;
      }
    }
    
    throw MtssException.withTestContext(
      `Cannot find xAxisLabel with: ${xAxisLabel}`,
      this.testContext
    );
  }

  /**
   * Alternative method for getting chart values (variant 1)
   * @param xAxisLabel The X-axis label to find
   * @returns Promise<string[]> Tooltip data for the label
   */
  async getAnyChartValue1(xAxisLabel: string): Promise<string[]> {
    const graphElement = await this.getGraphElement();
    await graphElement.scrollIntoViewIfNeeded();
    
    let barDataLabels = graphElement.locator('g.highcharts-data-label').locator('visible=true');
    let labelCount = await barDataLabels.count();
    
    if (labelCount === 0) {
      barDataLabels = graphElement.locator('g.highcharts-markers path[fill*="rgba"]').locator('visible=true');
      labelCount = await barDataLabels.count();
    }
    
    for (let i = 0; i < labelCount; i++) {
      await barDataLabels.nth(i).scrollIntoViewIfNeeded();
      await barDataLabels.nth(i).hover();
      await this.page.waitForTimeout(400);
      
      const tooltipData = await this.getToolTip();
      const key = tooltipData[0]
        .trim()
        .replace(/"/g, '')
        .replace(/● /, '');
      
      if (key === xAxisLabel) {
        return tooltipData;
      }
    }
    
    throw MtssException.withTestContext(
      `Cannot find xAxisLabel with: ${xAxisLabel}`,
      this.testContext
    );
  }

  /**
   * Disable all legends except the specified one
   * @param legendLabel Legend label to keep enabled
   */
  async disableAllLegendsExcept(legendLabel: string): Promise<void> {
    const graphElement = await this.getGraphElement();
    const toggleButtons = graphElement.locator('..').locator(MtssBaseChart.TOGGLE_BUTTON);
    const buttonCount = await toggleButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      await this.page.waitForTimeout(200);
      const button = toggleButtons.nth(i);
      
      const ariaLabel = await button.getAttribute('aria-label') || '';
      const ariaPressed = await button.getAttribute('aria-pressed') || '';
      
      if (!ariaLabel.endsWith(legendLabel) && ariaPressed.includes('true')) {
        await button.click();
      } else if (ariaLabel.endsWith(legendLabel) && ariaPressed.includes('false')) {
        await button.click();
      }
    }
    
    await this.page.waitForTimeout(1000);
    await HoonuitHelper.waitForPageToLoad();
  }

  /**
   * Get all stacked items (legends)
   * @returns Promise<string[]> Array of legend texts
   */
  async getStakedItems(): Promise<string[]> {
    const graphElement = await this.getGraphElement();
    const legends = graphElement.locator(MtssBaseChart.LEGENDS);
    const legendCount = await legends.count();
    
    const texts: string[] = [];
    for (let i = 0; i < legendCount; i++) {
      const text = await legends.nth(i).innerText();
      texts.push(text);
    }
    
    return texts;
  }

  /**
   * Get the card element
   * @returns Promise<Locator> Card element
   */
  protected async getCardElement(): Promise<Locator> {
    if (!this.cardElement) {
      throw MtssException.withTestContext('Card element is not initialized', this.testContext);
    }
    return this.cardElement;
  }

  /**
   * Get the graph element
   * @returns Promise<Locator> Graph element
   */
  protected async getGraphElement(): Promise<Locator> {
    if (!this.graphElement) {
      throw MtssException.withTestContext('Graph element is not initialized', this.testContext);
    }
    return this.graphElement;
  }

  /**
   * Check if chart is displayed
   * @returns Promise<boolean> True if displayed
   */
  async isDisplayed(): Promise<boolean> {
    if (this.graphElement) {
      return await this.graphElement.isVisible();
    }
    return false;
  }

  /**
   * Check if card is displayed
   * @returns Promise<boolean> True if card is displayed
   */
  async isCardDisplayed(): Promise<boolean> {
    if (this.cardElement) {
      return await this.cardElement.isVisible();
    }
    return false;
  }

  /**
   * Get chart values for multiple specific X-axis labels
   * @param xAxisLabels Array of X-axis labels to find
   * @returns Promise<Map<string, string[]>> Map of chart data
   */
  async getAnyChartValuesForLabels(...xAxisLabels: string[]): Promise<Map<string, string[]>> {
    const chartMap = new Map<string, string[]>();
    const graphElement = await this.getGraphElement();
    
    for (const xAxisLabel of xAxisLabels) {
      await this.page.waitForSelector(`[aria-label*=". ${xAxisLabel},"]`, { timeout: 30000 });
      
      const selector = `[aria-label*=". ${xAxisLabel},"]`;
      const barDataLabel = graphElement.locator(selector);
      
      if (await barDataLabel.count() > 0) {
        await barDataLabel.scrollIntoViewIfNeeded();
        await barDataLabel.hover();
        await this.page.waitForTimeout(1000);
        
        const tooltipData = await this.getToolTip();
        const key = tooltipData[0]
          .trim()
          .replace(/"/g, '')
          .replace(/:.*$/, '')
          .replace(/● /, '');
        
        chartMap.set(key, tooltipData);
      }
    }
    
    if (chartMap.size === xAxisLabels.length) {
      return chartMap;
    }
    
    throw MtssException.withTestContext(
      `Found only these ${JSON.stringify(Array.from(chartMap.keys()))} using ${xAxisLabels.toString()}`,
      this.testContext
    );
  }

  /**
   * Get chart values using regex pattern for X-axis label
   * @param xAxisLabelPattern Regex pattern for X-axis label
   * @returns Promise<string[]> Tooltip data for matching label
   */
  async getAnyChartValueByPattern(xAxisLabelPattern: RegExp): Promise<string[]> {
    const graphElement = await this.getGraphElement();
    await graphElement.scrollIntoViewIfNeeded();
    
    let barDataLabels = graphElement.locator('g.highcharts-data-label').locator('visible=true');
    let labelCount = await barDataLabels.count();
    
    if (labelCount === 0) {
      barDataLabels = graphElement.locator('g.highcharts-markers path[fill*="rgba"]').locator('visible=true');
      labelCount = await barDataLabels.count();
    }
    
    for (let i = 0; i < labelCount; i++) {
      await barDataLabels.nth(i).scrollIntoViewIfNeeded();
      await barDataLabels.nth(i).hover();
      await this.page.waitForTimeout(400);
      
      const tooltipData = await this.getToolTip();
      const key = tooltipData[0]
        .trim()
        .replace(/"/g, '')
        .replace(/:.*$/, '')
        .replace(/● /, '');
      
      if (xAxisLabelPattern.test(key)) {
        return tooltipData;
      }
    }
    
    throw MtssException.withTestContext(
      `Cannot find xAxisLabel with pattern: ${xAxisLabelPattern}`,
      this.testContext
    );
  }

  /**
   * Check if card exists
   * @returns Promise<boolean> True if card exists
   */
  async isCardExists(): Promise<boolean> {
    if (this.cardElement) {
      return await this.cardElement.count() > 0;
    }
    return false;
  }

  /**
   * Click card tools button
   * @param title Card title
   */
  async clickCardToolsButton(title: string): Promise<void> {
    const cardElement = this.getCardElementByTitle(title);
    await cardElement.locator(MtssBaseChart.CARD_TOOLS_BUTTON).click();
  }

  /**
   * Get card element by title
   * @param title Card title
   * @returns Locator Card element
   */
  private getCardElementByTitle(title: string): Locator {
    // This should match HoonuitHelper.$card(title) functionality
    return this.page.locator('.pds-card', {
      has: this.page.locator('.pds-card-header, .customHtmlContainer, .card-body .ng-star-inserted, .h1.isDrillable', { hasText: title })
    });
  }

  /**
   * Select card tool option with sub-option
   * @param title Card title
   * @param option Main option text
   * @param subOption Sub-option text
   */
  async selectCardToolOption(title: string, option: string, subOption: string): Promise<void> {
    await this.clickCardToolsButton(title);
    
    // Click main option
    await this.page.locator(MtssBaseChart.DROPDOWN_MENU_OPTIONS, { hasText: option }).click();
    
    // Click sub-option
    await this.page.locator(MtssBaseChart.DROPDOWN_MENU_OPTIONS, { hasText: subOption }).click();
    
    await HoonuitHelper.waitForPageToLoad();
  }
}

/**
 * Interface for chart tooltip data
 */
export interface ChartTooltipData {
  header: string;
  rows: string[];
}

/**
 * Interface for chart configuration
 */
export interface ChartConfig {
  title: string;
  subChartHeader?: string;
  timeout?: number;
}
