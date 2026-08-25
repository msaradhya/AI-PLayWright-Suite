/**
 * StudentPlanNavTabs enum - Navigation tabs for Student Plan Analytics module
 * Migrated from Java: psqa.hoonuit.shared.enums.menu.studentPlanAnalytics.StudentPlanNavTabs
 * 
 * @description Defines all available navigation tabs in the Student Plan Analytics section
 * @author Converted from Java
 */
export enum StudentPlanNavTabs {
    STUDENTPLANOVERVIEW = 'Overview'
}

/**
 * Helper object to get list index for StudentPlanNavTabs
 */
export const StudentPlanNavTabsIndex: Map<StudentPlanNavTabs, number> = new Map([
    [StudentPlanNavTabs.STUDENTPLANOVERVIEW, 0]
]);

/**
 * Interface for StudentPlanNavTabs utility methods
 */
export interface IStudentPlanNavTabsUtils {
    getValue(tab: StudentPlanNavTabs): string;
    getListIndex(tab: StudentPlanNavTabs): number;
    getAllTabs(): StudentPlanNavTabs[];
    getTabByIndex(index: number): StudentPlanNavTabs | undefined;
    isValidTab(value: string): boolean;
    getTabByValue(value: string): StudentPlanNavTabs | undefined;
    getTabCount(): number;
    getTabsInOrder(): StudentPlanNavTabs[];
}

/**
 * Utility class for StudentPlanNavTabs enum operations
 * Implements Enhanced Pattern with 8 utility methods
 */
export class StudentPlanNavTabsUtils implements IStudentPlanNavTabsUtils {
    /**
     * Get the display value for a tab
     * @param tab The StudentPlanNavTabs enum value
     * @returns The display text value
     */
    getValue(tab: StudentPlanNavTabs): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * @param tab The StudentPlanNavTabs enum value
     * @returns The numeric index position
     */
    getListIndex(tab: StudentPlanNavTabs): number {
        return StudentPlanNavTabsIndex.get(tab) ?? -1;
    }

    /**
     * Get all tabs as an array
     * @returns Array of all StudentPlanNavTabs enum values
     */
    getAllTabs(): StudentPlanNavTabs[] {
        return Object.values(StudentPlanNavTabs);
    }

    /**
     * Get tab by its index
     * @param index The index to look up
     * @returns The matching StudentPlanNavTabs or undefined
     */
    getTabByIndex(index: number): StudentPlanNavTabs | undefined {
        const entries = Array.from(StudentPlanNavTabsIndex.entries());
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
     * @returns true if value is a valid StudentPlanNavTabs
     */
    isValidTab(value: string): boolean {
        return Object.values(StudentPlanNavTabs).includes(value as StudentPlanNavTabs);
    }

    /**
     * Get tab by its display value (case-insensitive)
     * @param value The display value to search for
     * @returns The matching StudentPlanNavTabs or undefined
     */
    getTabByValue(value: string): StudentPlanNavTabs | undefined {
        const lowerValue = value.toLowerCase();
        return Object.values(StudentPlanNavTabs).find(
            tab => tab.toLowerCase() === lowerValue
        );
    }

    /**
     * Get the total count of tabs
     * @returns The number of tabs
     */
    getTabCount(): number {
        return Object.values(StudentPlanNavTabs).length;
    }

    /**
     * Get tabs sorted by their index order
     * @returns Array of StudentPlanNavTabs sorted by index
     */
    getTabsInOrder(): StudentPlanNavTabs[] {
        return Array.from(StudentPlanNavTabsIndex.entries())
            .sort(([, a], [, b]) => a - b)
            .map(([tab]) => tab);
    }
}

/**
 * Singleton instance for convenient access
 */
export const studentPlanNavTabsUtils = new StudentPlanNavTabsUtils();