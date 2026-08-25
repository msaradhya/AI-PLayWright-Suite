/**
 * Hoonuit Users - Predefined test users for Hoonuit SIS
 * Provides easy access to configured test users from environment variables
 * Also includes hardcoded users from original Java implementation
 *
 * @author amittiwari (original Java implementation)
 * @author aradhyas (TypeScript conversion)
 * @since 09/04/21
 */

import { User } from './User';

export class HoonuitUsers {
  // ============================================
  // Environment-based Users (configurable)
  // ============================================

  /**
   * Administrator user (from environment)
   */
  static readonly ADMIN_USER: User = {
    userName: process.env.ADMIN_USERNAME || '',
    password: process.env.ADMIN_PASSWORD || '',
    role: 'admin',
    email: process.env.ADMIN_EMAIL || ''
  };

  /**
   * Teacher user (from environment)
   */
  static readonly TEACHER_USER: User = {
    userName: process.env.TEACHER_USERNAME || '',
    password: process.env.TEACHER_PASSWORD || '',
    role: 'teacher',
    email: process.env.TEACHER_EMAIL || ''
  };

  /**
   * Student user (from environment)
   */
  static readonly STUDENT_USER: User = {
    userName: process.env.STUDENT_USERNAME || '',
    password: process.env.STUDENT_PASSWORD || '',
    role: 'student',
    email: process.env.STUDENT_EMAIL || ''
  };

  /**
   * District admin user (from environment)
   */
  static readonly DISTRICT_ADMIN_USER: User = {
    userName: process.env.DISTRICT_ADMIN_USERNAME || '',
    password: process.env.DISTRICT_ADMIN_PASSWORD || '',
    role: 'district_admin',
    email: process.env.DISTRICT_ADMIN_EMAIL || ''
  };

  /**
   * School admin user (from environment)
   */
  static readonly SCHOOL_ADMIN_USER: User = {
    userName: process.env.SCHOOL_ADMIN_USERNAME || '',
    password: process.env.SCHOOL_ADMIN_PASSWORD || '',
    role: 'school_admin',
    email: process.env.SCHOOL_ADMIN_EMAIL || ''
  };

  // ============================================
  // Hardcoded Users (from original Java implementation)
  // ============================================

  // Admin Users - matching Java implementation
  static readonly districtAdmin_user1: User = {
    userName: 'productda',
    password: 'PSAutomation!',
    role: 'district_admin'
  };

  static readonly automation_DA_104: User = {
    userName: 'automationDA104',
    password: 'PSAutomation!',
    role: 'district_admin'
  };

  static readonly automation_DA_111: User = {
    userName: 'automationDA111',
    password: 'PSAutomation!',
    role: 'district_admin'
  };

  static readonly automation_DA_118: User = {
    userName: 'automationDA118',
    password: 'PSAutomation!',
    role: 'district_admin'
  };

  static readonly automation_DA_108: User = {
    userName: 'automationDA108',
    password: 'PSAutomation!',
    role: 'district_admin'
  };

  static readonly automation_DA_107: User = {
    userName: 'automationDA107',
    password: 'PSAutomation!',
    role: 'district_admin'
  };

  // Perform Users - for talent/setup login functionality
  static readonly perform_adminUser1: User = {
    userName: 'UIHNAdmin1',
    password: 'UIHNAdmin1@123',
    role: 'perform_admin'
  };

  // Teacher Users
  static readonly teacher_user1: User = {
    userName: 'valvarez',
    password: 'PSAutomation!',
    role: 'teacher'
  };

  static readonly teacher_user2: User = {
    userName: 'oakteacher',
    password: 'PSAutomation!',
    role: 'teacher'
  };

  static readonly teacher_user_aadams: User = {
    userName: 'aadams',
    password: 'PSAutomation!',
    role: 'teacher'
  };

  // Maintenance Users
  static readonly maintenance_admin_user: User = {
    userName: 'UIHN_ADMIN',
    password: 'UIHN_ADMIN',
    role: 'maintenance_admin'
  };

  // MTSS Admin
  static readonly MTSS_Admin: User = {
    userName: 'MTSS_Admin',
    password: 'MTSS_Admin',
    role: 'mtss_admin'
  };

  // School Admin Users
  static readonly school_admin_user1: User = {
    userName: 'productsa',
    password: 'PSAutomation1!',
    role: 'school_admin'
  };

  // Tenant Manager Users
  static readonly tenant_manager_user: User = {
    userName: 'uihnautomation@powerschool.cloud',
    password: 'PSAutomation1!',
    role: 'tenant_manager'
  };

  // Professional Learning Users
  static readonly pl_adminUser1: User = {
    userName: 'tnl.admin',
    password: 'jup1ter',
    role: 'pl_admin'
  };

