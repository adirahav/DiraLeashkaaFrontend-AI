# Plan: HomeWelcome - Extraction & Refactor

## Task Overview
Implement the `HomeWelcome` component as the primary landing state for users without properties. It manages the transition between a standard "Empty State" and an interactive "Tour Mode," using `framer-motion` for high-end visual feedback and `buttonRef` for tour targeting.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @phrase-usage.md
    - Individual Specs: 
        - @home-welcome-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Infrastructure & Props**
- *Props:* Receive `onAddPropertiesPress`, `showTour`, and `setShowTour`.

- *Ref Handling:* Initialize `buttonRef` using `useRef<HTMLDivElement>` to allow the Tour mode to "focus" on the button.

- *Store Logic:* Pull `loggedinUserState` to check for `tourCompletedTime`.

**Step 2: Tour Trigger & Timing Logic**
- *Effect Setup:* Implement a `useEffect` that runs only if `properties.length === 0` and !tourCompletedTime.

- *Delay & Scroll:* - Wait 2 seconds.
    - Execute `scrollIntoView` on the `buttonRef` with `behavior: 'smooth'`.
    - Set a secondary timeout (approx 1.8s) to trigger `setShowTour(true)`.

**Step 3: Component Refactor (HomeWelcome.tsx)**
- *Structure:* Implement the card container using the `max-w-2xl` and `rounded-[2.5rem]` styling.

- *Animations:* - Define `containerVariants` and `itemVariants` for the staggered entry of title, text, and button.
    - Integrate `AnimatedHouse` and `AnimatedTrendingUp` as the hero visual.

- *Header Badge:* Render the "New Start" badge with the `Sparkles` icon and `home_welcome_new_start` phrase.

**Step 4: Primary Action & Tour Integration**
- *Button Implementation:* Use the `Button` component with `variant="primary"`.

- *Tour Styling:* If `showTour` is true:
    - Add `relative z-[110]` to the button wrapper.
    - Apply `ring-4 ring-blue-500` and a pulse animation to the button to guide the user.

- *Callback:* Ensure `onClick` calls `onAddPropertiesPress()`.

**Step 5: Styling & RTL (Tailwind)**
- *RTL:* Force `dir="rtl"` on the root wrapper.

- *Visual Flourish:* Implement the background decorative elements (`blur-[100px]` blobs) with their respective reverse-repeat animations.

- *Footer Slogan:* Add the bottom slogan with the decorative dividers as per the AI Studio design.

## State Management Check (Zustand Slices Pattern)
- **User Slice:** Access `loggedinUserState.tourCompletedTime`.

- **Parent Interaction:** Ensure `HomePage` handles the `setShowTour` state and passes it down correctly.
                

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
### [2026-05-24] AI Pre-Flight Questions — STOP-AND-ASK Gate

*AI says:*

After reading the existing code (`HomeWelcome.tsx`, `HomePage.tsx`, `auth.slice.ts`, `app.slice.ts`, `types/index.ts`) I identified the following gaps and conflicts. **I am stopped. Awaiting your answers before writing any code.**

---

**Q1 — `tourCompletedTime` does not exist anywhere**

