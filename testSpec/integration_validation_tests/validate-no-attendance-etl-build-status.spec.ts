/**
 * Validate No_Attendance ETL Build Status
 *
 * Validates that the latest (most recent created_utc) No_Attendance nightly ETL build completed
 * successfully without any FAILURE status. Verifies that all tasks within the most recent
 * No_Attendance nightly build have exactly the expected status values: SUCCESS, SUCCESS_NO_CHANGES,
 * SUCCESS_WITH_WARNINGS.
 *
 * @author aradhyas
 * @since 28/11/25
 * @jira UIHN-90628
 */

import { test, expect, describe, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { SnowFlakeDBHelper } from '../../shared/helpers/SnowFlakeDBHelper';

// Expected distinct status values for No_Attendance ETL build
const EXPECTED_STATUSES = new Set<string>(['SUCCESS', 'SUCCESS_NO_CHANGES', 'SUCCESS_WITH_WARNINGS']);

// Test suite for No_Attendance ETL Build Status Validation
describe('Validate No_Attendance ETL Build Status', () => {
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

      // Step 3: Execute query to get distinct STATUS_NAME values for the latest No_Attendance build
      executedSql = `SELECT DISTINCT b.STATUS_NAME ` +
        `FROM ( SELECT TOP 1 process_id FROM ${workflowTable} ` +
        `WHERE TASK_EXECUTION_METHOD = 'Nightly Build No Attendance' ORDER BY created_utc DESC ) q ` +
        `JOIN ${buildStatusObject} b ON b.build_number = q.process_id`;
      
      console.log(`Executing No_Attendance ETL status query: ${executedSql}`);

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
   * Validate for latest No_Attendance nightly build has exactly the expected distinct overall statuses
   * 
   * Pass Criteria:
   * - PASS: All observed statuses match expected set (SUCCESS, SUCCESS_NO_CHANGES, SUCCESS_WITH_WARNINGS)
   *         with no FAILURE status
   * - FAIL: FAILURE status is present in observed statuses OR observed statuses do not exactly match
   *         expected set (missing or extra statuses)
   */
  test('UIHN-90628', 'Validate No_Attendance nightly ETL build status', async () => {
    // Assert observedStatuses is initialized
    expect(observedStatuses, 'Setup did not initialize observed statuses (was beforeEach skipped?)').toBeDefined();
    
    // Step 3 Continued: Verify query returns at least one status
    expect(observedStatuses.size, `No statuses returned by No_Attendance ETL query. SQL=${executedSql}`).toBeGreaterThan(0);

    // Step 4: Verify no FAILURE status exists
    const hasFailure = Array.from(observedStatuses).some(s => s.toUpperCase() === 'FAILURE');
    expect(hasFailure, `FAILURE status present in latest No_Attendance nightly build statuses: ${JSON.stringify(Array.from(observedStatuses))}`).toBe(false);

    // Step 5: Compare observed statuses with expected set
    const observedSorted = Array.from(observedStatuses).sort();
    const expectedSorted = Array.from(EXPECTED_STATUSES).sort();

    // Compare observed vs expected
    if (JSON.stringify(observedSorted) !== JSON.stringify(expectedSorted)) {
      const missing = expectedSorted.filter(e => !observedSorted.includes(e));
      const extras = observedSorted.filter(o => !expectedSorted.includes(o));
      
      throw new Error(
        `Distinct STATUS_NAME mismatch for No_Attendance ETL build. ` +
        `Observed=${JSON.stringify(observedSorted)}, ` +
        `Expected=${JSON.stringify(expectedSorted)}, ` +
        `Missing=${JSON.stringify(missing)}, ` +
        `Extras=${JSON.stringify(extras)}, ` +
        `SQL=${executedSql}`
      );
    }

    console.log(`No_Attendance ETL build status validation PASSED. statuses=${JSON.stringify(observedSorted)}`);
  });
});
