/**
 * Hoonuit Shared API Module Exports
 * Index file for easy importing of API-related classes
 *
 * This module provides TypeScript equivalents of Java API classes
 * for Playwright test automation, maintaining the same patterns
 * and functionality as the original Java implementation.
 * 
 * Adapted for PW_hoonuit_sis_integration project
 */

// API Helpers and Configuration
export { HoonuitApiHelper } from './hoonuitApiHelper';
export { HoonuitAuthApiRequest } from './hoonuitAuthApiRequest';
export { HoonuitApiConfig } from './hoonuitApiConfig';
export { HoonuitApiTestUtils } from './hoonuitApiTestUtils';

// Import for local usage in this file
import { HoonuitApiHelper } from './hoonuitApiHelper';
import { HoonuitAuthApiRequest } from './hoonuitAuthApiRequest';
import { HoonuitApiConfig } from './hoonuitApiConfig';
import { HoonuitApiTestUtils } from './hoonuitApiTestUtils';

// Type definitions and interfaces
export type { RequestSpecification, ResponseSpecification } from './hoonuitApiHelper';
export type { OAuthTokenResponse } from './hoonuitAuthApiRequest';
export type { ApiTimeoutConfig, ApiRetryConfig } from './hoonuitApiConfig';
export type { ApiTestValidation, ApiRetryPolicy } from './hoonuitApiTestUtils';

// Re-export exceptions for convenience
export { HoonuitApiException } from '../exceptions/HoonuitApiException';

/**
 * Combined API client type for convenient usage
 */
export type HoonuitApiClient = {
  helper: typeof HoonuitApiHelper;
  auth: HoonuitAuthApiRequest;
  config: typeof HoonuitApiConfig;
  testUtils: typeof HoonuitApiTestUtils;
};

/**
 * Factory function to create a complete API client instance
 * @returns Object containing all API utilities
 */
export function createHoonuitApiClient(): HoonuitApiClient {
  return {
    helper: HoonuitApiHelper,
    auth: new HoonuitAuthApiRequest(),
    config: HoonuitApiConfig,
    testUtils: HoonuitApiTestUtils
  };
}

/**
 * Utility function to validate API configuration before running tests
 * @throws Error if configuration is invalid
 */
export function validateApiConfiguration(): void {
  HoonuitApiConfig.validateConfiguration();
}