# Plan: HomeBestYields - Extraction & Refactor

## Task Overview
Refactor the featured property section into the `HomeBestYields` component. This component highlights the most profitable property using high-impact visual metrics and a dual-line forecast chart, ensuring data consistency via `utilService`.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @phrase-usage.md
    - @yield-chart-component.md
    - Individual Specs: 
        - @home-best-yields-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Guard Clauses**
- *Props:* Receive `bestProperty` (the top property object).

- *Guard Clause:* Implement an early return `null` if `bestProperty` or `bestProperty.calcYields` is undefined.

- *Container:* Main section with `mt-12` and `dir="rtl"`.

- *Header Integration:* Use `SectionHeader` with `icon={<Trophy />}`, `variant="amber"`, and phrase `home_best_yield_header`.

**Step 2: Metrics Grid & Formatting**
- *Data Extraction:* Access `calcYields` from the property object.

- *Formatting Logic:* Use `utilService.percentFormat` for yield fields and `utilService.priceFormat` for profit fields.

- *Grid Implementation:* Use a 2-column grid (`grid-cols-2 gap-4`) for the metrics.

- *SimpleMetric Integration:* Render 4 metrics with the specific variants:
    - Average Return (`amber`)
    - Equity Return (`teal`)
    - Total Profit (`slate`)
    - NPV Profit (`slate`)

**Step 3: Component Refactor (HomeBestYields.tsx)**
- Apply the structure from @home-best-yields-component.md.

- *Layout:* Implement the main 2-column desktop layout (`grid-cols-1 lg:grid-cols-2 gap-8`).

- *Chart Integration:* - Parse `calcYields.yieldForecast` (JSON).
    - Wrap `YieldChart` in a `ResponsiveContainer`.
    - Ensure the chart container has a clean background: `bg-white rounded-xl border border-slate-100`.

- *Animations:* Wrap the main container in a `motion.div` for a smooth entry (fade + slide up).


**Step 4: Styling & RTL (Tailwind)**
- *Typography:* Address and city should use `text-3xl font-black text-slate-800`.

- *Card UI:* Apply `overflow-hidden border-2 border-amber-100` to the main property card.

- *Responsive Design:* Ensure the chart and metrics stack vertically on mobile and side-by-side on large screens.

## State Management Check (Zustand Slices Pattern)
- **Home/Property Slice:**
    - *Selectors:* In the parent (`HomePage`), select the first item from `homeState.bestYields` to pass as `bestProperty`.

- **App Slice:**
    - *Loading State:* If `isLoading` is true, the parent should render a skeleton version of the `HomeBestYields` section (pulsing card).

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