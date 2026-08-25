/**
 * DashboardTypes enum - Main dashboard type definitions
 * Migrated from Java: psqa.hoonuit.shared.pages.DashboardTypes
 * 
 * @description Defines all available dashboard types in the Hoonuit application
 * @author Converted from Java
 */
export enum DashboardTypes {
    ESSENTIALS = 'Student Analytics',
    CLASSROOM = 'Classroom',
    RISK_ANALYSIS = 'Risk Analysis',
    USAGE = 'Usage',
    STUDENTREADINESS = 'Student Readiness Analytics',
    INTERVENTIONS = 'Interventions',
    TALENT = 'Talent',
    STUDENTPLANS = 'Student Plans',
    STUDENTANALYTICS = 'Student Analytics'
}

/**
 * Helper object to get list index for DashboardTypes
 * Note: ESSENTIALS and STUDENTANALYTICS both have index 0 as they share the same value
 */
export const DashboardTypesIndex: Map<DashboardTypes, number> = new Map([
    [DashboardTypes.ESSENTIALS, 0],
    [DashboardTypes.CLASSROOM, 1],
    [DashboardTypes.RISK_ANALYSIS, 2],
    [DashboardTypes.USAGE, 3],
    [DashboardTypes.STUDENTREADINESS, 4],
    [DashboardTypes.INTERVENTIONS, 5],
    [DashboardTypes.TALENT, 6],
    [DashboardTypes.STUDENTPLANS, 7],
    [DashboardTypes.STUDENTANALYTICS, 0]  // Same as ESSENTIALS - shares index
]);

/**
 * Interface for DashboardTypes utility methods
 */
export interface IDashboardTypesUtils {
    getValue(type: DashboardTypes): string;
    getListIndex(type: DashboardTypes): number;
    getAllTypes(): DashboardTypes[];
    getTypeByIndex(index: number): DashboardTypes | undefined;
    isValidType(value: string): boolean;
    getTypeByValue(value: string): DashboardTypes | undefined;
    getTypeCount(): number;
    getTypesInOrder(): DashboardTypes[];
}

/**
 * Utility class for DashboardTypes enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class DashboardTypesUtils implements IDashboardTypesUtils {
    /**
     * Get the display value for a dashboard type
     * @param type The DashboardTypes enum value
     * @returns The display text value
     */
    getValue(type: DashboardTypes): string {
        return type;
    }

    /**
     * Get the list index for a dashboard type
     * @param type The DashboardTypes enum value
     * @returns The numeric index position
     */
    getListIndex(type: DashboardTypes): number {
        return DashboardTypesIndex.get(type) ?? -1;
    }

    /**
     * Get all dashboard types as an array
     * @returns Array of all DashboardTypes enum values
     */
    getAllTypes(): DashboardTypes[] {
        return Object.values(DashboardTypes);
    }

    /**
     * Get dashboard type by its index
     * @param index The index to look up
     * @returns The matching DashboardTypes or undefined
     */
    getTypeByIndex(index: number): DashboardTypes | undefined {
        const entries = Array.from(DashboardTypesIndex.entries());
        for (const [type, idx] of entries) {
            if (idx === index) {
                return type;
            }
        }
        return undefined;
    }

    /**
     * Check if a value is a valid dashboard type
     * @param value The value to check
     * @returns true if value is a valid DashboardTypes
     */
    isValidType(value: string): boolean {
        return Object.values(DashboardTypes).includes(value as DashboardTypes);
    }

    /**
     * Get dashboard type by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching DashboardTypes or undefined
     */
    getTypeByValue(value: string): DashboardTypes | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(DashboardTypes).find(
            type => type.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of dashboard types
     * @returns The number of dashboard types
     */
    getTypeCount(): number {
        return Object.values(DashboardTypes).length;
    }

    /**
     * Get dashboard types sorted by their index order
     * @returns Array of DashboardTypes sorted by index
     */
    getTypesInOrder(): DashboardTypes[] {
        return Array.from(DashboardTypesIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([type]) => type);
    }
}

/**
 * Singleton instance for convenient access
 */
export const dashboardTypesUtils = new DashboardTypesUtils();