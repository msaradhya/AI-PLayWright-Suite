/**
 * Zephyr Scale Reporter
 * Integrates with Atlassian JIRA and Zephyr Scale for test case management
 * 
 * Required Environment Variables:
 * - JIRA_ENABLED: Set to 'true' to enable
 * - JIRA_SERVER: JIRA server URL (e.g., https://company.atlassian.net)
 * - JIRA_API_TOKEN: API token for authentication
 * - JIRA_USER_EMAIL: Email for Basic auth (used with API token)
 * - JIRA_PROJECT_KEY: Project key (e.g., UIHN)
 * - ZEPHYR_ACCESS_KEY: Zephyr Scale access key
 * - ZEPHYR_SECRET_KEY: Zephyr Scale secret key
 */

import { ConfigManager } from '../../../config/ConfigManager';
import { TestStatus, normalizeStatus } from '../ps-tcm-statistics';

/**
 * Zephyr test execution status
 */
export type ZephyrStatus = 'Pass' | 'Fail' | 'Blocked' | 'Not Executed' | 'In Progress';

/**
 * Test execution result for Zephyr
 */
export interface ZephyrTestExecution {
    testCaseKey: string;
    status: ZephyrStatus;
    executedById?: string;
    executionTime?: number;
    comment?: string;
    environment?: string;
    actualResult?: string;
}

/**
 * Test cycle information
 */
export interface ZephyrTestCycle {
    id?: string;
    key?: string;
    name: string;
    projectKey: string;
    description?: string;
    plannedStartDate?: string;
    plannedEndDate?: string;
    folderId?: string;
}

/**
 * Zephyr API response
 */
export interface ZephyrApiResponse {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Zephyr Scale Reporter Class
 */
export class ZephyrReporter {
    private readonly configManager = ConfigManager.getInstance();
    private readonly jiraSettings;
    private testCycleKey?: string;

    constructor() {
        this.jiraSettings = this.configManager.getJiraSettings();
    }

    /**
     * Check if Zephyr integration is configured
     */
    isConfigured(): boolean {
        return this.jiraSettings.enabled && 
               !!(this.jiraSettings.server && this.jiraSettings.apiToken);
    }

    /**
     * Get JIRA API headers
     */
    private getJiraHeaders(): Record<string, string> {
        const email = process.env.JIRA_USER_EMAIL || '';
        const token = this.jiraSettings.apiToken;
        const auth = Buffer.from(`${email}:${token}`).toString('base64');

        return {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Get Zephyr Scale API headers
     */
    private getZephyrHeaders(): Record<string, string> {
        const accessKey = this.jiraSettings.zephyrAccessKey;
        
        return {
            'Authorization': `Bearer ${accessKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Map test status to Zephyr status
     */
    mapStatusToZephyr(status: TestStatus, isIntermittent: boolean = false): ZephyrStatus {
        if (isIntermittent) {
            // Intermittent tests that passed get marked as Pass with caution comment
            return 'Pass';
        }

        const normalizedStatus = normalizeStatus(status);
        
        switch (normalizedStatus) {
            case 'passed':
                return 'Pass';
            case 'failed':
                return 'Fail';
            case 'skipped':
                return 'Not Executed';
            default:
                return 'Not Executed';
        }
    }

    /**
     * Create a test cycle for the test run
     */
    async createTestCycle(cycleName: string, description?: string): Promise<ZephyrApiResponse> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Zephyr not configured' };
        }

        const url = `${this.jiraSettings.server}/rest/atm/1.0/testrun`;
        const payload: ZephyrTestCycle = {
            name: cycleName,
            projectKey: this.jiraSettings.projectKey,
            description: description || `Automated test run - ${new Date().toISOString()}`
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getZephyrHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                this.testCycleKey = data.key;
                console.log(`✓ Created test cycle: ${data.key}`);
                return { success: true, data };
            } else {
                const errorText = await response.text();
                console.error(`✗ Failed to create test cycle: ${response.status} - ${errorText}`);
                return { success: false, error: errorText };
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error(`✗ Zephyr API error: ${errorMsg}`);
            return { success: false, error: errorMsg };
        }
    }

    /**
     * Report a single test execution to Zephyr
     */
    async reportTestExecution(execution: ZephyrTestExecution): Promise<ZephyrApiResponse> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Zephyr not configured' };
        }

        // Zephyr Scale Cloud API endpoint
        const url = `${this.jiraSettings.server}/rest/atm/1.0/testresult`;
        
        const payload = {
            projectKey: this.jiraSettings.projectKey,
            testCaseKey: execution.testCaseKey,
            status: execution.status,
            environment: execution.environment || this.configManager.getEnvironment(),
            executionTime: execution.executionTime,
            comment: execution.comment,
            actualResult: execution.actualResult
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getZephyrHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorText = await response.text();
                return { success: false, error: `${response.status}: ${errorText}` };
            }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    }

    /**
     * Report multiple test executions
     */
    async reportTestExecutions(executions: ZephyrTestExecution[]): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }> {
        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        for (const execution of executions) {
            const result = await this.reportTestExecution(execution);
            if (result.success) {
                results.success++;
            } else {
                results.failed++;
                results.errors.push(`${execution.testCaseKey}: ${result.error}`);
            }
        }

        console.log(`Zephyr report: ${results.success} succeeded, ${results.failed} failed`);
        return results;
    }

    /**
     * Get test case details from Zephyr
     */
    async getTestCase(testCaseKey: string): Promise<ZephyrApiResponse> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Zephyr not configured' };
        }

        const url = `${this.jiraSettings.server}/rest/atm/1.0/testcase/${testCaseKey}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getZephyrHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorText = await response.text();
                return { success: false, error: `${response.status}: ${errorText}` };
            }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    }

    /**
     * Link a JIRA issue to a test case
     */
    async linkIssueToTestCase(testCaseKey: string, issueKey: string): Promise<ZephyrApiResponse> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Zephyr not configured' };
        }

        const url = `${this.jiraSettings.server}/rest/atm/1.0/testcase/${testCaseKey}/tracelinks`;
        
        const payload = {
            issueLinks: [issueKey]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getZephyrHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                const errorText = await response.text();
                return { success: false, error: `${response.status}: ${errorText}` };
            }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    }

