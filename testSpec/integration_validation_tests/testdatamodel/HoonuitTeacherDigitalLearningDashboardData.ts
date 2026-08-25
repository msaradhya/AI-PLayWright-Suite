/**
 * Test Data Model for Teacher Digital Learning Dashboard Test
 * Contains expected values for validating digital learning data after ETL
 *
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.testdatamodel.HoonuitTeacherDigitalLearningDashboardData
 *
 * @author poojitha (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 21/07/2021
 */

import { HoonuitEtlDataHelper as BaseEtlDataHelper } from '../../../shared/helpers/HoonuitEtlDataHelper';

/**
 * Interface for Teacher Digital Learning Dashboard test data
 */
export interface HoonuitTeacherDigitalLearningDashboardData {
    studentTotalLoginCount: string;
    uihnMeetingStudentLoginCount: string;
    uihnStudentLoginCount: string;
}

export class HoonuitTeacherDigitalLearningDashboardDataModel implements HoonuitTeacherDigitalLearningDashboardData {
    // Filter constants
    public static readonly SCHOOL_FILTER = 'School';
    public static readonly UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';
    
    // Default expected values (in Java, these come from database via HoonuitEtlDataHelper)
    public studentTotalLoginCount: string;
    public uihnMeetingStudentLoginCount: string;
    public uihnStudentLoginCount: string;

    /**
     * Constructor with default values
     */
    constructor() {
        // Default values - in production, these would come from database
        this.studentTotalLoginCount = '6';
        this.uihnMeetingStudentLoginCount = '3';
        this.uihnStudentLoginCount = '3';
    }

    /**
     * Get student total login count
     */
    public getStudentTotalLoginCount(): string {
        return this.studentTotalLoginCount;
    }

    /**
     * Set student total login count
     */
    public setStudentTotalLoginCount(count: string): void {
        this.studentTotalLoginCount = count;
    }

    /**
     * Get UIHN Meeting student login count
     */
    public getUihnMeetingStudentLoginCount(): string {
        return this.uihnMeetingStudentLoginCount;
    }

    /**
     * Set UIHN Meeting student login count
     */
    public setUihnMeetingStudentLoginCount(count: string): void {
        this.uihnMeetingStudentLoginCount = count;
    }

    /**
     * Get UIHN Student login count
     */
    public getUihnStudentLoginCount(): string {
        return this.uihnStudentLoginCount;
    }

    /**
     * Set UIHN Student login count
     */
    public setUihnStudentLoginCount(count: string): void {
        this.uihnStudentLoginCount = count;
    }

    /**
     * Factory method to create default test data
     * In Java, this data comes from HoonuitEtlDataHelper.getData()
     */
    public static createDefaultData(): HoonuitTeacherDigitalLearningDashboardDataModel {
        return new HoonuitTeacherDigitalLearningDashboardDataModel();
    }

    /**
     * Factory method to create test data with specific values
     */
    public static createWithValues(
        studentTotalLoginCount: string,
        uihnMeetingStudentLoginCount: string,
        uihnStudentLoginCount: string
    ): HoonuitTeacherDigitalLearningDashboardDataModel {
        const data = new HoonuitTeacherDigitalLearningDashboardDataModel();
        data.setStudentTotalLoginCount(studentTotalLoginCount);
        data.setUihnMeetingStudentLoginCount(uihnMeetingStudentLoginCount);
        data.setUihnStudentLoginCount(uihnStudentLoginCount);
        return data;
    }
}

/**
 * ETL Data Helper for Teacher Digital Learning Dashboard
 * Note: Database connection is required - no fallback to default values
 */
export class HoonuitTeacherDigitalLearningEtlDataHelper {
    
    private static readonly DATA_CLASS_NAME = 'HoonuitTeacherDigitalLearningDashboardData';
    
    /**
     * Get Teacher Digital Learning Dashboard data from database
     * @returns HoonuitTeacherDigitalLearningDashboardDataModel instance
     * @throws Error if database connection fails or data is not found
     */
    static async getData(): Promise<HoonuitTeacherDigitalLearningDashboardDataModel> {
        // Get from database - no fallback to default values
        const data = await BaseEtlDataHelper.getDataAsObject<HoonuitTeacherDigitalLearningDashboardData>(
            this.DATA_CLASS_NAME
        );
        
        if (data) {
            console.log('Successfully fetched Teacher Digital Learning Dashboard data from database');
            const model = new HoonuitTeacherDigitalLearningDashboardDataModel();
            model.studentTotalLoginCount = data.studentTotalLoginCount;
            model.uihnMeetingStudentLoginCount = data.uihnMeetingStudentLoginCount;
            model.uihnStudentLoginCount = data.uihnStudentLoginCount;
            return model;
        }
        
        throw new Error(`Failed to fetch ${this.DATA_CLASS_NAME} from database. Database connection is required.`);
    }

    /**
     * Save Teacher Digital Learning Dashboard data to database
     * @param data - Data to save
     */
    static async saveData(data: HoonuitTeacherDigitalLearningDashboardDataModel): Promise<void> {
        await BaseEtlDataHelper.updateDatabase(data);
    }
}