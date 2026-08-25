/**
 * ConfigManager - Single Source of Truth for All Configuration
 *
 * This class consolidates all configuration management into one place:
 * - Environment URLs (global defaults + test-specific overrides)
 * - User credentials (global defaults + test-specific users)
 * - Feature flags
 * - Runtime settings
 *
 * Usage:
 *   const config = ConfigManager.getInstance();
 *   const baseUrl = config.getBaseUrl();
 *   const credentials = config.getUserCredentials('adminUser');
 *
 * For Test-Specific Users/URLs:
 *   - Use test-specific user classes (e.g., HoonuitIntegrationUsers)
 *   - Use getUrlForEnvironment() for non-default environments
 *   - Use registerCustomUser() to add test-specific users at runtime
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment-specific .env file
const envFile = `.env.${process.env.TEST_ENV || 'auto_aws_bronze'}`;
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

// Also load the base .env file for fallback values
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
    url: string;
    maintenanceUrl: string;
    maintenance_url?: string; // Alias for backward compatibility
    sisUrl?: string;
    sis?: string; // Alias for backward compatibility
    sisApiUrl?: string;
    sis_api?: string; // Alias for backward compatibility
    googleUrl?: string;
    google_url?: string; // Alias for backward compatibility
    microsoftUrl?: string;
    microsoft_url?: string; // Alias for backward compatibility
    multiTenantUrl?: string;
    multi_tenant_maintenance_url?: string;
    kickboardUrl?: string;
    dev_tenant_url?: string;
    client_id?: string;
    client_secret?: string;
    newrelic_url?: string;
    webhook_api?: string;
    [key: string]: string | undefined;
}

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
    user: string;
    password: string;
    server: string;
    name: string;
    port: number;
}

/**
 * Jira/Zephyr settings interface
 */
export interface JiraSettings {
    enabled: boolean;
    jiraServer: string;
    server: string;
    jiraLogin: string;
    apiToken: string;
    projectKey: string;
    zephyrAccountId: string;
    zephyrSharedSecret: string;
    zephyrAccessKey: string;
    zephyrVersionName: string;
    zephyrCycleName: string;
}

/**
 * Slack report settings interface
 */
export interface SlackReportSettings {
    enabled: boolean;
    debug: boolean;
    powerBiEnabled: boolean;
    reportLinkEnabled: boolean;
    productName: string;
    productType: string;
    suiteType: string;
    environment: string;
    environmentLocation: string;
    releaseVersion: string;
    channels: string[];
}

/**
 * Auto rerun settings interface
 */
export interface AutoRerunSettings {
    maxRetryCount: number;
}

/**
 * Module configuration interface
 */
export interface ModuleConfig {
    config?: string;
    district?: string;
    login?: {
        use_login_pool?: boolean;
        use_specific_login?: string;
    } | string;
    profile?: string;
    resource_files?: string;
    assessment_importer_delete?: string;
    [key: string]: any;
}

/**
 * User credentials interface
 */
export interface UserCredentials {
    username: string;
    password: string;
    role?: string;
    district?: string;
}

/**
 * Browser configuration interface
 */
export interface BrowserConfig {
    headless: boolean;
    browserType: 'chromium' | 'firefox' | 'webkit';
    viewport: { width: number; height: number };
    timeout: number;
    chromePath?: string;
    chromeArgs: string[];
}

/**
 * Feature flags interface
 */
export interface FeatureFlags {
    enableAngularWait: boolean;
    enableSpinnerWait: boolean;
    defaultTimeout: number;
}

/**
 * Reporting configuration interface
 */
export interface ReportingConfig {
    slackEnabled: boolean;
    slackWebhookUrl?: string;
    jiraEnabled: boolean;
    jiraServer?: string;
    jiraApiToken?: string;
    jiraProjectKey?: string;
}

/**
 * Database configurations
 */
