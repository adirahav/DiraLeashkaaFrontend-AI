# Plan: Tailwind & Modern Style Architecture Initialization

## Task Overview
Initialize the project's styling infrastructure by establishing a utility-first Tailwind core. This replaces traditional SCSS hierarchies with a centralized configuration and a dynamic class-merging utility. All implementation must follow the updated Tailwind Pure Architecture principles.

*Reference:* Use the specialized knowledge in @css-layer/SKILL.md.

## Phase 1: Core Configuration (The "Engine")
1. **Style Infrastructure:** Initialize Tailwind v4 theme variables in main.css.
  - *Colors:*  Map --color-* variables to Emerald/Blue/Red palettes to match the component SKILLs.
  - *Custom Spacing/Sizes:* Define custom utility --spacing-input-h: 54px to ensure UI consistency across all inputs.
  - *Shadows:* Define the `heavy` shadow for dropdowns and cards.
  - *RTL Support:* Validate that logical properties are active for Hebrew support.

2. **The cn Utility:** Create `src/lib/utils.ts`.
  - Implement the `cn` helper using `clsx` and `tailwind-merge`. This is mandatory for merging conditional classes across all components.

3. **Global Stylesheet:** Create `src/index.css`.
  - Include `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`.
  - Set the default font family and ensure `box-sizing: border-box` is active globally.

## Phase 2: Layout & RTL Foundation
1. **Directional Setup:** Apply `dir="rtl"` at the root level (e.g., index.html or App.tsx).

2. **Main Layout Wrapper:** Create `src/components/layouts/MainLayout.tsx`.
  - Use Tailwind Grid utility classes (e.g., `grid grid-cols-12 gap-4`).
  - Set max-width containers and responsive padding.

## Phase 3: Integration & Verification
1. **App-Level Import:** Ensure `index.css` is imported only once in `main.tsx`.

2. **Verification Checklist:**
  - [ ] *Merging:* Test that `cn("default-class", props.className)` merges correctly without conflicts.
  - [ ] *RTL:* Verify that `ps-4` applies padding to the right in RTL mode.
  - [ ] *Theming:* Ensure `bg-primary` or` bg-emerald-600` pulls the correct color from the config.

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
### [2026-05-11] AI Pre-Flight Questions — STOP-AND-ASK Gate

*AI says:*

Before generating any code, I need answers to the following questions. I will not proceed until you explicitly approve.

---

**Q1 — Theme variables location: `main.css` vs. existing `index.css`**

The plan calls for a new `main.css` to hold Tailwind v4 `@theme` variables, but `src/index.css` already exists and contains `@import "tailwindcss"` plus substantial accessibility/animation CSS.

Which approach do you want?

- **A.** Keep all theme tokens in the existing `src/index.css` (add `@theme { ... }` block at the top). No new file created.
- **B.** Create a new `src/main.css` for theme tokens only, and `@import "./main.css"` from `index.css`. Two files, clear separation.
- **C.** Rename `index.css` → `main.css` and update the import in `main.tsx`.

*Why this matters:* The SKILL says "zero CSS files" but we already have one with legitimate accessibility overrides that cannot be expressed in Tailwind utilities (e.g. `body.high-contrast` selectors, `::-webkit-scrollbar`, `@keyframes`). I need to know if I should leave those in place or how to handle them.

> *Your answer:*
(C) Rename `index.css` → `main.css` and update the import in `main.tsx`.

---

**Q2 — Exact color tokens to define**

The plan says "Map `--color-*` variables to Emerald/Blue/Red palettes." The components in `src/` already use hard-coded Tailwind class names like `bg-emerald-600`, `text-blue-800`, `text-red-500`, etc.

What exactly should I define in `@theme`?

- **A.** Semantic aliases only — e.g. `--color-primary: var(--color-emerald-600)`, `--color-danger: var(--color-red-500)`. Components stay as-is with `bg-emerald-600` etc.
- **B.** Replace all direct palette references with semantic tokens — e.g. `bg-primary` replaces `bg-emerald-600` everywhere. This requires touching all existing components.
- **C.** Define tokens in `@theme` but leave components untouched for now (future migration).

*Why this matters:* Option B is a large scope change not mentioned in the plan. Options A and C are safe. I need to know the intended scope before touching any component files.

> *Your answer:*
(A) Create semantic aliases like --color-primary: var(--color-emerald-600) and --color-danger: var(--color-red-500) in the theme.

