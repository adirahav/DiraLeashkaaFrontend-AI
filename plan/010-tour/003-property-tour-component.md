# Plan: PropertyTour - Implementation

## Task Overview
Implement the orchestration logic for the 6-step Property Tour. This component is responsible for "walking" the user through the input fields, handling automated focus, simulating calculation delays, and performing the final handshake with the server to mark completion.

*Reference:* Use the specialized knowledge in
    - @tour-workflow.md
    - @tour-spotlight-component.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @property-tour-component.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Step Coordination (The Brain)**
- *State Management:* Track `tourStep` and `pendingTourStep`.

- *Calculation Simulation:* Wrap step transitions in a 1200ms delay using `setIsCalculating(true)`. This prevents user interaction while the spotlight is moving and simulates "data processing".

- *Sequence:* `CITY` → `PRICE` → `EQUITY` → `TYPE` → `INCOME` → `COMMITMENTS`.

**Step 2: Smooth Navigation & Scrolling**
- *Centered Scroll:* For each new step, trigger `targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })`.

- *Spotlight Buffer:* Wait for the scroll to finish (approx `1000ms`) before setting the new `tourStep` and showing the spotlight. This avoids the "jittery" movement of the overlay.

**Step 3: Component Refactor (`PropertyTour.tsx`)**
- *File Placement:* `src/components/tour/PropertyTour.tsx`.

- Apply the structure from @property-tour-component

**Step 4: Advanced Focus Management**
- *Automated Focus:* Map `tourStep` to input IDs (e.g., `price-input`).

- *Input Handling:* - If the target is a standard input: Call `.focus()` and use `setSelectionRange` to move the cursor to the end.
    - If the target is a button group (like `ApartmentType`): Find the first button inside the Ref and focus it.

- *Timing:* Use a `100ms` timeout to ensure the element is enabled and visible before attempting focus.

**Step 5: Dynamic Content & Phrases**
- *Mapping:* Inject localized titles and descriptions based on the current step:
    - Example (Price): `tour_price_title` & `tour_price_text`.

- *Button Actions:* - Intermediate steps: Show `tour_button_next`.
    - Final step: Show `tour_button_finish` with a green (`bg-green-600`) color scheme.

**Step 6: Completion & Sync (The Handshake)**
- *Final Action Workflow:* 
    1. Call `PATCH /api/user/tourCompleted` via `userService`.
    2. Update `loggedinUser.tourCompletedTime` in the store immediately.
    3. Switch UI: `setViewMode('results')` and `setActiveResultTab('graph')`.
    4. Scroll to `graphRef` to show the final "Aha!" moment.

- *Cleanup:* Set `setIsTourEnding(true)` to disable global scroll locks and allow normal interaction with the results.

**Step 6: UI Resilience (Body Lock)**

- *Scroll Lock:* Ensure `overflow: hidden` is applied to `body` and `html` while `showTour` is true to keep the spotlight perfectly aligned.

- *Visual Guard:* If `isCalculating` is true, set `activeRect` to null to fade out the spotlight while the "loading" state is shown.

## Technical Checklist
- [ ] Implement `requestAnimationFrame` for `activeRect` tracking.

- [ ] Add `z-[110]` to focused inputs in `PropertyForm` when tour is active.

- [ ] Verify `tourCompleted` API call includes `auth` headers.

- [ ] Ensure `AnimatePresence` handles the transition between `form` and `results` modes.

## Styling & UI Checklist (Tailwind)
Since the spotlight moves across different types of inputs, the CSS must be dynamic:

