# Plan: PropertyChart - Extraction & Refactor

## Task Overview
Refactor `PropertyChart` into a Smart Wrapper Component. Its primary responsibility is to provide the structural context (Header, Card, Responsive Visibility) for the internal YieldChart, ensuring consistent UI with the rest of the application sections.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - Individual Specs: 
        - @property-chart-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Visibility Guard**
- *Component Definition:* Use forwardRef to allow the parent to reference the `<section>` element.

- *Props:* Receive `yieldForecast`, `activeResultTab`, `isCalculating`.

- *Conditional Rendering:* - Top-level guard: `if (!yieldForecast) return null;`.
    - *Mobile-specific visibility:* `hidden lg:block` + conditional `block` when `activeResultTab === 'graph'`.

**Step 2: Component Refactor (PropertyChart.tsx)**
- Apply the structure from @property-chart-component.md.

- *Header:* Render `SectionHeader` using `property_yield_forecast_graph_view_header`, `TrendingUp` icon, and `blue` variant. Ensure it is hidden on mobile per AI Studio logic (`hidden lg:block`).

- *Container:* Use the `Card` component with the specific shadow and border logic:
    - *Mobile:* `rounded-none border-0 shadow-none`.
    - *Desktop:* `rounded-[2rem] border shadow-[0_8px_30px_rgb(0,0,0,0.04)]`.

- *Overlay:* Implement the `isCalculating` blur overlay.

**Step 3: Child Component Integration**

- Render the `<YieldChart />` inside the card.

- Pass the `yieldForecast` (mapped to the `data` prop) and `isCalculating` down to the chart.

**Step 4: Styling & Performance (Tailwind)**
- Ensure the inner div has `w-full h-full min-h-[300px]` to provide a stable container for the Recharts `ResponsiveContainer`.


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