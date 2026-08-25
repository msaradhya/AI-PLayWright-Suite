/**
 * Enum representing Credit Navigation Tabs
 * Maps directly to Java enum psqa.hoonuit.shared.enums.menu.studentReadiness.CreditNavTab
 * @author Automated Migration
 * @since 2025
 */
export enum CreditNavTab {
    STUDENT_CREDIT_PROGRESS = 'Credit Progress',
    CREDIT_BY_STUDENT = 'Student Credit Progress'
}

/**
 * Class providing utility methods for CreditNavTab
 * Matches functionality from Java enum including getValue() and getListIndex() methods
 */
export class CreditNavTabUtils {
    /**
     * Get the display text value for a tab
     * Equivalent to Java getValue() method
     */
    static getValue(tab: CreditNavTab): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * Equivalent to Java getListIndex() method
     */
    static getListIndex(tab: CreditNavTab): number {
        switch (tab) {
            case CreditNavTab.STUDENT_CREDIT_PROGRESS:
                return 0;
            case CreditNavTab.CREDIT_BY_STUDENT:
                return 1;
            default:
                return -1;
        }
    }

    /**
     * Get all available tabs as an array
     * Additional utility method for Playwright tests
     */
    static getAllTabs(): CreditNavTab[] {
        return Object.values(CreditNavTab);
    }

    /**
     * Get tab by list index
     * Additional utility method for Playwright tests - reverse lookup
     */
    static getTabByIndex(index: number): CreditNavTab | undefined {
        switch (index) {
            case 0:
                return CreditNavTab.STUDENT_CREDIT_PROGRESS;
            case 1:
                return CreditNavTab.CREDIT_BY_STUDENT;
            default:
                return undefined;
        }
    }

    /**
     * Validate if a string is a valid CreditNavTab value
     * Utility method for Playwright test validation
     */
    static isValidTab(value: string): boolean {
        return Object.values(CreditNavTab).includes(value as CreditNavTab);
    }

    /**
     * Get tab by display text (case-insensitive)
     * Additional utility method for Playwright tests
     */
    static getTabByValue(value: string): CreditNavTab | undefined {
        return this.getAllTabs().find(tab => tab.toLowerCase() === value.toLowerCase());
    }

    /**
     * Get count of total tabs
     * Utility method for Playwright test assertions
     */
    static getTabCount(): number {
        return Object.values(CreditNavTab).length;
    }

    /**
     * Get tabs ordered by index
     * Utility method for Playwright tests to ensure proper tab order
     */
    static getTabsInOrder(): CreditNavTab[] {
        const tabs: CreditNavTab[] = [];
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
    static toSelector(tab: CreditNavTab): string {
        return `[data-testid="${tab.toLowerCase().replace(/\s+/g, '-')}"]`;
    }

    /**
     * Convert enum value to CSS class name
     * Utility method for Playwright CSS-based selection
     */
    static toCssClass(tab: CreditNavTab): string {
        return tab.toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * Get tab display name with proper formatting
     * Utility method for test assertions and logging
     */
    static getDisplayName(tab: CreditNavTab): string {
        return tab;
    }

    /**
     * Check if tab is the first tab
     * Utility method for Playwright navigation tests
     */
    static isFirstTab(tab: CreditNavTab): boolean {
        return this.getListIndex(tab) === 0;
    }

    /**
     * Check if tab is the last tab
     * Utility method for Playwright navigation tests
     */
    static isLastTab(tab: CreditNavTab): boolean {
        return this.getListIndex(tab) === this.getTabCount() - 1;
    }

    /**
     * Get next tab in sequence
     * Utility method for Playwright navigation tests
     */
    static getNextTab(tab: CreditNavTab): CreditNavTab | undefined {
        const currentIndex = this.getListIndex(tab);
        return this.getTabByIndex(currentIndex + 1);
    }

    /**
     * Get previous tab in sequence
     * Utility method for Playwright navigation tests
     */
    static getPreviousTab(tab: CreditNavTab): CreditNavTab | undefined {
        const currentIndex = this.getListIndex(tab);
        return this.getTabByIndex(currentIndex - 1);
    }
}