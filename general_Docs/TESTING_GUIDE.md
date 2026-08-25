# Testing Guide

## Table of Contents
- [Introduction](#introduction)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Page Objects](#page-objects)
- [Test Organization](#test-organization)
- [Test Data Management](#test-data-management)
- [Debugging Tests](#debugging-tests)
- [Best Practices](#best-practices)

---

## Introduction

This guide covers everything you need to know about writing, running, and maintaining tests in the PW Hoonuit SIS Integration framework.

### Test Framework Stack

- **Playwright Test**: Core testing framework
- **TypeScript**: Programming language
- **Custom Helpers**: Framework-specific utilities
- **Page Object Model**: Design pattern for maintainability

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see the browser)
npm test -- --headed

# Run specific test file
npm test tests/login.spec.ts

# Run tests matching a pattern
npm test -- --grep "login"

# Run tests with specific tag
npm test -- --grep "@smoke"
```

### Advanced Commands

```bash
# Run in debug mode
npm test -- --debug

# Run with UI mode (interactive)
npx playwright test --ui

# Run specific project (browser)
npm test -- --project=chromium
npm test -- --project=firefox
npm test -- --project=webkit

# Run tests in parallel
npm test -- --workers=4

# Run tests with trace
npm test -- --trace on

# Update snapshots
npm test -- --update-snapshots
```

### Environment-Specific Runs

```bash
# Run against development environment
NODE_ENV=development npm test

# Run against AWS Bronze
NODE_ENV=auto_aws_bronze npm test

# Run against Silver
NODE_ENV=auto_silver npm test
```

### Filtering Tests

```bash
# Run only smoke tests
npm test -- --grep "@smoke"

# Run only regression tests
npm test -- --grep "@regression"

# Skip specific tests
npm test -- --grep-invert "@slow"

# Run tests in specific file
npm test tests/authentication/login.spec.ts

# Run tests in directory
npm test tests/authentication/
```

### Viewing Reports

```bash
# Open HTML report
npx playwright show-report

# Open specific report
npx playwright show-report reports/html-report

# Generate report from existing results
npx playwright show-report test-results/
```

---

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should perform expected behavior', async ({ page }) => {
    // Arrange: Setup
    await page.goto('/');
    
    // Act: Perform action
    await page.click('#submitButton');
    
    // Assert: Verify result
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Using Fixtures

```typescript
import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright-state/storageState.json' });

test('should access authenticated page', async ({ page }) => {
  // Already authenticated via storageState
  await page.goto('/dashboard');
  await expect(page).toHaveTitle(/Dashboard/);
});
```

### Test Hooks

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dashboard Tests', () => {
  test.beforeAll(async () => {
    console.log('Setting up test suite');
  });

  test.beforeEach(async ({ page }) => {
    // Navigate before each test
    await page.goto('/dashboard');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Capture screenshot on failure
    if (testInfo.status !== 'passed') {
      await page.screenshot({ 
        path: `screenshots/${testInfo.title}.png` 
      });
    }
  });

  test.afterAll(async () => {
    console.log('Cleaning up test suite');
  });

  test('test 1', async ({ page }) => {
    // Test implementation
  });

  test('test 2', async ({ page }) => {
    // Test implementation
  });
});
```

### Using Helpers

```typescript
import { test, expect } from '@playwright/test';
import { HoonuitHelper } from '../shared/helpers/hoonuitHelper';
import { HoonuitUsers } from '../shared/users/HoonuitUsers';
import { WaitForHelpers } from '../utils/waitForHelpers';

test('should login and select dashboard', async ({ page }) => {
  // Login using helper
  await HoonuitHelper.loginToHoonuitAdministrator(
    page, 
    HoonuitUsers.ADMIN_USER
  );
  
  // Wait for page to load
  await WaitForHelpers.commonWait(page);
  
  // Select dashboard using helper
  await HoonuitHelper.selectDashboard(
    page, 
    'Analytics', 
    'Student Overview'
  );
  
  // Verify navigation
  await expect(page).toHaveURL(/\/dashboard\/student-overview/);
});
```

### Assertions

```typescript
import { test, expect } from '@playwright/test';

test('assertion examples', async ({ page }) => {
  // Visibility assertions
  await expect(page.locator('.element')).toBeVisible();
  await expect(page.locator('.hidden')).toBeHidden();
  
  // Text assertions
  await expect(page.locator('h1')).toHaveText('Welcome');
  await expect(page.locator('p')).toContainText('Hello');
  
  // Attribute assertions
  await expect(page.locator('input')).toHaveAttribute('type', 'text');
  await expect(page.locator('button')).toBeEnabled();
  await expect(page.locator('input')).toBeDisabled();
  
  // Count assertions
  await expect(page.locator('.item')).toHaveCount(5);
  
  // URL assertions
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page).toHaveTitle(/Dashboard/);
  
  // Value assertions
  await expect(page.locator('input')).toHaveValue('test');
  
  // Custom assertions
  const text = await page.locator('.element').textContent();
  expect(text).toBe('Expected Text');
});
```

### Waiting Strategies

```typescript
import { test } from '@playwright/test';
import { WaitForHelpers } from '../utils/waitForHelpers';

test('waiting examples', async ({ page }) => {
  // Wait for Angular to finish
  await WaitForHelpers.waitForAngular(page);
  
  // Wait for spinner to disappear
  await WaitForHelpers.waitForSpinnerToDisappear(page);
  
  // Combined wait (Angular + Spinner)
  await WaitForHelpers.commonWait(page);
  
  // Wait for selector
  await page.waitForSelector('.element', { state: 'visible' });
  
  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  
  // Wait for load state
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for timeout
  await page.waitForTimeout(1000);
  
  // Wait for function
  await page.waitForFunction(() => {
    return document.querySelector('.element') !== null;
  });
});
```

### Error Handling

```typescript
import { test, expect } from '@playwright/test';
import { HoonuitException } from '../shared/exceptions';

test('error handling example', async ({ page }) => {
  try {
    await page.click('.may-not-exist', { timeout: 5000 });
  } catch (error) {
    // Handle expected error
    console.log('Element not found, continuing with alternative flow');
    await page.click('.alternative-element');
  }
  
  // Custom exception
  const element = await page.locator('.required-element').count();
  if (element === 0) {
    throw new HoonuitException('Required element not found');
  }
});
```

---

## Page Objects

### Creating a Page Object

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.usernameInput = page.locator('#fieldUsername');
    this.passwordInput = page.locator('#fieldPassword');
    this.submitButton = page.locator('#btnEnter');
    this.errorMessage = page.locator('.error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForNavigation({ waitUntil: 'networkidle' });
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }
}
```

### Using a Page Object

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HoonuitUsers } from '../shared/users/HoonuitUsers';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login(
    HoonuitUsers.ADMIN_USER.userName,
    HoonuitUsers.ADMIN_USER.password
  );
  
  await expect(page).toHaveURL(/\/dashboard/);
});

test('should show error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('invalid', 'credentials');
  
  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Invalid credentials');
});
```

### Complex Page Object with Components

```typescript
// pages/DashboardPage.ts
import { Page, Locator } from '@playwright/test';

export class DashboardCard {
  constructor(
    private page: Page, 
    private cardTitle: string
  ) {}

  private get card(): Locator {
    return this.page.locator(`[data-card-title="${this.cardTitle}"]`);
  }

  async click(): Promise<void> {
    await this.card.click();
  }

  async isVisible(): Promise<boolean> {
    return await this.card.isVisible();
  }

  async getValue(): Promise<string> {
    return await this.card.locator('.value').textContent() || '';
  }
}

export class DashboardPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  getCard(title: string): DashboardCard {
    return new DashboardCard(this.page, title);
  }

  async selectTab(tabName: string): Promise<void> {
    await this.page.click(`[data-tab="${tabName}"]`);
  }

  async getCardCount(): Promise<number> {
    return await this.page.locator('.dashboard-card').count();
  }
}
```

---

## Test Organization

### Directory Structure

```
tests/
├── unit/                      # Unit tests
│   ├── utils/
│   │   ├── urlUtils.spec.ts
│   │   └── moduleUtils.spec.ts
│   └── helpers/
│       └── hoonuitHelper.spec.ts
│
├── integration/               # Integration tests
│   ├── authentication.spec.ts
│   ├── navigation.spec.ts
│   └── reporting.spec.ts
│
├── e2e/                       # End-to-end tests
│   ├── smoke/                # Critical path tests
│   │   ├── login.spec.ts
│   │   └── dashboard.spec.ts
│   ├── regression/           # Full feature tests
│   │   ├── student-profile.spec.ts
│   │   └── assessment-import.spec.ts
│   └── performance/          # Performance tests
│       └── dashboard-load.spec.ts
│
└── fixtures/                  # Test fixtures
    ├── testData.ts
    └── mockData.ts
```

### Test Tags

```typescript
import { test } from '@playwright/test';

// Smoke test
test('critical login flow @smoke', async ({ page }) => {
  // Test implementation
});

// Regression test
test('detailed student profile @regression', async ({ page }) => {
  // Test implementation
});

// Slow test
test('bulk data import @slow', async ({ page }) => {
  test.slow(); // Triples the timeout
  // Test implementation
});

// Skip test
test.skip('feature under development @wip', async ({ page }) => {
  // Test implementation
});

// Conditional test
test('windows-specific test', async ({ page }) => {
  test.skip(process.platform !== 'win32', 'Windows only');
  // Test implementation
});
```

### Test Suites

```typescript
import { test } from '@playwright/test';

test.describe('Student Profile', () => {
  test.describe('Basic Information', () => {
    test('should display student name', async ({ page }) => {
      // Test implementation
    });

    test('should display student ID', async ({ page }) => {
      // Test implementation
    });
  });

  test.describe('Academic Performance', () => {
    test('should display GPA', async ({ page }) => {
      // Test implementation
    });

    test('should display test scores', async ({ page }) => {
      // Test implementation
    });
  });
});
```

---

## Test Data Management

### Using Test Data Files

```typescript
// fixtures/testData.ts
export const testUsers = {
  admin: {
    userName: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin'
  },
  teacher: {
    userName: 'teacher@test.com',
    password: 'Teacher123!',
    role: 'teacher'
  }
};

export const testStudents = [
  { id: '12345', name: 'John Doe', grade: '10' },
  { id: '67890', name: 'Jane Smith', grade: '11' }
];
```

```typescript
// Using test data in tests
import { test, expect } from '@playwright/test';
import { testStudents } from '../fixtures/testData';

test('should search for student', async ({ page }) => {
  const student = testStudents[0];
  
  await page.fill('#studentSearch', student.name);
  await page.click('#searchButton');
  
  await expect(page.locator('.student-result')).toContainText(student.name);
});
```

### Data-Driven Tests

```typescript
import { test, expect } from '@playwright/test';

const testCases = [
  { grade: '9', expectedCount: 150 },
  { grade: '10', expectedCount: 145 },
  { grade: '11', expectedCount: 140 },
  { grade: '12', expectedCount: 135 }
];

for (const { grade, expectedCount } of testCases) {
  test(`should show ${expectedCount} students for grade ${grade}`, async ({ page }) => {
    await page.selectOption('#gradeFilter', grade);
    
    const count = await page.locator('.student-row').count();
    expect(count).toBe(expectedCount);
  });
}
```

### Environment-Specific Data

```typescript
import { test } from '@playwright/test';
import { getEnvironmentUrls } from '../config/appConfig';

test('should use correct environment data', async ({ page }) => {
  const env = process.env.TEST_ENV || 'auto_aws_bronze';
  const urls = getEnvironmentUrls(env);
  
  await page.goto(urls.url);
  // Test implementation
});
```

---

## Debugging Tests

### Debug Mode

```bash
# Run test in debug mode
npm test -- --debug tests/login.spec.ts

# Debug from specific line
npm test -- --debug tests/login.spec.ts:25
```

### Console Logging

```typescript
import { test } from '@playwright/test';

test('debug example', async ({ page }) => {
  // Log to console
  console.log('Starting test');
  
  // Log page title
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  // Log element count
  const count = await page.locator('.item').count();
  console.log(`Found ${count} items`);
});
```

### Screenshots

```typescript
import { test } from '@playwright/test';

test('screenshot example', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Full page screenshot
  await page.screenshot({ path: 'screenshots/dashboard.png' });
  
  // Element screenshot
  await page.locator('.chart').screenshot({ 
    path: 'screenshots/chart.png' 
  });
  
  // Screenshot on failure (automatic with config)
});
```

### Video Recording

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    video: 'on-first-retry',  // or 'on', 'off', 'retain-on-failure'
  }
});
```

### Trace Viewer

```bash
# Run with trace
npm test -- --trace on

