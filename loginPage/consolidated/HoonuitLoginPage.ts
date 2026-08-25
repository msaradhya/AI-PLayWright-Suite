import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../../base/hoonuit-sis-base-page';
import { ConfigManager } from '../../../../config/ConfigManager';
import { GoogleLoginPage } from './GoogleLoginPage';
import { MicrosoftLoginPage } from './MicrosoftLoginPage';

/**
 * HoonuitLoginPage - Consolidated Main Application Login Page
 * 
 * Unified login page handling all login scenarios:
 * - Standard Hoonuit login (username/password)
 * - Role-based login (Administrator/Teacher)
 * - UU (University) login
 * - Kickboard login
 * - SSO redirects (Google/Microsoft)
 * 
 * Merged from: login-page.ts, LoginPage.ts, and uihn-login-page.ts
 * 
 * @author Consolidated from amittiwari and dinesh's implementations
 * @since 07/04/21 (original), consolidated 2024
 */
export class HoonuitLoginPage extends HoonuitSisBasePage {
    
    // ============================================
    // LOCATORS - Standard Login Form
    // ============================================
    
    /** Standard username input field */
    private static readonly USERNAME_TEXTBOX = '#fieldUsername';
    
    /** Standard password input field */
    private static readonly PASSWORD_TEXTBOX = '#fieldPassword';
    
    /** Standard submit/enter button */
    private static readonly SUBMIT_BUTTON = '#btnEnter';

    // ============================================
    // LOCATORS - Login Type Selection
    // ============================================
    
    /** Sign in as Administrator link */
    private static readonly SIGN_AS_ADMIN = 'text=Sign in as an Administrator';
    
    /** Sign in as Teacher link */
    private static readonly SIGN_AS_TEACHER = 'text=Sign in as a Teacher';
    
    /** Sign in with external credentials link */
    private static readonly SIGN_AS_EXTERNAL = 'text=Sign in here with your external credentials';

    // ============================================
    // LOCATORS - UU (University) Login
    // ============================================
    
    /** UU username input field */
    private static readonly UU_USERNAME_TEXTBOX = '#username';
    
    /** UU login ID button */
    private static readonly UU_LOGIN_ID_BUTTON = '._button-login-id';
    
    /** UU password input field */
    private static readonly UU_PASSWORD_BUTTON = '#password';
    
    /** UU password ID button */
    private static readonly UU_PASSWORD_ID_BUTTON = '._button-login-password';

    // ============================================
    // LOCATORS - Kickboard Login
    // ============================================
    
    /** Kickboard email input field */
    private static readonly KB_EMAIL_TEXTBOX = '#email';
    
    /** Kickboard password input field */
    private static readonly KB_PASSWORD_TEXTBOX = '#password';
    
    /** Kickboard sign in/continue button */
    private static readonly KB_SIGNIN_BUTTON = '#button';

    // ============================================
    // LOCATORS - Google SSO (Embedded)
    // ============================================
    
    /** Google username input field */
    private static readonly GOOGLE_IDENTIFIER_ID = '#identifierId';
    
    /** Google next button after username */
    private static readonly GOOGLE_IDENTIFIER_NEXT = '#identifierNext';
    
    /** Google password input field */
    private static readonly GOOGLE_PASSWORD = '[name="password"]';
    
    /** Google next button after password */
    private static readonly GOOGLE_PASSWORD_NEXT = '#passwordNext';
    
    /** Google back button (Stay signed in prompt) */
    private static readonly GOOGLE_BACK_BUTTON = '#idBtn_Back';

    // ============================================
    // LOCATORS - Microsoft SSO (Embedded)
    // ============================================
    
    /** Microsoft login format input */
    private static readonly MS_LOGIN_FORMAT = '[name="loginfmt"]';
    
    /** Microsoft password input */
    private static readonly MS_PASSWORD = '[name="passwd"]';
    
    /** Microsoft submit button */
    private static readonly MS_SUBMIT_BUTTON = '#idSIButton9';

    // ============================================
    // LOCATORS - Logout
    // ============================================
    
    /** User menu trigger button */
    private static readonly USER_MENU_BUTTON = 'button.pds-user-menu-trigger';
    
    /** Logout link in user menu */
    private static readonly LOGOUT_LINK = 'div.pds-user-menu-theme a#logout';
    
    /** Logout confirmation button */
    private static readonly LOGOUT_CONFIRM = 'input[value="Yes"]';

    // ============================================
    // TIMEOUT CONSTANTS
    // ============================================
    
    /** Default timeout for element visibility */
    private static readonly DEFAULT_TIMEOUT = 10000;
    
