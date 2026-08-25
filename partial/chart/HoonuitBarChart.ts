import { Page, Locator } from '@playwright/test';
import { HoonuitBaseChart } from './HoonuitBaseChart';

/**
 * Bar Chart implementation for Hoonuit dashboards
 * @author Sourav.Panda (converted to TypeScript)
 * @since 4/8/2021
 */
export default class HoonuitBarChart extends HoonuitBaseChart {
  // Selectors
  private readonly dataLabelSelector = 'g.highcharts-data-label';
  private readonly dataLabelsSelector = 'g.highcharts-data-labels';
  private readonly dataValueSelector = 'tspan.highcharts-text-outline';
  private readonly xAxisLabelsSelector = 'g.highcharts-xaxis-labels text';
  private readonly yAxisLabelsSelector = 'g.highcharts-yaxis-labels text';
  private readonly legendsSelector = 'g.highcharts-legend-item';
  private readonly defaultValue = '0';

  constructor(page: Page, title: string, subChart?: string) {
    super(page, title, subChart);
  }

  /**
   * Get vertical bar chart values with coordinate mapping logic
   * @returns Map of bar chart label to data values
   */
  public async getVerticalBarChartValues(): Promise<Map<string, string>> {
    const chartMap = new Map<string, string>();
    const xAxisLabels = await this.getXAxisLabels();
    const labelsXCoordinateValues = await this.getLabelsXAxisValues();
    const dataLabelTransformYvalues: number[] = [];
    
    const barDataLabels = await this.getDataLabelElements();
    const xAxisLabelSize = xAxisLabels.length;
    
    // Check if labels and data are in 1-1 mapping
    if (xAxisLabels.length === await barDataLabels.count()) {
      for (let i = 0; i < xAxisLabelSize; i++) {
        const dataValue = await barDataLabels.nth(i).locator(this.dataValueSelector).innerText();
        chartMap.set(xAxisLabels[i], dataValue.replace(/,/g, ''));
      }
    } else {
      // Complex coordinate mapping logic
      const chartElement = await this.getGraphElement();
      const dataLabelsElement = chartElement.locator(this.dataLabelsSelector);
      const dataLabelsTransformXvalue = await this.getTransform(dataLabelsElement, 'x');
      
      // Get all dataLabel transform x coordinate values
      const barDataLabelCount = await barDataLabels.count();
      for (let i = 0; i < barDataLabelCount; i++) {
        const transformValue = await this.getTransform(barDataLabels.nth(i), 'x');
        dataLabelTransformYvalues.push(transformValue);
      }
      
      let filledData = 0;
      
      for (let i = 0; i < barDataLabelCount; i++) {
        const additionValue = dataLabelsTransformXvalue + dataLabelTransformYvalues[i];
        let dataNotMapped = true;
        
        for (let j = filledData; j < xAxisLabelSize && dataNotMapped; j++) {
          const rangeMin = labelsXCoordinateValues[j] - 18;
          const rangeMax = labelsXCoordinateValues[j] + 18;
          
          if (additionValue >= rangeMin && additionValue <= rangeMax) {
            const dataValue = await barDataLabels.nth(i).locator(this.dataValueSelector).innerText();
            chartMap.set(xAxisLabels[j], dataValue.replace(/,/g, ''));
            dataNotMapped = false;
          } else {
            chartMap.set(xAxisLabels[j], this.defaultValue);
          }
          filledData++;
        }
      }
      
      // Fill remaining values with 0
      while (filledData < xAxisLabelSize) {
        chartMap.set(xAxisLabels[filledData], this.defaultValue);
        filledData++;
      }
    }
    
    return chartMap;
  }

