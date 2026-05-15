# Plan: Auth Flow - End-to-End (E2E) User Journey

1. Execution Plan: Test Layer Implementation
    - *Target:* Full User Signup Journey (Registration -> Auto-login -> Redirect).

    - *Testing Stack:* Playwright (Preferred for modern React apps).

    - *Environment:* Real Browser (Chromium/Webkit).

    - *Required Infrastructure:* - Local Server: The frontend and backend/mock-server must be running.

        - Database State: A strategy to clear the "Test User" before each run to ensure the signup isn't blocked by "Email already exists" errors.

2. Technical Challenges & Side Effects
    - *Asynchronous UI:* Handling loading spinners and transition animations between the form and the home page.

    - *Persistent Storage:* Verifying that sessionStorage or cookies are correctly set after the signup redirect.

    - *Flakiness:* Ensuring tests don't fail due to network lag (using proper Playwright locators like getByRole).

3. Core Test Scenarios (The Checklist)

    - [ ] *Happy Path Signup:* Fill all valid details -> Click Submit -> Assert URL change to / or /dashboard.

    - [ ] *UI Confirmation:* Verify the AppHeader now displays the "Logout" button and the new user's name.

    - [ ] *Duplicate User:* Attempt to sign up with an existing username -> Assert error toast/message appears.

    - [ ] *Validation Feedback:* Trigger "Required" or "Invalid Email" errors -> Assert the UI displays them.

    - [ ] *Persistence Check:* After signup, refresh the page -> Assert the user is still logged in.

    - [ ] *The "Logout" Loop:* Sign up -> Click Logout -> Assert return to Guest state.

4. Final Prompt for Execution
Command: Act as a QA Automation Engineer. Generate the Playwright test file 
**frontend/e2e/signup.spec.ts**.

*Strict Rules:*

    1. Locators: Use user-facing locators (e.g., page.getByLabel('Username')) rather than CSS selectors.

    2. Assertions: Use web-first assertions like expect(page).toHaveURL('/').

    3. Data Management: Include a beforeEach block to navigate to the signup page.

    4. Clean Slate: Add a comment or step regarding the cleanup of test data.

    5. Reporting: Provide a Task Execution Summary with [V] for success and [X] for failure.

    6. No Assumptions: Provide the code and the command 
**npx playwright test signup.spec**.


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow this gate before generating any code.
1. Analyze the Flow
    - Path: Usually /signup.
    - Fields: First Name, Last Name, Email, Phone number, Password.
    - Action: POST /api/auth/signup.
    - Success Result: Redirection and Global State update.
2. Clarifying Questions: Ask at least 3+ questions.
3. Proposed Tests: List 10+ specific test cases covering both synchronous and asynchronous logic.

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:

*AI says at [DATE] [TIME]:*
(Your 3+ clarifying questions and proposed test cases go here)

*Adi says at [DATE] [TIME]:*
(Waiting for user response...)
