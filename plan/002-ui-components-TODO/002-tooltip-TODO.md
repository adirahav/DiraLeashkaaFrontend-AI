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

*AI says:* 