const DATABASE_CONFIGS: Record<string, DatabaseConfig> = {
    azure_sql_server: {
        user: process.env.DB_USER || 'poweradmin',
        password: process.env.DB_PASSWORD || 'Power@1234',
        server: process.env.DB_SERVER || '00generalqaautomation.database.windows.net',
        name: process.env.DB_NAME || 'TestDataQASISHoonuit',
        port: parseInt(process.env.DB_PORT || '1433', 10),
    },
    azure_ps5: {
        user: process.env.AZURE_PS5_DB_USER || 'k12intel_portal',
        password: process.env.AZURE_PS5_DB_PASSWORD || 'CbjEu-u6!9XeLAwyZRzB',
        server: '00uihd1pmia001.public.afad3913aa88.database.windows.net',
        name: 'K12INTEL_PORTAL_sisgoldps5_Bronze01',
        port: 3342,
    },
};

/**
 * Environment URL mappings - centralized configuration
 * Includes snake_case aliases for backward compatibility
 */
const ENVIRONMENT_URLS: Record<string, EnvironmentConfig> = {
    auto_aws_bronze: {
        url: 'https://sisgoldps5mig01.hoonuit.com/Dashboard/',
        maintenanceUrl: 'https://sisgoldps5mig01.hoonuit.com/Dashboard/login/login.jsp',
        maintenance_url: 'https://sisgoldps5mig01.hoonuit.com/Dashboard/login/login.jsp',
        sisUrl: 'https://sisinttest5.powerschool.com',
        sis: 'https://sisinttest5.powerschool.com',
        sisApiUrl: 'https://sisinttest5.powerschool.com',
        sis_api: 'https://sisinttest5.powerschool.com',
        googleUrl: 'https://sisgoldgoogledev1ps-dev.hoonuit.com/Dashboard',
        google_url: 'https://sisgoldgoogledev1ps-dev.hoonuit.com/Dashboard',
        microsoftUrl: 'https://sisgoldmsdev1ps-dev.hoonuit.com/Dashboard',
        microsoft_url: 'https://sisgoldmsdev1ps-dev.hoonuit.com/Dashboard',
        multiTenantUrl: 'https://awsmultiqa.hoonuit.com/Dashboard/login/login.jsp',
        multi_tenant_maintenance_url: 'https://awsmultiqa.hoonuit.com/Dashboard/login/login.jsp',
        kickboardUrl: 'https://qakickboardauto5.hoonuit.com/Dashboard/login/login.jsp',
        dev_tenant_url: 'https://sisgoldps5mig01-bronze01-dev.hoonuit.com/Dashboard/login/login.jsp',
        client_id: '4bcd5bea-77d4-4b62-9aa0-6d31ced687e9',
        client_secret: '33bed699-0422-464c-aef9-0ae141359876',
        newrelic_url: 'https://synthetics.newrelic.com/synthetics/api/v3/monitors',
        webhook_api: 'https://powerschool-co.alerts.freshservice.com',
    },
    auto_bronze: {
        url: 'https://sisgoldps5-dev.hoonuit.com/Dashboard/',
        maintenanceUrl: 'https://sisgoldps5-dev.hoonuit.com/Dashboard/login/login.jsp',
        maintenance_url: 'https://sisgoldps5-dev.hoonuit.com/Dashboard/login/login.jsp',
        sisUrl: 'https://ps266094.dv-use-01-env1.unified.powerschoolcorp.com',
        sis: 'https://ps266094.dv-use-01-env1.unified.powerschoolcorp.com',
        sisApiUrl: 'https://ps266094.dv-use-01-env1.unified.powerschoolcorp.com',
        sis_api: 'https://ps266094.dv-use-01-env1.unified.powerschoolcorp.com',
        googleUrl: 'https://sisgoldgoogledev1ps-dev.hoonuit.com/Dashboard',
        google_url: 'https://sisgoldgoogledev1ps-dev.hoonuit.com/Dashboard',
        microsoftUrl: 'https://sisgoldmsdev1ps-dev.hoonuit.com/Dashboard',
        microsoft_url: 'https://sisgoldmsdev1ps-dev.hoonuit.com/Dashboard',
        multiTenantUrl: 'https://bronzemultitenantazqa.hoonuit.com/Dashboard/login/login.jsp',
        multi_tenant_maintenance_url: 'https://bronzemultitenantazqa.hoonuit.com/Dashboard/login/login.jsp',
        kickboardUrl: 'https://qakickboardauto5.hoonuit.com/Dashboard/login/login.jsp',
        dev_tenant_url: 'https://sisgoldps5-bronze01-dev.hoonuit.com/Dashboard/login/login.jsp',
        client_id: '52c04704-765e-4170-b039-da86da70a8b0',
        client_secret: '590247cf-bd7c-443d-b2bd-787ea9d0088c',
        newrelic_url: 'https://synthetics.newrelic.com/synthetics/api/v3/monitors',
        webhook_api: 'https://powerschool-co.alerts.freshservice.com',
    },
    auto_silver: {
        url: 'https://sisgoldqa1-qa.hoonuit.com/Dashboard/',
        maintenanceUrl: 'https://sisgoldqa1-qa.hoonuit.com/Dashboard/login/login.jsp',
        maintenance_url: 'https://sisgoldqa1-qa.hoonuit.com/Dashboard/login/login.jsp',
        sisUrl: 'https://ps166238.qa-use-01-env1.unified.powerschoolcorp.com',
        sis: 'https://ps166238.qa-use-01-env1.unified.powerschoolcorp.com',
        sisApiUrl: 'https://ps166238.qa-use-01-env1.unified.powerschoolcorp.com',
        sis_api: 'https://ps166238.qa-use-01-env1.unified.powerschoolcorp.com',
        googleUrl: 'https://sisgoldgoogledev1ps-dev.hoonuit.com/Dashboard',
        google_url: 'https://sisgoldgoogledev1ps-dev.hoonuit.com/Dashboard',
        microsoftUrl: 'https://sisgoldmsdev1ps-dev.hoonuit.com/Dashboard',
        microsoft_url: 'https://sisgoldmsdev1ps-dev.hoonuit.com/Dashboard',
        client_id: '18b64833-aecd-4c79-9517-dcb86559e551',
        client_secret: 'f1588275-0236-4fe8-b874-37becc7d4ec4',
    },
    auto_portal_dev: {
        url: 'https://portaldev1.hoonuit.com/Dashboard/login/login.jsp',
        maintenanceUrl: 'https://portaldev1.hoonuit.com/Dashboard',
        maintenance_url: 'https://portaldev1.hoonuit.com/Dashboard',
        sisUrl: 'https://ps346607.dv-use-01-env1.unified.powerschoolcorp.com',
        sis: 'https://ps346607.dv-use-01-env1.unified.powerschoolcorp.com',
    },
    auto_bronze_portal: {
        url: 'https://portaldev1.hoonuit.com/Dashboard/',
        maintenanceUrl: 'https://portaldev1.hoonuit.com/Dashboard/login/login.jsp',
        maintenance_url: 'https://portaldev1.hoonuit.com/Dashboard/login/login.jsp',
        sisUrl: 'https://ps346607.dv-use-01-env1.unified.powerschoolcorp.com',
        sis: 'https://ps346607.dv-use-01-env1.unified.powerschoolcorp.com',
    },
};

