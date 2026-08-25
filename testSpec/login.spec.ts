import { test, expect } from '../fixtures/hoonuit-sis-fixture';
import { HoonuitLoginPage as LoginPage } from '../shared/pages/loginPage/consolidated/HoonuitLoginPage';
import { HoonuitSisHelper } from '../shared/helpers/hoonuit-sis-helper';
import { ConfigManager } from '../config/ConfigManager';

/**
 * Test Suite: Login Functionality
 * Tests various login scenarios for Hoonuit SIS Integration
 */
test.describe('Hoonuit SIS - Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('TCM-00001: Should successfully login as Administrator', async ({ page }) => {
        // Arrange - credentials are loaded from config
        
        // Act
        await loginPage.loginAsAdministrator();
        
        // Assert - verify successful login by checking for user menu or dashboard
        const userMenuButton = page.locator('button.pds-user-menu-trigger');
        await expect(userMenuButton).toBeVisible({ timeout: 30000 });
        
        // Additional verification - check we're on a dashboard page
        await page.waitForTimeout(2000);
        const url = page.url();
        expect(url).not.toContain('login');
    });

    test('TCM-00002: Should successfully login as Teacher', async ({ page }) => {
        // Arrange - credentials are loaded from config
        
        // Act
        await loginPage.loginAsTeacher();
        
        // Assert - verify successful login
        const userMenuButton = page.locator('button.pds-user-menu-trigger');
        await expect(userMenuButton).toBeVisible({ timeout: 30000 });
        
        // Additional verification
        await page.waitForTimeout(2000);
        const url = page.url();
        expect(url).not.toContain('login');
    });

    test('TCM-00003: Should display login page elements correctly', async ({ page }) => {
        // Assert - verify login options are visible (using text selectors)
        await expect(page.locator('text=Sign in as an Administrator')).toBeVisible();
        await expect(page.locator('text=Sign in as a Teacher')).toBeVisible();
    });

    test('TCM-00004: Should handle invalid credentials gracefully', async ({ page }) => {
        // Arrange
        const invalidUsername = 'invalid@test.com';
        const invalidPassword = 'wrongpassword';
        
        // Act
        await page.click('text=Sign in as an Administrator');
        await loginPage.loginWithCredentials(invalidUsername, invalidPassword);
        
        // Assert - should still be on login page or show error
        await page.waitForTimeout(3000);
        const currentUrl = page.url();
        
        // Check if still on login page or if error message is displayed
        const isStillOnLogin = currentUrl.includes('login') ||
                              await page.locator('#fieldUsername').isVisible().catch(() => false);
        
        expect(isStillOnLogin).toBeTruthy();
    });

    test('TCM-00005: Should successfully logout after login', async ({ page }) => {
        // Arrange - login first
        await loginPage.loginAsAdministrator();
        await page.waitForTimeout(2000);
        
        // Act
        await loginPage.logout();
        
        // Assert - should be back on login page
        await page.waitForTimeout(2000);
        const isLoginPageDisplayed = await loginPage.isLoginPageDisplayed();
        expect(isLoginPageDisplayed).toBeTruthy();
    });
});

/**
 * Test Suite: Configuration and Helper Tests
 * Validates that configuration is properly loaded using ConfigManager
 */
test.describe('Hoonuit SIS - Configuration Tests', () => {
    
    test('TCM-00006: Should load base URL from ConfigManager', async ({ configManager }) => {
        // Act
        const baseUrl = configManager.getBaseUrl();
        
        // Assert
        expect(baseUrl).toBeTruthy();
        expect(baseUrl).toContain('http');
        console.log('Base URL loaded:', baseUrl);
    });

    test('TCM-00007: Should load user credentials from ConfigManager', async ({ configManager }) => {
        // Act
        const adminCredentials = configManager.getUserCredentials('adminUser');
        const teacherCredentials = configManager.getUserCredentials('teacherUser');
        
        // Assert
        expect(adminCredentials.username).toBeTruthy();
        expect(adminCredentials.password).toBeTruthy();
        expect(teacherCredentials.username).toBeTruthy();
        expect(teacherCredentials.password).toBeTruthy();
        
        console.log('Admin username:', adminCredentials.username);
        console.log('Teacher username:', teacherCredentials.username);
    });

    test('TCM-00008: Should load feature configurations from ConfigManager', async ({ configManager }) => {
        // Act
        const featureFlags = configManager.getFeatureFlags();
        
        // Assert
        expect(typeof featureFlags.enableAngularWait).toBe('boolean');
        expect(typeof featureFlags.enableSpinnerWait).toBe('boolean');
        expect(featureFlags.defaultTimeout).toBeGreaterThan(0);
        
        console.log('Angular Wait Enabled:', featureFlags.enableAngularWait);
        console.log('Spinner Wait Enabled:', featureFlags.enableSpinnerWait);
        console.log('Default Timeout:', featureFlags.defaultTimeout);
    });

    test('TCM-00009: Should verify ConfigManager environment settings', async ({ configManager }) => {
        // Act
        const environment = configManager.getEnvironment();
        const browserConfig = configManager.getBrowserConfig();
        const reportingConfig = configManager.getReportingConfig();
        
        // Assert
        expect(environment).toBeTruthy();
        expect(browserConfig.browserType).toBe('chromium');
        expect(browserConfig.viewport.width).toBeGreaterThan(0);
        expect(browserConfig.viewport.height).toBeGreaterThan(0);
        
        console.log('Environment:', environment);
        console.log('Browser Type:', browserConfig.browserType);
        console.log('Viewport:', browserConfig.viewport);
    });
});