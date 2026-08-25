import { Page, Locator } from '@playwright/test';

/**
 * HoonuitCard class for interacting with card components
 * @author aradhyas (converted from Java)
 * @since 22/05/2025
 */
export class HoonuitCard {
  private readonly page: Page;
  private readonly cardTitle: string;

  // Selectors - matching Java constants exactly
  private static readonly CARD_TOOLS_BUTTON = 'button.pds-button-square';
  private static readonly CARD_TOOLS_DROPDOWN_MENU_OPTIONS = 'div.dropdownMode div.dropdown-menu button.dropdown-item';
  private static readonly CARD_LABEL = 'div.customHtmlContainer, .card-body div.ng-star-inserted';
  private static readonly ATTENDANCE_CARD_LABEL = '.h1.isDrillable';
  private static readonly CARD_DESCRIPTION = '.card-body p.ng-star-inserted,.card-body div.ng-star-inserted, div[class="ng-star-inserted"] p';

  /**
   * Constructor
   * @param page - Playwright Page object
   * @param title - Title of the card
   */
  constructor(page: Page, title: string) {
    this.page = page;
    this.cardTitle = title;
  }

  /**
   * Get the card title
   */
  public getTitle(): string {
    return this.cardTitle;
  }

  /**
   * Get the card element by title
   * @return Locator for the card element
   */
  get cardElement(): Locator {
    return this.getCardLocatorByTitle(this.cardTitle);
  }

  /**
   * Get the card element with $ prefix (for compatibility)
   */
  public $cardElement(): Locator {
    return this.cardElement;
  }

  /**
   * Returns the Card's value
   * @return card's value
   */
  async getValue(): Promise<string> {
    return await this.cardElement.locator(HoonuitCard.CARD_LABEL).innerText();
  }

  /**
   * Gets the absence comparison value
   * @return absence comparison value
   */
  async getAbsenceComparisonValue(): Promise<string> {
    const elements = this.cardElement.locator('.htmlRepeater.ng-star-inserted');
    await elements.first().waitFor({ state: 'visible', timeout: 5000 });
    return await elements.first().innerText();
  }

  /**
   * Return the description of the card
   * @return String Card Description
   */
  async getCardDescription(): Promise<string> {
    return await this.cardElement.locator(HoonuitCard.CARD_DESCRIPTION).innerText();
  }

  /**
   * Clicks the card label
   */
  async clickCard(): Promise<void> {
    await this.cardElement.locator(HoonuitCard.CARD_LABEL).click();
  }

  /**
   * Clicks the card label
   */
  async clickAttendanceCard(): Promise<void> {
    await this.cardElement.locator(HoonuitCard.ATTENDANCE_CARD_LABEL).click();
  }

  /**
   * Click on the card
   */
  public async click(): Promise<void> {
    await this.cardElement.click();
  }

  /**
   * Scroll the card into view
   */
  public async scrollIntoView(): Promise<void> {
    await this.cardElement.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for the card to be visible
   */
  public async waitForVisible(): Promise<void> {
    await this.cardElement.waitFor({ state: 'visible' });
  }

  /**
   * Wait for the card to be hidden
   */
  public async waitForHidden(): Promise<void> {
    await this.cardElement.waitFor({ state: 'hidden' });
  }

  /**
   * Fetch Card's background color
   * @return background color
   */
  async getBackgroundColor(): Promise<CardBackgroundColor> {
    const style = await this.cardElement.getAttribute('style');
    if (!style) {
      throw new Error('Card style attribute not found');
    }

    for (const color of Object.values(CardBackgroundColor)) {
      if (style.includes(`background-color: ${color}`)) {
        return color as CardBackgroundColor;
      }
    }
    throw new Error('Color is unknown.');
  }

  /**
   * Checks if the card is displayed
   * @return true if card is displayed, false otherwise
   */
  async isDisplayed(): Promise<boolean> {
    if (await this.isExists()) {
      return await this.cardElement.isVisible();
    } else {
      return false;
    }
  }

  /**
   * Check if the card is visible
   */
  public async isVisible(): Promise<boolean> {
    return await this.cardElement.isVisible();
  }

  /**
   * Checks if the card exists
   * @return true if card exists, false otherwise
   */
  async isExists(): Promise<boolean> {
    try {
      return await this.cardElement.count() > 0;
    } catch (ex) {
      console.trace(`Card with Title -'${this.cardTitle.toUpperCase()}' is not found`);
      return false;
    }
  }

  /**
   * Checks if the card value is displayed
   * @return true if card value is displayed, false otherwise
   */
  async isCardValueDisplayed(): Promise<boolean> {
    const cardLabel = this.cardElement.locator(HoonuitCard.CARD_LABEL);
    await cardLabel.waitFor({ state: 'visible', timeout: 30000 });
    return await cardLabel.isVisible();
  }

  /**
   * Clicks the card tools button
   */
  async clickCardToolsButton(): Promise<void> {
    await this.cardElement.locator(HoonuitCard.CARD_TOOLS_BUTTON).click();
  }

  /**
   * Selects a card tool option by text
   * @param option The option text to select
   */
  async selectCardToolOption(option: string): Promise<void> {
    // Click on Card Tools
    await this.clickCardToolsButton();
    
    // Find and click the option by text
    await this.page.locator(HoonuitCard.CARD_TOOLS_DROPDOWN_MENU_OPTIONS, { hasText: option }).click();
    
    // Wait for page to load (equivalent to HoonuitHelper.waitForPageToLoad())
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Helper method to get card locator by title
   * Equivalent to HoonuitHelper.$card(title) in Java
   * @param title The card title
   * @return Locator for the card
   */
  private getCardLocatorByTitle(title: string): Locator {
    // This should be adjusted based on actual card structure in the application
    return this.page.locator('.pds-card', {
      has: this.page.locator('.pds-card-header, .customHtmlContainer, .card-body .ng-star-inserted, .h1.isDrillable', { hasText: title })
    });
  }

}
export default HoonuitCard;

/**
 * Enum for card background colors
 */
export enum CardBackgroundColor {
  RED = 'rgb(203, 16, 16)',
  GREEN = 'rgb(82, 186, 43)',
  YELLOW = 'rgb(249, 206, 51)'
}
