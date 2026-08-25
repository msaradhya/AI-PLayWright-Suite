/**
 * UIHN Base Exception Class
 * Custom exception for UIHN-specific errors
 * 
 * @author Converted from HoonuitException.java
 * @since 2021-04-07
 */
export class HoonuitException extends Error {
    constructor(message: string, cause?: Error) {
        super(message);
        this.name = 'HoonuitException';
        
        if (cause) {
            this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        }
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HoonuitException);
        }
    }
}