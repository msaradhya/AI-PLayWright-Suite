/**
 * Model for Assessment Importer Batch Data
 * Merged implementation from:
 * - msa/hoonuit/shared/testdatamodel/assessmentImporterBatchData.ts (batch processing workflow)
 * - msa/hoonuit/models/assessmentImporterBatchData.ts (file configuration)
 *
 * @author amittiwari (original), Converted to TypeScript
 * @since 2021-07-29
 */

// ============================================
// Interfaces (from models/)
// ============================================

export interface AssessmentType {
  name: string;
  fieldMapping?: string;
}

export interface FileInfo {
  path: string;
  description: string;
  year?: string;
  period?: string;
  vendor?: string;
}

// ============================================
// Batch Workflow Status Constants (from testdatamodel/)
// ============================================

/**
 * Assessment Importer Batch Workflow Status Constants
 * Note: Different from BatchStatus enum in core-enums.ts which is for UI display
 * This class provides simple string constants for batch workflow logic
 */
export class AssessmentBatchStatus {
    static readonly PENDING = 'PENDING';
    static readonly PROCESSING = 'PROCESSING';
    static readonly PROCESSED = 'PROCESSED';
    static readonly FAILED = 'FAILED';
    static readonly READY = 'READY';
    static readonly IDENTIFIED = 'IDENTIFIED';
    static readonly COMPLETED = 'COMPLETED';
    static readonly ERROR = 'ERROR';
}

// ============================================
// File Type Constants (from testdatamodel/)
// ============================================

/**
 * File Type Constants
 */
export class FileType {
    static readonly CSV = 'CSV';
    static readonly XLSX = 'XLSX';
    static readonly XLS = 'XLS';
    static readonly TXT = 'TXT';
    static readonly XML = 'XML';
    static readonly JSON = 'JSON';
}

// ============================================
// Main Data Class - Merged Implementation
// ============================================

/**
 * Assessment Importer Batch Data Model
 * Combines file configuration and batch processing functionality
 */
export class AssessmentImporterBatchData {
    // Properties from models/ (file configuration)
    fileSetName: string;
    fileSetDescription: string;
    assessmentType: AssessmentType;
    fileInfo: FileInfo;
    deleteAfterTest: boolean;
    importFieldMapping: string;

    // Properties from testdatamodel/ (batch processing)
    private batchName: string;
    private assessmentName: string;
    private schoolYear: string;
    private timePeriod: string;
    private batchId: string;
    private status: string;
    private studentId: string;
    private fileName: string;
    private filePath: string;
    private fileType: string;
    private uploadDate: string;
    private processedDate: string;
    private recordsCount: number;
    private validRecords: number;
    private invalidRecords: number;
    private processingErrors: string[];
    private processedStatus: boolean;
    private identifiedStatus: boolean;
    private errorStatus: boolean;

    /**
     * Constructor for AssessmentImporterBatchData
     * Supports both file configuration and batch processing initialization
     */
    constructor(data?: {
        // File configuration properties
        fileSetName?: string;
        fileSetDescription?: string;
        assessmentType?: AssessmentType;
        fileInfo?: FileInfo;
        deleteAfterTest?: boolean;
        importFieldMapping?: string;
        batchName?: string;
        // Batch processing properties
        assessmentName?: string;
        schoolYear?: string;
        timePeriod?: string;
    }) {
        // Initialize file configuration properties
        this.fileSetName = data?.fileSetName || '';
        this.fileSetDescription = data?.fileSetDescription || '';
        this.assessmentType = data?.assessmentType || { name: '' };
        this.fileInfo = data?.fileInfo || { path: '', description: '' };
        this.deleteAfterTest = data?.deleteAfterTest !== undefined ? data.deleteAfterTest : true;
        this.importFieldMapping = data?.importFieldMapping || '';

        // Initialize batch processing properties
        this.batchName = data?.batchName || '';
        this.assessmentName = data?.assessmentName || '';
        this.schoolYear = data?.schoolYear || '';
        this.timePeriod = data?.timePeriod || '';
        this.batchId = '';
        this.status = '';
        this.studentId = '';
        this.fileName = '';
        this.filePath = '';
        this.fileType = '';
        this.uploadDate = '';
        this.processedDate = '';
        this.recordsCount = 0;
        this.validRecords = 0;
        this.invalidRecords = 0;
        this.processingErrors = [];
        this.processedStatus = false;
        this.identifiedStatus = false;
        this.errorStatus = false;

        // Auto-generate batch name if not provided but fileSetName is available
        if (!this.batchName && this.fileSetName) {
            this.batchName = this.generateBatchName();
        }
    }

