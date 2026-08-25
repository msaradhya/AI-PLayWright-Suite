/**
 * Student Plan Analytics Navigation Enums - Index
 * 
 * This module exports all navigation enums for the Student Plan Analytics section.
 * 
 * @example
 * ```typescript
 * import { 
 *   StudentPlanNavTabs, 
 *   studentPlanNavTabsUtils 
 * } from './types/menu/student-plan-analytics';
 * 
 * // Get tab value
 * const tabValue = studentPlanNavTabsUtils.getValue(StudentPlanNavTabs.STUDENTPLANOVERVIEW);
 * console.log(tabValue); // Output: "Overview"
 * ```
 */

// Student Plan Nav Tabs
export {
    StudentPlanNavTabs,
    StudentPlanNavTabsIndex,
    StudentPlanNavTabsUtils,
    studentPlanNavTabsUtils,
    IStudentPlanNavTabsUtils
} from './StudentPlanNavTabs';