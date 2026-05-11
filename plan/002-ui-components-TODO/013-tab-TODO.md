# Plan: Tab Component - Extraction & Refactor

*Objective:* Transform the raw Tab logic into a production-ready navigation element for segmented controls, following the project's atomic UI standards.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @tab-component.md

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: State-Based Styling (Tailwind)**
- *Conditional Classes:* - Instead of template literals, use the `cn` utility to toggle between:
    - Active: `bg-white text-blue-600 shadow-sm`
    - Inactive: `text-slate-500 hover:text-slate-700 hover:bg-slate-50/50`

- *Typography & Icons:* - Ensure the label uses `text-[11px]` and `font-black`.
    - Icons must be wrapped to ensure they stay centered above the label with a `gap-0.5`.

**Step 2: Component Refactor**
- *File Placement:* Move the component to `components/common/Notification.tsx`.

- *Logic & Structure:*
    - Apply the structure from @tab-component.md.
    - Wrapper: Render as a `button` element with `flex-1` to ensure equal width distribution when used in a group.
    - Interactions: Ensure the `onClick` prop is correctly bound to the button's click event.
    - Transitions: Apply `transition-all duration-200` to make the switch between states feel smooth and responsive.

**Step 3: Layout & RTL**
- *Logical Alignment:* Use `flex flex-col items-center justify-center` to maintain vertical rhythm.

- *Spacing:* Use `py-2` and `px-3` to ensure a touch-friendly target area while maintaining the compact aesthetic.       

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