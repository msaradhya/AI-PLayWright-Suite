/**
 * Validation of SmartyStreets Address Data
 * 
 * Validates that a specific SmartyStreets (address verification) row in Snowflake
 * matches the expected authoritative values. Verifies that the address verification
 * ETL correctly populated address data including municipality, state, county,
 * postal code, coordinates, and verification status.
 * 
 * Converted from Java: psqa.hoonuit.testsuite.etlValidationTests.ValidationOfSmartystreetsAddressData
 * 
 * @author aradhyas
 * @since 28/09/25
 * @jira TCM-120520
 */

import { test, expect, describe, beforeEach, afterEach } from '../../fixtures/test-wrapper';
import { SnowFlakeDBHelper } from '../../shared/helpers/SnowFlakeDBHelper';

// Expected values for address verification
const EXPECTED_ADDRESS_UUID = '850dd705-c133-4796-9f28-d005fa73afb6';
const EXPECTED_MUNICIPALITY = 'Chicago';
const EXPECTED_STATE_PROVINCE_ABBREV = 'IL';
const EXPECTED_COUNTY = 'Cook';
const EXPECTED_POSTAL_CODE = '60657';
const EXPECTED_COUNTY_CODE = '17031';
const EXPECTED_XCOORD = -87.65433; // longitude
const EXPECTED_YCOORD = 41.93988;  // latitude
const EXPECTED_ADDRESS_VERIFIED_FLAG = 'Y';

// Coordinate tolerance for floating point comparison
const COORDINATE_TOLERANCE = 1e-5;

// Interface for Address Verification Data
interface AddressVerificationData {
  addressUuid: string;
  municipality: string;
  stateProvinceAbbrev: string;
  county: string;
  postalCode: string;
  countyCode: string;
  xcoord: number;
  ycoord: number;
  addressVerifiedFlag: string;
}

