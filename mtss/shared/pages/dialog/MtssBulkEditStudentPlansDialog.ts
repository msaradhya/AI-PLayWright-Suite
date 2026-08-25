/**
 * Playwright/TypeScript version of MtssBulkEditStudentPlansDialog (converted from Java)
 * @author poojitha (Converted to TypeScript/Playwright)
 * @since 29-07-2021
 */
import { Page, Locator, expect } from '@playwright/test';
import { MtssBaseDialog } from '../base/MtssBaseDialog';

export class MtssBulkEditStudentPlansDialog extends MtssBaseDialog {
  // CSS Selector constants - equivalent to Java version
  private static readonly DELETE_CHECKBOX = '#deleteCheck';

  constructor(page: Page, dialogElement: Locator) {
    super(page, dialogElement);
  }

  protected dialogTitle(): string {
    return 'Bulk Edit Student Plans';
  }

  /**
   * Sets or unsets the delete checkbox
   * @param set true to check the checkbox, false to uncheck it
   */
  public async setDeleteCheckbox(set: boolean): Promise<void> {
    const body = await this.$body();
    const checkbox = body.locator(MtssBulkEditStudentPlansDialog.DELETE_CHECKBOX);
    await expect(checkbox).toBeAttached();
    
    const isSelected = await checkbox.isChecked();
    if (isSelected !== set) {
      // Click the parent element to toggle the checkbox
      await checkbox.locator('..').click();
    }
  }
}
