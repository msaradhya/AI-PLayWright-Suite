import { Page } from '@playwright/test';
import HoonuitBasePage from './HoonuitBasePage';

/**
 * Page object for the Infobase Learning Cloud page in Hoonuit (Playwright version)
 * Converted from Java Selenide to Playwright TypeScript.
 * Maintains exact logic and behavior from the source Java class.
 * @author aradhyas (converted from Java)
 * @since 07/07/2025
 */
export default class HoonuitInfobaseLearningCloudPage extends HoonuitBasePage {
  private static readonly COURSE_TITLE = '#course_title';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Gets the course title text (waits for it to be visible).
   * Converted from Java method: getCourseTitle()
   * @returns Promise<string> - The course title text
   */
  async getCourseTitle(): Promise<string> {
    const courseTitle = this.page.locator(HoonuitInfobaseLearningCloudPage.COURSE_TITLE);
    await courseTitle.waitFor({ state: 'visible' });
    return courseTitle.innerText();
  }

  /**
   * Returns the page title (not defined for this page).
   * Overrides abstract method from HoonuitBasePage.
   * Matches Java implementation that returns null.
   * @returns string - Empty string (equivalent to Java null)
   */
  protected pageTitle(): string {
    return '';
  }
}
