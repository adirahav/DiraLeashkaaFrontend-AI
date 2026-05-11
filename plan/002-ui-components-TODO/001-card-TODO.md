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
    
*AI says:*

