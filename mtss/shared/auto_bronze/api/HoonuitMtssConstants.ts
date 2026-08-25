/**
 * Constants for Hoonuit MTSS Auto Bronze API
 * Converted from Java source for Playwright test automation
 * @author Ankit.Mohapatra
 * @since 29/11/2023
 */

/**
 * HoonuitMtssConstants class containing all MTSS related constants
 * for API validation and test automation
 */
export class HoonuitMtssConstants {
  // Intervention UUIDs for API validation
  public static readonly RETRIEVE_DATA_INTERVENTION_UUID = 'a0705a69-1f90-4d16-afc0-f89b7a137fa1';
  public static readonly INTERVENTION_DEF_UUID = '2479a124-8386-4a03-96b7-7387f2a87f27';
  public static readonly GOAL2_INTERVENTION_DEFINITION_RETRIEVE_DATA_UUID = '927116ba-ee7a-49da-a7d5-8c42c2a5833b';
  
  // Configuration UUIDs for retrieve data operations
  public static readonly RETRIEVE_DATA_CONFIG_DEF_UUID = '5ee9c13d-decb-4ec0-8a2a-fbd9d22d234b';
  public static readonly RETRIEVE_DATA_CONFIG_INT_UUID = '80d00440-7b45-4c7e-a7ae-c75f0df9fb12';
  public static readonly RETRIEVE_DATA_CONFIG_GOAL1_UUID = 'fefde37a-537c-416e-9316-7fbb7fcc823d';
  public static readonly RETRIEVE_DATA_CONFIG_GOAL2_UUID = '064be5ba-0f97-4d88-a4d2-c95c9eebd0e7';
  
  // Refresh Data API UUIDs
  public static readonly REFRESH_DATA_API_INTERVENTION_UUID = 'c5efcafd-6493-4215-a112-81e914710ce8';
  public static readonly REFRESH_DATA_CALENDAR_UUID = '945f180c-9fc0-45e7-ab1c-c46723b2e380';
  
  // Intervention Names for API validation
  public static readonly INTERVENTION_NAME = 'DO NOT DELETE RETRIEVE DATA API VALIDATION';
  public static readonly TEACHER_INTERVENTION_NAME = 'DO NOT DELETE RETRIEVE DATA API VALIDATION TEACHER';
  public static readonly YTD_INTERVENTION_NAME = 'DO NOT DELETE RETRIEVE DATA YTD VALIDATION';
  public static readonly REFRESH_DATA_INTERVENTION_NAME = 'DO NOT DELETE/USE REFRESH DATA';
  
  // Configuration Response JSON strings for API testing
  public static readonly UPDATED_RETRIEVE_DATA_CONFIG_RESPONSE = '{"dynamicFilters":[{"id":"filterYearId","value":"2018-2019"},{"id":"filterSourceId","value":"ACHIEVE3000"},{"id":"filterSubjectId","value":"English Language Arts"},{"id":"filterAssessmentId","value":"Achieve 3000 Overall Score"},{"id":"filterColumnId","value":"Default Score"}]}';
  public static readonly GOAL_2_RETRIEVE_DATA_CONFIG_RESPONSE = '{"dynamicFilters":[{"id":"filterYearId","value":"2022-2023"},{"id":"filterSourceId","value":"Amplify"},{"id":"filterSubjectId","value":"Overall"},{"id":"filterAssessmentId","value":"Atlas Espanol EOY"},{"id":"filterColumnId","value":"testScore"}]}';
  
  // Action and Incident Types for behavioral data validation
  public static readonly ACTION_TYPE = 'Suspension - In School';
  public static readonly ACTION_SUBTYPE = 'Suspension';
  public static readonly INCIDENT_TYPE = 'Theft';

  /**
   * Utility method to get all intervention UUIDs
   * @returns Array of intervention UUIDs
   */
  public static getAllInterventionUUIDs(): string[] {
    return [
      this.RETRIEVE_DATA_INTERVENTION_UUID,
      this.INTERVENTION_DEF_UUID,
      this.GOAL2_INTERVENTION_DEFINITION_RETRIEVE_DATA_UUID,
      this.RETRIEVE_DATA_CONFIG_DEF_UUID,
      this.RETRIEVE_DATA_CONFIG_INT_UUID,
      this.RETRIEVE_DATA_CONFIG_GOAL1_UUID,
      this.RETRIEVE_DATA_CONFIG_GOAL2_UUID,
      this.REFRESH_DATA_API_INTERVENTION_UUID,
      this.REFRESH_DATA_CALENDAR_UUID
    ];
  }

