import { Page, Locator, expect } from '@playwright/test';

/**
 * Playwright/TypeScript version of GoogleLoginPage (converted from Java)
 * Page object for Google authentication login process
 * Handles username/email input, password input, and navigation buttons
 *
 * @author Converted from Java to TypeScript/Playwright
 * @since Original Java implementation
 */
export class GoogleLoginPage {
  private page: Page;
  
  // CSS Selectors - converted from Java static final fields
  private static readonly USERNAME_TEXTBOX = "input[id='identifierId'], input[id='Email']";
  private static readonly USERNAME_NEXT_BUTTON = "div#identifierNext button, input[id='next']";
  private static readonly PASSWORD_TEXTBOX = "input[name='password'], input[id='password']";
  private static readonly PASSWORD_NEXT_BUTTON = "div#passwordNext button, input[id='submit']";
  
  // Constants
  private static readonly DEFAULT_TIMEOUT = 10000;
  
  // Locators
  private readonly usernameTextbox: Locator;
  private readonly usernameNextButton: Locator;
  private readonly passwordTextbox: Locator;
  private readonly passwordNextButton: Locator;

  /**
   * Constructor initializes the GoogleLoginPage with Playwright Page object
   * @param page The Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.usernameTextbox = page.locator(GoogleLoginPage.USERNAME_TEXTBOX);
    this.usernameNextButton = page.locator(GoogleLoginPage.USERNAME_NEXT_BUTTON);
    this.passwordTextbox = page.locator(GoogleLoginPage.PASSWORD_TEXTBOX);
    this.passwordNextButton = page.locator(GoogleLoginPage.PASSWORD_NEXT_BUTTON);
  }

  /**
   * Set username/email in the Google login form
   * Equivalent to Java setUsername() method with Selenide wait and visibility check
   * @param username The username or email to enter
   * @throws Error if username is null, undefined, or empty
   */
  async setUsername(username: string): Promise<void> {
    if (!username || username.trim() === '') {
      throw new Error('Username cannot be null, undefined, or empty');
    }

    try {
      // Wait for element to be visible (equivalent to Selenide waitUntil(Condition.visible, 10000L))
      await this.usernameTextbox.waitFor({
        state: 'visible',
        timeout: GoogleLoginPage.DEFAULT_TIMEOUT
      });
      
      // Assert element is visible (equivalent to shouldBe(Condition.visible))
      await expect(this.usernameTextbox).toBeVisible();
      
      // Clear and set value (equivalent to setValue(username))
      await this.usernameTextbox.clear();
      await this.usernameTextbox.fill(username);
      
      // Verify the value was set correctly
      await expect(this.usernameTextbox).toHaveValue(username);
      
    } catch (error) {
      throw new Error(`Failed to set username: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set password in the Google login form
   * Equivalent to Java setPassword() method with Selenide wait and visibility check
   * @param password The password to enter
   * @throws Error if password is null, undefined, or empty
   */
  async setPassword(password: string): Promise<void> {
    if (!password || password.trim() === '') {
      throw new Error('Password cannot be null, undefined, or empty');
    }

    try {
      // Wait for element to be visible (equivalent to Selenide waitUntil(Condition.visible, 10000L))
      await this.passwordTextbox.waitFor({
        state: 'visible',
        timeout: GoogleLoginPage.DEFAULT_TIMEOUT
      });
      
      // Assert element is visible (equivalent to shouldBe(Condition.visible))
      await expect(this.passwordTextbox).toBeVisible();
      
      // Clear and set value (equivalent to setValue(password))
      await this.passwordTextbox.clear();
      await this.passwordTextbox.fill(password);
      
      // Note: Cannot verify password value due to security (input type="password")
      
    } catch (error) {
      throw new Error(`Failed to set password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Click the "Next" button after entering username
   * Equivalent to Java clickUserNameNext() method with Selenide visibility check
   * @throws Error if button is not clickable or click fails
   */
  async clickUserNameNext(): Promise<void> {
    try {
      // Wait for element to be visible and enabled
      await this.usernameNextButton.waitFor({
        state: 'visible',
        timeout: GoogleLoginPage.DEFAULT_TIMEOUT
      });
      
      // Assert element is visible (equivalent to shouldBe(Condition.visible))
      await expect(this.usernameNextButton).toBeVisible();
      await expect(this.usernameNextButton).toBeEnabled();
      
      // Scroll into view if needed and click
      await this.usernameNextButton.scrollIntoViewIfNeeded();
      await this.usernameNextButton.click();
      
    } catch (error) {
      throw new Error(`Failed to click username next button: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Click the "Next" or "Sign In" button after entering password
   * Equivalent to Java clickPasswordNext() method with Selenide visibility check
   * @throws Error if button is not clickable or click fails
   */
  async clickPasswordNext(): Promise<void> {
    try {
      // Wait for element to be visible and enabled
      await this.passwordNextButton.waitFor({
        state: 'visible',
        timeout: GoogleLoginPage.DEFAULT_TIMEOUT
      });
      
      // Assert element is visible (equivalent to shouldBe(Condition.visible))
      await expect(this.passwordNextButton).toBeVisible();
      await expect(this.passwordNextButton).toBeEnabled();
      
      // Scroll into view if needed and click
      await this.passwordNextButton.scrollIntoViewIfNeeded();
      await this.passwordNextButton.click();
      
    } catch (error) {
      throw new Error(`Failed to click password next button: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete Google login process with username and password
   * Convenience method that combines all login steps
   * @param username The username or email to enter
   * @param password The password to enter
   * @throws Error if any step of the login process fails
   */
  async login(username: string, password: string): Promise<void> {
    try {
      await this.setUsername(username);
      await this.clickUserNameNext();
      
      // Wait for password page to load
      await this.page.waitForTimeout(2000);
      
      await this.setPassword(password);
      await this.clickPasswordNext();
      
    } catch (error) {
      throw new Error(`Google login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if username input field is visible
   * Utility method for page state validation
   * @returns true if username field is visible, false otherwise
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    try {
      await this.usernameTextbox.waitFor({
        state: 'visible',
        timeout: 5000
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if password input field is visible
   * Utility method for page state validation
   * @returns true if password field is visible, false otherwise
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    try {
      await this.passwordTextbox.waitFor({
        state: 'visible',
        timeout: 5000
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get username textbox locator
   * Utility method for accessing username input element
   * @returns Locator for username textbox
   */
  getUsernameTextboxLocator(): Locator {
    return this.usernameTextbox;
  }

  /**
   * Get password textbox locator
   * Utility method for accessing password input element
   * @returns Locator for password textbox
   */
  getPasswordTextboxLocator(): Locator {
    return this.passwordTextbox;
  }

  /**
   * Get username next button locator
   * Utility method for accessing username next button element
   * @returns Locator for username next button
   */
  getUsernameNextButtonLocator(): Locator {
    return this.usernameNextButton;
  }

  /**
   * Get password next button locator
   * Utility method for accessing password next button element
   * @returns Locator for password next button
   */
  getPasswordNextButtonLocator(): Locator {
    return this.passwordNextButton;
  }
}
