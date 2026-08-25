/**
 * PowerSchool TCM (Test Case Management) Statistics
 * Provides detailed test result statistics with PowerSchool-style metrics:
 * - Run to Plan Rate
 * - Pass to Run Rate
 * - Pass to Plan Rate
 * - App Bug and Repair categorization
 * - Intermittent Failure tracking
 */
import * as fs from 'fs';

interface PSJiraTicket {
    id: string;
}

interface PSRepair {
    id: string;
    assigned?: string;
}

let psTestState: any;

/**
 * Read test state file for app bug and repair categorization
 * Looks for ps.test-state.json or ps.test-state.jsonc in the spec file directory
 */
function getTestState(specFile: string): any {
    if (psTestState == undefined) {
        // First try to find ps.test-state.json in the same directory as the spec file
        let testStatusJsonFile: string = specFile.substring(0, specFile.lastIndexOf('/')) + '/ps.test-state.json';
        let testStatusJsoncFile: string = specFile.substring(0, specFile.lastIndexOf('/')) + '/ps.test-state.jsonc';

        if (fs.existsSync(testStatusJsoncFile)) {
            psTestState = JSON.parse(fs.readFileSync(testStatusJsoncFile, 'utf8'));
        } else if (fs.existsSync(testStatusJsonFile)) {
            psTestState = JSON.parse(fs.readFileSync(testStatusJsonFile, 'utf8'));
        } else {
            // If not found, try to find it in the tests root directory
            const testsRootPath = specFile.indexOf('/testSpec/') !== -1 
                ? specFile.substring(0, specFile.indexOf('/testSpec/') + 10) // Include '/testSpec/'
                : specFile.substring(0, specFile.lastIndexOf('/')) + '/';
            
            testStatusJsonFile = testsRootPath + 'ps.test-state.json';
            testStatusJsoncFile = testsRootPath + 'ps.test-state.jsonc';
            
            if (fs.existsSync(testStatusJsoncFile)) {
                psTestState = JSON.parse(fs.readFileSync(testStatusJsoncFile, 'utf8'));
            } else if (fs.existsSync(testStatusJsonFile)) {
                psTestState = JSON.parse(fs.readFileSync(testStatusJsonFile, 'utf8'));
            } else {
                psTestState = null;
            }
        }
    }
    return psTestState;
}

/**
 * Return application bug if any, or return null
 */
function getAppBug(ticket: PSJiraTicket, specFile: string): PSJiraTicket | null {
    const testState: any = getTestState(specFile);

    if (testState != undefined) {
        try {
            const bugTicket = testState.appbug?.[ticket.id];
            if (bugTicket) {
                return { id: bugTicket };
            }
        } catch (e) {
            // Ignore errors - return null below
        }
    }
    return null;
}

/**
 * Return repair if any, or return null
 */
function getRepair(ticket: PSJiraTicket, specFile: string): PSRepair | null {
    const testState = getTestState(specFile);
    if (testState != undefined) {
        try {
            return testState.repair?.[ticket.id];
        } catch (e) {
            // Ignore errors - return null below
        }
    }
    return null;
}

/**
 * Reset test state cache (useful for testing)
 */
export function resetTestStateCache(): void {
    psTestState = undefined;
}

/**
 * Test status type - includes all possible Playwright test statuses
 */
export type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted';

/**
 * Normalized test status for reporting - maps all statuses to basic categories
 */
export type NormalizedTestStatus = 'passed' | 'failed' | 'skipped';

/**
 * TCM Grouped Result interface - represents test results grouped by TCM ID
 */
export interface TCMGroupedResult {
    tcmId: string;
    overallStatus: NormalizedTestStatus;
    tests: Array<{
        title: string;
        status: TestStatus;
        isIntermittent: boolean;
        retryCount: number;
        specFile: string;
        duration: number;
        error?: string;
    }>;
}

/**
 * Normalize test status for reporting purposes
 * Maps timedOut and interrupted to failed
 */
export function normalizeStatus(status: TestStatus): NormalizedTestStatus {
    switch (status) {
        case 'passed':
            return 'passed';
        case 'failed':
        case 'timedOut':
        case 'interrupted':
            return 'failed';
        case 'skipped':
            return 'skipped';
        default:
            return 'failed';
    }
}

