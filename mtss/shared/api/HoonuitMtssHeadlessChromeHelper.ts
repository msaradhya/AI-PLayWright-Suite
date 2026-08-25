import { Page, BrowserContext, chromium, Cookie } from '@playwright/test';
import { HoonuitUsers } from '../users/HoonuitUsers';
import { HoonuitLoginPage as LoginPage } from '../../../shared/pages/loginPage/consolidated/HoonuitLoginPage';
import { HoonuitMaintenanceLoginPage } from '../../../shared/pages/loginPage/consolidated/HoonuitMaintenanceLoginPage';
import { getModuleMainUrl } from '../../../../utils/moduleUtils';
import { getMaintenanceUrl } from '../../../../utils/urlUtils';
import { HoonuitHelper } from '../../../helpers/hoonuitHelper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Playwright/TypeScript version of HoonuitMtssHeadlessChromeHelper
 * Provides cookie retrieval and payload manipulation for Playwright tests
 * @author Converted from Java version by Ankit.Mohapatra
 * @since 29/11/2023
 */
export class HoonuitMtssHeadlessChromeHelper {
  private static readonly PLACEHOLDER_NAME_PATTERN = /\{\{[a-zA-Z0-9_]+\}\}/;
  private payload: string | undefined;

  constructor() {}

  /**
   * Get admin cookies using Playwright headless Chrome
   * Equivalent to Java getAdminCookiesUsingHeadlessChrome method
   */
  static async getAdminCookiesUsingHeadlessChrome(user: HoonuitUsers, context?: BrowserContext, page?: Page): Promise<string> {
    let browser;
    let localContext = context;
    let localPage = page;
    
    try {
      // Create browser context if not provided
      if (!localContext || !localPage) {
        browser = await chromium.launch({ headless: true });
        localContext = await browser.newContext();
        localPage = await localContext.newPage();
      }

      const loginPage = new LoginPage(localPage);
      await localPage.goto(getModuleMainUrl('hoonuit'));
      await HoonuitHelper.waitForPageToLoad();
      
      if (HoonuitUsers.getCurrentAdminUser()) {
        user = HoonuitUsers.getCurrentAdminUser()!;
      }

      await localPage.click('text="Sign in as an Administrator"');
      await loginPage.setUsername(user.userName);
      await loginPage.setPassword(user.password);
      await loginPage.clickSubmit();
      await HoonuitHelper.waitForPageToLoad();
      
      return this.getCookies(localContext);
    } finally {
      if (browser && !context && !page) {
        await browser.close();
      }
    }
  }

  /**
   * Get maintenance admin cookies using Playwright headless Chrome
   * Equivalent to Java getMtssAdminCookies method
   */
  static async getMtssAdminCookies(user: HoonuitUsers, context?: BrowserContext, page?: Page): Promise<string> {
    let browser;
    let localContext = context;
    let localPage = page;
    
    try {
      // Create browser context if not provided
      if (!localContext || !localPage) {
        browser = await chromium.launch({ headless: true });
        localContext = await browser.newContext();
        localPage = await localContext.newPage();
      }

      const loginPage = new HoonuitMaintenanceLoginPage(localPage);
      await localPage.goto(getMaintenanceUrl('development')); // Using development as default env
      await HoonuitHelper.waitForPageToLoad();
      
      if (HoonuitUsers.getCurrentMaintenanceUser()) {
        user = HoonuitUsers.getCurrentMaintenanceUser()!;
      }
      
      await loginPage.setUsername(user.userName);
      await loginPage.setPassword(user.password);
      await loginPage.clickSubmit();
      await HoonuitHelper.waitForPageToLoad();
      
      return this.getCookies(localContext);
    } finally {
      if (browser && !context && !page) {
        await browser.close();
      }
    }
  }

  /**
   * Get teacher cookies using Playwright headless Chrome
   * Equivalent to Java getTeacherCookiesUsingHeadlessChrome method
   */
  static async getTeacherCookiesUsingHeadlessChrome(user: HoonuitUsers, context?: BrowserContext, page?: Page): Promise<string> {
    let browser;
    let localContext = context;
    let localPage = page;
    
    try {
      // Create browser context if not provided
      if (!localContext || !localPage) {
        browser = await chromium.launch({ headless: true });
        localContext = await browser.newContext();
        localPage = await localContext.newPage();
      }

      const loginPage = new LoginPage(localPage);
      await localPage.goto(getModuleMainUrl('hoonuit'));
      await HoonuitHelper.waitForPageToLoad();
      
      if (HoonuitUsers.getCurrentTeacherUser()) {
        user = HoonuitUsers.getCurrentTeacherUser()!;
      }

      await localPage.click('text="Sign in as a Teacher"');
      await loginPage.setUsername(user.userName);
      await loginPage.setPassword(user.password);
      await loginPage.clickSubmit();
      await HoonuitHelper.waitForPageToLoad();
      
      return this.getCookies(localContext);
    } finally {
      if (browser && !context && !page) {
        await browser.close();
      }
    }
  }

