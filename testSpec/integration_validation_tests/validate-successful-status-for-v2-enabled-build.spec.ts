/**
 * Validate Successful Status For V2 Enabled Build
 *
 * Validates that the latest (most recent created_utc) Source System Poller build for the specific
 * ETL task set completed with no FAILURE status for a configurable past day (default yesterday).
 *
 * Converted from Java: psqa.hoonuit.testsuite.etlValidationTests.ValidateSuccessfulStatusForV2EnabledBuild
 *
 * @author aradhyas
 * @since 28/09/25
 * @jira TCM-120560
 */

import { test, expect, describe, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { SnowFlakeDBHelper, BuildStatusResult } from '../../shared/helpers/SnowFlakeDBHelper';

// Test suite for Successful Status For V2 Enabled Build Validation
describe('Validate Successful Status For V2 Enabled Build', () => {
  /** Parsed configuration & evaluation artifacts populated during beforeEach */
  let daysAgo: number;
  let expectedDateUtc: Date;
  let result: BuildStatusResult | null;
  let buildStatusObject: string;
  let executedSql: string;
  
  /** Snowflake connection */
  let connection: any;

  /**
   * Parse daysAgo from environment/system property with validation
   */
  function parseDaysAgo(): number {
    const raw = (process.env.DAYS_AGO || '1').trim();
    let v: number;
    
    try {
      v = parseInt(raw, 10);
    } catch (e) {
      console.warn(`Invalid daysAgo '${raw}', defaulting to 1`);
      v = 1;
    }
    
    if (isNaN(v)) {
      console.warn(`Invalid daysAgo '${raw}', defaulting to 1`);
      v = 1;
    }
    
    if (v < SnowFlakeDBHelper.MIN_DAYS) {
      console.warn(`daysAgo ${v} < ${SnowFlakeDBHelper.MIN_DAYS}, using ${SnowFlakeDBHelper.MIN_DAYS}`);
      v = SnowFlakeDBHelper.MIN_DAYS;
    }
    
    if (v > SnowFlakeDBHelper.MAX_DAYS) {
      console.warn(`daysAgo ${v} > ${SnowFlakeDBHelper.MAX_DAYS}, capping`);
      v = SnowFlakeDBHelper.MAX_DAYS;
    }
    
    return v;
  }

  // Setup before each test
  beforeEach(async () => {
    result = null;
    
    // Derive temporal parameters
    daysAgo = parseDaysAgo();
    
    // Calculate expected UTC date
    const now = new Date();
    expectedDateUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    expectedDateUtc.setUTCDate(expectedDateUtc.getUTCDate() - daysAgo);
    
    console.log(`daysAgo=${daysAgo} expectedDateUTC=${expectedDateUtc.toISOString().split('T')[0]}`);

    const workflowTable = SnowFlakeDBHelper.WORKFLOW_TASK_QUEUE_TABLE;
    
    try {
      connection = await SnowFlakeDBHelper.openTestConnection();
      
      try {
        // Prefer chooseBuildStatusObject so explicit preferred object is tried first
        buildStatusObject = await SnowFlakeDBHelper.chooseBuildStatusObject(connection);
      } catch (ex: any) {
        throw new Error(`Unable to resolve BUILD_STATUS object: ${ex.message}`);
      }
      
      console.log(`Using build status object: ${buildStatusObject}`);

      executedSql = `SELECT DISTINCT b.status_name, q.created_utc ` +
        `FROM ( SELECT TOP 1 process_id, created_utc FROM ${workflowTable} ` +
        `WHERE TASK_EXECUTION_METHOD = 'Source System Poller' AND DATE(created_utc) = CURRENT_DATE() - ${daysAgo} ` +
        `ORDER BY created_utc DESC ) q JOIN ${buildStatusObject} b ON b.build_number = q.process_id`;
      
      console.log(`Executing validation query: ${executedSql}`);

      try {
        result = await SnowFlakeDBHelper.executeBuildStatusQuery(connection, executedSql);
      } catch (ise: any) {
        throw new Error(`Query evaluation failed: ${ise.message}`);
      }

      if (!result || !result.anyRow) {
        throw new Error(`No rows returned (daysAgo=${daysAgo}, expectedDate=${expectedDateUtc.toISOString().split('T')[0]}, buildStatusObject=${buildStatusObject})`);
      }
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
   * Validate latest Source System Poller build status for a configurable past day (default yesterday) is not FAILURE
   */
  test('TCM-120560', 'Validate latest Source System Poller build status is healthy', async () => {
    // Assert result is initialized
    expect(result, 'Result not initialized (setup may have failed)').toBeDefined();
    expect(result).not.toBeNull();
    
    if (!result) return; // TypeScript guard
    
    // Assert no multiple dates
    expect(result.multipleDates, `Multiple created_utc dates encountered (first=${result.observedDate?.toISOString()})`).toBe(false);
    
    // Assert observed date is present
    expect(result.observedDate, 'No observed created_utc date captured').not.toBeNull();
    
    // Compare dates (only date part, not time)
    if (result.observedDate) {
      const observedDateStr = result.observedDate.toISOString().split('T')[0];
      const expectedDateStr = expectedDateUtc.toISOString().split('T')[0];
      expect(observedDateStr, 'created_utc date mismatch').toBe(expectedDateStr);
    }
    
    // Assert no FAILURE status
    expect(result.containsFailure, `Statuses contained FAILURE: ${JSON.stringify(Array.from(result.statuses))}, SQL=${executedSql}`).toBe(false);

    console.log(`Validation PASSED (daysAgo=${daysAgo}, buildStatusObject=${buildStatusObject}, statuses=${JSON.stringify(Array.from(result.statuses))})`);
  });
});