/**
 * Default user credentials - can be overridden by environment variables
 */
const DEFAULT_USERS: Record<string, UserCredentials> = {
    adminUser: {
        username: 'sisEtlAdmin1',
        password: 'PSAutomation!',
        role: 'admin',
        district: 'UIHN Automation District',
    },
    teacherUser: {
        username: 'sisEtlTeacher1',
        password: 'PSAutomation!',
        role: 'teacher',
        district: 'UIHN Automation District',
    },
    etlAdmin_User1: {
        username: 'sisEtlAdmin1',
        password: 'PSAutomation!',
        role: 'sis_etl_admin',
        district: 'UIHN Automation District',
    },
    etlAdmin_User2: {
        username: 'sisEtlAdmin2',
        password: 'PSAutomation!',
        role: 'sis_etl_admin',
        district: 'UIHN Automation District',
    },
    etlACAAdmin_User1: {
        username: 'sisEtlAcaAdmin1',
        password: 'PSAutomation!',
        role: 'sis_etl_aca_admin',
        district: 'UIHN Automation District',
    },
    etlBehaviorAdmin_User1: {
        username: 'sisEtlBehaviorAdmin1',
        password: 'PSAutomation!',
        role: 'sis_etl_behavior_admin',
        district: 'UIHN Automation District',
    },
    etlTeacher_User1: {
        username: 'sisEtlTeacher1',
        password: 'PSAutomation!',
        role: 'sis_etl_teacher',
        district: 'UIHN Automation District',
    },
};

