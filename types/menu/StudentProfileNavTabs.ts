/**
 * Enum representing Student Profile Navigation Tabs
 * Maps directly to Java enum psqa.hoonuit.shared.enums.menu.StudentProfileNavTabs
 * @author System Generated
 * @since 09/07/2025
 */
export enum StudentProfileNavTabs {
    OVERVIEW = "Overview",
    SCHEDULE = "Schedule",
    ATTENDANCE_DETAIL = "Attendance Detail",
    BEHAVIOR_DETAIL = "Behavior Detail",
    ACADEMIC_DETAIL = "Academic Detail",
    ASSESSMENT_DETAIL = "Assessment Detail",
    INTERVENTION = "Interventions",
    STUDENT_PLANS_DETAIL = "Student Plans Detail"
}

/**
 * Type representing the student profile navigation tab structure
 */
export interface StudentProfileNavTabInfo {
    readonly value: string;
    readonly listIndex: number;
    readonly key: keyof typeof StudentProfileNavTabs;
}

/**
 * Class providing utility methods for StudentProfileNavTabs
 * Matches functionality from Java enum including getValue() and getListIndex() methods
 * Enhanced with additional Playwright-friendly methods for comprehensive test support
 */
export class StudentProfileNavTabsUtils {
    
    private static readonly tabInfoMap: ReadonlyMap<StudentProfileNavTabs, StudentProfileNavTabInfo> = new Map([
        [StudentProfileNavTabs.OVERVIEW, { value: "Overview", listIndex: 0, key: "OVERVIEW" }],
        [StudentProfileNavTabs.SCHEDULE, { value: "Schedule", listIndex: 1, key: "SCHEDULE" }],
        [StudentProfileNavTabs.ATTENDANCE_DETAIL, { value: "Attendance Detail", listIndex: 2, key: "ATTENDANCE_DETAIL" }],
        [StudentProfileNavTabs.BEHAVIOR_DETAIL, { value: "Behavior Detail", listIndex: 3, key: "BEHAVIOR_DETAIL" }],
        [StudentProfileNavTabs.ACADEMIC_DETAIL, { value: "Academic Detail", listIndex: 4, key: "ACADEMIC_DETAIL" }],
        [StudentProfileNavTabs.ASSESSMENT_DETAIL, { value: "Assessment Detail", listIndex: 5, key: "ASSESSMENT_DETAIL" }],
        [StudentProfileNavTabs.INTERVENTION, { value: "Interventions", listIndex: 6, key: "INTERVENTION" }],
        [StudentProfileNavTabs.STUDENT_PLANS_DETAIL, { value: "Student Plans Detail", listIndex: 10, key: "STUDENT_PLANS_DETAIL" }]
    ]);

    private static readonly indexToTabMap: ReadonlyMap<number, StudentProfileNavTabs> = new Map([
        [0, StudentProfileNavTabs.OVERVIEW],
        [1, StudentProfileNavTabs.SCHEDULE],
        [2, StudentProfileNavTabs.ATTENDANCE_DETAIL],
        [3, StudentProfileNavTabs.BEHAVIOR_DETAIL],
        [4, StudentProfileNavTabs.ACADEMIC_DETAIL],
        [5, StudentProfileNavTabs.ASSESSMENT_DETAIL],
        [6, StudentProfileNavTabs.INTERVENTION],
        [10, StudentProfileNavTabs.STUDENT_PLANS_DETAIL]
    ]);

    /**
     * Get the display text value for a tab
     * Equivalent to Java getValue() method
     * @param tab - The navigation tab enum
     * @returns The display text value
     */
    static getValue(tab: StudentProfileNavTabs): string {
        const tabInfo = this.tabInfoMap.get(tab);
        if (!tabInfo) {
            throw new Error(`Invalid tab: ${tab}`);
        }
        return tabInfo.value;
    }

    /**
     * Get the list index for a tab
     * Equivalent to Java getListIndex() method
     * @param tab - The navigation tab enum
     * @returns The zero-based list index
     */
    static getListIndex(tab: StudentProfileNavTabs): number {
        const tabInfo = this.tabInfoMap.get(tab);
        if (!tabInfo) {
            throw new Error(`Invalid tab: ${tab}`);
        }
        return tabInfo.listIndex;
    }

    /**
     * Get tab information including value, index, and key
     * @param tab - The navigation tab enum
     * @returns Complete tab information object
     */
    static getTabInfo(tab: StudentProfileNavTabs): StudentProfileNavTabInfo {
        const tabInfo = this.tabInfoMap.get(tab);
        if (!tabInfo) {
            throw new Error(`Invalid tab: ${tab}`);
        }
        return tabInfo;
    }

    /**
     * Get all available tabs as an array
     * Additional utility method for Playwright tests
     * @returns Array of all navigation tab enums
     */
    static getAllTabs(): StudentProfileNavTabs[] {
        return Object.values(StudentProfileNavTabs);
    }

    /**
     * Get all tab information as an array sorted by list index
     * @returns Array of all tab information objects
     */
    static getAllTabInfos(): StudentProfileNavTabInfo[] {
        return Array.from(this.tabInfoMap.values()).sort((a, b) => a.listIndex - b.listIndex);
    }

