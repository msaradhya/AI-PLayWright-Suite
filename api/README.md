# Hoonuit API Module

This module provides TypeScript/Playwright equivalents of the Java API helper classes for Hoonuit API testing. It maintains the same patterns and functionality as the original Java implementation while adding enhanced features for Playwright test automation.

## Overview

The API module consists of several key components:

- **HoonuitApiHelper**: Core API helper with request/response specifications
- **HoonuitAuthApiRequest**: OAuth authentication handling
- **HoonuitApiConfig**: Configuration management for different environments
- **HoonuitApiTestUtils**: Enhanced testing utilities with retry logic and validation
- **Exception Handling**: Custom exceptions for API-related errors

## Key Features

### ✅ Complete Java Logic Migration
- All original Java functionality preserved
- Method signatures and behavior maintained
- Same patterns for request/response specifications

### ✅ Enhanced Playwright Support
- Native Playwright API integration
- Async/await patterns
- TypeScript type safety
- Enhanced error handling

### ✅ Advanced Testing Features
- Automatic token caching and refresh
- Configurable retry logic with exponential backoff
- Comprehensive response validation
- JSON path extraction utilities
- Mock response creation

### ✅ Environment Configuration
- Support for multiple test environments
- Configurable timeouts and retry policies
- Environment-specific URL management
- Configuration validation

## Quick Start

```typescript
import { 
  createHoonuitApiClient, 
  validateApiConfiguration,
  HoonuitApiTestUtils 
} from '../shared/api';

// Validate configuration before running tests
validateApiConfiguration();

// Create API client
const apiClient = createHoonuitApiClient();

// Get access token
const token = await apiClient.auth.getAccessToken();

// Make authenticated request
const response = await HoonuitApiTestUtils.makeAuthenticatedRequest(
  'GET',
  '/api/students',
  {},
  HoonuitApiTestUtils.getDefaultRetryPolicy()
);
```

## Core Classes

### HoonuitApiHelper

Provides core API functionality with request/response specifications similar to RestAssured.

```typescript
import { HoonuitApiHelper } from '../shared/api';

// Create request specification
const requestSpec = HoonuitApiHelper.getRequestSpec(
  'Authorization:Bearer token',
  'Content-Type:application/json'
);

// Create response specification
const responseSpec = HoonuitApiHelper.getResponseSpec(200);

// Load and process payload
const helper = new HoonuitApiHelper();
helper.loadPayload('testData.json')
  .replaceInPayload('student_id', '12345')
  .replaceInPayload('school_year', '2023-2024');

const payload = helper.getPayload();
```

### HoonuitAuthApiRequest

Handles OAuth authentication with client credentials flow.

```typescript
import { HoonuitAuthApiRequest } from '../shared/api';

const authRequest = new HoonuitAuthApiRequest();

// Get access token
const token = await authRequest.getAccessToken();

// Get token with custom grant type
const customToken = await authRequest.getAccessTokenWithGrantType(
  'custom_grant',
  { scope: 'read:students' }
);

// Validate token
const isValid = await authRequest.validateAccessToken(token);
```

### HoonuitApiConfig

Manages configuration for different environments.

```typescript
import { HoonuitApiConfig } from '../shared/api';

// Get current environment URLs
const sisApiUrl = HoonuitApiConfig.getSisApiUrl();
const clientId = HoonuitApiConfig.getClientId();

// Get URL with endpoint
const fullUrl = HoonuitApiConfig.getSisApiUrlWithEndpoint('/api/students');

// Get timeout configuration
const timeouts = HoonuitApiConfig.getApiTimeoutConfig();

// Validate configuration
HoonuitApiConfig.validateConfiguration();
```

### HoonuitApiTestUtils

Enhanced testing utilities with advanced features.

