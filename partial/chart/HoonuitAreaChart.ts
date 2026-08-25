import { Page, Locator } from '@playwright/test';
import { HoonuitBaseChart } from './HoonuitBaseChart';

/**
 * Area Chart implementation for Hoonuit dashboards
 * @author Payal Prajapati (converted to TypeScript)
 * @since 05/03/2021
 */
export class HoonuitAreaChart extends HoonuitBaseChart {
  // Selectors
  private readonly dataLabelSelector = 'g.highcharts-data-label';
  private readonly xAxisLabelsSelector = 'g.highcharts-xaxis-labels text';
  private readonly seriesItemsSelector = 'g.highcharts-legend-item';

  constructor(page: Page, title: string) {
    super(page, title);
  }

  /**
   * Click on vertical chart at specific axis label and series
   * @param axisLabelName - The axis label name to click on
   * @param seriesToBeClicked - The series to be clicked
   */
  public async clickOnVerticalChart(axisLabelName: string, seriesToBeClicked: string): Promise<void> {
    await this.disableAllLegendsExcept(seriesToBeClicked);
    const xAxisLabels = await this.getXAxisLabels();
    const xAxisLabelsCoordinates = await this.getLabelsXAxisValues();
    
    const dataLabelElements = await this.getDataLabelElements();
    let dataLabelParentsYCoordinate = -1;
    
    if (await dataLabelElements.count() > 0) {
      const firstDataLabel = dataLabelElements.nth(0);
      const parentElement = await this.getParentLocator(firstDataLabel);
      dataLabelParentsYCoordinate = await this.getTransform(parentElement, 'x');
    }
    
    let currentDataLabelIndex = 0;
    for (let i = 0; i < xAxisLabels.length; i++) {
      if (currentDataLabelIndex < await dataLabelElements.count()) {
        const currentDataLabel = dataLabelElements.nth(currentDataLabelIndex);
        const dataLabelEffectiveYCoordinate = dataLabelParentsYCoordinate + await this.getTransform(currentDataLabel, 'x');
        
        if (dataLabelEffectiveYCoordinate <= xAxisLabelsCoordinates[i]) {
          if (xAxisLabels[i] === axisLabelName) {
            await currentDataLabel.click({ position: { x: 5, y: 5 } });
            return;
          }
          currentDataLabelIndex++;
        }
      }
    }
    
    await this.page.waitForLoadState('networkidle');
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
        throw new Error(`No x-axis attribute is defined for the element: ${await element.innerHTML()}`);
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
}
