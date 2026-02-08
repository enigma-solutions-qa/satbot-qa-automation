// e2e/assertions/ChatAssertions.js
import { expect } from '@playwright/test';
import { defectLogger } from '../utils/DefectLogger';
import { ChatPage } from '../pages/ChatPage';

export class ChatAssertions {
    constructor(page, testName = 'Chat Test') {
        this.page = page;
        this.chatPage = new ChatPage(page);
        this.testName = testName;
    }

    async assertResponseVisible() {
        try {
            // Using standard Expect here to trigger waiting, but catching failure
            await expect(this.chatPage.botMessages.last()).toBeVisible({ timeout: 15000 });
            await expect(this.chatPage.botMessages.last()).not.toBeEmpty();
        } catch (error) {
            const screenshot = await defectLogger.captureScreenshot(this.page, `fail_resp_vis_${this.testName}`);
            await defectLogger.log({
                testName: this.testName,
                category: 'functional',
                severity: 'high',
                stepsToReproduce: 'Send message and wait for response',
                expectedBehavior: 'AI response should be visible and non-empty',
                actualBehavior: `Response missing or empty: ${error.message}`,
                screenshotPath: screenshot
            });
            // Do NOT throw, allowing test to continue collecting defects
        }
    }

    async assertResponseContains(text) {
        try {
            const lastMsg = this.chatPage.botMessages.last();
            await expect(lastMsg).toBeVisible();
            await expect(lastMsg).toContainText(text);
        } catch (error) {
            const actualText = await this.chatPage.botMessages.last().innerText().catch(() => 'N/A');
            const screenshot = await defectLogger.captureScreenshot(this.page, `fail_resp_text_${this.testName}`);

            await defectLogger.log({
                testName: this.testName,
                category: 'functional',
                severity: 'medium',
                stepsToReproduce: `Check response for text "${text}"`,
                expectedBehavior: `Response should contain "${text}"`,
                actualBehavior: `Response contained: "${actualText}"`,
                screenshotPath: screenshot
            });
        }
    }

    async assertNoRefusal() {
        try {
            const responseText = await this.chatPage.getLastResponse().innerText();
            const refusalRegex = /I cannot|I am unable/i;
            if (refusalRegex.test(responseText)) {
                throw new Error(`Refusal detected: ${responseText}`);
            }
        } catch (error) {
            const screenshot = await defectLogger.captureScreenshot(this.page, `fail_refusal_${this.testName}`);
            await defectLogger.log({
                testName: this.testName,
                category: 'functional',
                severity: 'medium',
                stepsToReproduce: 'Check response for refusal patterns',
                expectedBehavior: 'AI should answer the question',
                actualBehavior: `AI refused: ${error.message}`,
                screenshotPath: screenshot
            });
        }
    }

    async assertGroundedRAG() {
        try {
            await this.chatPage.waitForResponseCompletion(); // Ensure stream is done
            const lastMsg = this.chatPage.botMessages.last();
            // 1. Ensure it doesn't say "No chunk provided"
            await expect(lastMsg).not.toContainText('[No chunk provided]');
        } catch (error) {
            const screenshot = await defectLogger.captureScreenshot(this.page, `fail_grounding_${this.testName}`);
            await defectLogger.log({
                testName: this.testName,
                category: 'RAG',
                severity: 'medium',
                stepsToReproduce: 'Check response for grounding failures',
                expectedBehavior: 'Response should have valid chunks',
                actualBehavior: `RAG Fallback detected: [No chunk provided] found.`,
                screenshotPath: screenshot
            });
        }
    }

    async assertUIComponentsVisible() {
        try {
            await expect(this.chatPage.input).toBeVisible();
            await expect(this.chatPage.sendButton).toBeVisible();
        } catch (error) {
            const screenshot = await defectLogger.captureScreenshot(this.page, `fail_ui_${this.testName}`);
            await defectLogger.log({
                testName: this.testName,
                category: 'UI',
                severity: 'critical',
                stepsToReproduce: 'Load application and check UI',
                expectedBehavior: 'Input and Send button should be visible',
                actualBehavior: `UI elements missing: ${error.message}`,
                screenshotPath: screenshot
            });
        }
    }
}
