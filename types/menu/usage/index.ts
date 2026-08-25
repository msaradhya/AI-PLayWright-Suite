/**
 * Usage Navigation Enums - Index
 * 
 * This module exports all navigation enums for the Usage section.
 * 
 * @example
 * ```typescript
 * import { 
 *   DashboardNavTabs, 
 *   dashboardNavTabsUtils 
 * } from './types/menu/usage';
 * 
 * // Get tab value
 * const tabValue = dashboardNavTabsUtils.getValue(DashboardNavTabs.USAGE);
 * console.log(tabValue); // Output: "Usage"
 * ```
 */

// Dashboard Nav Tabs
export {
    DashboardNavTabs,
    DashboardNavTabsIndex,
    DashboardNavTabsUtils,
    dashboardNavTabsUtils,
    IDashboardNavTabsUtils
} from './DashboardNavTabs';