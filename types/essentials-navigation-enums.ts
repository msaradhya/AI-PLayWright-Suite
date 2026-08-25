/**
 * Essentials Module Navigation Enums
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */

/**
 * AcademicNavTabs enum - Navigation tabs for Academics in Essentials
 */
export enum AcademicNavTabs {
    ACHIEVEMENT = 'Achievement',
    CORE_SUBJECTS_SUMMARY = 'Core Subjects Summary',
    AP = 'AP',
    TEACHER_ANALYSIS = 'Teacher Analysis',
    SCHOOL_STANDARD_PROGRESS = 'School Standard Progress',
    STUDENT_STANDARD_PROGRESS = 'Student Standard Progress',
    STANDARDS_BY_GRADE = 'Standards by Grade'
}

export const AcademicNavTabsIndex: Record<AcademicNavTabs, number> = {
    [AcademicNavTabs.ACHIEVEMENT]: 0,
    [AcademicNavTabs.CORE_SUBJECTS_SUMMARY]: 1,
    [AcademicNavTabs.AP]: 2,
    [AcademicNavTabs.TEACHER_ANALYSIS]: 3,
    [AcademicNavTabs.SCHOOL_STANDARD_PROGRESS]: 4,
    [AcademicNavTabs.STUDENT_STANDARD_PROGRESS]: 5,
    [AcademicNavTabs.STANDARDS_BY_GRADE]: 6
};

/**
 * AISNavTabs enum - Navigation tabs for AIS in Essentials
 */
export enum AISNavTabs {
    AIS_OVERVIEW = 'AIS Overview',
    COMMUNICATION = 'Communication',
    MY_AIS_OVERVIEW = 'My AIS Overview',
    INTERVENTION_EFFECTIVENESS = 'Intervention Effectiveness'
}

export const AISNavTabsIndex: Record<AISNavTabs, number> = {
    [AISNavTabs.AIS_OVERVIEW]: 0,
    [AISNavTabs.COMMUNICATION]: 1,
    [AISNavTabs.MY_AIS_OVERVIEW]: 2,
    [AISNavTabs.INTERVENTION_EFFECTIVENESS]: 3
};

/**
 * AttendanceNavTabs enum - Navigation tabs for Attendance in Essentials
 */
export enum AttendanceNavTabs {
    ATTENDANCE_OVERVIEW = 'Attendance Overview',
    CHRONIC_ABSENCES = 'Chronic Absences',
    SCHOOL_COMPARISON = 'School Comparison',
    CLASSROOM_ABSENCES = 'Classroom Absences'
}

export const AttendanceNavTabsIndex: Record<AttendanceNavTabs, number> = {
    [AttendanceNavTabs.ATTENDANCE_OVERVIEW]: 0,
    [AttendanceNavTabs.CHRONIC_ABSENCES]: 1,
    [AttendanceNavTabs.SCHOOL_COMPARISON]: 2,
    [AttendanceNavTabs.CLASSROOM_ABSENCES]: 3
};

/**
 * BehaviorNavTabs enum - Navigation tabs for Behavior in Essentials
 */
export enum BehaviorNavTabs {
    BEHAVIOR_OVERVIEW = 'Behavior Overview',
    SUSPENSION_USAGE = 'Suspension Usage',
    SEVERE_INCIDENTS = 'Severe Offenses',
    ANALYSIS = 'Analysis',
    ETHNICITY_ANALYSIS = 'Ethnicity Analysis'
}

export const BehaviorNavTabsIndex: Record<BehaviorNavTabs, number> = {
    [BehaviorNavTabs.BEHAVIOR_OVERVIEW]: 0,
    [BehaviorNavTabs.SUSPENSION_USAGE]: 1,
    [BehaviorNavTabs.SEVERE_INCIDENTS]: 2,
    [BehaviorNavTabs.ANALYSIS]: 3,
    [BehaviorNavTabs.ETHNICITY_ANALYSIS]: 4
};

/**
 * StudentsNavTabs enum - Navigation tabs for Students in Essentials
 */
export enum StudentsNavTabs {
    STUDENT_LIST = 'Student List'
}

export const StudentsNavTabsIndex: Record<StudentsNavTabs, number> = {
    [StudentsNavTabs.STUDENT_LIST]: 0
};