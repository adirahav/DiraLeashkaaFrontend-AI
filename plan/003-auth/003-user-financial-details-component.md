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
    
---
### [2026-05-13] Pre-Flight: AI Clarifying Questions (STOP-AND-ASK Gate)

*AI says:*

After reading `raw_from_ai_studio/components/layout/UserFinancialDetails.tsx`, `src/services/util.service.ts`, `src/store/slices/auth.slice.ts`, `src/types/index.ts`, and the component spec, I have identified 5 gaps that must be resolved before any code is written.

---

**Q1 — `utilService.parseNumber` does not exist**

The plan says: *"Use `utilService.parseNumber` to clean formatted strings (with commas) into pure numbers before updating state."*

However, `src/services/util.service.ts` only exposes storage helpers (`saveToStorage`, `getFromStorage`, etc.). The only relevant helper lives in `formatUtils.service.ts` and is used internally by `NumericInput`.

**Options:**
- **(a)** Add a `parseNumber` function to `util.service.ts`.
- **(b)** Import and reuse the existing strip-commas logic from `formatUtils.service.ts`.
- **(c)** Inline a one-liner (`Number(val.toString().replace(/,/g, ''))`) inside the component — no new exports needed.

> Which approach do you want? *(Default recommendation: option **c** — inline, no new exports, matching the raw_from_ai_studio pattern.)*

> *Your answer:* (B) Use formatUtils.service.ts for all number-stripping logic.

