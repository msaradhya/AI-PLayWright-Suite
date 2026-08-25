/**
 * PowerSchool DateTime utility for consistent date/time formatting
 * Used in reports, logs, and timestamps
 */
export class PSDateTime {
    private readonly date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    static fromEpoch(timestamp: number): PSDateTime {
        return new PSDateTime(new Date(timestamp));
    }

    static get now(): PSDateTime {
        return new PSDateTime(new Date());
    }

    static from(date: Date | string): PSDateTime {
        if (typeof date === 'string') {
            return new PSDateTime(new Date(date));
        }
        return new PSDateTime(date);
    }

    addDays(days: number): PSDateTime {
        const newDate = new Date(this.date);
        newDate.setDate(newDate.getDate() + days);
        return new PSDateTime(newDate);
    }

    addHours(hours: number): PSDateTime {
        const newDate = new Date(this.date);
        newDate.setHours(newDate.getHours() + hours);
        return new PSDateTime(newDate);
    }

    addMinutes(minutes: number): PSDateTime {
        const newDate = new Date(this.date);
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return new PSDateTime(newDate);
    }

    isBefore(other: PSDateTime): boolean {
        return this.date.getTime() < other.date.getTime();
    }

    isAfter(other: PSDateTime): boolean {
        return this.date.getTime() > other.date.getTime();
    }

    /**
     * Format date using pattern tokens
     * Supported tokens:
     * - {yyyy}: 4-digit year
     * - {MM}: 2-digit month (01-12)
     * - {dd}: 2-digit day (01-31)
     * - {HH}: 2-digit hour (00-23)
     * - {mm}: 2-digit minute (00-59)
     * - {ss}: 2-digit second (00-59)
     * - {z}: Timezone (UTC)
     */
    format(pattern: string): string {
        const date = this.date;
        
        return pattern
            .replace('{MM}', String(date.getMonth() + 1).padStart(2, '0'))
            .replace('{dd}', String(date.getDate()).padStart(2, '0'))
            .replace('{yyyy}', String(date.getFullYear()))
            .replace('{HH}', String(date.getHours()).padStart(2, '0'))
            .replace('{mm}', String(date.getMinutes()).padStart(2, '0'))
            .replace('{ss}', String(date.getSeconds()).padStart(2, '0'))
            .replace('{z}', 'UTC');
    }

    /**
     * Get ISO 8601 formatted string
     */
    toISOString(): string {
        return this.date.toISOString();
    }

    /**
     * Get Unix timestamp in milliseconds
     */
    getTime(): number {
        return this.date.getTime();
    }

    /**
     * Get the underlying Date object
     */
    toDate(): Date {
        return new Date(this.date);
    }

    /**
     * Create a folder-friendly timestamp string
     * Format: YYYY-MM-DD_HH-mm-ss
     */
    toFolderFormat(): string {
        return this.format('{yyyy}-{MM}-{dd}_{HH}-{mm}-{ss}');
    }
}

/**
 * PowerSchool Duration utility for formatting time durations
 */
export class PSDuration {
    private readonly milliseconds: number;

    constructor(milliseconds: number) {
        this.milliseconds = milliseconds;
    }

    static of(milliseconds: number): PSDuration {
        return new PSDuration(milliseconds);
    }

    static between(start: number, end: number): PSDuration {
        return new PSDuration(end - start);
    }

    get text(): string {
        const totalSeconds = Math.floor(this.milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = this.milliseconds % 1000;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}.${Math.floor(ms)}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}.${Math.floor(ms)}s`;
        } else {
            return `${seconds}.${Math.floor(ms)}s`;
        }
    }

    /**
     * Get duration in seconds
     */
    get seconds(): number {
        return Math.floor(this.milliseconds / 1000);
    }

    /**
     * Get duration in minutes
     */
    get minutes(): number {
        return Math.floor(this.milliseconds / 60000);
    }

    /**
     * Get raw milliseconds
     */
    get ms(): number {
        return this.milliseconds;
    }
}