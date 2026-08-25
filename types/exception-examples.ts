/**
 * Exception Usage Examples and Tests
 * Demonstrates proper usage of the Hoonuit exception hierarchy
 * 
 * @author Converted from Java patterns
 */

import {
    HoonuitException,
    HoonuitApiException,
    HoonuitPageTimeoutException,
    HoonuitDialogTimeoutException,
    HoonuitTableException
} from './index';

/**
 * Example usage patterns for Hoonuit exceptions
 */
export class ExceptionExamples {
    
    /**
     * Example: API request failure
     */
    static demonstrateApiException(): void {
        try {
            // Simulate API failure
            throw new HoonuitApiException('OAuth token request failed', new Error('Network timeout'));
        } catch (error) {
            console.log('Caught API exception:', error.message);
        }
    }
    
    /**
     * Example: Page loading timeout
     */
    static demonstratePageTimeoutException(): void {
        try {
            // Simulate page timeout
            throw new HoonuitPageTimeoutException('Page failed to load within 30 seconds');
        } catch (error) {
            console.log('Caught page timeout:', error.message);
        }
    }
    
    /**
     * Example: Dialog interaction timeout
     */
    static demonstrateDialogTimeoutException(): void {
        try {
            // Simulate dialog timeout
            throw new HoonuitDialogTimeoutException('Save confirmation dialog did not appear');
        } catch (error) {
            console.log('Caught dialog timeout:', error.message);
        }
    }
    
    /**
     * Example: Table/grid operation failure
     */
    static demonstrateTableException(): void {
        try {
            // Simulate table interaction failure
            throw new HoonuitTableException('Unable to find row with student ID: 12345');
        } catch (error) {
            console.log('Caught table exception:', error.message);
        }
    }
    
    /**
     * Example: Generic framework exception
     */
    static demonstrateGenericException(): void {
        try {
            // Simulate generic framework error
            throw new HoonuitException('Unexpected navigation state detected');
        } catch (error) {
            console.log('Caught generic exception:', error.message);
        }
    }
    
    /**
     * Example: Exception type checking
     */
    static demonstrateExceptionTypeChecking(): void {
        const exceptions = [
            new HoonuitApiException('API error'),
            new HoonuitPageTimeoutException('Page timeout'),
            new HoonuitDialogTimeoutException('Dialog timeout'),
            new HoonuitTableException('Table error'),
            new HoonuitException('Generic error')
        ];
        
        exceptions.forEach(exception => {
            console.log(`Exception type: ${exception.name}, Message: ${exception.message}`);
            
            // Type checking examples
            if (exception instanceof HoonuitApiException) {
                console.log('  -> Handle as API exception');
            } else if (exception instanceof HoonuitPageTimeoutException) {
                console.log('  -> Handle as page timeout');
            } else if (exception instanceof HoonuitDialogTimeoutException) {
                console.log('  -> Handle as dialog timeout');  
            } else if (exception instanceof HoonuitTableException) {
                console.log('  -> Handle as table exception');
            } else if (exception instanceof HoonuitException) {
                console.log('  -> Handle as generic framework exception');
            }
        });
    }
}