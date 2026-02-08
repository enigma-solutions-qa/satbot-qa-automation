
// kick off playwright test
// npx playwright test e2e/tests/rag-security.spec.js --config=e2e/playwright.config.js

// kick off headless test
// npx playwright test e2e/tests/rag-security.spec.js --project=chromium-headless --config=e2e/playwright.config.js






// e2e/playwright.config.js
import test, { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
    testDir: './',
    outputDir: '../test-results', // Store results in the root test-results
    fullyParallel: false, // Run sequentially for easier debugging of state issues
    forbidOnly: !!process.env.CI,
    retries: 0, // Fail fast for now, enable retries later if needed
    workers: 1, // Sequential execution to avoid state collision
    reporter: [
        ['html', { outputFolder: '../playwright-report' }],
        ['list'],
        ['json', { outputFile: '../test-results/results.json' }]
    ],
    use: {
        baseURL: 'http://localhost:3333', // Updated to match Docker container port
        trace: 'on', // Capture trace for all tests
        screenshot: 'on', // Take screenshots for every step
        ignoreHTTPSErrors: true,
        headless: true, // Default headless, can be overridden per project
        actionTimeout: 60000, // Timeout for actions like fill(), click()
        navigationTimeout: 120000, // Timeout for page navigation
    },
    projects: [
        {
            name: 'chromium-headless',
            use: { ...devices['Desktop Chrome'], headless: true },
        },
        {
            name: 'chromium-headed',
            use: { ...devices['Desktop Chrome'], headless: false },
        },
    ],
    //timeout: 180000, // 3 minutes per test for long-running RAG security tests
});
