/**
 * UIHN User Management and Authentication
 * Contains user credentials and management methods for different user types
 * 
 * @author Converted from HoonuitUsers.java
 * @since 2021-09-04
 */
export class HoonuitUsers {
    private static adminUsers: HoonuitUsers | null = null;
    private static teacherUsers: HoonuitUsers | null = null;
    private static maintenanceUsers: HoonuitUsers | null = null;
    private static tenantManagerUsers: HoonuitUsers | null = null;

    public userName: string;
    public password: string;

    constructor(usr: string, pass: string) {
        this.userName = usr;
        this.password = pass;
    }

    // User management methods
    public static setAdminCurrentUser(user: HoonuitUsers): void {
        HoonuitUsers.adminUsers = user;
    }

    public static setTeacherCurrentUser(teacherUser: HoonuitUsers): void {
        HoonuitUsers.teacherUsers = teacherUser;
    }

    public static setMaintenanceCurrentUser(maintenanceUser: HoonuitUsers): void {
        HoonuitUsers.maintenanceUsers = maintenanceUser;
    }

    public static getCurrentAdminUser(): HoonuitUsers | null {
        return HoonuitUsers.adminUsers;
    }

    public static getCurrentTeacherUser(): HoonuitUsers | null {
        return HoonuitUsers.teacherUsers;
    }

    public static getCurrentMaintenanceUser(): HoonuitUsers | null {
        return HoonuitUsers.maintenanceUsers;
    }

    public static getTenantMangerCloudUser(): HoonuitUsers | null {
        return HoonuitUsers.tenantManagerUsers;
    }

    // Admin Users
    public static readonly districtAdmin_user1 = new HoonuitUsers("productda", "PSAutomation!");
    public static readonly performance_matter_teacher = new HoonuitUsers("U:1753@USTest", "training");
    public static readonly sis_in_test1_teacher = new HoonuitUsers("BGordonsisinttest1@yopmail.com", "PSAutomation1!");
    public static readonly MTSS_Admin = new HoonuitUsers("MTSS_Admin", "MTSS_Admin");

    // District Admin Users
    public static readonly districtAdmin_user1_1 = new HoonuitUsers("productda", "PSAutomation!");
    public static readonly automation_DA_101 = new HoonuitUsers("automationDA101", "PSAutomation!");
    public static readonly automation_DA_101_1 = new HoonuitUsers("automationDA101", "PSAutomation!");
    public static readonly automation_DA_102 = new HoonuitUsers("automationDA102", "PSAutomation!");
    public static readonly automation_DA_103 = new HoonuitUsers("automationDA103", "PSAutomation!");
    public static readonly automation_DA_104 = new HoonuitUsers("automationDA104", "PSAutomation!");
    public static readonly automation_DA_105 = new HoonuitUsers("automationDA105", "PSAutomation!");
    public static readonly automation_DA_106 = new HoonuitUsers("automationDA106", "PSAutomation!");
    public static readonly automation_DA_107 = new HoonuitUsers("automationDA107", "PSAutomation!");
    public static readonly automation_DA_108 = new HoonuitUsers("automationDA108", "PSAutomation!");
    public static readonly automation_DA_109 = new HoonuitUsers("automationDA109", "PSAutomation!");
    public static readonly automation_DA_110 = new HoonuitUsers("automationDA110", "PSAutomation!");
    public static readonly automation_DA_111 = new HoonuitUsers("automationDA111", "PSAutomation!");
    public static readonly automation_DA_112 = new HoonuitUsers("automationDA112", "PSAutomation!");
    public static readonly automation_DA_112_1 = new HoonuitUsers("automationDA112", "PSAutomation!");
    public static readonly automation_DA_113 = new HoonuitUsers("automationDA113", "PSAutomation!");
    public static readonly automation_DA_114 = new HoonuitUsers("automationDA114", "PSAutomation!");
    public static readonly automation_DA_115 = new HoonuitUsers("automationDA115", "PSAutomation!");
    public static readonly automation_DA_116 = new HoonuitUsers("automationDA116", "PSAutomation!");
    public static readonly automation_DA_117 = new HoonuitUsers("automationDA117", "PSAutomation!");
    public static readonly automation_DA_118 = new HoonuitUsers("automationDA118", "PSAutomation!");
    public static readonly automation_DA_119 = new HoonuitUsers("automationDA119", "PSAutomation!");
    public static readonly automation_DA_120 = new HoonuitUsers("automationDA120", "PSAutomation!");
    public static readonly automation_DA_121 = new HoonuitUsers("automationDA121", "PSAutomation!");
    public static readonly automation_DA_122 = new HoonuitUsers("automationDA122", "PSAutomation!");
    public static readonly automation_DA_123 = new HoonuitUsers("automationDA123", "PSAutomation!");
    public static readonly automation_DA_124 = new HoonuitUsers("automationDA124", "PSAutomation!");
    public static readonly automation_DA_125 = new HoonuitUsers("automationDA125", "PSAutomation!");
    public static readonly automation_DA_126 = new HoonuitUsers("automationDA126", "PSAutomation!");
    public static readonly automation_DA_126_1 = new HoonuitUsers("automationDA126", "PSAutomation!");
    public static readonly districtAdmin_au3 = new HoonuitUsers("au3", "PSAutomation!");
    public static readonly districtAdmin_au3_1 = new HoonuitUsers("au3", "PSAutomation!");
    public static readonly districtAdmin_au1 = new HoonuitUsers("au1", "PSAutomation!");
    public static readonly districtAdmin_au1_1 = new HoonuitUsers("au1", "PSAutomation!");
    public static readonly districtAdmin_au5 = new HoonuitUsers("au5", "PSAutomation!");
    public static readonly districtAdmin_66c4 = new HoonuitUsers("66c4admin", "PSAutomation!");
    public static readonly districtAdmin_au150 = new HoonuitUsers("au150", "PSAutomation!");
    public static readonly qatmaautomation01_districtAdmin_user = new HoonuitUsers("admin", "GWU8E05sen8j+YexwgV4z3pe");
    public static readonly tmadevelopmentbronze_districtAdmin_user = new HoonuitUsers("tmaautomationbronze", "tmaautomationbronze");
    public static readonly tmamockdata_districtAdmin_user = new HoonuitUsers("admin", "2OkrY90aM8YoPkckE39YkmPfl");

