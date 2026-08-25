import { Page, BrowserContext, expect } from '@playwright/test';
import { MtssUsers } from '../users/MtssUsers';

/**
 * MTSS Helper class - converted from Java to TypeScript/Playwright
 * Provides common functionality for MTSS operations including login, navigation, and utility methods
 * @author hyders
 * @since 10/08/2020 (Converted to TypeScript/Playwright)
 */
export class MtssHelper {
  // Selectors - consistent with Playwright patterns
  private static readonly PAGE_SPINNER = 'div#loading-bar-spinner';
  private static readonly UTILITY_APPS = '#utilityApps';
  private static readonly USER_MENU_BUTTON = 'button.pds-user-menu-trigger';
  private static readonly PRIMARY_NAVIGATION_LIST = 'li.pds-primary-nav-link';
  private static readonly CARD_TITLE = 'div.pds-panel-header';
  private static readonly DASHBOARD_CARD_LOCATOR = 'app-dashboard-object-card';

  // Configuration - these should be injected from config
  private static runtimeConfig = {
    url: process.env.MTSS_URL || 'https://default-mtss-url.com',
    maintenanceUrl: process.env.MTSS_MAINTENANCE_URL || 'https://default-maintenance-url.com',
    multiTenantMaintenanceUrl: process.env.MTSS_MULTITENANT_URL || 'https://default-multitenant-url.com'
  };

  /**
   * Wait for page to load including spinners and JavaScript execution
   * @param page Playwright Page object
   * @param timeout Optional timeout in milliseconds (default: 120000)
   */
  public static async waitForPageToLoad(page: Page, timeout: number = 120000): Promise<void> {
    // Wait for initial load states
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Equivalent to sleep(ONE_SECOND * 2)
    
    try {
      // Wait for JavaScript to finish and spinner to disappear
      await page.waitForLoadState('networkidle', { timeout });
      await page.waitForSelector(this.PAGE_SPINNER, { 
        state: 'hidden', 
        timeout: Math.min(timeout, 60000) 
      });
    } catch (error) {
      // Continue if spinner doesn't disappear within timeout
      console.log('Spinner wait timeout - continuing with execution');
    }
  }

  /**
   * Click sub navigation tab link
   * @param page Playwright Page object
   * @param tabName Name of the tab to click
   */
  public static async clickSubNavTabLink(page: Page, tabName: string): Promise<void> {
    await page.waitForSelector(`a:has-text("${tabName}")`, { state: 'visible', timeout: 30000 });
    
    const tabSelector = 'base-page-navigation.pds-global-tabs ul.pds-tabs a';
    const tabs = page.locator(tabSelector);
    const targetTab = tabs.filter({ hasText: tabName });
    
    await targetTab.waitFor({ state: 'visible' });
    await targetTab.click();
    
    // Verify tab is active, click again if needed
    const parentLi = page.locator(`a:has-text("${tabName}")`).locator('..');
    const isActive = await parentLi.getAttribute('class');
    if (!isActive?.includes('pds-is-active')) {
      await targetTab.click();
    }
    
    await this.waitForPageToLoad(page);
  }

  /**
   * Login to MTSS as RTI Admin
   * @param page Playwright Page object
   * @param user User credentials
   */
  public static async loginToMtssAsRtiAdmin(page: Page, user?: MtssUsers): Promise<void> {
    // Clear cookies for fresh login
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.url);
    await this.waitForPageToLoad(page);
    
    // Use current admin user if available, otherwise use provided user
    const loginUser = MtssUsers.getCurrentAdminUser() || user;
    if (!loginUser) {
      throw new Error('No user credentials provided for login');
    }
    
    await page.fill('#username, input[name="username"], [data-testid="username"]', loginUser.userName);
    await page.fill('#password, input[name="password"], [data-testid="password"]', loginUser.password);
    await page.click('button[type="submit"], input[type="submit"], button:has-text("Submit")');
    
