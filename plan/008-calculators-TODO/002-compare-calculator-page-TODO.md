# Plan: CompareCalculatorPage - Implementation

## Task Overview
Build the CompareCalculator page, a multi-property controller that synchronizes multiple PropertyForm instances. It must handle authorization, dynamic property hydration based on the comparison store, and manage a horizontal scrolling interface for side-by-side analysis.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @property-form-component.md
    - @phrase-usage.md
    - @calculator-api.yaml
    - Individual Specs: 
        - @compare-calculator-page.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Guard & Auth Logic (The Entrance)**
- *Authorization Check:* Use `useStore` to check `loggedinUser`. If null, `Maps('/')`.

- *Calculator Validation:* - Extract `uuid` from URL params.
    - On mount, trigger `GET calculator/{uuid}`.
    - Logic: If response is `!isActive`, `isComingSoon`, or permission is denied, `Maps('/')`.

- *Initial Comparison Fetch:* Call `GET calculator/compare` to retrieve the list of selected property UUIDs.

**Step 2: Data Orchestration (Multi-Property Sync)**
- *Hydration:* - Implement a `fetchComparedProperties` function.
    - For each UUID, call `GET property/{propertyUUID}?calcYields=true`.
    - Update the local `properties` array with the full objects.

- *Real-time Update Handler:*
    - Implement an `updatePropertyField` function.
    - Trigger `PUT property/` for the specific asset.
    - On success, update only that specific index in the local `properties` state to maintain UI sync across the grid.

- *Filter Integration:* - Use `PUT calculator/compare` to add/remove properties.
    - Re-trigger the hydration flow on every change to the selection list.

**Step 3: Refactor & UI Composition (Layout & Scroll)**
- Apply the structure from @compare-calculator-page.md. 

- *Header:* Render `ScreenHeader` using `calculator_compare_title` and `calculator_compare_subtitle`.

- *Actions Area:* Render the "Property Selection UI" (for adding/removing properties).
    - Render a "Reset" button to clear the comparison.

- *Comparison Grid:*
    - Map through the `properties` array to render multiple `PropertyForm` instances side-by-side.
    - Scroll Controls: Implement `ScrollArrowRightIcon` and `ScrollArrowLeftIcon`.
    - Logic: Use a `ref` on the container to calculate `scrollLeft` and toggle arrow visibility based on overflow.

**Step 4: User Experience & Polish**
- *Empty State:* If `properties.length === 0`, show the `chooseApartments` illustration with the `calculator_compare_no_apartments` phrase.

- *Calculating Overlay:* Toggle `showOverlay` during all `GET` and `PUT` operations to prevent mid-calculation inputs.

- *Scroll UX:* Ensure `scrollBy` uses `{ behavior: 'smooth' }` and handle RTL direction correctly (scrolling "left" to go forward in Hebrew).

**Step 5: Styling (Tailwind)**
- *Grid Layout:* Use `display: flex` or `grid-flow: column` for the main container to ensure forms stay in a single row.

- *Responsive:* Ensure the `main-content` container allows native touch scrolling on mobile while using the arrow buttons on desktop.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Use `isCalculating` / `isLoading` for global overlays.

- *Property/Compare Slice:* Track the current list of compared UUIDs to ensure the filter stays in sync with the displayed forms.

- *Selectors:* Use atomic selectors for `loggedinUser` and `comparedUUIDs` to minimize unnecessary re-renders of the entire grid.


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