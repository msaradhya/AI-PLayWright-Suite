/**
 * Hoonuit Table Exception
 * Converted from Java to TypeScript for Playwright
 * Original author: Sourav.Panda
 * Since: 4/14/2021
 */

import { HoonuitException } from './HoonuitException';

/**
 * Exception class for table-related errors
 * Extends HoonuitException to maintain inheritance hierarchy
 */
export class HoonuitTableException extends HoonuitException {
  public tableName?: string;
  
  /**
   * Constructor with message only (matches Java source pattern)
   * @param message - Error message
   */
  constructor(message: string);
  
  /**
   * Constructor with message and table name
   * @param message - Error message
   * @param tableName - Name of the table where error occurred
   */
  constructor(message: string, tableName: string);
  
  /**
   * Constructor with message, table name, and cause
   * @param message - Error message
   * @param tableName - Name of the table where error occurred
   * @param cause - Underlying error cause
   */
  constructor(message: string, tableName: string, cause: Error);
  
  constructor(message: string, tableNameOrCause?: string | Error, cause?: Error) {
    // Handle different constructor signatures
    if (typeof tableNameOrCause === 'string') {
      if (cause) {
        super(message, cause);
      } else {
        super(message);
      }
      this.tableName = tableNameOrCause;
    } else if (tableNameOrCause instanceof Error) {
      super(message, tableNameOrCause);
    } else {
      super(message);
    }
    
    this.name = 'HoonuitTableException';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HoonuitTableException);
    }
  }
}