/**
 * SIS Integration Users - PowerSchool SIS Integration specific user credentials
 * Converted from Java to TypeScript for Playwright implementation
 * 
 * @author poojitha (original Java implementation)
 * @author aradhyas (TypeScript conversion)
 * @since 29-06-2021 (original), 2024 (TypeScript conversion)
 */

import { User } from './User';

/**
 * SISIntegrationUsers class
 * Provides predefined test users for PowerSchool SIS Integration testing
 * 
 * Java to TypeScript conversion notes:
 * - Java `PSUser` class is equivalent to our `User` interface
 * - Java `static final` fields become TypeScript `static readonly` properties
 * - Added TypeScript typing with User interface compatibility
 */
export class SISIntegrationUsers {
  // Properties for instance-based usage
  public userName: string;
  public password: string;

  /**
   * Constructor for SISIntegrationUsers
   * @param userName Username for the SIS integration user
   * @param password Password for the SIS integration user
   */
  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
  }

  // ============================================
  // SIS Integration Users (from PSUser)
  // ============================================

  /**
   * ETL Admin User 1 - Primary ETL administrator for SIS
   */
  public static readonly etlAdmin_User1 = new SISIntegrationUsers('etladmin', 'sisgold2020');

  /**
   * ETL Behavior Admin User 1 - ETL administrator for behavior data in SIS
   */
  public static readonly etlBehaviorAdmin_User1 = new SISIntegrationUsers('etlbehavioradmin', 'sisgold2020');

  /**
   * ETL Academic Admin User 1 - ETL administrator for academics in SIS
   */
  public static readonly etlACAAdmin_User1 = new SISIntegrationUsers('etlacaadmin', 'sisgold2020');

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Convert SISIntegrationUsers to User interface
   * @returns User object compatible with the User interface
   */
  public toUser(): User {
    return {
      userName: this.userName,
      password: this.password,
      role: 'sis_integration'
    };
  }

  /**
   * Get user by role/type name
   * @param role - User role (etl_admin, etl_behavior_admin, etl_aca_admin)
   * @returns SISIntegrationUsers object for the specified role
   */
  public static getUserByRole(role: string): SISIntegrationUsers {
    switch (role.toLowerCase()) {
      case 'etl_admin':
      case 'etladmin':
      case 'etl_admin_user1':
        return this.etlAdmin_User1;
      case 'etl_behavior_admin':
      case 'etlbehavioradmin':
        return this.etlBehaviorAdmin_User1;
      case 'etl_aca_admin':
      case 'etlacaadmin':
      case 'etl_academic_admin':
        return this.etlACAAdmin_User1;
      default:
        throw new Error(`Unknown SIS Integration user role: ${role}`);
    }
  }

  /**
   * Get all available SIS Integration users
   * @returns Array of all SISIntegrationUsers
   */
  public static getAllUsers(): SISIntegrationUsers[] {
    return [
      this.etlAdmin_User1,
      this.etlBehaviorAdmin_User1,
      this.etlACAAdmin_User1
    ];
  }

  /**
   * Get all admin users
   * @returns Array of all admin SISIntegrationUsers
   */
  public static getAllAdminUsers(): SISIntegrationUsers[] {
    return [
      this.etlAdmin_User1,
      this.etlBehaviorAdmin_User1,
      this.etlACAAdmin_User1
    ];
  }

  /**
   * Convert all users to User interface array
   * @returns Array of User objects
   */
  public static getAllUsersAsUserInterface(): User[] {
    return this.getAllUsers().map(user => user.toUser());
  }
}