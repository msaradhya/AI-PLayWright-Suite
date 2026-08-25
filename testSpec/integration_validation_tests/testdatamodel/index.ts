/**
 * Integration Validation Test Data Model Index
 * Exports all test data models for integration validation tests
 *
 * All test data models now support fetching data from the Azure SQL Server database
 * using the centralized HoonuitEtlDataHelper.
 */

// Admin Digital Learning Dashboard
export {
    HoonuitAdminDigitalLearningDashboardData,
    HoonuitAdminDigitalLearningDashboardDataClass,
    HoonuitAdminDigitalLearningDashboardDataFactory,
    HoonuitEtlDataHelper
} from './HoonuitAdminDigitalLearningDashboardData';

// Attendance Data Validation
export {
    HoonuitAttendanceDataValidationData,
    type HowPrevalentAreTardiesInMyClassesData
} from './HoonuitAttendanceDataValidationData';

// Academics Dashboard
export {
    HoonuitDAValidatesAcademicsDashboardData,
    HoonuitDAValidatesAcademicsEtlDataHelper,
    type HoonuitDAValidatesAcademicsDashboardDataInterface
} from './HoonuitDAValidatesAcademicsDashboardData';

// Incident Behaviour Action
export {
    HoonuitIncidentBehaviourActionData,
    HoonuitIncidentBehaviourEtlDataHelper,
    HoonuitStudentEnrollmentToCourseData,
    type HoonuitIncidentBehaviourActionDataInterface
} from './HoonuitIncidentBehaviourActionData';

// Student Enrollment to Course
export {
    HoonuitStudentEnrollmentToCourseDataModel,
    HoonuitStudentEnrollmentEtlDataHelper,
    type HoonuitStudentEnrollmentToCourseData as HoonuitStudentEnrollmentToCourseDataInterface
} from './HoonuitStudentEnrollmentToCourseData';

// Teacher Digital Learning Dashboard
export {
    HoonuitTeacherDigitalLearningDashboardDataModel,
    HoonuitTeacherDigitalLearningEtlDataHelper,
    type HoonuitTeacherDigitalLearningDashboardData
} from './HoonuitTeacherDigitalLearningDashboardData';

// Withdrawn Data Validation
export {
    HoonuitWithdrawnDataValidationDataModel,
    type WhichStudentsAreReceivingProgramServices
} from './HoonuitWithdrawnDataValidationData';

// Re-export the centralized ETL Data Helper from shared helpers
export { HoonuitEtlDataHelper as BaseEtlDataHelper } from '../../../shared/helpers/HoonuitEtlDataHelper';