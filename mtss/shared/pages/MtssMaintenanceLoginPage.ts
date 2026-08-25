/**
 * Playwright/TypeScript version of MtssMaintenanceLoginPage (converted from Java)
 * Page object for MTSS Maintenance Login functionality with complete method coverage 
 * matching the Java source implementation.
 *
 * This implementation provides:
 * - Complete selector mapping from Java Selenide to Playwright
 * - All methods from the original Java class with proper async/await patterns
 * - Proper TypeScript interfaces and error handling
 * - Consistent wait strategies and element interaction patterns
 * - Enhanced support for Playwright test framework
 * - Extends MtssBasePage for common functionality
 *
 * ========================================
 * COMPLETE FEATURE COVERAGE:
 * ========================================
 *
 * 🔐 LOGIN FUNCTIONALITY:
 * - setUsername() - Set username in login field with visibility checks
 * - setPassword() - Set password in login field with visibility checks
 * - clickSubmit() - Click submit/login button with visibility checks
 * - login() - Complete login workflow
 *
 * 🌐 DOMAIN FUNCTIONALITY:
 * - setDomain() - Select domain from dropdown (static method)
 * - clickOnSsoLoginButton() - Click SSO login button (static method)
 *
 * 🔗 SSO FUNCTIONALITY:
 * - clickOnSingleSignOn() - Click Single Sign On link (static method)
 *
 * 🎯 ELEMENT INTERACTIONS:
 * - Robust element waiting strategies matching Java shouldBe(Condition.visible)
 * - Visibility checks before interactions
 * - Proper error handling and timeouts
 * - Cross-browser compatibility
 *
 * 🔍 VALIDATION METHODS:
 * - isLoginFormVisible() - Check if login form is displayed
 * - isSubmitButtonEnabled() - Check submit button state
 * - isDomainDropdownVisible() - Check domain dropdown visibility
 * - isSsoButtonVisible() - Check SSO button visibility
 *
 * ========================================
 * TECHNICAL IMPLEMENTATION DETAILS:
 * ========================================
 *
 * 🏗️ ARCHITECTURE:
 * - Extends MtssBasePage for common functionality
 * - Uses Playwright locator strategies for element selection
 * - Implements proper async/await patterns throughout
 * - Provides comprehensive error handling and timeout management
 * - Matches Java static method patterns where applicable
 *
 * 🎛️ SELECTOR STRATEGY:
 * - CSS selectors optimized for Playwright
 * - Consistent naming convention matching Java source exactly
 * - Robust element identification using ID selectors
 * - Support for partial link text matching (SSO button)
 *
 * ⏱️ WAIT STRATEGIES:
 * - Element visibility waiting before interactions (matching Java shouldBe)
 * - Proper timeout management (10 seconds default)
 * - MtssHelper integration for page loading
 * - Spinner and loading state handling
 *
 * 🔧 HELPER METHODS:
 * - Comprehensive element interaction patterns
 * - State validation and verification methods
 * - Cross-browser compatibility considerations
 * - Integration with MtssHelper utilities
 *
 * 📝 TESTING SUPPORT:
 * - Full Playwright Test framework integration
 * - Comprehensive method coverage for all login workflows
 * - Detailed error reporting and debugging support
 * - Parameterized methods for flexible test scenarios
 *
 * @example
 * ```typescript
 * // Basic login example
 * const maintenanceLoginPage = new MtssMaintenanceLoginPage(page);
 * await maintenanceLoginPage.waitForPage();
 * await maintenanceLoginPage.setUsername('admin');
 * await maintenanceLoginPage.setPassword('password');
 * await maintenanceLoginPage.clickSubmit();
 *
 * // Complete login workflow
 * await maintenanceLoginPage.login('admin', 'password');
 *
 * // Domain login example
 * await MtssMaintenanceLoginPage.setDomain('TestDomain');
 * await MtssMaintenanceLoginPage.clickOnSsoLoginButton();
 *
 * // SSO login example
 * await MtssMaintenanceLoginPage.clickOnSingleSignOn();
 *
 * // Validation examples
 * const isFormVisible = await maintenanceLoginPage.isLoginFormVisible();
 * const isButtonEnabled = await maintenanceLoginPage.isSubmitButtonEnabled();
 * const isDomainVisible = await maintenanceLoginPage.isDomainDropdownVisible();
 * ```
 *
 * @author Converted from Java to TypeScript/Playwright
 * @since 2025
 * @version 1.0.0
 * @see MtssBasePage for inherited functionality
 * @see MtssHelper for page loading utilities
 */