    // Teacher Users
    public static readonly teacher_user1 = new HoonuitUsers("valvarez", "PSAutomation!"); // Please Do not Use this Teacher since its used in Multi login Script
    public static readonly teacher_user1_1 = new HoonuitUsers("valvarez", "PSAutomation!"); // Please Do not Use this Teacher since its used in Multi login Script
    public static readonly teacher_user2 = new HoonuitUsers("oakteacher", "PSAutomation!");
    public static readonly teacher_user_aadams = new HoonuitUsers("aadams", "PSAutomation!2");
    public static readonly teacher_co_teacher = new HoonuitUsers("CoTeacher", "PSAutomation1!");
    public static readonly teacher_schoology_co_teacher = new HoonuitUsers("schoologyco", "PSAutomation1!");
    public static readonly teacher_user_bentley = new HoonuitUsers("cbentley", "PSAutomation!2");
    public static readonly ps6_teacher_user_aadams = new HoonuitUsers("aadams", "sisgold2021");
    public static readonly rti_admin = new HoonuitUsers("rti_admin", "sisgold2020");
    public static readonly uu_msTeacher_user1 = new HoonuitUsers("uihnteacher1@pswish.onmicrosoft.com", "PSAutomation1!");

    // Maintenance Users
    public static readonly maintenance_admin_user = new HoonuitUsers("UIHN_ADMIN", "UIHN_ADMIN");
    public static readonly devtenant_admin_user = new HoonuitUsers("ADMIN", "3LsAgt70VKt9JqQNFbXHAhBv");
    public static readonly ps5_portal_admin_user = new HoonuitUsers("ADMIN", "3LsAgt70VKt9JqQNFbXHAhBv");
    public static readonly multi_tenant_maintenance_admin_user = new HoonuitUsers("multidistrict_admin", "EJY5dRw71CDqS2OrwyqgWrk7N");
    public static readonly maintenance_user1 = new HoonuitUsers("padmin1", "globalaccount");
    public static readonly maintenance_user2 = new HoonuitUsers("padmin2", "globalaccount");
    public static readonly maintenance_user3 = new HoonuitUsers("padmin3", "globalaccount");
    public static readonly maintenance_user4 = new HoonuitUsers("padmin4", "globalaccount");
    public static readonly maintenance_user5 = new HoonuitUsers("padmin5", "globalaccount");
    public static readonly maintenance_user6 = new HoonuitUsers("padmin6", "globalaccount");
    public static readonly maintenance_user7 = new HoonuitUsers("padmin7", "globalaccount");
    public static readonly maintenance_user8 = new HoonuitUsers("padmin8", "globalaccount");
    public static readonly maintenance_user9 = new HoonuitUsers("padmin9", "globalaccount");
    public static readonly maintenance_user10 = new HoonuitUsers("padmin10", "globalaccount");
    public static readonly ps6_maintenance_admin_user = new HoonuitUsers("admin", "t9WLmLBg4Jr3BCRPahVUCNeW8");
    public static readonly maintenance_canvas_user = new HoonuitUsers("admin", "DHV9IXhayL60Pqrkn8pZocbe2");
    public static readonly maintenance_cumberland_user = new HoonuitUsers("admin", "TAc3ySjo3VQLHGGiMhLITvUVV");
    public static readonly maintenance_cumberlandrisk04_user = new HoonuitUsers("admin", "Lxw8BFDrNsGFFCazstde2q0C");
    public static readonly qatmaautomation01_user = new HoonuitUsers("admin", "GWU8E05sen8j+YexwgV4z3pe");

