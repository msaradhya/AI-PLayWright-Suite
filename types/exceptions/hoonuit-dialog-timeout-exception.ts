import { HoonuitException } from './hoonuit-exception';

/**
 * UIHN Dialog Timeout Exception
 * Thrown when dialog operations time out
 * 
 * @author Converted from HoonuitDialogTimeoutException.java
 * @since 2021-04-16
 */
export class HoonuitDialogTimeoutException extends HoonuitException {
    constructor(message: string) {
        super(message);
        this.name = 'HoonuitDialogTimeoutException';
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HoonuitDialogTimeoutException);
        }
    }
}