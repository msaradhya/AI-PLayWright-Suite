/**
 * Wait utility functions for Playwright tests
 * Provides various waiting strategies for page loading and element states
 * 
 * Migrated from: msa/hoonuit/utils/waitForHelpers.ts
 * Converted from Java WaitFor utility class
 */

import { Page } from '@playwright/test';

/**
 * Utility class for waiting operations in Playwright tests
 */
export class WaitForHelpers {
    
    /**
     * Wait for JavaScript to finish execution
     * Checks for jQuery completion if jQuery is present
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForJavaScriptToFinish(page: Page, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForFunction(() => {
                return document.readyState === 'complete' &&
                       (typeof (window as any).jQuery === 'undefined' || (window as any).jQuery.active === 0);
            }, { timeout: timeoutMs });
        } catch (error) {
            console.log('JavaScript wait timed out, continuing...');
        }
    }

    /**
     * Wait for Angular to finish processing
     * Supports both AngularJS and Angular 2+
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 60000)
     */
    static async waitForAngularToFinish(page: Page, timeoutMs: number = 60000): Promise<void> {
        try {
            await page.waitForFunction(() => {
                return document.readyState === 'complete' &&
                       ((window as any).angular === undefined ||
                        ((window as any).ng === undefined || (window as any).ng.probe === undefined));
            }, { timeout: timeoutMs });
            
            await page.waitForTimeout(300);
        } catch (error) {
            console.log('Angular wait timed out, continuing...');
        }
    }

    /**
     * Wait for PDS loader to disappear
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForPDSLoaderToDisappear(page: Page, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForSelector('.pds-loader-sm', { state: 'hidden', timeout: timeoutMs });
        } catch (error) {
            // Ignore if loader is not found or timeout occurs
            console.log('PDS loader wait timed out or not found, continuing...');
        }
    }

    /**
     * Wait for progress spinner to disappear
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForProgressSpinnerToDisappear(page: Page, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForSelector('div[class="ngx-spinner-icon"]', { state: 'hidden', timeout: timeoutMs });
        } catch (error) {
            console.log('Progress spinner wait timed out or not found, continuing...');
        }
    }

    /**
     * Wait for network to be idle
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForNetworkIdle(page: Page, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForLoadState('networkidle', { timeout: timeoutMs });
        } catch (error) {
            console.log('Network idle wait timed out, continuing...');
        }
    }

    /**
     * Wait for DOM content to load
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForDOMContentLoaded(page: Page, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForLoadState('domcontentloaded', { timeout: timeoutMs });
        } catch (error) {
            console.log('DOM content loaded wait timed out, continuing...');
        }
    }

    /**
     * Wait for full page load
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForLoad(page: Page, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForLoadState('load', { timeout: timeoutMs });
        } catch (error) {
            console.log('Page load wait timed out, continuing...');
        }
    }

    /**
     * Combined wait for all loading states
     * Waits for DOM, network, JavaScript, Angular, and spinners
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForPageToLoad(page: Page, timeoutMs: number = 30000): Promise<void> {
        await this.waitForDOMContentLoaded(page, timeoutMs);
        await this.waitForNetworkIdle(page, timeoutMs);
        await this.waitForJavaScriptToFinish(page, timeoutMs);
        await this.waitForAngularToFinish(page, timeoutMs);
        await this.waitForPDSLoaderToDisappear(page, timeoutMs);
        await this.waitForProgressSpinnerToDisappear(page, timeoutMs);
    }

    /**
     * Wait for element to be visible
     * @param page - Playwright Page object
     * @param selector - CSS selector
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForElementVisible(page: Page, selector: string, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForSelector(selector, { state: 'visible', timeout: timeoutMs });
        } catch (error) {
            console.log(`Element ${selector} visibility wait timed out, continuing...`);
        }
    }

    /**
     * Wait for element to be hidden
     * @param page - Playwright Page object
     * @param selector - CSS selector
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForElementHidden(page: Page, selector: string, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForSelector(selector, { state: 'hidden', timeout: timeoutMs });
        } catch (error) {
            console.log(`Element ${selector} hidden wait timed out, continuing...`);
        }
    }

    /**
     * Wait for element to be attached to DOM
     * @param page - Playwright Page object
     * @param selector - CSS selector
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForElementAttached(page: Page, selector: string, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForSelector(selector, { state: 'attached', timeout: timeoutMs });
        } catch (error) {
            console.log(`Element ${selector} attachment wait timed out, continuing...`);
        }
    }

    /**
     * Wait for element to be detached from DOM
     * @param page - Playwright Page object
     * @param selector - CSS selector
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForElementDetached(page: Page, selector: string, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForSelector(selector, { state: 'detached', timeout: timeoutMs });
        } catch (error) {
            console.log(`Element ${selector} detachment wait timed out, continuing...`);
        }
    }

    /**
     * Wait for navigation to complete
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForNavigation(page: Page, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForNavigation({ timeout: timeoutMs, waitUntil: 'networkidle' });
        } catch (error) {
            console.log('Navigation wait timed out, continuing...');
        }
    }

    /**
     * Wait for URL to match a pattern
     * @param page - Playwright Page object
     * @param urlPattern - URL pattern (string or RegExp)
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForUrl(page: Page, urlPattern: string | RegExp, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForURL(urlPattern, { timeout: timeoutMs });
        } catch (error) {
            console.log(`URL pattern wait timed out, continuing...`);
        }
    }

    /**
     * Wait for a specific API response
     * @param page - Playwright Page object
     * @param urlPattern - URL pattern for the API endpoint
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     * @returns Response object or null
     */
    static async waitForApiResponse(
        page: Page, 
        urlPattern: string | RegExp, 
        timeoutMs: number = 30000
    ): Promise<any> {
        try {
            const response = await page.waitForResponse(urlPattern, { timeout: timeoutMs });
            return response;
        } catch (error) {
            console.log('API response wait timed out, continuing...');
            return null;
        }
    }

