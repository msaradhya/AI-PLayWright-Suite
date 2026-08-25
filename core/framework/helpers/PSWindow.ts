import { Page, BrowserContext } from '@playwright/test';

/**
 * PSWindow - Helper class for managing browser windows/tabs
 * Provides utilities for working with multiple windows in Playwright tests
 */
export class PSWindow {
  
  /**
   * Execute a callback in a new window/tab and automatically close it
   * @param context Browser context
   * @param callback Function to execute in the new window
   * @returns Result from the callback function
   */
  static async inNewWindow<T>(context: BrowserContext, callback: (newPage: Page) => Promise<T>): Promise<T> {
    const newPage = await context.newPage();
    try {
      const result = await callback(newPage);
      return result;
    } finally {
      await newPage.close();
    }
  }

  /**
   * Close all windows except the default (first) window
   * Useful for cleanup after tests that open multiple windows
   * @param context Browser context
   */
  static async closeAllButDefaultWindow(context: BrowserContext): Promise<void> {
    const pages = context.pages();
    if (pages.length > 1) {
      for (let i = 1; i < pages.length; i++) {
        await pages[i].close();
      }
    }
  }

  /**
   * Get count of open windows/tabs
   * @param context Browser context
   * @returns Number of open pages
   */
  static getWindowCount(context: BrowserContext): number {
    return context.pages().length;
  }

  /**
   * Switch to a specific window by index
   * @param context Browser context
   * @param index Window index (0-based)
   * @returns The page at the specified index, or undefined if not found
   */
  static getWindowByIndex(context: BrowserContext, index: number): Page | undefined {
    const pages = context.pages();
    return pages[index];
  }

  /**
   * Wait for a new window/tab to open
   * @param context Browser context
   * @param timeout Timeout in milliseconds (default: 30000)
   * @returns Promise that resolves with the new page
   */
  static async waitForNewWindow(context: BrowserContext, timeout: number = 30000): Promise<Page> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout waiting for new window after ${timeout}ms`));
      }, timeout);

      context.once('page', (page) => {
        clearTimeout(timeoutId);
        resolve(page);
      });
    });
  }

  /**
   * Execute actions in a new tab with optional URL navigation
   * @param page The current Playwright page
   * @param action The action to execute in the new tab
   * @param url Optional URL to navigate to in the new tab
   */
  static async inNewTab(page: Page, action: (newPage: Page) => Promise<void>, url?: string): Promise<void> {
    // Create a new page in the same context
    const newPage = await page.context().newPage();

    try {
      if (url) {
        await newPage.goto(url);
      }
      
      // Wait for the new page to load
      await newPage.waitForLoadState('domcontentloaded');
      
      // Execute the provided action in the new tab
      await action(newPage);
    } finally {
      // Close the new page when done
      await newPage.close();
    }
  }

  /**
   * Execute actions in a new window triggered by a page event
   * @param page The current Playwright page
   * @param trigger The action that triggers the new window to open
   * @param action The action to execute in the new window
   */
  static async executeInNewWindow(
    page: Page,
    trigger: () => Promise<void>,
    action: (newPage: Page) => Promise<void>
  ): Promise<void> {
    // Wait for new page to be created when clicking a link that opens in new tab
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      trigger()
    ]);

    try {
      // Wait for the new page to load
      await newPage.waitForLoadState('domcontentloaded');
      
      // Execute the provided action in the new window
      await action(newPage);
    } finally {
      // Close the new page when done
      await newPage.close();
    }
  }
}