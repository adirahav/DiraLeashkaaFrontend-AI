# Plan: Forgot Password Service - Logic & API Coverage

1. Execution Plan: Test Layer Implementation   
    - *Target File:* src/services/forgotPassword.service.ts

    - *Testing Stack:* Vitest + vi for Mocking.

    - *Environment:* Node.js (Pure Logic, no DOM needed).

    - *Required Mocks:*

        - HTTP Client: Mock axios or the global fetch API.

        - Storage: Mock localStorage (used to store the intermediate jwt token between steps).

        - Interceptors: Verify that the service (or the underlying http client) correctly switches the Authorization header to use the temporary forgot-password token instead of the standard user token.

2. Technical Challenges & Side Effects
    - *Step Synchronization:* Step 2 and Step 3 require the token received from the previous step. The tests must verify the "Chain of Custody" of this token in sessionStorage.

    - *Security Isolation:* Ensure that the standard localStorage token (for logged-in users) is not accidentally sent or overwritten during the recovery process.

    - *Credential Handling:* The OpenAPI spec mentions both Cookies and Headers. Verify withCredentials: true is enabled for these requests.

3. Core Test Scenarios (The Checklist)

    - [ ] *Generate Code (Step 1):* Call generateCode(email) -> Mock success -> Assert token is saved to sessionStorage.

    - [ ] *Validate Code (Step 2):* Call validateCode(code) -> Mock success -> Assert the updated token (with verified status) replaces the old one in sessionStorage.

    - [ ] *Change Password (Step 3):* Call changePassword(newPassword) -> Mock success -> Assert sessionStorage is cleared after completion.

    - [ ] *Error Handling:* Call validateCode with wrong code -> Assert the service propagates the 400 error correctly.

4. Final Prompt for Execution
Command: Act as a Senior Software Engineer. Generate the test file **src/services/tests/forgotPassword.service.test.ts**.

*Strict Rules:*

    1. AAA Pattern: Organize every test into Arrange, Act, and Assert blocks.

    2. Clean Slate: Use beforeEach to clear localStorage and reset all mocks to prevent test cross-contamination.

    4. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    5. No Assumptions: Provide the code and the command 
**npx vitest forgotPassword.service.test**.

## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow this gate before generating any code.
1. Analyze the Service: List all methods you found in the file.
2. Clarifying Questions: Ask at least 3+ questions.
3. Expanded Test Cases: Propose at least 10+ specific test cases.

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
