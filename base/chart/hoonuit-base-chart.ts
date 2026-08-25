import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { HoonuitCard } from '../card/HoonuitCard';
import { HoonuitHelper } from '../../../helpers/HoonuitHelper';

/**
 * UIHN Base Chart Component
 * Abstract base class for all chart components (Bar, Pie, Stack Bar, etc.)
 * 
 * @author Converted from HoonuitBaseChart.java
 * @since 2021-04-07
 */
export abstract class HoonuitBaseChart {
    protected page: Page;
    protected cardElement: Locator | null = null;
    protected graphElement: Locator | null = null;
    
    private readonly legendsSelector = 'g.highcharts-legend-item';
    private readonly chartSelector = 'svg.highcharts-root';
    private readonly subChartHeaderSelector = 'text.highcharts-subtitle';
    private readonly tooltipSelector = 'div.highcharts-tooltip';
    private readonly xAxisSelector = 'g.highcharts-xaxis text';
    private readonly yAxisSelector = 'g.highcharts-yaxis text';
    private readonly xAxisLabelsSelector = 'g.highcharts-xaxis-labels text[opacity="1"]';
    private readonly yAxisLabelsSelector = 'g.highcharts-yaxis-labels text';
    private readonly toggleButtonSelector = 'button[class*="proxy-button"][class*="highcharts"]';
    private readonly dropdownMenuOptionsSelector = 'div.dropdownMode div.dropdown-menu button.dropdown-item';
    private readonly cardToolsButtonSelector = 'button.pds-button-square';
    private readonly mainCellSelector = 'g.highcharts-axis-labels.highcharts-xaxis-labels';
    private readonly subCellSelector = '.highcharts-point.highcharts-color-0';
    private readonly childCellSelector = 'div.dropdown-menu.dropdown-nested.show';
    private readonly subChildCellSelector = 'div.ng-star-inserted button';

    protected title: string;

    constructor(page: Page, title: string) {
        this.page = page;
        this.title = title;
    }

    /**
     * Initialize the chart - must be called after construction
     */
    public async initialize(): Promise<void> {
        const card = new HoonuitCard(this.page, this.title);
        
        if (await card.isExists()) {
            this.cardElement = card.cardElement;
            await this.cardElement.scrollIntoViewIfNeeded();
            await this.cardElement.hover();
            
            this.graphElement = this.cardElement.locator(this.chartSelector);
            await this.graphElement.scrollIntoViewIfNeeded();
            await this.graphElement.waitFor({ state: 'visible' });
            await this.graphElement.hover();
        } else {
            throw new Error(`Chart with title '${this.title}' not found`);
        }
    }

    /**
     * Static factory method to create and initialize a chart
     */
    protected static async createAndInitialize<T extends HoonuitBaseChart>(
        chart: T
    ): Promise<T> {
        await chart.initialize();
        return chart;
    }

    /**
     * Get chart legends
     */
    public async getChartLegends(): Promise<string[]> {
        if (!this.graphElement) throw new Error('Chart not initialized');
        
        const legends = this.graphElement.locator(this.legendsSelector);
        return await legends.allTextContents();
    }

    /**
     * Get X-axis labels
     */
    public async getXAxisLabels(): Promise<string[]> {
        if (!this.graphElement) throw new Error('Chart not initialized');
        
        const xAxisLabels = this.graphElement.locator(this.xAxisLabelsSelector);
        return await xAxisLabels.allTextContents();
    }

    /**
     * Get Y-axis labels
     */
    public async getYAxisLabels(): Promise<string[]> {
        if (!this.graphElement) throw new Error('Chart not initialized');
        
        const yAxisLabels = this.graphElement.locator(this.yAxisLabelsSelector);
        return await yAxisLabels.allTextContents();
    }

    /**
     * Get chart subtitle
     */
    public async getChartSubtitle(): Promise<string> {
        if (!this.graphElement) throw new Error('Chart not initialized');
        
        const subtitle = this.graphElement.locator(this.subChartHeaderSelector);
        return await subtitle.textContent() || '';
    }

    /**
     * Check if chart is visible
     */
    public async isChartVisible(): Promise<boolean> {
        if (!this.graphElement) return false;
        
        return await this.graphElement.isVisible();
    }

    /**
     * Wait for chart to load
     */
    public async waitForChartToLoad(): Promise<void> {
        if (!this.graphElement) throw new Error('Chart not initialized');
        
        await this.graphElement.waitFor({ state: 'visible' });
        await this.page.waitForLoadState('networkidle');
        await HoonuitHelper.waitForPageToLoad(this.page);
    }

    /**
     * Get tooltip text (when hovering over chart elements)
     */
    public async getTooltipText(): Promise<string> {
        const tooltip = this.page.locator(this.tooltipSelector);
        
        if (await tooltip.isVisible()) {
            return await tooltip.textContent() || '';
        }
        
        return '';
    }

    /**
     * Click on chart legend item
     */
    public async clickLegendItem(legendText: string): Promise<void> {
        if (!this.graphElement) throw new Error('Chart not initialized');
        
        const legends = this.graphElement.locator(this.legendsSelector);
        const targetLegend = legends.filter({ hasText: legendText });
        
        if (await targetLegend.count() > 0) {
            await targetLegend.first().click();
        } else {
            throw new Error(`Legend '${legendText}' not found`);
        }
    }

    /**
     * Get dropdown menu options
     */
    public async getDropdownOptions(): Promise<string[]> {
        if (!this.cardElement) throw new Error('Card not initialized');
        
        // Click tools button to open dropdown
        const toolsButton = this.cardElement.locator(this.cardToolsButtonSelector);
        if (await toolsButton.count() > 0) {
            await toolsButton.click();
            await this.page.waitForTimeout(500);
        }
        
        const dropdownOptions = this.page.locator(this.dropdownMenuOptionsSelector);
        return await dropdownOptions.allTextContents();
    }

    /**
     * Select dropdown option
     */
    public async selectDropdownOption(optionText: string): Promise<void> {
        const dropdownOptions = this.page.locator(this.dropdownMenuOptionsSelector);
        const targetOption = dropdownOptions.filter({ hasText: optionText });
        
        if (await targetOption.count() > 0) {
            await targetOption.first().click();
        } else {
            throw new Error(`Dropdown option '${optionText}' not found`);
        }
    }

    /**
     * Abstract method for specific chart interactions - to be implemented by subclasses
     */
    public abstract clickChartElement(elementIdentifier: string): Promise<void>;
}