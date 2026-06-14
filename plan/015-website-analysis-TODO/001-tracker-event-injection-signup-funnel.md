# Plan A: Tracker — Event Injection (Signup Funnel)

## Task Overview
Implement the activity tracking injection layer for the Signup flow.
This is Phase 1 of the Tracker system — scoped exclusively to new users
going through registration. The hook captures clicks, form field interactions,
scroll, idle, and navigation events automatically and ships them to the
Tracker API.

*Reference:* Use the specialized knowledge in
    - @tracker-api.yaml
    - @state-management-layer/SKILL.md
    - @api-layer/SKILL.md
    - Individual Specs: 
        - @tracker-layer/SKILL.md

## Implementation Steps

**Step 1: Tracker Service (`src/services/tracker.service.ts`)**
- Implement two API calls matching `@tracker-api.yaml`:
  - `insertTracker(payload)` ⮕ `POST /api/tracker`
  - `insertTrackerEvent(trackerUUID, payload)` ⮕ `POST /api/tracker/:trackerUUID/event`
- Both calls are fire-and-forget — never block the UI on tracker responses.
- On any API failure, swallow the error silently and log via `console.log("[TRACKER] Event failed to send")`.

**Step 2: Zustand Slice (`src/store/slices/tracker.slice.ts`)**
- State shape:
  - `trackerUUID: string | null`
  - `isTracking: boolean`
- Actions:
  - `startTracker(uuid)` — sets `trackerUUID` and `isTracking: true`
  - `stopTracker()` — clears both fields
- Tracker state is session-only — never persisted to `localStorage`.

**Step 3: Tracker Initialization (Signup Entry Point)**
- On mount of the Signup page (`/signup`):
  - Check gate: only proceed if `Capacitor.isNativePlatform()` is `true`.
  - Call `insertTracker` with `platform`, `version` (from `App.getInfo()`), `createdAt: new Date()`, `status: 'drop'` as default.
  - On success ⮕ call `startTracker(uuid)` to inject `trackerUUID` into Zustand.
- On unmount of the Signup page:
  - Call `stopTracker()` to clear state.
  - Note: Final status (`drop` or `complete`) is patched by a future Plan — not in scope here.

**Step 4: `useActivityTracker` Hook (`src/hooks/useActivityTracker.ts`)**
- Accepts `{ trackerUUID }` from Zustand.
- Mounted inside the Signup page only (Phase 1). Not in `AppLayout`.
- Captures the following events via `document` event delegation:

  *Click:*
  - Listen on `document` with `addEventListener('click', handler)`.
  - Read `data-track` first, then `aria-label`, then `innerText` (truncated 40 chars).
  - Log: `[UI] Click — button 'הירשם' @ /signup`

  *Focus / Blur:*
  - Listen on `document` for `focusin` / `focusout`.
  - Target `input`, `textarea`, `select` only.
  - Blur records `filled: true/false` in `meta`.
  - Skip `type="password"` fields — never log value or filled state.
  - Log: `[UI] Blur — input 'כתובת מייל' — filled @ /signup`

  *Scroll:*
  - Debounced 300ms on `window`.
  - Fire once per threshold per page: 25% / 50% / 75% / 100%.
  - Reset thresholds on navigation.
  - Log: `[UI] Scroll — 75% @ /signup`

  *Idle:*
  - Fire after 30s of no `mousemove`, `keydown`, or `touchstart`.
  - Reset timer on any of the above.
  - Log: `[UI] Idle — 30s @ /signup`

  *Navigation:*
  - Via `useLocation()` on every `pathname` change.
  - Log: `[NAV] Navigated to /signup`

- Every captured event calls `insertTrackerEvent(trackerUUID, eventPayload)`.
- All listeners cleaned up in `useEffect` return function.
- All listeners use `{ passive: true }` where applicable.

**Step 5: `data-track` Instrumentation (Signup Components)**
- Add `data-track` to ambiguous elements in the Signup flow:
```tsx
<button data-track="signup-submit">הירשם</button>
<input data-track="signup-email" ... />
<input data-track="signup-password" ... />
<button data-track="signup-back">חזרה</button>
```

## Technical Flow Diagram

SIGNUP_MOUNT

⮕ isNativePlatform? No ⮕ SKIP (no tracking)

⮕ insertTracker() ⮕ startTracker(uuid)

