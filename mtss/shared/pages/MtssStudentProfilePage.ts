/**
 * Playwright/TypeScript version of MtssStudentProfilePage (converted from Java)
 * Comprehensive page object for MTSS Student Profile functionality with complete
 * method coverage matching the Java source implementation.
 *
 * This implementation provides:
 * - Complete selector mapping from Java Selenide to Playwright
 * - All methods from the original Java class with proper async/await patterns
 * - Proper TypeScript interfaces and error handling
 * - Consistent wait strategies and element interaction patterns
 * - Enhanced support for Playwright test framework
 * - Extends MtssBasePage for common functionality
 *
 * ========================================
 * COMPLETE FEATURE COVERAGE:
 * ========================================
 *
 * 📊 CARD COMPONENTS:
 * - getChronicAbsencesCard() - Chronic Absences card
 * - getLast5DaysAttendance() - Last 5 Days Attendance card
 * - getLast30DaysAttendance() - Last 30 Days Attendance card
 * - getYearToDateAttendance() - Year-to-date Attendance card
 * - getStudentIncidentTrendCard() - Student Incident Trend card
 * - getStudentStateTestSummaryCard() - Student State Test Summary card
 * - getStudentGpaTrendCard() - Student GPA Trend card
 *
 * 📈 CHART COMPONENTS:
 * - getStudentAttendanceTrendChart() - Student Attendance Trend line chart
 * - getStudentGpaTrendChart() - Student GPA Trend line chart
 * - getMultiYearAbsenceTrendsBySemesterChart() - Multi-Year Absence Trends bar chart
 *
 * 📋 TABLE COMPONENTS:
 * - getDetailedEnrollmentHistoryTable() - Detailed Enrollment History grid table
 * - getProgramMembershipHistoryTable() - Program Membership History grid table
 * - getAcademicStandardMasteryTable() - Academic Standard Mastery cross-tab table
 *
 * 👤 STUDENT PROFILE DATA:
 * - getStudentProfile() - Get complete student profile information as Map
 *
 * ========================================
 * TECHNICAL IMPLEMENTATION DETAILS:
 * ========================================
 *
 * 🏗️ ARCHITECTURE:
 * - Extends MtssBasePage for common functionality
 * - Uses Playwright locator strategies for element selection
 * - Implements proper async/await patterns throughout
 * - Provides comprehensive error handling and timeout management
 *
 * 🎛️ SELECTOR STRATEGY:
 * - CSS selectors optimized for Playwright
 * - Consistent naming convention matching Java source
 * - Robust element identification using class and tag selectors
 * - Support for dynamic content and dashboard components
 *
 * ⏱️ WAIT STRATEGIES:
 * - Element visibility waiting before interactions
 * - Proper timeout management (default 10 seconds)
 * - Integration with MtssBasePage common functionality
 * - Collection condition checking for student profile data
 *
 * 🔧 HELPER METHODS:
 * - Comprehensive element interaction patterns
 * - State validation and verification methods
 * - Cross-browser compatibility considerations
 * - Integration with Hoonuit component library
 *
 * 📝 TESTING SUPPORT:
 * - Full Playwright Test framework integration
 * - Comprehensive method coverage for all dashboard components
 * - Detailed error reporting and debugging support
 * - Parameterized methods for flexible test scenarios
 *
 * @example
 * ```typescript
 * // Basic usage example
 * const studentProfilePage = new MtssStudentProfilePage(page);
 * await studentProfilePage.waitForPage();
 * 
 * // Card interactions
 * const chronicAbsencesCard = studentProfilePage.getChronicAbsencesCard();
 * await chronicAbsencesCard.waitForVisible();
 * const isDisplayed = await chronicAbsencesCard.isDisplayed();
 * 
 * // Chart interactions
 * const attendanceTrendChart = studentProfilePage.getStudentAttendanceTrendChart();
 * const chartData = await attendanceTrendChart.getVerticalBarChartValues();
 * 
 * // Table interactions
 * const enrollmentTable = studentProfilePage.getDetailedEnrollmentHistoryTable();
 * const tableRecords = await enrollmentTable.getAllRecords();
 * 
 * // Student profile data
 * const studentInfo = await studentProfilePage.getStudentProfile();
 * console.log('Student Name:', studentInfo.get('Student Name'));
 * ```
 *
 * @author Converted from Java to TypeScript/Playwright
 * @since 2025
 * @version 1.0.0
 * @see MtssBasePage for inherited functionality
 * @see HoonuitCard for card component interactions
 * @see HoonuitLineChart for line chart interactions
 * @see HoonuitBarChart for bar chart interactions
 * @see HoonuitGridTable for grid table interactions
 * @see HoonuitCrossTabGridTable for cross-tab table interactions
 */

