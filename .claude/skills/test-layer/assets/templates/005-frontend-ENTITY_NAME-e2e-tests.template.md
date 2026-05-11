---
name: 005-frontend-ENTITY_NAME-e2e-test.template
description: A template for generating a structured Test Plan for Playwright E2E tests. 
  It serves as the blueprint for defining test logic, mocks, and scenarios.
  The output is a Markdown Plan file, not executable test code. 
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Plan: [FEATURE_NAME] - End-to-End Tests (Full User Journey)

1. **Execution Plan: Test Layer Implementation**
    - *Target:* Full flow from **[START_PAGE]** to **[SUCCESS_PAGE]**.
    
    - *Testing Stack:* Playwright.
    
    - *Environment:* Local dev or Staging environment with API access.

2. **Technical Challenges & Side Effects**
    - *Network Latency:* GPT responses take time. We must implement robust "Wait for" logic (Selectors, API calls) to prevent flaky tests.
    
    - *Flakiness:* UI changes and API latency can cause tests to fail. We must use Playwright's auto-waiting and `expect(locator).toBeVisible()`.
    
    - *Test Data Isolation:* Ensure each test run uses unique data or cleans up after itself to avoid "Database pollution".
    
    - *Auth State:* If the app requires login, the test should use a saved `storageState` or a login global setup.
    
    - *Selectors:* Priority for `data-testid` or ARIA roles (e.g., `getByRole('button')`) to ensure the test is resilient to CSS changes.

3. **Core Test Scenarios**
    - *Happy Path:* Complete the full journey from [START_STEP] to [END_STEP] successfully.

    - *Validation Flow:* User tries to submit empty fields and sees error messages.

    - *Navigation:* Verify that clicking the navigation menu correctly changes the URL.

    - *API Resilience:* Verify UI behavior when the backend returns a 500 error during the flow.

    - *Data Persistence:* After a "Save" action, refresh the page and verify the data is still there (fetched from API).

    - *Navigation Integrity:* Verify the URL contains the expected parameters (e.g., [ID_PARAMETER]) after the action.

    - *Responsive Check:* (Optional) Verify the flow works on mobile viewport.

4. **Final Prompt for Execution**
Command: Act as a QA Automation Engineer. Generate the E2E test file **e2e/[USER_STORY].spec.test.ts** using Playwright.
[LLM Instruction for this section: ensure the test file name end with `spec.test.js`]

**Strict Rules:**
1. *Pattern:* Follow the Arrange-Act-Assert (AAA) pattern.

2. *Waiting:* Use `page.waitForURL` or `page.waitForResponse` for critical transitions.

3. *Locators:* Use Playwright's recommended locators (getByText, getByRole, getByTestId).

4. *Isolation:* Each `test()` block must be independent.

5. *Execution Command (For User Reference Only - DO NOT RUN `npx playwright` Command):*
[LLM Instruction: Do NOT generate code now. Only populate the command below. If multiple components are being tested, you MUST provide a separate command line for each file created/updated. List them one after another.]
Command:  **npx playwright test [USER_STORY].spec.test.js**

## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.

1. **Analyze the Service:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Map User Journeys: List all navigation flows, cross-page state transitions, and final success criteria (e.g., Database persistence or Redirects).`]

2. **Clarifying Questions:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Clarifying Questions: Ask at least 3+ questions.`]

3. **Proposed Test Cases:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Expanded Test Cases: Propose at least 10+ specific test cases.`]

**CRITICAL INSTRUCTION:** After presenting your questions, you must STOP and wait for explicit approval. Do not proceed to code generation.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** 
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file.`]

---
# Discussion Log:
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`*AI says:*
(Waiting for component source code to generate specific questions and cases...)`]