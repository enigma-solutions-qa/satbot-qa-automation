// e2e/utils/DefectLogger.js
import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'test-results');
const LOG_FILE_PATH = path.join(LOG_DIR, 'defect-log.json');

export class DefectLogger {
    constructor() {
        this.defectCount = 0;
        this.ensureLogFile();
    }

    ensureLogFile() {
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }
        // We append to this file, so we don't necessarily need to create an empty array 
        // if we use a streaming format (NDJSON) or we risk corruption with JSON array.
        // The requirement says "Append continuously". NDJSON is safest for this.
        // However, user example implied a standard JSON structure? 
        // "Persist defects to: /test-results/defect-log.json Append continuously"
        // I will use NDJSON (newline delimited JSON) logic as it is append-safe.
        if (!fs.existsSync(LOG_FILE_PATH)) {
            fs.writeFileSync(LOG_FILE_PATH, '');
        }
    }

    /**
     * Log a defect object to the file.
     * @param {Object} params
     * @param {string} params.testName
     * @param {string} params.category - functional | UI | performance | security | cosmetic
     * @param {string} params.severity - critical | high | medium | low
     * @param {string} params.stepsToReproduce
     * @param {string} params.expectedBehavior
     * @param {string} params.actualBehavior
     * @param {string} [params.screenshotPath]
     * @param {Array} [params.consoleErrors]
     * @param {Array} [params.networkFailures]
     */
    async log(params) {
        this.defectCount++;

        // Fill defaults
        const defect = {
            testName: params.testName || 'Unknown Test',
            category: params.category || 'functional',
            severity: params.severity || 'medium',
            stepsToReproduce: params.stepsToReproduce || 'N/A',
            expectedBehavior: params.expectedBehavior || 'N/A',
            actualBehavior: params.actualBehavior || 'N/A',
            screenshotPath: params.screenshotPath || '',
            consoleErrors: params.consoleErrors || [],
            networkFailures: params.networkFailures || [],
            timestamp: new Date().toISOString()
        };

        try {
            fs.appendFileSync(LOG_FILE_PATH, JSON.stringify(defect) + '\n');
            console.error(`[DEFECT LOGGED] [${defect.severity}] ${defect.category}: ${defect.actualBehavior}`);
        } catch (e) {
            console.error('Failed to write to defect log', e);
        }
    }

    /**
     * Helper to capture a screenshot and return the relative path.
     */
    async captureScreenshot(page, name) {
        if (!page) return '';
        try {
            const filename = `${name.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.png`;
            const relativePath = path.join('screenshots', filename);
            const fullPath = path.join(LOG_DIR, relativePath);

            await page.screenshot({ path: fullPath, fullPage: true });
            return relativePath;
        } catch (e) {
            console.error('Screenshot capture failed', e);
            return '';
        }
    }
}

export const defectLogger = new DefectLogger();
