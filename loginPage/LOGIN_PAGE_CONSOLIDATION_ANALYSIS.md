# Login Page Classes Consolidation Analysis

## Status: ✅ COMPLETED

> **Implementation Date:** November 29, 2024
>
> All consolidated classes have been created in the `./consolidated/` folder.
> **Original deprecated files have been removed.** Imports should now reference the consolidated folder.

## Overview

This document analyzes the 9 login page classes in the `loginPage` folder and proposes a consolidation strategy to reduce duplication while preserving all functionality.

---

## Current Class Inventory

### 1. Google Login Pages (2 files - DUPLICATES)

| File | Class Name | Extends | Export Type |
|------|------------|---------|-------------|
| `google-login-page.ts` | `GoogleLoginPage` | `HoonuitSisBasePage` | Named export |
| `GoogleLoginPage.ts` | `GoogleLoginPage` | None (standalone) | Named export |

**Comparison:**

| Feature | `google-login-page.ts` | `GoogleLoginPage.ts` |
|---------|------------------------|----------------------|
| Base class | `HoonuitSisBasePage` | None |
| Locator style | Instance properties | Static readonly |
| `login()` method | ✅ Yes | ✅ Yes (`loginToGoogle()`) |
| `waitForPageLoad()` | ✅ Yes (inherited) | ❌ No |
| Password wait timeout | 60000ms | 60000ms (attached) + 10000ms (visible) |

**Methods in both:**
- `setUsername(username: string)`
- `setPassword(password: string)`
- `clickUserNameNext()`
- `clickPasswordNext()`
- Complete login flow method

---

### 2. Microsoft Login Pages (2 files - DUPLICATES)

| File | Class Name | Extends | Export Type |
|------|------------|---------|-------------|
| `microsoft-login-page.ts` | `MicrosoftLoginPage` | `HoonuitSisBasePage` | Named export |
| `MicrosoftLoginPage.ts` | `MicrosoftLoginPage` | None (standalone) | Named export |

**Comparison:**

| Feature | `microsoft-login-page.ts` | `MicrosoftLoginPage.ts` |
|---------|---------------------------|-------------------------|
| Base class | `HoonuitSisBasePage` | None |
| Locator style | Instance properties | Static readonly |
| `login()` method | ✅ Yes | ❌ No (individual methods only) |
| `clickYes()` method | ✅ Yes | ✅ Yes |
| `waitForPageLoad()` | ✅ Yes (inherited) | ❌ No |

**Methods in both:**
- `setUsername(username: string)`
- `setPassword(password: string)`
- `clickUserNameNext()`
- `clickSignIn()`
- `clickYes()`

---

### 3. Hoonuit Maintenance Login Pages (2 files - DUPLICATES)

| File | Class Name | Extends | Export Type |
|------|------------|---------|-------------|
| `hoonuit-maintenance-login.page.ts` | `HoonuitMaintenanceLoginPage` | None | Named export |
| `HoonuitMaintenanceLoginPage.ts` | `HoonuitMaintenanceLoginPage` | None | Default export |

**Comparison:**

| Feature | `hoonuit-maintenance-login.page.ts` | `HoonuitMaintenanceLoginPage.ts` |
|---------|-------------------------------------|----------------------------------|
| Export type | Named | Default |
| Locator style | Instance (Locator type) | Static readonly (string selectors) |
| Static methods | ❌ No | ✅ Yes (`setDomain`, `clickOnSingleSignOn`, `clickOnSsoLoginButton`) |
| SSO button selector | `getByText('Single Sign On (SSO)')` | `'a:has-text("Single Sign On (SSO)")'` |

**Methods available:**
- `setUsername(username: string)`
- `setPassword(password: string)`
- `clickSubmit()`
- `setDomain(domainName: string)` - instance vs static
- `clickOnSingleSignOn()` - instance vs static
- `clickOnSsoLoginButton()` - instance vs static

---

### 4. Standard Login Pages (2 files - PARTIAL OVERLAP)

| File | Class Name | Extends | Export Type |
|------|------------|---------|-------------|
| `login-page.ts` | `LoginPage` | `HoonuitSisBasePage` | Named export |
| `LoginPage.ts` | `LoginPage` | None (standalone) | Default export |

**Comparison:**

| Feature | `login-page.ts` | `LoginPage.ts` |
|---------|-----------------|----------------|
| Base class | `HoonuitSisBasePage` | None |
| Standard login | ✅ Yes | ✅ Yes |
| UU (University) login | ❌ No | ✅ Yes |
| Google SSO built-in | ✅ Yes | ❌ No |
| Microsoft SSO built-in | ✅ Yes | ❌ No |
| Role-based login | ✅ Yes (Admin/Teacher) | ❌ No |
| Logout method | ✅ Yes | ❌ No |

