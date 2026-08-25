/**
 * Enum representing Digital Learning Tabs
 * Matches the Java enum implementation for consistent behavior
 * @author Sourav.Panda
 * @since 5/3/2021
 */
export enum DigitalLeaningTabs {
    STUDENT_ACTIVITY = 'Student Activity',
    STUDENT_OUTCOME = 'Student Outcomes'
}

/**
 * Type representing the navigation tab structure
 */
export interface DigitalLeaningTabInfo {
    readonly value: string;
    readonly listIndex: number;
    readonly key: keyof typeof DigitalLeaningTabs;
}

/**
 * Class providing utility methods for DigitalLeaningTabs
 * Enhanced for Playwright test automation support
 */
export class DigitalLeaningTabsUtils {
    
    private static readonly tabInfoMap: ReadonlyMap<DigitalLeaningTabs, DigitalLeaningTabInfo> = new Map([
        [DigitalLeaningTabs.STUDENT_ACTIVITY, { value: 'Student Activity', listIndex: 0, key: 'STUDENT_ACTIVITY' }],
        [DigitalLeaningTabs.STUDENT_OUTCOME, { value: 'Student Outcomes', listIndex: 1, key: 'STUDENT_OUTCOME' }]
    ]);

    private static readonly indexToTabMap: ReadonlyMap<number, DigitalLeaningTabs> = new Map([
        [0, DigitalLeaningTabs.STUDENT_ACTIVITY],
        [1, DigitalLeaningTabs.STUDENT_OUTCOME]
    ]);

    /**
     * Get the display text value for a tab
     * @param tab - The navigation tab enum
     * @returns The display text value
     */
    static getValue(tab: DigitalLeaningTabs): string {
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
    static getListIndex(tab: DigitalLeaningTabs): number {
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
    static getTabInfo(tab: DigitalLeaningTabs): DigitalLeaningTabInfo {
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
    static getAllTabs(): DigitalLeaningTabs[] {
        return Object.values(DigitalLeaningTabs);
    }

    /**
     * Get all tab information as an array sorted by list index
     * @returns Array of all tab information objects
     */
    static getAllTabInfos(): DigitalLeaningTabInfo[] {
        return Array.from(this.tabInfoMap.values()).sort((a, b) => a.listIndex - b.listIndex);
    }

    /**
     * Get tab by list index
     * @param index - The zero-based list index
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByIndex(index: number): DigitalLeaningTabs | undefined {
        return this.indexToTabMap.get(index);
    }

    /**
     * Get tab by display value (case-sensitive)
     * @param value - The display text value
     * @returns The navigation tab enum or undefined if not found
     */
    static getTabByValue(value: string): DigitalLeaningTabs | undefined {
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
    static getTabSelector(tab: DigitalLeaningTabs): string {
        const index = this.getListIndex(tab);
        return this.getTabSelectorByIndex(index);
    }

    /**
     * Get next tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The next tab or undefined if at the end
     */
    static getNextTab(currentTab: DigitalLeaningTabs): DigitalLeaningTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        return this.getTabByIndex(currentIndex + 1);
    }

    /**
     * Get previous tab in sequence (useful for navigation testing)
     * @param currentTab - The current tab
     * @returns The previous tab or undefined if at the beginning
     */
    static getPreviousTab(currentTab: DigitalLeaningTabs): DigitalLeaningTabs | undefined {
        const currentIndex = this.getListIndex(currentTab);
        return this.getTabByIndex(currentIndex - 1);
    }
}