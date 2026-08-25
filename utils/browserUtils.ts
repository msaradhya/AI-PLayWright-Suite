/**
 * Browser utilities for configuring browser launch options
 *
 * Updated to use ConfigManager as the single source of truth
 */

import { LaunchOptions, BrowserContextOptions, chromium, firefox, webkit } from '@playwright/test';
import { ConfigManager } from '../config/ConfigManager';

const config = ConfigManager.getInstance();

/**
 * Get browser launch options based on configuration
 * @returns LaunchOptions for browser launch
 */
export function getBrowserLaunchOptions(): LaunchOptions {
  const browserConfig = config.getBrowserConfig();
  
  const launchOptions: LaunchOptions = {
    headless: browserConfig.headless,
    timeout: browserConfig.timeout,
  };

  if (browserConfig.browserType === 'chromium') {
    launchOptions.args = browserConfig.chromeArgs;
    
    // Set executable path for macOS and Linux
    if (process.platform === 'darwin' || process.platform === 'linux') {
      if (browserConfig.chromePath) {
        launchOptions.executablePath = browserConfig.chromePath;
      }
    }
  }

  return launchOptions;
}

/**
 * Get browser context options
 * @returns BrowserContextOptions for browser context
 */
export function getBrowserContextOptions(): BrowserContextOptions {
  const browserConfig = config.getBrowserConfig();
  
  return {
    viewport: browserConfig.viewport,
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: config.getTimezone(),
  };
}

/**
 * Launch a configured browser
 * @param browserType - Type of browser to launch (chromium, firefox, webkit)
 * @returns Browser instance
 */
export async function launchConfiguredBrowser(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium') {
  const launchOptions = getBrowserLaunchOptions();
  
  switch (browserType) {
    case 'firefox':
      return firefox.launch(launchOptions);
    case 'webkit':
      return webkit.launch(launchOptions);
    case 'chromium':
    default:
      return chromium.launch(launchOptions);
  }
}