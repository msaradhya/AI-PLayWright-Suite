import { Page, Locator } from '@playwright/test';
import { FilterData } from './FilterData';
import {
  waitForNetworkIdle,
  waitForElement,
  safeClick,
  takeScreenshot
} from '../../../utils/testHelpers';

/**
 * Base class for all Hoonuit page objects
 *
 * This is the consolidated base page that combines functionality from:
 * - hoonuit-base.page.ts (original Java conversion)
 * - HoonuitBasePage.ts (consolidated base with testHelpers)
 * - uihn-base-page.ts (environment-aware navigation)
 *
 * Features:
 * - Core Playwright page utilities
 * - Hoonuit-specific page features
 * - Common helper methods from testHelpers
 * - Environment-aware navigation support
 *
 * All Hoonuit page objects should extend this class.
 *
 * @author aradhyas (converted from Java by amittiwari)
 * @since 18/05/2025
 */
export default abstract class HoonuitBasePage {
  // ============================================================
  // SELECTORS
  // ============================================================
  protected readonly pageTitleLocator = 'h1.text-secondary, span[aria-current="page"], h1.ng-star-inserted, h1.mb-6, h1.mb-4, h1.mb-0, h1.pds-page-text-primary';
  protected readonly dashboardToolsEllipsis = 'button[ngbtooltip="Dashboard Tools"]';
  protected readonly notificationDialog = 'div.ui-pnotify';
  protected readonly notificationText = 'div.ui-pnotify-text';
  protected readonly closeNotificationSelector = 'div[title="Close"]';
  protected readonly subTitle = 'p.mb-6.ng-star-inserted';
  protected readonly pdLoader = '.pds-loader-sm.style-scope.pds-loader';

  protected page: Page;
  protected static readonly pageWaitTimeInSec = 120;

  /**
   * Constructor
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Abstract method that must be implemented by all subclasses to define the page title
   */
  protected abstract pageTitle(): string;

  // ============================================================
  // CORE PAGE UTILITIES
  // ============================================================