    // ============================================
    // Methods from models/ (file configuration)
    // ============================================

    /**
     * Generate a batch name from the file set name and a timestamp
     */
    generateBatchName(): string {
        const timestamp = new Date().getTime();
        const baseName = this.fileSetName || this.assessmentName || 'Batch';
        return `${baseName}_Batch_${timestamp}`;
    }

    /**
     * Set the file path (updates fileInfo.path)
     * @param filePath New file path
     */
    setFilePath(filePath: string): void {
        this.fileInfo.path = filePath;
        this.filePath = filePath;
    }

    /**
     * Set whether to delete after test
     * @param deleteAfterTest Flag indicating whether to delete after test
     */
    setDeleteAfterTest(deleteAfterTest: boolean): void {
        this.deleteAfterTest = deleteAfterTest;
    }

    /**
     * Set the import field mapping
     * @param mapping Field mapping to use
     */
    setImportFieldMapping(mapping: string): void {
        this.importFieldMapping = mapping;
    }

    // ============================================
    // Methods from testdatamodel/ (batch processing)
    // ============================================

    /**
     * Get the batch name
     * @returns The batch name
     */
    getBatchName(): string {
        return this.batchName;
    }

    /**
     * Set the batch name
     * @param batchName The batch name to set
     */
    setBatchName(batchName: string): void {
        this.batchName = batchName;
    }

    /**
     * Get the assessment name
     * @returns The assessment name
     */
    getAssessmentName(): string {
        return this.assessmentName;
    }

    /**
     * Set the assessment name
     * @param assessmentName The assessment name to set
     */
    setAssessmentName(assessmentName: string): void {
        this.assessmentName = assessmentName;
    }

    /**
     * Get the school year
     * @returns The school year
     */
    getSchoolYear(): string {
        return this.schoolYear;
    }

    /**
     * Set the school year
     * @param schoolYear The school year to set
     */
    setSchoolYear(schoolYear: string): void {
        this.schoolYear = schoolYear;
    }

    /**
     * Get the time period
     * @returns The time period
     */
    getTimePeriod(): string {
        return this.timePeriod;
    }

    /**
     * Set the time period
     * @param timePeriod The time period to set
     */
    setTimePeriod(timePeriod: string): void {
        this.timePeriod = timePeriod;
    }

    /**
     * Get the batch ID
     * @returns The batch ID
     */
    getBatchId(): string {
        return this.batchId;
    }

    /**
     * Set the batch ID
     * @param batchId The batch ID to set
     */
    setBatchId(batchId: string): void {
        this.batchId = batchId;
    }

    /**
     * Get the batch status
     * @returns The batch status
     */
    getStatus(): string {
        return this.status;
    }

    /**
     * Set the batch status
     * @param status The batch status to set
     */
    setStatus(status: string): void {
        this.status = status;
    }

    /**
     * Get the student ID
     * @returns The student ID
     */
    getStudentId(): string {
        return this.studentId;
    }

    /**
     * Set the student ID
     * @param studentId The student ID to set
     */
    setStudentId(studentId: string): void {
        this.studentId = studentId;
    }

    /**
     * Get the file name
     * @returns The file name
     */
    getFileName(): string {
        return this.fileName;
    }

    /**
     * Set the file name
     * @param fileName The file name to set
     */
    setFileName(fileName: string): void {
        this.fileName = fileName;
    }

    /**
     * Get the file path
     * @returns The file path
     */
    getFilePath(): string {
        return this.filePath;
    }

    /**
     * Get the file type
     * @returns The file type
     */
    getFileType(): string {
        return this.fileType;
    }

