import { Page } from '@playwright/test';
import { MtssBasePage } from './base/MtssBasePage';
import { MtssCard } from '../MtssCard';

/**
 * MTSS Attendance Overview Page - TypeScript/Playwright version
 * Converted from Java MtssAttendanceOverviewPage.java
 * 
 * This page provides access to attendance overview functionality including
 * currently enrolled students card and related dashboard interactions.
 * 
 * @author Ashok Garg (Converted from Java to TypeScript/Playwright)
 * @since 10/08/2020
 */
export class MtssAttendanceOverviewPage extends MtssBasePage {

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get the expected page title for validation
   * Overrides abstract method from MtssBasePage
   * @returns Expected page title string
   */
  protected pageTitle(): string {
    return 'Overview of Student Attendance';
  }

  /**
   * Get the Currently Enrolled Students card
   * Equivalent to Java method: getCurrentlyEnrolledStudentsCard()
   * 
   * @returns MtssCard instance for "# of Currently Enrolled Students" card
   */
  public getCurrentlyEnrolledStudentsCard(): MtssCard {
    return new MtssCard(this.page, '# of Currently Enrolled Students');
  }

  /**
   * Check if Currently Enrolled Students card exists on the page
   * Additional utility method for validation
   * 
   * @returns Promise<boolean> indicating if the card is visible
   */
  public async isCurrentlyEnrolledStudentsCardVisible(): Promise<boolean> {
    const card = this.getCurrentlyEnrolledStudentsCard();
    return await card.isExists();
  }

  /**
   * Click on Currently Enrolled Students card
   * Additional utility method for interaction
   * 
   * @throws Error if card is not found or not clickable
   */
  public async clickCurrentlyEnrolledStudentsCard(): Promise<void> {
    const card = this.getCurrentlyEnrolledStudentsCard();
    
    if (!(await card.isExists())) {
      throw new Error('Currently Enrolled Students card is not visible or does not exist');
    }
    
    await card.clickCard();
  }

  /**
   * Wait for page to load and verify attendance overview is displayed
   * Enhanced method combining page load wait with title validation
   * 
   * @returns Promise<boolean> indicating if page loaded successfully
   */
  public async isAttendanceOverviewDisplayed(): Promise<boolean> {
    try {
      await this.waitForPage();
      return true;
    } catch (error) {
      console.error('Failed to load Attendance Overview page:', error);
      return false;
    }
  }

  /**
   * Get all available cards on the attendance overview page
   * Additional utility method for comprehensive page validation
   * 
   * @returns Promise<string[]> array of card titles found on the page
   */
  public async getAvailableCards(): Promise<string[]> {
    const cardElements = this.page.locator('app-dashboard-object-card');
    const cardTitles: string[] = [];
    
    const count = await cardElements.count();
    for (let i = 0; i < count; i++) {
      const card = cardElements.nth(i);
      const titleElement = card.locator('div.pds-panel-header');
      
      if (await titleElement.isVisible()) {
        const title = await titleElement.textContent();
        if (title) {
          cardTitles.push(title.trim());
        }
      }
    }
    
    return cardTitles;
  }

  /**
   * Verify that the expected cards are present on the page
   * Validation method to ensure page loaded correctly with expected content
   * 
   * @param expectedCards Array of expected card titles
   * @returns Promise<boolean> indicating if all expected cards are present
   */
  public async verifyExpectedCardsPresent(expectedCards: string[]): Promise<boolean> {
    const availableCards = await this.getAvailableCards();
    
    return expectedCards.every(expectedCard => 
      availableCards.some(availableCard => 
        availableCard.toLowerCase().includes(expectedCard.toLowerCase())
      )
    );
  }
}
