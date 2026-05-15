# Plan: Auth Service - Logic & API Coverage

1. Execution Plan: Test Layer Implementation   
    - *Target File:* src/services/auth.service.ts

    - *Testing Stack:* Vitest + vi for Mocking.

    - *Environment:* Node.js (Pure Logic, no DOM needed).

    - *Required Mocks:*

        - HTTP Client: Mock axios or the global fetch API.

        - Storage: Mock localStorage to verify token persistence.

2. Technical Challenges & Side Effects
    - *Token Management:* Verify that the JWT is correctly saved to localStorage upon login and removed upon logout.

    - *Interceptors/Headers:* If the service attaches a "Bearer" token to requests, ensure this logic is tested.

    - *Error Handling:* Ensure the service correctly parses backend error responses (e.g., extracting "User already exists" from a 400 error).

3. Core Test Scenarios (The Checklist)

    - [ ] *Login Success:* Call login() -> Mock API success -> Assert token is saved and user data is returned.

    - [ ] *Login Failure:* Call login() -> Mock API 401 error -> Assert correct error message is thrown.

    - [ ] *Logout:* Call logout() -> Assert localStorage is cleared and internal state is reset.

    - [ ] *Signup:* Call signup() -> Assert payload is structured correctly when sent to the server.

    - [ ] *Token Recovery:* Assert that on service initialization, it correctly retrieves a pre-existing token from storage.

4. Final Prompt for Execution
Command: Act as a Senior Software Engineer. Generate the test file **src/services/__tests__/auth.service.test.ts**.

*Strict Rules:*

    1. AAA Pattern: Organize every test into Arrange, Act, and Assert blocks.

    2. Clean Slate: Use beforeEach to clear localStorage and reset all mocks to prevent test cross-contamination.

    4. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    5. No Assumptions: Provide the code and the command 
**npx vitest auth.service.test**.


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
