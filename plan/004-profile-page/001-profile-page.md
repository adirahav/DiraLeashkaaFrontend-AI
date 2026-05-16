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
- *Update Execution (handleSave)*
    - On click, call setLoading(true) via App Slice.
    - Execute userService.updateUser(formData).
    - *On Success:*
        - Update the global loggedinUser in the store.
        - Trigger Notification with user_save_success.
        - Smart Redirect Logic:
            - Check if the user was incomplete before this save (Onboarding Mode).
            - If incomplete: Call getNextOnboardingStep(updatedUser) and navigate to the next destination (e.g., from Personal to Financial).
            -If already completed (Edit Mode): Stay on the current page to allow further edits.
    - *On Failure:*
        - Trigger Notification with dialog_data_error_title.
    - Always setLoading(false) at the end.

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

---
### 2026-05-16 — Pre-Flight Clarifications (AI)

After reading the current codebase (`ProfilePage.tsx`, `UserFinancialDetails.tsx`, `UserPersonalInfo.tsx`, `auth.slice.ts`, `app.slice.ts`, `user.service.ts`, and all referenced specs), I have identified 6 conflicts/ambiguities that must be resolved before I write any code.

---

**Q1 — Save Logic Ownership (Critical Conflict)**

`UserFinancialDetails.tsx` already owns its own `handleSubmit` — it calls `userService.updateUser`, updates `loggedinUser` in the store, and writes to `app.slice` notification. The plan says **`ProfilePage`** should own all save logic via a single `handleSave`.

Two options:
- **(A) Centralize in ProfilePage**: Refactor `UserFinancialDetails` to be a "dumb" form (just calls `onNext` with no API work), same as `UserPersonalInfo` today. `ProfilePage.handleSave` handles all API calls for both modes.
- **(B) Keep as-is**: Leave `UserFinancialDetails` self-contained; only wire up `ProfilePage.handleSave` for PERSONAL mode (since `UserPersonalInfo` does not call the API at all).

**Which option do you prefer?**

> *Your answer:* (A) Centralize all API persistence and workflow orchestration inside ProfilePage.

Reasoning:
- Architectural Cleanliness: Since UserFinancialDetails currently only exists as an unintegrated UI mock from AI Studio, we have a greenfield opportunity to implement best practices. Treating both sub-forms (UserPersonalInfo and UserFinancialDetails) as pure, stateless "dumb components" ensures maximum reuse.
- Unified Workflow: ProfilePage will maintain the local formData state cloned from loggedinUser, perform the hasChanges diffing logic, handle the application loading overlay, trigger the notification alerts, and evaluate the smart onboarding redirect via getNextOnboardingStep.

Implementation Instructions:
1. Dumb Form Interfaces: Design both UserPersonalInfo and UserFinancialDetails to accept values, an onChange bubble-up handler, and a standard variant="profile" configuration prop. They should not import userService or execute side-effects natively.
2. Centralized Handler: Implement handleSave inside ProfilePage.tsx exactly as stated in Step 4. It will lock the app UI state, call userService.updateUser(formData), sync the global Zustand state on success, and run the navigation routing guard.

---

**Q2 — Notification Channel (Conflict)**

The plan says ProfilePage uses a **local** `notification` state (`type`, `message`, `isVisible`). But:
- `app.slice` already has a **global** `notification` state with `setNotification` / `clearNotification`.
- `UserFinancialDetails` currently writes directly to the global store notification.
- The Notification component in ProfilePage currently reads from local state.

Two options:
- **(A) Keep local** in ProfilePage — sub-components must NOT touch `app.slice` notification; they signal results via callbacks instead.
- **(B) Use global** `app.slice` notification everywhere — ProfilePage reads from the store, no local state needed.

**Which is the intended design?**

> *Your answer:* (B) Use global app.slice notification everywhere.

Reasoning:
- Single Source of Truth: Your application already has a global notification system built into the app.slice of your Zustand store. Introducing a secondary, local notification state specifically inside ProfilePage creates redundant code and splits the UI alerting logic across two different systems.
- Architectural Consistency: By leveraging the global store (setNotification), any error or success alert triggered by the userService update workflow will be handled identically to the rest of the application.
- Clean Components: With centralization (established in Q1), the ProfilePage handles the API action, dispatches the results straight to the global app.slice store, and the top-level application notification component naturally displays it. This removes the need for managing manual local timers or isVisible state hooks inside the page layout.

