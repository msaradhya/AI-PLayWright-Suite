/**
 * SIS Integration Users
 * Test users specifically configured for SIS integration setup tests
 * Converted from Java: psqa.integration.hoonuit_sis.uitest.users.SISIntegrationUsers
 *
 * Now uses ConfigManager as the single source of truth for user credentials.
 *
 * @author poojitha (original Java implementation)
 * @author converted to TypeScript
 * @since 21-07-2021
 */

import { User } from '../../../shared/users/User';
import { ConfigManager } from '../../../config/ConfigManager';

/**
 * SIS Integration Users class containing predefined test users for SIS integration setup tests
 *
 * This class now delegates to ConfigManager for credential management while maintaining
 * backward compatibility with the existing interface.
 */
export class SISIntegrationUsers {
    private static config = ConfigManager.getInstance();

    /**
     * Get ETL Admin User 1 - Primary admin user for ETL data setup tests
     */
    static get etlAdmin_User1(): User {
        const credentials = this.config.getUserCredentials('etlAdmin_User1');
        return {
            userName: credentials.username,
            password: credentials.password,
            role: credentials.role || 'sis_etl_admin',
            district: credentials.district || 'UIHN Automation District'
        };
    }

    /**
     * Get ETL Admin User 2 - Secondary admin user for ETL data setup tests
     */
    static get etlAdmin_User2(): User {
        const credentials = this.config.getUserCredentials('etlAdmin_User2');
        return {
            userName: credentials.username,
            password: credentials.password,
            role: credentials.role || 'sis_etl_admin',
            district: credentials.district || 'UIHN Automation District'
        };
    }

    /**
     * Get ETL Academics Admin User 1 - Admin user for academics data setup tests
     */
    static get etlACAAdmin_User1(): User {
        const credentials = this.config.getUserCredentials('etlACAAdmin_User1');
        return {
            userName: credentials.username,
            password: credentials.password,
            role: credentials.role || 'sis_etl_aca_admin',
            district: credentials.district || 'UIHN Automation District'
        };
    }

    /**
     * Get ETL Behavior Admin User 1 - Admin user for behavior data setup tests
     */
    static get etlBehaviorAdmin_User1(): User {
        const credentials = this.config.getUserCredentials('etlBehaviorAdmin_User1');
        return {
            userName: credentials.username,
            password: credentials.password,
            role: credentials.role || 'sis_etl_behavior_admin',
            district: credentials.district || 'UIHN Automation District'
        };
    }

    /**
     * Get ETL Teacher User 1 - Teacher user for ETL data setup tests
     */
    static get etlTeacher_User1(): User {
        const credentials = this.config.getUserCredentials('etlTeacher_User1');
        return {
            userName: credentials.username,
            password: credentials.password,
            role: credentials.role || 'sis_etl_teacher',
            district: credentials.district || 'UIHN Automation District'
        };
    }

    /**
     * Get user by key name
     * @param userKey - The key name of the user
     * @returns User object
     */
    static getUserByKey(userKey: string): User {
        const credentials = this.config.getUserCredentials(userKey);
        return {
            userName: credentials.username,
            password: credentials.password,
            role: credentials.role,
            district: credentials.district
        };
    }

    /**
     * Get all SIS ETL admin users
     * @returns Array of SIS ETL admin users
     */
    static getAllEtlAdminUsers(): User[] {
        return [
            this.etlAdmin_User1,
            this.etlAdmin_User2,
            this.etlACAAdmin_User1,
            this.etlBehaviorAdmin_User1
        ];
    }

    /**
     * Get all SIS integration users
     * @returns Array of all SIS integration users
     */
    static getAllUsers(): User[] {
        return [
            this.etlAdmin_User1,
            this.etlAdmin_User2,
            this.etlACAAdmin_User1,
            this.etlBehaviorAdmin_User1,
            this.etlTeacher_User1
        ];
    }
}