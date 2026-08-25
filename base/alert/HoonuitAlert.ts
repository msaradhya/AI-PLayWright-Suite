import { Page, Locator } from '@playwright/test';

/**
 * HoonuitAlert provides methods to interact with and verify alert notifications in the UI.
 * Converted from Java Selenide to Playwright for TypeScript.
 * Maintains exact logic and behavior from the source Java class.
 * @author Sourav.Panda
 * @since 4/15/2021 (Java)
 */
export class HoonuitAlert {
  private static readonly ALERT = 'div.ui-pnotify-text';

  /**
   * Checks if the alert for new group creation is visible and correct.
   * Follows the exact sequence from the Java implementation with waitFor then visible check.
   */
  static async isNewGroupCreated(page: Page): Promise<boolean> {
    const alertMsg = 'The new group was successfully created.';
    await HoonuitAlert.waitForAlertVisible(page);
    const text = await page.locator(HoonuitAlert.ALERT).innerText();
    return text === alertMsg;
  }

  /**
   * Checks if the alert for group deletion is visible and correct.
   * Follows the exact sequence from the Java implementation with direct visible check.
   */
  static async isGroupDeleted(page: Page): Promise<boolean> {
    const alertMsg = 'The group was successfully deleted!';
    await page.locator(HoonuitAlert.ALERT).waitFor({ state: 'visible' });
    const text = await page.locator(HoonuitAlert.ALERT).innerText();
    return text === alertMsg;
  }

  /**
   * Checks if the alert for members successfully added is visible and correct.
   * Follows the exact sequence from the Java implementation with shouldBe visible check.
   */
  static async isMemberSuccessfullyAdded(page: Page): Promise<boolean> {
    const alertMsg = 'The members were successfully added to the group.';
    await page.locator(HoonuitAlert.ALERT).waitFor({ state: 'visible' });
    const text = await page.locator(HoonuitAlert.ALERT).innerText();
    return text === alertMsg;
  }

  /**
   * Checks if the alert for group update is visible and correct.
   * Follows the exact sequence from the Java implementation with shouldBe visible check.
   */
  static async isGroupUpdated(page: Page): Promise<boolean> {
    const alertMsg = 'Group updated successfully.';
    await page.locator(HoonuitAlert.ALERT).waitFor({ state: 'visible' });
    const text = await page.locator(HoonuitAlert.ALERT).innerText();
    return text === alertMsg;
  }

  /**
   * Gets the current alert message text.
   * Follows the exact sequence from the Java implementation with waitFor then shouldBe visible.
   */
  static async getAlertMessage(page: Page): Promise<string> {
    await HoonuitAlert.waitForAlertVisible(page);
    await page.locator(HoonuitAlert.ALERT).waitFor({ state: 'visible' });
    return page.locator(HoonuitAlert.ALERT).innerText();
  }

  /**
   * Waits for the alert to be visible (up to 10 seconds).
   * Matches the Java implementation's WaitFor.waitForIsDisplayed behavior.
   */
  private static async waitForAlertVisible(page: Page): Promise<void> {
    await page.locator(HoonuitAlert.ALERT).waitFor({ state: 'visible', timeout: 10000 });
  }
}
