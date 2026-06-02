# Plan: Tooltip Component - Extraction & Refactor

*Objective:* Transform the raw Tooltip logic into a production-ready UI component using React Portals and Tailwind utility classes for dynamic styling and positioning.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @tooltip-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Style Configuration (Tailwind):**
- *Styling Refinement:*
    - Shadow & Elevation: Define a high-elevation shadow in `main.css` under the name `shadow-tooltip` or use the built-in `shadow-2xl`.
    - Z-Index Strategy: Use a custom Z-index class like `z-[10005]` or define `z-tooltip` in the config to ensure the tooltip floats above all other elements, including Modals.
    - Visuals: Use Tailwind utilities for the bubble: `bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg`.

**Step 2: Component Refactor**
- *File Placement:* Move the component to `components/common/Tooltip.tsx`.

- *Logic & Structure:*
    - Apply the structure from @tooltip-component.md.

    - Portal Integration: Ensure `createPortal` targets `document.body` to prevent clipping within parent containers with `overflow: hidden`.

    - Dynamic Positioning: Keep the coordinate math (`top`, `left`) as inline styles, but use the `cn` utility to manage all other Tailwind visual classes.

    - Arrow Logic: Refactor the arrow positioning using Tailwind utilities and arbitrary values (e.g., `before:content-[''] before:absolute before:border-4`). Use conditional classes via `cn` to position the arrow based on the `placement` prop.

    - Accessibility: Use `React.useId` to link `aria-describedby` on the trigger with the `id` on the tooltip bubble, and ensure `role="tooltip"` is present.
            
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
### [2026-05-15] AI Pre-Flight — Clarifying Questions (STOP-AND-ASK Gate)

*AI says:*

Before writing any code, I reviewed:
- `raw_from_ai_studio/components/common/Tooltip.tsx` (the source)
- `src/components/common/Tooltip.tsx` (currently identical to the raw file — no changes yet)
- `.claude/skills/ui-component-layer/components/common/tooltip-component.md` (the spec)
- `src/main.css` (Tailwind @theme config)
- `src/lib/utils.ts` (the `cn` utility — confirmed it exists)
- All consumer files (CalcInput, EditableInput, StringInput, Select, NumericInput, YearOfBirth, Textarea, SegmentedControl, AdditionalFundingSources)

I found **5 ambiguities** that require your decision before I can write correct code:

---

**Q1 — Visual Style: Plan vs. Spec conflict (CRITICAL)**

The plan's Step 1 prescribes a **dark minimal bubble**:
> `bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg`

But `tooltip-component.md` (the spec) prescribes a **white card with a blue info icon**:
> `bg-white rounded-2xl`, `shadow-[0_20px_50px_rgba(0,0,0,0.15)]`, with a blue `ℹ` icon and `text-slate-700`.

The current implementation already follows the spec (white card). Which style should the refactored component use?