    // School Admin Users
    public static readonly school_admin_user1 = new HoonuitUsers("productsa", "PSAutomation1!");
    public static readonly schoolAdmin_au4 = new HoonuitUsers("au4", "PSAutomation1!");
    public static readonly schoolAdmin_au28 = new HoonuitUsers("au28", "PSAutomation1!");
    public static readonly schoolAdmin_au10 = new HoonuitUsers("au10", "PSAutomation1!");
    public static readonly school_admin_au11 = new HoonuitUsers("au11", "PSAutomation1!");
    public static readonly school_admin_user2 = new HoonuitUsers("oak1admin", "Power@123");
    public static readonly automation_SA_151 = new HoonuitUsers("automationSA151", "PSAutomation1!");
    public static readonly automation_SA_152 = new HoonuitUsers("automationSA152", "PSAutomation1!");
    public static readonly automation_SA_153 = new HoonuitUsers("automationSA153", "PSAutomation1!");
    public static readonly automation_SA_154 = new HoonuitUsers("automationSA154", "PSAutomation1!");
    public static readonly automation_SA_155 = new HoonuitUsers("automationSA155", "PSAutomation1!");
    public static readonly automation_SA_156 = new HoonuitUsers("automationSA156", "PSAutomation1!");
    public static readonly automation_SA_157 = new HoonuitUsers("automationSA157", "PSAutomation1!");
    public static readonly automation_SA_158 = new HoonuitUsers("automationSA158", "PSAutomation1!");
    public static readonly automation_SA_159 = new HoonuitUsers("automationSA159", "PSAutomation1!");
    public static readonly automation_SA_160 = new HoonuitUsers("automationSA160", "PSAutomation1!");
    public static readonly automation_SA_161 = new HoonuitUsers("automationSA161", "PSAutomation1!");
    public static readonly automation_SA_162 = new HoonuitUsers("automationSA162", "PSAutomation1!");
    public static readonly automation_SA_163 = new HoonuitUsers("automationSA163", "PSAutomation1!");
    public static readonly automation_SA_164 = new HoonuitUsers("automationSA164", "PSAutomation1!");
    public static readonly automation_school_admin_uihn = new HoonuitUsers("UIHN_SCHOOL_ADMIN", "PSAutomation1!");

    // Multilogin Users
    public static readonly districtAdmin_au78 = new HoonuitUsers("au78", "PSAutomation1!");
    public static readonly schoolAdmin_au79 = new HoonuitUsers("au79", "PSAutomation1!");
    public static readonly schoolAdmin_au76 = new HoonuitUsers("au76", "PSAutomation1!");

    // SSO Users - Google
    public static readonly googleMultiDistrictAdminUser = new HoonuitUsers("SSO_maryadmin@applegrove.me", "AppSwitcher!");
    public static readonly googleDistrictManagerUser = new HoonuitUsers("perf3@applegrove.me", "AppSwitcher!");
    public static readonly googleInterventionBrowserUser1 = new HoonuitUsers("perf6@applegrove.me", "AppSwitcher!");
    public static readonly googleTeacher_user1 = new HoonuitUsers("perf50@applegrove.me", "AppSwitcher!");
    public static readonly googleDistrictAdminUser = new HoonuitUsers("perf4@applegrove.me", "AppSwitcher!");
    public static readonly awsmultiqagoogleBrowser = new HoonuitUsers("perf90@applegrove.me", "AppSwitcher!");
    public static readonly googleInterventionPublisherUser = new HoonuitUsers("perf6@applegrove.me", "AppSwitcher!");

    // SSO Users - Microsoft
    public static readonly microsoftAdmin_user1 = new HoonuitUsers("SSO_maryadmin@pswish.onmicrosoft.com", "AppSwitcher!");
    public static readonly microsoftMultiDistrictAdmin_user1 = new HoonuitUsers("SSO_bobteacher@pswish.onmicrosoft.com", "AppSwitcher!");
    public static readonly microsoftTeacher_user1 = new HoonuitUsers("Sisautomation2@pswish.onmicrosoft.com", "AppSwitcher!");
    public static readonly microsoftSecondarySchoolAdmin = new HoonuitUsers("performance11@pswish.onmicrosoft.com", "PSAutomation!");

    // School Finder Users
    public static readonly maintenance_school_finder_user = new HoonuitUsers("admin", "rkZVeyGg8dFaHnYvROrCahF70");