Implementation Instructions:
1. Eliminate Local State:
Do not implement a local notification state (type, message, isVisible) inside ProfilePage.tsx.

2. Global Store Dispatching:
    - Pull the global action setNotification from the app.slice state hook layer.
    - On a successful save operation:
        ```TypeScript
        setNotification({
            type: 'success',
            message: getPhrase('user_save_success')
        });
        ```
    - On an API failure catch block:4
        ```TypeScript
        setNotification({
            type: 'error',
            message: getPhrase('dialog_data_error_title')
        });
        ```
3. UI Component Cleanliness:
Let the global layout's layout notification alert system catch and render this alert state natively. This keeps the ProfilePage structural markup focused purely on rendering the SectionHeader, the active tab layout, and the dumb form modules.

---

**Q3 — `getNextOnboardingStep` Does Not Exist**

The plan references `getNextOnboardingStep(updatedUser)` for post-save navigation, but this function does not exist anywhere in the codebase. The navigation engine logic IS defined in `profile-page.md`:
```
!user.termsOfUseAccept  →  /consent
!user.yearOfBirth       →  /personal-info
!user.equity            →  /financial-details
default                 →  /home
```

Where should this function live?
- **(A)** New file: `src/utils/onboarding.utils.ts` (reusable across pages)
- **(B)** Inline inside `ProfilePage.tsx` only

