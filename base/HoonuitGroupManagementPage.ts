import { Page } from '@playwright/test';
import HoonuitBasePage from './HoonuitBasePage';
import HoonuitActionGridTable from '../partial/table/HoonuitActionGridTable';
import HoonuitShareGroupWithUsersDialog from '../dialog/HoonuitShareGroupWithUsersDialog';
import HoonuitShareGroupWithUserGroupsDialog from '../dialog/HoonuitShareGroupWithUserGroupsDialog';
import HoonuitDeleteGroupDialog from '../dialog/HoonuitDeleteGroupDialog';
import HoonuitEditingDialog from '../dialog/HoonuitEditingDialog';
import HoonuitAddNewUserGroupDialog from '../dialog/HoonuitAddNewUserGroupDialog';

/**
 * Page object for the Group Management page in Hoonuit (Playwright version)
 * @author amittiwari
 * @since 22/05/2025 (converted from Java)
 */
export default class HoonuitGroupManagementPage extends HoonuitBasePage {
  private static readonly GROUP_MANAGEMENT_TABLE = 'ag-grid-angular.ag-theme-balham';
  private static readonly DIALOG = 'ngb-modal-window:not([aria-hidden]) div[class*="modal-dialog"]';
  private static readonly NOTIFICATION_TEXT = 'div.ui-pnotify-text';
  private static readonly SEARCH_STUDENT_GROUP_NAME = "input[aria-label='Name Filter Input']";

  constructor(page: Page) {
    super(page);
  }

  protected pageTitle(): string {
    return 'Groups';
  }

  public getGroupManagementTable(): HoonuitActionGridTable {
    // Table title is not specified in Java, so pass empty string or adjust as needed
    return new HoonuitActionGridTable(this.page, '');
  }

  public getShareGroupWithUsersDialog(): HoonuitShareGroupWithUsersDialog {
    return new HoonuitShareGroupWithUsersDialog(this.page, this.page.locator(HoonuitGroupManagementPage.DIALOG));
  }

  public getShareGroupWithUserGroupsDialog(): HoonuitShareGroupWithUserGroupsDialog {
    return new HoonuitShareGroupWithUserGroupsDialog(this.page, this.page.locator(HoonuitGroupManagementPage.DIALOG));
  }

  public getDeleteGroupDialog(): HoonuitDeleteGroupDialog {
    return new HoonuitDeleteGroupDialog(this.page, HoonuitGroupManagementPage.DIALOG);
  }

  public getEditingDialog(): HoonuitEditingDialog {
    return new HoonuitEditingDialog(this.page);
  }

  public async getNotificationText(): Promise<string> {
    const notif = this.page.locator(HoonuitGroupManagementPage.NOTIFICATION_TEXT);
    await notif.waitFor({ state: 'visible' });
    return notif.innerText();
  }

  public getAddNewUserGroupDialog(): HoonuitAddNewUserGroupDialog {
    return new HoonuitAddNewUserGroupDialog(this.page, HoonuitGroupManagementPage.DIALOG);
  }

  public async searchStudentGroup(groupName: string): Promise<void> {
    const input = this.page.locator(HoonuitGroupManagementPage.SEARCH_STUDENT_GROUP_NAME);
    await input.waitFor({ state: 'visible' });
    await input.fill(groupName);
  }
}
