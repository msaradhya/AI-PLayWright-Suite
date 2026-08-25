/**
 * TypeScript enum and helper for MtssAttendanceNavTabs (converted from Java)
 * @author hyders
 */
export enum MtssAttendanceNavTabs {
  ATTENDANCE_OVERVIEW = 'Attendance Overview',
}

export const MtssAttendanceNavTabsIndex: Record<MtssAttendanceNavTabs, number> = {
  [MtssAttendanceNavTabs.ATTENDANCE_OVERVIEW]: 0,
};

/**
 * Helper functions for Playwright test compatibility
 * Equivalent to Java methods: getValue() and getListIndex()
 */
export class MtssAttendanceNavTabsHelper {
  /**
   * Get the display value for a tab (equivalent to getValue())
   * @param tab The attendance nav tab
   * @returns The display text value
   */
  static getValue(tab: MtssAttendanceNavTabs): string {
    return tab;
  }

  /**
   * Get the list index for a tab (equivalent to getListIndex())
   * @param tab The attendance nav tab
   * @returns The numeric index
   */
  static getListIndex(tab: MtssAttendanceNavTabs): number {
    return MtssAttendanceNavTabsIndex[tab];
  }

  /**
   * Get all tab values as an array
   * @returns Array of all tab values
   */
  static getAllValues(): string[] {
    return Object.values(MtssAttendanceNavTabs);
  }

  /**
   * Get all tab indices as an array
   * @returns Array of all tab indices
   */
  static getAllIndices(): number[] {
    return Object.values(MtssAttendanceNavTabsIndex);
  }

  /**
   * Get tab by index (useful for Playwright element selection)
   * @param index The numeric index
   * @returns The corresponding tab or undefined
   */
  static getByIndex(index: number): MtssAttendanceNavTabs | undefined {
    return Object.keys(MtssAttendanceNavTabsIndex).find(
      key => MtssAttendanceNavTabsIndex[key as MtssAttendanceNavTabs] === index
    ) as MtssAttendanceNavTabs | undefined;
  }
}
