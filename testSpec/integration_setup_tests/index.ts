/**
 * Integration Setup Tests Index
 * Exports all setup test utilities and user configurations
 * 
 * Note: Test files (.spec.ts) are automatically discovered by Playwright
 * This file exports shared utilities and configurations
 */

// Export users
export { SISIntegrationUsers } from './users/SISIntegrationUsers';

// Re-export commonly used types from validation tests
export { 
    HoonuitAdminDigitalLearningDashboardData,
    HoonuitAdminDigitalLearningDashboardDataClass,
    HoonuitDAValidatesAcademicsDashboardData,
    HoonuitIncidentBehaviourActionData,
    HoonuitStudentEnrollmentToCourseDataModel,
    HoonuitTeacherDigitalLearningDashboardDataModel
} from '../integration_validation_tests/testdatamodel';

// Re-export helper utilities
export { SISHelper, Schools } from '../../shared/helpers/SISHelper';
export { AppSwitcherHelper } from '../../shared/helpers/AppSwitcherHelper';
export { DateTimeHelper } from '../../shared/helpers/DateTimeHelper';
export { RandomNumbers, RandomStrings } from '../../shared/helpers/RandomNumbers';
export { HoonuitEtlDataHelper } from '../../shared/helpers/HoonuitEtlDataHelper';