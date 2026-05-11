# Plan: User Service - Logic & API Coverage

1. Execution Plan: Test Layer Implementation   
    - *Target File:* src/services/user.service.ts

    - *Testing Stack:* Vitest + vi for Mocking.

    - *Environment:* Node.js (Pure Logic, no DOM needed).

    - *Required Mocks:*

        - HTTP Client: Mock axios or the global fetch API.

        - Storage: Mock localStorage to verify that the token is updated when the user profile is updated.

        - Auth Utilities: Mock jwt-decode to verify the service correctly decodes the new token returned from updates.

2. Technical Challenges & Side Effects
    - *Token Synchronization:* When updateUser is called, the server returns a new JWT. The service must update `localStorage.setItem('token', newToken)` and decode it to keep the global user state in sync.

    - *Query Parameters:* Methods like `getSplashData` and `getHomeData` use query params (platform, fullData). We must verify these are serialized correctly.

    - *Authorization:* Verify that these calls rely on the `httpService` which should already have the `Bearer` token attached.

3. Core Test Scenarios (The Checklist)

    - [ ] *Update User Success:* Call updateUser() -> Mock API success (returns new JWT string) -> Assert localStorage is updated with the new token.

    - [ ] *Get Home Data:* Call getHomeData({ platform: 'web' }) -> Assert correct URL and query params are sent.

    - [ ] *Get Splash Data:* Call getSplashData() -> Assert it correctly handles public (non-auth) requests if applicable.

    - [ ] *Get User By ID:* Call getUserById() -> Assert it returns the expected user schema.

    - [ ] *Error Handling:* Call updateUser() -> Mock API 400 error -> Assert the service throws or handles the error correctly.

4. Final Prompt for Execution
Command: Act as a Senior Software Engineer. Generate the test file **src/services/tests/user.service.test.ts**.

*Strict Rules:*

    1. AAA Pattern: Organize every test into Arrange, Act, and Assert blocks.

    2. Clean Slate: Use beforeEach to clear localStorage and reset all mocks to prevent test cross-contamination.

    4. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    5. No Assumptions: Provide the code and the command 
**npx vitest user.service.test**.

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
