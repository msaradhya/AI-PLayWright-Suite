# PW_AI_hoonuit_suite - Enhanced Reporting Features

This document describes the enhanced reporting features added to PW_AI_hoonuit_suite, which align it with the UIHN_playwright_qa_automation project's reporting capabilities.

## Overview

The enhanced reporting system provides:
- **Custom Playwright Reporter** with TCM (Test Case Management) tracking
- **PowerSchool-style Statistics** (Run to Plan, Pass to Run, etc.)
- **Timeline Reports** for visualizing test execution
- **Retry Attempt Tracking** with automatic screenshots
- **Slack Integration** with rich notifications
- **Azure Blob Storage Upload** for report sharing
- **JIRA/Zephyr Integration** for test case management

## Directory Structure

```
PW_AI_hoonuit_suite/
├── utils/
│   └── reporting/
│       ├── index.ts                    # Main exports
│       ├── custom-reporter.ts          # Custom Playwright reporter
│       ├── ps-datetime.ts              # Date/time utilities
│       ├── ps-string-builder.ts        # String building utility
│       ├── ps-report-info.ts           # Report metadata
│       ├── ps-tcm-statistics.ts        # PowerSchool statistics
│       ├── slack/
│       │   ├── index.ts
│       │   ├── slack-sender.ts         # Base Slack sender
│       │   └── playwright-slack-reporter.ts  # Playwright-specific Slack
│       ├── azure/
│       │   ├── index.ts
│       │   └── azure-blob-uploader.ts  # Azure Blob Storage
│       └── jira/
│           ├── index.ts
│           └── zephyr-reporter.ts      # JIRA/Zephyr integration
├── core/
│   └── framework/
│       └── globalTeardown.ts           # Enhanced teardown with reporting
└── playwright.config.ts                # Updated to use custom reporter
```

## Features in Detail

### 1. Custom Reporter (`custom-reporter.ts`)

The custom reporter implements Playwright's `Reporter` interface and provides:

- **TCM ID Extraction**: Automatically extracts TCM/JIRA IDs from test titles (e.g., `TCM-123: Test description`)
- **Test Grouping**: Groups tests by TCM ID for aggregated reporting
- **Retry Tracking**: Tracks all retry attempts with timing and screenshots
- **Intermittent Detection**: Identifies tests that passed after retries
- **Multiple Output Formats**:
  - `report.json` - Full JSON report with all test data
  - `report.timeline.json` - Timeline data for visualization
  - `report.timeline.test.html` - HTML timeline by test
  - `report.timeline.describe.html` - HTML timeline by suite
  - `report.tcm.json` - TCM-grouped results
  - `report.jira.log` - JIRA/Zephyr execution log

### 2. PowerSchool Statistics (`ps-tcm-statistics.ts`)

Calculates industry-standard test metrics:

| Metric | Description |
|--------|-------------|
| **Run to Plan** | Percentage of planned tests that were executed |
| **Pass to Run** | Percentage of executed tests that passed |
| **Pass to Plan** | Percentage of planned tests that passed |
| **Intermittent** | Percentage of tests with intermittent failures |

Additional categorizations:
- **App Bug**: Tests failing due to known application bugs
- **Repair**: Tests under repair/maintenance
- **Pass-Caution**: Tests that passed but had intermittent failures

### 3. Timeline Reports

Visual HTML reports showing:
- Test execution timeline with duration bars
- Color-coded status (green=pass, red=fail, yellow=skip, purple=flaky)
- TCM IDs and retry indicators
- PowerSchool statistics summary
- Start/end times and total duration

### 4. Slack Integration

Enhanced Slack notifications with:
- Rich message formatting with blocks
- PowerSchool statistics in message body
- Links to reports (Azure URL, Pipeline, Artifacts)
- Status emoji indicators
- Support for both webhook and bot token authentication

### 5. Azure Blob Storage Upload

Automatic upload of reports to Azure for sharing:
- Uploads entire report folder
- Generates shareable URLs
- Supports both Shared Key and SAS token authentication
- Preserves folder structure

### 6. JIRA/Zephyr Integration

Test case management integration:
- Report test executions to Zephyr Scale
- Create test cycles automatically
- Link bugs to failed tests
- Support for custom fields

## Configuration

### Environment Variables

```bash
# Slack Configuration
SLACK_ENABLED=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_BOT_TOKEN=xoxb-...  # Alternative to webhook
SLACK_CHANNELS=["channel1","channel2"]  # JSON array or comma-separated

# Azure Configuration
AZURE_STORAGE_ACCOUNT=mystorageaccount
AZURE_STORAGE_KEY=...  # Or use SAS token
AZURE_STORAGE_SAS_TOKEN=...
AZURE_STORAGE_CONTAINER=playwright-reports

# JIRA/Zephyr Configuration
JIRA_ENABLED=true
JIRA_SERVER=https://company.atlassian.net
JIRA_API_TOKEN=...
JIRA_USER_EMAIL=user@company.com
JIRA_PROJECT_KEY=UIHN
ZEPHYR_ACCESS_KEY=...
```