**Unique features in `login-page.ts`:**
- `loginAsAdministrator(username?, password?)`
- `loginAsTeacher(username?, password?)`
- `loginWithCredentials(username, password)`
- `loginThroughGoogleSSO(username, password)`
- `loginThroughMicrosoftSSO(username, password)`
- `isLoginPageDisplayed()`
- `logout()`
- `goto()`

**Unique features in `LoginPage.ts`:**
- `setUuUserName(username)`
- `setUuPassword(password)`
- `clickLoginId()`
- `clickPasswordId()`

---

### 5. UIHN Login Page (1 file - COMPREHENSIVE)

| File | Class Name | Extends | Export Type |
|------|------------|---------|-------------|
| `uihn-login-page.ts` | `UihnLoginPage` | `HoonuitSisBasePage` | Named export |

**Features:**
- Standard login (username/password)
- UU (University) login
- Kickboard login
- Convenience `login()` method
- Inherits from `HoonuitSisBasePage`

**Methods:**
- `setUsername(username)` - Standard login
- `setPassword(password)` - Standard login
- `clickSubmit()` - Standard login
- `setUuUserName(username)` - UU login
- `setUuPassword(password)` - UU login
- `clickLoginId()` - UU login
- `clickPasswordId()` - UU login
- `setKickboardUserName(username)` - Kickboard login
- `setKickboardPassword(password)` - Kickboard login
- `clickSignIn()` - Kickboard login
- `login(username, password)` - Complete flow

---

## Identified Duplicates & Redundancies

| Duplicate Pair | Recommendation |
|----------------|----------------|
| `google-login-page.ts` vs `GoogleLoginPage.ts` | Merge into single `GoogleLoginPage.ts` |
| `microsoft-login-page.ts` vs `MicrosoftLoginPage.ts` | Merge into single `MicrosoftLoginPage.ts` |
| `hoonuit-maintenance-login.page.ts` vs `HoonuitMaintenanceLoginPage.ts` | Merge into single `HoonuitMaintenanceLoginPage.ts` |
| `login-page.ts` vs `LoginPage.ts` vs `uihn-login-page.ts` | Consolidate into single comprehensive `HoonuitLoginPage.ts` |

---

## Proposed Consolidation: 3 Groups

### Group 1: SSO Provider Pages
**Purpose:** Handle third-party authentication (Google, Microsoft)

| New File | Replaces | Functionality |
|----------|----------|---------------|
| `GoogleLoginPage.ts` | `google-login-page.ts`, `GoogleLoginPage.ts` | Google OAuth flow |
| `MicrosoftLoginPage.ts` | `microsoft-login-page.ts`, `MicrosoftLoginPage.ts` | Microsoft OAuth flow |

### Group 2: Maintenance/Admin Login Page
**Purpose:** Handle maintenance portal and SSO domain selection

| New File | Replaces | Functionality |
|----------|----------|---------------|
| `HoonuitMaintenanceLoginPage.ts` | `hoonuit-maintenance-login.page.ts`, `HoonuitMaintenanceLoginPage.ts` | Maintenance login, SSO domain selection |

### Group 3: Main Application Login Page
**Purpose:** Unified login page for all standard login flows

| New File | Replaces | Functionality |
|----------|----------|---------------|
| `HoonuitLoginPage.ts` | `login-page.ts`, `LoginPage.ts`, `uihn-login-page.ts` | Standard login, UU login, Kickboard login, role-based login, SSO redirects |

---

## Consolidated Class Specifications

### Group 1A: `GoogleLoginPage.ts` (Consolidated)

```typescript
import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../base/hoonuit-sis-base-page';

export class GoogleLoginPage extends HoonuitSisBasePage {
    // Locators
    private static readonly USERNAME_TEXTBOX = 'input[id="identifierId"], input[id="Email"]';
    private static readonly USERNAME_NEXT_BUTTON = 'div#identifierNext button, input[id="next"], button#identifierNext';
    private static readonly PASSWORD_TEXTBOX = 'input[name="password"], input[id="password"], input[type="password"]';
    private static readonly PASSWORD_NEXT_BUTTON = 'div#passwordNext button, input[id="submit"], button#passwordNext';

    constructor(page: Page) {
        super(page);
    }

    // Methods
    async setUsername(username: string): Promise<void>
    async setPassword(password: string): Promise<void>
    async clickUserNameNext(): Promise<void>
    async clickPasswordNext(): Promise<void>
    async login(username: string, password: string): Promise<void>
}
```

