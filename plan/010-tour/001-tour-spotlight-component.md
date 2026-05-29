# Plan: TourSpotlight - Implementation

## Task Overview
Create the visual engine for the onboarding tour. This component is responsible for darkening the screen and "cutting a hole" exactly where the target element is located, while displaying a floating instructional card.

*Reference:* Use the specialized knowledge in
    - @tour-workflow.md
    - Individual Specs: 
        - @tour-spotlight-component.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Setup Overlay & Clip-Path (The Backdrop)**
- Create a `motion.div` that covers the entire screen (`fixed inset-0`).

- Implement the `clip-path` calculation logic. Use a polygon with 10 points to create the "inner hole" effect.

- Formula logic:
  - Outer bounds: `0% 0%, 0% 100%, ... 100% 100%, 100% 0%`.
  - Inner hole (based on `targetRect` + padding): `left-p top-p, right+p top-p, right+p bottom+p, left-p bottom+p`.
  
- Add `backdrop-blur-[2px]` for a premium frosted look.

**Step 2: Popover Positioning Logic**
- Create the content wrapper `motion.div` with `fixed z-[110]`.

- Calculate `top` and `left` styles dynamically based on `targetRect`. 

- Logic: `top: targetRect.top - 40px`, `left: targetRect.left + (targetRect.width / 2)`.

- Ensure the popover uses `x: '-50%'` and `y: '-100%'` to align perfectly above the spotlight.

**Step 3: Component Refactor (`TourSpotlight.tsx`)**
- *File Placement:* `src/pages/TourSpotlight.tsx`.

- Apply the structure from @tour-spotlight-component

**Step 4: UI Design (The Popover Card)**
- Use a `bg-white` card with `rounded-3xl` and a `blue-500` border.

- Implement the "Arrow" using a rotated square (`rotate-45`) positioned at the bottom center of the card.

- Include the `MousePointer2` icon from `lucide-react` with a `text-blue-600` color and a `animate-bounce` class.

**Step 5: Typography & Content Mapping**
- Render `title` with `text-xl font-black text-slate-800`.

- Render `description` with `text-slate-600 font-bold leading-relaxed`.

- Ensure a `children` slot exists below the description for "Next" or "Start" buttons.

**Step 6: Polish & Accessibility**
- Wrap everything in `AnimatePresence` to handle exit animations when the tour step changes.

- Ensure `pointer-events-none` on the popover wrapper so it doesn't block the spotlight hole, but `pointer-events-auto` on the card itself.

## Styling (Tailwind Checklist)
- [x] `fixed inset-0 z-[100] bg-slate-900/70`

- [x] `clip-path` dynamic style injection.

- [x] `rounded-3xl shadow-2xl border-2 border-blue-500`

- [x] `animate-bounce` for the icon.

## State Management Check
- This component is **Stateless** (Presentational). It receives all positioning data from the parent Tour orchestrators (`WelcomeTour` / `PropertyTour`).

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

### 2026-05-29 — AI Pre-Flight Questions

*AI says:*

After reading `@tour-spotlight-component.md`, `@tour-workflow.md`, `raw_from_ai_studio/components/tour/TourSpotlight.tsx`, and the existing `src/components/tour/TourSpotlight.tsx`, I have the following questions before proceeding:

---

**Q1 — File Placement Conflict**
Step 3 says the file should be placed at `src/pages/TourSpotlight.tsx`, but:
- The spec (`@tour-spotlight-component.md`) defines the path as `src/components/tour/TourSpotlight.tsx`
- A file **already exists** at `src/components/tour/TourSpotlight.tsx` (it looks like a direct copy from `raw_from_ai_studio`)

Which is correct — `src/pages/` or `src/components/tour/`? And since the file already exists in `src/components/tour/`, is this task about **refactoring the existing file** (applying `cn`, removing comments, following project conventions), or replacing/creating it at `src/pages/`?

> *Your answer:* The correct path is `src/components/tour/TourSpotlight.tsx`. The task is a refactor of the existing file.

Reasoning:
Since this is a reusable UI utility and not a standalone page, it belongs in the components directory. The existing file (likely a raw copy from AI Studio) serves as the starting point. The goal is to bring it up to production standards—cleaning up the "raw" code while preserving the sophisticated clip-path logic.

---

**Q2 — Clip-Path Point Count Discrepancy**
The plan says "Use a polygon with 10 points" but both the raw file and the spec show only **9 points** in the polygon. The raw implementation is:
`0%0%, 0%100%, left-p 100%, left-p top-p, right+p top-p, right+p bottom+p, left-p bottom+p, left-p 100%, 100%100%, 100%0%`
That is 10 points. Wait, let me count again:
1. `0% 0%`
2. `0% 100%`
3. `left-p 100%`
4. `left-p top-p`
5. `right+p top-p`
6. `right+p bottom+p`
7. `left-p bottom+p`
8. `left-p 100%`
9. `100% 100%`
10. `100% 0%`

