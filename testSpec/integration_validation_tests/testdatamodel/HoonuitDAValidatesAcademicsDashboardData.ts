/**
 * Hoonuit DA Validates Academics Dashboard Test Data Model
 * Contains test data for academics dashboard validation tests
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.testdatamodel.HoonuitDAValidatesAcademicsDashboardData
 *
 * @author payal prajapati (original Java implementation)
 * @author converted to TypeScript
 * @since 07/07/2021
 */

import { HoonuitEtlDataHelper as BaseEtlDataHelper } from '../../../shared/helpers/HoonuitEtlDataHelper';

/**
 * Interface for DA Validates Academics Dashboard test data
 * Matches the Java class properties exactly
 */
export interface HoonuitDAValidatesAcademicsDashboardDataInterface {
    /** Expected grade value */
    expectedGrade: string;
    
    /** AP courses taken count */
    apCoursesTakenCount: number;
}

/**
 * Test data class for Academics Dashboard Validation
 * Contains both static constants and instance properties matching the Java implementation
 */
export class HoonuitDAValidatesAcademicsDashboardData implements HoonuitDAValidatesAcademicsDashboardDataInterface {
    // Filter constants
    static readonly SCHOOL_FILTER = 'School';
    static readonly UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';
    static readonly STAFF_FILTER = 'Staff';
    static readonly STAFF_FILTER_VALUE = 'UIHN 22-23, Teacher';
    static readonly GRADING_PERIOD_FILTER = 'Grading Period';
    static readonly GRADING_PERIOD_FILTER_VALUE = 'Y1';

    // Course names
    static readonly COURSE_NAME_1 = 'AP German I';
    static readonly COURSE_NAME_2 = 'AP German I, 2';
    static readonly SUBJECT = 'English/Language Arts';

    // Expected values (static constants)
    static readonly EXPECTED_GRADE_DEFAULT = 'D';
    static readonly ELA_DF_PERCENTAGE = '100.00%';
    static readonly AP_COURSE_STUDENTS_COUNT = 147;

    // Chart keys
    static readonly SEMESTER_KEY = '2, 2022-2023';
    static readonly GRADE_LEVEL_KEY = '09';
    static readonly SECTION_KEY = 'GER100B - AP German I Section';

    // Instance properties matching Java class
    private _expectedGrade: string = '';
    private _apCoursesTakenCount: number = 0;

    /**
     * Get expected grade value (instance property)
     * Matches Java: public String getExpectedGrade()
     */
    get expectedGrade(): string {
        return this._expectedGrade;
    }

    /**
     * Set expected grade value (instance property)
     * Matches Java: public void setExpectedGrade(String expectedGrade)
     */
    set expectedGrade(value: string) {
        this._expectedGrade = value;
    }

    /**
     * Get expected grade - method style (for compatibility)
     */
    getExpectedGrade(): string {
        return this._expectedGrade;
    }

    /**
     * Set expected grade - method style (for compatibility)
     * Matches Java: public void setExpectedGrade(String expectedGrade)
     */
    setExpectedGrade(expectedGrade: string): void {
        this._expectedGrade = expectedGrade;
    }

    /**
     * Get AP courses taken count (instance property)
     * Matches Java: public int getApCoursesTakenCount()
     */
    get apCoursesTakenCount(): number {
        return this._apCoursesTakenCount;
    }

    /**
     * Set AP courses taken count (instance property)
     * Matches Java: public void setApCoursesTakenCount(int apCoursesTakenCount)
     */
    set apCoursesTakenCount(value: number) {
        this._apCoursesTakenCount = value;
    }

    /**
     * Get AP courses taken count - method style (for compatibility)
     */
    getApCoursesTakenCount(): number {
        return this._apCoursesTakenCount;
    }

    /**
     * Set AP courses taken count - method style (for compatibility)
     * Matches Java: public void setApCoursesTakenCount(int apCoursesTakenCount)
     */
    setApCoursesTakenCount(apCoursesTakenCount: number): void {
        this._apCoursesTakenCount = apCoursesTakenCount;
    }

    /**
     * Get the expected grade data string (formatted for chart display)
     * @returns Formatted grade string like "● D: 1 (100.00%)"
     */
    static getExpectedGradeData(): string {
        return `● ${this.EXPECTED_GRADE_DEFAULT}: 1 (100.00%)`;
    }

    /**
     * Get expected grade value (static method for default)
     * @returns The expected grade letter
     */
    static getDefaultExpectedGrade(): string {
        return this.EXPECTED_GRADE_DEFAULT;
    }

    /**
     * Create default data instance
     */
    static createDefaultData(): HoonuitDAValidatesAcademicsDashboardData {
        const data = new HoonuitDAValidatesAcademicsDashboardData();
        data.setExpectedGrade(this.EXPECTED_GRADE_DEFAULT);
        data.setApCoursesTakenCount(0);
        return data;
    }
}

/**
 * ETL Data Helper for DA Validates Academics Dashboard
 * Note: Database connection is required - no fallback to default values
 */
export class HoonuitDAValidatesAcademicsEtlDataHelper {
    
    private static readonly DATA_CLASS_NAME = 'HoonuitDAValidatesAcademicsDashboardData';
    
    /**
     * Get DA Validates Academics Dashboard data from database
     * @returns HoonuitDAValidatesAcademicsDashboardData instance
     * @throws Error if database connection fails or data is not found
     */
    static async getData(): Promise<HoonuitDAValidatesAcademicsDashboardData> {
        // Get from database - no fallback to default values
        const data = await BaseEtlDataHelper.getDataAsObject<HoonuitDAValidatesAcademicsDashboardDataInterface>(
            this.DATA_CLASS_NAME
        );
        
        if (data) {
            console.log('Successfully fetched DA Validates Academics Dashboard data from database');
            const model = new HoonuitDAValidatesAcademicsDashboardData();
            model.expectedGrade = data.expectedGrade;
            model.apCoursesTakenCount = data.apCoursesTakenCount;
            return model;
        }
        
        throw new Error(`Failed to fetch ${this.DATA_CLASS_NAME} from database. Database connection is required.`);
    }

    /**
     * Save DA Validates Academics Dashboard data to database
     * @param data - Data to save
     */
    static async saveData(data: HoonuitDAValidatesAcademicsDashboardData): Promise<void> {
        await BaseEtlDataHelper.updateDatabase(data);
    }
}