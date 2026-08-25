/**
 * Enum representing Graduation Navigation Tabs
 * Maps directly to Java enum psqa.hoonuit.shared.enums.menu.studentReadiness.GraduationNavTab
 * @author Automated Migration
 * @since 2025
 */
export enum GraduationNavTab {
    GRADUATION = 'Graduation',
    CREDIT = 'Credit'
}

/**
 * Class providing utility methods for GraduationNavTab
 * Matches functionality from Java enum including getValue() and getListIndex() methods
 */
export class GraduationNavTabUtils {
    /**
     * Get the display text value for a tab
     * Equivalent to Java getValue() method
     */
    static getValue(tab: GraduationNavTab): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * Equivalent to Java getListIndex() method
     */
    static getListIndex(tab: GraduationNavTab): number {
        switch (tab) {
            case GraduationNavTab.GRADUATION:
                return 0;
            case GraduationNavTab.CREDIT:
                return 1;
            default:
                return -1;
        }
    }

    /**
     * Get all available tabs as an array
     * Additional utility method for Playwright tests
     */
    static getAllTabs(): GraduationNavTab[] {
        return Object.values(GraduationNavTab);
    }

    /**
     * Get tab by list index
     * Additional utility method for Playwright tests - reverse lookup
     */
    static getTabByIndex(index: number): GraduationNavTab | undefined {
        switch (index) {
            case 0:
                return GraduationNavTab.GRADUATION;
            case 1:
                return GraduationNavTab.CREDIT;
            default:
                return undefined;
        }
    }

    /**
     * Validate if a string is a valid GraduationNavTab value
     * Utility method for Playwright test validation
     */
    static isValidTab(value: string): boolean {
        return Object.values(GraduationNavTab).includes(value as GraduationNavTab);
    }

    /**
     * Get tab by display text (case-insensitive)
     * Additional utility method for Playwright tests
     */
    static getTabByValue(value: string): GraduationNavTab | undefined {
        return this.getAllTabs().find(tab => tab.toLowerCase() === value.toLowerCase());
    }

    /**
     * Get count of total tabs
     * Utility method for Playwright test assertions
     */
    static getTabCount(): number {
        return Object.values(GraduationNavTab).length;
    }

    /**
     * Get tabs ordered by index
     * Utility method for Playwright tests to ensure proper tab order
     */
    static getTabsInOrder(): GraduationNavTab[] {
        const tabs: GraduationNavTab[] = [];
        for (let i = 0; i < this.getTabCount(); i++) {
            const tab = this.getTabByIndex(i);
            if (tab) {
                tabs.push(tab);
            }
        }
        return tabs;
    }

    /**
     * Convert enum value to selector string for Playwright
     * Utility method for Playwright element selection
     */
    static toSelector(tab: GraduationNavTab): string {
        return `[data-testid="${tab.toLowerCase().replace(/\s+/g, '-')}"]`;
    }

    /**
     * Convert enum value to CSS class name
     * Utility method for Playwright CSS-based selection
     */
    static toCssClass(tab: GraduationNavTab): string {
        return tab.toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * Get tab display name with proper formatting
     * Utility method for test assertions and logging
     */
    static getDisplayName(tab: GraduationNavTab): string {
        return tab;
    }

    /**
     * Check if tab is the first tab
     * Utility method for Playwright navigation tests
     */
    static isFirstTab(tab: GraduationNavTab): boolean {
        return this.getListIndex(tab) === 0;
    }

    /**
     * Check if tab is the last tab
     * Utility method for Playwright navigation tests
     */
    static isLastTab(tab: GraduationNavTab): boolean {
        return this.getListIndex(tab) === this.getTabCount() - 1;
    }

    /**
     * Get next tab in sequence
     * Utility method for Playwright navigation tests
     */
    static getNextTab(tab: GraduationNavTab): GraduationNavTab | undefined {
        const currentIndex = this.getListIndex(tab);
        return this.getTabByIndex(currentIndex + 1);
    }

    /**
     * Get previous tab in sequence
     * Utility method for Playwright navigation tests
     */
    static getPreviousTab(tab: GraduationNavTab): GraduationNavTab | undefined {
        const currentIndex = this.getListIndex(tab);
        return this.getTabByIndex(currentIndex - 1);
    }
}