/**
 * App Switcher Helper
 * Helper class for App Switcher operations in Playwright tests
 * Converted from Java: psqa.shared.sis.helpers.AppSwitcherHelper
 * 
 * @author converted to TypeScript/Playwright
 */

import { Page } from '@playwright/test';

/**
 * App Switcher Helper class with utility methods for switching between applications
 */
export class AppSwitcherHelper {
    
    /**
     * Open the App Switcher menu
     * @param page - Playwright page object
     */
    static async openAppSwitcher(page: Page): Promise<void> {
        // Click on the App Switcher button
        const appSwitcherButton = page.locator('.app-switcher-button, .waffle-icon, [data-testid="app-switcher"]');
        await appSwitcherButton.waitFor({ state: 'visible', timeout: 10000 });
        await appSwitcherButton.click();
        
        // Wait for the app switcher menu to appear
        await page.waitForSelector('.app-switcher-menu, .app-list, [data-testid="app-switcher-menu"]', { timeout: 10000 });
        
        console.log('App Switcher opened successfully');
    }

    /**
     * Click on an app in the App Switcher by name
     * @param page - Playwright page object
     * @param appName - Name of the application to click
     */
    static async clickAppSwitcherOptionByName(page: Page, appName: string): Promise<void> {
        // Find and click the app by name
        const appOption = page.locator(`.app-switcher-menu a:has-text("${appName}"), .app-list a:has-text("${appName}"), [data-testid="app-option"]:has-text("${appName}")`);
        await appOption.waitFor({ state: 'visible', timeout: 10000 });
        await appOption.click();
        
        console.log(`Clicked on app: ${appName}`);
    }

    /**
     * Close the App Switcher menu
     * @param page - Playwright page object
     */
    static async closeAppSwitcher(page: Page): Promise<void> {
        // Click outside the menu or press Escape to close
        await page.keyboard.press('Escape');
        
        // Wait for the menu to disappear
        await page.waitForSelector('.app-switcher-menu, .app-list', { state: 'hidden', timeout: 5000 }).catch(() => {
            // Menu might already be closed
        });
        
        console.log('App Switcher closed');
    }

    /**
     * Check if an app is available in the App Switcher
     * @param page - Playwright page object
     * @param appName - Name of the application to check
     * @returns true if the app is available, false otherwise
     */
    static async isAppAvailable(page: Page, appName: string): Promise<boolean> {
        try {
            await this.openAppSwitcher(page);
            const appOption = page.locator(`.app-switcher-menu a:has-text("${appName}"), .app-list a:has-text("${appName}")`);
            const isVisible = await appOption.isVisible();
            await this.closeAppSwitcher(page);
            return isVisible;
        } catch (error) {
            console.warn(`Error checking if app "${appName}" is available:`, error);
            return false;
        }
    }

    /**
     * Get all available apps in the App Switcher
     * @param page - Playwright page object
     * @returns Array of app names
     */
    static async getAllAvailableApps(page: Page): Promise<string[]> {
        await this.openAppSwitcher(page);
        
        const appOptions = page.locator('.app-switcher-menu a, .app-list a');
        const count = await appOptions.count();
        const appNames: string[] = [];
        
        for (let i = 0; i < count; i++) {
            const text = await appOptions.nth(i).textContent();
            if (text) {
                appNames.push(text.trim());
            }
        }
        
        await this.closeAppSwitcher(page);
        return appNames;
    }

    /**
     * Switch to an application and wait for it to load
     * @param page - Playwright page object
     * @param appName - Name of the application to switch to
     * @param waitForSelector - Optional selector to wait for after switching
     */
    static async switchToApp(page: Page, appName: string, waitForSelector?: string): Promise<void> {
        await this.openAppSwitcher(page);
        await this.clickAppSwitcherOptionByName(page, appName);
        
        if (waitForSelector) {
            await page.waitForSelector(waitForSelector, { timeout: 30000 });
        } else {
            // Wait for navigation to complete
            await page.waitForLoadState('networkidle');
        }
        
        console.log(`Switched to app: ${appName}`);
    }
}