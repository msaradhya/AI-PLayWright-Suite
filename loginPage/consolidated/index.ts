/**
 * Consolidated Login Pages - Index File
 * 
 * This module exports all consolidated login page classes.
 * Use these imports for new code development.
 * 
 * @module loginPage/consolidated
 */

// ============================================
// SSO Provider Pages (Group 1)
// ============================================

export { GoogleLoginPage } from './GoogleLoginPage';
export { default as GoogleLoginPageDefault } from './GoogleLoginPage';

export { MicrosoftLoginPage } from './MicrosoftLoginPage';
export { default as MicrosoftLoginPageDefault } from './MicrosoftLoginPage';

// ============================================
// Maintenance Portal Login (Group 2)
// ============================================

export { HoonuitMaintenanceLoginPage } from './HoonuitMaintenanceLoginPage';
export { default as HoonuitMaintenanceLoginPageDefault } from './HoonuitMaintenanceLoginPage';

// ============================================
// Main Application Login (Group 3)
// ============================================

export { HoonuitLoginPage, LoginPage, UihnLoginPage } from './HoonuitLoginPage';
export { default as HoonuitLoginPageDefault } from './HoonuitLoginPage';