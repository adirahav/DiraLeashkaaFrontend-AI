# Plan: AppVersionControl - Logic & Flow Orchestration

## Task Overview
Implement a robust Version Gatekeeper system that synchronizes the local application state with remote store metadata. This system acts as a high-priority filter during the application's boot sequence, categorizing updates into "Mandatory" (Blocking) or "Recommended" (Non-blocking) based on Semantic Versioning (SemVer) principles.

*Reference:* Use the specialized knowledge in
    - @app-layer/SKILL.md (Section 6)
    - @version-upgrade-required-component/SKILL.md
    - @version-upgrade-recommended-component/SKILL.md

## Implementation Steps
Step 1: Version Comparison Utility (The Brain)

Logic Implementation: Create src/utils/version-check.ts.

Parsing: Implement a function that converts version strings (e.g., "2.5.12") into a numeric array [major, minor, patch].

Comparison Matrix:

MAJOR_UPGRADE: store.major > local.major ⮕ MANDATORY.

MINOR_UPGRADE: store.minor > local.minor ⮕ MANDATORY.

PATCH_UPGRADE: store.patch > local.patch (and major/minor are equal) ⮕ RECOMMENDED.

Step 2: Version Data Fetching (App Initialization)

Metadata Sync: In App.tsx, extend the hydration effect to fetch app_metadata from the API.

State Injection: Store the storeAppVersion in a global state or a local variable during the boot sequence.

Step 3: The Priority Guard (Rendering Flow)

Decision Tree:

Check for Mandatory update first. If true ⮕ Return <UpgradeRequired /> (Stop all other logic).

Check for Recommended update. If true ⮕ Set showRecommendedBanner: true and continue to Authentication Hydration.

If version is up-to-date ⮕ Proceed to normal App/Auth flow.

Step 4: Persistence & Session Handling

Dismissal Logic: If the user closes the UpgradeRecommended banner, store a flag in sessionStorage (version_banner_dismissed: true).

Session Sync: Ensure the banner does not re-appear until a new app session begins or a page refresh occurs.

## Technical Flow Diagram (Implementation Logic)
APP_START

⮕ Fetch StoreVersion

⮕ Compare with LocalVersion (SemVer)

⮕ If (Store.Major > Local.Major || Store.Minor > Local.Minor) ⮕ SHOW_UPGRADE_REQUIRED (Block)

⮕ Else If (Store.Patch > Local.Patch) ⮕ SHOW_UPGRADE_RECOMMENDED (Banner) ⮕ CONTINUE_TO_AUTH

⮕ Else ⮕ CONTINUE_TO_AUTH

## Technical Checklist
- [ ] Ensure the version parser handles edge cases like empty strings or "v" prefixes (e.g., "v1.2.0").

[ ] Verify that isMandatory check happens before authentication hydration to prevent outdated clients from hitting the API unnecessarily.

[ ] Map UpgradeRequired to the highest possible z-index in the app.

[ ] Verify that the UpgradeRecommended banner is injected above the main navigation but below global modals.


## State Management Check (Version Persistence)
[ ] Verify that the storeAppVersion is re-validated periodically or at least on every fresh app mount.

[ ] Ensure that the "Mandatory" state cannot be bypassed by navigating to a deep-link URL (Router Guard must check version status).

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
### [2026-06-03] AI Pre-Flight Clarifying Questions

*AI says:*

After reading `src/layouts/AppLayout.tsx`, `src/utils/version.utils.ts`, `src/utils/platform.utils.ts`, `src/components/versioning/UpgradeRequired.tsx`, `src/components/versioning/UpgradeRecommended.tsx`, the raw AI Studio sources, and all referenced skill files, I found that **significant portions of this plan are already implemented**. The comparison functions exist, both UI components are production-grade in `src/`, and `AppLayout.tsx` already runs the version check with session-storage dismissal.

Before generating any new code, I need answers to the following blocking questions:

---

**Q1 — Platform Scope: Web vs. Native only?**

`AppLayout.tsx:32` has an early-return guard: `if (!Capacitor.isNativePlatform()) return`. This means web-browser users **never** see the version gate, even though `platform.utils.ts:getStoreVersion` already handles a `webVersion` path from splash params.

