import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import { ConfigManager } from './config/ConfigManager';
import * as path from 'path';

// Get ConfigManager instance - it handles all environment loading
const configManager = ConfigManager.getInstance();

// Get configuration values from ConfigManager (single source of truth)
const baseURL = configManager.getBaseUrl();
const browserConfig = configManager.getBrowserConfig();
const maxRetries = configManager.getMaxRetryCount();

// Create run folder with timestamp for this test run
const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19);
const runFolder = path.join(process.cwd(), 'playwright-report', `run_${timestamp}`);

// Set environment variable for custom reporter and other components
process.env.PLAYWRIGHT_RUN_FOLDER = runFolder;

/**
 * Enhanced Playwright Configuration
 * Integrates with MSA architecture configuration system
 * 
 * See https://playwright.dev/docs/test-configuration
 */
const baseConfig: PlaywrightTestConfig = {
    testDir: './testSpec',
    timeout: 180000, // 3 minutes per test
    expect: {
        timeout: 10000,
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? maxRetries : 0,
    workers: process.env.CI ? 1 : undefined,
    
    // Reporters - Using custom reporter with enhanced features
    reporter: [
        ['list'],
        ['html', { outputFolder: `${runFolder}/html-report`, open: 'never' }],
        ['json', { outputFile: `${runFolder}/test-results.json` }],
        ['junit', { outputFile: `${runFolder}/junit.xml` }],
        ['./utils/reporting/custom-reporter.ts'],
    ],

    // Global setup and teardown
    globalSetup: require.resolve('./core/framework/globalSetup.ts'),
    globalTeardown: require.resolve('./core/framework/globalTeardown.ts'),
    
    // Output directories
    snapshotDir: './snapshots',
    outputDir: 'test-results/',

    // Shared settings for all projects
    use: {
        baseURL: baseURL,
        actionTimeout: 180000,
        navigationTimeout: 180000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },

    // Configure projects for different browsers and test suites
    projects: [
        // Default Chrome browser project
        {
            name: 'chrome',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: baseURL,
                launchOptions: {
                    headless: browserConfig.headless,
                    args: browserConfig.chromeArgs,
                    ...(browserConfig.chromePath && { executablePath: browserConfig.chromePath }),
                },
                viewport: browserConfig.viewport,
                ignoreHTTPSErrors: true,
                locale: 'en-US',
                timezoneId: configManager.getTimezone(),
                screenshot: 'only-on-failure',
                video: 'on-first-retry',
                trace: 'on-first-retry',
                actionTimeout: 180000,
                navigationTimeout: 180000,
                storageState: 'playwright-state/storageState.json',
            },
        },

        // =============================================
        // TEST SUITE PROJECTS
        // =============================================

        // Integration Setup Suite - 6 tests
        {
            name: 'integration-setup-suite',
            testDir: './testSpec/integration_setup_tests',
            testMatch: '**/*.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: baseURL,
                launchOptions: {
                    headless: browserConfig.headless,
                    args: browserConfig.chromeArgs,
                    ...(browserConfig.chromePath && { executablePath: browserConfig.chromePath }),
                },
                viewport: browserConfig.viewport,
                ignoreHTTPSErrors: true,
                locale: 'en-US',
                timezoneId: configManager.getTimezone(),
                screenshot: 'only-on-failure',
                video: 'on-first-retry',
                trace: 'on-first-retry',
                actionTimeout: 180000,
                navigationTimeout: 180000,
                storageState: 'playwright-state/storageState.json',
            },
        },

        // Integration Validation Suite - 16 tests
        {
            name: 'integration-validation-suite',
            testDir: './testSpec/integration_validation_tests',
            testMatch: '**/*.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: baseURL,
                launchOptions: {
                    headless: browserConfig.headless,
                    args: browserConfig.chromeArgs,
                    ...(browserConfig.chromePath && { executablePath: browserConfig.chromePath }),
                },
                viewport: browserConfig.viewport,
                ignoreHTTPSErrors: true,
                locale: 'en-US',
                timezoneId: configManager.getTimezone(),
                screenshot: 'only-on-failure',
                video: 'on-first-retry',
                trace: 'on-first-retry',
                actionTimeout: 180000,
                navigationTimeout: 180000,
                storageState: 'playwright-state/storageState.json',
            },
        },

        // Full Hoonuit SIS Integration Suite - All tests (Setup + Validation)
        {
            name: 'hoonuit-sis-full-suite',
            testDir: './testSpec',
            testMatch: '**/*.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: baseURL,
                launchOptions: {
                    headless: browserConfig.headless,
                    args: browserConfig.chromeArgs,
                    ...(browserConfig.chromePath && { executablePath: browserConfig.chromePath }),
                },
                viewport: browserConfig.viewport,
                ignoreHTTPSErrors: true,
                locale: 'en-US',
                timezoneId: configManager.getTimezone(),
                screenshot: 'only-on-failure',
                video: 'on-first-retry',
                trace: 'on-first-retry',
                actionTimeout: 180000,
                navigationTimeout: 180000,
                storageState: 'playwright-state/storageState.json',
            },
        },

        // Uncomment to add more browsers
        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //         baseURL: baseURL,
        //         storageState: 'playwright-state/storageState.json',
        //     },
        // },
        // {
        //     name: 'webkit',
        //     use: {
        //         ...devices['Desktop Safari'],
        //         baseURL: baseURL,
        //         storageState: 'playwright-state/storageState.json',
        //     },
        // },
    ],
};

/**
 * Get browser device configuration
 * @param browserName - Browser name ('chrome', 'firefox', 'webkit', 'edge')
 * @returns Browser configuration object
 */
export function getBrowserDevice(browserName: string = 'chrome'): any {
    const browserConfigs: Record<string, any> = {
        chrome: {
            ...devices['Desktop Chrome'],
            viewport: { width: 1600, height: 900 },
            launchOptions: {
                args: [
                    '--start-maximized',
                    '--disable-blink-features=AutomationControlled',
                ],
            },
        },
        firefox: {
            ...devices['Desktop Firefox'],
            viewport: { width: 1600, height: 900 },
        },
        webkit: {
            ...devices['Desktop Safari'],
            viewport: { width: 1600, height: 900 },
        },
        edge: {
            ...devices['Desktop Edge'],
            viewport: { width: 1600, height: 900 },
            launchOptions: {
                args: ['--start-maximized'],
            },
        },
    };

    return browserConfigs[browserName.toLowerCase()] || browserConfigs.chrome;
}

/**
 * Override configuration with custom values
 * Allows merging custom config into the base config
 */
export function overrideConfig(customConfig: any): any {
    return {
        ...baseConfig,
        ...customConfig,
    };
}

// Export the enhanced config
export default defineConfig(baseConfig);