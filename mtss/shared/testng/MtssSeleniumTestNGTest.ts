/**
 * MTSS Selenium TestNG Test Base Class - Converted from Java to TypeScript/Playwright
 *
 * This class provides the base functionality for MTSS test automation using Playwright,
 * maintaining compatibility with the original Java TestNG structure while adapting
 * to Playwright's async/await patterns and browser management.
 *
 * Key Features:
 * - Suite-level configuration management with override capabilities
 * - Automated user login initialization with validation
 * - Browser lifecycle management (resize, maximize, alert handling)
 * - Screenshot capture and error handling
 * - Reflection-based user discovery and mapping
 *
 * @author Converted from Java (MtssSeleniumTestNGTest.java)
 * @since TypeScript/Playwright Migration
 */

import { test as base, Page, BrowserContext, TestInfo, expect } from '@playwright/test';
import { MtssUsers } from '../users/MtssUsers';
import { MtssException } from '../exceptions/MtssException';
import { MtssHelper } from '../helpers/MtssHelper';
import { ConfigManager } from '../../../config/ConfigManager';

const configManager = ConfigManager.getInstance();

/**
 * Browser type enumeration for cross-browser compatibility
 */
export enum BrowserType {
  CHROME = 'chrome',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit',
  EDGE = 'edge'
}

/**
 * Runtime configuration interface for MTSS testing
 */
export interface MtssRuntimeConfig {
  environment?: string;
  browserType?: BrowserType;
  baseUrl?: string;
  maintenanceUrl?: string;
  multiTenantUrl?: string;
  screenshotOnFailure?: boolean;
  retryOnFailure?: boolean;
  maxRetries?: number;
  timeout?: number;
}

/**
 * Test context interface for enhanced error reporting and debugging
 */
export interface MtssTestContext {
  testName?: string;
  suiteName?: string;
  environment?: string;
  browser?: string;
  startTime?: Date;
  screenshots?: string[];
}

/**
 * Main MTSS TestNG Test base class for Playwright
 * Provides comprehensive test infrastructure with lifecycle management
 */
export class MtssSeleniumTestNGTest {
  protected static readonly DEFAULT = 'DEFAULT';
  
  // Static configuration state
  private static runtimeConfig: MtssRuntimeConfig = {
    environment: process.env.TEST_ENV || 'auto_aws_bronze',
    browserType: (process.env.BROWSER as BrowserType) || BrowserType.CHROME,
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    retryOnFailure: process.env.RETRY_ON_FAILURE === 'true',
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    timeout: parseInt(process.env.TEST_TIMEOUT || '120000')
  };

  // Test context for debugging and reporting
  private static testContext: MtssTestContext = {};

  // Screenshot listeners for error capture
  private static screenshotListeners: Set<(page: Page, testInfo: TestInfo) => Promise<void>> = new Set();

  /**
   * Initialize suite-level configuration and setup
   * Equivalent to @BeforeSuite in Java TestNG
   *
   * @param config Configuration override parameter (DEFAULT means use existing config)
   * @param testInfo Playwright test information context
   * @param suiteName Optional suite name for context
   */
  public static async initializeSuite(
    config: string = MtssSeleniumTestNGTest.DEFAULT,
    testInfo?: TestInfo,
    suiteName?: string
  ): Promise<void> {
    try {
      // Override configuration if specified and not DEFAULT
      if (config !== MtssSeleniumTestNGTest.DEFAULT) {
        try {
          await this.overrideConfig(config);
          console.log(`✓ Configuration overridden to: ${config}`);
        } catch (error) {
          console.warn(`⚠ Failed to override config to '${config}': ${error}`);
          // Continue with existing configuration
        }
      }

      // Initialize test context
      this.testContext = {
        suiteName: suiteName || testInfo?.title || 'MTSS Test Suite',
        environment: this.runtimeConfig.environment,
        browser: this.runtimeConfig.browserType,
        startTime: new Date(),
        screenshots: []
      };

      // Add automatic screenshot listener for failures
      if (this.runtimeConfig.screenshotOnFailure && testInfo) {
        this.addScreenshotListener(async (page: Page, testInfo: TestInfo) => {
          if (testInfo.status === 'failed') {
            await this.captureScreenshotOnFailure(page, testInfo);
          }
        });
      }

      console.log(`🚀 MTSS Test Suite initialized: ${this.testContext.suiteName}`);
      console.log(`   Environment: ${this.runtimeConfig.environment}`);
      console.log(`   Browser: ${this.runtimeConfig.browserType}`);
      console.log(`   Screenshot on failure: ${this.runtimeConfig.screenshotOnFailure}`);

    } catch (error) {
      throw new MtssException(
        `Failed to initialize test suite: ${error}`,
        error instanceof Error ? error : undefined,
        'initializeSuite'
      );
    }
  }

