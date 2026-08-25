import { HoonuitException } from './hoonuit-exception';

/**
 * UIHN Page Timeout Exception
 * Thrown when page loading or element waiting times out
 * 
 * @author Converted from HoonuitPageTimeoutException.java
 * @since 2021-04-12
 */
export class HoonuitPageTimeoutException extends HoonuitException {
    constructor(message: string) {
        super(message);
        this.name = 'HoonuitPageTimeoutException';
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HoonuitPageTimeoutException);
        }
    }
}