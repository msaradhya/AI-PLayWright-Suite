import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../../base/hoonuit-sis-base-page';

/**
 * GoogleLoginPage - Consolidated SSO Provider Page
 * 
 * Handles Google OAuth authentication flow.
 * Merged from: google-login-page.ts and GoogleLoginPage.ts
 * 
 * @author Consolidated from dinesh's original implementation
 * @since 7/13/2021 (original), consolidated 2024
 */
export class GoogleLoginPage extends HoonuitSisBasePage {
    
    // ============================================
    // LOCATORS - Google OAuth Form Elements
    // ============================================
    
    /** Google username/email input field - supports multiple selectors for compatibility */
    private static readonly USERNAME_TEXTBOX = 'input[id="identifierId"], input[id="Email"]';
    
    /** Next button after username entry */
    private static readonly USERNAME_NEXT_BUTTON = 'div#identifierNext button, input[id="next"], button#identifierNext';
    
    /** Google password input field - supports multiple selectors */
    private static readonly PASSWORD_TEXTBOX = 'input[name="password"], input[id="password"], input[type="password"]';
    
    /** Next/Submit button after password entry */
    private static readonly PASSWORD_NEXT_BUTTON = 'div#passwordNext button, input[id="submit"], button#passwordNext';
    
    /** "Stay signed in" back button (optional step) */
    private static readonly BACK_BUTTON = '#idBtn_Back';

    // ============================================
    // TIMEOUT CONSTANTS
    // ============================================
    
    /** Timeout for username field visibility */
    private static readonly USERNAME_TIMEOUT = 10000;
    
    /** Timeout for password field attachment (DOM presence) */
    private static readonly PASSWORD_ATTACHED_TIMEOUT = 60000;
    
    /** Timeout for password field visibility */
    private static readonly PASSWORD_VISIBLE_TIMEOUT = 10000;
    
    /** Timeout for button visibility */
    private static readonly BUTTON_TIMEOUT = 10000;

    /**
     * Creates an instance of GoogleLoginPage.
     * @param page - The Playwright Page object
     */
    constructor(page: Page) {
        super(page);
    }

    // ============================================
    // USERNAME METHODS
    // ============================================

    /**
     * Set the username/email in the Google login form.
     * Waits for visibility before filling.
     * 
     * @param username - The Google username or email to enter
     * @throws {Error} If the username field is not visible within timeout
     */
    async setUsername(username: string): Promise<void> {
        const usernameField = this.page.locator(GoogleLoginPage.USERNAME_TEXTBOX);
        await usernameField.waitFor({ 
            state: 'visible', 
            timeout: GoogleLoginPage.USERNAME_TIMEOUT 
        });
        await usernameField.fill(username);
    }

    /**
     * Click the "Next" button after entering the username.
     * 
     * @throws {Error} If the button is not visible within timeout
     */
    async clickUserNameNext(): Promise<void> {
        const usernameNextButton = this.page.locator(GoogleLoginPage.USERNAME_NEXT_BUTTON);
        await usernameNextButton.waitFor({ 
            state: 'visible', 
            timeout: GoogleLoginPage.BUTTON_TIMEOUT 
        });
        await usernameNextButton.click();
    }

    // ============================================
    // PASSWORD METHODS
    // ============================================

    /**
     * Set the password in the Google login form.
     * Uses two-phase wait: first for DOM attachment, then for visibility.
     * This handles Google's async password field rendering.
     * 
     * @param password - The password to enter
     * @throws {Error} If the password field is not available within timeout
     */
    async setPassword(password: string): Promise<void> {
        const passwordField = this.page.locator(GoogleLoginPage.PASSWORD_TEXTBOX);
        
        // Phase 1: Wait for element to be attached to DOM (handles async rendering)
        await passwordField.waitFor({ 
            state: 'attached', 
            timeout: GoogleLoginPage.PASSWORD_ATTACHED_TIMEOUT 
        });
        
        // Phase 2: Wait for element to be visible
        await passwordField.waitFor({ 
            state: 'visible', 
            timeout: GoogleLoginPage.PASSWORD_VISIBLE_TIMEOUT 
        });
        
        await passwordField.fill(password);
    }

    /**
     * Click the "Next" button after entering the password.
     * 
     * @throws {Error} If the button is not visible within timeout
     */
    async clickPasswordNext(): Promise<void> {
        const passwordNextButton = this.page.locator(GoogleLoginPage.PASSWORD_NEXT_BUTTON);
        await passwordNextButton.waitFor({ 
            state: 'visible', 
            timeout: GoogleLoginPage.BUTTON_TIMEOUT 
        });
        await passwordNextButton.click();
    }

    // ============================================
    // OPTIONAL STEP HANDLERS
    // ============================================

    /**
     * Handle the "Stay signed in" prompt by clicking the back button.
     * This is an optional step that may appear after password entry.
     * 
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if the button was found and clicked, false otherwise
     */
    async handleStaySignedInPrompt(timeout: number = 5000): Promise<boolean> {
        try {
            const backButton = this.page.locator(GoogleLoginPage.BACK_BUTTON);
            const isVisible = await backButton.isVisible({ timeout });
            
            if (isVisible) {
                await backButton.click();
                return true;
            }
            return false;
        } catch {
            // Button not found within timeout - this is expected in some flows
            return false;
        }
    }

    // ============================================
    // COMPLETE LOGIN FLOW METHODS
    // ============================================

    /**
     * Perform the complete Google login flow.
     * Enters username, clicks next, enters password, clicks next,
     * handles optional "Stay signed in" prompt, and waits for page load.
     * 
     * @param username - The Google username or email
     * @param password - The password
     * @throws {Error} If any step in the login flow fails
     */
    async login(username: string, password: string): Promise<void> {
        await this.setUsername(username);
        await this.clickUserNameNext();
        await this.setPassword(password);
        await this.clickPasswordNext();
        
        // Handle optional "Stay signed in" prompt
        await this.handleStaySignedInPrompt();
        
        // Wait for page to fully load after login
        await this.waitForPageLoad();
    }

    /**
     * Alias for login() method - provides backward compatibility
     * with the original GoogleLoginPage.ts implementation.
     * 
     * @param username - The Google username or email
     * @param password - The password
     * @deprecated Use login() instead
     */
    async loginToGoogle(username: string, password: string): Promise<void> {
        await this.login(username, password);
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Check if the Google login page is displayed.
     * 
     * @param timeout - Optional timeout in milliseconds (default: 10000)
     * @returns True if the username field is visible, false otherwise
     */
    async isGoogleLoginPageDisplayed(timeout: number = 10000): Promise<boolean> {
        try {
            const usernameField = this.page.locator(GoogleLoginPage.USERNAME_TEXTBOX);
            await usernameField.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if password step is displayed (after username entry).
     * 
     * @param timeout - Optional timeout in milliseconds (default: 10000)
     * @returns True if the password field is visible, false otherwise
     */
    async isPasswordStepDisplayed(timeout: number = 10000): Promise<boolean> {
        try {
            const passwordField = this.page.locator(GoogleLoginPage.PASSWORD_TEXTBOX);
            await passwordField.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }
}

// Default export for backward compatibility
export default GoogleLoginPage;