    await this.waitForPageToLoad(page, 120000);
  }

  /**
   * Click on Microsoft District SSO
   * @param page Playwright Page object
   * @param tenant Tenant domain
   */
  public static async clickOnMSDistrictSSO(page: Page, tenant: string): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.multiTenantMaintenanceUrl);
    await this.waitForPageToLoad(page);
    
    await page.click('button:has-text("Single Sign On"), [data-testid="sso-button"]');
    await page.fill('#domain, input[name="domain"], [data-testid="domain"]', tenant);
    await page.click('button:has-text("Login"), [data-testid="sso-login"]');
  }

  /**
   * Login to MTSS Multi-Tenant with Google SSO
   * @param page Playwright Page object
   * @param user User credentials
   * @param tenant Tenant domain
   */
  public static async loginToMTSSMultiTenantGoogleSSO(page: Page, user: MtssUsers, tenant: string): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.multiTenantMaintenanceUrl);
    await this.waitForPageToLoad(page);
    
    await page.click('button:has-text("Single Sign On"), [data-testid="sso-button"]');
    await page.fill('#domain, input[name="domain"], [data-testid="domain"]', tenant);
    await page.click('button:has-text("Login"), [data-testid="sso-login"]');
    
    // Handle Google login flow
    await page.fill('#identifierId, input[type="email"]', user.userName);
    await page.click('#identifierNext, button:has-text("Next")');
    
    await page.waitForSelector('#password input, input[type="password"]', { state: 'visible' });
    await page.fill('#password input, input[type="password"]', user.password);
    await page.click('#passwordNext, button:has-text("Next")');
    
    await this.waitForPageToLoad(page, 120000);
  }

  /**
   * Login to MTSS as Portal Admin
   * @param page Playwright Page object
   * @param user User credentials
   */
  public static async loginToMtssAsPortalAdmin(page: Page, user?: MtssUsers): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.url);
    await this.waitForPageToLoad(page);
    
    const loginUser = MtssUsers.getCurrentTeacherUser() || user;
    if (!loginUser) {
      throw new Error('No user credentials provided for portal admin login');
    }
    
    await page.fill('#username, input[name="username"], [data-testid="username"]', loginUser.userName);
    await page.fill('#password, input[name="password"], [data-testid="password"]', loginUser.password);
    await page.click('button[type="submit"], input[type="submit"], button:has-text("Submit")');
    
    await this.waitForPageToLoad(page, 120000);
  }

  /**
   * Login to MTSS as District Admin
   * @param page Playwright Page object
   * @param user User credentials
   */
  public static async loginToMtssAsDistrictAdmin(page: Page, user?: MtssUsers): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.maintenanceUrl);
    await this.waitForPageToLoad(page);
    
    const loginUser = MtssUsers.getCurrentAdminUser() || user;
    if (!loginUser) {
      throw new Error('No user credentials provided for district admin login');
    }
    
    await page.click('a:has-text("Sign in as an Administrator")');
    await page.fill('#username, input[name="username"], [data-testid="username"]', loginUser.userName);
    await page.fill('#password, input[name="password"], [data-testid="password"]', loginUser.password);
    await page.click('button[type="submit"], input[type="submit"], button:has-text("Submit")');
    
    await this.waitForPageToLoad(page, 120000);
  }

  /**
   * Login to MTSS as Teacher
   * @param page Playwright Page object
   * @param user User credentials
   */
  public static async loginToMtssAsTeacher(page: Page, user?: MtssUsers): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.maintenanceUrl);
    await this.waitForPageToLoad(page);
    
    const loginUser = MtssUsers.getCurrentTeacherUser() || user;
    if (!loginUser) {
      throw new Error('No user credentials provided for teacher login');
    }
    
    await page.click('a:has-text("Sign in as a Teacher")');
    await page.fill('#username, input[name="username"], [data-testid="username"]', loginUser.userName);
    await page.fill('#password, input[name="password"], [data-testid="password"]', loginUser.password);
    await page.click('button[type="submit"], input[type="submit"], button:has-text("Submit")');
    
    await this.waitForPageToLoad(page, 120000);
  }

  /**
   * Select utility application
   * @param page Playwright Page object
   * @param appName Name of the application to select
   */
  public static async selectUtilityApp(page: Page, appName: string): Promise<void> {
    await this.waitForPageToLoad(page);
    
    // Click utility apps menu if not already selected
    const utilityAppsElement = page.locator(this.UTILITY_APPS);
    const classList = await utilityAppsElement.getAttribute('class');
    if (!classList?.includes('pds-is-selected')) {
      await utilityAppsElement.scrollIntoViewIfNeeded();
      await utilityAppsElement.click();
    }
    
    // Wait for app list to appear and select the required app
    const appList = page.locator('ul.pds-app-nav');
    await appList.waitFor({ state: 'visible', timeout: 10000 });
    
    const appSpans = appList.locator('ul.pds-app-nav span');
    const targetApp = appSpans.filter({ hasText: appName });
    await targetApp.scrollIntoViewIfNeeded();
    await targetApp.click();
  }

  /**
   * Get utility apps sub menu list
   * @param page Playwright Page object
   * @returns Array of sub menu text items
   */
  public static async getUtilityAppsSubMenuList(page: Page): Promise<string[]> {
    const dashboardElement = page.locator('#utilityApps');
    const classList = await dashboardElement.getAttribute('class');
    if (!classList?.includes('pds-is-selected')) {
      await dashboardElement.click();
    }
    
    const dashboardPanel = page.locator('ul.pds-nav-secondary-list.style-scope.pds-app-nav');
    await dashboardPanel.waitFor({ state: 'visible', timeout: 10000 });
    
    const menuItems = dashboardPanel.locator('a[class$="style-scope pds-app-nav"] span.pds-app-nav');
    return await menuItems.allInnerTexts();
  }

  /**
   * Check if utility apps sub menu list contains specific item
   * @param page Playwright Page object
   * @param subMenu Sub menu item to check for
   * @returns boolean indicating if item exists
   */
  public static async isUtilityAppsSubMenuListDisplayed(page: Page, subMenu: string): Promise<boolean> {
    const menuList = await this.getUtilityAppsSubMenuList(page);
    return menuList.includes(subMenu);
  }

  /**
   * Logout from the application
   * @param page Playwright Page object
   */
  public static async logout(page: Page): Promise<void> {
    try {
      await this.selectUserMenu(page, "Logout");
      const yesButton = page.locator('input[value="Yes"], button:has-text("Yes")');
      await yesButton.click();
    } finally {
      // Navigate to logout URL based on current URL
      await page.goto(this.runtimeConfig.url);
      const currentUrl = page.url();
      
      if (currentUrl.includes('/admin/home.html')) {
        await page.goto(this.runtimeConfig.url + '/admin/~loff');
      } else if (currentUrl.includes('/teachers/home.html')) {
        await page.goto(this.runtimeConfig.url + '/teachers/~loff');
      }
      
      await this.waitForPageToLoad(page);
      await page.waitForTimeout(1000);
      await page.context().clearCookies();
    }
  }

  /**
   * Select user menu item
   * @param page Playwright Page object
   * @param subItem Sub menu item to select
   */
  public static async selectUserMenu(page: Page, subItem: string): Promise<void> {
    const userMenu = page.locator(this.USER_MENU_BUTTON);
    const expanded = await userMenu.getAttribute('aria-expanded');
    
    if (expanded === 'false') {
      await userMenu.click();
    }
    
    const menuItem = page.locator('div.pds-user-menu-popover a.pds-user-menu').filter({ hasText: subItem });
    await menuItem.click();
  }

  /**
   * Check if product is available in menu
   * @param page Playwright Page object
   * @param productName Product name to check for
   * @returns boolean indicating if product is available
   */
  public static async isProductAvailableInMenu(page: Page, productName: string): Promise<boolean> {
    const navItems = page.locator(this.PRIMARY_NAVIGATION_LIST);
    const matchingItems = navItems.filter({ hasText: productName });
    const count = await matchingItems.count();
    return count > 0;
  }

  /**
   * Select dashboard
   * @param page Playwright Page object
   * @param dashboardType Type of dashboard
   * @param dashboardName Name of dashboard
   */
  public static async selectDashboard(page: Page, dashboardType: string, dashboardName: string): Promise<void> {
    // Click on Dashboard
    const dashboardElement = page.locator('#contentModulesContainer');
    const classList = await dashboardElement.getAttribute('class');
    if (!classList?.includes('pds-is-selected')) {
      await dashboardElement.click();
    }
    
    // Select dashboard type
    const dashboardPanel = page.locator('ul.pds-app-nav-secondary-tier-list');
    await dashboardPanel.waitFor({ state: 'visible', timeout: 10000 });
    
    const dashboardTypes = dashboardPanel.locator('ul.pds-app-nav-secondary-tier-list li a.pds-app-nav');
    await dashboardTypes.filter({ hasText: dashboardType }).click();
    
    // Wait for dashboard list to load
    await page.waitForTimeout(700);
    
    // Select specific dashboard
    const dashboardList = page.locator('ul.pds-app-nav-scrolling-third-and-fourth-tier-content a').filter({ hasText: dashboardName });
    await dashboardList.click();
  }

  /**
   * Get dashboard card by title
   * @param page Playwright Page object
   * @param cardTitle Title of the card to find
   * @returns Locator for the card element
   */
  public static async getCard(page: Page, cardTitle: string) {
    const cards = page.locator(this.DASHBOARD_CARD_LOCATOR);
    const count = await cards.count();
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const titleElement = card.locator(this.CARD_TITLE);
      
      if (await titleElement.isVisible()) {
        const text = await titleElement.innerText();
        if (text.trim().toLowerCase() === cardTitle.trim().toLowerCase()) {
          return card;
        }
      }
    }
    
    throw new Error(`No card with name: ${cardTitle}`);
  }

  /**
   * Login to MTSS Multi-Tenant with Microsoft SSO
   * @param page Playwright Page object
   * @param user User credentials
   * @param tenant Tenant domain
   */
  public static async loginToMtssMultiTenantMicrosoftSSO(page: Page, user: MtssUsers, tenant: string): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.multiTenantMaintenanceUrl);
    await this.waitForPageToLoad(page);
    
    await page.click('button:has-text("Single Sign On"), [data-testid="sso-button"]');
    await page.fill('#domain, input[name="domain"], [data-testid="domain"]', tenant);
    await page.click('button:has-text("Login"), [data-testid="sso-login"]');
    
    // Handle Microsoft login flow
    await page.fill('#i0116, input[type="email"]', user.userName);
    await page.click('#idSIButton9, button:has-text("Next")');
    
    await page.waitForSelector('#i0118, input[type="password"]', { state: 'visible' });
    await page.fill('#i0118, input[type="password"]', user.password);
    await page.click('#idSIButton9, button:has-text("Sign in")');
    
    await this.waitForPageToLoad(page, 120000);
    
    // Handle "Stay signed in" option
    const staySignedInButton = page.locator('#idBtn_Back');
    if (await staySignedInButton.isVisible({ timeout: 5000 })) {
      await staySignedInButton.click();
    }
  }

  /**
   * Navigate to login page
   * @param page Playwright Page object
   * @param tenant Tenant domain
   */
  public static async navigateToLoginPage(page: Page, tenant: string): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.multiTenantMaintenanceUrl);
    await this.waitForPageToLoad(page);
    
    await page.click('button:has-text("Single Sign On"), [data-testid="sso-button"]');
    await page.fill('#domain, input[name="domain"], [data-testid="domain"]', tenant);
    await page.click('button:has-text("Login"), [data-testid="sso-login"]');
  }

  /**
   * Login to Multi-tenant as MTSS Admin
   * @param page Playwright Page object
   * @param user User credentials
   */
  public static async loginToMultitenantAsMTSSAdmin(page: Page, user?: MtssUsers): Promise<void> {
    await page.context().clearCookies();
    
    await page.goto(this.runtimeConfig.multiTenantMaintenanceUrl);
    await this.waitForPageToLoad(page);
    
    const loginUser = MtssUsers.getCurrentMaintenanceUser() || user;
    if (!loginUser) {
      throw new Error('No user credentials provided for MTSS admin login');
    }
    
    await page.fill('#username, input[name="username"], [data-testid="username"]', loginUser.userName);
    await page.fill('#password, input[name="password"], [data-testid="password"]', loginUser.password);
    await page.click('button[type="submit"], input[type="submit"], button:has-text("Submit")');
    
    await this.waitForPageToLoad(page, 120000);
  }

  /**
   * Set runtime configuration
   * @param config Configuration object with URLs
   */
  public static setRuntimeConfig(config: {
    url?: string;
    maintenanceUrl?: string;
    multiTenantMaintenanceUrl?: string;
  }): void {
    this.runtimeConfig = { ...this.runtimeConfig, ...config };
  }

  /**
   * Clear browser cookies
   * @param page Playwright Page object
   */
  public static async clearBrowserCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }

  /**
   * Wait for spinner to disappear
   * @param page Playwright Page object
   * @param timeout Timeout in milliseconds
   */
  public static async waitForSpinnerToDisappear(page: Page, timeout: number = 60000): Promise<void> {
    try {
      await page.waitForSelector(this.PAGE_SPINNER, { state: 'hidden', timeout });
    } catch (error) {
      console.log('Spinner wait timeout - continuing with execution');
    }
  }

  /**
   * Execute JavaScript click on element
   * @param page Playwright Page object
   * @param selector Element selector
   */
  public static async executeJavaScriptClick(page: Page, selector: string): Promise<void> {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element && 'click' in element) {
        (element as HTMLElement).click();
      }
    }, selector);
  }
}
