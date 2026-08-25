import { Page, Locator } from '@playwright/test';
import HoonuitBaseTable from '../../base/table/HoonuitBaseTable';
import { HoonuitException } from '../../../exceptions/HoonuitException';
import { HoonuitTableException } from '../../../exceptions/HoonuitTableException';

/**
 * View File Details Table implementation for Hoonuit dashboards
 * Specialized table for viewing detailed file information
 * @author aradhyas
 * @since 18/05/2025
 */
export class HoonuitViewFileDetailsTable extends HoonuitBaseTable {
  protected readonly tableTitle: string;

  // Selectors
  private readonly tableBodySelector = 'div.ag-body-viewport';
  private readonly tableHeaderSelector = 'div.ag-header';
  private readonly headerCellsSelector = 'div.ag-header-cell:not([col-id="checkbox"])';
  private readonly rowsSelector = 'div[role="rowgroup"] > div[role="row"]:not(.ag-header-row)';
  private readonly cellSelector = 'div.ag-cell';

  /**
   * Constructor
   * @param page - Playwright Page object
   * @param title - Table title
   */
  constructor(page: Page, title: string) {
    super(page, title);
    this.tableTitle = title.trim();
  }

  /**
   * Implementation of abstract getRows method
   */
  protected async getRows(): Promise<Locator> {
    const tableBody = this.tableElement.locator(this.tableBodySelector);
    return tableBody.locator(this.rowsSelector);
  }

  /**
   * Implementation of abstract getHeaders method
   */
  protected async getHeaders(): Promise<Locator> {
    const headerRow = this.tableElement.locator(this.tableHeaderSelector);
    return headerRow.locator(this.headerCellsSelector);
  }

  /**
   * Get table data as array of objects with file details
   */
  public async getTableData(): Promise<Array<{[key: string]: string}>> {
    const data: Array<{[key: string]: string}> = [];
    const headers = await this.getHeaders();
    const rows = await this.getRows();
    
    const headerCount = await headers.count();
    const rowCount = await rows.count();
    
    // Get header texts
    const headerTexts: string[] = [];
    for (let i = 0; i < headerCount; i++) {
      const headerText = await headers.nth(i).innerText();
      headerTexts.push(headerText.trim());
    }
    
    // Get row data
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const rowData: {[key: string]: string} = {};
      const row = rows.nth(rowIndex);
      const cells = row.locator(this.cellSelector);
      
      for (let colIndex = 0; colIndex < headerTexts.length; colIndex++) {
        const cellValue = await cells.nth(colIndex).innerText();
        rowData[headerTexts[colIndex]] = cellValue.trim();
      }
      
      data.push(rowData);
    }
    
    return data;
  }

  /**
   * Get file details by file name
   * @param fileName - Name of the file to get details for
   */
  public async getFileDetails(fileName: string): Promise<{[key: string]: string} | null> {
    const tableData = await this.getTableData();
    
    // Assuming there's a filename column - adjust column name as needed
    const fileRecord = tableData.find(record => 
      Object.values(record).some(value => value.includes(fileName))
    );
    
    return fileRecord || null;
  }

  /**
   * Click on file row by file name
   * @param fileName - Name of the file to click
   */
  public async clickOnFile(fileName: string): Promise<void> {
    const rows = await this.getRows();
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.innerText();
      
      if (rowText.includes(fileName)) {
        await row.click();
        return;
      }
    }
    
    throw new HoonuitException(`File '${fileName}' not found in table`);
  }

  /**
   * Get cell value by row and column name
   * @param fileName - File name to identify the row
   * @param columnName - Column name to get value from
   */
  public async getCellValue(fileName: string, columnName: string): Promise<string> {
    const fileDetails = await this.getFileDetails(fileName);
    
    if (!fileDetails) {
      throw new HoonuitTableException(`File '${fileName}' not found in table`);
    }
    
    if (!(columnName in fileDetails)) {
      throw new HoonuitTableException(`Column '${columnName}' not found in table`);
    }
    
    return fileDetails[columnName];
  }

  /**
   * Check if file exists in table
   * @param fileName - Name of the file to check
   */
  public async isFileExists(fileName: string): Promise<boolean> {
    try {
      const fileDetails = await this.getFileDetails(fileName);
      return fileDetails !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all file names from the table
   */
  public async getAllFileNames(): Promise<string[]> {
    const tableData = await this.getTableData();
    const fileNames: string[] = [];
    
    // Assuming the first column or a column containing file names
    // Adjust logic based on actual table structure
    for (const record of tableData) {
      const fileName = Object.values(record)[0]; // First column value
      if (fileName) {
        fileNames.push(fileName);
      }
    }
    
    return fileNames;
  }

  /**
   * Sort table by column
   * @param columnName - Column to sort by
   * @param ascending - Sort direction (true for ascending, false for descending)
   */
  public async sortByColumn(columnName: string, ascending: boolean = true): Promise<void> {
    const headers = await this.getHeaders();
    const headerCount = await headers.count();
    
    for (let i = 0; i < headerCount; i++) {
      const header = headers.nth(i);
      const headerText = await header.innerText();
      
      if (headerText.trim().toLowerCase() === columnName.toLowerCase()) {
        await header.click();
        
        // Check current sort direction and click again if needed
        const sortIcon = header.locator('.ag-icon');
        if (await sortIcon.count() > 0) {
          const sortClass = await sortIcon.getAttribute('class');
          const isCurrentlyAscending = sortClass?.includes('ag-icon-asc');
          
          if ((ascending && !isCurrentlyAscending) || (!ascending && isCurrentlyAscending)) {
            await header.click();
          }
        }
        
        return;
      }
    }
    
    throw new HoonuitTableException(`Column '${columnName}' not found for sorting`);
  }

  /**
   * Filter table by column value
   * @param columnName - Column to filter by
   * @param filterValue - Value to filter for
   */
  public async filterByValue(columnName: string, filterValue: string): Promise<void> {
    await this.headerFilters(columnName, 'equals', filterValue);
  }
}
