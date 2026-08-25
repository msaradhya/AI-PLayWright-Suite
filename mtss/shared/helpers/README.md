# MTSS Shared Helpers

This directory contains the TypeScript/Playwright conversion of the Java MTSS helper classes. These helpers provide common functionality for MTSS (Multi-Tiered System of Supports) operations including user management, cleanup operations, API interactions, and page navigation.

## Overview

The helpers have been completely converted from Java/Selenium to TypeScript/Playwright while maintaining full compatibility with the original functionality.

## Helper Classes

### 1. MTSSCleanUp.ts
**Purpose**: Handles cleanup operations for MTSS interventions, plans, and settings.

**Key Features**:
- Delete intervention plans and associated settings
- Clear intervention data (attendance, observations, goals, notes)
- Bulk cleanup operations for test maintenance
- Window management for multi-page operations

**Usage**:
```typescript
import { MTSSCleanUp } from './MTSSCleanUp';

// Delete intervention with all associated data
await MTSSCleanUp.deleteInterventionPlanAndSettings(
  page,
  context,
  'Test Intervention',  // intervention name
  'Test Plan',          // plan name
  'Test Reason',        // reason
  'Level 1',           // level
  'Academic',          // type
  'Reading Strategy'   // strategy
);

// Clear intervention data only (without deletion)
await MTSSCleanUp.clearInterventionData(page, context, 'Test Intervention');
```

### 2. MtssHelper.ts
**Purpose**: Core helper class providing login, navigation, and common utility functions.

**Key Features**:
- Multiple login methods (RTI Admin, Portal Admin, District Admin, Teacher)
- SSO support (Google, Microsoft)
- Utility app navigation
- Dashboard selection
- User menu operations
- Page load waiting with spinner detection

**Usage**:
```typescript
import { MtssHelper } from './MtssHelper';
import { MtssUsers } from '../users/MtssUsers';

// Login as district admin
await MtssHelper.loginToMtssAsDistrictAdmin(page, MtssUsers.district_admin);

// Navigate to utility app
await MtssHelper.selectUtilityApp(page, 'MTSS Interventions');

// Wait for page to load
await MtssHelper.waitForPageToLoad(page);

// Select dashboard
await MtssHelper.selectDashboard(page, 'Overview', 'Enrollment');

// Logout
await MtssHelper.logout(page);
```

### 3. MtssApiHelper.ts
**Purpose**: API-specific functionality for MTSS operations.

**Key Features**:
- Dynamic variable management
- Date operations and formatting
- API request handling with retry logic
- Response validation
- Error parsing
- Pagination support

**Usage**:
```typescript
import { MtssApiHelper } from './MtssApiHelper';

// Get dynamic variables
const dynamicVars = await MtssApiHelper.getMtssAPIDynamicVariableValue(apiContext);

// Get date ranges
const [today, yesterday] = await MtssApiHelper.getCurrentAndPreviousDate('ISO');
const dateRange = await MtssApiHelper.getDateRange(7, 'ISO'); // Last 7 days

// Make API request with retry
const response = await MtssApiHelper.makeApiRequest(
  apiContext,
  '/api/interventions',
  'POST',
  { name: 'Test Intervention' },
  3 // retry attempts
);
```

### 4. MtssUsers.ts
**Purpose**: User credentials and management for different user types.

**Key Features**:
- Predefined user accounts for testing
- User type categorization (admin, teacher, portal, maintenance)
- SSO user identification
- Current user session management
- User validation and cloning

**Available Users**:
```typescript
// Admin users
MtssUsers.district_admin         // 'au1', 'PSAutomation!'
MtssUsers.rti_admin             // 'rti_admin', 'sisgold2020'
MtssUsers.automation_DA_107     // 'automationDA107', 'PSAutomation!'

// Teacher users  
MtssUsers.teacher_user1         // 'oakteacher', 'PSAutomation!'
MtssUsers.teacher_user2         // 'aadams', 'PSAutomation!'

// SSO users
MtssUsers.microsoftAdmin_user1  // 'SSO_maryadmin@pswish.onmicrosoft.com'
MtssUsers.googleDistrictAdminUser // 'SSO_maryadmin@applegrove.me'
```

**Usage**:
```typescript
import { MtssUsers } from '../users/MtssUsers';

// Use predefined users
const adminUser = MtssUsers.district_admin;
const teacherUser = MtssUsers.teacher_user1;

// Set current users for session
MtssUsers.setCurrentAdminUser(adminUser);
MtssUsers.setCurrentTeacherUser(teacherUser);

// Get users by type
const allTeachers = MtssUsers.getTeachers();
const allSSOUsers = MtssUsers.getSSOUsers();

// Find user by username
const user = MtssUsers.findUserByUsername('au1');
```

