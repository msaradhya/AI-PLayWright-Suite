/**
 * Validation Test Utilities
 * Common utilities for data validation tests
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
import { Page, expect } from '@playwright/test';

export interface ValidationResult {
    passed: boolean;
    message: string;
    expected?: any;
    actual?: any;
    details?: string;
}

export interface DataComparisonResult {
    matches: boolean;
    differences: Array<{
        field: string;
        expected: any;
        actual: any;
    }>;
}

export interface ChartValidationResult {
    valid: boolean;
    chartType: string;
    dataPoints: number;
    errors: string[];
}

/**
 * Validation Test Utilities class
 * Provides common validation methods for test assertions
 */
export class ValidationTestUtils {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Validate that a number is within a percentage tolerance
     * @param actual Actual value
     * @param expected Expected value
     * @param tolerancePercent Tolerance percentage (default 5%)
     * @returns Validation result
     */
    static validateWithinTolerance(
        actual: number,
        expected: number,
        tolerancePercent: number = 5
    ): ValidationResult {
        const tolerance = expected * (tolerancePercent / 100);
        const lowerBound = expected - tolerance;
        const upperBound = expected + tolerance;
        const passed = actual >= lowerBound && actual <= upperBound;

        return {
            passed,
            message: passed
                ? `Value ${actual} is within ${tolerancePercent}% of ${expected}`
                : `Value ${actual} is NOT within ${tolerancePercent}% of ${expected} (range: ${lowerBound} - ${upperBound})`,
            expected,
            actual,
            details: `Tolerance: ±${tolerancePercent}%, Range: [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`
        };
    }

    /**
     * Validate that two arrays contain the same elements (order independent)
     * @param actual Actual array
     * @param expected Expected array
     * @returns Validation result
     */
    static validateArraysEqual<T>(actual: T[], expected: T[]): ValidationResult {
        const actualSet = new Set(actual);
        const expectedSet = new Set(expected);
        
        const missing = expected.filter(item => !actualSet.has(item));
        const extra = actual.filter(item => !expectedSet.has(item));
        
        const passed = missing.length === 0 && extra.length === 0;

        return {
            passed,
            message: passed
                ? 'Arrays contain the same elements'
                : `Arrays differ - Missing: [${missing.join(', ')}], Extra: [${extra.join(', ')}]`,
            expected,
            actual,
            details: `Expected count: ${expected.length}, Actual count: ${actual.length}`
        };
    }

    /**
     * Validate that a string matches a pattern
     * @param value Value to validate
     * @param pattern Regular expression pattern
     * @returns Validation result
     */
    static validatePattern(value: string, pattern: RegExp): ValidationResult {
        const passed = pattern.test(value);

        return {
            passed,
            message: passed
                ? `Value "${value}" matches pattern ${pattern}`
                : `Value "${value}" does NOT match pattern ${pattern}`,
            expected: pattern.toString(),
            actual: value
        };
    }

    /**
     * Validate that a date is within a range
     * @param date Date to validate
     * @param startDate Start of range
     * @param endDate End of range
     * @returns Validation result
     */
    static validateDateInRange(
        date: Date,
        startDate: Date,
        endDate: Date
    ): ValidationResult {
        const passed = date >= startDate && date <= endDate;

        return {
            passed,
            message: passed
                ? `Date ${date.toISOString()} is within range`
                : `Date ${date.toISOString()} is NOT within range [${startDate.toISOString()}, ${endDate.toISOString()}]`,
            expected: `[${startDate.toISOString()}, ${endDate.toISOString()}]`,
            actual: date.toISOString()
        };
    }

    /**
     * Compare two data objects and identify differences
     * @param actual Actual data object
     * @param expected Expected data object
     * @param fieldsToCompare Fields to compare (optional, compares all if not specified)
     * @returns Data comparison result
     */
    static compareData(
        actual: Record<string, any>,
        expected: Record<string, any>,
        fieldsToCompare?: string[]
    ): DataComparisonResult {
        const fields = fieldsToCompare || Object.keys(expected);
        const differences: Array<{ field: string; expected: any; actual: any }> = [];

        for (const field of fields) {
            const actualValue = actual[field];
            const expectedValue = expected[field];

            if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
                differences.push({
                    field,
                    expected: expectedValue,
                    actual: actualValue
                });
            }
        }

