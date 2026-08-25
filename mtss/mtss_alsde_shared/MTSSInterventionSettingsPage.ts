import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface MTSSSettingsValidation {
    enrollWithdrawReasonsValid: boolean;
    levelsValid: boolean;
    interventionTypesValid: boolean;
    memberTypesValid: boolean;
    studentSupportResourcesValid: boolean;
    observationLabelsValid: boolean;
    settingsPageLoaded: boolean;
}

export class MTSSInterventionSettingsPage extends BasePage {
    readonly utilityAppsButton: Locator;
    readonly mtssInterventionsLink: Locator;
    readonly interventionSettingsLink: Locator;
    readonly enrollWithdrawReasonsTab: Locator;
    readonly levelsTab: Locator;
    readonly interventionTypesTab: Locator;
    readonly memberTypesTab: Locator;
    readonly studentSupportResourcesTab: Locator;
    readonly observationLabelsTab: Locator;

    constructor(page: Page) {
        super(page);
        
        // Initialize locators for MTSS navigation and settings based on actual page structure
        this.utilityAppsButton = page.locator('#utilityApps');
        this.mtssInterventionsLink = page.locator('#ViewMTSSInterventions');
        this.interventionSettingsLink = page.locator('a:has-text("Settings")');
        
        // Tab locators using role="tab" as discovered in actual page
        this.enrollWithdrawReasonsTab = page.getByRole('tab', { name: 'Enroll/Withdraw Reasons' });
        this.levelsTab = page.getByRole('tab', { name: 'Levels' });
        this.interventionTypesTab = page.getByRole('tab', { name: 'Intervention Types' });
        this.memberTypesTab = page.getByRole('tab', { name: 'Member Types' });
        this.studentSupportResourcesTab = page.getByRole('tab', { name: 'Student Support Resources' });
        this.observationLabelsTab = page.getByRole('tab', { name: 'Observation Labels' });
    }

    /**
     * Navigate to MTSS Intervention Settings from the main dashboard
     * Returns the new page where MTSS settings are loaded
     */
    async navigateToInterventionSettings(): Promise<void> {
        console.log('🎯 Navigating to MTSS Intervention Settings');
        
        // Step 1: Click Utility Apps button
        await this.utilityAppsButton.waitFor({ timeout: 15000 });
        await this.utilityAppsButton.click();
        console.log('✅ Clicked Utility Apps button');
        
        // Wait for the utility apps menu to appear
        await this.page.waitForTimeout(2000);
        
        // Step 2: Click MTSS Interventions link (this will open in new tab)
        await this.mtssInterventionsLink.waitFor({ timeout: 10000 });
        const newPagePromise = this.page.context().waitForEvent('page');
        await this.mtssInterventionsLink.click();
        const newPage = await newPagePromise;
        console.log('✅ Opened MTSS Interventions in new tab');
        
        // Step 3: Switch to new tab and wait for it to load
        await newPage.waitForLoadState('networkidle');
        console.log('✅ MTSS Interventions page loaded');
        
        // Step 4: Click Settings link on the new page
        const settingsLink = newPage.locator('a:has-text("Settings")');
        await settingsLink.waitFor({ timeout: 15000 });
        await settingsLink.click();
        
        // Update all locators to use the new page
        this.updatePageReference(newPage);
        
        // Wait for settings page to load
        await newPage.waitForLoadState('networkidle');
        console.log('✅ Navigated to Intervention Settings page');
    }

    /**
     * Update all locators to reference the new page
     */
    private updatePageReference(newPage: any): void {
        // Update the base page property
        (this as any).page = newPage;
        
        // Update all tab locators to use the new page
        (this as any).enrollWithdrawReasonsTab = newPage.getByRole('tab', { name: 'Enroll/Withdraw Reasons' });
        (this as any).levelsTab = newPage.getByRole('tab', { name: 'Levels' });
        (this as any).interventionTypesTab = newPage.getByRole('tab', { name: 'Intervention Types' });
        (this as any).memberTypesTab = newPage.getByRole('tab', { name: 'Member Types' });
        (this as any).studentSupportResourcesTab = newPage.getByRole('tab', { name: 'Student Support Resources' });
        (this as any).observationLabelsTab = newPage.getByRole('tab', { name: 'Observation Labels' });
    }

