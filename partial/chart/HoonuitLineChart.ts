import { Page, Locator } from '@playwright/test';
import { HoonuitBaseChart } from './HoonuitBaseChart';

/**
 * Line Chart implementation for Hoonuit dashboards
 * @author Sourav.Panda (converted to TypeScript)
 * @since 4/19/2021
 */
export class HoonuitLineChart extends HoonuitBaseChart {
  // Selectors
  private readonly legendsSelector = 'g.highcharts-legend-item';
  private readonly legendPointSelector = 'path.highcharts-point';
  private readonly pathLabelSelector = 'g.highcharts-markers path[class*="highcharts-point"]';
  private readonly defaultValue = '0';
  private readonly dataLabelSelector = 'g.highcharts-data-label';
  private readonly dataLabelsSelector = 'g.highcharts-data-labels';
  private readonly dataValueSelector = 'tspan.highcharts-text-outline';
  private readonly xAxisLabelsSelector = 'g.highcharts-xaxis-labels text';
  private readonly lineChartTooltipSelector = 'div.highcharts-tooltip';
  private readonly toggleButtonSelector = 'button[class*="proxy-button"][class*="highcharts"]';

  constructor(page: Page, title: string, subChartTitle?: string) {
    super(page, title, subChartTitle);
  }

  /**
   * Click on horizontal chart with legend selection
   * @param axisLabelName - Axis label name to click
   * @param legendToBeSelected - Legend to select
   */
  public async clickOnHorizontalChart(axisLabelName: string, legendToBeSelected: string): Promise<void> {
    await this.disableAllLegendsExcept(legendToBeSelected);
    const chartElement = await this.getGraphElement();
    const barDataLabels = chartElement.locator(this.pathLabelSelector).filter({ hasText: /./ });
    const dataSize = await barDataLabels.count();
    
    for (let index = 0; index < dataSize; index++) {
      const chartValue = barDataLabels.nth(index);
      await chartValue.hover();
      const tooltipData = await this.getToolTip();
      
      if (tooltipData[0] === axisLabelName) {
        await chartValue.click();
        return;
      }
    }
    
    throw new Error(`${axisLabelName} not found in line chart`);
  }

  /**
   * Get vertical bar chart values with coordinate mapping logic
   * @returns Map of chart label to data values
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
   * Override getToolTip to handle line chart specific tooltip structure
   * @returns Array of tooltip data
   */
  public async getToolTip(): Promise<string[]> {
    const tooltip = this.page.locator(this.lineChartTooltipSelector);
    await tooltip.waitFor({ state: 'visible', timeout: 5000 });
    
    const data: string[] = [];
    
    // Check if tooltip has table structure
    const tableExists = await tooltip.locator('table').count() > 0;
    
    if (tableExists) {
      const spanText = await tooltip.locator('span').innerText();
      data.push(spanText.split('\n')[0]);
      
      const rows = tooltip.locator('tr');
      const rowCount = await rows.count();
      for (let i = 0; i < rowCount; i++) {
        const rowText = await rows.nth(i).innerText();
        data.push(rowText);
      }
    } else {
      const spanText = await tooltip.locator('span').innerText();
      const lines = spanText.split('\n');
      data.push(...lines);
    }
    
    return data;
  }

  /**
   * Get chart values for specific x-axis labels
   * @param xAxisLabels - Array of x-axis labels to get values for
   * @returns Map of label to tooltip data
   */
  public async getAnyChartValues(...xAxisLabels: string[]): Promise<Map<string, string[]>> {
    const chartMap = new Map<string, string[]>();
    
    for (const xAxisLabel of xAxisLabels) {
      // Wait for element with specific aria-label
      const selector = `[aria-label*=". ${xAxisLabel},"]`;
      await this.page.waitForSelector(selector, { timeout: 30000 });
      
      const chartElement = await this.getGraphElement();
      const barDataLabel = chartElement.locator(selector);
      
      if (await barDataLabel.count() > 0) {
        await barDataLabel.hover();
        await this.page.waitForTimeout(1000);
        
        const tooltipData = await this.getToolTip();
        const key = tooltipData[0].trim()
          .replace(/"/g, '')
          .replace(/:.*$/, '')
          .replace(/● /, '');
        
        chartMap.set(key, tooltipData);
      }
    }
    
    if (chartMap.size === xAxisLabels.length) {
      return chartMap;
    }
    
    throw new Error(`Found only these ${JSON.stringify(Array.from(chartMap.keys()))} using ${JSON.stringify(xAxisLabels)}`);
  }

  /**
   * Override disableAllLegendsExcept to handle line chart specific toggle buttons
   * @param legendLabel - Legend label to keep enabled
   */
  public async disableAllLegendsExcept(legendLabel: string): Promise<void> {
    const chartElement = await this.getGraphElement();
    const toggleButtons = chartElement.locator('..').locator(this.toggleButtonSelector);
    const buttonCount = await toggleButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      await this.page.waitForTimeout(200);
      
      const button = toggleButtons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaPressed = await button.getAttribute('aria-pressed');
      
      if (ariaLabel && ariaPressed) {
        if (!ariaLabel.endsWith(legendLabel) && ariaPressed.includes('true')) {
          await button.click();
        } else if (ariaLabel.endsWith(legendLabel) && ariaPressed.includes('false')) {
          await button.click();
        }
      }
    }
    
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on vertical chart with legend selection
   * @param axisLabelName - Axis label name
   * @param legendToBeSelected - Legend to select
   */
  public async clickOnVerticalChart(axisLabelName: string, legendToBeSelected: string): Promise<void> {
    await this.disableAllLegendsExcept(legendToBeSelected);
    await this.page.waitForLoadState('networkidle');
    
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
            await dataLabelElements.nth(currentDataLabelIndex).hover();
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

  // Expose protected methods for child classes to use
  public async getGraphElement(): Promise<Locator> {
    return await super.getGraphElement();
  }

  public async getStakedItems(): Promise<string[]> {
    return await super.getStakedItems();
  }

  // Method to access page for child classes
  public getPage(): Page {
    return this.page;
  }
}
