# Plan: UpgradeRecommended - Implementation

## Task Overview
Implement the `UpgradeRecommended` announcement bar to notify users of non-critical updates (patch version increases). This component serves as a subtle marketing and UX bridge, encouraging users to stay current with the latest features (e.g., 2.5.11 --> 2.5.12) without interrupting their workflow.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - Individual Specs: 
        - @version-upgrade-recommended-component/SKILL.md


## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**


## Implementation Steps

**Step 1: Component Scaffolding**
- *File Placement*: Create `src/components/versioning/UpgradeRecommended.tsx`.

- *Icon Setup:* Integrate `Sparkles`, `ExternalLink`, and `X` from `lucide-react`.

**Step 2: Structural Markup & RTL**
- *Container:* Implement a `div` with `bg-gradient-to-r from-blue-600 to-indigo-600` and `dir="rtl"`.

- *Flex Orchestration:* Use `justify-between` to separate the announcement text from the action buttons.

**Step 3: Styling the CTA & Dismissal**
- *The "Update" Link:* Build a styled `<a>` tag that mimics a button. Ensure `target="_blank"` and `rel="noopener noreferrer"` for external Google Play/App Store safety.

- *The Close Button:* Implement a semantic `<button>` for the `onClose` trigger with `aria-label` for accessibility.

**Step 4: Visual Polish & Animations**
- *Sparkle Pulse:* Apply `animate-pulse` to the `Sparkles` icon to catch the eye subtly.

- *Text Clipping:* Apply `truncate` and `min-w-0` to the text container to prevent layout breaking on small screens.

**Step 5: Integration Logic (Parent Level)**
- *Visibility Control:* Ensure the parent component (e.g., `App.tsx` or `MainLayout.tsx`) manages the state of this banner.

- *Z-Index Audit:* Verify `z-50` ensures visibility above navigation bars but below global modals.


## Technical Checklist
- [ ] Verify `Sparkles` icon is `shrink-0` to prevent distortion.

- [ ] Add `select-none` to prevent accidental text selection during touch interaction.

- [ ] Ensure the font weight is `font-semibold` for the main message.

- [ ] Test the link hover state (`hover:bg-blue-50`) for contrast.


## Styling & UI Checklist (Tailwind)

- [ ] Bar Gradient: `from-blue-600 to-indigo-600`.

- [ ] CTA Pill: `rounded-lg font-black px-2.5 py-0.5`.

- [ ] Accessibility: Dynamic `aria-label` injection using useSplash().getParam('upgrade_close_notification', 'Close Notification').

## State Management & Version Check (UX Lifecycle)
- [ ] Semantic Versioning Parser: Verify that the logic splits the version string (e.g., `.split('.')`) and compares each fragment as an integer (`parseInt`) to accurately detect patch increments.

- [ ] Targeted Trigger: Ensure this banner triggers only when the third digit (Patch) in the store is greater than the current local version, while Major and Minor digits remain identical.

- [ ] Dismissal Suppression: Implement a session-level persistence mechanism (e.g., `sessionStorage` or global layout state) so that once the user clicks the `X` button, the banner remains hidden for the remainder of the session.

- [ ] Target Isolation: Ensure the update link contains `target="_blank"` and `rel="noopener noreferrer"` to guarantee safe external handoff to Google Play / App Store without locking the WebView resources.

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
*AI says: [2026-06-03]*

Before writing any code, I need 5 clarifications. Please answer inline below each question.

---

### Q1 — Local version source
The plan's version-comparison logic splits a version string and compares patch integers. Where does the **local (currently-installed) version** come from?

- **Option A:** `import.meta.env.VITE_APP_VERSION` (a build-time env var in `.env`)
- **Option B:** Capacitor's `App.getInfo()` (native runtime, only available on device)
- **Option C:** `package.json` version exposed via Vite define
- **Option D:** Other — please specify

> Your answer: (B) Capacitor's App.getInfo().
Since this is a Capacitor Android app, the ground truth for the installed version should always come from the native runtime. App.getInfo() returns the actual version the user has installed on their device, which is what you want to compare against the Play Store version. Build-time env vars (A/C) can drift from the actual APK version if the build process isn't perfectly synchronized, making them unreliable for this use case.

---

### Q2 — Store version source & `newVersionAvailable` flag
`SplashApiResponse` already exposes a `newVersionAvailable: boolean` field (see `src/types/splash.ts:17`).
The `platform.utils.ts` also extracts a `lastVersion` string from the `appVersion`/`webVersion` params.

Should the banner trigger from:
- **Option A:** The existing `newVersionAvailable` boolean from the splash API (simplest — no comparison needed in the component)
- **Option B:** A custom comparison: local version vs the `lastVersion` string extracted from splash params (full patch-only logic as described in the plan)

