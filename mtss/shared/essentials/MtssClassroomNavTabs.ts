/**
 * TypeScript enum and helper for MtssClassroomNavTabs (converted from Java)
 * @author hyders
 */
export enum MtssClassroomNavTabs {
  SEARCH = 'Student List',
}

export const MtssClassroomNavTabsIndex: Record<MtssClassroomNavTabs, number> = {
  [MtssClassroomNavTabs.SEARCH]: 3,
};

/**
 * Helper functions for Playwright test compatibility
 * Equivalent to Java methods: getValue() and getListIndex()
 */
export class MtssClassroomNavTabsHelper {
  /**
   * Get the display value for a tab (equivalent to getValue())
   * @param tab The classroom nav tab
   * @returns The display text value
   */
  static getValue(tab: MtssClassroomNavTabs): string {
    return tab;
  }

  /**
   * Get the list index for a tab (equivalent to getListIndex())
   * @param tab The classroom nav tab
   * @returns The numeric index
   */
  static getListIndex(tab: MtssClassroomNavTabs): number {
    return MtssClassroomNavTabsIndex[tab];
  }

  /**
   * Get all tab values as an array
   * @returns Array of all tab values
   */
  static getAllValues(): string[] {
    return Object.values(MtssClassroomNavTabs);
  }

  /**
   * Get all tab indices as an array
   * @returns Array of all tab indices
   */
  static getAllIndices(): number[] {
    return Object.values(MtssClassroomNavTabsIndex);
  }

  /**
   * Get tab by index (useful for Playwright element selection)
   * @param index The numeric index
   * @returns The corresponding tab or undefined
   */
  static getByIndex(index: number): MtssClassroomNavTabs | undefined {
    return Object.keys(MtssClassroomNavTabsIndex).find(
      key => MtssClassroomNavTabsIndex[key as MtssClassroomNavTabs] === index
    ) as MtssClassroomNavTabs | undefined;
  }
}