  // Assessment Tool System Users
  static readonly ats_adminUser1: User = {
    userName: 'shamsh.hyder',
    password: 'sham@123',
    role: 'ats_admin'
  };

  static readonly ats_teacherUser1: User = {
    userName: 'uihn.teacher@yopmail.com',
    password: 'PSAutomation1!',
    role: 'ats_teacher'
  };

  // ============================================
  // Current User Management (ThreadLocal equivalent)
  // ============================================

  private static currentAdminUser: User | null = null;
  private static currentTeacherUser: User | null = null;
  private static currentMaintenanceUser: User | null = null;

  static getCurrentAdminUser(): User | null {
    return this.currentAdminUser;
  }

  static setCurrentAdminUser(user: User): void {
    this.currentAdminUser = user;
  }

  static getCurrentTeacherUser(): User | null {
    return this.currentTeacherUser;
  }

  static setCurrentTeacherUser(user: User): void {
    this.currentTeacherUser = user;
  }

  static getCurrentMaintenanceUser(): User | null {
    return this.currentMaintenanceUser;
  }

  static setCurrentMaintenanceUser(user: User): void {
    this.currentMaintenanceUser = user;
  }

  static clearCurrentUsers(): void {
    this.currentAdminUser = null;
    this.currentTeacherUser = null;
    this.currentMaintenanceUser = null;
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Get user by role name
   * @param role - User role (admin, teacher, student, district_admin, school_admin)
   * @returns User object for the specified role
   */
  static getUserByRole(role: string): User {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return this.ADMIN_USER;
      case 'teacher':
        return this.TEACHER_USER;
      case 'student':
        return this.STUDENT_USER;
      case 'district_admin':
      case 'districtadmin':
        return this.DISTRICT_ADMIN_USER;
      case 'school_admin':
      case 'schooladmin':
        return this.SCHOOL_ADMIN_USER;
      case 'maintenance_admin':
        return this.maintenance_admin_user;
      case 'mtss_admin':
        return this.MTSS_Admin;
      case 'tenant_manager':
        return this.tenant_manager_user;
      case 'pl_admin':
        return this.pl_adminUser1;
      case 'ats_admin':
        return this.ats_adminUser1;
      case 'perform_admin':
        return this.perform_adminUser1;
      default:
        throw new Error(`Unknown user role: ${role}`);
    }
  }

  /**
   * Get all environment-based users
   * @returns Array of all environment-based user objects
   */
  static getAllEnvUsers(): User[] {
    return [
      this.ADMIN_USER,
      this.TEACHER_USER,
      this.STUDENT_USER,
      this.DISTRICT_ADMIN_USER,
      this.SCHOOL_ADMIN_USER
    ];
  }

  /**
   * Get all hardcoded users
   * @returns Array of all hardcoded user objects
   */
  static getAllHardcodedUsers(): User[] {
    return [
      this.districtAdmin_user1,
      this.automation_DA_104,
      this.automation_DA_111,
      this.automation_DA_118,
      this.automation_DA_108,
      this.automation_DA_107,
      this.perform_adminUser1,
      this.teacher_user1,
      this.teacher_user2,
      this.teacher_user_aadams,
      this.maintenance_admin_user,
      this.MTSS_Admin,
      this.school_admin_user1,
      this.tenant_manager_user,
      this.pl_adminUser1,
      this.ats_adminUser1,
      this.ats_teacherUser1
    ];
  }

  /**
   * Get all configured users (environment + hardcoded)
   * @returns Array of all user objects
   */
  static getAllUsers(): User[] {
    return [...this.getAllEnvUsers(), ...this.getAllHardcodedUsers()];
  }

  /**
   * Validate that user credentials are configured
   * @param user - User object to validate
   * @returns true if user has username and password configured
   */
  static isUserConfigured(user: User): boolean {
    return !!(user.userName && user.password);
  }

  /**
   * Get all configured users (only those with credentials)
   * @returns Array of configured user objects
   */
  static getConfiguredUsers(): User[] {
    return this.getAllUsers().filter(user => this.isUserConfigured(user));
  }

  /**
   * Get all district admin users
   * @returns Array of district admin users
   */
  static getAllDistrictAdminUsers(): User[] {
    return [
      this.districtAdmin_user1,
      this.automation_DA_104,
      this.automation_DA_111,
      this.automation_DA_118,
      this.automation_DA_108,
      this.automation_DA_107
    ];
  }

  /**
   * Get all teacher users
   * @returns Array of teacher users
   */
  static getAllTeacherUsers(): User[] {
    return [
      this.teacher_user1,
      this.teacher_user2,
      this.teacher_user_aadams,
      this.ats_teacherUser1
    ];
  }
}