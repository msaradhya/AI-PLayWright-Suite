/**
 * Hoonuit New Attendance Data Test
 * Validates attendance dashboard data in Hoonuit dashboards after ETL run
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitNewAttendanceDataTest
 *
 * @author aradhyas (converted to TypeScript/Playwright)
 * @since 30-10-2025
 * @jira TCM-65394
 */

import { test, expect, describe, beforeEach, afterEach, step } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitIntegrationUsers } from './users/HoonuitIntegrationUsers';
import { HoonuitEnrollmentOverviewPage } from '../../shared/pages/essentials/enrollment/HoonuitEnrollmentOverviewPage';
import HoonuitAttendanceOverviewPage from '../../shared/pages/essentials/attendance/HoonuitAttendanceOverviewPage';
import HoonuitChronicAbsencePage from '../../shared/pages/essentials/attendance/HoonuitChronicAbsencePage';
import HoonuitClassroomAbsencesPage from '../../shared/pages/essentials/attendance/HoonuitClassroomAbsencesPage';
import { 
    DashboardTypes, 
    AttendanceNavTabs,
    EnrollmentNavTabs
} from '../../types';

// Test suite for New Attendance Data Validation
describe('Hoonuit New Attendance Data', () => {
    // Page objects
    let enrollmentOverviewPage: HoonuitEnrollmentOverviewPage;
    let attendanceOverviewPage: HoonuitAttendanceOverviewPage;
    let chronicAbsencePage: HoonuitChronicAbsencePage;
    let classroomAbsencesPage: HoonuitClassroomAbsencesPage;
    
    // Expected ETL date
    let expectedEtlDate: string;

    // Setup before each test
    beforeEach(async ({ page }) => {
        enrollmentOverviewPage = new HoonuitEnrollmentOverviewPage(page);
        attendanceOverviewPage = new HoonuitAttendanceOverviewPage(page);
        chronicAbsencePage = new HoonuitChronicAbsencePage(page);
        classroomAbsencesPage = new HoonuitClassroomAbsencesPage(page);
        
        // Get expected ETL date from the page utility method
        expectedEtlDate = attendanceOverviewPage.getRecentExpectedAttendanceEtlDate();
        
        // Login as ETL Attendance Admin user
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlAttAdmin_User1);
    });

    // Cleanup after each test
    afterEach(async ({ page }) => {
        try {
            await HoonuitHelper.logout(page);
        } catch (error) {
            console.warn('Logout failed during cleanup:', error);
        }
    });

    /**
     * Test: New Attendance Dashboard Data
     * As Admin user, I should be able to validate Attendance data after ETL
     * @jira TCM-65394
     */
    test('TCM-65394', 'Test New Attendance Dashboard Data', async ({ page }) => {
        // Navigate to Essentials > Enrollment > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.ESSENTIALS,
            EnrollmentNavTabs.ENROLLMENT_OVERVIEW
        );
        
        await enrollmentOverviewPage.waitForPage();
        
        // Apply school filter
        const schoolFilter: Record<string, string> = {
            'School': 'UIHN Automation School'
        };
        await enrollmentOverviewPage.getFilter().selectFilterData(schoolFilter);
        
        // Get total enrollment count
        const enrollmentInfo = await enrollmentOverviewPage.getEnrollmentInformationTable().getEnrollmentInformation();
        const totals = enrollmentInfo['Total'];
        
        // Navigate to Essentials > Attendance > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.ESSENTIALS,
            AttendanceNavTabs.ATTENDANCE_OVERVIEW
        );
        
        await attendanceOverviewPage.waitForPage();
        
        // Validate Attendance Overview page details
        await step('Validate Currently Enrolled Students Card', async () => {
            const enrolledStudentsValue = await attendanceOverviewPage.getCurrentlyEnrolledStudentsCard().getValue();
            expect(
                enrolledStudentsValue,
                'Currently enrolled students card value is different'
            ).toBe(totals);
        });
        
        await step('Validate Students Absent This Week Card', async () => {
            const absentThisWeekValue = await attendanceOverviewPage.getStudentsAbsentThisWeekCard().getValue();
            expect(
                absentThisWeekValue,
                'Absent in last 7 days card value is different'
            ).toBe('1');
        });
        
        await step('Validate Recent Attendance Date Card', async () => {
            const recentAttendanceDateValue = await attendanceOverviewPage.getRecentAttendanceDate().getValue();
            expect(
                recentAttendanceDateValue,
                'Last ETL is not successful for FTBL_ATTENDANCE_RECENT'
            ).toBe(expectedEtlDate);
        });
        
        await step('Validate Recent Week Attendance Date Card', async () => {
            const recentWeekAttendanceDateValue = await attendanceOverviewPage.getRecentWeekAttendanceDate().getValue();
            expect(
                recentWeekAttendanceDateValue,
                'Last ETL is not successful for Attendance Summary'
            ).toBe(expectedEtlDate);
        });
        
        await step('Validate Students Absent Yesterday Card', async () => {
            const absentYesterdayValue = await attendanceOverviewPage.getStudentsAbsentYesterdayCard().getValue();
            expect(
                absentYesterdayValue,
                'Absent yesterday card value is different'
            ).toBe('1');
        });
        
        await step('Validate Attendance For Last 5 Days Card', async () => {
            const last5DaysValue = await attendanceOverviewPage.getAttendanceForLast5DaysCard().getValue();
            const numericValue = parseFloat(last5DaysValue.replace('%', ''));
            expect(
                numericValue < 100.00,
                'Attendance for last 7 days card value is not less than 100%'
            ).toBe(true);
        });
        
        await step('Validate Attendance For Last 30 Days Card', async () => {
            const last30DaysValue = await attendanceOverviewPage.getAttendanceForLast30DaysCard().getValue();
            const numericValue = parseFloat(last30DaysValue.replace('%', ''));
            expect(
                numericValue < 100.00,
                'Attendance for last 30 days card value is not less than 100%'
            ).toBe(true);
        });
        
        await step('Validate Year To Date Attendance Card', async () => {
            const ytdValue = await attendanceOverviewPage.getYearToDateAttendanceCard().getValue();
            const numericValue = parseFloat(ytdValue.replace('%', ''));
            expect(
                numericValue < 100.00,
                'Year to date attendance card value is not less than 100%'
            ).toBe(true);
        });
        
        await step('Validate Absent Value In Frequency Chart', async () => {
            const chartValues = await attendanceOverviewPage.getWhatAreMostFrequentAbsenceTypeChart().getAnyChartValues('Absent');
            expect(
                chartValues,
                'Absent value in chart is different'
            ).toContain('● # Students: 1');
        });
        
        // Navigate to Chronic Absences tab
        await HoonuitHelper.clickSubNavTabLink(page, AttendanceNavTabs.CHRONIC_ABSENCES);
        await chronicAbsencePage.waitForPage();
        
        // Validate chronically absent chart
        await step('Validate Chronically Absent Chart', async () => {
            const chartValues = await chronicAbsencePage.getWhichGradesHaveTheMostChronicallyAbsentStudentsChart().getAnyChartValues('09');
            expect(
                chartValues,
                'Chronically absent value in chart is different'
            ).toContain('● Chronically Absent: 1');
        });
        
        // Navigate to Classroom Absences tab
        await HoonuitHelper.clickSubNavTabLink(page, AttendanceNavTabs.CLASSROOM_ABSENCES);
        await classroomAbsencesPage.waitForPage();
        
        // Validate Periods Tardy count
        await step('Validate Periods Tardy Count For Teacher', async () => {
            const tardyCount = await classroomAbsencesPage.getAbsenceAndTardyCountsForClassroomsThisYearTable().getRecordByIndex('UIHN, Teacher ', 1);
            expect(
                tardyCount,
                '# Periods Tardy 10 value is different for UIHN,Teacher'
            ).toBe('110');
        });
    });
});