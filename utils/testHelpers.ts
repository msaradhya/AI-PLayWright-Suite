/**
 * Test helper functions for Playwright tests
 * Common utilities for test operations
 * 
 * Migrated from: msa/hoonuit/utils/testHelpers.ts
 */

import { Page, expect } from '@playwright/test';

/**
 * Wait for network requests to be completed
 * @param page - Playwright page object
 * @param timeout - Timeout in milliseconds (default: 5000)
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for a specific element to be visible
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 * @param timeout - Timeout in milliseconds (default: 10000)
 */
export async function waitForElement(page: Page, selector: string, timeout = 10000): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Check if an element exists on the page
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 * @returns True if element exists, false otherwise
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  const element = await page.$(selector);
  return element !== null;
}

/**
 * Take a screenshot and save it with a timestamp
 * @param page - Playwright page object
 * @param name - Base name for the screenshot
 * @returns Buffer containing the screenshot data
 */
export async function takeScreenshot(page: Page, name: string): Promise<Buffer> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return await page.screenshot({ 
    path: `./screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Click an element with retry logic
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 * @param options - Retry options (retries: number of attempts, delay: ms between attempts)
 */
export async function safeClick(
  page: Page, 
  selector: string, 
  options = { retries: 3, delay: 1000 }
): Promise<void> {
  let attempts = 0;
  
  while (attempts < options.retries) {
    try {
      await page.click(selector);
      return;
    } catch (error) {
      attempts++;
      if (attempts >= options.retries) {
        throw error;
      }
      await page.waitForTimeout(options.delay);
    }
  }
}

/**
 * Fill a form field with text, clearing it first
 * @param page - Playwright page object
 * @param selector - CSS selector for the input field
 * @param text - Text to fill in the field
 */
export async function clearAndFill(page: Page, selector: string, text: string): Promise<void> {
  await page.click(selector);
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.fill(selector, text);
}

/**
 * Assert text content on the page
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 * @param expectedText - Expected text content
 */
export async function assertTextContent(
  page: Page, 
  selector: string, 
  expectedText: string
): Promise<void> {
  const textContent = await page.textContent(selector);
  expect(textContent?.trim()).toBe(expectedText);
}

/**
 * Generate a random email for testing
 * @returns Random email string
 */
export function generateRandomEmail(): string {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `test-${randomString}@example.com`;
}

/**
 * Generate a random string of specified length
 * @param length - Length of the random string
 * @returns Random string
 */
export function generateRandomString(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate a random number within a range
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number between min and max
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Parse a table from the page into a 2D array
 * @param page - Playwright page object
 * @param tableSelector - CSS selector for the table
 * @returns 2D array of table cell contents
 */
export async function parseTable(page: Page, tableSelector: string): Promise<string[][]> {
  return await page.$$eval(`${tableSelector} tr`, (rows) => {
    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td, th'));
      return cells.map(cell => cell.textContent?.trim() || '');
    });
  });
}

/**
 * Parse a table into an array of objects using headers as keys
 * @param page - Playwright page object
 * @param tableSelector - CSS selector for the table
 * @returns Array of objects representing table rows
 */
export async function parseTableToObjects(
  page: Page, 
  tableSelector: string
): Promise<Record<string, string>[]> {
  const tableData = await parseTable(page, tableSelector);
  
  if (tableData.length < 2) {
    return [];
  }
  
  const headers = tableData[0];
  const rows = tableData.slice(1);
  
  return rows.map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

/**
 * Wait for a specific URL to be loaded
 * @param page - Playwright page object
 * @param urlPattern - URL pattern (string or regex)
 * @param timeout - Timeout in milliseconds (default: 30000)
 */
export async function waitForUrl(
  page: Page, 
  urlPattern: string | RegExp, 
  timeout = 30000
): Promise<void> {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * Scroll to an element on the page
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Get all attribute values for elements matching a selector
 * @param page - Playwright page object
 * @param selector - CSS selector for the elements
 * @param attribute - Attribute name to retrieve
 * @returns Array of attribute values
 */
export async function getAttributeValues(
  page: Page, 
  selector: string, 
  attribute: string
): Promise<(string | null)[]> {
  const elements = page.locator(selector);
  const count = await elements.count();
  const values: (string | null)[] = [];
  
  for (let i = 0; i < count; i++) {
    const value = await elements.nth(i).getAttribute(attribute);
    values.push(value);
  }
  
  return values;
}

/**
 * Wait for download to complete
 * @param page - Playwright page object
 * @param triggerAction - Function that triggers the download
 * @returns Path to the downloaded file
 */
export async function waitForDownload(
  page: Page, 
  triggerAction: () => Promise<void>
): Promise<string> {
  const downloadPromise = page.waitForEvent('download');
  await triggerAction();
  const download = await downloadPromise;
  const path = await download.path();
  return path || '';
}

/**
 * Retry an action until it succeeds or max attempts reached
 * @param action - Async function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param delayMs - Delay between attempts in milliseconds
 * @returns Result of the action
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
}

/**
 * Check if page has a specific cookie
 * @param page - Playwright page object
 * @param cookieName - Name of the cookie to check
 * @returns True if cookie exists, false otherwise
 */
export async function hasCookie(page: Page, cookieName: string): Promise<boolean> {
  const context = page.context();
  const cookies = await context.cookies();
  return cookies.some(cookie => cookie.name === cookieName);
}

/**
 * Get cookie value by name
 * @param page - Playwright page object
 * @param cookieName - Name of the cookie
 * @returns Cookie value or undefined if not found
 */
export async function getCookieValue(
  page: Page, 
  cookieName: string
): Promise<string | undefined> {
  const context = page.context();
  const cookies = await context.cookies();
  const cookie = cookies.find(c => c.name === cookieName);
  return cookie?.value;
}

/**
 * Format date to a specific format
 * @param date - Date object
 * @param format - Format string (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}