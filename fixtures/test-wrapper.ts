import { test as baseTest, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { SuiteConfigError, SuiteLoader, SuiteValidationError } from '../utils/suite-runner';

// Config module type definition (for node-config package)
interface ConfigModule {
  util: {
    extendDeep: (target: unknown, source: unknown) => unknown;
  };
  get: (key: string) => unknown;
  has: (key: string) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config: ConfigModule = require('config');

// Test result types
export enum TCMTestResultType {
  Passed = 'passed',
  Failed = 'failed',
  Skipped = 'skipped',
  AppBug = 'appbug',
  Repair = 'repair'
}

// Skip reasons
export enum TCMTestSkipType {
  Dependency = 'dependency',
  HookFailed = 'hookFailed',
  AppBug = 'appbug',
  Repair = 'repair'
}

// Test verification parameters
export interface TCMVerifyParameters {
  name?: string;
  dependsOn?: string[];
  skip?: boolean;
  group?: string;
}

// Test result interface
export interface TCMTestResult {
  type: TCMTestResultType;
  startTime: number;
  endTime: number;
  error?: Error;
  skipReason?: TCMTestSkipType;
  screenshot?: string;
}

// Extended test interface with retry screenshot capabilities (internal use)
interface TestWithRetryScreenshots {
  captureRetryScreenshot(reason?: string): Promise<string>;
  getRetryAttemptNumber(): number;
}

// Test verification class
export class TCMTestVerify {
  constructor(
    public tcmId: string,
    public title: string,
    public name?: string,
    public dependsOn?: string[],
    public result?: TCMTestResult,
    public group?: string
  ) { }
}

// Custom test fixture that provides retry screenshot functionality and supports all Playwright built-in fixtures
const testWithBothFixtures = baseTest.extend<{
  page: Page & TestWithRetryScreenshots;
  context: any;
  request: any;
}>({
  // Override the default page fixture to include automatic retry screenshot capabilities
  page: async ({ page }, use, testInfo) => {
    // Apply project metadata config overrides if exist (before any page operations)
    // when running through run.ts file, to override project level configs include the config data inside project metadata
    const configData = testInfo.project.metadata?.config;
    if (configData && typeof configData === 'object') {
      try {
        config.util.extendDeep(config, configData);
        if (process.env.PLAYWRIGHT_DEBUG) {
          console.log('PAGE FIXTURE: Applied project metadata config:', JSON.stringify(configData, null, 2));
        }
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.warn(`PAGE FIXTURE: Failed to apply project metadata config:`, errorMessage);
      }
    }
    
    // Apply test-specific config overrides if running in suite runner mode (using SUITE_FILE_PATH)
    if (process.env.SUITE_FILE_PATH) {
      try {
        const suitePath = process.env.SUITE_FILE_PATH;
        const resolvedPath = path.isAbsolute(suitePath) ? suitePath : path.resolve(suitePath);

        // Use the improved API with better error handling and feedback
        const result = SuiteLoader.loadSuite(resolvedPath, {
          overrideConfig: true,
          validateSuite: false, // Skip validation during test execution
          loadTestsConfig: true,
          testName: testInfo.project.name
        });

        // Log warnings if any (only in debug mode)
        if (result.warnings.length > 0 && process.env.PLAYWRIGHT_DEBUG) {
          console.log(`Suite warnings for ${testInfo.project.name}:`, result.warnings);
        }

        // Log successful config override for debugging (only in verbose mode)
        if (process.env.PLAYWRIGHT_DEBUG) {
          console.log(`Config ${result.configOverridden ? 'overridden' : 'loaded'} for test ${testInfo.project.name} using suite: ${result.suite.name}`);
        }
      } catch (e: unknown) {
        // Specific error handling with custom error types
        if (e instanceof SuiteConfigError) {
          console.warn(`Suite configuration error: ${e.message}`);
        } else if (e instanceof SuiteValidationError) {
          console.warn(`Suite validation error: ${e.message}`);
        } else {
          const errorMessage = e instanceof Error ? e.message : String(e);
          console.warn(`Failed to load test-specific config for ${testInfo.project.name}:`, errorMessage);
        }
      }
    }
    
    // Get run folder from environment variable set by custom reporter, fallback to default
    // Get run folder from environment variable set by playwright config
    let runFolder = process.env.PLAYWRIGHT_RUN_FOLDER;
    if (!runFolder) {
      // Emergency fallback - should rarely be needed since config runs first
      const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '-')  // Replace colons and dots with dashes
        .replace('T', '_')      // Replace T with underscore
        .slice(0, 19);          // Remove milliseconds part
      runFolder = `./playwright-report/run_${timestamp}`;
      process.env.PLAYWRIGHT_RUN_FOLDER = runFolder;
    }
    const screenshotsDir = path.join(runFolder, 'retry-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Track retry attempt number (convert from 0-based to 1-based)
    let attemptNumber = testInfo.retry + 1;

    // Enhanced page with retry screenshot capabilities
    const enhancedPage = page as Page & TestWithRetryScreenshots;

    enhancedPage.captureRetryScreenshot = async (reason: string = 'manual') => {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const tcmId = testInfo.title.match(/(TCM-\d+|[A-Z]+-\d+)/)?.[0] || 'unknown';
        const filename = `${tcmId}_attempt_${attemptNumber}_${reason}_${timestamp}.png`;
        const screenshotPath = path.join(screenshotsDir, filename);

        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
          animations: 'disabled'  // Reduce flakiness
        });

        // Also add as test attachment for the reporter to find
        await testInfo.attach(`retry-screenshot-attempt_${attemptNumber}`, {
          path: screenshotPath,
          contentType: 'image/png'
        });

        return screenshotPath;
      } catch (error) {
        console.warn(`Failed to capture retry screenshot: ${error}`);
        return '';
      }
    };

    enhancedPage.getRetryAttemptNumber = () => attemptNumber;

    // Auto-capture screenshots on any failure during retry attempts
    let autoScreenshotCounter = 0;

    // Wrap common Page methods that can fail
    const originalGoto = enhancedPage.goto.bind(enhancedPage);
    enhancedPage.goto = async (url: string, options?: any) => {
      try {
        // Use the bound method directly
        const result = await originalGoto(url, options);
        return result;
      } catch (error) {
        try {
          await enhancedPage.captureRetryScreenshot(`auto-goto-failure-${++autoScreenshotCounter}`);
        } catch (screenshotError) {
          console.warn(`Failed to capture goto failure screenshot: ${screenshotError}`);
        }
        throw error;
      }
    };

    // Wrap locator method to capture screenshots on common failures
    const originalLocator = enhancedPage.locator.bind(enhancedPage);
    enhancedPage.locator = (selector: string, options?: any) => {
      const locator = originalLocator(selector, options);

      // Wrap click
      const originalClick = locator.click.bind(locator);
      locator.click = async (options?: any) => {
        try {
          // Use the bound method directly
          const result = await originalClick(options);
          return result;
        } catch (error) {
          try {
            await enhancedPage.captureRetryScreenshot(`auto-click-failure-${++autoScreenshotCounter}`);
          } catch (screenshotError) {
            console.warn(`Failed to capture click failure screenshot: ${screenshotError}`);
          }
          throw error;
        }
      };

      // Wrap fill
      const originalFill = locator.fill.bind(locator);
      locator.fill = async (value: string, options?: any) => {
        try {
          // Use the bound method directly
          const result = await originalFill(value, options);
          return result;
        } catch (error) {
          try {
            await enhancedPage.captureRetryScreenshot(`auto-fill-failure-${++autoScreenshotCounter}`);
          } catch (screenshotError) {
            console.warn(`Failed to capture fill failure screenshot: ${screenshotError}`);
          }
          throw error;
        }
      };

      // Wrap waitFor
      const originalWaitFor = locator.waitFor.bind(locator);
      locator.waitFor = async (options?: any) => {
        try {
          // Use the bound method directly
          const result = await originalWaitFor(options);
          return result;
        } catch (error) {
          // Only capture screenshot if we haven't already failed on screenshot capture
          try {
            await enhancedPage.captureRetryScreenshot(`auto-waitFor-failure-${++autoScreenshotCounter}`);
          } catch (screenshotError) {
            console.warn(`Failed to capture waitFor failure screenshot: ${screenshotError}`);
          }
          throw error;
        }
      };

      return locator;
    };

    // Wrap waitForSelector
    const originalWaitForSelector = enhancedPage.waitForSelector.bind(enhancedPage);
    enhancedPage.waitForSelector = async (selector: string, options?: any) => {
      try {
        // Use the bound method directly
        const result = await originalWaitForSelector(selector, options);
        return result;
      } catch (error) {
        // Only capture screenshot if we haven't already failed on screenshot capture
        try {
          await enhancedPage.captureRetryScreenshot(`auto-waitForSelector-failure-${++autoScreenshotCounter}`);
        } catch (screenshotError) {
          console.warn(`Failed to capture waitForSelector failure screenshot: ${screenshotError}`);
        }
        throw error;
      }
    };

    await use(enhancedPage);

    // If the test failed, auto-capture final screenshot for any attempt
    if (testInfo.status === 'failed') {
      try {
        const tcmId = testInfo.title.match(/(TCM-\d+|[A-Z]+-\d+)/)?.[0] || 'unknown';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${tcmId}_attempt_${attemptNumber}_auto-final-failure_${timestamp}.png`;
        const screenshotPath = path.join(screenshotsDir, filename);

        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
          animations: 'disabled'
        });

        // Add as test attachment
        await testInfo.attach(`retry-screenshot-attempt_${attemptNumber}`, {
          path: screenshotPath,
          contentType: 'image/png'
        });
      } catch (error) {
        console.warn(`Failed to auto-capture final retry screenshot: ${error}`);
      }
    }
  }
});

// Storage for TCM tracking
class TCMTracker {
  private static tcmCounts = new Map<string, { total: number; passed: number; failed: number; skipped: number; intermittent: number }>();
  private static testVerifications = new Map<string, TCMTestVerify[]>();
  public static currentScenario: string | null = null;

  static addTcmId(tcmId: string) {
    if (!this.tcmCounts.has(tcmId)) {
      this.tcmCounts.set(tcmId, { total: 0, passed: 0, failed: 0, skipped: 0, intermittent: 0 });
    }
  }

  static registerTest(tcmId: string, title: string, name?: string, dependsOn?: string[], group?: string) {
    // Register test immediately when defined, not when completed
    const testVerify = new TCMTestVerify(tcmId, title, name, dependsOn, undefined, group);
    const scenario = this.currentScenario || 'default';
    if (!this.testVerifications.has(scenario)) {
      this.testVerifications.set(scenario, []);
    }
    const verifications = this.testVerifications.get(scenario)!;
    verifications.push(testVerify);
    this.testVerifications.set(scenario, verifications);
  }

  static setCurrentScenario(scenario: string) {
    this.currentScenario = scenario;
    if (!this.testVerifications.has(scenario)) {
      this.testVerifications.set(scenario, []);
    }
  }

  static addTestVerification(verify: TCMTestVerify) {
    if (this.currentScenario) {
      const verifications = this.testVerifications.get(this.currentScenario) || [];
      verifications.push(verify);
      this.testVerifications.set(this.currentScenario, verifications);
    }
  }

  static getTestVerifications(scenario?: string): TCMTestVerify[] {
    if (scenario) {
      return this.testVerifications.get(scenario) || [];
    }
    // Return all verifications from all scenarios
    const allVerifications: TCMTestVerify[] = [];
    for (const verifications of this.testVerifications.values()) {
      allVerifications.push(...verifications);
    }
    return allVerifications;
  }

  static hasTest(nameOrTcmId: string, scenario?: string): boolean {
    const verifications = this.getTestVerifications(scenario);
    return verifications.some(v => v.name === nameOrTcmId || v.tcmId === nameOrTcmId);
  }

  static getTest(nameOrTcmId: string, scenario?: string): TCMTestVerify | undefined {
    const verifications = this.getTestVerifications(scenario);
    return verifications.find(v => v.name === nameOrTcmId || v.tcmId === nameOrTcmId);
  }

  static updateTestResult(nameOrTcmId: string, result: TCMTestResult, scenario?: string) {
    const test = this.getTest(nameOrTcmId, scenario);
    if (test) {
      test.result = result;
    }
  }

  static incrementCount(tcmId: string, status: 'passed' | 'failed' | 'skipped' | 'intermittent') {
    if (!this.tcmCounts.has(tcmId)) {
      this.tcmCounts.set(tcmId, { total: 0, passed: 0, failed: 0, skipped: 0, intermittent: 0 });
    }

    const counts = this.tcmCounts.get(tcmId)!;
    counts.total++;
    counts[status]++;
  }

  static getCounts() {
    return new Map(this.tcmCounts);
  }

  static reset() {
    this.tcmCounts.clear();
    this.testVerifications.clear();
    this.currentScenario = null;
  }

  // Get count of unique TCM cases
  static getUniqueTcmCount() {
    return this.tcmCounts.size;
  }

  // Get count of TCM cases that have ALL tests passed (no failed or skipped tests)
  static getPassedTcmCount() {
    let passedTcmCount = 0;
    for (const counts of this.tcmCounts.values()) {
      if (counts.total > 0 && counts.failed === 0 && counts.skipped === 0) {
        passedTcmCount++;
      }
    }
    return passedTcmCount;
  }

  // Get count of TCM cases that have any failed tests
  static getFailedTcmCount() {
    let failedTcmCount = 0;
    for (const counts of this.tcmCounts.values()) {
      if (counts.failed > 0) {
        failedTcmCount++;
      }
    }
    return failedTcmCount;
  }

  // Get count of TCM cases that have only skipped tests (no passed or failed tests)
  static getSkippedTcmCount() {
    let skippedTcmCount = 0;
    for (const counts of this.tcmCounts.values()) {
      if (counts.total > 0 && counts.passed === 0 && counts.failed === 0) {
        skippedTcmCount++;
      }
    }
    return skippedTcmCount;
  }

  // Legacy methods for backward compatibility (individual test counts)
  static getTotalCount() {
    let total = 0;
    for (const counts of this.tcmCounts.values()) {
      total += counts.total;
    }
    return total;
  }

  static getPassedCount() {
    let passed = 0;
    for (const counts of this.tcmCounts.values()) {
      passed += counts.passed;
    }
    return passed;
  }

  static getFailedCount() {
    let failed = 0;
    for (const counts of this.tcmCounts.values()) {
      failed += counts.failed;
    }
    return failed;
  }

  static getSkippedCount() {
    let skipped = 0;
    for (const counts of this.tcmCounts.values()) {
      skipped += counts.skipped;
    }
    return skipped;
  }

  static getIntermittentCount() {
    let intermittent = 0;
    for (const counts of this.tcmCounts.values()) {
      intermittent += counts.intermittent;
    }
    return intermittent;
  }
}

// Enhanced test function that accepts TCM ID first, then title, with optional parameters
const customTest = ((tcmId: string, title: string, testFn: (args: any, testInfo: any) => Promise<void>, parameters?: TCMVerifyParameters) => {
  TCMTracker.addTcmId(tcmId);

  // Set default scenario if none is set
  if (!TCMTracker.currentScenario) {
    TCMTracker.setCurrentScenario('default');
  }

  // Register test immediately when defined
  const testName = parameters?.name || title;
  TCMTracker.registerTest(tcmId, title, testName, parameters?.dependsOn, parameters?.group);

  // Include TCM ID in the test title for the reporter to pick up
  const enhancedTitle = `${tcmId}: ${title}`;

  return testWithBothFixtures(enhancedTitle, async ({ page, context, request, browser, browserName, playwright }, testInfo) => {
    const startTime = Date.now();
    const testName = parameters?.name || title;
    const dependsOn = parameters?.dependsOn;
    const manualSkip = parameters?.skip || false;
    const group = parameters?.group;
    let testResult: TCMTestResult;

    try {
      // Check for manual skip
      if (manualSkip) {
        testResult = {
          type: TCMTestResultType.Skipped,
          startTime,
          endTime: Date.now(),
          skipReason: TCMTestSkipType.Dependency // Using Dependency as fallback for manual skips
        };
        TCMTracker.updateTestResult(testName, testResult);
        TCMTracker.incrementCount(tcmId, 'skipped');
        testInfo.skip(true, 'Test manually skipped');
        return;
      }

      // Check for app bug or repair skip
      // Use direct path to ps.test-state.json from project root
      const projectRoot = process.cwd();
      const testStateFile = `${projectRoot}/tests/ps.test-state.json`;

      if (fs.existsSync(testStateFile)) {
        const testState = JSON.parse(fs.readFileSync(testStateFile, 'utf8'));

        // Check for app bug
        if (testState.appbug && testState.appbug[tcmId]) {
          const appBugId = testState.appbug[tcmId];
          testResult = {
            type: TCMTestResultType.Skipped,
            startTime,
            endTime: Date.now(),
            skipReason: TCMTestSkipType.AppBug
          };
          TCMTracker.updateTestResult(testName, testResult);
          TCMTracker.incrementCount(tcmId, 'skipped');
          testInfo.skip(true, `Test skipped - marked as app bug: ${appBugId}`);
          return;
        }

        // Check for repair
        if (testState.repair && testState.repair[tcmId]) {
          const repairInfo = testState.repair[tcmId];
          testResult = {
            type: TCMTestResultType.Skipped,
            startTime,
            endTime: Date.now(),
            skipReason: TCMTestSkipType.Repair
          };
          TCMTracker.updateTestResult(testName, testResult);
          TCMTracker.incrementCount(tcmId, 'skipped');
          testInfo.skip(true, `Test skipped - marked as repair: ${repairInfo.assigned || 'Unknown'}`);
          return;
        }
      } else {
        // Test state file not found - continue with test execution
      }

      // Check dependencies
      if (dependsOn && dependsOn.length > 0) {
        const missingDeps = dependsOn.filter(dep => !TCMTracker.hasTest(dep));
        if (missingDeps.length > 0) {
          throw new Error(`Missing dependencies: ${missingDeps.join(', ')}`);
        }

        const failedDeps = dependsOn.filter(dep => {
          const depTest = TCMTracker.getTest(dep);
          return depTest && depTest.result?.type !== TCMTestResultType.Passed;
        });

        if (failedDeps.length > 0) {
          testResult = {
            type: TCMTestResultType.Skipped,
            startTime,
            endTime: Date.now(),
            skipReason: TCMTestSkipType.Dependency
          };
          TCMTracker.updateTestResult(testName, testResult);
          TCMTracker.incrementCount(tcmId, 'skipped');
          testInfo.skip(true, `Skipped due to failed dependencies: ${failedDeps.join(', ')}`);
          return;
        }
      }

      // Execute the test - pass all fixtures so tests can destructure what they need
      await testFn({ page, context, request, browser, browserName, playwright }, testInfo);

      // Test passed
      testResult = {
        type: TCMTestResultType.Passed,
        startTime,
        endTime: Date.now()
      };
      TCMTracker.updateTestResult(testName, testResult);
      TCMTracker.incrementCount(tcmId, 'passed');

    } catch (error) {
      // Test failed
      testResult = {
        type: TCMTestResultType.Failed,
        startTime,
        endTime: Date.now(),
        error: error as Error
      };
      TCMTracker.updateTestResult(testName, testResult);
      TCMTracker.incrementCount(tcmId, 'failed');
      throw error;
    }
  });
}) as any;

// Test function framework
export function test(tcmId: string, title: string, testFn: (args: any, testInfo: any) => Promise<void>, parameters?: TCMVerifyParameters) {
  return customTest(tcmId, title, testFn, parameters);
}

// Copy all static properties and methods from original test
Object.setPrototypeOf(customTest, testWithBothFixtures);
Object.assign(customTest, testWithBothFixtures);

export { expect, TCMTracker };
export const describe = testWithBothFixtures.describe;
export const beforeAll = testWithBothFixtures.beforeAll;
export const beforeEach = testWithBothFixtures.beforeEach;
export const afterAll = testWithBothFixtures.afterAll;
export const afterEach = testWithBothFixtures.afterEach;

// Export test with enhanced serial functionality
test.describe = testWithBothFixtures.describe;
test.describe.serial = testWithBothFixtures.describe.serial;
test.describe.parallel = testWithBothFixtures.describe.parallel;
test.describe.fixme = testWithBothFixtures.describe.fixme;
test.describe.skip = testWithBothFixtures.describe.skip;
test.describe.only = testWithBothFixtures.describe.only;
test.describe.configure = testWithBothFixtures.describe.configure;

// Export test modifiers and utilities
test.step = testWithBothFixtures.step;
test.skip = testWithBothFixtures.skip;
test.fixme = testWithBothFixtures.fixme;
test.only = testWithBothFixtures.only;
test.slow = testWithBothFixtures.slow;
test.setTimeout = testWithBothFixtures.setTimeout;
test.fail = testWithBothFixtures.fail;

// For direct access to common functions
export const serial = testWithBothFixtures.describe.serial;

// Create wrapped versions of skip/fixme that support TCM pattern
export function skip(tcmId: string, title: string, testFn: (args: any, testInfo: any) => Promise<void>, parameters?: TCMVerifyParameters) {
  return customTest(tcmId, title, testFn, { ...parameters, skip: true });
}

export function fixme(tcmId: string, title: string, testFn: (args: any, testInfo: any) => Promise<void>, parameters?: TCMVerifyParameters) {
  return testWithBothFixtures.fixme(`${tcmId}: ${title}`, testFn);
}

export function only(tcmId: string, title: string, testFn: (args: any, testInfo: any) => Promise<void>, parameters?: TCMVerifyParameters) {
  return testWithBothFixtures.only(`${tcmId}: ${title}`, testFn);
}

// Direct exports for non-TCM usage (if needed)
export const slow = testWithBothFixtures.slow;
export const step = testWithBothFixtures.step;
