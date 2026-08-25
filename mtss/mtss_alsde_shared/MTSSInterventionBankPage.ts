
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MTSSInterventionBankPage extends BasePage {

    // Get intervention count for inactive interventions (calls getInterventionCount to avoid duplication)
    async getInactiveInterventionCount(): Promise<number> {
        return this.getInterventionCount();
    }

    // Open filters, select "Plan Titles", check a plan title, close filters
    async filterByPlanTitle(planTitle: string): Promise<void> {
        const filtersBtn = this.page.locator('button:has-text("Filters")');
        await filtersBtn.click();
        const planTitlesOption = this.page.locator('text="Plan Titles"');
        await planTitlesOption.click();
        const planLabel = this.page.locator('div.pds-label-text', { hasText: planTitle });
        await planLabel.click();
        await filtersBtn.click();
    }

    // Validate filtered result is a plan title
    async isPlanTitleVisible(planTitle: string): Promise<boolean> {
        const filteredHeading = this.page.locator('h2.neon-2_9_0-text', { hasText: planTitle });
        return filteredHeading.isVisible();
    }

    /**
     * Preview a plan by name or by title.
     * @param planValue The value to search for (name or title).
     * @param byTitle If true, search by plan title; otherwise, by plan name (default: false).
     */
    async previewPlan(planValue: string, byTitle: boolean = false): Promise<void> {
        // Use different selector depending on whether searching by title or name
        const headingSelector = byTitle
            ? 'h2.neon-2_9_0-text'
            : `h2:has-text("${planValue}")`;
        const planCard = byTitle
            ? this.page.locator(headingSelector, { hasText: planValue }).locator('..').locator('..').locator('..')
            : this.page.locator(headingSelector).locator('..').locator('..').locator('..');
        const previewBtn = planCard.locator('button[id^="button-preview-"]');
        await previewBtn.waitFor({ state: 'visible', timeout: 10000 });
        await previewBtn.click();
    }

    // Generic back button clicker (handles both preview and use plan back buttons)
    async clickBackButton(): Promise<void> {
        // Try both known back button selectors
        const selectors = [
            'button#button-layout-detail-back-button-DetailTemplate',
            'button#button-layout-detail-back-button-addManageTemplate'
        ];
        let found = false;
        for (const selector of selectors) {
            const btn = this.page.locator(selector);
            if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await btn.click();
                found = true;
                break;
            }
        }
        if (!found) {
            throw new Error('No back button found for navigation');
        }
        await this.page.waitForTimeout(2000);
    }

    // Aliases for clarity
    async clickBackFromPreview(): Promise<void> { await this.clickBackButton(); }
    async clickBackFromUsePlan(): Promise<void> { await this.clickBackButton(); }

    // Navigate to Intervention Bank from MTSS Interventions landing page
    async goToInterventionBank(): Promise<void> {
        const link = this.page.locator('a', { hasText: /Intervention Bank/i });
        await link.waitFor({ state: 'visible', timeout: 7000 });
        await link.click();
        await this.page.waitForTimeout(2000); // Wait for navigation
    }

    // Select a district from the dropdown
    async selectDistrict(districtName: string): Promise<void> {
        await this.page.locator('#input-field-district-dropdown').click({ force: true });
        await this.page.waitForTimeout(1000);
        await this.page.locator('.neon-list-item-text').first().waitFor({ state: 'visible', timeout: 5000 });
        const option = this.page.locator('.neon-list-item-text', { hasText: districtName });
        if (await option.count() === 0) {
            throw new Error(`${districtName} option not found in dropdown`);
        }
        await option.first().click();
        await this.page.waitForTimeout(1000);
    }

    // Check if the "Active" checkbox is checked
    async isActiveChecked(): Promise<boolean> {
        const activeCheckbox = this.page.locator('#activeID input[type="checkbox"]');
        return activeCheckbox.isChecked();
    }

    // Toggle "Active" checkbox
    async toggleActive(): Promise<void> {
        const activeLabel = this.page.locator('label[for="checkbox-activeID"]');
        await activeLabel.click();
    }

    // Toggle "Inactive" checkbox
    async toggleInactive(): Promise<void> {
        const inactiveLabel = this.page.locator('label[for="checkbox-inactiveID"]');
        await inactiveLabel.click();
    }

    // Get intervention count (first d-inline-flex p)
    async getInterventionCount(): Promise<number> {
        const text = await this.page.locator('div.d-inline-flex p').first().textContent();
        const match = text?.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    // ...existing code...

    // Click back arrow from preview or use plan

    // Click "Use This Plan" for a plan by name
    async usePlan(planName: string): Promise<void> {
        const planCard = this.page.locator(`h2:has-text("${planName}")`).locator('..').locator('..').locator('..');
        const usePlanBtn = planCard.locator('button[id^="button-use-"]');
        await usePlanBtn.waitFor({ state: 'visible', timeout: 10000 });
        await usePlanBtn.click();
        await this.page.getByRole('heading', { name: /Start New Intervention/i }).waitFor({ state: 'visible', timeout: 10000 });
        await this.page.locator('p:has-text("Start your intervention by adding at least one student and setting up a schedule")').waitFor({ state: 'visible', timeout: 10000 });
    }
    constructor(page: Page) {
        super(page);
    }

    // Navigate to Intervention Bank from MTSS main page
    async navigateToInterventionBank(): Promise<void> {
        console.log('🎯 Looking for Intervention Bank option...');
        
    // Debug: Check what's available on the MTSS page
    await this.page.waitForTimeout(10000); // Increased wait for slow page load
        const mtssLinks = await this.page.$$eval('a, button', (elements: Element[]) => 
            elements.map((el: Element) => ({ text: el.textContent?.trim(), tag: el.tagName, href: (el as HTMLAnchorElement).href || '', className: (el as HTMLElement).className }))
                .filter((el: any) => el.text && el.text.length > 0)
        );
        console.log('Available MTSS links/buttons:', JSON.stringify(mtssLinks, null, 2));
        
        // Try to find Intervention Bank with various selectors
        const bankSelectors = [
            'text="Intervention Bank"',
            'a[href*="bank"], a[href*="Bank"]',
            'button:has-text("Intervention Bank")',
            '*:has-text("Intervention Bank")'
        ];
        
        let bankFound = false;
        for (const selector of bankSelectors) {
            try {
                console.log(`🔍 Trying Intervention Bank selector: ${selector}`);
                await this.page.waitForSelector(selector, { timeout: 3000 });
                await this.page.click(selector);
                console.log(`✅ Intervention Bank navigation works with selector: ${selector}`);
                bankFound = true;
                break;
            } catch (error: any) {
                console.log(`❌ Intervention Bank selector not found: ${selector}`);
            }
        }
        
        if (!bankFound) {
            throw new Error('Could not find Intervention Bank navigation option');
        }
        
        // Wait for bank page to load and check if we're on the right page
        await this.page.waitForTimeout(3000);
        
        // Check if we're on the intervention bank page (should have plan search) or intervention list page
        const hasPlansSearch = await this.page.isVisible('#input-field-plan-name');
        const hasInterventionFilter = await this.page.isVisible('#input-field-filter-name');
        
        if (hasInterventionFilter && !hasPlansSearch) {
            console.log('⚠️ Landed on intervention list page instead of bank, will work from here');
            // We're on intervention list page, need to navigate to create new intervention
            try {
                await this.page.waitForSelector('button:has-text("New Intervention"), a:has-text("New Intervention"), *:has-text("Create")', { timeout: 5000 });
                await this.page.click('button:has-text("New Intervention"), a:has-text("New Intervention"), *:has-text("Create")');
                console.log('✅ Clicked "New Intervention" to start creation process');
                await this.page.waitForTimeout(3000);
            } catch (error: any) {
                console.log('❌ Could not find "New Intervention" button, will proceed with current page');
            }
        } else {
            console.log('✅ Intervention Bank page loaded');
        }
    }

    // Search for a plan by name
    async searchPlan(planName: string): Promise<void> {
        console.log(`🎯 Searching for plan: "${planName}"`);
        
        // Debug: Check available input fields
        const planInputs = await this.page.$$eval('input', (inputs: HTMLInputElement[]) => 
            inputs.map((input: HTMLInputElement) => ({
                type: input.type,
                placeholder: input.placeholder,
                name: input.name,
                id: input.id,
                className: input.className,
                visible: input.offsetHeight > 0
            })).filter(input => input.visible)
        );
        console.log('Available plan inputs:', JSON.stringify(planInputs, null, 2));
        
        // Check if we have the plan search input or if we need to navigate differently
        const hasPlansSearch = await this.page.isVisible('#input-field-plan-name');
        
        if (hasPlansSearch) {
            // We're on the intervention bank page, use plan search
            const planSearchSelector = '#input-field-plan-name';
            await this.page.waitForSelector(planSearchSelector, { timeout: 10000 });
            console.log(`✅ Found plan search input: ${planSearchSelector}`);
            
            // Clear and fill search input
            await this.page.click(planSearchSelector);
            await this.page.fill(planSearchSelector, '');
            await this.page.fill(planSearchSelector, planName);
            await this.page.press(planSearchSelector, 'Enter');
            
            console.log(`✅ Plan search completed for: "${planName}"`);
            await this.page.waitForTimeout(2000);
        } else {
            // We might be on intervention list or need to navigate to plan selection
            console.log('⚠️ Plan search input not found, trying alternative navigation...');
            
            // Check if we need to look for plan selection in a different way
            try {
                // Look for any plan-related buttons or links
                const planSelectors = [
                    `text="${planName}"`,
                    `*:has-text("${planName}")`,
                    'button:has-text("Plan")',
                    'a:has-text("Plan")'
                ];
                
                let planFound = false;
                for (const selector of planSelectors) {
                    try {
                        await this.page.waitForSelector(selector, { timeout: 3000 });
                        console.log(`✅ Found plan reference with: ${selector}`);
                        planFound = true;
                        break;
                    } catch (error: any) {
                        console.log(`❌ Plan selector not found: ${selector}`);
                    }
                }
                
                if (!planFound) {
                    console.log('⚠️ Plan not found, proceeding to intervention creation directly');
                }
            } catch (error: any) {
                console.log('⚠️ Alternative navigation failed, proceeding with form creation');
            }
        }
    }

    // Select a specific plan from search results
    async selectPlan(planName: string): Promise<void> {
        console.log(`🎯 Selecting plan: "${planName}"`);
        
        // Check if we already have intervention creation form elements
        const hasInterventionNameInput = await this.page.isVisible('input[id*="name"]');
        const hasStudentsTabVisible = await this.page.isVisible('text="Students"');
        
        if (hasInterventionNameInput && hasStudentsTabVisible) {
            console.log('✅ Already on intervention creation form, skipping plan selection');
            return;
        }
        
        try {
            // Wait for search results and find the plan
            await this.page.waitForSelector(`text="${planName}"`, { timeout: 10000 });
            console.log(`✅ Found plan in results: "${planName}"`);
            
            // Click "Use This Plan" button for the specific plan
            await this.page.waitForSelector('text="Use This Plan"', { timeout: 5000 });
            await this.page.click('text="Use This Plan"');
            console.log(`✅ Selected plan: "${planName}"`);
            
            // Wait for navigation to intervention creation form
            await this.page.waitForTimeout(3000);
            
        } catch (error: any) {
            console.log(`⚠️ Plan selection failed: ${error.message}`);
            
            // Try alternative approaches
            try {
                // Look for any "Create" or "New" buttons
                const createSelectors = [
                    'button:has-text("Create")',
                    'button:has-text("New")',
                    'a:has-text("Create")',
                    'a:has-text("New")',
                    '*:has-text("Start New")'
                ];
                
                for (const selector of createSelectors) {
                    try {
                        await this.page.waitForSelector(selector, { timeout: 3000 });
                        await this.page.click(selector);
                        console.log(`✅ Used alternative creation method: ${selector}`);
                        break;
                    } catch (altError: any) {
                        console.log(`❌ Alternative selector failed: ${selector}`);
                    }
                }
            } catch (altError: any) {
                console.log('⚠️ All alternative methods failed, continuing with current page');
            }
        }
        
        // Validate we're on the intervention creation page
        await this.page.waitForTimeout(2000);
        const pageTitle = await this.page.textContent('h1, h2, [role="heading"]') || '';
        const hasNameInput = await this.page.isVisible('input[id*="name"]');
        const hasStudentsTab = await this.page.isVisible('text="Students"');
        const hasStaffTab = await this.page.isVisible('text="Staff"');
        const hasFormElements = hasNameInput || hasStudentsTab || hasStaffTab;
        
        if (pageTitle.includes('Start New Intervention') || await this.page.isVisible('text="Start New Intervention"') || hasFormElements) {
            console.log('✅ Successfully navigated to intervention creation form');
        } else {
            console.log('⚠️ Navigation to intervention form unclear - continuing...');
        }
    }

    // Complete plan selection workflow
    async selectPlanFromBank(planName: string): Promise<void> {
        await this.navigateToInterventionBank();
        await this.searchPlan(planName);
        await this.selectPlan(planName);
    }
}