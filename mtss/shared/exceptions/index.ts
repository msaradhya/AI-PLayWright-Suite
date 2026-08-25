/**
 * MTSS Exception Types - Index File
 * Provides centralized exports for all MTSS exception classes
 * Enhanced for Playwright test framework support
 * @author hyders
 * @since 10/08/2020
 */

// Import the classes for internal use
import { MtssException } from './MtssException';
import { MtssPageTimeoutException } from './MtssPageTimeoutException';
import { MtssTableException } from './MtssTableException';

// Export the classes for external use
export { MtssException } from './MtssException';
export { MtssPageTimeoutException } from './MtssPageTimeoutException';
export { MtssTableException } from './MtssTableException';

// Type definitions for better TypeScript support
export type ExceptionContext = {
  testName?: string;
  pageUrl?: string;
  timestamp?: string;
  additionalInfo?: Record<string, any>;
};

export type TimeoutExceptionOptions = {
  timeoutDuration?: number;
  selector?: string;
  pageUrl?: string;
};

export type TableExceptionOptions = {
  tableSelector?: string;
  expectedRowCount?: number;
  actualRowCount?: number;
  columnName?: string;
  searchCriteria?: string;
  pageUrl?: string;
};

/**
 * Utility functions for exception handling in Playwright tests
 */
export class MtssExceptionUtils {
  /**
   * Create a standardized test context string
   * @param testName The name of the test
   * @param action The action being performed
   * @param pageUrl Optional page URL
   */
  static createTestContext(testName: string, action: string, pageUrl?: string): string {
    const parts = [testName, action];
    if (pageUrl) parts.push(`URL: ${pageUrl}`);
    return parts.join(' | ');
  }

  /**
   * Extract error details for test reporting
   * @param error The error to extract details from
   */
  static extractErrorDetails(error: Error): {
    name: string;
    message: string;
    timestamp?: string;
    testContext?: string;
    additionalDetails?: Record<string, any>;
  } {
    const details: any = {
      name: error.name,
      message: error.message
    };

    if (error instanceof MtssException) {
      details.timestamp = error.timestamp;
      details.testContext = error.testContext;
    }

    if (error instanceof MtssPageTimeoutException) {
      details.additionalDetails = error.getTimeoutDetails();
    }

    if (error instanceof MtssTableException) {
      details.additionalDetails = error.getTableDetails();
    }

    return details;
  }

  /**
   * Format an error for console logging
   * @param error The error to format
   */
  static formatErrorForConsole(error: Error): string {
    const details = this.extractErrorDetails(error);
    let formatted = `[${details.name}] ${details.message}`;
    
    if (details.timestamp) {
      formatted = `[${details.timestamp}] ${formatted}`;
    }
    
    if (details.testContext) {
      formatted = `[${details.testContext}] ${formatted}`;
    }

    return formatted;
  }

  /**
   * Create a comprehensive error report for test failures
   * @param error The error to create a report for
   */
  static createErrorReport(error: Error): {
    summary: string;
    details: Record<string, any>;
    formatted: string;
  } {
    const details = this.extractErrorDetails(error);
    
    return {
      summary: `${details.name}: ${details.message}`,
      details,
      formatted: this.formatErrorForConsole(error)
    };
  }
}