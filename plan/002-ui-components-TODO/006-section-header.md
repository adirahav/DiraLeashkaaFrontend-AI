# Plan: SectionHeader Component - Extraction & Refactor

*Objective:* Convert the SectionHeader into a clean Tailwind component, replacing inline styles with a structured variant mapping using the `cn` utility.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @section-header-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: CSS Extraction:**
- *Styling Refinement:*
    - Color Map: Create a constant object in the TSX file that maps variants to Tailwind classes (e.g., `emerald: "bg-emerald-100 text-emerald-700"`).
    - Shadow Precision: Use Tailwind sizing: `w-8 h-8` for the badge and `text-sm` for the font size.

**Step 2: Component Refactor**
- *File Placement:* Move the component to components/common/SectionHeader.tsx.

- *Logic & Structure:*
    - Apply the structure from @section-header-component.md.
    - Use the `cn` utility to apply classes based on the variant constant: `cn(baseClasses, variantMap[variant])`.
    - Ensure React.cloneElement logic is preserved to maintain consistent icon sizing regardless of what the parent passes.
            
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
### [2026-05-15] Pre-Flight Clarifying Questions (AI)

**Context:** `src/components/common/SectionHeader.tsx` already exists and is nearly complete — a direct copy of `raw_from_ai_studio`. The main outstanding work is replacing template-literal class composition with `cn()`. However, four ambiguities need resolution before proceeding.

---

**Q1 — Variant Style: Soft vs. Solid?**

The plan's Step 1 "Color Map" example shows:
```
emerald: "bg-emerald-100 text-emerald-700"
```
This is a **muted/soft** look — light background, dark colored icon text.

But the raw component and `@section-header-component.md` use:
```
emerald: "bg-emerald-600 shadow-emerald-200"
```
This is a **solid/bold** look — deep colored background, white icon.

Which visual style should the refactored component implement?

- [ ] **A) Solid** — keep `bg-{color}-600` with `text-white` and colored shadow (current behavior).
- [ ] **B) Soft** — switch to `bg-{color}-100 text-{color}-700` (plan example).

> *Your answer:* (A) Solid — Keep the bold look (current behavior).

Reasoning:
- Visual Hierarchy: The SectionHeader is a primary structural element. Using a Solid background ($bg-600/500$) with a white icon creates a strong anchor point for the user's eye, which is essential for clear section breaks.
- Adherence to Source of Truth: The AI Studio code is the definitive reference for the design system. It explicitly uses high-contrast backgrounds and colored shadows ($shadow-color-200$).
- Premium Aesthetic: The "glow" effect created by placing a $600$ weight background over a $200$ weight shadow is a signature part of the app's modern UI. Switching to "Soft" ($bg-100$) would make the headers look like secondary tags rather than primary titles.

---

**Q2 — Shadow: Tailwind utility class vs. custom `@theme` token?**

The spec says: *"custom `shadow-lg` with a specific `rgba` or color variable"*.

Currently the shadow color is expressed as a Tailwind utility (`shadow-emerald-200`), which Tailwind v4 resolves via `--tw-shadow-color`. There is no custom shadow token in `src/main.css`.

Two options:
- [ ] **A) Keep as-is** — `shadow-lg shadow-{color}-200` Tailwind classes are sufficient.
- [ ] **B) Register custom tokens** — add per-variant shadow tokens to `src/main.css` `@theme` (e.g., `--shadow-section-emerald: 0 4px 14px rgba(...)`).

> *Your answer:* (A) Keep as-is — shadow-lg shadow-{color}-200 Tailwind classes are sufficient.

Reasoning:
- Tailwind Native Power: Tailwind’s shadow-color utility is designed exactly for this. By combining shadow-lg with shadow-{color}-200, we achieve the "glow" effect without bloating our CSS file with manual rgba values.
- Consistency: Since we are already using the Tailwind color palette (emerald-600, blue-600, etc.), using the corresponding 200 weight for the shadow ensures the hues match perfectly without extra configuration.
- Maintainability: Registering custom tokens in main.css for 9+ different color variants would create a long list of variables that are harder to maintain than simple utility classes already available in the framework.(A) Keep as-is — shadow-lg shadow-{color}-200 Tailwind classes are sufficient.

