/**
 * Playwright/TypeScript version of MtssBulkEditPlansDialog (converted from Java)
 * @author poojitha (Converted to TypeScript/Playwright)
 * @since 27-07-2021
 */
import { Page, Locator, expect } from '@playwright/test';
import { MtssBaseDialog } from '../base/MtssBaseDialog';

export class MtssBulkEditPlansDialog extends MtssBaseDialog {
  // CSS Selector constants - equivalent to Java version
  private static readonly END_DATE_TEXTBOX = '[name="endDate"]';
  private static readonly DELETE_CHECKBOX = '#deleteCheck';
  private static readonly MONTH_DROPDOWN = 'select[aria-label="Select month"]';
  private static readonly YEAR_DROPDOWN = 'select[aria-label="Select year"]';

  constructor(page: Page, dialogElement: Locator) {
    super(page, dialogElement);
  }

  protected dialogTitle(): string {
    return 'Bulk Edit Plans';
  }

  /**
   * Sets the end date using the date picker
   * @param endDate The end date (format: YYYY-MM-DD)
   */
  public async setEndDate(endDate: string): Promise<void> {
    const dateObj = new Date(endDate);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear().toString();
    const day = dateObj.getDate().toString();

    const body = await this.$body();
    const endDateParent = body.locator(MtssBulkEditPlansDialog.END_DATE_TEXTBOX).locator('..');
    const datePickerButton = endDateParent.locator('button.btn-primary');
    
    await expect(datePickerButton).toBeVisible();
    await datePickerButton.click();
    
    await this.page.locator(MtssBulkEditPlansDialog.MONTH_DROPDOWN).selectOption(month);
    await this.page.locator(MtssBulkEditPlansDialog.YEAR_DROPDOWN).selectOption(year);
    
    const daySelector = `div.ngb-dp-day[aria-label*="${month}"]`;
    const dayElements = this.page.locator(daySelector);
    const targetDay = dayElements.filter({ hasText: new RegExp(`^${day}$`) });
    await expect(targetDay).toBeVisible();
    await targetDay.click();
  }

  /**
   * Sets or unsets the delete checkbox
   * @param set true to check the checkbox, false to uncheck it
   */
  public async setDeleteCheckbox(set: boolean): Promise<void> {
    const body = await this.$body();
    const checkbox = body.locator(MtssBulkEditPlansDialog.DELETE_CHECKBOX);
    await expect(checkbox).toBeAttached();
    
    const isSelected = await checkbox.isChecked();
    if (isSelected !== set) {
      // Click the parent element to toggle the checkbox
      await checkbox.locator('..').click();
    }
  }
}
