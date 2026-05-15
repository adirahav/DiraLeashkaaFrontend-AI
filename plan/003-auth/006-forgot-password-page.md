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

---
### [2026-05-15] — AI Clarifying Questions (STOP-AND-ASK Gate)

*AI says:*

I've reviewed the existing `ForgotPasswordPage.tsx`, `auth.service.ts`, `http.service.ts`, `useSplash`, the Zustand `app.slice`, and the patterns in `SignupPage.tsx`. Below are my clarifying questions before touching any code.

---

**Q1 — API endpoint base path**
The plan says `POST /forgotPassword/generateCode`, `POST /forgotPassword/validateCode`, and `PUT /forgotPassword/changePassword`. The existing `auth.service.ts` uses `/auth/*` via `httpService`. Should the new `forgotPassword.service.ts` use the same `/forgotPassword/…` paths exactly, or should they live under `/auth/forgotPassword/…` (i.e., nested under the auth prefix the server already exposes)?

> *Your answer:* API endpoint base path
Decision: Keep them as standalone paths (/forgotPassword/...) exactly as defined in the plan.

Reasoning:
1. Backend Structure: Based on the specific Backend implementation, forgotPassword is handled by its own independent controller/service, separate from the /auth/ prefix.
2. Path Accuracy: Using /auth/forgotPassword would lead to 404 errors. We must use the direct paths:
    - POST /forgotPassword/generateCode
    - POST /forgotPassword/validateCode
    - PUT /forgotPassword/changePassword

Implementation Note: In forgotPassword.service.ts, ensure the httpService calls use these absolute paths without prefixing them with /auth.

---

**Q2 — `changePassword` authorization token**
The `PUT /forgotPassword/changePassword` call happens *before* the user is logged in, so there is no JWT in the store yet. Should this endpoint be called **without** a token (unauthenticated), or does the server issue a temporary short-lived token after `validateCode` succeeds that must be passed in the `Authorization` header for the `changePassword` call?

> *Your answer:* changePassword authorization token
Decision: The call requires a temporary forgotPasswordToken provided by the server.

Reasoning:
The backend uses a middleware called requireForgotPasswordAuth. This middleware looks for a token either in the Cookies (forgotPasswordToken) or in the Authorization Header (Bearer <token>).
- After a successful validateCode call, the server issues this short-lived token.

- This token contains the session data and an expiration timestamp.

- Without it, the changePassword request will fail with a 401 error.

Implementation for Claude:
1. Token Capture: When forgotPasswordService.validateCode succeeds, ensure the service/store captures the token if it's returned in the response body (if it's a Cookie, the browser/httpService with withCredentials: true will handle it automatically).
2. Authorization Header: If the token is not a cookie, the changePassword call must explicitly include the token in the headers:
Authorization: Bearer <forgotPasswordToken>.
3. Error Handling: If the user stays too long on the reset screen, handle the 401 "Expired code" error by redirecting them back to the first step (EMAIL).

---

**Q3 — Phrase keys for dynamic `ScreenHeader` titles/subtitles**
The plan says to drive `title` and `subtitle` from `getPhrase(key)` via `useSplash`. What are the exact splash phrase keys for each step? For example:
- EMAIL step title → `forgot_password_email_title`?  
- VERIFY step subtitle (with `%1$` placeholder for email) → `forgot_password_verify_subtitle`?  
- RESET step title → `forgot_password_reset_title`?  

Please confirm the exact keys (or point me to the `@forgot-password-page.md` spec) so hardcoded Hebrew strings are not left in the component.

> *Your answer:*
- EMAIL step title → `forgot_password_email_label`
- VERIFY step subtitle (with `%1$` placeholder for email) → `forgot_password_verify_label`
- RESET step title → `forgot_password_newpassword_label`
---

**Q4 — Global `notification` (store) vs. local `notification` (component state)**
The existing rough implementation uses a local `notification` state. The `app.slice` already has a global `setNotification` / `clearNotification`. The plan says to "trigger a `Notification`" on successful password reset. Should the success notification be dispatched through the **global store** (`useStore → setNotification`) so it persists across the navigation to `/login`, or should it stay as a **local** component-level notification shown before the redirect?

> *Your answer:* Global Store (useStore → setNotification).

Reasoning:
1. Persistence during Navigation: Since the plan includes a navigation to /login after success, a local notification would be destroyed instantly. Using the global store allows the notification to remain visible even after the ForgotPasswordPage is unmounted and the LoginPage is loaded.
2. UX Confirmation: It is critical that the user sees the "Success" message on the login screen, confirming that their new password is now active and they can proceed to log in.
3. Consistency: This follows the established pattern in the app.slice for handling cross-page feedback (like success messages or global errors).

Implementation for Claude:
- After forgotPasswordService.changePassword succeeds:
    1. Dispatch setNotification({ message: getPhrase('forgot_password_success'), type: 'success' }).
    2. Wait for the 3-second delay (as per Step 1.3).
    3. Navigate to /login.

---

