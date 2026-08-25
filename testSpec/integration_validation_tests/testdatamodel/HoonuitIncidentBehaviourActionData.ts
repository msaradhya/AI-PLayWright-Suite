/**
 * Hoonuit Incident Behaviour Action Test Data Model
 * Contains test data for incident behavior validation tests
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.testdatamodel.HoonuitIncidentBehaviourActionData
 *
 * @author dinesh (original Java implementation)
 * @author converted to TypeScript
 * @since 29/06/21
 */

import { HoonuitEtlDataHelper as BaseEtlDataHelper } from '../../../shared/helpers/HoonuitEtlDataHelper';

/**
 * Interface for Incident Behaviour Action test data
 */
export interface HoonuitIncidentBehaviourActionDataInterface {
    theftCount: number;
    suspensionInSchoolCount: number;
    suspensionInSchoolCountInTheftChart: number;
    severeIncidentsCountInTheftChart: number;
    incidentBySchoolChartCount: number;
    studentCount: number;
    incidentCount: number;
    mostCommonReferralsForMyStudentsChartCount: number;
}

/**
 * Test data class for Incident Behaviour Action Validation
 * Contains expected values for behavior/incident dashboard validation after ETL run
 */
export class HoonuitIncidentBehaviourActionData implements HoonuitIncidentBehaviourActionDataInterface {
    // Filter constants
    static readonly SCHOOL_YEAR = '2022-2023';
    static readonly THEFT = 'Theft';
    static readonly SCHOOL_FILTER = 'School';
    static readonly STAFF_FILTER = 'Staff';
    static readonly UIHN_AUTOMATION_SCHOOL = 'UIHN Automation School';
    static readonly UIHN_AUTOMATION_SCHOOL_FILTER_VALUE: string[] = ['UIHN Automation School'];
    static readonly UIHN_TEACHER_FILTER_VALUE: string[] = ['UIHN 22-23, Teacher'];

    // Incident and action types
    static readonly SUSPENSION_IN_SCHOOL = 'Suspension - In School';
    
    // Expected values (to be updated based on actual ETL data or fetched from database)
    public theftCount: number = 1;
    public suspensionInSchoolCount: number = 1;
    public suspensionInSchoolCountInTheftChart: number = 1;
    public severeIncidentsCountInTheftChart: number = 1;
    public incidentBySchoolChartCount: number = 1;
    public studentCount: number = 1;
    public incidentCount: number = 1;
    public mostCommonReferralsForMyStudentsChartCount: number = 1;

    /**
     * Get theft count expected value
     */
    getTheftCount(): number {
        return this.theftCount;
    }

    /**
     * Set theft count
     */
    setTheftCount(count: number): void {
        this.theftCount = count;
    }

    /**
     * Get suspension in school count expected value
     */
    getSuspensionInSchoolCount(): number {
        return this.suspensionInSchoolCount;
    }

    /**
     * Set suspension in school count
     */
    setSuspensionInSchoolCount(count: number): void {
        this.suspensionInSchoolCount = count;
    }

    /**
     * Get suspension in school count in theft chart
     */
    getSuspensionInSchoolCountInTheftChart(): number {
        return this.suspensionInSchoolCountInTheftChart;
    }

    /**
     * Set suspension in school count in theft chart
     */
    setSuspensionInSchoolCountInTheftChart(count: number): void {
        this.suspensionInSchoolCountInTheftChart = count;
    }

    /**
     * Get severe incidents count in theft chart
     */
    getSevereIncidentsCountInTheftChart(): number {
        return this.severeIncidentsCountInTheftChart;
    }

    /**
     * Set severe incidents count in theft chart
     */
    setSevereIncidentsCountInTheftChart(count: number): void {
        this.severeIncidentsCountInTheftChart = count;
    }

    /**
     * Get incident by school chart count
     */
    getIncidentBySchoolChartCount(): number {
        return this.incidentBySchoolChartCount;
    }

    /**
     * Set incident by school chart count
     */
    setIncidentBySchoolChartCount(count: number): void {
        this.incidentBySchoolChartCount = count;
    }

    /**
     * Get student count
     * Matches Java: public int getStudentCount()
     */
    getStudentCount(): number {
        return this.studentCount;
    }

