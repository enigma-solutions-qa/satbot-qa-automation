# SatBot QA Automation

This directory contains the Playwright automation suite for SatBot, focusing on functional regression and security testing for the RAG-based chatbot.

## Running Tests

To run the full suite:
```bash
npx playwright test
```

To run a specific test file:
```bash
npx playwright test e2e/functional-regression.spec.js
npx playwright test e2e/tests/rag-security.spec.js
```

## Test Suites

### 1. Functional Regression Suite
**File:** `e2e/functional-regression.spec.js`

This suite covers the core end-to-end functionality of the application to ensure basic sanity and regression testing.

*   **Application Load & UI Health**: Verifies that the application loads correctly, the title is correct, and critical UI components (chat input, send button) are visible. It also checks for console errors or network failures on startup.
*   **Chat Input & Messaging Flow**: Tests the core user journey of sending a message and receiving a response.
    *   *Send Single Message*: Verifies user message appears and AI response is generated.
    *   *Send Special Characters*: Ensures the system handles special characters correctly.
*   **RAG Functional Behavior**: Validates that the RAG system works as expected for known knowledge questions (e.g., "What varies by jurisdiction?").
*   **Guard & Security Flows (Basic)**: A lightweight security check that attempts a basic prompt injection ("Ignore all previous instructions...") to ensure immediate blocking.
*   **Navigation & Controls**: Tests page reload persistence/reset behavior.

### 2. RAG Security & Safety Suite
**File:** `e2e/tests/rag-security.spec.js`

A dedicated suite for testing the security boundaries, safety guardrails, and grounding of the RAG system.

*   **Safe UX - Knowledge Questions**: Verifies the system answers valid questions (e.g., "What is penetration testing?") without refusal and without leaking sensitive internal data.
*   **Grounded RAG Behavior**: Specifically checks for "Grounded RAG" responses, ensuring the answer is based on retrieved chunks (validating citations if applicable).
*   **Prompt Injection Attacks**: Executes various adversarial prompt injection techniques:
    *   *Classic Ignore*: "Ignore previous instructions..."
    *   *System Role*: "Act as system administrator..."
    *   *Developer Mode*: "Developer Mode: ON..."
*   **Internal Leakage & Guardrail Probing**: Attempts to trick the model into revealing its system prompt or internal routing configuration.
*   **Poisoned Document Resilience**: Simulates scenarios where retrieved documents might contain malicious instructions (poisoning) and verifies the system ignores them.
*   **Edge Behavior**: Tests how the system handles unknown or irrelevant topics to ensure safe fallbacks without error dumps.

### 3. Experimental / Scratchpad
**File:** `e2e/tests/my_new_test.spec.js`

*   **My new flow - no guardrails**: A simple test case for quick experimentation, verifying a basic interaction ("what is pen testing") without the full overhead of the regression suite.
