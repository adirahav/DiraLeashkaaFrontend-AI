# Plan: Login Page - Extraction & Refactor

## Task Overview
Build a high-fidelity, state-aware Login Page. The page must handle user authentication, form validation, persistent email retrieval, and conditional navigation. It will use the new atomic components while maintaining integration with the existing Zustand store and authService.

*Reference:* Use the specialized knowledge in
    - @.claude\skills\ui-component-layer\SKILL.md
    - @.claude\skills\state-management-layer\SKILL.md
    - @.claude\skills\api-layer\docs\auth-api.yaml
    - @.claude\skills\service-layer\SKILL.md
    - Individual Specs: 
        - @.claude\skills\page-layer\pages\login-page.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (Zustand & Services)**
- *State Selection*
    - Use the unified `useStore` hook to pull `loggedinUser` and `isLoggedinUserCompleted` from the Auth Slice.
    - Pull `phrases` from `useSplash` context.

- *Initialization*
    - On useEffect (mount): Call authService.getLastLoggedinEmail() to pre-fill the email state.
    - Implement the Auth Guard: If the user is already logged in and completed, redirect to /home.

- *Form Logic*
    - Use local state for email and password values.
    - Implement a useEffect to validate fields in real-time (Regex for email, min-length for password) and toggle the isDisabled state of the submit button.

**Step 2: Refactor & Visual Composition**
- Apply the structure from @login-page.md.

- *Layout Construction* 
    - Wrap everything in a motion.div for entrance animations (Stagger children).
    - *Header Group:* Display Logo (showText={true}) followed by h1 and p using phrases login_header and login_subheader.

- *Form Fields* 
    - *Email:* Use EmailInput. Pass value, onChange, and error phrases.
    - *Password:* Use PasswordInput.
    - *Global Error:* Implement a motion.div above the fields that renders ONLY if the error state is populated from a failed login attempt.

- *Actions*
    - *Submit:* Use Button component. Show loading spinner when isLoadingState is true.
    - *Links:* Implement NavLink for "Forgot Password" and "Sign up" using the specific phrase keys.

**Step 3: Auth & Navigation Workflow**
- *The Login Flow* 
    - On handleSubmit:
        1. Call `setLoading(true)` via the App Slice.
        2. Call the `login(email, password)` service/action.
        3. On Success:
            - Set `setForceFetchSplash(true)`.
            - Navigate based on `isLoggedinUserCompleted`.
        4. On Failure:
            - Set local error state.
            - Call `setLoading(false)`.

- *Persistence*
    - Ensure the login action correctly saves the token and updates the localStorage via utilService.saveToStorage.

**Step 4: Styling & RTL (Tailwind)**
- *Styles*
    - Implement a centered card layout (max-w-md) using Flexbox.
    - Apply text-align: right and direction: rtl to ensure Hebrew labels and placeholders align correctly.
    - Mobile: Ensure padding and font sizes adjust for small screens (using @mobile mixin or media queries).
    - Animations: Define the y: 20 -> 0 transition for form elements.

**Step 5: API & Infrastructure (The Auth Engine)**
- *Http Service Implementation*
    - Axios Instance: Create `src/services/http.service.ts` following the @api-layer template.

    - JWT Handling: Configure the interceptor to attach the Authorization: Bearer <token> header to every request if a token exists in localStorage.
        - Note: The Axios interceptor should fetch the token directly from localStorage or via utilService.getFromStorage to ensure it's always fresh.

- *Auth Service Refactor (auth.service.ts)*
    - Login Request:
        - Method: POST to `/auth/login`.
        - Crucial: The backend returns a raw JWT string, not a JSON object. The httpService must be instructed to treat the response as a string.

    - Post-Login Workflow:
        - Storage: Save the raw string to localStorage under the key 'token'.
        - Decoding: Use jwt-decode to extract the user object from the token.
        - Email Persistence: Save the user's email under `STORAGE_KEY_LAST_LOGGEDIN_EMAIL` for the "Welcome Back" pre-fill feature.
        - Return: The service must return the decoded user object to the Zustand action.