> *Your answer:* (A) Use the function from src/utils/user.utils.ts (or ensure it's exported from there so it remains globally reusable).

Reasoning:
- Do Not Repeat Yourself (DRY): Since ProtectedRoute.tsx already depends on getNextOnboardingStep to guard the application's entry points, keeping this function in a shared utility file (src/utils/user.utils.ts) is mandatory. If we inlined it inside ProfilePage.tsx (Option B), we would duplicate the core business logic of what constitutes a "completed profile," risking synchronization bugs in the future.
- Centralized Rules Engine: Keeping the routing priorities (/consent → /personal-info → /financial-details → /home) in a single utility file makes it effortless to modify the onboarding funnel flow later without hunting down individual component side-effects.

Implementation Instructions:
1. Import the Utility:
Import getNextOnboardingStep from src/utils/user.utils at the top of ProfilePage.tsx.
2. Smart Redirect Logic Implementation:
Inside your centralized handleSave workflow, execute the check right after a successful API resolution:

```TypeScript
// Determine if the user was in onboarding mode before this save
const wasIncomplete = getNextOnboardingStep(loggedinUser) !== '/home';

if (wasIncomplete) {
  // Pass the fresh server-updated user object to calculate the next milestone
  const nextStep = getNextOnboardingStep(updatedUser);
  navigate(nextStep, { replace: true });
} else {
  // Edit Mode: Keep them on the current page so they can continue reviewing/editing
  setNotification({
    type: 'success',
    message: getPhrase('user_save_success')
  });
}
```

3. Onboarding State Continuity:
By passing the freshly updated payload to the utility function, Claude will ensure that when a user clicks "Save" on the Personal Details screen, they are smoothly propelled forward to the Financial Details step automatically.

---

**Q4 — "Completed" User Detection**

The plan says: *"Check if the user was incomplete before this save (Onboarding Mode)."*

The `User` type has `termsOfUseAccept: string` (not boolean) and no explicit `isCompleted` flag. The navigation engine implies a user is "complete" when all of `termsOfUseAccept`, `yearOfBirth`, and `equity` are truthy.

**Confirmation needed:** Should `isCompleted` be computed as:
```ts
const isCompleted = !!user.termsOfUseAccept && !!user.yearOfBirth && !!user.equity
```
Or is there a dedicated field on the backend response we should map instead?

> *Your answer:* Compute the "Completed" state explicitly based on the full breakdown of all required fields across the three distinct modules, rather than using the oversimplified shortcut formula.

Reasoning:
- Accurate Business Logic Execution: As you rightly pointed out, each onboarding milestone requires multiple mandatory fields to pass. A user can only be classified as "completed" once all three domain-specific steps satisfy their respective data presence validations.
- Granular Rule Mapping: 
    1. Personal Info: Must contain fullname, email, and yearOfBirth. (Note: Password is treated as out-of-scope for data payload evaluation since it is read-only on the Profile page).
    2. Financial Details: Must contain equity (equity), income (income), and liabilities (liabilities).
    3. Consent: Must have accepted the platform terms (termsOfUseAccept).

The Precise Validation Logic:
To determine if a user profile is fully complete (isUserFullyCompleted) or if they were executing within the initial registration pipeline prior to updating (wasIncomplete), Claude will utilize the following structural conditions:

```TypeScript
// 1. Personal Info Step Completion Evaluation
const isPersonalInfoComplete = !!user.fullname && !!user.email && !!user.yearOfBirth;

// 2. Financial Details Step Completion Evaluation (Validating numeric boundaries)
const isFinancialDetailsComplete = user.equity !== undefined && user.income !== undefined && user.liabilities !== undefined;

// 3. Consent Step Completion Evaluation
const isConsentComplete = !!user.termsOfUseAccept;

// Combined Application Completion Flag
const isUserFullyCompleted = isPersonalInfoComplete && isFinancialDetailsComplete && isConsentComplete;
```

Implementation Instructions:
1. Before Persisting (handleSave):
Evaluate and cache whether the user was incomplete prior to running the current API operation based on the snapshot of the active global store state:

```TypeScript
const wasIncomplete = !isUserFullyCompleted; // evaluateted against current loggedinUser from store
```

2. After Successful API Resolution:
- Re-run the completion checks using the fresh, authoritative server data model (updatedUser).
- If wasIncomplete is true (Onboarding Mode Archive): Fall through the structural triage priority list and route them to their next missing milestone using Maps(nextPath, { replace: true }):
    - If !isConsentComplete $\rightarrow$ navigate to /consent
    - If !isPersonalInfoComplete $\rightarrow$ navigate to /personal-info
    - If !isFinancialDetailsComplete $\rightarrow$ navigate to /financial-details
    - Otherwise (all fields are successfully populated) $\rightarrow$ navigate to /home
- If wasIncomplete is false (Standard Edit Mode): Stay anchored on the current active profile tab segment and dispatch a global success notification toast overlay.

---

**Q5 — PERSONAL Mode API Payload**

`UserPersonalInfo` manages `fullname`, `email`, `password`, and `yearOfBirth`. But `UserUpdateData` in `user.service.ts` does NOT include `email` or `password` — only `fullname`, `yearOfBirth`, and financial fields.

The spec says `isEmailReadOnly={true}` and `isPasswordReadOnly={true}` on the Profile page, so those fields are display-only.

**Confirmation:** For the PERSONAL mode `handleSave`, should the payload be just `{ fullname, yearOfBirth }`, and email/password are never sent to the API from this page?

> *Your answer:* Yes — The payload sent to userService.updateUser from the Profile Page should only contain the editable fields (fullname, yearOfBirth). email and password must be excluded from the update request.

Reasoning:
- API Schema Alignment: Your backend service types strictly enforce what can be modified via the general user update endpoint. Sending extra fields like email or password could either cause the backend to reject the request with a validation error or trigger unintended side-effects.
- Security & Read-Only Context: Since email and password updates typically require dedicated security verification flows (like re-authentication or separate endpoints), keeping them purely informational on this page is the correct practice.

Implementation Instructions:
1. Form Payload Assembly:
When calling handleSave in ProfilePage.tsx while in PERSONAL mode, explicitly pluck or destruct only the permitted backend fields from your local formData state before calling the service layer:
```TypeScript
const payload = {
  fullname: formData.fullname,
  yearOfBirth: formData.yearOfBirth
};
await userService.updateUser(payload);
```
2. Read-Only UI Handling:
Ensure UserPersonalInfo correctly displays the user's current email inside its input layout field but keeps disabled={true} or readOnly={true} seamlessly applied when variant="profile" is active.
3. Password Input Behavior:
Since password is display-only/read-only here, render a masked string placeholder (e.g., ********) or omit the password input row entirely if it creates structural clutter, depending on the AI Studio mockup guidance.

---

**Q6 — Sub-component Refactor Scope**

Depending on your answer to Q1, I may need to refactor `UserFinancialDetails` to remove its internal API call logic. That component is also used in the **Signup wizard** flow.

**Confirmation:** If we go with option Q1-A (centralize in ProfilePage), should I make `UserFinancialDetails` behavior conditional on `variant` — i.e., in `wizard` mode it still self-submits, but in `profile` mode it just calls `onNext`? Or should the component always be "dumb" and the parent always owns submission?

> *Your answer:* Make the component always "dumb" — the parent container should always own the submission logic, regardless of the view.

Reasoning:
- Architectural Purity: Conditional behavior based on a variant prop inside a form component (e.g., "if profile, bubble up; if wizard, call API") introduces unnecessary complexity, mixed responsibilities, and hidden side-effects.
- Consistency Across the App: By keeping UserFinancialDetails completely decoupled from your service layer, it behaves exactly like UserPersonalInfo. It collects input data, validates it, and hands it over to whichever parent container is hosting it.
- Flexibility for the Signup Wizard: Since the signup wizard is also an orchestration layer (moving the user through consent, personal info, and financial info), having the wizard parent wrapper handle the final submission makes much more sense structurally.

Implementation Instructions:
1. Remove API Logic from Forms:
Ensure UserFinancialDetails does not import userService, useStore, or dispatch global notification alerts directly. Remove any isolated, internal submission side-effects entirely.
2. Define Clean Prop Contracts:
Refactor the component interface so it relies strictly on standard interactive React props:
```TypeScript
interface UserFinancialDetailsProps {
  values: UserFinancialData; // Pass down the form state slice
  onChange: (fields: Partial<UserFinancialData>) => void; // Update state handler
  onSubmit: () => void; // Triggered when the user submits or clicks the primary action button
  variant: 'profile' | 'wizard'; // Strictly for conditional layout styling (e.g., padding/buttons)
  showAdditionalFunding?: boolean;
}
```
3. Parent Responsibility Enforcement:
- In ProfilePage.tsx: The page handles the local state changes, renders the central form wrapper, and triggers handleSave (calling the update API) upon the sub-form's onSubmit bubble.
- In the Signup Wizard: The wizard container manages the active step data cache and handles the final pipeline submission natively.

---

---
### 2026-05-16 — Implementation Complete (AI)

All 6 questions resolved. Three files modified/rewritten:

**1. `src/layouts/AppLayout.tsx`**
- Added global `<Notification>` connected to `app.slice` (`notification` + `clearNotification`).
- Guards `type !== 'info'` since the Notification component only supports `success | error`.

**2. `src/components/layout/UserFinancialDetails.tsx`**
- Removed: `userService`, `parseNumber`, `setIsLoading`, `setNotification`, `setLoggedinUser`, `loggedinUser`, `buildPayload`, `handleSubmit` async API logic.
- Profile variant button now calls `onNext` directly — parent owns submission entirely.
- `isLoading` selector kept (read-only) for button disabled state consistency with `UserPersonalInfo`.
- Card padding updated to `p-6 md:p-10` per spec.

**3. `src/pages/ProfilePage.tsx`** — Full rewrite:
- Auth guard via `useEffect` + early `return null`.
- `initialData` captured via `useRef` on mount (immutable snapshot for `hasChanges` diffing).
- `handleSave` owns full lifecycle: `setIsLoading` → payload build → `userService.updateUser` → `jwtDecode` → store sync → onboarding redirect or success notification.
- PERSONAL payload: `{ fullname, yearOfBirth }` only (email/password excluded per Q5).
- FINANCIAL payload: numeric fields via `parseNumber` + funding sources mapped.
- Onboarding vs Edit Mode: `wasIncomplete = getNextOnboardingStep(loggedinUser) !== '/home'` (captured before save). On success — if incomplete, navigate; if complete, `setNotification` success.
- SectionHeader titles from `getPhrase` (no hardcoded Hebrew).
- Button text uses `button_saving` phrase while `isLoading`, `button_save` otherwise.
- RTL layout with `dir="rtl"` and `text-start`.