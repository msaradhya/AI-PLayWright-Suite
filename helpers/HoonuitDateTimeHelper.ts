/**
 * Hoonuit DateTime Helper
 * Converted from Java to TypeScript for Playwright
 * Provides date and time operations for Hoonuit tests
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
export class HoonuitDateTimeHelper {
  private static readonly DEFAULT_DATE_TIME_FORMAT = 'dd/MM/yyyy H:m:s z';

  /**
   * Get server current date time with default or specified format
   * @param format Optional date time format pattern
   */
  static getServerCurrentDateTime(format?: string): string {
    const actualFormat = format || this.DEFAULT_DATE_TIME_FORMAT;
    const dateTime = this.getServerCurrentDateTimeObject();
    return this.formatDateTime(dateTime, actualFormat);
  }

  /**
   * Get server current date time object
   * Returns current date/time in the configured timezone
   */
  static getServerCurrentDateTimeObject(): Date {
    // Get current date in the configured timezone
    const timezone = this.getTimezone();
    const now = new Date();
    
    // Convert to the target timezone
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + this.getTimezoneOffset(timezone));
  }

  /**
   * Get timezone from configuration
   * Fallback to system timezone if not configured
   */
  private static getTimezone(): string {
    try {
      // Try to get timezone from runtime config
      return process.env.HOONUIT_TIMEZONE || 'America/New_York'; // Default timezone
    } catch (error) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  /**
   * Get timezone offset in milliseconds
   */
  private static getTimezoneOffset(timezone: string): number {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const targetDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    return targetDate.getTime() - utcDate.getTime();
  }

  /**
   * Get day for ETL customization
   * Returns abbreviated day name (e.g., Mon, Tue, etc.)
   */
  static getDayForEtlCustomization(): string {
    const date = new Date();
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  /**
   * Get TMA school current instructional week
   * Uses ISO week calculation to match Java implementation
   */
  static getTMASchoolCurrentInstructionalWeek(): number {
    const currentDate = new Date();
    const schoolStartDate = new Date(2023, 6, 1); // July 1, 2023 (month is 0-indexed)
    
    // Calculate ISO week numbers
    const currentWeek = this.getISOWeekOfYear(currentDate);
    const schoolStartWeek = this.getISOWeekOfYear(schoolStartDate);
    
    return currentWeek - schoolStartWeek;
  }

  /**
   * Get ISO week of year (matches Java's IsoFields.WEEK_OF_WEEK_BASED_YEAR)
   */
  private static getISOWeekOfYear(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNumber = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  /**
   * Get TMA day of absence for previous day
   * Returns previous weekday (skips weekends) - matches Java DayOfWeek.minus(1) logic
   */
  static getTMADayOfAbsencePreviousDay(): string {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Convert to match Java DayOfWeek enum (1 = Monday, 7 = Sunday)
    const javaDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    
    // Calculate previous day (Java DayOfWeek.minus(1))
    let previousWeekday = javaDayOfWeek - 1;
    
    // If previous day is Sunday (7), set to Friday (5)
    if (previousWeekday === 0) { // Sunday in Java enum
      previousWeekday = 5; // Friday
    }
    
    // Map Java DayOfWeek values to short names (TextStyle.SHORT, Locale.US)
    const dayNames: { [key: number]: string } = {
      1: 'Mon', // Monday
      2: 'Tue', // Tuesday
      3: 'Wed', // Wednesday
      4: 'Thu', // Thursday
      5: 'Fri', // Friday
      6: 'Sat', // Saturday
      7: 'Sun'  // Sunday
    };
    
    return dayNames[previousWeekday] || 'Mon';
  }

  /**
   * Get TMA course completion month
   * Returns current month name, or previous month if it's the 1st of the month
   * Matches Java implementation using Month.getDisplayName(TextStyle.FULL, Locale.ENGLISH)
   */
  static getTMACourseCompletionMonth(): string {
    let currentDate = new Date();
    
    // If it's the 1st of the month, use previous month (matches Java logic)
    if (currentDate.getDate() === 1) {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    }
    
    // Use full month name in English (matches Java TextStyle.FULL, Locale.ENGLISH)
    return currentDate.toLocaleDateString('en-US', { month: 'long' });
  }

  /**
   * Get current year
   * @returns Current year as number
   */
  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * Get current month (1-12)
   * @returns Current month as number (1-indexed)
   */
  static getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  /**
   * Get current day of month
   * @returns Current day as number
   */
  static getCurrentDayOfMonth(): number {
    return new Date().getDate();
  }

  /**
   * Format date to ISO string (YYYY-MM-DD)
   * @param date Date to format
   * @returns Formatted date string
   */
  static formatToISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Parse date from ISO string
   * @param dateString Date string in ISO format
   * @returns Date object
   */
  static parseISODate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Get school year string (e.g., "2023-24")
   * @param startYear Starting year of school year
   * @returns School year string
   */
  static getSchoolYearString(startYear?: number): string {
    const year = startYear || this.getCurrentSchoolYear();
    const endYear = (year + 1).toString().slice(-2);
    return `${year}-${endYear}`;
  }

  /**
   * Get current school year (July 1 - June 30)
   * @returns Starting year of current school year
   */
  static getCurrentSchoolYear(): number {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-indexed
    const year = now.getFullYear();
    
    // If before July, we're in the previous school year
    return month < 7 ? year - 1 : year;
  }

  /**
   * Format date time using Java DateTimeFormatter compatible patterns
   * Supports common patterns used in the Java implementation
   */
  private static formatDateTime(date: Date, format: string): string {
    // Apply timezone configuration
    const timezone = this.getTimezone();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    // Get formatted parts
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);
    
    const getPartValue = (type: string) => {
      const part = parts.find(p => p.type === type);
      return part ? part.value : '';
    };

    const day = getPartValue('day');
    const month = getPartValue('month');
    const year = getPartValue('year');
    const hours = getPartValue('hour');
    const minutes = getPartValue('minute');
    const seconds = getPartValue('second');
    
    // Get timezone abbreviation
    const timezoneName = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || timezone;

    // Enhanced pattern replacement to match Java DateTimeFormatter
    let result = format;
    
    // Date patterns
    result = result.replace(/dd/g, day);
    result = result.replace(/MM/g, month);
    result = result.replace(/yyyy/g, year);
    result = result.replace(/y{1,3}/g, year.slice(-2)); // Short year
    
    // Time patterns
    result = result.replace(/HH/g, hours.padStart(2, '0'));
    result = result.replace(/H/g, hours);
    result = result.replace(/mm/g, minutes);
    result = result.replace(/m/g, minutes.replace(/^0/, ''));
    result = result.replace(/ss/g, seconds);
    result = result.replace(/s/g, seconds.replace(/^0/, ''));
    
    // Timezone patterns
    result = result.replace(/z{1,3}/g, timezoneName);
    result = result.replace(/Z/g, this.getTimezoneOffset(timezone).toString());

    return result;
  }

  /**
   * Add days to a date
   * @param date Base date
   * @param days Number of days to add (can be negative)
   * @returns New date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add months to a date
   * @param date Base date
   * @param months Number of months to add (can be negative)
   * @returns New date
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Get difference in days between two dates
   * @param date1 First date
   * @param date2 Second date
   * @returns Number of days difference
   */
  static getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}