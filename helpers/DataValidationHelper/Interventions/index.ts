/**
 * Interventions Helpers Index
 * Exports all intervention-related helper classes
 * Provides centralized exports for all intervention helper classes
 *
 * @author MSA Team
 * @since 2025-11-28
 */

// Import and re-export helper classes
import { HoonuitGoalDatawallHelper } from './hoonuitGoalDatawallHelper';
import { HoonuitInterventionEffectivenessHelper } from './hoonuitInterventionEffectivenessHelper';
import { HoonuitInterventionListHelper } from './hoonuitInterventionListHelper';
import { HoonuitInterventionOverviewHelper } from './hoonuitInterventionOverviewHelper';
import { HoonuitStudentInterventionsHelper } from './hoonuitStudentInterventionsHelper';

// Export helper classes
export {
    HoonuitGoalDatawallHelper,
    HoonuitInterventionEffectivenessHelper,
    HoonuitInterventionListHelper,
    HoonuitInterventionOverviewHelper,
    HoonuitStudentInterventionsHelper
};

// Import and re-export types/interfaces
import type { GoalData, DatawallSummary } from './hoonuitGoalDatawallHelper';
import type { EffectivenessData, EffectivenessSummary, TrendData } from './hoonuitInterventionEffectivenessHelper';
import type { InterventionListItem, InterventionListSummary } from './hoonuitInterventionListHelper';
import type { OverviewMetrics, InterventionBreakdown, TierDistribution } from './hoonuitInterventionOverviewHelper';
import type { StudentInterventionData, StudentInterventionSummary, InterventionProgress } from './hoonuitStudentInterventionsHelper';

// Export all types
export type {
    // Goal Datawall types
    GoalData,
    DatawallSummary,
    // Effectiveness types
    EffectivenessData,
    EffectivenessSummary,
    TrendData,
    // Intervention List types
    InterventionListItem,
    InterventionListSummary,
    // Overview types
    OverviewMetrics,
    InterventionBreakdown,
    TierDistribution,
    // Student Interventions types
    StudentInterventionData,
    StudentInterventionSummary,
    InterventionProgress
};

/**
 * Common utility types for intervention data
 */
export type InterventionStaffData = Record<string, string>;
export type InterventionDataArray = Array<InterventionStaffData>;