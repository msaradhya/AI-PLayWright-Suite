import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../base/hoonuit-sis-base-page';
import HoonuitStackBarChart from '../partial/chart/HoonuitStackBarChart';

/**
 * Hoonuit Disproportionality Page Object
 * Contains element selectors and methods for interacting with the State Subgroup Disproportionality page
 * Converted from Java/Selenide to Playwright TypeScript
 */
export class HoonuitDisproportionalityPage extends HoonuitSisBasePage {

    constructor(page: Page) {
        super(page);
    }

    protected pageTitle(): string {
        return "State Subgroup Disproportionality";
    }

    async getDisproportionalityPassingRateChart(): Promise<HoonuitStackBarChart> {
        return new HoonuitStackBarChart(this.page, 'Disproportionality Passing Rate');
    }

    async getMathScoreDistributionChart(): Promise<HoonuitStackBarChart> {
        return new HoonuitStackBarChart(this.page, 'Math Score Distribution');
    }

    async getELAScoreDistributionChart(): Promise<HoonuitStackBarChart> {
        return new HoonuitStackBarChart(this.page, 'ELA Score Distribution');
    }

    async getScienceScoreDistributionChart(): Promise<HoonuitStackBarChart> {
        return new HoonuitStackBarChart(this.page, 'Science Score Distribution');
    }

    async getSocialScienceScoreDistributionChart(): Promise<HoonuitStackBarChart> {
        return new HoonuitStackBarChart(this.page, 'Social Science Score Distribution');
    }

    async clickBackToGraduationLink(): Promise<void> {
        await this.page.locator("text='Back to'").waitFor({ state: 'visible' });
        await this.page.locator("text='Back to'").click();
    }
}