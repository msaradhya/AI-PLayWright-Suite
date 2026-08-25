import config from 'config';

/**
 * Utility function to get configuration values with environment variable support
 * Automatically resolves environment variables in the format ${ENV_VAR_NAME}
 * 
 * @param configObj - The config object (typically imported from 'config')
 * @param path - Dot-notation path to the config value (e.g., 'hoonuit_sis.environment')
 * @param defaultValue - Optional default value if config path doesn't exist
 * @returns The configuration value with environment variables resolved
 */
export function getConfigWithEnvVars(configObj: any, path: string, defaultValue?: any): any {
    try {
        // Get the config value using the path
        const value = configObj.get(path);
        
        // If value is undefined and we have a default, return it
        if (value === undefined && defaultValue !== undefined) {
            return defaultValue;
        }
        
        // If value is a string, check for environment variables
        if (typeof value === 'string') {
            return resolveEnvVars(value);
        }
        
        // If value is an object, recursively resolve env vars in all string properties
        if (typeof value === 'object' && value !== null) {
            return resolveEnvVarsInObject(value);
        }
        
        return value;
    } catch (error) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Configuration path '${path}' not found: ${error}`);
    }
}

/**
 * Resolve environment variables in a string
 * Supports both ${VAR} and $VAR formats
 */
function resolveEnvVars(str: string): string {
    // Handle ${VAR} format
    let resolved = str.replace(/\$\{([^}]+)\}/g, (match, varName) => {
        return process.env[varName] || match;
    });
    
    // Handle $VAR format (word boundaries)
    resolved = resolved.replace(/\$(\w+)/g, (match, varName) => {
        return process.env[varName] || match;
    });
    
    return resolved;
}

/**
 * Recursively resolve environment variables in an object
 */
function resolveEnvVarsInObject(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => resolveEnvVarsInObject(item));
    }
    
    if (typeof obj === 'object' && obj !== null) {
        const resolved: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'string') {
                    resolved[key] = resolveEnvVars(value);
                } else if (typeof value === 'object') {
                    resolved[key] = resolveEnvVarsInObject(value);
                } else {
                    resolved[key] = value;
                }
            }
        }
        return resolved;
    }
    
    return obj;
}

/**
 * Get a configuration value without environment variable resolution
 */
export function getConfig(configObj: any, path: string, defaultValue?: any): any {
    try {
        return configObj.get(path);
    } catch (error) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Configuration path '${path}' not found: ${error}`);
    }
}