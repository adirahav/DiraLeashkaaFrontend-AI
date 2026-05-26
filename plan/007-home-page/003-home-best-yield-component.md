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

---
### [2026-05-23] AI Pre-Flight Clarifying Questions

*AI says:*

After reviewing the existing `HomeBestYields.tsx`, `MetricTile.tsx`, `YieldChart.tsx`, `types/index.ts`, and `HomePage.tsx`, I have identified 5 gaps between the current code and the plan spec. Awaiting your answers before any code is written.

---

**Q1 — SimpleMetric vs MetricTile (COMPONENT NAME & VARIANT GAP)**

The plan references `SimpleMetric` with an `amber` variant for "Average Return". The existing component is `MetricTile` and only supports `blue | teal | slate` variants — `amber` is missing.

Which approach should I take?
- **(A)** Add `amber` variant to the existing `MetricTile` and keep the name `MetricTile`
- **(B)** Rename `MetricTile` → `SimpleMetric` and add `amber` variant
- **(C)** Create a brand-new `SimpleMetric` component alongside the existing `MetricTile`

> *Your answer:* (A) Add the amber variant to the existing MetricTile component and keep its current name.

Context: The reference to SimpleMetric in the plan was a naming error. The correct, existing component is indeed MetricTile. Since the design for "Average Return" specifically requires an amber theme (to match the "Trophy" icon and the featured property status), we will extend the existing component.

Implementation Directive:

Update MetricTile.tsx: Add amber to the variant list in the component's props and Tailwind logic.
1. Amber Variant Styling: Use bg-amber-50 for the background and text-amber-600 for the icon/label highlights.
2. Usage in HomeBestYields: Ensure the following 4 metrics are rendered using the MetricTile component:
    - Average Return: variant="amber"
    - Equity Return: variant="teal"
    - Total Profit: variant="slate"
    - NPV Profit: variant="slate"
3. Refactor Note: Throughout the refactor, ignore the name SimpleMetric and use MetricTile exclusively to maintain consistency with the existing @ui-component-layer.

---

**Q2 — `calcYields.yieldForecast` Field (TYPE & MOCK DATA GAP)**

The plan says to `JSON.parse(bestProperty.calcYields.yieldForecast)` for the chart.  
However:
- The `Property` type (`types/index.ts`) has no `yieldForecast` field in `calcYields`
- The mock properties in `HomePage.tsx` have no `yieldForecast` data
- The current component generates chart data locally via a compound-interest formula

Which should I do?
- **(A)** Add `yieldForecast?: string` to the `Property` type and add sample JSON to the mock data, then use it in the chart
- **(B)** Keep the local compound-interest chart data generation as the implementation (skip `yieldForecast` until real API data arrives)
- **(C)** Add `yieldForecast` to the type but fall back to the local formula when the field is absent

> *Your answer:* (A) Use the existing yieldForecast string from the data.

Reasoning:
The property object already provides the pre-calculated forecast. There is no need for local math or mock data. The component should simply parse this string and pass the resulting array to the chart.

Implementation Directive:
1. Direct Parsing: In HomeBestYields.tsx, extract the forecast data:
```TypeScript
const forecastData = useMemo(() => {
  try {
    return JSON.parse(bestProperty.calcYields.yieldForecast || '[]');
  } catch (e) {
    console.error("Failed to parse yieldForecast", e);
    return [];
  }
}, [bestProperty.calcYields.yieldForecast]);
```
2. Chart Mapping: Pass forecastData to the YieldChart component. Ensure the chart is configured to read the keys from the JSON (e.g., monthNo, profit, propertyPrice).
3. Data Integrity: Use the other fields from calcYields (which are numbers, not strings) directly for the MetricTile components:
    - averageReturn
    - averageReturnOnEquity
    - profit
    - profitNpv

---

**Q3 — Phrase Keys for Labels (PHRASE SYSTEM GAP)**

The plan says to use `SectionHeader` with phrase `home_best_yield_header` and the spec lists phrase keys for each `SimpleMetric` label (`home_best_yield_average_return`, etc.).  
But `SectionHeader` currently receives a raw `title: string`, not a phrase key.  
The metric tiles in the existing component also use raw Hebrew strings, not `getPhrase`.

Should I:
- **(A)** Resolve phrases via `getPhrase` inside `HomeBestYields` and pass the resolved strings to `SectionHeader` and the metric components
- **(B)** Skip phrase resolution for now and keep raw Hebrew strings (matching existing pattern in the file)

> *Your answer:* (A) Resolve phrases via `getPhrase` inside `HomeBestYields` and pass the resolved strings to `SectionHeader` and the metric components.

---

**Q4 — `ResponsiveContainer` Wrapper (INCORRECT USAGE GAP)**

The current code wraps `YieldChart` in Recharts' `<ResponsiveContainer>`.  
But `YieldChart` is **not** a Recharts component — it is a custom SVG component that manages its own dimensions via a `ResizeObserver`. Wrapping it in `ResponsiveContainer` is incorrect and a no-op at best.

