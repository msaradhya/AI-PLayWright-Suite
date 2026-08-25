# Reporting Guide

## Table of Contents
- [Overview](#overview)
- [HTML Reports](#html-reports)
- [JSON Reports](#json-reports)
- [Slack Integration](#slack-integration)
- [Jira Integration](#jira-integration)
- [CI/CD Reports](#cicd-reports)
- [Custom Reporting](#custom-reporting)

---

## Overview

The framework provides multiple reporting mechanisms to track test execution results, share insights with stakeholders, and integrate with external tools.

### Available Report Types

1. **HTML Reports**: Interactive, visual test results
2. **JSON Reports**: Structured data for programmatic access
3. **Console Reports**: Real-time test execution output
4. **Slack Notifications**: Team collaboration
5. **Jira Integration**: Test management system updates
6. **CI/CD Artifacts**: GitHub Actions/Jenkins reports

---

## HTML Reports

### Generating HTML Reports

HTML reports are generated automatically after test execution:

```bash
# Run tests (report generated automatically)
npm test

# Open report in browser
npx playwright show-report

# Or manually
open reports/html-report/index.html
```

### Report Configuration

Configure HTML reporting in [`playwright.config.ts`](../playwright.config.ts):

```typescript
export default defineConfig({
  reporter: [
    ['html', { 
      outputFolder: 'reports/html-report',
      open: 'never'  // 'always', 'never', 'on-failure'
    }]
  ]
});
```

### Report Contents

The HTML report includes:

- **Test Summary**: Pass/fail statistics
- **Test Duration**: Execution time per test
- **Test Details**: Step-by-step execution
- **Screenshots**: Visual evidence of failures
- **Videos**: Recordings of test runs
- **Traces**: Detailed execution traces
- **Error Stack Traces**: Detailed error information

### Viewing Reports

```bash
# Open last test report
npx playwright show-report

# Open specific report
npx playwright show-report path/to/report

# Serve report on custom port
npx playwright show-report --port 9000
```

### Screenshots in Reports

Screenshots are automatically captured on failure:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',  // 'on', 'off', 'only-on-failure'
  }
});
```

Manual screenshots:

```typescript
test('capture screenshot', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Full page screenshot
  await page.screenshot({ 
    path: 'screenshots/dashboard.png',
    fullPage: true 
  });
  
  // Element screenshot
  await page.locator('.chart').screenshot({ 
    path: 'screenshots/chart.png' 
  });
});
```

### Videos in Reports

Video recording configuration:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    video: 'on-first-retry',  // 'on', 'off', 'retain-on-failure', 'on-first-retry'
  }
});
```

Videos are automatically attached to HTML reports when tests fail.

---

## JSON Reports

### Generating JSON Reports

JSON reports provide structured data for custom processing:

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['json', { outputFile: 'reports/test-results.json' }]
  ]
});
```

### JSON Report Structure

```json
{
  "config": { ... },
  "suites": [
    {
      "title": "Test Suite Name",
      "file": "tests/example.spec.ts",
      "line": 10,
      "column": 6,
      "specs": [
        {
          "title": "should perform action",
          "ok": true,
          "tests": [
            {
              "timeout": 30000,
              "annotations": [],
              "expectedStatus": "passed",
              "projectName": "chromium",
              "results": [
                {
                  "workerIndex": 0,
                  "status": "passed",
                  "duration": 1234,
                  "errors": [],
                  "stdout": [],
                  "stderr": [],
                  "retry": 0,
                  "startTime": "2025-11-26T12:00:00.000Z",
                  "attachments": []
                }
              ],
              "status": "expected"
            }
          ]
        }
      ]
    }
  ],
  "errors": [],
  "stats": {
    "expected": 10,
    "unexpected": 0,
    "flaky": 0,
    "skipped": 2,
    "duration": 45678
  }
}
```

### Processing JSON Reports

```typescript
import fs from 'fs';

// Read JSON report
const report = JSON.parse(
  fs.readFileSync('reports/test-results.json', 'utf8')
);

// Calculate metrics
const totalTests = report.stats.expected + report.stats.unexpected;
const passRate = (report.stats.expected / totalTests) * 100;

console.log(`Total Tests: ${totalTests}`);
console.log(`Pass Rate: ${passRate.toFixed(2)}%`);
console.log(`Duration: ${report.stats.duration}ms`);