/**
 * ConfigManager - Singleton class for centralized configuration management
 */
export class ConfigManager {
    private static instance: ConfigManager;
    private currentEnvironment: string;
    private customUsers: Map<string, UserCredentials> = new Map();
    private customUrls: Map<string, string> = new Map();

    private constructor() {
        this.currentEnvironment = process.env.TEST_ENV || 'auto_aws_bronze';
    }

    /**
     * Get the singleton instance of ConfigManager
     */
    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    // ============================================
    // ENVIRONMENT METHODS
    // ============================================

    /**
     * Get the current environment name
     */
    getEnvironment(): string {
        return this.currentEnvironment;
    }

    /**
     * Set the current environment
     */
    setEnvironment(env: string): void {
        if (!ENVIRONMENT_URLS[env]) {
            console.warn(`Unknown environment: ${env}, falling back to auto_aws_bronze`);
            this.currentEnvironment = 'auto_aws_bronze';
        } else {
            this.currentEnvironment = env;
        }
    }

    /**
     * Get the full environment configuration
     */
    getEnvironmentConfig(): EnvironmentConfig {
        // First check for environment variable override
        const envOverrideUrl = process.env.BASE_URL;
        if (envOverrideUrl) {
            return {
                url: envOverrideUrl,
                maintenanceUrl: process.env.MAINTENANCE_URL || envOverrideUrl,
                sisUrl: process.env.SIS_URL,
                sisApiUrl: process.env.SIS_API_URL,
                googleUrl: process.env.GOOGLE_URL,
                microsoftUrl: process.env.MICROSOFT_URL,
            };
        }

        return ENVIRONMENT_URLS[this.currentEnvironment] || ENVIRONMENT_URLS.auto_aws_bronze;
    }

    /**
     * Get the base URL for the current environment
     */
    getBaseUrl(): string {
        return process.env.BASE_URL || this.getEnvironmentConfig().url;
    }

    /**
     * Get the maintenance URL for the current environment
     */
    getMaintenanceUrl(): string {
        return process.env.MAINTENANCE_URL || this.getEnvironmentConfig().maintenanceUrl;
    }

    /**
     * Get a specific URL by key
     */
    getUrl(key: keyof EnvironmentConfig): string {
        const keyStr = String(key);
        const envKey = keyStr.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '');
        const envValue = process.env[envKey];
        if (envValue) return envValue;

