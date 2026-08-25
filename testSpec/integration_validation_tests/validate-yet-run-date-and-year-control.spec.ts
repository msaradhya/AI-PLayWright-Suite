/**
 * Validate YET_RUN_DATE and XTBL_YEAR_CONTROL
 *
 * This test validates after each ETL run:
 * 1. YET_RUN_DATE for a given SOURCE_NAME (default 'sisgoldps5') matches an expected static timestamp string
 *    (default '2026-07-30 00:00:00.000')
 * 2. XTBL_YEAR_CONTROL contains expected rows for configured SOURCE_YEAR_VALUES (defaults 2024, 2025, 2026)
 *    with correct scope_year, current_ind, and source_year_offset values
 *
 * Test Objective:
 * - Verify after each ETL:
 *   - YET_RUN_DATE in XTBL_SOURCE_CONTROL matches the expected timestamp for the configured source
 *   - XTBL_YEAR_CONTROL has correct configuration for each target year (scope_year, current_ind, source_year_offset)
 *
 * Configuration:
 * - YET_SOURCE_NAME: Source name to validate (default: sisgoldps5)
 * - YET_EXPECTED_RUN_DATETIME: Expected timestamp string (default: 2026-07-30 00:00:00.000)
 * - YET_YEAR_CONTROL_YEARS: Comma-separated list of years (default: 2024,2025,2026)
 *
 * Expected Year Configurations:
 * - 2024: scope_year=2024-2025, current_ind=N, offset=-1
 * - 2025: scope_year=2025-2026, current_ind=Y, offset=0
 * - 2026: scope_year=2026-2027, current_ind=N, offset=1
 *
 * Pass Criteria:
 * - PASS:
 *   - YET_RUN_DATE exactly matches expected timestamp string
 *   - All target years present in XTBL_YEAR_CONTROL
 *   - Each year has correct scope_year, current_ind, and source_year_offset values
 * - FAIL:
 *   - No rows returned for SOURCE_NAME
 *   - YET_RUN_DATE does not match expected value
 *   - Missing rows for any target year
 *   - Any year has incorrect scope_year, current_ind, or offset value
 *
 * Framework: Playwright + TypeScript
 * @author aradhyas
 * @since 28/11/25
 * @jira TCM-120559
 */