    /** Extended timeout for page loads */
    private static readonly PAGE_LOAD_TIMEOUT = 60000;

    /**
     * Creates an instance of HoonuitLoginPage.
     * @param page - The Playwright Page object
     */
    constructor(page: Page) {
        super(page);
    }

    /**
     * Page title for verification (login page typically doesn't have one).
     */
    protected pageTitle(): string {
        return '';
    }

    // ============================================
    // NAVIGATION METHODS
    // ============================================

    /**
     * Navigate to the login page.
     */
    async goto(): Promise<void> {
        const config = ConfigManager.getInstance();
        const baseUrl = config.getBaseUrl();
        await this.page.goto(baseUrl);
        await this.waitForHoonuitPage();
    }

    /**
     * Navigate to a specific login path.
     * @param path - Path to append to base URL
     */
    async gotoPath(path: string): Promise<void> {
        const config = ConfigManager.getInstance();
        const baseUrl = config.getBaseUrl();
        await this.page.goto(`${baseUrl}${path}`);
        await this.waitForHoonuitPage();
    }

    // ============================================
    // STANDARD LOGIN METHODS
    // ============================================

    /**
     * Set username in standard login form.
     * @param username - The username to enter
     */
    async setUsername(username: string): Promise<void> {
        const usernameField = this.page.locator(HoonuitLoginPage.USERNAME_TEXTBOX);
        await usernameField.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await usernameField.fill(username);
    }

    /**
     * Set password in standard login form.
     * @param password - The password to enter
     */
    async setPassword(password: string): Promise<void> {
        const passwordField = this.page.locator(HoonuitLoginPage.PASSWORD_TEXTBOX);
        await passwordField.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await passwordField.fill(password);
    }

    /**
     * Click submit button for standard login.
     */
    async clickSubmit(): Promise<void> {
        const submitButton = this.page.locator(HoonuitLoginPage.SUBMIT_BUTTON);
        await submitButton.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await submitButton.click();
    }

    /**
     * Login with standard credentials (no role selection).
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async loginWithCredentials(username: string, password: string): Promise<void> {
        try {
            await this.setUsername(username);
            await this.setPassword(password);
            await this.clickSubmit();
            await this.waitForHoonuitPage();
        } catch (error) {
            throw new Error(`Failed to login with credentials: ${error}`);
        }
    }

    /**
     * Alias for loginWithCredentials - provides backward compatibility.
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async login(username: string, password: string): Promise<void> {
        await this.loginWithCredentials(username, password);
    }

    // ============================================
    // ROLE-BASED LOGIN METHODS
    // ============================================

    /**
     * Login as Administrator with credentials.
     * @param username - Optional username (will use config if not provided)
     * @param password - Optional password (will use config if not provided)
     */
    async loginAsAdministrator(username?: string, password?: string): Promise<void> {
        try {
            // Get credentials if not provided
            if (!username || !password) {
                const config = ConfigManager.getInstance();
                const credentials = config.getUserCredentials('adminUser');
                username = credentials.username;
                password = credentials.password;
            }

            // Click "Sign in as an Administrator"
            await this.page.click(HoonuitLoginPage.SIGN_AS_ADMIN);
            
            // Enter credentials
            await this.setUsername(username);
            await this.setPassword(password);
            await this.clickSubmit();
            
            await this.waitForHoonuitPage();
        } catch (error) {
            throw new Error(`Failed to login as administrator: ${error}`);
        }
    }

    /**
     * Login as Teacher with credentials.
     * @param username - Optional username (will use config if not provided)
     * @param password - Optional password (will use config if not provided)
     */
    async loginAsTeacher(username?: string, password?: string): Promise<void> {
        try {
            // Get credentials if not provided
            if (!username || !password) {
                const config = ConfigManager.getInstance();
                const credentials = config.getUserCredentials('teacherUser');
                username = credentials.username;
                password = credentials.password;
            }

            // Click "Sign in as a Teacher"
            await this.page.click(HoonuitLoginPage.SIGN_AS_TEACHER);
            
            // Enter credentials
            await this.setUsername(username);
            await this.setPassword(password);
            await this.clickSubmit();
            
            await this.waitForHoonuitPage();
        } catch (error) {
            throw new Error(`Failed to login as teacher: ${error}`);
        }
    }

    /**
     * Click on external credentials login link.
     */
    async clickSignInWithExternalCredentials(): Promise<void> {
        await this.page.click(HoonuitLoginPage.SIGN_AS_EXTERNAL);
    }

    // ============================================
    // UU (UNIVERSITY) LOGIN METHODS
    // ============================================

