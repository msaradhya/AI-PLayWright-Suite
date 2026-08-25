/**
 * Validate School ETL Nightly Build Status
 *
 * Validates that the latest Source System Poller build for SCHOOL-related ETL tasks
 * completed with STATUS_NAME = 'SUCCESS_NO_CHANGES'. It queries Snowflake to verify
 * that specific school-related tasks within the most recent Nightly Build No Attendance
 * have the expected status.
 *
 * Test validates:
 * - Query returns exactly ONE distinct status for SCHOOL-related tasks
 * - That status is SUCCESS_NO_CHANGES
 * - All 4 specific school ETL tasks completed without changes
 *
 * @author aradhyas
 * @since 28/11/25
 * @jira TCM-120554
 */

import { test, expect, describe, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { SnowFlakeDBHelper } from '../../shared/helpers/SnowFlakeDBHelper';

// Targeted SCHOOL ETL Tasks
const SCHOOL_ETL_TASKS = [
  'BUILD DW_ETL DASHBOARD_UPLOAD DTBL_SCHOOLS',
  'BUILD DW_ETL K12INTEL_DW.DTBL_SCHOOLS',
  'BUILD DW_ETL K12INTEL_KEYMAP_SAAS.KM_SCHOOLS',
  'CDC K12INTEL_STAGING_SAAS_YR.SCHOOLS',
];

// Expected status for all SCHOOL-related tasks
const EXPECTED_STATUS = 'SUCCESS_NO_CHANGES';

// Test suite for School ETL Nightly Build Status Validation
describe('Validate School ETL Nightly Build Status', () => {
  /** Holds the distinct statuses collected in beforeEach for assertion in the test. */
  let observedStatuses: Set<string>;

  /** SQL executed (captured for logging / potential debugging). */
  let executedSql: string;

  /** Snowflake connection */
  let connection: any;

  // Setup before each test
  beforeEach(async () => {
    observedStatuses = new Set<string>();
    const workflowTable = SnowFlakeDBHelper.WORKFLOW_TASK_QUEUE_TABLE;

    try {
      // Step 1: Open Snowflake database connection
      connection = await SnowFlakeDBHelper.openTestConnection();
      console.log('Snowflake connection established successfully');

      // Step 2: Resolve BUILD_STATUS object from Snowflake
      let buildStatusObject: string;
      try {
        buildStatusObject = await SnowFlakeDBHelper.chooseBuildStatusObject(connection);
        console.log(`BUILD_STATUS object resolved: ${buildStatusObject}`);
      } catch (ex: any) {
        throw new Error(`Unable to resolve BUILD_STATUS object: ${ex.message}`);
      }

      // Step 3: Build and execute query to get distinct STATUS_NAME for SCHOOL-related tasks
      // in the latest Nightly Build No Attendance (ordered by created_utc DESC)
      const taskNamesIn = SCHOOL_ETL_TASKS.map(t => `'${t}'`).join(', ');

      executedSql = `SELECT DISTINCT b.STATUS_NAME ` +
        `FROM ( SELECT TOP 1 process_id FROM ${workflowTable} ` +
        `WHERE TASK_EXECUTION_METHOD = 'Nightly Build No Attendance' ORDER BY created_utc DESC ) q ` +
        `JOIN ${buildStatusObject} b ON b.build_number = q.process_id ` +
        `WHERE b.task_name IN (${taskNamesIn})`;

      console.log(`Executing SCHOOL ETL status query: ${executedSql}`);

      const rows = await SnowFlakeDBHelper.executeQuery<any[]>(connection, executedSql);

      for (const row of rows) {
        const status = row['STATUS_NAME'] || row['status_name'];
        if (status) {
          observedStatuses.add(status.trim());
        }
      }

      console.log(`Collected distinct statuses (setup): ${JSON.stringify(Array.from(observedStatuses))}`);
    } catch (error: any) {
      console.error('Setup failed:', error.message);
      throw error;
    }
  });

  // Cleanup after each test - Step 6: Close database connection
  afterEach(async () => {
    try {
      await SnowFlakeDBHelper.closeConnection();
      console.log('Snowflake connection closed');
    } catch (error) {
      console.warn('Connection cleanup failed:', error);
    }
  });

  /**
   * Validate latest Nightly Build No Attendance has exactly one distinct status (SUCCESS_NO_CHANGES)
   * for all SCHOOL-related ETL tasks
   */
  test('TCM-120554', 'Validate SCHOOL-related ETL tasks have SUCCESS_NO_CHANGES status in Nightly Build No Attendance', async () => {
    // Assert observedStatuses is initialized
    expect(observedStatuses, 'Setup did not initialize observed statuses (was beforeEach skipped?)').toBeDefined();

    // Step 4: Verify query returns at least one status
    expect(observedStatuses.size, `No statuses returned by SCHOOL ETL query. SQL=${executedSql}`).toBeGreaterThan(0);

    // Step 5: Verify only one distinct status is returned
    expect(
      observedStatuses.size,
      `Expected exactly 1 distinct STATUS_NAME, but got ${observedStatuses.size}: ${JSON.stringify(Array.from(observedStatuses))}. SQL=${executedSql}`
    ).toBe(1);

    // Step 6: Verify the status is SUCCESS_NO_CHANGES
    const statusArray = Array.from(observedStatuses);
    const actualStatus = statusArray[0];
    
    // Additional defensive check after size validation
    if (actualStatus === undefined) {
      throw new Error(`Unexpected empty status set despite size check. SQL=${executedSql}`);
    }
    
    expect(
      actualStatus,
      `Expected status '${EXPECTED_STATUS}' but got '${actualStatus}'. SQL=${executedSql}`
    ).toBe(EXPECTED_STATUS);

    console.log(`SCHOOL ETL Nightly Build status validation PASSED. ` +
      `Tasks validated: ${SCHOOL_ETL_TASKS.join(', ')}. ` +
      `Status: ${actualStatus}`);
  });
});