- *Zustand Action Mapping*
    - Action: In user.actions.js (or slice), call `authService.login()`.
    - State Update: Once the decoded user is received, update the `loggedinUser` in the store.
    - Splash Refresh: Immediately call `setForceFetchSplash(true)` to ensure the UI language and parameters match the newly logged-in user's profile.

- *Data Cleanup* 
    - Ensure the email is trimmed and lowercased before being sent to the httpService.

- *Error Handling & UI Cleanup*
    - Dynamic Error Reset: Implement a useEffect or an onChange handler that clears the global server error state as soon as the user starts typing in either the `Email` or `Password` fields. This ensures the red "Login Error" alert disappears once the user attempts to correct their credentials, providing a smoother UX.

- *Implementation Notes*
    - Backend Contract Warning: The `/auth/login` endpoint returns a plain text/string (JWT). Do NOT attempt to access response.data.token. Use the response.data directly as the token string.
    - Security: Ensure http.service.ts clears the localStorage and redirects to `/login` if a 401 Unauthorized response is intercepted.
    - Dependencies: Ensure jwt-decode is installed in package.json before implementation.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Toggle `isLoading` during the async login process.

- *Auth Slice:* Update `loggedinUser` state upon successful response.

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
## [2026-05-12] Pre-Flight Clarification — AI Questions

*AI says:*

I have audited the codebase against this plan. Below are 6 questions that must be answered before code generation begins. Decisions are recorded here so they become permanent context for the implementation.

---

### Q1 — `isLoggedinUserCompleted`: Origin & Definition

The plan references `isLoggedinUserCompleted` from the Auth Slice, but this field does not exist in `auth.slice.ts` or the `User` type (`src/types/index.ts`).

**How is "completed" determined?**

- **(a) Backend field** — The decoded JWT contains a boolean field (e.g., `isCompleted`) and it must be mapped into the `User` type and stored in the slice.
- **(b) Derived locally** — Computed on the frontend from the decoded user object (e.g., all of `yearOfBirth`, `equity`, `incomes`, `commitments`, `termsOfUseAccept` are non-empty).
- **(c) Separate slice flag** — A standalone `isLoggedinUserCompleted: boolean` added to `AuthSlice`, independent of the `User` type.

> *Your answer:*
(b) Derived locally.
1. Please implement the logic based on the following rules:
2. Add the Helper: Create a utility function (or add it to user.actions.ts) called getIsUserCompleted(user: User | null): boolean.
    - The Logic: A user is considered "completed" only if:
    - They exist and have fullname and email.
    - yearOfBirth is present.
    - equity, incomes, and commitments are all valid numbers (>= 0).
    - termsOfUseAccept is truthy (!!).
3. Zustand Integration: >    - Do not store this as a separate flag in the slice to avoid state desync.
    - Instead, create a selector or a derived value within the useStore call in the LoginPage:
const isLoggedinUserCompleted = useStore(state => getIsUserCompleted(state.loggedinUser));
4. Usage: Use this derived boolean to decide the navigation path after a successful login:
    - true -> Navigate to /home.
    - false -> Navigate to the onboarding/profile completion flow (e.g., /onboarding).

---

### Q2 — `setForceFetchSplash`: Mechanism

The plan says to call `setForceFetchSplash(true)` on successful login. However, `SplashContext` (`src/context/SplashContext.tsx`) does **not** expose a `setForceFetchSplash` function — it only re-fetches when `lang` changes via the store.

**How should splash refresh be triggered after login?**

- **(a) Extend SplashContext** — Add a `forceFetch()` function to `SplashContextValue` and expose it through `useSplash()`. I will update the context as part of this plan.
- **(b) Skip splash refresh** — Login doesn't change the language; rely on the existing cached data and `lang`-based trigger.
- **(c) Trigger via lang** — Call `setLang(store.lang)` to force the existing `useEffect` in SplashProvider to re-run.

> *Your answer:*
(A) We need a clean way to invalidate the splash cache.

The Implementation:
1. Extend SplashContext: Add a forceFetchSplash: () => void function to the context value.
2. Expose via Hook: Ensure useSplash returns this function.
3. The Logic: Inside the SplashProvider, this function should simply trigger the internal fetchSplash logic regardless of whether the language has changed.

Why: Post-login, the user's context changes. We need to re-fetch the splash to ensure all phrases, configuration, and user-specific parameters are fresh and synchronized with the newly authenticated session.

