/**
 * Axis enum - Chart axis definitions
 * Converted from Java enum to TypeScript
 * Maintains exact logic and behavior from the source Java enum
 * 
 * @author Converted from Java
 */
export enum Axis {
    X = 'X',
    Y = 'Y'
}

/**
 * Utility class for Axis enum operations
 * Provides methods that match the original Java enum functionality
 */
export class AxisUtil {
    // Static mapping of enum values to their character values (matching Java logic)
    private static readonly VALUE_MAP = new Map<Axis, string>([
        [Axis.X, 'x'],
        [Axis.Y, 'y']
    ]);

    // Static mapping of enum values to their string representations (matching Java logic)
    // Note: keeping the original value from Java where Y has "x" as string representation
    private static readonly STRING_MAP = new Map<Axis, string>([
        [Axis.X, 'x'],
        [Axis.Y, 'x']  // This matches the Java implementation where Y.toString() returns "x"
    ]);

    /**
     * Returns the character value of the given axis
     * Matches Java's getValue() method
     * @param axis The axis enum value
     * @returns The character value as string (TypeScript equivalent of Java's char)
     */
    static getValue(axis: Axis): string {
        const value = AxisUtil.VALUE_MAP.get(axis);
        if (value === undefined) {
            throw new Error(`Unknown axis: ${axis}`);
        }
        return value;
    }

    /**
     * Returns the string representation of the given axis
     * Matches Java's toString() method
     * @param axis The axis enum value
     * @returns The string representation
     */
    static toString(axis: Axis): string {
        const str = AxisUtil.STRING_MAP.get(axis);
        if (str === undefined) {
            throw new Error(`Unknown axis: ${axis}`);
        }
        return str;
    }

    /**
     * Returns all enum values as an array
     * @returns Array of all Axis enum values
     */
    static values(): Axis[] {
        return Object.values(Axis);
    }

    /**
     * Returns the enum value that matches the given string representation
     * @param str The string to match against toString() values
     * @returns The matching Axis enum value
     * @throws Error if no matching value is found
     */
    static valueOf(str: string): Axis {
        for (const axis of AxisUtil.values()) {
            if (AxisUtil.toString(axis) === str) {
                return axis;
            }
        }
        throw new Error(`No enum constant with toString() value '${str}'`);
    }

    /**
     * Returns the enum value that matches the given character value
     * @param value The character value to match
     * @returns The matching Axis enum value
     * @throws Error if no matching value is found
     */
    static getByValue(value: string): Axis {
        for (const axis of AxisUtil.values()) {
            if (AxisUtil.getValue(axis) === value) {
                return axis;
            }
        }
        throw new Error(`No enum constant with value '${value}'`);
    }

    /**
     * Returns the enum value by its name
     * @param name The name of the enum constant (X or Y)
     * @returns The matching Axis enum value
     * @throws Error if no matching value is found
     */
    static getByName(name: string): Axis {
        const upperName = name.toUpperCase();
        if (upperName in Axis) {
            return Axis[upperName as keyof typeof Axis];
        }
        throw new Error(`No enum constant Axis.${name}`);
    }

    /**
     * Checks if the given value is a valid Axis enum value
     * @param value The value to check
     * @returns true if value is a valid Axis enum value
     */
    static isValidAxis(value: any): value is Axis {
        return Object.values(Axis).includes(value);
    }

    /**
     * Get all character values
     * @returns Array of all character values
     */
    static getAllValues(): string[] {
        return Array.from(AxisUtil.VALUE_MAP.values());
    }

    /**
     * Get all string representations
     * @returns Array of all string representations
     */
    static getAllStrings(): string[] {
        return Array.from(AxisUtil.STRING_MAP.values());
    }
}

/**
 * BatchStatus enum - Processing status definitions
 * 
 * @author poojitha
 * @since 21-06-2021
 */
