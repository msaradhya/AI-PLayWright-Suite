/**
 * Hoonuit Auth API Request
 * Converted from Java to TypeScript for Playwright
 * Updated by: AnkitM
 * 
 * Adapted for PW_hoonuit_sis_integration project
 */

import { APIRequestContext, APIResponse } from '@playwright/test';
import { HoonuitApiHelper, RequestSpecification, ResponseSpecification } from './hoonuitApiHelper';
import { HoonuitApiConfig } from './hoonuitApiConfig';
import { HoonuitApiException } from '../exceptions/HoonuitApiException';

/**
 * Interface for OAuth token response
 */
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  scope?: string;
}

/**
 * Class for handling Hoonuit authentication API requests
 */
export class HoonuitAuthApiRequest {
  private static readonly logger = console; // Using console as logger similar to Java SLF4J

  /**
   * Get an access token using client credentials flow
   * This method follows the same pattern as the Java version
   * @returns A promise that resolves to an access token string
   */
  async getAccessToken(): Promise<string> {
    const body = 'grant_type=client_credentials';
    const clientId = HoonuitApiConfig.getClientId();
    const clientSecret = HoonuitApiConfig.getClientSecret();
    const url = `${HoonuitApiConfig.getSisApiUrl()}/oauth/access_token`;
    
    if (!clientId || !clientSecret) {
      throw new HoonuitApiException('Client ID or Client Secret is not configured');
    }

    const keySecret = `${clientId}:${clientSecret}`;
    let base64: string;

    try {
      base64 = Buffer.from(keySecret, 'utf-8').toString('base64');
    } catch (error) {
      HoonuitAuthApiRequest.logger.error('Error encoding client key and secret:', error);
      throw new HoonuitApiException('Failed to encode client credentials', error as Error);
    }

    // Create request specification using the helper method pattern from Java
    const requestSpec: RequestSpecification = HoonuitApiHelper.getRequestSpec(
      `Authorization:Basic ${base64}`,
      'Content-Type:application/x-www-form-urlencoded'
    );

    // Create response specification
    const responseSpec: ResponseSpecification = HoonuitApiHelper.getResponseSpec(200);

    // Set up API context with headers
    const apiContext: APIRequestContext = await HoonuitApiHelper.createRequestContext(requestSpec.headers);
    
    try {
      // Make the POST request with relaxed HTTPS validation (matching Java behavior)
      const response: APIResponse = await apiContext.post(url, {
        data: body,
        headers: requestSpec.headers
      });
      
      // Validate response using specification
      await HoonuitApiHelper.validateResponse(response, responseSpec);
      
      // Parse the response JSON
      const responseJson: OAuthTokenResponse = await response.json();
      HoonuitAuthApiRequest.logger.info(`The OAuth response is: ${JSON.stringify(responseJson)}`);
      
      // Extract the access token
      const accessToken = responseJson.access_token;
      
      if (!accessToken) {
        throw new HoonuitApiException(`Access token response does not contain 'access_token'.\n${JSON.stringify(responseJson)}`);
      }
      
      return accessToken;
    } catch (error) {
      HoonuitAuthApiRequest.logger.error('Error getting access token:', error);
      if (error instanceof HoonuitApiException) {
        throw error;
      }
      throw new HoonuitApiException('Failed to obtain access token', error as Error);
    } finally {
      // Close the API context
      await apiContext.dispose();
    }
  }

  /**
   * Get an access token with custom grant type
   * @param grantType The OAuth grant type to use
   * @param additionalParams Additional parameters for the token request
   * @returns A promise that resolves to an access token string
   */
  async getAccessTokenWithGrantType(grantType: string, additionalParams?: Record<string, string>): Promise<string> {
    let body = `grant_type=${grantType}`;
    
    if (additionalParams) {
      for (const [key, value] of Object.entries(additionalParams)) {
        body += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    }

    const clientId = HoonuitApiConfig.getClientId();
    const clientSecret = HoonuitApiConfig.getClientSecret();
    const url = `${HoonuitApiConfig.getSisApiUrl()}/oauth/access_token`;
    
    if (!clientId || !clientSecret) {
      throw new HoonuitApiException('Client ID or Client Secret is not configured');
    }

    const keySecret = `${clientId}:${clientSecret}`;
    const base64 = Buffer.from(keySecret, 'utf-8').toString('base64');

    const requestSpec: RequestSpecification = HoonuitApiHelper.getRequestSpec(
      `Authorization:Basic ${base64}`,
      'Content-Type:application/x-www-form-urlencoded'
    );

    const responseSpec: ResponseSpecification = HoonuitApiHelper.getResponseSpec(200);
    const apiContext: APIRequestContext = await HoonuitApiHelper.createRequestContext(requestSpec.headers);
    
    try {
      const response: APIResponse = await apiContext.post(url, {
        data: body,
        headers: requestSpec.headers
      });
      
      await HoonuitApiHelper.validateResponse(response, responseSpec);
      
      const responseJson: OAuthTokenResponse = await response.json();
      HoonuitAuthApiRequest.logger.info(`The OAuth response is: ${JSON.stringify(responseJson)}`);
      
      const accessToken = responseJson.access_token;
      
      if (!accessToken) {
        throw new HoonuitApiException(`Access token response does not contain 'access_token'.\n${JSON.stringify(responseJson)}`);
      }
      
      return accessToken;
    } catch (error) {
      HoonuitAuthApiRequest.logger.error('Error getting access token with grant type:', error);
      if (error instanceof HoonuitApiException) {
        throw error;
      }
      throw new HoonuitApiException('Failed to obtain access token with custom grant type', error as Error);
    } finally {
      await apiContext.dispose();
    }
  }

  /**
   * Validate if an access token is still valid
   * @param accessToken The access token to validate
   * @returns A promise that resolves to true if token is valid, false otherwise
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    if (!accessToken) {
      return false;
    }

    const requestSpec: RequestSpecification = HoonuitApiHelper.getRequestSpec(
      `Authorization:Bearer ${accessToken}`,
      'Content-Type:application/json'
    );

    const apiContext: APIRequestContext = await HoonuitApiHelper.createRequestContext(requestSpec.headers);
    const url = `${HoonuitApiConfig.getSisApiUrl()}/oauth/token_info`;
    
    try {
      const response: APIResponse = await apiContext.get(url, {
        headers: requestSpec.headers
      });
      
      return response.status() === 200;
    } catch (error) {
      HoonuitAuthApiRequest.logger.warn('Token validation failed:', error);
      return false;
    } finally {
      await apiContext.dispose();
    }
  }
}