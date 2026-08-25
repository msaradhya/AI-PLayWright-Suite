/**
 * Hoonuit Exception
 * Converted from Java to TypeScript for Playwright
 * Original author: Sourav.Panda
 * Since: 4/7/2021
 */

/**
 * Base exception class for Hoonuit-related errors
 * Extends Error to match Java RuntimeException behavior
 */
export class HoonuitException extends Error {
  public cause?: Error;
  
  /**
   * Constructor with message only
   * @param message - Error message
   */
  constructor(message: string);
  
  /**
   * Constructor with message and cause
   * @param message - Error message
   * @param cause - Underlying error cause
   */
  constructor(message: string, cause?: Error);
  
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'HoonuitException';
    
    // Set the cause if provided (matching Java pattern)
    if (cause) {
      this.cause = cause;
      // Append cause stack trace to current stack trace
      if (cause.stack) {
        this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
      }
    }
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HoonuitException);
    }
  }
}