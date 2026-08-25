import { Page, APIRequestContext } from '@playwright/test';

/**
 * MTSS API Helper class for handling API-specific functionality
 * Provides utility methods for API operations, dynamic variable handling, and date operations
 * @author Ankit.Mohapatra
 * @since 10/05/2023 (Converted from Java to TypeScript for Playwright implementation)
 */
export class MtssApiHelper {
  
  /**
   * Get MTSS API dynamic variable values
   * Static method to maintain compatibility with Java implementation
   * This method would typically fetch dynamic values from API endpoints or configuration
   * @returns Promise<Map<string, any>> Map containing dynamic variable key-value pairs
   */
  public static async getMtssAPIDynamicVariableValue(apiContext?: APIRequestContext): Promise<Map<string, any>> {
    const dynamicVariables = new Map<string, any>();
    
    try {
      // In a real implementation, you would fetch these from an API endpoint
      // Example API call (uncommented when actual endpoint is available):
      // if (apiContext) {
      //   const response = await apiContext.get('/api/dynamic-variables');
      //   const data = await response.json();
      //   Object.entries(data).forEach(([key, value]) => {
      //     dynamicVariables.set(key, value);
      //   });
      // }
      
      // Stub implementation with commonly used UUIDs and values
      // These should be replaced with actual API calls in production
      dynamicVariables.set('REFRESH_DATA_API_INTERVENTION_UUID', '5b07b80b-51c5-45c1-8a74-84e8b25f4c91');
      dynamicVariables.set('RETRIEVE_DATA_CONFIG_DEF_UUID', 'def-uuid-12345-67890-abcdef');
      dynamicVariables.set('RETRIEVE_DATA_INTERVENTION_UUID', '9f8e7d6c-5b4a-3928-1746-8e5d92c4f3b1');
      dynamicVariables.set('MTSS_API_BASE_URL', process.env.MTSS_API_BASE_URL || 'https://api.mtss.example.com');
      dynamicVariables.set('MTSS_API_VERSION', 'v1');
      dynamicVariables.set('DEFAULT_TIMEOUT', 30000);
      dynamicVariables.set('MAX_RETRY_ATTEMPTS', 3);
      
      // Additional dynamic variables that might be needed
      dynamicVariables.set('STUDENT_INTERVENTION_UUID', this.generateUUID());
      dynamicVariables.set('ASSESSMENT_DATA_UUID', this.generateUUID());
      dynamicVariables.set('PLAN_TEMPLATE_UUID', this.generateUUID());
      dynamicVariables.set('USER_SESSION_UUID', this.generateUUID());
      
    } catch (error) {
      console.error('Error fetching dynamic variables:', error);
      // Return default values on error
    }
    
    return dynamicVariables;
  }

  /**
   * Get current and previous date strings in various formats
   * Static method to maintain compatibility with Java implementation
   * @param format Optional date format ('ISO' | 'US' | 'EU' | 'timestamp')
   * @returns Promise<string[]> Array containing [currentDate, previousDate]
   */
  public static async getCurrentAndPreviousDate(format: 'ISO' | 'US' | 'EU' | 'timestamp' = 'ISO'): Promise<string[]> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const formatDate = (date: Date): string => {
      switch (format) {
        case 'ISO':
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        case 'US':
          return date.toLocaleDateString('en-US'); // MM/DD/YYYY format
        case 'EU':
          return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
        case 'timestamp':
          return date.getTime().toString(); // Unix timestamp
        default:
          return date.toISOString().split('T')[0];
      }
    };
    
