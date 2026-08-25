import { Page } from '@playwright/test';
import { HoonuitException } from '../exceptions/HoonuitException';

/**
 * Enum for batch status values
 */
export enum BatchStatus {
  TASK_QUEUED = 'TASK QUEUED',
  PROCESSING_ERROR = 'PROCESSING ERROR',
  NEEDS_ATTENTION = 'NEEDS ATTENTION',
  COMPLETED = 'COMPLETED',
  RUNNING = 'RUNNING'
}

/**
 * Hoonuit ETL Helper
 * Helper class for ETL operations in Hoonuit
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
export class HoonuitEtlHelper {

  /**
   * Trigger run staging on batch
   * @param page Playwright page object
   * @param batchName Name of the batch
   * @param expectedStatus Expected status after operation
   */
  static async triggerRunStagingOnBatch(page: Page, batchName: string, expectedStatus: string): Promise<void> {
    try {
      // Select the batch and trigger run staging
      await page.selectOption('[data-testid="batch-dropdown"]', 'Run Staging on Batch');
      await page.click('[data-testid="confirm-yes-button"]');
      
      // Wait for page to load
      await this.waitForPageToLoad(page);
      
      // Wait for status update
      await this.waitForStatusUpdate(page, batchName, expectedStatus);
    } catch (error) {
      console.error('Error triggering run staging on batch:', error);
      throw error;
    }
  }

  /**
   * Trigger run process on batch
   * @param page Playwright page object
   * @param batchName Name of the batch
   * @param expectedStatus Expected status after operation
   */
  static async triggerRunProcessOnBatch(page: Page, batchName: string, expectedStatus: string): Promise<void> {
    try {
      // Select the batch and trigger run process
      await page.selectOption('[data-testid="batch-dropdown"]', 'Run Process on Batch');
      await page.click('[data-testid="confirm-yes-button"]');
      
      // Wait for page to load
      await this.waitForPageToLoad(page);
      
      // Wait for status update
      await this.waitForStatusUpdate(page, batchName, expectedStatus);
    } catch (error) {
      console.error('Error triggering run process on batch:', error);
      throw error;
    }
  }

  /**
   * Delete a batch
   * @param page Playwright page object
   * @param batchName Name of the batch to delete
   */
  static async deleteBatch(page: Page, batchName: string): Promise<void> {
    try {
      // Select the batch and trigger delete
      await page.selectOption('[data-testid="batch-dropdown"]', 'Delete Batch');
      await page.click('[data-testid="confirm-yes-button"]');
      
      // Wait for page to load
      await this.waitForPageToLoad(page);
      
      // Enter batch name for confirmation
      await page.fill('[data-testid="batch-name-input"]', batchName);
      
      // Wait for status update
      await this.waitForStatusUpdate(page, batchName, BatchStatus.TASK_QUEUED);
    } catch (error) {
      console.error('Error deleting batch:', error);
      throw error;
    }
  }

  /**
   * Wait for status update with timeout
   * @param page Playwright page object
   * @param batchName Name of the batch
   * @param expectedStatus Expected status
   */
  private static async waitForStatusUpdate(page: Page, batchName: string, expectedStatus: string): Promise<void> {
    const maxAttempts = 240; // 20 minutes with 5 second intervals
    const waitInterval = 5000; // 5 seconds

    await page.waitForTimeout(waitInterval);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Refresh the page/data
        await page.click('[data-testid="refresh-button"]');
        await this.waitForPageToLoad(page);
        
        // Enter batch name to filter
        await page.fill('[data-testid="batch-name-input"]', batchName);
        
        // Get current status
        const currentStatus = await page.textContent('[data-testid="batch-status"]');
        
        if (currentStatus?.trim() === expectedStatus.trim()) {
          return; // Success
        } else if (currentStatus === BatchStatus.PROCESSING_ERROR || currentStatus === BatchStatus.NEEDS_ATTENTION) {
          throw new HoonuitException(`ETL process aborted due to ${currentStatus.trim()}`);
        }
        
        await page.waitForTimeout(waitInterval);
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw new HoonuitException('The ETL Process exceeded the time limit of 20 minutes');
        }
      }
    }
    
    throw new HoonuitException('The ETL Process exceeded the time limit of 20 minutes');
  }

  /**
   * Wait for batch to be deleted
   * @param page Playwright page object
   * @param batchName Name of the batch
   */
  static async waitForBatchDeleted(page: Page, batchName: string): Promise<void> {
    const maxAttempts = 240; // 20 minutes with 5 second intervals
    const waitInterval = 5000; // 5 seconds

    await page.waitForTimeout(waitInterval);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Refresh the page/data
        await page.click('[data-testid="refresh-button"]');
        await this.waitForPageToLoad(page);
        
        // Check if batch is still present
        const batchExists = await page.isVisible(`[data-batch-name="${batchName}"]`);
        
        if (!batchExists) {
          return; // Batch successfully deleted
        }
        
        // If batch still exists, check its status
        const batchStatus = await page.textContent(`[data-batch-name="${batchName}"] [data-testid="batch-status"]`);
        if (batchStatus === BatchStatus.PROCESSING_ERROR || batchStatus === BatchStatus.NEEDS_ATTENTION) {
          throw new HoonuitException('ETL process aborted due to processing error');
        }
        
        await page.waitForTimeout(waitInterval);
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw new HoonuitException('The ETL Process exceeded the time limit of 20 minutes');
        }
      }
    }
    
    throw new HoonuitException('The ETL Process exceeded the time limit of 20 minutes');
  }

  /**
   * Get batch status
   * @param page Playwright page object
   * @param batchName Name of the batch
   * @returns Current batch status
   */
  static async getBatchStatus(page: Page, batchName: string): Promise<string> {
    await this.waitForPageToLoad(page);
    
    const status = await page.textContent(`[data-batch-name="${batchName}"] [data-testid="batch-status"]`);
    return status?.trim() || '';
  }

  /**
   * Navigate to batch page
   * @param page Playwright page object
   */
  static async navigateToBatchPage(page: Page): Promise<void> {
    const baseUrl = process.env.BASE_URL || '';
    const destination = `${baseUrl}/module-resource/assessments-importer/assessment-in-system`;
    
    await page.goto(destination);
    await this.waitForPageToLoad(page);
  }

  /**
   * Navigate to PS6 batch page
   * @param page Playwright page object
   */
  static async navigateToPS6BatchPage(page: Page): Promise<void> {
    const ps6Url = process.env.PS6_URL || '';
    const destination = `${ps6Url}/module-resource/assessments-importer/assessment-in-system`;
    
    await page.goto(destination);
    await this.waitForPageToLoad(page);
  }

  /**
   * Wait for page to load completely
   * @param page Playwright page object
   */
  private static async waitForPageToLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Additional wait for any dynamic content
  }

  /**
   * Check if batch exists
   * @param page Playwright page object
   * @param batchName Name of the batch
   * @returns True if batch exists
   */
  static async batchExists(page: Page, batchName: string): Promise<boolean> {
    await this.waitForPageToLoad(page);
    return await page.isVisible(`[data-batch-name="${batchName}"]`);
  }

  /**
   * Get all batch names
   * @param page Playwright page object
   * @returns Array of batch names
   */
  static async getAllBatchNames(page: Page): Promise<string[]> {
    await this.waitForPageToLoad(page);
    const batchElements = page.locator('[data-batch-name]');
    const count = await batchElements.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await batchElements.nth(i).getAttribute('data-batch-name');
      if (name) {
        names.push(name);
      }
    }
    
    return names;
  }
}