# Plan: Login Page - Test Coverage
  
1. Execution Plan: Test Layer Implementation 
    - *Target:* src/pages/LoginPage.tsx

    - *Testing Stack:* Vitest + React Testing Library + JSDOM.

2. Technical Challenge: Environment Mocks
The component relies on external libraries and routing. Implement the following at the top of the test file:

    - *React Router:* Mock useNavigate to verify redirection after login.

    - *Lucide Icons:* Mock lucide-react to prevent SVG rendering issues.

    - *API Requests:* Mock the global fetch or the API service used for the login request.

3. Test Scenarios (The Checklist)

    - *Render Test:* Verify all fields (`email` `password`) are visible.

    - *Validation Test:* Fill invalid email -> Expect error message.

    - *Validation Test:* Submit empty form -> Expect "Required" errors on all fields.

    - *Submission Test:* Mock a successful API call -> Verify navigation/success state after clicking the "התחברות למערכת" button.

    - *Navigation Test:* Click "שכחתי סיסמה?" -> Verify route change to `/forgot-password`.

    - *Navigation Test:* Click "עדיין אין לך חשבון?" -> Verify route change to `/signup`.

    - *Redirection Test (Already Logged In - Complete):* User hits /login with a valid token and termsOfUseAccept: true -> Verify route change to `/home`.

    - *Redirection Test (Already Logged In - Incomplete):* User hits /login with a valid token but `equity`, `incomes`, `commitments` or `termsOfUseAccept` : null -> Verify route change to `/signup`.

4. Final Prompt for Execution
Command: Act as a Senior QA Engineer. Generate the test file **src/pages/__tests__/LoginPage.test.tsx**.

*Strict Rules:*

    1. Follow the LLM Execution Workflow from my testLayer skill.

    2. No Sub-directories: Create the test file in the same folder as the source.

    3. Use the AAA (Arrange-Act-Assert) pattern.

    4. Do NOT suggest changes to the original file.

    5. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    6. No Assumptions: Provide the code and the command 
**npx vitest LoginPage.test**


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 
2. Write at least 10+ additional test cases.

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

---
# Discussion Log:

*AI says:*
(Your 3+ clarifying questions and proposed test cases go here)

*User says:*
(Waiting for user response...)