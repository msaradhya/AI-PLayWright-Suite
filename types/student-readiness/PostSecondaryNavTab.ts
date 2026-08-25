/**
 * Enum representing PostSecondary Navigation Tabs
 * Maps directly to Java enum psqa.hoonuit.shared.enums.menu.studentReadiness.PostSecondaryNavTab
 * @author Automated Migration
 * @since 2025
 */
export enum PostSecondaryNavTab {
    COLLEGE_ENROLLMENT = 'College Enrollment',
    COLLEGE_PERSISTENCE = 'College Persistence',
    COLLEGE_GRADUATION = 'College Graduation',
    NSC_REPORTS = 'NSC Reports'
}

/**
 * Class providing utility methods for PostSecondaryNavTab
 * Matches functionality from Java enum including getValue() and getListIndex() methods
 */
export class PostSecondaryNavTabUtils {
    /**
     * Get the display text value for a tab
     * Equivalent to Java getValue() method
     */
    static getValue(tab: PostSecondaryNavTab): string {
        return tab;
    }

    /**
     * Get the list index for a tab
     * Equivalent to Java getListIndex() method
     */
    static getListIndex(tab: PostSecondaryNavTab): number {
        switch (tab) {
            case PostSecondaryNavTab.COLLEGE_ENROLLMENT:
                return 0;
            case PostSecondaryNavTab.COLLEGE_PERSISTENCE:
                return 1;
            case PostSecondaryNavTab.COLLEGE_GRADUATION:
                return 2;
            case PostSecondaryNavTab.NSC_REPORTS:
                return 3;
            default:
                return -1;
        }
    }

    /**
     * Get all available tabs as an array
     * Additional utility method for Playwright tests
     */
    static getAllTabs(): PostSecondaryNavTab[] {
        return Object.values(PostSecondaryNavTab);
    }

    /**
     * Get tab by list index
     * Additional utility method for Playwright tests - reverse lookup
     */
    static getTabByIndex(index: number): PostSecondaryNavTab | undefined {
        switch (index) {
            case 0:
                return PostSecondaryNavTab.COLLEGE_ENROLLMENT;
            case 1:
                return PostSecondaryNavTab.COLLEGE_PERSISTENCE;
            case 2:
                return PostSecondaryNavTab.COLLEGE_GRADUATION;
            case 3:
                return PostSecondaryNavTab.NSC_REPORTS;
            default:
                return undefined;
        }
    }

    /**
     * Validate if a string is a valid PostSecondaryNavTab value
     * Utility method for Playwright test validation
     */
    static isValidTab(value: string): boolean {
        return Object.values(PostSecondaryNavTab).includes(value as PostSecondaryNavTab);
    }

    /**
     * Get tab by display text (case-insensitive)
     * Additional utility method for Playwright tests
     */
    static getTabByValue(value: string): PostSecondaryNavTab | undefined {
        return this.getAllTabs().find(tab => tab.toLowerCase() === value.toLowerCase());
    }

    /**
     * Get count of total tabs
     * Utility method for Playwright test assertions
     */
    static getTabCount(): number {
        return Object.values(PostSecondaryNavTab).length;
    }

    /**
     * Get tabs ordered by index
     * Utility method for Playwright tests to ensure proper tab order
     */
    static getTabsInOrder(): PostSecondaryNavTab[] {
        const tabs: PostSecondaryNavTab[] = [];
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
    static toSelector(tab: PostSecondaryNavTab): string {
        return `[data-testid="${tab.toLowerCase().replace(/\s+/g, '-')}"]`;
    }

    /**
     * Convert enum value to CSS class name
     * Utility method for Playwright CSS-based selection
     */
    static toCssClass(tab: PostSecondaryNavTab): string {
        return tab.toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * Get tab display name with proper formatting
     * Utility method for test assertions and logging
     */
    static getDisplayName(tab: PostSecondaryNavTab): string {
        return tab;
    }

    /**
     * Check if tab is the first tab
     * Utility method for Playwright navigation tests
     */
    static isFirstTab(tab: PostSecondaryNavTab): boolean {
        return this.getListIndex(tab) === 0;
    }

    /**
     * Check if tab is the last tab
     * Utility method for Playwright navigation tests
     */
    static isLastTab(tab: PostSecondaryNavTab): boolean {
        return this.getListIndex(tab) === this.getTabCount() - 1;
    }

    /**
     * Get next tab in sequence
     * Utility method for Playwright navigation tests
     */
    static getNextTab(tab: PostSecondaryNavTab): PostSecondaryNavTab | undefined {
        const currentIndex = this.getListIndex(tab);
        return this.getTabByIndex(currentIndex + 1);
    }

    /**
     * Get previous tab in sequence
     * Utility method for Playwright navigation tests
     */
    static getPreviousTab(tab: PostSecondaryNavTab): PostSecondaryNavTab | undefined {
        const currentIndex = this.getListIndex(tab);
        return this.getTabByIndex(currentIndex - 1);
    }
}