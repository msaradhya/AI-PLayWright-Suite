/**
 * Classroom Module Navigation Enums
 * Converted from Java enum to TypeScript
 * 
 * @author Converted from Java
 */

/**
 * AcademicsProgressNavTabs enum - Navigation tabs for Academic Progress in Classroom
 */
export enum AcademicsProgressNavTabs {
    GRADES = 'Grades',
    STUDENT_STANDARD_PROGRESS = 'Student Standard Progress'
}

export const AcademicsProgressNavTabsIndex: Record<AcademicsProgressNavTabs, number> = {
    [AcademicsProgressNavTabs.GRADES]: 0,
    [AcademicsProgressNavTabs.STUDENT_STANDARD_PROGRESS]: 1
};

/**
 * AssessmentsNavTabs enum - Navigation tabs for Assessments in Classroom
 */
export enum AssessmentsNavTabs {
    SUBJECT_ANALYSIS = 'Subject Analysis',
    GAINERS_STICKERS_SLIDERS = 'Gainers Stickers Sliders',
    ASSESSMENT_ROSTER = 'Assessment Roster'
}

export const AssessmentsNavTabsIndex: Record<AssessmentsNavTabs, number> = {
    [AssessmentsNavTabs.SUBJECT_ANALYSIS]: 0,
    [AssessmentsNavTabs.GAINERS_STICKERS_SLIDERS]: 1,
    [AssessmentsNavTabs.ASSESSMENT_ROSTER]: 2
};

/**
 * DigitalLearningTabs enum - Navigation tabs for Digital Learning (Legacy naming)
 * 
 * @author Sourav.Panda
 * @since 5/3/2021
 */
export enum DigitalLearningTabs {
    STUDENT_ACTIVITY = 'Student Activity',
    STUDENT_OUTCOME = 'Student Outcomes'
}

export const DigitalLearningTabsIndex: Record<DigitalLearningTabs, number> = {
    [DigitalLearningTabs.STUDENT_ACTIVITY]: 0,
    [DigitalLearningTabs.STUDENT_OUTCOME]: 1
};

/**
 * DigitalLearningNavTabs enum - Navigation tabs for Digital Learning in Classroom
 */
export enum DigitalLearningNavTabs {
    STUDENT_ACTIVITY = 'Student Activity',
    STUDENT_ACTIVITY_DATA_WALL = 'Student Activity Data Wall',
    STUDENT_OUTCOMES = 'Student Outcomes'
}

export const DigitalLearningNavTabsIndex: Record<DigitalLearningNavTabs, number> = {
    [DigitalLearningNavTabs.STUDENT_ACTIVITY]: 0,
    [DigitalLearningNavTabs.STUDENT_ACTIVITY_DATA_WALL]: 1,
    [DigitalLearningNavTabs.STUDENT_OUTCOMES]: 2
};

/**
 * MyStudentsNavTabs enum - Navigation tabs for My Students in Classroom
 */
export enum MyStudentsNavTabs {
    OVERVIEW = 'Student Overview',
    ABSENCES = 'Absences'
}

export const MyStudentsNavTabsIndex: Record<MyStudentsNavTabs, number> = {
    [MyStudentsNavTabs.OVERVIEW]: 0,
    [MyStudentsNavTabs.ABSENCES]: 1
};

/**
 * StudentPlansNavTabs enum - Navigation tabs for Student Plans in Classroom
 * 
 * @author kumarsu
 * @since 07-03-2024
 */
export enum StudentPlansNavTabs {
    STUDENTPLANS = 'Student Plans'
}

export const StudentPlansNavTabsIndex: Record<StudentPlansNavTabs, number> = {
    [StudentPlansNavTabs.STUDENTPLANS]: 0
};