/**
 * Table exception for MTSS (converted from Java)
 * Enhanced for Playwright test framework support
 * @author hyders
 * @since 10/08/2020
 */
import { MtssException } from './MtssException';

export class MtssTableException extends MtssException {
  public readonly tableSelector?: string;
  public readonly expectedRowCount?: number;
  public readonly actualRowCount?: number;
  public readonly columnName?: string;
  public readonly searchCriteria?: string;
  public readonly pageUrl?: string;

  constructor(message: string, cause?: Error, testContext?: string, options?: {
    tableSelector?: string;
    expectedRowCount?: number;
    actualRowCount?: number;
    columnName?: string;
    searchCriteria?: string;
    pageUrl?: string;
  }) {
    super(message, cause, testContext);
    this.name = 'MtssTableException';
    this.tableSelector = options?.tableSelector;
    this.expectedRowCount = options?.expectedRowCount;
    this.actualRowCount = options?.actualRowCount;
    this.columnName = options?.columnName;
    this.searchCriteria = options?.searchCriteria;
    this.pageUrl = options?.pageUrl;
  }

  /**
   * Create a table exception for row count mismatch
   * @param expectedCount Expected number of rows
   * @param actualCount Actual number of rows found
   * @param tableSelector Table selector
   * @param testContext Test context
   * @param pageUrl Current page URL
   */
  static forRowCountMismatch(
    expectedCount: number,
    actualCount: number,
    tableSelector?: string,
    testContext?: string,
    pageUrl?: string
  ): MtssTableException {
    const message = `Table row count mismatch: expected ${expectedCount}, found ${actualCount}`;
    return new MtssTableException(message, undefined, testContext, {
      expectedRowCount: expectedCount,
      actualRowCount: actualCount,
      tableSelector,
      pageUrl
    });
  }

  /**
   * Create a table exception for missing data
   * @param searchCriteria The data that was expected but not found
   * @param columnName The column where data was expected (optional)
   * @param tableSelector Table selector
   * @param testContext Test context
   * @param pageUrl Current page URL
   */
  static forMissingData(
    searchCriteria: string,
    columnName?: string,
    tableSelector?: string,
    testContext?: string,
    pageUrl?: string
  ): MtssTableException {
    const columnPart = columnName ? ` in column '${columnName}'` : '';
    const message = `Expected data '${searchCriteria}' not found in table${columnPart}`;
    return new MtssTableException(message, undefined, testContext, {
      searchCriteria,
      columnName,
      tableSelector,
      pageUrl
    });
  }

  /**
   * Create a table exception for column not found
   * @param columnName The column name that was not found
   * @param tableSelector Table selector
   * @param testContext Test context
   * @param pageUrl Current page URL
   */
  static forColumnNotFound(
    columnName: string,
    tableSelector?: string,
    testContext?: string,
    pageUrl?: string
  ): MtssTableException {
    const message = `Column '${columnName}' not found in table`;
    return new MtssTableException(message, undefined, testContext, {
      columnName,
      tableSelector,
      pageUrl
    });
  }

  /**
   * Create a table exception for empty table
   * @param tableSelector Table selector
   * @param testContext Test context
   * @param pageUrl Current page URL
   */
  static forEmptyTable(
    tableSelector?: string,
    testContext?: string,
    pageUrl?: string
  ): MtssTableException {
    const message = 'Table is empty when data was expected';
    return new MtssTableException(message, undefined, testContext, {
      tableSelector,
      actualRowCount: 0,
      pageUrl
    });
  }

  /**
   * Create a table exception for table not found
   * @param tableSelector Table selector that was not found
   * @param testContext Test context
   * @param pageUrl Current page URL
   */
  static forTableNotFound(
    tableSelector: string,
    testContext?: string,
    pageUrl?: string
  ): MtssTableException {
    const message = `Table not found with selector: ${tableSelector}`;
    return new MtssTableException(message, undefined, testContext, {
      tableSelector,
      pageUrl
    });
  }

  /**
   * Get detailed table error information for test reporting
   */
  getTableDetails(): {
    message: string;
    tableSelector?: string;
    expectedRowCount?: number;
    actualRowCount?: number;
    columnName?: string;
    searchCriteria?: string;
    pageUrl?: string;
    timestamp: string;
    testContext?: string;
  } {
    return {
      message: this.message,
      tableSelector: this.tableSelector,
      expectedRowCount: this.expectedRowCount,
      actualRowCount: this.actualRowCount,
      columnName: this.columnName,
      searchCriteria: this.searchCriteria,
      pageUrl: this.pageUrl,
      timestamp: this.timestamp,
      testContext: this.testContext
    };
  }

  /**
   * Get a summary of the table operation that failed
   */
  getTableOperationSummary(): string {
    const parts: string[] = [];
    
    if (this.tableSelector) parts.push(`Table: ${this.tableSelector}`);
    if (this.columnName) parts.push(`Column: ${this.columnName}`);
    if (this.searchCriteria) parts.push(`Search: ${this.searchCriteria}`);
    if (this.expectedRowCount !== undefined) parts.push(`Expected Rows: ${this.expectedRowCount}`);
    if (this.actualRowCount !== undefined) parts.push(`Actual Rows: ${this.actualRowCount}`);
    if (this.pageUrl) parts.push(`Page: ${this.pageUrl}`);
    
    return parts.join(' | ');
  }
}
