/**
 * DateTime Helper
 * Helper class for date and time operations
 * Converted from Java: psqa.shared.sis.helpers.DateTimeHelper
 * 
 * @author converted to TypeScript
 */

/**
 * DateTime Helper class with utility methods for date/time operations
 */
export class DateTimeHelper {
    
    /**
     * Get current date as per given timezone and format
     * @param format - Date format string (e.g., 'MM/dd/yyyy')
     * @param timezone - Timezone string (e.g., 'PST', 'EST', 'UTC')
     * @returns Formatted date string
     */
    static getCurrentDateAsPerGivenTimeZoneAndFormat(format: string, timezone: string): string {
        const date = new Date();
        
        // Map common timezone abbreviations to IANA timezone names
        const timezoneMap: Record<string, string> = {
            'PST': 'America/Los_Angeles',
            'PDT': 'America/Los_Angeles',
            'EST': 'America/New_York',
            'EDT': 'America/New_York',
            'CST': 'America/Chicago',
            'CDT': 'America/Chicago',
            'MST': 'America/Denver',
            'MDT': 'America/Denver',
            'UTC': 'UTC',
            'GMT': 'GMT'
        };

        const ianaTimezone = timezoneMap[timezone] || timezone;

        // Get date parts in the specified timezone
        const options: Intl.DateTimeFormatOptions = {
            timeZone: ianaTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(date);
        
        const datePartsMap: Record<string, string> = {};
        parts.forEach(part => {
            datePartsMap[part.type] = part.value;
        });

        // Apply the format
        let result = format;
        result = result.replace('yyyy', datePartsMap.year || '');
        result = result.replace('yy', (datePartsMap.year || '').slice(-2));
        result = result.replace('MM', datePartsMap.month || '');
        result = result.replace('M', parseInt(datePartsMap.month || '0').toString());
        result = result.replace('dd', datePartsMap.day || '');
        result = result.replace('d', parseInt(datePartsMap.day || '0').toString());
        result = result.replace('HH', datePartsMap.hour || '');
        result = result.replace('H', parseInt(datePartsMap.hour || '0').toString());
        result = result.replace('mm', datePartsMap.minute || '');
        result = result.replace('m', parseInt(datePartsMap.minute || '0').toString());
        result = result.replace('ss', datePartsMap.second || '');
        result = result.replace('s', parseInt(datePartsMap.second || '0').toString());

        return result;
    }

    /**
     * Get current date in ISO format
     * @returns Date in ISO format (YYYY-MM-DD)
     */
    static getCurrentDateISO(): string {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Get current date and time in ISO format
     * @returns Date and time in ISO format
     */
    static getCurrentDateTimeISO(): string {
        return new Date().toISOString();
    }

    /**
     * Format date to US format (MM/dd/yyyy)
     * @param date - Date object
     * @returns Formatted date string
     */
    static formatToUSDate(date: Date): string {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    /**
     * Parse US date format to Date object
     * @param dateString - Date string in MM/dd/yyyy format
     * @returns Date object
     */
    static parseUSDate(dateString: string): Date {
        const [month, day, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }

    /**
     * Add days to a date
     * @param date - Base date
     * @param days - Number of days to add (can be negative)
     * @returns New date
     */
    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * Get difference in days between two dates
     * @param date1 - First date
     * @param date2 - Second date
     * @returns Number of days difference
     */
    static getDaysDifference(date1: Date, date2: Date): number {
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }
}