Reasoning:
1. Architecture Consistency: As you noted, formatUtils.service.ts is the designated place for all formatting and unformatting logic. It’s where we handle currency symbols, commas, and numeric transformations.
2. DRY (Don't Repeat Yourself): Inlining the logic (option c) is prone to errors—if we ever decide to change how we handle decimals or different currency symbols, we don't want to hunt down every component that used a regex.
3. Single Source of Truth: By having a centralized parseNumber (or stripCommas) in formatUtils, we ensure that the way we "read" numbers from the UI is always the same way we "format" them.

Action:
- If formatUtils.service.ts doesn't already export a public parseNumber function, export it now.
- The component will import it: import { formatUtils } from '@/services/formatUtils.service'.
- Use it during the onChange or onSubmit phase to sanitize the data before sending it to the state/API. 

---

**Q2 — `additionalFundingSources` type mismatch between UI and API**

`UserUpdateData` (in `user.service.ts`) types `additionalFundingSources` as `string`.  
`AdditionalFundingSourcesEditor` produces `{ id: string; source: string; amount: string; repayment: string }[]`.  
The `User` interface in `src/types/index.ts` has no `additionalFundingSources` field at all.

Before `onSubmit` calls `userService.updateUser`, the array must be serialized.

**Options:**
- **(a)** `JSON.stringify(formData.additionalFundingSources)` — send as a JSON string.
- **(b)** A different serialization format — please specify.

Also: Should the `User` interface gain an `additionalFundingSources` field (and if so, what type: `string` or the object array)?

> What is the expected API contract and whether `User` needs updating?

> *Your answer:* 
Decision: Maintain as a structured Array (Object) and update the User interface.

Reasoning:
1. API Consistency: According to the previous logic, the server (userService.save) is designed to receive a structured object where additionalFundingSources is an array of mapped objects. Serialization via JSON.stringify (Option A) would likely break the backend schema or force unnecessary parsing on the server side.
2. Type Safety: Using a raw string for a complex list is a "code smell." We want TypeScript to alert us if we forget a field (like repayment) or pass a string instead of a number.

Implementation Details:
- Update User Interface: Add the field to your User (and UserUpdateData) interface in src/types/index.ts:

```TypeScript
interface AdditionalFundingSource {
    source: string;
    amount: number;
    repayment: number;
    uuid: string;
}

// Inside User interface:
additionalFundingSources: AdditionalFundingSource[];
```

- Data Transformation (The Engine): Before calling userService.updateUser, perform the mapping as shown in your original code. Ensure that numbers are sanitized using formatUtils.parseNumber (as per Q1):

```TypeScript
const payload = {
    ...formData,
    additionalFundingSources: formData.additionalFundingSources.map(source => ({
        source: source.source,
        amount: formatUtils.parseNumber(source.amount),
        repayment: formatUtils.parseNumber(source.repayment),
        uuid: source.uuid
    }))
};
```

- Dispatch Logic: After the API call succeeds, the store.dispatch should update the user in the Zustand store with this same structured data.

---

**Q3 — Auth Slice has no `updateUser` action**

The plan says: *"sync to Zustand/API only on final submission"*. But `auth.slice.ts` only exposes `setLoggedinUser` — there is no `updateUser` thunk.

**Options:**
- **(a)** Add an `updateUser(data: UserUpdateData)` async action to `auth.slice.ts` that calls `userService.updateUser` then updates `loggedinUser` in one atomic slice action.
- **(b)** Keep the component responsible: call `userService.updateUser(data)` directly, then call `setLoggedinUser({ ...loggedinUser, ...data })` from the component.

> Which pattern do you prefer — keep the slice thin (option **b**) or push the update logic into the slice (option **a**)?

> *Your answer:* (B) Keep the slice thin—Component orchestrates, Service executes.

Reasoning:
1. Separation of Concerns: As you noted, updateUser logic belongs to the userService. The Store (Zustand) is a data repository, not a business logic engine. Its job is to hold the state, not to know how to communicate with the server.
2. Explicit Flow: Keeping the logic in the component (or the Page) makes the data flow much more readable. You can clearly see: API Call -> Success -> Update Store.
3. Consistency: This matches the existing project pattern where the store is kept "thin" and the heavy lifting is done in services.

Implementation Details:
- The component/page will call userService.updateUser(payload).
- Upon a successful response from the server, call the existing setLoggedinUser(updatedUser) from the store to sync the global state.
- This ensures the UI is always a reflection of the latest data from the database.

Refined Action Flow:
1. Component validates local state.
2. Component calls userService.updateUser(sanitizedData).
3. userService returns the savedUser object from the API.
4. Component calls useStore.getState().setLoggedinUser(savedUser).
5. Success notification is triggered.

---

**Q4 — Error feedback on submission failure: notification or modal?**

The plan says: *"On Failure: Show `dialog_data_error_title`."*

The prefix `dialog_` suggests a Modal, but the App Slice already has `setNotification({ message, type: 'error' })` which drives the existing `Notification` component. Opening a Modal from inside a layout component would require additional wiring.

**Options:**
- **(a)** Use `setNotification` with type `'error'` — consistent with the success notification pattern.
- **(b)** Open a Modal dialog — please specify which modal component and how to trigger it.

> Which failure UX is intended?

> *Your answer:* (A) Use the Notification component for error feedback.

Reasoning:
1. UI Consistency: Since we already established the "success" flow uses setNotification, it makes sense for the "error" flow to follow the same visual pattern. Mixing Notifications for success and Modals for errors creates a fragmented user experience.
2. Infrastructure Readiness: You have a dedicated Notification component designed exactly for this purpose. Using it is cleaner and doesn't require the overhead of managing modal states (open/close/backdrop).
3. Phrase Mapping: Even though the key is named dialog_data_error_title, we will treat it as the message body for our error notification. The prefix is just a legacy naming convention from the AI Studio raw files; what matters is the localized content it provides.

Implementation Detail:
When the API call fails, simply trigger the error notification via the App Slice:

```TypeScript
setNotification({ 
    message: getPhrase('dialog_data_error_title', phrases), 
    type: 'error' 
});
```

We are prioritizing the Notification system for all submission feedback. This keeps the logic simple, the UI consistent, and makes full use of the component we just refactored.

---

**Q5 — Next button layout when `onPrev` is absent in wizard mode**

The plan specifies a **2-column grid** for wizard navigation buttons. But in the first wizard step, `onPrev` is not provided.

**Options:**
- **(a)** Next button spans both columns (`col-span-2`) when `onPrev` is absent.
- **(b)** Next button stays in the right column only (left column is empty).
- **(c)** Render a single full-width button (no grid) when only `onNext` is present.

> Which layout behavior is expected for the button row when there is no back button?

> *Your answer:* (C) Render a single full-width button when onPrev is absent.

Reasoning:
1. AI Studio Fidelity: Following the design language from AI Studio, when there is only one primary action (like "Next" on the first step), the button should occupy the full width of the container. This provides a clear, centered call-to-action.
2. Visual Balance: A 2-column grid with an empty left cell (Option B) looks like a bug or a missing element. A button spanning both columns (Option A) or a simple full-width block (Option C) ensures the UI feels "complete."
3. Clean Code: We will use a conditional layout. If onPrev exists, use a 2-column grid (grid grid-cols-2 gap-4). If it doesn't, just render the single button as a full-width block.

Implementation Detail:
Ensure the button maintains the consistent styling (padding, rounding, and font) regardless of whether it's alone or paired.

---

**>> WAITING FOR YOUR ANSWERS. No code will be written until you reply. <<**

---
### [2026-05-13] Implementation Decisions & Execution Log

*AI says:*

All 5 questions answered. Implementation is complete. Summary of decisions applied:

| Decision | Applied |
|---|---|
| Q1: parseNumber | Added `parseNumber` to `formatUtils.service.tsx`; imported in component |
| Q2: additionalFundingSources | Added `AdditionalFundingSource` interface to `types/index.ts`; updated `User` and `UserUpdateData`; `id` (editor key) maps to `uuid` on API payload |
| Q3: Auth Slice stays thin | Component calls `userService.updateUser` directly (profile mode only), then `setLoggedinUser({ ...loggedinUser, ...updated })` |
| Q4: Error UX | `setNotification({ message: getPhrase('dialog_data_error_title'), type: 'error' })` |
| Q5: No onPrev → full-width | Single full-width `<Button>` rendered; 2-column grid only when `onPrev` is also present |

**Files changed:**
- `src/services/formatUtils.service.tsx` — added `parseNumber` export
- `src/types/index.ts` — added `AdditionalFundingSource`, updated `User`
- `src/services/user.service.ts` — `additionalFundingSources` typed as `AdditionalFundingSource[]`
- `src/components/layout/UserFinancialDetails.tsx` — full rewrite with Zustand + SplashContext

**Wizard vs Profile behaviour:**
- `wizard`: button click → validate → call `onNext()` (no API call, parent navigates)
- `profile`: button click → validate → `setIsLoading(true)` → `userService.updateUser` → `setLoggedinUser` → success/error notification → `onNext?.()` → `setIsLoading(false)`

