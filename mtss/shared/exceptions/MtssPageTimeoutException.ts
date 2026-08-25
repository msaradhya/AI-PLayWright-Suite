/**
 * Page timeout exception for MTSS (converted from Java)
 * Enhanced for Playwright test framework support
 * @author hyders
 * @since 10/08/2020
 */
import { MtssException } from './MtssException';

export class MtssPageTimeoutException extends MtssException {
  public readonly timeoutDuration?: number;
  public readonly selector?: string;
  public readonly pageUrl?: string;

  constructor(message: string, cause?: Error, testContext?: string, options?: {
    timeoutDuration?: number;
    selector?: string;
    pageUrl?: string;
  }) {
    super(message, cause, testContext);
    this.name = 'MtssPageTimeoutException';
    this.timeoutDuration = options?.timeoutDuration;
    this.selector = options?.selector;
    this.pageUrl = options?.pageUrl;
  }

  /**
   * Create a timeout exception with Playwright-specific context
   * @param message Error message
   * @param timeoutDuration The timeout duration that was exceeded
   * @param selector The selector that timed out (optional)
   * @param pageUrl The current page URL (optional)
   * @param testContext Test context for debugging
   * @param cause Optional underlying cause
   */
  static forPlaywright(
    message: string,
    timeoutDuration: number,
    selector?: string,
    pageUrl?: string,
    testContext?: string,
    cause?: Error
  ): MtssPageTimeoutException {
    const enhancedMessage = MtssPageTimeoutException.buildTimeoutMessage(message, timeoutDuration, selector, pageUrl);
    return new MtssPageTimeoutException(enhancedMessage, cause, testContext, {
      timeoutDuration,
      selector,
      pageUrl
    });
  }

  /**
   * Create a selector timeout exception
   * @param selector The selector that timed out
   * @param timeoutDuration The timeout duration
   * @param pageUrl Current page URL
   * @param testContext Test context
   */
  static forSelector(
    selector: string,
    timeoutDuration: number,
    pageUrl?: string,
    testContext?: string
  ): MtssPageTimeoutException {
    const message = `Timeout waiting for selector: ${selector}`;
    return MtssPageTimeoutException.forPlaywright(message, timeoutDuration, selector, pageUrl, testContext);
  }

  /**
   * Create a page load timeout exception
   * @param pageUrl The URL that failed to load
   * @param timeoutDuration The timeout duration
   * @param testContext Test context
   */
  static forPageLoad(
    pageUrl: string,
    timeoutDuration: number,
    testContext?: string
  ): MtssPageTimeoutException {
    const message = `Timeout waiting for page to load: ${pageUrl}`;
    return MtssPageTimeoutException.forPlaywright(message, timeoutDuration, undefined, pageUrl, testContext);
  }

  private static buildTimeoutMessage(
    baseMessage: string,
    timeoutDuration: number,
    selector?: string,
    pageUrl?: string
  ): string {
    let message = `${baseMessage} (timeout: ${timeoutDuration}ms)`;
    if (selector) message += ` - Selector: ${selector}`;
    if (pageUrl) message += ` - Page: ${pageUrl}`;
    return message;
  }

  /**
   * Get detailed error information for test reporting
   */
  getTimeoutDetails(): {
    message: string;
    timeoutDuration?: number;
    selector?: string;
    pageUrl?: string;
    timestamp: string;
    testContext?: string;
  } {
    return {
      message: this.message,
      timeoutDuration: this.timeoutDuration,
      selector: this.selector,
      pageUrl: this.pageUrl,
      timestamp: this.timestamp,
      testContext: this.testContext
    };
  }
}
