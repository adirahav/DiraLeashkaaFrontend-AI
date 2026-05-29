# Plan: ContactUsPage - Implementation

## Task Overview
Build the "Contact Us" orchestrator that serves as the platform's support gateway. This page manages a stateful form, validates user input against business rules, and communicates with the backend to deliver messages. It follows the "Smart Page" pattern by handling authorization, API life cycles, and global notifications while remaining 100% Tailwind-driven.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @screen-header-component.md
    - @dropdown-component.md
    - @textarea-component.md
    - @button-component.md
    - @notification-component.md
    - @phrase-usage.md
    - @contact-us-api.yaml
    - Individual Specs: 
        - @contact-us-page.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Guard & Auth Logic (The Gatekeeper)**
- *Authorization Check:* Integrate `useStore` to verify `loggedinUser`. If unauthorized, redirect to `/login` using `react-router`.

- *Context Extraction:* Extract `phrases` and `fixedParameters` from the `SplashContext`.

- *Environment Metadata:* Use `utilService` to prepare `appEnv` and `platform` strings for the final payload.

**Step 2: Form Orchestration (State & Validation)**
- *Data Hydration:* Parse `fixedParameters.contactus` to populate the `Dropdown` options (targeting the `message_types` key).

- *Local State:* Initialize a `contactUs` object containing `subject` and `message` fields.

- *Validation Logic:* - Implement a `useEffect` or computed variable to track `isFormValid`.
    - Validate that a subject is selected (not "choose") and the message is not empty.
    - Map `contactus_type_error` and `contactus_message_error` to the respective field error props if touched.

**Step 3: Component Refactor (`ContactUsPage.tsx`)**
- *File Placement:* `src/pages/ContactUsPage.tsx`.

- Apply the structure from @contact-us-page.md. 

**Step 4: UI Composition (The Layout)**
- *Header:* Render `ScreenHeader` with the `contactus_title` phrase.

- *Form Shell:* Create a centered `main` container with `max-w-2xl mx-auto`.

- *Field Integration:* - Dropdown: Connect to `subject` state. Label: `contactus_type_label`.
    - Textarea: Connect to `message` state. Label: `contactus_message_label`. Placeholder: `contactus_message_placeholder`.

- *Feedback Component:* Place the `Notification` component at the root of the page to handle success/error toasts.

**Step 5: API Interaction & User Experience**
- *Submission Handler:* 
    - On `handleSubmit`, trigger `POST /api/contactUs` via `contactUsService`.
    - Toggle `isLoading` in the `app.slice` to show the global overlay and disable the submit button.

- *Response Handling:* 
    - On Success: Reset form state, trigger `Notification` with `contactus_message_send_success`.
    - On Error: Trigger `Notification` with `contactus_message_send_fail`.

- *Micro-interactions:* Add `animate-in fade-in slide-in-from-bottom-4` to the form card for a professional entrance.

**Step 6: Styling (Tailwind Only)**
- *Card Aesthetic:* Wrap the fields in a `bg-white p-8 rounded-3xl border border-slate-100 shadow-sm`.

- *Button Polish:* Use `button_send` phrase with the `Send` icon. Apply `shadow-lg` and `hover:translate-y-[-2px]` for depth.

- *RTL Alignment:* Ensure `dir="rtl"` is persistent and text alignment is consistently `text-right`.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Bind the `isLoading` state to the button's loading prop and global overlay.

- *Auth Slice:* Access `loggedinUser` to include the user ID in the API request context if available.

- *Splash Context:* Ensure `fixedParameters` are fully loaded before rendering the Dropdown options to prevent "empty" states.


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
## [2026-05-29] AI Pre-Flight Clarifications

*AI says:*

After reading the full spec, existing code, and all referenced skill files, I have identified **5 critical ambiguities** that must be resolved before any code is written.

---

### Q1 — `ContactPage.tsx` vs `ContactUsPage.tsx`: Replace or parallel?

**Context:** `src/pages/ContactPage.tsx` already exists and is already wired to `/contact-us` in `App.tsx`. It uses mock data and has no auth/service integration.

**Options:**
- **A (Replace):** Refactor `ContactPage.tsx` in-place — rename it to `ContactUsPage.tsx`, update the import in `App.tsx`.
- **B (Create new, delete old):** Create `ContactUsPage.tsx`, swap it in `App.tsx`, and delete `ContactPage.tsx`.
- **C (Keep both):** Create `ContactUsPage.tsx` as a separate route (e.g. for a different path) and leave `ContactPage.tsx` as-is.

> **Which approach do you want?** (A) Replace. Refactor `ContactPage.tsx` in-place — rename it to `ContactUsPage.tsx`, update the import in `App.tsx`.

---

### Q2 — `fixedParameters.contactus` type conflict: Where do dropdown options come from?

**Context:** The plan says to parse `fixedParameters.contactus` for the `message_types` array, but the entire codebase types `fixedParameters` as `Record<string, number>` — it only stores numeric values (e.g. interest rates, thresholds). There is no object or array support in the current type definition or API response shape.

**Options:**
- **A (Phrases-based):** The dropdown option labels are individual phrase keys (e.g. `contactus_type_app_error`, `contactus_type_registration`…) and the values are hardcoded string constants in the page — matching the pattern used by the existing `ContactPage.tsx`.
- **B (Extend fixedParameters type):** We widen `fixedParameters` to `Record<string, number | object>` and the backend already returns a `contactus: { message_types: [...] }` structure in the splash response. (Requires confirming backend contract.)
- **C (New API call):** Fetch dropdown options from a dedicated endpoint at page load.

