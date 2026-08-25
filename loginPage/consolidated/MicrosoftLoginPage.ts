import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../../base/hoonuit-sis-base-page';

/**
 * MicrosoftLoginPage - Consolidated SSO Provider Page
 * 
 * Handles Microsoft OAuth/Azure AD authentication flow.
 * Merged from: microsoft-login-page.ts and MicrosoftLoginPage.ts
 * 
 * @author Consolidated from dinesh's original implementation
 * @since 7/13/2021 (original), consolidated 2024
 */
export class MicrosoftLoginPage extends HoonuitSisBasePage {
    
    // ============================================
    // LOCATORS - Microsoft OAuth Form Elements
    // ============================================
    
    /** Microsoft username/email input field */
    private static readonly USERNAME_TEXTBOX = "input[type='email']";
    
    /** Next button after username entry */
    private static readonly USERNAME_NEXT_BUTTON = "input[id^='idSIButton']";
    
    /** Microsoft password input field */
    private static readonly PASSWORD_TEXTBOX = "input[type='password']";
    
    /** Sign in button after password entry */
    private static readonly SIGN_IN_BUTTON = "input[id^='idSIButton']";
    
    /** "Stay signed in" Yes button */
    private static readonly YES_BUTTON = "input[type='submit']";
    
    /** "Stay signed in" No button */
    private static readonly NO_BUTTON = "input[id='idBtn_Back']";

    // ============================================
    // TIMEOUT CONSTANTS
    // ============================================
    
    /** Default timeout for element visibility */
    private static readonly DEFAULT_TIMEOUT = 10000;
    
    /** Extended timeout for slower network conditions */
    private static readonly EXTENDED_TIMEOUT = 30000;

    /**
     * Creates an instance of MicrosoftLoginPage.
     * @param page - The Playwright Page object
     */
    constructor(page: Page) {
        super(page);
    }

    // ============================================
    // USERNAME METHODS
    // ============================================

    /**
     * Set the username/email in the Microsoft login form.
     * Waits for visibility before filling.
     * 
     * @param username - The Microsoft username or email to enter
     * @throws {Error} If the username field is not visible within timeout
     */
    async setUsername(username: string): Promise<void> {
        const usernameField = this.page.locator(MicrosoftLoginPage.USERNAME_TEXTBOX);
        await usernameField.waitFor({ 
            state: 'visible', 
            timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT 
        });
        await usernameField.fill(username);
    }

    /**
     * Click the "Next" button after entering the username.
     * 
     * @throws {Error} If the button is not visible within timeout
     */
    async clickUserNameNext(): Promise<void> {
        const nextButton = this.page.locator(MicrosoftLoginPage.USERNAME_NEXT_BUTTON);
        await nextButton.waitFor({ 
            state: 'visible', 
            timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT 
        });
        await nextButton.click();
    }

    // ============================================
    // PASSWORD METHODS
    // ============================================

    /**
     * Set the password in the Microsoft login form.
     * Waits for visibility before filling.
     * 
     * @param password - The password to enter
     * @throws {Error} If the password field is not visible within timeout
     */
    async setPassword(password: string): Promise<void> {
        const passwordField = this.page.locator(MicrosoftLoginPage.PASSWORD_TEXTBOX);
        await passwordField.waitFor({ 
            state: 'visible', 
            timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT 
        });
        await passwordField.fill(password);
    }

    /**
     * Click the "Sign in" button after entering the password.
     * 
     * @throws {Error} If the button is not visible within timeout
     */
    async clickSignIn(): Promise<void> {
        const signInButton = this.page.locator(MicrosoftLoginPage.SIGN_IN_BUTTON);
        await signInButton.waitFor({ 
            state: 'visible', 
            timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT 
        });
        await signInButton.click();
    }

    // ============================================
    // STAY SIGNED IN PROMPT METHODS
    // ============================================

