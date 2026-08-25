// HoonuitDialogTimeoutException.ts
// Custom exception for dialog timeout scenarios in Hoonuit dialogs

export class HoonuitDialogTimeoutException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HoonuitDialogTimeoutException';
    }
}
