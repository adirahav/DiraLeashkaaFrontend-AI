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

*AI says:*