  /**
   * Initialize automation login users from parameters or configuration
   * Equivalent to @BeforeTest in Java TestNG with @Parameters annotation
   *
   * @param adminLogin Admin user login identifier
   * @param teacherLogin Teacher user login identifier
   * @param maintenanceLogin Maintenance user login identifier
   */
  public static async initializeAutomationLogin(
    adminLogin: string = MtssSeleniumTestNGTest.DEFAULT,
    teacherLogin: string = MtssSeleniumTestNGTest.DEFAULT,
    maintenanceLogin: string = MtssSeleniumTestNGTest.DEFAULT
  ): Promise<void> {
    const mtssAutoUserMap = this.getMtssAutomationUsers();

    // If all parameters are DEFAULT, skip initialization
    if (adminLogin === MtssSeleniumTestNGTest.DEFAULT &&
        teacherLogin === MtssSeleniumTestNGTest.DEFAULT &&
        maintenanceLogin === MtssSeleniumTestNGTest.DEFAULT) {
      return;
    }

    try {
      // Initialize Admin User
      if (adminLogin !== MtssSeleniumTestNGTest.DEFAULT && adminLogin.trim() !== '') {
        const adminKey = adminLogin.toLowerCase();
        if (mtssAutoUserMap.has(adminKey)) {
          MtssUsers.setCurrentAdminUser(mtssAutoUserMap.get(adminKey)!);
          console.log(`✓ Admin user set: ${adminLogin}`);
        } else {
          throw new MtssException(
            `Invalid Admin login: ${adminLogin.toLowerCase()}`,
            undefined,
            'initializeAutomationLogin'
          );
        }
      }

      // Initialize Teacher User
      if (teacherLogin !== MtssSeleniumTestNGTest.DEFAULT && teacherLogin.trim() !== '') {
        const teacherKey = teacherLogin.toLowerCase();
        if (mtssAutoUserMap.has(teacherKey)) {
          MtssUsers.setCurrentTeacherUser(mtssAutoUserMap.get(teacherKey)!);
          console.log(`✓ Teacher user set: ${teacherLogin}`);
        } else {
          throw new MtssException(
            `Invalid Teacher login: ${teacherLogin.toLowerCase()}`,
            undefined,
            'initializeAutomationLogin'
          );
        }
      }

      // Initialize Maintenance User
      if (maintenanceLogin !== MtssSeleniumTestNGTest.DEFAULT && maintenanceLogin.trim() !== '') {
        const maintenanceKey = maintenanceLogin.toLowerCase();
        if (mtssAutoUserMap.has(maintenanceKey)) {
          MtssUsers.setCurrentMaintenanceUser(mtssAutoUserMap.get(maintenanceKey)!);
          console.log(`✓ Maintenance user set: ${maintenanceLogin}`);
        } else {
          throw new MtssException(
            `Invalid Maintenance login: ${maintenanceLogin.toLowerCase()}`,
            undefined,
            'initializeAutomationLogin'
          );
        }
      }

    } catch (error) {
      if (error instanceof MtssException) {
        throw error;
      }
      throw new MtssException(
        `Failed to initialize automation login: ${error}`,
        error instanceof Error ? error : undefined,
        'initializeAutomationLogin'
      );
    }
  }