import { Page, Locator, expect } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';
import { MtssHelper } from '../helpers/MtssHelper';

// ========================================
// INTERFACES AND TYPES
// ========================================

/**
 * Interface for maintenance login credentials
 */
export interface MaintenanceLoginCredentials {
    username: string;
    password: string;
    domain?: string;
}

/**
 * Main MtssMaintenanceLoginPage class extending MtssBasePage
 * Provides complete functionality for MTSS Maintenance Login page interactions
 */
export class MtssMaintenanceLoginPage extends MtssBasePage {

    // ========================================
    // CSS SELECTORS - CONVERTED FROM JAVA (EXACT MATCH)
    // ========================================
    
    // Core Login Form Selectors (converted from Java By selectors)
    private static readonly USERNAME_TEXTBOX = '#user';
    private static readonly PASSWORD_TEXTBOX = '#pass';
    private static readonly SUBMIT_BUTTON = '#btnSubmit';
    private static readonly DOMAIN_DROPDOWN = '#authdomain';
    private static readonly DOMAIN_LOGIN_BUTTON = '#btnLogon';
    // Fixed: Using partial link text match for SSO button (matching Java By.partialLinkText)
    private static readonly SSO_BUTTON = 'a[href*="sso"], a:has-text("Single Sign On"), a:has-text("SSO")';
    
    // Additional selectors for enhanced functionality
    private static readonly LOGIN_FORM = 'form, .login-form, .auth-form, .maintenance-login-form';
    private static readonly ERROR_MESSAGE = '.error-message, .alert-danger, .validation-error, .login-error';
    private static readonly LOADING_INDICATOR = '.spinner, .loading, .progress-indicator';
    private static readonly LOGIN_CONTAINER = '.login-container, .auth-container, .login-wrapper, .maintenance-login';

    // ========================================
    // STRING CONSTANTS
    // ========================================
    
    private static readonly DEFAULT_TIMEOUT = 10000;
    private static readonly EXTENDED_TIMEOUT = 30000;
    private static readonly MAINTENANCE_LOGIN_PAGE_TITLE = 'Maintenance Login';

    // ========================================
    // LOCATOR PROPERTIES
    // ========================================
    
    private readonly usernameTextbox: Locator;
    private readonly passwordTextbox: Locator;
    private readonly submitButton: Locator;
    private readonly domainDropdown: Locator;
    private readonly domainLoginButton: Locator;
    private readonly ssoButton: Locator;
    private readonly loginForm: Locator;
    private readonly errorMessage: Locator;
    private readonly loadingIndicator: Locator;

    // ========================================
    // CONSTRUCTOR
    // ========================================
    
    constructor(page: Page) {
        super(page);
        
        // Initialize locators for better performance and reusability
        this.usernameTextbox = this.page.locator(MtssMaintenanceLoginPage.USERNAME_TEXTBOX);
        this.passwordTextbox = this.page.locator(MtssMaintenanceLoginPage.PASSWORD_TEXTBOX);
        this.submitButton = this.page.locator(MtssMaintenanceLoginPage.SUBMIT_BUTTON);
        this.domainDropdown = this.page.locator(MtssMaintenanceLoginPage.DOMAIN_DROPDOWN);
        this.domainLoginButton = this.page.locator(MtssMaintenanceLoginPage.DOMAIN_LOGIN_BUTTON);
        this.ssoButton = this.page.locator(MtssMaintenanceLoginPage.SSO_BUTTON);
        this.loginForm = this.page.locator(MtssMaintenanceLoginPage.LOGIN_FORM);
        this.errorMessage = this.page.locator(MtssMaintenanceLoginPage.ERROR_MESSAGE);
        this.loadingIndicator = this.page.locator(MtssMaintenanceLoginPage.LOADING_INDICATOR);
    }

