# MTSS Exception Handling Framework

## Overview
This directory contains the standardized exception handling framework for MTSS (Multi-Tiered Systems of Support) components, enhanced specifically for Playwright test automation framework support.

## Source Comparison Analysis

### Original Java Implementation
The source Java files provided the following base functionality:
- [`MtssException`](../../../../src/main/java/psqa/hoonuit/shared/mtss/shared/exceptions/MtssException.java) - Base exception with two constructors
- [`MtssPageTimeoutException`](../../../../src/main/java/psqa/hoonuit/shared/mtss/shared/exceptions/MtssPageTimeoutException.java) - Page timeout specific exception
- [`MtssTableException`](../../../../src/main/java/psqa/hoonuit/shared/mtss/shared/exceptions/MtssTableException.java) - Table operation specific exception

### Enhanced TypeScript Implementation

#### Missing Logic Identified and Fixed:
1. **Constructor Overloads**: Child exceptions were missing the cause parameter support
2. **Test Context Support**: No mechanism for test-specific debugging information
3. **Playwright Integration**: No specific support for Playwright test scenarios
4. **Detailed Error Reporting**: Limited error context for debugging test failures

## Exception Classes

### MtssException (Base Class)
Enhanced base exception class with the following improvements:

**New Features:**
- ✅ Test context support for better debugging
- ✅ Timestamp tracking for error occurrence
- ✅ Enhanced stack trace with cause information
- ✅ Static factory method for test context creation
- ✅ Formatted error reporting for test results

**Constructors:**
```typescript
constructor(message: string, cause?: Error, testContext?: string)
```

**Static Methods:**
- `withTestContext(message, testContext, cause?)` - Create exception with test context
- `getTestErrorMessage()` - Get formatted error message for reporting

### MtssPageTimeoutException
Page timeout exception enhanced for Playwright test scenarios:

**New Features:**
- ✅ Timeout duration tracking
- ✅ Selector information storage
- ✅ Page URL context
- ✅ Specialized factory methods for common timeout scenarios

**Factory Methods:**
- `forPlaywright()` - General Playwright timeout with full context
- `forSelector()` - Selector-specific timeout
- `forPageLoad()` - Page load timeout
- `getTimeoutDetails()` - Detailed timeout information for reporting

**Usage Examples:**
```typescript
// Selector timeout
throw MtssPageTimeoutException.forSelector(
  '.my-button', 
  5000, 
  'https://example.com/page',
  'LoginTest'
);

// Page load timeout
throw MtssPageTimeoutException.forPageLoad(
  'https://example.com/dashboard',
  30000,
  'DashboardLoadTest'
);
```

### MtssTableException
Table operation exception enhanced for data validation scenarios:

**New Features:**
- ✅ Table selector tracking
- ✅ Row count validation support
- ✅ Column-specific error context
- ✅ Search criteria tracking
- ✅ Specialized factory methods for common table operations

**Factory Methods:**
- `forRowCountMismatch()` - When expected vs actual row counts don't match
- `forMissingData()` - When expected data is not found in table
- `forColumnNotFound()` - When a required column is missing
- `forEmptyTable()` - When table is empty but data was expected
- `forTableNotFound()` - When table selector doesn't match any elements

**Usage Examples:**
```typescript
// Row count mismatch
throw MtssTableException.forRowCountMismatch(
  10, 5, 
  '.student-table', 
  'StudentListTest'
);

// Missing data
throw MtssTableException.forMissingData(
  'John Doe',
  'Student Name',
  '.student-table',
  'StudentSearchTest'
);
```

## Utility Functions

### MtssExceptionUtils
Centralized utilities for exception handling in tests:

**Methods:**
- `createTestContext()` - Create standardized test context strings
- `extractErrorDetails()` - Extract comprehensive error information
- `formatErrorForConsole()` - Format errors for console output
- `createErrorReport()` - Generate detailed error reports for test results

## Playwright Integration Benefits

### Enhanced Test Debugging
1. **Detailed Context**: Every exception now includes test context, timestamps, and relevant page information
2. **Structured Error Data**: Exceptions provide structured data that can be easily consumed by test reporting tools
3. **Playwright-Specific Information**: Timeouts include selector and page URL information, table exceptions include table structure details

### Improved Test Reporting
1. **Formatted Error Messages**: Consistent error message formatting across all test scenarios
2. **Error Classification**: Clear distinction between timeout, table, and general MTSS errors
3. **Debugging Information**: Rich context information to help developers quickly identify test failure causes

### Usage in Playwright Tests
```typescript
import { 
  MtssPageTimeoutException, 
  MtssTableException,
  MtssExceptionUtils 
} from './exceptions';

// In a Playwright test
try {
  await page.waitForSelector('.data-table', { timeout: 5000 });
} catch (error) {
  throw MtssPageTimeoutException.forSelector(
    '.data-table',
    5000,
    page.url(),
    'DataValidationTest'
  );
}

// Table validation
const rowCount = await page.locator('.data-table tr').count();
if (rowCount !== expectedCount) {
  throw MtssTableException.forRowCountMismatch(
    expectedCount,
    rowCount,
    '.data-table',
    'RowCountValidation',
    page.url()
  );
}
```

## Migration from Java

All original Java functionality has been preserved and enhanced:
- ✅ Base [`MtssException`](./MtssException.ts) with message and cause support
- ✅ [`MtssPageTimeoutException`](./MtssPageTimeoutException.ts) inheritance structure
- ✅ [`MtssTableException`](./MtssTableException.ts) inheritance structure
- ✅ Consistent error handling patterns
- ➕ Enhanced with Playwright-specific features
- ➕ Added comprehensive test context support
- ➕ Improved error reporting and debugging capabilities

## File Structure
```
exceptions/
├── MtssException.ts              # Base exception class
├── MtssPageTimeoutException.ts   # Page timeout exception
├── MtssTableException.ts         # Table operation exception
├── index.ts                      # Centralized exports and utilities
└── README.md                     # This documentation
```

## Best Practices

1. **Always Use Test Context**: Provide meaningful test context when throwing exceptions
2. **Leverage Factory Methods**: Use specialized factory methods for common scenarios
3. **Include Page Context**: When possible, include page URL and relevant selectors
4. **Use Structured Error Reporting**: Utilize the utility functions for consistent error reporting
5. **Preserve Original Error Information**: Always pass through underlying causes when re-throwing exceptions