import { Page, Locator, expect } from '@playwright/test';

/**
 * Playwright/TypeScript version of MicrosoftLoginPage (converted from Java)
 * Page object for Microsoft authentication login process
 * Handles username/email input, password input, navigation buttons, and "Stay signed in" confirmation
 *
 * @author Ashok Garg (converted from Java to TypeScript/Playwright)
 * @since 10-08-2020
 */
export class MicrosoftLoginPage {
  private page: Page;
  
  // CSS Selectors - converted from Java static final fields
  private static readonly USERNAME_TEXTBOX = "input[type='email']";
  private static readonly USERNAME_NEXT_BUTTON = "input[id^='idSIButton']";
  private static readonly PASSWORD_TEXTBOX = "input[type='password']";
  private static readonly SIGN_IN_BUTTON = "input[id^='idSIButton']";
  private static readonly YES_BUTTON = "input[type='submit']";
  
  // Constants
  private static readonly DEFAULT_TIMEOUT = 10000;
  
  // Locators
  private readonly usernameTextbox: Locator;
  private readonly usernameNextButton: Locator;
  private readonly passwordTextbox: Locator;
  private readonly signInButton: Locator;
  private readonly yesButton: Locator;

  /**
   * Constructor initializes the MicrosoftLoginPage with Playwright Page object
   * @param page The Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.usernameTextbox = page.locator(MicrosoftLoginPage.USERNAME_TEXTBOX);
    this.usernameNextButton = page.locator(MicrosoftLoginPage.USERNAME_NEXT_BUTTON);
    this.passwordTextbox = page.locator(MicrosoftLoginPage.PASSWORD_TEXTBOX);
    this.signInButton = page.locator(MicrosoftLoginPage.SIGN_IN_BUTTON);
    this.yesButton = page.locator(MicrosoftLoginPage.YES_BUTTON);
  }

  /**
   * Set username/email in the Microsoft login form
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
        timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT
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
   * Set password in the Microsoft login form
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
        timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT
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
        timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT
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
   * Click the "Sign In" button after entering password
   * Equivalent to Java clickSignIn() method with Selenide visibility check
   * @throws Error if button is not clickable or click fails
   */
  async clickSignIn(): Promise<void> {
    try {
      // Wait for element to be visible and enabled
      await this.signInButton.waitFor({
        state: 'visible',
        timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT
      });
      
      // Assert element is visible (equivalent to shouldBe(Condition.visible))
      await expect(this.signInButton).toBeVisible();
      await expect(this.signInButton).toBeEnabled();
      
      // Scroll into view if needed and click
      await this.signInButton.scrollIntoViewIfNeeded();
      await this.signInButton.click();
      
    } catch (error) {
      throw new Error(`Failed to click sign in button: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Click the "Yes" button for "Stay signed in" confirmation
   * Equivalent to Java clickYes() method with Selenide visibility check
   * Note: This button may not always be present, so includes conditional logic
   * @throws Error if button click fails when button is present
   */
  async clickYes(): Promise<void> {
    try {
      // Check if the "Yes" button is visible (equivalent to commented isDisplayed() check in Java)
      const isYesButtonVisible = await this.yesButton.isVisible();
      
      if (isYesButtonVisible) {
        // Wait for element to be visible and enabled
        await this.yesButton.waitFor({
          state: 'visible',
          timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT
        });
        
        // Assert element is visible (equivalent to shouldBe(Condition.visible))
        await expect(this.yesButton).toBeVisible();
        await expect(this.yesButton).toBeEnabled();
        
        // Scroll into view if needed and click
        await this.yesButton.scrollIntoViewIfNeeded();
        await this.yesButton.click();
      } else {
        // Button not present - this is acceptable behavior for Microsoft login flow
        console.log('Stay signed in confirmation button not present - continuing');
      }
      
    } catch (error) {
      throw new Error(`Failed to click yes button: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete Microsoft login process with username and password
   * Convenience method that combines all login steps including optional "Stay signed in"
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
      await this.clickSignIn();
      
      // Wait for potential "Stay signed in" page
      await this.page.waitForTimeout(2000);
      
      // Click Yes if the button is present
      await this.clickYes();
      
    } catch (error) {
      throw new Error(`Microsoft login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
   * Check if "Stay signed in" confirmation is visible
   * Utility method for page state validation
   * @returns true if yes button is visible, false otherwise
   */
  async isStaySignedInVisible(): Promise<boolean> {
    try {
      await this.yesButton.waitFor({
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
   * Get sign in button locator
   * Utility method for accessing sign in button element
   * @returns Locator for sign in button
   */
  getSignInButtonLocator(): Locator {
    return this.signInButton;
  }

  /**
   * Get yes button locator
   * Utility method for accessing yes/stay signed in button element
   * @returns Locator for yes button
   */
  getYesButtonLocator(): Locator {
    return this.yesButton;
  }
}
