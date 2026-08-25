import * as fs from 'fs';
import * as path from 'path';

/**
 * File Helper utilities for Playwright tests
 * Provides file operations similar to Java FileHelpers
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
export class FileHelpers {
  
  /**
   * Get file from project resources (equivalent to FileHelpers.getFileFromProjectOrJar in Java)
   * @param relativePath Relative path from project root
   * @returns Full path to the file
   */
  static getFileFromProjectOrJar(relativePath: string): string {
    // In Playwright/Node.js, we work with the project root directory
    return path.join(process.cwd(), relativePath);
  }

  /**
   * Compare two files for content equality
   * @param expectedFile Path to expected file
   * @param actualFile Path to actual file
   * @returns true if files match, false otherwise
   */
  static compareFiles(expectedFile: string, actualFile: string): boolean {
    try {
      const expectedPath = typeof expectedFile === 'string' ? expectedFile : expectedFile;
      const actualPath = typeof actualFile === 'string' ? actualFile : actualFile;

      if (!fs.existsSync(expectedPath) || !fs.existsSync(actualPath)) {
        console.log(`File not found - Expected: ${expectedPath}, Actual: ${actualPath}`);
        return false;
      }

      const expectedContent = fs.readFileSync(expectedPath, 'utf8');
      const actualContent = fs.readFileSync(actualPath, 'utf8');

      return expectedContent.trim() === actualContent.trim();
    } catch (error) {
      console.error(`Error comparing files: ${error}`);
      return false;
    }
  }

  /**
   * Read file content and ignore specific columns
   * Equivalent to HoonuitHelper.ignoredColumn() from Java
   * @param filePath Path to file
   * @param columnNames Array of column names to ignore
   * @returns Array of file contents with ignored columns removed
   */
  static ignoredColumn(filePath: string, columnNames: string[]): string[] {
    try {
      const filePathStr = typeof filePath === 'string' ? filePath : filePath;
      
      if (!fs.existsSync(filePathStr)) {
        console.log(`File not found: ${filePathStr}`);
        return [];
      }

      const fileContent = fs.readFileSync(filePathStr, 'utf8');
      const lines = fileContent.split('\n');
      
      if (lines.length === 0) {
        return [];
      }

      // Assume first line contains headers (tab-separated)
      const headers = lines[0].split('\t');
      const columnsToIgnore = columnNames.map(colName => 
        headers.findIndex(header => header.trim() === colName.trim())
      ).filter(index => index !== -1);

      const filteredLines = lines.map(line => {
        const columns = line.split('\t');
        return columns.filter((_, index) => !columnsToIgnore.includes(index)).join('\t');
      });

      return filteredLines.filter(line => line.trim() !== '');
    } catch (error) {
      console.error(`Error processing file ${filePath}: ${error}`);
      return [];
    }
  }

  /**
   * Check if a file exists
   * @param filePath Path to check
   * @returns true if file exists, false otherwise
   */
  static fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      console.error(`Error checking file existence: ${error}`);
      return false;
    }
  }

  /**
   * Read file content as string
   * @param filePath Path to file
   * @returns File content as string
   */
  static readFileContent(filePath: string): string {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      throw error;
    }
  }

  /**
   * Write content to a file
   * @param filePath Path to file
   * @param content Content to write
   */
  static writeFileContent(filePath: string, content: string): void {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
      console.error(`Error writing file: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a file if it exists
   * @param filePath Path to file
   * @returns true if file was deleted or didn't exist, false on error
   */
  static deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
      return false;
    }
  }

  /**
   * Get file extension
   * @param filePath Path to file
   * @returns File extension without the dot
   */
  static getFileExtension(filePath: string): string {
    return path.extname(filePath).slice(1);
  }

  /**
   * Get file name without extension
   * @param filePath Path to file
   * @returns File name without extension
   */
  static getFileNameWithoutExtension(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }
}