// Extract failed tests
const failedTests = [];
report.suites.forEach(suite => {
  suite.specs.forEach(spec => {
    spec.tests.forEach(test => {
      if (test.status !== 'expected') {
        failedTests.push({
          title: spec.title,
          file: suite.file,
          error: test.results[0]?.errors[0]
        });
      }
    });
  });
});

console.log('Failed Tests:', failedTests);
```

---

## Slack Integration

### Setup

1. **Create Slack Webhook**:
   - Go to https://api.slack.com/apps
   - Create new app or select existing
   - Enable Incoming Webhooks
   - Create webhook for your channel
   - Copy webhook URL

2. **Configure Environment**:
```bash
# .env.development
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_ENABLED=true
SLACK_CHANNEL=#test-results
```

3. **Configure Runtime Settings**:
```typescript
// config/runtimeSettings.ts
slackReport: {
  enabled: process.env.SLACK_ENABLED === 'true',
  webhook_url: process.env.SLACK_WEBHOOK_URL || '',
  channel: process.env.SLACK_CHANNEL || '#test-results',
  notify_on: ['failure', 'success']  // or just ['failure']
}
```

### Slack Message Format

The framework sends formatted messages with:

```
🎭 Test Execution Report
Environment: auto_aws_bronze
Duration: 5m 23s

✅ Passed: 45 tests
❌ Failed: 2 tests
⏭️ Skipped: 3 tests
🔄 Flaky: 1 test

Pass Rate: 95.74%

Failed Tests:
• Student Profile > should display grades
• Dashboard > should load within 3 seconds

View Report: <link>
```

### Custom Slack Notifications

```typescript
import { reportToSlack } from '../utils/reportingUtils';

// Send custom notification
await reportToSlack({
  status: 'passed',
  startTime: new Date(),
  duration: 12345,
  // ... other test result data
});
```

### Notification Triggers

Configure when to send notifications:

```typescript
// config/runtimeSettings.ts
slackReport: {
  notify_on: ['failure'],  // Only failures
  // or
  notify_on: ['failure', 'success'],  // All results
  // or
  notify_on: ['failure', 'flaky'],  // Failures and flaky tests
}
```

---

## Jira Integration

### Setup

1. **Generate Jira API Token**:
   - Go to https://id.atlassian.com/manage/api-tokens
   - Click "Create API token"
   - Copy token

2. **Configure Environment**:
```bash
# .env.development
JIRA_SERVER=https://your-company.atlassian.net
JIRA_API_TOKEN=your_api_token
JIRA_PROJECT_KEY=TEST
JIRA_ENABLED=true
JIRA_USERNAME=your_email@company.com
```

3. **Configure Runtime Settings**:
```typescript
// config/runtimeSettings.ts
jira: {
  enabled: process.env.JIRA_ENABLED === 'true',
  server: process.env.JIRA_SERVER || '',
  username: process.env.JIRA_USERNAME || '',
  api_token: process.env.JIRA_API_TOKEN || '',
  project_key: process.env.JIRA_PROJECT_KEY || 'TEST',
  test_cycle_prefix: 'Automated-',
  auto_create_issues: false
}
```

### Jira Test Execution

The framework can:
- Create test execution cycles
- Update test case status
- Create defect tickets for failures
- Link test results to requirements

### Tagging Tests for Jira

```typescript
import { test } from '@playwright/test';

test('should login successfully @jira:TEST-123', async ({ page }) => {
  // Test implementation
  // Result will be reported to Jira test case TEST-123
});
```

### Creating Defects

Automatic defect creation on test failure:

```typescript
// config/runtimeSettings.ts
jira: {
  auto_create_issues: true,
  issue_type: 'Bug',
  priority: 'High',
  components: ['Automation']
}
```

---

## CI/CD Reports

### GitHub Actions

#### Workflow Configuration

```yaml
# .github/workflows/playwright.yml
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
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
        env:
          TEST_ENV: ${{ secrets.TEST_ENV }}
          ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
      
      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: reports/html-report/
          retention-days: 30
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
          retention-days: 30