/**
 * PowerSchool Test Result Types
 */
export enum PSTcmTestResultType {
    Passed = 'Passed',
    PassedCaution = 'Passed-Caution',  // Intermittent pass
    AppBug = 'AppBug',
    Repair = 'Repair',
    Skipped = 'Skipped',
    Failed = 'Failed'
}

/**
 * PowerSchool-style Test Result Statistics Calculator
 */
export class PSTcmResultStatistics {
    private pass: number;
    private passCaution: number;
    private failure: number;
    private appbug: number;
    private repair: number;
    private skipped: number;

    constructor(pass: number, passCaution: number, failure: number, appbug: number, repair: number, skipped: number) {
        this.pass = pass;
        this.passCaution = passCaution;
        this.failure = failure;
        this.appbug = appbug;
        this.repair = repair;
        this.skipped = skipped;
    }

    // ============================================
    // BASIC COUNTS
    // ============================================

    get passCount(): number {
        return this.pass;
    }

    get passCautionCount(): number {
        return this.passCaution;
    }

    get failureCount(): number {
        return this.failure;
    }

    get appbugCount(): number {
        return this.appbug;
    }

    get repairCount(): number {
        return this.repair;
    }

    get skippedCount(): number {
        return this.skipped;
    }

    // ============================================
    // CALCULATED TOTALS
    // ============================================

    /**
     * Total planned tests (all tests regardless of outcome)
     */
    get plannedCount(): number {
        return this.pass + this.passCaution + this.failure + this.appbug + this.repair + this.skipped;
    }

    /**
     * Total passed tests (includes intermittent passes)
     */
    get passTotalCount(): number {
        return this.passCaution + this.pass;
    }

    /**
     * Total tests that were actually executed (passed + failed, excludes skipped/appbug/repair)
     */
    get ranCount(): number {
        return this.passTotalCount + this.failure;
    }

    // ============================================
    // POWERSCHOOL PERCENTAGE CALCULATIONS
    // ============================================

    /**
     * Run to Plan Rate - Percentage of planned tests that were executed
     */
    get runToPlanPercentage(): number {
        return this.plannedCount === 0 ? 0 : Math.floor(this.ranCount / this.plannedCount * 100);
    }

    /**
     * Pass to Run Rate - Percentage of executed tests that passed
     */
    get passToRunPercentage(): number {
        return this.ranCount === 0 ? 0 : Math.floor(this.passTotalCount / this.ranCount * 100);
    }

    /**
     * Pass to Plan Rate - Percentage of planned tests that passed
     */
    get passToPlanPercentage(): number {
        return this.plannedCount === 0 ? 0 : Math.floor(this.passTotalCount / this.plannedCount * 100);
    }

    /**
     * Intermittent Failure Rate - Percentage of tests that had intermittent failures
     */
    get intermittentFailurePercentage(): number {
        return this.plannedCount === 0 ? 0 : Math.floor(this.passCaution / this.plannedCount * 100);
    }

    // ============================================
    // INCREMENT METHODS
    // ============================================

    /**
     * Increment the count for a specific result type
     */
    increment(result: PSTcmTestResultType): void {
        switch (result) {
            case PSTcmTestResultType.Passed:
                this.pass++;
                break;
            case PSTcmTestResultType.PassedCaution:
                this.passCaution++;
                break;
            case PSTcmTestResultType.Failed:
                this.failure++;
                break;
            case PSTcmTestResultType.AppBug:
                this.appbug++;
                break;
            case PSTcmTestResultType.Repair:
                this.repair++;
                break;
            case PSTcmTestResultType.Skipped:
                this.skipped++;
                break;
            default:
                throw new Error('Unknown test result type.');
        }
    }

    // ============================================
    // FACTORY METHODS
    // ============================================

