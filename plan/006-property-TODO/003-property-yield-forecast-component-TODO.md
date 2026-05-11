# Plan: PropertyYieldForecast - Extraction & Refactor

## Task Overview
Refactor `PropertyYieldForecast` into a high-fidelity, *Read-Only Data Component*. It serves as a comprehensive financial schedule, visualizing long-term investment projections through a performance-optimized table with conditional styling.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-yield-forecast-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Visibility Guard**
- *Component Definition:* Ensure the component is "Pure" (receives `yieldForecast`, `isCalculating`, and `activeResultTab` via props).

- *Conditional Rendering:* - Implement a top-level guard: `if (!yieldForecast) return null;`.

- *Apply mobile-specific visibility:* `hidden lg:block` and conditionally add `block` if `activeResultTab === 'yield'`.

- *Context:* Access `phrases` via `useSplash`.

**Step 2: Component Refactor (PropertyYieldForecast.tsx)**
- Apply the structure from @property-yield-forecast-component.md.

- *Composition*
    - Render `SectionHeader` with `label: property_financial_forecast_expected_return_header, icon: TableIcon, and variant: blue`.
    - Wrap the table in a `Card` component with `overflow-x-auto` and a `max-h-[600px]` scrollable area.

- *Table Structure*
    - Implement a `<thead>` with `sticky top-0` positioning.
    - Map the 9 header phrases defined in the SKILL to `<th>` elements.

- *Calculation Overlay*
    - Apply the `absolute inset-0 bg-white/40 backdrop-blur-[1px]` overlay only when `isCalculating` is true.

**Step 3: Data Mapping & Formatting**
- *Row Rendering:* Map `yieldForecast` array into `<tr>` elements.

- *Column Logic:*
    - Currency Formatting: Apply `formatCurrency` to columns 2 through 7 (Price, Rent, Financing, Exit, Tax, Profit).
    - Percentage Formatting: Apply `formatPercent` to columns 8 and 9 (Total Return, ROE).

- *Conditional Styling:*
    - Apply `text-red-600` class to Profit, Total Return, and ROE cells if their respective values are `< 0`.
    - Ensure `dir="ltr"` is applied to all numeric cells for correct alignment.

**Step 4: Styling & RTL (Tailwind)**
- Implement hover states for rows (`hover:bg-slate-50`) to improve scannability.

- Optimize for many rows (up to 360) using efficient CSS selectors and standard HTML table elements.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Monitors `isCalculating` state to trigger the UI blur during server-side recalculations.

- *Data Flow:* Purely unidirectional; the component reacts to changes in the `property.calcYieldForecast` array provided by the Parent.


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