# View trace
npx playwright show-trace trace.zip
```

### Browser Context

```typescript
import { test } from '@playwright/test';

test('inspect context', async ({ page, context }) => {
  // Get all pages in context
  const pages = context.pages();
  console.log(`Open pages: ${pages.length}`);
  
  // Get cookies
  const cookies = await context.cookies();
  console.log('Cookies:', cookies);
  
  // Get storage state
  const state = await context.storageState();
  console.log('Storage:', state);
});
```

---

## Best Practices

### 1. Test Independence

✅ **Do**: Make tests independent
```typescript
test('test 1', async ({ page }) => {
  await page.goto('/dashboard');
  // Test logic
});

test('test 2', async ({ page }) => {
  await page.goto('/dashboard');  // Fresh start
  // Test logic
});
```

❌ **Don't**: Make tests depend on each other
```typescript
let sharedState;

test('test 1', async ({ page }) => {
  sharedState = await page.textContent('.value');
});

test('test 2', async ({ page }) => {
  // Depends on test 1 - BAD!
  expect(sharedState).toBeTruthy();
});
```

### 2. Descriptive Test Names

✅ **Do**: Use descriptive names
```typescript
test('should display error message when login fails with invalid credentials', async ({ page }) => {
  // Test logic
});
```

❌ **Don't**: Use vague names
```typescript
test('test login', async ({ page }) => {
  // Test logic
});
```

### 3. Arrange-Act-Assert Pattern

✅ **Do**: Follow AAA pattern
```typescript
test('should update student grade', async ({ page }) => {
  // Arrange
  await page.goto('/students/12345');
  const originalGrade = await page.textContent('.grade');
  
  // Act
  await page.fill('#gradeInput', 'A');
  await page.click('#saveButton');
  
  // Assert
  await expect(page.locator('.grade')).toHaveText('A');
});
```

### 4. Avoid Hardcoded Waits

✅ **Do**: Use smart waits
```typescript
await page.waitForSelector('.element', { state: 'visible' });
await page.click('.element');
```

❌ **Don't**: Use arbitrary timeouts
```typescript
await page.waitForTimeout(5000);  // Flaky!
await page.click('.element');
```

### 5. Use Data-Testid

✅ **Do**: Use stable selectors
```typescript
await page.click('[data-testid="submit-button"]');
```

❌ **Don't**: Use fragile selectors
```typescript
await page.click('div > div > button.btn.primary.large');
```

### 6. Clean Up Resources

✅ **Do**: Clean up after tests
```typescript
test('database test', async ({ page }) => {
  // Create test data
  const id = await createTestRecord();
  
  try {
    // Test logic
  } finally {
    // Cleanup
    await deleteTestRecord(id);
  }
});
```

### 7. Group Related Tests

✅ **Do**: Group logically
```typescript
test.describe('Student Profile', () => {
  test.describe('Basic Info', () => {
    test('should display name', async ({ page }) => { });
    test('should display ID', async ({ page }) => { });
  });
  
  test.describe('Academic Info', () => {
    test('should display GPA', async ({ page }) => { });
    test('should display courses', async ({ page }) => { });
  });
});
```

### 8. Meaningful Assertions

✅ **Do**: Assert specific values
```typescript
await expect(page.locator('.grade')).toHaveText('A');
await expect(page.locator('.score')).toHaveText('95');
```

❌ **Don't**: Assert only visibility
```typescript
await expect(page.locator('.grade')).toBeVisible();  // Not enough!
```

---

**Last Updated:** 2025-12-01
**Version:** 2.1.0
**Maintainer:** Test Automation Team