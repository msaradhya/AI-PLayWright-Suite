import { Page, Locator } from '@playwright/test';

/**
 * MTSS Chart utility class
 * Provides methods for interacting with charts
 * @author hyders
 * @since 05/03/2021
 */
export class MtssChart {
    private page: Page;
    private title: string;
    
    // Locators as private readonly properties
    private readonly dataLabel: Locator;
    private readonly xAxisLabels: Locator;
    private readonly seriesItems: Locator;
    
    constructor(page: Page, title: string) {
        this.page = page;
        this.title = title;
        this.dataLabel = this.page.locator('g.highcharts-data-label');
        this.xAxisLabels = this.page.locator('g.highcharts-xaxis-labels text');
        this.seriesItems = this.page.locator('g.highcharts-legend-item');
    }

    async clickOnVerticalChart(axisLabelName: string, seriesToBeClicked: string): Promise<void> {
        await this.disableAllLegendsExcept(seriesToBeClicked);
        
        const xAxisLabels = await this.getXAxisLabels();
        const xAxisLabelsCoordinates = await this.getLabelsXAxisValues();
        
        const dataLabelElements = await this.getDataLabelElements();
        let dataLabelParentsYCoordinate = -1;

        if (dataLabelElements.length > 0) {
            const parentElement = this.page.locator(dataLabelElements[0]).locator('..');
            dataLabelParentsYCoordinate = await this.getTransform(parentElement, 'X');
        }

        let currentDataLabelIndex = 0;
        for (let i = 0; i < xAxisLabels.length; i++) {
            if (currentDataLabelIndex < dataLabelElements.length) {
                const dataLabelElement = this.page.locator(dataLabelElements[currentDataLabelIndex]);
                const dataLabelEffectiveYCoordinate = dataLabelParentsYCoordinate + await this.getTransform(dataLabelElement, 'X');

                if (dataLabelEffectiveYCoordinate <= xAxisLabelsCoordinates[i]) {
                    if (xAxisLabels[i] === axisLabelName) {
                        await dataLabelElement.click({ position: { x: 5, y: 5 } });
                        return;
                    }
                    currentDataLabelIndex++;
                } else {
                    continue;
                }
            }
        }
        
        await this.page.waitForLoadState('load');
    }

    private async getLabelsXAxisValues(): Promise<number[]> {
        const values: number[] = [];
        const elements = await this.xAxisLabels.all();

        for (const element of elements) {
            const attribute = await element.getAttribute('x');

            if (attribute && attribute.trim() !== '') {
                values.push(Math.round(parseFloat(attribute)));
            } else {
                throw new Error(`No x-axis attribute is defined for the element: ${element}`);
            }
        }
        return values;
    }

    /**
     * It returns the value listed in X-axis or Y-axis of the dataLabel's transform attribute
     *
     * @param dataLabel
     * @param axis ( X or Y )
     * @return value listed in X-axis or Y-axis of the dataLabel's transform attribute
     */
    private async getTransform(dataLabel: Locator, axis: 'X' | 'Y'): Promise<number> {
        const regexPattern = axis === 'Y' ? /,\d{1,4}/ : /\d{1,4},/;
        const transformAttribute = await dataLabel.getAttribute('transform');

        if (!transformAttribute) {
            throw new Error(`No transform attribute found for element`);
        }

        const match = transformAttribute.match(regexPattern);

        if (match) {
            return parseInt(match[0].replace(',', ''));
        } else {
            throw new Error(`No matches found for ${axis} axis in transform attribute of the element`);
        }
    }

    private async getDataLabelElements(): Promise<string[]> {
        const visibleElements = this.dataLabel.filter({ hasNot: this.page.locator(':hidden') });
        const elementHandles = await visibleElements.all();
        return elementHandles.map((_, index) => `g.highcharts-data-label:nth-child(${index + 1})`);
    }

    private async disableAllLegendsExcept(seriesToBeClicked: string): Promise<void> {
        // Implementation would depend on the specific chart library being used
        // This is a placeholder for the legend manipulation functionality
        const legends = this.seriesItems;
        const targetLegend = legends.filter({ hasText: seriesToBeClicked });
        await targetLegend.click();
    }

    private async getXAxisLabels(): Promise<string[]> {
        const labels = await this.xAxisLabels.all();
        const labelTexts: string[] = [];
        
        for (const label of labels) {
            const text = await label.textContent();
            if (text) {
                labelTexts.push(text.trim());
            }
        }
        
        return labelTexts;
    }
}