    /**
     * Set the file type
     * @param fileType The file type to set
     */
    setFileType(fileType: string): void {
        this.fileType = fileType;
    }

    /**
     * Get the upload date
     * @returns The upload date
     */
    getUploadDate(): string {
        return this.uploadDate;
    }

    /**
     * Set the upload date
     * @param uploadDate The upload date to set
     */
    setUploadDate(uploadDate: string): void {
        this.uploadDate = uploadDate;
    }

    /**
     * Get the processed date
     * @returns The processed date
     */
    getProcessedDate(): string {
        return this.processedDate;
    }

    /**
     * Set the processed date
     * @param processedDate The processed date to set
     */
    setProcessedDate(processedDate: string): void {
        this.processedDate = processedDate;
    }

    /**
     * Get the records count
     * @returns The records count
     */
    getRecordsCount(): number {
        return this.recordsCount;
    }

    /**
     * Set the records count
     * @param recordsCount The records count to set
     */
    setRecordsCount(recordsCount: number): void {
        this.recordsCount = recordsCount;
    }

    /**
     * Get the valid records count
     * @returns The valid records count
     */
    getValidRecords(): number {
        return this.validRecords;
    }

    /**
     * Set the valid records count
     * @param validRecords The valid records count to set
     */
    setValidRecords(validRecords: number): void {
        this.validRecords = validRecords;
    }

    /**
     * Get the invalid records count
     * @returns The invalid records count
     */
    getInvalidRecords(): number {
        return this.invalidRecords;
    }

    /**
     * Set the invalid records count
     * @param invalidRecords The invalid records count to set
     */
    setInvalidRecords(invalidRecords: number): void {
        this.invalidRecords = invalidRecords;
    }

    /**
     * Get the processing errors
     * @returns The processing errors array
     */
    getProcessingErrors(): string[] {
        return this.processingErrors;
    }

    /**
     * Set the processing errors
     * @param processingErrors The processing errors array to set
     */
    setProcessingErrors(processingErrors: string[]): void {
        this.processingErrors = processingErrors;
    }

    /**
     * Add a processing error
     * @param error The error to add
     */
    addProcessingError(error: string): void {
        this.processingErrors.push(error);
    }

    /**
     * Clear all processing errors
     */
    clearProcessingErrors(): void {
        this.processingErrors = [];
    }

    /**
     * Check if the batch is processed
     * @returns True if processed, false otherwise
     */
    isProcessed(): boolean {
        return this.processedStatus;
    }

    /**
     * Set the processed status
     * @param processed The processed status to set
     */
    setProcessed(processed: boolean): void {
        this.processedStatus = processed;
    }

    /**
     * Check if the batch is identified
     * @returns True if identified, false otherwise
     */
    isIdentified(): boolean {
        return this.identifiedStatus;
    }

    /**
     * Set the identified status
     * @param identified The identified status to set
     */
    setIdentified(identified: boolean): void {
        this.identifiedStatus = identified;
    }

    /**
     * Check if the batch has errors
     * @returns True if has errors, false otherwise
     */
    hasErrors(): boolean {
        return this.errorStatus;
    }

    /**
     * Set the error status
     * @param hasErrors The error status to set
     */
    setHasErrors(hasErrors: boolean): void {
        this.errorStatus = hasErrors;
    }

    /**
     * Get batch summary information
     * @returns A formatted string with batch summary
     */
    getBatchSummary(): string {
        return `Batch: ${this.batchName} | Assessment: ${this.assessmentName} | Year: ${this.schoolYear} | Period: ${this.timePeriod} | Status: ${this.status}`;
    }

    /**
     * Get processing summary information
     * @returns A formatted string with processing summary
     */
    getProcessingSummary(): string {
        return `Total Records: ${this.recordsCount} | Valid: ${this.validRecords} | Invalid: ${this.invalidRecords} | Errors: ${this.processingErrors.length}`;
    }

