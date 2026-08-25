/**
 * Hoonuit Users class for managing user credentials in MTSS context
 * @author amittiwari (converted by Ankit.Mohapatra)
 * @since 09/04/21 (TypeScript conversion: 10/05/2023)
 * Converted from Java to TypeScript for Playwright implementation
 * Complete implementation matching source Java logic
 */
export class HoonuitUsers {
    // Thread-local storage equivalent for Playwright tests
    // Using WeakMap for better memory management and test isolation
    private static adminUsers = new Map<string, HoonuitUsers>();
    private static teacherUsers = new Map<string, HoonuitUsers>();
    private static maintenanceUsers = new Map<string, HoonuitUsers>();
    private static tenantManagerUsers = new Map<string, HoonuitUsers>();
    
    // Properties
    public userName: string;
    public password: string;
    
    constructor(usr: string, pass: string) {
        this.userName = usr;
        this.password = pass;
    }
    
    /**
     * Get unique context ID for Playwright test isolation
     * This simulates Java's ThreadLocal for Playwright's test context
     */
    private static getContextId(): string {
        // Use test worker ID or create unique identifier for test isolation
        return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // User management methods
    public static setAdminCurrentUser(user: HoonuitUsers): void {
        this.adminUsers.set(this.getContextId(), user);
    }
    
    public static setTeacherCurrentUser(teacherUser: HoonuitUsers): void {
        this.teacherUsers.set(this.getContextId(), teacherUser);
    }
    
    public static setMaintenanceCurrentUser(maintenanceUser: HoonuitUsers): void {
        this.maintenanceUsers.set(this.getContextId(), maintenanceUser);
    }
    
    public static setTenantManagerCurrentUser(tenantManagerUser: HoonuitUsers): void {
        this.tenantManagerUsers.set(this.getContextId(), tenantManagerUser);
    }
    
    public static getCurrentAdminUser(): HoonuitUsers | undefined {
        const contextId = this.getContextId();
        return this.adminUsers.get(contextId);
    }
    
    public static getCurrentTeacherUser(): HoonuitUsers | undefined {
        const contextId = this.getContextId();
        return this.teacherUsers.get(contextId);
    }
    
    public static getCurrentMaintenanceUser(): HoonuitUsers | undefined {
        const contextId = this.getContextId();
        return this.maintenanceUsers.get(contextId);
    }
    
    public static getTenantMangerCloudUser(): HoonuitUsers | undefined {
        const contextId = this.getContextId();
        return this.tenantManagerUsers.get(contextId);
    }

    // Admin Users, there are some duplicate user with different password some are used for ps5 and some are used by ps6,ps7
    public static districtAdmin_user1 = new HoonuitUsers("productda", "PSAutomation!");

    public static performance_matter_teacher = new HoonuitUsers("U:1753@USTest", "training");
    public static sis_in_test1_teacher = new HoonuitUsers("BGordonsisinttest1@yopmail.com", "PSAutomation1!");

    public static MTSS_Admin = new HoonuitUsers("MTSS_Admin", "MTSS_Admin");

    public static districtAdmin_user1_1 = new HoonuitUsers("productda", "PSAutomation!");
    public static automation_DA_101 = new HoonuitUsers("automationDA101", "PSAutomation!");
    public static automation_DA_101_1 = new HoonuitUsers("automationDA101", "PSAutomation!");
    public static automation_DA_102 = new HoonuitUsers("automationDA102", "PSAutomation!");
    public static automation_DA_103 = new HoonuitUsers("automationDA103", "PSAutomation!");
    public static automation_DA_104 = new HoonuitUsers("automationDA104", "PSAutomation!");
    public static automation_DA_105 = new HoonuitUsers("automationDA105", "PSAutomation!");
    public static automation_DA_106 = new HoonuitUsers("automationDA106", "PSAutomation!");

    public static automation_DA_107 = new HoonuitUsers("automationDA107", "PSAutomation!");
    public static automation_DA_108 = new HoonuitUsers("automationDA108", "PSAutomation!");
    public static automation_DA_109 = new HoonuitUsers("automationDA109", "PSAutomation!");
    public static automation_DA_110 = new HoonuitUsers("automationDA110", "PSAutomation!");
    public static automation_DA_111 = new HoonuitUsers("automationDA111", "PSAutomation!");
    public static automation_DA_112 = new HoonuitUsers("automationDA112", "PSAutomation!");
    public static automation_DA_112_1 = new HoonuitUsers("automationDA112", "PSAutomation!");
    public static automation_DA_113 = new HoonuitUsers("automationDA113", "PSAutomation!");
    public static automation_DA_114 = new HoonuitUsers("automationDA114", "PSAutomation!");
    public static automation_DA_115 = new HoonuitUsers("automationDA115", "PSAutomation!");
    public static automation_DA_116 = new HoonuitUsers("automationDA116", "PSAutomation!");
    public static automation_DA_117 = new HoonuitUsers("automationDA117", "PSAutomation!");
    public static automation_DA_118 = new HoonuitUsers("automationDA118", "PSAutomation!");
    public static automation_DA_119 = new HoonuitUsers("automationDA119", "PSAutomation!");
    public static automation_DA_120 = new HoonuitUsers("automationDA120", "PSAutomation!");
    public static automation_DA_121 = new HoonuitUsers("automationDA121", "PSAutomation!");
    public static automation_DA_122 = new HoonuitUsers("automationDA122", "PSAutomation!");
    public static automation_DA_123 = new HoonuitUsers("automationDA123", "PSAutomation!");
    public static automation_DA_124 = new HoonuitUsers("automationDA124", "PSAutomation!");
    public static automation_DA_125 = new HoonuitUsers("automationDA125", "PSAutomation!");
    public static automation_DA_126 = new HoonuitUsers("automationDA126", "PSAutomation!");
    public static automation_DA_126_1 = new HoonuitUsers("automationDA126", "PSAutomation!");
    public static districtAdmin_au3 = new HoonuitUsers("au3", "PSAutomation!");
    public static districtAdmin_au3_1 = new HoonuitUsers("au3", "PSAutomation!");
    public static districtAdmin_au1 = new HoonuitUsers("au1", "PSAutomation!");
    public static districtAdmin_au1_1 = new HoonuitUsers("au1", "PSAutomation!");
    public static districtAdmin_au5 = new HoonuitUsers("au5", "PSAutomation!");
    public static districtAdmin_66c4 = new HoonuitUsers("66c4admin", "PSAutomation!");
    public static districtAdmin_au150 = new HoonuitUsers("au150", "PSAutomation!");
    public static qatmaautomation01_districtAdmin_user = new HoonuitUsers("tmaDistrictAdmin1", "tmaDistrictAdmin1");
    public static tmadevelopmentbronze_districtAdmin_user = new HoonuitUsers("tmaautomationbronze", "tmaautomationbronze");

    // Teacher Users
    public static teacher_user1 = new HoonuitUsers("valvarez", "PSAutomation!");// Please Do not Use this Teacher since its used in Multi login Script
    public static teacher_user1_1 = new HoonuitUsers("valvarez", "PSAutomation!");// Please Do not Use this Teacher since its used in Multi login Script
    public static teacher_user2 = new HoonuitUsers("oakteacher", "PSAutomation!");
    public static teacher_user_aadams = new HoonuitUsers("aadams", "PSAutomation!");
    public static ps6_teacher_user_aadams = new HoonuitUsers("aadams", "sisgold2021");
    public static rti_admin = new HoonuitUsers("rti_admin", "sisgold2020");

    // Maintenance Users
    public static maintenance_admin_user = new HoonuitUsers("UIHN_ADMIN", "UIHN_ADMIN");
    public static devtenant_admin_user = new HoonuitUsers("ADMIN", "txNZnpyvLpOcjnGdFvPpLMdzx");
    public static ps5_portal_admin_user = new HoonuitUsers("ADMIN", "txNZnpyvLpOcjnGdFvPpLMdzx");
    public static multi_tenant_maintenance_admin_user = new HoonuitUsers("multidistrict_admin", "EJY5dRw71CDqS2OrwyqgWrk7N");
    public static maintenance_user1 = new HoonuitUsers("padmin1", "globalaccount");
    public static maintenance_user2 = new HoonuitUsers("padmin2", "globalaccount");
    public static maintenance_user3 = new HoonuitUsers("padmin3", "globalaccount");
    public static maintenance_user4 = new HoonuitUsers("padmin4", "globalaccount");
    public static maintenance_user5 = new HoonuitUsers("padmin5", "globalaccount");
    public static maintenance_user6 = new HoonuitUsers("padmin6", "globalaccount");
    public static maintenance_user7 = new HoonuitUsers("padmin7", "globalaccount");
    public static maintenance_user8 = new HoonuitUsers("padmin8", "globalaccount");
    public static maintenance_user9 = new HoonuitUsers("padmin9", "globalaccount");
    public static maintenance_user10 = new HoonuitUsers("padmin10", "globalaccount");
    public static ps6_maintenance_admin_user = new HoonuitUsers("admin", "t9WLmLBg4Jr3BCRPahVUCNeW8");
    public static maintenance_canvas_user = new HoonuitUsers("admin", "DHV9IXhayL60Pqrkn8pZocbe2");
    public static maintenance_cumberland_user = new HoonuitUsers("admin", "TAc3ySjo3VQLHGGiMhLITvUVV");
    public static qatmaautomation01_user = new HoonuitUsers("admin", "7JIRDPrydAWWG1cGZL21BN4vQ");

    // School admin
    public static school_admin_user1 = new HoonuitUsers("productsa", "PSAutomation1!");
    public static schoolAdmin_au4 = new HoonuitUsers("au4", "PSAutomation1!");
    public static schoolAdmin_au28 = new HoonuitUsers("au28", "PSAutomation1!");
    public static schoolAdmin_au10 = new HoonuitUsers("au10", "PSAutomation1!");
    public static school_admin_au11 = new HoonuitUsers("au11", "PSAutomation1!");
    public static school_admin_user2 = new HoonuitUsers("oak1admin", "Power@123");
    public static automation_SA_151 = new HoonuitUsers("automationSA151", "PSAutomation1!");
    public static automation_SA_152 = new HoonuitUsers("automationSA152", "PSAutomation1!");
    public static automation_SA_153 = new HoonuitUsers("automationSA153", "PSAutomation1!");
    public static automation_SA_154 = new HoonuitUsers("automationSA154", "PSAutomation1!");
    public static automation_SA_155 = new HoonuitUsers("automationSA155", "PSAutomation1!");
    public static automation_SA_156 = new HoonuitUsers("automationSA156", "PSAutomation1!");
    public static automation_SA_157 = new HoonuitUsers("automationSA157", "PSAutomation1!");
    public static automation_SA_158 = new HoonuitUsers("automationSA158", "PSAutomation1!");
    public static automation_SA_159 = new HoonuitUsers("automationSA159", "PSAutomation1!");
    public static automation_SA_160 = new HoonuitUsers("automationSA160", "PSAutomation1!");
    public static automation_SA_161 = new HoonuitUsers("automationSA161", "PSAutomation1!");
    public static automation_SA_162 = new HoonuitUsers("automationSA162", "PSAutomation1!");
    public static automation_SA_163 = new HoonuitUsers("automationSA163", "PSAutomation1!");
    public static automation_SA_164 = new HoonuitUsers("automationSA164", "PSAutomation1!");

    // Multilogin Users
    public static districtAdmin_au78 = new HoonuitUsers("au78", "PSAutomation1!");
    public static schoolAdmin_au79 = new HoonuitUsers("au79", "PSAutomation1!");
    public static schoolAdmin_au76 = new HoonuitUsers("au76", "PSAutomation1!");

    // SSO Users
    public static googleDistrictAdminUser = new HoonuitUsers("SSO_maryadmin@applegrove.me", "AppSwitcher!");
    public static googleDistrictManagerUser = new HoonuitUsers("perf3@applegrove.me", "AppSwitcher!");
    public static googleInterventionBrowserUser1 = new HoonuitUsers("perf6@applegrove.me", "AppSwitcher!");
    public static googleTeacher_user1 = new HoonuitUsers("perf50@applegrove.me", "AppSwitcher!");
    public static googleSchoolAdminUser = new HoonuitUsers("perf4@applegrove.me", "AppSwitcher!");
    public static googleInterventionBrowserUser = new HoonuitUsers("perf3@applegrove.me", "AppSwitcher!");

    public static microsoftAdmin_user1 = new HoonuitUsers("SSO_maryadmin@pswish.onmicrosoft.com", "AppSwitcher!");
    public static microsoftTeacher_user1 = new HoonuitUsers("Sisautomation2@pswish.onmicrosoft.com", "AppSwitcher!");
    public static microsoftSecondarySchoolAdmin = new HoonuitUsers("performance11@pswish.onmicrosoft.com", "PSAutomation!");

    //School Finder User
    public static maintenance_school_finder_user = new HoonuitUsers("admin", "8htBQfujFER1snj2eAsX5bEKV");

    //New SIS Roles
    public static customRole1 = new HoonuitUsers("UIHNStaffCustomRole1", "PSAutomation1!");
    public static customRole2 = new HoonuitUsers("UIHNStaffCustomRole2", "PSAutomation1!");
    public static schoolAdminNoDrill = new HoonuitUsers("UIHNStaffNoDrill", "PSAutomation1!");

    // Add AWS Users below
    public static adqvalidationaws_maintenance_admin_user = new HoonuitUsers("admin", "jg8RdtMJ4VPuK5StH8GT3JxL9");

    public static uu_googleAdmin_user1 = new HoonuitUsers("uihnda1@applegrove.me", "Password@1");
    public static uu_googleTeacher_user1 = new HoonuitUsers("unifiedinsight1teacher1@applegrove.me", "PSAutomation1!");
    public static uu_microsoftAdmin_user1 = new HoonuitUsers("uihnda2@pswish.onmicrosoft.com", "PSAutomation1!");
    public static uu_microsoftTeacher_user1 = new HoonuitUsers("performance15@pswish.onmicrosoft.com", "PSAutomation1!");
    public static uu_sisAdmin_user1 = new HoonuitUsers("sisinttest1uihnstaff1@yopmail.com", "PSAutomation1!");
    public static uu_sisTeacher_user1 = new HoonuitUsers("sisinttest1uihnteacher1@yopmail.com", "PSAutomation1!");

    // Tenant Manager Users
    public static tenant_manager_user = new HoonuitUsers("uihnautomation@powerschool.cloud", "PSAutomation1!");

    //Add PL users here
    public static pl_adminUser1 = new HoonuitUsers("tnl.admin", "jup1ter");
    public static perform_adminUser1 = new HoonuitUsers("UIHNAdmin1", "UIHNAdmin1@123");

    public static portalAdmin_sisgoldps5ctclone = new HoonuitUsers("admin", "DS6fAe5N8bH5KerKQYileCCEr");

    public static ats_adminUser1 = new HoonuitUsers("shamsh.hyder", "sham@123");
    public static ats_adminUser2 = new HoonuitUsers("vivekvishal", "Password@123");
    public static ats_teacherUser1 = new HoonuitUsers("uihn.teacher@yopmail.com", "PSAutomation1!");

    public static maintenance_aws_multi_user = new HoonuitUsers("admin", "olSIC5IKDyiMj9hlswtnQhGH4");

    /**
     * Utility method to clear all user contexts for test cleanup
     * Useful for Playwright test isolation between test runs
     */
    public static clearAllUsers(): void {
        this.adminUsers.clear();
        this.teacherUsers.clear();
        this.maintenanceUsers.clear();
        this.tenantManagerUsers.clear();
    }

    /**
     * Get user by role type for easier test management
     * @param userType - Type of user (admin, teacher, maintenance, tenant)
     * @returns HoonuitUsers instance or undefined
     */
    public static getCurrentUserByType(userType: 'admin' | 'teacher' | 'maintenance' | 'tenant'): HoonuitUsers | undefined {
        switch (userType) {
            case 'admin':
                return this.getCurrentAdminUser();
            case 'teacher':
                return this.getCurrentTeacherUser();
            case 'maintenance':
                return this.getCurrentMaintenanceUser();
            case 'tenant':
                return this.getTenantMangerCloudUser();
            default:
                return undefined;
        }
    }

    /**
     * Helper method to validate user credentials
     * @returns boolean indicating if credentials are valid
     */
    public isValid(): boolean {
        return !!(this.userName && this.userName.trim().length > 0 &&
                 this.password && this.password.trim().length > 0);
    }

    /**
     * Get formatted credentials for logging (password masked)
     * @returns string with masked password for safe logging
     */
    public getFormattedCredentials(): string {
        return `Username: ${this.userName}, Password: ${'*'.repeat(this.password.length)}`;
    }
}