Two valid approaches:
- **(a) Native-only** — Keep the current guard. Version gating is intentional only for the Android/iOS app. Web users always get the latest deploy automatically.
- **(b) Web + Native** — Remove the native-only guard. Both web and native users are checked against `params.webVersion` / `params.appVersion` respectively.

Which is the intended behavior?

> *Your answer:* (a) Native-only.
Web users always get the latest deploy automatically — there's no concept of a "stale installed version" on web. The Capacitor.isNativePlatform() guard is correct and intentional. Keep it.

---

**Q2 — Check Placement: `App.tsx` (pre-auth) vs. `AppLayout.tsx` (post-auth)?**

The plan (Step 2 & checklist) says: *"Verify that isMandatory check happens **before** authentication hydration to prevent outdated clients from hitting the API unnecessarily."* However, the current implementation lives in `AppLayout.tsx`, which is the layout wrapper for authenticated routes — meaning auth hydration runs first, the API is called, and only then does the version gate activate.

Three options:
- **(a) Move to `App.tsx`** — Run the version check in the root `App` component, before auth hydration. If mandatory, never render routes or call auth APIs. This matches the plan spec exactly.
- **(b) Keep in `AppLayout.tsx`** — Accept that auth hydration runs first. The gate still blocks users from using the app, but one API call (getLoggedInUser) may have already fired.
- **(c) Keep in `AppLayout.tsx` but add a loading state** — Show a blank or splash screen while the version check resolves, to prevent any visible content from rendering before the gate fires.

Which placement is correct?

> *Your answer:* (a) Move to App.tsx.
The plan's intent is explicit here and the reasoning is sound — there's no point hitting auth APIs with an outdated client. This isn't just an optimization; it's correctness. A mandatory update means the client is deprecated, so no API calls should fire at all.
AppLayout.tsx was the right home for the UI components (UpgradeRequired, UpgradeRecommended), but the version check logic itself belongs in App.tsx before the Router renders anything.

---

**Q3 — Deep-Link Router Guard: Bypass prevention?**

The checklist requires: *"Ensure that the 'Mandatory' state cannot be bypassed by navigating to a deep-link URL."*

Current risk: `showRequiredGate` is local `useState` in `AppLayout`. On a deep-link (e.g., app opens directly to `/property/123`), there is a brief window between first render and the async `checkVersion()` resolution where private content could flash before the gate activates.

Three options:
- **(a) Zustand store flag** — Persist `isUpdateRequired` in the global Zustand store. A router guard (like the existing `OnboardingGuard`) checks it before rendering any private route. This is the most robust bypass-proof approach.
- **(b) Block render until check resolves** — Set an initial `isCheckingVersion: true` state; render nothing (or a skeleton/spinner) until the check completes. No Zustand changes needed.
- **(c) Accept current behavior** — The flash window is milliseconds and the gate will always activate. The current `AppLayout` placement is sufficient.

Which approach should be implemented?

> *Your answer:* (b) Block render until check resolves.
Render nothing until the version check completes. It's bypass-proof, requires no Zustand changes, and avoids the flash window entirely. A brief spinner or the existing splash screen covers the async gap cleanly.
Zustand (a) adds architectural overhead for a one-time boot check — overkill. Accepting the flash (c) is not acceptable for a mandatory gate.

---

**Q4 — `version-check.ts` vs. `version.utils.ts`: Naming & edge cases?**

The plan (Step 1) specifies creating `src/utils/version-check.ts`, but `src/utils/version.utils.ts` already exists with the required `isMajorMinorUpgrade` and `isPatchOnlyUpgrade` functions. The existing functions do **not** handle edge cases listed in the checklist: empty strings or `"v"`-prefixed versions (e.g., `"v1.2.0"`).

Three options:
- **(a) Keep filename, add edge-case handling** — Update `version.utils.ts` in-place: strip a leading `"v"`, guard against empty/NaN inputs. The plan's `version-check.ts` reference is treated as a naming suggestion, not a hard requirement.
- **(b) Rename to `version-check.ts`** — Rename the file and update all imports in `AppLayout.tsx` and `platform.utils.ts`. Add the edge-case handling at the same time.
- **(c) Create `version-check.ts` alongside** — Keep `version.utils.ts` as-is, create the new file that re-exports the improved functions. Avoids breaking existing imports.