  /**
   * Navigate to a specific URL path
   * @param path - URL path to navigate to
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get a locator for an element
   * @param selector - CSS selector
   * @returns Playwright Locator
   */
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Wait for page to be fully loaded (basic version)
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await waitForNetworkIdle(this.page);
  }

  /**
   * Check if an element is visible
   * @param selector - CSS selector
   * @returns True if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    const locator = this.getLocator(selector);
    return await locator.isVisible();
  }

  /**
   * Get text from an element
   * @param selector - CSS selector
   * @returns Text content of the element
   */
  async getElementText(selector: string): Promise<string> {
    const locator = this.getLocator(selector);
    await locator.waitFor({ state: 'visible' });
    return await locator.innerText();
  }

  /**
   * Click an element with enhanced reliability using retry logic
   * @param selector - CSS selector
   */
  async clickElement(selector: string): Promise<void> {
    await waitForElement(this.page, selector);
    await safeClick(this.page, selector);
  }

  /**
   * Fill a form field
   * @param selector - CSS selector
   * @param value - Value to fill
   */
  async fillField(selector: string, value: string): Promise<void> {
    const locator = this.getLocator(selector);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  /**
   * Take a screenshot with timestamp
   * @param name - Base name for the screenshot
   * @returns Buffer containing screenshot data
   */
  async captureScreenshot(name: string): Promise<Buffer> {
    return await takeScreenshot(this.page, name);
  }

  /**
   * Wait for a specific element to be visible
   * @param selector - CSS selector
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementVisible(selector: string, timeout?: number): Promise<void> {
    await waitForElement(this.page, selector, timeout);
  }

  /**
   * Wait for network to be idle
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForNetworkToBeIdle(timeout?: number): Promise<void> {
    await waitForNetworkIdle(this.page, timeout);
  }

  /**
   * Get text content of an element (alias for compatibility)
   * @param selector - CSS selector
   * @returns Text content
   */
  async getTextContent(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }

  // ============================================================
  // HOONUIT-SPECIFIC PAGE METHODS
  // ============================================================

  /**
   * Wait for the Hoonuit page to be fully loaded
   * Includes handling alerts, waiting for page title, network idle, and loaders
   */
  public async waitForPage(): Promise<void> {
    const waitFor = HoonuitBasePage.pageWaitTimeInSec;

    // Handle browser alerts if any
    try {
      const dialog = await this.page.waitForEvent('dialog', { timeout: 1000 });
      await dialog.accept();
    } catch {
      // No alert present, continue
    }

    // Wait for basic page load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');

    // If a page title is defined, wait for it to appear
    const expectedTitle = this.pageTitle();
    if (expectedTitle && expectedTitle.trim() !== '') {
      try {
        // Wait for page title to match, checking every 2 seconds
        for (let i = 0; i < waitFor / 2; i++) {
          const currentTitle = await this.getPageTitleText();
          if (currentTitle === expectedTitle) {
            break;
          }
          await this.page.waitForTimeout(2000);
          if (i === waitFor / 2 - 1) {
            throw new Error(`Timeout loading page: title = ${expectedTitle}, time-out = ${waitFor}`);
          }
        }
      } catch (error) {
        throw new Error(`Timeout loading page: title = ${expectedTitle}, error: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      // If no specific title, just wait a bit to ensure page is ready
      await this.page.waitForTimeout(5000);
    }

    // Wait for any loaders to disappear
    await this.page.locator(this.pdLoader).waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {
      // Loader might not be present, continue
    });
  }

  /**
   * Select a tool from the dashboard tools dropdown
   * @param item - Main menu item to select
   * @param subItem - Optional sub-menu item(s)
   */
  public async selectDashboardTool(item: string, ...subItem: string[]): Promise<void> {
    // Click the ellipsis menu
    await this.page.locator(this.dashboardToolsEllipsis).scrollIntoViewIfNeeded();
    await this.page.click(this.dashboardToolsEllipsis);

    // Click the menu item
    const itemLocator = this.page.locator('div.itemContainer', { hasText: item }).first();
    await itemLocator.scrollIntoViewIfNeeded();
    await itemLocator.click();

    // If subItem is provided, click it too
    if (subItem.length > 0 && subItem[0] && subItem[0].trim() !== '') {
      const subItemLocator = this.page.locator('div.itemContainer', { hasText: subItem[0] }).first();
      await subItemLocator.click();
    }
  }

  /**
   * Get the notification text
   */
  public async getNotificationText(): Promise<string> {
    const notifLocator = this.page.locator(this.notificationText);
    await notifLocator.waitFor({ state: 'visible' });
    return await notifLocator.innerText();
  }

  /**
   * Close the notification dialog
   */
  public async closeNotification(): Promise<void> {
    const closeButton = this.page.locator(this.closeNotificationSelector);
    await closeButton.waitFor({ state: 'visible' });
    await closeButton.click();
  }

  /**
   * Check if the page is displayed by verifying its title
   */
  public async isPageDisplayed(): Promise<boolean> {
    try {
      await this.waitForPage();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the text of the page title
   */
  protected async getPageTitleText(): Promise<string> {
    const titleElements = await this.page.locator(this.pageTitleLocator).all();
    if (titleElements.length === 0) return '';

    // Get the last visible title element (which is the most specific one in the DOM hierarchy)
    for (let i = titleElements.length - 1; i >= 0; i--) {
      const isVisible = await titleElements[i].isVisible();
      if (isVisible) {
        return await titleElements[i].innerText();
      }
    }
    return '';
  }

  /**
   * Check if the page has a specific subtitle
   * @param subtitle - The subtitle text to check for
   */
  public async hasSubtitle(subtitle: string): Promise<boolean> {
    const subtitleElement = this.page.locator(this.subTitle, { hasText: subtitle });
    await subtitleElement.scrollIntoViewIfNeeded();
    return await subtitleElement.isVisible();
  }

  /**
   * Get the filter data component for this page
   */
  public getFilter(): FilterData {
    return new FilterData(this.page);
  }

  /**
   * Click an element using JavaScript (for cases where normal click doesn't work)
   * @param locator - The element to click
   */
  protected async clickByJavaScript(locator: Locator): Promise<void> {
    const element = await locator.elementHandle();
    if (element) {
      await this.page.evaluate((el) => (el as HTMLElement).click(), element);
    }
  }

  /**
   * Scroll to an element on the page
   * @param selector - CSS selector for the element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a specific URL pattern
   * @param urlPattern - URL pattern (string or regex)
   * @param timeout - Timeout in milliseconds
   */
  async waitForUrl(urlPattern: string | RegExp, timeout = 30000): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  // ============================================================
  // ENVIRONMENT-AWARE NAVIGATION (from uihn-base-page.ts)
  // ============================================================

  /**
   * Get the base URL for the current environment
   * @param environment - The environment key (e.g., 'auto_bronze', 'auto_aws_bronze')
   * @returns The base URL for the specified environment or undefined if config not available
   */
  getEnvironmentUrl(environment: string = 'auto_bronze'): string | undefined {
    try {
      // Dynamic import to handle cases where config is not set up
      const config = require('config');
      return config.get(`uihn.app.${environment}.url`);
    } catch {
      // Config not available, return undefined
      return undefined;
    }
  }

  /**
   * Get the maintenance URL for the current environment
   * @param environment - The environment key (e.g., 'auto_bronze', 'auto_aws_bronze')
   * @returns The maintenance URL for the specified environment or undefined if config not available
   */
  getMaintenanceUrl(environment: string = 'auto_bronze'): string | undefined {
    try {
      const config = require('config');
      return config.get(`uihn.app.${environment}.maintenance_url`);
    } catch {
      return undefined;
    }
  }

  /**
   * Get user credentials from config
   * @param userType - The type of user (e.g., 'admin_user', 'teacher_user', 'student_user')
   * @returns The user credentials object with username and password, or undefined if config not available
   */
  getUserCredentials(userType: string): { username: string; password: string } | undefined {
    try {
      const config = require('config');
      return config.get(`uihn.userCreds.${userType}`);
    } catch {
      return undefined;
    }
  }

  /**
   * Navigate to the UIHN application home page
   * @param environment - The environment to navigate to
   */
  async navigateToHome(environment: string = 'auto_bronze'): Promise<void> {
    const url = this.getEnvironmentUrl(environment);
    if (url) {
      await this.page.goto(url);
      await this.page.waitForLoadState('load');
    } else {
      throw new Error(`Environment URL not configured for: ${environment}`);
    }
  }

  /**
   * Navigate to the maintenance/login page
   * @param environment - The environment to navigate to
   */
  async navigateToLogin(environment: string = 'auto_bronze'): Promise<void> {
    const url = this.getMaintenanceUrl(environment);
    if (url) {
      await this.page.goto(url);
      await this.page.waitForLoadState('load');
    } else {
      throw new Error(`Maintenance URL not configured for: ${environment}`);
    }
  }
}

// Also export as named export for flexibility
export { HoonuitBasePage };

// Export alias for backward compatibility with hoonuit-base.page.ts
export { HoonuitBasePage as HoonuitSisBasePage };