  /**
   * Get available MTSS automation users using reflection-like approach
   * Equivalent to Java reflection logic for discovering static MtssUsers fields
   *
   * @returns Map containing all automation users keyed by lowercase field names
   */
  protected static getMtssAutomationUsers(): Map<string, MtssUsers> {
    const hoonuitUsersMap = new Map<string, MtssUsers>();
    
    try {
      // Get all static properties from MtssUsers class (equivalent to Java reflection)
      const userClassDescriptor = Object.getOwnPropertyDescriptors(MtssUsers);
      
      // Iterate through all properties of MtssUsers class
      for (const [propertyName, descriptor] of Object.entries(userClassDescriptor)) {
        // Check if it's a static property that contains a MtssUsers instance
        if (descriptor.value instanceof MtssUsers) {
          hoonuitUsersMap.set(propertyName.toLowerCase(), descriptor.value);
        }
      }

      // Also get properties from the constructor/prototype (for additional static properties)
      const mtssUsersConstructor = MtssUsers as any;
      for (const propertyName of Object.getOwnPropertyNames(mtssUsersConstructor)) {
        const propertyValue = mtssUsersConstructor[propertyName];
        if (propertyValue instanceof MtssUsers) {
          hoonuitUsersMap.set(propertyName.toLowerCase(), propertyValue);
        }
      }

      console.log(`📋 Discovered ${hoonuitUsersMap.size} automation users`);
      
      // Log available users for debugging (without sensitive data)
      if (process.env.DEBUG_USERS === 'true') {
        console.log('Available users:', Array.from(hoonuitUsersMap.keys()).join(', '));
      }

    } catch (error) {
      throw new MtssException(
        `Failed to retrieve MTSS automation users: ${error}`,
        error instanceof Error ? error : undefined,
        'getMtssAutomationUsers'
      );
    }

    return hoonuitUsersMap;
  }

  /**
   * Clear any alert dialogs that may appear
   * Equivalent to @AfterMethod(alwaysRun = true) in Java TestNG
   * Handles alerts that appear when moving away from pages with unsaved changes
   *
   * @param page Playwright Page object
   */
  public static async clearAlert(page: Page): Promise<void> {
    try {
      // Set up alert handler to automatically accept any dialogs
      page.removeAllListeners('dialog');
      page.on('dialog', async (dialog) => {
        console.log(`🔔 Alert detected: ${dialog.type()} - ${dialog.message()}`);
        try {
          await dialog.accept();
          console.log('✓ Alert accepted automatically');
        } catch (error) {
          console.warn(`⚠ Failed to accept alert: ${error}`);
        }
      });

      // Also try to handle any existing alert if present
      try {
        await page.evaluate(() => {
          // Check if there's an existing alert and try to handle it
          if (typeof window !== 'undefined') {
            const originalAlert = window.alert;
            const originalConfirm = window.confirm;
            
            window.alert = () => true;
            window.confirm = () => true;
            
            // Restore after a brief moment
            setTimeout(() => {
              window.alert = originalAlert;
              window.confirm = originalConfirm;
            }, 100);
          }
        });
      } catch (evaluationError) {
        // Silently continue if evaluation fails
      }

    } catch (error) {
      // Continue execution even if alert handling fails - equivalent to empty catch in Java
      console.warn(`⚠ Alert handling setup failed: ${error}`);
    }
  }

  /**
   * Resize browser window to standard test size
   * Equivalent to @BeforeMethod(alwaysRun = true) in Java TestNG
   * Only applies to Chrome and Firefox browsers (equivalent to Java logic)
   *
   * @param page Playwright Page object
   */
  public static async resizeBrowser(page: Page): Promise<void> {
    try {
      const browserType = this.runtimeConfig.browserType;
      
      // Only resize for Chrome and Firefox (equivalent to Java BrowserType check)
      if (browserType === BrowserType.CHROME || browserType === BrowserType.FIREFOX) {
        await page.setViewportSize({ width: 1400, height: 900 });
        console.log('🖥️  Browser resized to 1400x900');
      } else {
        console.log(`ℹ️  Browser resize skipped for ${browserType}`);
      }
    } catch (error) {
      console.warn(`⚠ Failed to resize browser: ${error}`);
      // Continue execution even if resize fails
    }
  }

