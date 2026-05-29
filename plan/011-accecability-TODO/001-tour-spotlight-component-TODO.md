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
- [ ] `fixed inset-0 z-[100] bg-slate-900/70`

- [ ] `clip-path` dynamic style injection.

- [ ] `rounded-3xl shadow-2xl border-2 border-blue-500`

- [ ] `animate-bounce` for the icon.

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
    
*AI says:*