  /**
   * Get horizontal bar chart values
   * @returns Map of horizontal bar chart values
   */
  public async getHorizontalBarChartValues(): Promise<Map<string, string>> {
    const chartMap = new Map<string, string>();
    await this.page.waitForLoadState('networkidle');
    
    const yAxisLabels = await this.getXAxisLabels(); // In y axis labels, attribute is set as xaxis-labels
    const yAxisLabelsCoordinates = await this.getLabelsYAxisValues();
    
    const dataLabelElements = await this.getDataLabelElements();
    let dataLabelParentsYCoordinate = -1;
    
    if (await dataLabelElements.count() > 0) {
      const parentElement = await this.getParentLocator(dataLabelElements.nth(0));
      dataLabelParentsYCoordinate = await this.getTransform(parentElement, 'y');
    }
    
    let currentDataLabelIndex = 0;
    for (let i = 0; i < yAxisLabels.length; i++) {
      if (dataLabelParentsYCoordinate === -1) {
        chartMap.set(yAxisLabels[i], '0');
        continue;
      }
      
      if (currentDataLabelIndex < await dataLabelElements.count()) {
        const dataLabelEffectiveYCoordinate = dataLabelParentsYCoordinate +
          await this.getTransform(dataLabelElements.nth(currentDataLabelIndex), 'y');
        
        if (dataLabelEffectiveYCoordinate <= yAxisLabelsCoordinates[i]) {
          const dataValue = await dataLabelElements.nth(currentDataLabelIndex).locator(this.dataValueSelector).innerText();
          chartMap.set(yAxisLabels[i], dataValue);
          currentDataLabelIndex++;
        } else {
          chartMap.set(yAxisLabels[i], '0');
        }
      }
    }
    
    return chartMap;
  }

  /**
   * Check if input is in year format (YYYY-YYYY)
   * @param input - Input string to check
   * @returns True if year format, false otherwise
   */
  public isYearFormat(input: string): boolean {
    const yearRangePattern = /^\d{4}-\d{4}$/;
    return yearRangePattern.test(input);
  }

