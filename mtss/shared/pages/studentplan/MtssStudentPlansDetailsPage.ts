import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from '../base/MtssBasePage';
import { MtssGridTable } from '../base/table/MtssGridTable';
import { MtssException } from '../../exceptions/MtssException';

/**
 * Student Plans Details Page - Playwright Implementation
 * Converted from Java: MtssStudentPlansDetailsPage.java
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 10-08-2020
 */
export class MtssStudentPlansDetailsPage extends MtssBasePage {
  private readonly grid: Locator;
  private readonly formGroup: Locator;
  private readonly formGroupAssessment: Locator;
  private readonly formGroupBehavior: Locator;
  private readonly formGroupInfo: Locator;
  private readonly closeIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.grid = page.locator('ag-grid-angular');
    this.formGroup = page.locator('div.form-group');
    this.formGroupAssessment = page.locator('div.mt-1');
    this.formGroupBehavior = page.locator("div[class='mb-3']");
    this.formGroupInfo = page.locator('div.ellipsis-on-overflow');
    this.closeIcon = page.locator('[name="close-X"]');
  }

  protected pageTitle(): string | null {
    return null;
  }

  /**
   * Get assessments table
   * @returns MtssGridTable instance for assessments
   */
  getAssessmentsTable(): MtssGridTable {
    const assessmentsFormGroup = this.getFormGroup("Assessments");
    return new MtssGridTable(assessmentsFormGroup.locator(this.grid));
  }

  /**
   * Get attendance table
   * @returns MtssGridTable instance for attendance
   */
  getAttendanceTable(): MtssGridTable {
    const attendanceFormGroup = this.getFormGroup("Attendance");
    return new MtssGridTable(attendanceFormGroup.locator(this.grid));
  }

  /**
   * Get academics table
   * @returns MtssGridTable instance for academics
   */
  getAcademicsTable(): MtssGridTable {
    const academicsFormGroup = this.getFormGroup("Academics");
    return new MtssGridTable(academicsFormGroup.locator(this.grid));
  }

  /**
   * Get behavior table
   * @returns MtssGridTable instance for behavior
   */
  getBehaviorTable(): MtssGridTable {
    const behaviorFormGroup = this.getFormGroup("Behavior");
    return new MtssGridTable(behaviorFormGroup.locator(this.grid));
  }

  /**
   * Get form group info as key-value pairs
   * Converts Java getFormGroupInfo() method
   * @param formGroupTitle - Title of the form group
   * @returns Map of form group information
   */
  async getFormGroupInfo(formGroupTitle: string): Promise<Map<string, string>> {
    const formGroupInfo = new Map<string, string>();
    
    const formGroup = this.getFormGroup(formGroupTitle);
    const infoElements = formGroup.locator(this.formGroupInfo);
    
    // Wait for info elements to be present
    await infoElements.first().waitFor({ state: 'visible' });
    
    const count = await infoElements.count();
    if (count === 0) {
      throw new MtssException(`No info elements found in form group: ${formGroupTitle}`);
    }

    for (let i = 0; i < count; i++) {
      const infoElement = infoElements.nth(i);
      
      // Get the dt (term) and dd (definition) elements
      const dtElement = infoElement.locator('dt');
      const ddElement = infoElement.locator('dd');
      
      if (await dtElement.count() > 0 && await ddElement.count() > 0) {
        await dtElement.scrollIntoViewIfNeeded();
        await ddElement.scrollIntoViewIfNeeded();
        
        const key = (await dtElement.textContent())?.trim() || '';
        const value = (await ddElement.textContent())?.trim() || '';
        
        formGroupInfo.set(key, value);
      }
    }
    
    return formGroupInfo;
  }

  /**
   * Scroll to form component by name
   * Converts Java scrollByFormComponentName() method
   * @param formComponentName - Name of the form component to scroll to
   */
  async scrollByFormComponentName(formComponentName: string): Promise<void> {
    const componentElement = this.page
      .locator("[class='col-12'] h2")
      .filter({ hasText: formComponentName });
    
    await componentElement.scrollIntoViewIfNeeded();
  }

  /**
   * Check if form group info is displayed
   * Converts Java isFormGroupInfo() method
   * @param formGroupTitle - Title of the form group
   * @returns true if form group is displayed, false otherwise
   */
  async isFormGroupInfo(formGroupTitle: string): Promise<boolean> {
    try {
      const formGroup = this.getFormGroup(formGroupTitle);
      return await formGroup.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Click close icon
   */
  async clickCloseIcon(): Promise<void> {
    await this.closeIcon.click();
  }

  /**
   * Get template status in plan
   * Converts Java getTemplateStatusInPlan() method
   * @returns Template status text
   */
  async getTemplateStatusInPlan(): Promise<string> {
    const statusElement = this.page
      .locator("div[col-id='templateName'][role='gridcell']");
    
    await statusElement.waitFor({ state: 'visible' });
    return await statusElement.textContent() || '';
  }

  /**
   * Get form group by name
   * Converts Java private getFormGroup() method
   * @param formGroupName - Name of the form group
   * @returns Locator for the form group
   */
  private getFormGroup(formGroupName: string): Locator {
    // Get all visible form group elements
    const formGroupElements = this.formGroup.filter({ hasText: formGroupName });
    
    // Check if any form group matches
    return formGroupElements.first();
  }

  /**
   * Get behavior form group (special handling for assessments and behavior)
   * Converts Java private getBehaviorFormGroup() method
   * @param formGroupName - Name of the form group
   * @returns Locator for the behavior form group
   */
  private getBehaviorFormGroup(formGroupName: string): Locator {
    let formGroupElements: Locator;
    
    if (formGroupName.toLowerCase() === 'assessments' || 
        formGroupName.toLowerCase() === 'behavior') {
      formGroupElements = this.formGroupBehavior;
    } else {
      formGroupElements = this.formGroup;
    }
    
    return formGroupElements
      .filter({ hasText: formGroupName })
      .first();
  }

  /**
   * Get form group with enhanced logic
   * Enhanced version that handles different form group types
   * @param formGroupName - Name of the form group
   * @returns Locator for the form group
   */
  async getFormGroupEnhanced(formGroupName: string): Promise<Locator> {
    // First try regular form groups
    const regularFormGroups = this.formGroup.filter({ hasText: formGroupName });
    
    if (await regularFormGroups.count() > 0) {
      const formGroup = regularFormGroups.first();
      const h2Element = formGroup.locator('h2.h6');
      
      if (await h2Element.count() > 0) {
        const headerText = await h2Element.textContent();
        if (headerText?.trim() === formGroupName) {
          return formGroup;
        }
      }
    }
    
    // Try behavior form groups for specific types
    if (formGroupName.toLowerCase() === 'assessments' || 
        formGroupName.toLowerCase() === 'behavior') {
      const behaviorFormGroups = this.formGroupBehavior.filter({ hasText: formGroupName });
      
      if (await behaviorFormGroups.count() > 0) {
        const formGroup = behaviorFormGroups.first();
        const h2Element = formGroup.locator('h2.h6');
        
        if (await h2Element.count() > 0) {
          const headerText = await h2Element.textContent();
          if (headerText?.trim() === formGroupName) {
            return formGroup;
          }
        }
      }
    }
    
    throw new MtssException(`Unable to find form group with name: ${formGroupName}`);
  }

  /**
   * Wait for form group to be visible
   * @param formGroupName - Name of the form group
   * @param timeout - Timeout in milliseconds (default: 30000)
   */
  async waitForFormGroup(formGroupName: string, timeout: number = 30000): Promise<void> {
    const formGroup = this.getFormGroup(formGroupName);
    await formGroup.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get all visible form groups
   * @returns Array of form group names
   */
  async getVisibleFormGroups(): Promise<string[]> {
    const formGroups = this.formGroup.filter({ hasText: /.+/ });
    const count = await formGroups.count();
    const groupNames: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const formGroup = formGroups.nth(i);
      const h2Element = formGroup.locator('h2.h6');
      
      if (await h2Element.count() > 0) {
        const headerText = await h2Element.textContent();
        if (headerText?.trim()) {
          groupNames.push(headerText.trim());
        }
      }
    }
    
    return groupNames;
  }

  /**
   * Get form group data as object
   * @param formGroupTitle - Title of the form group
   * @returns Object with form group data
   */
  async getFormGroupData(formGroupTitle: string): Promise<Record<string, string>> {
    const formGroupInfo = await this.getFormGroupInfo(formGroupTitle);
    const result: Record<string, string> = {};
    
    for (const [key, value] of formGroupInfo.entries()) {
      result[key] = value;
    }
    
    return result;
  }

  /**
   * Check if specific info exists in form group
   * @param formGroupTitle - Title of the form group
   * @param infoKey - Key to search for
   * @returns true if info key exists, false otherwise
   */
  async hasFormGroupInfo(formGroupTitle: string, infoKey: string): Promise<boolean> {
    try {
      const formGroupInfo = await this.getFormGroupInfo(formGroupTitle);
      return formGroupInfo.has(infoKey);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get specific info value from form group
   * @param formGroupTitle - Title of the form group
   * @param infoKey - Key to get value for
   * @returns Value for the specified key, or null if not found
   */
  async getFormGroupInfoValue(formGroupTitle: string, infoKey: string): Promise<string | null> {
    try {
      const formGroupInfo = await this.getFormGroupInfo(formGroupTitle);
      return formGroupInfo.get(infoKey) || null;
    } catch (error) {
      return null;
    }
  }
}
