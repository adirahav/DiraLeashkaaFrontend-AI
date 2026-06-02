# Plan: ScreenHeader Component - Extraction & Refactor

*Objective:* Transform the scroll-reactive header into a reusable component, using Tailwind's transition utilities and the cn helper to manage state-driven animations.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @screen-header-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: CSS Extraction:**
- *Styling Refinement:*
    - Map header states to Tailwind classes: `text-4xl` (large) and `text-2xl` (small).
    - Transition Logic: Apply `transition-all duration-300 ease-in-out` directly to the header elements.
    - Subtitle Animation: Use the `cn` utility to toggle `opacity-0 h-0` on the subtitle when `isScrolled` is true.

**Step 2: Component Refactor**
- *File Placement:* Move the component to components/ScreenHeader.tsx.

- *Logic & Structure:*
    - Apply the structure from @screen-header-component.md.
    - Simplify the TSX by replacing nested ternaries with a single template literal that toggles Tailwind classes using the `cn` utility.
    - Ensure the isAbsolute logic remains but is handled by conditionally adding the absolute class via `cn` rather than complex string manipulation of className.
            
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
### [2026-05-15] Pre-Flight Clarifying Questions — AI

After reading the raw source, the spec, and all 10 current callers, I identified the following gaps that need your decision before I write a single line of code.

---

**Q1 — `isAbsolute` detection: dead code or real feature?**

The plan says to handle `isAbsolute` via `cn` rather than `className.includes('absolute')`. However, **every single caller overrides `className`** — no one relies on the default `absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col ...`. The absolute mode is effectively dead.

Which direction should I take?

- **(a) Remove `isAbsolute` entirely** — drop the two-path logic, have one unified style path. The component is never used in absolute mode today.
- **(b) Keep it as an explicit `isAbsolute?: boolean` prop** — declare intent in the API rather than sniffing the `className` string.
- **(c) Keep the className-sniffing approach** but rewrite it with `cn` (minimal change).

> *Your answer:* (b) Keep it as an explicit isAbsolute?: boolean prop.

The Context: > In AI Studio (our Source of Truth), this component is designed to be anchored and reactive to scroll events. The reason it looks "unused" right now is that the project is mid-refactor, but the design intent requires this absolute positioning for specific desktop layouts.

Refactoring Instructions:
1. Use the isAbsolute prop to replace the className.includes logic.
2. Set the default value of isAbsolute to true (to match the current default className from AI Studio).
3. Use cn to merge the layout classes.
4. Ensure the transition logic for isScrolled is preserved exactly as defined in the source, as the "shrinking header" effect is a key branding element.

---

**Q2 — `className` prop: full replacement or additive?**

Currently `className` **fully replaces** the default layout. Some callers only pass spacing/alignment (e.g. `CalculatorsPage`: `"mb-10"`, `ForgotPasswordPage`: `"text-center mb-8"`) — they never add `flex flex-col transition-all duration-300 ease-in-out` themselves, so those pages likely render the header without flex layout or transitions.

Should `className` become **additive** — merged into a fixed base via `cn` — so callers only need to pass overrides/additions?

- **(a) Yes, additive** — define a base (`flex flex-col transition-all duration-300 ease-in-out`) and `cn`-merge the caller's `className` on top.
- **(b) No, keep full replacement** — callers are responsible for passing all needed layout classes (current behavior).

> *Your answer:* (a) Yes, additive.

Reasoning:
1. Component Integrity: A component should own its core behavior. If ScreenHeader requires flex flex-col and transition-all to function correctly (especially for the scroll animations), these should be base classes that are always present.
2. Developer Experience (DX): The caller shouldn't need to know the internal implementation details (like which transition curve we use). They should only care about external concerns like spacing (mb-10) or positioning.
3. Consistency: By making it additive via cn, we guarantee that every ScreenHeader across the app will animate and layout correctly, regardless of who calls it.

Implementation Logic for Claude:
```TypeScript
// Define base classes that are ALWAYS required
const baseClasses = "flex flex-col transition-all duration-300 ease-in-out";

// Apply conditional layout logic
const layoutClasses = isAbsolute 
  ? "absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex" 
  : "relative";

return (
  <div className={cn(baseClasses, layoutClasses, className)}>
    {/* ... */}
  </div>
);
```

---

**Q3 — Scrolled subtitle: full hide or partial?**

The plan says to apply `opacity-0 h-0` when `isScrolled`. The spec says `opacity-0` + `max-h-0`. But the current raw code keeps `max-h-6 opacity-80` for the non-absolute variant (subtitle partially visible when scrolled).

Which behavior should the refactored component have?

- **(a) Full hide** — `opacity-0 max-h-0` in all cases when `isScrolled`, regardless of layout mode (matches plan + spec).
- **(b) Partial hide** — keep `opacity-80 max-h-6` for the non-absolute case (preserve current raw behavior difference).

> *Your answer:* (b) Partial hide — Preserve the original logic from AI Studio.

