/**
 * Hoonuit API Test Utilities
 * Additional utility functions to support Playwright API testing
 * This class extends the functionality beyond the original Java implementation
 * 
 * Adapted for PW_hoonuit_sis_integration project
 */

import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { HoonuitApiHelper, RequestSpecification, ResponseSpecification } from './hoonuitApiHelper';
import { HoonuitAuthApiRequest } from './hoonuitAuthApiRequest';
import { HoonuitApiConfig } from './hoonuitApiConfig';
import { HoonuitApiException } from '../exceptions/HoonuitApiException';

/**
 * Interface for API test response validation
 */
export interface ApiTestValidation {
  statusCode?: number;
  contentType?: string;
  jsonSchema?: any;
  responseTime?: number;
  headers?: Record<string, string>;
}

/**
 * Interface for API retry policy
 */
export interface ApiRetryPolicy {
  maxRetries: number;
  retryDelay: number;
  retryCondition: (response: APIResponse, error?: Error) => boolean;
}

/**
 * Utility class for API testing with enhanced Playwright support
 */
export class HoonuitApiTestUtils {
  private static authToken: string | null = null;
  private static tokenExpiry: Date | null = null;

  /**
   * Get or refresh access token with caching
   * @param forceRefresh Force token refresh even if cached token exists
   * @returns Cached or new access token
   */
  static async getAccessToken(forceRefresh: boolean = false): Promise<string> {
    // Check if we have a valid cached token
    if (!forceRefresh && this.authToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.authToken;
    }

    // Get new token
    const authRequest = new HoonuitAuthApiRequest();
    this.authToken = await authRequest.getAccessToken();
    
    // Set expiry to 50 minutes from now (assuming 1-hour token validity)
    this.tokenExpiry = new Date(Date.now() + 50 * 60 * 1000);
    
    return this.authToken;
  }

  /**
   * Create authenticated request headers
   * @param additionalHeaders Additional headers to include
   * @returns Headers with Bearer token and additional headers
   */
  static async createAuthenticatedHeaders(...additionalHeaders: string[]): Promise<Record<string, string>> {
    const token = await this.getAccessToken();
    return HoonuitApiHelper.getRequestHeaders(
      'application/json',
      `Authorization:Bearer ${token}`,
      ...additionalHeaders
    );
  }

