# Plan: Logo Component - Extraction & Refactor

*Objective:* Transform the inline SVG Logo into a reusable UI component using Tailwind utility classes for styling and ensuring proper font integration via the Tailwind base layer.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @logo-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: CSS Extraction:**
- *Styling Refinement:*
    - Map inline font properties to Tailwind classes (e.g., `font-bold`, `text-2xl`) and apply them to SVG text nodes using `className`.
    - Font Integration: Ensure the 'Assistant' font is defined in the *Tailwind Config* or added to the `@layer base` in `index.css`.`
    - Use Tailwind colors: `text-blue-800` (for 'דירה') and `text-blue-600` (for 'להשקעה')..

**Step 2: Component Refactor**
- *File Placement:* Move the component to `components/common/Logo.tsx`.

- *Logic & Structure:*
    - Apply the structure from @logo-component.md.
    - Maintain the SVG viewBox calculation logic in the TSX as it is data-driven based on props.
    - RTL Safety: Keep dir="ltr" on the wrapper to protect the SVG coordinate system.
    - Optimization: Ensure the SVG defs (gradients/filters) have unique IDs to avoid conflicts if multiple logos are rendered.
    - Use the `cn` *utility* for any conditional logo variants (e.g., light/dark modes).
            
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