    return [formatDate(today), formatDate(yesterday)];
  }

  /**
   * Get date range for specified number of days
   * @param days Number of days to go back from today
   * @param format Date format to use
   * @returns Promise<string[]> Array of date strings
   */
  public static async getDateRange(days: number, format: 'ISO' | 'US' | 'EU' | 'timestamp' = 'ISO'): Promise<string[]> {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const formatDate = (d: Date): string => {
        switch (format) {
          case 'ISO':
            return d.toISOString().split('T')[0];
          case 'US':
            return d.toLocaleDateString('en-US');
          case 'EU':
            return d.toLocaleDateString('en-GB');
          case 'timestamp':
            return d.getTime().toString();
          default:
            return d.toISOString().split('T')[0];
        }
      };
      
      dates.push(formatDate(date));
    }
    
    return dates;
  }

  /**
   * Generate a UUID v4
   * @returns string UUID
   */
  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Make API request with retry logic
   * @param apiContext Playwright API context
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param data Optional request data
   * @param retries Number of retry attempts
   * @returns Promise<any> API response
   */
  public static async makeApiRequest(
    apiContext: APIRequestContext,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    retries: number = 3
  ): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        let response;
        
        switch (method) {
          case 'GET':
            response = await apiContext.get(endpoint);
            break;
          case 'POST':
            response = await apiContext.post(endpoint, { data });
            break;
          case 'PUT':
            response = await apiContext.put(endpoint, { data });
            break;
          case 'DELETE':
            response = await apiContext.delete(endpoint);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        
        if (response.ok()) {
          return await response.json();
        } else {
          throw new Error(`API request failed with status ${response.status()}: ${response.statusText()}`);
        }
        
      } catch (error) {
        lastError = error as Error;
        console.log(`API request attempt ${attempt + 1} failed:`, error);
        
        if (attempt < retries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`API request failed after ${retries + 1} attempts. Last error: ${lastError?.message}`);
  }

  /**
   * Get API configuration from dynamic variables
   * @param apiContext Optional API context for fetching dynamic values
   * @returns Promise<object> API configuration object
   */
  public static async getApiConfiguration(apiContext?: APIRequestContext): Promise<{
    baseUrl: string;
    version: string;
    timeout: number;
    maxRetries: number;
  }> {
    const dynamicVars = await this.getMtssAPIDynamicVariableValue(apiContext);
    
    return {
      baseUrl: dynamicVars.get('MTSS_API_BASE_URL') || 'https://api.mtss.example.com',
      version: dynamicVars.get('MTSS_API_VERSION') || 'v1',
      timeout: dynamicVars.get('DEFAULT_TIMEOUT') || 30000,
      maxRetries: dynamicVars.get('MAX_RETRY_ATTEMPTS') || 3
    };
  }

  /**
   * Validate API response structure
   * @param response API response object
   * @param requiredFields Array of required field names
   * @returns boolean True if valid, false otherwise
   */
  public static validateApiResponse(response: any, requiredFields: string[]): boolean {
    if (!response || typeof response !== 'object') {
      return false;
    }
    
    for (const field of requiredFields) {
      if (!(field in response)) {
        console.error(`Required field '${field}' missing from API response`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Format intervention data for API submission
   * @param interventionData Raw intervention data
   * @returns object Formatted intervention data
   */
  public static formatInterventionDataForApi(interventionData: {
    name: string;
    type: string;
    level: string;
    startDate: Date;
    endDate?: Date;
    students: string[];
    goals?: any[];
  }): object {
    return {
      intervention_name: interventionData.name,
      intervention_type: interventionData.type,
      intervention_level: interventionData.level,
      start_date: interventionData.startDate.toISOString().split('T')[0],
      end_date: interventionData.endDate?.toISOString().split('T')[0] || null,
      student_ids: interventionData.students,
      goals: interventionData.goals || [],
      created_at: new Date().toISOString(),
      uuid: this.generateUUID()
    };
  }

  /**
   * Parse API error response
   * @param error Error object from API response
   * @returns string Human-readable error message
   */
  public static parseApiError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'An unknown API error occurred';
  }

  /**
   * Build query parameters for API requests
   * @param params Object containing query parameters
   * @returns string Query string
   */
  public static buildQueryParams(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    return queryParams.toString();
  }

  /**
   * Extract pagination info from API response
   * @param response API response object
   * @returns object Pagination information
   */
  public static extractPaginationInfo(response: any): {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    const pagination = response?.pagination || response?.meta?.pagination || {};
    
    return {
      currentPage: pagination.current_page || pagination.page || 1,
      totalPages: pagination.total_pages || pagination.pages || 1,
      totalItems: pagination.total_items || pagination.total || 0,
      hasNext: pagination.has_next || false,
      hasPrevious: pagination.has_previous || false
    };
  }
}