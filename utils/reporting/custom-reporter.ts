/**
 * Custom Playwright Reporter for PW_AI_hoonuit_suite
 * 
 * Features:
 * - TCM (Test Case Management) tracking and grouping
 * - Retry attempt tracking with screenshots
 * - Timeline report generation
 * - PowerSchool-style statistics (Run to Plan, Pass to Run, etc.)
 * - App Bug and Repair categorization
 * - Intermittent failure detection
 * - Slack integration with Azure URL support
 * - JIRA/Zephyr integration
 * - Multiple report formats (JSON, HTML Timeline, etc.)
 */

import {
    Reporter,
    FullConfig,
    Suite,
    TestCase,
    TestResult,
    TestStep,
    FullResult
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import { PSDateTime, PSDuration } from './ps-datetime';
import { PSReportInfo } from './ps-report-info';
import { PSStringBuilder } from './ps-string-builder';
import { PSTcmResultStatistics, TCMGroupedResult, PSTcmTestResultType, TestStatus, normalizeStatus } from './ps-tcm-statistics';
import { ConfigManager } from '../../config/ConfigManager';

// ============================================
// INTERFACES
// ============================================

/**
 * Test result with enhanced tracking information
 */
export interface EnhancedTestResult {
    tcmId: string;
    title: string;
    fullTitle: string;
    status: TestStatus;
    duration: number;
    retryCount: number;
    isIntermittent: boolean;
    specFile: string;
    projectName: string;
    error?: {
        message: string;
        stack?: string;
    };
    screenshots: string[];
    retryAttempts: RetryAttempt[];
    startTime: number;
    endTime: number;
    annotations: Array<{ type: string; description?: string }>;
}

/**
 * Retry attempt information
 */
export interface RetryAttempt {
    attemptNumber: number;
    status: TestStatus;
    duration: number;
    error?: {
        message: string;
        stack?: string;
    };
    screenshots: string[];
    startTime: number;
    endTime: number;
}

/**
 * Timeline entry for timeline report
 */
export interface TimelineEntry {
    tcmId: string;
    title: string;
    status: string;
    startTime: number;
    endTime: number;
    duration: number;
    retryCount: number;
    isIntermittent: boolean;
    specFile: string;
}

/**
 * Report summary data
 */
export interface ReportSummary {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    duration: number;
    startTime: number;
    endTime: number;
    tcmPassed: number;
    tcmFailed: number;
    tcmSkipped: number;
    tcmTotal: number;
    tcmIntermittent: number;
    psStatistics: ReturnType<PSTcmResultStatistics['toJSON']>;
}

// ============================================
// CUSTOM REPORTER CLASS
// ============================================

class CustomReporter implements Reporter {
    private config!: FullConfig;
    private runFolder: string = '';
    private startTime: number = 0;
    private endTime: number = 0;
    private testResults: EnhancedTestResult[] = [];
    private tcmGroups: Map<string, EnhancedTestResult[]> = new Map();
    private currentAttempts: Map<string, RetryAttempt[]> = new Map();
    private reportInfo!: PSReportInfo;
    private configManager = ConfigManager.getInstance();

    // ============================================
    // LIFECYCLE METHODS
    // ============================================

    onBegin(config: FullConfig, suite: Suite): void {
        this.config = config;
        this.startTime = Date.now();
        
        // Create run folder with timestamp
        const timestamp = PSDateTime.now.toFolderFormat();
        this.runFolder = path.join(process.cwd(), 'playwright-report', `run_${timestamp}`);
        
        // Set environment variable for other components to access
        process.env.PLAYWRIGHT_RUN_FOLDER = this.runFolder;
        
        // Create directories
        this.ensureDirectories();
        
        // Initialize report info
        this.reportInfo = PSReportInfo.fromConfig(this.startTime, 0);
        
        console.log(`\n╔══════════════════════════════════════════════════════════╗`);
        console.log(`║          PLAYWRIGHT TEST SUITE STARTED                   ║`);
        console.log(`╠══════════════════════════════════════════════════════════╣`);
        console.log(`║ Report Folder: ${this.runFolder.substring(this.runFolder.length - 40).padEnd(42)}║`);
        console.log(`║ Start Time:    ${PSDateTime.now.format('{MM}/{dd}/{yyyy} {HH}:{mm}:{ss}').padEnd(42)}║`);
        console.log(`╚══════════════════════════════════════════════════════════╝\n`);
    }

    onTestBegin(test: TestCase, result: TestResult): void {
        const testKey = this.getTestKey(test);
        
        // Initialize retry attempts tracking for this test
        if (!this.currentAttempts.has(testKey)) {
            this.currentAttempts.set(testKey, []);
        }
        
        // Log test start
        const tcmId = this.extractTcmId(test.title);
        console.log(`▶ ${tcmId ? `[${tcmId}] ` : ''}${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const testKey = this.getTestKey(test);
        const tcmId = this.extractTcmId(test.title) || 'NO-TCM';
        
        // Get screenshots from attachments
        const screenshots = result.attachments
            .filter(a => a.contentType === 'image/png' && a.path)
            .map(a => a.path!);
        
        // Create retry attempt record
        const attempt: RetryAttempt = {
            attemptNumber: result.retry + 1,
            status: result.status,
            duration: result.duration,
            error: result.error ? {
                message: result.error.message || 'Unknown error',
                stack: result.error.stack
            } : undefined,
            screenshots,
            startTime: result.startTime.getTime(),
            endTime: result.startTime.getTime() + result.duration
        };
        
        // Add to retry attempts
        const attempts = this.currentAttempts.get(testKey) || [];
        attempts.push(attempt);
        this.currentAttempts.set(testKey, attempts);
        
        // Check if this is the final attempt (test won't be retried)
        const isLastAttempt = result.status === 'passed' || 
                             result.retry >= (this.config.projects[0]?.retries || 0);
        
        if (isLastAttempt) {
            // Determine if test is intermittent (passed after retries)
            const isIntermittent = result.status === 'passed' && result.retry > 0;
            
            // Create enhanced test result
            const enhancedResult: EnhancedTestResult = {
                tcmId,
                title: test.title,
                fullTitle: test.titlePath().join(' > '),
                status: result.status,
                duration: result.duration,
                retryCount: result.retry,
                isIntermittent,
                specFile: test.location.file,
                projectName: test.parent?.project()?.name || 'default',
                error: result.error ? {
                    message: result.error.message || 'Unknown error',
                    stack: result.error.stack
                } : undefined,
                screenshots,
                retryAttempts: attempts,
                startTime: attempts[0]?.startTime || result.startTime.getTime(),
                endTime: result.startTime.getTime() + result.duration,
                annotations: test.annotations
            };
            
            // Add to results
            this.testResults.push(enhancedResult);
            
            // Group by TCM ID
            if (!this.tcmGroups.has(tcmId)) {
                this.tcmGroups.set(tcmId, []);
            }
            this.tcmGroups.get(tcmId)!.push(enhancedResult);
            
            // Clear attempts tracking
            this.currentAttempts.delete(testKey);
            
            // Log result
            this.logTestResult(enhancedResult);
        }
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        // Optional: Track step timing for detailed reports
    }

    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
        // Optional: Track step results
    }

    async onEnd(result: FullResult): Promise<void> {
        this.endTime = Date.now();
        
        // Update report info with end timestamp
        this.reportInfo = PSReportInfo.fromConfig(this.startTime, this.endTime);
        
        console.log(`\n╔══════════════════════════════════════════════════════════╗`);
        console.log(`║          GENERATING REPORTS...                           ║`);
        console.log(`╚══════════════════════════════════════════════════════════╝\n`);
        
        try {
            // Generate all reports
            await this.generateJsonReport();
            await this.generateTimelineReport();
            await this.generateTcmReport();
            await this.generateJiraLog();
            
            // Print summary
            this.printSummary(result);
            
            // Send notifications (Slack, etc.)
            await this.sendNotifications(result);
            
        } catch (error) {
            console.error('Error generating reports:', error);
        }
    }

    // ============================================
    // REPORT GENERATION METHODS
    // ============================================

    private async generateJsonReport(): Promise<void> {
        const summary = this.calculateSummary();
        
        const reportData = {
            reportInfo: this.reportInfo.toJSON(),
            summary,
            tests: this.testResults.map(t => ({
                tcmId: t.tcmId,
                title: t.title,
                fullTitle: t.fullTitle,
                status: t.status,
                duration: t.duration,
                retryCount: t.retryCount,
                isIntermittent: t.isIntermittent,
                specFile: t.specFile,
                projectName: t.projectName,
                error: t.error,
                screenshots: t.screenshots,
                retryAttempts: t.retryAttempts,
                annotations: t.annotations
            })),
            tcmGroups: Array.from(this.tcmGroups.entries()).map(([tcmId, tests]) => ({
                tcmId,
                tests: tests.map(t => ({
                    title: t.title,
                    status: t.status,
                    isIntermittent: t.isIntermittent,
                    retryCount: t.retryCount
                })),
                overallStatus: this.getTcmGroupStatus(tests)
            })),
            metadata: {
                environment: this.configManager.getEnvironment(),
                baseUrl: this.configManager.getBaseUrl(),
                runFolder: this.runFolder,
                generatedAt: new Date().toISOString()
            }
        };
        
        const reportPath = path.join(this.runFolder, 'report.json');
        fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
        console.log(`✓ JSON Report: ${reportPath}`);
    }

    private async generateTimelineReport(): Promise<void> {
        // Create timeline data grouped by test
        const timelineData: TimelineEntry[] = this.testResults.map(test => ({
            tcmId: test.tcmId,
            title: test.title,
            status: test.status,
            startTime: test.startTime,
            endTime: test.endTime,
            duration: test.duration,
            retryCount: test.retryCount,
            isIntermittent: test.isIntermittent,
            specFile: test.specFile
        })).sort((a, b) => a.startTime - b.startTime);
        
        // Save timeline JSON
        const timelineJsonPath = path.join(this.runFolder, 'report.timeline.json');
        fs.writeFileSync(timelineJsonPath, JSON.stringify({
            startTime: this.startTime,
            endTime: this.endTime,
            duration: this.endTime - this.startTime,
            entries: timelineData
        }, null, 2));
        
        // Generate timeline HTML report (by test)
        const timelineTestHtml = this.generateTimelineHtml(timelineData, 'test');
        const timelineTestPath = path.join(this.runFolder, 'report.timeline.test.html');
        fs.writeFileSync(timelineTestPath, timelineTestHtml);
        
        // Generate timeline HTML report (by describe/suite)
        const timelineDescribeHtml = this.generateTimelineHtml(timelineData, 'describe');
        const timelineDescribePath = path.join(this.runFolder, 'report.timeline.describe.html');
        fs.writeFileSync(timelineDescribePath, timelineDescribeHtml);
        
        console.log(`✓ Timeline Reports: ${this.runFolder}/report.timeline.*.html`);
    }

    private generateTimelineHtml(entries: TimelineEntry[], groupBy: 'test' | 'describe'): string {
        const summary = this.calculateSummary();
        const reportInfoText = this.reportInfo.text;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timeline Report - ${groupBy === 'test' ? 'By Test' : 'By Suite'}</title>
    <style>
        :root {
            --passed: #22c55e;
            --failed: #ef4444;
            --skipped: #f59e0b;
            --flaky: #8b5cf6;
            --bg-dark: #1f2937;
            --bg-light: #f3f4f6;
            --text-dark: #111827;
            --text-light: #f9fafb;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: var(--bg-light);
            color: var(--text-dark);
            line-height: 1.5;
        }
        .header {
            background: var(--bg-dark);
            color: var(--text-light);
            padding: 20px;
            text-align: center;
        }
        .header h1 { font-size: 1.5rem; margin-bottom: 10px; }
        .header .info { font-size: 0.875rem; opacity: 0.8; }
        .stats {
            display: flex;
            justify-content: center;
            gap: 20px;
            padding: 20px;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .stat {
            text-align: center;
            padding: 10px 20px;
        }
        .stat-value { font-size: 2rem; font-weight: bold; }
        .stat-label { font-size: 0.75rem; text-transform: uppercase; opacity: 0.7; }
        .stat.passed .stat-value { color: var(--passed); }
        .stat.failed .stat-value { color: var(--failed); }
        .stat.skipped .stat-value { color: var(--skipped); }
        .stat.flaky .stat-value { color: var(--flaky); }
        .timeline-container { padding: 20px; max-width: 1400px; margin: 0 auto; }
        .timeline-header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 10px;
            font-size: 0.75rem;
            color: #666;
        }
        .timeline {
            position: relative;
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .timeline-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 10px;
        }
        .timeline-label {
            width: 250px;
            font-size: 0.75rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .timeline-bar-container {
            flex: 1;
            height: 24px;
            background: #e5e7eb;
            border-radius: 4px;
            position: relative;
        }
        .timeline-bar {
            position: absolute;
            height: 100%;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 5px;
            font-size: 0.625rem;
            color: white;
            min-width: 2px;
        }
        .timeline-bar.passed { background: var(--passed); }
        .timeline-bar.failed { background: var(--failed); }
        .timeline-bar.skipped { background: var(--skipped); }
        .timeline-bar.flaky { background: var(--flaky); }
        .timeline-bar.timedOut { background: var(--failed); }
        .timeline-bar.interrupted { background: #6b7280; }
        .tcm-id { 
            font-weight: 600; 
            font-size: 0.7rem;
            color: #6366f1;
            margin-right: 5px;
        }
        .retry-badge {
            background: var(--flaky);
            color: white;
            font-size: 0.6rem;
            padding: 1px 4px;
            border-radius: 4px;
            margin-left: 5px;
        }
        .ps-stats {
            background: white;
            margin: 20px auto;
            max-width: 1400px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .ps-stats h3 { margin-bottom: 15px; }
        .ps-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .ps-stat { text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .ps-stat-value { font-size: 1.5rem; font-weight: bold; color: #6366f1; }
        .ps-stat-label { font-size: 0.75rem; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Timeline Report - ${groupBy === 'test' ? 'By Test' : 'By Suite'}</h1>
        <div class="info">${reportInfoText}</div>
        <div class="info">Duration: ${PSDuration.of(this.endTime - this.startTime).text}</div>
    </div>
    
    <div class="stats">
        <div class="stat passed">
            <div class="stat-value">${summary.passed}</div>
            <div class="stat-label">Passed</div>
        </div>
        <div class="stat failed">
            <div class="stat-value">${summary.failed}</div>
            <div class="stat-label">Failed</div>
        </div>
        <div class="stat skipped">
            <div class="stat-value">${summary.skipped}</div>
            <div class="stat-label">Skipped</div>
        </div>
        <div class="stat flaky">
            <div class="stat-value">${summary.flaky}</div>
            <div class="stat-label">Flaky</div>
        </div>
        <div class="stat">
            <div class="stat-value">${summary.total}</div>
            <div class="stat-label">Total</div>
        </div>
    </div>
    
    <div class="ps-stats">
        <h3>PowerSchool Statistics</h3>
        <div class="ps-stats-grid">
            <div class="ps-stat">
                <div class="ps-stat-value">${summary.psStatistics.percentages.runToPlan}%</div>
                <div class="ps-stat-label">Run to Plan</div>
            </div>
            <div class="ps-stat">
                <div class="ps-stat-value">${summary.psStatistics.percentages.passToRun}%</div>
                <div class="ps-stat-label">Pass to Run</div>
            </div>
            <div class="ps-stat">
                <div class="ps-stat-value">${summary.psStatistics.percentages.passToPlan}%</div>
                <div class="ps-stat-label">Pass to Plan</div>
            </div>
            <div class="ps-stat">
                <div class="ps-stat-value">${summary.psStatistics.percentages.intermittentFailure}%</div>
                <div class="ps-stat-label">Intermittent</div>
            </div>
        </div>
    </div>
    
    <div class="timeline-container">
        <div class="timeline-header">
            <span>${PSDateTime.fromEpoch(this.startTime).format('{HH}:{mm}:{ss}')}</span>
            <span>${PSDateTime.fromEpoch(this.endTime).format('{HH}:{mm}:{ss}')}</span>
        </div>
        <div class="timeline">
            ${entries.map(entry => {
                const totalDuration = this.endTime - this.startTime;
                const left = ((entry.startTime - this.startTime) / totalDuration) * 100;
                const width = Math.max((entry.duration / totalDuration) * 100, 0.5);
                const statusClass = entry.isIntermittent ? 'flaky' : entry.status;
                
                return `
                <div class="timeline-row">
                    <div class="timeline-label">
                        ${entry.tcmId !== 'NO-TCM' ? `<span class="tcm-id">${entry.tcmId}</span>` : ''}
                        ${entry.title.replace(/^(TCM-\d+|[A-Z]+-\d+):\s*/, '')}
                        ${entry.retryCount > 0 ? `<span class="retry-badge">R${entry.retryCount}</span>` : ''}
                    </div>
                    <div class="timeline-bar-container">
                        <div class="timeline-bar ${statusClass}" 
                             style="left: ${left}%; width: ${width}%;"
                             title="${entry.title} - ${PSDuration.of(entry.duration).text}">
                            ${entry.duration > 1000 ? PSDuration.of(entry.duration).text : ''}
                        </div>
                    </div>
                </div>`;
            }).join('\n')}
        </div>
    </div>
</body>
</html>`;
    }

    private async generateTcmReport(): Promise<void> {
        const tcmReport: TCMGroupedResult[] = [];
        
        this.tcmGroups.forEach((tests, tcmId) => {
            tcmReport.push({
                tcmId,
                overallStatus: this.getTcmGroupStatus(tests),
                tests: tests.map(t => ({
                    title: t.title,
                    status: t.status as TestStatus,
                    isIntermittent: t.isIntermittent,
                    retryCount: t.retryCount,
                    specFile: t.specFile,
                    duration: t.duration,
                    error: t.error?.message
                }))
            });
        });
        
        const reportPath = path.join(this.runFolder, 'report.tcm.json');
        fs.writeFileSync(reportPath, JSON.stringify({
            reportInfo: this.reportInfo.toJSON(),
            statistics: PSTcmResultStatistics.fromGroupedTcmResults(tcmReport).toJSON(),
            tcmGroups: tcmReport
        }, null, 2));
        
        console.log(`✓ TCM Report: ${reportPath}`);
    }

    private async generateJiraLog(): Promise<void> {
        const jiraEntries: string[] = [];
        const jiraSettings = this.configManager.getJiraSettings();
        
        if (!jiraSettings.enabled) {
            jiraEntries.push('# JIRA Integration Disabled');
            jiraEntries.push(`# Set JIRA_ENABLED=true to enable`);
            jiraEntries.push('');
        }
        
        jiraEntries.push(`# JIRA/Zephyr Test Execution Log`);
        jiraEntries.push(`# Generated: ${new Date().toISOString()}`);
        jiraEntries.push(`# Environment: ${this.configManager.getEnvironment()}`);
        jiraEntries.push(`# Project: ${jiraSettings.projectKey}`);
        jiraEntries.push('');
        
        this.testResults.forEach(test => {
            if (test.tcmId !== 'NO-TCM') {
                const zephyrStatus = this.mapStatusToZephyr(test.status, test.isIntermittent);
                jiraEntries.push(`${test.tcmId}: ${zephyrStatus} - ${test.title}`);
                if (test.error) {
                    jiraEntries.push(`  Error: ${test.error.message.substring(0, 100)}...`);
                }
                if (test.retryCount > 0) {
                    jiraEntries.push(`  Retries: ${test.retryCount} (Intermittent: ${test.isIntermittent})`);
                }
            }
        });
        
        const logPath = path.join(this.runFolder, 'report.jira.log');
        fs.writeFileSync(logPath, jiraEntries.join('\n'));
        
        console.log(`✓ JIRA Log: ${logPath}`);
    }

    // ============================================
    // NOTIFICATION METHODS
    // ============================================

    private async sendNotifications(result: FullResult): Promise<void> {
        const slackSettings = this.configManager.getSlackReportSettings();
        
        if (slackSettings.enabled) {
            try {
                await this.sendSlackNotification(result);
            } catch (error) {
                console.error('Failed to send Slack notification:', error);
            }
        }
    }

    private async sendSlackNotification(result: FullResult): Promise<void> {
        const webhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (!webhookUrl) {
            console.log('⚠ Slack webhook URL not configured');
            return;
        }
        
        const summary = this.calculateSummary();
        const slackSettings = this.configManager.getSlackReportSettings();
        
        // Determine emoji based on results
        let emoji = '✅';
        if (summary.failed > 0) {
            emoji = '❌';
        } else if (summary.flaky > 0) {
            emoji = '⚠️';
        }
        
        // Build message
        const message = {
            text: `${emoji} Test Run Complete: ${summary.psStatistics.percentages.passToPlan}% Pass Rate`,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `${emoji} ${this.reportInfo.text}`,
                        emoji: true
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: [
                            `> *Start:* ${PSDateTime.fromEpoch(this.startTime).format('{MM}/{dd}/{yyyy} {HH}:{mm}:{ss}')}`,
                            `> *End:* ${PSDateTime.fromEpoch(this.endTime).format('{MM}/{dd}/{yyyy} {HH}:{mm}:{ss}')}`,
                            `> *Duration:* ${PSDuration.of(this.endTime - this.startTime).text}`,
                            `> *Run to Plan:* ${summary.psStatistics.percentages.runToPlan}%`,
                            `> *Pass to Run:* ${summary.psStatistics.percentages.passToRun}%`,
                            `> *Pass to Plan:* ${summary.psStatistics.percentages.passToPlan}%`,
                            `> *Intermittent:* ${summary.psStatistics.percentages.intermittentFailure}%`,
                            `> *Passed/Planned:* ${summary.psStatistics.totals.passTotal}/${summary.psStatistics.totals.planned}`
                        ].join('\n')
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: this.getSlackLinks()
                    }
                }
            ]
        };
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
            
            if (response.ok) {
                console.log('✓ Slack notification sent');
            } else {
                console.error('✗ Slack notification failed:', response.status);
            }
        } catch (error) {
            console.error('✗ Slack notification error:', error);
        }
    }

    private getSlackLinks(): string {
        const links: string[] = [];
        
        // Pipeline link
        const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
        if (GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID) {
            links.push(`<${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}|Pipeline>`);
        } else {
            links.push('Local Run');
        }
        
        // Azure report URL if available
        const azureUrl = process.env.AZURE_REPORT_URL;
        if (azureUrl) {
            links.push(`<${azureUrl}/report.html|Report>`);
            links.push(`<${azureUrl}/report.timeline.test.html|Timeline>`);
        }
        
        return `> ${links.join(' | ')}`;
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private ensureDirectories(): void {
        const dirs = [
            this.runFolder,
            path.join(this.runFolder, 'html-report'),
            path.join(this.runFolder, 'retry-screenshots'),
            path.join(this.runFolder, 'data')
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    private getTestKey(test: TestCase): string {
        return `${test.location.file}:${test.location.line}:${test.title}`;
    }

    private extractTcmId(title: string): string | null {
        // Match patterns like: TCM-123, UIHN-456, TEST-789
        const match = title.match(/^(TCM-\d+|[A-Z]+-\d+)/i);
        return match ? match[1].toUpperCase() : null;
    }

    private getTcmGroupStatus(tests: EnhancedTestResult[]): 'passed' | 'failed' | 'skipped' {
        const hasFailure = tests.some(t => t.status === 'failed' || t.status === 'timedOut');
        const allSkipped = tests.every(t => t.status === 'skipped');
        
        if (hasFailure) return 'failed';
        if (allSkipped) return 'skipped';
        return 'passed';
    }

    private mapStatusToZephyr(status: string, isIntermittent: boolean): string {
        if (isIntermittent) return 'PASS-CAUTION';
        
        switch (status) {
            case 'passed': return 'PASS';
            case 'failed': return 'FAIL';
            case 'timedOut': return 'FAIL';
            case 'skipped': return 'NOT_EXECUTED';
            default: return 'NOT_EXECUTED';
        }
    }

    private calculateSummary(): ReportSummary {
        const passed = this.testResults.filter(t => t.status === 'passed').length;
        const failed = this.testResults.filter(t => t.status === 'failed' || t.status === 'timedOut').length;
        const skipped = this.testResults.filter(t => t.status === 'skipped').length;
        const flaky = this.testResults.filter(t => t.isIntermittent).length;
        
        // TCM-level counts
        const tcmPassed = Array.from(this.tcmGroups.values())
            .filter(tests => this.getTcmGroupStatus(tests) === 'passed').length;
        const tcmFailed = Array.from(this.tcmGroups.values())
            .filter(tests => this.getTcmGroupStatus(tests) === 'failed').length;
        const tcmSkipped = Array.from(this.tcmGroups.values())
            .filter(tests => this.getTcmGroupStatus(tests) === 'skipped').length;
        const tcmIntermittent = Array.from(this.tcmGroups.values())
            .filter(tests => tests.some(t => t.isIntermittent) && this.getTcmGroupStatus(tests) === 'passed').length;
        
        // Create TCM grouped results for PS statistics
        const tcmResults: TCMGroupedResult[] = Array.from(this.tcmGroups.entries())
            .map(([tcmId, tests]) => ({
                tcmId,
                overallStatus: this.getTcmGroupStatus(tests),
                tests: tests.map(t => ({
                    title: t.title,
                    status: t.status as TestStatus,
                    isIntermittent: t.isIntermittent,
                    retryCount: t.retryCount,
                    specFile: t.specFile,
                    duration: t.duration,
                    error: t.error?.message
                }))
            }));
        
        const psStatistics = PSTcmResultStatistics.fromGroupedTcmResults(tcmResults);
        
        return {
            total: this.testResults.length,
            passed,
            failed,
            skipped,
            flaky,
            duration: this.endTime - this.startTime,
            startTime: this.startTime,
            endTime: this.endTime,
            tcmPassed,
            tcmFailed,
            tcmSkipped,
            tcmTotal: this.tcmGroups.size,
            tcmIntermittent,
            psStatistics: psStatistics.toJSON()
        };
    }

    private logTestResult(result: EnhancedTestResult): void {
        const statusSymbols: Record<string, string> = {
            passed: '✓',
            failed: '✗',
            skipped: '⊘',
            timedOut: '⏱',
            interrupted: '⚡'
        };
        
        const symbol = result.isIntermittent ? '⚠' : statusSymbols[result.status] || '?';
        const duration = PSDuration.of(result.duration).text;
        const retry = result.retryCount > 0 ? ` (retry ${result.retryCount})` : '';
        
        console.log(`  ${symbol} ${result.status.toUpperCase()}${retry} [${duration}]`);
        
        if (result.error && result.status === 'failed') {
            console.log(`    Error: ${result.error.message.substring(0, 80)}...`);
        }
    }

    private printSummary(result: FullResult): void {
        const summary = this.calculateSummary();
        const psStats = summary.psStatistics;
        
        console.log(`
╔══════════════════════════════════════════════════════════╗
║          TEST EXECUTION SUMMARY                          ║
╠══════════════════════════════════════════════════════════╣
║ RESULTS                                                  ║
║   Total:       ${String(summary.total).padStart(6)}    Passed:    ${String(summary.passed).padStart(6)}       ║
║   Failed:      ${String(summary.failed).padStart(6)}    Skipped:   ${String(summary.skipped).padStart(6)}       ║
║   Flaky:       ${String(summary.flaky).padStart(6)}                               ║
╠══════════════════════════════════════════════════════════╣
║ TCM CASES                                                ║
║   Total:       ${String(summary.tcmTotal).padStart(6)}    Passed:    ${String(summary.tcmPassed).padStart(6)}       ║
║   Failed:      ${String(summary.tcmFailed).padStart(6)}    Skipped:   ${String(summary.tcmSkipped).padStart(6)}       ║
║   Intermittent:${String(summary.tcmIntermittent).padStart(6)}                               ║
╠══════════════════════════════════════════════════════════╣
║ POWERSCHOOL STATISTICS                                   ║
║   Run to Plan:    ${String(psStats.percentages.runToPlan).padStart(3)}%    Pass to Run:  ${String(psStats.percentages.passToRun).padStart(3)}%     ║
║   Pass to Plan:   ${String(psStats.percentages.passToPlan).padStart(3)}%    Intermittent: ${String(psStats.percentages.intermittentFailure).padStart(3)}%     ║
╠══════════════════════════════════════════════════════════╣
║ TIMING                                                   ║
║   Duration: ${PSDuration.of(summary.duration).text.padEnd(45)}║
║   Start:    ${PSDateTime.fromEpoch(summary.startTime).format('{MM}/{dd}/{yyyy} {HH}:{mm}:{ss}').padEnd(45)}║
║   End:      ${PSDateTime.fromEpoch(summary.endTime).format('{MM}/{dd}/{yyyy} {HH}:{mm}:{ss}').padEnd(45)}║
╠══════════════════════════════════════════════════════════╣
║ REPORTS                                                  ║
║   ${this.runFolder.padEnd(55)}║
╚══════════════════════════════════════════════════════════╝
        `);
    }
}

export default CustomReporter;