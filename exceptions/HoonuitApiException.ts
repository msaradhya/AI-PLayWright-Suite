/**
 * Hoonuit API Exception
 * Converted from Java to TypeScript for Playwright
 * Custom exception for API-related errors
 * 
 * Note: In Java, this extends RuntimeException directly (not HoonuitException)
 * This is equivalent to extending Error directly in TypeScript
 */

/**
 * Custom exception class for Hoonuit API errors
 * Extends Error directly to match Java RuntimeException inheritance pattern
 */
export class HoonuitApiException extends Error {
  public cause?: Error;
  public statusCode?: number;
  public response?: any;
  
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
  constructor(message: string, cause: Error);
  
  /**
   * Constructor with message, status code, and optional response
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param response - API response body
   */
  constructor(message: string, statusCode: number, response?: any);
  
  /**
   * Constructor with all parameters
   * @param message - Error message
   * @param statusCode - HTTP status code
   * @param response - API response body
   * @param cause - Underlying error cause
   */
  constructor(message: string, statusCode: number, response: any, cause: Error);
  
  constructor(message: string, statusCodeOrCause?: number | Error, response?: any, cause?: Error) {
    super(message);
    this.name = 'HoonuitApiException';
    
    // Handle different constructor signatures
    if (typeof statusCodeOrCause === 'number') {
      this.statusCode = statusCodeOrCause;
      this.response = response;
      if (cause) {
        this.cause = cause;
      }
    } else if (statusCodeOrCause instanceof Error) {
      this.cause = statusCodeOrCause;
    }
    
    // Append cause stack trace if present
    if (this.cause && this.cause.stack) {
      this.stack = `${this.stack}\nCaused by: ${this.cause.stack}`;
    }
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HoonuitApiException);
    }
  }
}