```typescript
import { HoonuitApiTestUtils, ApiTestValidation } from '../shared/api';

// Create test context
const context = await HoonuitApiTestUtils.createTestContext('/api/v1');

// Make authenticated request with retry
const response = await HoonuitApiTestUtils.makeAuthenticatedRequest(
  'POST',
  '/students',
  {
    data: { name: 'John Doe', grade: 10 },
    headers: { 'X-Custom-Header': 'value' }
  },
  {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (response) => response.status() >= 500
  }
);

// Validate response
const validation: ApiTestValidation = {
  statusCode: 201,
  contentType: 'application/json',
  headers: { 'x-request-id': 'expected-id' }
};

await HoonuitApiTestUtils.validateResponse(response, validation);

// Extract JSON path
const studentId = await HoonuitApiTestUtils.extractJsonPath(
  response, 
  'data.student.id'
);

// Cleanup
await context.cleanup();
```

## Environment Configuration

The module supports multiple environments configured in `config/appConfig.ts`:

- `auto_bronze`
- `auto_aws_bronze` (default)
- `auto_silver`
- `auto_portal_dev`
- `auto_bronze_portal`
- `bronze_portalcd`
- `auto_aws_bronze_last_release`

Set the environment using the `TEST_ENV` environment variable:

```bash
export TEST_ENV=auto_aws_bronze
```

## Error Handling

The module includes comprehensive error handling with custom exceptions:

```typescript
import { HoonuitApiException } from '../shared/api';

try {
  const token = await authRequest.getAccessToken();
} catch (error) {
  if (error instanceof HoonuitApiException) {
    console.error('API Error:', error.message);
    console.error('Cause:', error.cause);
  }
}
```

## Migration from Java

### Key Differences

1. **Async/Await**: All API calls are asynchronous
2. **Type Safety**: Full TypeScript type definitions
3. **Playwright Integration**: Native Playwright API context usage
4. **Enhanced Features**: Additional testing utilities not available in Java version

### Java to TypeScript Mapping

| Java | TypeScript |
|------|------------|
| `HoonuitApiHelper.getRequestSpec()` | `HoonuitApiHelper.getRequestSpec()` |
| `HoonuitApiHelper.getResponseSpec()` | `HoonuitApiHelper.getResponseSpec()` |
| `new HoonuitAuthApiRequest().getAccessToken()` | `await new HoonuitAuthApiRequest().getAccessToken()` |
| `HoonuitRuntimeConfig.getSISAPIUrl()` | `HoonuitApiConfig.getSisApiUrl()` |

## Best Practices

1. **Use Test Context**: Always use `createTestContext()` for comprehensive test setup
2. **Token Caching**: Leverage automatic token caching in `HoonuitApiTestUtils`
3. **Retry Logic**: Implement retry policies for flaky API endpoints
4. **Configuration Validation**: Validate configuration before running test suites
5. **Cleanup**: Always cleanup API contexts to prevent resource leaks

## Examples

### Basic API Test

```typescript
import { test, expect } from '@playwright/test';
import { HoonuitApiTestUtils } from '../shared/api';

test('should get student list', async () => {
  const response = await HoonuitApiTestUtils.makeAuthenticatedRequest(
    'GET',
    '/api/students'
  );

  expect(response.status()).toBe(200);
  
  const students = await response.json();
  expect(students.data).toBeInstanceOf(Array);
});
```

### Advanced API Test with Validation

```typescript
import { test } from '@playwright/test';
import { HoonuitApiTestUtils, ApiTestValidation } from '../shared/api';

test('should create student with validation', async () => {
  const studentData = {
    firstName: 'John',
    lastName: 'Doe',
    grade: 10
  };

  const response = await HoonuitApiTestUtils.makeAuthenticatedRequest(
    'POST',
    '/api/students',
    { data: studentData }
  );

  const validation: ApiTestValidation = {
    statusCode: 201,
    contentType: 'application/json'
  };

  await HoonuitApiTestUtils.validateResponse(response, validation);

  const studentId = await HoonuitApiTestUtils.extractJsonPath(
    response,
    'data.student.id'
  );

  expect(studentId).toBeDefined();
});
```

## Resources Directory

Place your JSON payload files in the `resources/` directory at the project root. These can be loaded using:

```typescript
const helper = new HoonuitApiHelper();
helper.loadPayload('myPayload.json');
```

## Support

For issues or questions about the API module:
1. Check this README for usage examples
2. Review the inline documentation in each class
3. Consult the original Java implementation for logic clarification

This module provides a robust foundation for API testing with Playwright while maintaining compatibility with the original Java implementation patterns.