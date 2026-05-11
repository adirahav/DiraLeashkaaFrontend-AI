# Plan: Yield Chart Component - Extraction &amp; Refactor

*Objective:* Transform the raw Recharts implementation into a polished, localized, and performance-optimized visualization component for property yield forecasts.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md 
    - @yield-chart-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Data Transformation (The "Yearly" Filter)**
- *Pre-processing:* Before passing data to the `LineChart`, implement a `useMemo` hook to:
    - Filter the raw monthly array to include only yearly milestones (`monthNo % 12 === 0`).
    - Map `monthNo` to a readable `year` label (e.g., `monthNo / 12`).
    - Ensure field names match the API keys: `totalReturn` and `returnOnEquity`.

**Step 2: Component Refactor &amp; Styling**
- *File Placement:* Move the component to `components/common/YieldChart.tsx`.

- *Visual Integration:*
    - ResponsiveContainer: Wrap the chart in Recharts' `ResponsiveContainer` to ensure it fills its parent `Card` or container width.
    - Line Styling: Set `strokeWidth={3}` and use `monotone` type for a modern, smooth feel. Colors must use our standard blue (`#2563eb`) and rose/teal per the skill spec.
    - Grid &amp; Axes: Disable vertical grid lines. Set `tick={{ fontSize: 12 }}` using Slate-500 colors to match the project's typography.

**Step 3: Localization &amp; RTL Support**
- *Tooltip Customization:*
    - Override the default Tooltip styling to include `direction: rtl`, `textAlign: right`, and a `rounded-xl` border matching our `Card` style.
    - Use `utilService.getPhrase` for the names of the lines in the Legend.

- *Y-Axis Formatting:* Implement the `tickFormatter` to append the % symbol natively.

**Step 4: Performance &amp; Interaction**
- *Animation:* Set `isAnimationActive={true}` but with a short duration for a "pop-in" effect that isn't distracting.

- *Empty State:* Implement a simple conditional check: If `data` is null or empty, return `null` or a subtle "No data available" placeholder to prevent chart crashes.

## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation &amp; Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:
    
*AI says:*