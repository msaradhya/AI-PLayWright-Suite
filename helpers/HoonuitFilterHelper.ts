/**
 * Hoonuit Filter Helper
 * Helper class that provides filter keys for various Hoonuit dashboards
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
export class HoonuitFilterHelper {
    // Performance Indicator dashboard filters
    private static readonly PERFORMANCE_INDICATOR_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom Gender", "Custom School short name"];
    
    // Enrollment dashboard filters
    private static readonly ENROLLMENT_OVERVIEW_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom Gender", "Custom School short name"];
    private static readonly PS6_ENROLLMENT_OVERVIEW_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group"];
    private static readonly ADMISSION_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom Gender", "Custom School short name"];
    private static readonly WITHDRAWALS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom Gender", "Custom School short name"];
    private static readonly PROGRAMS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom Gender", "Custom School short name", "Year"];
    
    // Attendance dashboard filters
    private static readonly ATTENDANCE_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name"];
    private static readonly CHRONIC_ABSENCE_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name", "Year", "Student Status"];
    private static readonly SCHOOL_COMPARISON_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name"];
    private static readonly CLASSROOM_ABSENCE_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name"];
    
    // Behavior dashboard filters
    private static readonly BEHAVIOR_OVERVIEW_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Incident Group", "Incident Type", "CUSTOM School ID", "Custom Gender", "Custom School short name", "YOY"];
    private static readonly PS6_BEHAVIOR_OVERVIEW_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Incident Group", "Incident Type", "YOY"];
    private static readonly SUSPENSION_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Incident Group", "Incident Type", "CUSTOM School ID", "Custom Gender", "Custom School short name"];
    private static readonly SEVERE_INCIDENTS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Incident Group", "Incident Type", "CUSTOM School ID", "Custom Gender", "Custom School short name"];
    private static readonly ANALYSIS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Date Range", "Student Group", "Incident Group", "Incident Type", "CUSTOM School ID", "Custom Gender", "Custom School short name"];
    private static readonly ETHNICITY_ANALYSIS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Year", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Incident Group", "Incident Type", "CUSTOM School ID", "Custom Gender", "Custom School short name"];
    
    // Achievement dashboard filters
    private static readonly ACHIEVEMENT_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Subject", "Course", "Grading Period", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name", "Year"];
    private static readonly CORE_SUBJECTS_SUMMARY_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Subject", "Course", "Grading Period", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name", "Year"];
    private static readonly AP_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name", "Staff", "Subject", "Course", "Year"];
    private static readonly TEACHER_ANALYSIS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Subject", "Course", "Grading Period", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name"];
    private static readonly STANDARD_BY_GRADE_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Subject", "Grading Period", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name", "Curriculum Group", "Curriculum Skill", "Curriculum Item", "Year"];
    private static readonly SCHOOL_STANDARD_PROGRESS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Subject", "Grading Period", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name", "Curriculum Group", "Curriculum Skill", "Curriculum Item", "Year", "Course Type"];
    private static readonly STUDENT_STANDARD_PROGRESS_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Staff", "Subject", "Grading Period", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Custom School ID", "Custom Gender", "Custom School short name", "Curriculum Group", "Curriculum Skill", "Curriculum Item", "Year", "Course Type"];
    private static readonly ATTENDANCE_AND_BEHAVIOR_FILTERS_KEYS = ["Custom School ID", "Custom Gender", "Custom School short name", "District", "School Type", "School", "Grade", "Staff", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Year"];
    
    // Digital Learning dashboard filters
    private static readonly STUDENT_OUTCOME_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Custom School ID", "Custom Gender", "Custom School short name", "Staff", "Subject", "Course", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Student Status"];
    private static readonly STAFF_ACTIVITY_FILTERS_KEYS = ["District", "School Type", "School", "Custom School ID", "Custom Gender", "Custom School short name", "Staff", "Subject", "Course"];
    private static readonly STUDENT_ACTIVITY_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Custom School ID", "Custom Gender", "Custom School short name", "Staff", "Subject", "Course", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Student Status"];
    private static readonly STUDENT_ACTIVITY_DATA_WALL_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Custom School ID", "Custom Gender", "Custom School short name", "Staff", "Subject", "Course", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Student Status"];

    // Intervention dashboard filters
    private static readonly INTERVENTION_FILTERS_KEYS = ["District", "School Type", "School", "Grade", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group", "Date Range", "Intervention Name", "Intervention Level", "Intervention Type", "Intervention SubType", "Withdrawal Reason", "Enrollment Reason", "Visibility", "Intervention Status", "Custom Gender"];

    // Getter methods for each filter key set
    static getPerformanceIndicatorFiltersKeys(): string[] {
        return [...this.PERFORMANCE_INDICATOR_FILTERS_KEYS];
    }
    
    static getEnrollmentOverviewFiltersKeys(): string[] {
        return [...this.ENROLLMENT_OVERVIEW_FILTERS_KEYS];
    }
    
    static getPS6EnrollmentOverviewFiltersKeys(): string[] {
        return [...this.PS6_ENROLLMENT_OVERVIEW_FILTERS_KEYS];
    }
    
    static getAdmissionFiltersKeys(): string[] {
        return [...this.ADMISSION_FILTERS_KEYS];
    }
    
    static getWithdrawalsFiltersKeys(): string[] {
        return [...this.WITHDRAWALS_FILTERS_KEYS];
    }
    
    static getProgramsFiltersKeys(): string[] {
        return [...this.PROGRAMS_FILTERS_KEYS];
    }
    
    static getAttendanceFiltersKeys(): string[] {
        return [...this.ATTENDANCE_FILTERS_KEYS];
    }
    
    static getChronicAbsenceFiltersKeys(): string[] {
        return [...this.CHRONIC_ABSENCE_FILTERS_KEYS];
    }
    
    static getSchoolComparisonFiltersKeys(): string[] {
        return [...this.SCHOOL_COMPARISON_FILTERS_KEYS];
    }
    
    static getClassroomAbsenceFiltersKeys(): string[] {
        return [...this.CLASSROOM_ABSENCE_FILTERS_KEYS];
    }
    
    static getBehaviorOverviewFiltersKeys(): string[] {
        return [...this.BEHAVIOR_OVERVIEW_FILTERS_KEYS];
    }
    
    static getPS6BehaviorOverviewFiltersKeys(): string[] {
        return [...this.PS6_BEHAVIOR_OVERVIEW_FILTERS_KEYS];
    }
    
    static getSuspensionFiltersKeys(): string[] {
        return [...this.SUSPENSION_FILTERS_KEYS];
    }
    
    static getSevereIncidentsFiltersKeys(): string[] {
        return [...this.SEVERE_INCIDENTS_FILTERS_KEYS];
    }
    
    static getAnalysisFiltersKeys(): string[] {
        return [...this.ANALYSIS_FILTERS_KEYS];
    }
    
    static getEthnicityAnalysisFiltersKeys(): string[] {
        return [...this.ETHNICITY_ANALYSIS_FILTERS_KEYS];
    }
    
    static getAchievementFiltersKeys(): string[] {
        return [...this.ACHIEVEMENT_FILTERS_KEYS];
    }
    
    static getCoreSubjectsSummaryFiltersKeys(): string[] {
        return [...this.CORE_SUBJECTS_SUMMARY_FILTERS_KEYS];
    }
    
    static getApFiltersKeys(): string[] {
        return [...this.AP_FILTERS_KEYS];
    }
    
    static getTeacherAnalysisFiltersKeys(): string[] {
        return [...this.TEACHER_ANALYSIS_FILTERS_KEYS];
    }
    
    static getStandardByGradeFiltersKeys(): string[] {
        return [...this.STANDARD_BY_GRADE_FILTERS_KEYS];
    }
    
    static getSchoolStandardProgressFiltersKeys(): string[] {
        return [...this.SCHOOL_STANDARD_PROGRESS_FILTERS_KEYS];
    }
    
    static getStudentStandardProgressFiltersKeys(): string[] {
        return [...this.STUDENT_STANDARD_PROGRESS_FILTERS_KEYS];
    }
    
    static getAttendanceAndBehaviorFiltersKeys(): string[] {
        return [...this.ATTENDANCE_AND_BEHAVIOR_FILTERS_KEYS];
    }
    
    static getStudentOutcomeFiltersKeys(): string[] {
        return [...this.STUDENT_OUTCOME_FILTERS_KEYS];
    }
    
    static getStaffActivityFiltersKeys(): string[] {
        return [...this.STAFF_ACTIVITY_FILTERS_KEYS];
    }
    
    static getStudentActivityFiltersKeys(): string[] {
        return [...this.STUDENT_ACTIVITY_FILTERS_KEYS];
    }
    
    static getStudentActivityDataWallFiltersKeys(): string[] {
        return [...this.STUDENT_ACTIVITY_DATA_WALL_FILTERS_KEYS];
    }

    static getInterventionFiltersKeys(): string[] {
        return [...this.INTERVENTION_FILTERS_KEYS];
    }

    /**
     * Get filter keys by dashboard name
     * @param dashboardName Name of the dashboard
     * @returns Array of filter keys
     */
    static getFilterKeysByDashboard(dashboardName: string): string[] {
        const dashboardMap: { [key: string]: string[] } = {
            'performance_indicator': this.PERFORMANCE_INDICATOR_FILTERS_KEYS,
            'enrollment_overview': this.ENROLLMENT_OVERVIEW_FILTERS_KEYS,
            'ps6_enrollment_overview': this.PS6_ENROLLMENT_OVERVIEW_FILTERS_KEYS,
            'admission': this.ADMISSION_FILTERS_KEYS,
            'withdrawals': this.WITHDRAWALS_FILTERS_KEYS,
            'programs': this.PROGRAMS_FILTERS_KEYS,
            'attendance': this.ATTENDANCE_FILTERS_KEYS,
            'chronic_absence': this.CHRONIC_ABSENCE_FILTERS_KEYS,
            'school_comparison': this.SCHOOL_COMPARISON_FILTERS_KEYS,
            'classroom_absence': this.CLASSROOM_ABSENCE_FILTERS_KEYS,
            'behavior_overview': this.BEHAVIOR_OVERVIEW_FILTERS_KEYS,
            'ps6_behavior_overview': this.PS6_BEHAVIOR_OVERVIEW_FILTERS_KEYS,
            'suspension': this.SUSPENSION_FILTERS_KEYS,
            'severe_incidents': this.SEVERE_INCIDENTS_FILTERS_KEYS,
            'analysis': this.ANALYSIS_FILTERS_KEYS,
            'ethnicity_analysis': this.ETHNICITY_ANALYSIS_FILTERS_KEYS,
            'achievement': this.ACHIEVEMENT_FILTERS_KEYS,
            'core_subjects_summary': this.CORE_SUBJECTS_SUMMARY_FILTERS_KEYS,
            'ap': this.AP_FILTERS_KEYS,
            'teacher_analysis': this.TEACHER_ANALYSIS_FILTERS_KEYS,
            'standard_by_grade': this.STANDARD_BY_GRADE_FILTERS_KEYS,
            'school_standard_progress': this.SCHOOL_STANDARD_PROGRESS_FILTERS_KEYS,
            'student_standard_progress': this.STUDENT_STANDARD_PROGRESS_FILTERS_KEYS,
            'attendance_and_behavior': this.ATTENDANCE_AND_BEHAVIOR_FILTERS_KEYS,
            'student_outcome': this.STUDENT_OUTCOME_FILTERS_KEYS,
            'staff_activity': this.STAFF_ACTIVITY_FILTERS_KEYS,
            'student_activity': this.STUDENT_ACTIVITY_FILTERS_KEYS,
            'student_activity_data_wall': this.STUDENT_ACTIVITY_DATA_WALL_FILTERS_KEYS,
            'intervention': this.INTERVENTION_FILTERS_KEYS
        };

        const key = dashboardName.toLowerCase().replace(/\s+/g, '_');
        return dashboardMap[key] ? [...dashboardMap[key]] : [];
    }

    /**
     * Check if a filter key exists for a dashboard
     * @param dashboardName Name of the dashboard
     * @param filterKey Filter key to check
     * @returns True if filter key exists
     */
    static hasFilterKey(dashboardName: string, filterKey: string): boolean {
        const filterKeys = this.getFilterKeysByDashboard(dashboardName);
        return filterKeys.includes(filterKey);
    }

    /**
     * Get common filter keys across all dashboards
     * @returns Array of common filter keys
     */
    static getCommonFilterKeys(): string[] {
        return ["District", "School Type", "School", "Grade", "Gender", "Ethnicity", "SE", "ELL", "Programs", "Student Group"];
    }
}