    /**
     * Wait for a function to return true
     * @param page - Playwright Page object
     * @param func - Function to evaluate
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForFunction(
        page: Page, 
        func: () => boolean | Promise<boolean>, 
        timeoutMs: number = 30000
    ): Promise<void> {
        try {
            await page.waitForFunction(func, { timeout: timeoutMs });
        } catch (error) {
            console.log('Function wait timed out, continuing...');
        }
    }

    /**
     * Wait for modal dialog to appear
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForModal(page: Page, timeoutMs: number = 30000): Promise<void> {
        const modalSelectors = [
            '.modal',
            '[role="dialog"]',
            '.modal-dialog',
            '.pds-modal',
            '.dialog-overlay'
        ];
        
        try {
            await page.waitForSelector(modalSelectors.join(', '), { 
                state: 'visible', 
                timeout: timeoutMs 
            });
        } catch (error) {
            console.log('Modal wait timed out or not found, continuing...');
        }
    }

    /**
     * Wait for modal dialog to close
     * @param page - Playwright Page object
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForModalToClose(page: Page, timeoutMs: number = 30000): Promise<void> {
        const modalSelectors = [
            '.modal',
            '[role="dialog"]',
            '.modal-dialog',
            '.pds-modal',
            '.dialog-overlay'
        ];
        
        try {
            await page.waitForSelector(modalSelectors.join(', '), { 
                state: 'hidden', 
                timeout: timeoutMs 
            });
        } catch (error) {
            console.log('Modal close wait timed out, continuing...');
        }
    }

    /**
     * Wait with a fixed delay
     * Use sparingly - prefer other waiting strategies
     * @param page - Playwright Page object
     * @param delayMs - Delay in milliseconds
     */
    static async waitForDelay(page: Page, delayMs: number): Promise<void> {
        await page.waitForTimeout(delayMs);
    }

    /**
     * Wait for text to appear on page
     * @param page - Playwright Page object
     * @param text - Text to wait for
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForText(page: Page, text: string, timeoutMs: number = 30000): Promise<void> {
        try {
            await page.waitForSelector(`text=${text}`, { state: 'visible', timeout: timeoutMs });
        } catch (error) {
            console.log(`Text "${text}" wait timed out, continuing...`);
        }
    }

    /**
     * Wait for element text to contain specific content
     * @param page - Playwright Page object
     * @param selector - CSS selector
     * @param text - Expected text content
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForElementTextContent(
        page: Page, 
        selector: string, 
        text: string, 
        timeoutMs: number = 30000
    ): Promise<void> {
        try {
            await page.waitForFunction(
                ([sel, expectedText]) => {
                    const element = document.querySelector(sel);
                    return element?.textContent?.includes(expectedText) ?? false;
                },
                [selector, text] as [string, string],
                { timeout: timeoutMs }
            );
        } catch (error) {
            console.log(`Element ${selector} text content wait timed out, continuing...`);
        }
    }

    /**
     * Wait for element count to match expected value
     * @param page - Playwright Page object
     * @param selector - CSS selector
     * @param count - Expected element count
     * @param timeoutMs - Timeout in milliseconds (default: 30000)
     */
    static async waitForElementCount(
        page: Page, 
        selector: string, 
        count: number, 
        timeoutMs: number = 30000
    ): Promise<void> {
        try {
            await page.waitForFunction(
                ([sel, expectedCount]) => {
                    const elements = document.querySelectorAll(sel);
                    return elements.length === expectedCount;
                },
                [selector, count] as [string, number],
                { timeout: timeoutMs }
            );
        } catch (error) {
            console.log(`Element count wait timed out, continuing...`);
        }
    }
}

// Export individual functions for convenience
export const waitForJavaScriptToFinish = WaitForHelpers.waitForJavaScriptToFinish;
export const waitForAngularToFinish = WaitForHelpers.waitForAngularToFinish;
export const waitForPDSLoaderToDisappear = WaitForHelpers.waitForPDSLoaderToDisappear;
export const waitForProgressSpinnerToDisappear = WaitForHelpers.waitForProgressSpinnerToDisappear;
export const waitForNetworkIdle = WaitForHelpers.waitForNetworkIdle;
export const waitForDOMContentLoaded = WaitForHelpers.waitForDOMContentLoaded;
export const waitForPageToLoad = WaitForHelpers.waitForPageToLoad;
export const waitForElementVisible = WaitForHelpers.waitForElementVisible;
export const waitForElementHidden = WaitForHelpers.waitForElementHidden;
export const waitForNavigation = WaitForHelpers.waitForNavigation;
export const waitForUrl = WaitForHelpers.waitForUrl;
export const waitForModal = WaitForHelpers.waitForModal;
export const waitForModalToClose = WaitForHelpers.waitForModalToClose;
export const waitForText = WaitForHelpers.waitForText;