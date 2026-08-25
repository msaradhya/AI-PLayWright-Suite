import { Page } from '@playwright/test';
import { ConfigManager, FeatureFlags } from '../../config/ConfigManager';

/**
 * Helper class for Hoonuit SIS Integration project
 * Provides configuration and credential management utilities
 *
 * Now uses ConfigManager as the single source of truth for all configuration.
 */
export class HoonuitSisHelper {
    protected page: Page;
    private static config = ConfigManager.getInstance();

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get the base URL for the specified environment
     * @param environmentName - Optional environment name (will set environment if provided)
     * @returns Base URL for the environment
     */
    static getBaseUrl(environmentName?: string): string {
        if (environmentName) {
            this.config.setEnvironment(environmentName);
        }
        return this.config.getBaseUrl();
    }

    /**
     * Get the maintenance URL for the specified environment
     * @param environmentName - Optional environment name (will set environment if provided)
     * @returns Maintenance URL for the environment
     */
    static getMaintenanceUrl(environmentName?: string): string {
        if (environmentName) {
            this.config.setEnvironment(environmentName);
        }
        return this.config.getMaintenanceUrl();
    }

    /**
     * Get user credentials based on user key
     * @param userKey - Optional user key (defaults to 'adminUser')
     * @returns Object containing username and password
     */
    static getUserCredentials(userKey?: string): { username: string; password: string } {
        const credentials = this.config.getUserCredentials(userKey || 'adminUser');
        return {
            username: credentials.username,
            password: credentials.password
        };
    }

    /**
     * Get feature configuration value
     * @param featureKey - Feature configuration key
     * @param defaultValue - Default value if feature is not configured
     * @returns Feature configuration value
     */
    static getFeatureConfig(featureKey: keyof FeatureFlags, defaultValue?: any): any {
        const flags = this.config.getFeatureFlags();
        return flags[featureKey] ?? defaultValue;
    }

    /**
     * Check if Angular wait is enabled
     * @returns Boolean indicating if Angular wait is enabled
     */
    static isAngularWaitEnabled(): boolean {
        return this.config.getFeatureFlags().enableAngularWait;
    }

    /**
     * Check if spinner wait is enabled
     * @returns Boolean indicating if spinner wait is enabled
     */
    static isSpinnerWaitEnabled(): boolean {
        return this.config.getFeatureFlags().enableSpinnerWait;
    }

    /**
     * Get default timeout value
     * @returns Default timeout in milliseconds
     */
    static getDefaultTimeout(): number {
        return this.config.getFeatureFlags().defaultTimeout;
    }

    /**
     * Wait for page to load with Angular and spinner handling
     */
    async waitForPageToLoad(): Promise<void> {
        try {
            // Wait for network to be idle
            await this.page.waitForLoadState('networkidle');
            
            // Wait for Angular if enabled
            if (HoonuitSisHelper.isAngularWaitEnabled()) {
                await this.waitForAngularToFinish();
            }
            
            // Wait for spinners if enabled
            if (HoonuitSisHelper.isSpinnerWaitEnabled()) {
                await this.waitForSpinnerToDisappear();
            }
            
        } catch (error) {
            console.warn('Page load wait warning:', error);
            // Continue execution even if wait fails
        }
    }

    /**
     * Wait for Angular to finish loading
     */
    async waitForAngularToFinish(): Promise<void> {
        try {
            await this.page.waitForFunction(() => {
                return document.readyState === 'complete' && 
                       (typeof (window as any).angular === 'undefined' && 
                        (typeof (window as any).ng === 'undefined' || typeof (window as any).ng.probe === 'undefined'));
            }, { timeout: 60000 });
            
            await this.page.waitForTimeout(300);
            
        } catch (error) {
            console.warn('Angular wait timeout:', error);
        }
    }

    /**
     * Wait for spinners to disappear
     */
    async waitForSpinnerToDisappear(): Promise<void> {
        try {
            const pageSpinner = this.page.locator('div#loading-bar-spinner');
            await pageSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
            
            const mtssSpinner = this.page.locator('div[class="ngx-spinner-icon"]');
            await mtssSpinner.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
            
        } catch (error) {
            console.warn('Spinner wait timeout:', error);
        }
    }
}