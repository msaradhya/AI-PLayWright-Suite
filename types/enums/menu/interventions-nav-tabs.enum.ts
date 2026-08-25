/**
 * InterventionsNavTabs enum - Navigation tabs for Interventions module
 * Migrated from Java: psqa.hoonuit.shared.enums.menu.interventions.InterventionsNavTabs
 * 
 * @description Defines all available navigation tabs in the Interventions section
 * @author Converted from Java
 */
export enum InterventionsNavTabs {
    OVERVIEW = 'Overview',
    GOAL_DATA_WALL = 'Goal Data Wall',
    INTERVENTION_LIST = 'Intervention List',
    EFFECTIVENESS = 'Effectiveness',
    INTERVENTION_MANAGEMENT = 'Intervention Management'
}

/**
 * Helper object to get list index for InterventionsNavTabs
 */
export const InterventionsNavTabsIndex: Map<InterventionsNavTabs, number> = new Map([
    [InterventionsNavTabs.OVERVIEW, 0],
    [InterventionsNavTabs.GOAL_DATA_WALL, 1],
    [InterventionsNavTabs.INTERVENTION_LIST, 2],
    [InterventionsNavTabs.EFFECTIVENESS, 3],
    [InterventionsNavTabs.INTERVENTION_MANAGEMENT, 4]
]);

/**
 * Interface for InterventionsNavTabs utility methods
 */
export interface IInterventionsNavTabsUtils {
    getValue(tab: InterventionsNavTabs): string;
    getListIndex(tab: InterventionsNavTabs): number;
    getAllTabs(): InterventionsNavTabs[];
    getTabByIndex(index: number): InterventionsNavTabs | undefined;
    isValidTab(value: string): boolean;
    getTabByValue(value: string): InterventionsNavTabs | undefined;
    getTabCount(): number;
    getTabsInOrder(): InterventionsNavTabs[];
}

/**
 * Utility class for InterventionsNavTabs enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class InterventionsNavTabsUtils implements IInterventionsNavTabsUtils {
    /**
     * Get the display value for a tab
     * @param tab The InterventionsNavTabs enum value
     * @returns The display text value
     */
    getValue(tab: InterventionsNavTabs): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * @param tab The InterventionsNavTabs enum value
     * @returns The numeric index position
     */
    getListIndex(tab: InterventionsNavTabs): number {
        return InterventionsNavTabsIndex.get(tab) ?? -1;
    }

    /**
     * Get all tabs as an array
     * @returns Array of all InterventionsNavTabs enum values
     */
    getAllTabs(): InterventionsNavTabs[] {
        return Object.values(InterventionsNavTabs);
    }

    /**
     * Get tab by its index
     * @param index The index to look up
     * @returns The matching InterventionsNavTabs or undefined
     */
    getTabByIndex(index: number): InterventionsNavTabs | undefined {
        const entries = Array.from(InterventionsNavTabsIndex.entries());
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
     * @returns true if value is a valid InterventionsNavTabs
     */
    isValidTab(value: string): boolean {
        return Object.values(InterventionsNavTabs).includes(value as InterventionsNavTabs);
    }

    /**
     * Get tab by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching InterventionsNavTabs or undefined
     */
    getTabByValue(value: string): InterventionsNavTabs | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(InterventionsNavTabs).find(
            tab => tab.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of tabs
     * @returns The number of tabs
     */
    getTabCount(): number {
        return Object.values(InterventionsNavTabs).length;
    }

    /**
     * Get tabs sorted by their index order
     * @returns Array of InterventionsNavTabs sorted by index
     */
    getTabsInOrder(): InterventionsNavTabs[] {
        return Array.from(InterventionsNavTabsIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([tab]) => tab);
    }
}

/**
 * Singleton instance for convenient access
 */
export const interventionsNavTabsUtils = new InterventionsNavTabsUtils();