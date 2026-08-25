import { Page, Locator, expect } from '@playwright/test';

/**
 * @author Ashok Garg (Converted to TypeScript/Playwright)
 * @since 10-08-2020
 * 
 * Playwright/TypeScript version of MtssBaseDialog
 * Base class for handling modal dialogs in MTSS applications
 */

// Custom exception class for dialog timeouts
export class HoonuitDialogTimeoutException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HoonuitDialogTimeoutException';
  }
}

export abstract class MtssBaseDialog {
  // CSS Selector constants equivalent to Java version
  private static readonly DIALOG_TITLE = '.pds-modal-title, h5.modal-title';
  private static readonly MODAL_BODY = 'div.modal-body, form.modal-body';
  private static readonly MODAL_HEADER = 'div.pds-modal-header, div.modal-header';
  private static readonly MODAL_FOOTER = 'div.pds-modal-footer, div.modal-footer';
  private static readonly CLOSE_DIALOG = '[name="close-X"]';
  private static readonly SIP_DIALOG_TITLE = '.modal-title';
  private static readonly DIALOG_WAIT_TIME_IN_SEC = 30;

  protected page: Page;
  protected expectedDialogElement: Locator;

  /**
   * Constructor for dialogs
   * @param page Playwright Page object
   * @param dialogElement Locator for the dialog element
   * @param sip Optional SIP identifier to use SIP-specific wait logic
   */
  constructor(page: Page, dialogElement: Locator, sip?: string) {
    this.page = page;
    this.expectedDialogElement = dialogElement;
    
    // Initialize dialog waiting based on whether SIP parameter is provided
    if (sip !== undefined) {
      this.waitForSIPDialog();
    } else {
      this.waitForDialog();
    }
  }

  /**
   * Abstract method that must be implemented by subclasses
   * @returns The expected title of the dialog
   */
  protected abstract dialogTitle(): string | null;

  /**
   * Waits for the Dialog to be visible
   * Equivalent to Java waitForDialog() method
   */
  public async waitForDialog(): Promise<void> {
    const waitFor = MtssBaseDialog.DIALOG_WAIT_TIME_IN_SEC;

    if (this.dialogTitle() !== null) {
      if (this.dialogTitle() !== null && this.dialogTitle()!.trim() !== '') {
        // Wait for 30 sec, checking every 2 seconds
        let currentTitle = '';
        for (let i = 0; i < waitFor / 2; i++) {
          try {
            currentTitle = await this.getDialogTitleText();
            if (currentTitle === this.dialogTitle()) {
              break;
            }
          } catch (error) {
            // Continue waiting if element not found yet
          }
          
          await this.page.waitForTimeout(2000); // 2 seconds wait
          
          if (i === 16) { // After 32 seconds (16 * 2)
            throw new HoonuitDialogTimeoutException(
              `Timeout loading Dialog: title = ${this.dialogTitle()}, time-out = ${waitFor}`
            );
          }
        }
      }
    } else {
      // If Dialog is not having any title, then wait for 5 Sec
      await this.page.waitForTimeout(5000);
    }

    await this.waitForPageToLoad();
  }

  /**
   * Waits for the SIP Dialog to be visible
   * Equivalent to Java waitForSIPDialog() method
   */
  public async waitForSIPDialog(): Promise<void> {
    const waitFor = MtssBaseDialog.DIALOG_WAIT_TIME_IN_SEC;

    if (this.dialogTitle() !== null) {
      if (this.dialogTitle() !== null && this.dialogTitle()!.trim() !== '') {
        // Wait for 30 sec, checking every 2 seconds
        let currentTitle = '';
        for (let i = 0; i < waitFor / 2; i++) {
          try {
            currentTitle = await this.getSIPDialogTitleText();
            if (currentTitle === this.dialogTitle()) {
              break;
            }
          } catch (error) {
            // Continue waiting if element not found yet
          }
          
          await this.page.waitForTimeout(2000); // 2 seconds wait
          
          if (i === 16) { // After 32 seconds (16 * 2)
            throw new HoonuitDialogTimeoutException(
              `Timeout loading Dialog: title = ${this.dialogTitle()}, time-out = ${waitFor}`
            );
          }
        }
      }
    } else {
      // If Dialog is not having any title, then wait for 5 Sec
      await this.page.waitForTimeout(5000);
    }

    await this.waitForPageToLoad();
  }

