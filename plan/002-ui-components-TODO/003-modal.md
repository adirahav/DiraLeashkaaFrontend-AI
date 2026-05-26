# Plan: Modal Component - Extraction & Refactor

*Objective:* Transform the raw Modal logic into a production-ready UI component using Tailwind CSS for styling and ensuring high-end accessibility.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @modal-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: CSS Extraction:**
- *Styling Refinement:*
    - Use Tailwind color classes: `text-slate-900`, `bg-blue-500`.
    - Backdrop Logic: Apply fixed `inset-0 bg-black/40 backdrop-blur-sm` to the backdrop element..
    - Use Tailwind utility: `overflow-y-auto` and add a custom scrollbar style in `main.css` or via a plugin like `tailwind-scrollbar`.
    - Z-Index: Use Tailwind class: `z-[100]` or define a custom `z-modal` in the config.

**Step 2: Component Refactor**
- *File Placement:* Move the component to components/layout/Modal.tsx.

- *Logic & Structure:*
    - Apply the structure from @modal-component.md.
    - Header/Footer: Ensure the header and footer use Tailwind's `shrink-0` class to stay fixed while the body scrolls.
    - Event Handling: Maintain e.stopPropagation() on the dialog to prevent backdrop click-triggers.
    - RTL Support: Use Logical Properties (`space-x-reverse`, `justify-start`) to handle action placement automatically in RTL.
            
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
### [2026-05-24] Pre-Flight Clarification — AI Questions (STOP-AND-ASK Gate)

*AI says:*

After reading `modal-component.md`, `ui-component-layer/SKILL.md`, `main.css`, and the existing `src/components/common/Modal.tsx`, I have identified 5 ambiguities that must be resolved before any code is written.

---

**Q1 — File Location Conflict**

The plan (Step 2) says: *"Move the component to `components/layout/Modal.tsx`"*.
The spec (`@modal-component.md`) says: *`components/common/Modal.tsx`*.
The file already exists at `src/components/common/Modal.tsx`.

`layout/` holds page-section components (e.g. `HomeCities`, `PropertyForm`). A shared dialog primitive belongs in `common/`.

> **Which path is authoritative — `components/common/Modal.tsx` (spec) or `components/layout/Modal.tsx` (plan text)?**

> *Your answer:* `components/common/Modal.tsx`

---

**Q2 — Scope: Patch vs. Full Rewrite**

The modal already exists and is largely compliant:
- ✅ Backdrop: `bg-slate-900/60 backdrop-blur-sm`
- ✅ Container: `max-w-md rounded-[2rem] shadow-2xl`
- ✅ Animations: `animate-in fade-in zoom-in-95 slide-in-from-bottom-4`
- ✅ RTL footer: `flex-row-reverse`
- ✅ Accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby` + `useId`
- ✅ Scroll lock: `overflow-y-auto custom-scrollbar` + `flex-shrink-0` on header/footer
- ✅ `e.stopPropagation()` on dialog
- ❌ `getPhrase` not used — close button `aria-label` is hardcoded Hebrew `"סגור מודאל"`
- ❌ `cn` utility not used — raw className strings
- ❌ No `z-modal` token in `@theme`

> **Should this be a targeted patch (add `getPhrase`, apply `cn`, add the z-index token) or a full rewrite from scratch?**

> *Your answer:* Perform a Targeted Patch. The current implementation is 90% there. Do not rewrite from scratch; instead, focus on bringing the component to 100% compliance by applying these specific fixes:
1. Refactor Class Names: Replace all raw className strings with the cn utility for better merging and readability.
2. Localization: Replace the hardcoded Hebrew "סגור מודאל" with the getPhrase hook/utility to ensure consistency with our translation layer.
3. Theme Integration: Instead of using a raw z-index, add a z-modal token (or use z-[100]) to keep it consistent with the project's stacking context.
4. Logical Properties: Double-check that flex-row-reverse in the footer is necessary or if Tailwind's logical properties (e.g., space-x-reverse) handle the RTL layout more elegantly.

---

**Q3 — CSS Strategy: SCSS File or Tailwind-Only**

The `ui-component-layer` skill mandates: *"Component styles MUST exist in `src/assets/css/components/[name].scss`"*.
The `modal-component.md` spec lists only `main.css` under Files Structure — no `.scss` file.
Currently, `src/assets/css/` contains **no SCSS files at all** (the directory doesn't exist yet).

> **Do I need to create `src/assets/css/components/modal.scss`, or should all styles remain as Tailwind utility classes in the component (with only the `custom-scrollbar` staying in `main.css`)?**

> *Your answer:* Tailwind-Only

---

**Q4 — Z-Index Token**

The plan says: *"define a custom `z-modal` in the config"*.
`main.css` already defines `--z-index-tooltip: 10005` in `@theme`, but no `z-modal`.
The current component uses raw `z-[100]`.

> **Should I add `--z-index-modal: 100` to the `@theme` block in `main.css` and replace `z-[100]` with the token class, or is the raw arbitrary value acceptable?**

> *Your answer:* Add the token to the theme. We want to avoid raw arbitrary values like z-[100] to ensure a predictable stacking context across the app.
1. Update main.css: Add --z-index-modal: 100; to the @theme block.
2. Implementation: Replace the raw z-[100] class in the component with the tokenized class (e.g., z-modal).
3. Hierarchy Check: Ensure that this value (100) sits correctly below your tooltip token (10005) but above standard layout elements.

Goal: Centralize the z-index management within the theme config for better maintainability.

---

**Q5 — Phrase Key `modal_button_close` in Splash Data**

The spec requires: `getPhrase('modal_button_close', 'Close')` for the close button `aria-label`.
The current code has hardcoded `aria-label="סגור מודאל"`.

> **Does the phrase key `modal_button_close` already exist in the splash/phrases API response, or does it need to be added? And should `getPhrase` also cover the backdrop `aria-hidden` label or only the close button?**

> *Your answer:* Yes, the phrase key `modal_button_close` exists. We need to add `getPhrase` to cover the backdrop `aria-hidden` label as well.

---

**⛔ WAITING FOR ANSWERS — No code will be written until explicit approval is given.**

---
### [2026-05-24] Decisions Locked — Implementation Starting

*AI says:*

All questions answered. Decisions recorded:

| # | Decision |
|---|----------|
| Q1 | File stays at `src/components/common/Modal.tsx` |
| Q2 | Targeted patch: `cn`, `getPhrase`, `z-modal` token, RTL footer check |
| Q3 | Tailwind-only — no SCSS file needed |
| Q4 | Add `--z-index-modal: 100` to `@theme` in `main.css`; use `z-modal` in component |
| Q5 | `modal_button_close` phrase exists; add `getPhrase` to close button AND backdrop label |

**Changes to be made:**
1. `src/main.css` — add `--z-index-modal: 100` to `@theme`
2. `src/components/common/Modal.tsx` — apply `cn`, `useSplash`/`getPhrase`, `z-modal`, verify RTL footer
