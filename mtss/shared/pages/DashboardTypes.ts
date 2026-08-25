// Converted from Java: DashboardTypes.java
// Enum for dashboard types, Playwright/TypeScript compatible
// Maintains exact parity with Java enum logic and structure

/**
 * Dashboard types enum that mirrors the Java DashboardTypes enum
 * Each enum value contains both the display text and list index
 */
export enum DashboardTypes {
  ESSENTIALS = 'Student Analytics',
  CLASSROOM = 'Classroom', 
  RISK_ANALYSIS = 'Risk Analysis',
  USAGE = 'Usage',
  STUDENTREADINESS = 'Student Readiness Analytics',
  INTERVENTIONS = 'Interventions',
  STUDENTANALYTICS = 'Student Analytics',
}

/**
 * Enum keys mapped to their respective indices
 * This approach avoids the duplicate key issue by using enum keys instead of values
 */
export const DashboardTypesIndex: Record<keyof typeof DashboardTypes, number> = {
  ESSENTIALS: 0,           // ("Student Analytics", 0)
  CLASSROOM: 1,            // ("Classroom", 1)
  RISK_ANALYSIS: 2,        // ("Risk Analysis", 2)
  USAGE: 3,                // ("Usage", 3)
  STUDENTREADINESS: 4,     // ("Student Readiness Analytics", 4)
  INTERVENTIONS: 5,        // ("Interventions", 5)
  STUDENTANALYTICS: 0,     // ("Student Analytics", 0) - Same as ESSENTIALS
};

/**
 * Utility class that provides methods equivalent to Java enum methods
 * Supports Playwright test automation with type-safe operations
 */
export class DashboardTypesUtil {
  /**
   * Get the display value (navText) for a dashboard type
   * Equivalent to Java's getValue() method
   * @param type - The dashboard type enum value
   * @returns The display text for the dashboard type
   */
  static getValue(type: DashboardTypes): string {
    return type as string;
  }

  /**
   * Get the list index for a dashboard type
   * Equivalent to Java's getListIndex() method
   * @param type - The dashboard type enum value
   * @returns The list index for the dashboard type
   */
  static getListIndex(type: DashboardTypes): number {
    // Get the enum key name and use it to lookup the index
    const enumKey = Object.keys(DashboardTypes).find(key => DashboardTypes[key as keyof typeof DashboardTypes] === type) as keyof typeof DashboardTypes;
    return enumKey ? DashboardTypesIndex[enumKey] : -1;
  }

  /**
   * Get dashboard type by list index
   * Useful for Playwright tests that need to select by position
   * @param index - The list index to search for
   * @returns The dashboard type with the matching index, or undefined if not found
   */
  static getByListIndex(index: number): DashboardTypes | undefined {
    const enumKey = Object.keys(DashboardTypesIndex).find(
      key => DashboardTypesIndex[key as keyof typeof DashboardTypes] === index
    ) as keyof typeof DashboardTypes | undefined;
    
    return enumKey ? DashboardTypes[enumKey] : undefined;
  }

  /**
   * Get dashboard type by display value
   * Useful for Playwright tests that need to select by visible text
   * @param value - The display value to search for
   * @returns The dashboard type with the matching value, or undefined if not found
   */
  static getByValue(value: string): DashboardTypes | undefined {
    return Object.values(DashboardTypes).find(type => type === value) as DashboardTypes | undefined;
  }

  /**
   * Get all dashboard types as an array
   * Useful for iteration in Playwright tests
   * @returns Array of all dashboard type enum values
   */
  static getAllTypes(): DashboardTypes[] {
    return Object.values(DashboardTypes);
  }

  /**
   * Get all dashboard types with their indices
   * Useful for comprehensive testing scenarios
   * @returns Array of objects containing type and index
   */
  static getAllTypesWithIndices(): Array<{type: DashboardTypes, index: number, value: string, enumKey: string}> {
    return Object.keys(DashboardTypes).map(key => {
      const enumKey = key as keyof typeof DashboardTypes;
      const type = DashboardTypes[enumKey];
      return {
        type,
        index: DashboardTypesIndex[enumKey],
        value: type as string,
        enumKey: key
      };
    });
  }

