/**
 * Azure Blob Storage Uploader
 * Uploads test reports to Azure Blob Storage for sharing and archival
 * 
 * Required Environment Variables:
 * - AZURE_STORAGE_ACCOUNT: Storage account name
 * - AZURE_STORAGE_KEY: Storage account key (or use SAS token)
 * - AZURE_STORAGE_SAS_TOKEN: SAS token (alternative to key)
 * - AZURE_STORAGE_CONTAINER: Container name (default: playwright-reports)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Azure upload result
 */
export interface AzureUploadResult {
    success: boolean;
    url?: string;
    error?: string;
    files?: Array<{
        name: string;
        url: string;
        size: number;
    }>;
}

/**
 * Azure Blob Uploader Configuration
 */
export interface AzureBlobConfig {
    accountName: string;
    accountKey?: string;
    sasToken?: string;
    containerName: string;
    blobPrefix?: string;
}

/**
 * Azure Blob Storage Uploader
 */
export class AzureBlobUploader {
    private config: AzureBlobConfig;

    constructor(config?: Partial<AzureBlobConfig>) {
        this.config = {
            accountName: config?.accountName || process.env.AZURE_STORAGE_ACCOUNT || '',
            accountKey: config?.accountKey || process.env.AZURE_STORAGE_KEY,
            sasToken: config?.sasToken || process.env.AZURE_STORAGE_SAS_TOKEN,
            containerName: config?.containerName || process.env.AZURE_STORAGE_CONTAINER || 'playwright-reports',
            blobPrefix: config?.blobPrefix || ''
        };
    }

    /**
     * Check if Azure configuration is available
     */
    isConfigured(): boolean {
        return !!(this.config.accountName && (this.config.accountKey || this.config.sasToken));
    }

    /**
     * Get the base URL for the storage account
     */
    private getBaseUrl(): string {
        return `https://${this.config.accountName}.blob.core.windows.net`;
    }

    /**
     * Get the container URL
     */
    private getContainerUrl(): string {
        return `${this.getBaseUrl()}/${this.config.containerName}`;
    }

    /**
     * Generate authorization header for Azure REST API
     * Uses Shared Key authentication
     */
    private generateAuthHeader(
        method: string,
        blobPath: string,
        contentLength: number,
        contentType: string,
        date: string
    ): string {
        if (this.config.sasToken) {
            // SAS token auth doesn't need header
            return '';
        }

        if (!this.config.accountKey) {
            throw new Error('Azure Storage Key not configured');
        }

        // Construct the string to sign
        const stringToSign = [
            method,                    // HTTP verb
            '',                        // Content-Encoding
            '',                        // Content-Language
            contentLength.toString(),  // Content-Length
            '',                        // Content-MD5
            contentType,               // Content-Type
            '',                        // Date (we use x-ms-date)
            '',                        // If-Modified-Since
            '',                        // If-Match
            '',                        // If-None-Match
            '',                        // If-Unmodified-Since
            '',                        // Range
            `x-ms-blob-type:BlockBlob`,
            `x-ms-date:${date}`,
            `x-ms-version:2020-04-08`,
            `/${this.config.accountName}/${this.config.containerName}/${blobPath}`
        ].join('\n');

        // Create HMAC-SHA256 signature
        const key = Buffer.from(this.config.accountKey, 'base64');
        const signature = crypto.createHmac('sha256', key)
            .update(stringToSign, 'utf8')
            .digest('base64');

        return `SharedKey ${this.config.accountName}:${signature}`;
    }

    /**
     * Get URL with SAS token if using SAS auth
     */
    private getUrlWithAuth(blobPath: string): string {
        const baseUrl = `${this.getContainerUrl()}/${blobPath}`;
        if (this.config.sasToken) {
            return `${baseUrl}?${this.config.sasToken}`;
        }
        return baseUrl;
    }