> **Which is the intended data source for the dropdown options?** (B) Extended/Parsed fixedParameters. Use the backend as the source of truth by parsing the stringified JSON stored in the Splash context.

Context:
The screenshot from LocalStorage confirms that contactus is indeed provided by the backend within app_splash_params. However, it is stored as a stringified JSON object rather than a simple number. This explains the perceived type conflict in the Record<string, number> definition.

---

### Q3 — Auth guard: move route to `<ProtectedRoute>` or use in-page redirect?

**Context:** In `App.tsx`, `/contact-us` sits in the **public** routes block (same level as `/consent` and `/accessibility-statement`), meaning unauthenticated users can already visit it. The plan says to redirect to `/login` if `loggedinUser` is null.

**Options:**
- **A (Router-level guard):** Move the `/contact-us` route inside the `<ProtectedRoute>` block in `App.tsx` — no in-page redirect logic needed.
- **B (In-page guard):** Keep the route public (accessible without login) but add a `useEffect` / `useNavigate` guard inside the page component for the redirect.
- **C (Keep public, no guard):** The page stays public and any logged-in user ID is simply **optional** in the payload — unauthenticated users can still submit.

> **Which behaviour is intended?** (A) Router-level guard. Move the /contact-us route inside the <ProtectedRoute> block in App.tsx.

Reasoning:
Since the business logic requires a loggedinUser to associate the message with a specific account and potentially use their contact metadata, it is cleaner and more secure to handle this at the router level. Moving the route to the <ProtectedRoute> block eliminates the need for redundant useEffect hooks and "flickering" redirects inside the page component, providing a smoother user experience.

---

### Q4 — `appEnv` and `platform` in the API payload: source and ownership?

**Context:** The API spec requires `{ subject, message, appEnv, platform }`. Two issues found:
1. `util.service.ts` has **no** `getAppEnv()` or `getPlatform()` helpers.
2. `http.service.ts` already **auto-injects** `platform` into every POST body (line 49: `data: method !== 'GET' ? { ...data, platform } : null`). Passing it again in the payload would duplicate the field.

**Options for `platform`:**
- **A:** Rely on `httpService`'s auto-injection — do **not** pass `platform` explicitly in the `contactUsService` payload.
- **B:** Pass `platform` explicitly anyway (duplicates, but stays aligned with the API spec literally).

**Options for `appEnv`:**
- **A:** Read from `import.meta.env.VITE_APP_ENV` (or `import.meta.env.MODE`) directly in the service file.
- **B:** Add a `getAppEnv()` helper to `util.service.ts` first, then call it from the service.

> **Which combination do you want?** 
Decision for platform: Option A (Rely on auto-injection).
Decision for appEnv: Option B (Add helper to util.service.ts).

Reasoning:
Duplicating fields in the payload is messy and can lead to conflicts if the auto-injection logic in http.service.ts changes. Since the platform is already globally handled, we should trust the existing infrastructure. For appEnv, adding a helper to the util.service.ts is the most consistent way to handle environment variables, keeping the service layer clean and reusable.

---

### Q5 — Minimum message length: what is the validation threshold?

**Context:** The spec says *"message must meet minimum length requirements"* but gives no specific number. The existing `ContactPage.tsx` only checks `!message.trim()` (non-empty).

**Options:**
- **A:** Non-empty only (same as existing page) — `message.trim().length > 0`.
- **B:** Specific minimum — e.g. 10, 20, or 50 characters. 

> **What is the minimum character count, or should non-empty suffice?**

---

*STOP — Waiting for answers before any code generation.* (B) - Specific Minimum. Set the threshold to 10 characters.

Reasoning:
A "non-empty" check (Option A) is often too weak, as it allows users to submit accidental keystrokes or single words that don't provide enough context for support. A 10-character minimum ensures at least a short sentence or a clear phrase is provided, significantly improving the quality of the leads/inquiries without creating a high barrier for the user.

---

## [2026-05-29] Implementation Decisions Log

*AI says:*

All 5 questions answered. Implementing with the following decisions locked in:

| Decision | Resolution |
|---|---|
| File strategy | Replaced `ContactPage.tsx` → new `ContactUsPage.tsx`, deleted old file |
| Dropdown options | Parsed from `params['contactus']` (stringified JSON from backend) |
| Auth guard | `/contact-us` moved inside `<ProtectedRoute>` in `App.tsx` |
| `platform` | Relies on `httpService` auto-injection — not passed in payload |
| `appEnv` | `getAppEnv()` added to `util.service.ts`, reads `VITE_APP_ENV` then `MODE` |
| Message validation | 10-character minimum (`MIN_MESSAGE_LENGTH = 10`) |
| Notification | Global store (`setNotification` / `clearNotification` from `app.slice`) |
| Subject default | `''` empty string (Dropdown shows built-in placeholder, no "choose" option) |

### Files created / modified
- `src/types/splash.ts` — `fixedParameters` widened to `Record<string, unknown>`
- `src/context/SplashContext.tsx` — `SplashContextValue.fixedParameters` updated to match
- `src/hooks/useSplash.ts` — `params` return type updated to `Record<string, unknown>`
- `src/services/util.service.ts` — `getAppEnv()` added
- `src/services/contactUs.service.ts` — **new** — `sendMessage(subject, message, appEnv)`
- `src/pages/ContactUsPage.tsx` — **new** — full orchestrator page
- `src/pages/ContactPage.tsx` — **deleted**
- `src/App.tsx` — import updated, route moved to `<ProtectedRoute>`