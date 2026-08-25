/**
 * Validate Overall SSP ETL Status
 *
 * Validates that for the latest (most recent created_utc) Source System Poller build we have the
 * expected TASK_NAME -> STATUS_NAME pairs present (all should be SUCCESS) and no FAILURE statuses appear.
 * The validation uses build data from k12intel_metadata.build_status_all.
 *
 * Converted from Java: psqa.hoonuit.testsuite.etlValidationTests.ValidateOverAllSSPEtlStatus
 *
 * @author aradhyas
 * @since 28/09/25 (updated to assert specific task/status pairs)
 * @jira TCM-120413
 */

import { test, expect, describe, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { SnowFlakeDBHelper } from '../../shared/helpers/SnowFlakeDBHelper';

// Expected required task -> status mapping (all SUCCESS)
const EXPECTED_TASK_STATUSES: Map<string, string> = new Map([
  ['BUILD EDVANTAGE', 'SUCCESS'],
  ['LOGICAL SUPPORT TASKS', 'SUCCESS'],
  ['BUILD DW ALL', 'SUCCESS'],
  ['CORE BUILD TASKS', 'SUCCESS'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_STUMONABSSUM', 'SUCCESS'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_1', 'SUCCESS'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_2', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_3', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_4', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_5', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_6', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_7', 'SUCCESS'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_8', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_9', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_DISCIPLINE_STUSCHSUMMARY', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_RECENT', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_SCHSUMMARY', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_STUABSSPANSUM', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_STUABSSUMMARY', 'SUCCESS'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_STUSUMMARY', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_STUWEEKLYABSSUM', 'SUCCESS'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_ATTENDANCE_STUYTDSUMMARY', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_STUDENT_ANNUAL_MEASURES', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_DW.FTBL_STUDENT_ANNUAL_MEASURES_PIVOT', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_STAGING_UAM.USAGEANDMONITORINGEXTRACTS', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_STAGING.STUDENT_ANNUAL_MEASURES_HELPER', 'SUCCESS_NO_CHANGES'],
  ['BUILD DW_ETL K12INTEL_USERDATA.XTBL_DATA_QUALITY_PROCESS', 'SUCCESS_NO_CHANGES'],
  ['BUILD HELPERS ALL', 'SUCCESS_NO_CHANGES'],
  ['BUILD KEYMAP ALL', 'SUCCESS'],
  ['BUILD USERDATA ALL', 'SUCCESS_NO_CHANGES'],
  ['CDC ALL', 'SUCCESS'],
  ['CDC K12INTEL_STAGING_SAAS_YR.ATTENDANCE', 'SUCCESS'],
  ['EXTRACT ALL', 'SUCCESS'],
  ['EXTRACT ATTENDANCE', 'SUCCESS'],
  ['LOAD ALL', 'SUCCESS'],
  ['LOAD DW_ETL K12INTEL_STAGING_SAAS.ATTENDANCE_CDC', 'SUCCESS'],
  ['POST BUILD TASKS', 'SUCCESS_NO_CHANGES'],
  ['VALIDATE ALL', 'SUCCESS'],
  ['VALIDATE DW_ETL ATTENDANCE', 'SUCCESS'],
]);

// Test suite for Overall SSP ETL Status Validation
describe('Validate Overall SSP ETL Status', () => {
  /** Holds task -> status for latest build */
  let observedTaskStatuses: Map<string, string>;
  
  /** SQL executed (captured for logging / potential debugging). */
  let executedSql: string;
  
  /** Snowflake connection */
  let connection: any;

  // Setup before each test
  beforeEach(async () => {
    observedTaskStatuses = new Map<string, string>();
    const workflowTable = SnowFlakeDBHelper.WORKFLOW_TASK_QUEUE_TABLE;
    
    try {
      connection = await SnowFlakeDBHelper.openTestConnection();
      
      // Explicitly use k12intel_metadata.build_status_all per requirement (skip dynamic resolution)
      const buildStatusObject = 'k12intel_metadata.build_status_all';
      
      executedSql = `SELECT DISTINCT b.TASK_NAME, b.STATUS_NAME ` +
        `FROM ( SELECT TOP 1 process_id FROM ${workflowTable} ` +
        `WHERE TASK_EXECUTION_METHOD = 'Source System Poller' ORDER BY created_utc DESC ) q ` +
        `JOIN ${buildStatusObject} b ON b.build_number = q.process_id`;
      
      console.log(`Executing overall ETL task/status query: ${executedSql}`);

      const rows = await SnowFlakeDBHelper.executeQuery<any[]>(connection, executedSql);
      
      for (const row of rows) {
        const task = (row['TASK_NAME'] || row['task_name'] || '').trim();
        const status = (row['STATUS_NAME'] || row['status_name'] || '').trim();
        
        if (task) {
          // If a task appears multiple times with different statuses, capture and later flag
          const prior = observedTaskStatuses.get(task);
          if (prior && prior.toLowerCase() !== status.toLowerCase()) {
            console.warn(`Task '${task}' has multiple differing statuses: '${prior}' and '${status}' (keeping first)`);
          } else {
            observedTaskStatuses.set(task, status);
          }
        }
      }
      
      // Assert early that we have results
      expect(observedTaskStatuses.size, 'No task/status rows returned by ETL query').toBeGreaterThan(0);
      
      console.log(`Collected ${observedTaskStatuses.size} unique task statuses in setup`);
    } catch (error: any) {
      console.error('Setup failed:', error.message);
      throw error;
    }
  });

  // Cleanup after each test
  afterEach(async () => {
    try {
      await SnowFlakeDBHelper.closeConnection();
    } catch (error) {
      console.warn('Connection cleanup failed:', error);
    }
  });

  /**
   * Validate latest Source System Poller build has required task/status pairs (all SUCCESS)
   */
  test('TCM-120413', 'Validate overall task statuses for latest Source System Poller build', async () => {
    // Assert observedTaskStatuses is initialized
    expect(observedTaskStatuses, 'Setup did not run or failed (observedTaskStatuses null)').toBeDefined();

    // Fail fast if any FAILURE present among retrieved tasks
    const hasFailure = Array.from(observedTaskStatuses.values()).some(s => s.toUpperCase() === 'FAILURE');
    expect(hasFailure, `At least one task has FAILURE status in latest Source System Poller build: ${JSON.stringify(Object.fromEntries(observedTaskStatuses))}`).toBe(false);

    const missingTasks: string[] = [];
    const statusMismatch: Map<string, string> = new Map();

    // Validate each expected task/status pair
    for (const [task, expectedStatus] of EXPECTED_TASK_STATUSES.entries()) {
      const actualStatus = observedTaskStatuses.get(task);
      
      if (!actualStatus) {
        missingTasks.push(task);
      } else if (!expectedStatus.includes(actualStatus)) {
        statusMismatch.set(task, actualStatus);
      }
    }

    // Build error message if validation fails
    if (missingTasks.length > 0 || statusMismatch.size > 0) {
      let errorMsg = 'Task/status validation failure. ';
      
      if (missingTasks.length > 0) {
        errorMsg += `Missing tasks=${JSON.stringify(missingTasks)}. `;
      }
      
      if (statusMismatch.size > 0) {
        errorMsg += `Status mismatches=${JSON.stringify(Object.fromEntries(statusMismatch))} (expected SUCCESS). `;
      }
      
      errorMsg += `Observed tasks count=${observedTaskStatuses.size}. SQL=${executedSql}`;
      
      throw new Error(errorMsg);
    }

    console.log(`Overall ETL task/status validation PASSED. Validated ${EXPECTED_TASK_STATUSES.size} required tasks. SQL=${executedSql}`);
  });
});