    /**
     * Upload a single file to Azure Blob Storage
     */
    async uploadFile(localPath: string, blobPath: string): Promise<AzureUploadResult> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Azure Storage not configured' };
        }

        try {
            const fileContent = fs.readFileSync(localPath);
            const contentType = this.getContentType(localPath);
            const date = new Date().toUTCString();
            const fullBlobPath = this.config.blobPrefix 
                ? `${this.config.blobPrefix}/${blobPath}` 
                : blobPath;

            const url = this.getUrlWithAuth(fullBlobPath);
            const headers: Record<string, string> = {
                'Content-Type': contentType,
                'Content-Length': fileContent.length.toString(),
                'x-ms-blob-type': 'BlockBlob',
                'x-ms-date': date,
                'x-ms-version': '2020-04-08'
            };

            // Add authorization header if using Shared Key
            if (!this.config.sasToken) {
                headers['Authorization'] = this.generateAuthHeader(
                    'PUT',
                    fullBlobPath,
                    fileContent.length,
                    contentType,
                    date
                );
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers,
                body: fileContent
            });

            if (response.ok) {
                const publicUrl = `${this.getContainerUrl()}/${fullBlobPath}`;
                return {
                    success: true,
                    url: publicUrl,
                    files: [{
                        name: path.basename(localPath),
                        url: publicUrl,
                        size: fileContent.length
                    }]
                };
            } else {
                const errorText = await response.text();
                return {
                    success: false,
                    error: `Upload failed: ${response.status} - ${errorText}`
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `Upload error: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    /**
     * Upload a directory recursively to Azure Blob Storage
     */
    async uploadDirectory(localDir: string, blobPrefix?: string): Promise<AzureUploadResult> {
        if (!this.isConfigured()) {
            return { success: false, error: 'Azure Storage not configured' };
        }

        const prefix = blobPrefix || path.basename(localDir);
        const uploadedFiles: Array<{ name: string; url: string; size: number }> = [];
        const errors: string[] = [];

        const uploadRecursive = async (currentDir: string, currentPrefix: string) => {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const localPath = path.join(currentDir, entry.name);
                const blobPath = `${currentPrefix}/${entry.name}`;

                if (entry.isDirectory()) {
                    await uploadRecursive(localPath, blobPath);
                } else if (entry.isFile()) {
                    const result = await this.uploadFile(localPath, blobPath);
                    if (result.success && result.files) {
                        uploadedFiles.push(...result.files);
                    } else if (result.error) {
                        errors.push(`${entry.name}: ${result.error}`);
                    }
                }
            }
        };

        try {
            await uploadRecursive(localDir, prefix);

            if (errors.length > 0 && uploadedFiles.length === 0) {
                return {
                    success: false,
                    error: errors.join('; ')
                };
            }

            return {
                success: true,
                url: `${this.getContainerUrl()}/${this.config.blobPrefix ? this.config.blobPrefix + '/' : ''}${prefix}`,
                files: uploadedFiles
            };
        } catch (error) {
            return {
                success: false,
                error: `Directory upload error: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    /**
     * Upload Playwright report folder
     */
    async uploadPlaywrightReport(runFolder: string): Promise<AzureUploadResult> {
        if (!fs.existsSync(runFolder)) {
            return { success: false, error: `Report folder not found: ${runFolder}` };
        }

        // Use the run folder name as the blob prefix
        const folderName = path.basename(runFolder);
        console.log(`📤 Uploading report to Azure: ${folderName}`);

        const result = await this.uploadDirectory(runFolder, folderName);

        if (result.success) {
            console.log(`✓ Report uploaded to: ${result.url}`);
            // Set environment variable for other components
            process.env.AZURE_REPORT_URL = result.url;
        } else {
            console.error(`✗ Upload failed: ${result.error}`);
        }

        return result;
    }

    /**
     * Get content type based on file extension
     */
    private getContentType(filePath: string): string {
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes: Record<string, string> = {
            '.html': 'text/html',
            '.htm': 'text/html',
            '.json': 'application/json',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.xml': 'application/xml',
            '.txt': 'text/plain',
            '.log': 'text/plain',
            '.zip': 'application/zip',
            '.webm': 'video/webm',
            '.mp4': 'video/mp4'
        };

        return contentTypes[ext] || 'application/octet-stream';
    }

    /**
     * Static method to upload report (convenience)
     */
    static async uploadReport(runFolder: string, config?: Partial<AzureBlobConfig>): Promise<AzureUploadResult> {
        const uploader = new AzureBlobUploader(config);
        return uploader.uploadPlaywrightReport(runFolder);
    }
}