# Plan: AccessibilityMenu - Extraction & Refactor

*Objective:* Centralize Accessibility Menu logic and manage global accessibility overrides using Tailwind base layers and CSS variables for real-time theme switching.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @accessibility-menu-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Style Configuration (Tailwind Base Layer)**
- *Global Themes:* - Add accessibility themes to src/index.css using the @layer base directive.
    - Define CSS variables for high contrast (e.g., `--bg-primary`, `--text-primary`) and font scaling.
    - Map these variables in `main.css` so that classes like `bg-primary` react automatically to the body class (e.g., `.high-contrast`).

- *Font Scaling:* - Implement font scaling by updating the `html` or `body` font-size via a global class (e.g., `.font-size-lg`), leveraging Tailwind's relative units (`rem`).


**Step 2: Component Refactor**
- *File Placement:* `src/components/common/AccessibilityMenu.tsx`.

- *Logic Refinement:*
    - Apply the structure from @accessibility-menu-component.md.
    - Keep the `useEffect` logic for `localStorage` and body class manipulation.
    - Menu UI: Use Tailwind classes for the menu container: `fixed bottom-4 right-4 z-[110] bg-white shadow-heavy rounded-2xl p-4`.

- *Animations:*
    - Use Tailwind's `animate-in fade-in slide-in-from-bottom-5 duration-300` when the menu is toggled.

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