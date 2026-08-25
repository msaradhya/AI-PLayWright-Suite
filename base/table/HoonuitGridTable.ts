import { Page, Locator } from '@playwright/test';
import HoonuitBaseTable from './HoonuitBaseTable';

/**
 * Grid table implementation for Hoonuit
 * @author aradhyas (converted from Java)
 */
export class HoonuitGridTable extends HoonuitBaseTable {
  
  constructor(page: Page, title: string) {
    super(page, title);
  }

  /**
   * Get table rows
   */
  protected async getRows(): Promise<Locator> {
    return this.tableElement.locator('div[role="row"]:not(.ag-header-row)');
  }

  /**
   * Get table headers
   */
  protected async getHeaders(): Promise<Locator> {
    return this.tableElement.locator('div[role="columnheader"]');
  }

  /**
   * Get all rows (public method for external access)
   */
  public async rows(): Promise<Locator[]> {
    const rowsLocator = await this.getRows();
    const count = await rowsLocator.count();
    const rows: Locator[] = [];
    for (let i = 0; i < count; i++) {
      rows.push(rowsLocator.nth(i));
    }
    return rows;
  }
}