Reasoning: The user is correct. Looking closely at the source code, the design distinguishes between layout modes during scroll:
1. Absolute Mode: The subtitle hides completely (max-h-0 opacity-0) to clear the stage for the floating header.
2. elative Mode (Standard): The subtitle only "shrinks" (max-h-6 opacity-80). This keeps the context visible while reducing the vertical footprint of the header.

Implementation for Claude:
Use cn to implement this exact conditional logic:
- If isScrolled && isAbsolute $\rightarrow$ max-h-0 opacity-0 mt-0
- If isScrolled && !isAbsolute $\rightarrow$ max-h-6 opacity-80 mt-0
- Otherwise (not scrolled) $\rightarrow$ max-h-10 opacity-100 mt-1

---

**Q4 — Compact font size: `text-2xl` vs `text-xl` / `text-lg`?**

The plan (Step 1) says the small state uses `text-2xl`, but the spec says `text-xl` or `text-lg`, and the raw code uses `text-xl` (absolute path) and `text-lg lg:text-xl` (non-absolute path).

Which compact size should the refactored component use?

- **(a) `text-2xl`** — as written in the plan.
- **(b) `text-xl`** — as written in the spec.
- **(c) `text-lg` (mobile) / `text-xl` (lg+)** — as in the current raw code.

> *Your answer:* (c) text-lg (mobile) / text-xl (lg+) — Follow the Raw Code.

Reasoning:
- Mobile Optimization: Claude's initial plan was a bit too "generous" with text-2xl. On a mobile device, 2xl is still quite large during a scroll. AI Studio precisely tuned this to text-lg, allowing more screen real estate for the actual content.
- Visual Hierarchy: We want a significant contrast between the default state (text-4xl) and the scrolled state. Moving to xl or lg creates a much more impressive and noticeable "shrinking" effect.
- Preserving the Design: AI Studio has undergone specific design optimization. If we deviate to 2xl, we risk creating a header that feels "stifled" within the layout when it is intended to be compact.

Implementation for Claude:
Use the following logic for the h1:
- Default (Large): text-3xl lg:text-4xl
- Scrolled (Compact): text-lg lg:text-xl

---

**Q5 — Shared scroll hook: in scope or out of scope?**

`AccessibilityPage` (and possibly others) defines its own inline `useEffect` scroll listener. No shared `useScrolled` hook exists yet. Should extracting a `useScrolled(threshold?)` hook be part of this task?

- **(a) Yes, extract `useScrolled`** — reduces duplication across pages.
- **(b) No, out of scope** — scroll state remains the caller's responsibility; the component only receives the boolean prop.

> *Your answer:* (a) Yes, extract useScrolled.

Reasoning:
1. DRY (Don't Repeat Yourself): Having multiple pages implement the exact same useEffect scroll listener is redundant and prone to bugs.
2. Consistency: A shared hook ensures that the "scroll threshold" (the point where the header shrinks) is identical across the entire application.
3. Clean Code: It simplifies the Page components, allowing them to get the isScrolled boolean in a single line of code: const isScrolled = useScrolled(50);.

Implementation Note: Place the new hook in src/hooks/useScrolled.ts. It should take an optional threshold (default to 50 or 20) and return a boolean.

---

*AI says: Waiting for your answers. I will not generate any code until you give the green light.*

---
### [2026-05-15] Decision Summary & Implementation Plan — AI

All questions answered. Proceeding with implementation.

**Decisions locked:**
| # | Decision |
|---|----------|
| Q1 | `isAbsolute?: boolean` prop, default `true`. Replaces `className.includes` sniffing. |
| Q2 | `className` is additive. Base = `flex flex-col transition-all duration-300 ease-in-out`. Non-absolute layout adds `relative`. Caller's `className` merges on top via `cn`. |
| Q3 | Partial hide for non-absolute: `max-h-6 opacity-80` when scrolled. Full hide (`max-h-0 opacity-0`) only in absolute mode. |
| Q4 | `text-3xl lg:text-4xl` (default) → `text-lg lg:text-xl` (scrolled). |
| Q5 | Extract `useScrolled(threshold = 10)` to `src/hooks/useScrolled.ts`. Update all 4 pages that have inline scroll listeners (AccessibilityPage, TermsPage, PropertyPage, MaxPriceCalculatorPage). |

**Caller audit — `isAbsolute` per page:**
- `MaxPriceCalculatorPage` → no className passed → keeps default `isAbsolute=true` (the intended absolute usage).
- All other 9 callers → add `isAbsolute={false}`.

**Caller audit — className cleanup (remove redundant base classes):**
- `AccessibilityPage`: `"mb-8 flex flex-col transition-all duration-300 ease-in-out"` → `"mb-8"`
- `TermsPage`: `"mb-8 flex flex-col transition-all duration-300 ease-in-out"` → `"mb-8"`
- `PropertyPage`: `"flex flex-col transition-all duration-300 ease-in-out"` → remove className prop entirely

*AI says: Implementing now.*