export enum BatchStatus {
    PROCESSING_COMPLETE = 'Processing Complete',
    TASK_QUEUED = 'Task Queued',
    LOADING = 'Loading',
    READY_TO_PROCESS = 'Ready to Process',
    READY_TO_STAGE = 'Ready to Stage',
    STAGED = 'Staged',
    PROCESSED = 'Processed',
    NEEDS_ATTENTION = 'Needs Attention',
    PROCESSING_ERROR = 'Processing Error'
}

/**
 * Utility class for BatchStatus enum operations
 * Provides methods that match the original Java enum functionality
 */
export class BatchStatusUtil {
    // Static mapping of enum values to their string representations (matching Java logic)
    private static readonly STATUS_MAP = new Map<BatchStatus, string>([
        [BatchStatus.PROCESSING_COMPLETE, "Processing Complete"],
        [BatchStatus.TASK_QUEUED, "Task Queued"],
        [BatchStatus.LOADING, "Loading"],
        [BatchStatus.READY_TO_PROCESS, "Ready to Process"],
        [BatchStatus.READY_TO_STAGE, "Ready to Stage"],
        [BatchStatus.STAGED, "Staged"],
        [BatchStatus.PROCESSED, "Processed"],
        [BatchStatus.NEEDS_ATTENTION, "Needs Attention"],
        [BatchStatus.PROCESSING_ERROR, "Processing Error"]
    ]);

    /**
     * Returns the string representation of the given batch status
     * Matches Java's toString() method
     * @param status The BatchStatus enum value
     * @returns The string representation
     */
    static toString(status: BatchStatus): string {
        const str = BatchStatusUtil.STATUS_MAP.get(status);
        if (str === undefined) {
            throw new Error(`Unknown batch status: ${status}`);
        }
        return str;
    }

    /**
     * Returns all enum values as an array
     * @returns Array of all BatchStatus enum values
     */
    static values(): BatchStatus[] {
        return Object.values(BatchStatus);
    }

    /**
     * Returns the enum value that matches the given string representation
     * @param str The string to match against toString() values
     * @returns The matching BatchStatus enum value
     * @throws Error if no matching value is found
     */
    static valueOf(str: string): BatchStatus {
        for (const status of BatchStatusUtil.values()) {
            if (BatchStatusUtil.toString(status) === str) {
                return status;
            }
        }
        throw new Error(`No enum constant with toString() value '${str}'`);
    }

    /**
     * Returns the enum value by its name
     * @param name The name of the enum constant
     * @returns The matching BatchStatus enum value
     * @throws Error if no matching value is found
     */
    static getByName(name: string): BatchStatus {
        const upperName = name.toUpperCase();
        if (upperName in BatchStatus) {
            return BatchStatus[upperName as keyof typeof BatchStatus];
        }
        throw new Error(`No enum constant BatchStatus.${name}`);
    }

    /**
     * Checks if the given value is a valid BatchStatus enum value
     * @param value The value to check
     * @returns true if value is a valid BatchStatus enum value
     */
    static isValidBatchStatus(value: any): value is BatchStatus {
        return Object.values(BatchStatus).includes(value);
    }

    /**
     * Get all string representations
     * @returns Array of all string representations
     */
    static getAllStatuses(): string[] {
        return Array.from(BatchStatusUtil.STATUS_MAP.values());
    }

    /**
     * Returns the enum value that matches the given string (case-insensitive)
     * @param str The string to match (case-insensitive)
     * @returns The matching BatchStatus enum value or undefined if not found
     */
    static fromString(str: string): BatchStatus | undefined {
        const lowerStr = str.toLowerCase();
        for (const status of BatchStatusUtil.values()) {
            if (BatchStatusUtil.toString(status).toLowerCase() === lowerStr) {
                return status;
            }
        }
        return undefined;
    }
}

/**
 * HoonuitDB enum - Database type definitions
 * 
 * @author sahil.srivastava
 * @since 22/06/21
 */
export enum HoonuitDB {
    AZURE_SQL_SERVER = 'azure_sql_server',
    AZURE_PS5 = 'azure_ps5'
}

