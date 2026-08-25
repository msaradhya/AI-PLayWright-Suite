import { Page, Locator } from '@playwright/test';

/**
 * Bulk Edit Plan Template Dialog - Playwright Implementation
 * Converted from Java: MtssBulkEditPlanTemplateDialog.java
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 10-08-2020
 */
export class MtssBulkEditPlanTemplateDialog {
  protected page: Page;
  protected dialogElement: Locator;
  private readonly deleteCheckbox: Locator;

  constructor(page: Page, dialogLocator: Locator) {
    this.page = page;
    this.dialogElement = dialogLocator;
    this.deleteCheckbox = dialogLocator.locator('#deleteCheck');
  }

  protected dialogTitle(): string {
    return 'Bulk Edit Plan Template';
  }

  /**
   * Set delete checkbox state
   * @param set - true to check, false to uncheck
   */
  async setDeleteCheckbox(set: boolean): Promise<void> {
    const checkbox = this.deleteCheckbox;
    const selected = await checkbox.isChecked();
    
    if (selected !== set) {
      // Click the parent element like Java version
      await checkbox.locator('..').click();
    }
  }

  /**
   * Check if delete checkbox is selected
   * @returns true if checkbox is checked, false otherwise
   */
  async isDeleteCheckboxSelected(): Promise<boolean> {
    return await this.deleteCheckbox.isChecked();
  }

  /**
   * Check if delete checkbox is enabled
   * @returns true if checkbox is enabled, false otherwise
   */
  async isDeleteCheckboxEnabled(): Promise<boolean> {
    return await this.deleteCheckbox.isEnabled();
  }

  /**
   * Check if delete checkbox is visible
   * @returns true if checkbox is visible, false otherwise
   */
  async isDeleteCheckboxVisible(): Promise<boolean> {
    return await this.deleteCheckbox.isVisible();
  }

  /**
   * Get delete checkbox label text
   * @returns Label text associated with the delete checkbox
   */
  async getDeleteCheckboxLabel(): Promise<string> {
    // Try to find label associated with the checkbox
    const label = this.dialogElement.locator('label[for="deleteCheck"]');
    
    if (await label.count() > 0) {
      return await label.textContent() || '';
    }
    
    // Alternative: look for nearby text
    const parentElement = this.deleteCheckbox.locator('..');
    return await parentElement.textContent() || '';
  }

