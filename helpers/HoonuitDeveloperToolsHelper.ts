import { Page, Frame } from '@playwright/test';

/**
 * Helper for Hoonuit developer tools
 * Provides navigation and interaction with developer tools interface
 * 
 * @author MSA Team
 * @since 2025-11-28
 */
export class HoonuitDeveloperToolsHelper {
    // Frame and navigation selectors
    private static readonly NAVIGATION_PANEL = '#NavigationListingPane';
    private static readonly MAIN_MENU = 'div[id^="ch_MainNavTree"] > div[id^=MainNavTree]';
    private static readonly EXPAND_IMAGE = 'img.expColImg';
    private static readonly MENU_IMAGE = 'img.iconImg';
    private static readonly SUB_MAIN_MENU = 'div[id^="ch_MainNavTree"] > div[id^=MainNavTree]';
    private static readonly FIRST_LICENSE_IFRAME = 'iframe#portalHeader.contentframe';
    private static readonly SECOND_LICENSE_IFRAME = 'frame#contentViewer.panelFrame';
    private static readonly THIRD_LICENSE_IFRAME = 'iframe#contentFrame';
    private static readonly SIZE_DROPDOWN = '#frmEditObject\\:mnuPageSize';
    private static readonly SQL_TEXT_BOX = '.showSQLBox';
    private static readonly CUSTOM_PLUS_BUTTON_IMAGE = '#ip_MainNavTree54';
    private static readonly CUSTOM_STUDENT_FILTER = '#cstl_MainNavTree4494';
    private static readonly CUSTOM_SCHOOL_FILTER = '#cstl_MainNavTree4493';
    private static readonly CUSTOM_CLASSROOM_FILTER = '#cstl_MainNavTree4536';
    private static readonly CUSTOM_FILTER = '#ip_MainNavTree2478';
    private static readonly STUDENT_VIEW_FILTER = '#cstl_MainNavTree4510';

    private static value: string;

    /**
     * Click a submenu image in the navigation tree
     * @param page The Playwright page
     * @param mainMenu Main menu text
     * @param subMenus Array of submenu texts to navigate through
     */
    static async clickSubMenuImage(page: Page, mainMenu: string, ...subMenus: string[]): Promise<void> {
        await this.inNavigationTreeFrame(page, async (frame) => {
            const panel = frame.locator(this.NAVIGATION_PANEL);
            await panel.waitFor({ state: 'visible' });

            const menuItems = frame.locator(this.MAIN_MENU);
            const menu = await this.findElementByText(menuItems, mainMenu);
            if (!menu) throw new Error(`Main menu "${mainMenu}" not found`);

            const expandImage = menu.locator(this.EXPAND_IMAGE);
            if (!await this.isExpanded(expandImage)) {
                await expandImage.click();
            }

            const menuId = await menu.getAttribute('id') || '';

            let currentId = menuId;
            for (let i = 0; i < subMenus.length - 1; i++) {
                const subMenuLocator = frame.locator(`div[id='ch_${currentId}'] > div[id^=MainNavTree]`);
                const subMenuElement = await this.findElementByText(subMenuLocator, subMenus[i]);
                if (!subMenuElement) throw new Error(`Submenu "${subMenus[i]}" not found`);

                const subExpandImage = subMenuElement.locator(this.EXPAND_IMAGE);
                if (!await this.isExpanded(subExpandImage)) {
                    await subExpandImage.click();
                    await page.waitForTimeout(500);
                }

                currentId = await subMenuElement.getAttribute('id') || '';
            }

            const lastSubMenuLocator = frame.locator(`div[id='ch_${currentId}'] > div[id^=MainNavTree]`);
            const lastSubMenu = await this.findElementByText(lastSubMenuLocator, subMenus[subMenus.length - 1]);
            if (!lastSubMenu) throw new Error(`Submenu "${subMenus[subMenus.length - 1]}" not found`);

            await lastSubMenu.locator(this.MENU_IMAGE).click();
        });
    }

