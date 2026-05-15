# Plan: Signup Page - Refactor & Integration

## Task Overview
Build a robust, state-managed multi-step registration wizard. The component must handle dynamic step navigation based on user completion, integrate with authService for both Signup (POST) and Update (PUT) operations, and provide visual feedback via progress indicators and localized phrases.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @auth-api.yaml
    - @user-api.yaml
    - @user-personal-info-component.md
    - @user-financial-details-component.md
    - @user-consent-component.md    
    - Individual Specs: 
        - @signup-page.md


## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure and implementing SignUpPage.tsx with a multi-step Wizard (Step 1: Auth, Step 2: Economics, Step 3: Terms) . 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Logic & State Integration (Zustand & Auth Guard)**
- *State Selection*
    - Use `useStore` to pull `loggedinUser` and `isLoggedinUserCompleted` from the Auth Slice.
    - Pull `phrases` from `useSplash`.
    - Pull `isLoading` from the App Slice to manage button states.
    
- *Auth Guard & Initialization*
    - On mount, if `loggedinUser` exists:
        - Call `getNextOnboardingStep(user)`.
        - If the returned path is NOT `/signup`, redirect immediately to that path.

- *Form Data Sync*
    - Initialize local `formData` state from `loggedinUser` if it exists, ensuring consistent data flow between steps.

**Step 2: Visual Composition & Progress Indicators**
- Apply the structure from @signup-page.md.

- *Branding & Headers*
    - Use `Logo` and `ScreenHeader` with phrases: `registration_title` and `registration_subtitle`.
    
- *Step Tracking*
    - Verbal: Render `registration_steps_indicator` using `utilService.getPhrase` with `%1$d` (current step) and `%2$d` (total 3).

    - Visual: Implement Progress Bar with current percentage (step/3 X 100).

**Step 3: Step-by-Step Navigation & API Workflow**
- *Centralized Save Function (`saveUser`)
    - Create an internal async function that prepares the payload.
    
    - Logic: If `!loggedinUser` call `authService.signup`, else call `userService.updateUser`.
    
- *The Wizard Flow*
    - Step 1 (Personal): On `handleNext`, trigger `saveUser`. If success, move to step 2. Handle "Email taken" error specifically for this step.
    
    - Step 2 (Financial): On `handleNext`, trigger `saveUser`. If success, move to step 3.
    
    - Step 3 (Terms): On `handleFinish`, update `termsOfUseAccept` with a timestamp via `saveUser`.
    
    - Post-Completion: Call `setForceFetchSplash(true)` to refresh user permissions and navigate to `/`.
    
- *Global Error Handling*
    - Implement a `serverError` state that displays a `motion.div` alert if any API call fails with `signup_server_error`.

**Step 4: Styling & RTL (Tailwind)**
- *Layout*
    - Apply a centered card layout using `max-w-2xl mx-auto`.
    
    - RTL Logic: Use Tailwind logical properties (`text-start`, `space-x-reverse`) and ensure `dir="rtl"` is respected without hardcoded "right" alignments.
    
- *Animations*
    - Implement smooth step transitions using Tailwind's `animate-in fade-in slide-in-from-left-4 duration-500` (or right, depending on the direction).

- *Visual Feedback* 
    - Progress Bar: Use a `div` with `h-1.5 bg-slate-100 rounded-full overflow-hidden`, containing a child `div` with `bg-blue-600 transition-all duration-500 ease-out` for the width.

**Step 5: API & Infrastructure (The Engine)**
- *Auth Service Integration* 
    - `signup(details)`: POST to `/auth/signup`, save token, and decode user.
    
    - `updateUser(details)`: PUT to `/user/`, update local Zustand store with the returned user object.
    
- *Data Sanitization*
    - Ensure all numeric values (Equity, Incomes) are parsed via `utilService.parseNumber` within the `saveUser` function before sending the payload.

- *Tailwind Config Sync*:
    - Ensure `blue-600` and `slate-100` are defined in the config to match the progress bar and branding.


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

### [2026-05-13] AI Pre-Flight Questions

*AI says:*

After auditing `SignupPage.tsx`, `authService`, `userService`, `auth.slice.ts`, `user.utils.ts`, and the API YAML files, here are the critical blockers before writing any code:

---

**Q1 — `authService.signup()` is missing & its return type is ambiguous**

`auth.service.ts` has `login`, `logout`, `getLastLoggedinEmail` — but **no `signup()`**. It needs to be added.

