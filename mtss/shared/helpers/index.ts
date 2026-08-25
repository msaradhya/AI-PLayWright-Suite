/**
 * MTSS Shared Helpers Index
 * Exports all helper classes for easy importing
 * @author Multiple Contributors
 * @since 10/05/2023 (Converted to TypeScript/Playwright)
 */

import type { Page, BrowserContext, APIRequestContext } from '@playwright/test';
import { MTSSCleanUp } from './MTSSCleanUp';
import { MtssHelper } from './MtssHelper';
import { MtssApiHelper } from './MtssApiHelper';
import { MtssUsers } from '../users/MtssUsers';

// Main helper classes
export { MTSSCleanUp } from './MTSSCleanUp';
export { MtssHelper } from './MtssHelper';
export { MtssApiHelper } from './MtssApiHelper';

// User management
export { MtssUsers } from '../users/MtssUsers';

// Re-export commonly used types from Playwright for convenience
export type { Page, BrowserContext, APIRequestContext };

/**
 * Helper function to initialize all MTSS helpers with a page context
 * @param page Playwright Page object
 * @param context Playwright Browser Context
 * @returns Object containing all initialized helpers
 */
export function initializeMtssHelpers(page: Page, context: BrowserContext) {
  // Initialize default users for the session
  MtssUsers.initializeDefaultUsers();
  
  return {
    mtssHelper: MtssHelper,
    mtssApiHelper: MtssApiHelper,
    mtssCleanUp: MTSSCleanUp,
    mtssUsers: MtssUsers,
    page,
    context
  };
}

/**
 * Common configuration interface for MTSS helpers
 */
export interface MtssConfig {
  baseUrl?: string;
  maintenanceUrl?: string;
  multiTenantMaintenanceUrl?: string;
  apiBaseUrl?: string;
  defaultTimeout?: number;
  maxRetries?: number;
}

/**
 * Set global configuration for MTSS helpers
 * @param config Configuration object
 */
export function configureMtss(config: MtssConfig): void {
  if (config.baseUrl || config.maintenanceUrl || config.multiTenantMaintenanceUrl) {
    MtssHelper.setRuntimeConfig({
      url: config.baseUrl,
      maintenanceUrl: config.maintenanceUrl,
      multiTenantMaintenanceUrl: config.multiTenantMaintenanceUrl
    });
  }
}