  /**
   * Validate if a string is a valid dashboard type
   * Useful for runtime validation in Playwright tests
   * @param value - The string to validate
   * @returns True if the value is a valid dashboard type
   */
  static isValidDashboardType(value: string): value is DashboardTypes {
    return Object.values(DashboardTypes).includes(value as DashboardTypes);
  }

  /**
   * Validate if a number is a valid dashboard type index
   * Useful for runtime validation in Playwright tests
   * @param index - The index to validate
   * @returns True if the index corresponds to a valid dashboard type
   */
  static isValidIndex(index: number): boolean {
    return Object.values(DashboardTypesIndex).includes(index);
  }

  /**
   * Get all dashboard types that share the same display value
   * Useful for handling cases where multiple enum values have the same text
   * @param value - The display value to search for
   * @returns Array of dashboard types with the matching value
   */
  static getAllTypesWithValue(value: string): DashboardTypes[] {
    return Object.values(DashboardTypes).filter(type => type === value);
  }

  /**
   * Get all dashboard types that share the same index
   * Useful for handling cases where multiple enum values have the same index
   * @param index - The index to search for
   * @returns Array of dashboard types with the matching index
   */
  static getAllTypesWithIndex(index: number): DashboardTypes[] {
    return Object.keys(DashboardTypesIndex)
      .filter(key => DashboardTypesIndex[key as keyof typeof DashboardTypes] === index)
      .map(key => DashboardTypes[key as keyof typeof DashboardTypes]);
  }
}

/**
 * Type guard to check if a value is a DashboardTypes enum
 * @param value - Value to check
 * @returns True if value is a DashboardTypes enum member
 */
export function isDashboardType(value: any): value is DashboardTypes {
  return typeof value === 'string' && Object.values(DashboardTypes).includes(value as DashboardTypes);
}

/**
 * Constants for commonly used dashboard types
 * Provides easy access for Playwright tests
 */
export const DASHBOARD_CONSTANTS = {
  DEFAULT_TYPE: DashboardTypes.ESSENTIALS,
  ANALYTICS_TYPES: [DashboardTypes.ESSENTIALS, DashboardTypes.STUDENTANALYTICS],
  ALL_INDICES: Object.values(DashboardTypesIndex),
  MAX_INDEX: Math.max(...Object.values(DashboardTypesIndex)),
  MIN_INDEX: Math.min(...Object.values(DashboardTypesIndex)),
  UNIQUE_INDICES: Array.from(new Set(Object.values(DashboardTypesIndex))),
} as const;

/**
 * Mapping from display values to all enum keys that have that value
 * Useful for comprehensive lookups in Playwright tests
 */
export const VALUE_TO_ENUM_KEYS: Record<string, (keyof typeof DashboardTypes)[]> = {
  [DashboardTypes.ESSENTIALS]: ['ESSENTIALS', 'STUDENTANALYTICS'], // Both map to "Student Analytics"
  [DashboardTypes.CLASSROOM]: ['CLASSROOM'],
  [DashboardTypes.RISK_ANALYSIS]: ['RISK_ANALYSIS'],
  [DashboardTypes.USAGE]: ['USAGE'],
  [DashboardTypes.STUDENTREADINESS]: ['STUDENTREADINESS'],
  [DashboardTypes.INTERVENTIONS]: ['INTERVENTIONS'],
};

/**
 * Example usage for Playwright tests
 * 
 * // Get value and index like Java enum
 * const value = DashboardTypesUtil.getValue(DashboardTypes.ESSENTIALS);
 * const index = DashboardTypesUtil.getListIndex(DashboardTypes.ESSENTIALS);
 * 
 * // Find by index for UI automation
 * const typeByIndex = DashboardTypesUtil.getByListIndex(0);
 * 
 * // Find by display text from UI
 * const typeByValue = DashboardTypesUtil.getByValue("Student Analytics");
 * 
 * // Handle duplicate values/indices
 * const allAnalyticsTypes = DashboardTypesUtil.getAllTypesWithValue("Student Analytics");
 * const allTypesAtIndex0 = DashboardTypesUtil.getAllTypesWithIndex(0);
 * 
 * // Validation
 * const isValid = DashboardTypesUtil.isValidDashboardType("Classroom");
 * const isValidIndex = DashboardTypesUtil.isValidIndex(3);
 */
