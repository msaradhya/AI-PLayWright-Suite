/**
 * Playwright Slack Reporter
 * Specialized Slack sender for Playwright test results
 * Includes PowerSchool-style statistics and formatted reports
 */

import { SlackSender, SlackMessage, SlackMessageBlock } from './slack-sender';
import { PSReportInfo } from '../ps-report-info';
import { PSDateTime, PSDuration } from '../ps-datetime';
import { PSStringBuilder } from '../ps-string-builder';
import { PSTcmResultStatistics } from '../ps-tcm-statistics';
import { ConfigManager } from '../../../config/ConfigManager';

/**
 * Test summary data for Slack reporting
 */
export interface PlaywrightTestSummary {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    duration: number;
    startTime: Date | number;
    endTime: Date | number;
    reportInfo: PSReportInfo;
    // PowerSchool-style statistics
    psStatistics?: PSTcmResultStatistics;
    tcmTotal?: number;
    tcmPassed?: number;
    tcmFailed?: number;
    tcmSkipped?: number;
    tcmIntermittent?: number;
}

/**
 * Playwright Slack Report Sender
 * Sends formatted test results to Slack with PowerSchool statistics
 */
export class PlaywrightSlackReportSender extends SlackSender {
    private readonly testSummary: PlaywrightTestSummary;
    private readonly reportUrl?: string;
    private readonly slackConfigManager = ConfigManager.getInstance();

    constructor(testSummary: PlaywrightTestSummary, reportUrl?: string) {
        // Get channels from config or environment
        const slackSettings = ConfigManager.getInstance().getSlackReportSettings();
        super(...slackSettings.channels);
        
        this.testSummary = testSummary;
        this.reportUrl = reportUrl || process.env.AZURE_REPORT_URL;

        // Build message texts
        this.addMessageTexts(
            this.messageTitleText,
            this.messageContentText,
            this.linksText
        );
    }

    /**
     * Get the formatted title text for the Slack message
     */
    private get messageTitleText(): string {
        const emoji = this.getStatusEmoji();
        return `${emoji} *${this.testSummary.reportInfo.text}*`;
    }

    /**
     * Get the main content text with statistics
     */
    private get messageContentText(): string {
        const { total, passed, failed, skipped, flaky, reportInfo, psStatistics } = this.testSummary;
        
        const messageBuilder: PSStringBuilder = new PSStringBuilder();
        
        // Calculate timestamps
        const startTimestamp = typeof reportInfo.startTimestamp === 'number' 
            ? reportInfo.startTimestamp 
            : new Date(reportInfo.startTimestamp).getTime();
        const endTimestamp = typeof reportInfo.endTimestamp === 'number'
            ? reportInfo.endTimestamp
            : new Date(reportInfo.endTimestamp).getTime();
        
        // Use PowerSchool statistics if available
        let ranCount: number, plannedCount: number, passTotalCount: number;
        let runToPlanPercentage: number, passToRunPercentage: number, passToPlanPercentage: number;
        let intermittentPercentage: number;
        
        if (psStatistics) {
            ranCount = psStatistics.ranCount;
            plannedCount = psStatistics.plannedCount;
            passTotalCount = psStatistics.passTotalCount;
            runToPlanPercentage = psStatistics.runToPlanPercentage;
            passToRunPercentage = psStatistics.passToRunPercentage;
            passToPlanPercentage = psStatistics.passToPlanPercentage;
            intermittentPercentage = psStatistics.intermittentFailurePercentage;
        } else {
            // Fallback calculations
            ranCount = passed + failed;
            plannedCount = total;
            passTotalCount = passed;
            runToPlanPercentage = plannedCount > 0 ? Math.round((ranCount / plannedCount) * 100) : 0;
            passToRunPercentage = ranCount > 0 ? Math.round((passTotalCount / ranCount) * 100) : 0;
            passToPlanPercentage = plannedCount > 0 ? Math.round((passTotalCount / plannedCount) * 100) : 0;
            intermittentPercentage = plannedCount > 0 ? Math.round((flaky / plannedCount) * 100) : 0;
        }

        // Build message content
        messageBuilder.append(`> *Start Date/Time:* ${PSDateTime.fromEpoch(startTimestamp).format('{MM}/{dd}/{yyyy} {HH}:{mm}:{ss} {z}')}`).return();
        messageBuilder.append(`> *End Date/Time:* ${PSDateTime.fromEpoch(endTimestamp).format('{MM}/{dd}/{yyyy} {HH}:{mm}:{ss} {z}')}`).return();
        messageBuilder.append(`> *Test Duration:* ${PSDuration.of(endTimestamp - startTimestamp).text}`).return();
        messageBuilder.append(`> *Run to Plan:* ${runToPlanPercentage}% (${ranCount} / ${plannedCount})`).return();
        messageBuilder.append(`> *Pass to Run:* ${passToRunPercentage}% (${passTotalCount} / ${ranCount})`).return();
        messageBuilder.append(`> *Pass to Plan:* ${passToPlanPercentage}% (${passTotalCount} / ${plannedCount})`).return();
        messageBuilder.append(`> *Intermittent Failure:* ${intermittentPercentage}%`).return();
        messageBuilder.append(`> *Total Passed / Total Planned:* ${passTotalCount} / ${plannedCount}`).return();

        // Add TCM statistics if available
        if (this.testSummary.tcmTotal !== undefined) {
            messageBuilder.append(`> *TCM Cases:* ${this.testSummary.tcmPassed}/${this.testSummary.tcmTotal} passed`).return();
        }

        return messageBuilder.text;
    }