The API YAML says `POST /auth/signup` returns a `UserData` object (not a JWT token), but `POST /auth/login` returns a raw JWT string.

- **Option A**: Signup returns a JWT (same as login) → we decode it with `jwtDecode`, save token, hydrate store — identical pattern to `login()`.
- **Option B**: Signup returns a `UserData` object → we store that directly, but have no JWT for subsequent `PUT /user` calls.

> Which response type does your backend actually return for `POST /auth/signup`?  
> Does it also set an auth cookie / return a token so subsequent `PUT /user` calls are authorized?

> *Your answer:* (A) Signup returns a JWT string.

Reasoning & Logic:
1. Consistency: The backend follows the same pattern for login and signup. Both return a JWT token which is the "Source of Truth" for the user's identity and permissions.
2. Authorization: We need that token to be stored (via userService.saveLocalUser) so that the subsequent calls to updateUser (Steps 2 and 3 of the wizard) will include the Authorization: Bearer <token> header.
3. Hydration: Decoding the token via jwt-decode is the correct way to populate the Zustand store with the initial loggedinUser data immediately after signup.

Implementation for auth.service.ts:
```TypeScript
async function signup(credentials: SignupCredentials): Promise<User> {
    // 1. POST to /auth/signup
    const token = await httpService.post<string>(BASE_URL + 'signup', credentials);
    
    if (token) {
        // 2. Save token to SessionStorage/LocalStorage
        userService.saveLocalUser(token);
        
        // 3. Decode and return the user object
        const user = jwtDecode<User>(token);
        return user;
    }
    
    throw new Error('Signup failed: No token received');
}
```

---

**Q2 — Step progression: internal counter vs. `getNextOnboardingStep()`**

The spec says "call `getNextOnboardingStep(user)` to determine the next station" after Step 1 and Step 2.

But `getNextOnboardingStep()` returns **route strings** (`/consent`, `/financial-details`, `/home`) — not step numbers. And its priority order is:
```
!termsOfUseAccept → '/consent'   ← a new user ALWAYS hits this first
!yearOfBirth      → '/personal-info'
!equity/incomes   → '/financial-details'
else              → '/home'
```

After Step 1 (signup), a new user has no `termsOfUseAccept` and no financial data → `getNextOnboardingStep` returns `/consent`, **skipping Step 2 (FinancialDetails) entirely**.

- **Option A**: Wizard goes **linearly 1→2→3** always. `getNextOnboardingStep` is used only for the auth guard on mount and for the final post-wizard redirect. Steps don't call it mid-wizard.
- **Option B**: `getNextOnboardingStep` IS used mid-wizard, and we must **map its return value** back to a step number (`/financial-details`→2, `/consent`→3, `/home`→navigate away). This requires fixing the function's priority order so a user with no financial data returns `/financial-details` even if `termsOfUseAccept` is also missing.

> Which behavior is intended?

> *Your answer:* (B) with a fix to the function's priority logic.

Reasoning:
We want the system to be State-Driven, not just 'Counter-Driven'. If a user loses connection in the middle of the Wizard and returns, the application needs to know exactly where they stopped according to the data existing about them in the DB, and not always start from Step 1.

The Fix:
1. Update the Priority Logic: The getNextOnboardingStep function must follow the chronological order of the Wizard:
    - !yearOfBirth (or other core personal info) → /personal-info (Step 1)
    - !equity (or financial info) → /financial-details (Step 2)
    - !termsOfUseAccept → /consent (Step 3)
    - else → /home
2. Internal Mapping: Inside the SignupPage, we will map these routes to the internal step state:
    - /personal-info → setStep(1)
    - /financial-details → setStep(2)
    - /consent → setStep(3)

Why this is better:
- Resilience: If a user completes Step 1 and then refreshes the page, the Auth Guard will call the function, see that they have personal info but no financial info, and automatically land them on Step 2.
- Consistency: The "Next" logic and the "Auth Guard" logic use the exact same "Source of Truth" — the state of the loggedinUser object.

Action for Claude:
Refactor getNextOnboardingStep to prioritize Step 2 (Financial) before Step 3 (Consent), and use it both for the initial mount and for calculating the transition after each successful saveUser call.

---

**Q3 — Post-completion destination**

After Step 3 (consent accepted, `PUT /user` success):

- **Option A**: Call `getNextOnboardingStep(updatedUser)` → navigate to that route (should be `/home` if all data is now complete).
- **Option B**: Always navigate to `/` and let the app's router/auth guard redirect from there.
- **Option C**: Navigate directly to `/home`.