    /**
     * Create statistics from grouped TCM results (for unique TCM count)
     */
    static fromGroupedTcmResults(groupedResults: TCMGroupedResult[]): PSTcmResultStatistics {
        const stats = new PSTcmResultStatistics(0, 0, 0, 0, 0, 0);
        
        groupedResults.forEach(tcmGroup => {
            // Check if any tests in this TCM group had retries (intermittent failure)
            const hasIntermittentTests = tcmGroup.tests.some(test => test.isIntermittent);
            
            if (hasIntermittentTests && tcmGroup.overallStatus === 'passed') {
                // TCM passed but had intermittent failures - count as caution
                stats.increment(PSTcmTestResultType.PassedCaution);
            } else {
                switch (tcmGroup.overallStatus) {
                    case 'passed':
                        stats.increment(PSTcmTestResultType.Passed);
                        break;
                    case 'failed':
                        // Check for app bug or repair categorization
                        const tcmId = tcmGroup.tcmId;
                        const specFile = tcmGroup.tests[0]?.specFile;
                        
                        if (tcmId && specFile) {
                            const ticket: PSJiraTicket = { id: tcmId };
                            const appBug = getAppBug(ticket, specFile);
                            const repair = getRepair(ticket, specFile);
                            
                            if (appBug) {
                                stats.increment(PSTcmTestResultType.AppBug);
                            } else if (repair) {
                                stats.increment(PSTcmTestResultType.Repair);
                            } else {
                                stats.increment(PSTcmTestResultType.Failed);
                            }
                        } else {
                            stats.increment(PSTcmTestResultType.Failed);
                        }
                        break;
                    case 'skipped':
                        // Check if this was skipped due to app bug or repair
                        const tcmIdSkipped = tcmGroup.tcmId;
                        const specFileSkipped = tcmGroup.tests[0]?.specFile;
                        
                        if (tcmIdSkipped && specFileSkipped) {
                            const ticket: PSJiraTicket = { id: tcmIdSkipped };
                            const appBug = getAppBug(ticket, specFileSkipped);
                            const repair = getRepair(ticket, specFileSkipped);
                            
                            if (appBug) {
                                stats.increment(PSTcmTestResultType.AppBug);
                            } else if (repair) {
                                stats.increment(PSTcmTestResultType.Repair);
                            } else {
                                stats.increment(PSTcmTestResultType.Skipped);
                            }
                        } else {
                            stats.increment(PSTcmTestResultType.Skipped);
                        }
                        break;
                }
            }
        });
        
        return stats;
    }

    /**
     * Simple factory method for basic test summary data
     */
    static fromTestSummary(
        passed: number, 
        failed: number, 
        skipped: number, 
        tcmIntermittent: number = 0
    ): PSTcmResultStatistics {
        const passCaution = tcmIntermittent;
        const normalPassed = Math.max(0, passed - tcmIntermittent);
        
        return new PSTcmResultStatistics(
            normalPassed,    // pass
            passCaution,     // passCaution (intermittent)
            failed,          // failure
            0,               // appbug (no categorization in basic method)
            0,               // repair (no categorization in basic method)
            skipped          // skipped
        );
    }

    /**
     * Enhanced factory method with failure categorization
     */
    static fromTestSummaryWithCategorization(
        passed: number, 
        failed: number, 
        skipped: number, 
        tcmIntermittent: number = 0,
        failedTests: Array<{ ticketId?: string; specFile?: string; error?: string }> = []
    ): PSTcmResultStatistics {
        const passCaution = tcmIntermittent;
        const normalPassed = Math.max(0, passed - tcmIntermittent);
        
        let appBugCount = 0;
        let repairCount = 0;
        let generalFailureCount = 0;
        
        // Categorize failed tests
        failedTests.forEach(failedTest => {
            if (failedTest.specFile && failedTest.ticketId) {
                const ticket: PSJiraTicket = { id: failedTest.ticketId };
                const appBug = getAppBug(ticket, failedTest.specFile);
                const repair = getRepair(ticket, failedTest.specFile);
                
                if (appBug) {
                    appBugCount++;
                } else if (repair) {
                    repairCount++;
                } else {
                    generalFailureCount++;
                }
            } else {
                generalFailureCount++;
            }
        });
        
        // If no detailed failed tests provided, treat all as general failures
        if (failedTests.length === 0) {
            generalFailureCount = failed;
        }
        
        return new PSTcmResultStatistics(
            normalPassed,        // pass
            passCaution,         // passCaution (intermittent)
            generalFailureCount, // failure (categorized)
            appBugCount,         // appbug
            repairCount,         // repair
            skipped              // skipped
        );
    }