### Group 1B: `MicrosoftLoginPage.ts` (Consolidated)

```typescript
import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../base/hoonuit-sis-base-page';

export class MicrosoftLoginPage extends HoonuitSisBasePage {
    // Locators
    private static readonly USERNAME_TEXTBOX = "input[type='email']";
    private static readonly USERNAME_NEXT_BUTTON = "input[id^='idSIButton']";
    private static readonly PASSWORD_TEXTBOX = "input[type='password']";
    private static readonly SIGN_IN_BUTTON = "input[id^='idSIButton']";
    private static readonly YES_BUTTON = "input[type='submit']";

    constructor(page: Page) {
        super(page);
    }

    // Methods
    async setUsername(username: string): Promise<void>
    async setPassword(password: string): Promise<void>
    async clickUserNameNext(): Promise<void>
    async clickSignIn(): Promise<void>
    async clickYes(): Promise<void>
    async login(username: string, password: string): Promise<void>
}
```

### Group 2: `HoonuitMaintenanceLoginPage.ts` (Consolidated)

```typescript
import { Page } from '@playwright/test';

export class HoonuitMaintenanceLoginPage {
    // Locators
    private static readonly USERNAME_TEXTBOX = '#user';
    private static readonly PASSWORD_TEXTBOX = '#pass';
    private static readonly SUBMIT_BUTTON = '#btnSubmit';
    private static readonly DOMAIN_DROPDOWN = '#authdomain';
    private static readonly DOMAIN_LOGIN_BUTTON = '#btnLogon';
    private static readonly SSO_BUTTON = 'a:has-text("Single Sign On (SSO)")';

    constructor(private readonly page: Page) {}

    // Instance methods
    async setUsername(username: string): Promise<void>
    async setPassword(password: string): Promise<void>
    async clickSubmit(): Promise<void>
    async setDomain(domainName: string): Promise<void>
    async clickOnSingleSignOn(): Promise<void>
    async clickOnSsoLoginButton(): Promise<void>
    async login(username: string, password: string): Promise<void>
}
```

### Group 3: `HoonuitLoginPage.ts` (Consolidated)

```typescript
import { Page } from '@playwright/test';
import { HoonuitSisBasePage } from '../base/hoonuit-sis-base-page';
import { GoogleLoginPage } from './GoogleLoginPage';
import { MicrosoftLoginPage } from './MicrosoftLoginPage';

export class HoonuitLoginPage extends HoonuitSisBasePage {
    // Standard login selectors
    private static readonly USERNAME_TEXTBOX = '#fieldUsername';
    private static readonly PASSWORD_TEXTBOX = '#fieldPassword';
    private static readonly SUBMIT_BUTTON = '#btnEnter';
    
    // Login type selectors
    private static readonly SIGN_AS_ADMIN = 'text=Sign in as an Administrator';
    private static readonly SIGN_AS_TEACHER = 'text=Sign in as a Teacher';
    private static readonly SIGN_AS_EXTERNAL = 'text=Sign in here with your external credentials';
    
    // UU (University) login selectors
    private static readonly UU_USERNAME_TEXTBOX = '#username';
    private static readonly UU_LOGIN_ID_BUTTON = '._button-login-id';
    private static readonly UU_PASSWORD_BUTTON = '#password';
    private static readonly UU_PASSWORD_ID_BUTTON = '._button-login-password';
    
    // Kickboard login selectors
    private static readonly KB_EMAIL_TEXTBOX = '#email';
    private static readonly KB_PASSWORD_TEXTBOX = '#password';
    private static readonly KB_SIGNIN_BUTTON = '#button';

    constructor(page: Page) {
        super(page);
    }

    // Navigation
    async goto(): Promise<void>
    
    // Standard Login
    async setUsername(username: string): Promise<void>
    async setPassword(password: string): Promise<void>
    async clickSubmit(): Promise<void>
    async loginWithCredentials(username: string, password: string): Promise<void>
    
    // Role-based Login
    async loginAsAdministrator(username?: string, password?: string): Promise<void>
    async loginAsTeacher(username?: string, password?: string): Promise<void>
    
    // UU Login
    async setUuUserName(username: string): Promise<void>
    async setUuPassword(password: string): Promise<void>
    async clickLoginId(): Promise<void>
    async clickPasswordId(): Promise<void>
    async loginWithUuCredentials(username: string, password: string): Promise<void>
    
    // Kickboard Login
    async setKickboardUserName(username: string): Promise<void>
    async setKickboardPassword(password: string): Promise<void>
    async clickKickboardSignIn(): Promise<void>
    async loginToKickboard(username: string, password: string): Promise<void>
    
    // SSO Login (delegates to SSO page objects)
    async loginThroughGoogleSSO(username: string, password: string): Promise<void>
    async loginThroughMicrosoftSSO(username: string, password: string): Promise<void>
    
    // Utility
    async isLoginPageDisplayed(): Promise<boolean>
    async logout(): Promise<void>
}
```

