import { Page, Locator } from '@playwright/test';
import HoonuitBaseTable from '../../base/table/HoonuitBaseTable';
import { HoonuitException } from '../../../exceptions/HoonuitException';
import { HoonuitTableException } from '../../../exceptions/HoonuitTableException';

/**
 * View Files Table implementation for Hoonuit dashboards
 * Specialized table for viewing and managing files
 * @author aradhyas
 * @since 18/05/2025
 */
export class HoonuitViewFilesTable extends HoonuitBaseTable {
  protected readonly tableTitle: string;

  // Selectors
  private readonly tableBodySelector = 'div.ag-body-viewport';
  private readonly tableHeaderSelector = 'div.ag-header';
  private readonly headerCellsSelector = 'div.ag-header-cell:not([col-id="checkbox"])';
  private readonly rowsSelector = 'div[role="rowgroup"] > div[role="row"]:not(.ag-header-row)';
  private readonly cellSelector = 'div.ag-cell';
  private readonly checkboxSelector = 'input[type="checkbox"]';
  private readonly actionButtonSelector = 'button[aria-label*="action"], button[title*="action"]';

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
   * Get all files from the table
   */
  public async getFiles(): Promise<Array<{[key: string]: string}>> {
    const files: Array<{[key: string]: string}> = [];
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
      const fileData: {[key: string]: string} = {};
      const row = rows.nth(rowIndex);
      const cells = row.locator(this.cellSelector);
      
      for (let colIndex = 0; colIndex < headerTexts.length; colIndex++) {
        const cellValue = await cells.nth(colIndex).innerText();
        fileData[headerTexts[colIndex]] = cellValue.trim();
      }
      
      files.push(fileData);
    }
    