  /**
   * Resize browser to smaller dimensions for specific test scenarios
   * Used in special cases where standard size doesn't work properly
   *
   * @param page Playwright Page object
   */
  public static async resizeBrowserToSmall(page: Page): Promise<void> {
    try {
      const browserType = this.runtimeConfig.browserType;
      
      // Only resize for Chrome and Firefox (matching Java logic)
      if (browserType === BrowserType.CHROME || browserType === BrowserType.FIREFOX) {
        await page.setViewportSize({ width: 1150, height: 900 });
        console.log('🖥️  Browser resized to small size (1150x900)');
      } else {
        console.log(`ℹ️  Small browser resize skipped for ${browserType}`);
      }
    } catch (error) {
      console.warn(`⚠ Failed to resize browser to small: ${error}`);
      // Continue execution even if resize fails
    }
  }

  /**
   * Maximize browser window for tests requiring full screen
   *
   * @param page Playwright Page object
   */
  public static async maximizeBrowser(page: Page): Promise<void> {
    try {
      const browserType = this.runtimeConfig.browserType;
      
      // Only maximize for Chrome and Firefox (matching Java logic)
      if (browserType === BrowserType.CHROME || browserType === BrowserType.FIREFOX) {
        // Playwright doesn't have direct maximize, so we set to a large viewport
        // This approximates the Java maximize behavior
        await page.setViewportSize({ width: 1920, height: 1080 });
        console.log('🖥️  Browser maximized (1920x1080)');
      } else {
        console.log(`ℹ️  Browser maximize skipped for ${browserType}`);
      }
    } catch (error) {
      console.warn(`⚠ Failed to maximize browser: ${error}`);
      // Continue execution even if maximize fails
    }
  }

  /**
   * Override runtime configuration based on parameter
   * Equivalent to MtssRuntimeConfig.overrideConfig() in Java
   *
   * @param configName Configuration environment name to switch to
   */
  private static async overrideConfig(configName: string): Promise<void> {
    try {
      // Get environment URLs for the specified config using ConfigManager
      const environmentUrls = configManager.getEnvironmentUrls(configName);
      
      if (!environmentUrls) {
        throw new Error(`Configuration '${configName}' not found`);
      }

      // Update runtime configuration
      this.runtimeConfig = {
        ...this.runtimeConfig,
        environment: configName,
        baseUrl: environmentUrls.url,
        maintenanceUrl: environmentUrls.maintenanceUrl || environmentUrls.maintenance_url,
        multiTenantUrl: environmentUrls.dev_tenant_url
      };

      // Update MtssHelper configuration for compatibility
      MtssHelper.setRuntimeConfig({
        url: environmentUrls.url,
        maintenanceUrl: environmentUrls.maintenanceUrl || environmentUrls.maintenance_url || '',
        multiTenantMaintenanceUrl: environmentUrls.dev_tenant_url
      });

      console.log(`✓ Configuration overridden to '${configName}'`);
      console.log(`   Base URL: ${environmentUrls.url}`);
      console.log(`   Maintenance URL: ${environmentUrls.maintenanceUrl || environmentUrls.maintenance_url}`);

    } catch (error) {
      throw new MtssException(
        `Failed to override configuration to '${configName}': ${error}`,
        error instanceof Error ? error : undefined,
        'overrideConfig'
      );
    }
  }

  /**
   * Add screenshot listener for automatic failure capture
   *
   * @param listener Function to execute for screenshot capture
   */
  public static addScreenshotListener(listener: (page: Page, testInfo: TestInfo) => Promise<void>): void {
    this.screenshotListeners.add(listener);
  }

  /**
   * Remove screenshot listener
   *
   * @param listener Function to remove from screenshot listeners
   */
  public static removeScreenshotListener(listener: (page: Page, testInfo: TestInfo) => Promise<void>): void {
    this.screenshotListeners.delete(listener);
  }

  /**
   * Capture screenshot on test failure
   * Equivalent to AutoScreenshotListener functionality in Java
   *
   * @param page Playwright Page object
   * @param testInfo Playwright test information
   */
  private static async captureScreenshotOnFailure(page: Page, testInfo: TestInfo): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `screenshots/failure-${testInfo.title}-${timestamp}.png`;
      
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      this.testContext.screenshots?.push(screenshotPath);
      console.log(`📸 Screenshot captured: ${screenshotPath}`);
      
