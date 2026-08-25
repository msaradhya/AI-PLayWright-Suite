/**
 * Risk Analysis Module Navigation Enums
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */

/**
 * CutScoreNavTab enum - Navigation tabs for Cut Scores in Risk Analysis
 */
export enum CutScoreNavTab {
    CUT_SCORE = 'Cut Scores'
}

export const CutScoreNavTabIndex: Record<CutScoreNavTab, number> = {
    [CutScoreNavTab.CUT_SCORE]: 0
};

/**
 * GraduationProbabilityNavTabs enum - Navigation tabs for Graduation Probability in Risk Analysis
 */
export enum GraduationProbabilityNavTabs {
    OVERVIEW = 'Overview',
    STUDENTS_AT_RISK = 'Students at Risk',
    PROXIMITY_CUT_SCORE = 'Proximity to Cut Score',
    SCHOOL_WIDE_RISK = 'School-wide Risk',
    WITHDRAWN_STUDENT_ANALYSIS = 'Withdrawn Student Analysis',
    GROUP_COMPARISON = 'Group Comparison'
}

export const GraduationProbabilityNavTabsIndex: Record<GraduationProbabilityNavTabs, number> = {
    [GraduationProbabilityNavTabs.OVERVIEW]: 0,
    [GraduationProbabilityNavTabs.STUDENTS_AT_RISK]: 1,
    [GraduationProbabilityNavTabs.PROXIMITY_CUT_SCORE]: 2,
    [GraduationProbabilityNavTabs.SCHOOL_WIDE_RISK]: 3,
    [GraduationProbabilityNavTabs.WITHDRAWN_STUDENT_ANALYSIS]: 4,
    [GraduationProbabilityNavTabs.GROUP_COMPARISON]: 5
};

/**
 * IndividualFactorNavTabs enum - Navigation tabs for Individual Factors in Risk Analysis
 */
export enum IndividualFactorNavTabs {
    OVERVIEW = 'Overview',
    ACADEMIC_FACTORS = 'Academic Factors',
    ATTENDANCE_FACTORS = 'Attendance Factors',
    BEHAVIOR_FACTORS = 'Behavior Factors',
    STUDENTS_DATA_WALL = 'Student Data Wall'
}

export const IndividualFactorNavTabsIndex: Record<IndividualFactorNavTabs, number> = {
    [IndividualFactorNavTabs.OVERVIEW]: 0,
    [IndividualFactorNavTabs.ACADEMIC_FACTORS]: 1,
    [IndividualFactorNavTabs.ATTENDANCE_FACTORS]: 2,
    [IndividualFactorNavTabs.BEHAVIOR_FACTORS]: 3,
    [IndividualFactorNavTabs.STUDENTS_DATA_WALL]: 4
};

/**
 * TrendNavTabs enum - Navigation tabs for Trends in Risk Analysis
 */
export enum TrendNavTabs {
    OVERVIEW = 'Overview',
    ATTENDANCE = 'Attendance',
    BEHAVIOR = 'Behavior',
    ACADEMICS = 'Academics'
}

export const TrendNavTabsIndex: Record<TrendNavTabs, number> = {
    [TrendNavTabs.OVERVIEW]: 0,
    [TrendNavTabs.ATTENDANCE]: 1,
    [TrendNavTabs.BEHAVIOR]: 2,
    [TrendNavTabs.ACADEMICS]: 3
};

/**
 * ValidationNavTabs enum - Navigation tabs for Validation in Risk Analysis
 */
export enum ValidationNavTabs {
    PREDICTIVE_FACTOR = 'Predictive Factors',
    IMPUTED_DETAILS = 'Imputed Details',
    END_OUTCOME = 'End Outcome'
}

export const ValidationNavTabsIndex: Record<ValidationNavTabs, number> = {
    [ValidationNavTabs.PREDICTIVE_FACTOR]: 0,
    [ValidationNavTabs.IMPUTED_DETAILS]: 1,
    [ValidationNavTabs.END_OUTCOME]: 2
};