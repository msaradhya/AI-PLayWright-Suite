/**
 * Hoonuit Dialog Timeout Exception
 * Converted from Java to TypeScript for Playwright
 * Original author: Sourav.Panda
 * Since: 4/16/2021
 */

import { HoonuitException } from './HoonuitException';

/**
 * Exception class for dialog timeout errors
 * Extends HoonuitException to maintain inheritance hierarchy
 */
export class HoonuitDialogTimeoutException extends HoonuitException {
  public dialogName?: string;
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
  constructor(message: string, cause: Error);
  
  /**
   * Constructor with message, dialog name, and timeout
   * @param message - Error message
   * @param dialogName - Name of the dialog that timed out
   * @param timeout - Timeout duration in milliseconds
   */
  constructor(message: string, dialogName: string, timeout: number);
  
  /**
   * Constructor with all parameters
   * @param message - Error message
   * @param dialogName - Name of the dialog that timed out
   * @param timeout - Timeout duration in milliseconds
   * @param cause - Underlying error cause
   */
  constructor(message: string, dialogName: string, timeout: number, cause: Error);
  
  constructor(message: string, dialogNameOrCause?: string | Error, timeout?: number, cause?: Error) {
    // Handle different constructor signatures
    if (typeof dialogNameOrCause === 'string') {
      if (cause) {
        super(message, cause);
      } else {
        super(message);
      }
      this.dialogName = dialogNameOrCause;
      this.timeout = timeout;
    } else if (dialogNameOrCause instanceof Error) {
      super(message, dialogNameOrCause);
    } else {
      super(message);
    }
    
    this.name = 'HoonuitDialogTimeoutException';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HoonuitDialogTimeoutException);
    }
  }
}