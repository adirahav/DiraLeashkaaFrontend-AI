# Plan: Card - Component Rendering & Global State Integration

1. Execution Plan: Test Layer Implementation
    - *Target File:* src/components/Card

    - *Testing Stack:* Vitest + React Testing Library.

    - *Environment:* jsdom (Browser simulation).

    - *Required Mocks:* Redux Store: Provide a MockStore to simulate user state.

        - React Router: Wrap in MemoryRouter to handle NavLink and useNavigate.

        - Auth Service: Mock logout for interaction tests.

2. Technical Challenges & Side Effects
    - *Conditional Rendering:* Ensuring the UI reflects the Redux state (Guest vs. Logged-in) without actual API side effects.

    - *Routing Context:* Navigating between pages and ensuring links point to the correct routes.

    - *Dispatched Actions:* Verifying that clicking "Logout" actually dispatches the correct Thunk/Action.

3. Core Test Scenarios (The Checklist)

    - [V] *Guest View:* Verify "Login" and "Signup" links are visible when user is null. (Note: Component currently shows "Not logged in" text instead of links)

    - [V] *Auth View:* Verify the user's name/avatar is displayed when user is authenticated.

    - [V] *Auth View:* Verify "Login/Signup" are hidden when a user is logged in.

    - [V] *Logout Interaction:* Click "Logout" and assert that the logout action is dispatched.

    - [V] *Navigation:* Verify that clicking the "Logo" or "Home" link navigates to the correct path.

    - [V] *Accessibility:* Ensure buttons have accessible names and links are reachable.

4. Final Prompt for Execution
Command: Act as a Senior Frontend Engineer. Generate the test file **frontend/src/components/__tests__/AppHeader.test.tsx**.

*Strict Rules:*

    1. Redux Provider: Wrap the component in a `Provider` with a real or mock store configured with `authSlice`.

    2. Routing Context: Use `MemoryRouter` to wrap the component under test.

    3. AAA Pattern: Clearly separate the Arrange (render/setup state), Act (user interactions), and Assert (DOM expectations) phases.

    4. Cleanup: Use `cleanup` from RTL and `vi.clearAllMocks()` in `afterEach`/`beforeEach`.

    5. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    6. No Assumptions: Provide the code and the command 
**npx vitest AppHeader.test**


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow this gate before generating any code.
1. Analyze the Component: List all props, internal state, and Redux selectors used.
2. Clarifying Questions: Ask at least 3+ questions.
3. Proposed Tests: List 10+ specific test cases covering rendering, interaction, and edge cases.

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
