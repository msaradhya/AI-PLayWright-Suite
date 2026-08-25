import { Page, Locator } from '@playwright/test';
import { HoonuitSisBasePage } from './HoonuitBasePage';

/**
 * Hoonuit Group Management Page Object
 * Contains element selectors and methods for interacting with group management
 * Converted from Java/Selenide to Playwright TypeScript
 */
export class HoonuitGroupManagementPage extends HoonuitSisBasePage {
    // Locators as private readonly properties
    private readonly groupManagementTable: Locator;
    private readonly dialog: Locator;
    private readonly notificationTextLocator: Locator;
    private readonly searchStudentGroupName: Locator;
    
    constructor(page: Page) {
        super(page);
        this.groupManagementTable = this.page.locator("ag-grid-angular.ag-theme-balham");
        this.dialog = this.page.locator("ngb-modal-window:not([aria-hidden]) div[class*='modal-dialog']");
        this.notificationTextLocator = this.page.locator("div.ui-pnotify-text");
        this.searchStudentGroupName = this.page.locator("input[aria-label='Name Filter Input']");
    }

    protected pageTitle(): string {
        return "Group Management";
    }

    async getGroupManagementTable(): Promise<Locator> {
        return this.groupManagementTable;
    }

    async searchGroupByName(groupName: string): Promise<void> {
        await this.searchStudentGroupName.waitFor({ state: 'visible' });
        await this.searchStudentGroupName.fill(groupName);
    }

    async getDialog(): Promise<Locator> {
        return this.dialog;
    }

    async getNotificationTextContent(): Promise<string> {
        await this.notificationTextLocator.waitFor({ state: 'visible' });
        return await this.notificationTextLocator.textContent() || '';
    }
}