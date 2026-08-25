/**
 * Validate File Based Nightly ETL Status
 *
 * Validates that the latest (most recent created_utc) Source System Poller build for a file-based tenant
 * completed with exactly the expected distinct STATUS_NAME values (no FAILURE, only SUCCESS variants).
 *
 * Converted from Java: psqa.hoonuit.testsuite.etlValidationTests.ValidateFileBasedNightlyEtlStatus
 *
 * @author aradhyas
 * @since 28/09/25
 * @jira TCM-120556
 */

import { test, expect, describe, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { SnowFlakeDBHelper } from '../../shared/helpers/SnowFlakeDBHelper';

// Test suite for File Based Nightly ETL Status Validation
describe('Validate File Based Nightly ETL Status', () => {
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
      connection = await SnowFlakeDBHelper.openTestConnection();
      
      let buildStatusObject: string;
      try {
        buildStatusObject = await SnowFlakeDBHelper.chooseBuildStatusObject(connection);
      } catch (ex: any) {
        throw new Error(`Unable to resolve BUILD_STATUS object: ${ex.message}`);
      }

      executedSql = `SELECT DISTINCT b.STATUS_NAME ` +
        `FROM ( SELECT TOP 1 process_id FROM ${workflowTable} ` +
        `WHERE TASK_EXECUTION_METHOD = 'Source System Poller' ORDER BY created_utc DESC ) q ` +
        `JOIN ${buildStatusObject} b ON b.build_number = q.process_id`;
      
      console.log(`Executing overall ETL status query (file-based): ${executedSql}`);

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

  // Cleanup after each test
  afterEach(async () => {
    try {
      await SnowFlakeDBHelper.closeConnection();
    } catch (error) {
      console.warn('Connection cleanup failed:', error);
    }
  });

  /**
   * Validate for File based tenant latest Source System Poller build has exactly the expected distinct overall statuses
   */
  test('TCM-120556', 'Validate overall statuses for latest Source System Poller build', async () => {
    // Assert observedStatuses is initialized
    expect(observedStatuses, 'Setup did not initialize observed statuses (was beforeEach skipped?)').toBeDefined();
    expect(observedStatuses.size, `No statuses returned by overall ETL query. SQL=${executedSql}`).toBeGreaterThan(0);

    // Check for FAILURE status
    const hasFailure = Array.from(observedStatuses).some(s => s.toUpperCase() === 'FAILURE');
    expect(hasFailure, `FAILURE status present in latest Source System Poller build statuses: ${JSON.stringify(Array.from(observedStatuses))}`).toBe(false);

    // Expected statuses
    const expected = new Set<string>(['SUCCESS_NO_CHANGES', 'SUCCESS']);
    const observedSorted = Array.from(observedStatuses).sort();
    const expectedSorted = Array.from(expected).sort();

    // Compare observed vs expected
    if (JSON.stringify(observedSorted) !== JSON.stringify(expectedSorted)) {
      const missing = expectedSorted.filter(e => !observedSorted.includes(e));
      const extras = observedSorted.filter(o => !expectedSorted.includes(o));
      
      throw new Error(
        `Distinct STATUS_NAME mismatch. ` +
        `Observed=${JSON.stringify(observedSorted)}, ` +
        `Expected=${JSON.stringify(expectedSorted)}, ` +
        `Missing=${JSON.stringify(missing)}, ` +
        `Extras=${JSON.stringify(extras)}, ` +
        `SQL=${executedSql}`
      );
    }

    console.log(`File-based ETL status validation PASSED. statuses=${JSON.stringify(observedSorted)}`);
  });
});