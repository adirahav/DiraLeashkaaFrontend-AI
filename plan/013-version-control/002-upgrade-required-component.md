# Plan: UpgradeRequired - Implementation

## Task Overview
Implement a high-impact, full-screen mandatory upgrade overlay. This component acts as a "hard gate" for users on deprecated versions (Major/Minor mismatch). It completely replaces the application viewport, disabling all navigation and interaction until the user redirects to the store for a mandatory core update.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - Individual Specs: 
        - @version-upgrade-required-component/SKILL.md


## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**


## Implementation Steps

**Step 1: Layout & Backdrop Engineering**
- *File Placement:* `src/components/common/UpgradeRequired.tsx`.

- *Full-Screen Shell:* Create a `min-h-screen` container with `bg-slate-50` and `overflow-hidden`.

- *Visual Atmosphere:* Inject the absolute-positioned decorative blobs with `blur-3xl` and low opacity (`bg-blue-500/10`) to create the premium "locked" feel.

**Step 2: The Warning Architecture (The Card)**
- *Centering Logic:* Use `flex items-center justify-center` to snap the content to the middle.

- *Container Styling:* Build the white card with `rounded-[2rem]`, `shadow-2xl`, and `border-slate-100`.

- *Icon Integration:* Place the `AlertTriangle` inside a soft amber background, applying `animate-pulse` for urgency.

**Step 3: Localized Content & Typography**
- *Title & Body:* Use `useSplash().getParam()` to pull the title ("שדרוג מערכת חובה") and the explanation text.

- *Fallback Safety:* Always provide sensible Hebrew defaults as the second argument in `getParam`.

- *System Info:* Add the bottom metadata section (SYS_UPGRADE_REQUIRED) using a mono font for a technical/system-level appearance.

**Step 4: The Mandatory CTA (Call to Action)**
- *Action Button:* Implement the `<a>` tag styled as a large button (`bg-blue-600, rounded-2xl`).

- *External Protocol:* Ensure `target="_blank"` and `rel="noopener noreferrer"` for external browser/store handoff.

- *Iconography:* Add the `ArrowRight` (or `ArrowLeft` for RTL context) with a thick stroke.

**Step 5: Version Guard & Logic (UX Lifecycle)**
- *No-Exit Policy:* Strictly omit any close buttons or "skip" options.

- *Logic Trigger:* This component should be rendered at the highest level of the application (e.g., `App.tsx`) before the Router, if the `isMandatoryUpdate` flag is true.


## Technical Checklist
- [ ] Use `useSplash().getParam` for: Title, Body Text, and Button Label.

- [ ] Ensure `z-index` is high enough to cover all global headers/footers.

- [ ] Verify that `dir="rtl"` is applied to the root container.

- [ ] Check that the `AlertTriangle` icon is `shrink-0`.

## Styling & UI Checklist (Tailwind)
- *The Warning Card:*
   - [ ] `w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 md:p-12`
   - [ ] Border logic: border `border-slate-100` for subtle definition.

- *The Pulse Icon Container:*
   - [ ] `w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center`
   - [ ] Icon: `AlertTriangle` with `size={36}` and `text-amber-500`.

- *Primary Action (CTA):*
   - [ ] `bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-2xl`
   - [ ] Shadow: `shadow-lg shadow-blue-200 hover:shadow-xl transition-all`.

- *Visual Flourish (Blobs):*
   - [ ] `Top-Left Blob: absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl`
   - [ ] Bottom-Right Blob: `absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl`


## State Management & Version Check (UX Lifecycle)
- [ ] Major/Minor Logic: Verify that this screen triggers if the Major or Minor version in the store is higher than the current local version.

- [ ] State Lockdown: Ensure that once this state is active, the app's global state prevents any background API calls to save resources.

- [ ] Phrase Mapping: - `upgrade_required_title`: "שדרוג מערכת חובה"
    - `upgrade_required_body`: "הגרסה בה אתה משתמש אינה נתמכת עוד..."
    - `upgrade_required_cta`: "מעבר לגרסה החדשה"

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
### 2026-06-03 — Pre-Flight Clarifying Questions (AI)

**Q1 — `getParam` vs `getPhrase` for text content**

The plan's Technical Checklist states: *"Use `useSplash().getParam` for: Title, Body Text, and Button Label."*

However, in the live codebase, `useSplash().getParam(key, defaultValue: number): number` is typed to return a **number** (used for fixed numeric parameters like fees, thresholds). String content (labels, messages) is retrieved via `useSplash().getPhrase(key, fallback: string): string` — as seen in `UpgradeRecommended.tsx:14-16`.

**Clarification needed:** Should all three text values (title, body, CTA label) use `getPhrase`, not `getParam`? Or is there a plan to extend `getParam` to support string values?

> User answer: Confirmed — use getPhrase for all three text values:

getPhrase('upgrade_required_title', 'שדרוג מערכת חובה')
getPhrase('upgrade_required_body', 'הגרסה בה אתה משתמש אינה נתמכת עוד...')
getPhrase('upgrade_required_cta', 'מעבר לגרסה החדשה')

The plan has a bug — getParam is numeric-only. getPhrase is the correct hook for all UI-facing string content, consistent with the pattern already established in UpgradeRecommended.tsx.
---

