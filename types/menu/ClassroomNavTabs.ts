/**
 * Enum representing Classroom Navigation Tabs
 * Maps directly to Java enum psqa.hoonuit.shared.enums.menu.ClassroomNavTabs
 * @author System Generated
 * @since 09/07/2025
 */
export enum ClassroomNavTabs {
    OVERVIEW = "Overview",
    ABSENCES = "Absences",
    ACADEMIC_PROGRESS = "Academic Progress",
    ASSESSMENTS = "Assessments",
    DIGITAL_LEARNING = "Digital Learning",
    SEARCH = "Student List"
}

/**
 * Type representing the navigation tab structure
 */
export interface ClassroomNavTabInfo {
    readonly value: string;
    readonly listIndex: number;
    readonly key: keyof typeof ClassroomNavTabs;
}

/**
 * Class providing utility methods for ClassroomNavTabs
 * Matches functionality from Java enum including getValue() and getListIndex() methods
 * Enhanced with additional Playwright-friendly methods for comprehensive test support
 */
export class ClassroomNavTabsUtils {
    
    private static readonly tabInfoMap: ReadonlyMap<ClassroomNavTabs, ClassroomNavTabInfo> = new Map([
        [ClassroomNavTabs.OVERVIEW, { value: "Overview", listIndex: 0, key: "OVERVIEW" }],
        [ClassroomNavTabs.ABSENCES, { value: "Absences", listIndex: 1, key: "ABSENCES" }],
        [ClassroomNavTabs.ACADEMIC_PROGRESS, { value: "Academic Progress", listIndex: 2, key: "ACADEMIC_PROGRESS" }],
        [ClassroomNavTabs.ASSESSMENTS, { value: "Assessments", listIndex: 3, key: "ASSESSMENTS" }],
        [ClassroomNavTabs.DIGITAL_LEARNING, { value: "Digital Learning", listIndex: 4, key: "DIGITAL_LEARNING" }],
        [ClassroomNavTabs.SEARCH, { value: "Student List", listIndex: 5, key: "SEARCH" }]
    ]);

    private static readonly indexToTabMap: ReadonlyMap<number, ClassroomNavTabs> = new Map([
        [0, ClassroomNavTabs.OVERVIEW],
        [1, ClassroomNavTabs.ABSENCES],
        [2, ClassroomNavTabs.ACADEMIC_PROGRESS],
        [3, ClassroomNavTabs.ASSESSMENTS],
        [4, ClassroomNavTabs.DIGITAL_LEARNING],
        [5, ClassroomNavTabs.SEARCH]
    ]);

    /**
     * Get the display text value for a tab
     * Equivalent to Java getValue() method
     * @param tab - The navigation tab enum
     * @returns The display text value
     */
    static getValue(tab: ClassroomNavTabs): string {
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
    static getListIndex(tab: ClassroomNavTabs): number {
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
    static getTabInfo(tab: ClassroomNavTabs): ClassroomNavTabInfo {
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
    static getAllTabs(): ClassroomNavTabs[] {
        return Object.values(ClassroomNavTabs);
    }

    /**
     * Get all tab information as an array sorted by list index
     * @returns Array of all tab information objects
     */
    static getAllTabInfos(): ClassroomNavTabInfo[] {
        return Array.from(this.tabInfoMap.values()).sort((a, b) => a.listIndex - b.listIndex);
    }

    /**
     * Get tab by list index
     * Additional utility method for Playwright tests - reverse lookup
     * @param index - The zero-based list index
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByIndex(index: number): ClassroomNavTabs | undefined {
        return this.indexToTabMap.get(index);
    }

    /**
     * Get tab by display value (case-sensitive)
     * @param value - The display text value
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByValue(value: string): ClassroomNavTabs | undefined {
        for (const [tab, info] of this.tabInfoMap.entries()) {
            if (info.value === value) {
                return tab;
            }
        }
        return undefined;
    }

    /**
     * Validate if a string is a valid ClassroomNavTabs value
     * Utility method for Playwright test validation
     * @param value - The value to validate
     * @returns True if the value corresponds to a valid tab
     */
    static isValidTab(value: string): boolean {
        return Object.values(ClassroomNavTabs).includes(value as ClassroomNavTabs);
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
    static getTabsInOrder(): ClassroomNavTabs[] {
        const tabs: ClassroomNavTabs[] = [];
        for (let i = 0; i < this.getTabCount(); i++) {
            const tab = this.getTabByIndex(i);
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
    static getTabSelector(tab: ClassroomNavTabs): string {
        const index = this.getListIndex(tab);
        return this.getTabSelectorByIndex(index);
    }

    /**
     * Convert enum value to selector string for Playwright
     * Utility method for Playwright element selection
     * @param tab - The navigation tab enum
     * @returns Data testid selector string
     */
    static toSelector(tab: ClassroomNavTabs): string {
        return `[data-testid="${tab.toLowerCase().replace(/\s+/g, '-')}"]`;
    }

    /**
     * Convert enum value to CSS class name
     * Utility method for Playwright CSS-based selection
     * @param tab - The navigation tab enum
     * @returns CSS class name string
     */
    static toCssClass(tab: ClassroomNavTabs): string {
        return tab.toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * Get tab display name with proper formatting
     * Utility method for test assertions and logging
     * @param tab - The navigation tab enum
     * @returns Formatted display name
     */
    static getDisplayName(tab: ClassroomNavTabs): string {
        return this.getValue(tab);
    }

    /**
     * Check if tab is the first tab
     * Utility method for Playwright navigation tests
     * @param tab - The navigation tab enum
     * @returns True if this is the first tab
     */
    static isFirstTab(tab: ClassroomNavTabs): boolean {
        return this.getListIndex(tab) === 0;
    }

    /**
     * Check if tab is the last tab
     * Utility method for Playwright navigation tests
     * @param tab - The navigation tab enum
     * @returns True if this is the last tab
     */
    static isLastTab(tab: ClassroomNavTabs): boolean {
        return this.getListIndex(tab) === this.getTabCount() - 1;
    }

    /**
     * Get next tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The next tab or undefined if at the end
     */
    static getNextTab(currentTab: ClassroomNavTabs): ClassroomNavTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        return this.getTabByIndex(currentIndex + 1);
    }

    /**
     * Get previous tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The previous tab or undefined if at the beginning
     */
    static getPreviousTab(currentTab: ClassroomNavTabs): ClassroomNavTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        return this.getTabByIndex(currentIndex - 1);
    }
}