### Test Naming Convention

For TCM tracking, use the following test naming patterns:

```typescript
// Pattern 1: TCM ID prefix
test('TCM-123: Should validate login functionality', async () => {
  // test code
});

// Pattern 2: JIRA key prefix
test('UIHN-456: Should handle form submission', async () => {
  // test code
});

// Pattern 3: With annotations
test('Should validate data', async ({}) => {
  // test code
}, { annotation: { type: 'tcm', description: 'TCM-789' } });
```

### App Bug and Repair Tracking

Create a `ps.test-state.json` file in your test directory:

```json
{
  "appbug": {
    "TCM-123": "UIHN-999",
    "TCM-456": "UIHN-1000"
  },
  "repair": {
    "TCM-789": {
      "id": "TCM-789",
      "assigned": "developer@company.com"
    }
  }
}
```

## Usage Examples

### Running Tests with Custom Reporter

```bash
# Standard run
npx playwright test

# With specific project
npx playwright test --project=chrome

# With retry
npx playwright test --retries=2
```

### Programmatic Usage

```typescript
import { 
  PlaywrightSlackReportSender,
  AzureBlobUploader,
  ZephyrReporter,
  PSTcmResultStatistics
} from './utils/reporting';

// Send custom Slack notification
const sender = new PlaywrightSlackReportSender(testSummary);
await sender.sendReport();

// Upload reports to Azure
const uploader = new AzureBlobUploader();
const result = await uploader.uploadPlaywrightReport('./playwright-report/run_2024-01-01');

// Report to Zephyr
const zephyr = new ZephyrReporter();
await zephyr.reportTestExecution({
  testCaseKey: 'TCM-123',
  status: 'Pass',
  executionTime: 5000
});

// Calculate statistics
const stats = PSTcmResultStatistics.fromTestSummary(passed, failed, skipped, intermittent);
console.log(`Pass to Plan: ${stats.passToPlanPercentage}%`);
```

## Report Output

After test execution, reports are generated in:

```
playwright-report/
└── run_2024-01-01_10-30-00/
    ├── report.json              # Full test results
    ├── report.timeline.json     # Timeline data
    ├── report.timeline.test.html    # Visual timeline
    ├── report.timeline.describe.html
    ├── report.tcm.json          # TCM-grouped results
    ├── report.jira.log          # JIRA execution log
    ├── html-report/             # Playwright HTML report
    ├── retry-screenshots/       # Retry attempt screenshots
    └── test-results.json        # Standard Playwright results
```

## Migration from Legacy Reporting

If you were using the legacy `reportingUtils.ts` functions, the new system is backward compatible:
- `reportToSlack()` still works but can be replaced with `PlaywrightSlackReportSender`
- `calculateTestStatistics()` is still available
- `globalTeardown.ts` automatically uses the new system when custom report is available

## Comparison with UIHN_playwright_qa_automation

| Feature | PW_AI_hoonuit_suite (Before) | PW_AI_hoonuit_suite (After) | UIHN_playwright_qa_automation |
|---------|------------------------------|------------------------------|-------------------------------|
| Custom Reporter | ❌ | ✅ | ✅ |
| TCM Tracking | ❌ | ✅ | ✅ |
| Timeline Reports | ❌ | ✅ | ✅ |
| PS Statistics | ❌ | ✅ | ✅ |
| Retry Screenshots | ❌ | ✅ | ✅ |
| Slack Integration | Basic | Enhanced | Enhanced |
| Azure Upload | ❌ | ✅ | ✅ |
| JIRA/Zephyr | Stub only | Full | Full |
| App Bug Tracking | ❌ | ✅ | ✅ |

## Troubleshooting

### Reports Not Generated
- Ensure `playwright.config.ts` includes the custom reporter
- Check that `PLAYWRIGHT_RUN_FOLDER` environment variable is set

### Slack Notifications Not Sent
- Verify `SLACK_ENABLED=true`
- Check `SLACK_WEBHOOK_URL` or `SLACK_BOT_TOKEN` is configured
- Review console output for error messages

### Azure Upload Fails
- Verify storage account name and key/SAS token
- Ensure container exists or has auto-create permissions
- Check network connectivity

### TCM IDs Not Detected
- Use proper naming convention: `TCM-123: description` or `UIHN-456: description`
- TCM ID must be at the start of the test title