    // New SIS Roles
    public static readonly customRole1 = new HoonuitUsers("UIHNStaffCustomRole1", "PSAutomation1!");
    public static readonly customRole2 = new HoonuitUsers("UIHNStaffCustomRole2", "PSAutomation1!");
    public static readonly schoolAdminNoDrill = new HoonuitUsers("UIHNStaffNoDrill", "PSAutomation1!");

    // AWS Users
    public static readonly adqvalidationaws_maintenance_admin_user = new HoonuitUsers("admin", "jg8RdtMJ4VPuK5StH8GT3JxL9");

    // Unified Users (UU)
    public static readonly uu_googleAdmin_user1 = new HoonuitUsers("uihnda1@applegrove.me", "Password@1");
    public static readonly uu_googleTeacher_user1 = new HoonuitUsers("unifiedinsight1teacher1@applegrove.me", "PSAutomation1!");
    public static readonly uu_microsoftAdmin_user1 = new HoonuitUsers("uihnda2@pswish.onmicrosoft.com", "PSAutomation1!");
    public static readonly uu_microsoftTeacher_user1 = new HoonuitUsers("unifiedinsight1teacher1@pswish.onmicrosoft.com", "PSAutomation1!");
    public static readonly uu_sisAdmin_user1 = new HoonuitUsers("uutest1admin1@yopmail.com", "PSAutomation1!");
    public static readonly uu_sisTeacher_user1 = new HoonuitUsers("uutest1teacher1@yopmail.com", "PSAutomation1!");

    // Tenant Manager Users
    public static readonly tenant_manager_user = new HoonuitUsers("uihnautomation@powerschool.cloud", "PSAutomation1!");

    // Performance Learning (PL) Users
    public static readonly pl_adminUser1 = new HoonuitUsers("tnl.admin", "jup1ter");
    public static readonly perform_adminUser1 = new HoonuitUsers("UIHNAdmin1", "UIHNAdmin1@123");

    // Portal Admin Users
    public static readonly portalAdmin_sisgoldps5ctclone = new HoonuitUsers("admin", "DS6fAe5N8bH5KerKQYileCCEr");

    // ATS Users
    public static readonly ats_adminUser1 = new HoonuitUsers("shamsh.hyder", "P@ssw0rd");
    public static readonly ats_teacherUser1 = new HoonuitUsers("uihnteacher", "PSAutomation1!");
    public static readonly awsmultiqa_maintenance_user = new HoonuitUsers("admin", "uHmluR2/OpMYRDWtrmGMAciE");

    // Kickboard Users
    public static readonly kickboard_districtadminUser1 = new HoonuitUsers("da1", "PSAutomation2!");
    public static readonly kickboard_teacherUser1 = new HoonuitUsers("penninger", "PSAutomation2!");
    public static readonly kickboard_maintenance_user = new HoonuitUsers("admin", "DYk9BJUzajrUmtKNjXWiHJAf");
    public static readonly kickboard_source_user = new HoonuitUsers("sugreev.kumar@powerschool.com", "Kickboard@2024");
    public static readonly kickboard_schoolAdminUser1 = new HoonuitUsers("sa1", "PSAutomation2!");
    public static readonly kickboard_limitedEssentialsAdminUser1 = new HoonuitUsers("le1", "PSAutomation2!");
    public static readonly kickboard_secondarySchoolAdminUser1 = new HoonuitUsers("ssa1", "PSAutomation2!");

    // Cumberland Risk Users
    public static readonly cumberlandrisk04_district_Admin_user1 = new HoonuitUsers("logi", "PSAutomation1!");
    public static readonly cumberlandrisk04_district_Admin_user3 = new HoonuitUsers("logisa1", "PSAutomation1!");
    public static readonly cumberlandrisk04_district_Admin_user2 = new HoonuitUsers("logisand1", "PSAutomation1!");
    public static readonly cumberlandrisk04_district_Admin_user4 = new HoonuitUsers("logipsa1", "PSAutomation1!");
    public static readonly cumberlandrisk04_district_Admin_user5 = new HoonuitUsers("logile1", "PSAutomation1!");

    // Latest MTSS Portal Users
    public static readonly latestmtssportal_admin = new HoonuitUsers("admin", "i+Hr6QtgL3N0xIM8XxPIxSA/");
    public static readonly latestmtssviewer = new HoonuitUsers("MTSS_Viewer", "MTSS_Viewer");
    public static readonly latestmtssmanager = new HoonuitUsers("District_Manager", "District_Manager");

    // Assessment Importer Users
    public static readonly assessmentImporter2admin = new HoonuitUsers("admin", "uayqkHmMoumpEiNoDk3vLIIea");
}