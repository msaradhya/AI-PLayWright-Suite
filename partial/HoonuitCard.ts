import { Page } from '@playwright/test';

export class HoonuitCard {
  constructor(private page: Page, private cardTitle: string) {}

  async getCardElement() {
    return this.page.locator(`.card-title`, { hasText: this.cardTitle });
  }
}
