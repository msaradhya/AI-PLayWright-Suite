import { HoonuitException } from './hoonuit-exception';

/**
 * UIHN Table Exception
 * Thrown when table operations encounter errors
 * 
 * @author Converted from HoonuitTableException.java
 * @since 2021-04-14
 */
export class HoonuitTableException extends HoonuitException {
    constructor(message: string) {
        super(message);
        this.name = 'HoonuitTableException';
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HoonuitTableException);
        }
    }
}