  /**
   * Wait for delete checkbox to be available
   * @param timeout - Timeout in milliseconds (default: 10000)
   */
  async waitForDeleteCheckbox(timeout: number = 10000): Promise<void> {
    await this.deleteCheckbox.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click save button
   */
  async clickSaveButton(): Promise<void> {
    const saveButton = this.dialogElement.locator('button, a').filter({ hasText: 'Save' });
    await saveButton.waitFor({ state: 'visible' });
    await saveButton.click();
  }

  /**
   * Click cancel button
   */
  async clickCancelButton(): Promise<void> {
    const cancelButton = this.dialogElement.locator('button, a').filter({ hasText: 'Cancel' });
    await cancelButton.waitFor({ state: 'visible' });
    await cancelButton.click();
  }

  /**
   * Perform bulk edit action with delete option
   * @param deleteSelected - Whether to select delete option
   */
  async performBulkEdit(deleteSelected: boolean): Promise<void> {
    // Set delete checkbox state
    await this.setDeleteCheckbox(deleteSelected);
    
    // Click save/submit button
    await this.clickSaveButton();
  }

  /**
   * Cancel bulk edit operation
   */
  async cancelBulkEdit(): Promise<void> {
    await this.clickCancelButton();
  }

  /**
   * Get all available bulk edit options
   * @returns Array of available options
   */
  async getAvailableBulkEditOptions(): Promise<string[]> {
    const options: string[] = [];
    
    // Check for delete option
    if (await this.deleteCheckbox.count() > 0) {
      const deleteLabel = await this.getDeleteCheckboxLabel();
      if (deleteLabel) {
        options.push(deleteLabel);
      }
    }
    
    // Look for other checkboxes or options in the dialog
    const allCheckboxes = this.dialogElement.locator('input[type="checkbox"]');
    const count = await allCheckboxes.count();
    
    for (let i = 0; i < count; i++) {
      const checkbox = allCheckboxes.nth(i);
      const checkboxId = await checkbox.getAttribute('id');
      
      if (checkboxId && checkboxId !== 'deleteCheck') {
        const label = this.dialogElement.locator(`label[for="${checkboxId}"]`);
        if (await label.count() > 0) {
          const labelText = await label.textContent();
          if (labelText?.trim()) {
            options.push(labelText.trim());
          }
        }
      }
    }
    
    return options;
  }

  /**
   * Check if dialog has any validation errors
   * @returns true if validation errors are present, false otherwise
   */
  async hasValidationErrors(): Promise<boolean> {
    const errorSelectors = [
      '.error', '.validation-error', '.alert-danger',
      '[class*="error"]', '[class*="invalid"]'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = this.dialogElement.locator(selector);
      if (await errorElement.count() > 0 && await errorElement.isVisible()) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get validation error messages
   * @returns Array of error messages
   */
  async getValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    const errorSelectors = [
      '.error', '.validation-error', '.alert-danger',
      '[class*="error"]', '[class*="invalid"]'
    ];
    
    for (const selector of errorSelectors) {
      const errorElements = this.dialogElement.locator(selector);
      const count = await errorElements.count();
      
      for (let i = 0; i < count; i++) {
        const errorElement = errorElements.nth(i);
        if (await errorElement.isVisible()) {
          const errorText = await errorElement.textContent();
          if (errorText?.trim()) {
            errors.push(errorText.trim());
          }
        }
      }
    }
    
    return errors;
  }

  /**
   * Wait for bulk edit operation to complete
   * @param timeout - Timeout in milliseconds (default: 30000)
   */
  async waitForBulkEditComplete(timeout: number = 30000): Promise<void> {
    // Wait for dialog to close or success message to appear
    try {
      await this.dialogElement.waitFor({ state: 'hidden', timeout });
    } catch (error) {
      // Dialog might still be visible if there are validation errors
      console.warn('Dialog did not close - may have validation errors');
    }
  }

  /**
   * Check if save button is enabled
   * @returns true if save button is enabled, false otherwise
   */
  async isSaveButtonEnabled(): Promise<boolean> {
    const saveButton = this.dialogElement.locator('button, a').filter({ hasText: 'Save' });
    return await saveButton.isEnabled();
  }

  /**
   * Check if cancel button is enabled
   * @returns true if cancel button is enabled, false otherwise
   */
  async isCancelButtonEnabled(): Promise<boolean> {
    const cancelButton = this.dialogElement.locator('button, a').filter({ hasText: 'Cancel' });
    return await cancelButton.isEnabled();
  }

  /**
   * Get dialog body content
   * @returns Dialog body content as string
   */
  async getDialogContent(): Promise<string> {
    const bodyElement = this.dialogElement.locator('div.modal-body, form.modal-body');
    return await bodyElement.textContent() || '';
  }

  /**
   * Check if dialog is in loading state
   * @returns true if dialog is loading, false otherwise
   */
  async isDialogLoading(): Promise<boolean> {
    const loadingSelectors = [
      '.loading', '.spinner', '.loader',
      '[class*="loading"]', '[class*="spinner"]'
    ];
    
    for (const selector of loadingSelectors) {
      const loadingElement = this.dialogElement.locator(selector);
      if (await loadingElement.count() > 0 && await loadingElement.isVisible()) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Close dialog by clicking close icon
   */
  async closeDialog(): Promise<void> {
    const closeButton = this.dialogElement.locator('[name="close-X"]');
    await closeButton.waitFor({ state: 'visible' });
    await closeButton.click();
  }

  /**
   * Wait for dialog to be visible
   */
  async waitForDialog(): Promise<void> {
    await this.dialogElement.waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }
}
