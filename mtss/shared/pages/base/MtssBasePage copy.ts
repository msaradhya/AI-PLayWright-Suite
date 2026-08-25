import { Page, Locator } from '@playwright/test';
import { MtssFilterData } from '../../mtss/shared/pages/MtssFilterData';

/**
 * Base class for all MTSS page objects
 * @author aradhyas (converted from Java)
 * @since 18/05/2025
 */
export default abstract class MtssBasePage {
  protected readonly page: Page;
  
  // Selectors
  protected readonly pageTitleLocator = 'h1.text-secondary, span[aria-current="page"], h1.ng-star-inserted, h1.mb-6, h1.mb-4, h1.mb-0';
  protected readonly dashboardToolsEllipsis = 'button[ngbtooltip="Dashboard Tools"]';
  protected readonly notificationDialog = 'div.ui-pnotify';
  protected readonly notificationText = 'div.ui-pnotify-text';
  protected readonly closeNotificationSelector = 'div[title="Close"]';
  
  private static readonly pageWaitTimeInSec = 120;

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

  /**
   * Wait for the page to be fully loaded
   */
  public async waitForPage(): Promise<void> {
    // Wait for page load and navigation to complete
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');

    // If a page title is defined, wait for it to appear
    const pageTitle = this.pageTitle();
    if (pageTitle && pageTitle.length > 0) {
      try {
        // Wait for page title to be visible and match expected title
        const titleLocator = this.page.locator(this.pageTitleLocator);
        await titleLocator.first().waitFor({ state: 'visible', timeout: MtssBasePage.pageWaitTimeInSec * 1000 });
        
        // Verify the title matches
        const actualTitle = await this.getPageTitleText();
        if (actualTitle !== pageTitle) {
          throw new Error(`Expected page title "${pageTitle}" but found "${actualTitle}"`);
        }
      } catch (error) {
        throw new Error(`Timeout loading page: title = ${pageTitle}, time-out = ${MtssBasePage.pageWaitTimeInSec}s`);
      }
    } else {
      // If no specific title, just wait a bit to ensure page is ready
      await this.page.waitForTimeout(5000);
    }
  }

  /**
   * Select a tool from the dashboard tools dropdown
   * @param item - Main menu item to select
   * @param subItem - Optional sub-menu item
   */
  public async selectDashboardTool(item: string, subItem?: string): Promise<void> {
    // Click the ellipsis menu
    await this.page.locator(this.dashboardToolsEllipsis).scrollIntoViewIfNeeded();
    await this.page.click(this.dashboardToolsEllipsis);
    
    // Click the menu item
    const itemLocator = this.page.locator('div.itemContainer', { hasText: item }).first();
    await itemLocator.scrollIntoViewIfNeeded();
    await itemLocator.click();
    
    // If subItem is provided, click it too
    if (subItem) {
      const subItemLocator = this.page.locator('div.itemContainer', { hasText: subItem }).first();
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
   * Get the filter data component for this page
   */
  public getFilter(): MtssFilterData {
    return new MtssFilterData(this.page);
  }

  /**
   * Check if the page is displayed by verifying its title
   */
  public async isPageDisplayed(): Promise<boolean> {
    try {
      await this.waitForPage();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the text of the page title
   */
  protected async getPageTitleText(): Promise<string> {
    const titleElements = this.page.locator(this.pageTitleLocator);
    const visibleTitle = titleElements.first();
    await visibleTitle.waitFor({ state: 'visible', timeout: 5000 });
    return await visibleTitle.innerText();
  }

  /**
   * Click an element using JavaScript (for cases where normal click doesn't work)
   * @param locator - The element to click
   */
  protected async clickByJavaScript(locator: Locator): Promise<void> {
    await this.page.evaluate(el => el.click(), await locator.elementHandle());
  }
}