    /**
     * Get tab by list index
     * Additional utility method for Playwright tests - reverse lookup
     * @param index - The zero-based list index
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByIndex(index: number): StudentProfileNavTabs | undefined {
        return this.indexToTabMap.get(index);
    }

    /**
     * Get tab by display value (case-sensitive)
     * @param value - The display text value
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByValue(value: string): StudentProfileNavTabs | undefined {
        for (const [tab, info] of this.tabInfoMap.entries()) {
            if (info.value === value) {
                return tab;
            }
        }
        return undefined;
    }

    /**
     * Validate if a string is a valid StudentProfileNavTabs value
     * Utility method for Playwright test validation
     * @param value - The value to validate
     * @returns True if the value corresponds to a valid tab
     */
    static isValidTab(value: string): boolean {
        return Object.values(StudentProfileNavTabs).includes(value as StudentProfileNavTabs);
    }

    /**
     * Check if a given index is valid
     * @param index - The index to validate
     * @returns True if the index corresponds to a valid tab
     */
    static isValidIndex(index: number): boolean {
        return this.indexToTabMap.has(index);
    }

    /**
     * Check if a given value is valid
     * @param value - The value to validate
     * @returns True if the value corresponds to a valid tab
     */
    static isValidValue(value: string): boolean {
        return this.getTabByValue(value) !== undefined;
    }

    /**
     * Get the total number of available tabs
     * Utility method for Playwright test assertions
     * @returns The count of navigation tabs
     */
    static getTabCount(): number {
        return this.tabInfoMap.size;
    }

    /**
     * Get tabs ordered by index
     * Utility method for Playwright tests to ensure proper tab order
     * @returns Array of tabs in index order
     */
    static getTabsInOrder(): StudentProfileNavTabs[] {
        const tabs: StudentProfileNavTabs[] = [];
        const sortedIndexes = Array.from(this.indexToTabMap.keys()).sort((a, b) => a - b);
        for (const index of sortedIndexes) {
            const tab = this.getTabByIndex(index);
            if (tab) {
                tabs.push(tab);
            }
        }
        return tabs;
    }

    /**
     * Generate a CSS selector for a tab by index (useful for Playwright)
     * @param index - The tab index
     * @returns CSS selector string
     */
    static getTabSelectorByIndex(index: number): string {
        return `[data-tab-index="${index}"]`;
    }

    /**
     * Generate a CSS selector for a tab by value (useful for Playwright)
     * @param value - The tab display value
     * @returns CSS selector string
     */
    static getTabSelectorByValue(value: string): string {
        return `[data-tab-value="${value}"]`;
    }

    /**
     * Generate a CSS selector for a specific tab (useful for Playwright)
     * @param tab - The navigation tab enum
     * @returns CSS selector string
     */
    static getTabSelector(tab: StudentProfileNavTabs): string {
        const index = this.getListIndex(tab);
        return this.getTabSelectorByIndex(index);
    }

    /**
     * Convert enum value to selector string for Playwright
     * Utility method for Playwright element selection
     * @param tab - The navigation tab enum
     * @returns Data testid selector string
     */
    static toSelector(tab: StudentProfileNavTabs): string {
        return `[data-testid="${tab.toLowerCase().replace(/\s+/g, '-')}"]`;
    }

    /**
     * Convert enum value to CSS class name
     * Utility method for Playwright CSS-based selection
     * @param tab - The navigation tab enum
     * @returns CSS class name string
     */
    static toCssClass(tab: StudentProfileNavTabs): string {
        return tab.toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * Get tab display name with proper formatting
     * Utility method for test assertions and logging
     * @param tab - The navigation tab enum
     * @returns Formatted display name
     */
    static getDisplayName(tab: StudentProfileNavTabs): string {
        return this.getValue(tab);
    }

    /**
     * Check if tab is the first tab
     * Utility method for Playwright navigation tests
     * @param tab - The navigation tab enum
     * @returns True if this is the first tab
     */
    static isFirstTab(tab: StudentProfileNavTabs): boolean {
        return this.getListIndex(tab) === 0;
    }

    /**
     * Check if tab is the last tab
     * Utility method for Playwright navigation tests
     * @param tab - The navigation tab enum
     * @returns True if this is the last tab
     */
    static isLastTab(tab: StudentProfileNavTabs): boolean {
        const allIndexes = Array.from(this.indexToTabMap.keys());
        const maxIndex = Math.max(...allIndexes);
        return this.getListIndex(tab) === maxIndex;
    }

    /**
     * Get next tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The next tab or undefined if at the end
     */
    static getNextTab(currentTab: StudentProfileNavTabs): StudentProfileNavTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        const allIndexes = Array.from(this.indexToTabMap.keys()).sort((a, b) => a - b);
        const currentPosition = allIndexes.indexOf(currentIndex);
        
        if (currentPosition !== -1 && currentPosition < allIndexes.length - 1) {
            const nextIndex = allIndexes[currentPosition + 1];
            return this.getTabByIndex(nextIndex);
        }
        return undefined;
    }

    /**
     * Get previous tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The previous tab or undefined if at the beginning
     */
    static getPreviousTab(currentTab: StudentProfileNavTabs): StudentProfileNavTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        const allIndexes = Array.from(this.indexToTabMap.keys()).sort((a, b) => a - b);
        const currentPosition = allIndexes.indexOf(currentIndex);
        
        if (currentPosition > 0) {
            const previousIndex = allIndexes[currentPosition - 1];
            return this.getTabByIndex(previousIndex);
        }
        return undefined;
    }
}