The plan says to read `loggedinUserState.tourCompletedTime`, but:
- The `User` interface in `types/index.ts` has no such field.
- `auth.slice.ts` only exposes `loggedinUser: User | null` — no `tourCompletedTime`.
- There is no `user.slice.ts` (the spec mentions one, but it doesn't exist).

**Decision needed:** How should `tourCompletedTime` be introduced?
- Option A — Add `tourCompletedTime: string | null` to the `User` interface and expose it via `auth.slice.ts`.
- Option B — Create a new `user.slice.ts` with its own state field (separate from auth).
- Option C — Skip this field entirely for now and always trigger the tour when `properties.length === 0`.

> *Your answer:* Go with a combination of Option A and Option B.

We want to keep the User object as the "Source of Truth" but separate the profile management from the core authentication logic. Follow these steps:
1. Update Interface (Option A): Add tourCompletedTime: string | null; to the User interface in types/index.ts. This ensures that when the backend eventually returns this field, the frontend is ready.
2. Infrastructure (Option B): Create a new user.slice.ts. This slice will handle user-profile metadata and UI-state persistence that isn't strictly "Auth" (login/logout).
3. Implementation Details:
- Action: Add a completeTour() action in the new user.slice.ts.
- Logic: This action should update the loggedinUser state within the auth store.
- HomeWelcome Trigger: Use the logic: if (properties.length === 0 && !loggedinUser?.tourCompletedTime).

Why? This keeps auth.slice clean (responsible only for session state) while allowing the app to scale as we add more user-specific settings later. 

---

**Q2 — `properties` is not available inside `HomeWelcome`**

The plan's Step 2 says: *"run the effect only if `properties.length === 0`"*. But the current `HomeWelcome` component receives no `properties` prop and has no access to a properties store. Currently the effect fires whenever `showTour` is false (no length guard).

**Decision needed:** How should `HomeWelcome` know about property count?
- Option A — Pass `propertiesCount: number` as a new prop from `HomePage` (already knows).
- Option B — Read from a Zustand `property.slice.ts` directly inside `HomeWelcome`.
- Option C — Keep the guard in `HomePage` (only render `<HomeWelcome>` when `properties.length === 0`, so the component itself doesn't need the check).

> *Your answer:* (C).

The HomePage (parent) should act as the orchestrator. If the user has properties, they should be seeing the dashboard or property list, not the "Welcome" empty state.
1. Orchestration Logic: In HomePage.tsx, implement a conditional render:
{properties.length === 0 ? <HomeWelcome ... /> : <PropertyDashboard />}.
2. Simplification: By doing this, HomeWelcome remains a specialized "Empty State" component. It doesn't need to know about the properties array or the store.
3. Refined Effect: Inside HomeWelcome, the useEffect for the tour should now only check for !loggedinUser?.tourCompletedTime. Since the component is only mounted when properties.length === 0, the length guard is implicitly handled.

---

**Q3 — Prop name: `onAddPropertyPress` (singular) vs `onAddPropertiesPress` (plural)**

- Existing `HomeWelcome.tsx` uses: `onAddPropertyPress`
- `HomePage.tsx` passes: `onAddPropertyPress`
- The plan spec and `home-welcome-component.md` show: `onAddPropertiesPress` (plural)

**Decision needed:** Which name is canonical? Should I rename the prop (and update `HomePage`), or keep the existing singular form?

> *Your answer:* onAddPropertyPress

---

**Q4 — Hebrew strings: use `getPhrase` or keep as-is for now?**

The `ui-component-layer` skill mandates `getPhrase` for all UI strings. The current component has hardcoded Hebrew ("התחלה חדשה", "ברוך הבא!", etc.). The plan references keys: `home_welcome_new_start`, `home_welcome_title`, `home_welcome_text`.

**Decision needed:** Do these phrase keys already exist in the Splash/backend DB, or should I:
- Option A — Wire up `getPhrase` with fallback strings now (keys may return fallback until DB is seeded).
- Option B — Leave strings hardcoded in this task and handle i18n in a later task.

> *Your answer:* (A) — Wire up `getPhrase` with fallback strings now (keys may return fallback until DB is seeded). Translate fallback to English.

---

**Q5 — SCSS file required?**

The `ui-component-layer` skill mandates a `src/assets/css/components/HomeWelcome.scss` file. The current component uses only Tailwind inline classes.

**Decision needed:** Should I create a `HomeWelcome.scss` (even if minimal), or is pure Tailwind acceptable for this component?

> *Your answer:* Strictly Tailwind only.

Do not create an SCSS file for this component. Use Tailwind utility classes for all styling, including animations and transitions. If you need complex class merging, use the cn utility.

Keep the component consistent with our Utility-First principle.

---

*Waiting for your answers. No code will be generated until you give explicit approval.*

---
### [2026-05-24] Implementation Log — Decisions Applied

**Q1 → A+B hybrid**
- `tourCompletedTime: string | null` added to `User` in `src/types/index.ts`.
- New `src/store/slices/user.slice.ts` created with `completeTour()` action. It reads the current `loggedinUser` from `auth.slice` (via `get()`) and writes back `{ ...user, tourCompletedTime: new Date().toISOString() }`. Auth slice stays clean — responsible only for login/logout.
- `UserSlice` added to `RootState` and `createUserSlice` spread into `store.ts`. `loggedinUser` is already in `partialize`, so `tourCompletedTime` persists automatically.

**Q2 → C (parent orchestrates)**
- `HomeWelcome` no longer needs to know about properties. `useEffect` guards only on `!loggedinUser?.tourCompletedTime` — the component only mounts when `properties.length === 0` (handled by `HomePage`).

**Q3 → `onAddPropertyPress` (singular)**
- No rename required; existing prop name kept in `HomeWelcome.tsx` and `HomePage.tsx`.

**Q4 → `getPhrase` with English fallbacks**
- `useSplash()` wired into `HomeWelcome`. Keys used:
  - `home_welcome_new_start` → `"New Start"`
  - `home_welcome_title` → `"Welcome!"`
  - `home_welcome_text` → `"We're glad you joined us…"`
  - `home_welcome_add_btn` → `"Add First Property"`
  - `home_welcome_slogan` → `"Dira L'Hashkaa - Your Path to Financial Freedom"`

**Q5 → Strictly Tailwind**
- No SCSS file created. All styles use Tailwind utility classes with `cn` available if needed.

**WelcomeTour update**
- `handleClose` in `WelcomeTour.tsx` now calls `completeTour()` before `setShowTour(false)`, ensuring the tour is marked done the moment the user dismisses it. Title/description strings translated to English.

**Files changed:**
- `src/types/index.ts` — `tourCompletedTime` field on `User`
- `src/store/slices/user.slice.ts` — new file, `completeTour()` action
- `src/store/store.ts` — `UserSlice` integrated
- `src/components/layout/HomeWelcome.tsx` — store hook, `useEffect` guard, `getPhrase` strings, removed unused `_initialized` state
- `src/components/tour/WelcomeTour.tsx` — `completeTour()` wired to `handleClose`, strings in English