    /**
     * Set username for UU login.
     * @param username - The UU username to enter
     */
    async setUuUserName(username: string): Promise<void> {
        const uuUsernameField = this.page.locator(HoonuitLoginPage.UU_USERNAME_TEXTBOX);
        await uuUsernameField.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await uuUsernameField.fill(username);
    }

    /**
     * Set password for UU login.
     * @param password - The UU password to enter
     */
    async setUuPassword(password: string): Promise<void> {
        const uuPasswordField = this.page.locator(HoonuitLoginPage.UU_PASSWORD_BUTTON);
        await uuPasswordField.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await uuPasswordField.fill(password);
    }

    /**
     * Click login ID button for UU login.
     * Filters by visible and enabled elements.
     */
    async clickLoginId(): Promise<void> {
        const loginIdButtons = this.page.locator(HoonuitLoginPage.UU_LOGIN_ID_BUTTON);
        const enabledButton = loginIdButtons.filter({ hasNot: this.page.locator('[disabled]') }).first();
        await enabledButton.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await enabledButton.click();
    }

    /**
     * Click password ID button for UU login.
     * Filters by visible and enabled elements.
     */
    async clickPasswordId(): Promise<void> {
        const passIdButtons = this.page.locator(HoonuitLoginPage.UU_PASSWORD_ID_BUTTON);
        const enabledButton = passIdButtons.filter({ hasNot: this.page.locator('[disabled]') }).first();
        await enabledButton.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await enabledButton.click();
    }

    /**
     * Perform complete UU login flow.
     * @param username - The UU username
     * @param password - The UU password
     */
    async loginWithUuCredentials(username: string, password: string): Promise<void> {
        try {
            await this.setUuUserName(username);
            await this.clickLoginId();
            await this.setUuPassword(password);
            await this.clickPasswordId();
            await this.waitForHoonuitPage();
        } catch (error) {
            throw new Error(`Failed to login with UU credentials: ${error}`);
        }
    }

    // ============================================
    // KICKBOARD LOGIN METHODS
    // ============================================

    /**
     * Set Kickboard username/email.
     * @param username - The Kickboard email to enter
     */
    async setKickboardUserName(username: string): Promise<void> {
        const emailField = this.page.locator(HoonuitLoginPage.KB_EMAIL_TEXTBOX);
        await emailField.click();
        await emailField.fill(username);
    }

    /**
     * Set Kickboard password.
     * @param password - The Kickboard password to enter
     */
    async setKickboardPassword(password: string): Promise<void> {
        const passwordField = this.page.locator(HoonuitLoginPage.KB_PASSWORD_TEXTBOX);
        await passwordField.click();
        await passwordField.fill(password);
    }

    /**
     * Click Kickboard sign in button.
     */
    async clickKickboardSignIn(): Promise<void> {
        const signInButton = this.page.locator(HoonuitLoginPage.KB_SIGNIN_BUTTON);
        await signInButton.waitFor({ 
            state: 'visible', 
            timeout: HoonuitLoginPage.DEFAULT_TIMEOUT 
        });
        await signInButton.click();
    }

    /**
     * Perform complete Kickboard login flow.
     * @param username - The Kickboard email
     * @param password - The Kickboard password
     */
    async loginToKickboard(username: string, password: string): Promise<void> {
        try {
            await this.setKickboardUserName(username);
            await this.setKickboardPassword(password);
            await this.clickKickboardSignIn();
            await this.waitForHoonuitPage();
        } catch (error) {
            throw new Error(`Failed to login to Kickboard: ${error}`);
        }
    }

    // ============================================
    // SSO LOGIN METHODS (EMBEDDED)
    // ============================================

    /**
     * Login through Google SSO (embedded flow).
     * For standalone Google login, use GoogleLoginPage instead.
     * @param username - Google username/email
     * @param password - Google password
     */
    async loginThroughGoogleSSO(username: string, password: string): Promise<void> {
        try {
            await this.page.fill(HoonuitLoginPage.GOOGLE_IDENTIFIER_ID, username);
            await this.page.click(HoonuitLoginPage.GOOGLE_IDENTIFIER_NEXT);
            
            await this.page.waitForSelector(HoonuitLoginPage.GOOGLE_PASSWORD, { state: 'visible' });
            await this.page.fill(HoonuitLoginPage.GOOGLE_PASSWORD, password);
            await this.page.click(HoonuitLoginPage.GOOGLE_PASSWORD_NEXT);
            
            // Handle "Stay signed in" option
            const backButton = this.page.locator(HoonuitLoginPage.GOOGLE_BACK_BUTTON);
            if (await backButton.isVisible({ timeout: 5000 }).catch(() => false)) {
                await backButton.click();
            }
            
            await this.waitForHoonuitPage();
        } catch (error) {
            throw new Error(`Failed to login through Google SSO: ${error}`);
        }
    }

