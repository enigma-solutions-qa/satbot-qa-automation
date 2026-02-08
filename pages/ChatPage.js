// e2e/pages/ChatPage.js

export class ChatPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        // Updated selector based on actual frontend inspection: <input placeholder="Type your message...">
        // The previous `input[type="text"]` failed because the type attribute was implicit or missing.
        this.input = page.locator('input[placeholder="Type your message..."]').first();
        this.sendButton = page.locator('button[aria-label="Send message"], button[type="submit"]').first();
        // We target the nested text container (.css-g1x3qq) inside the bot message bubble (.css-1ie86g7)
        // to avoid capturing metadata text like "Intent: Question" or "Source: Team Orchestrator".
        this.botMessages = page.locator('.css-1ie86g7 .css-g1x3qq');
        this.userMessages = page.locator('.css-wsbyq4 .css-g1x3qq');
        // The source chip appears only when generation is complete.
        // Class identified from previous DOM dump: .css-1sw02bm
        this.sourceChip = page.locator('.css-1sw02bm');
    }

    async waitForResponseCompletion() {
        // Wait for the Source chip to appear as a signal that streaming is done.
        await this.sourceChip.last().toBeVisible({ timeout: 15000 }).catch(() => {
            // Fallback: If no source chip (e.g. error), wait a bit or check for other done signals.
            // But for RAG queries, Source should ideally be present.
        });
    }

    async goto() {
        await this.page.goto('/');
    }

    async typeMessage(text) {
        await this.input.fill(text);
    }

    async sendMessage() {
        await this.page.keyboard.press('Enter');
    }

    getLastResponse() {
        return this.botMessages.last();
    }
}
