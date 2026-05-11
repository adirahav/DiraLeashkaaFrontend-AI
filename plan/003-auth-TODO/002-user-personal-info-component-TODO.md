# Plan: UserPersonalInfo - Extraction & Refactor

## Task Overview
Refactor the `UserPersonalInfo` logic into a high-fidelity, standalone component. It must support both the `Signup Wizard` (multi-step) and the `Personal Info page` (Edit mode), integrated with `Zustand` Slices and `SplashContext`.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - Individual Specs: 
        - @user-personal-info-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (Zustand & Context)**
- *State Selection (Zustand)*
    - Use the unified `useStore` hook to access `loggedinUser` (Auth Slice) and isLoading (App Slice).
    - Pull `phrases` from `useSplash` context.

- *Form & Validation Logic*
    - Implement local validation logic for each field:
        - *fullname:* Min 2 chars.
        - *email:* Regex format validation. (checked only if `isEmailReadOnly` is false)
        - *password:* Min 8 chars (checked only if `isPasswordReadOnly` is false).
        - *yearOfBirth:* Validates age between 18-120 based on current year.
    - Compute `isFormValid` to manage the `isDisabled` state of the action button.

- Maintain local form state for real-time validation, and sync to Zustand/API only on final submission

**Step 2: Component Refactor (UserPersonalInfo.tsx)**
- Apply the structure from @user-personal-info-component.md

- *Composition*
    - Use atomic components: `StringInput`, `EmailInput`, `PasswordInput`, `YearOfBirth`, and `Button`.
    - Wrap all UI strings (labels, placeholders, tooltips, errors) in `getPhrase(key, phrases)`.

- *Props & Mode Handling*
    - Ensure the component can act as a *Controlled Component* (receiving `formData` and `onChange` from parent).
    - Implement *isEmailReadOnly* logic: If true, the emailop[= field is disabled or masked.
    - Implement *isPasswordReadOnly* logic: If true, the password field is disabled or masked.

- *UI Mapping*
    - *Header:* user_personal_details.
    - *Name:* signup_fullname_label.
    - *Email:* signup_email_label.
    - *Password:* signup_password_label.
    - *Birth Year:* signup_year_of_birth_hint + signup_year_of_birth_tooltip.

**Step 3: Styling & RTL (Tailwind)**
- Layout: Vertical flex container with `gap: 1.25rem`.

- RTL Support: Ensure `text-align: right` and logical spacing for Hebrew.

- Animation: Add `animate-in fade-in slide-in-from-bottom-2` for a smooth entrance.

**Step 4: API & Store Infrastructure (The Engine)**
- *Update Workflow
    - On `onSubmit`:
        - Call `setLoading(true)` (App Slice).
        - Execute `userService.updateUser(data)`.
        - On Success: Trigger success notification via `user_save_success`.
        - On Failure: Show error via `dialog_data_error_title`.
        - Call `setLoading(false)`.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Toggle `isLoading` during the async process.

- *Selectors:* Strictly use atomic selectors (e.g., `state => state.user`) via `useStore` to ensure optimized re-renders and type safety.


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