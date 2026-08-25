/**
 * Reporting utility functions for test reporting to various platforms
 * Supports Slack and Jira/Zephyr integration
 *
 * Updated to use ConfigManager as the single source of truth
 */
import { FullResult, TestCase, TestResult } from '@playwright/test/reporter';
import { ConfigManager } from '../config/ConfigManager';
import * as path from 'path';
import * as fs from 'fs';

const configManager = ConfigManager.getInstance();

// Helper functions to get settings from ConfigManager
function getJiraSettings() {
  return configManager.getJiraSettings();
}

function getSlackReportSettings() {
  return configManager.getSlackReportSettings();
}

function isDryRunEnabled() {
  return configManager.isDryRunEnabled();
}

/**
 * Format date for use in report names
 * @returns Formatted date string (YYYY-MM-DD)
 */
function getFormattedDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time for use in report names
 * @returns Formatted time string (HH-MM-SS)
 */
function getFormattedTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}-${minutes}-${seconds}`;
}

/**
 * Create a Jira cycle name using the configured format
 * @returns Jira cycle name with date/time replacements
 */
export function createJiraCycleName(): string {
  const jiraSettings = getJiraSettings();
  let cycleName = jiraSettings.zephyrCycleName;
  
  // Replace date and time placeholders
  cycleName = cycleName.replace('{date}', getFormattedDate());
  cycleName = cycleName.replace('{time}', getFormattedTime());
  
  return cycleName;
}

/**
 * Determine if a test should be reported based on test status and reporting settings
 * @param testCase The test case containing test metadata
 * @param testResult The test result containing test outcome
 * @returns boolean indicating if test should be reported
 */
export function shouldReportTest(testCase: TestCase, testResult: TestResult): boolean {
  // Skip reporting if dry run is enabled
  if (isDryRunEnabled()) {
    console.log('Dry run enabled - skipping test reporting');
    return false;
  }
  
  // Check if test has required annotations or markers
  const hasJiraTag = testCase.annotations.some(a => a.type === 'jira' || a.type === 'tcm');
  
  // Always report tests with Jira/TCM tags
  if (hasJiraTag) {
    return true;
  }
  
  // Check test status - report all failed tests by default
  if (testResult.status === 'failed') {
    return true;
  }
  
  return true; // Report all tests by default
}

/**
 * Calculate test statistics from full results
 * @param results Full test results
 * @returns Object with test statistics
 */
export function calculateTestStatistics(results: FullResult): {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  flakingTests: number;
  passRate: number;
} {
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  let flakingTests = 0;
  
  // Helper function to recursively count tests in a suite
  function countTestsInSuite(suite: any): void {
    for (const test of suite.tests || []) {
      totalTests++;
      
      // Get the last result (final outcome)
      const testResults = test.results || [];
      const lastResult = testResults[testResults.length - 1];
      
      if (lastResult) {
        if (lastResult.status === 'passed') {
          passedTests++;
          // Check if test was flaky (failed before passing)
          if (testResults.length > 1) {
            flakingTests++;
          }
        } else if (lastResult.status === 'failed') {
          failedTests++;
        } else if (lastResult.status === 'skipped') {
          skippedTests++;
        }
      }
    }
    
    // Recursively process nested suites
    for (const childSuite of suite.suites || []) {
      countTestsInSuite(childSuite);
    }
  }
  
  // Process all top-level suites
  const resultSuites = (results as any).suites || [];
  for (const suite of resultSuites) {
    countTestsInSuite(suite);
  }
  
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  
  return {
    totalTests,
    passedTests,
    failedTests,
    skippedTests,
    flakingTests,
    passRate
  };
}

/**
 * Prepare Slack message for test results
 * @param results Test results to report
 * @returns Formatted Slack message object
 */
export function prepareSlackMessage(results: FullResult): Record<string, any> {
  const slackSettings = getSlackReportSettings();
  const stats = calculateTestStatistics(results);
  
  // Determine emoji based on pass rate
  let emoji = '✅';
  if (stats.passRate < 50) {
    emoji = '❌';
  } else if (stats.passRate < 80) {
    emoji = '⚠️';
  }
  
  // Calculate duration
  const duration = results.duration ? Math.round(results.duration / 1000 / 60) : 0;
  
  const message = {
    text: `${emoji} Test Run Complete: ${stats.passRate}% Pass Rate`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} Test Run Complete: ${stats.passRate}% Pass Rate`,
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Environment:* ${slackSettings.environment || 'Unknown'}`
          },
          {
            type: 'mrkdwn',
            text: `*Module:* ${process.env.TEST_MODULE || 'hoonuit_sis'}`
          },
          {
            type: 'mrkdwn',
            text: `*Total Tests:* ${stats.totalTests}`
          },
          {
            type: 'mrkdwn',
            text: `*Pass Rate:* ${stats.passRate}%`
          },
          {
            type: 'mrkdwn',
            text: `*Passed:* ${stats.passedTests} ✅`
          },
          {
            type: 'mrkdwn',
            text: `*Failed:* ${stats.failedTests} ❌`
          },
          {
            type: 'mrkdwn',
            text: `*Skipped:* ${stats.skippedTests} ⏭️`
          },
          {
            type: 'mrkdwn',
            text: `*Flaky:* ${stats.flakingTests} 🔄`
          },
          {
            type: 'mrkdwn',
            text: `*Duration:* ${duration}m`
          },
          {
            type: 'mrkdwn',
            text: `*Time:* ${new Date().toLocaleString()}`
          }
        ]
      }
    ]
  };
  
  // Add divider and footer using proper type casting
  (message.blocks as any[]).push({
    type: 'divider'
  });
  
  (message.blocks as any[]).push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Branch: \`${process.env.GITHUB_REF || 'local'}\` | Triggered by: ${process.env.GITHUB_ACTOR || 'local user'}`
      }
    ]
  });
  
  return message;
}

