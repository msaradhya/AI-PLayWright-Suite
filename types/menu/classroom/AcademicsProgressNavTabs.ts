/**
 * Enum representing Academics Progress Navigation Tabs
 * Matches the Java enum implementation for consistent behavior
 */
export enum AcademicsProgressNavTabs {
    GRADES = 'Grades',
    STUDENT_STANDARD_PROGRESS = 'Student Standard Progress'
}

/**
 * Type representing the navigation tab structure
 */
export interface AcademicsProgressNavTabInfo {
    readonly value: string;
    readonly listIndex: number;
    readonly key: keyof typeof AcademicsProgressNavTabs;
}

/**
 * Class providing utility methods for AcademicsProgressNavTabs
 * Enhanced for Playwright test automation support
 */
export class AcademicsProgressNavTabsUtils {
    
    private static readonly tabInfoMap: ReadonlyMap<AcademicsProgressNavTabs, AcademicsProgressNavTabInfo> = new Map([
        [AcademicsProgressNavTabs.GRADES, { value: 'Grades', listIndex: 0, key: 'GRADES' }],
        [AcademicsProgressNavTabs.STUDENT_STANDARD_PROGRESS, { value: 'Student Standard Progress', listIndex: 1, key: 'STUDENT_STANDARD_PROGRESS' }]
    ]);

    private static readonly indexToTabMap: ReadonlyMap<number, AcademicsProgressNavTabs> = new Map([
        [0, AcademicsProgressNavTabs.GRADES],
        [1, AcademicsProgressNavTabs.STUDENT_STANDARD_PROGRESS]
    ]);

    /**
     * Get the display text value for a tab
     * @param tab - The navigation tab enum
     * @returns The display text value
     */
    static getValue(tab: AcademicsProgressNavTabs): string {
        const tabInfo = this.tabInfoMap.get(tab);
        if (!tabInfo) {
            throw new Error(`Invalid tab: ${tab}`);
        }
        return tabInfo.value;
    }

    /**
     * Get the list index for a tab
     * @param tab - The navigation tab enum
     * @returns The zero-based list index
     */
    static getListIndex(tab: AcademicsProgressNavTabs): number {
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
    static getTabInfo(tab: AcademicsProgressNavTabs): AcademicsProgressNavTabInfo {
        const tabInfo = this.tabInfoMap.get(tab);
        if (!tabInfo) {
            throw new Error(`Invalid tab: ${tab}`);
        }
        return tabInfo;
    }

    /**
     * Get all available tabs as an array
     * @returns Array of all navigation tab enums
     */
    static getAllTabs(): AcademicsProgressNavTabs[] {
        return Object.values(AcademicsProgressNavTabs);
    }

    /**
     * Get all tab information as an array sorted by list index
     * @returns Array of all tab information objects
     */
    static getAllTabInfos(): AcademicsProgressNavTabInfo[] {
        return Array.from(this.tabInfoMap.values()).sort((a, b) => a.listIndex - b.listIndex);
    }

    /**
     * Get tab by list index
     * @param index - The zero-based list index
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByIndex(index: number): AcademicsProgressNavTabs | undefined {
        return this.indexToTabMap.get(index);
    }

    /**
     * Get tab by display value (case-sensitive)
     * @param value - The display text value
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByValue(value: string): AcademicsProgressNavTabs | undefined {
        for (const [tab, info] of this.tabInfoMap.entries()) {
            if (info.value === value) {
                return tab;
            }
        }
        return undefined;
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
     * @returns The count of navigation tabs
     */
    static getTabCount(): number {
        return this.tabInfoMap.size;
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
    static getTabSelector(tab: AcademicsProgressNavTabs): string {
        const index = this.getListIndex(tab);
        return this.getTabSelectorByIndex(index);
    }

    /**
     * Get next tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The next tab or undefined if at the end
     */
    static getNextTab(currentTab: AcademicsProgressNavTabs): AcademicsProgressNavTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        return this.getTabByIndex(currentIndex + 1);
    }

    /**
     * Get previous tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The previous tab or undefined if at the beginning
     */
    static getPreviousTab(currentTab: AcademicsProgressNavTabs): AcademicsProgressNavTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        return this.getTabByIndex(currentIndex - 1);
    }
}