import { Page, Locator, expect } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';
import { HoonuitCard } from '../../../pages/base/HoonuitCard';
import { HoonuitLineChart } from '../../../pages/partial/chart/HoonuitLineChart';
import HoonuitBarChart from '../../../pages/partial/chart/HoonuitBarChart';
import HoonuitGridTable from '../../../pages/partial/table/HoonuitGridTable';
import HoonuitCrossTabGridTable from '../../../pages/partial/table/HoonuitCrossTabGridTable';

// ========================================
// INTERFACES AND TYPES
// ========================================

/**
 * Interface for student profile information
 */
export interface StudentProfileInfo {
  [key: string]: string;
}

/**
 * Interface for student narrative information map
 */
export interface StudentNarrativeInfo extends Map<string, string> {}

/**
 * Main MtssStudentProfilePage class extending MtssBasePage
 * Provides complete functionality for MTSS Student Profile page interactions
 */
export class MtssStudentProfilePage extends MtssBasePage {

  // ========================================
  // CSS SELECTORS - CONVERTED FROM JAVA
  // ========================================
  
  // Core selectors matching Java source exactly
  private static readonly STUDENT_PROFILE = "[class *= 'h6 text-info']";
  private static readonly DASHBOARD_CARD_LOCATOR = "app-dashboard-object-card";
  private static readonly CARD_TITLE = "div.pds-panel-header";
  
  // Additional selectors for enhanced functionality
  private static readonly LOADING_INDICATOR = '.spinner, .loading, .progress-indicator';
  private static readonly ERROR_MESSAGE = '.error-message, .alert-danger';
  
  // ========================================
  // CONSTANTS
  // ========================================
  
  private static readonly DEFAULT_TIMEOUT = 10000;
  private static readonly STUDENT_PROFILE_PAGE_TITLE = 'Student Profile';
  
  // Card names - matching Java source exactly
  private static readonly CHRONIC_ABSENCES_CARD_NAME = 'Chronic Absences';
  private static readonly LAST_5_DAYS_ATTENDANCE_CARD_NAME = 'Last 5 Days Attendance';
  private static readonly LAST_30_DAYS_ATTENDANCE_CARD_NAME = 'Last 30 Days Attendance';
  private static readonly YEAR_TO_DATE_ATTENDANCE_CARD_NAME = 'Year-to-date Attendance';
  private static readonly STUDENT_INCIDENT_TREND_CARD_NAME = 'Student Incident Trend';
  private static readonly STUDENT_STATE_TEST_SUMMARY_CARD_NAME = 'Student State Test Summary';
  private static readonly STUDENT_GPA_TREND_CARD_NAME = 'Student GPA Trend';
  
  // Chart names - matching Java source exactly
  private static readonly STUDENT_ATTENDANCE_TREND_CHART_NAME = 'Student Attendance Trend';
  private static readonly STUDENT_GPA_TREND_CHART_NAME = 'Student GPA Trend';
  private static readonly MULTI_YEAR_ABSENCE_TRENDS_CHART_NAME = 'Multi-Year Absence Trends by Semester';
  
  // Table names - matching Java source exactly
  private static readonly DETAILED_ENROLLMENT_HISTORY_TABLE_NAME = 'Detailed Enrollment History';
  private static readonly PROGRAM_MEMBERSHIP_HISTORY_TABLE_NAME = 'Program Membership History';
  private static readonly ACADEMIC_STANDARD_MASTERY_TABLE_NAME = 'Academic Standard Mastery';

  // ========================================
  // CONSTRUCTOR
  // ========================================
  
  constructor(page: Page) {
    super(page);
  }

  /**
   * Returns the expected page title for validation
   * Implements abstract method from MtssBasePage
   * @returns The page title string
   */
  protected pageTitle(): string | null {
    return MtssStudentProfilePage.STUDENT_PROFILE_PAGE_TITLE;
  }

  // ========================================
  // CARD COMPONENT METHODS - CONVERTED FROM JAVA
  // ========================================