    /**
     * Click the student plan edit button
     * @param page The Playwright page
     */
    static async clickStudentPlanEditButton(page: Page): Promise<void> {
        await this.inFolderListFrame(page, async (frame) => {
            await frame.locator("a[title*='Edit Student Plans Application properties of Student Plans.']").click();
        });
    }

    /**
     * Check if a menu image exists
     * @param page The Playwright page
     * @param mainMenu Main menu text
     * @returns Whether the menu image exists
     */
    static async isMenuImage(page: Page, mainMenu: string): Promise<boolean> {
        let found = false;
        await this.inNavigationTreeFrame(page, async (frame) => {
            const panel = frame.locator(this.NAVIGATION_PANEL);
            await panel.waitFor({ state: 'visible' });

            const menuItems = frame.locator(this.MAIN_MENU);
            const menu = await this.findElementByText(menuItems, mainMenu);
            found = !!menu;
        });
        return found;
    }

    /**
     * Check if a submenu image is displayed
     * @param page The Playwright page
     * @param mainMenu Main menu text
     * @param subMenu Submenu text
     * @returns Whether the submenu image is displayed
     */
    static async isSubMenuImageDisplayed(page: Page, mainMenu: string, subMenu: string): Promise<boolean> {
        let found = false;
        await this.inNavigationTreeFrame(page, async (frame) => {
            const panel = frame.locator(this.NAVIGATION_PANEL);
            await panel.waitFor({ state: 'visible' });

            const menuItems = frame.locator(this.MAIN_MENU);
            const menu = await this.findElementByText(menuItems, mainMenu);
            if (!menu) return;

            const expandImage = menu.locator(this.EXPAND_IMAGE);
            if (!await this.isExpanded(expandImage)) {
                await expandImage.click();
                await page.waitForTimeout(500);
            }

            found = await frame.locator(`div[title*='Name: ${subMenu}']`).isVisible();
        });
        return found;
    }

    /**
     * Click and open a submenu
     * @param page The Playwright page
     * @param mainMenu Main menu text
     * @param subMenu Submenu text
     * @param option Option to select
     */
    static async clickAndOpenSubMenu(page: Page, mainMenu: string, subMenu: string, option: string): Promise<void> {
        await this.inNavigationTreeFrame(page, async (frame) => {
            const panel = frame.locator(this.NAVIGATION_PANEL);
            await panel.waitFor({ state: 'visible' });
            
            const menuItems = frame.locator(this.MAIN_MENU);
            const menu = await this.findElementByText(menuItems, mainMenu);
            if (!menu) throw new Error(`Main menu "${mainMenu}" not found`);
            
            const subMenuItems = frame.locator(this.SUB_MAIN_MENU);
            const subMenuItem = await this.findElementByText(subMenuItems, subMenu);
            if (!subMenuItem) throw new Error(`Submenu "${subMenu}" not found`);
            
            const expandImage = menu.locator(this.EXPAND_IMAGE);
            if (!await this.isExpanded(expandImage)) {
                await expandImage.click();
                await page.waitForTimeout(500); // Wait for animation
            }
            
            const subExpandImage = subMenuItem.locator(this.EXPAND_IMAGE);
            if (!await this.isExpanded(subExpandImage)) {
                const menuIdAttr = await menu.getAttribute('id');
                await frame.locator(`div[id='ch_${menuIdAttr}'] > div[id*=MainNavTree]`).getByText(subMenu).locator('.expColImg').click();
            }
            
            await frame.locator(`a[id*='ac_MainNavTree']`).getByText(option).click();
        });
    }

    /**
     * Click custom filters button
     * @param page The Playwright page
     */
    static async clickCustomFilters(page: Page): Promise<void> {
        await this.inNavigationTreeFrame(page, async (frame) => {
            await this.clickCustomPlusImage(frame);
            await frame.locator(this.CUSTOM_FILTER).click();
        });
    }