  /**
   * Make authenticated API request with retry logic
   * @param method HTTP method
   * @param endpoint API endpoint
   * @param options Request options
   * @param retryPolicy Optional retry policy
   * @returns API response
   */
  static async makeAuthenticatedRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    options: {
      data?: any;
      headers?: Record<string, string>;
      params?: Record<string, string>;
    } = {},
    retryPolicy?: ApiRetryPolicy
  ): Promise<APIResponse> {
    const headers = await this.createAuthenticatedHeaders();
    const mergedHeaders = { ...headers, ...options.headers };
    
    const apiContext = await HoonuitApiHelper.createRequestContext(mergedHeaders);
    const url = HoonuitApiConfig.getSisApiUrlWithEndpoint(endpoint);

    try {
      return await this.executeWithRetry(
        async () => {
          switch (method) {
            case 'GET':
              return await apiContext.get(url, { headers: mergedHeaders });
            case 'POST':
              return await apiContext.post(url, { data: options.data, headers: mergedHeaders });
            case 'PUT':
              return await apiContext.put(url, { data: options.data, headers: mergedHeaders });
            case 'DELETE':
              return await apiContext.delete(url, { headers: mergedHeaders });
            case 'PATCH':
              return await apiContext.patch(url, { data: options.data, headers: mergedHeaders });
            default:
              throw new Error(`Unsupported HTTP method: ${method}`);
          }
        },
        retryPolicy
      );
    } finally {
      await apiContext.dispose();
    }
  }

  /**
   * Execute request with retry logic
   * @param requestFn Function that makes the API request
   * @param retryPolicy Retry policy configuration
   * @returns API response
   */
  private static async executeWithRetry(
    requestFn: () => Promise<APIResponse>,
    retryPolicy?: ApiRetryPolicy
  ): Promise<APIResponse> {
    const configRetryPolicy = HoonuitApiConfig.getApiRetryConfig();
    const policy: ApiRetryPolicy = retryPolicy || {
      maxRetries: configRetryPolicy.maxRetries,
      retryDelay: configRetryPolicy.retryDelay,
      retryCondition: (response: APIResponse) => {
        const status = response.status();
        return configRetryPolicy.retryOn.includes(status);
      }
    };
    
    let lastError: Error | null = null;
    let lastResponse: APIResponse | null = null;

    for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
      try {
        const response = await requestFn();
        lastResponse = response;

        // Check if we should retry based on response
        if (attempt < policy.maxRetries && policy.retryCondition && policy.retryCondition(response)) {
          console.warn(`API request failed, retrying... Attempt ${attempt + 1}/${policy.maxRetries + 1}`);
          await this.sleep(policy.retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < policy.maxRetries) {
          console.warn(`API request failed, retrying... Attempt ${attempt + 1}/${policy.maxRetries + 1}`, error);
          await this.sleep(policy.retryDelay * Math.pow(2, attempt));
          continue;
        }
      }
    }

    if (lastError) {
      throw new HoonuitApiException(`API request failed after ${policy.maxRetries + 1} attempts`, lastError);
    }

    return lastResponse!;
  }

  /**
   * Sleep for specified milliseconds
   * @param ms Milliseconds to sleep
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate API response with comprehensive checks
   * @param response API response to validate
   * @param validation Validation criteria
   */
  static async validateResponse(response: APIResponse, validation: ApiTestValidation): Promise<void> {
    // Validate status code
    if (validation.statusCode !== undefined) {
      expect(response.status()).toBe(validation.statusCode);
    }

    // Validate content type
    if (validation.contentType) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain(validation.contentType);
    }

    // Validate response time
    if (validation.responseTime) {
      // Note: Playwright doesn't provide direct response time, but we can implement timing manually
      console.warn('Response time validation not directly available in Playwright');
    }

    // Validate headers
    if (validation.headers) {
      const responseHeaders = response.headers();
      for (const [key, value] of Object.entries(validation.headers)) {
        expect(responseHeaders[key.toLowerCase()]).toBe(value);
      }
    }

    // Validate JSON schema if provided
    if (validation.jsonSchema) {
      const responseJson = await response.json();
      // You can integrate with a JSON schema validation library here
      console.log('JSON Schema validation:', { expected: validation.jsonSchema, actual: responseJson });
    }
  }

  /**
   * Extract JSON path value from response
   * @param response API response
   * @param jsonPath JSON path expression (e.g., "data.users[0].name")
   * @returns Extracted value
   */
  static async extractJsonPath(response: APIResponse, jsonPath: string): Promise<any> {
    const responseJson = await response.json();
    return this.getNestedValue(responseJson, jsonPath);
  }

  /**
   * Get nested value from object using dot notation
   * @param obj Object to extract from
   * @param path Dot notation path
   * @returns Extracted value
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      // Handle array notation like "users[0]"
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        return current?.[arrayKey]?.[parseInt(index)];
      }
      return current?.[key];
    }, obj);
  }

  /**
   * Create a complete test context with authentication and configuration
   * @param baseEndpoint Base endpoint for the test suite
   * @returns Configured test context
   */
  static async createTestContext(baseEndpoint?: string): Promise<{
    apiContext: APIRequestContext;
    headers: Record<string, string>;
    baseUrl: string;
    cleanup: () => Promise<void>;
  }> {
    const headers = await this.createAuthenticatedHeaders();
    const baseUrl = baseEndpoint ? 
      HoonuitApiConfig.getSisApiUrlWithEndpoint(baseEndpoint) : 
      HoonuitApiConfig.getSisApiUrl();
    
    const apiContext = await HoonuitApiHelper.createRequestContext(headers, baseUrl);

    return {
      apiContext,
      headers,
      baseUrl,
      cleanup: async () => {
        await apiContext.dispose();
      }
    };
  }

  /**
   * Clear cached authentication token
   */
  static clearAuthToken(): void {
    this.authToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get default retry policy for API tests
   * @returns Default retry policy
   */
  static getDefaultRetryPolicy(): ApiRetryPolicy {
    return {
      maxRetries: 3,
      retryDelay: 1000,
      retryCondition: (response: APIResponse) => {
        const status = response.status();
        return status >= 500 || status === 429; // Retry on server errors and rate limiting
      }
    };
  }

  /**
   * Create a mock response for testing
   * @param statusCode Response status code
   * @param data Response data
   * @param headers Response headers
   * @returns Mock response object
   */
  static createMockResponse(statusCode: number, data: any, headers: Record<string, string> = {}): any {
    return {
      status: () => statusCode,
      json: async () => data,
      text: async () => JSON.stringify(data),
      headers: () => ({ 'content-type': 'application/json', ...headers })
    };
  }
}