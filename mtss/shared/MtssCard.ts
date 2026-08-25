/**
 * MtssCard.ts
 * Converted from MtssCard.java for Playwright
 * Represents a UI card with a title and provides methods for interaction
 *
 * @author Converted from Java to TypeScript/Playwright
 * @since 2025 (Playwright conversion)
 */

import { Page, Locator } from '@playwright/test';
import { MtssHelper } from './helpers/MtssHelper';

export class MtssCard {
  private page: Page;
  private cardTitle: string;
  
  // CSS selector constant matching the Java version
  private static readonly CARD_LABEL = 'div.customHtmlContainer > div.h1, div.customHtmlContainer > div.isDrillable, .card-body div.ng-star-inserted';

  /**
   * Constructor for MtssCard
   * @param page Playwright Page object
   * @param title Title of the card to interact with
   */
  constructor(page: Page, title: string) {
    this.page = page;
    this.cardTitle = title;
  }

  /**
   * Returns the Locator for the card element by title
   * Uses MtssHelper.getCard() to match the Java MtssHelper.$card() functionality
   * @returns Locator for the card element
   */
  async cardElement(): Promise<Locator> {
    return await MtssHelper.getCard(this.page, this.cardTitle);
  }

  /**
   * Clicks the card label element
   * Equivalent to Java: $cardElement().$(CARD_LABEL).click(); MtssHelper.waitForPageToLoad();
   * @returns Promise<void>
   */
  async clickCard(): Promise<void> {
    const cardEl = await this.cardElement();
    await cardEl.locator(MtssCard.CARD_LABEL).click();
    await MtssHelper.waitForPageToLoad(this.page);
  }

  /**
   * Checks if the card exists on the page
   * Equivalent to Java: $cardElement().exists() with exception handling
   * @returns Promise<boolean> true if card exists, false otherwise
   */
  async isExists(): Promise<boolean> {
    try {
      const cardEl = await this.cardElement();
      return await cardEl.isVisible();
    } catch (ex) {
      console.log(`Card with Title -'${this.cardTitle.toUpperCase()}' is not found`);
      return false;
    }
  }
}