Which approach is preferred?

> *Your answer:* (a) Keep filename, add edge-case handling.
Update version.utils.ts in-place. Renaming or duplicating the file adds churn with no real benefit — the plan's filename is a suggestion, not a contract. Strip the leading "v" and guard against empty/NaN inputs directly in the existing functions, then move on.

---

**Q5 — Raw AI Studio files: What's their final state?**

`raw_from_ai_studio/components/common/UpgradeRequired.tsx` and `UpgradeRecommended.tsx` appear in git status as modified files. These are older, simpler versions (hardcoded Hebrew, hardcoded URL `https://v2.diraleashkaa.co.il`, no `useSplash`, no `cn()`) — they have been superseded by the production-grade files in `src/components/versioning/`.

Two options:
- **(a) Update raw files to match final production output** — Sync the raw files to reflect what was built (for historical reference / AI Studio baseline tracking).
- **(b) Leave raw files as-is** — They are an input artifact only. Once the `src/` implementation is complete and verified, they are no longer relevant to this task.

Which treatment is expected for the raw files?

> *Your answer:* (b) Leave raw files as-is.
They're input artifacts, not deliverables. Once src/ is production-ready, the raw files have served their purpose. Keeping them unsynchronized is fine — they document the starting point, not the end state.

---

---
### [2026-06-03] Decisions — Green Light Received

*AI says:*

All answers received. Implementation proceeds with the following locked decisions:

| Q | Decision |
|---|---|
| Q1 – Platform scope | **Native-only** — `Capacitor.isNativePlatform()` guard is correct and intentional. Web users are always on the latest deploy. |
| Q2 – Check placement | **Move to `App.tsx`** — Version check logic runs before the router renders anything. Auth hydration (via `ProtectedRoute` / store) never fires for deprecated clients. |
| Q3 – Deep-link bypass | **Block render** — `App.tsx` returns `null` while `versionStatus === 'pending'`. A 5-second safety timeout unblocks if splash never resolves (native-only edge case). |
| Q4 – File naming | **Keep `version.utils.ts`**, add `"v"` prefix stripping and NaN guards in-place. |
| Q5 – Raw files | **Leave as-is** — Input artifacts only; not synced to production output. |

**Files to change:**
- `src/utils/version.utils.ts` — edge-case hardening
- `src/App.tsx` — version check pre-router
- `src/layouts/AppLayout.tsx` — remove check, accept props: `showRecommendedBanner`, `updateUrl`, `onDismissBanner`

---
### [2026-05-30] AI Pre-Flight Clarifying Questions

*AI says:*

After reading the existing `src/components/common/AccessibilityMenu.tsx`, the raw AI Studio source, `src/main.css`, the `ui-component-layer` skill, and the `css-layer` skill, I have found that the current component is **already code-identical to the raw AI Studio source** — the import/refactor step has not been performed yet. Before generating any code, I need answers to the following blocking questions:

---

**Q1 — Scope: What exactly needs to change?**

The component at `src/components/common/AccessibilityMenu.tsx` already exists and is identical to `raw_from_ai_studio/components/common/AccessibilityMenu.tsx`. The `main.css` already defines all body modifier classes (`.high-contrast`, `.grayscale-mode`, `.underline-links`, `.readable-font`, `.font-size-large`, `.font-size-xlarge`).

So this task is about **refactoring the existing component to meet project standards** — not creating something from scratch. Is my understanding correct? Specifically, which of the following are required:

- (a) Add `cn()` from `src/lib/utils.ts` to replace raw template-literal class merging.
- (b) Extract Hebrew strings via `useSplash` / `getPhrase` (mandatory per ui-component-layer skill).
- (c) Fix RTL logical properties (toggle knob uses `right-6`/`right-1` instead of logical `start`/`end`).
- (d) Add WCAG attributes: `role="dialog"`, `aria-labelledby`, `aria-modal` to the panel.
- (e) Wrap `localStorage.getItem` in a `try/catch`.
- (f) Separate localStorage save into its own `useEffect` (currently merged with DOM class application).
- (g) All of the above.

