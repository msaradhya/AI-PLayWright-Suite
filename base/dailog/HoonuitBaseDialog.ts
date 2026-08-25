import { Page, Locator } from '@playwright/test';
import { HoonuitDialogTimeoutException } from '../../exceptions/HoonuitDialogTimeoutException';

/**
 * Base class for all Hoonuit dialog components
 * @author aradhyas (converted from Java by Sourav.Panda)
 * @since 22/05/2025 (original: 4/15/2021)
 */
export default abstract class HoonuitBaseDialog {
    // Selectors
    protected readonly DIALOG_TITLE_SELECTOR = '.pds-modal-title,h5.modal-title';
    protected readonly MODAL_BODY_SELECTOR = 'div.modal-body,form.modal-body';
    protected readonly MODAL_HEADER_SELECTOR = 'div.pds-modal-header,div.modal-header';
    protected readonly MODAL_FOOTER_SELECTOR = 'div.pds-modal-footer,div.modal-footer';
    protected readonly CLOSE_DIALOG_SELECTOR = '[name="close-X"]';
    protected readonly SIP_DIALOG_TITLE_SELECTOR = '.modal-title';

    protected page: Page;
    protected dialogElement: Locator;
    private static dialogWaitTimeInSec = 30;

    /**
     * Constructor
     * @param page - Playwright Page object
     * @param dialogElement - Playwright Locator for the dialog element
     */
    constructor(page: Page, dialogElement: Locator) {
        this.page = page;
        this.dialogElement = dialogElement;
    }

    /**
     * Abstract method that must be implemented by all subclasses to define the dialog title
     */
    protected abstract dialogTitle(): string;

    /**
     * Waits for the dialog to be visible
     */
    public async waitForDialog(): Promise<void> {
        const waitFor = HoonuitBaseDialog.dialogWaitTimeInSec;
        const dialogTitle = this.dialogTitle();

        if (dialogTitle) {
            // Wait for dialog with title to appear
            try {
                await this.dialogElement.waitFor({ state: 'visible', timeout: waitFor * 1000 });
                
                // Check if the dialog title matches expected title
                const actualTitle = await this.getDialogTitleText();
                if (actualTitle !== dialogTitle) {
                    throw new HoonuitDialogTimeoutException(
                        `Dialog title mismatch: expected "${dialogTitle}", got "${actualTitle}"`
                    );
                }
            } catch (error) {
                throw new HoonuitDialogTimeoutException(
                    `Timeout loading Dialog: title = ${dialogTitle}, time-out = ${waitFor}s`
                );
            }
        } else {
            // If dialog doesn't have a title, just wait for it to be visible
            await this.dialogElement.waitFor({ state: 'visible', timeout: 5000 });
        }
        
        // Wait for any loading to complete
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Waits for the SIP Dialog to be visible
     */
    public async waitForSIPDialog(): Promise<void> {
        const waitFor = HoonuitBaseDialog.dialogWaitTimeInSec;
        const dialogTitle = this.dialogTitle();

        if (dialogTitle) {
            // Wait for dialog with title to appear
            try {
                await this.dialogElement.waitFor({ state: 'visible', timeout: waitFor * 1000 });
                
                // Check if the dialog title matches expected title
                const actualTitle = await this.getSIPDialogTitleText();
                if (actualTitle !== dialogTitle) {
                    throw new HoonuitDialogTimeoutException(
                        `SIP Dialog title mismatch: expected "${dialogTitle}", got "${actualTitle}"`
                    );
                }
            } catch (error) {
                throw new HoonuitDialogTimeoutException(
                    `Timeout loading SIP Dialog: title = ${dialogTitle}, time-out = ${waitFor}s`
                );
            }
        } else {
            // If dialog doesn't have a title, just wait for it to be visible
            await this.dialogElement.waitFor({ state: 'visible', timeout: 5000 });
        }
        
        // Wait for any loading to complete
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Clicks the Save button in the dialog footer
     */
    public async clickSaveButton(): Promise<void> {
        const saveButton = await this.getFooterButton('Save');
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click();
    }

    /**
     * Clicks the Cancel button in the dialog footer
     */
    public async clickCancelButton(): Promise<void> {
        const cancelButton = await this.getFooterButton('Cancel');
        await cancelButton.waitFor({ state: 'visible' });
        await cancelButton.click();
    }

    /**
     * Closes the dialog by clicking the X button
     */
    public async closeDialog(): Promise<void> {
        const closeButton = this.getHeader().locator(this.CLOSE_DIALOG_SELECTOR);
        await closeButton.waitFor({ state: 'visible' });
        await closeButton.click();
    }

    /**
     * Get the dialog body element
     */
    protected getBody(): Locator {
        return this.dialogElement.locator(this.MODAL_BODY_SELECTOR);
    }

    /**
     * Get the dialog header element
     */
    protected getHeader(): Locator {
        return this.dialogElement.locator(this.MODAL_HEADER_SELECTOR);
    }

    /**
     * Get the dialog footer element
     */
    protected getFooter(): Locator {
        return this.dialogElement.locator(this.MODAL_FOOTER_SELECTOR);
    }

    /**
     * Get the dialog title element
     */
    protected getTitle(): Locator {
        return this.dialogElement.locator(this.DIALOG_TITLE_SELECTOR);
    }

    /**
     * Get a footer button by its label
     * @param label - Button label text
     */
    protected getFooterButton(label: string): Locator {
        return this.getFooter().locator('button, a', { hasText: label });
    }

    /**
     * Get the dialog title text
     */
    private async getDialogTitleText(): Promise<string> {
        const titleElement = this.getHeader().locator(this.DIALOG_TITLE_SELECTOR);
        await titleElement.waitFor({ state: 'visible' });
        return await titleElement.innerText();
    }

    /**
     * Get the SIP dialog title text
     */
    private async getSIPDialogTitleText(): Promise<string> {
        const headerElement = this.page.locator(this.MODAL_HEADER_SELECTOR);
        const sipTitleElement = this.page.locator(this.SIP_DIALOG_TITLE_SELECTOR);
        
        if (await headerElement.isVisible() && await sipTitleElement.isVisible()) {
            const titleElement = headerElement.locator(this.SIP_DIALOG_TITLE_SELECTOR);
            return await titleElement.innerText();
        } else if (await headerElement.isVisible()) {
            return await headerElement.innerText();
        } else {
            return await sipTitleElement.innerText();
        }
    }
}