    /**
     * Returns the expected page title for validation
     * Implements abstract method from MtssBasePage
     * @returns The page title string
     */
    protected pageTitle(): string | null {
        return MtssMaintenanceLoginPage.MAINTENANCE_LOGIN_PAGE_TITLE;
    }

    // ========================================
    // CORE LOGIN METHODS - CONVERTED FROM JAVA (EXACT MATCH)
    // ========================================

    /**
     * Set username in the username textbox
     * Converted from Java setUsername method with enhanced error handling
     * Matches Java: $(USERNAME_TEXTBOX).shouldBe(Condition.visible).setValue(username)
     * @param username The username to enter
     */
    async setUsername(username: string): Promise<void> {
        try {
            // Wait for element to be visible (equivalent to Java shouldBe(Condition.visible))
            await this.usernameTextbox.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            // Ensure element is ready for interaction (equivalent to Java shouldBe(Condition.visible))
            await expect(this.usernameTextbox).toBeVisible();
            
            // Clear any existing value and set new username (equivalent to Java setValue)
            await this.usernameTextbox.clear();
            await this.usernameTextbox.fill(username);
            
            // Verify the value was set correctly
            await expect(this.usernameTextbox).toHaveValue(username);
            
        } catch (error) {
            throw new Error(`Failed to set username: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Set password in the password textbox
     * Converted from Java setPassword method with enhanced error handling
     * Matches Java: $(PASSWORD_TEXTBOX).shouldBe(Condition.visible).setValue(password)
     * @param password The password to enter
     */
    async setPassword(password: string): Promise<void> {
        try {
            // Wait for element to be visible and ready (equivalent to Java shouldBe(Condition.visible))
            await this.passwordTextbox.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            await expect(this.passwordTextbox).toBeVisible();
            
            // Clear any existing value and set new password (equivalent to Java setValue)
            await this.passwordTextbox.clear();
            await this.passwordTextbox.fill(password);
            
            // Verify the password field has content (without exposing actual password)
            const value = await this.passwordTextbox.inputValue();
            if (value.length === 0) {
                throw new Error('Password was not set correctly');
            }
            
        } catch (error) {
            throw new Error(`Failed to set password: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Click the submit/login button
     * Converted from Java clickSubmit method with enhanced error handling
     * Matches Java: $(SUBMIT_BUTTON).shouldBe(Condition.visible).click()
     */
    async clickSubmit(): Promise<void> {
        try {
            // Ensure submit button is visible and enabled (equivalent to Java shouldBe(Condition.visible))
            await this.submitButton.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            await expect(this.submitButton).toBeVisible();
            await expect(this.submitButton).toBeEnabled();
            
            // Click the submit button (equivalent to Java click())
            await this.submitButton.click();
            
            // Wait for page transition or loading to complete
            await this.waitForPageToLoad();
            
        } catch (error) {
            throw new Error(`Failed to click submit button: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Set domain from dropdown (Static method to match Java implementation)
     * Converted from Java static setDomain method
     * Matches Java: $(DOMAIN_DROPDOWN).selectOption(domainName)
     * @param domainName The domain name to select
     */
    static async setDomain(page: Page, domainName: string): Promise<void> {
        try {
            const domainDropdown = page.locator(MtssMaintenanceLoginPage.DOMAIN_DROPDOWN);
            
            // Wait for dropdown to be visible
            await domainDropdown.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            await expect(domainDropdown).toBeVisible();
            
            // Select the domain option (equivalent to Java selectOption)
            await domainDropdown.selectOption(domainName);
            
        } catch (error) {
            throw new Error(`Failed to set domain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Click on Single Sign On button (Static method to match Java implementation)
     * Converted from Java static clickOnSingleSignOn method
     * Matches Java: $(SSO_BUTTON).shouldBe(Condition.visible).click()
     */
    static async clickOnSingleSignOn(page: Page): Promise<void> {
        try {
            const ssoButton = page.locator(MtssMaintenanceLoginPage.SSO_BUTTON);
            
            // Wait for SSO button to be visible (equivalent to Java shouldBe(Condition.visible))
            await ssoButton.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            await expect(ssoButton).toBeVisible();
            
            // Click the SSO button (equivalent to Java click())
            await ssoButton.click();
            
        } catch (error) {
            throw new Error(`Failed to click Single Sign On button: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Click on SSO login button (Static method to match Java implementation)
     * Converted from Java static clickOnSsoLoginButton method
     * Matches Java: $(DOMAIN_LOGIN_BUTTON).shouldBe(Condition.visible).click()
     */
    static async clickOnSsoLoginButton(page: Page): Promise<void> {
        try {
            const domainLoginButton = page.locator(MtssMaintenanceLoginPage.DOMAIN_LOGIN_BUTTON);
            
            // Wait for domain login button to be visible (equivalent to Java shouldBe(Condition.visible))
            await domainLoginButton.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            await expect(domainLoginButton).toBeVisible();
            
            // Click the domain login button (equivalent to Java click())
            await domainLoginButton.click();
            
        } catch (error) {
            throw new Error(`Failed to click SSO login button: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // ========================================
    // ENHANCED LOGIN METHODS (INSTANCE VERSIONS)
    // ========================================

    /**
     * Set domain from dropdown (Instance method for convenience)
     * @param domainName The domain name to select
     */
    async setDomain(domainName: string): Promise<void> {
        await MtssMaintenanceLoginPage.setDomain(this.page, domainName);
    }

    /**
     * Click on Single Sign On button (Instance method for convenience)
     */
    async clickOnSingleSignOn(): Promise<void> {
        await MtssMaintenanceLoginPage.clickOnSingleSignOn(this.page);
    }

    /**
     * Click on SSO login button (Instance method for convenience)
     */
    async clickOnSsoLoginButton(): Promise<void> {
        await MtssMaintenanceLoginPage.clickOnSsoLoginButton(this.page);
    }

    /**
     * Complete login workflow with username and password
     * Enhanced method not present in Java source but following consistent patterns
     * @param username The username to enter
     * @param password The password to enter
     */
    async login(username: string, password: string): Promise<void> {
        try {
            // Wait for login page to be ready
            await this.waitForPage();
            
            // Perform login steps in sequence
            await this.setUsername(username);
            await this.setPassword(password);
            await this.clickSubmit();
            
        } catch (error) {
            throw new Error(`Maintenance login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Login using credentials object
     * Enhanced method for object-based login
     * @param credentials Object containing username, password, and optional domain
     */
    async loginWithCredentials(credentials: MaintenanceLoginCredentials): Promise<void> {
        if (credentials.domain) {
            await this.setDomain(credentials.domain);
        }
        await this.login(credentials.username, credentials.password);
    }

    /**
     * Complete domain login workflow
     * Enhanced method for domain-based authentication
     * @param domainName The domain name to select
     */
    async domainLogin(domainName: string): Promise<void> {
        try {
            await this.waitForPage();
            await this.setDomain(domainName);
            await this.clickOnSsoLoginButton();
        } catch (error) {
            throw new Error(`Domain login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // ========================================
    // VALIDATION AND STATE METHODS
    // ========================================

    /**
     * Check if login form is visible and ready
     * Enhanced validation method following Playwright patterns
     * @returns true if login form is displayed
     */
    async isLoginFormVisible(): Promise<boolean> {
        try {
            await this.usernameTextbox.waitFor({ 
                state: 'visible', 
                timeout: 5000 
            });
            await this.passwordTextbox.waitFor({ 
                state: 'visible', 
                timeout: 5000 
            });
            await this.submitButton.waitFor({ 
                state: 'visible', 
                timeout: 5000 
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if submit button is enabled
     * Enhanced validation method for button state
     * @returns true if submit button is enabled
     */
    async isSubmitButtonEnabled(): Promise<boolean> {
        try {
            await this.submitButton.waitFor({ 
                state: 'visible', 
                timeout: 5000 
            });
            return await this.submitButton.isEnabled();
        } catch {
            return false;
        }
    }

    /**
     * Check if domain dropdown is visible
     * Enhanced validation method for domain dropdown
     * @returns true if domain dropdown is visible
     */
    async isDomainDropdownVisible(): Promise<boolean> {
        try {
            await this.domainDropdown.waitFor({ 
                state: 'visible', 
                timeout: 5000 
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if SSO button is visible
     * Enhanced validation method for SSO button
     * @returns true if SSO button is visible
     */
    async isSsoButtonVisible(): Promise<boolean> {
        try {
            await this.ssoButton.waitFor({ 
                state: 'visible', 
                timeout: 5000 
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get validation/error message if present
     * Enhanced method for error message retrieval
     * @returns Error message text or empty string if none
     */
    async getValidationMessage(): Promise<string> {
        try {
            await this.errorMessage.waitFor({ 
                state: 'visible', 
                timeout: 3000 
            });
            return await this.errorMessage.textContent() || '';
        } catch {
            return '';
        }
    }

    /**
     * Check if username field has focus
     * Enhanced method for field state checking
     * @returns true if username field is focused
     */
    async isUsernameFieldFocused(): Promise<boolean> {
        try {
            const focusedElement = await this.page.evaluate(() => document.activeElement?.id);
            return focusedElement === 'user';
        } catch {
            return false;
        }
    }

    /**
     * Check if password field has focus
     * Enhanced method for field state checking
     * @returns true if password field is focused
     */
    async isPasswordFieldFocused(): Promise<boolean> {
        try {
            const focusedElement = await this.page.evaluate(() => document.activeElement?.id);
            return focusedElement === 'pass';
        } catch {
            return false;
        }
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Wait for page loading to complete
     * Enhanced helper method integrating with MtssHelper
     */
    private async waitForPageToLoad(): Promise<void> {
        try {
            // Use MtssHelper for consistent page loading behavior
            await MtssHelper.waitForPageToLoad(this.page);
            
            // Wait for any loading indicators to disappear
            try {
                await this.loadingIndicator.waitFor({ 
                    state: 'hidden', 
                    timeout: 5000 
                });
            } catch {
                // Loading indicator may not be present, continue
            }
            
        } catch (error) {
            console.warn('Page load timeout, continuing with execution');
        }
    }

    /**
     * Clear all form fields
     * Enhanced helper method for form reset
     */
    async clearForm(): Promise<void> {
        try {
            await this.usernameTextbox.clear();
            await this.passwordTextbox.clear();
        } catch (error) {
            throw new Error(`Failed to clear form: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Focus on username field
     * Enhanced helper method for field focus
     */
    async focusUsernameField(): Promise<void> {
        try {
            await this.usernameTextbox.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            await this.usernameTextbox.focus();
        } catch (error) {
            throw new Error(`Failed to focus username field: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Focus on password field
     * Enhanced helper method for field focus
     */
    async focusPasswordField(): Promise<void> {
        try {
            await this.passwordTextbox.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            await this.passwordTextbox.focus();
        } catch (error) {
            throw new Error(`Failed to focus password field: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get username field value
     * Enhanced helper method for field value retrieval
     * @returns Current username field value
     */
    async getUsernameValue(): Promise<string> {
        try {
            return await this.usernameTextbox.inputValue();
        } catch (error) {
            throw new Error(`Failed to get username value: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if form has validation errors
     * Enhanced helper method for form validation state
     * @returns true if validation errors are present
     */
    async hasValidationErrors(): Promise<boolean> {
        return (await this.getValidationMessage()).length > 0;
    }

    /**
     * Wait for login completion (redirect or success state)
     * Enhanced helper method for login completion detection
     * @param expectedUrl Optional expected URL after login
     * @param timeout Optional timeout in milliseconds
     */
    async waitForLoginCompletion(expectedUrl?: string, timeout: number = 30000): Promise<void> {
        try {
            if (expectedUrl) {
                await this.page.waitForURL(expectedUrl, { timeout });
            } else {
                // Wait for URL change indicating successful login
                await this.page.waitForFunction(() => {
                    return !window.location.href.includes('login');
                }, { timeout });
            }
        } catch (error) {
            throw new Error(`Login completion timeout: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // ========================================
    // ACCESSIBILITY AND UTILITY METHODS
    // ========================================

    /**
     * Get form accessibility information
     * Enhanced method for accessibility testing support
     * @returns Object with accessibility information
     */
    async getAccessibilityInfo(): Promise<{
        usernameLabel: string;
        passwordLabel: string;
        submitLabel: string;
        domainLabel: string;
    }> {
        return {
            usernameLabel: await this.usernameTextbox.getAttribute('aria-label') || 
                          await this.usernameTextbox.getAttribute('placeholder') || 'Username',
            passwordLabel: await this.passwordTextbox.getAttribute('aria-label') || 
                          await this.passwordTextbox.getAttribute('placeholder') || 'Password',
            submitLabel: await this.submitButton.getAttribute('aria-label') || 
                        await this.submitButton.textContent() || 'Submit',
            domainLabel: await this.domainDropdown.getAttribute('aria-label') || 'Domain'
        };
    }

    /**
     * Simulate keyboard navigation through form
     * Enhanced method for keyboard accessibility testing
     */
    async navigateWithKeyboard(): Promise<void> {
        await this.focusUsernameField();
        await this.page.keyboard.press('Tab');
        
        // Verify password field has focus
        const passwordFocused = await this.isPasswordFieldFocused();
        if (!passwordFocused) {
            throw new Error('Password field did not receive focus after Tab');
        }
        
        await this.page.keyboard.press('Tab');
        
        // Verify submit button has focus
        const submitFocused = await this.page.evaluate(() => {
            const activeElement = document.activeElement;
            return activeElement?.id === 'btnSubmit' || activeElement?.tagName === 'BUTTON';
        });
        
        if (!submitFocused) {
            throw new Error('Submit button did not receive focus after Tab');
        }
    }

    /**
     * Submit form using Enter key
     * Enhanced method for keyboard submission
     */
    async submitWithEnter(): Promise<void> {
        await this.passwordTextbox.focus();
        await this.page.keyboard.press('Enter');
        await this.waitForPageToLoad();
    }

    /**
     * Get available domain options
     * Enhanced method to get all available domains
     * @returns Array of domain option values
     */
    async getAvailableDomains(): Promise<string[]> {
        try {
            await this.domainDropdown.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            const options = await this.domainDropdown.locator('option').allTextContents();
            return options.filter(option => option.trim().length > 0);
        } catch (error) {
            throw new Error(`Failed to get available domains: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get currently selected domain
     * Enhanced method to get the currently selected domain
     * @returns Currently selected domain value
     */
    async getSelectedDomain(): Promise<string> {
        try {
            await this.domainDropdown.waitFor({ 
                state: 'visible', 
                timeout: MtssMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
            
            return await this.domainDropdown.inputValue();
        } catch (error) {
            throw new Error(`Failed to get selected domain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