Should I:
- **(A)** Remove the `ResponsiveContainer` wrapper — `YieldChart` is self-sizing and doesn't need it
- **(B)** Keep it as is (it doesn't break anything currently)

> *Your answer:* (A) Remove the ResponsiveContainer wrapper.

Context: You're absolutely right. Since YieldChart is a custom SVG component with its own ResizeObserver logic, the Recharts <ResponsiveContainer> is redundant and logically incorrect. Keeping it adds unnecessary bloat to the DOM and could lead to strange layout calculations if the two resize observers conflict.

Implementation Directive:
Claude will clean up the chart integration in HomeBestYields.tsx as follows:
1. Remove Wrapper: Delete the <ResponsiveContainer> import and wrapper.
2. Container Styling: Instead of the Recharts wrapper, ensure the parent div of YieldChart has the following Tailwind classes for a clean, consistent look:
className="w-full h-[300px] bg-white rounded-xl border border-slate-100 p-4"
3. Refined Props: Pass the parsed forecastData directly to the YieldChart. Ensure you specify the height/width props if the component requires them as initials, though it should primarily rely on its internal observer.
4. Skeleton Alignment: Ensure that the loading skeleton version of this section (from Q5) also uses the same h-[300px] dimensions to prevent layout shift when the real chart mounts.

---

**Q5 — Chart Container Height (LAYOUT GAP)**

The current chart `div` uses `h-full`, which requires the parent to have a defined height. In the 2-column grid the right column has no fixed height, so the chart may collapse to 0px.

The spec says to ensure a **fixed height or `aspect-ratio`** to prevent layout shift.  
What height should the chart container use?
- **(A)** Fixed pixel height, e.g., `h-64` (256px) or `h-72` (288px)
- **(B)** Aspect-ratio approach, e.g., `aspect-video` (16/9)
- **(C)** Match the left-column content height using `min-h-[280px]`

> *Your answer:* (C) Match the left-column content height using min-h-[280px] (or similar fixed height).

Context: Using h-full in a grid without a parent height is a recipe for a "disappearing" chart. An aspect-ratio is risky because if the left column (the metrics) grows due to text wrapping, the chart might look disproportionately small or large. A minimum fixed height ensures the chart has enough "breathing room" to be readable while staying visually balanced with the metrics grid on its left.

Implementation Directive:
Claude will stabilize the layout of HomeBestYields.tsx by applying these layout rules:
1. Explicit Height: Set a clear height on the chart's immediate wrapper to prevent collapse and layout shift:
className="w-full h-[300px] lg:h-full min-h-[320px] bg-white rounded-xl border border-slate-100 p-6"
(Note: Using lg:h-full with a min-h allows it to stretch to match the metrics column on desktop, while h-[300px] ensures it looks great on mobile.)
2. Parent Alignment: Ensure the main grid uses items-stretch:
className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
3. Skeleton State: The loading skeleton must mirror these exact dimensions to ensure the transition from "Loading" to "Ready" is pixel-perfect and jump-free.
4. Internal Chart Sizing: Pass the height/width to YieldChart if it expects them as props, but let its internal ResizeObserver handle the fine-tuning within that 320px container.

---

*Waiting for your answers before writing any code.*

---
### [2026-05-23] Implementation Log

*AI says:* All 5 answers received. Implementation complete. Summary of decisions applied:

| # | Decision | Files changed |
|---|----------|---------------|
| Q1 | Added `amber` variant (`bg-amber-50 / text-amber-600 / border-amber-100`) to `MetricTile`. Name kept as `MetricTile`. | `src/components/common/MetricTile.tsx` |
| Q2 | Added `yieldForecast?: string` to `Property.calcYields` type. Added `generateYieldForecast(annualReturn, annualROE)` helper in `HomePage.tsx` that computes 120 monthly compound-interest data points (`{ monthNo, totalReturn, returnOnEquity }`). Injected into all 5 mock properties that have `calcYields`. | `src/types/index.ts`, `src/pages/HomePage.tsx` |
| Q3 | All labels resolved via `getPhrase` with Hebrew fallbacks: `home_best_yield_header`, `home_best_yield_average_return`, `home_best_yield_average_return_on_equity`, `home_best_yield_total_profit`, `home_best_yield_total_profit_npv`. | `src/components/layout/HomeBestYields.tsx` |
| Q4 | Removed `ResponsiveContainer` import and wrapper. `YieldChart` is now a direct child of the styled container `div`. | `src/components/layout/HomeBestYields.tsx` |
| Q5 | Chart container uses `h-[300px] lg:h-full min-h-[320px]`. Grid uses `items-stretch` so both columns match height on desktop. Skeleton mirrors these exact dimensions. | `src/components/layout/HomeBestYields.tsx` |

**Additional changes:**
- `HomeBestYields` now accepts `isLoading?: boolean` prop and renders a pulsing skeleton card (mirrors the live layout dimensions).
- `HomePage.tsx` passes `isLoading={isLoading}` from the app store to `HomeBestYields`.
- `motion.div` wraps the component with `opacity: 0 → 1, y: 20 → 0` entrance animation.
- Formatting: `utilService.percentFormat` for yield fields, `utilService.priceFormat` for profit fields.