/**
 * Get the path for storing logs based on configured settings
 * @returns Path for log files
 */
export function getLogPath(): string {
  const baseDir = process.env.LOG_LOCATION === 'USER_DIR' 
    ? process.env.HOME || process.env.USERPROFILE || '.'
    : '.';
  
  const logDir = path.join(baseDir, 'playwright-logs');
  
  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  return logDir;
}

/**
 * Extract Jira test case ID from test case
 * Supports multiple formats:
 * - Annotations: @jira or @tcm
 * - Title formats: [TEST-123], TCM-123, TEST-123:
 * @param testCase The test case
 * @returns Jira test case ID or undefined
 */
export function extractJiraTestId(testCase: TestCase): string | undefined {
  // Check for jira/tcm tag in annotations
  const jiraTag = testCase.annotations.find(a => a.type === 'jira' || a.type === 'tcm');
  if (jiraTag && jiraTag.description) {
    return jiraTag.description;
  }
  
  // Check for test ID in title (e.g., "[TEST-123] Test description")
  const bracketMatch = testCase.title.match(/\[([\w-]+)\]/);
  if (bracketMatch && bracketMatch[1]) {
    return bracketMatch[1];
  }
  
  // Check for TCM/TEST prefix (e.g., "TCM-123 Test description" or "TEST-123:")
  const prefixMatch = testCase.title.match(/^(TCM-\d+|TEST-\d+)/i);
  if (prefixMatch && prefixMatch[1]) {
    return prefixMatch[1];
  }
  
  return undefined;
}

/**
 * Send test results to Jira/Zephyr
 * This implementation provides the structure for Jira API integration
 * @param testCase The test case
 * @param result The test result
 */