Implementation Instructions:
1. Refactor the variantMap: Organize the variants to include both the background and the shadow color.
```TypeScript
const variantMap = {
  blue: "bg-blue-600 shadow-blue-200",
  emerald: "bg-emerald-600 shadow-emerald-200",
  // ... etc
};
```
2. Combine with Base Classes: Use cn to merge:
cn("w-10 h-10 text-white rounded-xl flex items-center justify-center shadow-lg", variantMap[variant])
3. Preserve the Design: Ensure shadow-lg is present to provide the elevation (blur/spread), while the shadow-{color}-200 provides the specific tint.

---

**Q3 — `className` prop: keep or drop?**

The current component exposes `className?: string` (defaults to `''`) so callers can add extra spacing or overrides. This is not mentioned in `@section-header-component.md`.

- [ ] **A) Keep it** — fold it into `cn()`: `cn("flex items-center ...", className)`.
- [ ] **B) Drop it** — remove the prop; callers should wrap in a container if they need extra classes.

> *Your answer:* (A) Keep it — fold it into cn(): cn("flex items-center ...", className).

Reasoning:
- Developer Experience (DX): Allowing className is a standard practice for reusable UI components. It allows callers to adjust external spacing (like mt-8 or mb-12) without the overhead of wrapping the component in an extra <div>.
- Tailwind Flexibility: By using the cn utility (which utilizes tailwind-merge), we ensure that any classes passed via the prop correctly override the component's default classes (like mb-6) without style conflicts.
- Consistency: Most of your existing components (like Card or Button) likely already support a className prop. Removing it here would create an inconsistent API.

Instructions:
1. Props Interface: Ensure className?: string is included in the SectionHeaderProps.
2. CN Integration: Apply the classes using the structure:
className={cn("flex items-center gap-3 mb-6", className)}
3. Default Handling: You don't need className = '' in the destructuring if you are using cn(), as it handles undefined gracefully.

---

**Q4 — `mb-6`: hardcoded in component or caller's responsibility?**

The spec mandates `mb-6` as part of the base layout. It is currently hardcoded in the component.

- [ ] **A) Keep `mb-6` hardcoded** — every usage always gets the bottom margin (matches spec).
- [ ] **B) Make it opt-out** — apply `mb-6` by default but allow override via `className` (only possible if Q3 answer is "keep").
- [ ] **C) Remove from component** — callers decide their own spacing.

> *Your answer:* (B) Make it opt-out — apply mb-6 by default but allow override via className.

Reasoning:
- Speed & Consistency: Including mb-6 as a default ensures that 90% of the time, the developer doesn't have to think about spacing. It guarantees the "Section" looks exactly as the spec intended right out of the box.
- Flexibility (The "Tailwind-Merge" Advantage): Since we decided in Q3 to keep the className prop and use the cn utility, we get the best of both worlds. If a specific UI case requires a tighter layout (e.g., mb-2), the caller can simply pass className="mb-2". The tailwind-merge logic inside cn() will automatically prioritize the caller's class and remove the default mb-6.
- Component Integrity: A "Section Header" inherently implies a gap between the title and the content following it. Hardcoding a sensible default protects the design system from "cramped" layouts.

Final Summary:
1. Visuals: Use the Solid style (bg-600 / text-white).
2. Shadows: Use Tailwind utilities (shadow-lg shadow-{color}-200).
3. Flexibility: Keep the className prop.
4. Spacing: Set mb-6 as the default base class within cn(), allowing it to be overridden if needed.

Final Component Signature Goal:
```TypeScript
<div className={cn("flex items-center gap-3 mb-6", className)}>
  <div className={cn("w-10 h-10 text-white rounded-xl ... shadow-lg", variantMap[variant])}>
    {React.cloneElement(icon, { size: 20 })}
  </div>
  <h2 className="text-2xl font-black text-slate-800">{title}</h2>
</div>
```

---

### [2026-05-15] Implementation Decision Log (AI)

**Decisions locked:**
| # | Decision |
|---|----------|
| Q1 | Solid style — `bg-{color}-600/500`, `text-white`, colored shadow |
| Q2 | Tailwind utilities only — `shadow-lg shadow-{color}-200` |
| Q3 | Keep `className` prop — no default `''`, folded into `cn()` |
| Q4 | `mb-6` default in `cn()`, overridable via `className` |

**Changes made to `src/components/common/SectionHeader.tsx`:**
1. Added `import { cn } from '../../lib/utils'`
2. Hoisted `variants` → `variantMap` as a module-level `Record<SectionHeaderVariant, string>` constant
3. Replaced template-literal class composition with `cn()` on both wrapper and badge divs
4. Removed default `className = ''` (cn handles undefined)

**No other files modified** — `main.css` needs no changes (Q2), component already in correct path (Q3 Step 2).
