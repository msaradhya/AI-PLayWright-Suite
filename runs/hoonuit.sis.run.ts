import { defineConfig } from '@playwright/test';
import baseConfig, { getBrowserDevice } from '../playwright.config';

/**
 * Hoonuit SIS Integration Test Runner Configuration
 * This file defines test suites and their configurations for the Hoonuit SIS Integration project
 */
export default defineConfig({
    ...baseConfig,
    
    // Global configuration metadata
    metadata: {
        config: baseConfig.overrideConfig({
            framework: {
                browser: 'chrome',
                headless: false,
                retries: 1,
                workers: 1
            },
            hoonuit_sis: {
                environment: 'qa',
                user: 'adminUser'
            }
        }),
    },
    
    // Test directory relative to this file
    testDir: '../tests',
    
    // Global retries and workers (can be overridden per suite)
    retries: 1,
    workers: 1,

    // Define test suites/projects
    projects: [
        {
            name: 'Hoonuit_SIS_Login_Tests',
            testMatch: ['login.spec.ts'],
            testIgnore: [],
            metadata: {
                config: {
                    hoonuit_sis: {
                        environment: 'qa',
                        user: 'adminUser',
                    }
                },
            },
            use: {
                ...getBrowserDevice('chrome')
            },
        },
        {
            name: 'Hoonuit_SIS_Smoke_Tests',
            testMatch: ['**/smoke-*.spec.ts'],
            testIgnore: [],
            metadata: {
                config: {
                    hoonuit_sis: {
                        environment: 'qa',
                        user: 'adminUser',
                    }
                },
            },
            workers: 1, // Run smoke tests sequentially
            use: {
                ...getBrowserDevice('chrome')
            },
        },
        {
            name: 'Hoonuit_SIS_Regression_Tests',
            testMatch: ['**/*.spec.ts'],
            testIgnore: ['login.spec.ts', '**/smoke-*.spec.ts'], // Exclude login and smoke tests
            metadata: {
                config: {
                    hoonuit_sis: {
                        environment: 'qa',
                        user: 'adminUser',
                    }
                },
            },
            workers: 2, // Can run regression tests in parallel
            use: {
                ...getBrowserDevice('chrome')
            },
        }
    ]
});