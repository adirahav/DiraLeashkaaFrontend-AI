# Plan: PropertyMetrics - Extraction & Refactor

## Task Overview
Refactor `PropertyMetrics` into a high-performance, Read-Only Data Component. It serves as the primary financial anchor, providing immediate feedback on the property's investment viability.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-metrics-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Guard**
- *Component Definition:* Pure component receiving 6 specific props (yield, mortgage, percents, repayment, isScrolled).

- *Visibility Guard:* Ensure the Parent component handles the conditional rendering based on mandatory fields (`price`, `apartmentType`, etc.) to keep this component clean.

- *Phrases:* Access `phrases` via `useSplash`.

**Step 2: Component Refactor (PropertyMetrics.tsx)**
- Apply the structure from @property-metrics-component.md.

- *Composition:*
    - Container: Use `grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4`.
    - Scroll Logic: Apply `transition-all duration-300` and use the cn utility to toggle scaling/padding based on the `isScrolled`+ prop.

- *Metric Rendering:*
    - Map the data points to the `MetricCard` component (reusing the logic from @metric-card-component.md).
    - Dynamic Variants: Pass the correct variant (`emerald`, `blue`, `indigo`, `slate`, or `rose`) based on the financial threshold logic.

**Step 3: Data Mapping & Formatting**
- *Formatting:* Strictly use the imported `formatCurrency` and `formatPercent` from `utilService`.

- *Logic:* Ensure no formatting happens inside `PropertyMetrics`; it simply passes formatted `ReactNode` or raw numbers to the `MetricCard`.

**Step 4: Styling & RTL (Tailwind)**
- *Layout:* Ensure `grid-cols-2` on mobile to maintain readability, jumping to `grid-cols-4` on desktop.

- *RTL:* Rely on the `dir="rtl"` at the root and Tailwind's logical properties.

## State Management Check (Zustand)
- *Data Flow:* The component is purely "Driven by Props".

- *Parent Responsibility:* The Parent component (e.g., `PropertyDetails`) must select the specific data points from the `property.slice`:
    - `totalYield10y` should be derived from `calcYieldForecast[119].yieldOnEquity`.
    - `isScrolled` should be derived from the UI layout state.


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