That is 10 points — but the plan's "Formula logic" only shows the inner 4 points, not the outer frame. Is the raw implementation the canonical formula to follow, or do you want a different shape/approach for the hole?

> *Your answer:* The raw implementation (10-point polygon) is the canonical formula to follow.

Reasoning:
The 10-point polygon is mathematically necessary to create a "nested" shape. It works by drawing the outer frame of the screen and then "weaving" into the center to carve out the rectangular hole before returning to the edge to close the path. The "Formula logic" in the plan was a simplified shorthand focusing on the dynamic coordinates, but the AI Studio raw implementation provides the complete, tested geometry needed for a seamless overlay.

---

**Q3 — Popover Viewport Edge Handling**
When the target element is near the top of the viewport, the popover (positioned `top - 40px` with `y: -100%`) will be cut off or invisible. The raw file has no fallback logic for this. Should we implement **position awareness** (e.g., flip below the target when there's not enough space above), or keep it simple and always position above?

> *Your answer:*Implement Smart "Flip" Logic (Position Awareness).

Reasoning:
In a professional onboarding experience, the instructional card must always be visible. Hardcoding the position to "always above" will lead to a broken UI when highlighting elements in the Header or top of the page. We will implement a simple but effective "Flip" logic: if there is insufficient space above the target, the popover should automatically render below the target.

---

**Q4 — RTL Layout Support**
The spec example shows Hebrew text (`"בוא נתחיל!"`), and this is an RTL app. The popover centers horizontally via `left: targetRect.left + width/2` and `x: -50%` — which is RTL-agnostic. But the arrow (`-bottom-3 left-1/2`) is always bottom-center. Is this the intended behavior for both LTR and RTL, or should the arrow or text alignment adapt based on `dir`?

> *Your answer:* Maintain centered geometry, but enforce RTL text alignment and logical directional icons.

Reasoning:
Because the popover is logically tied to the center of the target element, the left: 50% / x: -50% centering is the most stable approach for both LTR and RTL. Moving the arrow to the right or left would create a "lopsided" look relative to the hole. However, the content inside the card (the "micro-copy") must respect the RTL flow of the application to maintain a high-end feel.

---

**Q5 — `cn` Utility Usage Requirement**
The plan says "Strictly follow Tailwind Utility-First principles and the `cn` utility for class merging." The current raw implementation has no conditional class logic — all classes are static strings. Should we apply `cn()` to all className strings as a convention even when no merging is needed, or only when there's an actual conditional/merge use case?

> *Your answer:* Apply cn() to the main component wrappers and elements with dynamic states. For purely static, internal sub-elements, standard strings are acceptable.

Reasoning:
The cn utility (typically a wrapper for tailwind-merge and clsx) is most valuable when there is a risk of class conflicts or when classes are conditionally applied. Wrapping every single static string (like a simple label) in cn() adds unnecessary noise. However, for "Top-Level" containers and interactive elements, using cn is a best practice to allow the component to be easily extended or overridden by parent components via props.className.

---

**Q6 — `clipPath: 'none'` Fallback**
When `targetRect` is `null`, the current raw code sets `clipPath: 'none'`, which means the full dark overlay shows with no hole (the whole screen is covered). Is this the correct behavior? Or should a `null` targetRect hide the overlay entirely?

> *Your answer:* If targetRect is null, hide the overlay entirely (return null or opacity: 0).

Reasoning:
Displaying a full-screen dark overlay with no "hole" (the clipPath: 'none' scenario) feels like a bug to the user—it locks the screen without showing them why. A null targetRect usually happens in two cases:

The element hasn't rendered yet: Showing a black screen while waiting is jarring.

Transitioning between steps: If there is a gap in the logic, it's better to show the normal UI than a "broken" overlay.

By returning null or hiding the component, we ensure that the "Onboarding" only appears when there is actually something to onboard.

---

*Waiting for your explicit green light before writing any code.*

---

### 2026-05-29 — Implementation Complete

*AI says:*

Refactored `src/components/tour/TourSpotlight.tsx` with all decisions applied:

| Decision | Applied |
|---|---|
| Q1: File path | `src/components/tour/TourSpotlight.tsx` (in-place refactor) |
| Q2: Clip-path | 10-point polygon from raw_from_ai_studio (canonical) |
| Q3: Flip logic | `isAbove = targetRect.top >= 240 + 40`; positions card below target when space is insufficient; arrow flips too (`border-t-2 border-l-2` vs `border-b-2 border-r-2`) |
| Q4: RTL | `dir="rtl"` on card content; centered geometry (`left: center + x:-50%`) unchanged |
| Q5: `cn()` | Applied to overlay, popover wrapper, and arrow (which has conditional classes); static sub-elements use plain strings |
| Q6: null guard | `{isOpen && targetRect && (...)}` inside `AnimatePresence` — renders nothing if either is falsy |