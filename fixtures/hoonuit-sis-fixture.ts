import { test as base, Page } from '@playwright/test';
import { HoonuitLoginPage as LoginPage } from '../shared/pages/loginPage/consolidated/HoonuitLoginPage';
import { HoonuitSisHelper } from '../shared/helpers/hoonuit-sis-helper';
import { ConfigManager } from '../config/ConfigManager';

/**
 * Fixture interface for Hoonuit SIS Integration tests
 */
export interface HoonuitSisFixture {
  loginPage: LoginPage;
  hoonuitSisHelper: HoonuitSisHelper;
  configManager: ConfigManager;
}

/**
 * Extended test fixture with Hoonuit SIS pages and helpers
 * This fixture provides auto-instantiation of commonly used page objects and helpers
 */
export const test = base.extend<HoonuitSisFixture>({
  /**
   * ConfigManager fixture
   * Provides access to centralized configuration
   */
  configManager: async ({}, use) => {
    const config = ConfigManager.getInstance();
    await use(config);
  },

  /**
   * Login page fixture
   * Automatically creates and provides a LoginPage instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  /**
   * Hoonuit SIS Helper fixture
   * Automatically creates and provides a HoonuitSisHelper instance
   */
  hoonuitSisHelper: async ({ page }, use) => {
    const helper = new HoonuitSisHelper(page);
    await use(helper);
  },
});

/**
 * Re-export expect from Playwright for convenience
 */
export { expect } from '@playwright/test';

/**
 * Alternative fixture with auto-login functionality
 * Use this when you need automatic login before each test
 */
export const testWithAutoLogin = base.extend<HoonuitSisFixture & { page: Page }>({
  /**
   * ConfigManager fixture
   * Provides access to centralized configuration
   */
  configManager: async ({}, use) => {
    const config = ConfigManager.getInstance();
    await use(config);
  },

  /**
   * Login page fixture
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  /**
   * Hoonuit SIS Helper fixture
   */
  hoonuitSisHelper: async ({ page }, use) => {
    const helper = new HoonuitSisHelper(page);
    await use(helper);
  },

  /**
   * Page fixture with auto-login
   * Automatically logs in as administrator before each test
   * Uses ConfigManager for credentials
   */
  page: async ({ page }, use) => {
    const config = ConfigManager.getInstance();
    
    try {
      // Clear cookies before login
      await page.context().clearCookies();
      
      // Create login page and perform login using ConfigManager credentials
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      const credentials = config.getAdminCredentials();
      await loginPage.loginAsAdministrator(credentials.username, credentials.password);
      
      console.log(`Successfully logged in to Hoonuit SIS as administrator (env: ${config.getEnvironment()})`);
    } catch (error) {
      console.error('Auto-login failed:', error);
      throw new Error(`Auto-login failed: ${error}`);
    }
    
    // Use the authenticated page
    await use(page);
    
    // Optional: Logout after each test
    // Uncomment if you want to logout after each test
    // try {
    //   const loginPage = new LoginPage(page);
    //   await loginPage.logout();
    // } catch (error) {
    //   console.warn('Logout failed:', error);
    // }
  },
});