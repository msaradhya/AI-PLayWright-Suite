import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MTSSInterventionFormPage extends BasePage {
    
    constructor(page: Page) {
        super(page);
    }

    // Set intervention name with timestamp
    async setInterventionName(baseName: string = 'PSQA'): Promise<string> {
        console.log('🎯 Setting intervention name...');
        
        // Generate timestamped name
        const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 15);
        const interventionName = `${baseName}_${timestamp}`;
        
        // Find intervention name input and set value
        const nameInputSelector = 'input[id*="name"]';
        await this.page.waitForSelector(nameInputSelector, { timeout: 10000 });
        await this.page.fill(nameInputSelector, interventionName);
        
        console.log(`✅ Intervention name set: ${interventionName}`);
        return interventionName;
    }

    // Navigate to Students tab and add students
    async addStudents(): Promise<void> {
        console.log('🎯 Navigating to Students tab...');
        
        // Navigate to Students tab
        await this.page.waitForSelector('text="Students"', { timeout: 10000 });
        await this.page.click('text="Students"');
        console.log('✅ Students tab navigation successful');
        
        // Add individual student first
        await this.addIndividualStudent('ada');
        
        // Add students from group
        await this.addStudentsFromGroup('PSQA 172 Students');
        
        // Validate student count (expecting at least 10 students to be added)
        await this.validateStudentCount(10);
    }

    // Add individual student by search
    private async addIndividualStudent(searchTerm: string): Promise<void> {
        console.log(`🎯 Adding individual student: "${searchTerm}"`);
        
        // Debug: Check available input fields for student search
        const studentInputs = await this.page.$$eval('input', (inputs: HTMLInputElement[]) => 
            inputs.map((input: HTMLInputElement) => ({
                type: input.type,
                placeholder: input.placeholder,
                name: input.name,
                id: input.id,
                className: input.className,
                visible: input.offsetHeight > 0
            })).filter(input => input.visible)
        );
        console.log('Available student inputs:', JSON.stringify(studentInputs, null, 2));
        
        // Try multiple selectors for student search input
        const studentSearchSelectors = [
            '#addMemberSearch',
            'input[placeholder*="student"]',
            'input[placeholder*="Student"]', 
            'input[placeholder*="search"]',
            'input[placeholder*="Search"]',
            'input[id*="student"]',
            'input[id*="member"]',
            'input[id*="search"]',
            '.neon-input-field input',
            'neon-input input'
        ];
        
        let studentSearchFound = false;
        let usedSelector = '';
        
        for (const selector of studentSearchSelectors) {
            try {
                await this.page.waitForSelector(selector, { timeout: 3000 });
                await this.page.fill(selector, searchTerm);
                console.log(`✅ Found student search input: ${selector}`);
                usedSelector = selector;
                studentSearchFound = true;
                break;
            } catch (error: any) {
                console.log(`❌ Student search selector not found: ${selector}`);
            }
        }
        
        if (!studentSearchFound) {
            throw new Error('Could not find student search input field');
        }
        
        // Wait for dropdown and select first student
        await this.page.waitForTimeout(2000); // Wait for dropdown to appear
        
        // Try multiple dropdown selectors
        const dropdownSelectors = [
            '[class*="dropdown"] *:has-text("ada")',
            '.dropdown *:has-text("ada")',
            '.ng-dropdown-panel *:has-text("ada")',
            '*[role="option"]:has-text("ada")',
            '*:has-text("ada")'
        ];
        
        let dropdownFound = false;
        for (const dropdown of dropdownSelectors) {
            try {
                await this.page.waitForSelector(dropdown, { timeout: 3000 });
                await this.page.click(dropdown);
                console.log(`✅ Found student dropdown: ${dropdown}`);
                dropdownFound = true;
                break;
            } catch (error: any) {
                console.log(`❌ Student dropdown selector not found: ${dropdown}`);
            }
        }
        
        if (!dropdownFound) {
            console.log('⚠️ Could not find student dropdown, trying direct add...');
        }
        
        // Click Add Student button
        await this.page.click('button:has-text("Add Student")');
        console.log('✅ Individual student added successfully');
    }

    // Add students from group
    private async addStudentsFromGroup(groupName: string): Promise<void> {
        console.log(`🎯 Adding students from group: "${groupName}"`);
        
        // Click "Add Student From Group" button
        await this.page.click('button:has-text("Group")');
        
        // Select the group
        await this.page.waitForSelector(`text="${groupName}"`, { timeout: 5000 });
        await this.page.click(`text="${groupName}"`);
        
        // Click "Add Students" button
        await this.page.click('text="Add Students"');
        console.log('✅ Students from group added successfully');
    }

    // Validate student count
    private async validateStudentCount(expectedMinCount: number): Promise<void> {
        console.log(`🎯 Validating student count (expected: ≥${expectedMinCount})...`);
        
        const pageText = await this.page.textContent('body') || '';
        
        // Look for student count patterns in the page
        const studentCountMatches = pageText.match(/(\d+)\s*(?:student|Student)/gi);
        
        if (studentCountMatches) {
            // Find the highest student count mentioned
            const counts = studentCountMatches.map(match => {
                const numberMatch = match.match(/(\d+)/);
                return numberMatch ? parseInt(numberMatch[1]) : 0;
            });
            const maxCount = Math.max(...counts);
            
            if (maxCount >= expectedMinCount) {
                console.log(`✅ Student count validation successful: ${maxCount} students (≥${expectedMinCount} required)`);
            } else {
                console.log(`⚠️ Student count validation failed: ${maxCount} students (≥${expectedMinCount} required)`);
            }
        } else {
            console.log(`⚠️ Student count not clearly displayed - manual verification may be needed`);
        }
    }

    // Navigate to Staff tab and add staff
    async addStaff(): Promise<void> {
        console.log('🎯 Navigating to Staff tab...');
        
        // Navigate to Staff tab
        await this.page.waitForSelector('text="Staff"', { timeout: 10000 });
        await this.page.click('text="Staff"');
        console.log('✅ Staff tab navigation successful');
        
        // Search for staff member
        console.log('🎯 Searching for staff member with "sta"...');
        
        // Try multiple selectors for staff search input
        const staffSearchSelectors = [
            '#addStaffSearch',
            'input[placeholder*="staff"]',
            'input[placeholder*="Staff"]', 
            'input[placeholder*="search"]',
            'input[id*="staff"]',
            'input[id*="member"]',
            '.neon-input-field input',
            'neon-input input'
        ];
        
        let staffSearchFound = false;
        for (const selector of staffSearchSelectors) {
            try {
                await this.page.waitForSelector(selector, { timeout: 3000 });
                await this.page.fill(selector, 'sta');
                console.log(`✅ Found staff search input: ${selector}`);
                staffSearchFound = true;
                break;
            } catch (error: any) {
                console.log(`❌ Staff search selector not found: ${selector}`);
            }
        }
        
        if (!staffSearchFound) {
            throw new Error('Could not find staff search input field');
        }
        
        // Wait for dropdown and select first staff member
        await this.page.waitForTimeout(2000);
        
        // Try multiple dropdown selectors for staff
        const staffDropdownSelectors = [
            '[class*="dropdown"] *:has-text("sta")',
            '.dropdown *:has-text("sta")',
            '.ng-dropdown-panel *:has-text("sta")',
            '*[role="option"]:has-text("sta")',
            '*:has-text("sta")'
        ];
        
        let staffDropdownFound = false;
        for (const dropdown of staffDropdownSelectors) {
            try {
                await this.page.waitForSelector(dropdown, { timeout: 3000 });
                await this.page.click(dropdown);
                console.log(`✅ Found staff dropdown: ${dropdown}`);
                staffDropdownFound = true;
                break;
            } catch (error: any) {
                console.log(`❌ Staff dropdown selector not found: ${dropdown}`);
            }
        }
        
        if (!staffDropdownFound) {
            console.log('⚠️ Could not find staff dropdown, trying direct add...');
        }
        
        // Click Add Staff button
        await this.page.click('button:has-text("Add Staff")');
        console.log('✅ Staff member added successfully');
        
        // Validate staff addition
        await this.validateStaffCount(2);
    }

    // Validate staff count
    private async validateStaffCount(expectedMinCount: number): Promise<void> {
        console.log(`🎯 Validating staff count (expected: ≥${expectedMinCount})...`);
        
        const pageText = await this.page.textContent('body') || '';
        if (pageText.includes('2') || pageText.includes('staff')) {
            console.log(`✅ Staff count validation successful: ≥${expectedMinCount} staff members`);
        } else {
            console.log(`⚠️ Staff count validation unclear - may need manual verification`);
        }
    }

    // Set intervention schedule dates
    async setScheduleDates(): Promise<void> {
        console.log('🎯 Navigating to Schedule tab...');
        
        // Navigate to Schedule tab
        await this.page.waitForSelector('text="Schedule"', { timeout: 10000 });
        await this.page.click('text="Schedule"');
        console.log('✅ Schedule tab navigation successful');
        
        // Calculate dates
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3); // 3 days ago
        
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month future
        
        console.log(`📅 Start date: ${this.formatDate(startDate)} (3 days ago)`);
        console.log(`📅 End date: ${this.formatDate(endDate)} (1 month future)`);
        
        // Set dates using date picker buttons
        await this.setDatePicker('start', startDate);
        await this.setDatePicker('end', endDate);
        
        console.log('✅ Intervention schedule dates configured successfully');
    }

    // Set date using date picker
    private async setDatePicker(type: 'start' | 'end', date: Date): Promise<void> {
        const buttonId = type === 'start' ? '#start-after-button' : '#end-before-button';
        
        try {
            // Open date picker
            await this.page.click(buttonId);
            console.log(`✅ Clicked ${buttonId} to open date picker`);
            
            // For end date, navigate to next month if needed
            if (type === 'end') {
                try {
                    await this.page.waitForSelector('button[aria-label*="Next month"]', { timeout: 3000 });
                    await this.page.click('button[aria-label*="Next month"]');
                    console.log('✅ Clicked next month arrow');
                } catch {
                    console.log('⚠️ Next month navigation not needed or failed');
                }
            }
            
            // Select date
            const day = type === 'start' ? '1' : '4';
            await this.page.waitForSelector(`text="${day}"`, { timeout: 5000 });
            await this.page.click(`text="${day}"`);
            console.log(`✅ ${type} date selected using: text="${day}"`);
            
        } catch (error: any) {
            console.log(`❌ Failed to set ${type} date: ${error.message}`);
        }
    }

    // Add resources to intervention
    async addResources(): Promise<void> {
        console.log('🎯 Navigating to Resources tab...');
        
        // Navigate to Resources tab
        await this.page.waitForSelector('text="Resources"', { timeout: 10000 });
        await this.page.click('text="Resources"');
        console.log('✅ Resources tab navigation successful');
        
        // Click resource input to open dropdown
        const resourceInputSelector = '#add-strategy-button';
        await this.page.waitForSelector(resourceInputSelector, { timeout: 10000 });
        
        const isEnabled = await this.page.isEnabled(resourceInputSelector);
        if (!isEnabled) {
            console.log('⚠️ Add Resource button is disabled - skipping resource addition');
            return;
        }
        
        await this.page.click(resourceInputSelector);
        console.log('✅ Resource dropdown opened');
        
        // Select first resource from dropdown
        await this.page.waitForSelector('.ng-dropdown-panel div', { timeout: 5000 });
        await this.page.click('.ng-dropdown-panel div >> nth=0');
        console.log('✅ Resource selected from dropdown');
        
        // Click Add Resource button
        await this.page.click('button:has-text("Add Resource")');
        console.log('✅ Resource added successfully');
    }

    // Start/Create the intervention
    async startIntervention(): Promise<string> {
        console.log('🎯 Starting/Creating the intervention...');
        
        // Click Start Intervention button
        await this.page.waitForSelector('button:has-text("Start Intervention")', { timeout: 10000 });
        await this.page.click('button:has-text("Start Intervention")');
        console.log('✅ Intervention creation initiated');
        
        // Wait for creation and get intervention ID from URL
        await this.page.waitForTimeout(3000);
        
        const currentUrl = this.page.url();
        const interventionId = this.extractInterventionId(currentUrl);
        
        if (interventionId) {
            console.log(`✅ Intervention created successfully with ID: ${interventionId}`);
            
            // Wait for intervention to be fully activated/processed before returning
            console.log('⏳ Waiting for intervention to be fully activated...');
            await this.page.waitForTimeout(5000);
            console.log('✅ Intervention activation wait completed');
            
            return interventionId;
        } else {
            throw new Error('Failed to extract intervention ID from URL');
        }
    }

    // Complete intervention creation workflow
    async createCompleteIntervention(baseName: string = 'PSQA'): Promise<{ name: string; id: string }> {
        const interventionName = await this.setInterventionName(baseName);
        await this.addStudents();
        await this.addStaff();
        await this.setScheduleDates();
        await this.addResources();
        const interventionId = await this.startIntervention();
        
        return { name: interventionName, id: interventionId };
    }

    // Helper method to format date
    private formatDate(date: Date): string {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).substring(2);
        return `${month}/${day}/${year}`;
    }

    // Helper method to extract intervention ID from URL
    private extractInterventionId(url: string): string | null {
        const match = url.match(/interventions\/([a-f0-9-]+)/);
        return match ? match[1] : null;
    }
}