      // Attach screenshot to test for reporting
      await testInfo.attach('failure-screenshot', {
        path: screenshotPath,
        contentType: 'image/png'
      });

    } catch (error) {
      console.warn(`⚠ Failed to capture screenshot: ${error}`);
    }
  }

  /**
   * Execute all registered screenshot listeners
   *
   * @param page Playwright Page object
   * @param testInfo Playwright test information
   */
  public static async executeScreenshotListeners(page: Page, testInfo: TestInfo): Promise<void> {
    for (const listener of this.screenshotListeners) {
      try {
        await listener(page, testInfo);
      } catch (error) {
        console.warn(`⚠ Screenshot listener failed: ${error}`);
      }
    }
  }

  /**
   * Get current runtime configuration
   *
   * @returns Current MTSS runtime configuration
   */
  public static getRuntimeConfig(): Readonly<MtssRuntimeConfig> {
    return { ...this.runtimeConfig };
  }

  /**
   * Get current test context
   *
   * @returns Current MTSS test context
   */
  public static getTestContext(): Readonly<MtssTestContext> {
    return { ...this.testContext };
  }

  /**
   * Update test context with additional information
   *
   * @param updates Partial test context updates
   */
  public static updateTestContext(updates: Partial<MtssTestContext>): void {
    this.testContext = { ...this.testContext, ...updates };
  }

  /**
   * Clean up test context and reset state
   * Should be called in suite teardown
   */
  public static async cleanupSuite(): Promise<void> {
    try {
      // Clear screenshot listeners
      this.screenshotListeners.clear();
      
      // Reset test context
      this.testContext = {};
      
      // Clear current users
      MtssUsers.clearAllCurrentUsers();
      
      console.log('🧹 Test suite cleanup completed');
      
    } catch (error) {
      console.warn(`⚠ Suite cleanup failed: ${error}`);
    }
  }

  /**
   * Validate test environment and configuration
   * Should be called early in test execution
   */
  public static validateTestEnvironment(): void {
    const config = this.runtimeConfig;
    const errors: string[] = [];

    if (!config.environment) {
      errors.push('Environment not specified');
    }

    if (!config.browserType) {
      errors.push('Browser type not specified');
    }

    if (!config.baseUrl && !process.env.BASE_URL) {
      errors.push('Base URL not configured');
    }

    if (errors.length > 0) {
      throw new MtssException(
        `Test environment validation failed: ${errors.join(', ')}`,
        undefined,
        'validateTestEnvironment'
      );
    }

    console.log('✅ Test environment validation passed');
  }

  /**
   * Get browser type for conditional test logic
   *
   * @returns Current browser type
   */
  public static getBrowserType(): BrowserType {
    return this.runtimeConfig.browserType || BrowserType.CHROME;
  }

  /**
   * Check if running in headless mode
   *
   * @returns True if headless mode is enabled
   */
  public static isHeadless(): boolean {
    return process.env.HEADLESS === 'true' || process.env.CI === 'true';
  }

  /**
   * Get test timeout value
   *
   * @returns Configured timeout in milliseconds
   */
  public static getTestTimeout(): number {
    return this.runtimeConfig.timeout || 120000;
  }
}

// Export the extended test fixture with MTSS functionality
export const test = base.extend<{
  mtssContext: MtssSeleniumTestNGTest;
  autoLogin: void;
  autoScreenshot: void;
}>({
  // Provide MTSS context to all tests
  mtssContext: async ({}, use) => {
    await use(MtssSeleniumTestNGTest);
  },

  // Auto-login fixture for tests that need authenticated users
  autoLogin: [async ({ page }, use) => {
    // Initialize default users if not already set
    if (!MtssUsers.getCurrentAdminUser()) {
      MtssUsers.initializeDefaultUsers();
    }
    await use();
  }, { auto: true }],

  // Auto-screenshot fixture for failure capture
  autoScreenshot: [async ({ page }, use, testInfo) => {
    await use();
    
    // Execute screenshot listeners after test completion
    if (testInfo.status === 'failed') {
      await MtssSeleniumTestNGTest.executeScreenshotListeners(page, testInfo);
    }
  }, { auto: true }]
});

export { expect } from '@playwright/test';
