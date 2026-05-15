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

---
### [2026-05-13] AI Pre-Flight Questions — STOP-AND-ASK Gate

*AI says:*

Before generating any code, I need answers to the following questions. **I will not proceed until you explicitly approve.**

---

**Q1 — `userService.updateUser` API Endpoint**

The plan calls `userService.updateUser(data)` on submit, but `src/services/user.service.ts` currently only has `fetchSplash`. The service-layer skill lists `user.routes.js` with no mapped endpoints.

- What is the HTTP method and route for updating user personal info? (e.g., `PUT /api/user`, `PATCH /api/user/:uuid`)
- Which fields does the backend expect in the payload? (`fullname`, `email`, `yearOfBirth`, `password` — all or subset?)
- Should I create `updateUser` inside `user.service.ts`, or does it already exist somewhere else?

> *Your answer:* `PUT /api/user/`. You can find all the endpoins in @skills/api-layer/docs/api/user-api.yaml.

---

**Q2 — File Location: `src/components/layout/` vs `src/layouts/`**

The component spec (`@user-personal-info-component.md`) places the file at `src/layouts/UserPersonalInfo.tsx`, but the file currently lives at `src/components/layout/UserPersonalInfo.tsx`.

- Should I **refactor in place** (keep it at `src/components/layout/UserPersonalInfo.tsx`)?
- Or **move** it to `src/layouts/UserPersonalInfo.tsx` and update all imports?

> *Your answer:* refactor in place (keep it at `src/components/layout/UserPersonalInfo.tsx`).

---

**Q3 — Submit Responsibility: Smart vs Controlled**

The plan says to call `setLoading(true)` → `userService.updateUser(data)` → show notification inside the component. But the current component is purely controlled — it delegates `onClick` to the parent with no internal async logic.

- Should the API call happen **inside** `UserPersonalInfo` (making it a smart component), and if so, only in `profile` variant or both?
- Or should `onClick` remain the parent's responsibility, and the component only calls `onClick()` on button press (keeping it dumb)?

> *Your answer:* The component should remain Controlled (Dumb) regarding the API, but Smart regarding its internal validation.

Decision:
The UserPersonalInfo component will not handle the userService API call directly. Instead, it will delegate the action to the parent via an onSave (or onSubmit) prop.

Reasoning & Logic:
1. Parent Responsibility: Since the post-save navigation varies (e.g., in the Signup Wizard it moves to the next step, while in the Profile Page it might show a notification and stay put), the Parent (Page) must orchestrate the flow.
2. Internal Validation: The component will maintain its own localFormData and isFormValid state. The "Save/Next" button will only be enabled if internal validation passes.
3. Loading State: The component will subscribe to the isLoading state from the global App Slice. This allows the button to automatically show a spinner/disabled state while the parent is performing the async API call.
4. Consistency: This pattern applies to both the profile and wizard variants, ensuring the component is highly reusable across the app.

Revised Workflow:
Button Click -> Internal Validation -> onSave(data) (Parent Callback) -> Parent handles API & Navigation.

---

**Q4 — `getPhrase` Import Source**

The plan requires wrapping all UI strings in `getPhrase(key, phrases)` from `useSplash`. The existing component has hardcoded Hebrew for all labels, placeholders, and errors.

- Where is `getPhrase` imported from? (e.g., `src/utils/phrase.utils.ts`, `src/contexts/SplashContext.tsx`)
- What is the exact call signature? The spec shows both `getPhrase('key', phrases)` and `getPhrase('key', 'Fallback')` — which form is used here?

> *Your answer:* `src/hooks/useSplash.ts`. 
The call signature: `getPhrase('key', 'Fallback')`.
Please translate all fallback to Engligh.

---

**Q5 — Password Field in `isPasswordReadOnly` Mode**

The spec says "Disabled/Hidden in Edit Profile mode if applicable" — this is ambiguous.

- When `isPasswordReadOnly={true}`: should the password field be **completely hidden** from the DOM, or **visible but disabled** (grayed out)?
- If hidden, should there be a "Change Password" link or separate flow in its place?

> *Your answer:* Decision: Completely Hidden from the DOM.

Logic & Implementation:
1. Conditional Rendering: When isPasswordReadOnly is true, the entire password field (label, input, and wrapper) should be removed from the DOM using conditional rendering. Do not render it as a disabled/grayed-out field.
2. UX Context:
    - In Signup/Wizard mode (isPasswordReadOnly={false}): The password field is mandatory and visible.
    - In Profile/Edit mode (isPasswordReadOnly={true}): The password field is hidden to keep the form focused on editable personal details.
3. Change Password Flow: We will not include a "Change Password" link or flow inside this component at this stage. Security-sensitive operations like password changes should be handled in a dedicated secure flow, separate from basic profile updates.

Implementation Note: Ensure the validation logic for the password field is also bypassed when isPasswordReadOnly is active, so it doesn't block the isFormValid calculation for existing users.


---

**Q6 — Notification Mechanism**

`app.slice.ts` exposes `setNotification({ message, type })`. The plan references phrase keys `user_save_success` and `dialog_data_error_title` for feedback.

- Should success/error feedback use `setNotification` from the App Slice (global toast/banner)?
- Or is there a different notification component/mechanism already wired in the project (e.g., a dialog, inline alert)?

> *Your answer:* Use `/src/components/common/Notification.tsx` for feedback.

---

*Waiting for your answers and explicit green light before proceeding.*

---
### [2026-05-13] Green Light Received — Implementation Proceeding

**Decisions locked:**
- Q1: `PUT /api/user/` — adding `updateUser` to `user.service.ts`
- Q2: Refactor in place at `src/components/layout/UserPersonalInfo.tsx`
- Q3: Component stays Controlled (Dumb) re: API. Button disabled while `isLoading` from App Slice
- Q4: `getPhrase(key, 'English Fallback')` from `useSplash` hook
- Q5: Password field completely hidden from DOM when `isPasswordReadOnly={true}`
- Q6: `Notification` component (`src/components/common/Notification.tsx`) — handled by parent

*Proceeding to implementation.*