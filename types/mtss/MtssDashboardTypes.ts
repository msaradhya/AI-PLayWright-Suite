/**
 * MtssDashboardTypes enum - Dashboard types for MTSS module
 * Migrated from Java: psqa.hoonuit.shared.mtss.shared.essentials.MtssDashboardTypes
 * 
 * @description Defines available dashboard types in the MTSS section
 * @author hyders
 * @since Converted from Java
 */
export enum MtssDashboardTypes {
    ESSENTIALS = 'Student Analytics',
    CLASSROOM = 'Classroom'
}

/**
 * Helper object to get list index for MtssDashboardTypes
 */
export const MtssDashboardTypesIndex: Map<MtssDashboardTypes, number> = new Map([
    [MtssDashboardTypes.ESSENTIALS, 0],
    [MtssDashboardTypes.CLASSROOM, 1]
]);

/**
 * Interface for MtssDashboardTypes utility methods
 */
export interface IMtssDashboardTypesUtils {
    getValue(type: MtssDashboardTypes): string;
    getListIndex(type: MtssDashboardTypes): number;
    getAllTypes(): MtssDashboardTypes[];
    getTypeByIndex(index: number): MtssDashboardTypes | undefined;
    isValidType(value: string): boolean;
    getTypeByValue(value: string): MtssDashboardTypes | undefined;
    getTypeCount(): number;
    getTypesInOrder(): MtssDashboardTypes[];
}

/**
 * Utility class for MtssDashboardTypes enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class MtssDashboardTypesUtils implements IMtssDashboardTypesUtils {
    /**
     * Get the display value for a type
     * @param type The MtssDashboardTypes enum value
     * @returns The display text value
     */
    getValue(type: MtssDashboardTypes): string {
        return type;
    }

    /**
     * Get the list index for a type
     * @param type The MtssDashboardTypes enum value
     * @returns The numeric index position
     */
    getListIndex(type: MtssDashboardTypes): number {
        return MtssDashboardTypesIndex.get(type) ?? -1;
    }

    /**
     * Get all types as an array
     * @returns Array of all MtssDashboardTypes enum values
     */
    getAllTypes(): MtssDashboardTypes[] {
        return Object.values(MtssDashboardTypes);
    }

    /**
     * Get type by its index
     * @param index The index to look up
     * @returns The matching MtssDashboardTypes or undefined
     */
    getTypeByIndex(index: number): MtssDashboardTypes | undefined {
        const entries = Array.from(MtssDashboardTypesIndex.entries());
        for (const [type, idx] of entries) {
            if (idx === index) {
                return type;
            }
        }
        return undefined;
    }

    /**
     * Check if a value is a valid type
     * @param value The value to check
     * @returns true if value is a valid MtssDashboardTypes
     */
    isValidType(value: string): boolean {
        return Object.values(MtssDashboardTypes).includes(value as MtssDashboardTypes);
    }

    /**
     * Get type by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching MtssDashboardTypes or undefined
     */
    getTypeByValue(value: string): MtssDashboardTypes | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(MtssDashboardTypes).find(
            type => type.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of types
     * @returns The number of types
     */
    getTypeCount(): number {
        return Object.values(MtssDashboardTypes).length;
    }

    /**
     * Get types sorted by their index order
     * @returns Array of MtssDashboardTypes sorted by index
     */
    getTypesInOrder(): MtssDashboardTypes[] {
        return Array.from(MtssDashboardTypesIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([type]) => type);
    }
}

/**
 * Singleton instance for convenient access
 */
export const mtssDashboardTypesUtils = new MtssDashboardTypesUtils();