---

### Q3 — `auth.service.ts` vs `user.service.ts` / `user.actions.js`

The plan references both `authService` (in a new `auth.service.ts`) and `user.actions.js`. Neither file exists:
- `src/services/auth.service.ts` — **does not exist**.
- `user.actions.js` — **does not exist** (Zustand slices serve this role).

**Where should auth logic live?**

- **(a) Create `auth.service.ts`** — New file at `src/services/auth.service.ts` holding `login()`, `logout()`, and `getLastLoggedinEmail()`. The Zustand slice calls this service.
- **(b) Extend `user.service.ts`** — Add auth methods directly to the existing `src/services/user.service.ts`.

> What is the storage key string for `STORAGE_KEY_LAST_LOGGEDIN_EMAIL`? (e.g., `'last_email'`, `'loggedin_email'`, etc.)

> *Your answer:*
(A) Create a new src/services/auth.service.ts.

The reasoning:
1. Separation of Concerns: user.service.ts should handle user-related data (CRUD, profile updates), while auth.service.ts should handle the authentication lifecycle (Login, Logout, Token management, Identity).
2. Clean Architecture: Keeping auth separate makes it easier to manage interceptors and security logic without bloating the general user service.

Regarding the Storage Key:
- Please use the constant: const STORAGE_KEY_LAST_LOGGEDIN_EMAIL = 'last_email';

Implementation Flow:
1. Create auth.service.ts.
2. The Zustand Auth Slice will import authService and call its methods.
3. Remember: Since we don't have user.actions.js, the logic belongs inside the actions defined within your Zustand create function (or slice).

---

### Q4 — `jwt-decode`: Install or Manual Decode?

`jwt-decode` is **not** in `package.json`. The plan requires it to decode the JWT from the backend.

**How should JWT decoding be handled?**

- **(a) Install `jwt-decode`** — Run `npm install jwt-decode` as part of this task. Clean approach, type-safe.
- **(b) Manual decode** — Decode manually using `JSON.parse(atob(token.split('.')[1]))`. No new dependency; works fine for non-sensitive payload reading.

> *Your answer:*
(A) Install jwt-decode.

The reasoning:
1. Reliability: We want a robust, battle-tested solution for token decoding that handles Base64Url variants correctly.
2. Type Safety: Using the library allows us to properly type the decoded payload.
3. Standard Practice: It's the professional way to handle JWTs in a modern React application.

Action: Please run npm install jwt-decode (and @types/jwt-decode if necessary) before implementing the authService.

---

### Q5 — `httpService`: How to receive a plain-text JWT response?

The current `httpService.post()` always parses the response as JSON (`res.data`). The `/auth/login` endpoint returns a **raw string** (JWT), not JSON. Without setting `responseType: 'text'`, Axios may fail to parse it or return an unexpected value.

**How should the httpService support a text response type?**

- **(a) Add an `options` param** — Extend `httpService.post<T>(endpoint, data, token?, options?)` to accept an optional Axios config override (including `responseType`). Cleanest API.
- **(b) Use Axios directly in `auth.service.ts`** — Call `axios.post()` directly for the login endpoint, bypassing `httpService`. Keeps httpService unchanged; one-off solution.

> *Your answer:*
(A) Extend httpService to support an options parameter.

The reasoning:
1. Consistency: We want all API calls to pass through our centralized httpService for unified error handling and monitoring. Bypassing it in authService (Option B) creates "hidden" logic that's hard to track.
2. Future-Proofing: While this is a one-off case now (JWT as a string), we might encounter other endpoints in the future that return text, blobs, or buffers. Having the ability to pass options is a standard pattern for robust HTTP wrappers.

Implementation:
- Update httpService.post<T>(url, data, token?, options?).
- Spread the options into the internal Axios call: axios.post(url, data, { ...config, ...options }).
- In auth.service.ts, call it with { responseType: 'text' }.

---

### Q6 — Post-login redirect for incomplete profiles

The plan says: navigate to `/signup` if `isLoggedinUserCompleted` is false. But `/signup` is the new-account registration page.

**What is the correct redirect path for a logged-in user with an incomplete profile?**