    /**
     * Enhanced factory method with individual test details
     */
    static fromTestDetails(
        testResults: Array<{
            status: 'passed' | 'failed' | 'skipped';
            isIntermittent?: boolean;
            specFile?: string;
            ticketId?: string;
            error?: string;
        }>
    ): PSTcmResultStatistics {
        const stats = new PSTcmResultStatistics(0, 0, 0, 0, 0, 0);
        
        testResults.forEach(result => {
            switch (result.status) {
                case 'passed':
                    if (result.isIntermittent) {
                        stats.increment(PSTcmTestResultType.PassedCaution);
                    } else {
                        stats.increment(PSTcmTestResultType.Passed);
                    }
                    break;
                    
                case 'failed':
                    // Check for app bug or repair categorization
                    if (result.specFile && result.ticketId) {
                        const ticket: PSJiraTicket = { id: result.ticketId };
                        const appBug = getAppBug(ticket, result.specFile);
                        const repair = getRepair(ticket, result.specFile);
                        
                        if (appBug) {
                            stats.increment(PSTcmTestResultType.AppBug);
                        } else if (repair) {
                            stats.increment(PSTcmTestResultType.Repair);
                        } else {
                            stats.increment(PSTcmTestResultType.Failed);
                        }
                    } else {
                        stats.increment(PSTcmTestResultType.Failed);
                    }
                    break;
                    
                case 'skipped':
                    stats.increment(PSTcmTestResultType.Skipped);
                    break;
            }
        });
        
        return stats;
    }

    // ============================================
    // SERIALIZATION
    // ============================================

    /**
     * Serialize statistics for JSON reports
     */
    toJSON() {
        return {
            counts: {
                pass: this.pass,
                passCaution: this.passCaution,
                failure: this.failure,
                appbug: this.appbug,
                repair: this.repair,
                skipped: this.skipped
            },
            totals: {
                planned: this.plannedCount,
                passTotal: this.passTotalCount,
                ran: this.ranCount
            },
            percentages: {
                runToPlan: this.runToPlanPercentage,
                passToRun: this.passToRunPercentage,
                passToPlan: this.passToPlanPercentage,
                intermittentFailure: this.intermittentFailurePercentage
            }
        };
    }

    /**
     * Create a human-readable summary
     */
    toSummaryText(): string {
        return `
╔══════════════════════════════════════════════════════════╗
║          POWERSCHOOL TEST STATISTICS                     ║
╠══════════════════════════════════════════════════════════╣
║ COUNTS                                                   ║
║   Passed:           ${String(this.pass).padStart(6)}                              ║
║   Passed (Caution): ${String(this.passCaution).padStart(6)}                              ║
║   Failed:           ${String(this.failure).padStart(6)}                              ║
║   App Bug:          ${String(this.appbug).padStart(6)}                              ║
║   Repair:           ${String(this.repair).padStart(6)}                              ║
║   Skipped:          ${String(this.skipped).padStart(6)}                              ║
╠══════════════════════════════════════════════════════════╣
║ TOTALS                                                   ║
║   Planned:          ${String(this.plannedCount).padStart(6)}                              ║
║   Ran:              ${String(this.ranCount).padStart(6)}                              ║
║   Pass Total:       ${String(this.passTotalCount).padStart(6)}                              ║
╠══════════════════════════════════════════════════════════╣
║ RATES                                                    ║
║   Run to Plan:      ${String(this.runToPlanPercentage).padStart(5)}%                             ║
║   Pass to Run:      ${String(this.passToRunPercentage).padStart(5)}%                             ║
║   Pass to Plan:     ${String(this.passToPlanPercentage).padStart(5)}%                             ║
║   Intermittent:     ${String(this.intermittentFailurePercentage).padStart(5)}%                             ║
╚══════════════════════════════════════════════════════════╝`;
    }
}