    /**
     * Get the links text (pipeline, reports, artifacts)
     */
    private get linksText(): string {
        const links: string[] = [];

        // Pipeline link
        const pipelineLink = this.getPipelineLink();
        if (pipelineLink) {
            links.push(`<${pipelineLink}|Pipeline>`);
        } else {
            links.push('Local Run');
        }

        // Report URL (Azure blob storage or other)
        if (this.reportUrl) {
            links.push(`<${this.reportUrl}/report.html|Test Report>`);
            links.push(`<${this.reportUrl}/report.timeline.test.html|Timeline Report>`);
            links.push(`<${this.reportUrl}|Files>`);
        } else if (this.getGitHubArtifactLink()) {
            links.push(`<${this.getGitHubArtifactLink()}|Artifacts>`);
        }

        return `> ${links.join(' / ')}`;
    }

    /**
     * Get status emoji based on test results
     */
    private getStatusEmoji(): string {
        const { failed, flaky, total, passed } = this.testSummary;
        
        if (failed > 0) {
            return '❌';
        } else if (flaky > 0) {
            return '⚠️';
        } else if (passed === total) {
            return '✅';
        }
        return '📊';
    }

    /**
     * Get GitHub Actions pipeline link
     */
    private getPipelineLink(): string | undefined {
        const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;

        if (GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID) {
            return `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
        }

        // Check for GitLab CI
        const { CI_PROJECT_URL, CI_PIPELINE_ID } = process.env;
        if (CI_PROJECT_URL && CI_PIPELINE_ID) {
            return `${CI_PROJECT_URL}/-/pipelines/${CI_PIPELINE_ID}`;
        }

        return undefined;
    }

    /**
     * Get GitHub Actions artifacts link
     */
    private getGitHubArtifactLink(): string | undefined {
        const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;

        if (GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID) {
            return `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}#artifacts`;
        }

        return undefined;
    }

    /**
     * Build the complete Slack message with blocks
     */
    buildSlackMessage(): SlackMessage {
        const blocks: SlackMessageBlock[] = [];
        const emoji = this.getStatusEmoji();

        // Header block
        blocks.push({
            type: 'header',
            text: {
                type: 'plain_text',
                text: `${emoji} ${this.testSummary.reportInfo.text}`,
                emoji: true
            }
        });

        // Content block
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: this.messageContentText
            }
        });

        // Divider
        blocks.push({ type: 'divider' });

        // Links block
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: this.linksText
            }
        });

        // Context/footer
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `Environment: ${this.testSummary.reportInfo.environment} | Location: ${this.testSummary.reportInfo.environmentLocation}`
                }
            ]
        });

        return {
            text: this.messageTitleText,
            blocks
        };
    }

    /**
     * Send the formatted test report to Slack
     */
    async sendReport(): Promise<boolean> {
        const slackSettings = this.slackConfigManager.getSlackReportSettings();
        
        if (!slackSettings.enabled) {
            console.log('⚠ Slack reporting is disabled');
            return false;
        }

        const message = this.buildSlackMessage();
        const response = await this.send(message);
        
        if (Array.isArray(response)) {
            return response.every(r => r.ok);
        }
        return response.ok;
    }

    /**
     * Static factory method to create and send a report
     */
    static async sendTestReport(
        testSummary: PlaywrightTestSummary,
        reportUrl?: string
    ): Promise<boolean> {
        const sender = new PlaywrightSlackReportSender(testSummary, reportUrl);
        return sender.sendReport();
    }
}

/**
 * Create a simple failure notification
 */
export function createFailureNotification(
    testTitle: string,
    errorMessage: string,
    specFile?: string
): SlackMessage {
    return {
        text: `❌ Test Failed: ${testTitle}`,
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: '❌ Test Failure Detected',
                    emoji: true
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: [
                        `*Test:* ${testTitle}`,
                        specFile ? `*File:* \`${specFile}\`` : '',
                        `*Error:* \`\`\`${errorMessage.substring(0, 500)}${errorMessage.length > 500 ? '...' : ''}\`\`\``
                    ].filter(Boolean).join('\n')
                }
            }
        ]
    };
}

/**
 * Create a success notification
 */
export function createSuccessNotification(
    suiteName: string,
    passedCount: number,
    totalCount: number,
    duration: number
): SlackMessage {
    return {
        text: `✅ ${suiteName}: All ${passedCount} tests passed`,
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `✅ ${suiteName}`,
                    emoji: true
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: [
                        `> *Result:* All ${passedCount}/${totalCount} tests passed`,
                        `> *Duration:* ${PSDuration.of(duration).text}`
                    ].join('\n')
                }
            }
        ]
    };
}