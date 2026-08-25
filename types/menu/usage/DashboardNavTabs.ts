/**
 * DashboardNavTabs enum - Navigation tabs for Usage Dashboard module
 * Migrated from Java: psqa.hoonuit.shared.enums.menu.usage.DashboardNavTabs
 * 
 * @description Defines all available navigation tabs in the Usage Dashboard section
 * @author Converted from Java
 */
export enum DashboardNavTabs {
    USAGE = 'Usage'
}

/**
 * Helper object to get list index for DashboardNavTabs
 */
export const DashboardNavTabsIndex: Map<DashboardNavTabs, number> = new Map([
    [DashboardNavTabs.USAGE, 0]
]);

/**
 * Interface for DashboardNavTabs utility methods
 */
export interface IDashboardNavTabsUtils {
    getValue(tab: DashboardNavTabs): string;
    getListIndex(tab: DashboardNavTabs): number;
    getAllTabs(): DashboardNavTabs[];
    getTabByIndex(index: number): DashboardNavTabs | undefined;
    isValidTab(value: string): boolean;
    getTabByValue(value: string): DashboardNavTabs | undefined;
    getTabCount(): number;
    getTabsInOrder(): DashboardNavTabs[];
}

/**
 * Utility class for DashboardNavTabs enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class DashboardNavTabsUtils implements IDashboardNavTabsUtils {
    /**
     * Get the display value for a tab
     * @param tab The DashboardNavTabs enum value
     * @returns The display text value
     */
    getValue(tab: DashboardNavTabs): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * @param tab The DashboardNavTabs enum value
     * @returns The numeric index position
     */
    getListIndex(tab: DashboardNavTabs): number {
        return DashboardNavTabsIndex.get(tab) ?? -1;
    }

    /**
     * Get all tabs as an array
     * @returns Array of all DashboardNavTabs enum values
     */
    getAllTabs(): DashboardNavTabs[] {
        return Object.values(DashboardNavTabs);
    }

    /**
     * Get tab by its index
     * @param index The index to look up
     * @returns The matching DashboardNavTabs or undefined
     */
    getTabByIndex(index: number): DashboardNavTabs | undefined {
        const entries = Array.from(DashboardNavTabsIndex.entries());
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
     * @returns true if value is a valid DashboardNavTabs
     */
    isValidTab(value: string): boolean {
        return Object.values(DashboardNavTabs).includes(value as DashboardNavTabs);
    }

    /**
     * Get tab by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching DashboardNavTabs or undefined
     */
    getTabByValue(value: string): DashboardNavTabs | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(DashboardNavTabs).find(
            tab => tab.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of tabs
     * @returns The number of tabs
     */
    getTabCount(): number {
        return Object.values(DashboardNavTabs).length;
    }

    /**
     * Get tabs sorted by their index order
     * @returns Array of DashboardNavTabs sorted by index
     */
    getTabsInOrder(): DashboardNavTabs[] {
        return Array.from(DashboardNavTabsIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([tab]) => tab);
    }
}

/**
 * Singleton instance for convenient access
 */
export const dashboardNavTabsUtils = new DashboardNavTabsUtils();