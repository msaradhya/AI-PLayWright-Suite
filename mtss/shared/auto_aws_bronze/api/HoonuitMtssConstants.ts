/**
 * Constants for Hoonuit MTSS Auto AWS Bronze API
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
  
  // Configuration UUIDs for retrieve data operations
  public static readonly RETRIEVE_DATA_CONFIG_INT_UUID = '80d00440-7b45-4c7e-a7ae-c75f0df9fb12';
  public static readonly RETRIEVE_DATA_CONFIG_DEF_UUID = '5ee9c13d-decb-4ec0-8a2a-fbd9d22d234b';
  public static readonly RETRIEVE_DATA_CONFIG_GOAL1_UUID = 'fefde37a-537c-416e-9316-7fbb7fcc823d';
  public static readonly RETRIEVE_DATA_CONFIG_GOAL2_UUID = '064be5ba-0f97-4d88-a4d2-c95c9eebd0e7';
  
  // Intervention Names for API validation
  public static readonly INTERVENTION_NAME = 'DO NOT DELETE RETRIEVE DATA API VALIDATION';
  public static readonly TEACHER_INTERVENTION_NAME = 'DO NOT DELETE RETRIEVE DATA API VALIDATION TEACHER';
  public static readonly YTD_INTERVENTION_NAME = 'DO NOT DELETE RETRIEVE DATA YTD VALIDATION';
  public static readonly REFRESH_DATA_INTERVENTION_NAME = 'DO NOT DELETE/USE REFRESH DATA';
  
  // Action and Incident Types for behavioral data validation
  public static readonly ACTION_TYPE = 'Suspension - In School';
  public static readonly ACTION_SUBTYPE = 'Suspension (In-School)';
  public static readonly INCIDENT_TYPE = 'check_flagByYear_type_Detail';

  /**
   * Utility method to get all intervention UUIDs
   * @returns Array of intervention UUIDs
   */
  public static getAllInterventionUUIDs(): string[] {
    return [
      this.RETRIEVE_DATA_INTERVENTION_UUID,
      this.INTERVENTION_DEF_UUID,
      this.RETRIEVE_DATA_CONFIG_INT_UUID,
      this.RETRIEVE_DATA_CONFIG_DEF_UUID,
      this.RETRIEVE_DATA_CONFIG_GOAL1_UUID,
      this.RETRIEVE_DATA_CONFIG_GOAL2_UUID
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
  RETRIEVE_DATA_CONFIG_INT_UUID,
  RETRIEVE_DATA_CONFIG_DEF_UUID,
  RETRIEVE_DATA_CONFIG_GOAL1_UUID,
  RETRIEVE_DATA_CONFIG_GOAL2_UUID,
  REFRESH_DATA_INTERVENTION_NAME,
  ACTION_TYPE,
  ACTION_SUBTYPE,
  INCIDENT_TYPE
} = HoonuitMtssConstants;
