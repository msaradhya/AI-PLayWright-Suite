import { Page, Locator } from '@playwright/test';
import { HoonuitBaseChart } from './HoonuitBaseChart';

/**
 * Stack Bar Chart implementation for Hoonuit dashboards
 * @author amittiwari (converted to TypeScript)
 * @since 07/04/21
 */
export default class HoonuitStackBarChart extends HoonuitBaseChart {
  // Selectors
  private readonly dataLabelSelector = 'g.highcharts-data-label';
  private readonly stackItemsLabelsSelector = 'g.highcharts-data-labels';
  private readonly rectSelector = 'rect.highcharts-point';
  private readonly xAxisLabelsSelector = 'g.highcharts-xaxis-labels text';

  // Chart values storage
  public chartValues = new Map<string, Map<string, string>>();

  constructor(page: Page, title: string, subChart?: string) {
    super(page, title.trim(), subChart);
  }

  /**
   * Get stack chart values
   * @returns Map of stack chart values
   */
  public async getStackChartValue(): Promise<Map<string, string[]>> {
    const chartMap = new Map<string, string[]>();
    
    const chartElement = await this.getGraphElement();
    const dataLabels = chartElement.locator(this.dataLabelSelector).filter({ hasText: /./ });
    const dataSize = await dataLabels.count();
    
    for (let index = 0; index < dataSize; index++) {
      await dataLabels.nth(index).hover();
      const tooltipData = await this.getToolTip();
      
      let key = tooltipData[0].trim()
        .replace(/"/g, '')
        .replace(/\:.*$/, '')
        .replace(/●/, '');
        
      if (!chartMap.has(key)) {
        const values = tooltipData.slice(1);
        chartMap.set(key, values);
      } else {
        const existingValues = chartMap.get(key) || [];
        existingValues.unshift(tooltipData[1]);
        chartMap.set(key, existingValues);
      }
    }
    
    return chartMap;
  }

  /**
   * Get stack distribution chart values
   * @returns Map of stack distribution chart values
   */
  public async getStackDistributionChartValue(): Promise<Map<string, string[]>> {
    const chartMap = new Map<string, string[]>();
    
    const chartElement = await this.getGraphElement();
    const dataLabels = chartElement.locator('g.highcharts-point').filter({ hasText: /./ });
    const dataSize = await dataLabels.count();
    
    for (let index = 0; index < dataSize; index++) {
      await dataLabels.nth(index).hover();
      const tooltipData = await this.getToolTip();
      
      let key = tooltipData[0].trim()
        .replace(/"/g, '')
        .replace(/\:.*$/, '')
        .replace(/●/, '');
        
      if (!chartMap.has(key)) {
        const values = tooltipData.slice(1);
        chartMap.set(key, values);
      } else {
        const existingValues = chartMap.get(key) || [];
        existingValues.unshift(tooltipData[1]);
        chartMap.set(key, existingValues);
      }
    }
    
    return chartMap;
  }

  /**
   * Click on a specific value in the stack chart
   * @param value - The value to click on
   */
  public async clickOnStackChartValue(value: string): Promise<void> {
    const chartElement = await this.getGraphElement();
    const dataLabels = chartElement.locator(this.dataLabelSelector).filter({ hasText: /./ });
    const dataSize = await dataLabels.count();
    
    for (let index = 0; index < dataSize; index++) {
      const chartValue = dataLabels.nth(index);
      await chartValue.hover();
      const tooltipData = await this.getToolTip();
      
      if (tooltipData[1] === value) {
        await chartValue.click();
        return;
      }
    }
    
    throw new Error(`${value} not found in stack chart`);
  }

  /**
   * Click on vertical chart with legend selection
   * @param axisLabelName - Axis label name
   * @param legendToBeSelected - Legend to select
   */
  public async clickOnVerticalChart(axisLabelName: string, legendToBeSelected: string): Promise<void> {
    await this.disableAllLegendsExcept(legendToBeSelected);
    const yAxisLabels = await this.getXAxisLabels(); // In y axis labels, attribute is set as xaxis-labels
    const xAxisLabelsCoordinates = await this.getLabelsXAxisValues();
    
    const dataLabelElements = await this.getDataLabelElements();
    let dataLabelParentsYCoordinate = -1;
    
    if (await dataLabelElements.count() > 0) {
      const parentElement = await this.getParentLocator(dataLabelElements.nth(0));
      dataLabelParentsYCoordinate = await this.getTransform(parentElement, 'x');
    }
    
    let currentDataLabelIndex = 0;
    for (let i = 0; i < yAxisLabels.length; i++) {
      if (currentDataLabelIndex < await dataLabelElements.count()) {
        const dataLabelEffectiveYCoordinate = dataLabelParentsYCoordinate +
          await this.getTransform(dataLabelElements.nth(currentDataLabelIndex), 'x');
        
        if (dataLabelEffectiveYCoordinate <= xAxisLabelsCoordinates[i]) {
          if (yAxisLabels[i] === axisLabelName) {
            await dataLabelElements.nth(currentDataLabelIndex).click({ position: { x: 10, y: 0 } });
            return;
          }
          currentDataLabelIndex++;
        }
      }
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on horizontal chart with legend selection
   * @param axisLabelName - Axis label name
   * @param seriesToBeClicked - Series to be clicked
   */
  public async clickOnHorizontalChart(axisLabelName: string, seriesToBeClicked: string): Promise<void> {
    await this.disableAllLegendsExcept(seriesToBeClicked);
    const yAxisLabels = await this.getXAxisLabels(); // In y axis labels, attribute is set as xaxis-labels
    const xAxisLabelsCoordinates = await this.getLabelsYAxisValues();
    
    const dataLabelElements = await this.getDataLabelElements();
    let dataLabelParentsYCoordinate = -1;
    
    if (await dataLabelElements.count() > 0) {
      const parentElement = await this.getParentLocator(dataLabelElements.nth(0));
      dataLabelParentsYCoordinate = await this.getTransform(parentElement, 'y');
    }
    
    let currentDataLabelIndex = 0;
    for (let i = 0; i < yAxisLabels.length; i++) {
      if (currentDataLabelIndex < await dataLabelElements.count()) {
        const dataLabelEffectiveYCoordinate = dataLabelParentsYCoordinate +
          await this.getTransform(dataLabelElements.nth(currentDataLabelIndex), 'y');
        
        if (dataLabelEffectiveYCoordinate <= xAxisLabelsCoordinates[i]) {
          if (yAxisLabels[i] === axisLabelName) {
            await dataLabelElements.nth(currentDataLabelIndex).click();
            return;
          }
          currentDataLabelIndex++;
        }
      }
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get Y-axis label coordinate values
   * @returns Array of Y-axis coordinate values
   */
  private async getLabelsYAxisValues(): Promise<number[]> {
    const texts: number[] = [];
    const chartElement = await this.getGraphElement();
    const xAxisLabels = chartElement.locator(this.xAxisLabelsSelector);
    
    const count = await xAxisLabels.count();
    for (let i = 0; i < count; i++) {
      const element = xAxisLabels.nth(i);
      const attribute = await element.getAttribute('y');
      
      if (attribute && attribute.trim() !== '') {
        texts.push(Math.round(parseFloat(attribute)));
      } else {
        throw new Error(`No y-axis attribute is defined for the element`);
      }
    }
    return texts;
  }

  /**
   * Get transform value from element's transform attribute
   * @param element - The element to get transform from
   * @param axis - The axis ('x' or 'y')
   * @returns Transform value
   */
  private async getTransform(element: Locator, axis: 'x' | 'y'): Promise<number> {
    const regexPattern = axis === 'y' ? /,\d{1,4}/ : /\d{1,4},/;
    const transformAttr = await element.getAttribute('transform');
    
    if (!transformAttr) {
      throw new Error(`No transform attribute found for element`);
    }
    
    const match = transformAttr.match(regexPattern);
    if (match) {
      return parseInt(match[0].replace(',', ''));
    } else {
      throw new Error(`No matches found for ${axis} axis in transform attribute of the element`);
    }
  }

  /**
   * Get data label elements
   * @returns Collection of visible data label elements
   */
  private async getDataLabelElements(): Promise<Locator> {
    const chartElement = await this.getGraphElement();
    return chartElement.locator(this.dataLabelSelector).filter({ hasText: /./ });
  }

  /**
   * Get X-axis label coordinate values
   * @returns Array of X-axis coordinate values
   */
  private async getLabelsXAxisValues(): Promise<number[]> {
    const texts: number[] = [];
    const chartElement = await this.getGraphElement();
    const xAxisLabels = chartElement.locator(this.xAxisLabelsSelector);
    
    const count = await xAxisLabels.count();
    for (let i = 0; i < count; i++) {
      const element = xAxisLabels.nth(i);
      const attribute = await element.getAttribute('x');
      
      if (attribute && attribute.trim() !== '') {
        texts.push(Math.round(parseFloat(attribute)));
      } else {
        throw new Error(`No x-axis attribute is defined for the element`);
      }
    }
    return texts;
  }

  /**
   * Get horizontal chart values with complex stacked data processing
   * @returns Nested map of horizontal chart values
   */
  public async getHorizontalChartValues(): Promise<Map<string, Map<string, string>>> {
    this.chartValues.clear();
    let isExist = false;
    
    const chartElement = await this.getGraphElement();
    const stackLabelCollections = chartElement.locator(this.stackItemsLabelsSelector);
    const stackLabelCount = await stackLabelCollections.count();
    
    const xAxisLabels = await this.getXAxisLabels();
    const stackedItems = await this.getStakedItems();
    const legendCount = stackedItems.length;
    
    for (let i = 0; i < stackLabelCount; i++) {
      const stackDataCollection = stackLabelCollections.nth(i).locator("g.highcharts-label tspan[class*='highcharts-text']");
      
      if (!isExist) {
        for (let j = 0; j < xAxisLabels.length; j++) {
          const values = new Map<string, string>();
          const stackText = await stackDataCollection.nth(j).innerText();
          values.set(stackedItems[legendCount - i - 1], stackText);
          this.chartValues.set(xAxisLabels[j], values);
        }
        isExist = true;
      } else {
        for (let j = 0; j < xAxisLabels.length; j++) {
          const stackData = stackDataCollection.nth(j);
          let textValue: string;
          
          if (await stackData.isVisible()) {
            textValue = await stackData.innerText();
          } else {
            textValue = await this.page.evaluate(el => el?.textContent || '', await stackData.elementHandle());
          }
          
          const existingValues = this.chartValues.get(xAxisLabels[j]);
          if (existingValues) {
            existingValues.set(stackedItems[legendCount - i - 1], textValue);
          }
        }
      }
    }
    
    return this.chartValues;
  }

  /**
   * Get vertical chart tooltip data
   * @returns Map of tooltip data for vertical stacked chart
   */
  public async getVerticalChartTooltip(): Promise<Map<string, string[]>> {
    const chartElement = await this.getGraphElement();
    const dataLabels = chartElement.locator(this.dataLabelSelector).filter({ hasText: /./ });
    const dataLabelCount = await dataLabels.count();
    
    const resultMap = new Map<string, string[]>();
    
    for (let i = 0; i < dataLabelCount; i++) {
      await dataLabels.nth(i).hover();
      const tooltipData = await this.getVerticalStackedChartToolTip();
      
      const key = tooltipData[0].trim()
        .replace(/"/g, '')
        .replace(/\..*$/, '')
        .replace(/●/, '');
      
      const values = tooltipData.slice(1);
      resultMap.set(key, values);
    }
    
    return resultMap;
  }

  /**
   * Get vertical stacked chart tooltip data
   * @returns Array of tooltip data strings
   */
  protected async getVerticalStackedChartToolTip(): Promise<string[]> {
    // This method would need to be implemented based on specific tooltip structure
    // For now, using the base tooltip method
    return await this.getToolTip();
  }

  /**
   * Get X-axis label values
   * @returns Array of x-axis label values
   */
  public async getXAxisLabelValues(): Promise<string[]> {
    const texts: string[] = [];
    const chartElement = await this.getGraphElement();
    const xAxisLabels = chartElement.locator(this.xAxisLabelsSelector);
    
    const count = await xAxisLabels.count();
    for (let i = 0; i < count; i++) {
      const labelText = await xAxisLabels.nth(i).innerText();
      texts.push(labelText);
    }
    return texts;
  }

  /**
   * Get parent locator of an element
   * @param element - The child element
   * @returns Parent locator
   */
  private async getParentLocator(element: Locator): Promise<Locator> {
    return element.locator('xpath=..');
  }
}