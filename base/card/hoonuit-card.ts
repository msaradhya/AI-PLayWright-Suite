import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * HoonuitCard Page Object
 * Contains element selectors and methods for interacting with Hoonuit card components
 * 
 * @author Converted from Java Selenide
 */
export class HoonuitCard {
    private page: Page;
    private cardTitle: string;
    
    // Locators
    private readonly cardToolsButton = 'button.pds-button-square';
    private readonly cardToolsDropdownMenuOptions = 'div.dropdownMode div.dropdown-menu button.dropdown-item';
    private readonly cardLabel = 'div.customHtmlContainer, .card-body div.ng-star-inserted';
    private readonly attendanceCardLabel = '.h1.isDrillable';
    private readonly cardDescription = '.card-body p.ng-star-inserted,.card-body div.ng-star-inserted, div[class="ng-star-inserted"] p';
    
    constructor(page: Page, title: string) {
        this.page = page;
        this.cardTitle = title;
    }

    /**
     * Get the card element by title
     * @returns The card element locator
     */
    public getCardElement(): Locator {
        // Find card by title - this will need to be adapted based on actual HTML structure
        return this.page.locator(`[data-card-title="${this.cardTitle}"], .card:has-text("${this.cardTitle}")`).first();
    }

    /**
     * Returns the Card's value
     * @returns card's value
     */
    async getValue(): Promise<string> {
        const cardElement = this.getCardElement();
        return await cardElement.locator(this.cardLabel).textContent() || '';
    }

    /**
     * Get the card value from specific row
     * @returns card value
     */
    async getCardValue(): Promise<string> {
        const cardElement = this.getCardElement();
        return await cardElement.locator('div.row.justify-content-center').textContent() || '';
    }

    /**
     * Get absence comparison value
     * @returns absence comparison value
     */
    async getAbsenceComparisonValue(): Promise<string> {
        const cardElement = this.getCardElement();
        const elements = cardElement.locator('.htmlRepeater.ng-star-inserted').filter({ hasText: /.+/ });
        await elements.first().waitFor({ state: 'visible', timeout: 5000 });
        return await elements.first().textContent() || '';
    }
    
    /**
     * Return the description of the card
     * @returns Card Description
     */
    async getCardDescription(): Promise<string> {
        const cardElement = this.getCardElement();
        return await cardElement.locator(this.cardDescription).textContent() || '';
    }
    
    /**
     * Clicks the card label
     */
    async clickCard(): Promise<void> {
        const cardElement = this.getCardElement();
        await cardElement.locator(this.cardLabel).click();
        await this.page.waitForLoadState('load');
    }

    /**
     * Click comparison card
     */
    async clickComparisonCard(): Promise<void> {
        const cardElement = this.getCardElement();
        await cardElement.locator('.h1.isDrillable').click();
        await this.page.waitForLoadState('load');
    }

    /**
     * Click attendance card
     */
    async clickAttendanceCard(): Promise<void> {
        const cardElement = this.getCardElement();
        await cardElement.locator(this.attendanceCardLabel).click();
        await this.page.waitForLoadState('load');
    }
    
    /**
     * Fetch Card's background color
     * @returns background color
     */
    async getBackgroundColor(): Promise<string> {
        const cardElement = this.getCardElement();
        const style = await cardElement.getAttribute('style') || '';
        
        const colors = {
            RED: 'rgb(203, 16, 16)',
            GREEN: 'rgb(82, 186, 43)',
            YELLOW: 'rgb(249, 206, 51)'
        };
        
        for (const color of Object.values(colors)) {
            if (style.includes(`background-color: ${color}`)) {
                return color;
            }
        }
        throw new Error('Color is unknown.');
    }
    
    /**
     * Check if card is displayed
     * @returns true if card is displayed
     */
    async isDisplayed(): Promise<boolean> {
        if (await this.isExists()) {
            return await this.getCardElement().isVisible();
        }
        return false;
    }
    
    /**
     * Check if card exists
     * @returns true if card exists
     */
    async isExists(): Promise<boolean> {
        try {
            await this.getCardElement().waitFor({ state: 'attached', timeout: 1000 });
            return true;
        } catch (error) {
            console.trace(`Card with Title -'${this.cardTitle.toUpperCase()}' is not found`);
            return false;
        }
    }
    
    /**
     * Check if card value is displayed
     * @returns true if card value is displayed
     */
    async isCardValueDisplayed(): Promise<boolean> {
        const cardElement = this.getCardElement();
        await cardElement.locator(this.cardLabel).waitFor({ state: 'visible', timeout: 30000 });
        return await cardElement.locator(this.cardLabel).isVisible();
    }
    
    /**
     * Click card tools button
     */
    async clickCardToolsButton(): Promise<void> {
        const cardElement = this.getCardElement();
        await cardElement.scrollIntoViewIfNeeded();
        await cardElement.hover();
        await cardElement.locator(this.cardToolsButton).click();
    }
    
    /**
     * Select card tool option
     * @param option - The option text to select
     */
    async selectCardToolOption(option: string): Promise<void> {
        // Click on Card Tools
        await this.clickCardToolsButton();
        
        // Select the option
        await this.page.locator(this.cardToolsDropdownMenuOptions).filter({ hasText: option }).click();
        await this.page.waitForLoadState('load');
    }

    // Static method for CardBackgroundColor enum access
    static CardBackgroundColor = {
        RED: 'rgb(203, 16, 16)',
        GREEN: 'rgb(82, 186, 43)',
        YELLOW: 'rgb(249, 206, 51)'
    } as const;
}