/**
 * Hoonuit API Helper
 * Converted from Java to TypeScript for Playwright
 * Original author: AnkitM
 * 
 * Adapted for PW_hoonuit_sis_integration project
 */

import { APIRequestContext, APIResponse, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { HoonuitApiConfig } from './hoonuitApiConfig';

/**
 * Interface for request specifications similar to RestAssured RequestSpecification
 */
export interface RequestSpecification {
  headers: Record<string, string>;
  contentType: string;
  baseURL?: string;
  timeout?: number;
}

/**
 * Interface for response specifications similar to RestAssured ResponseSpecification
 */
export interface ResponseSpecification {
  expectedStatusCode: number;
  expectedContentType?: string;
}

/**
 * Helper class for Hoonuit API operations
 */
export class HoonuitApiHelper {
  private payload: string = '';
  private static readonly PLACEHOLDER_NAME_PATTERN = /\{\{[a-zA-Z0-9\_]+\}\}/;
  public static PAYLOAD: string = '';
  private static requestSpec: RequestSpecification | null = null;
  private static responseSpec: ResponseSpecification | null = null;

  /**
   * Pass the header in argument as e.g. header:headerValue
   * @param headers Headers in format "name:value"
   * @returns RequestSpecification similar to Java version
   */
  static getRequestSpec(...headers: string[]): RequestSpecification {
    const requestSpec: RequestSpecification = {
      headers: {
        'Content-Type': 'application/json'
      },
      contentType: 'application/json'
    };

    if (headers && headers.length > 0) {
      for (const header of headers) {
        const parts = header.split(':');
        if (parts.length === 2) {
          requestSpec.headers[parts[0].trim()] = parts[1].trim();
        }
      }
    }

    this.requestSpec = requestSpec;
    return requestSpec;
  }

  /**
   * Pass the Response code to be validated
   * @param responseCode Expected response code
   * @returns ResponseSpecification similar to Java version
   */
  static getResponseSpec(responseCode: number): ResponseSpecification {
    const responseSpec: ResponseSpecification = {
      expectedStatusCode: responseCode
    };

    this.responseSpec = responseSpec;
    return responseSpec;
  }

  /**
   * Creates request headers with specified content type and additional headers
   * @param headers Additional headers in format "name:value"
   * @returns Object with headers
   */
  static getRequestHeaders(contentType: string = 'application/json', ...headers: string[]): Record<string, string> {
    const headerObj: Record<string, string> = {
      'Content-Type': contentType
    };

    if (headers && headers.length > 0) {
      for (const header of headers) {
        const parts = header.split(':');
        if (parts.length === 2) {
          headerObj[parts[0].trim()] = parts[1].trim();
        }
      }
    }

    return headerObj;
  }

  /**
   * Creates API request context with predefined configurations
   * @param headers Headers to include in the request
   * @param baseURL Optional base URL override
   * @returns Configured API request context
   */
  static async createRequestContext(headers?: Record<string, string>, baseURL?: string): Promise<APIRequestContext> {
    return await request.newContext({
      baseURL: baseURL || HoonuitApiConfig.getApiBaseUrl(),
      extraHTTPHeaders: headers,
      ignoreHTTPSErrors: true,
      timeout: 30000 // 30 seconds timeout
    });
  }

  /**
   * Validates response status code
   * @param statusCode Actual status code
   * @param expectedStatusCode Expected status code
   * @throws Error if status code doesn't match expected code
   */
  static validateResponseCode(statusCode: number, expectedStatusCode: number): void {
    if (statusCode !== expectedStatusCode) {
      throw new Error(`Expected status code ${expectedStatusCode}, but got ${statusCode}`);
    }
  }

  /**
   * Validates response against ResponseSpecification
   * @param response API response
   * @param responseSpec Response specification to validate against
   */
  static async validateResponse(response: APIResponse, responseSpec: ResponseSpecification): Promise<void> {
    this.validateResponseCode(response.status(), responseSpec.expectedStatusCode);
    
    if (responseSpec.expectedContentType) {
      const contentType = response.headers()['content-type'];
      if (!contentType?.includes(responseSpec.expectedContentType)) {
        throw new Error(`Expected content type to include ${responseSpec.expectedContentType}, but got ${contentType}`);
      }
    }
  }

  /**
   * Get the current request specification
   * @returns Current request specification or null
   */
  static getCurrentRequestSpec(): RequestSpecification | null {
    return this.requestSpec;
  }

  /**
   * Get the current response specification
   * @returns Current response specification or null
   */
  static getCurrentResponseSpec(): ResponseSpecification | null {
    return this.responseSpec;
  }

  /**
   * Read payload from external resource.
   * @param fileName Name of the file containing the payload
   * @returns Current instance for method chaining
   *
   * Place the file in resources directory
   */
  loadPayload(fileName: string): HoonuitApiHelper {
    try {
      // Calculate relative path from project root
      const resourcePath = path.join(process.cwd(), 'resources', fileName);
      HoonuitApiHelper.PAYLOAD = fs.readFileSync(resourcePath, 'utf-8');
      this.payload = HoonuitApiHelper.PAYLOAD;
    } catch (error) {
      console.error(`${fileName} failed to load: `, (error as Error).message);
    }
    return this;
  }

  /**
   * Replace texts in payload marked with {{name}} to be replaced with specified value.
   * @param placeholder Placeholder name without {{ }}
   * @param value Value to replace with
   * @returns Current instance for method chaining
   *
   * Example: Under testAssignment.json, Want to replace assignmentName,
   * then added "assignmentName": "{{assignment_name}}", in payload.
   * placeholder = "assignment_name" and value = "Any Text"
   */
  replaceInPayload(placeholder: string, value: string): HoonuitApiHelper {
    const replaceName = `{{${placeholder}}}`;
    const matcher = HoonuitApiHelper.PLACEHOLDER_NAME_PATTERN.test(replaceName);

    if (!HoonuitApiHelper.PAYLOAD || HoonuitApiHelper.PAYLOAD.length === 0) {
      console.warn('Payload needs to be loaded before placing text.');
    } else if (!matcher) {
      console.warn("Invalid placeholder name. Placeholder name can only contain 'a-z', 'A-Z', '0-9' and '_'");
    } else if (HoonuitApiHelper.PAYLOAD.includes(replaceName)) {
      HoonuitApiHelper.PAYLOAD = HoonuitApiHelper.PAYLOAD.replace(
        new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g'),
        value
      );
      this.payload = HoonuitApiHelper.PAYLOAD;
    } else {
      console.warn(`Payload does not contain placeholder: ${replaceName}`);
    }

    return this;
  }

  /**
   * Get the current payload
   * @returns The payload as a string
   */
  getPayload(): string {
    return HoonuitApiHelper.PAYLOAD;
  }

  /**
   * Get the static payload
   * @returns The static payload as a string
   */
  static getStaticPayload(): string {
    return HoonuitApiHelper.PAYLOAD;
  }

  /**
   * Get the payload as a JSON object
   * @returns The payload parsed as JSON
   */
  getPayloadAsJson(): any {
    try {
      return JSON.parse(HoonuitApiHelper.PAYLOAD);
    } catch (error) {
      console.error('Failed to parse payload as JSON: ', error);
      return null;
    }
  }

  /**
   * Get the static payload as a JSON object
   * @returns The static payload parsed as JSON
   */
  static getStaticPayloadAsJson(): any {
    try {
      return JSON.parse(HoonuitApiHelper.PAYLOAD);
    } catch (error) {
      console.error('Failed to parse payload as JSON: ', error);
      return null;
    }
  }
}