Important: Leave the components as-is with their direct palette references (like bg-emerald-600) for now. We want to ensure the styling infrastructure is ready without performing a massive refactor across all files yet. We will transition to semantic tokens (bg-primary) gradually as we stabilize each module.

---

**Q3 — The `heavy` shadow: exact CSS values?**

The plan says define a `heavy` shadow for dropdowns and cards, but gives no values. What should the exact `box-shadow` CSS be?

- **A.** Use a sensible default: `0 20px 60px -10px rgba(0,0,0,0.25), 0 8px 20px -5px rgba(0,0,0,0.15)`.
- **B.** Provide your own values.
- **C.** Inspect existing components in `raw_from_ai_studio/` or `src/` that reference shadows and derive it from there.

> *Your answer:*
(C) Inspect existing components in `raw_from_ai_studio/` and derive it from there.

---

**Q4 — `clsx` and `tailwind-merge` packages are NOT installed**

These are required for the `cn` utility but are absent from `package.json`. Should I run `npm install clsx tailwind-merge` as part of this task?

- **A.** Yes — install them and create `src/lib/utils.ts`.
- **B.** No — they are already available some other way (please clarify).

> *Your answer:*
(A) Yes — install them and create `src/lib/utils.ts`.

---

**Q5 — `MainLayout` directory: `layout/` or `layouts/`?**

The plan says create `src/components/layouts/MainLayout.tsx` (with an 's'), but the existing directory is `src/components/layout/` (no 's'). What do you want?

- **A.** Create `src/components/layouts/` (new folder with 's' as the plan states).
- **B.** Place it in the existing `src/components/layout/` folder.

> *Your answer:*
(B) Place it in the existing `src/components/layout/` folder.

---

**Q6 — Existing accessibility CSS in `index.css`: keep or refactor?**

`src/index.css` contains ~150 lines of CSS-class-based logic for high-contrast mode, large fonts, grayscale, underline-links, and custom scrollbars. These rely on `body.high-contrast`, `body.font-size-large`, etc. — patterns that cannot be replaced with Tailwind utilities without JavaScript state changes.

- **A.** Keep these as-is (they are a valid exception to the Zero-CSS Policy).
- **B.** Migrate them to Tailwind's arbitrary-value syntax and JavaScript-driven `className` toggling (large scope change).
- **C.** Move them to a separate `src/accessibility.css` file to keep the main stylesheet clean.

> *Your answer:*
(C) Please move all the legacy accessibility logic into src/styles/accessibility.css. This keeps our main stylesheet clean and adheres to the "Zero-CSS" policy for all new styling, while treating the existing accessibility layer as a necessary, isolated exception.

Wait, one more correction regarding the CSS files:
Consistent with our initial plan in Phase 1: Rename index.css to main.css.

The final structure should be:

1. src/styles/accessibility.css (The legacy CSS).

2. src/main.css (The Tailwind v4 core).

Important: In src/main.tsx, please import accessibility.css first, and then main.css. This ensures Tailwind's utilities can override legacy styles if needed. Please update the Plan to reflect these names and the import order.

---

*STOP — Waiting for your explicit approval and answers before writing any code.*

---
### [2026-05-11] Decisions Log — Implementation Approved

*AI says:*

All answers received. Proceeding with implementation based on the following decisions:

| # | Decision |
|---|---------|
| Q1 | Rename `src/index.css` → `src/main.css`; update import in `main.tsx` |
| Q2 | Semantic aliases only (`--color-primary`, `--color-danger`, etc.) in `@theme`; components stay as-is |
| Q3 | Heavy shadow = `0 20px 50px rgba(0, 0, 0, 0.15)` (derived from Dropdown component in `raw_from_ai_studio`) |
| Q4 | Install `clsx` + `tailwind-merge`; create `src/lib/utils.ts` |
| Q5 | `MainLayout.tsx` → `src/components/layout/` (existing folder, no 's') |
| Q6 | Move all accessibility CSS to `src/styles/accessibility.css`; import `accessibility.css` first, then `main.css` in `main.tsx` |

**Final file structure:**
```
src/
  styles/
    accessibility.css     ← legacy accessibility overrides (valid exception to Zero-CSS)
  main.css                ← Tailwind v4 core (@import + @theme + base globals + utils)
  lib/
    utils.ts              ← cn() helper (clsx + tailwind-merge)
  components/
    layout/
      MainLayout.tsx      ← grid layout wrapper
  main.tsx                ← imports: accessibility.css → main.css
```
