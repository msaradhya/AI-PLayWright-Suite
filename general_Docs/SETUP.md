# Setup Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Credential Management](#credential-management)
- [Running Your First Test](#running-your-first-test)
- [Troubleshooting Setup Issues](#troubleshooting-setup-issues)

---

## Prerequisites

Before setting up the PW Hoonuit SIS Integration framework, ensure you have the following installed:

### Required Software
- **Node.js**: Version 18.x or higher
  ```bash
  node --version  # Should output v18.x.x or higher
  ```
- **npm**: Version 9.x or higher (comes with Node.js)
  ```bash
  npm --version   # Should output 9.x.x or higher
  ```
- **Git**: Latest version
  ```bash
  git --version
  ```

### Optional Tools
- **Visual Studio Code**: Recommended IDE with Playwright extension
- **Docker**: For containerized test execution (optional)

### System Requirements
- **OS**: macOS, Linux, or Windows 10/11
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: At least 5GB free space
- **Network**: Stable internet connection for initial setup

---

## Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd PW_AI_hoonuit_suite
```

### Step 2: Install Dependencies
```bash
# Install all Node.js dependencies
npm install
```

This will install:
- Playwright Test framework
- TypeScript compiler
- All utility packages
- Development dependencies

### Step 3: Install Playwright Browsers
```bash
# Install Chromium, Firefox, and WebKit browsers
npx playwright install

# Or install specific browser only
npx playwright install chromium
```

### Step 4: Verify Installation
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Verify Playwright installation
npx playwright --version
```

---

## Environment Configuration

### Understanding Environment Files

The framework supports multiple test environments through environment-specific configuration files:

- **`.env.example`**: Template file (committed to git)
- **`.env.development`**: Local development environment
- **`.env.auto_bronze`**: QA/Bronze environment
- **`.env.auto_aws_bronze`**: AWS Bronze environment
- **`.env.auto_silver`**: Silver environment

### Step 1: Create Your Environment File

```bash
# Copy the example file
cp .env.example .env.development

# Or for specific environment
cp .env.example .env.auto_aws_bronze
```

### Step 2: Configure Environment Variables

Edit your environment file (e.g., `.env.development`) with your settings:

```bash
# Test Environment Configuration
TEST_ENV=auto_aws_bronze
TEST_MODULE=hoonuit_sis
NODE_ENV=development

# Browser Configuration
HEADLESS=false                    # Set to true for CI/CD
CHROME_PATH=/path/to/chrome       # Optional: Custom Chrome path
BROWSER_TYPE=chromium             # chromium, firefox, or webkit

# Test User Credentials
ADMIN_USERNAME=your_admin_user
ADMIN_PASSWORD=your_admin_password
TEACHER_USERNAME=your_teacher_user
TEACHER_PASSWORD=your_teacher_password
STUDENT_USERNAME=your_student_user
STUDENT_PASSWORD=your_student_password

# Reporting Configuration (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_ENABLED=false
JIRA_SERVER=https://your-jira-instance.atlassian.net
JIRA_API_TOKEN=your_jira_api_token
JIRA_ENABLED=false

# Database Configuration (Optional)
DB_SERVER=your_db_server
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=1433

# Feature Flags
ENABLE_ANGULAR_WAIT=true
ENABLE_SPINNER_WAIT=true
DEFAULT_TIMEOUT=30000
```

### Step 3: Set Active Environment

The framework loads the environment file based on the `NODE_ENV` variable:

```bash
# Use development environment
export NODE_ENV=development

# Or use AWS Bronze environment
export NODE_ENV=auto_aws_bronze
```

### Environment Variables Reference

| Variable | Type | Description | Default |
|----------|------|-------------|---------|
| `TEST_ENV` | string | Target test environment | `auto_aws_bronze` |
| `TEST_MODULE` | string | Module to test | `hoonuit_sis` |
| `NODE_ENV` | string | Node environment | `development` |
| `HEADLESS` | boolean | Run browser in headless mode | `false` |
| `BROWSER_TYPE` | string | Browser to use (chromium/firefox/webkit) | `chromium` |
| `DEFAULT_TIMEOUT` | number | Default timeout in milliseconds | `30000` |
| `ENABLE_ANGULAR_WAIT` | boolean | Wait for Angular to stabilize | `true` |
| `ENABLE_SPINNER_WAIT` | boolean | Wait for spinners to disappear | `true` |

---

## Credential Management

### Security Best Practices

⚠️ **NEVER commit actual credentials to git!**

1. **Use Environment Variables**: Store credentials in `.env.*` files (gitignored)
2. **Use Secret Management**: For production, use tools like:
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault
   - GitHub Secrets (for CI/CD)

### Local Development Credentials

For local development, store credentials in your environment file:

```bash
# .env.development (NOT committed to git)
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=SecurePassword123!
```

### CI/CD Credentials

For CI/CD pipelines, use GitHub Secrets or similar:

```yaml
# In GitHub Actions workflow
env:
  ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
  ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

### Credential Rotation

When credentials change:
1. Update your local `.env.*` files
2. Update CI/CD secrets
3. Notify team members
4. Document the change

---

## Running Your First Test

### Step 1: Verify Setup

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Should output nothing (or only warnings)
```

### Step 2: Run a Simple Test

```bash
# Run all tests in headed mode
npm test -- --headed

# Run a specific test file
npm test tests/login.spec.ts

# Run tests with specific tag
npm test -- --grep "@smoke"
```

### Step 3: View Test Results

```bash
# Open HTML report
npx playwright show-report

# Or manually open
open reports/html-report/index.html
```

### Common Test Commands

```bash
# Run all tests (headless)
npm test

# Run in headed mode (see browser)
npm test -- --headed

# Run specific test suite
npm test -- --grep "login"

# Run in debug mode
npm test -- --debug

# Run with UI mode (interactive)
npx playwright test --ui

# Run single test
npm test tests/specific-test.spec.ts

# Run tests in specific browser
npm test -- --project=chromium
npm test -- --project=firefox
npm test -- --project=webkit
```

---

## Troubleshooting Setup Issues

### Issue: Node.js Version Too Old

**Error:**
```
Error: Node.js version 16.x is not supported
```

**Solution:**
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 18
nvm install 18
nvm use 18
```

### Issue: Playwright Browsers Not Installed

**Error:**
```
Error: browserType.launch: Executable doesn't exist
```

**Solution:**
```bash
# Install all browsers
npx playwright install

# Install with system dependencies (Linux)
npx playwright install --with-deps
```

### Issue: TypeScript Compilation Errors

**Error:**
```
error TS2307: Cannot find module './config/appConfig'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify tsconfig.json exists
cat tsconfig.json
```

### Issue: Environment Variables Not Loading

**Error:**
```
Error: TEST_ENV is undefined
```

**Solution:**
```bash
# Verify .env file exists
ls -la .env.development

# Check file content
cat .env.development

# Export NODE_ENV
export NODE_ENV=development

# Verify variables loaded
node -e "require('dotenv').config(); console.log(process.env.TEST_ENV)"
```

### Issue: Authentication Failures

**Error:**
```
Error: Login failed - invalid credentials
```

**Solution:**
1. Verify credentials in `.env.*` file
2. Check if credentials are correct for the environment
3. Ensure no extra spaces in environment variables
4. Test credentials manually in browser

### Issue: Permission Denied

**Error:**
```
EACCES: permission denied, mkdir 'playwright-state'
```

**Solution:**
```bash
# Fix permissions
chmod -R 755 .
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo npm test
```

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::9323
```

**Solution:**
```bash
# Find and kill the process
lsof -ti:9323 | xargs kill -9

# Or use different port in configuration
```

### Getting Help

If you encounter issues not covered here:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review [GitHub Issues](https://github.com/your-repo/issues)
3. Contact the test automation team
4. Check Playwright documentation: https://playwright.dev

---

## Next Steps

After successful setup:

1. Read the [Architecture Guide](ARCHITECTURE.md) to understand the framework structure
2. Follow the [Testing Guide](TESTING_GUIDE.md) to learn how to write tests
3. Review [Reporting Guide](REPORTING.md) to setup test reporting
4. Explore existing test files in the `tests/` directory

---

**Last Updated:** 2025-12-01
**Version:** 2.1.0
**Maintainer:** Test Automation Team