    /**
     * Click the "Yes" button on the "Stay signed in?" prompt.
     * 
     * @throws {Error} If the button is not visible within timeout
     */
    async clickYes(): Promise<void> {
        const yesButton = this.page.locator(MicrosoftLoginPage.YES_BUTTON);
        await yesButton.waitFor({ 
            state: 'visible', 
            timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT 
        });
        await yesButton.click();
    }

    /**
     * Click the "No" button on the "Stay signed in?" prompt.
     * 
     * @throws {Error} If the button is not visible within timeout
     */
    async clickNo(): Promise<void> {
        const noButton = this.page.locator(MicrosoftLoginPage.NO_BUTTON);
        await noButton.waitFor({ 
            state: 'visible', 
            timeout: MicrosoftLoginPage.DEFAULT_TIMEOUT 
        });
        await noButton.click();
    }

    /**
     * Handle the "Stay signed in?" prompt.
     * Waits for the prompt and clicks the specified option.
     * 
     * @param staySignedIn - Whether to stay signed in (true = Yes, false = No)
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if the prompt was handled, false if not found
     */
    async handleStaySignedInPrompt(staySignedIn: boolean = false, timeout: number = 5000): Promise<boolean> {
        try {
            const yesButton = this.page.locator(MicrosoftLoginPage.YES_BUTTON);
            const isVisible = await yesButton.isVisible({ timeout });
            
            if (isVisible) {
                if (staySignedIn) {
                    await this.clickYes();
                } else {
                    await this.clickNo();
                }
                return true;
            }
            return false;
        } catch {
            // Prompt not found within timeout - this is expected in some flows
            return false;
        }
    }

    // ============================================
    // COMPLETE LOGIN FLOW METHODS
    // ============================================

    /**
     * Perform the complete Microsoft login flow.
     * Enters username, clicks next, enters password, clicks sign in,
     * and waits for page load.
     * 
     * @param username - The Microsoft username or email
     * @param password - The password
     * @param handleStaySignedIn - Whether to handle the "Stay signed in?" prompt (default: true)
     * @param staySignedIn - If handling prompt, whether to stay signed in (default: false)
     * @throws {Error} If any step in the login flow fails
     */
    async login(username: string, password: string, handleStaySignedIn: boolean = true, staySignedIn: boolean = false): Promise<void> {
        await this.setUsername(username);
        await this.clickUserNameNext();
        await this.setPassword(password);
        await this.clickSignIn();
        
        // Handle optional "Stay signed in?" prompt
        if (handleStaySignedIn) {
            await this.handleStaySignedInPrompt(staySignedIn);
        }
        
        // Wait for page to fully load after login
        await this.waitForPageLoad();
    }

    /**
     * Perform basic Microsoft login without handling the "Stay signed in?" prompt.
     * Use this when you want to handle the prompt separately.
     * 
     * @param username - The Microsoft username or email
     * @param password - The password
     */
    async loginBasic(username: string, password: string): Promise<void> {
        await this.setUsername(username);
        await this.clickUserNameNext();
        await this.setPassword(password);
        await this.clickSignIn();
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Check if the Microsoft login page is displayed.
     * 
     * @param timeout - Optional timeout in milliseconds (default: 10000)
     * @returns True if the username field is visible, false otherwise
     */
    async isMicrosoftLoginPageDisplayed(timeout: number = 10000): Promise<boolean> {
        try {
            const usernameField = this.page.locator(MicrosoftLoginPage.USERNAME_TEXTBOX);
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
            const passwordField = this.page.locator(MicrosoftLoginPage.PASSWORD_TEXTBOX);
            await passwordField.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if the "Stay signed in?" prompt is displayed.
     * 
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if the Yes button is visible, false otherwise
     */
    async isStaySignedInPromptDisplayed(timeout: number = 5000): Promise<boolean> {
        try {
            const yesButton = this.page.locator(MicrosoftLoginPage.YES_BUTTON);
            await yesButton.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }
}

// Default export for backward compatibility
export default MicrosoftLoginPage;