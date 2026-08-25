import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Hoonuit Logo And Title Page Object
 * Contains element selectors and methods for interacting with logo and title elements
 * Converted from Java/Selenide to Playwright TypeScript
 */
export class HoonuitLogoAndTitlePage {
    private page: Page;
    
    // Locators as private readonly properties
    private readonly siteLogoImg: Locator;
    private readonly loginRightDiv: Locator;
    private readonly dashboardLogoImg: Locator;
    private readonly dashboardTitleSpan: Locator;
    private readonly devToolsLogoImg: Locator;
    private readonly devToolsTitleSpan: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.siteLogoImg = this.page.locator("img[alt='site logo']");
        this.loginRightDiv = this.page.locator("div.login-right");
        this.dashboardLogoImg = this.page.locator("img[alt='Header Logo']");
        this.dashboardTitleSpan = this.page.locator("span.pds-logo-text-primary");
        this.devToolsLogoImg = this.page.locator("img[alt='Go to Home Page.']");
        this.devToolsTitleSpan = this.page.locator("span.ToolBarWebControl");
    }

    // Public methods for page interactions
    async getLogoPath(): Promise<string> {
        return await this.siteLogoImg.getAttribute("src") || '';
    }

    async getLoginPageText(): Promise<string> {
        const fullText = await this.loginRightDiv.textContent() || '';
        return fullText.split("\n")[0];
    }

    async getDashboardLogoPath(): Promise<string> {
        return await this.dashboardLogoImg.getAttribute("src") || '';
    }

    async getDashboardTitleText(): Promise<string> {
        return await this.dashboardTitleSpan.textContent() || '';
    }

    async getDevToolsLogoPath(): Promise<string> {
        return await this.devToolsLogoImg.getAttribute("src") || '';
    }

    async getDevToolsTitleText(): Promise<string> {
        return await this.devToolsTitleSpan.textContent() || '';
    }
}