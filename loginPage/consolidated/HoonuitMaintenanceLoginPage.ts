import { Page } from '@playwright/test';

/**
 * HoonuitMaintenanceLoginPage - Consolidated Maintenance Portal Login Page
 * 
 * Handles authentication for the Hoonuit maintenance/admin portal.
 * Supports both direct login and SSO domain selection.
 * 
 * Merged from: hoonuit-maintenance-login.page.ts and HoonuitMaintenanceLoginPage.ts
 * 
 * @author Consolidated from dinesh's original implementation
 * @since 4/26/2021 (original), consolidated 2024
 */
export class HoonuitMaintenanceLoginPage {
    
    // ============================================
    // LOCATORS - Maintenance Login Form Elements
    // ============================================
    
    /** Username input field */
    private static readonly USERNAME_TEXTBOX = '#user';
    
    /** Password input field */
    private static readonly PASSWORD_TEXTBOX = '#pass';
    
    /** Submit/Login button */
    private static readonly SUBMIT_BUTTON = '#btnSubmit';
    
    /** SSO domain dropdown selector */
    private static readonly DOMAIN_DROPDOWN = '#authdomain';
    
    /** SSO domain login button */
    private static readonly DOMAIN_LOGIN_BUTTON = '#btnLogon';
    
    /** Single Sign On (SSO) link */
    private static readonly SSO_BUTTON = 'a:has-text("Single Sign On (SSO)")';
    
    /** Alternative SSO button selector using getByText pattern */
    private static readonly SSO_BUTTON_ALT = 'text=Single Sign On (SSO)';

    // ============================================
    // TIMEOUT CONSTANTS
    // ============================================
    
    /** Default timeout for element visibility */
    private static readonly DEFAULT_TIMEOUT = 10000;

    /**
     * Creates an instance of HoonuitMaintenanceLoginPage.
     * @param page - The Playwright Page object
     */
    constructor(private readonly page: Page) {}

    // ============================================
    // DIRECT LOGIN METHODS
    // ============================================

    /**
     * Set the username in the maintenance login form.
     * 
     * @param username - The username to enter
     * @throws {Error} If the username field is not visible within timeout
     */
    async setUsername(username: string): Promise<void> {
        const usernameField = this.page.locator(HoonuitMaintenanceLoginPage.USERNAME_TEXTBOX);
        await usernameField.waitFor({ 
            state: 'visible', 
            timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
        });
        await usernameField.fill(username);
    }

    /**
     * Set the password in the maintenance login form.
     * 
     * @param password - The password to enter
     * @throws {Error} If the password field is not visible within timeout
     */
    async setPassword(password: string): Promise<void> {
        const passwordField = this.page.locator(HoonuitMaintenanceLoginPage.PASSWORD_TEXTBOX);
        await passwordField.waitFor({ 
            state: 'visible', 
            timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
        });
        await passwordField.fill(password);
    }

    /**
     * Click the submit button to complete login.
     * 
     * @throws {Error} If the submit button is not visible within timeout
     */
    async clickSubmit(): Promise<void> {
        const submitButton = this.page.locator(HoonuitMaintenanceLoginPage.SUBMIT_BUTTON);
        await submitButton.waitFor({ 
            state: 'visible', 
            timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
        });
        await submitButton.click();
    }

    /**
     * Perform direct login with username and password.
     * 
     * @param username - The username to login with
     * @param password - The password to login with
     * @throws {Error} If any step in the login flow fails
     */
    async login(username: string, password: string): Promise<void> {
        await this.setUsername(username);
        await this.setPassword(password);
        await this.clickSubmit();
    }

    // ============================================
    // SSO LOGIN METHODS
    // ============================================

