# Plan: UserFinancialDetails - Refactoring & Refactor

## Task Overview
Refactor the `UserFinancialDetails` logic into a high-fidelity, standalone component. It must support both the `Signup Wizard` (multi-step) and the `Financial Details page` (Edit mode), integrated with `Zustand` Slices and `SplashContext`.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - Individual Specs: 
        - @user-financial-details-component.md
    
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
        - Equity: Required, non-negative (can be 0).
        - Incomes: Required, non-negative (can be 0).
        - Commitments: Required, non-negative (can be 0).
    - Data Normalization: Use utilService.parseNumber to clean formatted strings (with commas) into pure numbers before updating state.
    - Compute `isStepValid` to manage the `isDisabled` state of the "Next/Save" button.

- Maintain local form state for real-time validation, and sync to Zustand/API only on final submission

**Step 2: Component Refactor (UserPersonalInfo.tsx)**
- Apply the structure from @user-financial-details-component.md

- *Composition*
    - Use atomic components: `NumericInput`, `AdditionalFundingSourcesEditor`, and `Button`.
    - Wrap all UI strings (labels, placeholders, tooltips, errors) in `getPhrase(key, phrases)`.

- *Props & Dynamic Logic*
    - Ensure the component can act as a *Controlled Component* (receiving `formData` and `setFormData` from parent).
    - Implement `showAdditionalFunding` conditional rendering.
    - Handle `onNext` and `onPrev` callbacks for navigation between wizard steps.

- *UI Mapping*
    - *Equity:* `signup_equity_label`, `signup_equity_placeholder`, `signup_equity_tooltip`.
    - *Incomes:* `signup_incomes_label`, `signup_incomes_placeholder`, `signup_incomes_tooltip`.
    - *Commitments:* `signup_commitments_label`, `signup_commitments_placeholder`, `signup_commitments_tooltip`.

**Step 3: Styling & RTL (Tailwind)**
- Layout: Vertical flex container for inputs + Grid layout for navigation buttons (2 columns).

- RTL Support: Ensure proper alignment for `NumericInput` adornments (₪) and right-aligned labels.

- Animation: Add `animate-in fade-in duration-500` for smooth state transitions.

**Step 4: API & Store Infrastructure (The Engine)**
- *Update Workflow
    - On `onSubmit`:
        - Call `setLoading(true)` (App Slice).
        - Prepare data structure: Ensure `additionalFundingSources` map correctly to the API Interface.
        - Run `userService.updateUser(data)`.
        - On Success: Trigger `user_save_success` notification.
        - On Failure: Show `dialog_data_error_title`.
        - Call `setLoading(false)`.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Toggle `isLoading` during the async process.

- *Selectors:* Strictly use atomic selectors (e.g., `state => state.equity`) via `useStore` to ensure optimized re-renders and type safety.


## *Required "STOP-AND-ASK" Milestone*
You must strictly follow the "STOP-AND-ASK" milestone before generating any code.
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

