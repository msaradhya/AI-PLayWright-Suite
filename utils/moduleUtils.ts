/**
 * Module utilities for handling module-specific configurations and credentials
 *
 * Updated to use ConfigManager as the single source of truth
 */

import { ConfigManager } from '../config/ConfigManager';
import { getEnvironmentUrl, getMainUrl } from './urlUtils';

const configManager = ConfigManager.getInstance();

/**
 * Parse login credentials from a semicolon-separated string
 * @param loginString - Login string in format "username;password"
 * @returns Object with username and password
 */
export function parseLoginCredentials(loginString: string): { username: string; password: string } {
  const parts = loginString.split(';');
  return {
    username: parts[0] || '',
    password: parts[1] || '',
  };
}

/**
 * Get the configuration name for a module
 * @param moduleName - Name of the module
 * @returns Configuration name
 */
export function getModuleConfigName(moduleName: string): string {
  const config = configManager.getModuleConfig(moduleName);
  return config?.config || '';
}

/**
 * Get a specific URL for a module
 * @param moduleName - Name of the module
 * @param urlKey - The key of the URL to retrieve (default: 'url')
 * @returns The URL string or undefined if not found
 */
export function getModuleUrl(moduleName: string, urlKey: string = 'url'): string | undefined {
  const config = configManager.getModuleConfig(moduleName);
  if (!config || !config.config) {
    return undefined;
  }
  return getEnvironmentUrl(config.config, urlKey);
}

/**
 * Get the main URL for a module
 * @param moduleName - Name of the module
 * @returns The main URL
 */
export function getModuleMainUrl(moduleName: string): string {
  const config = configManager.getModuleConfig(moduleName);
  if (!config || !config.config) {
    return '';
  }
  return getMainUrl(config.config);
}

/**
 * Get credentials for a module
 * @param moduleName - Name of the module
 * @returns Object with username and password, or undefined if not found
 */
export function getModuleCredentials(moduleName: string): { username: string; password: string } | undefined {
  const config = configManager.getModuleConfig(moduleName);
  if (!config || !config.login) {
    return undefined;
  }
  
  if (typeof config.login === 'string') {
    return parseLoginCredentials(config.login);
  }
  
  if (typeof config.login === 'object' && config.login.use_specific_login) {
    return parseLoginCredentials(config.login.use_specific_login);
  }
  
  return { username: '', password: '' };
}

/**
 * Get the district for a module
 * @param moduleName - Name of the module
 * @returns District name
 */
export function getModuleDistrict(moduleName: string): string {
  const config = configManager.getModuleConfig(moduleName);
  return config?.district || '';
}

/**
 * Check if a module is using login pool
 * @param moduleName - Name of the module
 * @returns True if using login pool, false otherwise
 */
export function isUsingLoginPool(moduleName: string): boolean {
  const config = configManager.getModuleConfig(moduleName);
  if (!config || !config.login || typeof config.login === 'string') {
    return false;
  }
  return !!config.login.use_login_pool;
}