- [ ] **A** — White card with blue info icon (follow the spec / keep current look)
- [ ] **B** — Dark minimal tooltip (follow the plan's Step 1 Tailwind classes)

> *Your answer:* (A) White card with blue info icon (Follow the AI Studio source).

Reasoning:
1. Design Fidelity: The AI Studio implementation is the definitive source for the product's visual language. It uses a "Card-style" tooltip rather than a "Bubble-style" tooltip to provide better readability for informative text.
2. Rich UI: The inclusion of the blue info icon and the specific padding/rounded corners (rounded-2xl) are key branding elements that provide a more premium feel.
3. Consistency: This style matches the complex shadow and elevation patterns used elsewhere in the application.

Implementation for Claude:
- Background: bg-white with border border-slate-100.
- Shadow: Use the specific shadow from the raw code: shadow-[0_20px_50px_rgba(0,0,0,0.15)].
- Icon: Include the blue info icon (bg-blue-50 text-blue-600) as seen in the raw TSX.
- Text: Use text-slate-700 text-sm and ensure the layout uses flex gap-3 for the icon and text alignment.
- Arrow: Ensure the arrow is white (border-t-white or border-b-white) to match the card body.

---

**Q2 — `shadow-tooltip` token in `main.css`**

The plan says to define `shadow-tooltip` in `main.css`. The file already has:
```css
--shadow-heavy: 0 20px 50px rgba(0, 0, 0, 0.15);
```
This is numerically identical to what the spec requires for the tooltip.

- [ ] **A** — Add a new `--shadow-tooltip` alias that points to the same value (explicit, self-documenting)
- [ ] **B** — Reuse the existing `shadow-heavy` token (`shadow-heavy` in JSX)

> *Your answer:*  (A) Add a new --shadow-tooltip alias.

Reasoning:
- Semantic Naming: In a professional Design System, we prefer names that describe a Role (purpose) rather than just Appearance (visuals). If you decide tomorrow to change the shadow for all Tooltips but want to keep the shadow for Modals the same (even though both currently use heavy), it will be much easier if you have a dedicated token.
- Self-Documentation: When another developer looks at the Tooltip.tsx code and sees shadow-tooltip, they immediately understand it is the standard shadow for that specific component, without having to guess which "weight" of shadow to apply.
- Clean Refactor: This allows us to keep main.css organized by component logic and hierarchy.

Implementation for Claude:
In main.css, define the new variable using the existing one to keep the code DRY (Don't Repeat Yourself):

```CSS
:root {
  --shadow-heavy: 0 20px 50px rgba(0, 0, 0, 0.15);
  --shadow-tooltip: var(--shadow-heavy);
}
```

Inside the Tailwind config or directly in the JSX (using shadow-[var(--shadow-tooltip)]), use the new semantic token.

---

**Q3 — `z-tooltip` token in `main.css`**

The plan says to define `z-tooltip` in the config. The current code uses the arbitrary value `z-[10005]`.

- [ ] **A** — Add `--z-index-tooltip: 10005` to `main.css` @theme and use `z-[var(--z-index-tooltip)]` (or `z-tooltip` if Tailwind v4 maps it)
- [ ] **B** — Keep the arbitrary value `z-[10005]` (simpler, no config change needed)

> *Your answer:* (A) Add --z-index-tooltip: 10005 to main.css.

Reasoning:
- Centralized Control: Values like 10005 are "magic numbers." If you add other elements later (like toast notifications or new modals) and need to manage which stays on top, it is much easier to handle the "Z-index war" in one central location (main.css) rather than hunting through TSX files for where you hardcoded 10005.
- Semantic Intent: Using z-[var(--z-index-tooltip)] explains why the Z-index is set that way. It makes the code more readable and self-explanatory for other developers.
- Consistency: This aligns with our decision in Q2 regarding the shadow. We are building a system with clear rules rather than a collection of ad-hoc fixes.

Implementation for Claude:
1. In main.css, add: --z-index-tooltip: 10005;
2. In the Tooltip component, use the Tailwind arbitrary property syntax: className={cn("... z-[var(--z-index-tooltip)]")}.

---

**Q4 — Arrow rendering technique**

The plan says to refactor the arrow using `before:content-[''] before:absolute before:border-4` (CSS pseudo-element via Tailwind).
The current code uses a real `<div>` with `border-[10px] border-transparent border-t-white` (the CSS border-triangle trick).

- [ ] **A** — Migrate arrow to a `::before` pseudo-element using Tailwind `before:*` utilities (as the plan prescribes)
- [ ] **B** — Keep the arrow as a real `<div>` (simpler, already working, avoids stacking-context issues with portals)

> *Your answer:* (B) Keep the arrow as a real <div>.

Reasoning:
- Maintainability: The existing code from AI Studio already calculates the arrowOffset (the precise position of the arrow relative to the trigger) and injects it as an inline style. It is far more readable to apply style={{ left: arrowOffset }} to an actual div than to attempt injecting dynamic CSS variables into a pseudo-element via Tailwind's complex syntax.
- Source of Truth: The arrow in the AI Studio source uses a specific size (border-[10px]) and a drop-shadow-sm. Controlling the shadow and alignment is more straightforward when the arrow is a distinct element.
- Simplicity: Using before: utilities in Tailwind results in extremely long, cluttered class strings (e.g., before:content-[''] before:absolute before:border-transparent...). A simple, dedicated div is much cleaner.

Implementation:
Keep the current structure from the raw source:

```TypeScript
<div 
  className={cn("absolute border-[10px] border-transparent drop-shadow-sm", arrowClasses)}
  style={{ left: `${arrowOffset}%`, transform: 'translateX(-50%)' }}
/>
```

---

**Q5 — Entry animation on the tooltip bubble**

The spec says "fade-in and zoom-in (200ms) for smooth appearance". The `main.css` already defines `animate-in`, `fade-in`, `zoom-in-95` as custom utilities.

- [ ] **A** — Add `animate-in fade-in zoom-in-95 duration-200` to the tooltip bubble's className
- [ ] **B** — No animation (keep as-is, show/hide is already instant via `{show && ...}`)

> *Your answer:* (A) Add animate-in fade-in zoom-in-95 duration-200 to the tooltip bubble's className.

Reasoning:
- Polished UX: A hard "pop-in" of a large white card can feel jarring. Adding a subtle fade and scale-up (zoom-in) makes the interface feel much smoother and more professional.
- Leveraging Existing Work: Since these utilities (animate-in, fade-in, etc.) are already defined in your main.css, it costs almost nothing in terms of bundle size or complexity to implement them.
- Design Alignment: The "premium" look we established in Q1 (white card, heavy shadow) is best complemented by a "premium" entrance animation.

Implementation for Claude:
Add the following classes to the Tooltip bubble's cn function:
animate-in fade-in zoom-in-95 duration-200

---

*Waiting for answers before writing any code.*

---
### [2026-05-15] AI Implementation Decisions — Post-Approval Summary

*AI says:*

All 5 questions answered. Decisions recorded below before code generation begins.

| # | Decision | Implementation |
|---|----------|----------------|
| Q1 | White card with blue info icon | `bg-white rounded-2xl border border-slate-100 ring-1 ring-black/5 text-slate-700 text-sm` + SVG info icon |
| Q2 | New `--shadow-tooltip` alias | Added to `@theme` in `main.css`; used as `shadow-[var(--shadow-tooltip)]` in JSX |
| Q3 | New `--z-index-tooltip: 10005` token | Added to `@theme` in `main.css`; used as `z-[var(--z-index-tooltip)]` in JSX |
| Q4 | Keep arrow as real `<div>` | `cn("absolute border-[10px] border-transparent drop-shadow-sm", arrowClasses)` |
| Q5 | Add entry animation | `animate-in fade-in zoom-in-95 duration-200` on bubble className via `cn` |

**Files to modify:**
1. `src/main.css` — add two new @theme tokens
2. `src/components/common/Tooltip.tsx` — full refactor (add `cn` import, semantic tokens, animation, clean up unused var)