import { test, expect, describe, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { SnowFlakeDBHelper } from '../../shared/helpers/SnowFlakeDBHelper';

// Configuration from environment variables with defaults
const YET_SOURCE_NAME = process.env.YET_SOURCE_NAME || 'sisgoldps5';
const YET_EXPECTED_RUN_DATETIME = process.env.YET_EXPECTED_RUN_DATETIME || '2026-07-30 00:00:00.000';
const YET_YEAR_CONTROL_YEARS = (process.env.YET_YEAR_CONTROL_YEARS || '2024,2025,2026')
  .split(',')
  .map(y => parseInt(y.trim(), 10));

// Expected year configurations
interface YearConfig {
  scopeYear: string;
  currentInd: string;
  offset: number;
}

const EXPECTED_YEAR_CONFIGS: Map<number, YearConfig> = new Map([
  [2024, { scopeYear: '2024-2025', currentInd: 'N', offset: -1 }],
  [2025, { scopeYear: '2025-2026', currentInd: 'Y', offset: 0 }],
  [2026, { scopeYear: '2026-2027', currentInd: 'N', offset: 1 }],
]);

// Test suite for YET_RUN_DATE and XTBL_YEAR_CONTROL Validation
describe('Validate YET_RUN_DATE and XTBL_YEAR_CONTROL', () => {
  /** Observed YET_RUN_DATE string from XTBL_SOURCE_CONTROL */
  let observedYetRunDate: string | null;

  /** Year control data from XTBL_YEAR_CONTROL */
  let observedYearControl: Map<number, { scopeYear: string; currentInd: string; offset: number }>;

  /** SQL executed for YET_RUN_DATE query */
  let yetRunDateSql: string;

  /** SQL executed for Year Control query */
  let yearControlSql: string;

  /** Snowflake connection */
  let connection: any;

  // Setup before each test
  beforeEach(async () => {
    observedYetRunDate = null;
    observedYearControl = new Map();

    try {
      // Step 1: Parse configuration from environment variables
      console.log(`Configuration loaded:`);
      console.log(`  YET_SOURCE_NAME: ${YET_SOURCE_NAME}`);
      console.log(`  YET_EXPECTED_RUN_DATETIME: ${YET_EXPECTED_RUN_DATETIME}`);
      console.log(`  YET_YEAR_CONTROL_YEARS: ${YET_YEAR_CONTROL_YEARS.join(', ')}`);

      // Step 2: Open Snowflake database connection
      connection = await SnowFlakeDBHelper.openTestConnection();
      console.log('Snowflake connection established successfully');

      // Step 3: Execute query to get YET_RUN_DATE for the configured SOURCE_NAME
      yetRunDateSql = `SELECT TO_CHAR(YET_RUN_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS YET_RUN_DATE_STR ` +
        `FROM ${SnowFlakeDBHelper.SF_DATABASE}.K12INTEL_USERDATA.XTBL_SOURCE_CONTROL ` +
        `WHERE SOURCE_NAME = ? ` +
        `ORDER BY YET_RUN_DATE DESC LIMIT 1`;

      console.log(`Executing YET_RUN_DATE query: ${yetRunDateSql}`);
      console.log(`  With parameter: ${YET_SOURCE_NAME}`);

      const yetRunDateRows = await SnowFlakeDBHelper.executeParameterizedQuery<any[]>(
        connection,
        yetRunDateSql,
        [YET_SOURCE_NAME]
      );

      if (yetRunDateRows && yetRunDateRows.length > 0) {
        observedYetRunDate = yetRunDateRows[0]['YET_RUN_DATE_STR'] || yetRunDateRows[0]['yet_run_date_str'];
        console.log(`Observed YET_RUN_DATE: ${observedYetRunDate}`);
      } else {
        console.warn(`No rows returned for SOURCE_NAME: ${YET_SOURCE_NAME}`);
      }

      // Step 5: Execute query to get year control data from XTBL_YEAR_CONTROL
      const placeholders = YET_YEAR_CONTROL_YEARS.map(() => '?').join(', ');
      yearControlSql = `SELECT source_year_value AS YEAR_VAL, scope_year AS SCOPE_YEAR, ` +
        `current_ind AS CURRENT_IND, source_year_offset AS YEAR_OFFSET ` +
        `FROM ${SnowFlakeDBHelper.SF_DATABASE}.K12INTEL_USERDATA.XTBL_YEAR_CONTROL ` +
        `WHERE SOURCE_YEAR_VALUE IN (${placeholders}) ` +
        `ORDER BY SOURCE_YEAR_VALUE`;

      console.log(`Executing Year Control query: ${yearControlSql}`);
      console.log(`  With parameters: ${YET_YEAR_CONTROL_YEARS.join(', ')}`);

      const yearControlRows = await SnowFlakeDBHelper.executeParameterizedQuery<any[]>(
        connection,
        yearControlSql,
        YET_YEAR_CONTROL_YEARS
      );

      if (yearControlRows && yearControlRows.length > 0) {
        for (const row of yearControlRows) {
          const yearVal = row['YEAR_VAL'] || row['year_val'];
          const scopeYear = row['SCOPE_YEAR'] || row['scope_year'];
          const currentInd = row['CURRENT_IND'] || row['current_ind'];
          const yearOffset = row['YEAR_OFFSET'] || row['year_offset'];

          if (yearVal !== null && yearVal !== undefined) {
            const parsedOffset = yearOffset !== null && yearOffset !== undefined 
              ? parseInt(yearOffset.toString(), 10) 
              : 0;
            observedYearControl.set(parseInt(yearVal, 10), {
              scopeYear: scopeYear?.toString().trim() || '',
              currentInd: currentInd?.toString().trim() || '',
              offset: isNaN(parsedOffset) ? 0 : parsedOffset,
            });
          }
        }
        console.log(`Collected ${observedYearControl.size} year control entries`);
      } else {
        console.warn(`No rows returned for years: ${YET_YEAR_CONTROL_YEARS.join(', ')}`);
      }

    } catch (error: any) {
      console.error('Setup failed:', error.message);
      throw error;
    }
  });

  // Cleanup after each test
  afterEach(async () => {
    try {
      // Step 8: Close database connection
      await SnowFlakeDBHelper.closeConnection();
      console.log('Database connection closed');
    } catch (error) {
      console.warn('Connection cleanup failed:', error);
    }
  });

  /**
   * Validate YET_RUN_DATE matches expected timestamp string
   */
  test('TCM-120559', 'Validate YET_RUN_DATE matches expected timestamp', async () => {
    // Step 4: Verify YET_RUN_DATE matches expected timestamp string
    expect(
      observedYetRunDate,
      `No YET_RUN_DATE returned for SOURCE_NAME: ${YET_SOURCE_NAME}. SQL: ${yetRunDateSql}`
    ).not.toBeNull();

    expect(
      observedYetRunDate,
      `YET_RUN_DATE mismatch. Expected: '${YET_EXPECTED_RUN_DATETIME}', Actual: '${observedYetRunDate}'. SQL: ${yetRunDateSql}`
    ).toBe(YET_EXPECTED_RUN_DATETIME);

    console.log(`YET_RUN_DATE validation PASSED. Value: ${observedYetRunDate}`);
  });

  /**
   * Validate XTBL_YEAR_CONTROL has correct configuration for each target year
   */
  test('TCM-120559', 'Validate XTBL_YEAR_CONTROL configuration for target years', async () => {
    // Step 6: Validate each year's configuration
    expect(
      observedYearControl.size,
      `No year control rows returned for years: ${YET_YEAR_CONTROL_YEARS.join(', ')}. SQL: ${yearControlSql}`
    ).toBeGreaterThan(0);

    const missingYears: number[] = [];
    const configMismatches: string[] = [];

    for (const year of YET_YEAR_CONTROL_YEARS) {
      const expectedConfig = EXPECTED_YEAR_CONFIGS.get(year);
      const actualConfig = observedYearControl.get(year);

      if (!actualConfig) {
        missingYears.push(year);
        continue;
      }

      if (!expectedConfig) {
        console.warn(`No expected configuration defined for year ${year}, skipping validation`);
        continue;
      }

      // Validate scope_year
      if (actualConfig.scopeYear !== expectedConfig.scopeYear) {
        configMismatches.push(
          `Year ${year}: scope_year mismatch. Expected: '${expectedConfig.scopeYear}', Actual: '${actualConfig.scopeYear}'`
        );
      }

      // Validate current_ind
      if (actualConfig.currentInd !== expectedConfig.currentInd) {
        configMismatches.push(
          `Year ${year}: current_ind mismatch. Expected: '${expectedConfig.currentInd}', Actual: '${actualConfig.currentInd}'`
        );
      }

      // Validate offset
      if (actualConfig.offset !== expectedConfig.offset) {
        configMismatches.push(
          `Year ${year}: source_year_offset mismatch. Expected: ${expectedConfig.offset}, Actual: ${actualConfig.offset}`
        );
      }
    }

    // Build error message if validation fails
    if (missingYears.length > 0 || configMismatches.length > 0) {
      let errorMsg = 'XTBL_YEAR_CONTROL validation failure. ';

      if (missingYears.length > 0) {
        errorMsg += `Missing years: ${JSON.stringify(missingYears)}. `;
      }

      if (configMismatches.length > 0) {
        errorMsg += `Configuration mismatches: ${configMismatches.join('; ')}. `;
      }

      errorMsg += `SQL: ${yearControlSql}`;

      throw new Error(errorMsg);
    }

    console.log(`XTBL_YEAR_CONTROL validation PASSED. Validated ${YET_YEAR_CONTROL_YEARS.length} years.`);
    console.log(`Year configurations:`);
    for (const [year, config] of observedYearControl.entries()) {
      console.log(`  ${year}: scope_year=${config.scopeYear}, current_ind=${config.currentInd}, offset=${config.offset}`);
    }
  });
});
