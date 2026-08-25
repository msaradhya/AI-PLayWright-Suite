import { Page } from '@playwright/test';
import { BasePage } from '../../../utils/base-page';
import { HoonuitSisHelper } from '../../helpers/hoonuit-sis-helper';
import { ConfigManager } from '../../../config/ConfigManager';

/**
 * Project-Specific Base Page class for Hoonuit SIS Integration
 * Extends the framework's BasePage and adds Hoonuit-specific functionality
 */
export class HoonuitSisBasePage extends BasePage {
    protected hoonuitHelper: HoonuitSisHelper;
    
    // Common Hoonuit selectors
    protected readonly pageTitleLocator = 'h1.text-secondary, span[aria-current="page"], h1.ng-star-inserted, h1.mb-6, h1.mb-4, h1.mb-0, h1.pds-page-text-primary';
    protected readonly dashboardToolsEllipsis = 'button[ngbtooltip="Dashboard Tools"]';
    protected readonly notificationDialog = 'div.ui-pnotify';
    protected readonly notificationText = 'div.ui-pnotify-text';
    protected readonly closeNotificationSelector = 'div[title="Close"]';
    protected readonly pdLoader = '.pds-loader-sm.style-scope.pds-loader';
    protected readonly pageSpinner = 'div#loading-bar-spinner';
    protected readonly mtssSpinner = 'div[class="ngx-spinner-icon"]';
    protected readonly subTitleLocator = 'p.mb-6.ng-star-inserted';

    /**
     * Create a new HoonuitSisBasePage instance
     * @param page - Playwright page instance
     */
    constructor(page: Page) {
        super(page);
        this.hoonuitHelper = new HoonuitSisHelper(page);
    }

    /**
     * Abstract method that can be optionally implemented by subclasses to define the page title
     * @returns Expected page title or empty string
     */
    protected pageTitle(): string {
        return '';
    }

    /**
     * Wait for the Hoonuit page to be fully loaded
     * Combines framework wait with Hoonuit-specific waits
     */
    async waitForHoonuitPage(): Promise<void> {
        // Use framework's page wait first
        await this.waitForPage();
        
        // Add Hoonuit-specific waits
        await this.hoonuitHelper.waitForPageToLoad();
        
        // If a page title is defined, verify it
        const expectedTitle = this.pageTitle();
        if (expectedTitle && expectedTitle.length > 0) {
            try {
                await this.page.waitForSelector(this.pageTitleLocator, { 
                    state: 'visible',
                    timeout: 60000
                });
                
                const actualTitle = await this.getPageTitleText();
                if (actualTitle !== expectedTitle) {
                    console.warn(`Page title mismatch: expected "${expectedTitle}" but found "${actualTitle}"`);
                }
            } catch (error) {
                console.warn(`Page title verification failed: ${error}`);
            }
        }

        // Wait for loaders to disappear
        await this.waitForLoadersToDisappear();
    }

    /**
     * Wait for all loaders/spinners to disappear
     */
    async waitForLoadersToDisappear(): Promise<void> {
        try {
            const pdLoader = this.page.locator(this.pdLoader);
            await pdLoader.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
            
            const pageSpinner = this.page.locator(this.pageSpinner);
            await pageSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
            
            const mtssSpinner = this.page.locator(this.mtssSpinner);
            await mtssSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
        } catch (error) {
            console.warn('Loader wait timeout:', error);
        }
    }

    /**
     * Get the text of the page title
     */
    protected async getPageTitleText(): Promise<string> {
        const titleElements = await this.page.locator(this.pageTitleLocator).all();
        if (titleElements.length === 0) return '';
        
        // Get the last visible title element
        for (let i = titleElements.length - 1; i >= 0; i--) {
            const isVisible = await titleElements[i].isVisible();
            if (isVisible) {
                return await titleElements[i].innerText();
            }
        }
        return '';
    }

    /**
     * Select a tool from the dashboard tools dropdown
     * @param item - Main menu item to select
     * @param subItem - Optional sub-menu item
     */
    async selectDashboardTool(item: string, subItem?: string): Promise<void> {
        await this.page.locator(this.dashboardToolsEllipsis).scrollIntoViewIfNeeded();
        await this.page.click(this.dashboardToolsEllipsis);
        
        const itemLocator = this.page.locator('div.itemContainer', { hasText: item }).first();
        await itemLocator.scrollIntoViewIfNeeded();
        await itemLocator.click();
        
        if (subItem) {
            const subItemLocator = this.page.locator('div.itemContainer', { hasText: subItem }).first();
            await subItemLocator.click();
        }
    }

    /**
     * Get notification text from the notification dialog
     */
    async getNotificationText(): Promise<string> {
        const notifLocator = this.page.locator(this.notificationText);
        await notifLocator.waitFor({ state: 'visible' });
        return await notifLocator.innerText();
    }

    /**
     * Close the notification dialog
     */
    async closeNotification(): Promise<void> {
        const closeButton = this.page.locator(this.closeNotificationSelector);
        await closeButton.waitFor({ state: 'visible' });
        await closeButton.click();
    }

    /**
     * Check if the page is displayed by verifying its title
     */
    async isPageDisplayed(): Promise<boolean> {
        try {
            await this.waitForHoonuitPage();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if a specific subtitle is visible on the page
     * @param subtitle - The subtitle text to check for
     * @returns True if the subtitle is visible, false otherwise
     */
    async isSubtitleVisible(subtitle: string): Promise<boolean> {
        try {
            const subtitleElement = this.page.locator(this.subTitleLocator).filter({ hasText: subtitle });
            const count = await subtitleElement.count();
            if (count === 0) return false;
            
            return await subtitleElement.first().isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for page to load completely
     * Alias for waitForHoonuitPage() to provide backward compatibility
     */
    async waitForPageLoad(): Promise<void> {
        await this.waitForHoonuitPage();
    }

    /**
     * Navigate to the page using the base URL
     * @param path - Optional path to append to base URL
     */
    async navigateToPage(path: string = ''): Promise<void> {
        const config = ConfigManager.getInstance();
        const baseUrl = config.getBaseUrl();
        const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
        await this.page.goto(fullUrl);
        await this.waitForHoonuitPage();
    }
}