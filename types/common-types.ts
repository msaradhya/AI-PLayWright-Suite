/**
 * Common enums and types for UIHN Playwright automation
 */

export enum CardBackgroundColor {
    RED = 'rgb(203, 16, 16)',
    GREEN = 'rgb(82, 186, 43)',
    YELLOW = 'rgb(249, 206, 51)'
}

export enum BatchStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum TenantEnvironment {
    AUTO_BRONZE = 'auto_bronze',
    AUTO_AWS_BRONZE = 'auto_aws_bronze'
}

export interface UserCredentials {
    username: string;
    password: string;
}

export interface AlertMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}