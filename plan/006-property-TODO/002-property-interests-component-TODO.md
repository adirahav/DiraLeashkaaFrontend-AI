# Plan: PropertyInterests - Extraction & Refactor

## Task Overview
Refactor `PropertyInterests` into a high-fidelity, *Controlled Component*. It serves as a specialized input group for financial percentages, delegating state persistence and API synchronization to the *Parent/Store*.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-interests-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Visibility Guard**
- *Component Definition:* Ensure the component is "Pure" (receives `property`, `isCalculating`, and `onUpdate` via props).

- *Conditional Rendering:* Implement a top-level guard: `if (!property.showMortgagePrepayment) return null;`.

- *Context:* Access `phrases` and `fixedParameters` via `useSplash`.

**Step 2: Component Refactor (PropertyInterests.tsx)**
- Apply the structure from @property-interests-component.md.

- *Composition*
    - Render `SectionHeader` with `label: property_interest_and_indexes_header, icon: PieChart, and variant: slate`.
    - Map the 9 `InterestControl` components into a responsive grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-5`).

- *Calculation Overlay*
    - Apply the `absolute inset-0 bg-white/40 backdrop-blur-[1px]` overlay only when `isCalculating` is true.

**Step 3: Advanced Field Logic (InterestControl Mapping)**
- *Dynamic Defaults (The Delta Engine)*
    - *Interest 5Y/10Y:* Calculate `defaultValue` on the fly:
`property.calcInterestPercent + fixedParameters.indexesAndInterests.[field].delta`.
    - *General Mapping:*
        - For each field, pass:
            - `label`: Corresponding phrase key.
            - `value`: `property.calc[FieldName]Percent`.
            - `config`: Relevant object from `fixedParameters.indexesAndInterests`.
    - *Event Handling:*
        - `onChange` triggers `onUpdate(fieldName, newValue)`.

**Step 4: Styling & RTL (Tailwind)**
- Ensure consistent spacing (`gap: 1rem`) and RTL support for labels and percentage symbols.

## State Management Check (Zustand Slices Pattern)
- Recalculation:* The Parent/Store handles the debounced API call to the server when `onUpdate` is fired.

- *Sync:* When the server returns new calculated values, they flow back into the component via the `property` prop.


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