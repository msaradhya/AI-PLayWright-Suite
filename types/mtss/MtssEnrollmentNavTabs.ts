/**
 * MtssEnrollmentNavTabs enum - Enrollment navigation tabs for MTSS module
 * Migrated from Java: psqa.hoonuit.shared.mtss.shared.essentials.EnrollmentNavTabs
 * 
 * @description Defines available enrollment navigation tabs in the MTSS section
 * @author hyders
 * @since Converted from Java
 */
export enum MtssEnrollmentNavTabs {
    ENROLLMENT_OVERVIEW = 'Enrollment Overview',
    ADMISSIONS = 'Admissions',
    WITHDRAWALS = 'Withdrawals',
    PROGRAMS = 'Programs'
}

/**
 * Helper object to get list index for MtssEnrollmentNavTabs
 */
export const MtssEnrollmentNavTabsIndex: Map<MtssEnrollmentNavTabs, number> = new Map([
    [MtssEnrollmentNavTabs.ENROLLMENT_OVERVIEW, 0],
    [MtssEnrollmentNavTabs.ADMISSIONS, 1],
    [MtssEnrollmentNavTabs.WITHDRAWALS, 2],
    [MtssEnrollmentNavTabs.PROGRAMS, 3]
]);

/**
 * Interface for MtssEnrollmentNavTabs utility methods
 */
export interface IMtssEnrollmentNavTabsUtils {
    getValue(tab: MtssEnrollmentNavTabs): string;
    getListIndex(tab: MtssEnrollmentNavTabs): number;
    getAllTabs(): MtssEnrollmentNavTabs[];
    getTabByIndex(index: number): MtssEnrollmentNavTabs | undefined;
    isValidTab(value: string): boolean;
    getTabByValue(value: string): MtssEnrollmentNavTabs | undefined;
    getTabCount(): number;
    getTabsInOrder(): MtssEnrollmentNavTabs[];
}

/**
 * Utility class for MtssEnrollmentNavTabs enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class MtssEnrollmentNavTabsUtils implements IMtssEnrollmentNavTabsUtils {
    /**
     * Get the display value for a tab
     * @param tab The MtssEnrollmentNavTabs enum value
     * @returns The display text value
     */
    getValue(tab: MtssEnrollmentNavTabs): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * @param tab The MtssEnrollmentNavTabs enum value
     * @returns The numeric index position
     */
    getListIndex(tab: MtssEnrollmentNavTabs): number {
        return MtssEnrollmentNavTabsIndex.get(tab) ?? -1;
    }

    /**
     * Get all tabs as an array
     * @returns Array of all MtssEnrollmentNavTabs enum values
     */
    getAllTabs(): MtssEnrollmentNavTabs[] {
        return Object.values(MtssEnrollmentNavTabs);
    }

    /**
     * Get tab by its index
     * @param index The index to look up
     * @returns The matching MtssEnrollmentNavTabs or undefined
     */
    getTabByIndex(index: number): MtssEnrollmentNavTabs | undefined {
        const entries = Array.from(MtssEnrollmentNavTabsIndex.entries());
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
     * @returns true if value is a valid MtssEnrollmentNavTabs
     */
    isValidTab(value: string): boolean {
        return Object.values(MtssEnrollmentNavTabs).includes(value as MtssEnrollmentNavTabs);
    }

    /**
     * Get tab by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching MtssEnrollmentNavTabs or undefined
     */
    getTabByValue(value: string): MtssEnrollmentNavTabs | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(MtssEnrollmentNavTabs).find(
            tab => tab.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of tabs
     * @returns The number of tabs
     */
    getTabCount(): number {
        return Object.values(MtssEnrollmentNavTabs).length;
    }

    /**
     * Get tabs sorted by their index order
     * @returns Array of MtssEnrollmentNavTabs sorted by index
     */
    getTabsInOrder(): MtssEnrollmentNavTabs[] {
        return Array.from(MtssEnrollmentNavTabsIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([tab]) => tab);
    }
}

/**
 * Singleton instance for convenient access
 */
export const mtssEnrollmentNavTabsUtils = new MtssEnrollmentNavTabsUtils();