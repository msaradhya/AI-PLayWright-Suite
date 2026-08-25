import { Page, Locator } from '@playwright/test';
import { MtssHelper } from '../../helpers/MtssHelper';
import { MtssPageTimeoutException } from '../../exceptions/MtssPageTimeoutException';
import { MtssFilterData } from '../MtssFilterData';

/**
 * Playwright/TypeScript version of MtssBasePage (converted from Java)
 * Base class for all MTSS page objects providing common functionality
 * including page loading, navigation, and notification handling
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 10/08/2020
 */
export abstract class MtssBasePage {
  protected page: Page;
  
  // CSS Selectors - converted from Java static final fields
  private static readonly PAGE_TITLE = 'h1.text-secondary, span[aria-current="page"], h1.ng-star-inserted, h1.mb-6, h1.mb-4, h1.mb-0';
  private static readonly DASHBOARD_TOOLS_ELLIPSIS = 'button[ngbtooltip="Dashboard Tools"]';
  private static readonly NOTIFICATION_DIALOG = 'div.ui-pnotify';
  private static readonly NOTIFICATION_TEXT = 'div.ui-pnotify-text';
  private static readonly CLOSE_NOTIFICATION = 'div[title="Close"]';
  
  // Constants
  private static readonly PAGE_WAIT_TIME_IN_SEC = 120;
  private static readonly TWO_SECONDS_MS = 2000;
  private static readonly FIVE_SECONDS_MS = 5000;
  private static readonly RETRY_INTERVAL_MS = 2000;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the page to load completely
   * Converts Java waitForPage() method with Playwright-specific logic
   * @throws MtssPageTimeoutException if page fails to load within timeout
   */
  async waitForPage(): Promise<void> {
    const waitFor = MtssBasePage.PAGE_WAIT_TIME_IN_SEC;
    const timeoutMs = waitFor * 1000;

    try {
      // Clear alert if any (equivalent to Java's alert handling)
      await this.handleAlerts();

      // Wait for JavaScript to finish and page to load (equivalent to WaitFor.waitForJavascriptToFinish)
      await MtssHelper.waitForPageToLoad(this.page, timeoutMs);

      const expectedTitle = this.pageTitle();
      
      if (expectedTitle !== null && expectedTitle !== '') {
        // Wait for page title to match expected title, checking every 2 seconds
        const maxRetries = Math.floor(waitFor / 2);
        let retries = 0;
        
        while (retries < maxRetries) {
          const currentTitle = await this.getPageTitleText();
          if (currentTitle === expectedTitle) {
            break;
          }
          
          await this.page.waitForTimeout(MtssBasePage.RETRY_INTERVAL_MS);
          retries++;
          
          // Equivalent to Java's i == 31 check (after ~60 seconds)
          if (retries >= 31) {
            throw MtssPageTimeoutException.forPageLoad(
              this.page.url(),
              timeoutMs,
              `Timeout loading page: title = ${expectedTitle}, time-out = ${waitFor}`
            );
          }
        }
      } else {
        // If page has no expected title, wait for 5 seconds (equivalent to Java logic)
        await this.page.waitForTimeout(MtssBasePage.FIVE_SECONDS_MS);
      }

      // Final page load wait
      await MtssHelper.waitForPageToLoad(this.page);

    } catch (error) {
      if (error instanceof MtssPageTimeoutException) {
        throw error;
      }
      throw MtssPageTimeoutException.forPageLoad(
        this.page.url(),
        timeoutMs,
        `Failed to load page: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Select dashboard tool with optional sub-item
   * Converts Java selectDashboardTool() method
   * @param item Main dashboard tool item to select
   * @param subItem Optional sub-item to select after main item
   */
  async selectDashboardTool(item: string, ...subItem: string[]): Promise<void> {
    // Click dashboard tools ellipsis button
    const ellipsisButton = this.page.locator(MtssBasePage.DASHBOARD_TOOLS_ELLIPSIS);
    await ellipsisButton.scrollIntoViewIfNeeded();
    await ellipsisButton.click();

    // Find and click the main item
    const itemContainers = this.page.locator('div.itemContainer');
    const itemElement = itemContainers.filter({ hasText: item });
    await itemElement.scrollIntoViewIfNeeded();
    await itemElement.click();

    // If sub-item is provided and not empty, click it
    if (subItem.length > 0 && subItem[0] && subItem[0].trim() !== '') {
      const subItemElement = itemContainers.filter({ hasText: subItem[0] });
      await subItemElement.click();
    }
  }

  /**
   * Get notification text from UI notification
   * Converts Java getNotificationText() method
   * @returns The text content of the notification
   */
  async getNotificationText(): Promise<string> {
    const notificationText = this.page.locator(MtssBasePage.NOTIFICATION_TEXT);
    await notificationText.waitFor({ state: 'visible' });
    return await notificationText.textContent() || '';
  }

  /**
   * Close the notification dialog
   * Converts Java closeNotification() method
   */
  async closeNotification(): Promise<void> {
    const closeButton = this.page.locator(MtssBasePage.CLOSE_NOTIFICATION);
    await closeButton.waitFor({ state: 'visible' });
    await closeButton.click();
  }

  /**
   * Get filter data instance
   * Converts Java getFilter() method
   * @returns New MtssFilterData instance
   */
  getFilter(): MtssFilterData {
    return new MtssFilterData(this.page);
  }

  /**
   * Abstract method that must be implemented by subclasses
   * Returns the expected page title for validation
   * Converts Java abstract pageTitle() method
   * @returns Expected page title string, or null if no title validation needed
   */
  protected abstract pageTitle(): string | null;

  /**
   * Check if page is displayed correctly
   * Converts Java isPageDisplayed() method
   * @returns true if page loads successfully, false otherwise
   */
  async isPageDisplayed(): Promise<boolean> {
    try {
      await this.waitForPage();
      return true;
    } catch (error) {
      if (error instanceof MtssPageTimeoutException) {
        return false;
      }
      // For other errors, also return false but could log the error
      console.error('Error checking if page is displayed:', error);
      return false;
    }
  }

  /**
   * Get the current page title text from DOM
   * Converts Java getPageTitleText() method
   * @returns The visible page title text
   */
  protected async getPageTitleText(): Promise<string> {
    const pageTitleElements = this.page.locator(MtssBasePage.PAGE_TITLE);
    const visibleTitle = pageTitleElements.first();
    await visibleTitle.waitFor({ state: 'visible' });
    return await visibleTitle.textContent() || '';
  }

  /**
   * Handle browser alerts (equivalent to Java's alert handling)
   * Private helper method for alert management
   */
  private async handleAlerts(): Promise<void> {
    try {
      // Set up dialog handler before any operations that might trigger alerts
      this.page.on('dialog', async (dialog) => {
        await dialog.accept();
      });
    } catch (error) {
      // Equivalent to Java's catch blocks for NoAlertPresentException and WebDriverException
      // In Playwright, if no alert is present, the handler simply won't be triggered
    }
  }

  /**
   * Wait for notification to appear
   * Additional helper method for notification handling
   * @param timeout Optional timeout in milliseconds
   */
  async waitForNotification(timeout: number = 10000): Promise<void> {
    await this.page.locator(MtssBasePage.NOTIFICATION_DIALOG).waitFor({ 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Check if notification is visible
   * Additional helper method for notification state checking
   * @returns true if notification is currently visible
   */
  async isNotificationVisible(): Promise<boolean> {
    try {
      await this.page.locator(MtssBasePage.NOTIFICATION_DIALOG).waitFor({ 
        state: 'visible', 
        timeout: 1000 
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get page locator for common page elements
   * Utility method for accessing page title elements
   * @returns Locator for page title elements
   */
  protected getPageTitleLocator(): Locator {
    return this.page.locator(MtssBasePage.PAGE_TITLE);
  }

  /**
   * Get dashboard tools locator
   * Utility method for accessing dashboard tools
   * @returns Locator for dashboard tools ellipsis button
   */
  protected getDashboardToolsLocator(): Locator {
    return this.page.locator(MtssBasePage.DASHBOARD_TOOLS_ELLIPSIS);
  }

  /**
   * Get notification locator
   * Utility method for accessing notification elements
   * @returns Locator for notification dialog
   */
  protected getNotificationLocator(): Locator {
    return this.page.locator(MtssBasePage.NOTIFICATION_DIALOG);
  }
}
