import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../base/hoonuit-sis-base-page';

/**
 * Hoonuit Math ELA Plot Page Object
 * Contains methods for interacting with the State Math - Reading Comparison page
 * Converted from Java/Selenide to Playwright TypeScript
 */
export class HoonuitMathELAPlotPage extends HoonuitSisBasePage {

    constructor(page: Page) {
        super(page);
    }

    protected pageTitle(): string {
        return "State Math - Reading Comparison";
    }

    // Note: Chart methods removed due to missing chart dependencies
    // TODO: Add getStateMathELAChart() method when chart classes are available

    async clickBackToGraduationLink(): Promise<void> {
        await this.page.locator("text='Back to'").waitFor({ state: 'visible' });
        await this.page.locator("text='Back to'").click();
    }
}