    /**
     * Login through Google SSO using dedicated page object.
     * Recommended for complex Google login scenarios.
     * @param username - Google username/email
     * @param password - Google password
     */
    async loginWithGooglePage(username: string, password: string): Promise<void> {
        const googleLoginPage = new GoogleLoginPage(this.page);
        await googleLoginPage.login(username, password);
    }

    /**
     * Login through Microsoft SSO (embedded flow).
     * For standalone Microsoft login, use MicrosoftLoginPage instead.
     * @param username - Microsoft username/email
     * @param password - Microsoft password
     */
    async loginThroughMicrosoftSSO(username: string, password: string): Promise<void> {
        try {
            await this.page.fill(HoonuitLoginPage.MS_LOGIN_FORMAT, username);
            await this.page.click(HoonuitLoginPage.MS_SUBMIT_BUTTON);
            
            await this.page.waitForSelector(HoonuitLoginPage.MS_PASSWORD, { state: 'visible' });
            await this.page.fill(HoonuitLoginPage.MS_PASSWORD, password);
            await this.page.click(HoonuitLoginPage.MS_SUBMIT_BUTTON);
            
            await this.waitForHoonuitPage();
        } catch (error) {
            throw new Error(`Failed to login through Microsoft SSO: ${error}`);
        }
    }

    /**
     * Login through Microsoft SSO using dedicated page object.
     * Recommended for complex Microsoft login scenarios.
     * @param username - Microsoft username/email
     * @param password - Microsoft password
     */
    async loginWithMicrosoftPage(username: string, password: string): Promise<void> {
        const microsoftLoginPage = new MicrosoftLoginPage(this.page);
        await microsoftLoginPage.login(username, password);
    }

    // ============================================
    // LOGOUT METHODS
    // ============================================

    /**
     * Logout from the application.
     * Clicks user menu, logout link, and confirms logout.
     * Always clears cookies even if logout fails.
     */
    async logout(): Promise<void> {
        try {
            await this.page.click(HoonuitLoginPage.USER_MENU_BUTTON);
            await this.page.click(HoonuitLoginPage.LOGOUT_LINK);
            await this.page.click(HoonuitLoginPage.LOGOUT_CONFIRM);
            
            // Clear cookies
            await this.page.context().clearCookies();
        } catch (error) {
            console.warn('Logout error:', error);
            // Always clear cookies even if logout fails
            await this.page.context().clearCookies();
        }
    }

    /**
     * Force logout by clearing cookies without UI interaction.
     */
    async forceLogout(): Promise<void> {
        await this.page.context().clearCookies();
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Check if login page is displayed.
     * @param timeout - Optional timeout in milliseconds (default: 10000)
     * @returns True if username field is visible, false otherwise
     */
    async isLoginPageDisplayed(timeout: number = 10000): Promise<boolean> {
        try {
            await this.page.waitForSelector(HoonuitLoginPage.USERNAME_TEXTBOX, { 
                state: 'visible',
                timeout
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if role selection is displayed.
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if administrator link is visible, false otherwise
     */
    async isRoleSelectionDisplayed(timeout: number = 5000): Promise<boolean> {
        try {
            await this.page.waitForSelector(HoonuitLoginPage.SIGN_AS_ADMIN, { 
                state: 'visible',
                timeout
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if UU login form is displayed.
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if UU username field is visible, false otherwise
     */
    async isUuLoginDisplayed(timeout: number = 5000): Promise<boolean> {
        try {
            const uuField = this.page.locator(HoonuitLoginPage.UU_USERNAME_TEXTBOX);
            await uuField.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if Kickboard login form is displayed.
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if Kickboard email field is visible, false otherwise
     */
    async isKickboardLoginDisplayed(timeout: number = 5000): Promise<boolean> {
        try {
            const kbField = this.page.locator(HoonuitLoginPage.KB_EMAIL_TEXTBOX);
            await kbField.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Wait for login page to be fully loaded.
     */
    async waitForLoginPage(): Promise<void> {
        await this.page.waitForSelector(HoonuitLoginPage.USERNAME_TEXTBOX, {
            state: 'visible',
            timeout: HoonuitLoginPage.PAGE_LOAD_TIMEOUT
        });
    }
}

// Default export for backward compatibility
export default HoonuitLoginPage;

// Type aliases for backward compatibility
export { HoonuitLoginPage as LoginPage };
export { HoonuitLoginPage as UihnLoginPage };