/**
 * UIHN ATS Applicant Data Model
 * Contains applicant count data for different time periods in ATS (Applicant Tracking System)
 * 
 * @author Converted from HoonuitATSApplicantData.java
 * @since 2023-12-12
 */
export class HoonuitATSApplicantData {
    private last7DayApplicantCount: string;
    private last30DayApplicantCount: string;
    private ytdApplicantCount: string;

    constructor() {
        this.last7DayApplicantCount = '';
        this.last30DayApplicantCount = '';
        this.ytdApplicantCount = '';
    }

    public getlast7DayapplicantCount(): string {
        return this.last7DayApplicantCount;
    }

    public getlast30DayapplicantCount(): string {
        return this.last30DayApplicantCount;
    }

    public getytdApplicantCount(): string {
        return this.ytdApplicantCount;
    }

    public setlast7DayapplicantCount(last7DayApplicantCount: string): void {
        this.last7DayApplicantCount = last7DayApplicantCount;
    }

    public setlast30DayapplicantCount(last30DayApplicantCount: string): void {
        this.last30DayApplicantCount = last30DayApplicantCount;
    }

    public setytdApplicantCount(ytdApplicantCount: string): void {
        this.ytdApplicantCount = ytdApplicantCount;
    }
}