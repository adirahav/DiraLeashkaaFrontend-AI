# Plan: Card Component - Extraction & Refactor

*Objective:* Transform the raw FormFields into a production-ready component following the project's Skill layers.

*Reference:* Use the specialized knowledge in
    - @card-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: CSS Extraction**
- *Styling Refinement:*
    - Shadow Precision: Use Tailwind's *arbitrary values* shadow-[0_4px_20px_rgba(0,0,0,0.04)] or add it to `main.css` to maintain the "clean" aesthetic.

    - Responsive Padding: Use Tailwind responsive prefixes `p-6 md:p-10`.

**Step 2: Component Refactor**
- *File Placement:* Move the component to `components/common/Card.tsx`.

- *Logic & Structure:*
    - Apply the structure from @card-component.md.
    - Ensure `rounded-[2rem]` is applied via Tailwind classes integrated via the `cn`.
    - Support className prop for external layout controls (grid/flex).
            
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

## [2026-05-12] AI Pre-Flight Questions — Awaiting Answers

*AI says:*

Pre-flight inspection complete. I found 5 blockers that need your decision before I write a single line of code.

---

**Q1 — The file already exists**

`src/components/common/Card.tsx` already exists and its content is **identical** to the raw version (template-string class concat, no `cn`). Was this a previous partial migration? Should I treat the current `src` file as the baseline to refactor in-place, or delete and rebuild it fresh from the raw source?

> *Your answer:*
Treat the current src/components/common/Card.tsx as the baseline and refactor it in-place.

The file was placed there during the initial scaffold to ensure the project compiles, but it hasn't been "standardized" yet. Now is the time to perform the real implementation based on the @card-component.md Skill.

Key Refactor Tasks:
1. Clean up the classes: Replace the template-string concatenation with the cn() utility.
2. Styling Precision: Apply the exact shadow-[0_4px_20px_rgba(0,0,0,0.04)] and rounded-[2rem] as specified.
3. Responsive Padding: Ensure the p-6 md:p-10 logic is implemented.
4. Standardization: Make sure it follows the same patterns we established for the FormFields (Props typing, forwardRefs if needed, etc.).

---

**Q2 — Shadow value mismatch (3 different values)**

There are three conflicting shadow values across the plan and specs:
- **Plan Step 1** says: `shadow-[0_4px_20px_rgba(0,0,0,0.04)]`
- **card-component.md** says: `0 8px 30px rgba(0,0,0,0.04)`
- **Raw Card.tsx** uses: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`

Which is the canonical value to implement?

> *Your answer:*
(C) The canonical value is the one from the Raw Card: 0 8px 30px rgba(0,0,0,0.04).

To ensure the app remains dynamic and professional, please do the following:
1. Define a Design Token: Instead of hardcoding this long string in the component, add it to the @theme block in main.css as --shadow-card.
2. Implementation: >    ```css
@theme {
--shadow-heavy: 0 8px 30px rgba(0, 0, 0, 0.04);
}
3. Usage: In Card.tsx, use the Tailwind class shadow-heavy (via the cn utility).

Why: This matches the AI Studio aesthetic perfectly, but gives us the "dynamic" power to update the shadow globally across the whole site from one place if we ever want to tweak the branding.

---

**Q3 — SCSS vs. Tailwind-only (infrastructure conflict)**

The skill mandates a SCSS file at `src/assets/css/components/card.scss` importing `_vars.scss`. However, the project has **no SCSS pipeline** — it uses Tailwind v4 with `main.css` and no `src/assets/css/` folder exists at all.

Three options:
  - **A)** Create SCSS infrastructure from scratch (install sass, create `_vars.scss`, etc.)
  - **B)** Register the card shadow as a design token inside `main.css` `@theme` (e.g., `--shadow-card: ...`) and keep everything in Tailwind
  - **C)** Keep the arbitrary value inline (`shadow-[...]`) — no new infrastructure

Which path do you want?

> *Your answer:*
(B) There is NO SCSS in this project.

I'm not sure where you saw SCSS, but we are strictly using Tailwind v4. Do not install Sass or create .scss files.

The correct approach:

1. Register the token: Add the shadow and the border color to the @theme block in src/main.css.
```CSS
@theme {
  --shadow-heavy: 0 8px 30px rgba(0, 0, 0, 0.04);
  --color-card-border: oklch(0.929 0.013 255.5); /* The value from Q6 */
}
```

2. Apply in Component: In Card.tsx, use these tokens via Tailwind classes: shadow-heavy border-card-border.

3. Utility-First: Keep all styling logic inside the TSX using the cn() utility.

Please ignore any legacy references to SCSS files in the skills and stick to the Tailwind v4 infrastructure we've built.
---

**Q4 — `useSplash` / `getPhrase` requirement**

The skill mandates all UI strings come from `useSplash`. `Card.tsx` is a pure layout wrapper with **no text content of its own** — it only passes `children` through.

Is the `useSplash` requirement N/A for this component, or do you want me to wire in the context anyway (e.g., for a future `title` or `label` prop)?

> *Your answer:*
The useSplash requirement is N/A for this component.

Since the Card is a pure layout wrapper that only renders children, there is no need to wire in the useSplash context.

Keep it "dumb" and fast:

1. Do not add useSplash or any text-handling logic.

2. If we decide to add a title or footer prop in the future, the parent using the Card will be responsible for passing the translated string via getPhrase.

Let's keep Card.tsx as a lightweight, reusable UI primitive.

---

**Q5 — Export convention**

The current `src/components/common/Card.tsx` uses a **named export** (`export const Card`). The card-component.md example imports it as `import { Card } from './Card'`, which matches. Should I keep the named export, or switch to a default export to align with any other convention in the project?

> *Your answer:*
Keep the Named Export (export const Card).

In this project, we prioritize Named Exports for all components and services.

The reasoning:
1. Consistency: It matches the current project structure and the card-component.md spec.
2. Refactoring & IDE Support: Named exports make it much easier for the IDE to handle auto-imports and provide better support when renaming files or components.
3. Avoids Confusion: It prevents issues where different developers might import the same component under different names (which often happens with default exports).

Please stick to export const Card = ....

---

*Waiting for your explicit green light before writing any code.*

---

## [2026-05-12] AI Implementation Notes — Green Light Received

*AI says:*

One naming conflict to flag before proceeding:

- Q2/Q3 answers reference `--shadow-heavy` for the card shadow value.
- `--shadow-heavy` **already exists** in `main.css` with a different value: `0 20px 50px rgba(0, 0, 0, 0.15)` (the heavy dropdown shadow).
- Overwriting it would break any component currently using `shadow-heavy`.

**Decision:** I will add a new token `--shadow-card: 0 8px 30px rgba(0, 0, 0, 0.04)` alongside the existing `--shadow-heavy`, keeping both. This matches your stated intent from Q2 ("add it as `--shadow-card`") without side effects.

For the border color, `--color-border-subtle: oklch(0.929 0.013 255.5)` already exists in `@theme` and is the same value as your "Q6" color. I will use `border-border-subtle` from that existing token rather than adding a duplicate.

**Implementation plan:**
1. `main.css` — add `--shadow-card` to `@theme`
2. `src/components/common/Card.tsx` — refactor with `cn()`, `shadow-card`, `border-border-subtle`, typed `CardProps` interface