    /**
     * Check if batch is ready for processing
     * @returns True if ready for processing, false otherwise
     */
    isReadyForProcessing(): boolean {
        // Check if either file configuration or batch processing data is available
        const hasFileConfig = this.fileSetName !== '' && this.fileInfo.path !== '';
        const hasBatchConfig = this.batchName !== '' && this.assessmentName !== '' && this.schoolYear !== '' && this.timePeriod !== '';
        return hasFileConfig || hasBatchConfig;
    }

    /**
     * Reset batch data to initial state
     */
    resetBatchData(): void {
        this.batchId = '';
        this.status = '';
        this.studentId = '';
        this.fileName = '';
        this.filePath = '';
        this.fileType = '';
        this.uploadDate = '';
        this.processedDate = '';
        this.recordsCount = 0;
        this.validRecords = 0;
        this.invalidRecords = 0;
        this.processingErrors = [];
        this.processedStatus = false;
        this.identifiedStatus = false;
        this.errorStatus = false;
    }

    /**
     * Create a copy of the current batch data
     * @returns A new AssessmentImporterBatchData instance with copied values
     */
    clone(): AssessmentImporterBatchData {
        const cloned = new AssessmentImporterBatchData({
            fileSetName: this.fileSetName,
            fileSetDescription: this.fileSetDescription,
            assessmentType: { ...this.assessmentType },
            fileInfo: { ...this.fileInfo },
            deleteAfterTest: this.deleteAfterTest,
            importFieldMapping: this.importFieldMapping,
            batchName: this.batchName,
            assessmentName: this.assessmentName,
            schoolYear: this.schoolYear,
            timePeriod: this.timePeriod
        });

        cloned.setBatchId(this.batchId);
        cloned.setStatus(this.status);
        cloned.setStudentId(this.studentId);
        cloned.setFileName(this.fileName);
        cloned.setFileType(this.fileType);
        cloned.setUploadDate(this.uploadDate);
        cloned.setProcessedDate(this.processedDate);
        cloned.setRecordsCount(this.recordsCount);
        cloned.setValidRecords(this.validRecords);
        cloned.setInvalidRecords(this.invalidRecords);
        cloned.setProcessingErrors([...this.processingErrors]);
        cloned.setProcessed(this.processedStatus);
        cloned.setIdentified(this.identifiedStatus);
        cloned.setHasErrors(this.errorStatus);

        return cloned;
    }

    /**
     * Convert batch data to JSON string
     * @returns JSON string representation of the batch data
     */
    toJson(): string {
        return JSON.stringify({
            // File configuration
            fileSetName: this.fileSetName,
            fileSetDescription: this.fileSetDescription,
            assessmentType: this.assessmentType,
            fileInfo: this.fileInfo,
            deleteAfterTest: this.deleteAfterTest,
            importFieldMapping: this.importFieldMapping,
            // Batch processing
            batchName: this.batchName,
            assessmentName: this.assessmentName,
            schoolYear: this.schoolYear,
            timePeriod: this.timePeriod,
            batchId: this.batchId,
            status: this.status,
            studentId: this.studentId,
            fileName: this.fileName,
            filePath: this.filePath,
            fileType: this.fileType,
            uploadDate: this.uploadDate,
            processedDate: this.processedDate,
            recordsCount: this.recordsCount,
            validRecords: this.validRecords,
            invalidRecords: this.invalidRecords,
            processingErrors: this.processingErrors,
            isProcessed: this.processedStatus,
            isIdentified: this.identifiedStatus,
            hasErrors: this.errorStatus
        }, null, 2);
    }

