/**
 * Utils Module - Central Export
 * 
 * This file exports all utility functions and classes from the utils directory
 * for convenient importing throughout the project.
 */

// Browser utilities
export {
  getBrowserLaunchOptions,
  getBrowserContextOptions,
  launchConfiguredBrowser
} from './browserUtils';

// URL utilities
export {
  getEnvironmentUrl,
  getMainUrl,
  getMaintenanceUrl,
  getAllUrlsForEnvironment
} from './urlUtils';

// Module utilities
export {
  parseLoginCredentials,
  getModuleConfigName,
  getModuleUrl,
  getModuleMainUrl,
  getModuleCredentials,
  getModuleDistrict,
  isUsingLoginPool
} from './moduleUtils';

// Database utilities
export {
  getDbConfig,
  generateConnectionString,
  getConnectionParams,
  connectToDatabase,
  getConnectionString,
  getConnectionPool,
  getMssqlConfig,
  executeQuery,
  executeParameterizedQuery,
  executeStoredProcedure,
  closeConnection,
  closeAllConnections,
  isConnected,
  sql,
  type DbType
} from './databaseUtils';

// Reporting utilities
export {
  createJiraCycleName,
  shouldReportTest,
  calculateTestStatistics,
  prepareSlackMessage,
  getLogPath,
  extractJiraTestId,
  reportToJira,
  reportToSlack,
  saveTestResultsToFile,
  createSummaryText
} from './reportingUtils';

// Test helpers
export {
  waitForNetworkIdle,
  waitForElement,
  elementExists,
  takeScreenshot,
  safeClick,
  clearAndFill,
  assertTextContent,
  generateRandomEmail,
  generateRandomString,
  generateRandomNumber,
  parseTable,
  parseTableToObjects,
  waitForUrl,
  scrollToElement,
  getAttributeValues,
  waitForDownload,
  retryAction,
  hasCookie,
  getCookieValue,
  formatDate
} from './testHelpers';

// Wait for helpers
export {
  WaitForHelpers,
  waitForJavaScriptToFinish,
  waitForAngularToFinish,
  waitForPDSLoaderToDisappear,
  waitForProgressSpinnerToDisappear,
  waitForDOMContentLoaded,
  waitForPageToLoad,
  waitForElementVisible,
  waitForElementHidden,
  waitForNavigation,
  waitForModal,
  waitForModalToClose,
  waitForText
} from './waitForHelpers';

// Config utilities
export {
  getConfigWithEnvVars,
  getConfig
} from './config-utils';

// Base page
export { BasePage } from './base-page';

// Chart utilities
export { MtssChart } from './chart/mtss-chart';

// Database abstraction classes
export {
  OracleDatabase,
  MSSqlDatabase,
  type OracleConfig,
  type MSSqlConfig,
  type Database
} from './database/database-utils';