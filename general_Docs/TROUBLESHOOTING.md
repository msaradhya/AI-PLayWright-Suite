# Troubleshooting Guide

## Table of Contents
- [Common Issues](#common-issues)
- [Installation Problems](#installation-problems)
- [Configuration Issues](#configuration-issues)
- [Authentication Failures](#authentication-failures)
- [Test Execution Errors](#test-execution-errors)
- [Timeout Issues](#timeout-issues)
- [Browser Issues](#browser-issues)
- [Network Problems](#network-problems)
- [Reporting Issues](#reporting-issues)
- [Debug Techniques](#debug-techniques)
- [FAQ](#faq)

---

## Common Issues

### Quick Diagnostic Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Playwright installation
npx playwright --version

# Check TypeScript compilation
npx tsc --noEmit

# List installed browsers
npx playwright list

# Check environment variables
node -e "require('dotenv').config(); console.log(process.env)"
```

---

## Installation Problems

### Issue: Node.js Version Incompatible

**Error**:
```
The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check current version
node --version

# Install Node.js 18+ using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # or ~/.zshrc

nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version  # Should show v18.x.x
```

### Issue: npm install Fails

**Error**:
```
npm ERR! code EACCES
npm ERR! permission denied
```

**Solution**:
```bash
# Option 1: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Change ownership (macOS/Linux)
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER /usr/local/lib/node_modules

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Playwright Browsers Not Installing

**Error**:
```
browserType.launch: Executable doesn't exist at /path/to/browser
```

**Solution**:
```bash
# Install all browsers
npx playwright install

# Install with system dependencies (Linux)
npx playwright install --with-deps

# Install specific browser
npx playwright install chromium

# Verify installation
npx playwright list

# Check browser path
npx playwright install --dry-run
```

### Issue: TypeScript Compilation Errors

**Error**:
```
error TS2307: Cannot find module './config/appConfig'
```

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Verify tsconfig.json
cat tsconfig.json

# Check for syntax errors
npx tsc --noEmit

# Rebuild TypeScript
npm run build  # if build script exists
```

---

## Configuration Issues

### Issue: Environment Variables Not Loading

**Error**:
```
Error: TEST_ENV is undefined
```

**Solution**:
```bash
# 1. Verify .env file exists
ls -la .env.development

# 2. Check file content
cat .env.development

# 3. Verify NODE_ENV is set
echo $NODE_ENV

# 4. Set NODE_ENV
export NODE_ENV=development

# 5. Test variable loading
node -e "
  require('dotenv').config({ path: '.env.development' });
  console.log('TEST_ENV:', process.env.TEST_ENV);
  console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
"

# 6. Check for extra spaces or quotes
# Correct format:
TEST_ENV=auto_aws_bronze

# Incorrect formats:
TEST_ENV = auto_aws_bronze  # No spaces around =
TEST_ENV="auto_aws_bronze"  # No quotes needed
```

### Issue: Wrong Environment URLs

**Error**:
```
Navigation timeout: page didn't load within 30000ms
```

**Solution**:
```bash
# 1. Verify TEST_ENV value
echo $TEST_ENV

# 2. Check appConfig.ts for environment
grep "auto_aws_bronze" config/appConfig.ts

# 3. Test URL retrieval
node -e "
  const { getMainUrl } = require('./utils/urlUtils');
  console.log(getMainUrl('auto_aws_bronze'));
"

# 4. Verify URL is accessible
curl -I https://your-environment-url.com

# 5. Update config if needed
# Edit config/appConfig.ts
```

### Issue: Module Configuration Not Found

**Error**:
```
Error: Module configuration not found for 'hoonuit_sis'
```

**Solution**:
```bash
# 1. Check TEST_MODULE variable
echo $TEST_MODULE

# 2. Verify module in runtimeSettings.ts
grep "hoonuit_sis" config/runtimeSettings.ts

# 3. List available modules
node -e "
  const { default: settings } = require('./config/runtimeSettings');
  console.log('Available modules:', Object.keys(settings.modules));
"

# 4. Set correct module
export TEST_MODULE=hoonuit_sis
```

---

## Authentication Failures

### Issue: Login Fails with Valid Credentials

**Error**:
```
Error: Login failed - invalid credentials
```

**Debugging Steps**:
```bash
# 1. Verify credentials format
# Should be: username;password (with semicolon)
echo $ADMIN_USERNAME
echo $ADMIN_PASSWORD

# 2. Check for special characters
# Escape special characters in .env file
# Instead of: PASSWORD=Pass@word!123
# Use: PASSWORD='Pass@word!123'

# 3. Test credentials manually
# Open browser and try logging in

# 4. Check credential loading
node -e "
  const { getModuleCredentials } = require('./utils/moduleUtils');
  const creds = getModuleCredentials('hoonuit_sis');
  console.log('Username:', creds?.username);
  console.log('Password length:', creds?.password?.length);
"
```

### Issue: Storage State Not Saving

**Error**:
```
Error: Authentication state not found
```

**Solution**:
```bash
# 1. Verify playwright-state directory exists
mkdir -p playwright-state

# 2. Check permissions
chmod 755 playwright-state

# 3. Clear existing state
rm -f playwright-state/storageState.json

# 4. Run global setup manually
npx playwright test --global-setup

# 5. Verify state file created
ls -la playwright-state/storageState.json
cat playwright-state/storageState.json

# 6. Check storageState in playwright.config.ts
grep "storageState" playwright.config.ts
```

### Issue: Session Expires During Tests

**Error**:
```
Error: Session expired, please login again
```

**Solution**:
```typescript
// 1. Increase session timeout in global setup
// globalSetup.ts
await page.context().storageState({
  path: storageState as string
});

// 2. Add session check in tests
test.beforeEach(async ({ page }) => {
  // Check if still authenticated
  const isLoggedIn = await page.locator('.user-menu').isVisible();
  if (!isLoggedIn) {
    // Re-authenticate
    await HoonuitHelper.loginToHoonuitAdministrator(page, user);
  }
});

// 3. Use fresh authentication per test if needed
test.use({ storageState: undefined });  // Don't reuse state
```

---

## Test Execution Errors

### Issue: Element Not Found

**Error**:
```
Error: locator.click: Target closed
Error: locator.click: Timeout 30000ms exceeded
```

**Solution**:
```typescript
// 1. Increase timeout
await page.locator('.element').click({ timeout: 60000 });

// 2. Wait for element
await page.waitForSelector('.element', { state: 'visible' });
await page.click('.element');

// 3. Use better selector
// Bad: div > div > button
// Good: [data-testid="submit-button"]

// 4. Check if element exists
const exists = await page.locator('.element').count() > 0;
if (exists) {
  await page.click('.element');
}

// 5. Use retry logic
async function clickWithRetry(selector: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.click(selector, { timeout: 5000 });
      return;
    } catch (e) {
      if (i === retries - 1) throw e;
      await page.waitForTimeout(1000);
    }
  }
}
```

### Issue: Flaky Tests

**Symptoms**:
- Tests pass sometimes, fail other times
- Different results on reruns

**Solution**:
```typescript
// 1. Add proper waits
await WaitForHelpers.commonWait(page);

// 2. Wait for network idle
await page.waitForLoadState('networkidle');

// 3. Wait for specific conditions
await page.waitForFunction(() => {
  return document.querySelectorAll('.loading').length === 0;
});

// 4. Avoid arbitrary timeouts
// Bad:
await page.waitForTimeout(5000);
// Good:
await page.waitForSelector('.element');

// 5. Use strict selectors
// Bad: page.locator('button')  // May match multiple
// Good: page.locator('button:has-text("Submit")')

// 6. Stabilize tests
test.describe('Flaky Test Suite', () => {
  test.setTimeout(60000);  // Increase timeout
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });
});
```

### Issue: Tests Interfere with Each Other

**Error**:
```
Test failed: Data from previous test still present
```

**Solution**:
```typescript
// 1. Use test isolation
test.describe('Independent Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear state before each test
    await context.clearCookies();
    await context.clearPermissions();
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test.afterEach(async ({ page }) => {
    // Clean up after each test
    await cleanupTestData();
  });
});

// 2. Use unique test data
const testId = `test_${Date.now()}`;
await page.fill('#name', `User ${testId}`);

// 3. Disable parallel execution if needed
test.describe.configure({ mode: 'serial' });
```

---

## Timeout Issues

### Issue: Global Timeout Exceeded

**Error**:
```
Test timeout of 30000ms exceeded
```

**Solution**:
```typescript
// 1. Increase timeout in playwright.config.ts
export default defineConfig({
  timeout: 60000,  // 60 seconds
  expect: {
    timeout: 10000  // For assertions
  }
});

// 2. Increase for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(120000);  // 2 minutes
  // Test logic
});

// 3. Increase for test suite
test.describe('Slow Suite', () => {
  test.setTimeout(120000);
  // Tests
});

// 4. Mark test as slow (3x timeout)
test('very slow test', async ({ page }) => {
  test.slow();
  // Test logic
});
```

### Issue: Navigation Timeout

**Error**:
```
page.goto: Timeout 30000ms exceeded
```

**Solution**:
```typescript
// 1. Increase navigation timeout
await page.goto('/', { 
  timeout: 60000,
  waitUntil: 'domcontentloaded'  // Faster than 'load'
});

// 2. Configure in playwright.config.ts
export default defineConfig({
  use: {
    navigationTimeout: 60000,
    actionTimeout: 30000
  }
});

// 3. Handle slow pages
try {
  await page.goto('/', { timeout: 30000 });
} catch (e) {
  console.log('Page loaded slowly, continuing anyway');
}

// 4. Check network conditions
// Run: traceroute your-site.com
// Check: Is VPN needed?
```

---

## Browser Issues

### Issue: Browser Crashes

**Error**:
```
Browser closed unexpectedly
```

**Solution**:
```bash
# 1. Update Playwright browsers
npx playwright install --force

# 2. Check system resources
top  # or Activity Monitor on macOS
# Ensure enough RAM and CPU available

# 3. Reduce parallel workers
# playwright.config.ts
workers: 1  # Instead of undefined

# 4. Increase browser launch timeout
const browser = await chromium.launch({
  timeout: 60000
});

# 5. Check Chrome flags
# Remove problematic flags in browserUtils.ts

# 6. Use different browser
npm test -- --project=firefox
```

### Issue: Headless vs Headed Differences

**Symptom**:
Tests pass in headed mode, fail in headless

**Solution**:
```typescript
// 1. Add viewport in headless mode
use: {
  viewport: { width: 1600, height: 900 },
}

// 2. Disable GPU acceleration
launchOptions: {
  args: ['--disable-gpu', '--disable-dev-shm-usage']
}

// 3. Take screenshots to compare
await page.screenshot({ path: 'headless.png' });

// 4. Check for timing issues
// Headless is often faster
await page.waitForLoadState('networkidle');
```

### Issue: Browser Path Not Found

**Error**:
```
Error: Could not find browser executable
```

**Solution**:
```bash
# 1. Set custom Chrome path (macOS)
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 2. Set custom Chrome path (Linux)
export CHROME_PATH="/usr/bin/google-chrome"

# 3. Set custom Chrome path (Windows)
set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"

# 4. Add to .env file
CHROME_PATH=/path/to/chrome

# 5. Verify path
ls -la "$CHROME_PATH"
```

---

## Network Problems

### Issue: Request Timeouts

**Error**:
```
net::ERR_CONNECTION_TIMED_OUT
```

**Solution**:
```bash
# 1. Check network connectivity
ping your-site.com
curl -I https://your-site.com

# 2. Check VPN/proxy
# Disable VPN temporarily
# Check proxy settings

# 3. Increase network timeout
# playwright.config.ts
use: {
  navigationTimeout: 90000
}

# 4. Check firewall
sudo ufw status  # Linux
# Add exception if needed

# 5. Test from different network
# Try mobile hotspot or different WiFi
```

### Issue: SSL/TLS Errors

**Error**:
```
net::ERR_CERT_AUTHORITY_INVALID
```

**Solution**:
```typescript
// 1. Ignore HTTPS errors (non-production only)
use: {
  ignoreHTTPSErrors: true
}

// 2. Add custom CA certificate
process.env.NODE_EXTRA_CA_CERTS = '/path/to/ca-cert.pem';

// 3. Check certificate expiry
// openssl s_client -connect your-site.com:443 | openssl x509 -noout -dates
```

### Issue: API Calls Failing

**Error**:
```
API request failed with status 500
```

**Solution**:
```typescript
// 1. Add retry logic
async function apiCallWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await page.request.get(url);
      if (response.ok()) return response;
    } catch (e) {
      if (i === retries - 1) throw e;
      await page.waitForTimeout(1000 * (i + 1));
    }
  }
}

// 2. Check API response
const response = await page.request.get('/api/data');
console.log('Status:', response.status());
console.log('Body:', await response.text());

// 3. Verify API endpoint
curl -X GET https://your-site.com/api/data

// 4. Check CORS issues
// View browser console for CORS errors
```

---

## Reporting Issues

### Issue: HTML Report Not Generated

**Solution**:
```bash
# 1. Verify reporter configuration
grep "reporter" playwright.config.ts

# 2. Check output directory
ls -la reports/html-report/

# 3. Generate report manually
npx playwright show-report

# 4. Force regenerate
rm -rf reports/html-report/
npm test
npx playwright show-report
```

### Issue: Screenshots Not Captured

**Solution**:
```typescript
// 1. Enable screenshots
use: {
  screenshot: 'on',  // or 'only-on-failure'
}

// 2. Manual screenshot
await page.screenshot({ 
  path: 'screenshot.png',
  fullPage: true 
});

// 3. Check permissions
chmod 755 test-results/
```

---

## Debug Techniques

### 1. Using Playwright Inspector

```bash
# Open inspector
npm test -- --debug

# Debug specific test
npm test -- --debug tests/login.spec.ts

# Debug from specific line
npm test -- --debug tests/login.spec.ts:25
```

### 2. Using Console Logs

```typescript
test('debug with logs', async ({ page }) => {
  console.log('Starting test');
  
  await page.goto('/');
  console.log('Page loaded:', await page.title());
  
  const elements = await page.locator('.item').count();
  console.log('Found elements:', elements);
});
```

### 3. Using pause()

```typescript
test('debug with pause', async ({ page }) => {
  await page.goto('/');
  
  await page.pause();  // Pauses execution, opens inspector
  
  await page.click('.submit');
});
```

### 4. Visual Debugging

```typescript
// Highlight elements
await page.locator('.element').highlight();

// Slow motion
const browser = await chromium.launch({
  slowMo: 1000  // 1 second delay between actions
});
```

### 5. Network Debugging

```typescript
// Log all network requests
page.on('request', request => {
  console.log('Request:', request.url());
});

page.on('response', response => {
  console.log('Response:', response.url(), response.status());
});

// Log failed requests
page.on('requestfailed', request => {
  console.log('Failed:', request.url(), request.failure());
});
```

---

## FAQ

### Q: How do I run tests in different environments?

**A**:
```bash
NODE_ENV=auto_aws_bronze npm test
# or
export NODE_ENV=auto_silver
npm test
```

### Q: How do I skip specific tests?

**A**:
```typescript
test.skip('skip this test', async ({ page }) => {
  // Won't run
});

test('conditional skip', async ({ page }) => {
  test.skip(process.platform === 'win32', 'Not for Windows');
  // Test logic
});
```

### Q: How do I run tests in sequence (not parallel)?

**A**:
```typescript
test.describe.configure({ mode: 'serial' });

test.describe('Sequential Tests', () => {
  // Tests run one after another
});
```

### Q: How do I access test metadata in hooks?

**A**:
```typescript
test.afterEach(async ({ page }, testInfo) => {
  console.log('Test:', testInfo.title);
  console.log('Status:', testInfo.status);
  console.log('Duration:', testInfo.duration);
  
  if (testInfo.status !== 'passed') {
    await page.screenshot({ 
      path: `failures/${testInfo.title}.png` 
    });
  }
});
```

### Q: How do I test with different user roles?

**A**:
```typescript
const roles = ['admin', 'teacher', 'student'];

for (const role of roles) {
  test(`should work as ${role}`, async ({ page }) => {
    const user = HoonuitUsers.getUserByRole(role);
    await HoonuitHelper.loginToHoonuitAdministrator(page, user);
    // Test logic
  });
}
```

### Q: How do I clear browser cache between tests?

**A**:
```typescript
test.afterEach(async ({ context }) => {
  await context.clearCookies();
  await context.clearPermissions();
});
```

---

## Getting Help

If your issue isn't covered here:

1. **Check Playwright Documentation**: https://playwright.dev
2. **Search GitHub Issues**: Look for similar problems
3. **Ask Team**: Reach out in Slack/Teams
4. **Create Issue**: Document the problem with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots/logs

### Useful Commands for Bug Reports

```bash
# System information
uname -a
node --version
npm --version
npx playwright --version

# Generate debug trace
npm test -- --trace on

# Full debug output
DEBUG=pw:api npm test

# Save console output
npm test 2>&1 | tee test-output.log
```

---

**Last Updated:** 2025-12-01
**Version:** 2.1.0
**Maintainer:** Test Automation Team