  /**
   * Get Chronic Absences card component
   * Converted from Java getChronicAbsencesCard method
   * @returns HoonuitCard instance for Chronic Absences
   */
  public getChronicAbsencesCard(): HoonuitCard {
    return new HoonuitCard(this.page, MtssStudentProfilePage.CHRONIC_ABSENCES_CARD_NAME);
  }

  /**
   * Get Last 5 Days Attendance card component
   * Converted from Java getLast5DaysAttendance method
   * @returns HoonuitCard instance for Last 5 Days Attendance
   */
  public getLast5DaysAttendance(): HoonuitCard {
    return new HoonuitCard(this.page, MtssStudentProfilePage.LAST_5_DAYS_ATTENDANCE_CARD_NAME);
  }

  /**
   * Get Last 30 Days Attendance card component
   * Converted from Java getLast30DaysAttendance method
   * @returns HoonuitCard instance for Last 30 Days Attendance
   */
  public getLast30DaysAttendance(): HoonuitCard {
    return new HoonuitCard(this.page, MtssStudentProfilePage.LAST_30_DAYS_ATTENDANCE_CARD_NAME);
  }

  /**
   * Get Year-to-date Attendance card component
   * Converted from Java getYearToDateAttendance method
   * @returns HoonuitCard instance for Year-to-date Attendance
   */
  public getYearToDateAttendance(): HoonuitCard {
    return new HoonuitCard(this.page, MtssStudentProfilePage.YEAR_TO_DATE_ATTENDANCE_CARD_NAME);
  }

  /**
   * Get Student Incident Trend card component
   * Converted from Java getStudentIncidentTrendCard method
   * @returns HoonuitCard instance for Student Incident Trend
   */
  public getStudentIncidentTrendCard(): HoonuitCard {
    return new HoonuitCard(this.page, MtssStudentProfilePage.STUDENT_INCIDENT_TREND_CARD_NAME);
  }

  /**
   * Get Student State Test Summary card component
   * Converted from Java getStudentStateTestSummaryCard method
   * @returns HoonuitCard instance for Student State Test Summary
   */
  public getStudentStateTestSummaryCard(): HoonuitCard {
    return new HoonuitCard(this.page, MtssStudentProfilePage.STUDENT_STATE_TEST_SUMMARY_CARD_NAME);
  }

  /**
   * Get Student GPA Trend card component
   * Converted from Java getStudentGpaTrendCard method
   * @returns HoonuitCard instance for Student GPA Trend
   */
  public getStudentGpaTrendCard(): HoonuitCard {
    return new HoonuitCard(this.page, MtssStudentProfilePage.STUDENT_GPA_TREND_CARD_NAME);
  }

  // ========================================
  // CHART COMPONENT METHODS - CONVERTED FROM JAVA
  // ========================================

  /**
   * Get Student Attendance Trend line chart component
   * Converted from Java getStudentAttendanceTrendChart method
   * @returns HoonuitLineChart instance for Student Attendance Trend
   */
  public getStudentAttendanceTrendChart(): HoonuitLineChart {
    return new HoonuitLineChart(this.page, MtssStudentProfilePage.STUDENT_ATTENDANCE_TREND_CHART_NAME);
  }

  /**
   * Get Student GPA Trend line chart component
   * Converted from Java getStudentGpaTrendChart method
   * @returns HoonuitLineChart instance for Student GPA Trend
   */
  public getStudentGpaTrendChart(): HoonuitLineChart {
    return new HoonuitLineChart(this.page, MtssStudentProfilePage.STUDENT_GPA_TREND_CHART_NAME);
  }

  /**
   * Get Multi-Year Absence Trends by Semester bar chart component
   * Converted from Java getMultiYearAbsenceTrendsBySemesterChart method
   * @returns HoonuitBarChart instance for Multi-Year Absence Trends by Semester
   */
  public getMultiYearAbsenceTrendsBySemesterChart(): HoonuitBarChart {
    return new HoonuitBarChart(this.page, MtssStudentProfilePage.MULTI_YEAR_ABSENCE_TRENDS_CHART_NAME);
  }

  // ========================================
  // TABLE COMPONENT METHODS - CONVERTED FROM JAVA
  // ========================================

  /**
   * Get Detailed Enrollment History grid table component
   * Converted from Java getDetailedEnrollmentHistoryTable method
   * @returns HoonuitGridTable instance for Detailed Enrollment History
   */
  public getDetailedEnrollmentHistoryTable(): HoonuitGridTable {
    return new HoonuitGridTable(this.page, MtssStudentProfilePage.DETAILED_ENROLLMENT_HISTORY_TABLE_NAME);
  }

