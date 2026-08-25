/**
 * Hoonuit Page Timeout Exception
 * Converted from Java to TypeScript for Playwright
 * Original author: amittiwari
 * Since: 12/04/21
 */

import { HoonuitException } from './HoonuitException';

/**
 * Exception class for page timeout errors
 * Extends HoonuitException to maintain inheritance hierarchy
 */
export class HoonuitPageTimeoutException extends HoonuitException {
  public pageName?: string;
  public pageUrl?: string;
  public timeout?: number;
  
  /**
   * Constructor with message only (matches Java source pattern)
   * @param message - Error message
   */
  constructor(message: string);
  
  /**
   * Constructor with message and cause (for consistency with base class)
   * @param message - Error message
   * @param cause - Underlying error cause
   */
  constructor(message: string, cause?: Error);
  
  /**
   * Constructor with message, page name, and timeout
   * @param message - Error message
   * @param pageName - Name of the page that timed out
   * @param timeout - Timeout duration in milliseconds
   */
  constructor(message: string, pageName: string, timeout: number);
  
  /**
   * Constructor with message, page details, and timeout
   * @param message - Error message
   * @param pageName - Name of the page that timed out
   * @param pageUrl - URL of the page that timed out
   * @param timeout - Timeout duration in milliseconds
   */
  constructor(message: string, pageName: string, pageUrl: string, timeout: number);
  
  /**
   * Constructor with all parameters including cause
   * @param message - Error message
   * @param pageName - Name of the page that timed out
   * @param pageUrl - URL of the page that timed out
   * @param timeout - Timeout duration in milliseconds
   * @param cause - Underlying error cause
   */
  constructor(message: string, pageName: string, pageUrl: string, timeout: number, cause: Error);
  
  constructor(
    message: string,
    pageNameOrCause?: string | Error,
    pageUrlOrTimeout?: string | number,
    timeoutOrCause?: number | Error,
    cause?: Error
  ) {
    // Handle different constructor signatures
    if (typeof pageNameOrCause === 'string') {
      if (cause) {
        super(message, cause);
      } else if (timeoutOrCause instanceof Error) {
        super(message, timeoutOrCause);
      } else {
        super(message);
      }
      this.pageName = pageNameOrCause;
      
      if (typeof pageUrlOrTimeout === 'string') {
        this.pageUrl = pageUrlOrTimeout;
        if (typeof timeoutOrCause === 'number') {
          this.timeout = timeoutOrCause;
        }
      } else if (typeof pageUrlOrTimeout === 'number') {
        this.timeout = pageUrlOrTimeout;
      }
    } else if (pageNameOrCause instanceof Error) {
      super(message, pageNameOrCause);
    } else {
      super(message);
    }
    
    this.name = 'HoonuitPageTimeoutException';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HoonuitPageTimeoutException);
    }
  }
}