    return files;
  }

  /**
   * Get file names only
   */
  public async getFileNames(): Promise<string[]> {
    const files = await this.getFiles();
    const fileNames: string[] = [];
    
    // Assuming the first column or a specific column contains file names
    // Adjust based on actual table structure
    for (const file of files) {
      const fileName = Object.values(file)[0]; // First column value
      if (fileName) {
        fileNames.push(fileName);
      }
    }
    
    return fileNames;
  }

  /**
   * Select file by name
   * @param fileName - Name of the file to select
   */
  public async selectFile(fileName: string): Promise<void> {
    const rows = await this.getRows();
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.innerText();
      
      if (rowText.includes(fileName)) {
        const checkbox = row.locator(this.checkboxSelector);
        if (await checkbox.count() > 0) {
          await checkbox.click();
          return;
        } else {
          // If no checkbox, click on the row
          await row.click();
          return;
        }
      }
    }
    
    throw new HoonuitException(`File '${fileName}' not found in table`);
  }

  /**
   * Select multiple files
   * @param fileNames - Array of file names to select
   */
  public async selectFiles(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
      await this.selectFile(fileName);
    }
  }

  /**
   * Click on file to open/view
   * @param fileName - Name of the file to click
   */
  public async clickOnFile(fileName: string): Promise<void> {
    const rows = await this.getRows();
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.innerText();
      
      if (rowText.includes(fileName)) {
        // Click on the file name cell (assuming first column)
        const cells = row.locator(this.cellSelector);
        await cells.first().click();
        return;
      }
    }
    
    throw new HoonuitException(`File '${fileName}' not found in table`);
  }

  /**
   * Delete file by name
   * @param fileName - Name of the file to delete
   */
  public async deleteFile(fileName: string): Promise<void> {
    const rows = await this.getRows();
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.innerText();
      
      if (rowText.includes(fileName)) {
        // Look for delete button in the row
        const deleteButton = row.locator('button[aria-label*="delete"], button[title*="delete"], button[aria-label*="Delete"], button[title*="Delete"]');
        
        if (await deleteButton.count() > 0) {
          await deleteButton.click();
          return;
        } else {
          throw new HoonuitException(`Delete button not found for file '${fileName}'`);
        }
      }
    }
    
    throw new HoonuitException(`File '${fileName}' not found in table`);
  }

  /**
   * Download file by name
   * @param fileName - Name of the file to download
   */
  public async downloadFile(fileName: string): Promise<void> {
    const rows = await this.getRows();
    const rowCount = await rows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.innerText();
      
      if (rowText.includes(fileName)) {
        // Look for download button in the row
        const downloadButton = row.locator('button[aria-label*="download"], button[title*="download"], button[aria-label*="Download"], button[title*="Download"]');
        
        if (await downloadButton.count() > 0) {
          await downloadButton.click();
          return;
        } else {
          throw new HoonuitException(`Download button not found for file '${fileName}'`);
        }
      }
    }
    
    throw new HoonuitException(`File '${fileName}' not found in table`);
  }

  /**
   * Get file information by file name
   * @param fileName - Name of the file to get info for
   */
  public async getFileInfo(fileName: string): Promise<{[key: string]: string} | null> {
    const files = await this.getFiles();
    
    const fileInfo = files.find(file => 
      Object.values(file).some(value => value.includes(fileName))
    );
    
    return fileInfo || null;
  }

  /**
   * Check if file exists in table
   * @param fileName - Name of the file to check
   */
  public async isFileExists(fileName: string): Promise<boolean> {
    try {
      const fileInfo = await this.getFileInfo(fileName);
      return fileInfo !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file count
   */
  public async getFileCount(): Promise<number> {
    const rows = await this.getRows();
    return await rows.count();
  }

  /**
   * Filter files by type/extension
   * @param fileType - File type or extension to filter by
   */
  public async filterByFileType(fileType: string): Promise<void> {
    // Assuming there's a file type column
    await this.headerFilters('Type', 'contains', fileType);
  }

  /**
   * Sort files by column
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
   * Search for files by name pattern
   * @param searchPattern - Pattern to search for
   */
  public async searchFiles(searchPattern: string): Promise<Array<{[key: string]: string}>> {
    const allFiles = await this.getFiles();
    
    return allFiles.filter(file => 
      Object.values(file).some(value => 
        value.toLowerCase().includes(searchPattern.toLowerCase())
      )
    );
  }

  /**
   * Select all files
   */
  public async selectAllFiles(): Promise<void> {
    // Look for select all checkbox in header
    const selectAllCheckbox = this.tableElement.locator('th input[type="checkbox"], .ag-header input[type="checkbox"]');
    
    if (await selectAllCheckbox.count() > 0) {
      await selectAllCheckbox.click();
    } else {
      // If no select all, select each file individually
      const rows = await this.getRows();
      const rowCount = await rows.count();
      
      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const checkbox = row.locator(this.checkboxSelector);
        
        if (await checkbox.count() > 0 && !(await checkbox.isChecked())) {
          await checkbox.click();
        }
      }
    }
  }

  /**
   * Clear all selections
   */
  public async clearAllSelections(): Promise<void> {
    // Look for select all checkbox in header
    const selectAllCheckbox = this.tableElement.locator('th input[type="checkbox"], .ag-header input[type="checkbox"]');
    
    if (await selectAllCheckbox.count() > 0 && await selectAllCheckbox.isChecked()) {
      await selectAllCheckbox.click();
    } else {
      // If no select all, unselect each file individually
      const rows = await this.getRows();
      const rowCount = await rows.count();
      
      for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const checkbox = row.locator(this.checkboxSelector);
        
        if (await checkbox.count() > 0 && await checkbox.isChecked()) {
          await checkbox.click();
        }
      }
    }
  }

  /**
   * Get selected files
   */
  public async getSelectedFiles(): Promise<Array<{[key: string]: string}>> {
    const selectedFiles: Array<{[key: string]: string}> = [];
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
    
    // Get selected row data
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row = rows.nth(rowIndex);
      const checkbox = row.locator(this.checkboxSelector);
      
      if (await checkbox.count() > 0 && await checkbox.isChecked()) {
        const fileData: {[key: string]: string} = {};
        const cells = row.locator(this.cellSelector);
        
        for (let colIndex = 0; colIndex < headerTexts.length; colIndex++) {
          const cellValue = await cells.nth(colIndex).innerText();
          fileData[headerTexts[colIndex]] = cellValue.trim();
        }
        
        selectedFiles.push(fileData);
      }
    }
    
    return selectedFiles;
  }
}