    /**
     * Click the "Single Sign On (SSO)" link to switch to SSO login mode.
     * 
     * @throws {Error} If the SSO link is not visible within timeout
     */
    async clickOnSingleSignOn(): Promise<void> {
        // Try primary selector first, fall back to alternative
        let ssoButton = this.page.locator(HoonuitMaintenanceLoginPage.SSO_BUTTON);
        
        try {
            await ssoButton.waitFor({ 
                state: 'visible', 
                timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
        } catch {
            // Try alternative selector
            ssoButton = this.page.locator(HoonuitMaintenanceLoginPage.SSO_BUTTON_ALT);
            await ssoButton.waitFor({ 
                state: 'visible', 
                timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
            });
        }
        
        await ssoButton.click();
    }

    /**
     * Select an SSO domain from the dropdown.
     * 
     * @param domainName - The domain name to select (visible text)
     * @throws {Error} If the dropdown is not visible within timeout
     */
    async setDomain(domainName: string): Promise<void> {
        const dropdown = this.page.locator(HoonuitMaintenanceLoginPage.DOMAIN_DROPDOWN);
        await dropdown.waitFor({ 
            state: 'visible', 
            timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
        });
        await dropdown.selectOption({ label: domainName });
    }

    /**
     * Select an SSO domain from the dropdown by value.
     * 
     * @param domainValue - The domain value to select
     * @throws {Error} If the dropdown is not visible within timeout
     */
    async setDomainByValue(domainValue: string): Promise<void> {
        const dropdown = this.page.locator(HoonuitMaintenanceLoginPage.DOMAIN_DROPDOWN);
        await dropdown.waitFor({ 
            state: 'visible', 
            timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
        });
        await dropdown.selectOption({ value: domainValue });
    }

    /**
     * Click the SSO login button after selecting a domain.
     * 
     * @throws {Error} If the login button is not visible within timeout
     */
    async clickOnSsoLoginButton(): Promise<void> {
        const ssoLoginButton = this.page.locator(HoonuitMaintenanceLoginPage.DOMAIN_LOGIN_BUTTON);
        await ssoLoginButton.waitFor({ 
            state: 'visible', 
            timeout: HoonuitMaintenanceLoginPage.DEFAULT_TIMEOUT 
        });
        await ssoLoginButton.click();
    }

    /**
     * Perform SSO login by selecting a domain and clicking login.
     * Assumes SSO mode is already active.
     * 
     * @param domainName - The domain name to select
     * @throws {Error} If any step in the SSO login flow fails
     */
    async loginWithSso(domainName: string): Promise<void> {
        await this.setDomain(domainName);
        await this.clickOnSsoLoginButton();
    }

    /**
     * Perform complete SSO login flow: click SSO link, select domain, and login.
     * 
     * @param domainName - The domain name to select
     * @throws {Error} If any step in the SSO login flow fails
     */
    async performSsoLogin(domainName: string): Promise<void> {
        await this.clickOnSingleSignOn();
        await this.setDomain(domainName);
        await this.clickOnSsoLoginButton();
    }

    // ============================================
    // STATIC METHODS (Backward Compatibility)
    // ============================================

    /**
     * Static method to set domain - provides backward compatibility
     * with the original HoonuitMaintenanceLoginPage.ts implementation.
     * 
     * @param page - The Playwright Page object
     * @param domainName - The domain name to select
     * @deprecated Use instance method setDomain() instead
     */
    static async setDomainStatic(page: Page, domainName: string): Promise<void> {
        const dropdown = page.locator(HoonuitMaintenanceLoginPage.DOMAIN_DROPDOWN);
        await dropdown.waitFor({ state: 'visible' });
        await dropdown.selectOption({ label: domainName });
    }

    /**
     * Static method to click SSO link - provides backward compatibility
     * with the original HoonuitMaintenanceLoginPage.ts implementation.
     * 
     * @param page - The Playwright Page object
     * @deprecated Use instance method clickOnSingleSignOn() instead
     */
    static async clickOnSingleSignOnStatic(page: Page): Promise<void> {
        const ssoButton = page.locator(HoonuitMaintenanceLoginPage.SSO_BUTTON);
        await ssoButton.waitFor({ state: 'visible' });
        await ssoButton.click();
    }

    /**
     * Static method to click SSO login button - provides backward compatibility
     * with the original HoonuitMaintenanceLoginPage.ts implementation.
     * 
     * @param page - The Playwright Page object
     * @deprecated Use instance method clickOnSsoLoginButton() instead
     */
    static async clickOnSsoLoginButtonStatic(page: Page): Promise<void> {
        const ssoLoginButton = page.locator(HoonuitMaintenanceLoginPage.DOMAIN_LOGIN_BUTTON);
        await ssoLoginButton.waitFor({ state: 'visible' });
        await ssoLoginButton.click();
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Check if the maintenance login page is displayed.
     * 
     * @param timeout - Optional timeout in milliseconds (default: 10000)
     * @returns True if the username field is visible, false otherwise
     */
    async isMaintenanceLoginPageDisplayed(timeout: number = 10000): Promise<boolean> {
        try {
            const usernameField = this.page.locator(HoonuitMaintenanceLoginPage.USERNAME_TEXTBOX);
            await usernameField.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if SSO mode is active (domain dropdown visible).
     * 
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if the domain dropdown is visible, false otherwise
     */
    async isSsoModeActive(timeout: number = 5000): Promise<boolean> {
        try {
            const dropdown = this.page.locator(HoonuitMaintenanceLoginPage.DOMAIN_DROPDOWN);
            await dropdown.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get available SSO domains from the dropdown.
     * 
     * @returns Array of domain names available in the dropdown
     */
    async getAvailableDomains(): Promise<string[]> {
        const dropdown = this.page.locator(HoonuitMaintenanceLoginPage.DOMAIN_DROPDOWN);
        await dropdown.waitFor({ state: 'visible' });
        
        const options = await dropdown.locator('option').allTextContents();
        return options.filter(text => text.trim().length > 0);
    }
}

// Default export for backward compatibility
export default HoonuitMaintenanceLoginPage;