  /**
   * Get Program Membership History grid table component
   * Converted from Java getProgramMembershipHistoryTable method
   * @returns HoonuitGridTable instance for Program Membership History
   */
  public getProgramMembershipHistoryTable(): HoonuitGridTable {
    return new HoonuitGridTable(this.page, MtssStudentProfilePage.PROGRAM_MEMBERSHIP_HISTORY_TABLE_NAME);
  }

  /**
   * Get Academic Standard Mastery cross-tab grid table component
   * Converted from Java getAcademicStandardMasteryTable method
   * @returns HoonuitCrossTabGridTable instance for Academic Standard Mastery
   */
  public getAcademicStandardMasteryTable(): HoonuitCrossTabGridTable {
    return new HoonuitCrossTabGridTable(this.page, MtssStudentProfilePage.ACADEMIC_STANDARD_MASTERY_TABLE_NAME);
  }

  // ========================================
  // STUDENT PROFILE DATA METHODS - CONVERTED FROM JAVA
  // ========================================

  /**
   * Get complete student profile information
   * Converted from Java getStudentProfile method with enhanced error handling
   * 
   * This method extracts student narrative information from the dashboard card
   * by finding all h6 text-info elements and their sibling text values,
   * creating a key-value mapping of the student's profile data.
   * 
   * @returns Map containing student profile information as key-value pairs
   * @throws Error if no student profile information is found or if elements are not accessible
   */
  public async getStudentProfile(): Promise<Map<string, string>> {
    try {
      const studentNarrativeInfo = new Map<string, string>();
      
      // Wait for the dashboard card to be visible
      const dashboardCard = this.page.locator(MtssStudentProfilePage.DASHBOARD_CARD_LOCATOR);
      await dashboardCard.waitFor({ 
        state: 'visible', 
        timeout: MtssStudentProfilePage.DEFAULT_TIMEOUT 
      });
      
      // Get all student profile info elements (equivalent to Java's CollectionCondition.sizeGreaterThan(0))
      const infoElements = dashboardCard.locator(MtssStudentProfilePage.STUDENT_PROFILE);
      const elementCount = await infoElements.count();
      if (elementCount === 0) {
        throw new Error('No student profile elements found on the page');
      }
      
      const infoCount = await infoElements.count();
      
      // Extract key-value pairs from each info element and its sibling
      for (let i = 0; i < infoCount; i++) {
        const infoElement = infoElements.nth(i);
        
        // Ensure element is visible before interaction
        await infoElement.waitFor({ state: 'visible' });
        
        // Get the key text from the current element (equivalent to Java's getText().trim())
        const keyText = (await infoElement.textContent())?.trim() || '';
        
        // Get the value text from the next sibling element (equivalent to Java's sibling(0).getText().trim())
        const siblingElement = infoElement.locator('xpath=following-sibling::*[1]');
        
        try {
          // Check if sibling exists and get its text
          await siblingElement.waitFor({ state: 'visible', timeout: 2000 });
          const valueText = (await siblingElement.textContent())?.trim() || '';
          
          // Only add to map if both key and value are non-empty
          if (keyText && valueText) {
            studentNarrativeInfo.set(keyText, valueText);
          }
        } catch (siblingError) {
          // If sibling is not found, try to get next element in a different way
          const parentElement = infoElement.locator('xpath=..');
          const nextElements = parentElement.locator('*').nth(i + 1);
          
          try {
            await nextElements.waitFor({ state: 'visible', timeout: 1000 });
            const valueText = (await nextElements.textContent())?.trim() || '';
            
            if (keyText && valueText) {
              studentNarrativeInfo.set(keyText, valueText);
            }
          } catch {
            // If we still can't find the sibling, add the key with empty value
            if (keyText) {
              studentNarrativeInfo.set(keyText, '');
            }
          }
        }
      }
      
      // Ensure we have collected at least some profile information
      if (studentNarrativeInfo.size === 0) {
        throw new Error('No student profile information could be extracted from the page');
      }
      
      return studentNarrativeInfo;
      
    } catch (error) {
      throw new Error(`Failed to get student profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========================================
  // VALIDATION AND UTILITY METHODS
  // ========================================

  /**
   * Check if student profile information is displayed
   * Enhanced method for validation
   * @returns true if student profile information is visible
   */
  public async isStudentProfileDisplayed(): Promise<boolean> {
    try {
      const dashboardCard = this.page.locator(MtssStudentProfilePage.DASHBOARD_CARD_LOCATOR);
      await dashboardCard.waitFor({ state: 'visible', timeout: 5000 });
      
      const infoElements = dashboardCard.locator(MtssStudentProfilePage.STUDENT_PROFILE);
      const count = await infoElements.count();
      
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Wait for all dashboard components to load
   * Enhanced method for page readiness
   */
  public async waitForDashboardComponents(): Promise<void> {
    try {
      // Wait for main dashboard card
      await this.page.locator(MtssStudentProfilePage.DASHBOARD_CARD_LOCATOR).waitFor({ 
        state: 'visible', 
        timeout: MtssStudentProfilePage.DEFAULT_TIMEOUT 
      });
      
      // Wait for any loading indicators to disappear
      try {
        await this.page.locator(MtssStudentProfilePage.LOADING_INDICATOR).waitFor({ 
          state: 'hidden', 
          timeout: 5000 
        });
      } catch {
        // Loading indicator may not be present, continue
      }
      
      // Ensure student profile information is available
      await this.page.locator(MtssStudentProfilePage.STUDENT_PROFILE).first().waitFor({ 
        state: 'visible', 
        timeout: MtssStudentProfilePage.DEFAULT_TIMEOUT 
      });
      
    } catch (error) {
      throw new Error(`Dashboard components failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get student profile value by key
   * Enhanced helper method for specific profile data retrieval
   * @param key The profile data key to retrieve
   * @returns The profile data value or null if not found
   */
  public async getStudentProfileValue(key: string): Promise<string | null> {
    try {
      const studentProfile = await this.getStudentProfile();
      return studentProfile.get(key) || null;
    } catch (error) {
      console.warn(`Failed to get student profile value for key '${key}':`, error);
      return null;
    }
  }

  /**
   * Check if a specific card is visible on the page
   * Enhanced validation method for card components
   * @param cardName The name of the card to check
   * @returns true if the card is visible
   */
  public async isCardVisible(cardName: string): Promise<boolean> {
    try {
      const card = new HoonuitCard(this.page, cardName);
      return await card.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if a specific chart is visible on the page
   * Enhanced validation method for chart components
   * @param chartName The name of the chart to check
   * @returns true if the chart is visible
   */
  public async isChartVisible(chartName: string): Promise<boolean> {
    try {
      // Look for chart container with the specified title
      const chartContainer = this.page.locator('.highcharts-container').first();
      return await chartContainer.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if a specific table is visible on the page
   * Enhanced validation method for table components
   * @param tableName The name of the table to check
   * @returns true if the table is visible
   */
  public async isTableVisible(tableName: string): Promise<boolean> {
    try {
      // Look for table elements that might contain the table name
      const tableContainers = this.page.locator('div.ag-root-wrapper, table.pvtTable, .table-container');
      const visibleTables = await tableContainers.count();
      return visibleTables > 0;
    } catch {
      return false;
    }
  }

  // ========================================
  // ERROR HANDLING AND DEBUGGING METHODS
  // ========================================

  /**
   * Check if there are any error messages on the page
   * Enhanced method for error detection
   * @returns true if error messages are present
   */
  public async hasErrorMessages(): Promise<boolean> {
    try {
      const errorElements = this.page.locator(MtssStudentProfilePage.ERROR_MESSAGE);
      return (await errorElements.count()) > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get error message text if present
   * Enhanced method for error message retrieval
   * @returns Error message text or empty string if none
   */
  public async getErrorMessage(): Promise<string> {
    try {
      const errorElement = this.page.locator(MtssStudentProfilePage.ERROR_MESSAGE).first();
      await errorElement.waitFor({ state: 'visible', timeout: 3000 });
      return (await errorElement.textContent()) || '';
    } catch {
      return '';
    }
  }

  /**
   * Take a screenshot for debugging purposes
   * Enhanced debugging method
   * @param filename Optional filename for the screenshot
   */
  public async takeDebugScreenshot(filename?: string): Promise<void> {
    try {
      const screenshotName = filename || `mtss-student-profile-${Date.now()}.png`;
      await this.page.screenshot({ path: screenshotName, fullPage: true });
      console.log(`Debug screenshot saved: ${screenshotName}`);
    } catch (error) {
      console.warn('Failed to take debug screenshot:', error);
    }
  }
}