  /**
   * Clicks the Save button in the dialog footer
   */
  public async clickSaveButton(): Promise<void> {
    const saveButton = await this.getFooterButton('Save');
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await this.waitForPageToLoad();
  }

  /**
   * Checks if Save button is available to click (enabled)
   * @returns true if Save button is enabled, false otherwise
   */
  public async isSaveButtonAvailableToClick(): Promise<boolean> {
    const saveButton = await this.getFooterButton('Save');
    return await saveButton.isEnabled();
  }

  /**
   * Clicks the Cancel button in the dialog footer
   */
  public async clickCancelButton(): Promise<void> {
    const cancelButton = await this.getFooterButton('Cancel');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }

  /**
   * Closes the dialog using the close (X) button
   */
  public async closeDialog(): Promise<void> {
    const header = await this.$header();
    const closeButton = header.locator(MtssBaseDialog.CLOSE_DIALOG);
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  /**
   * Gets the modal body element
   * @returns Locator for the modal body
   */
  protected async $body(): Promise<Locator> {
    const body = this.expectedDialogElement.locator(MtssBaseDialog.MODAL_BODY);
    await expect(body).toBeVisible();
    return body;
  }

  /**
   * Gets the modal header element
   * @returns Locator for the modal header
   */
  protected async $header(): Promise<Locator> {
    const header = this.expectedDialogElement.locator(MtssBaseDialog.MODAL_HEADER);
    await expect(header).toBeVisible();
    return header;
  }

  /**
   * Gets the modal footer element  
   * @returns Locator for the modal footer
   */
  protected async $footer(): Promise<Locator> {
    const footer = this.expectedDialogElement.locator(MtssBaseDialog.MODAL_FOOTER);
    await expect(footer).toBeVisible();
    return footer;
  }

  /**
   * Gets the dialog title element
   * @returns Locator for the dialog title
   */
  protected async $title(): Promise<Locator> {
    const title = this.expectedDialogElement.locator(MtssBaseDialog.DIALOG_TITLE);
    await expect(title).toBeVisible();
    return title;
  }

  /**
   * Gets a footer button by its label text
   * @param label The text label of the button
   * @returns Locator for the button
   */
  protected async getFooterButton(label: string): Promise<Locator> {
    const footer = await this.$footer();
    const buttons = footer.locator('button, a');
    return buttons.filter({ hasText: label }).first();
  }

  /**
   * Gets the dialog title text
   * @returns The title text as string
   */
  private async getDialogTitleText(): Promise<string> {
    const header = this.expectedDialogElement.locator(MtssBaseDialog.MODAL_HEADER);
    const titleElement = header.locator(MtssBaseDialog.DIALOG_TITLE);
    await expect(titleElement).toBeVisible();
    return await titleElement.textContent() || '';
  }

  /**
   * Gets the SIP dialog title text with fallback logic
   * @returns The SIP dialog title text as string
   */
  private async getSIPDialogTitleText(): Promise<string> {
    const modalHeaderElement = this.page.locator(MtssBaseDialog.MODAL_HEADER);
    const sipTitleElement = this.page.locator(MtssBaseDialog.SIP_DIALOG_TITLE);

    const isModalHeaderVisible = await modalHeaderElement.isVisible();
    const isSipTitleVisible = await sipTitleElement.isVisible();

    if (isModalHeaderVisible && isSipTitleVisible) {
      const header = this.expectedDialogElement.locator(MtssBaseDialog.MODAL_HEADER);
      const titleElement = header.locator(MtssBaseDialog.SIP_DIALOG_TITLE);
      await expect(titleElement).toBeVisible();
      return await titleElement.textContent() || '';
    } else if (isModalHeaderVisible) {
      const header = this.expectedDialogElement.locator(MtssBaseDialog.MODAL_HEADER);
      await expect(header).toBeVisible();
      return await header.textContent() || '';
    } else {
      const titleElement = this.expectedDialogElement.locator(MtssBaseDialog.SIP_DIALOG_TITLE);
      await expect(titleElement).toBeVisible();
      return await titleElement.textContent() || '';
    }
  }

  /**
   * Waits for page to load - Playwright equivalent of HoonuitHelper.waitForPageToLoad()
   * This method waits for network idle state to ensure page has finished loading
   */
  private async waitForPageToLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      // Fallback: wait for domcontentloaded if networkidle times out
      await this.page.waitForLoadState('domcontentloaded');
    }
  }
}
