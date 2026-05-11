# Plan: Profile Page - Refactor & Integration

## Task Overview
Create a unified Profile Management interface that allows users to view and update their personal and financial information. The page must support two distinct modes (PERSONAL, FINANCIAL), integrate with the userService for persistence, and provide real-time feedback via a specialized Notification component.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @user-api.yaml
    - @notification-component.md
    - @user-personal-info-component.md
    - @user-financial-details-component.md
    - Individual Specs: 
        - @profile-page.md
  
## Import Layout from AI Studio
Refactor the provided ProfilePage logic into a professional, store-connected component. Ensure strict separation between global state (Zustand) and local form state to optimize performance.
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Logic & State Integration (Zustand & Protection)**
- *Auth Guard*
    - Use `useStore` to verify `loggedinUser`. If null, redirect to `/login`.

- *State Selection*
    - Access `loggedinUser` (Auth Slice) and `isLoading` (App Slice).
    - Pull `phrases` from `useSplash`.

- *Local Form Management*
    - Initialize `formData` state by deep-cloning `loggedinUser` on mount.
    - Implement a `hasChanges` check by comparing `formData` against the initial `loggedinUser` object to toggle the "Save" button.

**Step 2: Refactor & Visual Composition (Dynamic Headers & UI)**
- Apply the structure from @profile-page.md.

- *Notification System*
    - Implement a local `notification` state (`type`, `message`, `isVisible`).
    - Use the `Notification` component to display success/error messages after API calls.

- *Header Configuration*
    - Use `SectionHeader` with conditional props based on the `mode`:
        - `PERSONAL`: Icon: `User`, Title: `user_personal_details`, Variant: `blue`.
        - `FINANCIAL`: Icon: `Wallet`, Title: `user_financial_details`, Variant: `teal`.

**Step 3: Component Mapping & Variant Handling**
- *Step 1: Mode PERSONAL*
    - Render `UserPersonalInfo` with `variant="profile"`.
    - Set `isEmailReadOnly={true}` and `isPasswordReadOnly={true}` as per business requirements.

- *Step 2: Mode FINANCIAL*
    - Render `UserFinancialDetails` with `variant="profile"`.
    - Ensure `showAdditionalFunding={true}` is passed to enable the full financial view.

**Step 4: Persistence Workflow (API & Store)**
- *Update Execution (`handleSave`)*
    - On click, call `setLoading(true)` via App Slice.
    - Execute `userService.updateUser(formData)`.
    - On Success: - Trigger `Notification` with `user_save_success`.
        - Update the global `loggedinUser` in the store with the new data.
    - On Failure: - Trigger `Notification` with `dialog_data_error_title`.
    - Always `setLoading(false)` at the end.

**Step 5: Styling & RTL (Tailwind)**
- *Layout*
    - Use a max-width container (`max-w-3xl`) with centered alignment (`mx-auto`).
    - Implement smooth transitions between modes using Tailwind's `animate-in fade-in duration-500`.

- *Component Styling (The "Profile" Variant):*
    - Use the `cn` utility to pass specific classes to the `Card` and `Button` components when in "profile" mode:
        - Card Padding: `p-6 md:p-10`.
        - Save Button: `shadow-xl shadow-blue-200/50 hover:scale-[1.02] transition-transform`.

- *RTL Logic:*
    - Ensure all form alignments use logical properties (`text-start`, `space-x-reverse`).


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