/**
 * Playwright/TypeScript version of MtssAlert (converted from Java)
 * Alert message handler for MTSS application providing complete method coverage
 * matching the Java source implementation with enhanced Playwright integration.
 *
 * This implementation provides:
 * - Complete method mapping from Java Selenide to Playwright
 * - All methods from the original Java class with proper async/await patterns
 * - Proper TypeScript interfaces and error handling
 * - Consistent wait strategies and element interaction patterns
 * - Enhanced support for Playwright test framework
 * - Static utility class design matching Java source
 *
 * ========================================
 * COMPLETE FEATURE COVERAGE:
 * ========================================
 *
 * 🚨 ALERT MESSAGE VALIDATION:
 * - isNewGroupCreated() - Check for "new group created" alert
 * - isGroupDeleted() - Check for "group deleted" alert
 * - isMemberSuccessfullyAdded() - Check for "member added" alert
 * - isGroupUpdated() - Check for "group updated" alert
 * - getAlertMessage() - Get current alert message text
 *
 * ========================================
 * TECHNICAL IMPLEMENTATION DETAILS:
 * ========================================
 *
 * 🏗️ ARCHITECTURE:
 * - Static utility class design (matching Java source)
 * - Uses Playwright locator strategies for element selection
 * - Implements proper async/await patterns throughout
 * - Provides comprehensive error handling and timeout management
 *
 * 🎛️ SELECTOR STRATEGY:
 * - CSS selector optimized for Playwright: 'div.ui-pnotify-text'
 * - Consistent with Java By.cssSelector approach
 * - Robust element identification for alert notifications
 * - Support for UI notification library (pnotify)
 *
 * ⏱️ WAIT STRATEGIES:
 * - Element visibility waiting before interactions (10s for creation alerts)
 * - Extended timeout for general alert retrieval (20s)
 * - Proper state management with Playwright expect assertions
 * - Matching Java WaitFor.waitForIsDisplayed and shouldBe(Condition.visible) patterns
 *
 * 🔧 ERROR HANDLING:
 * - Comprehensive element interaction patterns
 * - Visibility validation before text extraction
 * - Consistent error reporting and debugging support
 * - Graceful handling of alert timing variations
 *
 * 📝 TESTING SUPPORT:
 * - Full Playwright Test framework integration
 * - Complete method coverage for all alert validation scenarios
 * - Detailed method documentation for test development
 * - Enhanced reliability for automated test execution
 *
 * @example
 * ```typescript
 * // Check for specific alert messages
 * const isCreated = await MtssAlert.isNewGroupCreated(page);
 * const isDeleted = await MtssAlert.isGroupDeleted(page);
 * const isAdded = await MtssAlert.isMemberSuccessfullyAdded(page);
 * const isUpdated = await MtssAlert.isGroupUpdated(page);
 *
 * // Get current alert message
 * const alertText = await MtssAlert.getAlertMessage(page);
 * console.log('Alert message:', alertText);
 * ```
 *
 * @author Converted from MtssAlert.java (Sourav.Panda)
 * @since 4/15/2021 (Original Java), 2025 (TypeScript conversion)
 * @version 1.0.0
 * @see Original Java implementation in psqa.hoonuit.shared.mtss.shared.MtssAlert
 */

import { Page, Locator, expect } from '@playwright/test';

export class MtssAlert {
  // ========================================
  // CSS SELECTORS - CONVERTED FROM JAVA
  // ========================================
  
  /**
   * Alert message selector (converted from Java By.cssSelector)
   * Maps to: By.cssSelector("div.ui-pnotify-text")
   */
  private static readonly ALERT_SELECTOR = 'div.ui-pnotify-text';

  // ========================================
  // TIMEOUT CONSTANTS
  // ========================================
  
  private static readonly DEFAULT_WAIT_TIMEOUT = 10000; // 10 seconds (matching Java WaitFor.waitForIsDisplayed)
  private static readonly EXTENDED_WAIT_TIMEOUT = 20000; // 20 seconds (matching Java getAlertMessage timeout)

