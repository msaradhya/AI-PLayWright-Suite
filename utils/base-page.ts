import { Page } from '@playwright/test';

/**
 * Base Page class for all page objects
 * Provides common functionality for page interactions
 */
export abstract class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Wait for page to be fully loaded
     */
    async waitForPage(): Promise<void> {
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Check if page is displayed (to be implemented by subclasses)
     */
    abstract isPageDisplayed(): Promise<boolean>;

    /**
     * Navigate to a URL
     */
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
        await this.waitForPage();
    }

    /**
     * Click an element with retry logic
     */
    async clickElement(selector: string, options?: { timeout?: number }): Promise<void> {
        await this.page.click(selector, options);
    }

    /**
     * Fill a text field
     */
    async fillField(selector: string, text: string): Promise<void> {
        await this.page.fill(selector, text);
    }

    /**
     * Get text content of an element
     */
    async getTextContent(selector: string): Promise<string> {
        const element = this.page.locator(selector);
        return await element.textContent() || '';
    }

    /**
     * Wait for an element to be visible
     */
    async waitForElement(selector: string, options?: { timeout?: number }): Promise<void> {
        await this.page.waitForSelector(selector, { state: 'visible', ...options });
    }

    /**
     * Check if an element is visible
     */
    async isElementVisible(selector: string): Promise<boolean> {
        try {
            const element = this.page.locator(selector);
            return await element.isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    /**
     * Take a screenshot
     */
    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }
}