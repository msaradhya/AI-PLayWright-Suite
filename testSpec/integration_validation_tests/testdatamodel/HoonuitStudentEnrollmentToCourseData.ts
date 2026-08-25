/**
 * Hoonuit Student Enrollment To Course Test Data Model
 * Contains test data for student enrollment validation tests
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.testdatamodel.HoonuitStudentEnrollmentToCourseData
 *
 * @author amittiwari (original Java implementation)
 * @author converted to TypeScript
 * @since 22/06/21
 */

import { HoonuitEtlDataHelper as BaseEtlDataHelper } from '../../../shared/helpers/HoonuitEtlDataHelper';

/**
 * Interface for Student Enrollment to Course test data
 * Matches Java class properties exactly
 */
export interface HoonuitStudentEnrollmentToCourseData {
    /** Name property - matches Java: private String name */
    name: string;
    /** Total count - matches Java: private int totalCount */
    totalCount: number;
    /** Female count - matches Java: private int femaleCount */
    femaleCount: number;
    /** ELL count - matches Java: private int ellCount */
    ellCount: number;
    /** YTD new admissions - matches Java: private int ytdNewAdmissions */
    ytdNewAdmissions: number;
}

/**
 * Test data class for Student Enrollment to Course Validation
 * Contains expected values for enrollment dashboard validation after ETL run
 */
export class HoonuitStudentEnrollmentToCourseDataModel implements HoonuitStudentEnrollmentToCourseData {
    // Filter constants
    static readonly SCHOOL_FILTER = 'School';
    static readonly UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';

    // Expected values (to be updated based on actual ETL data or fetched from database)
    // Matches Java class properties exactly
    public name: string = '';
    public totalCount: number = 0;
    public femaleCount: number = 0;
    public ellCount: number = 0;
    public ytdNewAdmissions: number = 0;

    /**
     * Get name value
     * Matches Java: public String getName()
     */
    getName(): string {
        return this.name;
    }

    /**
     * Set name value
     * Matches Java: public void setName(String name)
     */
    setName(name: string): void {
        this.name = name;
    }

    /**
     * Get total count expected value
     * Matches Java: public int getTotalCount()
     */
    getTotalCount(): number {
        return this.totalCount;
    }

    /**
     * Set total count
     * Matches Java: public void setTotalCount(int totalCount)
     */
    setTotalCount(count: number): void {
        this.totalCount = count;
    }

    /**
     * Get female count expected value
     * Matches Java: public int getFemaleCount()
     */
    getFemaleCount(): number {
        return this.femaleCount;
    }

    /**
     * Set female count
     * Matches Java: public void setFemaleCount(int femaleCount)
     */
    setFemaleCount(count: number): void {
        this.femaleCount = count;
    }

    /**
     * Get ELL count expected value
     * Matches Java: public int getEllCount()
     */
    getEllCount(): number {
        return this.ellCount;
    }

    /**
     * Set ELL count
     * Matches Java: public void setEllCount(int ellCount)
     */
    setEllCount(count: number): void {
        this.ellCount = count;
    }

    /**
     * Get YTD new admissions expected value
     * Matches Java: public int getYtdNewAdmissions()
     */
    getYtdNewAdmissions(): number {
        return this.ytdNewAdmissions;
    }

    /**
     * Set YTD new admissions
     * Matches Java: public void setYtdNewAdmissions(int ytdNewAdmissions)
     */
    setYtdNewAdmissions(count: number): void {
        this.ytdNewAdmissions = count;
    }

    /**
     * Create test data with default values
     * In the Java version, this data comes from database via HoonuitEtlDataHelper
     * Here we provide static defaults that can be overridden
     */
    static createDefaultData(): HoonuitStudentEnrollmentToCourseDataModel {
        const data = new HoonuitStudentEnrollmentToCourseDataModel();
        // Set default values based on expected ETL output
        data.setName('');
        data.setTotalCount(0);
        data.setFemaleCount(0);
        data.setEllCount(0);
        data.setYtdNewAdmissions(0);
        return data;
    }
}

/**
 * ETL Data Helper for Student Enrollment to Course
 * Note: Database connection is required - no fallback to default values
 */
export class HoonuitStudentEnrollmentEtlDataHelper {
    
    private static readonly DATA_CLASS_NAME = 'HoonuitStudentEnrollmentToCourseData';
    
    /**
     * Get Student Enrollment to Course data from database
     * @returns HoonuitStudentEnrollmentToCourseDataModel instance
     * @throws Error if database connection fails or data is not found
     */
    static async getData(): Promise<HoonuitStudentEnrollmentToCourseDataModel> {
        // Get from database - no fallback to default values
        const data = await BaseEtlDataHelper.getDataAsObject<HoonuitStudentEnrollmentToCourseData>(
            this.DATA_CLASS_NAME
        );
        
        if (data) {
            console.log('Successfully fetched Student Enrollment to Course data from database');
            const model = new HoonuitStudentEnrollmentToCourseDataModel();
            model.name = data.name;
            model.totalCount = data.totalCount;
            model.femaleCount = data.femaleCount;
            model.ellCount = data.ellCount;
            model.ytdNewAdmissions = data.ytdNewAdmissions;
            return model;
        }
        
        throw new Error(`Failed to fetch ${this.DATA_CLASS_NAME} from database. Database connection is required.`);
    }

    /**
     * Save Student Enrollment to Course data to database
     * @param data - Data to save
     */
    static async saveData(data: HoonuitStudentEnrollmentToCourseDataModel): Promise<void> {
        await BaseEtlDataHelper.updateDatabase(data);
    }
}