/**
 * MTSS Users class for managing user credentials and types
 * Converted from Java to TypeScript for Playwright implementation
 * @author hyders
 * @since 10/08/2020 (Converted to TypeScript/Playwright)
 */
export class MtssUsers {
  public userName: string;
  public password: string;
  public userType: 'admin' | 'teacher' | 'portal' | 'maintenance';
  public firstName?: string;
  public lastName?: string;
  public email?: string;
  public district?: string;
  public school?: string;

  // Static user instances for current session
  private static currentAdminUser: MtssUsers | null = null;
  private static currentTeacherUser: MtssUsers | null = null;
  private static currentPortalUser: MtssUsers | null = null;
  private static currentMaintenanceUser: MtssUsers | null = null;

  constructor(
    userName: string, 
    password: string, 
    userType: 'admin' | 'teacher' | 'portal' | 'maintenance' = 'admin',
    options?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      district?: string;
      school?: string;
    }
  ) {
    this.userName = userName;
    this.password = password;
    this.userType = userType;
    this.firstName = options?.firstName;
    this.lastName = options?.lastName;
    this.email = options?.email;
    this.district = options?.district;
    this.school = options?.school;
  }

  // Predefined static users - maintaining compatibility with Java implementation
  static portal_admin = new MtssUsers('UIHN_ADMIN', 'UIHN_ADMIN', 'portal');
  static multidistrict_admin = new MtssUsers('multidistrict_admin', 'EJY5dRw71CDqS2OrwyqgWrk7N', 'admin');
  static rti_admin = new MtssUsers('rti_admin', 'sisgold2020', 'admin');
  static mtss_admin = new MtssUsers('MTSS_Admin', 'MTSS_Admin', 'maintenance');
  static district_admin = new MtssUsers('au1', 'PSAutomation!', 'admin');
  static automation_DA_107 = new MtssUsers('automationDA107', 'PSAutomation!', 'admin');
  static automation_DA_108 = new MtssUsers('automationDA108', 'PSAutomation!', 'admin');
  static automation_DA_109 = new MtssUsers('automationDA109', 'PSAutomation!', 'admin');
  static automation_DA_103 = new MtssUsers('automationDA103', 'PSAutomation!', 'admin');
  static automation_DA_110 = new MtssUsers('automationDA110', 'PSAutomation!', 'admin');
  static automation_DA_101 = new MtssUsers('automationDA101', 'PSAutomation!', 'admin');
  static automation_DA_102 = new MtssUsers('automationDA102', 'PSAutomation!', 'admin');
  static district_admin_2 = new MtssUsers('au3', 'PSAutomation!', 'admin');
  static school_admin_user1 = new MtssUsers('au10', 'PSAutomation!', 'admin');
  static schoolAdmin_au4 = new MtssUsers('au4', 'PSAutomation!', 'admin');
  static schoolAdmin_au28 = new MtssUsers('au28', 'PSAutomation!', 'admin');
  static secondary_school_admin = new MtssUsers('au28', 'PSAutomation!', 'admin');
  static teacher_user1 = new MtssUsers('oakteacher', 'PSAutomation!', 'teacher');
  static teacher_user12 = new MtssUsers('valvarez', 'PSAutomation!', 'teacher');
  static teacher_user2 = new MtssUsers('aadams', 'PSAutomation!', 'teacher');
  static microsoftAdmin_user1 = new MtssUsers('SSO_maryadmin@pswish.onmicrosoft.com', 'AppSwitcher!', 'admin');
  static googleDistrictAdminUser = new MtssUsers('SSO_maryadmin@applegrove.me', 'AppSwitcher!', 'admin');
  static googleSchoolAdminUser = new MtssUsers('perf4@applegrove.me', 'AppSwitcher!', 'admin');

  /**
   * Get current admin user
   * @returns MtssUsers | null
   */
  public static getCurrentAdminUser(): MtssUsers | null {
    return this.currentAdminUser;
  }

  /**
   * Set current admin user
   * @param user MtssUsers instance
   */
  public static setCurrentAdminUser(user: MtssUsers): void {
    this.currentAdminUser = user;
  }

  /**
   * Get current teacher user
   * @returns MtssUsers | null
   */
  public static getCurrentTeacherUser(): MtssUsers | null {
    return this.currentTeacherUser;
  }

  /**
   * Set current teacher user
   * @param user MtssUsers instance
   */
  public static setCurrentTeacherUser(user: MtssUsers): void {
    this.currentTeacherUser = user;
  }

  /**
   * Get current portal user
   * @returns MtssUsers | null
   */
  public static getCurrentPortalUser(): MtssUsers | null {
    return this.currentPortalUser;
  }

  /**
   * Set current portal user
   * @param user MtssUsers instance
   */
  public static setCurrentPortalUser(user: MtssUsers): void {
    this.currentPortalUser = user;
  }

  /**
   * Get current maintenance user
   * @returns MtssUsers | null
   */
  public static getCurrentMaintenanceUser(): MtssUsers | null {
    return this.currentMaintenanceUser;
  }

  /**
   * Set current maintenance user
   * @param user MtssUsers instance
   */
  public static setCurrentMaintenanceUser(user: MtssUsers): void {
    this.currentMaintenanceUser = user;
  }

  /**
   * Create admin user
   * @param userName Username
   * @param password Password
   * @param options Additional user options
   * @returns MtssUsers instance
   */
  public static createAdminUser(
    userName: string, 
    password: string, 
    options?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      district?: string;
      school?: string;
    }
  ): MtssUsers {
    return new MtssUsers(userName, password, 'admin', options);
  }

  /**
   * Create teacher user
   * @param userName Username
   * @param password Password
   * @param options Additional user options
   * @returns MtssUsers instance
   */
  public static createTeacherUser(
    userName: string, 
    password: string, 
    options?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      district?: string;
      school?: string;
    }
  ): MtssUsers {
    return new MtssUsers(userName, password, 'teacher', options);
  }

  /**
   * Create portal user
   * @param userName Username
   * @param password Password
   * @param options Additional user options
   * @returns MtssUsers instance
   */
  public static createPortalUser(
    userName: string, 
    password: string, 
    options?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      district?: string;
      school?: string;
    }
  ): MtssUsers {
    return new MtssUsers(userName, password, 'portal', options);
  }

  /**
   * Create maintenance user
   * @param userName Username
   * @param password Password
   * @param options Additional user options
   * @returns MtssUsers instance
   */
  public static createMaintenanceUser(
    userName: string, 
    password: string, 
    options?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      district?: string;
      school?: string;
    }
  ): MtssUsers {
    return new MtssUsers(userName, password, 'maintenance', options);
  }

  /**
   * Get default admin user from environment or predefined users
   * @returns MtssUsers instance
   */
  public static getDefaultAdminUser(): MtssUsers {
    return this.district_admin;
  }

  /**
   * Get default teacher user from environment or predefined users
   * @returns MtssUsers instance
   */
  public static getDefaultTeacherUser(): MtssUsers {
    return this.teacher_user1;
  }

  /**
   * Get default maintenance user from environment or predefined users
   * @returns MtssUsers instance
   */
  public static getDefaultMaintenanceUser(): MtssUsers {
    return this.mtss_admin;
  }

  /**
   * Get default portal user
   * @returns MtssUsers instance
   */
  public static getDefaultPortalUser(): MtssUsers {
    return this.portal_admin;
  }

  /**
   * Clear all current users
   */
  public static clearAllCurrentUsers(): void {
    this.currentAdminUser = null;
    this.currentTeacherUser = null;
    this.currentPortalUser = null;
    this.currentMaintenanceUser = null;
  }

  /**
   * Initialize default users (useful for test setup)
   */
  public static initializeDefaultUsers(): void {
    this.setCurrentAdminUser(this.getDefaultAdminUser());
    this.setCurrentTeacherUser(this.getDefaultTeacherUser());
    this.setCurrentMaintenanceUser(this.getDefaultMaintenanceUser());
    this.setCurrentPortalUser(this.getDefaultPortalUser());
  }

  /**
   * Get user by type
   * @param userType Type of user to retrieve
   * @returns MtssUsers instance or null
   */
  public static getUserByType(userType: 'admin' | 'teacher' | 'portal' | 'maintenance'): MtssUsers | null {
    switch (userType) {
      case 'admin':
        return this.getCurrentAdminUser();
      case 'teacher':
        return this.getCurrentTeacherUser();
      case 'portal':
        return this.getCurrentPortalUser();
      case 'maintenance':
        return this.getCurrentMaintenanceUser();
      default:
        return null;
    }
  }

  /**
   * Set user by type
   * @param userType Type of user to set
   * @param user MtssUsers instance
   */
  public static setUserByType(userType: 'admin' | 'teacher' | 'portal' | 'maintenance', user: MtssUsers): void {
    switch (userType) {
      case 'admin':
        this.setCurrentAdminUser(user);
        break;
      case 'teacher':
        this.setCurrentTeacherUser(user);
        break;
      case 'portal':
        this.setCurrentPortalUser(user);
        break;
      case 'maintenance':
        this.setCurrentMaintenanceUser(user);
        break;
    }
  }

  /**
   * Get all predefined users
   * @returns Array of all predefined MtssUsers instances
   */
  public static getAllPredefinedUsers(): MtssUsers[] {
    return [
      this.portal_admin,
      this.multidistrict_admin,
      this.rti_admin,
      this.mtss_admin,
      this.district_admin,
      this.automation_DA_107,
      this.automation_DA_108,
      this.automation_DA_109,
      this.automation_DA_103,
      this.automation_DA_110,
      this.automation_DA_101,
      this.automation_DA_102,
      this.district_admin_2,
      this.school_admin_user1,
      this.schoolAdmin_au4,
      this.schoolAdmin_au28,
      this.secondary_school_admin,
      this.teacher_user1,
      this.teacher_user12,
      this.teacher_user2,
      this.microsoftAdmin_user1,
      this.googleDistrictAdminUser,
      this.googleSchoolAdminUser
    ];
  }

  /**
   * Get users by type
   * @param userType Type of users to retrieve
   * @returns Array of MtssUsers instances of the specified type
   */
  public static getUsersByType(userType: 'admin' | 'teacher' | 'portal' | 'maintenance'): MtssUsers[] {
    return this.getAllPredefinedUsers().filter(user => user.userType === userType);
  }

  /**
   * Find user by username
   * @param userName Username to search for
   * @returns MtssUsers instance or null
   */
  public static findUserByUsername(userName: string): MtssUsers | null {
    return this.getAllPredefinedUsers().find(user => user.userName === userName) || null;
  }

  /**
   * Get full name of the user
   * @returns string Full name
   */
  public getFullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
      return this.firstName;
    } else if (this.lastName) {
      return this.lastName;
    } else {
      return this.userName;
    }
  }

  /**
   * Get display name for the user
   * @returns string Display name
   */
  public getDisplayName(): string {
    return this.email || this.getFullName();
  }

  /**
   * Validate user credentials
   * @returns boolean True if valid, false otherwise
   */
  public isValid(): boolean {
    return !!(this.userName && this.password && this.userType);
  }

  /**
   * Check if user is SSO user (based on username pattern)
   * @returns boolean True if SSO user, false otherwise
   */
  public isSSOUser(): boolean {
    return this.userName.startsWith('SSO_');
  }

  /**
   * Check if user is Google SSO user
   * @returns boolean True if Google SSO user, false otherwise
   */
  public isGoogleSSOUser(): boolean {
    return this.isSSOUser() && this.userName.includes('@applegrove.me');
  }

  /**
   * Check if user is Microsoft SSO user
   * @returns boolean True if Microsoft SSO user, false otherwise
   */
  public isMicrosoftSSOUser(): boolean {
    return this.isSSOUser() && this.userName.includes('@pswish.onmicrosoft.com');
  }

  /**
   * Create a copy of the user
   * @returns MtssUsers New instance with same properties
   */
  public clone(): MtssUsers {
    return new MtssUsers(this.userName, this.password, this.userType, {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      district: this.district,
      school: this.school
    });
  }

  /**
   * Convert user to plain object
   * @returns object Plain object representation
   */
  public toPlainObject(): {
    userName: string;
    userType: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    district?: string;
    school?: string;
  } {
    return {
      userName: this.userName,
      userType: this.userType,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      district: this.district,
      school: this.school
    };
  }

  /**
   * Create user from plain object
   * @param obj Plain object with user data
   * @param password Password (not stored in plain object for security)
   * @returns MtssUsers instance
   */
  public static fromPlainObject(obj: any, password: string): MtssUsers {
    return new MtssUsers(obj.userName, password, obj.userType, {
      firstName: obj.firstName,
      lastName: obj.lastName,
      email: obj.email,
      district: obj.district,
      school: obj.school
    });
  }

  /**
   * Get automation district admin users
   * @returns Array of automation district admin users
   */
  public static getAutomationDistrictAdmins(): MtssUsers[] {
    return [
      this.automation_DA_101,
      this.automation_DA_102,
      this.automation_DA_103,
      this.automation_DA_107,
      this.automation_DA_108,
      this.automation_DA_109,
      this.automation_DA_110
    ];
  }

  /**
   * Get school admin users
   * @returns Array of school admin users
   */
  public static getSchoolAdmins(): MtssUsers[] {
    return [
      this.school_admin_user1,
      this.schoolAdmin_au4,
      this.schoolAdmin_au28,
      this.secondary_school_admin
    ];
  }

  /**
   * Get teacher users
   * @returns Array of teacher users
   */
  public static getTeachers(): MtssUsers[] {
    return [
      this.teacher_user1,
      this.teacher_user12,
      this.teacher_user2
    ];
  }

  /**
   * Get SSO users
   * @returns Array of SSO users
   */
  public static getSSOUsers(): MtssUsers[] {
    return [
      this.microsoftAdmin_user1,
      this.googleDistrictAdminUser,
      this.googleSchoolAdminUser
    ];
  }
}