**Q5 — `framer-motion` vs. Tailwind `animate-in`**
The plan mentions `framer-motion` for step transitions in Step 4, but the current code already uses Tailwind `animate-in fade-in slide-in-from-bottom-4`. The `SignupPage` uses `framer-motion`'s `<AnimatePresence>` + `<motion.div>`. Which approach should this page follow — **Tailwind animate-in** (simpler, already present) or **framer-motion** (matches `SignupPage` pattern)?

> *Your answer:* Framer-motion (Matches SignupPage pattern).

Reasoning:
1. Consistency: Since the SignupPage already uses framer-motion, following the same pattern ensures that all "Auth-related" flows (Signup, Forgot Password, etc.) feel identical in their motion language.
2. Complex Transitions: framer-motion's <AnimatePresence> allows for "exit animations"—meaning when one step disappears, it can fade out smoothly while the next step slides in. Tailwind's animate-in only handles the "entrance," which can feel more abrupt during step-to-step transitions.
3. App-like Feel: Step-based flows (Email -> Verify -> Reset) benefit greatly from the "directional" movement that Framer Motion provides, making the web app feel more like a high-end mobile application.

Implementation for Claude:
- Wrap the step-rendering logic in <AnimatePresence mode="wait">.
- Each step should be a <motion.div> with a unique key (e.g., key={step}).
- Use the following standard variants for a smooth feel:

```TypeScript
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.3 }}
```

---

**Q6 — Code input auto-submit vs. manual button**
The plan says "Once 4 digits are entered, call `forgotPasswordService.validateCode`". Does that mean the API call fires **automatically** the moment the 4th digit is typed (no button press required), or does the user still need to press the "אמת קוד" button explicitly after filling all four boxes?

> *Your answer:* Code input auto-submit vs. manual button
Decision: Auto-submit (with a manual button as a fallback).

Reasoning:
- Frictionless UX: In modern OTP (One-Time Password) flows, users expect the system to react immediately once the final digit is entered. Forcing an extra click adds unnecessary friction.
- Efficiency: Auto-submission makes the flow feel faster and more responsive, especially on mobile devices where screen real estate is limited and keyboard interaction should be minimized.
- Immediate Feedback: As soon as the 4th digit is detected, we can trigger the global isLoading state, providing instant visual confirmation that the system is processing the request.

Implementation for Claude:
- Logic: In the handleCodeChange function, add a check: if the current index is the last one (index 3) and it contains a value, immediately invoke the handleVerifyCode function.
- 4UI: Keep the "Verify Code" button visible (as seen in the AI Studio design). It serves as a visual guide and a fallback for users who prefer manual confirmation or in case of edge-case input behaviors.

Final Summary for Claude (ForgotPassword Project):
1. API Endpoints: Use standalone paths (e.g., POST /forgotPassword/generateCode) rather than nested auth paths.
2. Authorization: Capture and use the forgotPasswordToken provided by the server after code validation to authorize the final changePassword request.
3. Notifications: Use the Global Store (useStore) for the success message so it remains visible during the transition to the Login page.
4. Animations: Use Framer-motion (following the SignupPage pattern) to handle smooth step-to-step transitions with <AnimatePresence>.
5. OTP Behavior: Implement Auto-submit on the 4th digit while retaining the manual button for accessibility and clarity.

---

*Waiting for your answers and explicit green light before writing any code.*

---
### [2026-05-15] — Implementation Complete

*AI says:*

All answers received. Green light confirmed. Implementation summary:

**Files created / modified:**

| File | Action | Notes |
|---|---|---|
| `src/services/forgotPassword.service.ts` | **Created** | 3 functions: `generateCode`, `validateCode` (returns `forgotPasswordToken`), `changePassword` (passes token as Bearer) |
| `src/pages/ForgotPasswordPage.tsx` | **Replaced** | Full rewrite — framer-motion, 3-step state machine, auto-submit on 4th digit, global `setNotification`, 401 guard |
| `src/pages/LoginPage.tsx` | **Updated** | Added global `Notification` consumer — reads `notification` from store set by ForgotPasswordPage |

**Key decisions logged:**
- `forgotPasswordToken` is captured from `validateCode` response body and passed explicitly as `Bearer` token to `changePassword` — no dependency on cookies.
- On any 401 (expired token): user is sent back to `EMAIL` step with a clear error phrase.
- Auto-submit fires `handleVerifyCode(newCode)` with the updated array directly (not stale state) the moment the 4th digit is entered.
- `setNotification` is dispatched before `navigate('/login')` so it survives page unmount; `LoginPage` reads and clears it on render.
- Phrase keys used (with Hebrew fallbacks so the app works even before splash data is populated):
  - `forgot_password_email_label` / `forgot_password_email_subtitle`
  - `forgot_password_verify_label` / `forgot_password_verify_subtitle` (contains `%1$` → email)
  - `forgot_password_newpassword_label` / `forgot_password_newpassword_subtitle`
  - `forgot_password_success`, `forgot_password_code_error`, `forgot_password_expired_error`, `forgot_password_server_error`, `forgot_password_mismatch_error`, `forgot_password_min_length_error`