    /**
     * Click custom classroom filters button
     * @param frame The Playwright frame
     */
    static async clickCustomClassroomFilters(frame: Frame): Promise<void> {
        await frame.locator(this.CUSTOM_CLASSROOM_FILTER).click();
    }

    /**
     * Click custom school filters button
     * @param frame The Playwright frame
     */
    static async clickCustomSchoolFilters(frame: Frame): Promise<void> {
        await frame.locator(this.CUSTOM_SCHOOL_FILTER).click();
    }

    /**
     * Click custom student filters button
     * @param frame The Playwright frame
     */
    static async clickCustomStudentFilters(frame: Frame): Promise<void> {
        await frame.locator(this.CUSTOM_STUDENT_FILTER).click();
    }

    /**
     * Click custom student view button
     * @param frame The Playwright frame
     */
    static async clickCustomStudentView(frame: Frame): Promise<void> {
        await frame.locator(this.STUDENT_VIEW_FILTER).click();
    }

    /**
     * Click custom plus image button
     * @param frame The Playwright frame
     */
    static async clickCustomPlusImage(frame: Frame): Promise<void> {
        await frame.locator(this.CUSTOM_PLUS_BUTTON_IMAGE).click();
    }

    /**
     * Get SQL where condition value
     * @param frame The Playwright frame
     * @returns SQL where condition text
     */
    static async getSqlWhereConditionValue(frame: Frame): Promise<string> {
        const sqlBoxes = frame.locator(this.SQL_TEXT_BOX).filter({ hasText: /.+/ });
        return await sqlBoxes.first().textContent() || '';
    }

    /**
     * Get classroom SQL value
     * @param page The Playwright page
     * @returns Classroom SQL value
     */
    static async getClassRoomSqlValue(page: Page): Promise<string> {
        await page.context().pages()[0].bringToFront();

        await this.inNavigationTreeFrame(page, async (frame) => {
            await this.clickCustomClassroomFilters(frame);
        });

        // Wait for the innermost frame to be attached
        const dataIFrame = await page.waitForSelector('iframe[name="dataIFrame"]');
        const contentViewer = await (await dataIFrame.contentFrame())?.waitForSelector('frame[name="contentViewer"]');
        const contentFrame = await (await contentViewer?.contentFrame())?.waitForSelector('iframe[name="contentFrame"]');
        const innerFrame = await contentFrame?.contentFrame();

        if (!innerFrame) throw new Error('Could not resolve inner content frame');
        return await this.getSqlWhereConditionValue(innerFrame);
    }

    /**
     * Get school SQL value
     * @param page The Playwright page
     * @returns School SQL value
     */
    static async getSchoolSqlValue(page: Page): Promise<string> {
        await page.context().pages()[0].bringToFront();

        await this.inNavigationTreeFrame(page, async (frame) => {
            await this.clickCustomSchoolFilters(frame);
        });

        const dataIFrame = await page.waitForSelector('iframe[name="dataIFrame"]');
        const contentViewer = await (await dataIFrame.contentFrame())?.waitForSelector('frame[name="contentViewer"]');
        const contentFrame = await (await contentViewer?.contentFrame())?.waitForSelector('iframe[name="contentFrame"]');
        const innerFrame = await contentFrame?.contentFrame();

        if (!innerFrame) throw new Error('Could not resolve inner content frame');
        return await this.getSqlWhereConditionValue(innerFrame);
    }

