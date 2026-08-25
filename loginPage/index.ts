/**
 * Login Pages - Main Index File
 *
 * This module provides access to all consolidated login page classes.
 *
 * Structure:
 * - consolidated/GoogleLoginPage.ts - Google OAuth SSO
 * - consolidated/MicrosoftLoginPage.ts - Microsoft OAuth SSO
 * - consolidated/HoonuitMaintenanceLoginPage.ts - Maintenance Portal
 * - consolidated/HoonuitLoginPage.ts - Main Application Login
 *
 * @module loginPage
 */

// ============================================
// SSO Provider Pages (Group 1)
// ============================================

export { GoogleLoginPage } from './consolidated/GoogleLoginPage';
export { MicrosoftLoginPage } from './consolidated/MicrosoftLoginPage';

// ============================================
// Maintenance Portal Login (Group 2)
// ============================================

export { HoonuitMaintenanceLoginPage } from './consolidated/HoonuitMaintenanceLoginPage';

// ============================================
// Main Application Login (Group 3)
// ============================================

export {
    HoonuitLoginPage,
    LoginPage,
    UihnLoginPage
} from './consolidated/HoonuitLoginPage';

// ============================================
// Default Export
// ============================================

export { default } from './consolidated/HoonuitLoginPage';

// ============================================
// Re-export all from consolidated for convenience
// ============================================

export * from './consolidated';