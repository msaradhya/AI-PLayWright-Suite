/**
 * TypeScript enum and helper for EnrollmentNavTabs (converted from Java)
 * @author hyders
 */
export enum EnrollmentNavTabs {
  ENROLLMENT_OVERVIEW = 'Enrollment Overview',
  ADMISSIONS = 'Admissions',
  WITHDRAWALS = 'Withdrawals',
  PROGRAMS = 'Programs',
}

export const EnrollmentNavTabsIndex: Record<EnrollmentNavTabs, number> = {
  [EnrollmentNavTabs.ENROLLMENT_OVERVIEW]: 0,
  [EnrollmentNavTabs.ADMISSIONS]: 1,
  [EnrollmentNavTabs.WITHDRAWALS]: 2,
  [EnrollmentNavTabs.PROGRAMS]: 3,
};

/**
 * Helper functions for Playwright test compatibility
 * Equivalent to Java methods: getValue() and getListIndex()
 */
export class EnrollmentNavTabsHelper {
  /**
   * Get the display value for a tab (equivalent to getValue())
   * @param tab The enrollment nav tab
   * @returns The display text value
   */
  static getValue(tab: EnrollmentNavTabs): string {
    return tab;
  }

  /**
   * Get the list index for a tab (equivalent to getListIndex())
   * @param tab The enrollment nav tab
   * @returns The numeric index
   */
  static getListIndex(tab: EnrollmentNavTabs): number {
    return EnrollmentNavTabsIndex[tab];
  }

  /**
   * Get all tab values as an array
   * @returns Array of all tab values
   */
  static getAllValues(): string[] {
    return Object.values(EnrollmentNavTabs);
  }

  /**
   * Get all tab indices as an array
   * @returns Array of all tab indices
   */
  static getAllIndices(): number[] {
    return Object.values(EnrollmentNavTabsIndex);
  }

  /**
   * Get tab by index (useful for Playwright element selection)
   * @param index The numeric index
   * @returns The corresponding tab or undefined
   */
  static getByIndex(index: number): EnrollmentNavTabs | undefined {
    return Object.keys(EnrollmentNavTabsIndex).find(
      key => EnrollmentNavTabsIndex[key as EnrollmentNavTabs] === index
    ) as EnrollmentNavTabs | undefined;
  }
}