export async function reportToJira(testCase: TestCase, result: TestResult): Promise<void> {
  const jiraSettings = getJiraSettings();
  
  if (!jiraSettings.enabled) {
    return;
  }
  
  // Check if test has Jira test case ID in title or annotations
  const testId = extractJiraTestId(testCase);
  if (!testId) {
    console.log(`No Jira test ID found for test: ${testCase.title}`);
    return;
  }
  
  console.log(`Reporting test ${testCase.title} (${testId}) to Jira`);
  
  // Prepare test execution data
  const executionData = {
    testCaseId: testId,
    status: result.status === 'passed' ? 'PASS' : result.status === 'failed' ? 'FAIL' : 'SKIP',
    cycleName: createJiraCycleName(),
    environment: process.env.TEST_ENV || 'auto_aws_bronze',
    executedOn: new Date().toISOString(),
    duration: result.duration,
    error: result.error?.message
  };
  
  console.log('Jira execution data prepared:', executionData);
  
  // TODO: Implement actual Jira/Zephyr API call
  // This would typically use the Jira REST API with authentication
  // Example: POST to /rest/zapi/latest/execution with executionData
  
  // For now, we log the data that would be sent
  if (jiraSettings.apiToken && jiraSettings.server) {
    console.log(`Would send to Jira server: ${jiraSettings.server}`);
    console.log(`Project Key: ${jiraSettings.projectKey}`);
    console.log(`Cycle: ${executionData.cycleName}`);
  } else {
    console.warn('Jira settings incomplete - API token or server not configured');
  }
}

/**
 * Send test results to Slack
 * Sends formatted test results to configured Slack webhooks
 * @param results Full test results
 */
export async function reportToSlack(results: FullResult): Promise<void> {
  const slackSettings = getSlackReportSettings();
  
  if (!slackSettings.enabled) {
    console.log('Slack reporting disabled');
    return;
  }
  
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured - skipping Slack reporting');
    return;
  }
  
  const message = prepareSlackMessage(results);
  
  try {
    console.log('Sending test results to Slack...');
    
    // Use fetch to send webhook (Node 18+ has native fetch)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });
    
    if (response.ok) {
      console.log('✅ Successfully sent test results to Slack');
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to send Slack notification:', response.status, errorText);
    }
  } catch (error) {
    console.error('❌ Error sending Slack notification:', error);
  }
}

/**
 * Save test results to JSON file
 * @param results Full test results
 * @param filename Optional custom filename
 */
export function saveTestResultsToFile(results: FullResult, filename?: string): void {
  const stats = calculateTestStatistics(results);
  const reportDir = path.join(process.cwd(), 'reports');
  
  // Ensure reports directory exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const defaultFilename = `test-results-${getFormattedDate()}-${getFormattedTime()}.json`;
  const filepath = path.join(reportDir, filename || defaultFilename);
  
  const reportData = {
    summary: stats,
    timestamp: new Date().toISOString(),
    environment: process.env.TEST_ENV || 'unknown',
    module: process.env.TEST_MODULE || 'unknown',
    duration: results.duration,
    status: results.status
  };
  
  try {
    fs.writeFileSync(filepath, JSON.stringify(reportData, null, 2));
    console.log(`Test results saved to: ${filepath}`);
  } catch (error) {
    console.error('Failed to save test results:', error);
  }
}

/**
 * Create a summary report text
 * @param results Full test results
 * @returns Formatted summary text
 */
export function createSummaryText(results: FullResult): string {
  const stats = calculateTestStatistics(results);
  
  return `
╔════════════════════════════════════════════════════════════╗
║          PLAYWRIGHT TEST EXECUTION SUMMARY                 ║
╚════════════════════════════════════════════════════════════╝

Environment: ${process.env.TEST_ENV || 'Unknown'}
Module:      ${process.env.TEST_MODULE || 'Unknown'}
Date:        ${new Date().toLocaleString()}

─────────────────────────────────────────────────────────────
RESULTS
─────────────────────────────────────────────────────────────
Total Tests:  ${stats.totalTests}
Passed:       ${stats.passedTests} ✅
Failed:       ${stats.failedTests} ❌
Skipped:      ${stats.skippedTests} ⏭️
Flaky:        ${stats.flakingTests} 🔄

Pass Rate:    ${stats.passRate}%
Duration:     ${Math.round((results.duration || 0) / 1000 / 60)}m

Status:       ${stats.failedTests === 0 ? '✅ SUCCESS' : '❌ FAILURE'}
─────────────────────────────────────────────────────────────
`;
}