> Your answer: (B) Custom comparison against lastVersion.
newVersionAvailable is a coarse boolean — the server decides, and you have no control over what kind of update it represents. Since UpgradeRecommended is specifically meant to trigger only on patch increments (same major.minor, higher patch), you need the full comparison logic on the client side.
With Option A, a minor or major version bump would also trigger the "soft" banner instead of routing to the appropriate ForceUpgrade or UpgradeRecommended flow — breaking the entire tiered upgrade UX you're building.
Option B gives you precise control: compare major.minor.patch segments explicitly, and fire each banner only for its intended scenario.

---

### Q3 — CTA "Update" link URL
The plan says the CTA links to Google Play / App Store. The URL already lives in the `appVersion`/`webVersion` params (see `platform.utils.ts` — `extractVersionField(params['appVersion'], 'url')`).

Should the `UpgradeRecommended` component:
- **Option A:** Receive the `updateUrl` as a prop from the parent (parent reads it from params)
- **Option B:** Call `useSplash()` internally and derive the URL itself (same pattern as `getFooterData`)

> Your answer: (A) Receive updateUrl as a prop.
UpgradeRecommended is a pure presentational component — its job is to render and handle dismissal, nothing more. Reaching into useSplash() internally would couple a UI component to a data-fetching hook, making it harder to test, reuse, and reason about.
The parent (App.tsx or MainLayout.tsx) already owns the version-comparison logic and the splash params — it's the natural place to derive updateUrl alongside lastVersion. Pass both down as props, and the component stays clean and focused.

---

### Q4 — `getParam` signature mismatch for `aria-label`
The Technical Checklist says:
> *"Dynamic `aria-label` injection using `useSplash().getParam('upgrade_close_notification', 'Close Notification')`"*

However, `getParam(key, defaultValue: number): number` — it returns a **number**, not a string.
A string `aria-label` must come from `getPhrase(key, fallback)`.

Correct mapping to use:
- **Option A:** `getPhrase('upgrade_close_notification', 'Close Notification')` — use the phrase dictionary (string lookup)
- **Option B:** Keep `getParam` and cast to string — `String(getParam(...))` (unintended, not recommended)

> Your answer: (A) getPhrase('upgrade_close_notification', 'Close Notification').
This is a clear-cut case: aria-label is always a string, and getParam is semantically wrong here regardless of casting. Using String(getParam(...)) would be a type hack that misuses a numeric lookup for a string value — it works by accident, not by design.
getPhrase is the correct tool for UI-facing copy strings. Use it as intended.

---

### Q5 — Styling: SCSS file or pure Tailwind?
The `ui-component-layer` skill requires one `src/assets/css/components/[name].scss` per component.
However, **no SCSS files exist anywhere in this project** — it is 100% Tailwind-in-TSX.
The component plan itself is also Tailwind-only (no custom CSS classes defined).

Should we:
- **Option A:** Follow the existing project convention — pure Tailwind in the TSX, no SCSS file created
- **Option B:** Create `src/assets/css/components/upgrade-recommended.css` as a thin wrapper that imports `main.css` (aligns with the skill spec, even if currently unused)

> Your answer: (A) Pure Tailwind in the TSX, no SCSS/CSS file.
The project convention wins over the skill spec. Creating an empty or wrapper-only CSS file adds noise without value — it would be dead code from day one. Consistency with the existing codebase is more important than mechanically following a skill template that wasn't written for this specific project setup.

---

**STOP** — waiting for answers to all 5 questions before proceeding to code generation.

---
*AI says: [2026-06-03] — Implementation complete*

Answers locked in. Decisions recorded:

| # | Decision |
|---|----------|
| Q1 | Local version → `App.getInfo().version` from `@capacitor/app` |
| Q2 | Custom patch comparison via `isPatchOnlyUpgrade()` in `version.utils.ts` |
| Q3 | `updateUrl` received as prop; parent derives it via `getStoreUrl()` |
| Q4 | `getPhrase('upgrade_close_notification', 'סגור התראה')` for aria-label |
| Q5 | Pure Tailwind in TSX, no CSS/SCSS file |

### Files created / modified:
- **Created** `src/utils/version.utils.ts` — `isPatchOnlyUpgrade(local, store)` pure function
- **Modified** `src/utils/platform.utils.ts` — added `getStoreVersion()` and `getStoreUrl()` exports
- **Created** `src/components/versioning/UpgradeRecommended.tsx` — presentational component, reconciled with `raw_from_ai_studio` mock (amber Sparkles, `text-[10px]` CTA, `shadow-xs`)
- **Modified** `src/layouts/AppLayout.tsx` — async version check after splash `isReady`, `sessionStorage` dismissal, banner rendered above Header

### Key implementation notes:
- Banner only appears on native platform (`Capacitor.isNativePlatform()`) — no-op on web
- `versionChecked` ref prevents double-execution if `params` reference changes after splash load
- `sessionStorage` key `upgrade_recommended_dismissed` suppresses banner for the rest of the session
- All UI strings via `getPhrase` — no hardcoded Hebrew/English in JSX

