/**
 * Hoonuit Integration Users
 * Test users specifically configured for integration validation tests
 * Updated to use credentials from shared/users/HoonuitIntegrationUsers.ts and SISIntegrationUsers.ts
 *
 * @author poojitha (original Java implementation)
 * @author aradhyas (TypeScript conversion)
 * @since 21-07-2021 (original), 2024 (updated)
 */

import { User } from '../../../shared/users/User';

/**
 * Integration Users class containing predefined test users for integration validation tests
 * Credentials aligned with shared/users/HoonuitIntegrationUsers.ts and SISIntegrationUsers.ts
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
  public static readonly etlAdmin_User1 = new HoonuitIntegrationUsers('etladmin', 'PSAutomation!');

  /**
   * ETL Attendance Admin User 1 - ETL administrator for attendance
   */
  public static readonly etlAttAdmin_User1 = new HoonuitIntegrationUsers('etlattadmin', 'PSAutomation!');

  /**
   * ETL Academic Admin User 1 - ETL administrator for academics
   */
  public static readonly etlAcaAdmin_User1 = new HoonuitIntegrationUsers('etlacaadmin', 'PSAutomation!');

  /**
   * ETL Teacher User 1 - Teacher user for ETL testing
   */
  public static readonly etlTeacher_User1 = new HoonuitIntegrationUsers('UIHNteacher22', 'PSAutomation!');

  /**
   * ETL Teacher User 2 - Secondary teacher user for ETL testing
   */
  public static readonly etlTeacher_User2 = new HoonuitIntegrationUsers('UIHNteacher', 'PSAutomation!');

  /**
   * ETL Behavior Admin User 1 - ETL administrator for behavior data
   */
  public static readonly etlBehaviorAdmin_User1 = new HoonuitIntegrationUsers('etlbehavioradmin', 'PSAutomation!');

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
   * Get user by key name (backward compatibility)
   * @param userKey - The key name of the user
   * @returns HoonuitIntegrationUsers object
   */
  public static getUserByKey(userKey: string): HoonuitIntegrationUsers {
    const users: Record<string, HoonuitIntegrationUsers> = {
      'etlAdmin_User1': this.etlAdmin_User1,
      'etlAttAdmin_User1': this.etlAttAdmin_User1,
      'etlAcaAdmin_User1': this.etlAcaAdmin_User1,
      'etlTeacher_User1': this.etlTeacher_User1,
      'etlTeacher_User2': this.etlTeacher_User2,
      'etlBehaviorAdmin_User1': this.etlBehaviorAdmin_User1
    };

    const user = users[userKey];
    if (!user) {
      throw new Error(`Unknown integration user key: ${userKey}`);
    }
    return user;
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
   * Get all ETL admin users (alias for getAllAdminUsers)
   * @returns Array of ETL admin users
   */
  public static getAllEtlAdminUsers(): HoonuitIntegrationUsers[] {
    return this.getAllAdminUsers();
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
   * Get all ETL teacher users (alias for getAllTeacherUsers)
   * @returns Array of ETL teacher users
   */
  public static getAllEtlTeacherUsers(): HoonuitIntegrationUsers[] {
    return this.getAllTeacherUsers();
  }

  /**
   * Convert all users to User interface array
   * @returns Array of User objects
   */
  public static getAllUsersAsUserInterface(): User[] {
    return this.getAllUsers().map(user => user.toUser());
  }
}