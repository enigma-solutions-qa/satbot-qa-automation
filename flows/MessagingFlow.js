// e2e/flows/MessagingFlow.js
import { ChatPage } from '../pages/ChatPage';

export class MessagingFlow {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.chatPage = new ChatPage(page);
    }

    async sendSingleMessage(text) {
        await this.chatPage.goto();
        await this.chatPage.typeMessage(text);
        await this.chatPage.sendMessage();
    }

    async sendMultipleMessages(messages) {
        await this.chatPage.goto();
        for (const msg of messages) {
            await this.chatPage.typeMessage(msg);
            await this.chatPage.sendMessage();
            // Small wait to ensure ordering
            await this.chatPage.page.waitForTimeout(500);
        }
    }
}