---

## Implementation Summary

### Files to Keep (Consolidated):
1. `GoogleLoginPage.ts` - SSO Provider (merged)
2. `MicrosoftLoginPage.ts` - SSO Provider (merged)
3. `HoonuitMaintenanceLoginPage.ts` - Maintenance Portal (merged)
4. `HoonuitLoginPage.ts` - Main Application Login (new consolidated)

### Files to Remove (After Migration):
1. `google-login-page.ts` - Merged into `GoogleLoginPage.ts`
2. `microsoft-login-page.ts` - Merged into `MicrosoftLoginPage.ts`
3. `hoonuit-maintenance-login.page.ts` - Merged into `HoonuitMaintenanceLoginPage.ts`
4. `login-page.ts` - Merged into `HoonuitLoginPage.ts`
5. `LoginPage.ts` - Merged into `HoonuitLoginPage.ts`
6. `uihn-login-page.ts` - Merged into `HoonuitLoginPage.ts`

### Backward Compatibility:
To maintain backward compatibility, you can create re-export files:

```typescript
// login-page.ts (deprecated - re-export)
export { HoonuitLoginPage as LoginPage } from './HoonuitLoginPage';

// uihn-login-page.ts (deprecated - re-export)
export { HoonuitLoginPage as UihnLoginPage } from './HoonuitLoginPage';
```

---

## Benefits of Consolidation

1. **Reduced Duplication**: 9 files → 4 files (55% reduction)
2. **Consistent Architecture**: All pages extend `HoonuitSisBasePage` where appropriate
3. **Single Source of Truth**: Each login type has one implementation
4. **Maintainability**: Changes need to be made in only one place
5. **Clear Separation of Concerns**:
   - Group 1: External SSO providers
   - Group 2: Internal maintenance/admin portal
   - Group 3: Main application login (all flavors)

---

## Implementation Status

### ✅ Completed Steps

1. ✅ Created consolidated `GoogleLoginPage.ts` in `./consolidated/`
2. ✅ Created consolidated `MicrosoftLoginPage.ts` in `./consolidated/`
3. ✅ Created consolidated `HoonuitMaintenanceLoginPage.ts` in `./consolidated/`
4. ✅ Created consolidated `HoonuitLoginPage.ts` in `./consolidated/`
5. ✅ Added deprecated re-exports in all original files
6. ✅ Created `index.ts` files for easy imports

### Final File Structure

```
loginPage/
├── consolidated/                          # Consolidated implementations
│   ├── GoogleLoginPage.ts                 # SSO Provider - Google (222 lines)
│   ├── MicrosoftLoginPage.ts              # SSO Provider - Microsoft (271 lines)
│   ├── HoonuitMaintenanceLoginPage.ts     # Maintenance Portal (302 lines)
│   ├── HoonuitLoginPage.ts                # Main Application Login (563 lines)
│   └── index.ts                           # Barrel exports
├── index.ts                               # Main barrel export
└── LOGIN_PAGE_CONSOLIDATION_ANALYSIS.md   # This document
```

### Usage Guide

#### Import Syntax
```typescript
// Import from consolidated folder (recommended)
import { HoonuitLoginPage, GoogleLoginPage, MicrosoftLoginPage } from './loginPage/consolidated';

// Or from main index
import { HoonuitLoginPage } from './loginPage';

// Import with aliases (for backward compatibility)
import { LoginPage, UihnLoginPage } from './loginPage/consolidated';
```

### Updated Dependencies

The following files have been updated to use the consolidated imports:
- `fixtures/hoonuit-sis-fixture.ts`
- `testSpec/login.spec.ts`
- `mtss/shared/api/HoonuitMtssHeadlessChromeHelper.ts`

### Result Summary

| Metric | Before | After |
|--------|--------|-------|
| Total Files | 9 | 4 |
| Reduction | - | 55% |
| Lines of Code | ~1,200 | ~1,358 (with complete functionality) |
| Duplicated Logic | High | None |
| Maintainability | Low | High |