The plan says "navigate to `/`" but also mentions `getNextOnboardingStep`. Which is canonical?

> *Your answer:* (A) but specifically using / as the primary target.

Here is the reasoning:
- Consistency: Since we decided the system should be State-Driven, we should trust the state to tell us where to go next. If getNextOnboardingStep is our "Source of Truth," it should have the final word.
- Safety Net: Navigating to / (Option B) is functionally equivalent if your App.tsx or Guard already uses getNextOnboardingStep to protect routes. However, triggering it explicitly after the API call ensures there is no "UI flicker" where the user sees the Signup page again for a split second before the guard kicks in.

The Logic for Claude:
After Step 3 success:
1. Call setForceFetchSplash(true) (to refresh permissions/state).
2. Calculate const nextPath = getNextOnboardingStep(updatedUser).
3. Maps(nextPath) (which, if the flow is complete, will be /home or /).

Refined Response for Claude:
"We want the system to be State-Driven, not just 'Counter-Driven'. If a user loses connection in the middle of the Wizard and returns, the application needs to know exactly where they stopped according to the data existing about them in the DB, and not always start from Step 1.

Therefore, after Step 3, use Option A: re-evaluate the state using getNextOnboardingStep(updatedUser) and navigate to the result. This ensures the user is only sent to the dashboard once the DB confirms their profile is 100% complete."

---

**Q4 — `registration_steps_indicator` phrase format**

The plan says the step indicator should use the phrase key `registration_steps_indicator` with `%1$d` (current step) and `%2$d` (total steps). But `getPhrase(key, fallback)` in `useSplash` does **no format substitution** — it returns the raw phrase string.

- **Option A**: Use a `replace('%1$d', step).replace('%2$d', 3)` pattern after calling `getPhrase`.
- **Option B**: Use separate phrase keys `registration_step_current` / `registration_step_total` and compose them.
- **Option C**: Keep the step indicator as inline JSX (as it is now), just switch to using `registration_steps_indicator` as a template and apply substitution.

> How should the format substitution be handled for this phrase?

> *Your answer:* (A) Use a `replace('%1$d', step).replace('%2$d', 3)` pattern after calling `getPhrase`.

---

**Q5 — Scope: does `UserConsent` (Step 3) stay in the wizard, or is it handled by a separate `/consent` page?**

There is already a `ConsentPage` in the skills for a standalone `/consent` route. The current `SignupPage.tsx` includes `UserConsent` as Step 3.

- **Option A**: Keep the wizard as 3 steps (PersonalInfo → FinancialDetails → Consent) all within `SignupPage`. After consent the user lands at `/home`.
- **Option B**: Wizard has only 2 steps (PersonalInfo → FinancialDetails). After Step 2 success, redirect to `/consent` (separate page). The `registration_steps_indicator` shows "2 מתוך 2".

> Is Step 3 (consent) part of this signup wizard, or handled by the separate ConsentPage?

> *Your answer:* Step 3 is part of the signup wizard.

---

*Waiting for answers before writing any code.*

---

### [2026-05-14] Implementation — Decisions Applied

**Decisions recorded:**
- Q1 → `authService.signup()` added: POST `/auth/signup`, saves JWT to storage, decodes via `jwtDecode`, returns `User`. Mirrors `login()` exactly.
- Q2 → `getNextOnboardingStep` refactored with chronological priority: personal → financial → consent → home. Added empty-string guards for financial fields. `STEP_ROUTE_MAP` in `SignupPage` maps `/personal-info`→1, `/financial-details`→2, `/consent`→3.
- Q3 → Post-completion: `forceFetchSplash()` + `navigate(getNextOnboardingStep(updatedUser))`. If all data complete, resolves to `/home`.
- Q4 → `getPhrase('registration_steps_indicator', 'שלב %1$d מתוך %2$d').replace('%1$d', step).replace('%2$d', TOTAL_STEPS)`.
- Q5 → Step 3 (consent) remains in the signup wizard. Standalone `/consent` page is a future task.

**Files changed:**
- `src/utils/user.utils.ts` — Fixed `getNextOnboardingStep` priority order
- `src/services/auth.service.ts` — Added `SignupCredentials` interface + `signup()` function
- `src/pages/SignupPage.tsx` — Full refactor: auth guard, `saveUser` async function, phrase keys, `dir="rtl"`, loading state, step routing via `getNextOnboardingStep`