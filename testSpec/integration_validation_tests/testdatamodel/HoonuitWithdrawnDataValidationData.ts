/**
 * Test Data Model for Withdrawn Data Validation Admin Test
 * Contains expected values for validating withdrawn data after ETL
 * 
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitWithdrawnDataValidationAdminTest
 * 
 * @author dinesh (original Java implementation)
 * @author converted to TypeScript/Playwright
 * @since 05/07/21
 */

/**
 * Interface representing student program services data
 */
export interface WhichStudentsAreReceivingProgramServices {
    studentID: string;
    name: string;
    grade: string;
    gender: string;
    ell: string;
    sped: string;
    school: string;
    programGroup: string;
    programName: string;
    status: string;
}

/**
 * Test data model for withdrawn data validation
 */
export class HoonuitWithdrawnDataValidationDataModel {
    // Filter constants
    public static readonly SCHOOL_FILTER = 'School';
    public static readonly UIHN_AUTOMATION_SCHOOL_FILTER_VALUE = 'UIHN Automation School';
    
    // Column name constants
    public static readonly STUDENT_ID = 'STUDENT ID';
    public static readonly NAME = 'NAME';
    public static readonly GRADE = 'GRADE';
    public static readonly GENDER = 'GENDER';
    public static readonly SPED = 'SPED';
    public static readonly PROGRAM_GROUP = 'PROGRAM GROUP';
    public static readonly PROGRAM_NAME = 'Program Name';
    public static readonly ELL = 'ELL';
    public static readonly STATUS = 'Status';
    public static readonly SCHOOL = 'SCHOOL';
    
    // Expected values
    public static readonly YTD_WITHDRAWN_CARD_VALUE = '3';
    public static readonly HIGHEST_WITHDRAWALS_CHART_VALUE = '3';
    
    // Expected program services data
    private whichStudentsAreReceivingProgramServices: WhichStudentsAreReceivingProgramServices[];

    /**
     * Constructor with default values
     */
    constructor() {
        // Default expected program services data
        this.whichStudentsAreReceivingProgramServices = [
            {
                studentID: '20190282',
                name: 'UIHN Student1 22-23, Student1',
                grade: '09',
                gender: 'Female',
                ell: 'No',
                sped: 'No',
                school: 'UIHN Automation School',
                programGroup: 'English-Language Learner (ELL)',
                programName: 'English-Language Learner (ELL)',
                status: 'Active'
            }
        ];
    }

    /**
     * Get expected program services data
     */
    public getWhichStudentsAreReceivingProgramServices(): WhichStudentsAreReceivingProgramServices[] {
        return this.whichStudentsAreReceivingProgramServices;
    }

    /**
     * Get first expected program services record
     */
    public getFirstProgramServicesRecord(): WhichStudentsAreReceivingProgramServices {
        return this.whichStudentsAreReceivingProgramServices[0];
    }

    /**
     * Factory method to create default test data
     */
    public static createDefaultData(): HoonuitWithdrawnDataValidationDataModel {
        return new HoonuitWithdrawnDataValidationDataModel();
    }

    /**
     * Factory method to create test data with custom program services
     */
    public static createWithProgramServices(
        programServices: WhichStudentsAreReceivingProgramServices[]
    ): HoonuitWithdrawnDataValidationDataModel {
        const data = new HoonuitWithdrawnDataValidationDataModel();
        data.whichStudentsAreReceivingProgramServices = programServices;
        return data;
    }
}