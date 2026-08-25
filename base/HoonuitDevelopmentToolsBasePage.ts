import { Page, Locator, Frame } from '@playwright/test';
import HoonuitBasePage from './HoonuitBasePage';

/**
 * Base class for all Hoonuit Development Tools pages
 * @author aradhyas (converted from Java by Poojitha)
 * @since 18/05/2025 (original: 19-05-2021)
 */
export default abstract class HoonuitDevelopmentToolsBasePage extends HoonuitBasePage {
  // Selectors - Following consistent naming pattern
  private static readonly PAGE_TITLE_SELECTOR = 'span.CurrentDashboard';

  /**
   * Constructor
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Override the getPageTitleText method to get title from content frame
   * Matches the Java implementation pattern: inContentFrame(String.class, () -> $(PAGE_TITLE).getText())
   */
  protected async getPageTitleText(): Promise<string> {
    return await this.inContentFrame(async () => {
      const contentFrame = this.page.frameLocator('#portalHeader')
        .frameLocator('#contentViewer')
        .frameLocator('#contentFrame');
      const titleElement = contentFrame.locator(HoonuitDevelopmentToolsBasePage.PAGE_TITLE_SELECTOR);
      return await titleElement.innerText();
    });
  }

  /**
   * Execute code within the nested content frames with return value
   * Equivalent to Java: inContentFrame(Class<T> returnType, PSFrame.FrameActionWithReturn action)
   * Navigate through nested frames: portalHeader > contentViewer > contentFrame
   * @param action - Async function to execute within the frames
   * @returns The result of the action
   */
  public async inContentFrame<T>(action: () => Promise<T>): Promise<T> {
    // This matches the Java implementation:
    // PSComponentFactory.getComponent(PSInnerFrame.class, By.id("portalHeader")).inFrame(returnType, () -> {
    //   return PSComponentFactory.getComponent(PSFrame.class, By.id("contentViewer")).inFrame(returnType, () -> {
    //     return PSComponentFactory.getComponent(PSInnerFrame.class, By.id("contentFrame")).inFrame(returnType, action);
    //   });
    // });
    
    const portalHeaderFrame = this.page.frameLocator('#portalHeader');
    const contentViewerFrame = portalHeaderFrame.frameLocator('#contentViewer');
    const contentFrame = contentViewerFrame.frameLocator('#contentFrame');
    
    try {
      // Execute the action in the frame context
      return await action();
    } finally {
      // Frame cleanup is handled automatically by Playwright
    }
  }

  /**
   * Execute code within the nested content frames without return value
   * Equivalent to Java: inContentFrame(PSFrame.FrameAction action)
   * Navigate through nested frames: portalHeader > contentViewer > contentFrame
   * @param action - Async function to execute within the frames
   */
  public async inContentFrameVoid(action: () => Promise<void>): Promise<void> {
    // This matches the Java implementation:
    // PSComponentFactory.getComponent(PSInnerFrame.class, By.id("portalHeader")).inFrame(() -> {
    //   PSComponentFactory.getComponent(PSFrame.class, By.id("contentViewer")).inFrame(() -> {
    //     PSComponentFactory.getComponent(PSInnerFrame.class, By.id("contentFrame")).inFrame(action);
    //   });
    // });
    
    const portalHeaderFrame = this.page.frameLocator('#portalHeader');
    const contentViewerFrame = portalHeaderFrame.frameLocator('#contentViewer');
    const contentFrame = contentViewerFrame.frameLocator('#contentFrame');
    
    try {
      // Execute the action in the frame context
      await action();
    } finally {
      // Frame cleanup is handled automatically by Playwright
    }
  }
}