  /**
   * Extract cookies from context, prioritizing JSESSIONID like Java version
   * Equivalent to Java getCookies method
   */
  private static async getCookies(context: BrowserContext): Promise<string> {
    const cookies = await context.cookies();
    const jsessionCookie = cookies.find((c: Cookie) => c.name === 'JSESSIONID');
    
    if (jsessionCookie) {
      return `JSESSIONID=${jsessionCookie.value}; `;
    }
    
    // Fallback: return all cookies if JSESSIONID not found
    return cookies.map((c: Cookie) => `${c.name}=${c.value}`).join('; ') + '; ';
  }

  /**
   * Build request specification with headers
   * Pass headers as "header:headerValue" format
   * Equivalent to Java getRequestSpec method
   */
  static getRequestSpec(...headers: string[]): RequestSpec {
    const requestSpec: RequestSpec = {
      contentType: 'application/json',
      headers: {}
    };

    if (headers && headers.length > 0) {
      for (const header of headers) {
        const parts = header.split(':');
        if (parts.length === 2) {
          requestSpec.headers[parts[0].trim()] = parts[1].trim();
        }
      }
    }

    return requestSpec;
  }

  /**
   * Build response specification with expected status code
   * Equivalent to Java getResponseSpec method
   */
  static getResponseSpec(responseCode: number): ResponseSpec {
    return {
      expectedContentType: 'application/json',
      expectedStatusCode: responseCode
    };
  }

  /**
   * Load payload from file or string
   * Equivalent to Java loadPayload method
   */
  loadPayload(data: string, fromFile: boolean = true): this {
    if (fromFile) {
      try {
        // Resolve path relative to project root - handle both absolute and relative paths
        let filePath: string;
        if (path.isAbsolute(data)) {
          filePath = data;
        } else {
          filePath = path.resolve(process.cwd(), 'hoonuit', 'resources', data);
        }
        
        this.payload = fs.readFileSync(filePath, 'utf-8');
      } catch (e) {
        console.error(`Error reading payload file: ${(e as Error).message}`);
        console.error(`Attempted path: ${data}`);
      }
    } else {
      this.payload = data;
    }
    return this;
  }

  /**
   * Replace placeholders in payload (e.g., {{name}})
   * Includes regex validation like Java version
   * Equivalent to Java replaceInPayload method
   */
  replaceInPayload(placeHolder: string, value: string): this {
    const replaceName = `{{${placeHolder}}}`;
    
    if (!this.payload || this.payload.length === 0) {
      console.warn('Payload needs to be loaded before placing text.');
      return this;
    }
    
    // Validate placeholder name using regex pattern like Java version
    if (!HoonuitMtssHeadlessChromeHelper.PLACEHOLDER_NAME_PATTERN.test(replaceName)) {
      console.warn("Invalid placeholder name. Placeholder name can only contain 'a-z', 'A-Z', '0-9' and '_'");
      return this;
    }
    
    if (this.payload.includes(replaceName)) {
      // Use same regex replacement logic as Java version with proper escaping
      this.payload = this.payload.replace(new RegExp(`\\{\\{${placeHolder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`, 'g'), value);
    } else {
      console.warn(`Payload does not contain placeholder: ${replaceName}`);
    }
    
    return this;
  }

  /**
   * Get the current payload
   * Equivalent to Java getPayload method
   */
  getPayload(): string | undefined {
    return this.payload;
  }
}

// TypeScript types for request/response specifications
export interface RequestSpec {
  contentType: string;
  headers: Record<string, string>;
}

export interface ResponseSpec {
  expectedContentType: string;
  expectedStatusCode: number;
}

// Export static methods for backwards compatibility
export const getRequestSpec = HoonuitMtssHeadlessChromeHelper.getRequestSpec;
export const getResponseSpec = HoonuitMtssHeadlessChromeHelper.getResponseSpec;
export const getAdminCookiesUsingHeadlessChrome = HoonuitMtssHeadlessChromeHelper.getAdminCookiesUsingHeadlessChrome;
export const getMtssAdminCookies = HoonuitMtssHeadlessChromeHelper.getMtssAdminCookies;
export const getTeacherCookiesUsingHeadlessChrome = HoonuitMtssHeadlessChromeHelper.getTeacherCookiesUsingHeadlessChrome;
