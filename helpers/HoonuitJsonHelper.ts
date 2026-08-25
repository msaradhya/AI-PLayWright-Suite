/**
 * Hoonuit JSON Helper
 * Helper class for JSON serialization and deserialization operations
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
export class HoonuitJsonHelper {

  /**
   * Convert an object to JSON string
   * @param obj Object to be serialized
   * @returns JSON string representation of the object
   */
  static getJsonStringFromObject<T>(obj: T): string {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      console.error('Error serializing object to JSON:', error);
      throw new Error(`Failed to serialize object to JSON: ${error}`);
    }
  }

  /**
   * Convert JSON string to object of specified type
   * @param jsonString JSON string to be deserialized
   * @param clazz Type/class to deserialize to
   * @returns Object of specified type
   */
  static getObjectFromJsonString<T>(jsonString: string, clazz: new () => T): T {
    try {
      const parsed = JSON.parse(jsonString);
      
      // For simple objects, direct assignment works
      // For complex objects with methods, you might need more sophisticated mapping
      const instance = new clazz();
      Object.assign(instance as any, parsed);
      
      return instance;
    } catch (error) {
      console.error('Error deserializing JSON to object:', error);
      throw new Error(`Failed to deserialize JSON to object: ${error}`);
    }
  }

  /**
   * Parse JSON string to plain object (no type checking)
   * @param jsonString JSON string to parse
   * @returns Parsed object
   */
  static parseJsonString(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON string:', error);
      throw new Error(`Failed to parse JSON string: ${error}`);
    }
  }

  /**
   * Validate if a string is valid JSON
   * @param jsonString String to validate
   * @returns true if valid JSON, false otherwise
   */
  static isValidJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Pretty print JSON string with indentation
   * @param jsonString JSON string to format
   * @param indent Number of spaces for indentation (default: 2)
   * @returns Formatted JSON string
   */
  static prettyPrint(jsonString: string, indent: number = 2): string {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, indent);
    } catch (error) {
      console.error('Error formatting JSON string:', error);
      return jsonString; // Return original if parsing fails
    }
  }

  /**
   * Deep clone an object using JSON serialization
   * @param obj Object to clone
   * @returns Cloned object
   */
  static deepClone<T>(obj: T): T {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.error('Error cloning object:', error);
      throw new Error(`Failed to clone object: ${error}`);
    }
  }

  /**
   * Compare two objects for equality using JSON serialization
   * @param obj1 First object
   * @param obj2 Second object
   * @returns True if objects are equal
   */
  static areEqual(obj1: any, obj2: any): boolean {
    try {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    } catch {
      return false;
    }
  }

  /**
   * Merge two objects
   * @param target Target object
   * @param source Source object to merge from
   * @returns Merged object
   */
  static merge<T extends object>(target: T, source: Partial<T>): T {
    return { ...target, ...source };
  }

  /**
   * Get a value from a nested object by path
   * @param obj Object to search
   * @param path Path to the value (e.g., 'user.address.city')
   * @returns Value at the path or undefined
   */
  static getValueByPath(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }
    
    return current;
  }

  /**
   * Set a value in a nested object by path
   * @param obj Object to modify
   * @param path Path to set the value (e.g., 'user.address.city')
   * @param value Value to set
   */
  static setValueByPath(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (current[key] === undefined) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  /**
   * Convert object keys to camelCase
   * @param obj Object with keys to convert
   * @returns Object with camelCase keys
   */
  static toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.toCamelCase(item));
    }
    
    if (obj !== null && typeof obj === 'object') {
      const result: any = {};
      for (const key of Object.keys(obj)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = this.toCamelCase(obj[key]);
      }
      return result;
    }
    
    return obj;
  }

  /**
   * Convert object keys to snake_case
   * @param obj Object with keys to convert
   * @returns Object with snake_case keys
   */
  static toSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.toSnakeCase(item));
    }
    
    if (obj !== null && typeof obj === 'object') {
      const result: any = {};
      for (const key of Object.keys(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        result[snakeKey] = this.toSnakeCase(obj[key]);
      }
      return result;
    }
    
    return obj;
  }
}