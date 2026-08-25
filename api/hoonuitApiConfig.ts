/**
 * Hoonuit API Configuration Helper
 * Provides access to Hoonuit API configuration values
 * Equivalent to HoonuitRuntimeConfig from Java version
 *
 * Updated to use ConfigManager as the single source of truth
 * Adapted for PW_hoonuit_sis_integration project
 */

import { ConfigManager, EnvironmentConfig } from '../../config/ConfigManager';

// Re-export EnvironmentConfig as EnvironmentUrls for backward compatibility
export type EnvironmentUrls = EnvironmentConfig;

const configManager = ConfigManager.getInstance();

/**
 * Interface for API timeout configurations
 */
export interface ApiTimeoutConfig {
  connection: number;
  request: number;
  response: number;
}

/**
 * Interface for API retry configurations
 */
export interface ApiRetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryOn: number[];
}

/**
 * Configuration class for Hoonuit API settings
 * This serves as the TypeScript equivalent of Java's HoonuitRuntimeConfig
 */
export class HoonuitApiConfig {
  private static readonly DEFAULT_ENVIRONMENT = 'auto_aws_bronze';
  private static readonly DEFAULT_TIMEOUT: ApiTimeoutConfig = {
    connection: 30000, // 30 seconds
    request: 60000,    // 60 seconds
    response: 120000   // 120 seconds
  };
  private static readonly DEFAULT_RETRY: ApiRetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryOn: [429, 500, 502, 503, 504]
  };

  /**
   * Get the current test environment
   */
  static getCurrentEnvironment(): string {
    return configManager.getEnvironment();
  }

  /**
   * Get environment URLs for the current environment
   */
  static getCurrentEnvironmentUrls(): EnvironmentUrls {
    return configManager.getEnvironmentUrls();
  }

  /**
   * Get the SIS API URL (equivalent to getSISAPIUrl in Java)
   */
  static getSisApiUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.sis_api || envUrls.sis || '';
  }

  /**
   * Get the Client ID for OAuth authentication
   */
  static getClientId(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.client_id || process.env.HOONUIT_CLIENT_ID || '';
  }

  /**
   * Get the Client Secret for OAuth authentication
   */
  static getClientSecret(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.client_secret || process.env.HOONUIT_CLIENT_SECRET || '';
  }

  /**
   * Get the Multitenant API URL
   */
  static getMultitenantApiUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.multitenant_API_url || '';
  }

  /**
   * Get the API base URL based on the current environment
   */
  static getApiBaseUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.url || '';
  }

  /**
   * Get the maintenance URL
   */
  static getMaintenanceUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.maintenance_url || '';
  }

  /**
   * Get the SIS URL (PowerSchool URL)
   */
  static getSisUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.sis || '';
  }

  /**
   * Get the New Relic API URL
   */
  static getNewRelicAPIUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.newrelic_url || process.env.NEW_RELIC_API_URL || 'https://api.newrelic.com/v2/monitors';
  }

  /**
   * Get the Webhook API URL
   */
  static getWebhookAPIUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.webhook_api || process.env.WEBHOOK_API_URL || 'https://webhook-api.hoonuit.com';
  }

  /**
   * Get the Google SSO URL
   */
  static getGoogleUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.google_url || '';
  }

  /**
   * Get the Microsoft SSO URL
   */
  static getMicrosoftUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.microsoft_url || '';
  }

  /**
   * Get the Tenant Manager AKS URL
   */
  static getTenantManagerAksUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.tm_aks_url || '';
  }

  /**
   * Get the Tenant Manager EKS URL
   */
  static getTenantManagerEksUrl(): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return envUrls.tm_eks_url || '';
  }

  /**
   * Get the full SIS API URL with endpoint
   */
  static getSisApiUrlWithEndpoint(endpoint: string): string {
    const baseUrl = this.getSisApiUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Get the full API URL with endpoint
   */
  static getApiUrlWithEndpoint(endpoint: string): string {
    const baseUrl = this.getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Get API timeout configurations
   */
  static getApiTimeoutConfig(): ApiTimeoutConfig {
    return {
      connection: parseInt(process.env.API_CONNECTION_TIMEOUT || String(this.DEFAULT_TIMEOUT.connection)),
      request: parseInt(process.env.API_REQUEST_TIMEOUT || String(this.DEFAULT_TIMEOUT.request)),
      response: parseInt(process.env.API_RESPONSE_TIMEOUT || String(this.DEFAULT_TIMEOUT.response))
    };
  }

  /**
   * Get API retry configurations
   */
  static getApiRetryConfig(): ApiRetryConfig {
    return {
      maxRetries: parseInt(process.env.API_MAX_RETRIES || String(this.DEFAULT_RETRY.maxRetries)),
      retryDelay: parseInt(process.env.API_RETRY_DELAY || String(this.DEFAULT_RETRY.retryDelay)),
      retryOn: this.DEFAULT_RETRY.retryOn
    };
  }

  /**
   * Check if HTTPS validation should be ignored
   */
  static shouldIgnoreHttpsErrors(): boolean {
    return process.env.IGNORE_HTTPS_ERRORS === 'true' || process.env.NODE_ENV !== 'production';
  }

  /**
   * Get a configuration value by key with fallback
   */
  static getConfigValue(key: string, fallback: string = ''): string {
    const envUrls = this.getCurrentEnvironmentUrls();
    return (envUrls as any)[key] || process.env[key.toUpperCase()] || fallback;
  }

  /**
   * Validate that required configuration is present
   */
  static validateConfiguration(): void {
    const requiredConfigs = [
      { key: 'client_id', value: this.getClientId(), name: 'Client ID' },
      { key: 'client_secret', value: this.getClientSecret(), name: 'Client Secret' },
      { key: 'sis_api', value: this.getSisApiUrl(), name: 'SIS API URL' }
    ];

    const missingConfigs = requiredConfigs.filter(config => !config.value);
    
    if (missingConfigs.length > 0) {
      const missing = missingConfigs.map(config => config.name).join(', ');
      throw new Error(`Missing required configuration: ${missing}. Environment: ${this.getCurrentEnvironment()}`);
    }
  }
}