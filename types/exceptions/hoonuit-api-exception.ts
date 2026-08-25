/**
 * UIHN API Exception Class
 * Custom exception for API-related errors
 * Note: Extends Error directly (not HoonuitException) to match Java RuntimeException pattern
 * 
 * @author Converted from HoonuitApiException.java
 */
export class HoonuitApiException extends Error {
    constructor(message: string, cause?: Error) {
        super(message);
        this.name = 'HoonuitApiException';
        
        if (cause) {
            this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        }
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HoonuitApiException);
        }
    }
}