## Setup and Configuration

### 1. Import the helpers
```typescript
import { 
  MTSSCleanUp, 
  MtssHelper, 
  MtssApiHelper, 
  MtssUsers,
  initializeMtssHelpers,
  configureMtss
} from './index';
```

### 2. Initialize helpers
```typescript
// Initialize all helpers with page context
const helpers = initializeMtssHelpers(page, context);

// Configure MTSS URLs
configureMtss({
  baseUrl: 'https://your-mtss-url.com',
  maintenanceUrl: 'https://your-maintenance-url.com',
  multiTenantMaintenanceUrl: 'https://your-multitenant-url.com'
});
```

### 3. Environment Variables (Optional)
```bash
MTSS_URL=https://your-mtss-url.com
MTSS_MAINTENANCE_URL=https://your-maintenance-url.com  
MTSS_MULTITENANT_URL=https://your-multitenant-url.com
MTSS_API_BASE_URL=https://your-api-url.com
MTSS_ADMIN_USERNAME=your-admin-username
MTSS_ADMIN_PASSWORD=your-admin-password
```

## Playwright Integration

All helpers are designed to work seamlessly with Playwright:

### Page Object Integration
```typescript
// In your page object
import { MtssHelper } from '../helpers/MtssHelper';

export class MyMtssPage extends HoonuitBasePage {
  async navigateToInterventions() {
    await MtssHelper.selectUtilityApp(this.page, 'MTSS Interventions');
    await MtssHelper.waitForPageToLoad(this.page);
  }
}
```

### Test Integration
```typescript
// In your test file
import { test, expect } from '@playwright/test';
import { MTSSCleanUp, MtssHelper, MtssUsers } from '../helpers';

test.describe('MTSS Interventions', () => {
  test.beforeEach(async ({ page, context }) => {
    await MtssHelper.loginToMtssAsDistrictAdmin(page, MtssUsers.district_admin);
  });

  test.afterEach(async ({ page, context }) => {
    // Cleanup test data
    await MTSSCleanUp.clearInterventionData(page, context, 'Test Intervention');
  });
});
```

## Key Differences from Java Version

### 1. Asynchronous Operations
All methods are now `async` and return `Promise<T>`.

### 2. Page Context
All methods require a Playwright `Page` object as the first parameter.

### 3. Modern Selectors
- CSS selectors instead of XPath where possible
- Playwright's built-in waiting mechanisms
- Text-based selectors for better maintainability

### 4. Error Handling
- TypeScript type safety
- Proper error propagation
- Timeout handling with graceful degradation

### 5. Configuration
- Environment variable support
- Runtime configuration methods
- TypeScript interfaces for configuration

## Migration Guide

### From Java to TypeScript
```java
// Java
MTSSCleanUp.deleteInterventionPlanAndSettings("intervention", "plan", "reason", "level", "type", "strategy");
```

```typescript
// TypeScript
await MTSSCleanUp.deleteInterventionPlanAndSettings(page, context, "intervention", "plan", "reason", "level", "type", "strategy");
```

### From Selenium to Playwright
```java
// Java/Selenium
WebDriverRunner.getWebDriver().manage().window().maximize();
```

```typescript
// TypeScript/Playwright
await page.setViewportSize({ width: 1920, height: 1080 });
```

## Best Practices

1. **Always await async operations**
2. **Use proper error handling with try-catch blocks**
3. **Initialize users before using helper methods**
4. **Clean up test data in afterEach hooks**
5. **Use environment variables for configuration**
6. **Leverage TypeScript types for better IDE support**

## Troubleshooting

### Common Issues

1. **"Cannot find name 'Page'"**
   - Ensure `@playwright/test` is imported
   - Check TypeScript configuration

2. **Timeout errors**
   - Increase timeout values in configuration
   - Check network conditions
   - Verify selectors are correct

3. **User authentication issues**
   - Verify user credentials are correct
   - Check if users are properly initialized
   - Ensure cookies are cleared between tests

### Debug Mode
```typescript
// Enable debug logging
process.env.DEBUG = 'pw:api';

// Use Playwright's debug mode
await page.pause(); // Stops execution for debugging
```

## Contributing

When adding new functionality:

1. Follow existing patterns and naming conventions
2. Add comprehensive JSDoc comments
3. Include usage examples
4. Update this README
5. Add appropriate error handling
6. Write unit tests where applicable

## Support

For issues related to the MTSS helpers, please refer to:
- Original Java implementation for business logic reference
- Playwright documentation for technical implementation
- Project-specific documentation for configuration and deployment