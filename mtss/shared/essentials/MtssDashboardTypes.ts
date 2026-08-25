/**
 * TypeScript enum and helper for MtssDashboardTypes (converted from Java)
 * @author hyders
 */
export enum MtssDashboardTypes {
  ESSENTIALS = 'Student Analytics',
  CLASSROOM = 'Classroom',
}

export const MtssDashboardTypesIndex: Record<MtssDashboardTypes, number> = {
  [MtssDashboardTypes.ESSENTIALS]: 0,
  [MtssDashboardTypes.CLASSROOM]: 1,
};

/**
 * Helper functions for Playwright test compatibility
 * Equivalent to Java methods: getValue() and getListIndex()
 */
export class MtssDashboardTypesHelper {
  /**
   * Get the display value for a dashboard type (equivalent to getValue())
   * @param type The dashboard type
   * @returns The display text value
   */
  static getValue(type: MtssDashboardTypes): string {
    return type;
  }

  /**
   * Get the list index for a dashboard type (equivalent to getListIndex())
   * @param type The dashboard type
   * @returns The numeric index
   */
  static getListIndex(type: MtssDashboardTypes): number {
    return MtssDashboardTypesIndex[type];
  }

  /**
   * Get all dashboard type values as an array
   * @returns Array of all dashboard type values
   */
  static getAllValues(): string[] {
    return Object.values(MtssDashboardTypes);
  }

  /**
   * Get all dashboard type indices as an array
   * @returns Array of all dashboard type indices
   */
  static getAllIndices(): number[] {
    return Object.values(MtssDashboardTypesIndex);
  }

  /**
   * Get dashboard type by index (useful for Playwright element selection)
   * @param index The numeric index
   * @returns The corresponding dashboard type or undefined
   */
  static getByIndex(index: number): MtssDashboardTypes | undefined {
    return Object.keys(MtssDashboardTypesIndex).find(
      key => MtssDashboardTypesIndex[key as MtssDashboardTypes] === index
    ) as MtssDashboardTypes | undefined;
  }
}