  /**
   * Utility method to get all intervention names
   * @returns Array of intervention names
   */
  public static getAllInterventionNames(): string[] {
    return [
      this.INTERVENTION_NAME,
      this.TEACHER_INTERVENTION_NAME,
      this.YTD_INTERVENTION_NAME,
      this.REFRESH_DATA_INTERVENTION_NAME
    ];
  }

  /**
   * Utility method to get configuration response objects
   * @returns Object containing parsed configuration responses
   */
  public static getConfigurationResponses(): {
    updatedRetrieveData: any;
    goal2RetrieveData: any;
  } {
    return {
      updatedRetrieveData: JSON.parse(this.UPDATED_RETRIEVE_DATA_CONFIG_RESPONSE),
      goal2RetrieveData: JSON.parse(this.GOAL_2_RETRIEVE_DATA_CONFIG_RESPONSE)
    };
  }

  /**
   * Utility method to validate UUID format
   * @param uuid - UUID string to validate
   * @returns boolean indicating if UUID is valid
   */
  public static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Utility method to get action types for validation
   * @returns Object containing action types
   */
  public static getActionTypes(): { type: string; subtype: string; incident: string } {
    return {
      type: this.ACTION_TYPE,
      subtype: this.ACTION_SUBTYPE,
      incident: this.INCIDENT_TYPE
    };
  }

  /**
   * Utility method to validate intervention name format
   * @param name - Intervention name to validate
   * @returns boolean indicating if name matches expected patterns
   */
  public static isValidInterventionName(name: string): boolean {
    const validNames = this.getAllInterventionNames();
    return validNames.includes(name);
  }

  /**
   * Utility method to get all refresh data related constants
   * @returns Object containing refresh data UUIDs and names
   */
  public static getRefreshDataConstants(): {
    interventionUuid: string;
    calendarUuid: string;
    interventionName: string;
  } {
    return {
      interventionUuid: this.REFRESH_DATA_API_INTERVENTION_UUID,
      calendarUuid: this.REFRESH_DATA_CALENDAR_UUID,
      interventionName: this.REFRESH_DATA_INTERVENTION_NAME
    };
  }

  /**
   * Utility method for Playwright tests to validate API responses
   * @param response - API response to validate
   * @param expectedFields - Array of expected field names
   * @returns boolean indicating if response contains all expected fields
   */
  public static validateApiResponse(response: any, expectedFields: string[]): boolean {
    if (!response || typeof response !== 'object') {
      return false;
    }
    
    return expectedFields.every(field => response.hasOwnProperty(field));
  }

  /**
   * Utility method to get dynamic filter structure for testing
   * @param filterId - Filter ID to create
   * @param value - Filter value to set
   * @returns Dynamic filter object structure
   */
  public static createDynamicFilter(filterId: string, value: string): { id: string; value: string } {
    return {
      id: filterId,
      value: value
    };
  }
}

/**
 * Default export for easier imports in Playwright tests
 */
export default HoonuitMtssConstants;

/**
 * Named exports for individual constants (backward compatibility)
 */
export const {
  RETRIEVE_DATA_INTERVENTION_UUID,
  INTERVENTION_NAME,
  TEACHER_INTERVENTION_NAME,
  INTERVENTION_DEF_UUID,
  YTD_INTERVENTION_NAME,
  REFRESH_DATA_INTERVENTION_NAME,
  RETRIEVE_DATA_CONFIG_DEF_UUID,
  RETRIEVE_DATA_CONFIG_INT_UUID,
  RETRIEVE_DATA_CONFIG_GOAL1_UUID,
  RETRIEVE_DATA_CONFIG_GOAL2_UUID,
  GOAL2_INTERVENTION_DEFINITION_RETRIEVE_DATA_UUID,
  UPDATED_RETRIEVE_DATA_CONFIG_RESPONSE,
  GOAL_2_RETRIEVE_DATA_CONFIG_RESPONSE,
  REFRESH_DATA_API_INTERVENTION_UUID,
  REFRESH_DATA_CALENDAR_UUID,
  ACTION_TYPE,
  ACTION_SUBTYPE,
  INCIDENT_TYPE
} = HoonuitMtssConstants;
