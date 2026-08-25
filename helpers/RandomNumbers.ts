/**
 * Random Numbers Helper
 * Helper class for generating random numbers and strings
 * Converted from Java: psqa.testfw.data.random.RandomNumbers
 * 
 * @author converted to TypeScript
 */

/**
 * Random Numbers class with utility methods for generating random values
 */
export class RandomNumbers {
    
    /**
     * Generate a random integer with specified number of digits
     * @param digits - Number of digits for the random integer
     * @returns Random integer as a number
     */
    static getRandomInteger(digits: number): number {
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate a random integer within a range
     * @param min - Minimum value (inclusive)
     * @param max - Maximum value (inclusive)
     * @returns Random integer within the range
     */
    static getRandomIntegerInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate a random float with specified precision
     * @param min - Minimum value
     * @param max - Maximum value
     * @param precision - Number of decimal places
     * @returns Random float
     */
    static getRandomFloat(min: number, max: number, precision: number = 2): number {
        const value = Math.random() * (max - min) + min;
        return parseFloat(value.toFixed(precision));
    }

    /**
     * Generate a random alphanumeric string
     * @param length - Length of the string
     * @returns Random alphanumeric string
     */
    static getRandomAlphanumeric(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Generate a random word (alphabetic only)
     * @param length - Length of the word
     * @returns Random word
     */
    static getRandomWord(length: number): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            const char = chars.charAt(Math.floor(Math.random() * chars.length));
            result += i === 0 ? char.toUpperCase() : char;
        }
        return result;
    }

    /**
     * Generate a random boolean
     * @returns Random boolean value
     */
    static getRandomBoolean(): boolean {
        return Math.random() >= 0.5;
    }

    /**
     * Pick a random element from an array
     * @param array - Array to pick from
     * @returns Random element from the array
     */
    static pickRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Generate a random UUID
     * @returns Random UUID string
     */
    static getRandomUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Generate a random email address
     * @param domain - Optional domain name (default: 'test.com')
     * @returns Random email address
     */
    static getRandomEmail(domain: string = 'test.com'): string {
        const localPart = this.getRandomAlphanumeric(10).toLowerCase();
        return `${localPart}@${domain}`;
    }

    /**
     * Generate a random phone number
     * @returns Random phone number in format XXX-XXX-XXXX
     */
    static getRandomPhoneNumber(): string {
        const areaCode = this.getRandomIntegerInRange(200, 999);
        const exchange = this.getRandomIntegerInRange(200, 999);
        const subscriber = this.getRandomIntegerInRange(1000, 9999);
        return `${areaCode}-${exchange}-${subscriber}`;
    }
}

/**
 * Random Strings alias for compatibility
 */
export const RandomStrings = {
    /**
     * Generate a random word
     * @param length - Length of the word
     * @returns Random word
     */
    generateRandomWord: (length: number): string => {
        return RandomNumbers.getRandomWord(length);
    },
    
    /**
     * Generate a random alphanumeric string
     * @param length - Length of the string
     * @returns Random alphanumeric string
     */
    generateRandomAlphanumeric: (length: number): string => {
        return RandomNumbers.getRandomAlphanumeric(length);
    }
};