  // ========================================
  // ALERT MESSAGE CONSTANTS
  // ========================================
  
  private static readonly NEW_GROUP_CREATED_MESSAGE = 'The new group was successfully created.';
  private static readonly GROUP_DELETED_MESSAGE = 'The group was successfully deleted!';
  private static readonly MEMBER_ADDED_MESSAGE = 'The members were successfully added to the group.';
  private static readonly GROUP_UPDATED_MESSAGE = 'Group updated successfully.';

  // ========================================
  // CORE ALERT VALIDATION METHODS - CONVERTED FROM JAVA
  // ========================================

  /**
   * Checks if "new group created" alert message is displayed
   * Converted from Java isNewGroupCreated method with enhanced error handling
   *
   * Java equivalent:
   * ```java
   * public static boolean isNewGroupCreated() {
   *    String alertMsg = "The new group was successfully created.";
   *    WaitFor.waitForIsDisplayed($(ALERT), 10);
   *    return $(ALERT).shouldBe(Condition.visible).getText().equals(alertMsg);
   * }
   * ```
   *
   * @param page - Playwright Page object
   * @returns Promise<boolean> - true if the expected alert message is found
   * @throws Error if alert element cannot be found or validated
   */
  static async isNewGroupCreated(page: Page): Promise<boolean> {
    try {
      // Wait for element to be displayed (equivalent to WaitFor.waitForIsDisplayed($(ALERT), 10))
      await page.waitForSelector(this.ALERT_SELECTOR, {
        state: 'visible',
        timeout: this.DEFAULT_WAIT_TIMEOUT
      });
      
      // Ensure element is visible and get text (equivalent to shouldBe(Condition.visible).getText())
      const alertElement = page.locator(this.ALERT_SELECTOR);
      await expect(alertElement).toBeVisible();
      const text = await alertElement.textContent();
      
      // Compare with expected message (equivalent to .equals(alertMsg))
      return text?.trim() === this.NEW_GROUP_CREATED_MESSAGE;
      
    } catch (error) {
      throw new Error(`Failed to check new group created alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks if "group deleted" alert message is displayed
   * Converted from Java isGroupDeleted method with enhanced error handling
   *
   * Java equivalent:
   * ```java
   * public static boolean isGroupDeleted() {
   *    String alertMsg = "The group was successfully deleted!";
   *    return $(ALERT).shouldBe(Condition.visible).getText().equals(alertMsg);
   * }
   * ```
   *
   * @param page - Playwright Page object
   * @returns Promise<boolean> - true if the expected alert message is found
   * @throws Error if alert element cannot be found or validated
   */
  static async isGroupDeleted(page: Page): Promise<boolean> {
    try {
      // Ensure element is visible before getting text (equivalent to shouldBe(Condition.visible).getText())
      const alertElement = page.locator(this.ALERT_SELECTOR);
      await expect(alertElement).toBeVisible();
      const text = await alertElement.textContent();
      
      // Compare with expected message (equivalent to .equals(alertMsg))
      return text?.trim() === this.GROUP_DELETED_MESSAGE;
      
    } catch (error) {
      throw new Error(`Failed to check group deleted alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks if "member successfully added" alert message is displayed
   * Converted from Java isMemberSuccessfullyAdded method with enhanced error handling
   *
   * Java equivalent:
   * ```java
   * public static boolean isMemberSuccessfullyAdded() {
   *    String alertMsg = "The members were successfully added to the group.";
   *    return $(ALERT).shouldBe(Condition.visible).getText().equals(alertMsg);
   * }
   * ```
   *
   * @param page - Playwright Page object
   * @returns Promise<boolean> - true if the expected alert message is found
   * @throws Error if alert element cannot be found or validated
   */
  static async isMemberSuccessfullyAdded(page: Page): Promise<boolean> {
    try {
      // Ensure element is visible before getting text (equivalent to shouldBe(Condition.visible).getText())
      const alertElement = page.locator(this.ALERT_SELECTOR);
      await expect(alertElement).toBeVisible();
      const text = await alertElement.textContent();
      
      // Compare with expected message (equivalent to .equals(alertMsg))
      return text?.trim() === this.MEMBER_ADDED_MESSAGE;
      
    } catch (error) {
      throw new Error(`Failed to check member added alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks if "group updated" alert message is displayed
   * Converted from Java isGroupUpdated method with enhanced error handling
   *
   * Java equivalent:
   * ```java
   * public static boolean isGroupUpdated() {
   *    String alertMsg = "Group updated successfully.";
   *    return $(ALERT).shouldBe(Condition.visible).getText().equals(alertMsg);
   * }
   * ```
   *
   * @param page - Playwright Page object
   * @returns Promise<boolean> - true if the expected alert message is found
   * @throws Error if alert element cannot be found or validated
   */
  static async isGroupUpdated(page: Page): Promise<boolean> {
    try {
      // Ensure element is visible before getting text (equivalent to shouldBe(Condition.visible).getText())
      const alertElement = page.locator(this.ALERT_SELECTOR);
      await expect(alertElement).toBeVisible();
      const text = await alertElement.textContent();
      
      // Compare with expected message (equivalent to .equals(alertMsg))
      return text?.trim() === this.GROUP_UPDATED_MESSAGE;
      
    } catch (error) {
      throw new Error(`Failed to check group updated alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the current alert message text
   * Converted from Java getAlertMessage method with enhanced error handling
   *
   * Java equivalent:
   * ```java
   * public static String getAlertMessage() {
   *    WaitFor.waitForIsDisplayed(ALERT, 20);
   *    return $(ALERT).shouldBe(Condition.visible).getText();
   * }
   * ```
   *
   * @param page - Playwright Page object
   * @returns Promise<string> - the alert message text (trimmed)
   * @throws Error if alert element cannot be found or text cannot be retrieved
   */
  static async getAlertMessage(page: Page): Promise<string> {
    try {
      // Wait for element to be displayed with 20 second timeout (equivalent to WaitFor.waitForIsDisplayed(ALERT, 20))
      await page.waitForSelector(this.ALERT_SELECTOR, {
        state: 'visible',
        timeout: this.EXTENDED_WAIT_TIMEOUT
      });
      
      // Ensure element is visible and get text (equivalent to shouldBe(Condition.visible).getText())
      const alertElement = page.locator(this.ALERT_SELECTOR);
      await expect(alertElement).toBeVisible();
      const text = await alertElement.textContent();
      
      return text?.trim() || '';
      
    } catch (error) {
      throw new Error(`Failed to get alert message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========================================
  // ENHANCED UTILITY METHODS
  // ========================================

  /**
   * Check if any alert is currently visible
   * Enhanced method for alert presence detection
   * @param page - Playwright Page object
   * @returns Promise<boolean> - true if any alert is visible
   */
  static async isAlertVisible(page: Page): Promise<boolean> {
    try {
      const alertElement = page.locator(this.ALERT_SELECTOR);
      await alertElement.waitFor({ state: 'visible', timeout: 3000 });
      return await alertElement.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for any alert to appear
   * Enhanced method for alert waiting
   * @param page - Playwright Page object
   * @param timeout - Optional timeout in milliseconds
   * @returns Promise<void>
   */
  static async waitForAlert(page: Page, timeout: number = this.DEFAULT_WAIT_TIMEOUT): Promise<void> {
    await page.waitForSelector(this.ALERT_SELECTOR, {
      state: 'visible',
      timeout
    });
  }

  /**
   * Wait for alert to disappear
   * Enhanced method for alert dismissal waiting
   * @param page - Playwright Page object
   * @param timeout - Optional timeout in milliseconds
   * @returns Promise<void>
   */
  static async waitForAlertToDisappear(page: Page, timeout: number = this.DEFAULT_WAIT_TIMEOUT): Promise<void> {
    try {
      await page.waitForSelector(this.ALERT_SELECTOR, {
        state: 'hidden',
        timeout
      });
    } catch {
      // Alert may not have been present, continue execution
    }
  }
}