⮕ useActivityTracker({ trackerUUID }) mounts

⮕ Events captured ⮕ insertTrackerEvent(trackerUUID, event) [fire-and-forget]

SIGNUP_UNMOUNT ⮕ stopTracker()

## Technical Checklist
- [ ] `insertTracker` and `insertTrackerEvent` are fire-and-forget — never `await` in the UI render path.
- [ ] `type="password"` fields are fully excluded from focus/blur tracking.
- [ ] All `useEffect` listeners return a cleanup function.
- [ ] `data-track` added to all interactive elements in the Signup flow.
- [x] ~~Tracker only initializes when `Capacitor.isNativePlatform()` is `true`.~~ Gate removed — tracker fires on both native and web. Version falls back to `'web'` string when not on native.
- [ ] `trackerUUID` is `null` in Zustand until `insertTracker` resolves successfully.
- [ ] Hook does not mount if `trackerUUID` is `null`.


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
### [2026-06-05] AI Pre-Flight Questions — STOP-AND-ASK Gate

*AI says:*

I've read the plan, `@tracker-layer/SKILL.md`, `@tracker-api.yaml`, `@state-management-layer/SKILL.md`, and the existing `SignupPage.tsx` and `store.ts`. I found **5 contradictions or ambiguities** that must be resolved before I write any code.

---

**Q1 — Mount location: SignupPage vs. AppLayout (CRITICAL)**

`@tracker-layer/SKILL.md` states:
> *"Hook mounted once in `AppLayout.tsx`. Never in individual components."*

This plan states:
> *"Mounted inside the Signup page only (Phase 1). Not in `AppLayout`."*

These are directly contradictory. If the hook lives in `AppLayout`, it runs for all authenticated users on all pages — which means Phase 1 scope (Signup funnel only) is not enforced by location but by a runtime gate. If it lives in `SignupPage`, it is fully scoped by component lifecycle.

**Which is the intended architecture for Phase 1?**
- Option A: Hook in `SignupPage` only (plan as written — simpler, naturally scoped).
- Option B: Hook in `AppLayout` with a runtime gate that checks `isTracking` from Zustand (SKILL.md architecture — sets up Phase 2 without moving the hook).

> *Your Answer:* (B) Hook in AppLayout with a runtime gate.
The hook mounts once globally but only activates when isTracking === true in Zustand. Phase 1 scope is enforced by startTracker() being called exclusively from the Signup page. When Phase 2 arrives, other pages simply call startTracker() as well — no architectural change needed.
---

**Q2 — State field name: `trackerUUID` vs. `trackerId`**

`@tracker-layer/SKILL.md` uses `trackerId` throughout (slice, hook signature `useActivityTracker({ trackerId, userId })`).  
This plan uses `trackerUUID` throughout (slice, hook signature `useActivityTracker({ trackerUUID })`).

The tracker API response field is `_id` (MongoDB ObjectId string), not a UUID. The plan calls it `trackerUUID` but `insertTracker` resolves to `_id` from the server — it's not a `crypto.randomUUID()` generated client-side.

