import { Page, Locator } from '@playwright/test';
import { HoonuitException } from '../../../exceptions/HoonuitException';

/**
 * Base class for all Hoonuit chart components
 * @author aradhyas (converted from Java by amittiwari)
 * @since 22/05/2025 (original: 07/04/21)
 */
export default abstract class HoonuitBaseChart {
  // Selectors
  private readonly LEGENDS = 'g.highcharts-legend-item';
  private readonly CHART = 'svg.highcharts-root';
  private readonly SUB_CHART_HEADER = 'text.highcharts-subtitle';
  private readonly TOOLTIP = 'div.highcharts-tooltip';
  private readonly X_AXIS = 'g.highcharts-xaxis text';
  private readonly Y_AXIS = 'g.highcharts-yaxis text';
  private readonly X_AXIS_LABELS = 'g.highcharts-xaxis-labels text[opacity="1"]';
  private readonly Y_AXIS_LABELS = 'g.highcharts-yaxis-labels text';
  private readonly TOGGLE_BUTTON = 'button[class*="proxy-button"][class*="highcharts"]';
  private readonly DROPDOWN_MENU_OPTIONS = 'div.dropdownMode div.dropdown-menu button.dropdown-item';
  private readonly CARD_TOOLS_BUTTON = 'button.pds-button-square';

  protected page: Page;
  protected title: string;
  protected subChartHeader?: string;
  protected cardElement: Locator | null = null;
  protected graphElement: Locator | null = null;

  /**
   * Constructor for chart with title and optional sub-chart header
   * @param page - Playwright Page object
   * @param title - Title of the card containing the chart
   * @param subChartHeader - Optional header of the sub-chart within the card
   */
  constructor(page: Page, title: string, subChartHeader?: string) {
    this.page = page;
    this.title = title;
    this.subChartHeader = subChartHeader;
    
    // Find the card element by title (synchronous operation)
    this.cardElement = page.locator('.pds-panel', { hasText: title });
  }

  /**
   * Initialize the chart elements. Must be called after construction.
   * This method handles the async initialization that cannot be done in the constructor.
   */
  public async initialize(): Promise<void> {
    try {
      if (this.subChartHeader) {
        // Initialize sub-chart within the card
        await this.initializeSubChart(this.subChartHeader);
      } else {
        // Initialize main chart
        await this.initializeMainChart();
      }
    } catch (error) {
      this.cardElement = null;
      this.graphElement = null;
    }
  }

  /**
   * Initialize the main chart element
   */
  private async initializeMainChart(): Promise<void> {
    if (this.cardElement && await this.cardElement.count() > 0) {
      await this.cardElement.scrollIntoViewIfNeeded();
      await this.cardElement.hover();
      this.graphElement = this.cardElement.locator(this.CHART).first();
      if (await this.graphElement.count() > 0) {
        await this.graphElement.hover();
      } else {
        this.graphElement = null;
      }
    } else {
      this.cardElement = null;
      this.graphElement = null;
    }
  }

  /**
   * Initialize sub-chart by header text
   * @param subChartHeader - The header text of the sub-chart
   */
  private async initializeSubChart(subChartHeader: string): Promise<void> {
    if (this.cardElement && await this.cardElement.count() > 0) {
      await this.cardElement.scrollIntoViewIfNeeded();
      await this.cardElement.hover();
      
      const charts = this.cardElement.locator(this.CHART);
      const chartCount = await charts.count();
      
      for (let i = 0; i < chartCount; i++) {
        const chart = charts.nth(i);
        const headerElement = chart.locator(this.SUB_CHART_HEADER);
        
        if (await headerElement.count() > 0) {
          await headerElement.hover();
          const headerText = await headerElement.innerText();
          
          if (headerText === subChartHeader) {
            this.graphElement = chart;
            return;
          }
        }
      }
      
      // If no matching sub-chart found, set to null
      this.graphElement = null;
    } else {
      this.cardElement = null;
      this.graphElement = null;
    }
  }

