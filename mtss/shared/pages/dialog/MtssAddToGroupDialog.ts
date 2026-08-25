/**
 * Playwright/TypeScript version of MtssAddToGroupDialog (converted from Java)
 * @author Ashok Garg (Converted to TypeScript/Playwright)
 * @since 10-08-2020
 */
import { Page, Locator, expect } from '@playwright/test';
import { MtssBaseDialog } from '../base/MtssBaseDialog';

export class MtssAddToGroupDialog extends MtssBaseDialog {
  // CSS Selector constants - equivalent to Java version
  private static readonly ADD_TO_GROUP = 'div.modal-dialog app-add-to-group';
  private static readonly BUTTON_LINK = 'button.pds-button';
  private static readonly NAME_OF_GROUP_TEXTBOX = 'input[placeholder="Name of Group"]';
  private static readonly SELECT_A_GROUP_DROPDOWN = '#addToGroupExistingCohort';

  constructor(page: Page, dialogLocator: Locator) {
    super(page, dialogLocator);
  }

  protected dialogTitle(): string {
    return 'Add to Group';
  }

  /**
   * Gets the group name input element
   * @returns Locator for the group name textbox
   */
  public async getGroupName(): Promise<Locator> {
    const body = await this.$body();
    const groupNameInput = body.locator(MtssAddToGroupDialog.NAME_OF_GROUP_TEXTBOX);
    await expect(groupNameInput).toBeVisible();
    return groupNameInput;
  }

  /**
   * Clicks a button link based on the name (Create New Group or Select Existing Group)
   * @param linkName The text of the button link to click
   */
  public async clickButtonLink(linkName: string): Promise<void> {
    const body = await this.$body();
    const buttonLinks = body.locator(MtssAddToGroupDialog.BUTTON_LINK);
    const targetButton = buttonLinks.filter({ hasText: linkName });
    await expect(targetButton).toBeVisible();
    await targetButton.click();
  }

  /**
   * Selects a group from the dropdown by name
   * @param groupName The name of the group to select
   */
  public async selectGroup(groupName: string): Promise<void> {
    const dropdown = this.page.locator(MtssAddToGroupDialog.SELECT_A_GROUP_DROPDOWN);
    await dropdown.click();
    
    const options = this.page.locator('div.ng-option');
    await expect(options.first()).toBeVisible();
    
    const targetOption = options.filter({ hasText: groupName });
    await targetOption.click();
  }
}