    /**
     * Validate that the settings page loads without errors
     */
    async validateSettingsPageLoad(): Promise<boolean> {
        console.log('🔍 Validating Intervention Settings page load');
        
        try {
            // Check for common error indicators
            const errorSelectors = [
                'text="Error"',
                'text="404"',
                'text="Not Found"',
                'text="Access Denied"',
                '.error',
                '.alert-danger'
            ];
            
            for (const selector of errorSelectors) {
                const errorElement = this.page.locator(selector);
                if (await errorElement.isVisible({ timeout: 2000 })) {
                    console.log(`❌ Error found on page: ${selector}`);
                    return false;
                }
            }
            
            // Look for positive indicators that settings loaded
            const settingsIndicators = [
                'text="Interventions Settings"',
                'text="Enroll/Withdraw Reasons"',
                'text="Levels"',
                'text="Intervention Types"'
            ];
            
            let foundIndicator = false;
            for (const selector of settingsIndicators) {
                const element = this.page.locator(selector);
                if (await element.isVisible({ timeout: 5000 })) {
                    console.log(`✅ Found settings indicator: ${selector}`);
                    foundIndicator = true;
                    break;
                }
            }
            
            return foundIndicator;
        } catch (error) {
            console.log(`❌ Error validating settings page: ${error}`);
            return false;
        }
    }

    /**
     * Validate Enroll/Withdraw Reasons settings
     */
    async validateEnrollWithdrawReasons(): Promise<boolean> {
        console.log('🔍 Validating Enroll/Withdraw Reasons settings');
        
        try {
            // First ensure we're on the Enroll/Withdraw Reasons tab
            await this.enrollWithdrawReasonsTab.click();
            await this.waitForTimeout(2000);
            
            // Look for actual content from the grid: Met Requirements, Attendance Dismissal, etc.
            const expectedContent = ['Met Requirements', 'Attendance Dismissal', 'Completed'];
            let allFound = true;
            
            for (const content of expectedContent) {
                const contentElement = this.page.locator(`text="${content}"`);
                const isVisible = await contentElement.isVisible({ timeout: 3000 });
                
                if (isVisible) {
                    console.log(`✅ Found ${content} in Enroll/Withdraw Reasons`);
                } else {
                    console.log(`❌ Missing ${content} in Enroll/Withdraw Reasons`);
                    allFound = false;
                }
            }
            
            return allFound;
        } catch (error) {
            console.log(`❌ Error validating Enroll/Withdraw Reasons: ${error}`);
            return false;
        }
    }

    /**
     * Click on Levels tab and validate
     */
    async clickLevelsAndValidate(): Promise<boolean> {
        console.log('🎯 Clicking Levels tab and validating');
        
        try {
            await this.levelsTab.click();
            await this.waitForTimeout(2000);
            
            // Look for Tier 2 and Tier 3
            const expectedLevels = ['Tier 2', 'Tier 3'];
            let allFound = true;
            
            for (const level of expectedLevels) {
                const levelElement = this.page.locator(`text="${level}"`);
                const isVisible = await levelElement.isVisible({ timeout: 3000 });
                
                if (isVisible) {
                    console.log(`✅ Found ${level} level`);
                } else {
                    console.log(`❌ Missing ${level} level`);
                    allFound = false;
                }
            }
            
            return allFound;
        } catch (error) {
            console.log(`❌ Error clicking Levels tab: ${error}`);
            return false;
        }
    }

    /**
     * Click on Intervention Types tab and validate
     */
    async clickInterventionTypesAndValidate(): Promise<boolean> {
        console.log('🎯 Clicking Intervention Types tab and validating');
        
        try {
            await this.interventionTypesTab.click();
            await this.waitForTimeout(2000);
            
            // Look for Behavior Supports Intervention Types (use .first() to handle multiple matches)
            const behaviorSupportsElement = this.page.locator('text="Behavior Supports"').first();
            const isVisible = await behaviorSupportsElement.isVisible({ timeout: 3000 });
            
            if (isVisible) {
                console.log('✅ Found Behavior Supports Intervention Types');
                return true;
            } else {
                console.log('❌ Missing Behavior Supports Intervention Types');
                return false;
            }
        } catch (error) {
            console.log(`❌ Error clicking Intervention Types tab: ${error}`);
            return false;
        }
    }