  /**
   * Get X-axis text
   */
  public async getXAxis(): Promise<string> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const xAxisElement = this.graphElement.locator(this.X_AXIS);
    await xAxisElement.waitFor({ state: 'visible' });
    return await xAxisElement.innerText();
  }

  /**
   * Get Y-axis text
   */
  public async getYAxis(): Promise<string> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const yAxisElement = this.graphElement.locator(this.Y_AXIS);
    await yAxisElement.waitFor({ state: 'visible' });
    return await yAxisElement.innerText();
  }

  /**
   * Get X-axis labels
   */
  protected async getXAxisLabels(): Promise<string[]> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const texts: string[] = [];
    await this.graphElement.hover();
    await this.graphElement.scrollIntoViewIfNeeded();
    
    const labelElements = this.graphElement.locator(this.X_AXIS_LABELS);
    const count = await labelElements.count();
    
    if (count === 0) {
      throw new HoonuitException('No X-axis labels found');
    }
    
    for (let i = 0; i < count; i++) {
      const element = labelElements.nth(i);
      let label = '';
      
      // Check for tspan elements within the label
      const tspanElements = element.locator('tspan');
      const tspanCount = await tspanElements.count();
      
      if (tspanCount > 0) {
        for (let j = 0; j < tspanCount; j++) {
          const tspanText = await tspanElements.nth(j).innerText();
          if (tspanText.trim()) {
            label += tspanText + ' ';
          }
        }
      }
      
      if (!label.trim()) {
        label = await element.innerText();
      }
      
      texts.push(label.trim());
    }
    
    return texts;
  }

  /**
   * Get X-axis labels for vertical graphs
   */
  protected async getXAxisLabelsForVerticalGraph(): Promise<string[]> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const texts: string[] = [];
    await this.graphElement.hover();
    await this.graphElement.scrollIntoViewIfNeeded();
    
    const labelElements = this.graphElement.locator(this.X_AXIS_LABELS);
    const count = await labelElements.count();
    
    if (count === 0) {
      throw new HoonuitException('No X-axis labels found');
    }
    
    for (let i = 0; i < count; i++) {
      const element = labelElements.nth(i);
      let label = '';
      
      // Check for tspan elements within the label
      const tspanElements = element.locator('tspan');
      const tspanCount = await tspanElements.count();
      
      if (tspanCount > 0) {
        for (let j = 0; j < tspanCount; j++) {
          const tspanText = await tspanElements.nth(j).innerText();
          label += tspanText + ' ';
        }
      }
      
      if (!label.trim()) {
        // For vertical graphs, combine sibling text with current text
        const siblingText = await element.locator('xpath=preceding-sibling::*[1]').innerText().catch(() => '');
        const currentText = await element.innerText();
        label = `${siblingText} ${currentText}`.trim();
      }
      
      texts.push(label.trim());
    }
    
    return texts;
  }

  /**
   * Get Y-axis labels
   */
  protected async getYAxisLabels(): Promise<string[]> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const texts: string[] = [];
    const labelElements = this.graphElement.locator(this.Y_AXIS_LABELS);
    const count = await labelElements.count();
    
    for (let i = 0; i < count; i++) {
      const text = await labelElements.nth(i).innerText();
      texts.push(text);
    }
    
    return texts;
  }

  /**
   * Get tooltip data
   */
  public async getToolTip(): Promise<string[]> {
    if (!this.cardElement) throw new HoonuitException('Card element not initialized');
    
    let tooltipElement: Locator;
    
    // Check if there's a series hover state
    const seriesHover = this.page.locator('.highcharts-series-hover');
    if (await seriesHover.count() > 0) {
      tooltipElement = this.cardElement.locator(this.TOOLTIP);
      await tooltipElement.waitFor({ state: 'visible', timeout: 30000 });
    } else {
      await this.cardElement.hover();
      tooltipElement = this.cardElement.locator(this.TOOLTIP);
      await tooltipElement.waitFor({ state: 'visible', timeout: 30000 });
    }
    
    const data: string[] = [];
    
    // Check if tooltip has a table structure
    const tableElement = tooltipElement.locator('table');
    if (await tableElement.count() > 0) {
      // Get the span text first
      const spanElement = tooltipElement.locator('span').first();
      if (await spanElement.count() > 0) {
        const spanText = await spanElement.innerText();
        const lines = spanText.split('\n');
        if (lines.length > 0) {
          data.push(lines[0]);
        }
      }
      
      // Get all table rows
      const rowElements = tooltipElement.locator('tr');
      const rowCount = await rowElements.count();
      
      for (let i = 0; i < rowCount; i++) {
        const rowText = await rowElements.nth(i).innerText();
        data.push(rowText);
      }
      
      return data;
    } else {
      // Simple tooltip structure
      const spanElement = tooltipElement.locator('span').first();
      if (await spanElement.count() > 0) {
        await spanElement.scrollIntoViewIfNeeded();
        const text = await spanElement.innerText();
        return text.split('\n');
      }
    }
    
    return data;
  }

  /**
   * Get chart values for all data points
   */
  public async getAnyChartValue(): Promise<Map<string, string[]>> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const chartMap = new Map<string, string[]>();
    const xAxisLabelCount = (await this.getXAxisLabels()).length;
    
    // Wait for data labels to be visible
    await this.page.waitForSelector('g.highcharts-data-label', { state: 'visible', timeout: 30000 });
    
    const pathLabels = this.graphElement.locator('g.highcharts-markers path[fill*="rgb"]');
    let dataLabels = await pathLabels.count() > 0 ? pathLabels : this.graphElement.locator('g.highcharts-data-label');
    
    const labelCount = await dataLabels.count();
    
    for (let i = 0; i < labelCount; i++) {
      await dataLabels.nth(i).hover();
      await this.page.waitForTimeout(400);
      
      const tooltipData = await this.getToolTip();
      if (tooltipData.length > 0) {
        let key = tooltipData[0].trim()
          .replace(/"/g, '')
          .replace(/:.*$/, '')
          .replace(/● /, '');
        
        if (!chartMap.has(key)) {
          chartMap.set(key, tooltipData);
        }
        
        if (chartMap.size >= xAxisLabelCount) {
          break;
        }
      }
    }
    
    return chartMap;
  }

  /**
   * Get chart value for specific X-axis label
   * @param xAxisLabel - The X-axis label to get data for
   */
  public async getAnyChartValueForLabel(xAxisLabel: string): Promise<string[]> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    await this.page.waitForLoadState('networkidle');
    
    const pathLabels = this.graphElement.locator('g.highcharts-markers path[fill*="rgba"]');
    let dataLabels = await pathLabels.count() > 0 ? pathLabels : this.graphElement.locator('g.highcharts-data-label');
    
    const labelCount = await dataLabels.count();
    
    for (let i = 0; i < labelCount; i++) {
      await dataLabels.nth(i).scrollIntoViewIfNeeded();
      await dataLabels.nth(i).hover();
      await this.page.waitForTimeout(400);
      
      const tooltipData = await this.getToolTip();
      if (tooltipData.length > 0) {
        let key = tooltipData[0].trim()
          .replace(/"/g, '')
          .replace(/:.*$/, '')
          .replace(/● /, '');
        
        if (key === xAxisLabel) {
          return tooltipData;
        }
      }
    }
    
    throw new HoonuitException(`Cannot find xAxisLabel with: ${xAxisLabel}`);
  }

  /**
   * Get chart values for multiple specific X-axis labels
   * @param xAxisLabels - Array of X-axis labels to get data for
   */
  public async getAnyChartValueForMultipleLabels(...xAxisLabels: string[]): Promise<Map<string, string[]>> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const chartMap = new Map<string, string[]>();
    
    for (const xAxisLabel of xAxisLabels) {
      // Wait for the specific element with aria-label containing the xAxisLabel
      const selector = `[aria-label*=". ${xAxisLabel},"]`;
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
      
      const element = this.graphElement.locator(selector);
      if (await element.count() > 0) {
        await element.scrollIntoViewIfNeeded();
        await element.hover();
        await this.page.waitForTimeout(1000);
        
        const tooltipData = await this.getToolTip();
        if (tooltipData.length > 0) {
          let key = tooltipData[0].trim()
            .replace(/"/g, '')
            .replace(/:.*$/, '')
            .replace(/● /, '');
          chartMap.set(key, tooltipData);
        }
      }
    }
    
    if (chartMap.size === xAxisLabels.length) {
      return chartMap;
    }
    
    throw new HoonuitException(`Found only ${chartMap.size} out of ${xAxisLabels.length} requested labels`);
  }

  /**
   * Get chart values using regex pattern for X-axis labels
   * @param xAxisLabelPattern - Regex pattern to match X-axis labels
   */
  public async getAnyChartValueByPattern(xAxisLabelPattern: RegExp): Promise<string[]> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const pathLabels = this.graphElement.locator('g.highcharts-markers path[fill*="rgba"]');
    let dataLabels = await pathLabels.count() > 0 ? pathLabels : this.graphElement.locator('g.highcharts-data-label');
    
    const labelCount = await dataLabels.count();
    
    for (let i = 0; i < labelCount; i++) {
      await dataLabels.nth(i).scrollIntoViewIfNeeded();
      await dataLabels.nth(i).hover();
      await this.page.waitForTimeout(400);
      
      const tooltipData = await this.getToolTip();
      if (tooltipData.length > 0) {
        let key = tooltipData[0].trim()
          .replace(/"/g, '')
          .replace(/:.*$/, '')
          .replace(/● /, '');
        
        if (xAxisLabelPattern.test(key)) {
          return tooltipData;
        }
      }
    }
    
    throw new HoonuitException(`Cannot find xAxisLabel matching pattern: ${xAxisLabelPattern}`);
  }

  /**
   * Disable all legends except the specified one
   * @param legendLabel - The legend label to keep enabled
   */
  public async disableAllLegendsExcept(legendLabel: string): Promise<void> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const toggleButtons = this.graphElement.locator('..').locator(this.TOGGLE_BUTTON);
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
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get stacked items from the legend
   */
  public async getStackedItems(): Promise<string[]> {
    if (!this.graphElement) throw new HoonuitException('Graph element not initialized');
    
    const texts: string[] = [];
    const legendElements = this.graphElement.locator(this.LEGENDS);
    const count = await legendElements.count();
    
    for (let i = 0; i < count; i++) {
      const text = await legendElements.nth(i).innerText();
      texts.push(text);
    }
    
    return texts;
  }

  /**
   * Check if the chart is displayed
   */
  public async isDisplayed(): Promise<boolean> {
    if (this.graphElement) {
      return await this.graphElement.isVisible();
    }
    return false;
  }

  /**
   * Check if the card is displayed
   */
  public async isCardDisplayed(): Promise<boolean> {
    if (this.cardElement) {
      return await this.cardElement.isVisible();
    }
    return false;
  }

  /**
   * Check if the card exists
   */
  public async isCardExists(): Promise<boolean> {
    if (this.cardElement) {
      return await this.cardElement.count() > 0;
    }
    return false;
  }

  /**
   * Click the card tools button
   * @param title - The card title
   */
  public async clickCardToolsButton(title: string): Promise<void> {
    const cardElement = this.getCardElement(title);
    await cardElement.locator(this.CARD_TOOLS_BUTTON).click();
  }

  /**
   * Get card element by title
   * @param title - The card title
   */
  public getCardElement(title: string): Locator {
    return this.page.locator('.pds-panel', { hasText: title });
  }

  /**
   * Select option from card tools menu
   * @param title - The card title
   * @param option - The main option to select
   * @param subOption - The sub-option to select
   */
  public async selectCardToolOption(title: string, option: string, subOption: string): Promise<void> {
    await this.clickCardToolsButton(title);
    
    // Click main option
    const mainOption = this.page.locator(this.DROPDOWN_MENU_OPTIONS).filter({ hasText: option });
    await mainOption.click();
    
    // Click sub-option
    const subOptionElement = this.page.locator(this.DROPDOWN_MENU_OPTIONS).filter({ hasText: subOption });
    await subOptionElement.click();
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get vertical stacked chart tooltip
   */
  public async getVerticalStackedChartToolTip(): Promise<string[]> {
    if (!this.cardElement) throw new HoonuitException('Card element not initialized');
    
    let tooltipElement: Locator;
    
    // Check if there's a series hover state
    const seriesHover = this.page.locator('.highcharts-series-hover');
    if (await seriesHover.count() > 0) {
      tooltipElement = this.cardElement.locator(this.TOOLTIP);
    } else {
      await this.cardElement.hover();
      tooltipElement = this.cardElement.locator(this.TOOLTIP);
      await tooltipElement.waitFor({ state: 'visible', timeout: 30000 });
    }
    
    // Check if tooltip has a table structure
    const tableElement = tooltipElement.locator('table');
    if (await tableElement.count() > 0) {
      const texts: string[] = [];
      const rowElements = tooltipElement.locator('tr');
      const rowCount = await rowElements.count();
      
      for (let i = 0; i < rowCount; i++) {
        const rowText = await rowElements.nth(i).innerText();
        texts.push(rowText);
      }
      
      return texts;
    } else {
      // Simple tooltip structure
      const spanElement = tooltipElement.locator('span').first();
      if (await spanElement.count() > 0) {
        await spanElement.scrollIntoViewIfNeeded();
        const text = await spanElement.innerText();
        return text.split('\n');
      }
    }
    
    return [];
  }

  /**
   * Get the card element (protected accessor)
   */
  protected getCardElementInternal(): Locator | null {
    return this.cardElement;
  }

  /**
   * Get the graph element (protected accessor)
   */
  protected getGraphElementInternal(): Locator | null {
    return this.graphElement;
  }
}