/**
 * Suite Runner Utilities
 *
 * This module provides utilities for loading and managing test suites,
 * including configuration management and validation.
 *
 * Used by test-wrapper.ts for suite-specific configuration loading.
 */

import * as fs from 'fs';
import * as path from 'path';

// Dynamic import for config module - handles cases where it may not be installed
let configModule: any = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    configModule = require('config');
} catch {
    // Config module not available - config override features will be disabled
    configModule = null;
}

/**
 * Custom error for suite configuration issues
 */
export class SuiteConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SuiteConfigError';
        Object.setPrototypeOf(this, SuiteConfigError.prototype);
    }
}

/**
 * Custom error for suite validation issues
 */
export class SuiteValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SuiteValidationError';
        Object.setPrototypeOf(this, SuiteValidationError.prototype);
    }
}

/**
 * Interface for suite configuration
 */
export interface SuiteConfig {
    name: string;
    description?: string;
    tests?: TestConfig[];
    config?: Record<string, any>;
    metadata?: Record<string, any>;
}

/**
 * Interface for individual test configuration within a suite
 */
export interface TestConfig {
    name: string;
    tcmId?: string;
    enabled?: boolean;
    config?: Record<string, any>;
    tags?: string[];
    dependsOn?: string[];
}

/**
 * Options for loading a suite
 */
export interface SuiteLoadOptions {
    /** Whether to override global config with suite config */
    overrideConfig?: boolean;
    /** Whether to validate the suite structure */
    validateSuite?: boolean;
    /** Whether to load test-specific configurations */
    loadTestsConfig?: boolean;
    /** Specific test name to load config for */
    testName?: string;
}

/**
 * Result of loading a suite
 */
export interface SuiteLoadResult {
    /** The loaded suite configuration */
    suite: SuiteConfig;
    /** Whether config was overridden */
    configOverridden: boolean;
    /** Any warnings during loading */
    warnings: string[];
    /** Test-specific config if requested */
    testConfig?: TestConfig;
}

/**
 * SuiteLoader - Utility class for loading and managing test suites
 */
export class SuiteLoader {
    private static suiteCache: Map<string, SuiteConfig> = new Map();

    /**
     * Load a suite from a JSON file
     * 
     * @param suitePath - Path to the suite JSON file
     * @param options - Loading options
     * @returns SuiteLoadResult with suite data and metadata
     * @throws SuiteConfigError if file cannot be read or parsed
     * @throws SuiteValidationError if suite structure is invalid
     */
    static loadSuite(suitePath: string, options: SuiteLoadOptions = {}): SuiteLoadResult {
        const {
            overrideConfig = false,
            validateSuite = true,
            loadTestsConfig = false,
            testName
        } = options;

        const warnings: string[] = [];
        let configOverridden = false;
        let testConfig: TestConfig | undefined;

        // Check if suite is cached
        if (this.suiteCache.has(suitePath)) {
            const suite = this.suiteCache.get(suitePath)!;
            
            if (loadTestsConfig && testName) {
                testConfig = this.findTestConfig(suite, testName);
            }
            
            return { suite, configOverridden: false, warnings, testConfig };
        }

        // Check if file exists
        if (!fs.existsSync(suitePath)) {
            throw new SuiteConfigError(`Suite file not found: ${suitePath}`);
        }

        // Read and parse the suite file
        let suite: SuiteConfig;
        try {
            const content = fs.readFileSync(suitePath, 'utf-8');
            suite = JSON.parse(content);
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new SuiteConfigError(`Invalid JSON in suite file: ${suitePath}`);
            }
            throw new SuiteConfigError(`Failed to read suite file: ${suitePath} - ${error}`);
        }

        // Validate suite structure
        if (validateSuite) {
            this.validateSuiteStructure(suite);
        }

        // Override global config if requested
        if (overrideConfig && suite.config) {
            if (configModule && configModule.util) {
                try {
                    configModule.util.extendDeep(configModule, suite.config);
                    configOverridden = true;
                } catch (error) {
                    warnings.push(`Failed to override config: ${error}`);
                }
            } else {
                warnings.push('Config module not available - skipping config override');
            }
        }

