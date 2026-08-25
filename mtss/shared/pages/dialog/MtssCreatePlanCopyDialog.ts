/**
 * Playwright/TypeScript version of MtssCreatePlanCopyDialog (converted from Java)
 * @author Ashok Garg (Converted to TypeScript/Playwright)
 * @since 10-08-2020
 */
import { Page, Locator } from '@playwright/test';
import { MtssBaseDialog } from '../base/MtssBaseDialog';

export class MtssCreatePlanCopyDialog extends MtssBaseDialog {
  constructor(page: Page, dialogElement: Locator) {
    super(page, dialogElement);
  }

  protected dialogTitle(): string {
    return 'Create Plan Copy';
  }

  // This dialog inherits all base functionality from MtssBaseDialog
  // Additional methods can be added here as needed for specific functionality
}