/**
 * Utility class for HoonuitDB enum operations
 * Provides methods that match the original Java enum functionality
 */
export class HoonuitDBUtil {
    /**
     * Returns the string representation of the given database type
     * Matches Java's toString() method
     * @param db HoonuitDB enum value
     * @returns String representation
     */
    static toString(db: HoonuitDB): string {
        return db.valueOf();
    }

    /**
     * Returns all enum values as an array
     * @returns Array of all HoonuitDB enum values
     */
    static values(): HoonuitDB[] {
        return Object.values(HoonuitDB);
    }

    /**
     * Returns the enum value that matches the given string value
     * @param value String value to match
     * @returns The matching HoonuitDB enum value or undefined if not found
     */
    static fromString(value: string): HoonuitDB | undefined {
        return Object.values(HoonuitDB).find(db => db === value);
    }

    /**
     * Returns the enum value by its name
     * @param name The name of the enum constant
     * @returns The matching HoonuitDB enum value
     * @throws Error if no matching value is found
     */
    static getByName(name: string): HoonuitDB {
        const upperName = name.toUpperCase();
        if (upperName in HoonuitDB) {
            return HoonuitDB[upperName as keyof typeof HoonuitDB];
        }
        throw new Error(`No enum constant HoonuitDB.${name}`);
    }

    /**
     * Checks if the given value is a valid HoonuitDB enum value
     * @param value The value to check
     * @returns true if value is a valid HoonuitDB enum value
     */
    static isValidHoonuitDB(value: any): value is HoonuitDB {
        return Object.values(HoonuitDB).includes(value);
    }

    /**
     * Get all enum values
     * @returns Array of all enum values
     */
    static getAllValues(): string[] {
        return Object.values(HoonuitDB);
    }
}

/**
 * TenantManager enum - Tenant management definitions
 * 
 * @author pavithra
 * @since 21-07-2023
 */
export enum TenantManager {
    // Tenant Details
    DISTRICT_CODE = '35260000000000000000',
    // Tenant status
    DEPLOYMENT_PENDING = 'DeploymentPending',
    DEPLOYING = 'Deploying',
    UPGRADING = 'Upgrading',
    DECOMISSIONING = 'Decommissioning',
    DECOMISSION_PENDING = 'DecommissionPending',
    // Powerschool connector details
    POWERSCHOOL_DISTRICT_ID = 'sisinttest5',
    POWERSCHOOL_SISDB_OVERRIDE_NAME = 'qa_sisinttest5',
    POWERSCHOOL_GPA_CALCULATION_METHOD_USED = "('Weighted',1)"
}

/**
 * Utility class for TenantManager enum operations
 * Provides methods that match the original Java enum functionality
 */
export class TenantManagerUtil {
    /**
     * Returns all enum values as an array
     * @returns Array of all TenantManager enum values
     */
    static values(): TenantManager[] {
        return Object.values(TenantManager);
    }

    /**
     * Returns the enum value by its name
     * @param name The name of the enum constant
     * @returns The matching TenantManager enum value
     * @throws Error if no matching value is found
     */
    static getByName(name: string): TenantManager {
        const upperName = name.toUpperCase();
        if (upperName in TenantManager) {
            return TenantManager[upperName as keyof typeof TenantManager];
        }
        throw new Error(`No enum constant TenantManager.${name}`);
    }

    /**
     * Checks if the given value is a valid TenantManager enum value
     * @param value The value to check
     * @returns true if value is a valid TenantManager enum value
     */
    static isValidTenantManager(value: any): value is TenantManager {
        return Object.values(TenantManager).includes(value);
    }

    /**
     * Returns the enum value that matches the given string value
     * @param str The string to match against enum values
     * @returns The matching TenantManager enum value or undefined if not found
     */
    static fromString(str: string): TenantManager | undefined {
        return Object.values(TenantManager).find(tm => tm === str);
    }

    /**
     * Get all enum values
     * @returns Array of all enum values
     */
    static getAllValues(): string[] {
        return Object.values(TenantManager);
    }
}