- **(a) `/signup`** — The signup flow doubles as the profile-completion flow for existing users.
- **(b) `/profile`** — A dedicated profile-completion route exists (or should be created).
- **(c) Other path** — Specify the exact route.

> *Your answer:*
(C) Priority-Based Onboarding Funnel.

Since /signup is only for unauthenticated users, the post-login redirect must be dynamic. Instead of a hardcoded path, implement a centralized helper function getNextOnboardingStep(user) that determines the destination based on the following priority:
1. Legal First: If !user.termsOfUseAccept ⮕ Navigate to /consent.
2. Personal Info: Else if !user.yearOfBirth (or missing fullname) ⮕ Navigate to /personal-info.
3. Financial Data: Else if !isLoggedinUserCompleted (missing equity, incomes, etc.) ⮕ Navigate to /financial-details.
4. Success: Otherwise ⮕ Navigate to /home.

Implementation Rule:
- The LoginPage should call this helper upon successful login. This "Funnel" logic will later be reused across the profile components to ensure a seamless "Step-by-Step" onboarding experience for incomplete profiles, while allowing "Completed" users to stay on-page during standard edits.

---

## [2026-05-12] Decisions Locked — Pre-Implementation Summary

All 6 questions answered and decisions recorded below. Awaiting explicit green light to begin code generation.

| # | Decision |
|---|---|
| **Q1** | `isLoggedinUserCompleted` → **derived locally** via `getIsUserCompleted(user)` helper. Checks: exists + fullname + email + yearOfBirth + equity/incomes/commitments ≥ 0 + termsOfUseAccept truthy. Used as Zustand selector, no slice flag. |
| **Q2** | `setForceFetchSplash` → **extend SplashContext** with `forceFetchSplash: () => void`. Exposed via `useSplash()`. Triggers internal fetch regardless of lang. |
| **Q3** | **Create `src/services/auth.service.ts`** (separate from user.service.ts). Storage key for last email = `'last_email'`. Auth actions live inside Zustand slice (no user.actions.js). |
| **Q4** | **Install `jwt-decode`** via `npm install jwt-decode`. |
| **Q5** | **Extend `httpService`** with optional `options` param (spread into Axios config). `auth.service.ts` calls with `{ responseType: 'text' }`. |
| **Q6** | **Priority-based onboarding funnel** via `getNextOnboardingStep(user)`: `!termsOfUseAccept` → `/consent` → `!yearOfBirth` → `/personal-info` → incomplete financials → `/financial-details` → `/home`. |

### Files to create/modify:
1. **INSTALL** `jwt-decode`
2. **CREATE** `src/services/auth.service.ts`
3. **MODIFY** `src/services/http.service.ts` — add optional `options` param
4. **MODIFY** `src/context/SplashContext.tsx` — add `forceFetchSplash()`
5. **MODIFY** `src/hooks/useSplash.ts` — expose `forceFetchSplash`
6. **CREATE** `src/utils/user.utils.ts` — `getIsUserCompleted()` + `getNextOnboardingStep()`
7. **MODIFY** `src/store/slices/auth.slice.ts` — add `login` action calling `authService`
8. **REWRITE** `src/pages/LoginPage.tsx` — full implementation per plan

---

**STOP:** Awaiting explicit green light from user before generating any code.

*User says:* go

---

## [2026-05-12] Implementation Complete

All 8 items shipped. TypeScript: 0 errors.

| File | Action |
|---|---|
| `package.json` | `jwt-decode` installed |
| `src/services/http.service.ts` | Added optional `options: Partial<AxiosRequestConfig>` param to all methods |
| `src/services/auth.service.ts` | **Created** — `login()`, `logout()`, `getLastLoggedinEmail()` |
| `src/context/SplashContext.tsx` | Added `forceFetchTick` state + `forceFetchSplash()`, bypasses cache on force |
| `src/hooks/useSplash.ts` | Exposed `forceFetchSplash` |
| `src/utils/user.utils.ts` | **Created** — `getIsUserCompleted()` + `getNextOnboardingStep()` |
| `src/store/slices/auth.slice.ts` | Added `login` + updated `logout` actions (call service, sync store + token) |
| `src/pages/LoginPage.tsx` | **Rewritten** — full implementation per plan |

*AI says:*