    /**
     * Create a bug in JIRA for a failed test
     */
    async createBugForFailedTest(
        testCaseKey: string,
        summary: string,
        description: string,
        priority: string = 'Medium'
    ): Promise<ZephyrApiResponse> {
        if (!this.isConfigured()) {
            return { success: false, error: 'JIRA not configured' };
        }

        const url = `${this.jiraSettings.server}/rest/api/3/issue`;
        
        const payload = {
            fields: {
                project: {
                    key: this.jiraSettings.projectKey
                },
                summary: `[Auto] ${summary}`,
                description: {
                    type: 'doc',
                    version: 1,
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: description
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: `Test Case: ${testCaseKey}`
                                }
                            ]
                        }
                    ]
                },
                issuetype: {
                    name: 'Bug'
                },
                priority: {
                    name: priority
                },
                labels: ['automated-test-failure']
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getJiraHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✓ Created bug: ${data.key}`);
                
                // Link the bug to the test case
                await this.linkIssueToTestCase(testCaseKey, data.key);
                
                return { success: true, data };
            } else {
                const errorText = await response.text();
                return { success: false, error: `${response.status}: ${errorText}` };
            }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : String(error) };
        }
    }

    /**
     * Generate Zephyr cycle name based on configuration
     */
    generateCycleName(): string {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        
        let cycleName = this.jiraSettings.zephyrCycleName || 'Automated_Test_Run_{date}_{time}';
        cycleName = cycleName.replace('{date}', dateStr);
        cycleName = cycleName.replace('{time}', timeStr);
        
        return cycleName;
    }

    /**
     * Get current test cycle key
     */
    getTestCycleKey(): string | undefined {
        return this.testCycleKey;
    }

    /**
     * Set test cycle key (for using existing cycle)
     */
    setTestCycleKey(key: string): void {
        this.testCycleKey = key;
    }
}

/**
 * Factory function to create ZephyrReporter
 */
export function createZephyrReporter(): ZephyrReporter | null {
    const reporter = new ZephyrReporter();
    if (reporter.isConfigured()) {
        return reporter;
    }
    console.log('⚠ Zephyr integration not configured. Set JIRA_ENABLED=true and provide credentials.');
    return null;
}