        return {
            matches: differences.length === 0,
            differences
        };
    }

    /**
     * Validate chart data on the page
     * @param chartSelector CSS selector for the chart container
     * @returns Chart validation result
     */
    async validateChartData(chartSelector: string): Promise<ChartValidationResult> {
        const errors: string[] = [];
        let chartType = 'unknown';
        let dataPoints = 0;

        try {
            const chartElement = await this.page.locator(chartSelector);
            await expect(chartElement).toBeVisible();

            // Detect chart type
            if (await chartElement.locator('[class*="bar"]').count() > 0) {
                chartType = 'bar';
            } else if (await chartElement.locator('[class*="line"]').count() > 0) {
                chartType = 'line';
            } else if (await chartElement.locator('[class*="pie"]').count() > 0) {
                chartType = 'pie';
            } else if (await chartElement.locator('[class*="donut"]').count() > 0) {
                chartType = 'donut';
            }

            // Count data points
            const dataPointElements = await chartElement.locator('[class*="data-point"], [class*="bar-segment"], path').all();
            dataPoints = dataPointElements.length;

            if (dataPoints === 0) {
                errors.push('No data points found in chart');
            }

        } catch (error) {
            errors.push(`Chart validation error: ${error}`);
        }

        return {
            valid: errors.length === 0,
            chartType,
            dataPoints,
            errors
        };
    }

    /**
     * Validate table data
     * @param tableSelector CSS selector for the table
     * @param expectedRowCount Expected number of rows (optional)
     * @param expectedColumns Expected column headers (optional)
     * @returns Validation result
     */
    async validateTableData(
        tableSelector: string,
        expectedRowCount?: number,
        expectedColumns?: string[]
    ): Promise<ValidationResult> {
        try {
            const table = await this.page.locator(tableSelector);
            await expect(table).toBeVisible();

            // Get actual row count
            const rows = await table.locator('tbody tr').all();
            const actualRowCount = rows.length;

            // Get actual column headers
            const headerCells = await table.locator('thead th, thead td').all();
            const actualColumns: string[] = [];
            for (const cell of headerCells) {
                const text = await cell.textContent();
                if (text) {
                    actualColumns.push(text.trim());
                }
            }

            // Validate row count
            if (expectedRowCount !== undefined && actualRowCount !== expectedRowCount) {
                return {
                    passed: false,
                    message: `Row count mismatch`,
                    expected: expectedRowCount,
                    actual: actualRowCount
                };
            }

            // Validate columns
            if (expectedColumns !== undefined) {
                const columnsResult = ValidationTestUtils.validateArraysEqual(actualColumns, expectedColumns);
                if (!columnsResult.passed) {
                    return {
                        passed: false,
                        message: `Column mismatch: ${columnsResult.message}`,
                        expected: expectedColumns,
                        actual: actualColumns
                    };
                }
            }

            return {
                passed: true,
                message: 'Table validation passed',
                details: `Rows: ${actualRowCount}, Columns: ${actualColumns.join(', ')}`
            };

        } catch (error) {
            return {
                passed: false,
                message: `Table validation error: ${error}`,
                details: tableSelector
            };
        }
    }

    /**
     * Validate filter options
     * @param filterSelector CSS selector for the filter dropdown
     * @param expectedOptions Expected filter options
     * @returns Validation result
     */
    async validateFilterOptions(
        filterSelector: string,
        expectedOptions: string[]
    ): Promise<ValidationResult> {
        try {
            const filter = await this.page.locator(filterSelector);
            await filter.click();
            
            // Wait for dropdown to open
            await this.page.waitForTimeout(500);

            // Get actual options
            const options = await this.page.locator(`${filterSelector} option, [role="option"]`).all();
            const actualOptions: string[] = [];
            for (const option of options) {
                const text = await option.textContent();
                if (text) {
                    actualOptions.push(text.trim());
                }
            }

            return ValidationTestUtils.validateArraysEqual(actualOptions, expectedOptions);

        } catch (error) {
            return {
                passed: false,
                message: `Filter validation error: ${error}`,
                details: filterSelector
            };
        }
    }

    /**
     * Validate numeric value format
     * @param value Value to validate
     * @param format Expected format ('integer', 'decimal', 'percentage', 'currency')
     * @returns Validation result
     */
    static validateNumericFormat(value: string, format: 'integer' | 'decimal' | 'percentage' | 'currency'): ValidationResult {
        const patterns: Record<string, RegExp> = {
            integer: /^-?\d+$/,
            decimal: /^-?\d+\.?\d*$/,
            percentage: /^-?\d+\.?\d*%$/,
            currency: /^\$?-?\d{1,3}(,\d{3})*\.?\d*$/
        };

        const pattern = patterns[format];
        const passed = pattern.test(value.trim());

        return {
            passed,
            message: passed
                ? `Value "${value}" matches ${format} format`
                : `Value "${value}" does NOT match ${format} format`,
            expected: format,
            actual: value
        };
    }

    /**
     * Assert all validation results pass
     * @param results Array of validation results
     * @throws Error if any validation fails
     */
    static assertAllPassed(results: ValidationResult[]): void {
        const failures = results.filter(r => !r.passed);
        if (failures.length > 0) {
            const messages = failures.map(f => f.message).join('\n');
            throw new Error(`Validation failures:\n${messages}`);
        }
    }
}