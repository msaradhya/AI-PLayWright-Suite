import { Page, Locator } from '@playwright/test';
import HoonuitBaseDialog from './HoonuitBaseDialog';
import HoonuitGridTable from '../../partial/table/HoonuitGridTable';

/**
 * Base class for dialogs that appear from "Card Tools -> MoreInfo"
 * @author aradhyas (converted from Java by amittiwari)
 * @since 22/05/2025 (original: 19/07/21)
 */
export default abstract class HoonuitChartInformationDialog extends HoonuitBaseDialog {
    // Selectors
    private readonly TABS_SELECTOR = 'ul.pds-tabs a';
    private readonly DATA_TABLE_SELECTOR = 'div.ag-root';

    /**
     * Constructor
     * @param page - Playwright Page object
     * @param dialogSelector - CSS selector for the dialog element
     */
    constructor(page: Page, dialogSelector: string) {
        super(page, page.locator(dialogSelector));
    }

    /**
     * Select a tab in the dialog by its name
     * @param tabName - Name of the tab to select
     */
    public async selectTab(tabName: string): Promise<void> {
        const tabs = this.getBody().locator(this.TABS_SELECTOR);
        const targetTab = tabs.filter({ hasText: tabName });
        await targetTab.click();
        
        // Wait for page to load and loading indicators to disappear
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('.pds-loader-sm', { state: 'hidden' });
    }

    /**
     * Get the data table in the dialog
     * @returns Grid table component for the data
     */
    public getDataTable(): HoonuitGridTable {
        const tableElement = this.getBody().locator(this.DATA_TABLE_SELECTOR);
        return new HoonuitGridTable(this.page, tableElement);
    }
}