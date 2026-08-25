/**
 * Hoonuit Attendance Data Validation Admin User Test
 * Validates attendance data in Hoonuit dashboards as an admin user
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.validation.HoonuitAttendanceDataValidationAdminUserTest
 *
 * @author dinesh (original Java implementation)
 * @author aradhyas (converted to TypeScript/Playwright)
 * @since 30-10-2025
 * @jira TCM-65395
 */

import { test, expect, describe, beforeEach, afterEach, step } from '../../fixtures/test-wrapper';
import { HoonuitHelper } from '../../shared/helpers/HoonuitHelper';
import { HoonuitIntegrationUsers } from './users/HoonuitIntegrationUsers';
import { HoonuitAttendanceDataValidationData } from './testdatamodel/HoonuitAttendanceDataValidationData';
import HoonuitMyStudentsOverviewPage from '../../shared/pages/classroom/mystudents/HoonuitMyStudentsOverviewPage';
import HoonuitClassroomAbsencesPage from '../../shared/pages/classroom/absences/HoonuitClassroomAbsencesPage';
import { DashboardTypes, ClassroomNavTabs, MyStudentsNavTabs } from '../../types';

// Test suite for Attendance Data Validation as Admin User
describe('Hoonuit Attendance Data Validation - Admin User @TCM-65395', () => {
    let hoonuitMyStudentsOverviewPage: HoonuitMyStudentsOverviewPage;
    let classroomAbsencesPage: HoonuitClassroomAbsencesPage;

    // Setup before each test
    beforeEach(async ({ page }) => {
        hoonuitMyStudentsOverviewPage = new HoonuitMyStudentsOverviewPage(page);
        classroomAbsencesPage = new HoonuitClassroomAbsencesPage(page);
        
        // Set viewport to smaller size (equivalent to resizeBrowserToSmall in Java)
        await page.setViewportSize({ width: 1024, height: 768 });
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
     * Verify Attendance Data in Hoonuit as Admin
     * Tests the attendance data validation for admin user by:
     * 1. Logging in as ETL Admin user
     * 2. Navigating to Classroom > My Students > Overview
     * 3. Applying school and staff filters
     * 4. Navigating to Absences tab
     * 5. Validating tardy data in "How prevalent are tardies in my classes?" table
     * 6. Validating student absence data in "Who are my students with absences or tardies?" table
     */
    test('TCM-65395', 'Verify Attendance Data In Hoonuit As Admin', async ({ page }) => {
        // Login as ETL Admin user
        await HoonuitHelper.loginToHoonuitAdministrator(page, HoonuitIntegrationUsers.etlAdmin_User1);
        
        // Navigate to Classroom > My Students > Overview
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.CLASSROOM,
            MyStudentsNavTabs.OVERVIEW
        );
        
        // Wait for page to load
        await hoonuitMyStudentsOverviewPage.waitForPage();
        
        // Apply filters: School and Staff
        const filters = HoonuitAttendanceDataValidationData.getAdminUserFilters();
        await hoonuitMyStudentsOverviewPage.getFilter().selectMultiFiltersData(filters);
        
        // Navigate to Absences tab
        await HoonuitHelper.selectDashboard(
            page,
            DashboardTypes.CLASSROOM,
            ClassroomNavTabs.ABSENCES
        );
        
        // Wait for Absences page to load
        await classroomAbsencesPage.waitForPage();
        
        // Get all records from "How prevalent are tardies in my classes?" table
        const howPrevalentAreTardiesTable = classroomAbsencesPage.getHowPrevalentAreTardiesInMyClassesTable();
        const tableRecords = await howPrevalentAreTardiesTable.getAllRecords();
        
        // Get expected data
        const expectedTardyData = HoonuitAttendanceDataValidationData.getPrimaryTardyData();
        
        // Find the matching row by semester and validate data
        let foundMatchingRow = false;
        for (const row of tableRecords) {
            const semesterValue = row.get(HoonuitAttendanceDataValidationData.SEMESTER_KEY);
            if (semesterValue === expectedTardyData.semester) {
                foundMatchingRow = true;
                
                // Validate Name
                await step('Validate Name after applying filter', async () => {
                    expect(
                        row.get(HoonuitAttendanceDataValidationData.NAME_KEY),
                        `Name is different after applying filter for record`
                    ).toBe(expectedTardyData.name);
                });
                
                // Validate Course
                await step('Validate Course after applying filter', async () => {
                    expect(
                        row.get(HoonuitAttendanceDataValidationData.COURSE_KEY),
                        `Course is different after applying filter for record`
                    ).toBe(expectedTardyData.course);
                });
                
                // Validate Tardies count
                await step('Validate Tardies after applying filter', async () => {
                    expect(
                        row.get(HoonuitAttendanceDataValidationData.TARDIES_KEY),
                        `Tardies is different after applying filter for record`
                    ).toBe(expectedTardyData.tardies);
                });
                
                break;
            }
        }
        
        // Ensure we found a matching row
        expect(foundMatchingRow, `Expected to find row with semester ${expectedTardyData.semester}`).toBe(true);
        
        // Validate "Who are my students with absences or tardies?" table
        await step('Validate Student Absences/Tardies Table', async () => {
            const whoAreMyStudentsTable = classroomAbsencesPage.getWhoAreMyStudentsWithAbsencesOrTardiesTable();
            
            // Get record by student ID and column index
            const lateValue = await whoAreMyStudentsTable.getRecordByIndex(
                HoonuitAttendanceDataValidationData.EXPECTED_STUDENT_ID,
                HoonuitAttendanceDataValidationData.EXPECTED_COLUMN_INDEX
            );
            
            expect(
                lateValue,
                `Incorrect P1 - AP German I Late Value in Who are my students with absences or tardies Table`
            ).toBe(HoonuitAttendanceDataValidationData.EXPECTED_LATE_VALUE);
        });
    });
});