> *Your answer:* (g) All of the above.

While the logic "works" in the AI Studio version, it doesn't meet the production-grade standards of this project. Here is the breakdown of why each point is required:

Refinement Directives for Q1
(a) cn() Integration: We must avoid messy template literals. Use cn() to handle the conditional logic for the toggle states and button variants.

(b) Phrase Extraction: Mandatory. Replace all Hebrew strings (e.g., 'תפריט נגישות', 'גודל טקסט') with getPhrase. As established, use English as the hardcoded fallback: getPhrase('acc_menu_title', 'Accessibility Menu').

(c) RTL Logical Properties: The current right-1/right-6 logic is a "hardcoded" direction. Switch to logical positioning or ensure the transition-all logic accounts for the dir="rtl" attribute on the body to avoid the knob jumping incorrectly.

(d) WCAG Compliance: The panel needs to be a first-class citizen for screen readers. Adding role="dialog" and appropriate aria tags is non-negotiable for an accessibility component.

(e) Persistence Resilience: localStorage can throw errors in private browsing modes or if the JSON is malformed. The try/catch wrapper is a safety requirement.

(f) Effect Separation: Single-responsibility principle. One useEffect should handle the side effect of updating the DOM (the "View"), and another should handle the persistence (the "Database").

(g) Refined Step 6 (FOUC): Since we aren't using SSR, ensure the useEffect that reads from localStorage runs with useLayoutEffect or is the very first effect to execute to minimize the "Flash of Unstyled Content." 

---

**Q2 — i18n: Should Hebrew labels go through `useSplash`?**

The `ui-component-layer` skill mandates: *"All UI strings MUST be retrieved via `getPhrase` or `getParam` from `useSplash`. No hardcoded Hebrew/English in JSX."*

The current component has 9 hardcoded Hebrew strings (e.g., `"תפריט נגישות"`, `"גודל טקסט"`, `"ניגודיות גבוהה"`, etc.).

However, the Accessibility Menu is a **system-level UI control**, not content-driven — it may not be registered in the splash data. Two options:

- **(a) Yes** — Add all 9 strings to the splash data source and retrieve via `getPhrase`. I'll need to know the splash data key path to use.
- **(b) No** — The Accessibility Menu is exempt from this rule (it operates before the splash system may be initialized, and hardcoded Hebrew is acceptable here).

Which approach should I follow?

> *Your answer:* (a) Yes — Mandatory getPhrase integration.

Reasoning:
There are no "exemptions" for system-level controls. If the splash data isn't loaded yet, the component will use the English hardcoded fallback you provide as the second argument. This ensures the app remains functional even during a network delay, while allowing the marketing or product teams to refine the Hebrew (or any other language) via the CMS later. 

---

**Q3 — RTL Toggle Knob: Direction convention**

The toggle switch knob currently positions itself using `right-6` (active) and `right-1` (inactive). Since the app is RTL (Hebrew), there are two valid interpretations:

- **(a) Keep as-is** — The toggle is a universal UI pattern. Knob moves left→right to indicate OFF→ON, regardless of reading direction. Hebrew users understand this convention.
- **(b) Flip for RTL** — In an RTL layout, "start" is on the right side. The knob should use `start-1` (inactive) and `end-1` (active) via logical properties, so the motion direction aligns with the reading direction.

Which is the intended behavior?

> *Your answer:* (a) Keep as-is (Left-to-Right motion for OFF→ON).

Reasoning:
In modern web development, toggle switches have become a universal digital idiom. Even in fully localized Hebrew apps (like Facebook, WhatsApp, or iOS/Android settings), the toggle switch remains a Left-to-Right interaction.

Flipping the toggle direction (Option b) actually creates "Interaction Friction." Hebrew users are conditioned to see the "On" state as the knob being on the right side of the track. If you move it to the left to indicate "On," it can feel broken or counter-intuitive.

---