        // Find test-specific config
        if (loadTestsConfig && testName) {
            testConfig = this.findTestConfig(suite, testName);
            
            if (testConfig?.config && overrideConfig) {
                if (configModule && configModule.util) {
                    try {
                        configModule.util.extendDeep(configModule, testConfig.config);
                    } catch (error) {
                        warnings.push(`Failed to apply test-specific config: ${error}`);
                    }
                } else {
                    warnings.push('Config module not available - skipping test-specific config override');
                }
            }
        }

        // Cache the suite
        this.suiteCache.set(suitePath, suite);

        return { suite, configOverridden, warnings, testConfig };
    }

    /**
     * Validate suite structure
     * 
     * @param suite - Suite configuration to validate
     * @throws SuiteValidationError if structure is invalid
     */
    private static validateSuiteStructure(suite: SuiteConfig): void {
        if (!suite) {
            throw new SuiteValidationError('Suite is null or undefined');
        }

        if (!suite.name || typeof suite.name !== 'string') {
            throw new SuiteValidationError('Suite must have a valid name property');
        }

        if (suite.tests && !Array.isArray(suite.tests)) {
            throw new SuiteValidationError('Suite tests must be an array');
        }

        if (suite.config && typeof suite.config !== 'object') {
            throw new SuiteValidationError('Suite config must be an object');
        }

        // Validate each test if present
        if (suite.tests) {
            suite.tests.forEach((test, index) => {
                if (!test.name || typeof test.name !== 'string') {
                    throw new SuiteValidationError(`Test at index ${index} must have a valid name`);
                }
            });
        }
    }

    /**
     * Find test configuration by name or TCM ID
     * 
     * @param suite - Suite configuration
     * @param nameOrTcmId - Test name or TCM ID to find
     * @returns TestConfig if found, undefined otherwise
     */
    private static findTestConfig(suite: SuiteConfig, nameOrTcmId: string): TestConfig | undefined {
        if (!suite.tests) {
            return undefined;
        }

        return suite.tests.find(test => 
            test.name === nameOrTcmId || 
            test.tcmId === nameOrTcmId
        );
    }

    /**
     * Clear the suite cache
     */
    static clearCache(): void {
        this.suiteCache.clear();
    }

    /**
     * Check if a suite is cached
     * 
     * @param suitePath - Path to check
     * @returns true if cached
     */
    static isCached(suitePath: string): boolean {
        return this.suiteCache.has(suitePath);
    }

    /**
     * Get all cached suite paths
     * 
     * @returns Array of cached suite paths
     */
    static getCachedPaths(): string[] {
        return Array.from(this.suiteCache.keys());
    }

    /**
     * Create a default suite configuration
     * 
     * @param name - Suite name
     * @param options - Optional suite configuration
     * @returns SuiteConfig
     */
    static createSuite(name: string, options: Partial<SuiteConfig> = {}): SuiteConfig {
        return {
            name,
            description: options.description || '',
            tests: options.tests || [],
            config: options.config || {},
            metadata: options.metadata || {}
        };
    }

    /**
     * Save a suite to a file
     * 
     * @param suite - Suite configuration to save
     * @param filePath - Path to save to
     */
    static saveSuite(suite: SuiteConfig, filePath: string): void {
        const dir = path.dirname(filePath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, JSON.stringify(suite, null, 2), 'utf-8');
    }

    /**
     * Merge two suite configurations
     * 
     * @param base - Base suite
     * @param override - Suite to merge on top
     * @returns Merged SuiteConfig
     */
    static mergeSuites(base: SuiteConfig, override: Partial<SuiteConfig>): SuiteConfig {
        return {
            name: override.name || base.name,
            description: override.description || base.description,
            tests: override.tests ? [...(base.tests || []), ...override.tests] : base.tests,
            config: { ...base.config, ...override.config },
            metadata: { ...base.metadata, ...override.metadata }
        };
    }
}

/**
 * Utility function to get suite file path from environment
 * 
 * @returns Suite file path or undefined
 */
export function getSuiteFilePath(): string | undefined {
    return process.env.SUITE_FILE_PATH;
}

/**
 * Utility function to check if running in suite mode
 * 
 * @returns true if SUITE_FILE_PATH is set
 */
export function isRunningInSuiteMode(): boolean {
    return !!process.env.SUITE_FILE_PATH;
}

// Default export for convenience
export default SuiteLoader;