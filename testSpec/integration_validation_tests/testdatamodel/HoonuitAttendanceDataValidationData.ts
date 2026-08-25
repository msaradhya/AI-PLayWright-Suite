/**
 * Hoonuit Attendance Data Validation Test Data Model
 * Contains test data for attendance validation tests
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitAttendanceDataValidationAdminUserTest
 * 
 * @author dinesh (original Java implementation)
 * @author converted to TypeScript
 * @since 30/06/21
 */

/**
 * Interface for "How prevalent are tardies in my classes?" table data
 */
export interface HowPrevalentAreTardiesInMyClassesData {
    name: string;
    semester: string;
    course: string;
    tardies: string;
}

/**
 * Test data class for Attendance Data Validation
 */
export class HoonuitAttendanceDataValidationData {
    // Filter constants
    static readonly SCHOOL_FILTER = 'School';
    static readonly STAFF_FILTER = 'Staff';
    static readonly UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = ['UIHN Automation School'];
    static readonly UIHN_TEACHER_FILTER_VALUE = ['UIHN, Teacher'];

    // Table column keys
    static readonly SEMESTER_KEY = 'SEMESTER';
    static readonly TARDIES_KEY = '# TARDIES';
    static readonly COURSE_KEY = 'COURSE';
    static readonly NAME_KEY = 'NAME';

    // Expected test data for "How prevalent are tardies in my classes?" table
    static readonly howPrevalentAreTardiesData: HowPrevalentAreTardiesInMyClassesData[] = [
        {
            name: 'UIHN Meeting 22-23, Student',
            semester: '2',
            course: 'P1 - AP German I',
            tardies: '150'
        }
    ];

    // Expected value for "Who are my students with absences or tardies?" table
    static readonly EXPECTED_STUDENT_ID = '20190281';
    static readonly EXPECTED_COLUMN_INDEX = 3;
    static readonly EXPECTED_LATE_VALUE = '150';

    // Teacher-specific filter value (note: trailing space in original Java)
    static readonly UIHN_TEACHER_FILTER_VALUE_TEACHER = ['UIHN, Teacher '];

    /**
     * Get filter configuration for admin user attendance validation
     * @returns Record of filter key-value pairs
     */
    static getAdminUserFilters(): Record<string, string[]> {
        return {
            [this.SCHOOL_FILTER]: this.UIHN_AUTOMATION_SCHOOL_FILTER_VALUE,
            [this.STAFF_FILTER]: this.UIHN_TEACHER_FILTER_VALUE
        };
    }

    /**
     * Get filter configuration for teacher user attendance validation
     * @returns Record of filter key-value pairs
     */
    static getTeacherUserFilters(): Record<string, string[]> {
        return {
            [this.SCHOOL_FILTER]: this.UIHN_AUTOMATION_SCHOOL_FILTER_VALUE,
            [this.STAFF_FILTER]: this.UIHN_TEACHER_FILTER_VALUE_TEACHER
        };
    }

    /**
     * Get the first (and primary) tardy data record
     * @returns The first HowPrevalentAreTardiesInMyClassesData record
     */
    static getPrimaryTardyData(): HowPrevalentAreTardiesInMyClassesData {
        return this.howPrevalentAreTardiesData[0];
    }
}