    /**
     * Get student SQL value
     * @param page The Playwright page
     * @returns Student SQL value
     */
    static async getStudentSqlValue(page: Page): Promise<string> {
        await page.context().pages()[0].bringToFront();

        await this.inNavigationTreeFrame(page, async (frame) => {
            await this.clickCustomStudentFilters(frame);
        });

        const dataIFrame = await page.waitForSelector('iframe[name="dataIFrame"]');
        const contentViewer = await (await dataIFrame.contentFrame())?.waitForSelector('frame[name="contentViewer"]');
        const contentFrame = await (await contentViewer?.contentFrame())?.waitForSelector('iframe[name="contentFrame"]');
        const innerFrame = await contentFrame?.contentFrame();

        if (!innerFrame) throw new Error('Could not resolve inner content frame');
        return await this.getSqlWhereConditionValue(innerFrame);
    }

    /**
     * Get student view SQL value
     * @param page The Playwright page
     * @returns Student view SQL value
     */
    static async getStudentViewSqlValue(page: Page): Promise<string> {
        await page.context().pages()[0].bringToFront();

        await this.inNavigationTreeFrame(page, async (frame) => {
            await this.clickCustomStudentView(frame);
        });

        const dataIFrame = await page.waitForSelector('iframe[name="dataIFrame"]');
        const contentViewer = await (await dataIFrame.contentFrame())?.waitForSelector('frame[name="contentViewer"]');
        const contentFrame = await (await contentViewer?.contentFrame())?.waitForSelector('iframe[name="contentFrame"]');
        const innerFrame = await contentFrame?.contentFrame();

        if (!innerFrame) throw new Error('Could not resolve inner content frame');
        return await this.getSqlWhereConditionValue(innerFrame);
    }

    /**
     * Get content sanitization service page content
     * @param page The Playwright page
     * @param option Option to select
     * @returns Map of properties and values
     */
    static async getContentSanitizationServicePageContent(page: Page, option: string): Promise<Record<string, string>> {
        const map: Record<string, string> = {};
        
        const propRows = page.locator(`tbody[id*='propitemgrid_${option}']`).locator('td.PropValueColumn');
        const count = await propRows.count();
        
        for (let i = 0; i < count; i++) {
            const key = (await page.locator(`tbody[id*='propitemgrid_${option}']`).locator('td.EditPropertyColLabel').nth(i).textContent() || '').replace(':', '');
            const value = await page.locator(`tbody[id*='propitemgrid_${option}']`).locator('td.PropValueColumn').nth(i).textContent() || '';
            map[key] = value;
        }
        
        return map;
    }

    /**
     * Get content sanitization service page status
     * @param page The Playwright page
     * @returns Status value
     */
    static async getContentSanitizationServicePageStatus(page: Page): Promise<boolean> {
        await page.context().pages()[0].bringToFront();
        
        const frame1 = page.frameLocator(this.FIRST_LICENSE_IFRAME);
        const frame2 = frame1.frameLocator(this.SECOND_LICENSE_IFRAME);
        const frame3 = frame2.frameLocator(this.THIRD_LICENSE_IFRAME);
        
        const status = await frame3.locator("tbody[id*='propitemgrid_service_setting']").locator('td.PropValueColumn').textContent() || '';
        return status.toLowerCase() === 'true';
    }

    /**
     * Execute action within the navigation tree frame
     * @param page The Playwright page
     * @param action Function to execute inside the frame
     */
    static async inNavigationTreeFrame(page: Page, action: (frame: Frame) => Promise<void>): Promise<void> {
        await this.inFolderListFrame(page, async (frame) => {
            const navTreeFrameHandle = await frame.waitForSelector('#NavTreeFrame');
            const navFrame = await navTreeFrameHandle.contentFrame();
            if (!navFrame) throw new Error('Navigation tree frame not found');
            await action(navFrame);
        });
    }

    /**
     * Execute action within the folder list frame
     * @param page The Playwright page
     * @param action Function to execute inside the frame
     */
    static async inFolderListFrame(page: Page, action: (frame: Frame) => Promise<void>): Promise<void> {
        const portalHeaderHandle = await page.waitForSelector('#portalHeader');
        const portalContent = await portalHeaderHandle.contentFrame();
        if (!portalContent) throw new Error('Portal header frame not found');

        const folderListHandle = await portalContent.waitForSelector('#folderList');
        const folderContent = await folderListHandle.contentFrame();
        if (!folderContent) throw new Error('Folder list frame not found');

        await action(folderContent);
    }