  /**
   * Click on chart element
   * @param axisLabelName - Axis label name to click
   * @param verticalBarClickNeedToBeExecuted - Whether vertical bar click is needed
   */
  public async click(axisLabelName: string, verticalBarClickNeedToBeExecuted: boolean = false): Promise<void> {
    const yAxisLabels = await this.getXAxisLabels();
    const yAxisLabelsCoordinates = await this.getLabelsYAxisValues();
    
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
        
        if (dataLabelEffectiveYCoordinate <= yAxisLabelsCoordinates[i]) {
          if (yAxisLabels[i] === axisLabelName) {
            if (verticalBarClickNeedToBeExecuted) {
              const parentParent = await this.getParentLocator(await this.getParentLocator(dataLabelElements.nth(currentDataLabelIndex)));
              const seriesElement = parentParent.locator('g.highcharts-series').nth(i);
              await seriesElement.hover();
              await seriesElement.click({ position: { x: 0, y: 20 } });
            } else {
              await dataLabelElements.nth(currentDataLabelIndex).click();
            }
            return;
          }
          currentDataLabelIndex++;
        }
      }
    }
  }

  /**
   * Click on X-axis label
   * @param axisLabelName - Axis label name to click
   */
  public async clickXAxisLabel(axisLabelName: string): Promise<void> {
    const yAxisLabels = await this.getXAxisLabels();
    const yAxisLabelsCoordinates = await this.getLabelsXAxisValues();
    
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
        
        if (dataLabelEffectiveYCoordinate <= yAxisLabelsCoordinates[i]) {
          if (yAxisLabels[i] === axisLabelName) {
            await dataLabelElements.nth(currentDataLabelIndex).click();
            return;
          }
          currentDataLabelIndex++;
        }
      }
    }
  }

  /**
   * Click on vertical chart with legend selection
   * @param axisLabelName - Axis label name
   * @param legendToBeSelected - Legend to select
   * @param verticalBarClickNeedToBeExecuted - Whether vertical bar click is needed
   */
  public async clickOnVerticalChart(axisLabelName: string, legendToBeSelected: string, verticalBarClickNeedToBeExecuted: boolean = false): Promise<void> {
    await this.disableAllLegendsExcept(legendToBeSelected);
    const xAxisLabels = await this.getXAxisLabels();
    const xAxisLabelsCoordinates = await this.getLabelsXAxisValues();
    
    const dataLabelElements = await this.getDataLabelElements();
    let dataLabelParentsYCoordinate = -1;
    
    if (await dataLabelElements.count() > 0) {
      const parentElement = await this.getParentLocator(dataLabelElements.nth(0));
      dataLabelParentsYCoordinate = await this.getTransform(parentElement, 'x');
    }
    
    let currentDataLabelIndex = 0;
    for (let i = 0; i < xAxisLabels.length; i++) {
      if (currentDataLabelIndex < await dataLabelElements.count()) {
        const dataLabelEffectiveYCoordinate = dataLabelParentsYCoordinate +
          await this.getTransform(dataLabelElements.nth(currentDataLabelIndex), 'x');
        
        if (dataLabelEffectiveYCoordinate <= xAxisLabelsCoordinates[i]) {
          if (xAxisLabels[i] === axisLabelName) {
            if (verticalBarClickNeedToBeExecuted || this.isYearFormat(axisLabelName)) {
              const parentParent = await this.getParentLocator(await this.getParentLocator(dataLabelElements.nth(currentDataLabelIndex)));
              await parentParent.click();
            } else {
              await dataLabelElements.nth(currentDataLabelIndex).click();
            }
            break;
          }
          currentDataLabelIndex++;
        }
      }
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on vertical chart with additional value in X-axis
   * @param axisLabelName - Axis label name
   * @param legendToBeSelected - Legend to select
   */
  public async clickOnVerticalChartWithAdditionalValueInXAxis(axisLabelName: string, legendToBeSelected: string): Promise<void> {
    await this.disableAllLegendsExcept(legendToBeSelected);
    const xAxisLabels = await this.getXAxisLabelsForVerticalGraph();
    const xAxisLabelsCoordinates = await this.getLabelsXAxisValues();
    
    const dataLabelElements = await this.getDataLabelElements();
    let dataLabelParentsYCoordinate = -1;
    
    if (await dataLabelElements.count() > 0) {
      const parentElement = await this.getParentLocator(dataLabelElements.nth(0));
      dataLabelParentsYCoordinate = await this.getTransform(parentElement, 'x');
    }
    
    let currentDataLabelIndex = 0;
    for (let i = 0; i < xAxisLabels.length; i++) {
      if (currentDataLabelIndex < await dataLabelElements.count()) {
        const dataLabelEffectiveYCoordinate = dataLabelParentsYCoordinate +
          await this.getTransform(dataLabelElements.nth(currentDataLabelIndex), 'x');
        
        if (dataLabelEffectiveYCoordinate <= xAxisLabelsCoordinates[i]) {
          if (xAxisLabels[i] === axisLabelName) {
            const parentParent = await this.getParentLocator(await this.getParentLocator(dataLabelElements.nth(currentDataLabelIndex)));
            const seriesPath = parentParent.locator('g.highcharts-series path');
            await seriesPath.hover();
            await seriesPath.click({ position: { x: 0, y: 20 } });
            return;
          }
          currentDataLabelIndex++;
        }
      }
    }
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get X-axis labels for vertical graph
   * @returns Array of X-axis labels
   */
  protected async getXAxisLabelsForVerticalGraph(): Promise<string[]> {
    // This method might need different logic based on the specific chart structure
    return await this.getXAxisLabels();
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
   * Get Y-axis label coordinate values
   * @returns Array of Y-axis coordinate values
   */
  private async getLabelsYAxisValues(): Promise<number[]> {
    const texts: number[] = [];
    const chartElement = await this.getGraphElement();
    const xAxisLabels = chartElement.locator(this.xAxisLabelsSelector); // Note: using xAxis for y values
    
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
   * Get parent locator of an element
   * @param element - The child element
   * @returns Parent locator
   */
  private async getParentLocator(element: Locator): Promise<Locator> {
    return element.locator('xpath=..');
  }

  /**
   * Get X-axis legend values
   * @returns Array of legend values
   */
  public async getXAxisLegendValues(): Promise<string[]> {
    const texts: string[] = [];
    const chartElement = await this.getGraphElement();
    const legends = chartElement.locator(this.legendsSelector);
    
    const count = await legends.count();
    for (let i = 0; i < count; i++) {
      const legendText = await legends.nth(i).innerText();
      texts.push(legendText);
    }
    return texts;
  }
}
