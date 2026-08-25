import { Page, Locator, expect } from '@playwright/test';
import config from 'config';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private url: string;
  private username: string;
  private password: string;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

    constructor(page: Page, userKey: string = 'admin') {
        super(page);
        const config = require('config');
        this.url = config.get('applicationUrl');
        const userCreds = config.get('userCreds');
        const creds = userCreds[userKey];
        this.username = creds?.username || userKey;
        this.password = creds?.password;
        
        // Login form selectors
        this.usernameInput = page.locator('#user');
        this.passwordInput = page.locator('#pass');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

  async gotoLogin(): Promise<void> {
    await this.navigateTo(this.url);
  }

  async login(): Promise<void> {
    await this.gotoLogin();
    await this.typeText(this.usernameInput, this.username);
    await this.typeText(this.passwordInput, this.password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.navigateTo('https://alsde-dev.hoonuit.com/');
    await this.typeText(this.usernameInput, username);
    await this.typeText(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  // MTSS-specific fast login - no page load wait for performance optimization
  async loginFastForMTSS(): Promise<void> {
    await this.gotoLogin();
    await this.typeText(this.usernameInput, this.username);
    await this.typeText(this.passwordInput, this.password);
    await this.clickElement(this.loginButton);
    // No wait for page load - proceed as soon as login action is complete
    // This is specifically for MTSS tests where we want immediate action
  }

  // TCM-119512: Simple branding validation
  async validateLoginScreenBranding(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    
    // Check page title contains Analytics & Insights
    const title = await this.page.title();
    expect(title.toLowerCase()).toContain('analytics');
    expect(title.toLowerCase()).toContain('insights');
    
    // Ensure "Unified Insight" is not present anywhere
    const pageContent = await this.page.textContent('body');
    expect(pageContent?.toLowerCase()).not.toContain('unified insight');
  }
}