    /**
     * Create batch data from JSON string
     * @param json JSON string to parse
     * @returns New AssessmentImporterBatchData instance
     */
    static fromJson(json: string): AssessmentImporterBatchData {
        const data = JSON.parse(json);
        const batch = new AssessmentImporterBatchData({
            fileSetName: data.fileSetName,
            fileSetDescription: data.fileSetDescription,
            assessmentType: data.assessmentType,
            fileInfo: data.fileInfo,
            deleteAfterTest: data.deleteAfterTest,
            importFieldMapping: data.importFieldMapping,
            batchName: data.batchName,
            assessmentName: data.assessmentName,
            schoolYear: data.schoolYear,
            timePeriod: data.timePeriod
        });

        batch.setBatchId(data.batchId || '');
        batch.setStatus(data.status || '');
        batch.setStudentId(data.studentId || '');
        batch.setFileName(data.fileName || '');
        batch.setFileType(data.fileType || '');
        batch.setUploadDate(data.uploadDate || '');
        batch.setProcessedDate(data.processedDate || '');
        batch.setRecordsCount(data.recordsCount || 0);
        batch.setValidRecords(data.validRecords || 0);
        batch.setInvalidRecords(data.invalidRecords || 0);
        batch.setProcessingErrors(data.processingErrors || []);
        batch.setProcessed(data.isProcessed || false);
        batch.setIdentified(data.isIdentified || false);
        batch.setHasErrors(data.hasErrors || false);

        return batch;
    }
}

// ============================================
// Factory Class (from testdatamodel/)
// ============================================

/**
 * Assessment Importer Batch Data Factory
 * Provides factory methods for creating common batch data configurations
 */
export class AssessmentImporterBatchDataFactory {

    /**
     * Create a new batch for upload
     * @param batchName The batch name
     * @param assessmentName The assessment name
     * @param schoolYear The school year
     * @param timePeriod The time period
     * @returns New AssessmentImporterBatchData instance configured for upload
     */
    static createUploadBatch(batchName: string, assessmentName: string, schoolYear: string, timePeriod: string): AssessmentImporterBatchData {
        const batch = new AssessmentImporterBatchData({
            batchName,
            assessmentName,
            schoolYear,
            timePeriod
        });
        batch.setStatus(AssessmentBatchStatus.PENDING);
        batch.setUploadDate(new Date().toISOString());
        return batch;
    }

    /**
     * Create a processed batch
     * @param batchName The batch name
     * @param assessmentName The assessment name
     * @param schoolYear The school year
     * @param timePeriod The time period
     * @param recordsCount The total records count
     * @param validRecords The valid records count
     * @param invalidRecords The invalid records count
     * @returns New AssessmentImporterBatchData instance configured as processed
     */
    static createProcessedBatch(
        batchName: string,
        assessmentName: string,
        schoolYear: string,
        timePeriod: string,
        recordsCount: number,
        validRecords: number,
        invalidRecords: number
    ): AssessmentImporterBatchData {
        const batch = new AssessmentImporterBatchData({
            batchName,
            assessmentName,
            schoolYear,
            timePeriod
        });
        batch.setStatus(AssessmentBatchStatus.PROCESSED);
        batch.setRecordsCount(recordsCount);
        batch.setValidRecords(validRecords);
        batch.setInvalidRecords(invalidRecords);
        batch.setProcessed(true);
        batch.setProcessedDate(new Date().toISOString());
        return batch;
    }

    /**
     * Create a batch with errors
     * @param batchName The batch name
     * @param assessmentName The assessment name
     * @param schoolYear The school year
     * @param timePeriod The time period
     * @param errors Array of error messages
     * @returns New AssessmentImporterBatchData instance configured with errors
     */
    static createErrorBatch(
        batchName: string,
        assessmentName: string,
        schoolYear: string,
        timePeriod: string,
        errors: string[]
    ): AssessmentImporterBatchData {
        const batch = new AssessmentImporterBatchData({
            batchName,
            assessmentName,
            schoolYear,
            timePeriod
        });
        batch.setStatus(AssessmentBatchStatus.ERROR);
        batch.setProcessingErrors(errors);
        batch.setHasErrors(true);
        return batch;
    }

    /**
     * Create a batch for file import configuration
     * @param fileSetName The file set name
     * @param fileSetDescription The file set description
     * @param assessmentType The assessment type configuration
     * @param fileInfo The file information
     * @returns New AssessmentImporterBatchData instance configured for file import
     */
    static createFileImportBatch(
        fileSetName: string,
        fileSetDescription: string,
        assessmentType: AssessmentType,
        fileInfo: FileInfo
    ): AssessmentImporterBatchData {
        return new AssessmentImporterBatchData({
            fileSetName,
            fileSetDescription,
            assessmentType,
            fileInfo,
            deleteAfterTest: true
        });
    }
}