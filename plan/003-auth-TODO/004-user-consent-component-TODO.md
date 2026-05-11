# Plan: UserConsent - Refactoring & Refactor

## Task Overview
Refactor the `UserConsent` logic into a high-fidelity, standalone component. It must support both the `Signup Wizard` (multi-step) and the `User Consent page`, integrated with `Zustand` Slices and `SplashContext`.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - Individual Specs: 
        - @user-consent-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (Clean Interface)**
- *Prop-Driven Logic*
    - Define a strict TypeScript interface for:
        - `content`: Raw HTML string for the terms.
        - `checkboxLabel`: The text for the agreement.
        - `checked` & `onChange`: For the checkbox state.
        - `onNext` & `onPrev`: Navigation handlers.
        - `isNextDisabled`: Boolean to control button state.
        - `isLoading`: Boolean for the submission spinner.

**Step 2: Component Refactor (UserConsent.tsx)**
- Apply the structure from @user-consent-component.md

- *Composition*
    - Use atomic components: `HtmlContent` (for terms), `Checkbox` (for consent), and `Button` (for navigation).
    - Ensure the `HtmlContent` is wrapped in a container that allows specific styling for the legal text.

- *Props & Mapping*
    - Implement as a Pure Component that only re-renders when props change.
    - Map the onNext handler to the "Primary" button and onPrev to the "Outline" button.

- *UI Structure*
    - *Top:* Terms of Use text area.
    - *Middle:* Checkbox with label.
    - *Bottom:* Action buttons (Grid layout).

**Step 3: Styling & RTL (Tailwind)**
- RTL Support: Force `direction: rtl` for the terms container and ensure the checkbox label is correctly padded on the left/right.

- Animation: Add `animate-in fade-in slide-in-from-bottom-4` for a professional transition.

**Step 4: API & Store Infrastructure (The Engine)**
- *Note:* Since this is a presentational component, the "Engine" resides in the Parent Wizard.

- Ensure the component correctly passes the `isLoading` prop to the `Button` component to trigger loading UI during the final API call.

## State Management Check (Zustand Slices Pattern)
- *Selectors:* The parent should use atomic selectors (e.g., state => state.isLoading) to pass down to this component, ensuring it only re-renders when necessary.


## *Required "STOP-AND-ASK" Milestone*
You must strictly follow the "STOP-AND-ASK" Milestone before generating any code.
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