    /**
     * Click on Member Types tab and validate
     */
    async clickMemberTypesAndValidate(): Promise<boolean> {
        console.log('🎯 Clicking Member Types tab and validating');
        
        try {
            await this.memberTypesTab.click();
            await this.waitForTimeout(2000);
            
            // Look for actual content: Students and Staff (with capital letters as shown in actual page)
            const expectedMemberTypes = ['Students', 'Staff'];
            let allFound = true;
            
            for (const memberType of expectedMemberTypes) {
                const memberTypeElement = this.page.locator(`text="${memberType}"`);
                const isVisible = await memberTypeElement.isVisible({ timeout: 3000 });
                
                if (isVisible) {
                    console.log(`✅ Found ${memberType} member type`);
                } else {
                    console.log(`❌ Missing ${memberType} member type`);
                    allFound = false;
                }
            }
            
            return allFound;
        } catch (error) {
            console.log(`❌ Error clicking Member Types tab: ${error}`);
            return false;
        }
    }

    /**
     * Click on Student Support Resources tab and validate
     */
    async clickStudentSupportResourcesAndValidate(): Promise<boolean> {
        console.log('🎯 Clicking Student Support Resources tab and validating');
        
        try {
            await this.studentSupportResourcesTab.click();
            await this.waitForTimeout(2000);
            
            // Look for actual resources from the page - just check for "95 Phonics Core Program" which we know exists
            const expectedResources = ['95 Phonics Core Program'];
            let allFound = true;
            
            for (const resource of expectedResources) {
                const resourceElement = this.page.locator(`text="${resource}"`);
                const isVisible = await resourceElement.isVisible({ timeout: 3000 });
                
                if (isVisible) {
                    console.log(`✅ Found ${resource} in Student Support Resources`);
                } else {
                    console.log(`❌ Missing ${resource} in Student Support Resources`);
                    allFound = false;
                }
            }
            
            return allFound;
        } catch (error) {
            console.log(`❌ Error clicking Student Support Resources tab: ${error}`);
            return false;
        }
    }

    /**
     * Click on Observation Labels tab and validate
     */
    async clickObservationLabelsAndValidate(): Promise<boolean> {
        console.log('🎯 Clicking Observation Labels tab and validating');
        
        try {
            await this.observationLabelsTab.click();
            await this.waitForTimeout(2000);
            
            // Look for the actual observation labels: "Observation 1", "Observation 2", "Observation 3"
            const expectedObservations = ['Observation 1', 'Observation 2', 'Observation 3'];
            let allFound = true;
            
            for (const observation of expectedObservations) {
                const observationElement = this.page.locator(`text="${observation}"`);
                const isVisible = await observationElement.isVisible({ timeout: 3000 });
                
                if (isVisible) {
                    console.log(`✅ Found ${observation}`);
                } else {
                    console.log(`❌ Missing ${observation}`);
                    allFound = false;
                }
            }
            
            return allFound;
        } catch (error) {
            console.log(`❌ Error clicking Observation Labels tab: ${error}`);
            return false;
        }
    }

    /**
     * Perform complete MTSS Intervention Settings validation
     */
    async performCompleteSettingsValidation(): Promise<MTSSSettingsValidation> {
        console.log('🔍 Starting complete MTSS Intervention Settings validation');
        
        const validation: MTSSSettingsValidation = {
            settingsPageLoaded: false,
            enrollWithdrawReasonsValid: false,
            levelsValid: false,
            interventionTypesValid: false,
            memberTypesValid: false,
            studentSupportResourcesValid: false,
            observationLabelsValid: false
        };
        
        // Step 1: Validate settings page loads
        validation.settingsPageLoaded = await this.validateSettingsPageLoad();
        
        if (!validation.settingsPageLoaded) {
            console.log('❌ Settings page did not load properly, skipping other validations');
            return validation;
        }
        
        // Step 2: Validate Enroll/Withdraw Reasons
        validation.enrollWithdrawReasonsValid = await this.validateEnrollWithdrawReasons();
        
        // Step 3: Validate Levels
        validation.levelsValid = await this.clickLevelsAndValidate();
        
        // Step 4: Validate Intervention Types
        validation.interventionTypesValid = await this.clickInterventionTypesAndValidate();
        
        // Step 5: Validate Member Types
        validation.memberTypesValid = await this.clickMemberTypesAndValidate();
        
        // Step 6: Validate Student Support Resources
        validation.studentSupportResourcesValid = await this.clickStudentSupportResourcesAndValidate();
        
        // Step 7: Validate Observation Labels
        validation.observationLabelsValid = await this.clickObservationLabelsAndValidate();
        
        console.log('🏁 Complete MTSS Intervention Settings validation finished');
        return validation;
    }
}
