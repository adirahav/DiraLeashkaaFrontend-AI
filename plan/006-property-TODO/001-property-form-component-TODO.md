# Plan: PropertyForm - Extraction & Refactor

## Task Overview
Refactor the `PropertyForm` into a high-fidelity, centralized component driven by `Zustand`. It must handle complex real estate calculations, multi-section layouts, and a guided `Tour Mode`, while maintaining high performance through debounced API syncs.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-form-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (Zustand & Sync)**
- *State Selection (Zustand)*
    - Use `useStore` to access the `property` object (Property Slice) and `isCalculating` (App Slice).
    - Access `fixedParameters` (cities, types, ranges) from `useSplash`.

- *Real-time Sync & Debounce*
    - Implement a `handleFieldChange` function that:
        1. Performs an **Optimistic Update** in the local Zustand state for immediate UI response.
        2. Triggers a **Debounced API Call** (e.g., 500ms) to the server for recalculation.
    - Ensure `isCalculating` is toggled during the server-side calculation phase.

- *Tour Mode Engine*
    - Implement logic to intercept `onUpdate` during `tour.isActive`.
    - Handle transitions: If `currentStep === 'CITY'`, update city -> trigger 1.2s mock loading -> set `pendingTourStep` to `'PRICE'`.

**Step 2: Component Refactor (PropertyForm.tsx)**
- Apply the structure from @property-form-component.md.

- *Composition*
    - Map the 6 spec sections using `SectionHeader` (with correct icons/variants) and `Card`.
    - Apply a global "Calculation Overlay" (`backdrop-blur`) to all cards when `isCalculating` is true.

- *Field Logic - Parts 1 & 2 (Basics & Income)*
    - **AutoFillInput:** Logic for `Equity`, `Incomes`, and `Commitments` to merge `loggedinUser` defaults with `property.calc` values.
    - **EditableInput (Desired Repayment):** Implement the custom vs. calculated toggle based on `possibleMonthlyRepaymentCustomValue`.

- *Field Logic - Parts 4 & 5 (Expenses & Rent)*
    - **Label:** Use a ternary or helper to choose between *..._label* and *..._label_without_value* based on whether customValue is null.
    - **Value:** Pass the full object *{calc, customValue, default}*.
    - **Interactive Source:** Pass the relevant range from *fixedParameters*.

- *Conditional Display - Parts 3 & 6 (Mortgage)*
    - Wrap Sections 3 and 6 in a conditional block: `{property.showMortgagePrepayment && (...)}`.
    - Warnings:
        - Apply `danger` variant to `Estimated Payment` if > `PossibleMonthlyRepayment`.
        - Show `property_mortgage_period_warning` if age + period exceeds limits.

**Step 3: Tour Mode Integration**
- Ref Management
    - Assign `refs` (cityRef, priceRef, etc.) to the specific field wrappers.

- Tour Logic
    - Use `tour.isActive` and `tour.currentStep` to apply high z-index classes.
    - When a field is updated during a tour, call `onTourAction` to allow the parent to manage the transition and mock loading.

**Step 4: Styling & RTL (Tailwind)**
- Layout: Responsive Grid (`gap: 1.25rem`).

- RTL: Ensure proper alignment for Hebrew labels and currency symbols.


## State Management Check (Zustand Slices Pattern)
- *App Slice:* Toggle `isCalculating` during the async process.

- *Selectors:* Strictly use atomic selectors (e.g., `state => state.user`) via `useStore` to ensure optimized re-renders and type safety.

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