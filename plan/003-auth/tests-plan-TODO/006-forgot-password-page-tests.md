# Plan: Forgot Password Page - Test Coverage
  
1. Execution Plan: Test Layer Implementation 
    - *Target:* src/pages/ForgotPasswordPage.tsx

    - *Testing Stack:* Vitest + React Testing Library + JSDOM.

2. Technical Challenge: Environment Mocks
The Forgot Password flow is stateful (3 different views). We need to mock:

    - *Navigation:* useNavigate from react-router-dom.

    - *SessionStorage:* Mocking getItem/setItem to verify the transition tokens are saved.

    - *API Service:* Mocking forgotPasswordService methods.

3. Test Scenarios (The Checklist)

    **Phase 1:** Email Submission
    - [ ] Render: Verify email input and "Send Code" button are visible initially.

    - [ ] Action: Enter email and submit -> Verify service call and transition to "Code Verification" view.

    - [ ] Error: Mock 400 error (User not found) -> Verify error message display.

    **Phase 2:** Code Verification
    - [ ] Render: Verify 4/6-digit code input is visible.

    - [ ] Action: Enter code -> Verify validateCode call and transition to "New Password" view.

    - [ ] Resend: Click "Resend Code" -> Verify generateCode is called again.

    **Phase 3:** Password Reset
    - [ ] *Action:* Enter new password -> Verify changePassword call.

    - [ ] *Success:* Verify redirection to /login after successful reset.

4. Final Prompt for Execution
Command: Act as a Senior QA Engineer. Generate the test file **frontend/src/pages/__tests__/SignupPage.test.tsx**.

*Strict Rules:*

    1. Follow the LLM Execution Workflow from my testLayer skill.

    2. No Sub-directories: Create the test file in the same folder as the source.

    3. Use the AAA (Arrange-Act-Assert) pattern.

    4. Do NOT suggest changes to the original file.

    5. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    6. No Assumptions: Provide the code and the command 
**npx vitest SignupPage.test**


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 
2. Write at least 10+ additional test cases.

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
