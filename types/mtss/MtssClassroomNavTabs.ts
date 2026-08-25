/**
 * MtssClassroomNavTabs enum - Classroom navigation tabs for MTSS module
 * Migrated from Java: psqa.hoonuit.shared.mtss.shared.essentials.MtssClassroomNavTabs
 * 
 * @description Defines available classroom navigation tabs in the MTSS section
 * @author hyders
 * @since Converted from Java
 */
export enum MtssClassroomNavTabs {
    SEARCH = 'Student List'
}

/**
 * Helper object to get list index for MtssClassroomNavTabs
 */
export const MtssClassroomNavTabsIndex: Map<MtssClassroomNavTabs, number> = new Map([
    [MtssClassroomNavTabs.SEARCH, 3]
]);

/**
 * Interface for MtssClassroomNavTabs utility methods
 */
export interface IMtssClassroomNavTabsUtils {
    getValue(tab: MtssClassroomNavTabs): string;
    getListIndex(tab: MtssClassroomNavTabs): number;
    getAllTabs(): MtssClassroomNavTabs[];
    getTabByIndex(index: number): MtssClassroomNavTabs | undefined;
    isValidTab(value: string): boolean;
    getTabByValue(value: string): MtssClassroomNavTabs | undefined;
    getTabCount(): number;
    getTabsInOrder(): MtssClassroomNavTabs[];
}

/**
 * Utility class for MtssClassroomNavTabs enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class MtssClassroomNavTabsUtils implements IMtssClassroomNavTabsUtils {
    /**
     * Get the display value for a tab
     * @param tab The MtssClassroomNavTabs enum value
     * @returns The display text value
     */
    getValue(tab: MtssClassroomNavTabs): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * @param tab The MtssClassroomNavTabs enum value
     * @returns The numeric index position
     */
    getListIndex(tab: MtssClassroomNavTabs): number {
        return MtssClassroomNavTabsIndex.get(tab) ?? -1;
    }

    /**
     * Get all tabs as an array
     * @returns Array of all MtssClassroomNavTabs enum values
     */
    getAllTabs(): MtssClassroomNavTabs[] {
        return Object.values(MtssClassroomNavTabs);
    }

    /**
     * Get tab by its index
     * @param index The index to look up
     * @returns The matching MtssClassroomNavTabs or undefined
     */
    getTabByIndex(index: number): MtssClassroomNavTabs | undefined {
        const entries = Array.from(MtssClassroomNavTabsIndex.entries());
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
     * @returns true if value is a valid MtssClassroomNavTabs
     */
    isValidTab(value: string): boolean {
        return Object.values(MtssClassroomNavTabs).includes(value as MtssClassroomNavTabs);
    }

    /**
     * Get tab by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching MtssClassroomNavTabs or undefined
     */
    getTabByValue(value: string): MtssClassroomNavTabs | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(MtssClassroomNavTabs).find(
            tab => tab.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of tabs
     * @returns The number of tabs
     */
    getTabCount(): number {
        return Object.values(MtssClassroomNavTabs).length;
    }

    /**
     * Get tabs sorted by their index order
     * @returns Array of MtssClassroomNavTabs sorted by index
     */
    getTabsInOrder(): MtssClassroomNavTabs[] {
        return Array.from(MtssClassroomNavTabsIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([tab]) => tab);
    }
}

/**
 * Singleton instance for convenient access
 */
export const mtssClassroomNavTabsUtils = new MtssClassroomNavTabsUtils();