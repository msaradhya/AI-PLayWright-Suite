/**
 * Hoonuit Integration Users - SIS-Hoonuit Integration specific user credentials
 * Converted from Java to TypeScript for Playwright implementation
 * 
 * @author poojitha (original Java implementation)
 * @author aradhyas (TypeScript conversion)
 * @since 29-06-2021 (original), 2024 (TypeScript conversion)
 */

import { User } from './User';

/**
 * HoonuitIntegrationUsers class
 * Provides predefined test users for SIS-Hoonuit Integration testing
 * 
 * Java to TypeScript conversion notes:
 * - Java `static` fields become TypeScript `static readonly` properties
 * - Java `HoonuitUsers` class constructor pattern is converted to object instances
 * - Added TypeScript typing with User interface compatibility
 */
export class HoonuitIntegrationUsers {
  // Properties for instance-based usage
  public userName: string;
  public password: string;

  /**
   * Constructor for HoonuitIntegrationUsers
   * @param userName Username for the integration user
   * @param password Password for the integration user
   */
  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
  }

  // ============================================
  // SIS-Hoonuit Integration Users
  // ============================================

  /**
   * ETL Admin User 1 - Primary ETL administrator
   */
  public static readonly etlAdmin_User1 = new HoonuitIntegrationUsers('etladmin', 'sisgold2020');

  /**
   * ETL Attendance Admin User 1 - ETL administrator for attendance
   */
  public static readonly etlAttAdmin_User1 = new HoonuitIntegrationUsers('etlattadmin', 'sisgold2020');

  /**
   * ETL Academic Admin User 1 - ETL administrator for academics
   */
  public static readonly etlAcaAdmin_User1 = new HoonuitIntegrationUsers('etlacaadmin', 'sisgold2020');

  /**
   * ETL Teacher User 1 - Teacher user for ETL testing
   */
  public static readonly etlTeacher_User1 = new HoonuitIntegrationUsers('UIHNteacher22', 'sisgold2020');

  /**
   * ETL Teacher User 2 - Secondary teacher user for ETL testing
   */
  public static readonly etlTeacher_User2 = new HoonuitIntegrationUsers('UIHNteacher', 'sisgold2020');

  /**
   * ETL Behavior Admin User 1 - ETL administrator for behavior data
   */
  public static readonly etlBehaviorAdmin_User1 = new HoonuitIntegrationUsers('etlbehavioradmin', 'sisgold2020');

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Convert HoonuitIntegrationUsers to User interface
   * @returns User object compatible with the User interface
   */
  public toUser(): User {
    return {
      userName: this.userName,
      password: this.password,
      role: 'hoonuit_integration'
    };
  }

  /**
   * Get user by role/type name
   * @param role - User role (etl_admin, etl_att_admin, etl_aca_admin, etl_teacher, etl_behavior_admin)
   * @returns HoonuitIntegrationUsers object for the specified role
   */
  public static getUserByRole(role: string): HoonuitIntegrationUsers {
    switch (role.toLowerCase()) {
      case 'etl_admin':
      case 'etladmin':
      case 'etl_admin_user1':
        return this.etlAdmin_User1;
      case 'etl_att_admin':
      case 'etlattadmin':
      case 'etl_attendance_admin':
        return this.etlAttAdmin_User1;
      case 'etl_aca_admin':
      case 'etlacaadmin':
      case 'etl_academic_admin':
        return this.etlAcaAdmin_User1;
      case 'etl_teacher':
      case 'etlteacher':
      case 'etl_teacher_user1':
        return this.etlTeacher_User1;
      case 'etl_teacher_2':
      case 'etlteacher2':
      case 'etl_teacher_user2':
        return this.etlTeacher_User2;
      case 'etl_behavior_admin':
      case 'etlbehavioradmin':
        return this.etlBehaviorAdmin_User1;
      default:
        throw new Error(`Unknown Hoonuit Integration user role: ${role}`);
    }
  }

  /**
   * Get all available Hoonuit Integration users
   * @returns Array of all HoonuitIntegrationUsers
   */
  public static getAllUsers(): HoonuitIntegrationUsers[] {
    return [
      this.etlAdmin_User1,
      this.etlAttAdmin_User1,
      this.etlAcaAdmin_User1,
      this.etlTeacher_User1,
      this.etlTeacher_User2,
      this.etlBehaviorAdmin_User1
    ];
  }

  /**
   * Get all admin users
   * @returns Array of all admin HoonuitIntegrationUsers
   */
  public static getAllAdminUsers(): HoonuitIntegrationUsers[] {
    return [
      this.etlAdmin_User1,
      this.etlAttAdmin_User1,
      this.etlAcaAdmin_User1,
      this.etlBehaviorAdmin_User1
    ];
  }

  /**
   * Get all teacher users
   * @returns Array of all teacher HoonuitIntegrationUsers
   */
  public static getAllTeacherUsers(): HoonuitIntegrationUsers[] {
    return [
      this.etlTeacher_User1,
      this.etlTeacher_User2
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