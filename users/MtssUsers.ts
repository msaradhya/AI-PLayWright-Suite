/**
 * MTSS Users class for managing MTSS-specific user credentials
 * Converted from Java to TypeScript for Playwright implementation
 * 
 * @author Original Java implementation
 * @author TypeScript conversion for Playwright
 */

import { User } from './User';

export class MtssUsers {
  // Thread-local storage equivalent using Map in TypeScript
  private static adminUsers = new Map<string, MtssUsers>();
  private static teacherUsers = new Map<string, MtssUsers>();
  private static maintenanceUsers = new Map<string, MtssUsers>();

  // Properties
  public userName: string;
  public password: string;

  /**
   * Constructor for MtssUsers
   * @param usr Username
   * @param pass Password
   */
  constructor(usr: string, pass: string) {
    this.userName = usr;
    this.password = pass;
  }

  // ============================================
  // Static User Instances
  // ============================================

  // Portal Admin
  public static readonly portal_admin = new MtssUsers('admin', 'hhg9PjQebzWJxPVKpAfN5KFn3');

  // RTI Admin
  public static readonly rti_admin = new MtssUsers('rti_admin', 'sisgold2020');

  // District admin
  public static readonly district_admin = new MtssUsers('au1', 'sisgold2020');

  // District admin2
  public static readonly district_admin_2 = new MtssUsers('au3', 'sisgold2020');

  // Primary SchoolAdmin
  public static readonly school_admin_user1 = new MtssUsers('au10', 'sisgold2020');

  // Secondary school admin
  public static readonly secondary_school_admin = new MtssUsers('au28', 'sisgold2020');

  // Teacher
  public static readonly teacher_user1 = new MtssUsers('oakteacher', 'sisgold2020');

  // Teacher with MTSS publisher access and access to all students
  public static readonly teacher_user2 = new MtssUsers('aadams', 'sisgold2020');

  // ============================================
  // Helper method to generate unique context ID
  // ============================================

  /**
   * Get a unique context ID for parallel test execution
   * Uses worker ID if available, otherwise uses timestamp
   */
  private static getContextId(): string {
    // In Playwright, we can use test worker index or generate unique ID
    return process.env.TEST_WORKER_INDEX || `context_${Date.now()}`;
  }

  // ============================================
  // Current User Management Methods
  // ============================================

  /**
   * Set the current admin user for this test context
   * @param user The admin user to set
   */
  public static setAdminCurrentUser(user: MtssUsers): void {
    this.adminUsers.set(this.getContextId(), user);
  }

  /**
   * Set the current teacher user for this test context
   * @param teacherUser The teacher user to set
   */
  public static setTeacherCurrentUser(teacherUser: MtssUsers): void {
    this.teacherUsers.set(this.getContextId(), teacherUser);
  }

  /**
   * Set the current maintenance user for this test context
   * @param maintenanceUser The maintenance user to set
   */
  public static setMaintenanceCurrentUser(maintenanceUser: MtssUsers): void {
    this.maintenanceUsers.set(this.getContextId(), maintenanceUser);
  }

  /**
   * Get the current admin user for this test context
   * @returns The current admin user or undefined if not set
   */
  public static getCurrentAdminUser(): MtssUsers | undefined {
    return this.adminUsers.get(this.getContextId());
  }

  /**
   * Get the current teacher user for this test context
   * @returns The current teacher user or undefined if not set
   */
  public static getCurrentTeacherUser(): MtssUsers | undefined {
    return this.teacherUsers.get(this.getContextId());
  }

  /**
   * Get the current maintenance user for this test context
   * @returns The current maintenance user or undefined if not set
   */
  public static getCurrentMaintenanceUser(): MtssUsers | undefined {
    return this.maintenanceUsers.get(this.getContextId());
  }

  /**
   * Clear all current user settings for this test context
   */
  public static clearCurrentUsers(): void {
    const contextId = this.getContextId();
    this.adminUsers.delete(contextId);
    this.teacherUsers.delete(contextId);
    this.maintenanceUsers.delete(contextId);
  }

  /**
   * Clear all user settings across all contexts
   */
  public static clearAllUsers(): void {
    this.adminUsers.clear();
    this.teacherUsers.clear();
    this.maintenanceUsers.clear();
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Convert MtssUsers to User interface
   * @returns User object compatible with the User interface
   */
  public toUser(): User {
    return {
      userName: this.userName,
      password: this.password,
      role: 'mtss_user'
    };
  }

  /**
   * Get user by role name
   * @param role - User role
   * @returns MtssUsers object for the specified role
   */
  public static getUserByRole(role: string): MtssUsers {
    switch (role.toLowerCase()) {
      case 'portal_admin':
        return this.portal_admin;
      case 'rti_admin':
        return this.rti_admin;
      case 'district_admin':
        return this.district_admin;
      case 'district_admin_2':
        return this.district_admin_2;
      case 'school_admin':
      case 'school_admin_user1':
        return this.school_admin_user1;
      case 'secondary_school_admin':
        return this.secondary_school_admin;
      case 'teacher':
      case 'teacher_user1':
        return this.teacher_user1;
      case 'teacher_user2':
        return this.teacher_user2;
      default:
        throw new Error(`Unknown MTSS user role: ${role}`);
    }
  }

  /**
   * Get all available MTSS users
   * @returns Array of all MtssUsers
   */
  public static getAllUsers(): MtssUsers[] {
    return [
      this.portal_admin,
      this.rti_admin,
      this.district_admin,
      this.district_admin_2,
      this.school_admin_user1,
      this.secondary_school_admin,
      this.teacher_user1,
      this.teacher_user2
    ];
  }
}