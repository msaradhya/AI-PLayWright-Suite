import { chromium, FullConfig, LaunchOptions } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigManager } from '../../config/ConfigManager';

/**
 * Global setup runs once before all tests
 * Sets up authentication state for all test sessions
 *
 * Now uses ConfigManager as the single source of truth for all configuration.
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const configManager = ConfigManager.getInstance();

  // Skip all setup if we're in dry run mode
  if (configManager.isDryRunEnabled()) {
    console.log('Dry run mode enabled, skipping global setup');
    return;
  }

  // Ensure state directory exists
  const stateDir = path.join(__dirname, '../../playwright-state');
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }

  const { storageState } = config.projects[0].use;
  
  // Get configuration from ConfigManager
  const baseUrl = configManager.getBaseUrl();
  const moduleName = configManager.getTestModule();
  
  console.log(`Using module: ${moduleName}`);
  console.log(`Environment: ${configManager.getEnvironment()}`);
  console.log(`Base URL: ${baseUrl}`);
  
  // Skip auth setup if storageState file exists (for development)
  if (storageState && fs.existsSync(storageState as string)) {
    console.log(`Using existing auth state: ${storageState}`);
    return;
  }

  console.log(`Setting up global auth state at ${storageState}`);
  
  // Get browser launch options from ConfigManager
  const browserConfig = configManager.getBrowserConfig();
  const launchOptions: LaunchOptions = {
    headless: browserConfig.headless,
    timeout: browserConfig.timeout,
    args: browserConfig.chromeArgs,
  };
  
  if (browserConfig.chromePath) {
    launchOptions.executablePath = browserConfig.chromePath;
  }
  
  // Setup authentication
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage();
  
  // Navigate to the app
  if (baseUrl) {
    await page.goto(baseUrl);
    
    // Get credentials from ConfigManager
    const credentials = configManager.getAdminCredentials();
    
    console.log(`Using admin credentials for authentication`);
    
    // Hoonuit SIS authentication flow
    try {
      // Wait for login form to be visible - Hoonuit uses fieldUsername and fieldPassword
      await page.waitForSelector('#fieldUsername', { timeout: 10000 });
      
      // Fill in credentials
      await page.fill('#fieldUsername', credentials.username);
      await page.fill('#fieldPassword', credentials.password);
      await page.click('#btnEnter');
      
      // Wait for successful login - wait for navigation or dashboard element
      await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });
      console.log('Authentication successful');
    } catch (error) {
      console.error('Authentication failed:', error);
      // Take a screenshot for debugging
      try {
        await page.screenshot({ path: path.join(stateDir, 'auth-failure.png') });
        console.log('Screenshot saved to playwright-state/auth-failure.png');
      } catch (screenshotError) {
        console.error('Failed to take screenshot:', screenshotError);
      }
    }
  }
  
  // Save signed-in state
  if (storageState) {
    await page.context().storageState({ path: storageState as string });
    console.log('Authentication state saved');
  }
  
  await browser.close();
}

export default globalSetup;