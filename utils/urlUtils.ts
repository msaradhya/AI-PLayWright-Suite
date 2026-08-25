/**
 * URL utilities for retrieving environment-specific URLs
 *
 * Updated to use ConfigManager as the single source of truth
 */

import { ConfigManager, EnvironmentConfig } from '../config/ConfigManager';

const config = ConfigManager.getInstance();

/**
 * Get a specific URL for an environment
 * @param envType - Environment type (e.g., 'auto_aws_bronze', 'auto_silver')
 * @param urlKey - The key of the URL to retrieve (e.g., 'url', 'maintenance_url')
 * @returns The URL string or undefined if not found
 */
export function getEnvironmentUrl(envType: string, urlKey: string): string | undefined {
  const envUrls = config.getEnvironmentUrls(envType);
  return envUrls[urlKey];
}

/**
 * Get the main URL for an environment
 * @param envType - Environment type
 * @returns The main URL
 */
export function getMainUrl(envType: string): string {
  return getEnvironmentUrl(envType, 'url') || '';
}

/**
 * Get the maintenance URL for an environment
 * @param envType - Environment type
 * @returns The maintenance URL
 */
export function getMaintenanceUrl(envType: string): string {
  return getEnvironmentUrl(envType, 'maintenance_url') || getEnvironmentUrl(envType, 'maintenanceUrl') || '';
}

/**
 * Get all URLs for a specific environment
 * @param envType - Environment type
 * @returns Object containing all URLs for the environment
 */
export function getAllUrlsForEnvironment(envType: string): EnvironmentConfig {
  return config.getEnvironmentUrls(envType);
}