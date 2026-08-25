/**
 * MTSS (Multi-Tiered System of Supports) Navigation Enums - Index
 * 
 * This module exports all navigation enums for the MTSS section.
 * 
 * @description MTSS-specific dashboard and navigation tab definitions
 * 
 * @example
 * ```typescript
 * import { 
 *   MtssDashboardTypes, 
 *   mtssDashboardTypesUtils,
 *   MtssEnrollmentNavTabs,
 *   mtssEnrollmentNavTabsUtils
 * } from './types/mtss';
 * 
 * // Get dashboard type value
 * const dashboardValue = mtssDashboardTypesUtils.getValue(MtssDashboardTypes.ESSENTIALS);
 * console.log(dashboardValue); // Output: "Student Analytics"
 * 
 * // Get enrollment tab index
 * const tabIndex = mtssEnrollmentNavTabsUtils.getListIndex(MtssEnrollmentNavTabs.ADMISSIONS);
 * console.log(tabIndex); // Output: 1
 * ```
 */

// MTSS Dashboard Types
export {
    MtssDashboardTypes,
    MtssDashboardTypesIndex,
    MtssDashboardTypesUtils,
    mtssDashboardTypesUtils,
    IMtssDashboardTypesUtils
} from './MtssDashboardTypes';

// MTSS Enrollment Nav Tabs
export {
    MtssEnrollmentNavTabs,
    MtssEnrollmentNavTabsIndex,
    MtssEnrollmentNavTabsUtils,
    mtssEnrollmentNavTabsUtils,
    IMtssEnrollmentNavTabsUtils
} from './MtssEnrollmentNavTabs';

// MTSS Attendance Nav Tabs
export {
    MtssAttendanceNavTabs,
    MtssAttendanceNavTabsIndex,
    MtssAttendanceNavTabsUtils,
    mtssAttendanceNavTabsUtils,
    IMtssAttendanceNavTabsUtils
} from './MtssAttendanceNavTabs';

// MTSS Classroom Nav Tabs
export {
    MtssClassroomNavTabs,
    MtssClassroomNavTabsIndex,
    MtssClassroomNavTabsUtils,
    mtssClassroomNavTabsUtils,
    IMtssClassroomNavTabsUtils
} from './MtssClassroomNavTabs';

/**
 * Quick Reference Guide for MTSS Enums:
 * 
 * MtssDashboardTypes:
 * - ESSENTIALS: "Student Analytics" (index: 0)
 * - CLASSROOM: "Classroom" (index: 1)
 * 
 * MtssEnrollmentNavTabs:
 * - ENROLLMENT_OVERVIEW: "Enrollment Overview" (index: 0)
 * - ADMISSIONS: "Admissions" (index: 1)
 * - WITHDRAWALS: "Withdrawals" (index: 2)
 * - PROGRAMS: "Programs" (index: 3)
 * 
 * MtssAttendanceNavTabs:
 * - ATTENDANCE_OVERVIEW: "Attendance Overview" (index: 0)
 * 
 * MtssClassroomNavTabs:
 * - SEARCH: "Student List" (index: 3)
 */