**Which name should the Zustand field and hook prop use?**
- Option A: `trackerUUID` (as written in this plan — even though it's a MongoDB `_id`).
- Option B: `trackerId` (aligned with SKILL.md — more accurate since it's a server-assigned `_id`).

> *Your Answer:* (A) trackerUUID.
Hook signature: useActivityTracker({ trackerUUID }) — no userId. Since startTracker() is called from the Signup page before registration completes, the user is not yet authenticated and no userId is available. The backend receives trackerUUID alone for all subsequent event calls.

---

**Q3 — 7-day new-user gate: include in Phase 1?**

`@tracker-layer/SKILL.md` defines:
> *"New users only (Phase 1): Only track users whose `createdAt` is within the last 7 days."*

This plan does not mention this gate — it only checks `Capacitor.isNativePlatform()`.

The Signup page is only reachable before registration is complete, so users are by definition brand-new — the 7-day check is redundant at Signup. However, if Phase 2 moves the hook to `AppLayout`, the gate becomes critical.

**Should I implement the 7-day `createdAt` gate in Phase 1?**
- Option A: No — it's redundant at Signup and out of scope (plan as written).
- Option B: Yes — add it now so the gate logic is in place before Phase 2.

> *Your Answer:* (A) No gate needed. The startTracker() call site (Signup only) is the gate. A new createdAt check adds nothing.

---

**Q4 — `tag` assignment strategy for Signup events**

The tracker event schema requires a `tag` field with values: `UI | NAV | SPLASH | SIGNUP | LOGIN | PROPERTY | ERROR`.

The plan's log examples use `[UI]` and `[NAV]` prefixes (e.g. `[UI] Click — button 'הירשם' @ /signup`, `[NAV] Navigated to /signup`) but doesn't define which API `tag` value maps to which event type.

**What `tag` should be used for events captured during the Signup flow?**
- Option A: All Signup-page events use `tag: 'SIGNUP'` regardless of event type.
- Option B: Mixed — use `tag: 'UI'` for click/focus/blur/scroll/idle events, `tag: 'NAV'` for navigation events (matching the log prefixes literally).
- Option C: Other mapping — please specify.

> *Your Answer:* (B) Mixed tags.

click / focus / blur / scroll / idle → tag: 'UI'
navigation → tag: 'NAV'
API calls during Signup (e.g. POST /auth/register) → tag: 'SIGNUP'

The tag describes the nature of the event, not the page it happened on.

---

**Q5 — Hook signature: does it receive `userId`?**

`@tracker-layer/SKILL.md` shows the hook signature as:
```ts
useActivityTracker({ trackerId, userId })
```

This plan shows:
```ts
useActivityTracker({ trackerUUID })
```

`userId` is absent from the plan. The tracker API (`POST /api/tracker/:trackerUUID/event`) does not have a `userId` field in its body schema — identity is presumably inferred server-side from the JWT.

**Should `userId` be passed to the hook?**
- Option A: No — omit `userId`, the hook only receives the tracker ID (plan as written).
- Option B: Yes — pass `userId` too, even if unused in the event payload, for potential future logging.

> *Your Answer:* (A) omit userId.
The backend infers identity from the JWT via getLoggedinUserIfExist. The frontend has no reason to pass it explicitly. And during Signup, the user doesn't even exist yet.

---

**Awaiting your answers to Q1–Q5 before proceeding.**

---
### [2026-06-05] Implementation Decisions (post user answers)

| Decision | Resolution |
|---|---|
| Mount location | Hook in `AppLayout.tsx`, gated by `isTracking`. `startTracker()` called only from `SignupPage` — that IS the Phase 1 gate. |
| State field name | `trackerUUID` (stores server `_id`). Hook signature: `useActivityTracker({ trackerUUID })`. |
| 7-day gate | Omitted in Phase 1 — Signup page reachability is the implicit gate. |
| Tag strategy | `UI` for click/focus/blur/scroll/idle · `NAV` for navigation · `SIGNUP` reserved for future API event instrumentation. |
| `userId` in hook | Omitted — backend infers identity from JWT; user doesn't exist yet at Signup entry. |

**Files created:**
- `src/services/tracker.service.ts` — `insertTracker` (returns `_id`), `insertTrackerEvent` (fire-and-forget)
- `src/store/slices/tracker.slice.ts` — `trackerUUID`, `isTracking`, `startTracker`, `stopTracker`
- `src/hooks/useActivityTracker.ts` — click/focus/blur/scroll/idle/navigation capture; mounted in AppLayout, no-op when `trackerUUID` is null

**Files modified:**
- `src/store/store.ts` — added `TrackerSlice` to `RootState`
- `src/pages/SignupPage.tsx` — tracker init on mount (`isNativePlatform` gate + `App.getInfo()` version), `stopTracker` on unmount
- `src/layouts/AppLayout.tsx` — `useActivityTracker({ trackerUUID: isTracking ? trackerUUID : null })`
- `src/components/formFields/Button.tsx` — added `data-track` prop
- `src/components/formFields/StringInput.tsx` — added `data-track` prop
- `src/components/formFields/NumericInput.tsx` — added `data-track` prop
- `src/components/formFields/EmailInput.tsx` — added `data-track` to interface (flows via `...props` spread)
- `src/components/layout/UserPersonalInfo.tsx` — `data-track` on fullname input, email input, next button
- `src/components/layout/UserFinancialDetails.tsx` — `data-track` on equity/incomes/commitments inputs, back/next buttons
- `src/components/layout/UserConsent.tsx` — `data-track` on back and submit buttons