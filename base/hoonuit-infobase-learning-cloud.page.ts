import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Hoonuit Infobase Learning Cloud Page Object
 * Contains element selectors and methods for interacting with Infobase Learning Cloud
 * Converted from Java/Selenide to Playwright TypeScript
 */
export class HoonuitInfobaseLearningCloudPage {
    private page: Page;
    
    // Locators as private readonly properties
    private readonly courseTitle: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.courseTitle = this.page.locator('#course_title');
    }

    // Public methods for page interactions
    async getCourseTitle(): Promise<string> {
        await this.courseTitle.waitFor({ state: 'visible' });
        return await this.courseTitle.textContent() || '';
    }
}