    // Helper methods

    /**
     * Check if an element is expanded
     * @param locator Element locator
     * @returns Whether the element is expanded
     */
    private static async isExpanded(locator: any): Promise<boolean> {
        const src = await locator.getAttribute('src');
        return src?.includes('minus') || false;
    }

    /**
     * Find an element by its text content
     * @param locator Parent locator
     * @param text Text to search for
     * @returns The element if found
     */
    private static async findElementByText(locator: any, text: string): Promise<any> {
        const count = await locator.count();
        for (let i = 0; i < count; i++) {
            const element = locator.nth(i);
            const content = await element.textContent();
            if (content?.includes(text)) {
                return element;
            }
        }
        return null;
    }

    /**
     * Expand menu and launch user impersonation (from Java: expandMenuAndLaunchUser)
     */
    static async expandMenuAndLaunchUser(page: Page, mainMenu: string, subMenu: string, secondSubMenu: string, option: string, name: string): Promise<void> {
        await this.inNavigationTreeFrame(page, async (frame) => {
            const panel = frame.locator(this.NAVIGATION_PANEL);
            await panel.waitFor({ state: 'visible' });

            const menuItems = frame.locator(this.MAIN_MENU);
            const menu = await this.findElementByText(menuItems, mainMenu);
            if (!menu) throw new Error(`Main menu "${mainMenu}" not found`);

            const subMenuItems = frame.locator(this.SUB_MAIN_MENU);
            const subMenuItem = await this.findElementByText(subMenuItems, subMenu);
            if (!subMenuItem) throw new Error(`Submenu "${subMenu}" not found`);

            const secondSubMenuItem = await this.findElementByText(subMenuItems, secondSubMenu);
            if (!secondSubMenuItem) throw new Error(`Second submenu "${secondSubMenu}" not found`);

            const expandImage = menu.locator(this.EXPAND_IMAGE);
            if (!await this.isExpanded(expandImage)) {
                await expandImage.click();
                await page.waitForTimeout(500);
            }

            const subExpandImage = subMenuItem.locator(this.EXPAND_IMAGE);
            if (!await this.isExpanded(subExpandImage)) {
                await subExpandImage.click();
                await page.waitForTimeout(500);
            }

            const secondExpandImage = secondSubMenuItem.locator(this.EXPAND_IMAGE);
            if (!await this.isExpanded(secondExpandImage)) {
                await secondExpandImage.click();
                await page.waitForTimeout(500);
            }

            await frame.locator(`a[id*='ac_MainNavTree']`).getByText(option).click();

            // Switch to nested frames
            const frame1 = page.frameLocator(this.FIRST_LICENSE_IFRAME);
            const frame2 = frame1.frameLocator(this.SECOND_LICENSE_IFRAME);
            const frame3 = frame2.frameLocator(this.THIRD_LICENSE_IFRAME);
            const userFrame = frame3.frameLocator('iframe');

            await userFrame.locator(this.SIZE_DROPDOWN).selectOption({ value: '200' });
            await page.waitForTimeout(500);

            await userFrame.locator(`a[id*='linkUserImpersonate'][title="Impersonate: ${name}"]`).first().click();
        });
    }

    /**
     * Check if dev tool landing page is displayed (from Java: devToolLandingPage)
     */
    static async devToolLandingPage(page: Page): Promise<boolean> {
        const frame1 = page.frameLocator(this.FIRST_LICENSE_IFRAME);
        const frame2 = frame1.frameLocator(this.SECOND_LICENSE_IFRAME);
        const frame3 = frame2.frameLocator(this.THIRD_LICENSE_IFRAME);
        return await frame3.locator('div.VersionInfo').isVisible();
    }
}