```

#### Viewing Reports in GitHub

1. Go to Actions tab
2. Select workflow run
3. Scroll to Artifacts section
4. Download `playwright-report`
5. Extract and open `index.html`

### Jenkins

#### Pipeline Configuration

```groovy
pipeline {
  agent any
  
  environment {
    TEST_ENV = credentials('test-env')
    ADMIN_USERNAME = credentials('admin-username')
    ADMIN_PASSWORD = credentials('admin-password')
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
        reportName: 'Playwright Report',
        keepAll: true
      ])
      
      archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
    }
  }
}
```

---

## Custom Reporting

### Custom Reporter

Create a custom reporter class:

```typescript
// reporters/customReporter.ts
import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting test run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`Starting test: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test: ${test.title} - ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`Test run finished with status: ${result.status}`);
  }
}

export default CustomReporter;
```

### Using Custom Reporter

```typescript
// playwright.config.ts
export default defineConfig({
  reporter: [
    ['./reporters/customReporter.ts'],
    ['html']
  ]
});
```

### Reporting Metrics to External Systems

```typescript
import axios from 'axios';

async function reportMetricsToDatadog(metrics: any) {
  await axios.post('https://api.datadoghq.com/api/v1/series', {
    series: [{
      metric: 'playwright.tests.duration',
      points: [[Date.now(), metrics.duration]],
      type: 'gauge'
    }]
  }, {
    headers: {
      'DD-API-KEY': process.env.DATADOG_API_KEY
    }
  });
}
```

### Custom Dashboard

Create a custom dashboard using JSON reports:

```typescript
// dashboard/server.ts
import express from 'express';
import fs from 'fs';

const app = express();

app.get('/api/latest-results', (req, res) => {
  const report = JSON.parse(
    fs.readFileSync('reports/test-results.json', 'utf8')
  );
  
  res.json({
    totalTests: report.stats.expected + report.stats.unexpected,
    passRate: (report.stats.expected / (report.stats.expected + report.stats.unexpected)) * 100,
    duration: report.stats.duration,
    timestamp: new Date()
  });
});

app.listen(3000, () => {
  console.log('Dashboard running on http://localhost:3000');
});
```

---

## Report Best Practices

### 1. Attach Relevant Information

```typescript
test('should process payment', async ({ page }, testInfo) => {
  // Attach transaction ID for reference
  await testInfo.attach('transaction-id', {
    body: 'TXN-12345',
    contentType: 'text/plain'
  });
  
  // Attach request/response data
  await testInfo.attach('api-response', {
    body: JSON.stringify(apiResponse, null, 2),
    contentType: 'application/json'
  });
});
```

### 2. Meaningful Test Names

Use descriptive names that appear well in reports:

```typescript
// Good
test('should display validation error when submitting empty registration form', async ({ page }) => {
  // ...
});

// Bad
test('test1', async ({ page }) => {
  // ...
});
```

### 3. Use Test Annotations

```typescript
test('critical user flow', async ({ page }) => {
  test.info().annotations.push({ type: 'issue', description: 'JIRA-123' });
  test.info().annotations.push({ type: 'priority', description: 'high' });
  // ...
});
```

### 4. Add Context on Failure

```typescript
test('should load dashboard', async ({ page }, testInfo) => {
  try {
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-loaded', { timeout: 5000 });
  } catch (error) {
    // Add context
    const screenshot = await page.screenshot();
    await testInfo.attach('failure-screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
    
    const html = await page.content();
    await testInfo.attach('page-html', {
      body: html,
      contentType: 'text/html'
    });
    
    throw error;
  }
});
```

### 5. Regular Report Review

- Schedule weekly report reviews
- Track trends over time
- Identify flaky tests
- Monitor performance degradation
- Share insights with team

---

## Troubleshooting Reports

### Issue: Reports Not Generated

**Solution**:
```bash
# Check reporter configuration
cat playwright.config.ts | grep reporter

# Verify output directory exists
ls -la reports/

# Run with explicit reporter
npm test -- --reporter=html
```

### Issue: Slack Notifications Not Sent

**Solution**:
```bash
# Verify webhook URL
echo $SLACK_WEBHOOK_URL

# Test webhook manually
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test message"}' \
  $SLACK_WEBHOOK_URL

# Check environment loading
node -e "require('dotenv').config(); console.log(process.env.SLACK_ENABLED)"
```

### Issue: Jira Integration Fails

**Solution**:
```bash
# Verify credentials
echo $JIRA_SERVER
echo $JIRA_USERNAME

# Test API connection
curl -u $JIRA_USERNAME:$JIRA_API_TOKEN \
  $JIRA_SERVER/rest/api/2/myself
```

---

**Last Updated:** 2025-11-26  
**Version:** 2.0.0  
**Maintainer:** Test Automation Team