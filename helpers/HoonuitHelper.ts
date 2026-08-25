import { Page, Locator, expect } from '@playwright/test';
import { User } from '../users/User';
import { HoonuitUsers } from '../users/HoonuitUsers';
import { getMainUrl, getMaintenanceUrl } from '../../utils/urlUtils';

// Extend Window interface to include Angular properties
declare global {
  interface Window {
    angular?: any;
    ng?: any;
  }
}

/**
 * Enhanced Helper Class for Hoonuit SIS Integration
 * Converted from Java MSA architecture to TypeScript for Playwright
 * 
 * This class provides comprehensive helper methods for:
 * - Login operations (Administrator, Teacher, SSO)
 * - Dashboard navigation and selection
 * - Page wait and load handling
 * - Angular and spinner management
 * - Menu and navigation interactions
 * - Card and UI element operations
 * 
 * @author MSA Team (original architecture)
 * @since 2025-11-26
 */
export class HoonuitHelper {
  
  // Constants and selectors
  private static readonly INTEGRATED_PD_DROPDOWN = '.ml-auto a.dropdown-toggle';
  private static readonly INTEGRATED_PD_DROPDOWN_MENU = 'div.pds-tabs__dropdown.show';
  private static readonly DASHBOARD_CARD_LOCATOR = 'app-dashboard-object-card';
  private static readonly CARD_TITLE = 'div.pds-panel-header';
  private static readonly PAGE_SPINNER = 'div#loading-bar-spinner';
  private static readonly PRODUCT_MENU_BUTTON = 'div>button[aria-label="Opens product menu"]';
  private static readonly LEFT_NAVIGATION_BAR = 'ul.pds-primary-nav-list a.pds-app-nav span.pds-app-nav';
  private static readonly UTILITY_APPS = '#utilityApps';
  private static readonly TOGGLE_BUTTON = 'button.dropdown-toggle base-svg-icon[name="pds-menu"]';
  private static readonly PRIMARY_NAVIGATION_LIST = 'li.pds-primary-nav-link';
  private static readonly USER_MENU_BUTTON = 'button.pds-user-menu-trigger';
  private static readonly LOGOUT = 'div.pds-user-menu-theme a#logout';
  private static readonly USER_SETTINGS = 'div.pds-user-menu-theme a#user-action-settings';
  private static readonly APP_SWITCHER_BUTTON = '#pds-app-switcher';
  private static readonly APPLICATION_TITLE = '.pds-powerschool-logo';
  private static readonly POWER_SCHOOL_PAGE_TITLE = '#content-main h1';
  private static readonly FIELD_USER = '#fieldUsername';
  private static readonly FIELD_PASSWORD = '#fieldPassword';
  private static readonly BTN_ENTER = '#btnEnter';
  private static readonly LOADING_BAR = '[aria-label="Open card tools"]';
  private static readonly ID_BTN_BACK = 'input#idBtn_Back';
  private static readonly SIGN_AS_ADMIN = 'text=Sign in as an Administrator';
  private static readonly SIGN_AS_TEACHER = 'text=Sign in as a Teacher';
  private static readonly SIGN_AS_EXTERNAL_CREDS = 'text=Sign in here with your external credentials';
  private static readonly TM_OVERVIEW_PAGE = '.MuiTypography-root.MuiTypography-h5.css-72zwzf';
  private static readonly MTSS_SPINNER = 'div[class="ngx-spinner-icon"]';

  // ==================== LOGIN METHODS ====================

