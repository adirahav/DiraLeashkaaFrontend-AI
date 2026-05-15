# Plan: Signup Page - Test Coverage
  
1. Execution Plan: Test Layer Implementation 
    - *Target:* src/pages/SignUpPage.tsx

    - *Testing Stack:* Vitest + React Testing Library + JSDOM.

2. Technical Challenge: Wizard Flow & Token Updates
The Signup flow is complex because each step relies on the previous one's success and token update. We need to mock:

    - *Navigation:* useNavigate to verify the final redirect to /home.

    - *Services:* authService.signup (Step 1) and userService.updateUser (Steps 2 & 3).

    - *Local Storage:* Verify that the 'token' is updated after each successful step.

    - *JWT Decode:* Mock jwt-decode to simulate different user profile states.

3. Test Scenarios (The Checklist)
    **Phase 1:** Step 1 - Account Creation
    - [ ] *Render:* Verify fullname, email, password, and yearOfBirth fields are present.

    - [ ] *Action:* Submit valid data -> Verify authService.signup is called and UI moves to Step 2.

    - [ ] *Validation:* Submit invalid email -> Verify error message.

    **Phase 2:** Step 2 - Economic Data
    - [ ] *Render:* Verify equity, incomes, and commitments fields are present.

    - [ ] *Action:* Submit data -> Verify userService.updateUser is called with economic fields and UI moves to Step 3.

    - [ ] *Persistence:* Verify that the new token returned from the API is saved to localStorage.

    **Phase 3:** Step 3 - Legal & Terms
    - [ ] *Action:* Toggle termsOfUseAccept and submit -> Verify final API call.

    - [ ] *Success:* Verify redirection to /home upon completion.

    **Phase 4:** Auto-Resume & Guarding
    - [ ] Auto-Resume Step 2: Mock localStorage with a user who has an account but equity: 0 -> Verify Wizard opens directly at Step 2.

    - [ ] Auto-Resume Step 3: Mock a user with economic data but termsOfUseAccept: false -> Verify Wizard opens at Step 3.
   
4. Final Prompt for Execution
Command: Act as a Senior QA Engineer. Generate the test file **src/pages/__tests__/SignUpPage.test.tsx**.

*Strict Rules:*

    1. Follow the LLM Execution Workflow from my testLayer skill.

    2. No Sub-directories: Create the test file in the same folder as the source.

    3. Use the AAA (Arrange-Act-Assert) pattern.

    4. Do NOT suggest changes to the original file.

    5. Reporting: At the end of your response, provide the Task Execution Summary with [V] for success and [X] for failure, including the Total Success and Total Failure count.

    6. No Assumptions: Provide the code and the command 
**npx vitest SignUpPage.test**


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 
2. Write at least 10+ additional test cases.

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

---
# Discussion Log:

*AI says at [DATE] [TIME]:*
(Your 3+ clarifying questions and proposed test cases go here)

*Adi says at [DATE] [TIME]:*
(Waiting for user response...)