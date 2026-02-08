// e2e/utils/defect-logger.js
import fs from 'fs';
import path from 'path';

const LOG_FILE_PATH = path.join(process.cwd(), 'test-results', 'defect-log.json');

class DefectLogger {
    constructor() {
        this.defects = [];
        this.ensureLogFile();
    }

    ensureLogFile() {
        const dir = path.dirname(LOG_FILE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Initialize file if it doesn't exist, but don't overwrite if it does
        if (!fs.existsSync(LOG_FILE_PATH)) {
            fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([], null, 2));
        }
    }

    /**
     * Log a defect to the persistent JSON file.
     * @param {object} defect - The defect object.
     * @param {string} defect.testName
     * @param {string} defect.category - functional | UI | performance | security | cosmetic
     * @param {string} defect.severity - critical | high | medium | low
     * @param {string} defect.stepsToReproduce
     * @param {string} defect.expectedBehavior
     * @param {string} defect.actualBehavior
     * @param {string} defect.screenshotPath
     * @param {Array} defect.consoleErrors
     * @param {Array} defect.networkFailures
     */
    logDefect(defect) {
        const entry = {
            ...defect,
            timestamp: new Date().toISOString(),
        };

        // Read existing defects to append safely
        let currentLog = [];
        try {
            const content = fs.readFileSync(LOG_FILE_PATH, 'utf8');
            currentLog = JSON.parse(content);
        } catch (e) {
            console.warn('Could not read existing defect log, starting fresh.', e);
        }

        currentLog.push(entry);
        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(currentLog, null, 2));
        console.log(`[DEFECT LOGGED] ${defect.category}: ${defect.actualBehavior}`);
    }

    /**
     * Helper to capture a screenshot and return the relative path.
     * @param {import('@playwright/test').Page} page
     * @param {string} name - Name base for the screenshot
     */
    async captureScreenshot(page, name) {
        const filename = `${name.replace(/\s+/g, '_')}-${Date.now()}.png`;
        const relativePath = path.join('screenshots', filename); // Relative to test-results usually
        const fullPath = path.join(process.cwd(), 'test-results', relativePath);

        await page.screenshot({ path: fullPath, fullPage: true });
        return relativePath;
    }
}

export const defectLogger = new DefectLogger();
