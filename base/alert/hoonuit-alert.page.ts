import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Hoonuit Alert Page Object
 * Contains element selectors and methods for interacting with alert messages
 * Converted from Java/Selenide to Playwright TypeScript
 */
export class HoonuitAlert {
    private page: Page;
    
    // Locators as private readonly properties
    private readonly alert: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.alert = this.page.locator("[role='alert']");
    }

    // Public methods for page interactions
    async isNewGroupCreated(): Promise<boolean> {
        const alertMsg = "The new group was successfully created.";
        await this.alert.waitFor({ state: 'visible', timeout: 10000 });
        const alerts = this.page.locator("[role='alert']");
        const matchingAlert = alerts.filter({ hasText: alertMsg });
        return await matchingAlert.isVisible();
    }
    
    async isGroupDeleted(): Promise<boolean> {
        const alertMsg = "The group was successfully deleted!";
        await this.alert.waitFor({ state: 'visible', timeout: 10000 });
        const alerts = this.page.locator("[role='alert']");
        const matchingAlert = alerts.filter({ hasText: alertMsg });
        return await matchingAlert.isVisible();
    }
    
    async isMemberSuccessfullyAdded(): Promise<boolean> {
        const alertMsg = "The member was successfully added to the group.";
        await this.alert.waitFor({ state: 'visible', timeout: 10000 });
        const alerts = this.page.locator("[role='alert']");
        const matchingAlert = alerts.filter({ hasText: alertMsg });
        return await matchingAlert.isVisible();
    }

    async isGroupUpdated(): Promise<boolean> {
        const alertMsg = "The group was successfully updated.";
        await this.alert.waitFor({ state: 'visible', timeout: 10000 });
        const alerts = this.page.locator("[role='alert']");
        const matchingAlert = alerts.filter({ hasText: alertMsg });
        return await matchingAlert.isVisible();
    }

    async getAlertMessage(): Promise<string> {
        await this.alert.waitFor({ state: 'visible', timeout: 10000 });
        return await this.alert.textContent() || '';
    }

    async checkAlertWithText(text: string): Promise<boolean> {
        const matchingAlert = this.alert.filter({ hasText: text });
        return await matchingAlert.isVisible();
    }
}