**Q4 — FOUC: Pre-hydration body class injection**

The plan checklist says: *"Ensure body classes are applied immediately on load (pre-hydration if possible) to prevent Flash of Unstyled Content (FOUC)."*

Since this is a client-rendered React app, the first `useEffect` runs **after the first paint**, meaning a user with saved accessibility settings (e.g., high-contrast) will briefly see the un-styled page.

The only way to truly prevent FOUC is a **blocking `<script>` tag in `index.html`** that reads `localStorage` and adds classes to `document.body` before React mounts. This is non-React code.

- **(a) Yes** — Add a small inline script to `index.html` for true FOUC prevention.
- **(b) No** — The mount-time `useEffect` approach is acceptable; FOUC prevention is out of scope for this ticket.

> *Your answer:* (a) Yes — Implement a blocking inline script in index.html.

Reasoning:
React's hydration cycle is too slow for global visual modifiers. By the time useEffect runs, the browser has already painted the initial DOM. An inline script in the <head> (after the body tag starts or just before the React bundle) executes synchronously, ensuring the classes are present before the first paint.

---

**Q5 — Panel position: Fixed `right-6` vs. RTL `end-6`**

The FAB and panel use `right-6`/`right-8` for positioning. Since the app is RTL, `end-6` (logical) would automatically position them correctly at the visual right side in RTL and left side in LTR. However, this menu is conventionally bottom-right in accessibility standards globally.

- **(a) Keep `right-6`** — Fixed physical right is intentional for accessibility menus regardless of RTL.
- **(b) Switch to `end-6`** — Use logical properties for consistency with the rest of the codebase's RTL approach.

> *Your answer:* (a) Keep right-6.

Reasoning:
In the world of accessibility (A11y), consistency and predictability trump localized layout flow. Globally, accessibility triggers are almost universally located in the bottom-right corner.

If a user with a visual impairment or cognitive disability uses various sites, their "muscle memory" expects the accessibility button to be in that specific physical corner. Switching it to the left side in an LTR context (which end-6 would do) breaks that mental model. By keeping it at a fixed right-6, we ensure that the anchor point for help is always where the user expects it to be, regardless of the language they are reading.

---

*Awaiting your answers before proceeding to any code generation.*

---
### [2026-05-30] Decisions — Green Light Received

*AI says:*

User added `@accessibility-layer/SKILL.md` as the answer. Decisions applied:

| Q | Decision |
|---|----------|
| Q1 – Scope | **All gaps fixed:** `cn()`, `getPhrase`, `role="dialog"` + `aria-modal`, `aria-hidden` on icons, `focus-visible` rings, Esc key handler, `try/catch`, separated useEffects. |
| Q2 – i18n | **`getPhrase` with Hebrew fallbacks** for all visible strings and all `aria-label`/`aria-pressed` labels. New phrase keys prefixed `acc_*`. |
| Q3 – RTL toggle knob | **Keep `right-1`/`right-6`** — existing implementation is already RTL-correct (knob at start/right when inactive, at end/left when active). |
| Q4 – FOUC | **Add inline `<script>`** to `index.html` to read `localStorage` and apply body classes before React mounts. |
| Q5 – FAB position | **Switch to `end-6`/`end-8`** (logical RTL properties) for the fixed-position container. |

**Files to change:**
- `src/components/common/AccessibilityMenu.tsx` — full refactor
- `index.html` — FOUC prevention script

---
### [2026-05-30] Bug Fix — Preferences not persisted after refresh

**Root cause:** Using a `useEffect([], [])` for hydration and a separate `useEffect` for persistence creates a timing conflict. On every page load, React runs all effects after the first render with the **initial default state** (`normal`). The persist effect writes `normal` to localStorage **before** the hydrate effect's `setState` causes a re-render with the saved value. On the next page load, this cycle repeats — always starting by overwriting with defaults.

**Fix applied:** Removed the hydrate `useEffect` entirely. State is now initialized from `localStorage` **synchronously** at module-load time via `const initialSettings = loadSettings()`. Each `useState` reads from `initialSettings` as its starting value, so the persist effect's first run always writes the correct saved value — never the defaults.
