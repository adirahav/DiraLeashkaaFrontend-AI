# Plan: Auth Redux Slice - State & Async Logic Coverage

1. Execution Plan: Test Layer Implementation
    - *Target File:* src/store/slices/auth.slice.ts

    - *Testing Stack:* Vitest.

    - *Environment:* Node.js (Pure logic).

    - *Required Mocks:* Auth Service: Mock the auth.service.ts to prevent real API calls during Thunk execution.

        - Storage: Mock sessionStorage to verify persistence logic.

2. Technical Challenges & Side Effects
    - *Async Thunk Lifecycle:* Verify the state changes across pending, fulfilled, and rejected states for login, signup, and logout.

    - *Immutability:* Ensure the Reducer updates the state correctly using Redux Toolkit’s internal immer logic.

    - *Initialization:* Verify that the slice correctly hydrates its initial state from sessionStorage.

3. Core Test Scenarios (The Checklist)

    - [ ] *Initial State:* Verify the slice starts with user: null, isLoading: false, and error: null.

    - [ ] *Login Thunk:* Pending: Dispatch login.pending -> Assert isLoading is true and error is null.

    - [ ] *Login Thunk:* Success: Dispatch login.fulfilled -> Assert user is set, isLoading is false.

    - [ ] *Login Thunk:* Rejected: Dispatch login.rejected -> Assert user is null, isLoading is false, and error contains the payload message.

    - [ ] *Logout Thunk:* Dispatch logout.fulfilled -> Assert state returns to initial (user is null).

    - [ ] *Signup Thunk:* Verify full lifecycle (pending/fulfilled/rejected) matches the login logic.

    - [ ] *Hydration:* Verify that if sessionStorage contains a user, the initial state uses it.

4. Final Prompt for Execution
Command: Act as a Senior Frontend Engineer. Generate the test file **frontend/src/store/slices/__tests__/auth.slice.test.ts**.

*Strict Rules:*

    1. No Component Rendering: Test the reducer and thunks in isolation.

    2. Mocking Services: Use vi.mock('frontend/src/services/auth.service') to control API responses.

    3. AAA Pattern: Clearly separate the Arrange (state/mock setup), Act (dispatching actions), and Assert (expecting state changes) phases.

    4. Cleanup: Use beforeEach to clear sessionStorage and reset all mocks.

    5. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    6. No Assumptions: Provide the code and the command 
**npx vitest auth.slice.test**.


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow this gate before generating any code.
1. Analyze the Slice: List all reducers and extraReducers (Async Thunks) found in the file.
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