**Q2 — CTA URL: hardcoded vs. dynamic from splash params**

The raw AI Studio file hardcodes `href="https://v2.diraleashkaa.co.il"`. The sibling component `UpgradeRecommended` derives its URL dynamically via `getStoreUrl(params)` from `platform.utils.ts`, which reads the `appVersion`/`webVersion` splash param.

The plan says the component is "Static: No props required" — but if the URL is splash-driven, it needs either:
- (a) the same `getStoreUrl(params)` pattern (no props needed, dynamic), or
- (b) a hardcoded URL constant.

**Clarification needed:** Should the CTA URL come from `getStoreUrl(params)` like `UpgradeRecommended` does, or remain hardcoded?

> User answer: getStoreUrl(params) — dynamic, same pattern as UpgradeRecommended.
Hardcoding the URL is a maintenance trap — if the Play Store URL ever changes, it requires a new app release to fix it. Since the infrastructure to serve it dynamically already exists via splash params, there's no reason not to use it.
The plan's "Static: No props needed" note remains valid — the component reads the URL internally from useSplash() params, no prop required.
 
---

**Q3 — `isMandatoryUpdate` flag: where is it computed and who owns it?**

The plan says: *"This component should be rendered at the highest level of the application (e.g., App.tsx) before the Router, if the `isMandatoryUpdate` flag is true."* 

Today, `AppLayout.tsx` runs `isPatchOnlyUpgrade()` locally in a `useEffect` with local `useState`. There is no `isMandatoryUpdate` in the Zustand store and no `isMajorMinorUpgrade()` function in `version.utils.ts`.

**Clarification needed:**
- Should I add an `isMajorMinorUpgrade(local, store): boolean` function to `version.utils.ts`?
- Should `isMandatoryUpdate` live in the Zustand store (which store slice?), or in local state inside `AppLayout.tsx` / `App.tsx` like `UpgradeRecommended` currently does?

> User answer: Confirmed — the component has no opinion on how isMandatoryUpdate is derived or who owns it.
For this plan's scope:
- Yes, add isMajorMinorUpgrade(local, store): boolean to version.utils.ts — the component needs the utility to exist, but doesn't call it directly.
- UpgradeRequired simply renders when told to. State ownership (Zustand vs local) is the next plan's concern.

---

**Q4 — Render location: `App.tsx` before Router, or alongside `UpgradeRecommended` in `AppLayout.tsx`?**

The plan says to render before the Router in `App.tsx`. But `UpgradeRecommended` (the soft-upgrade sibling) lives in `AppLayout.tsx`, which already imports `useSplash`, `isPatchOnlyUpgrade`, and `App.getInfo()`.

Placing `UpgradeRequired` in `AppLayout.tsx` would keep both version checks co-located and avoid duplicating the `App.getInfo()` + splash params logic in two separate files.

**Clarification needed:** Should I follow the plan strictly and wire into `App.tsx`, or is `AppLayout.tsx` acceptable for keeping both version checks together?

> User answer: AppLayout.tsx — same answer as Q4 above.
Co-location wins. The plan's placement suggestion is a guideline, not a constraint.

---

**Q5 — SCSS file requirement**

The `ui-component-layer` SKILL mandates: *"Component styles MUST exist in `src/assets/css/components/[name].scss` and import `../_vars.scss`."* The component itself is 100% Tailwind utility classes with nothing requiring custom SCSS.

**Clarification needed:** Should I create an empty/stub `upgrade-required.scss` file to satisfy the layer contract, or is Tailwind-only acceptable and no `.scss` file is needed for this component?

> User answer: Tailwind-only, no SCSS file — same decision as UpgradeRecommended (Q5 previously).
Project convention overrides the skill spec. Don't create stub files.

---

*Waiting for your answers before proceeding to code generation.*

---
### 2026-06-03 — Implementation Decisions (AI)

**Decisions applied based on user answers:**

- **Text content:** All three strings use `getPhrase` — Q1 answer confirmed the plan doc had a bug.
- **CTA URL:** `getStoreUrl(params)` — dynamic, consistent with `UpgradeRecommended`.
- **`isMajorMinorUpgrade`:** Added to `version.utils.ts`. Returns `true` when store major > local major, OR store major equals and store minor > local minor.
- **State ownership:** Local `useState` in `AppLayout.tsx` (same pattern as `UpgradeRecommended`). Zustand migration is a future concern.
- **Render location:** Early-return guard in `AppLayout.tsx` before the main JSX — keeps both version checks co-located.
- **SCSS file:** None created — Tailwind-only, consistent with `UpgradeRecommended`.
- **`ArrowLeft` icon:** Used instead of `ArrowRight` — semantically correct for RTL (points "forward" in Hebrew layout).
- **`fixed inset-0`:** Used instead of `min-h-screen` alone — ensures the overlay truly covers the full viewport even if called from inside `AppLayout`.

**Files changed:**
- `src/utils/version.utils.ts` — added `isMajorMinorUpgrade()`
- `src/components/versioning/UpgradeRequired.tsx` — new component (created)
- `src/layouts/AppLayout.tsx` — imports, `showRequiredGate` state, early-return guard