- *Spotlight Precision:*
    - [ ] Use `transition-[clip-path]` or `transition-all` with `duration-500` on the `TourSpotlight` overlay for smooth movement between fields.
    - [ ] Ensure the "hole" in the overlay has a `rounded-2xl` (or matching the input's `border-radius`) to look integrated.

- *Target Elevation:*
    - [ ] Active Field: Apply `relative z-[110]` to the specific `formField` container being spotlighted.
    - [ ] Visual Glow: Add `ring-4 ring-blue-500/30` and `shadow-[0_0_20px_rgba(59,130,246,0.5)]` to the active input to make it pop against the dark backdrop.

- *The Popover (Tooltip):*
    - [ ] Positioning: Ensure the tooltip uses `fixed` or `absolute` positioning with a `z-[120]` to sit above the elevated input.
    - [ ] Animation: Use `animate-bounce-subtle` on the `MousePointer2` icon within the tooltip to draw the eye.

- *Responsiveness:*
    - [ ] Add a `max-h-[80vh] overflow-y-auto` to the tooltip text for small mobile screens so it doesn't get cut off.

## State Management Check (Zustand & Refs)
This ensures the data actually saves and the UI doesn't get stuck:

- *The "Handshake" (Server Sync):*
    - [ ] Optimistic Update: Update the `user.tourCompletedTime` in the Zustand store before the API call finishes so the UI doesn't "flicker" back to tour mode.
    - [ ] Error Handling: If the `PATCH` fails, log it but do not block the user from seeing their results. The "Aha!" moment is more important than the DB flag.

- *Calculation States:*
    - [ ] Input Lock: Verify that all `FormField`s are `disabled` when `isCalculating` is true to prevent double-submissions or race conditions during the tour.
    - [ ] Debounce Sync: Ensure the `useDebounce` hook in `PropertyPage` is set to at least `500ms` so the "Calculating..." spinner feels natural and doesn't jitter.

- *Navigation Persistence:*
    - [ ] Route Guard: If the user refreshes the page mid-tour, the state should ideally default back to the first incomplete step (or Step 0) rather than breaking the UI.

- *Ref Integrity:*
    - [ ] Check that all 7 Refs (`cityRef` through `graphRef`) are correctly attached to the outermost wrapper of the form components to ensure `getBoundingClientRect` captures the entire field, not just the label.

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

### 2026-05-29 — AI Pre-Flight Questions

*AI says:*

After reading `src/components/tour/PropertyTour.tsx`, `src/pages/PropertyPage.tsx`, `src/store/slices/user.slice.ts`, `src/services/user.service.ts`, and the previous tour plan logs, I found that **PropertyTour.tsx already has substantial logic in place**. Before proceeding I need clarity on what remains and what the expected behavior is for the gaps I found.

---

**Q1 — Implementation Status: What Exactly Needs to Change?**
The current `PropertyTour.tsx` already has:
- Step coordination (`tourStep` / `pendingTourStep` / 1200ms delay) ✅
- Smooth scroll + 1000ms spotlight buffer ✅
- `requestAnimationFrame` rect tracking ✅
- Focus management with 100ms timeout, `setSelectionRange`, and button group fallback ✅
- Button actions for PRICE → EQUITY → TYPE → INCOME → COMMITMENTS ✅
- Completion flow: `setIsTourEnding`, `setShowTour(false)`, `setViewMode('results')`, `setActiveResultTab('graph')`, `graphRef.scrollIntoView` ✅

The **visible gaps** are:
1. **CITY step has no "Next" button** — the tour shows the spotlight on CITY but nothing to advance to PRICE.
2. **All title/description strings are hardcoded Hebrew** — not using `getPhrase()`.
3. **No API call on completion** — plan says `PATCH /api/user/tourCompleted`, but `userService` has no such method and the store's `completeTour()` only updates local state.
4. **No `cn()` utility usage** — raw string classNames throughout.
5. **No `completeTour()` store call** — unlike `WelcomeTour` which calls `completeTour()` on close, the `PropertyTour` does not.

Is this task a **targeted refactor** addressing these 5 gaps, or a full rewrite of the file?

> *Your answer:* Targeted Refactor (Logic & Integration).
We will treat the AI Studio code as the "Visual Template" but inject the missing business logic, API connectivity, and localization requirements.

Implementation Directive for Claude:

1. Localization (Phrases)
Replace all hardcoded Hebrew strings with the useSplash hook.
- Logic: Use the keys defined in the spec (e.g., tour_price_title) and use the Hebrew strings from the AI Studio code as the fallback (second argument) to ensure no visual regressions.
- Buttons: Use tour_button_next and tour_button_finish.

2. Missing "CITY" Step Navigation
The AI Studio code spotlighted the City field but didn't provide a way to move forward.
- Fix: Add a button for the CITY step that triggers setIsCalculating(true) and sets the pendingTourStep to PRICE.

3. Completion Handshake (The API Call)
- This is the most critical logic update.
- Service: Add a completeTour() method to user.service.ts that performs a PATCH /api/user/tourCompleted.
-  Action: In the final step (COMMITMENTS), before closing the tour:
    1. Call the completeTour service.
    2. Call the store's completeTour() action to update loggedinUser.tourCompletedTime optimistically.
    3. Then proceed with the setViewMode('results') transition.

4. Layout & Styling (The cn Polish)
- Merging: Refactor the button className strings using the cn() utility.
- Dynamic Classes: Ensure the green color for the "Finish" button and the blue for "Next" are handled via conditional cn logic rather than duplicated blocks.

5. Body Lock Consistency
While the AI Studio code handles some states, ensure the useEffect from the WelcomeTour pattern (applying overflow: hidden to body and html) is present here to keep the spotlight from drifting during manual user scrolling.

---

**Q2 — CITY Step: How Does the User Advance?**
The CITY step currently shows the spotlight on the city field but provides **no "Next" button** inside the popover. The user has no way to advance to PRICE.

Three options:
- **(a) Add a "Next" button** to the CITY step popover (same pattern as PRICE/EQUITY/etc.) — user clicks to advance after selecting a city.
- **(b) Auto-advance** when a city value is detected in `currentProperty` (reactive, no button needed).
- **(c) Remove CITY from the tour sequence** — start the tour at PRICE.

Which approach is intended?

> *Your answer:* (a). Add a "Next" button to the CITY step popover.

Reasoning:
Option (b) (Auto-advance) can feel jarring and "hyper-active" if the user hasn't finished thinking about their choice or if the dropdown behavior triggers an accidental jump. Option (c) removes a key educational moment where we explain why the city matters (taxation/yields).

Option (a) provides a consistent UX pattern across all six steps. It allows the user to select the city and then consciously click "Next" to trigger the "Calculating" simulation, which sets the tone for the rest of the tour.

---

**Q3 — Completion Handshake: API Call vs Store-Only**
The plan (Step 6) says:
> 1. Call `PATCH /api/user/tourCompleted` via `userService`.
> 2. Update `loggedinUser.tourCompletedTime` in the store immediately.

However:
- `userService` has **no `tourCompleted` method** — only `fetchSplash`, `updateUser`, `getHome`.
- The store's `completeTour()` action updates `loggedinUser.tourCompletedTime` locally but makes **no API call**.

Should I:
- **(a) Add a new `tourCompleted()` function to `userService`** (calling `PATCH /api/user/tourCompleted` with the auth token), and call it from the COMMITMENTS completion flow alongside `completeTour()` from the store?
- **(b) Just call the existing `completeTour()` store action** (no HTTP call needed for the tour flag)?
- **(c) Extend `completeTour()` in the user slice** to make the API call internally?

Also — if (a) or (c): should the `PATCH` failure silently log and not block the UX (as the plan implies), or should it be surfaced to the user?

> *Your answer:* Combined approach (Options A and C). Add the method to userService and wrap it in the Store action.

Reasoning:
Marking a tour as "completed" is a persistent change to the user's profile. Relying only on local state (Option B) means the user will be forced to repeat the tour every time they log in from a new device. Option (C) is the cleanest implementation because it encapsulates the side effect (the API call) within the store action, keeping the component code focused on the UI transition.

---

**Q4 — Phrase Integration: `useSplash` or Hardcoded Hebrew?**
All title/description strings are currently hardcoded Hebrew (e.g., `'בחירת עיר'`, `'מחיר הנכס'`). The plan references keys like `tour_price_title` and `tour_price_text`.

Following the WelcomeTour precedent (Q2/Q3 in that log), the pattern is:
```ts
getPhrase('tour_price_title', 'מחיר הנכס')
```
with Hebrew as the code-level fallback.

Should I:
- **(a) Adopt `useSplash()` + `getPhrase()` for all 12 strings** (6 titles + 6 descriptions) with Hebrew fallbacks?
- **(b) Keep hardcoded Hebrew** (simpler, phrase keys don't exist in the API yet)?
- **(c) Adopt `getPhrase()` only for titles** and keep descriptions hardcoded for now?

Also — should the button labels (`המשך לשלב הבא` / `סיום הסיור`) also go through `getPhrase`?

> *Your answer:* (a). Adopt useSplash() + getPhrase() for all strings (Titles, Descriptions, and Buttons), and use English as the code-level fallback.

Reasoning:
Consistency is paramount for a high-end application. By using useSplash(), we ensure that the content is managed by the CMS. Following the project's globalization standard, the hardcoded fallback must be English. Even if the primary audience is Hebrew-speaking, the codebase itself should remain culturally neutral, with the Hebrew content served dynamically from the API/Splash data.

---

**Q5 — `cn()` Refactor Scope**
The buttons in the COMMITMENTS step use a different color scheme (`bg-green-600`) vs intermediate steps (`bg-blue-600`). The plan confirms this distinction. Should the `cn()` refactor:
- **(a) Unify the 5 "next" buttons into one conditional block** using `cn()` and a `isFinalStep` flag — DRY, one render, no repetition?
- **(b) Keep the 5 separate `{tourStep === 'X' && <button>}` blocks** but add `cn()` to each button's className?

Option (a) would meaningfully reduce repetition (each button block is ~10 lines × 5 = 50 lines → ~15 lines). Option (b) is a minimal-touch refactor.

> *Your answer:* (a). Unify the button logic into a single conditional block using cn() and a isFinalStep flag.

Reasoning:
Maintaining 5-6 separate button blocks leads to "Logic Rot"—if you decide to change the calculation delay from 1200ms to 1000ms, you have to change it in 6 places. By unifying them, we ensure that the "Calculating..." simulation remains consistent across the entire tour. It also makes the PropertyTour.tsx file significantly more readable and easier to maintain.

---

*Waiting for your explicit green light and answers before writing any code.*

---

### 2026-05-29 — Implementation Complete

*AI says:*

Targeted refactor applied to three files based on all decisions:

| Decision | Applied |
|---|---|
| Q1: Scope | Targeted refactor — 5 gaps addressed, existing logic preserved |
| Q2: CITY button | Added "Next Step" button to CITY step, same pattern as all other steps |
| Q3: API handshake | `completeTour()` added to `user.service.ts` (`PATCH /user/tourCompleted`); `user.slice.ts` now calls it fire-and-forget with silent error logging |
| Q4: Phrase integration | `useSplash()` + `getPhrase()` for all 12 content strings and 2 button labels; English fallbacks |
| Q5: cn() unification | Single `handleNext` handler + one `<button>` with `cn()` conditional classes; `isFinalStep` flag drives green vs blue color and label |

**`src/services/user.service.ts` changes:**
- Added `completeTour` to exported object
- Added `async function completeTour(): Promise<void>` calling `httpService.patch('/user/tourCompleted', {}, token)`

**`src/store/slices/user.slice.ts` changes:**
- Imported `userService` from `../../services/user.service`
- `completeTour` action: optimistic store update first, then `userService.completeTour().catch(console.error)` fire-and-forget

**`src/components/tour/PropertyTour.tsx` changes:**
- Extracted `TourStep` union type alias; defined `NEXT_STEP` map outside component
- Added `useSplash` + `cn` + `useStore` imports
- Added `stepContent` record mapping each step to `getPhrase(key, englishFallback)` for title and description
- Added body lock `useEffect` (`overflow: hidden` on body + documentElement)
- Replaced 5 separate conditional button blocks with single `handleNext` + one `<button>` using `cn()` and `isFinalStep`
- COMMITMENTS completion: calls `completeTour()` (store action) before UI transition