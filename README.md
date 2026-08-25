# PW Hoonuit Test Suite

> **Enterprise-grade Playwright Test Automation Framework for AI & Hoonuit**

[![Playwright](https://img.shields.io/badge/Playwright-v1.57.0-green.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen.svg)](https://nodejs.org/)
[![ConfigManager](https://img.shields.io/badge/ConfigManager-Centralized-orange.svg)](#-configuration)

A comprehensive, scalable test automation framework for Hoonuit Integration built with Playwright, TypeScript, and industry best practices based on **Modular Scalable Architecture (MSA)** with **Centralized Configuration Management**.

---

## 📑 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Writing Tests](#-writing-tests)
- [Running Tests](#-running-tests)
- [Reporting](#-reporting)
- [API Testing](#-api-testing)
- [Database Integration](#-database-integration)
- [CI/CD Integration](#-cicd-integration)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| 🏗️ **MSA Architecture** | Modular, scalable architecture based on industry best practices |
| ⚙️ **ConfigManager** | **NEW** - Centralized configuration singleton for all settings |
| 🔐 **Global Authentication** | Single sign-on setup with reusable state across all tests |
| 🌍 **Multi-Environment** | Easy switching between Bronze, Silver, AWS, and Portal environments |
| 📊 **Comprehensive Reporting** | HTML reports, Slack notifications, Jira integration |
| 🎯 **Type-Safe** | Full TypeScript support with strict typing |
| 🔄 **Auto-Retry** | Configurable retry logic for flaky tests |
| 🎭 **Page Object Model** | Maintainable test structure with 290+ page objects |
| 🛠️ **Rich Utilities** | Helper functions for common operations |
| 📝 **Extensive Docs** | Complete guides for setup, testing, and troubleshooting |
| 🚀 **CI/CD Ready** | GitHub Actions and Jenkins integration support |

### Testing Modules

| Module | Description | Page Objects |
|--------|-------------|--------------|
| **Essentials** | Core dashboard functionality | 59 files |
| **Talent** | Talent management | 44 files |
| **Classroom** | Classroom management | 22 files |
| **Risk Analysis** | Risk analysis tools | 16 files |
| **Interventions** | Student interventions | 7 files |
| **Assessments** | Assessment dashboard | 7 files |
| **Student Profile** | Student profiles | 11 files |
| **MTSS** | Multi-Tiered System of Supports | 67+ files |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: Latest version

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PW_AI_hoonuit_suite

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Configuration

```bash
# Create environment file
cp .env.example .env.development

# Edit with your credentials
nano .env.development
```

**Minimum required variables**:
```bash
# Test Environment
TEST_ENV=auto_aws_bronze
TEST_MODULE=hoonuit_sis
NODE_ENV=development

# Credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password

# Browser Settings
HEADLESS=false
```

### Run Your First Test

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm test -- --headed

# Run specific test
npm test testSpec/login.spec.ts

# View test report
npx playwright show-report
```

---

## 📁 Project Structure

```
PW_AI_hoonuit_suite/
│
├── 📁 core/                              # Core framework
│   └── framework/
│       ├── globalSetup.ts                # Pre-test authentication
│       ├── globalTeardown.ts             # Post-test reporting
│       └── helpers/
│           └── PSWindow.ts               # Window utilities
│
├── 📁 config/                            # Configuration
│   └── ConfigManager.ts                  # ⭐ SINGLE SOURCE OF TRUTH
│
├── 📄 .env.auto_aws_bronze               # AWS Bronze environment
├── 📄 .env.auto_bronze                   # Azure Bronze environment
├── 📄 .env.auto_silver                   # Silver/QA environment
├── 📄 .env.example                       # Environment template
│
├── 📁 utils/                             # Utilities
│   ├── urlUtils.ts                       # URL management
│   ├── moduleUtils.ts                    # Module utilities
│   ├── browserUtils.ts                   # Browser configuration
│   ├── waitForHelpers.ts                 # Wait strategies
│   └── databaseUtils.ts                  # Database helpers
│
├── 📁 shared/                            # Shared components
│   ├── exceptions/                       # Custom exceptions
│   ├── helpers/                          # Helper classes
│   ├── api/                              # API testing
│   ├── users/                            # User management
│   └── pages/                            # Page Objects (290+ files)
│       ├── base/                         # Base components
│       ├── loginPage/                    # Login pages
│       ├── essentials/                   # Essentials module
│       ├── classroom/                    # Classroom module
│       ├── interventions/                # Interventions
│       ├── riskAnalysis/                 # Risk Analysis
│       ├── talent/                       # Talent module
│       └── ...                           # 20+ modules
│
├── 📁 types/                             # TypeScript types (75+ files)
│   ├── common-types.ts
│   ├── navigation-enums.ts
│   └── ...
│
├── 📁 testSpec/                          # Test specifications
│   ├── login.spec.ts
│   ├── integration_setup_tests/
│   ├── integration_validation_tests/
│   └── overall_core_tests/
│
├── 📁 mtss/                              # MTSS module
│   └── shared/                           # MTSS components
│
├── 📁 docs/                              # Documentation
├── 📁 reports/                           # Test reports
├── 📁 playwright-state/                  # Auth state storage
│
├── playwright.config.ts                  # Playwright config
├── tsconfig.json                         # TypeScript config
└── package.json                          # Dependencies
```

For detailed architecture, see [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md).

---

## ⚙️ Configuration

### ConfigManager (Single Source of Truth) ⭐

The framework uses a **centralized ConfigManager** singleton that provides all configuration:

```typescript
import { ConfigManager } from './config/ConfigManager';

const config = ConfigManager.getInstance();

// Get URLs
const baseUrl = config.getBaseUrl();
const maintenanceUrl = config.getMaintenanceUrl();

// Get credentials
const adminCreds = config.getAdminCredentials();
const teacherCreds = config.getTeacherCredentials();

// Get specific user
const user = config.getUserCredentials('etlAdmin_User1');

// Get browser configuration
const browserConfig = config.getBrowserConfig();

// Get feature flags
const flags = config.getFeatureFlags();

// Debug configuration
config.printConfig();
```

### Environment Files

The framework supports multiple environments via `.env.{TEST_ENV}` files:

| File | Environment | Description |
|------|-------------|-------------|
| `.env.auto_aws_bronze` | AWS Bronze | **Default** environment |
| `.env.auto_bronze` | Bronze | Azure Bronze environment |
| `.env.auto_silver` | Silver | QA/Silver environment |
| `.env` | Base | Fallback values |

### Environment Variables

```bash
# Test Environment
TEST_ENV=auto_aws_bronze       # Target environment (determines .env file)
TEST_MODULE=hoonuit_sis        # Module to test

# URL Overrides (optional - defaults exist in ConfigManager)
BASE_URL=https://sisgoldps5mig01.hoonuit.com/Dashboard/
MAINTENANCE_URL=https://sisgoldps5mig01.hoonuit.com/Dashboard/login/login.jsp

# Browser Configuration
HEADLESS=true                  # Run headless
BROWSER_TYPE=chromium          # Browser type (chromium, firefox, webkit)

# Credential Overrides (optional - defaults exist in ConfigManager)
SIS_ETL_ADMIN_USER1_USERNAME=sisEtlAdmin1
SIS_ETL_ADMIN_USER1_PASSWORD=PSAutomation!
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=SecurePassword123!

# Feature Flags
ENABLE_ANGULAR_WAIT=true
ENABLE_SPINNER_WAIT=true
DEFAULT_TIMEOUT=30000

# Reporting (Optional)
SLACK_ENABLED=false
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
JIRA_ENABLED=false
JIRA_SERVER=https://your-jira.atlassian.net
JIRA_API_TOKEN=your_token
```

### Configuration Priority

```
1. Environment Variables (process.env.*)     [HIGHEST]
2. .env.{TEST_ENV} File
3. .env Base File
4. ConfigManager Defaults                    [LOWEST]
```

### Switching Environments

```bash
# Use AWS Bronze (default)
export TEST_ENV=auto_aws_bronze
npm test

# Use Azure Bronze
export TEST_ENV=auto_bronze
npm test

# Use Silver/QA
export TEST_ENV=auto_silver
npm test
```

### Supported Environments

| Environment | Base URL | Description |
|-------------|----------|-------------|
| `auto_aws_bronze` | `sisgoldps5mig01.hoonuit.com` | AWS Bronze (default) |
| `auto_bronze` | `sisgoldps5-dev.hoonuit.com` | Azure Bronze |
| `auto_silver` | `sisgoldqa1-qa.hoonuit.com` | QA/Silver |
| `auto_portal_dev` | `portaldev1.hoonuit.com` | Portal Dev |
| `auto_bronze_portal` | `portaldev1.hoonuit.com` | Portal Bronze |

### Default Users

| User Key | Username | Role |
|----------|----------|------|
| `adminUser` | `sisEtlAdmin1` | Admin |
| `teacherUser` | `sisEtlTeacher1` | Teacher |
| `etlAdmin_User1` | `sisEtlAdmin1` | SIS ETL Admin |
| `etlAdmin_User2` | `sisEtlAdmin2` | SIS ETL Admin |
| `etlTeacher_User1` | `sisEtlTeacher1` | SIS ETL Teacher |

---

## 🧪 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { HoonuitHelper } from '../shared/helpers/HoonuitHelper';

test.describe('Dashboard Tests', () => {
  test('should display dashboard correctly', async ({ page }) => {
    // Page is already authenticated via storageState
    await page.goto('/');
    
    await HoonuitHelper.selectDashboard(page, 'Essentials', 'Attendance');
    
    await expect(page.locator('.dashboard-title')).toBeVisible();
  });
});
```

### Using Page Objects

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../shared/pages/loginPage/LoginPage';
import { AttendancePage } from '../shared/pages/essentials/AttendancePage';

test('should navigate to attendance', async ({ page }) => {
  const attendancePage = new AttendancePage(page);
  
  await attendancePage.goto();
  await attendancePage.selectSchoolYear('2023-2024');
  
  const totalCount = await attendancePage.getTotalStudentCount();
  expect(totalCount).toBeGreaterThan(0);
});
```

### Using Wait Helpers

```typescript
import { test } from '@playwright/test';
import { WaitForHelpers } from '../utils/waitForHelpers';

test('should wait for page load', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Wait for Angular + Spinner + Network
  await WaitForHelpers.waitForPageToLoad(page);
  
  // Wait for specific element
  await WaitForHelpers.waitForElementVisible(page, '.dashboard-content');
});
```

### Test Tags

```typescript
// Smoke test
test('should login @smoke', async ({ page }) => { });

// Regression test
test('should validate data @regression', async ({ page }) => { });

// Integration test
test('should sync with SIS @integration', async ({ page }) => { });
```

---

## ▶️ Running Tests

### Test Suites

The framework includes pre-configured test suites for running tests as groups:

| Suite | Command | Description |
|-------|---------|-------------|
| **Integration Setup** | `npm run test:setup-suite` | 6 setup tests |
| **Integration Validation** | `npm run test:validation-suite` | 16 validation tests |
| **Full Suite** | `npm run test:full-suite` | All tests (Setup + Validation) |

#### Integration Setup Suite (6 tests)
- `hoonuit-admin-digital-learning-dashboard-setup.spec.ts`
- `hoonuit-da-validates-academics-dashboard-setup.spec.ts`
- `hoonuit-incident-behavior-action-setup.spec.ts`
- `hoonuit-student-enrollment-to-course-setup.spec.ts`
- `hoonuit-teacher-digital-learning-dashboard-setup.spec.ts`
- `teacher-workflows.spec.ts`

#### Integration Validation Suite (16 tests)
- `db-connection-test.spec.ts`
- `hoonuit-admin-digital-learning-dashboard.spec.ts`
- `hoonuit-attendance-data-validation-admin-user.spec.ts`
- `hoonuit-attendance-data-validation-teacher-user.spec.ts`
- `hoonuit-da-validates-academics-dashboard.spec.ts`
- `hoonuit-incident-behavior-action-validation.spec.ts`
- `hoonuit-new-attendance-data.spec.ts`
- `hoonuit-student-enrollment-to-course.spec.ts`
- `hoonuit-teacher-digital-learning-dashboard.spec.ts`
- `hoonuit-withdrawn-data-validation-admin.spec.ts`
- `list-db-tables.spec.ts`
- `search-test-data.spec.ts`
- `validate-file-based-nightly-etl-status.spec.ts`
- `validate-overall-ssp-etl-status.spec.ts`
- `validate-successful-status-for-v2-enabled-build.spec.ts`
- `validation-of-smartystreets-address-data.spec.ts`

### NPM Scripts

```bash
# Run all tests (default)
npm test

# Run on Chrome browser
npm run test:chrome

# Run Integration Setup Suite (6 tests)
npm run test:setup-suite

# Run Integration Validation Suite (16 tests)
npm run test:validation-suite

# Run Full Suite (all tests)
npm run test:full-suite

# Run in headed mode (see browser)
npm run test:headed

# Run with debug mode
npm run test:debug

# Run with UI mode (interactive)
npm run test:ui

# View HTML report
npm run report

# Install Playwright browsers
npm run install:browsers
```

### Common Commands

```bash
# Run all tests
npm test

# Run in headed mode
npm test -- --headed

# Run with debug mode
npm test -- --debug

# Run with UI mode (interactive)
npx playwright test --ui

# Run specific test file
npm test testSpec/login.spec.ts

# Run tests matching pattern
npm test -- --grep "attendance"

# Run tagged tests
npm test -- --grep "@smoke"

# Run in specific browser
npm test -- --project=chromium
npm test -- --project=firefox

# Run with parallel workers
npm test -- --workers=4

# Run with retries
npm test -- --retries=2
```

### Environment-Specific Runs

```bash
# Run on development
NODE_ENV=development npm test

# Run on AWS Bronze
NODE_ENV=auto_aws_bronze npm test

# Run on Silver
NODE_ENV=auto_silver npm test
```

### Test Output

```
Running 25 tests using 4 workers

  ✓ 1 [chromium] › login.spec.ts:10:5 › should login successfully (3.2s)
  ✓ 2 [chromium] › dashboard.spec.ts:15:5 › should display dashboard (1.8s)
  ✓ 3 [chromium] › attendance.spec.ts:20:5 › should show attendance data (2.1s)
  ...

  25 passed (1m 15s)
```

---

## 📊 Reporting

### HTML Reports

Generated automatically in `reports/html-report/`:

```bash
# View HTML report
npx playwright show-report

# Or open manually
open reports/html-report/index.html
```

### Report Types

| Report | File | Format |
|--------|------|--------|
| HTML Report | `reports/html-report/` | Interactive HTML |
| JSON Report | `reports/test-results.json` | JSON |
| JUnit Report | `reports/junit.xml` | XML |

### Slack Integration

```bash
# Enable in .env
SLACK_ENABLED=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Jira Integration

```bash
# Enable in .env
JIRA_ENABLED=true
JIRA_SERVER=https://your-company.atlassian.net
JIRA_API_TOKEN=your_api_token
JIRA_PROJECT_KEY=UIHN
```

---

## 🔌 API Testing

The framework includes comprehensive API testing support.

### Making Authenticated Requests

```typescript
import { HoonuitApiTestUtils } from '../shared/api';

// GET request
const response = await HoonuitApiTestUtils.makeAuthenticatedRequest(
  'GET',
  '/api/students'
);

// POST request with data
const response = await HoonuitApiTestUtils.makeAuthenticatedRequest(
  'POST',
  '/api/students',
  {
    data: { name: 'John Doe', grade: 10 }
  }
);
```

### With Retry Logic

```typescript
const response = await HoonuitApiTestUtils.makeAuthenticatedRequest(
  'GET',
  '/api/students',
  {},
  {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (response) => response.status() >= 500
  }
);
```

### Response Validation

```typescript
import { ApiTestValidation } from '../shared/api';

const validation: ApiTestValidation = {
  statusCode: 200,
  contentType: 'application/json'
};

await HoonuitApiTestUtils.validateResponse(response, validation);
```

See [shared/api/README.md](shared/api/README.md) for complete API documentation.

---

## 🗄️ Database Integration

### SQL Server

```typescript
import { connectToSqlServer, executeQuery } from '../utils/databaseUtils';
import { getDatabaseConfig } from '../config/appConfig';

const connection = await connectToSqlServer(getDatabaseConfig('azure_sql_server'));
const result = await executeQuery(
  connection,
  'SELECT * FROM Students WHERE grade = @grade',
  { grade: 10 }
);
```

### Snowflake

```typescript
import { SnowFlakeDBHelper } from '../shared/helpers/SnowFlakeDBHelper';

const helper = new SnowFlakeDBHelper();
const results = await helper.executeQuery(`
  SELECT student_id, name, grade
  FROM students
  WHERE school_year = '2023-2024'
`);
```

#### Snowflake Private Key Configuration

The `SnowFlakeDBHelper` supports multiple ways to configure the RSA private key for JWT authentication:

| Priority | Method | Environment Variable | Value |
|----------|--------|---------------------|-------|
| 1 | File path | `SNOWFLAKE_PRIVATE_KEY` | Path to `.pem` file (e.g., `./rsa_key.pem`) |
| 2 | Key content | `SNOWFLAKE_PRIVATE_KEY` | Actual PEM key content |
| 3 | Explicit path | `SNOWFLAKE_PRIVATE_KEY_PATH` | Path to `.pem` file |
| 4 | Legacy resource | `SF_KEY_RESOURCE` | Relative path to key file |
| 5 | Default path | (none) | `keys/rsa_key.pem` |

**Recommended Setup (Local Development)**:
```bash
# In .env.auto_aws_bronze
SNOWFLAKE_PRIVATE_KEY=./rsa_key.pem
```

**CI/CD Setup (GitHub Actions)**:
```yaml
env:
  SNOWFLAKE_PRIVATE_KEY: ${{ secrets.SNOWFLAKE_PRIVATE_KEY }}
```

> **Security Note:** The `.gitignore` excludes both `.env.*` files and `*.pem` files, ensuring credentials are never committed.

---

## 🚀 CI/CD Integration

### Required GitHub Secrets

The following secrets must be configured in your GitHub repository settings for CI/CD:

| Secret | Description | Required |
|--------|-------------|----------|
| `ADMIN_USERNAME` | Admin username for test authentication | Yes |
| `ADMIN_PASSWORD` | Admin password for test authentication | Yes |
| `SNOWFLAKE_PRIVATE_KEY` | RSA private key for Snowflake JWT auth (PEM format) | For Snowflake tests |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL | Optional |
| `SLACK_BOT_BEARER_TOKEN` | Slack Bot token for advanced features | Optional |
| `JIRA_API_TOKEN` | Jira API token for issue tracking | Optional |
| `GH_PAT` | GitHub Personal Access Token | Optional |

#### Setting up SNOWFLAKE_PRIVATE_KEY

To set up the Snowflake private key secret:

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `SNOWFLAKE_PRIVATE_KEY`
4. Value: Paste the full PEM file content including headers:
   ```
   -----BEGIN PRIVATE KEY-----
   MIIEvgIBADANBgkqhkiG9w0BAQEFAASC...
   -----END PRIVATE KEY-----
   ```
5. Click **Add secret**

> **Security Note:** Never commit private keys to the repository. The `keys/` directory and `*.pem` files are excluded via `.gitignore`.

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Run tests
        run: npm test
        env:
          ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
          SNOWFLAKE_PRIVATE_KEY: ${{ secrets.SNOWFLAKE_PRIVATE_KEY }}
          TEST_ENV: auto_aws_bronze
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: reports/html-report/
```

### Jenkins Pipeline

```groovy
pipeline {
  agent any
  
  environment {
    ADMIN_USERNAME = credentials('admin-username')
    ADMIN_PASSWORD = credentials('admin-password')
    TEST_ENV = 'auto_aws_bronze'
  }
  
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
  
  post {
    always {
      publishHTML([
        reportDir: 'reports/html-report',
        reportFiles: 'index.html',
        reportName: 'Playwright Report'
      ])
    }
  }
}
```

---

## ✅ Best Practices

### Test Writing

| ✅ Do | ❌ Don't |
|-------|---------|
| Use descriptive test names | Use vague names like "test1" |
| Follow Arrange-Act-Assert pattern | Mix setup and assertions |
| Make tests independent | Create test dependencies |
| Use Page Object Model | Put selectors in tests |
| Clean up test data | Leave test data behind |
| Use wait helpers | Use `waitForTimeout()` |

### Code Organization

| ✅ Do | ❌ Don't |
|-------|---------|
| Keep page objects in `shared/pages/` | Scatter page objects |
| Use helpers for common operations | Duplicate code |
| Add JSDoc comments | Skip documentation |
| Use TypeScript types | Use `any` type |
| Export from index files | Create circular imports |

### Configuration

| ✅ Do | ❌ Don't |
|-------|---------|
| Use environment variables | Hardcode credentials |
| Use `.env.*` files | Commit credentials |
| Use configuration helpers | Access config directly |
| Document configuration changes | Make silent changes |

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Cannot find module** | `rm -rf node_modules && npm install` |
| **Authentication fails** | Check credentials in `.env.*` file |
| **TypeScript errors** | Run `npx tsc --noEmit` |
| **Browser not installed** | `npx playwright install` |
| **Timeout errors** | Increase timeout in config |
| **Element not found** | Check selector, add wait |

### Debug Commands

```bash
# Debug mode with Playwright Inspector
npm test -- --debug

# Headed mode to see browser
npm test -- --headed

# Slow motion (1 second between actions)
npm test -- --headed --slow-mo=1000

# UI mode (interactive)
npx playwright test --ui

# Generate trace
npm test -- --trace on
```

### Viewing Logs

```bash
# View auth failure screenshot
open playwright-state/auth-failure.png

# View test traces
npx playwright show-trace test-results/trace.zip

# Check Snowflake logs
cat snowflake.log
```

### Getting Help

1. Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Review [GitHub Issues](https://github.com/your-repo/issues)
3. Contact the test automation team
4. Check [Playwright docs](https://playwright.dev)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) | Detailed architecture guide |
| [docs/SETUP.md](docs/SETUP.md) | Installation and configuration |
| [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) | How to write and run tests |
| [docs/REPORTING.md](docs/REPORTING.md) | Reporting and integrations |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues and solutions |
| [shared/api/README.md](shared/api/README.md) | API testing documentation |

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch from `main`
2. Follow the existing project structure
3. Use TypeScript with strict typing
4. Write tests for new features
5. Update documentation
6. Create a pull request

### Code Standards

- Use ESLint for linting
- Follow TypeScript best practices
- Use Page Object Model pattern
- Add JSDoc comments for public APIs
- Keep tests independent and isolated

### Commit Messages

```
feat: Add new attendance validation tests
fix: Resolve login timeout issue
docs: Update API documentation
refactor: Simplify wait helper logic
test: Add smoke tests for dashboard
```

---

## 📈 Framework Metrics

| Metric | Count |
|--------|-------|
| Page Objects | 290+ files |
| Type Definitions | 75+ files |
| Helper Classes | 15 files |
| Test Modules | 20+ modules |
| Test Specifications | 25+ files |
| Supported Environments | 7 |

---

## 📄 License

Copyright © PowerSchool. All rights reserved.

---

## 📝 Version History

### Version 2.5.1 (2025-12-02)
- 🔒 **SECURITY**: Enhanced `SnowFlakeDBHelper` private key configuration
  - Support for `SNOWFLAKE_PRIVATE_KEY` as file path or key content (auto-detection)
  - Support for `SNOWFLAKE_PRIVATE_KEY_PATH` explicit path variable
  - Improved error messages showing all checked locations
- 🔧 Changed default Snowflake configuration to use portable relative path `./rsa_key.pem`
- 📚 Updated documentation with Snowflake configuration options

### Version 2.5.0 (2025-12-02)
- ⭐ **NEW**: Test Suite Configuration - Added pre-configured test suite projects
- ⭐ **NEW**: NPM Scripts for Test Suites - `test:setup-suite`, `test:validation-suite`, `test:full-suite`
- ✨ Updated `playwright.config.ts` with 3 suite projects:
  - `integration-setup-suite` (6 tests)
  - `integration-validation-suite` (16 tests)
  - `hoonuit-sis-full-suite` (all tests)
- ✨ Updated `package.json` with test suite scripts
- 📚 Added complete test file listings to documentation

### Version 2.4.0 (2025-12-01)
- 🗑️ **CLEANUP**: Removed legacy config files (appConfig.ts, environments.ts, runtimeSettings.ts, hoonuit_sis.config.json)
- ✨ Migrated all utility files to use ConfigManager exclusively
- ✨ Config folder now contains only ConfigManager.ts (single source of truth)
- 📚 Updated all documentation to reflect clean architecture
- 🔒 All tests continue to pass with centralized configuration

### Version 2.3.0 (2025-12-01)
- ⭐ **NEW**: Centralized ConfigManager - Single source of truth for all configuration
- ⭐ **NEW**: Environment-specific `.env.{TEST_ENV}` files
- ⭐ **NEW**: Typed interfaces for configuration (EnvironmentConfig, UserCredentials, BrowserConfig, FeatureFlags)
- ✨ Updated globalSetup.ts to use ConfigManager
- ✨ Updated playwright.config.ts to use ConfigManager
- ✨ Updated HoonuitLoginPage to use ConfigManager
- ✨ Updated fixtures to expose ConfigManager
- ✨ All configuration tests passing (4/4)
- 📚 Updated documentation with new architecture

### Version 2.1.0 (2025-11-30)
- ✨ Updated documentation with latest implementation
- ✨ Added comprehensive PROJECT_ARCHITECTURE.md
- ✨ Enhanced README with detailed examples
- ✨ Improved API testing documentation

### Version 2.0.0 (2025-11-26)
- ✨ MSA architecture implementation
- ✨ Global authentication setup
- ✨ Enhanced configuration management
- ✨ Comprehensive utility functions
- ✨ Custom exception handling
- ✨ Advanced reporting (Slack, Jira)
- ✨ Complete documentation suite
- ✨ CI/CD integration examples

### Version 1.0.0
- Initial framework setup
- Basic test structure
- Login functionality

---

**Last Updated:** 2025-12-02
**Framework Version:** 2.5.1 (ConfigManager Architecture + Test Suites + Flexible Snowflake Config)
**Maintainer:** Test Automation Team