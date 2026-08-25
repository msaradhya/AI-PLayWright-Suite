/**
 * MtssAttendanceNavTabs enum - Attendance navigation tabs for MTSS module
 * Migrated from Java: psqa.hoonuit.shared.mtss.shared.essentials.MtssAttendanceNavTabs
 * 
 * @description Defines available attendance navigation tabs in the MTSS section
 * @author hyders
 * @since Converted from Java
 */
export enum MtssAttendanceNavTabs {
    ATTENDANCE_OVERVIEW = 'Attendance Overview'
}

/**
 * Helper object to get list index for MtssAttendanceNavTabs
 */
export const MtssAttendanceNavTabsIndex: Map<MtssAttendanceNavTabs, number> = new Map([
    [MtssAttendanceNavTabs.ATTENDANCE_OVERVIEW, 0]
]);

/**
 * Interface for MtssAttendanceNavTabs utility methods
 */
export interface IMtssAttendanceNavTabsUtils {
    getValue(tab: MtssAttendanceNavTabs): string;
    getListIndex(tab: MtssAttendanceNavTabs): number;
    getAllTabs(): MtssAttendanceNavTabs[];
    getTabByIndex(index: number): MtssAttendanceNavTabs | undefined;
    isValidTab(value: string): boolean;
    getTabByValue(value: string): MtssAttendanceNavTabs | undefined;
    getTabCount(): number;
    getTabsInOrder(): MtssAttendanceNavTabs[];
}

/**
 * Utility class for MtssAttendanceNavTabs enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class MtssAttendanceNavTabsUtils implements IMtssAttendanceNavTabsUtils {
    /**
     * Get the display value for a tab
     * @param tab The MtssAttendanceNavTabs enum value
     * @returns The display text value
     */
    getValue(tab: MtssAttendanceNavTabs): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * @param tab The MtssAttendanceNavTabs enum value
     * @returns The numeric index position
     */
    getListIndex(tab: MtssAttendanceNavTabs): number {
        return MtssAttendanceNavTabsIndex.get(tab) ?? -1;
    }

    /**
     * Get all tabs as an array
     * @returns Array of all MtssAttendanceNavTabs enum values
     */
    getAllTabs(): MtssAttendanceNavTabs[] {
        return Object.values(MtssAttendanceNavTabs);
    }

    /**
     * Get tab by its index
     * @param index The index to look up
     * @returns The matching MtssAttendanceNavTabs or undefined
     */
    getTabByIndex(index: number): MtssAttendanceNavTabs | undefined {
        const entries = Array.from(MtssAttendanceNavTabsIndex.entries());
        for (const [tab, idx] of entries) {
            if (idx === index) {
                return tab;
            }
        }
        return undefined;
    }

    /**
     * Check if a value is a valid tab
     * @param value The value to check
     * @returns true if value is a valid MtssAttendanceNavTabs
     */
    isValidTab(value: string): boolean {
        return Object.values(MtssAttendanceNavTabs).includes(value as MtssAttendanceNavTabs);
    }

    /**
     * Get tab by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching MtssAttendanceNavTabs or undefined
     */
    getTabByValue(value: string): MtssAttendanceNavTabs | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(MtssAttendanceNavTabs).find(
            tab => tab.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of tabs
     * @returns The number of tabs
     */
    getTabCount(): number {
        return Object.values(MtssAttendanceNavTabs).length;
    }

    /**
     * Get tabs sorted by their index order
     * @returns Array of MtssAttendanceNavTabs sorted by index
     */
    getTabsInOrder(): MtssAttendanceNavTabs[] {
        return Array.from(MtssAttendanceNavTabsIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([tab]) => tab);
    }
}

/**
 * Singleton instance for convenient access
 */
export const mtssAttendanceNavTabsUtils = new MtssAttendanceNavTabsUtils();