  /**
   * Login to Hoonuit as Administrator
   */
  static async loginToHoonuitAdministrator(page: Page, user: User): Promise<void> {
    try {
      // Clear cookies
      await page.context().clearCookies();
      
      // Navigate to login page using baseURL from Playwright config
      await page.goto('/');
      
      await this.waitForPageToLoad(page);
      
      // Click "Sign in as an Administrator"
      await page.click(this.SIGN_AS_ADMIN);
      
      // Enter credentials
      await page.fill(this.FIELD_USER, user.userName);
      await page.fill(this.FIELD_PASSWORD, user.password);
      await page.click(this.BTN_ENTER);
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login as administrator: ${error}`);
    }
  }

  /**
   * Login to Hoonuit as Teacher
   */
  static async loginToHoonuitAsTeacher(page: Page, user: User): Promise<void> {
    try {
      // Clear cookies
      await page.context().clearCookies();
      
      // Navigate to login page using baseURL from Playwright config
      await page.goto('/');
      
      await this.waitForPageToLoad(page);
      
      // Click "Sign in as a Teacher"
      await page.click(this.SIGN_AS_TEACHER);
      
      // Enter credentials
      await page.fill(this.FIELD_USER, user.userName);
      await page.fill(this.FIELD_PASSWORD, user.password);
      await page.click(this.BTN_ENTER);
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login as teacher: ${error}`);
    }
  }

  /**
   * Login to MyStudent Hoonuit Administrator
   */
  static async loginToMyStudentHoonuitAdministrator(page: Page, user: User): Promise<void> {
    try {
      // Clear cookies
      await page.context().clearCookies();
      
      // Navigate to PowerSchool login
      await page.goto('https://sisinttest1.powerschool.com/teachers/');
      await this.waitForPageToLoad(page);
      
      // Enter username
      await page.fill('#username', user.userName);
      await page.click('[name="action"]');
      
      // Enter password
      await page.fill('#password', user.password);
      await page.click('[name="action"]');
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login to MyStudent Hoonuit: ${error}`);
    }
  }

  /**
   * Login to Hoonuit Canvas Maintenance
   */
  static async loginToHoonuitCanvasMaintenance(page: Page, user: User): Promise<void> {
    try {
      await page.context().clearCookies();
      
      // Navigate to Canvas maintenance URL using baseURL from Playwright config
      await page.goto('/');
      await this.waitForPageToLoad(page);
      
      await page.fill(this.FIELD_USER, user.userName);
      await page.fill(this.FIELD_PASSWORD, user.password);
      await page.click(this.BTN_ENTER);
      
      await this.waitForPageToLoad(page);
      
    } catch (error) {
      throw new Error(`Failed to login to Canvas maintenance: ${error}`);
    }
  }

  /**
   * Login to Hoonuit Maintenance
   */
  static async loginToHoonuitMaintenance(page: Page, user: User): Promise<void> {
    try {
      await page.context().clearCookies();
      
      // Navigate to maintenance URL using baseURL from Playwright config
      await page.goto('/');
      await this.waitForPageToLoad(page);
      
      await page.fill(this.FIELD_USER, user.userName);
      await page.fill(this.FIELD_PASSWORD, user.password);
      await page.click(this.BTN_ENTER);
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login to maintenance: ${error}`);
    }
  }

  /**
   * Login to PS6 Hoonuit Administrator
   */
  static async loginToPS6HoonuitAdministrator(page: Page, user: User): Promise<void> {
    try {
      await page.context().clearCookies();
      
      // Navigate to PS6 URL using baseURL from Playwright config
      await page.goto('/');
      await this.waitForPageToLoad(page);
      
      await page.click(this.SIGN_AS_ADMIN);
      await page.fill(this.FIELD_USER, user.userName);
      await page.fill(this.FIELD_PASSWORD, user.password);
      await page.click(this.BTN_ENTER);
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login to PS6 Hoonuit as administrator: ${error}`);
    }
  }

  /**
   * Login to PS6 Hoonuit as Teacher
   */
  static async loginToHoonuitPS6AsTeacher(page: Page, user: User): Promise<void> {
    try {
      await page.context().clearCookies();
      
      // Navigate to PS6 URL using baseURL from Playwright config
      await page.goto('/');
      await this.waitForPageToLoad(page);
      
      await page.click(this.SIGN_AS_TEACHER);
      await page.fill(this.FIELD_USER, user.userName);
      await page.fill(this.FIELD_PASSWORD, user.password);
      await page.click(this.BTN_ENTER);
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login to PS6 Hoonuit as teacher: ${error}`);
    }
  }

  /**
   * Login to Hoonuit through Google SSO
   */
  static async loginToHoonuitThroughGoogleSSO(page: Page, user: User): Promise<void> {
    try {
      await page.context().clearCookies();
      
      // Navigate to Google SSO URL using baseURL from Playwright config
      await page.goto('/');
      await this.waitForPageToLoad(page);
      
      await page.fill('#identifierId', user.userName);
      await page.click('#identifierNext');
      
      await page.fill('[name="password"]', user.password);
      await page.click('#passwordNext');
      
      await this.waitForPageToLoad(page);
      
      // Handle "Stay signed in" option
      const staySignedInButton = page.locator(this.ID_BTN_BACK);
      if (await staySignedInButton.isVisible()) {
        await staySignedInButton.click();
      }
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login through Google SSO: ${error}`);
    }
  }

  /**
   * Login to Hoonuit through Microsoft SSO
   */
  static async loginToHoonuitThroughMicrosoftSSO(page: Page, user: User): Promise<void> {
    try {
      await page.context().clearCookies();
      
      // Navigate to Microsoft SSO URL using baseURL from Playwright config
      await page.goto('/');
      await this.waitForPageToLoad(page);
      
      await page.fill('[name="loginfmt"]', user.userName);
      await page.click('#idSIButton9');
      
      await page.fill('[name="passwd"]', user.password);
      await page.click('#idSIButton9');
      
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      throw new Error(`Failed to login through Microsoft SSO: ${error}`);
    }
  }

  /**
   * Login to Tenant Manager
   */
  static async loginToTenantManager(page: Page, user: User, cluster: string): Promise<void> {
    try {
      await page.context().clearCookies();
      
      let tenantManagerUrl: string;
      if (cluster.toLowerCase() === 'eks') {
        tenantManagerUrl = 'https://eks-tenant-manager-url'; // Configure in ConfigManager
      } else {
        tenantManagerUrl = 'https://aks-tenant-manager-url'; // Configure in ConfigManager
      }
      
      await page.goto(tenantManagerUrl);
      await page.waitForTimeout(2000);
      
      // Handle multiple windows/tabs if needed
      const pages = page.context().pages();
      if (pages.length > 1) {
        const loginPage = pages[1];
        await loginPage.fill('[name="username"]', user.userName);
        await loginPage.fill('[name="password"]', user.password);
        await loginPage.click('[type="submit"]');
        
        // Switch back to main window
        await page.bringToFront();
      }
      
      await this.waitForPageToLoad(page);
      
      // Verify login success
      const overviewElement = page.locator(this.TM_OVERVIEW_PAGE);
      await expect(overviewElement).toBeVisible();
      await expect(overviewElement).toHaveText('Cluster Overview');
      
    } catch (error) {
      throw new Error(`Failed to login to Tenant Manager: ${error}`);
    }
  }

  /**
   * Login with PS7 credentials
   */
  static async loginWithPS7Credentials(page: Page, user: User): Promise<void> {
    // Navigate to PS7 SIS URL using baseURL from Playwright config
    await page.goto('/');
    
    await page.fill(this.FIELD_USER, user.userName);
    await page.fill(this.FIELD_PASSWORD, user.password);
    await page.click(this.BTN_ENTER);
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Select dashboard
   */
  static async selectDashboard(page: Page, dashboardType: string, dashboardName: string): Promise<void> {
    try {
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
      console.log(`Attempting to navigate to dashboard: ${dashboardType} - ${dashboardName}`);
      
      // Click on Dashboard if not already selected
      const dashboardElement = page.locator('a[id="contentModulesContainer"]');
      await dashboardElement.waitFor({ state: 'visible', timeout: 10000 });
      
      const isSelected = await dashboardElement.getAttribute('class');
      if (!isSelected?.includes('pds-is-selected')) {
        console.log('Clicking on main dashboard menu');
        await dashboardElement.click();
        await page.waitForTimeout(1000);
      }
      
      // Wait for navigation to be fully loaded
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      
      // More robust dashboard type selection with multiple fallback strategies
      const dashboardPanel = page.locator('ul.pds-app-nav-secondary-tier-list');
      await dashboardPanel.waitFor({ state: 'visible', timeout: 15000 });
      
      // Strategy 1: Try the original selector
      let dashboardTypeElement = dashboardPanel.locator('ul.pds-app-nav-secondary-tier-list li a.pds-app-nav')
        .filter({ hasText: dashboardType });
      
      // Strategy 2: Try a more general approach if first fails
      if (!(await dashboardTypeElement.count())) {
        console.log('Strategy 1 failed, trying alternative selectors');
        dashboardTypeElement = page.locator('a.pds-app-nav')
          .filter({ hasText: dashboardType });
      }
      
      // Strategy 3: Try looking in navigation links
      if (!(await dashboardTypeElement.count())) {
        console.log('Strategy 2 failed, trying navigation links');
        dashboardTypeElement = page.locator('nav a, .pds-app-nav a')
          .filter({ hasText: dashboardType });
      }
      
      if (await dashboardTypeElement.count() > 0) {
        console.log(`Found dashboard type element: ${dashboardType}`);
        await dashboardTypeElement.first().click();
        await page.waitForTimeout(3000); // Wait for submenu to expand
      } else {
        // Debug: Log available navigation items
        const availableNavItems = await page.locator('a.pds-app-nav').allTextContents();
        console.log('Available navigation items:', availableNavItems);
        throw new Error(`Dashboard type "${dashboardType}" not found. Available items: ${availableNavItems.join(', ')}`);
      }
      
      // More robust dashboard name selection
      const dashboardSelectors = [
        'ul.pds-app-nav-scrolling-third-and-fourth-tier-content a',
        '.pds-app-nav-container a',
        'nav a',
        'a[href*="enrollment"]',
        'a'
      ];
      
      let dashboardFound = false;
      
      for (const selector of dashboardSelectors) {
        const dashboardLinks = page.locator(selector).filter({ hasText: dashboardName });
        if (await dashboardLinks.count() > 0) {
          console.log(`Found dashboard "${dashboardName}" with selector: ${selector}`);
          await dashboardLinks.first().click();
          dashboardFound = true;
          break;
        }
      }
      
      if (!dashboardFound) {
        // Debug: Log available dashboard options
        const availableDashboards = await page.locator('ul.pds-app-nav-scrolling-third-and-fourth-tier-content a').allTextContents();
        console.log('Available dashboards:', availableDashboards);
        throw new Error(`Dashboard "${dashboardName}" not found. Available dashboards: ${availableDashboards.join(', ')}`);
      }
      
      console.log(`Successfully navigated to ${dashboardType} - ${dashboardName}`);
      await this.waitForPageToLoad(page);
      await this.waitForAngularToFinish(page);
      
    } catch (error) {
      console.error(`Navigation failed: ${error}`);
      
      // Take a screenshot for debugging
      try {
        await page.screenshot({ path: `debug-navigation-failure-${Date.now()}.png`, fullPage: true });
      } catch (screenshotError) {
        console.warn('Could not take debug screenshot:', screenshotError);
      }
      
      throw new Error(`Failed to select dashboard ${dashboardType} - ${dashboardName}: ${error}`);
    }
  }

  /**
   * Select dashboard uniquely when there are duplicates
   */
  static async selectDashboardUniquely(page: Page, dashboardType: string, dashboardName: string, index: number): Promise<void> {
    try {
      const dashboardElement = page.locator('a[id="contentModulesContainer"]');
      const isSelected = await dashboardElement.getAttribute('class');
      
      if (!isSelected?.includes('pds-is-selected')) {
        await dashboardElement.click();
      }
      
      // Select dashboard type
      const dashboardPanel = page.locator('ul.pds-app-nav-secondary-tier-list');
      await dashboardPanel.waitFor({ state: 'visible' });
      
      const dashboardTypes = dashboardPanel.locator('ul.pds-app-nav-secondary-tier-list li a.pds-app-nav');
      await dashboardTypes.filter({ hasText: dashboardType }).click();
      
      await page.waitForTimeout(1000);
      
      // Select unique dashboard by index
      const dashboardElements = page.locator('ul.pds-app-nav-scrolling-third-and-fourth-tier-content li ul li a')
        .filter({ hasText: dashboardName });
      
      await dashboardElements.nth(index).click();
      
      // Click again if still visible
      if (await dashboardElements.nth(index).isVisible()) {
        await dashboardElements.nth(index).click();
      }
      
    } catch (error) {
      throw new Error(`Failed to select dashboard uniquely ${dashboardType} - ${dashboardName} at index ${index}: ${error}`);
    }
  }

  /**
   * Select talent dashboard
   */
  static async selectTalentDashboard(page: Page, dashboardType: string, dashboardName: string, subdashboardName: string): Promise<void> {
    const dashboardElement = page.locator('a[id="contentModulesContainer"]');
    const isSelected = await dashboardElement.getAttribute('class');
    
    if (!isSelected?.includes('pds-is-selected')) {
      await dashboardElement.click();
    }
    
    // Select dashboard type
    const dashboardPanel = page.locator('ul.pds-app-nav-secondary-tier-list');
    await dashboardPanel.waitFor({ state: 'visible', timeout: 10000 });
    
    const dashboardTypes = dashboardPanel.locator('ul.pds-app-nav-secondary-tier-list li a.pds-app-nav');
    await dashboardTypes.filter({ hasText: dashboardType }).click();
    
    // Get the dashboard list and choose subdashboard
    const dashboardList = page.locator('li.pds-app-nav-tertiary-group span').filter({ hasText: dashboardName });
    const list = dashboardList.first().locator('..').locator('a');
    await list.filter({ hasText: subdashboardName }).click();
  }

  /**
   * Select risk dashboard
   */
  static async selectRiskDashboard(page: Page, dashboardType: string, dashboardName: string): Promise<void> {
    const dashboardElement = page.locator('a[id="contentModulesContainer"]');
    const isSelected = await dashboardElement.getAttribute('class');
    
    if (!isSelected?.includes('pds-is-selected')) {
      await dashboardElement.click();
    }
    
    // Select dashboard type
    const dashboardPanel = page.locator('ul.pds-app-nav-secondary-tier-list');
    await dashboardPanel.waitFor({ state: 'visible' });
    
    const dashboardTypes = dashboardPanel.locator('ul.pds-app-nav-secondary-tier-list li a.pds-app-nav');
    await dashboardTypes.filter({ hasText: dashboardType }).click();
    
    await page.waitForTimeout(700);
    
    const list = page.locator('ul.pds-app-nav-scrolling-third-and-fourth-tier-content a');
    await list.filter({ hasText: dashboardName }).click();
  }

  /**
   * Select utility app
   */
  static async selectUtilityApp(page: Page, appName: string): Promise<void> {
    try {
      await this.waitForPageToLoad(page);
      await this.waitForSpinnerToDisappear(page);
      
      const utilityAppsElement = page.locator(this.UTILITY_APPS);
      const isSelected = await utilityAppsElement.getAttribute('class');
      
      if (!isSelected?.includes('pds-is-selected')) {
        await utilityAppsElement.scrollIntoViewIfNeeded();
        await utilityAppsElement.click();
      }
      
      // Get the Utility App List and Choose the required App
      const appList = page.locator('ul.pds-app-nav');
      await appList.waitFor({ state: 'visible' });
      
      const apps = appList.locator('ul.pds-app-nav span');
      await apps.filter({ hasText: appName }).scrollIntoViewIfNeeded();
      await apps.filter({ hasText: appName }).click();
      
      await this.waitForPageToLoad(page);
      
    } catch (error) {
      throw new Error(`Failed to select utility app ${appName}: ${error}`);
    }
  }

  /**
   * Click sub navigation tab link
   */
  static async clickSubNavTabLink(page: Page, tabName: string): Promise<void> {
    try {
      const tabLink = page.locator('base-page-navigation.pds-global-tabs ul.pds-tabs a')
        .filter({ hasText: tabName });
      
      await tabLink.waitFor({ state: 'visible' });
      await tabLink.click();
      
      // Verify the tab is active
      const parentElement = tabLink.locator('..');
      const isActive = await parentElement.getAttribute('class');
      
      if (!isActive?.includes('pds-is-active')) {
        // Try clicking again if not active
        await tabLink.click();
      }
      
      await this.waitForPageToLoad(page);
      
    } catch (error) {
      throw new Error(`Failed to click sub nav tab ${tabName}: ${error}`);
    }
  }

  /**
   * Select developer tools
   */
  static async selectDeveloperTools(page: Page): Promise<void> {
    const devToolsElement = page.locator('a[id="navDevTools"]');
    const isSelected = await devToolsElement.getAttribute('class');
    
    if (!isSelected?.includes('pds-is-selected')) {
      await devToolsElement.click();
    }
  }

  /**
   * Click top nav link in dev tools
   */
  static async clickTopNavLinkInDevTools(page: Page, linkName: string): Promise<void> {
    await page.locator('div.NavigationList_Common div.itemContent a')
      .filter({ hasText: linkName })
      .click();
  }

  /**
   * Click state sub nav link
   */
  static async clickStateSubNavLink(page: Page, linkName: string): Promise<void> {
    const chevronLink = page.locator('base-svg-icon[name="chevron-down"]').first();
    await chevronLink.click();
    
    await this.waitForPageToLoad(page);
    
    const linkText = page.locator('.mega-menu-dropdown-menu>ul>li>span')
      .filter({ hasText: linkName })
      .first();
    await linkText.click();
  }

  /**
   * Click SIP nav tab link
   */
  static async clickSIPNavTabLink(page: Page, tabName: string): Promise<void> {
    await this.waitForPageToLoad(page);
    await page.locator('a.nav-link.ng-binding')
      .filter({ hasText: tabName })
      .click();
  }

  // ==================== WAIT & UTILITY METHODS ====================

  /**
   * Wait for page to load with spinner handling
   */
  static async waitForPageToLoad(page: Page): Promise<void> {
    try {
      // Wait 2 seconds for initial load
      await page.waitForTimeout(2000);
      
      // Wait for network to be idle
      await page.waitForLoadState('networkidle');
      
      // Wait for spinners to disappear
      await this.waitForSpinnerToDisappear(page);
      
    } catch (error) {
      console.warn('Page load wait warning:', error);
      // Continue execution even if spinner wait fails
    }
  }

  /**
   * Wait for Angular to finish loading
   */
  static async waitForAngularToFinish(page: Page): Promise<void> {
    try {
      // Wait for document ready state and Angular to finish
      await page.waitForFunction(() => {
        return document.readyState === 'complete' && 
               (typeof window.angular === 'undefined' && 
                (typeof (window as any).ng === 'undefined' || typeof (window as any).ng.probe === 'undefined'));
      }, { timeout: 60000 });
      
      await page.waitForTimeout(300);
      
    } catch (error) {
      console.warn('Angular wait timeout:', error);
      // Continue execution even if Angular wait fails
    }
  }

  /**
   * Wait for spinner to disappear
   */
  static async waitForSpinnerToDisappear(page: Page): Promise<void> {
    try {
      // Wait for page spinner to disappear
      const pageSpinner = page.locator(this.PAGE_SPINNER);
      await pageSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
      
      // Wait for MTSS spinner to disappear
      const mtssSpinner = page.locator(this.MTSS_SPINNER);
      await mtssSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
      
    } catch (error) {
      console.warn('Spinner wait timeout:', error);
      // Continue execution even if spinner wait fails
    }
  }

  /**
   * Common wait function combining multiple waits
   */
  static async commonWait(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await this.waitForAngularToFinish(page);
    await this.waitForSpinnerToDisappear(page);
  }

  /**
   * Wait for element to hide
   */
  static async waitForElementToHide(locator: Locator, secondsToWait: number = 5): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'hidden', timeout: secondsToWait * 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  // ==================== MENU & PRODUCT METHODS ====================

  /**
   * Click product menu
   */
  static async clickProductMenu(page: Page): Promise<void> {
    await page.locator(this.PRODUCT_MENU_BUTTON).click();
  }

  /**
   * Click product dropdown option
   */
  static async clickProductDropdownOption(page: Page, menuItem: string): Promise<void> {
    const button = page.locator('div.dropdown-menu.show>button')
      .filter({ hasText: menuItem });
    
    await button.click();
    await this.waitForPageToLoad(page);
    
    // If button is still displayed, click product menu to close
    if (await button.isVisible()) {
      await this.clickProductMenu(page);
    }
  }

  /**
   * Switch application using app switcher
   */
  static async switchApplicationUsingAPPSwitcher(page: Page, applicationName: string): Promise<void> {
    await page.locator(this.APP_SWITCHER_BUTTON).click();
    await page.waitForTimeout(1000);
    
    await page.locator('.pds-app-switcher-app-name')
      .filter({ hasText: applicationName })
      .click();
  }

  /**
   * Select user menu item
   */
  static async selectUserMenu(page: Page, subItem: string): Promise<void> {
    const userMenu = page.locator(this.USER_MENU_BUTTON);
    const isExpanded = await userMenu.getAttribute('aria-expanded');
    
    if (isExpanded === 'false') {
      await userMenu.click();
    }
    
    await page.locator('div.pds-user-menu-popover a.pds-user-menu')
      .filter({ hasText: subItem })
      .click();
  }

  /**
   * Logout from the application
   */
  static async logout(page: Page): Promise<void> {
    try {
      await this.selectUserMenu(page, 'Logout');
      await page.click('input[value="Yes"]');
      
      // Clear cookies and navigate to logout URL
      await page.context().clearCookies();
      
    } catch (error) {
      console.warn('Logout error:', error);
      // Always clear cookies even if logout fails
      await page.context().clearCookies();
    }
  }

  /**
   * Logout PS7 SIS user
   */
  static async logoutPS7SISUser(page: Page): Promise<void> {
    await page.locator(this.USER_MENU_BUTTON).click();
    await page.locator('span.style-scope.pds-user-menu')
      .filter({ hasText: 'Sign Out' })
      .click();
  }

  /**
   * Logout from Google
   */
  static async logoutFromGoogle(page: Page): Promise<void> {
    await page.goto('https://accounts.google.com/Logout');
    await this.waitForPageToLoad(page);
    await page.context().clearCookies();
    await page.waitForLoadState('domcontentloaded');
  }

  // ==================== INFORMATION RETRIEVAL METHODS ====================

  /**
   * Get left menu list
   */
  static async getLeftMenuList(page: Page): Promise<string[]> {
    const menuItems = page.locator(this.LEFT_NAVIGATION_BAR);
    return await menuItems.allTextContents();
  }

  /**
   * Get utility apps sub menu list
   */
  static async getUtilityAppsSubMenuList(page: Page): Promise<string[]> {
    const dashboardElement = page.locator('a[id="utilityApps"]');
    const isSelected = await dashboardElement.getAttribute('class');
    
    if (!isSelected?.includes('pds-is-selected')) {
      await dashboardElement.click();
    }
    
    const dashboardPanel = page.locator('ul[class*="style-scope pds-app-nav"], ul[class*="pds-nav-secondary-list style-scope pds-app-nav"]');
    await dashboardPanel.waitFor({ state: 'visible' });
    
    const menuItems = dashboardPanel.locator('a[class$="style-scope pds-app-nav"] span.pds-app-nav');
    return await menuItems.allTextContents();
  }

  /**
   * Get selected tab text
   */
  static async getSelectedTabText(page: Page): Promise<string> {
    const selectedTab = page.locator('base-page-navigation.pds-global-tabs li.pds-is-active a:not(.ml-auto a)');
    return await selectedTab.textContent() || '';
  }

  /**
   * Get all available dashboards for specific dashboard type
   */
  static async getAllAvailableDashboard(page: Page, dashboardType: string): Promise<string[]> {
    const dashboardElement = page.locator('a[id="contentModulesContainer"]');
    const isSelected = await dashboardElement.getAttribute('class');
    
    if (!isSelected?.includes('pds-is-selected')) {
      await dashboardElement.click();
    }
    
    const dashboardPanel = page.locator('ul.pds-app-nav-secondary-tier-list');
    await dashboardPanel.waitFor({ state: 'visible' });
    
    const dashboardTypes = dashboardPanel.locator('ul.pds-app-nav-secondary-tier-list li a.pds-app-nav');
    await dashboardTypes.filter({ hasText: dashboardType }).click();
    
    await page.waitForTimeout(700);
    
    const dashboards = page.locator('ul.pds-app-nav-scrolling-third-and-fourth-tier-content a');
    const dashboardTexts = await dashboards.allTextContents();
    
    await dashboardElement.click();
    return dashboardTexts;
  }

  /**
   * Get available dashboard list
   */
  static async getAvailableDashboardList(page: Page): Promise<string[]> {
    const dashboardElement = page.locator('a[id="contentModulesContainer"]');
    const isSelected = await dashboardElement.getAttribute('class');
    
    if (!isSelected?.includes('pds-is-selected')) {
      await dashboardElement.click();
    }
    
    const dashboardPanel = page.locator('ul.pds-app-nav-secondary-tier-list');
    await dashboardPanel.waitFor({ state: 'visible' });
    
    const dashboardTypes = dashboardPanel.locator('ul.pds-app-nav-secondary-tier-list li a.pds-app-nav');
    return await dashboardTypes.allTextContents();
  }

  /**
   * Get tab list
   */
  static async getTabList(page: Page): Promise<string[]> {
    const tabs = page.locator('base-page-navigation.pds-global-tabs ul.pds-tabs a:not(.ml-auto a)');
    await tabs.first().waitFor({ state: 'visible', timeout: 10000 });
    return await tabs.allTextContents();
  }

  /**
   * Get sub nav tab list
   */
  static async getSubNavTabList(page: Page): Promise<string[]> {
    const tabs = page.locator('base-page-navigation.pds-global-tabs ul.pds-tabs a:not(.ml-auto a)');
    return await tabs.allTextContents();
  }

  /**
   * Get PowerTeacher Pro header text
   */
  static async getPowerTeacherProHeaderText(page: Page): Promise<string> {
    const element = page.locator(this.APPLICATION_TITLE);
    await element.waitFor({ state: 'visible' });
    return await element.textContent() || '';
  }

  /**
   * Get SIS home page title
   */
  static async getSisHomePageTitle(page: Page): Promise<string> {
    const element = page.locator(this.POWER_SCHOOL_PAGE_TITLE);
    await element.waitFor({ state: 'visible' });
    return await element.textContent() || '';
  }

  /**
   * Check if utility apps sub menu list is displayed
   */
  static async isUtilityAppsSubMenuListDisplayed(page: Page, subMenu: string): Promise<boolean> {
    const subMenuList = await this.getUtilityAppsSubMenuList(page);
    return subMenuList.includes(subMenu);
  }

  // ==================== CARD & DASHBOARD METHODS ====================

  /**
   * Get count of dashboard cards
   */
  static async getCountOfDashboardCards(page: Page): Promise<number> {
    return await page.locator(this.DASHBOARD_CARD_LOCATOR).count();
  }

  /**
   * Check if dashboard card is visible
   */
  static async isDashboardCardVisible(page: Page, dashboardTitle: string): Promise<boolean> {
    const card = page.locator(this.DASHBOARD_CARD_LOCATOR);
    const titleElement = card.locator('div>h2.card-title').filter({ hasText: dashboardTitle });
    
    const isTitleVisible = await titleElement.isVisible();
    const isBodyVisible = await titleElement.locator('..').locator('..').locator('div.card-body').isVisible();
    
    return isTitleVisible && isBodyVisible;
  }

  /**
   * Get card element by title
   */
  static getCard(page: Page, cardTitle: string): Locator {
    return page.locator(this.DASHBOARD_CARD_LOCATOR)
      .filter({ has: page.locator(this.CARD_TITLE).filter({ hasText: cardTitle }) });
  }

  // ==================== INTEGRATED PD METHODS ====================

  /**
   * Click integrated PD dropdown
   */
  static async clickIntegratedPDDropdown(page: Page): Promise<void> {
    await page.click(this.INTEGRATED_PD_DROPDOWN);
  }

  /**
   * Select integrated PD option by index
   */
  static async selectIntegratedPDOption(page: Page, index: number): Promise<void> {
    const options = page.locator(`${this.INTEGRATED_PD_DROPDOWN_MENU} button`);
    await options.nth(index).click();
  }

  /**
   * Get integrated PD links
   */
  static async getIntegratedPDLinks(page: Page): Promise<string[]> {
    await this.waitForPageToLoad(page);
    
    const dropdown = page.locator(this.INTEGRATED_PD_DROPDOWN);
    const isExpanded = await dropdown.getAttribute('aria-expanded');
    
    if (isExpanded === 'false') {
      await dropdown.click();
    }
    
    await page.waitForTimeout(1500);
    
    const menuItems = page.locator(`${this.INTEGRATED_PD_DROPDOWN_MENU} button`);
    const menuTexts = await menuItems.allTextContents();
    
    // Close dropdown
    await dropdown.click();
    await this.waitForPageToLoad(page);
    
    return menuTexts.map(text => text.trim());
  }

  /**
   * Click integrated PD link by text
   */
  static async clickIntegratedPDLink(page: Page, linkText: string): Promise<void> {
    await this.waitForPageToLoad(page);
    
    const dropdown = page.locator(this.INTEGRATED_PD_DROPDOWN);
    const isExpanded = await dropdown.getAttribute('aria-expanded');
    
    if (isExpanded === 'false') {
      await dropdown.click();
    }
    
    await page.waitForTimeout(1000);
    
    const menuItems = page.locator(`${this.INTEGRATED_PD_DROPDOWN_MENU} button`);
    await menuItems.filter({ hasText: linkText }).click();
    
    await this.waitForPageToLoad(page);
    await dropdown.click(); // Close dropdown
  }

  // ==================== UTILITY & HELPER METHODS ====================

  /**
   * Check if an element is clickable (enabled and visible)
   */
  static async isClickable(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return await locator.isVisible() && await locator.isEnabled();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify page content
   */
  static async verifyPageContent(page: Page, textToVerify: string, exceptText?: string): Promise<boolean> {
    try {
      await this.waitForPageToLoad(page);
      await this.waitForSpinnerToDisappear(page);
      await this.waitForAngularToFinish(page);
      
      const pageContent = page.locator('.pds-content');
      const content = await pageContent.textContent() || '';
      
      const lines = content.split('\n');
      
      if (lines.length === 0) {
        throw new Error('No Text Found In Page');
      }
      
      for (const line of lines) {
        if (line.toLowerCase().includes(textToVerify.toLowerCase()) && 
            (!exceptText || !line.toLowerCase().includes(exceptText.toLowerCase()))) {
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      throw new Error(`Failed to verify page content: ${error}`);
    }
  }

  /**
   * Check if product is available in menu
   */
  static async isProductAvailableInMenu(page: Page, productName: string): Promise<boolean> {
    const menuItems = page.locator(this.PRIMARY_NAVIGATION_LIST).filter({ hasText: productName });
    return await menuItems.count() > 0;
  }

  /**
   * Open new tab
   */
  static async openNewTab(page: Page): Promise<Page> {
    const newPage = await page.context().newPage();
    return newPage;
  }

  /**
   * Get current month name
   */
  static getCurrentMonthName(): string {
    const date = new Date();
    return date.toLocaleString('default', { month: 'long' });
  }

  /**
   * Get current and previous date
   */
  static getCurrentAndPreviousDate(): string[] {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    };
    
    return [formatDate(today), formatDate(yesterday)];
  }

  // ==================== JSON & API HELPER METHODS ====================

  /**
   * Get MTSS API dynamic variable values
   */
  static async getMtssAPIDynamicVariableValue(): Promise<Map<string, any>> {
    const dynamicVariables = new Map<string, any>();
    
    // Mock dynamic variables for testing - these would come from actual API/config in production
    dynamicVariables.set('REFRESH_DATA_CALENDAR_UUID', '945f180c-9fc0-45e7-ab1c-c46723b2e380');
    dynamicVariables.set('INTERVENTION_UUID', 'c5efcafd-6493-4215-a112-81e914710ce8');
    dynamicVariables.set('INTERVENTION_DEF_UUID', '4d02525b-2c06-467d-994f-64396e9f18e5');
    dynamicVariables.set('MEMBERSHIP_UUID', '3df21b6f-73ef-4cab-9297-a1a204b381d6');
    dynamicVariables.set('TENANT_CODE', 'ALL');
    dynamicVariables.set('DISTRICT_CODE', 'global');
    dynamicVariables.set('CREATED_BY', '35260000000000000000/MTSS_Admin');
    dynamicVariables.set('RETRIEVE_DATA_INTERVENTION_UUID', 'c5efcafd-6493-4215-a112-81e914710ce8');
    
    return dynamicVariables;
  }

  /**
   * Get JSON value by measurement UUID from response
   */
  static getJsonValueByMeasurementUuid(jsonResponse: any, measurementUuid: string, fieldName: string): string {
    try {
      if (!jsonResponse) {
        console.warn('Invalid JSON response');
        return '';
      }

      // Handle nested array structure from Java version
      if (Array.isArray(jsonResponse)) {
        for (const outerNode of jsonResponse) {
          if (Array.isArray(outerNode)) {
            for (const innerNode of outerNode) {
              if (Array.isArray(innerNode)) {
                for (const nestedInnerNode of innerNode) {
                  if (nestedInnerNode.measurementUuid === measurementUuid) {
                    return nestedInnerNode[fieldName] || '';
                  }
                }
              }
            }
          }
        }
      }

      // Fallback to simpler structure
      if (Array.isArray(jsonResponse)) {
        const item = jsonResponse.find((entry: any) => {
          return entry.measurementUuid === measurementUuid ||
                 entry.uuid === measurementUuid ||
                 entry.id === measurementUuid;
        });

        if (item) {
          const value = item[fieldName];
          return value !== undefined && value !== null ? String(value) : '';
        }
      }

      console.warn(`Item with measurement UUID ${measurementUuid} not found`);
      return '';

    } catch (error) {
      console.error('Error extracting JSON value:', error);
      return '';
    }
  }

  /**
   * Get intervention API JSON value
   */
  static getInterventionApiJsonValue(jsonResponse: any, key: string): string {
    try {
      if (!jsonResponse) {
        return 'No member ID found';
      }

      // Handle array structure
      if (Array.isArray(jsonResponse)) {
        for (const node of jsonResponse) {
          const memberId = node.memberId;
          if (key === memberId) {
            return node.dataValue || '';
          }
        }
      } else {
        // Handle single object structure
        const memberId = jsonResponse.memberId;
        if (key === memberId) {
          return jsonResponse.dataValue || '';
        }
      }

      return 'No member ID found';

    } catch (error) {
      console.error('Error extracting intervention API JSON value:', error);
      return 'No member ID found';
    }
  }

  /**
   * Get all JSON values by field name from response array
   */
  static getJsonValuesByFieldName(jsonResponse: any, fieldName: string): string[] {
    if (!jsonResponse || !Array.isArray(jsonResponse)) {
      console.warn('Invalid JSON response or not an array');
      return [];
    }

    return jsonResponse
      .map((entry: any) => {
        const value = entry[fieldName];
        return value !== undefined && value !== null ? String(value) : null;
      })
      .filter((value: string | null) => value !== null) as string[];
  }

  /**
   * Validate JSON response structure
   */
  static validateJsonResponseStructure(jsonResponse: any, requiredFields: string[]): boolean {
    if (!jsonResponse || !Array.isArray(jsonResponse)) {
      return false;
    }

    if (jsonResponse.length === 0) {
      return false;
    }

    // Check if first item has all required fields
    const firstItem = jsonResponse[0];
    return requiredFields.every(field => firstItem.hasOwnProperty(field));
  }
}