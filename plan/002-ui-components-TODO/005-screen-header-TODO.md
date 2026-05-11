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
    
*AI says:*