    /**
     * Set student count
     * Matches Java: public void setStudentCount(int studentCount)
     */
    setStudentCount(count: number): void {
        this.studentCount = count;
    }

    /**
     * Get incident count
     */
    getIncidentCount(): number {
        return this.incidentCount;
    }

    /**
     * Set incident count
     */
    setIncidentCount(count: number): void {
        this.incidentCount = count;
    }

    /**
     * Get most common referrals for my students chart count
     */
    getMostCommonReferralsForMyStudentsChartCount(): number {
        return this.mostCommonReferralsForMyStudentsChartCount;
    }

    /**
     * Set most common referrals for my students chart count
     */
    setMostCommonReferralsForMyStudentsChartCount(count: number): void {
        this.mostCommonReferralsForMyStudentsChartCount = count;
    }

    /**
     * Create test data with default values
     * In the Java version, this data comes from database via HoonuitEtlDataHelper
     * Here we provide static defaults that can be overridden
     */
    static createDefaultData(): HoonuitIncidentBehaviourActionData {
        const data = new HoonuitIncidentBehaviourActionData();
        // Set default values based on expected ETL output
        data.setTheftCount(1);
        data.setSuspensionInSchoolCount(1);
        data.setSuspensionInSchoolCountInTheftChart(1);
        data.setSevereIncidentsCountInTheftChart(1);
        data.setIncidentBySchoolChartCount(1);
        data.setStudentCount(1);
        data.setIncidentCount(1);
        data.setMostCommonReferralsForMyStudentsChartCount(1);
        return data;
    }
}

/**
 * Student Enrollment to Course Data for integration tests
 * Used alongside incident behavior data for comprehensive validation
 */
export class HoonuitStudentEnrollmentToCourseData {
    public totalCount: number = 1;

    /**
     * Get total enrollment count
     */
    getTotalCount(): number {
        return this.totalCount;
    }

    /**
     * Set total enrollment count
     */
    setTotalCount(count: number): void {
        this.totalCount = count;
    }

    /**
     * Create default enrollment data
     */
    static createDefaultData(): HoonuitStudentEnrollmentToCourseData {
        const data = new HoonuitStudentEnrollmentToCourseData();
        data.setTotalCount(1);
        return data;
    }
}

/**
 * ETL Data Helper for Incident Behaviour Action
 * Note: Database connection is required - no fallback to default values
 */
export class HoonuitIncidentBehaviourEtlDataHelper {
    
    private static readonly DATA_CLASS_NAME = 'HoonuitIncidentBehaviourActionData';
    
    /**
     * Get Incident Behaviour Action data from database
     * @returns HoonuitIncidentBehaviourActionData instance
     * @throws Error if database connection fails or data is not found
     */
    static async getData(): Promise<HoonuitIncidentBehaviourActionData> {
        // Get from database - no fallback to default values
        const data = await BaseEtlDataHelper.getDataAsObject<HoonuitIncidentBehaviourActionDataInterface>(
            this.DATA_CLASS_NAME
        );
        
        if (data) {
            console.log('Successfully fetched Incident Behaviour Action data from database');
            const model = new HoonuitIncidentBehaviourActionData();
            model.theftCount = data.theftCount;
            model.suspensionInSchoolCount = data.suspensionInSchoolCount;
            model.suspensionInSchoolCountInTheftChart = data.suspensionInSchoolCountInTheftChart;
            model.severeIncidentsCountInTheftChart = data.severeIncidentsCountInTheftChart;
            model.incidentBySchoolChartCount = data.incidentBySchoolChartCount;
            model.studentCount = data.studentCount;
            model.incidentCount = data.incidentCount;
            model.mostCommonReferralsForMyStudentsChartCount = data.mostCommonReferralsForMyStudentsChartCount;
            return model;
        }
        
        throw new Error(`Failed to fetch ${this.DATA_CLASS_NAME} from database. Database connection is required.`);
    }

    /**
     * Save Incident Behaviour Action data to database
     * @param data - Data to save
     */
    static async saveData(data: HoonuitIncidentBehaviourActionData): Promise<void> {
        await BaseEtlDataHelper.updateDatabase(data);
    }
}