// Test suite for SmartyStreets Address Data Validation
describe('Validation of SmartyStreets Address Data', () => {
  /** Address verification table */
  let addressVerificationTable: string;
  
  /** SQL query executed */
  let executedSql: string;
  
  /** Retrieved address data */
  let addressData: AddressVerificationData | null;
  
  /** Row count from query */
  let rowCount: number;
  
  /** Snowflake connection */
  let connection: any;

  // Setup before each test
  beforeEach(async () => {
    addressData = null;
    rowCount = 0;
    addressVerificationTable = `${SnowFlakeDBHelper.SF_DATABASE}.K12INTEL_USERDATA.XTBL_ADDRESS_VERIFICATION`;
    
    try {
      // Open Snowflake database connection
      connection = await SnowFlakeDBHelper.openTestConnection();
      
      // Prepare SQL query for ADDRESS_UUID lookup using parameterized query
      executedSql = `SELECT ADDRESS_UUID, MUNICIPALITY, STATE_PROVINCE_ABBREV, COUNTY, ` +
        `POSTAL_CODE, COUNTY_CODE, XCOORD, YCOORD, ADDRESS_VERIFIED_FLAG ` +
        `FROM ${addressVerificationTable} ` +
        `WHERE ADDRESS_UUID = ?`;
      
      console.log(`Executing address verification query: ${executedSql} with param: ${EXPECTED_ADDRESS_UUID}`);

      // Execute query to retrieve address verification data using parameterized query
      const rows = await SnowFlakeDBHelper.executeParameterizedQuery<any[]>(connection, executedSql, [EXPECTED_ADDRESS_UUID]);
      
      rowCount = rows.length;
      console.log(`Query returned ${rowCount} row(s)`);
      
      if (rowCount > 0) {
        const row = rows[0];
        addressData = {
          addressUuid: row['ADDRESS_UUID'] || row['address_uuid'],
          municipality: row['MUNICIPALITY'] || row['municipality'],
          stateProvinceAbbrev: row['STATE_PROVINCE_ABBREV'] || row['state_province_abbrev'],
          county: row['COUNTY'] || row['county'],
          postalCode: String(row['POSTAL_CODE'] || row['postal_code']),
          countyCode: String(row['COUNTY_CODE'] || row['county_code']),
          xcoord: parseFloat(row['XCOORD'] || row['xcoord']),
          ycoord: parseFloat(row['YCOORD'] || row['ycoord']),
          addressVerifiedFlag: row['ADDRESS_VERIFIED_FLAG'] || row['address_verified_flag'],
        };
        
        console.log(`Retrieved address data: ${JSON.stringify(addressData)}`);
      }
    } catch (error: any) {
      console.error('Setup failed:', error.message);
      throw error;
    }
  });

  // Cleanup after each test - Close database connection
  afterEach(async () => {
    try {
      await SnowFlakeDBHelper.closeConnection();
      console.log('Database connection closed successfully');
    } catch (error) {
      console.warn('Connection cleanup failed:', error);
    }
  });

  /**
   * TCM-120520: Validate SmartyStreets address verification data
   * 
   * This test validates that the address verification data for ADDRESS_UUID:
   * - Exists in XTBL_ADDRESS_VERIFICATION table
   * - Contains exactly one matching row
   * - All field values match expected authoritative data
   * - Coordinate values are within acceptable tolerance (1e-5)
   */
  test('TCM-120520', 'Validate SmartyStreets address verification data', async () => {
    // Verify query returned rows
    expect(rowCount, `No rows returned for ADDRESS_UUID='${EXPECTED_ADDRESS_UUID}'. SQL=${executedSql}`).toBeGreaterThan(0);
    
    // Verify exactly one row returned
    expect(rowCount, `Expected exactly 1 row but got ${rowCount} rows for ADDRESS_UUID='${EXPECTED_ADDRESS_UUID}'`).toBe(1);
    
    // Verify addressData was populated
    expect(addressData, 'Address data was not retrieved from database').not.toBeNull();
    
    if (!addressData) return; // TypeScript guard

    // Validate ADDRESS_UUID
    await test.step('Validate ADDRESS_UUID', async () => {
      expect(
        addressData!.addressUuid,
        `ADDRESS_UUID mismatch: expected '${EXPECTED_ADDRESS_UUID}' but got '${addressData!.addressUuid}'`
      ).toBe(EXPECTED_ADDRESS_UUID);
      console.log(`✓ ADDRESS_UUID validated: ${addressData!.addressUuid}`);
    });

    // Validate MUNICIPALITY
    await test.step('Validate MUNICIPALITY', async () => {
      expect(
        addressData!.municipality,
        `MUNICIPALITY mismatch: expected '${EXPECTED_MUNICIPALITY}' but got '${addressData!.municipality}'`
      ).toBe(EXPECTED_MUNICIPALITY);
      console.log(`✓ MUNICIPALITY validated: ${addressData!.municipality}`);
    });

    // Validate STATE_PROVINCE_ABBREV
    await test.step('Validate STATE_PROVINCE_ABBREV', async () => {
      expect(
        addressData!.stateProvinceAbbrev,
        `STATE_PROVINCE_ABBREV mismatch: expected '${EXPECTED_STATE_PROVINCE_ABBREV}' but got '${addressData!.stateProvinceAbbrev}'`
      ).toBe(EXPECTED_STATE_PROVINCE_ABBREV);
      console.log(`✓ STATE_PROVINCE_ABBREV validated: ${addressData!.stateProvinceAbbrev}`);
    });

    // Validate COUNTY
    await test.step('Validate COUNTY', async () => {
      expect(
        addressData!.county,
        `COUNTY mismatch: expected '${EXPECTED_COUNTY}' but got '${addressData!.county}'`
      ).toBe(EXPECTED_COUNTY);
      console.log(`✓ COUNTY validated: ${addressData!.county}`);
    });

    // Validate POSTAL_CODE
    await test.step('Validate POSTAL_CODE', async () => {
      expect(
        addressData!.postalCode,
        `POSTAL_CODE mismatch: expected '${EXPECTED_POSTAL_CODE}' but got '${addressData!.postalCode}'`
      ).toBe(EXPECTED_POSTAL_CODE);
      console.log(`✓ POSTAL_CODE validated: ${addressData!.postalCode}`);
    });

    // Validate COUNTY_CODE
    await test.step('Validate COUNTY_CODE', async () => {
      expect(
        addressData!.countyCode,
        `COUNTY_CODE mismatch: expected '${EXPECTED_COUNTY_CODE}' but got '${addressData!.countyCode}'`
      ).toBe(EXPECTED_COUNTY_CODE);
      console.log(`✓ COUNTY_CODE validated: ${addressData!.countyCode}`);
    });

    // Validate ADDRESS_VERIFIED_FLAG
    await test.step('Validate ADDRESS_VERIFIED_FLAG', async () => {
      expect(
        addressData!.addressVerifiedFlag,
        `ADDRESS_VERIFIED_FLAG mismatch: expected '${EXPECTED_ADDRESS_VERIFIED_FLAG}' but got '${addressData!.addressVerifiedFlag}'`
      ).toBe(EXPECTED_ADDRESS_VERIFIED_FLAG);
      console.log(`✓ ADDRESS_VERIFIED_FLAG validated: ${addressData!.addressVerifiedFlag}`);
    });

    // Validate XCOORD (longitude) - within tolerance
    await test.step('Validate XCOORD (longitude)', async () => {
      const xcoordDiff = Math.abs(addressData!.xcoord - EXPECTED_XCOORD);
      expect(
        xcoordDiff,
        `XCOORD (longitude) outside tolerance: expected ${EXPECTED_XCOORD} (±${COORDINATE_TOLERANCE}) but got ${addressData!.xcoord}, diff=${xcoordDiff}`
      ).toBeLessThanOrEqual(COORDINATE_TOLERANCE);
      console.log(`✓ XCOORD validated: ${addressData!.xcoord} (expected: ${EXPECTED_XCOORD}, diff: ${xcoordDiff})`);
    });

    // Validate YCOORD (latitude) - within tolerance
    await test.step('Validate YCOORD (latitude)', async () => {
      const ycoordDiff = Math.abs(addressData!.ycoord - EXPECTED_YCOORD);
      expect(
        ycoordDiff,
        `YCOORD (latitude) outside tolerance: expected ${EXPECTED_YCOORD} (±${COORDINATE_TOLERANCE}) but got ${addressData!.ycoord}, diff=${ycoordDiff}`
      ).toBeLessThanOrEqual(COORDINATE_TOLERANCE);
      console.log(`✓ YCOORD validated: ${addressData!.ycoord} (expected: ${EXPECTED_YCOORD}, diff: ${ycoordDiff})`);
    });

    console.log(`\n========================================`);
    console.log(`SmartyStreets Address Data Validation PASSED`);
    console.log(`ADDRESS_UUID: ${EXPECTED_ADDRESS_UUID}`);
    console.log(`All field values match expected authoritative data`);
    console.log(`Coordinate values within tolerance (${COORDINATE_TOLERANCE})`);
    console.log(`========================================\n`);
  });
});
