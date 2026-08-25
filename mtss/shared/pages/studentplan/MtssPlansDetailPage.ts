import { Page, Locator } from '@playwright/test';
import { MtssBasePage } from '../base/MtssBasePage';

/**
 * Plans Detail Page - Playwright Implementation
 * Converted from Java: MtssPlansDetailPage.java
 * 
 * @author Converted from Java to TypeScript/Playwright
 * @since 27-07-2021
 */
export class MtssPlansDetailPage extends MtssBasePage {
  private readonly closeIcon: Locator;
  private readonly printPlanIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.closeIcon = page.locator('[name="close-X"]');
    this.printPlanIcon = page.locator("button[aria-label='Print']");
  }

  protected pageTitle(): string | null {
    return null;
  }

  /**
   * Click close icon
   */
  async clickCloseIcon(): Promise<void> {
    await this.closeIcon.click();
  }

  /**
   * Download print plan
   * Note: Playwright handles downloads differently than Selenium
   * This method sets up download handling and triggers the print action
   */
  async downloadPrintPlan(): Promise<void> {
    try {
      // Set up download event listener
      const downloadPromise = this.page.waitForEvent('download');
      
      // Use JavaScript click to trigger print functionality
      await this.printPlanIcon.evaluate((element) => (element as HTMLElement).click());
      
      // Wait for download to start
      const download = await downloadPromise;
      
      // Optionally save the file to a specific location
      // await download.saveAs('/path/to/save/file.pdf');
      
      console.log('Download started:', await download.suggestedFilename());
      
    } catch (error) {
      console.warn('Print/download functionality may not be available or may require different handling:', error);
      
      // Fallback: just click the print button
      await this.printPlanIcon.click();
      
      // Wait a moment for any print dialog or processing
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Check if close icon is visible
   * @returns true if close icon is visible, false otherwise
   */
  async isCloseIconVisible(): Promise<boolean> {
    return await this.closeIcon.isVisible();
  }

  /**
   * Check if print plan icon is visible
   * @returns true if print plan icon is visible, false otherwise
   */
  async isPrintPlanIconVisible(): Promise<boolean> {
    return await this.printPlanIcon.isVisible();
  }

  /**
   * Check if print plan icon is enabled
   * @returns true if print plan icon is enabled, false otherwise
   */
  async isPrintPlanIconEnabled(): Promise<boolean> {
    return await this.printPlanIcon.isEnabled();
  }

  /**
   * Wait for plan details to load
   * @param timeout - Timeout in milliseconds (default: 30000)
   */
  async waitForPlanDetailsToLoad(timeout: number = 30000): Promise<void> {
    // Wait for close icon to be visible as indicator that page has loaded
    await this.closeIcon.waitFor({ state: 'visible', timeout });
    
    // Wait for print icon to be available
    await this.printPlanIcon.waitFor({ state: 'visible', timeout });
    
    // Wait for page to be fully loaded
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get plan detail content
   * @returns Plan detail content as string
   */
  async getPlanDetailContent(): Promise<string> {
    // Get the main content area of the plan details
    const contentArea = this.page.locator('.plan-content, .plan-details, .modal-body, .detail-content').first();
    
    if (await contentArea.count() > 0) {
      return await contentArea.textContent() || '';
    }
    
    // Fallback: get all visible text content
    return await this.page.locator('body').textContent() || '';
  }

  /**
   * Check if plan detail page is loaded
   * @returns true if page is loaded, false otherwise
   */
  async isPlanDetailPageLoaded(): Promise<boolean> {
    try {
      // Check if both close and print icons are visible
      const closeVisible = await this.closeIcon.isVisible();
      const printVisible = await this.printPlanIcon.isVisible();
      
      return closeVisible && printVisible;
    } catch (error) {
      return false;
    }
  }

  /**
   * Print plan using browser's print functionality
   * Alternative method for printing that uses browser's native print dialog
   */
  async printPlanNative(): Promise<void> {
    // Trigger browser's print dialog
    await this.page.evaluate(() => window.print());
    
    // Wait a moment for print dialog to appear
    await this.page.waitForTimeout(1000);
  }

  /**
   * Take screenshot of plan details
   * @param filename - Optional filename for the screenshot
   * @returns Buffer containing the screenshot data
   */
  async takeScreenshotOfPlan(filename?: string): Promise<Buffer> {
    const screenshot = await this.page.screenshot({ 
      fullPage: true,
      path: filename 
    });
    
    return screenshot;
  }

  /**
   * Get plan title if available
   * @returns Plan title or null if not found
   */
  async getPlanTitle(): Promise<string | null> {
    const titleSelectors = [
      'h1', 'h2', 'h3', 
      '.plan-title', '.modal-title', '.detail-title',
      '[class*="title"]'
    ];
    
    for (const selector of titleSelectors) {
      const titleElement = this.page.locator(selector).first();
      if (await titleElement.count() > 0 && await titleElement.isVisible()) {
        const title = await titleElement.textContent();
        if (title?.trim()) {
          return title.trim();
        }
      }
    }
    
    return null;
  }

  /**
   * Close plan detail page using keyboard shortcut
   */
  async closePlanDetailWithKeyboard(): Promise<void> {
    // Use Escape key to close
    await this.page.keyboard.press('Escape');
  }

  /**
   * Wait for plan detail page to close
   * @param timeout - Timeout in milliseconds (default: 10000)
   */
  async waitForPlanDetailToClose(timeout: number = 10000): Promise<void> {
    // Wait for close icon to disappear
    await this.closeIcon.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if page contains specific content
   * @param content - Content to search for
   * @returns true if content is found, false otherwise
   */
  async hasContent(content: string): Promise<boolean> {
    const pageContent = await this.getPlanDetailContent();
    return pageContent.includes(content);
  }

  /**
   * Get all action buttons available on the plan detail page
   * @returns Array of button texts
   */
  async getAvailableActions(): Promise<string[]> {
    const buttons = this.page.locator('button:visible');
    const count = await buttons.count();
    const actions: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const buttonText = await buttons.nth(i).textContent();
      const ariaLabel = await buttons.nth(i).getAttribute('aria-label');
      
      if (buttonText?.trim()) {
        actions.push(buttonText.trim());
      } else if (ariaLabel?.trim()) {
        actions.push(ariaLabel.trim());
      }
    }
    
    return actions;
  }
}
