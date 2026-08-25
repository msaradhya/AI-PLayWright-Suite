import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class StudentProfilePage extends BasePage {
    readonly studentNameHeading: Locator;
    readonly studentIdDisplay: Locator;
    readonly planNameDisplay: Locator;
    readonly planStatusDisplay: Locator;
    readonly planStartDateDisplay: Locator;
    readonly planEndDateDisplay: Locator;
    readonly planDetailsTab: Locator;
    readonly planProgressTab: Locator;
    readonly planDocumentsTab: Locator;
    readonly backToListButton: Locator;
    
    // Additional profile locators
    readonly studentProfileHeading: Locator;
    readonly plansDetailLink: Locator;
    readonly plansDetailHeading: Locator;
    readonly plansGrid: Locator;

    // Student Plans specific locators
    readonly studentPlansTab: Locator;
    readonly studentPlansContent: Locator;
    readonly planNameCell: Locator;
    readonly schoolInfoCell: Locator;
    readonly startDateCell: Locator;
    readonly endDateCell: Locator;

    constructor(page: Page) {
        super(page);
        this.studentNameHeading = page.getByRole('heading', { name: /Rollins, Aubree/i });
        this.studentIdDisplay = page.locator('[data-testid="student-id"]').or(
            page.getByText('2003797616')
        );
        this.planNameDisplay = page.locator('[data-testid="plan-name"]').or(
            page.getByText('Rollins_Aubree_SY24-25_Portfolio')
        );
        this.planStatusDisplay = page.locator('[data-testid="plan-status"]').or(
            page.getByText('Active')
        );
        this.planStartDateDisplay = page.locator('[data-testid="plan-start-date"]').or(
            page.getByText('08/08/2024')
        );
        this.planEndDateDisplay = page.locator('[data-testid="plan-end-date"]').or(
            page.getByText('07/01/2025')
        );
        this.planDetailsTab = page.getByRole('tab', { name: /Plan Details/i });
        this.planProgressTab = page.getByRole('tab', { name: /Progress/i });
        this.planDocumentsTab = page.getByRole('tab', { name: /Documents/i });
        this.backToListButton = page.getByRole('button', { name: /Back to List/i });
        
        // Additional profile locators
        this.studentProfileHeading = page.locator('h1, h2, h3').filter({ hasText: /Student Profile/i });
        this.plansDetailLink = page.getByRole('link', { name: 'Student Plans Detail' });
        this.plansDetailHeading = page.locator('h1').filter({ hasText: 'Student Plans Detail' });
        this.plansGrid = page.locator('[role="grid"]');
        
        // Student Plans specific locators
        this.studentPlansTab = page.getByRole('link', { name: 'Student Plans', exact: true });
        this.studentPlansContent = page.locator('[role="gridcell"]');
        this.planNameCell = page.locator('[role="gridcell"]').filter({ hasText: /Rollins_Aubree.*Portfolio/i });
        this.schoolInfoCell = page.locator('[role="gridcell"]');
        this.startDateCell = page.locator('[role="gridcell"]').filter({ hasText: /08\/08\/2024|2024-08-08/i });
        this.endDateCell = page.locator('[role="gridcell"]').filter({ hasText: /07\/01\/2025|2025-07-01/i });
    }

    async waitForStudentProfileLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000); // Allow profile to load
    }

    async isStudentProfileVisible(): Promise<boolean> {
        return await this.isElementVisible(this.studentNameHeading);
    }

    async verifyStudentDetails(expectedStudentId: string, expectedName: string): Promise<void> {
        await expect(this.studentIdDisplay).toBeVisible();
        await expect(this.studentNameHeading).toBeVisible();
        
        const studentIdText = await this.getElementText(this.studentIdDisplay);
        const studentNameText = await this.getElementText(this.studentNameHeading);
        
        expect(studentIdText).toContain(expectedStudentId);
        expect(studentNameText).toContain(expectedName);
    }

    async verifyPlanDetails(expectedPlanName: string, expectedStatus: string): Promise<void> {
        await expect(this.planNameDisplay).toBeVisible();
        await expect(this.planStatusDisplay).toBeVisible();
        
        const planNameText = await this.getElementText(this.planNameDisplay);
        const planStatusText = await this.getElementText(this.planStatusDisplay);
        
        expect(planNameText).toContain(expectedPlanName);
        expect(planStatusText).toContain(expectedStatus);
    }

    async verifyPlanDates(expectedStartDate: string, expectedEndDate: string): Promise<void> {
        await expect(this.planStartDateDisplay).toBeVisible();
        await expect(this.planEndDateDisplay).toBeVisible();
        
        const startDateText = await this.getElementText(this.planStartDateDisplay);
        const endDateText = await this.getElementText(this.planEndDateDisplay);
        
        expect(startDateText).toContain(expectedStartDate);
        expect(endDateText).toContain(expectedEndDate);
    }

    async navigateToPlanDetailsTab(): Promise<void> {
        await this.clickElement(this.planDetailsTab);
        await this.page.waitForTimeout(2000);
    }

    async navigateToPlanProgressTab(): Promise<void> {
        await this.clickElement(this.planProgressTab);
        await this.page.waitForTimeout(2000);
    }

    async navigateToPlanDocumentsTab(): Promise<void> {
        await this.clickElement(this.planDocumentsTab);
        await this.page.waitForTimeout(2000);
    }

    async returnToStudentList(): Promise<void> {
        if (await this.isElementVisible(this.backToListButton)) {
            await this.clickElement(this.backToListButton);
        } else {
            await this.page.goBack();
        }
        await this.page.waitForTimeout(2000);
    }

    async verifyCompleteStudentProfile(): Promise<void> {
        await this.verifyStudentDetails('2003797616', 'Rollins, Aubree');
        await this.verifyPlanDetails('Rollins_Aubree_SY24-25_Portfolio', 'Active');
        await this.verifyPlanDates('08/08/2024', '07/01/2025');
    }

    // New methods for enhanced student profile handling
    async validateStudentProfile(expectedStudentName: string, expectedStudentId: string): Promise<void> {
        // Wait for student profile to load
        await this.waitForStudentProfileLoad();
        
        // Verify student profile
        await expect(this.studentProfileHeading.first()).toBeVisible();
        
        const studentName = this.page.locator('h3').filter({ hasText: expectedStudentName });
        await expect(studentName).toBeVisible();
        
        const studentId = this.page.getByText(expectedStudentId);
        await expect(studentId).toBeVisible();
        console.log('✅ Student profile accessed successfully');
    }

    async navigateToStudentPlansDetail(): Promise<void> {
        await this.clickElement(this.plansDetailLink);
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(5000);
        
        // Verify Student Plans Detail page
        await expect(this.plansDetailHeading).toBeVisible();
        console.log('✅ Navigated to Student Plans Detail');
    }

    async validatePlanDetailsGrid(): Promise<void> {
        // Validate plan details in grid
        await this.page.waitForTimeout(3000);
        await expect(this.plansGrid).toBeVisible();
    }

    async validatePlanDetails(planValidations: Array<{field: string, value: string}>): Promise<void> {
        for (const validation of planValidations) {
            const element = this.page.locator('[role="gridcell"]').filter({ hasText: validation.value });
            await expect(element).toBeVisible();
            console.log(`✅ Verified ${validation.field}: ${validation.value}`);
        }
        console.log('🎉 ALL PLAN DETAILS VALIDATED SUCCESSFULLY!');
    }

    async closeStudentProfile(): Promise<void> {
        await this.page.close();
        console.log('✅ Student profile validation completed');
    }

    // Enhanced Student Plans workflow methods
    async validateStudentProfileHeader(expectedStudentName: string = 'Rollins, Aubree'): Promise<void> {
        await expect(this.studentProfileHeading.first()).toBeVisible();
        const studentName = this.page.locator('h3').filter({ hasText: expectedStudentName });
        await expect(studentName).toBeVisible();
        console.log(`✅ Student profile dashboard opened successfully for ${expectedStudentName}`);
    }

    async navigateToStudentPlans(): Promise<void> {
        await this.clickElement(this.studentPlansTab);
        console.log('✅ Clicked on Student Plans tab');
        
        // Wait for Student Plans page to load (35+ seconds)
        await this.page.waitForTimeout(35000);
        await this.page.waitForLoadState('domcontentloaded');
        console.log('✅ Student Plans page loaded');
    }

    async validateStudentNameInPlans(expectedStudentName: string = 'Rollins, Aubree'): Promise<void> {
        const studentNameInPlans = this.page.locator(`text=${expectedStudentName}`).or(
            this.page.getByText(expectedStudentName)
        );
        await expect(studentNameInPlans.first()).toBeVisible();
        console.log(`✅ Validated student name in Student Plans page: ${expectedStudentName}`);
    }

    async validatePlanName(expectedPlanName: string = 'Rollins_Aubree_SY24-25_Portfolio'): Promise<void> {
        const planName = this.planNameCell.or(this.page.getByText(new RegExp(expectedPlanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')));
        await expect(planName.first()).toBeVisible();
        console.log(`✅ Validated plan name: ${expectedPlanName}`);
    }

    async validateSchoolInfo(schoolPattern: RegExp, schoolDescription: string): Promise<void> {
        const schoolInfo = this.page.locator('[role="gridcell"]').filter({ hasText: schoolPattern }).or(
            this.page.getByText(schoolPattern)
        ).or(
            this.page.locator('*').filter({ hasText: schoolPattern })
        );
        await expect(schoolInfo.first()).toBeVisible();
        console.log(`✅ Validated school: ${schoolDescription}`);
    }

    async validateDates(startDate: string = '08/08/2024', endDate: string = '07/01/2025'): Promise<void> {
        const formattedStartDate = startDate.replace(/\//g, '\\/');
        const formattedEndDate = endDate.replace(/\//g, '\\/');
        
        const startDateRegex = new RegExp(`${formattedStartDate}|${startDate.replace(/\//g, '-')}`, 'i');
        const endDateRegex = new RegExp(`${formattedEndDate}|${endDate.replace(/\//g, '-')}`, 'i');
        
        const startDateElement = this.startDateCell.or(this.page.getByText(startDateRegex));
        await expect(startDateElement.first()).toBeVisible();
        console.log(`✅ Validated start date: ${startDate}`);
        
        const endDateElement = this.endDateCell.or(this.page.getByText(endDateRegex));
        await expect(endDateElement.first()).toBeVisible();
        console.log(`✅ Validated end date: ${endDate}`);
    }

    async validateCompleteStudentPlans(
        schoolPattern: RegExp, 
        schoolDescription: string, 
        districtName: string,
        studentName: string = 'Rollins, Aubree',
        planName: string = 'Rollins_Aubree_SY24-25_Portfolio',
        startDate: string = '08/08/2024',
        endDate: string = '07/01/2025'
    ): Promise<void> {
        await this.validateStudentProfileHeader(studentName);
        await this.navigateToStudentPlans();
        await this.validateStudentNameInPlans(studentName);
        await this.validatePlanName(planName);
        await this.validateSchoolInfo(schoolPattern, schoolDescription);
        await this.validateDates(startDate, endDate);
        console.log(`🎉 ${districtName} STUDENT VALIDATION COMPLETED!`);
    }
}
