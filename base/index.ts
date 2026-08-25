/**
 * Base Page Components Index
 *
 * This file exports base page components for easy importing.
 *
 * Usage:
 * import { FilterData } from '../base';
 * // or
 * import { FilterData } from './base';
 */

// Filter Data - Consolidated filter component
// Combines functionality from filter-data.page.ts, filter-data.ts, and FilterData.ts
export { FilterData } from './FilterData';
export { default as FilterDataDefault } from './FilterData';

// Base Pages with named exports
export { HoonuitBasePage, HoonuitSisBasePage } from './HoonuitBasePage';
export { DashboardTypes } from './DashboardTypes';

// Components with named exports
export { HoonuitCard } from './card/HoonuitCard';
export { HoonuitAlert } from './alert/HoonuitAlert';
export { HoonuitAddToGroupDialog } from './dailog/HoonuitAddToGroupDialog';
export { HoonuitBarChart } from './chart/HoonuitBarChart';
export { HoonuitPieChart } from './chart/HoonuitPieChart';
export { HoonuitPointChart } from './chart/HoonuitPointChart';
export { HoonuitStackBarChart } from './chart/HoonuitStackBarChart';
export { HoonuitGridTable } from './table/HoonuitGridTable';
export { HoonuitActionGridTable } from './table/HoonuitActionGridTable';
export { HoonuitCrossTabGridTable } from './table/HoonuitCrossTabGridTable';

// Default exports re-exported
export { default as HoonuitDevelopmentToolsBasePage } from './HoonuitDevelopmentToolsBasePage';
export { default as HoonuitBaseDialog } from './dailog/HoonuitBaseDialog';
export { default as HoonuitChartInformationDialog } from './dailog/HoonuitChartInformationDialog';
export { default as HoonuitBaseChart } from './chart/HoonuitBaseChart';
export { default as HoonuitBaseTable } from './table/HoonuitBaseTable';
export { default as HoonuitGroupManagementPage } from './HoonuitGroupManagementPage';
export { default as HoonuitInfobaseLearningCloudPage } from './HoonuitInfobaseLearningCloudPage';