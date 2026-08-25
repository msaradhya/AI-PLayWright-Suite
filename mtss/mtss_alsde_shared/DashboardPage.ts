import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    readonly dashboardHeading: Locator;
    readonly filterDataButton: Locator;
    readonly districtDropdown: Locator;
    readonly andalusiaDistrictOption: Locator;
    readonly covingtonDistrictOption: Locator;
    readonly andalusiaFilterBadge: Locator;
    readonly covingtonFilterBadge: Locator;
    readonly birminghamDistrictOption: Locator;
    readonly jeffersonDistrictOption: Locator;
    readonly birminghamFilterBadge: Locator;
    readonly jeffersonFilterBadge: Locator;
    readonly clearAllFiltersButton: Locator;
    
    // TCM-119521: New district options for Interventions Overview test
    readonly accelerationAcademyOption: Locator;
    readonly accessVirtualLearningOption: Locator;
    readonly alabamaAerospaceOption: Locator;
    readonly alabamaInstituteDeafBlindOption: Locator;
    readonly alabamaCyberTechnologyOption: Locator;

    constructor(page: Page) {
        super(page);
        this.dashboardHeading = page.getByRole('heading', { name: 'Performance Indicators' });
        this.filterDataButton = page.getByRole('button', { name: 'Filter Data' });
        this.districtDropdown = page.getByRole('button', { name: 'District' });
        this.andalusiaDistrictOption = page.getByText('Andalusia City Schools');
        this.covingtonDistrictOption = page.getByText('Covington County Schools');
        this.andalusiaFilterBadge = page.getByRole('button', { name: 'Filter for Andalusia City Schools' });
        this.covingtonFilterBadge = page.getByRole('button', { name: 'Filter for Covington County Schools' });
        this.birminghamDistrictOption = page.getByText('Birmingham City Schools');
        this.jeffersonDistrictOption = page.getByText('Jefferson County School System');
        this.birminghamFilterBadge = page.getByRole('button', { name: 'Filter for Birmingham City Schools' });
        this.jeffersonFilterBadge = page.getByRole('button', { name: 'Filter for Jefferson County School System' });
        this.clearAllFiltersButton = page.getByRole('button', { name: 'Clear All Filters' });
        
        // TCM-119521: District options for Interventions Overview test
        this.accelerationAcademyOption = page.getByText('Acceleration Academy');
        this.accessVirtualLearningOption = page.getByText('ACCESS Virtual Learning');
        this.alabamaAerospaceOption = page.getByText('Alabama Aerospace and Aviation High School');
        this.alabamaInstituteDeafBlindOption = page.getByText('Alabama Institute for Deaf and Blind');
        this.alabamaCyberTechnologyOption = page.getByText('Alabama School of Cyber Technology & Engineering');
    }

    async waitForDashboardLoad(): Promise<void> {
        // await this.page.waitForLoadState('networkidle');
        // await this.page.waitForTimeout(6000); // Allow dashboard to fully load
    }

    async isDashboardVisible(): Promise<boolean> {
        return await this.isElementVisible(this.dashboardHeading);
    }

    async validateDashboard(): Promise<void> {
        await expect(this.dashboardHeading).toBeVisible();
    }

    async openDistrictFilter(): Promise<void> {
        await this.clickElement(this.filterDataButton);
        await this.page.waitForTimeout(1000); // Wait for filter menu to open
        await this.clickElement(this.districtDropdown);
        await this.page.waitForTimeout(1000); // Wait for dropdown to open
    }

    async selectAndalusiaDistrict(): Promise<void> {
        await this.clickElement(this.andalusiaDistrictOption);
        await this.page.waitForTimeout(1000); // Wait for selection
    }

    async selectCovingtonDistrict(): Promise<void> {
        await this.clickElement(this.covingtonDistrictOption);
        await this.page.waitForTimeout(1000); // Wait for selection
    }

    async selectBirminghamDistrict(): Promise<void> {
        await this.clickElement(this.birminghamDistrictOption);
        await this.page.waitForTimeout(1000); // Wait for selection
    }

    async selectJeffersonDistrict(): Promise<void> {
        await this.clickElement(this.jeffersonDistrictOption);
        await this.page.waitForTimeout(1000); // Wait for selection
    }

    async applyDistrictFilters(): Promise<void> {
        await this.openDistrictFilter();
        await this.selectAndalusiaDistrict();
        await this.selectCovingtonDistrict();
        await this.page.waitForTimeout(2000); // Wait for filters to apply
    }

    async applyBirminghamJeffersonFilters(): Promise<void> {
        await this.openDistrictFilter();
        await this.selectBirminghamDistrict();
        await this.selectJeffersonDistrict();
        await this.page.waitForTimeout(2000); // Wait for filters to apply
    }

    async verifyDistrictFiltersApplied(): Promise<void> {
        await expect(this.andalusiaFilterBadge).toBeVisible();
        await expect(this.covingtonFilterBadge).toBeVisible();
    }

    async verifyBirminghamJeffersonFiltersApplied(): Promise<void> {
        await expect(this.birminghamFilterBadge).toBeVisible();
        await expect(this.jeffersonFilterBadge).toBeVisible();
    }

    async clearDistrictFilters(): Promise<void> {
        if (await this.isElementVisible(this.clearAllFiltersButton)) {
            await this.clickElement(this.clearAllFiltersButton);
            await this.page.waitForTimeout(1000);
        }
    }

    // TCM-119521: Apply specific district filters for Interventions Overview test  
    async applyInterventionsDistrictFilters(): Promise<void> {
        // Open the filter dropdown
        await this.clickElement(this.filterDataButton);
        await this.page.waitForTimeout(1000);
        
        // Open district dropdown
        await this.clickElement(this.districtDropdown);
        await this.page.waitForTimeout(1000);
        
        // Select the required districts
        await this.clickElement(this.accelerationAcademyOption);
        await this.page.waitForTimeout(500);
        
        await this.clickElement(this.accessVirtualLearningOption);
        await this.page.waitForTimeout(500);
        
        await this.clickElement(this.alabamaAerospaceOption);
        await this.page.waitForTimeout(500);
        
        await this.clickElement(this.alabamaInstituteDeafBlindOption);
        await this.page.waitForTimeout(500);
        
        await this.clickElement(this.alabamaCyberTechnologyOption);
        await this.page.waitForTimeout(500);
        
        // Apply the filters by clicking Filter Data button again
        await this.clickElement(this.filterDataButton);
        await this.page.waitForTimeout(3000); // Wait for filters to apply
    }

    // TCM-119521: Navigate to Interventions Overview Dashboard
    async navigateToInterventionsOverview(): Promise<void> {
        // Click on Dashboard link
        await this.page.getByRole('link', { name: /Dashboards?/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Dashboards?/ }).click();
        
        // Click on Interventions
        await this.page.getByRole('link', { name: /Interventions/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Interventions/ }).click();
        
        // Click on Intervention Overview (note: singular, not plural)
        await this.page.getByRole('link', { name: /Intervention Overview/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Intervention Overview/ }).click();
    }

    // TCM-119527: Navigate to Intervention Effectiveness Dashboard
    async navigateToInterventionEffectiveness(): Promise<void> {
        // Click on Dashboard link
        await this.page.getByRole('link', { name: /Dashboards?/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Dashboards?/ }).click();
        
        // Click on Interventions
        await this.page.getByRole('link', { name: /Interventions/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Interventions/ }).click();
        
        // Click on Intervention Effectiveness
        await this.page.getByRole('link', { name: /Intervention Effectiveness/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Intervention Effectiveness/ }).click();
    }

    // TCM-119528: Navigate to Goal Datawall Dashboard
    async navigateToGoalDatawall(): Promise<void> {
        // Click on Dashboard link
        await this.page.getByRole('link', { name: /Dashboards?/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Dashboards?/ }).click();
        
        // Click on Interventions (use first() to avoid ambiguity)
        await this.page.getByRole('link', { name: 'Interventions', exact: true }).first().waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: 'Interventions', exact: true }).first().click();
        
        // Click on Goal Datawall
        await this.page.getByRole('link', { name: /Goal Datawall/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Goal Datawall/ }).click();
    }

    // TCM-119544: Navigate to Interventions List Dashboard
    async navigateToInterventionsList(): Promise<void> {
        // Click on Dashboard link
        await this.page.getByRole('link', { name: /Dashboards?/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Dashboards?/ }).click();
        
        // Click on Interventions
        await this.page.getByRole('link', { name: /Interventions/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Interventions/ }).click();
        
        // Click on Intervention List
        await this.page.getByRole('link', { name: /Intervention List/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Intervention List/ }).click();
    }

    // TCM-119755: Navigate to Numeracy and Literacy Dashboard
    async navigateToNumeracyAndLiteracy(): Promise<void> {
        // Click on Dashboard link
        await this.page.getByRole('link', { name: /Dashboards?/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Dashboards?/ }).click();
        
        // Click on Interventions
        await this.page.getByRole('link', { name: /Interventions/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Interventions/ }).click();
        
        // Click on Numeracy and Literacy
        await this.page.getByRole('link', { name: /Numeracy and Literacy/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Numeracy and Literacy/ }).click();
    }

    // TCM-119635: Navigate to Student Intervention List Dashboard
    async navigateToStudentInterventionList(): Promise<void> {
        // Click on Dashboard link
        await this.page.getByRole('link', { name: /Dashboards?/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Dashboards?/ }).click();
        
        // Click on Interventions
        await this.page.getByRole('link', { name: /Interventions/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Interventions/ }).click();
        
        // Try different variations of Student Intervention List link text
        const studentInterventionSelectors = [
            'Student Intervention List',
            'Student Interventions List',
            'Intervention Student List',
            'Student Intervention',
        ];
        
        let linkFound = false;
        for (const selector of studentInterventionSelectors) {
            try {
                const link = this.page.getByRole('link', { name: new RegExp(selector, 'i') });
                await link.waitFor({ state: 'visible', timeout: 10000 });
                await link.click();
                linkFound = true;
                console.log(`✅ Found and clicked: ${selector}`);
                break;
            } catch (error) {
                console.log(`❌ Link not found: ${selector}`);
            }
        }
        
        if (!linkFound) {
            throw new Error('Could not find Student Intervention List link with any of the expected variations');
        }
    }

    // TCM-119911: Navigate to Usage Dashboard
    async navigateToUsage(): Promise<void> {
        // Click on Dashboard link to open the navigation menu
        await this.page.getByRole('link', { name: /Dashboards?/ }).waitFor({ state: 'visible', timeout: 60000 });
        await this.page.getByRole('link', { name: /Dashboards?/ }).click();
        
        // Wait for the navigation menu to expand
        // await this.page.waitForTimeout(2000);
        
        // Click on the Usage link in the main navigation to expand its submenu
        const usageLinks = this.page.getByRole('link', { name: 'Usage', exact: true });
        const mainUsageLink = usageLinks.first(); // Get the first Usage link (main nav)
        await mainUsageLink.waitFor({ state: 'visible', timeout: 60000 });
        await mainUsageLink.click();
        
        // Wait for submenu to expand
        // await this.page.waitForTimeout(2000);
        
        // Now click on the "Usage" link in the submenu under "Dashboard"
        const submenuUsageLink = usageLinks.last(); // Get the second Usage link (submenu)
        await submenuUsageLink.waitFor({ state: 'visible', timeout: 60000 });
        await submenuUsageLink.click();
    }
}