        return this.getEnvironmentConfig()[key] || '';
    }

    /**
     * Get URL for a specific environment (not the current one)
     * Useful for tests that need to connect to different environments
     */
    getUrlForEnvironment(envName: string, urlKey: keyof EnvironmentConfig = 'url'): string {
        const envConfig = ENVIRONMENT_URLS[envName];
        if (!envConfig) {
            console.warn(`Unknown environment: ${envName}`);
            return '';
        }
        return envConfig[urlKey] || '';
    }

    /**
     * Register a custom URL for test-specific scenarios
     * These override environment defaults
     */
    registerCustomUrl(key: string, url: string): void {
        this.customUrls.set(key, url);
    }

    /**
     * Get a custom registered URL
     */
    getCustomUrl(key: string): string | undefined {
        return this.customUrls.get(key);
    }

    /**
     * Clear all custom URLs (call in test teardown if needed)
     */
    clearCustomUrls(): void {
        this.customUrls.clear();
    }

    // ============================================
    // USER CREDENTIAL METHODS
    // ============================================

    /**
     * Get user credentials by user key
     * Priority: Custom registered users > Environment variables > Default users
     */
    getUserCredentials(userKey: string): UserCredentials {
        // Check custom registered users first (for test-specific users)
        const customUser = this.customUsers.get(userKey);
        if (customUser) {
            return { ...customUser };
        }

        // Build environment variable prefix based on user key
        const envPrefix = this.getEnvPrefixForUser(userKey);

        // Check environment variables
        const envUsername = process.env[`${envPrefix}_USERNAME`];
        const envPassword = process.env[`${envPrefix}_PASSWORD`];

        if (envUsername && envPassword) {
            return {
                username: envUsername,
                password: envPassword,
                role: DEFAULT_USERS[userKey]?.role,
                district: DEFAULT_USERS[userKey]?.district,
            };
        }

        // Fall back to default users
        const defaultUser = DEFAULT_USERS[userKey];
        if (defaultUser) {
            return { ...defaultUser };
        }

        // Ultimate fallback - use generic admin credentials
        return {
            username: process.env.ADMIN_USERNAME || 'sisEtlAdmin1',
            password: process.env.ADMIN_PASSWORD || 'PSAutomation!',
            role: 'admin',
            district: 'UIHN Automation District',
        };
    }

    /**
     * Register a custom user for test-specific scenarios
     * These override environment defaults and default users
     */
    registerCustomUser(userKey: string, credentials: UserCredentials): void {
        this.customUsers.set(userKey, credentials);
    }

    /**
     * Clear all custom users (call in test teardown if needed)
     */
    clearCustomUsers(): void {
        this.customUsers.clear();
    }

    /**
     * Convert User interface (from HoonuitIntegrationUsers) to UserCredentials
     * This allows compatibility with test-specific user classes
     */
    static convertToCredentials(user: { userName: string; password: string; role?: string; district?: string }): UserCredentials {
        return {
            username: user.userName,
            password: user.password,
            role: user.role,
            district: user.district,
        };
    }

    /**
     * Get admin credentials (convenience method)
     */
    getAdminCredentials(): UserCredentials {
        return this.getUserCredentials('adminUser');
    }

    /**
     * Get teacher credentials (convenience method)
     */
    getTeacherCredentials(): UserCredentials {
        return this.getUserCredentials('teacherUser');
    }

    /**
     * Convert user key to environment variable prefix
     */
    private getEnvPrefixForUser(userKey: string): string {
        const prefixMap: Record<string, string> = {
            adminUser: 'ADMIN',
            teacherUser: 'TEACHER',
            etlAdmin_User1: 'SIS_ETL_ADMIN_USER1',
            etlAdmin_User2: 'SIS_ETL_ADMIN_USER2',
            etlACAAdmin_User1: 'SIS_ETL_ACA_ADMIN_USER1',
            etlBehaviorAdmin_User1: 'SIS_ETL_BEHAVIOR_ADMIN_USER1',
            etlTeacher_User1: 'SIS_ETL_TEACHER_USER1',
        };

        return prefixMap[userKey] || userKey.toUpperCase();
    }

    // ============================================
    // BROWSER CONFIGURATION METHODS
    // ============================================

    /**
     * Get browser configuration
     */
    getBrowserConfig(): BrowserConfig {
        return {
            headless: process.env.HEADLESS !== 'false',
            browserType: (process.env.BROWSER_TYPE as 'chromium' | 'firefox' | 'webkit') || 'chromium',
            viewport: {
                width: parseInt(process.env.VIEWPORT_WIDTH || '1600', 10),
                height: parseInt(process.env.VIEWPORT_HEIGHT || '900', 10),
            },
            timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
            chromePath: process.env.CHROME_PATH,
            chromeArgs: [
                '--no-sandbox',
                '--lang=en',
                '--ignore-certificate-errors',
                '--window-size=1600,900',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
            ],
        };
    }

    // ============================================
    // FEATURE FLAGS METHODS
    // ============================================

    /**
     * Get feature flags
     */
    getFeatureFlags(): FeatureFlags {
        return {
            enableAngularWait: process.env.ENABLE_ANGULAR_WAIT !== 'false',
            enableSpinnerWait: process.env.ENABLE_SPINNER_WAIT !== 'false',
            defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
        };
    }

    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
        const flags = this.getFeatureFlags();
        const value = flags[featureName];
        return typeof value === 'boolean' ? value : false;
    }

    // ============================================
    // REPORTING CONFIGURATION METHODS
    // ============================================

    /**
     * Get reporting configuration
     */
    getReportingConfig(): ReportingConfig {
        return {
            slackEnabled: process.env.SLACK_ENABLED === 'true',
            slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
            jiraEnabled: process.env.JIRA_ENABLED === 'true',
            jiraServer: process.env.JIRA_SERVER || 'https://powerschoolgroup.atlassian.net',
            jiraApiToken: process.env.JIRA_API_TOKEN,
            jiraProjectKey: process.env.JIRA_PROJECT_KEY || 'UIHN',
        };
    }

    // ============================================
    // DATABASE CONFIGURATION METHODS
    // ============================================

    /**
     * Get database configuration by type
     */
    getDatabaseConfig(dbType: 'azure_sql_server' | 'azure_ps5'): DatabaseConfig {
        return DATABASE_CONFIGS[dbType];
    }

    // ============================================
    // JIRA/ZEPHYR SETTINGS METHODS
    // ============================================

    /**
     * Get Jira settings
     */
    getJiraSettings(): JiraSettings {
        return {
            enabled: process.env.JIRA_ENABLED === 'true',
            jiraServer: process.env.JIRA_SERVER || 'https://powerschoolgroup.atlassian.net',
            server: process.env.JIRA_SERVER || 'https://powerschoolgroup.atlassian.net',
            jiraLogin: process.env.JIRA_API_TOKEN || '',
            apiToken: process.env.JIRA_API_TOKEN || '',
            projectKey: process.env.JIRA_PROJECT_KEY || 'UIHN',
            zephyrAccountId: '5d0d317cc6c8340c472d4099',
            zephyrSharedSecret: process.env.ZEPHYR_SHARED_SECRET || '',
            zephyrAccessKey: process.env.ZEPHYR_ACCESS_KEY || '',
            zephyrVersionName: 'Hoonuit_SIS',
            zephyrCycleName: 'Hoonuit_SIS_{date}_{time}',
        };
    }

    // ============================================
    // SLACK REPORT SETTINGS METHODS
    // ============================================

    /**
     * Get Slack report settings
     * Supports SLACK_CHANNELS environment variable in JSON array or comma-separated format
     */
    getSlackReportSettings(): SlackReportSettings {
        // Parse channels from environment variable
        let channels: string[] = ['hoonuit-qa-automation'];
        const channelsEnv = process.env.SLACK_CHANNELS;
        
        if (channelsEnv) {
            try {
                // Try parsing as JSON array first
                if (channelsEnv.startsWith('[')) {
                    const parsed = JSON.parse(channelsEnv);
                    // Validate that the result is an array of strings
                    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                        channels = parsed.filter(c => c.trim().length > 0);
                    } else {
                        console.warn('SLACK_CHANNELS is not a valid string array, using default');
                    }
                } else {
                    // Fall back to comma-separated format
                    channels = channelsEnv.split(',').map(c => c.trim()).filter(c => c.length > 0);
                }
            } catch (e) {
                // If parsing fails, use as single channel
                const trimmed = channelsEnv.trim();
                if (trimmed.length > 0) {
                    channels = [trimmed];
                }
            }
        }
        
        // Ensure we always have at least one channel
        if (channels.length === 0) {
            channels = ['hoonuit-qa-automation'];
        }

        return {
            enabled: process.env.SLACK_ENABLED === 'true',
            debug: process.env.SLACK_DEBUG === 'true',
            powerBiEnabled: process.env.SLACK_POWERBI_ENABLED === 'true',
            reportLinkEnabled: process.env.SLACK_REPORT_LINK_ENABLED !== 'false',
            productName: process.env.SLACK_PRODUCT_NAME || 'Hoonuit SIS',
            productType: process.env.SLACK_PRODUCT_TYPE || 'SIS Integration',
            suiteType: process.env.SLACK_SUITE_TYPE || process.env.TEST_SUITE_TYPE || 'Regression',
            environment: process.env.SLACK_ENVIRONMENT || this.currentEnvironment,
            environmentLocation: process.env.SLACK_ENVIRONMENT_LOCATION || 'AWS',
            releaseVersion: process.env.SLACK_RELEASE_VERSION || process.env.RELEASE_VERSION || 'latest',
            channels: channels,
        };
    }

    // ============================================
    // AUTO RERUN SETTINGS
    // ============================================

    /**
     * Get auto rerun settings
     */
    getAutoRerunSettings(): AutoRerunSettings {
        return {
            maxRetryCount: parseInt(process.env.MAX_RETRIES || '1', 10),
        };
    }

    // ============================================
    // MODULE CONFIGURATION METHODS
    // ============================================

    /**
     * Get module configuration
     */
    getModuleConfig(moduleName: string): ModuleConfig | undefined {
        const adminCreds = this.getAdminCredentials();
        const loginString = `${adminCreds.username};${adminCreds.password}`;

        const moduleConfigs: Record<string, ModuleConfig> = {
            hoonuit_sis: {
                config: this.currentEnvironment,
                district: process.env.TEST_DISTRICT || '',
                login: {
                    use_login_pool: false,
                    use_specific_login: loginString,
                },
                assessment_importer_delete: 'false',
            },
            hoonuit: {
                config: this.currentEnvironment,
                assessment_importer_delete: 'false',
                login: {
                    use_login_pool: false,
                    use_specific_login: loginString,
                },
            },
            mtss: {
                config: this.currentEnvironment,
                login: {
                    use_login_pool: false,
                    use_specific_login: loginString,
                },
            },
        };

        return moduleConfigs[moduleName];
    }

    // ============================================
    // BACKWARD COMPATIBILITY METHODS
    // ============================================

    /**
     * Get environment URLs in legacy format (for backward compatibility)
     * @deprecated Use getEnvironmentConfig() instead
     */
    getEnvironmentUrls(env?: string): EnvironmentConfig {
        const envName = env || this.currentEnvironment;
        return ENVIRONMENT_URLS[envName] || ENVIRONMENT_URLS.auto_aws_bronze;
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Check if dry run mode is enabled
     */
    isDryRunEnabled(): boolean {
        return process.env.DRY_RUN === 'true';
    }

    /**
     * Get max retry count for tests
     */
    getMaxRetryCount(): number {
        return parseInt(process.env.MAX_RETRIES || '1', 10);
    }

    /**
     * Get the test module name
     */
    getTestModule(): string {
        return process.env.TEST_MODULE || 'hoonuit_sis';
    }

    /**
     * Get timezone setting
     */
    getTimezone(): string {
        return process.env.TIMEZONE || 'America/New_York';
    }

    /**
     * Get all available environment names
     */
    getAvailableEnvironments(): string[] {
        return Object.keys(ENVIRONMENT_URLS);
    }

    /**
     * Get all available user keys
     */
    getAvailableUserKeys(): string[] {
        return Object.keys(DEFAULT_USERS);
    }

    /**
     * Debug: Print current configuration (safe - no passwords)
     */
    printConfig(): void {
        console.log('=== ConfigManager Configuration ===');
        console.log(`Environment: ${this.currentEnvironment}`);
        console.log(`Base URL: ${this.getBaseUrl()}`);
        console.log(`Headless: ${this.getBrowserConfig().headless}`);
        console.log(`Browser: ${this.getBrowserConfig().browserType}`);
        console.log(`Angular Wait: ${this.getFeatureFlags().enableAngularWait}`);
        console.log(`Spinner Wait: ${this.getFeatureFlags().enableSpinnerWait}`);
        console.log(`Dry Run: ${this.isDryRunEnabled()}`);
        console.log(`Custom Users Registered: ${this.customUsers.size}`);
        console.log(`Custom URLs Registered: ${this.customUrls.size}`);
        console.log('===================================');
    }

    /**
     * Reset all runtime customizations (users, urls)
     * Useful for test cleanup
     */
    resetCustomizations(): void {
        this.customUsers.clear();
        this.customUrls.clear();
    }
}

// Export singleton instance for convenience
export const configManager = ConfigManager.getInstance();

// Export default for backward compatibility
export default ConfigManager;