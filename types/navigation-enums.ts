/**
 * Navigation Tab Interface
 * Common interface for all navigation tab enums
 */
export interface NavTabItem {
    value: string;
    listIndex: number;
}

/**
 * ClassroomNavTabs enum - Navigation tabs for Classroom module
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */
export enum ClassroomNavTabs {
    OVERVIEW = 'Overview',
    ABSENCES = 'Absences',
    ACADEMIC_PROGRESS = 'Academic Progress',
    ASSESSMENTS = 'Assessments',
    DIGITAL_LEARNING = 'Digital Learning',
    SEARCH = 'Student List'
}

/**
 * Helper object to get list index for ClassroomNavTabs
 */
export const ClassroomNavTabsIndex: Record<ClassroomNavTabs, number> = {
    [ClassroomNavTabs.OVERVIEW]: 0,
    [ClassroomNavTabs.ABSENCES]: 1,
    [ClassroomNavTabs.ACADEMIC_PROGRESS]: 2,
    [ClassroomNavTabs.ASSESSMENTS]: 3,
    [ClassroomNavTabs.DIGITAL_LEARNING]: 4,
    [ClassroomNavTabs.SEARCH]: 5
};

/**
 * EssentialsNavTabs enum - Navigation tabs for Essentials module
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */
export enum EssentialsNavTabs {
    ENROLLMENT = 'Enrollment',
    ATTENDANCE = 'Attendance',
    BEHAVIOR = 'Behavior',
    BEHAVIOR_SUPPORT = 'Behavior Support',
    ACADEMICS = 'Academics',
    ASSESSMENTS = 'Assessments',
    DIGITAL_LEARNING = 'Digital Learning',
    STUDENTS = 'Students',
    REPORTING = 'Reporting'
}

/**
 * Helper object to get list index for EssentialsNavTabs
 */
export const EssentialsNavTabsIndex: Record<EssentialsNavTabs, number> = {
    [EssentialsNavTabs.ENROLLMENT]: 0,
    [EssentialsNavTabs.ATTENDANCE]: 1,
    [EssentialsNavTabs.BEHAVIOR]: 2,
    [EssentialsNavTabs.BEHAVIOR_SUPPORT]: 3,
    [EssentialsNavTabs.ACADEMICS]: 4,
    [EssentialsNavTabs.ASSESSMENTS]: 5,
    [EssentialsNavTabs.DIGITAL_LEARNING]: 6,
    [EssentialsNavTabs.STUDENTS]: 7,
    [EssentialsNavTabs.REPORTING]: 8
};

/**
 * StaffProfileNavTabs enum - Navigation tabs for Staff Profile module
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */
export enum StaffProfileNavTabs {
    STAFF_OVERALL = 'Staff Overall',
    PL_DETAILS = 'PL Details',
    ABSENCE_DETAIL = 'Absence Details',
    EVALUATION_DETAIL = 'Evaluation Details',
    APPLICANT_DETAIL = 'Applicant Details'
}

/**
 * Helper object to get list index for StaffProfileNavTabs
 */
export const StaffProfileNavTabsIndex: Record<StaffProfileNavTabs, number> = {
    [StaffProfileNavTabs.STAFF_OVERALL]: 0,
    [StaffProfileNavTabs.PL_DETAILS]: 1,
    [StaffProfileNavTabs.ABSENCE_DETAIL]: 2,
    [StaffProfileNavTabs.EVALUATION_DETAIL]: 3,
    [StaffProfileNavTabs.APPLICANT_DETAIL]: 4
};

/**
 * StudentProfileNavTabs enum - Navigation tabs for Student Profile module
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */
export enum StudentProfileNavTabs {
    OVERVIEW = 'Overview',
    SCHEDULE = 'Schedule',
    ATTENDANCE_DETAIL = 'Attendance Detail',
    BEHAVIOR_DETAIL = 'Behavior Detail',
    ACADEMIC_DETAIL = 'Academic Detail',
    ASSESSMENT_DETAIL = 'Assessment Detail',
    INTERVENTION = 'Interventions',
    STUDENT_PLANS = ' Student Plans ',
    STUDENT_PLANS_DETAIL = 'Student Plans Detail',
    BEHAVIOR_SUPPORT = 'Behavior Support'
}

/**
 * Helper object to get list index for StudentProfileNavTabs
 */
export const StudentProfileNavTabsIndex: Record<StudentProfileNavTabs, number> = {
    [StudentProfileNavTabs.OVERVIEW]: 0,
    [StudentProfileNavTabs.SCHEDULE]: 1,
    [StudentProfileNavTabs.ATTENDANCE_DETAIL]: 2,
    [StudentProfileNavTabs.BEHAVIOR_DETAIL]: 3,
    [StudentProfileNavTabs.ACADEMIC_DETAIL]: 4,
    [StudentProfileNavTabs.ASSESSMENT_DETAIL]: 5,
    [StudentProfileNavTabs.INTERVENTION]: 6,
    [StudentProfileNavTabs.STUDENT_PLANS]: 9,
    [StudentProfileNavTabs.STUDENT_PLANS_DETAIL]: 10,
    [StudentProfileNavTabs.BEHAVIOR_SUPPORT]: 11
};

/**
 * UsageNavTabs enum - Navigation tabs for Usage module
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */
export enum UsageNavTabs {
    DASHBOARD = 'Dashboard',
    USAGE = 'Usage',
    RISK_ANALYSIS_PRE_CHECK = 'Risk Analysis Pre-Check',
    TENANT_CONFIGURATION = 'Tenant Configuration',
    AUDIT_SUMMARY = 'Audits Summary',
    SYSTEM_STATISTICS = 'System Statistics',
    PERFORMANCE = 'Performance',
    CHANGELOG = 'Change Log'
}

/**
 * Helper object to get list index for UsageNavTabs
 */
export const UsageNavTabsIndex: Record<UsageNavTabs, number> = {
    [UsageNavTabs.DASHBOARD]: 0,
    [UsageNavTabs.USAGE]: 1,
    [UsageNavTabs.RISK_ANALYSIS_PRE_CHECK]: 2,
    [UsageNavTabs.TENANT_CONFIGURATION]: 3,
    [UsageNavTabs.AUDIT_SUMMARY]: 4,
    [UsageNavTabs.SYSTEM_STATISTICS]: 5,
    [UsageNavTabs.PERFORMANCE]: 6,
    [UsageNavTabs.CHANGELOG]: 7
};