/**
 * Custom exception for MTSS (converted from Java)
 * Enhanced for Playwright test framework support
 * @author hyders
 * @since 10/08/2020
 */
export class MtssException extends Error {
  public readonly timestamp: string;
  public readonly testContext?: string;

  constructor(message: string, public cause?: Error, testContext?: string) {
    super(message);
    this.name = 'MtssException';
    this.timestamp = new Date().toISOString();
    this.testContext = testContext;
    
    // Enhanced stack trace with cause information
    if (cause) {
      this.stack += '\nCaused by: ' + cause.stack;
    }
    
    // Add test context to error message for better debugging
    if (testContext) {
      this.message = `[${testContext}] ${message}`;
    }
  }

  /**
   * Create an MtssException with test context for Playwright tests
   * @param message Error message
   * @param testContext Test context (e.g., test name, page object, action)
   * @param cause Optional underlying cause
   */
  static withTestContext(message: string, testContext: string, cause?: Error): MtssException {
    return new MtssException(message, cause, testContext);
  }

  /**
   * Get a formatted error message for test reporting
   */
  getTestErrorMessage(): string {
    const contextPart = this.testContext ? `[${this.testContext}] ` : '';
    const timePart = `[${this.timestamp}] `;
    return `${timePart}${contextPart}${this.message}`;
  }
}
