/**
 * PowerSchool Report Info - Stores test run metadata and environment details
 * Used for generating comprehensive test reports
 */
import { PSStringBuilder } from './ps-string-builder';
import { ConfigManager } from '../../config/ConfigManager';

export interface PSReportInfoData {
    productName: string;
    productType: string;
    suiteType: string;
    environment: string;
    environmentLocation: string;
    releaseVersion: string;
    description: string;
}

export class PSReportInfo {
    readonly productName: string;
    readonly productType: string;
    readonly suiteType: string;
    readonly environment: string;
    readonly environmentLocation: string;
    readonly releaseVersion: string;
    private readonly description: string;
    readonly startTimestamp: number;
    readonly endTimestamp: number;

    constructor(reportInfo: PSReportInfoData, startTimestamp: number = 0, endTimestamp: number = 0) {
        if (reportInfo != undefined) {
            this.productName = reportInfo.productName;
            this.productType = reportInfo.productType;
            this.suiteType = reportInfo.suiteType;
            this.environment = reportInfo.environment;
            this.environmentLocation = reportInfo.environmentLocation;
            this.releaseVersion = reportInfo.releaseVersion;
            this.description = reportInfo.description;
        } else {
            this.productName = '';
            this.productType = '';
            this.suiteType = '';
            this.environment = '';
            this.environmentLocation = '';
            this.releaseVersion = '';
            this.description = '';
        }
        this.startTimestamp = startTimestamp;
        this.endTimestamp = endTimestamp;
    }

    /**
     * Create PSReportInfo from runtime configuration and ConfigManager
     */
    static fromConfig(startTimestamp: number = 0, endTimestamp: number = 0): PSReportInfo {
        const configManager = ConfigManager.getInstance();
        const slackSettings = configManager.getSlackReportSettings();
        
        return new PSReportInfo({
            productName: slackSettings.productName || 'Hoonuit',
            productType: slackSettings.productType || 'Web Application',
            suiteType: slackSettings.suiteType || process.env.TEST_SUITE || 'Integration Tests',
            environment: slackSettings.environment || process.env.TEST_ENV || configManager.getEnvironment(),
            environmentLocation: slackSettings.environmentLocation || 'AWS',
            releaseVersion: slackSettings.releaseVersion || process.env.RELEASE_VERSION || '',
            description: process.env.REPORT_DESCRIPTION || 'Automated Test Suite'
        }, startTimestamp, endTimestamp);
    }

    /**
     * Validates that required fields are present and non-empty.
     */
    validate(): void {
        let errors: PSStringBuilder = new PSStringBuilder();

        if (!this.productName || this.productName.trim() === '') {
            errors.append('. Missing or empty product name').return();
        }
        if (!this.productType || this.productType.trim() === '') {
            errors.append('. Missing or empty product type').return();
        }
        if (!this.suiteType || this.suiteType.trim() === '') {
            errors.append('. Missing or empty suite type').return();
        }
        if (!this.environment || this.environment.trim() === '') {
            errors.append('. Missing or empty environment').return();
        }
        if (!this.environmentLocation || this.environmentLocation.trim() === '') {
            errors.append('. Missing or empty environment location').return();
        }

        if (errors.appendedCount > 0) {
            throw new Error(`Error in report info:\n${errors.text}`);
        }
    }

    /**
     * Get formatted text representation of report info
     */
    get text(): string {
        const s: PSStringBuilder = new PSStringBuilder();

        s.append(this.productName);
        s.append(` - ${this.productType}`);
        s.append(` - ${this.suiteType}`);
        s.append(` - ${this.environment}`);
        
        // Append releaseVersion if it is not an empty string
        if (this.releaseVersion && this.releaseVersion.trim() !== '') {
            s.append(` - ${this.releaseVersion}`);
        }
        s.append(` - ${this.descriptionText}`);
        return s.text;
    }

    get descriptionText(): string {
        return this.description != undefined && this.description.trim() != '' ? this.description : '(NO DESCRIPTION)';
    }

    /**
     * Get duration in milliseconds
     */
    get duration(): number {
        return this.endTimestamp - this.startTimestamp;
    }

    /**
     * Serialize to JSON
     */
    toJSON(): object {
        return {
            productName: this.productName,
            productType: this.productType,
            suiteType: this.suiteType,
            environment: this.environment,
            environmentLocation: this.environmentLocation,
            releaseVersion: this.releaseVersion,
            description: this.description,
            startTimestamp: this.startTimestamp,
            endTimestamp: this.endTimestamp,
            duration: this.duration
        };
    }
}