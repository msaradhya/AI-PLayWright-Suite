/**
 * Admin Digital Learning Dashboard Data Model
 * Test data model for Digital Learning Dashboard validation tests
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.testdatamodel.HoonuitAdminDigitalLearningDashboardData
 *
 * @author poojitha (original Java implementation)
 * @author converted to TypeScript
 * @since 21-07-2021
 */

import { HoonuitEtlDataHelper as BaseEtlDataHelper } from '../../../shared/helpers/HoonuitEtlDataHelper';

/**
 * Interface for Admin Digital Learning Dashboard test data
 */
export interface HoonuitAdminDigitalLearningDashboardData {
    /** Total login count for students */
    studentTotalLoginCount: string;
    
    /** Total login count for staff */
    staffTotalLoginCount: string;
    
    /** Login count for UIHN Meeting Student */
    uihnMeetingStudentLoginCount: string;
    
    /** Login count for UIHN Student1 */
    uihnStudentLoginCount: string;
}

/**
 * Class implementation of the data model (for use with HoonuitEtlDataHelper.getData)
 */
export class HoonuitAdminDigitalLearningDashboardDataClass implements HoonuitAdminDigitalLearningDashboardData {
    studentTotalLoginCount: string = '0';
    staffTotalLoginCount: string = '0';
    uihnMeetingStudentLoginCount: string = '0';
    uihnStudentLoginCount: string = '0';
}

/**
 * Factory class for creating test data instances
 * In production, this would typically fetch data from database
 */
export class HoonuitAdminDigitalLearningDashboardDataFactory {
    
    /**
     * Get default test data values
     * These values are baseline values that can be overridden by actual DB data
     * @returns HoonuitAdminDigitalLearningDashboardData instance
     */
    static getDefaultData(): HoonuitAdminDigitalLearningDashboardData {
        return {
            studentTotalLoginCount: '10',
            staffTotalLoginCount: '5',
            uihnMeetingStudentLoginCount: '3',
            uihnStudentLoginCount: '3'
        };
    }

    /**
     * Get test data with custom values
     * @param overrides - Partial data to override defaults
     * @returns HoonuitAdminDigitalLearningDashboardData instance
     */
    static getDataWithOverrides(overrides: Partial<HoonuitAdminDigitalLearningDashboardData>): HoonuitAdminDigitalLearningDashboardData {
        return {
            ...this.getDefaultData(),
            ...overrides
        };
    }

    /**
     * Parse data from database query result
     * @param dbResult - Database result object
     * @returns HoonuitAdminDigitalLearningDashboardData instance
     */
    static fromDatabaseResult(dbResult: Record<string, any>): HoonuitAdminDigitalLearningDashboardData {
        return {
            studentTotalLoginCount: String(dbResult.studentTotalLoginCount || dbResult.student_total_login_count || '0'),
            staffTotalLoginCount: String(dbResult.staffTotalLoginCount || dbResult.staff_total_login_count || '0'),
            uihnMeetingStudentLoginCount: String(dbResult.uihnMeetingStudentLoginCount || dbResult.uihn_meeting_student_login_count || '0'),
            uihnStudentLoginCount: String(dbResult.uihnStudentLoginCount || dbResult.uihn_student_login_count || '0')
        };
    }
}

/**
 * ETL Data Helper for fetching test data from database
 * Uses the centralized HoonuitEtlDataHelper for database operations
 * Note: Database connection is required - no fallback to default values
 */
export class HoonuitEtlDataHelper {
    
    private static readonly DATA_CLASS_NAME = 'HoonuitAdminDigitalLearningDashboardData';
    
    /**
     * Get data for the specified data model type from database
     * @param dataType - The type of data model to retrieve
     * @returns Data instance
     * @throws Error if database connection fails or data is not found
     */
    static async getData<T>(dataType: string): Promise<T> {
        // Fetch from database using the centralized helper
        const data = await BaseEtlDataHelper.getDataAsObject<T>(dataType);
        if (data) {
            console.log(`Successfully fetched ${dataType} from database`);
            return data;
        }
        
        throw new Error(`Failed to fetch ${dataType} from database. Database connection is required.`);
    }

    /**
     * Get Admin Digital Learning Dashboard data from database
     * Convenience method for getting specific data type
     * @returns HoonuitAdminDigitalLearningDashboardData instance
     * @throws Error if database connection fails or data is not found
     */
    static async getAdminDigitalLearningDashboardData(): Promise<HoonuitAdminDigitalLearningDashboardData> {
        // Get from database - no fallback to default values
        const data = await BaseEtlDataHelper.getDataAsObject<HoonuitAdminDigitalLearningDashboardData>(
            this.DATA_CLASS_NAME
        );
        
        if (data) {
            console.log('Successfully fetched Admin Digital Learning Dashboard data from database');
            return data;
        }
        
        throw new Error(`Failed to fetch ${this.DATA_CLASS_NAME} from database. Database connection is required.`);
    }

    /**
     * Save Admin Digital Learning Dashboard data to database
     * @param data - Data to save
     */
    static async saveAdminDigitalLearningDashboardData(data: HoonuitAdminDigitalLearningDashboardData): Promise<void> {
        const dataInstance = Object.assign(new HoonuitAdminDigitalLearningDashboardDataClass(), data);
        await BaseEtlDataHelper.updateDatabase(dataInstance);
    }

    /**
     * Initialize database connection for ETL data operations
     */
    static async initialize(): Promise<void> {
        await BaseEtlDataHelper.initialize();
    }

    /**
     * Cleanup database connections
     */
    static async cleanup(): Promise<void> {
        await BaseEtlDataHelper.cleanup();
    }
}