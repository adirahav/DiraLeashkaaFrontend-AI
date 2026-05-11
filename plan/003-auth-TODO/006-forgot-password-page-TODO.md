# Plan: Forgot Password Page - Extraction & Refactor

## Task Overview
Implement a high-fidelity, 3-step password recovery flow (EMAIL -> VERIFY -> RESET). The page must manage complex transitions, dynamic header phrases, real-time code input logic, and secure password resetting, all while integrating with the Zustand store and a dedicated `forgotPasswordService`.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @page-layer/SKILL.md
    - @forgot-password-api.yaml
    - Individual Specs: 
        - @forgot-password-page.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (The State Machine)**
- *Step Management*
    - Define a local `step` state: 'EMAIL' | 'VERIFY' | 'RESET'.
    - Pull `phrases` from `useSplash` context.
    - Use `useStore` to toggle global `isLoading` (App Slice).

- *Step 1: EMAIL (Generate Code)*
    - Logic: Validate email regex. On `onSubmit`, call `forgotPasswordService.generateCode(email)`.
    - Success: Move to `VERIFY` step. Clear any previous errors.

- *Step 2: VERIFY (Validate Code)*
    - Logic: Manage a 4-digit array state for the code.
    - Auto-focus: Implement `useRef` array and `onKeyUp` handlers to shift focus between the 4 HTML inputs (forward on digit, backward on Backspace).
    - Validation: Once 4 digits are entered, call `forgotPasswordService.validateCode(email, code)`.
    - Back Action: Implement "Send again" which clears the code and returns the user to the `EMAIL` step.

- *Step 3: RESET (Update Password)*
    - Logic: Use two `PasswordInput` fields.
    - Validation: Ensure `newPassword === confirmPassword` and meets length requirements (8+ chars).
    - Final API: Call `forgotPasswordService.changePassword(newPassword)`.
    - Completion: On success, trigger a `Notification` and navigate to `/login` after a 3-second delay.

**Step 2: Component Refactor & Composition**
- Apply the structure from @forgot-password-page.md

- *StepIcon (Internal Utility)*
    - Create a local component that renders the correct icon based on the step:
        - `EMAIL`: Envelope icon.
        - `VERIFY`: Lock icon.
        - `RESET`: Shield/Security icon.

- *ScreenHeader Group*
    - Dynamically update `title` and `subtitle` props based on the current step using `getPhrase`.
    - Special Logic: In `VERIFY`, inject the email address into the subtitle (replacing `%1$`).

- *Form Fields*
    - Use `EmailInput`, `PasswordInput`, and `Button`.
    - Ensure all buttons reflect the `isLoading` state.

**Step 3: API & Service Infrastructure**
- *forgotPassword.service.ts*
    - `POST /forgotPassword/generateCode` (Payload: `{ email }`).
    - `POST /forgotPassword/validateCode` (Payload: `{ email, code }`).
    - `PUT /forgotPassword/changePassword` (Payload: `{ password }`).

- *Error Handling*
    - Capture 400/500 errors and map them to local error phrases (e.g., `forgot_password_code_error`).

**Step 4: Styling & RTL (Tailwind)**
- *Step Transitions* 
    - Use `framer-motion` for `animate-in fade-in slide-in-from-bottom-4` to make transitions between steps feel like a modern app.

- *Code Inputs*
    - Style the 4-digit inputs with large fonts, centered text, and forced `dir="ltr"` layout for logical digit entry.

- *RTL Alignment* 
    - Ensure titles, labels, and error messages are correctly right-aligned for Hebrew.

## State Management Check
- *App Slice:* Use setLoading to block the UI during API calls.

- *Selectors: Atomic selection for performance.


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:
    
*AI says:*