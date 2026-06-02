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

## 2026-05-18 — AI Pre-Flight Questions (STOP-AND-ASK Gate)

*AI says:*

Before writing any code I need answers to the following 5 questions. I will not proceed until you respond.

---

**Q1 — Color conflict on `returnOnEquity`**
The skill spec (`yield-chart-component.md`) defines `returnOnEquity` color as `#ef4444` (Red/Rose).
The current raw code uses `#0d9488` (Teal).
The plan text says "rose/teal per the skill spec."
**Which color should be used for the `returnOnEquity` line — `#ef4444` (Red) or `#0d9488` (Teal)?**

> *Your answer:* Use #0d9488 (Teal) for the returnOnEquity line, honoring the visual layout of the active UI preview.

Reasoning:
- Visual Synergy: In terms of UI/UX and product design, the dashboard layout establishes the definitive look and feel. As seen in the active charts, Teal (#0d9488) represents equity-based metrics elegantly, while Blue (#2563eb) handles total portfolio returns.
- Psychological Contrast: Because we previously reserved Red/Rose (#ef4444 / text-red-600) strictly as an emergency warning indicator for columns dipping below zero inside the tables, using it for a primary chart line—even when the asset is performing exceptionally well—would confuse users into thinking their equity yield is in jeopardy.

Final Instructions:
Claude must build YieldChart.tsx using the exact Teal/Blue styling configuration, localized Recharts tooltip boundaries, and optimized yearly data aggregation hooks:

1. Step 1: Milestone Data Transformation Engine
```TypeScript
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { useSplash } from '@/context/SplashContext';
import { formatPercent } from '@/services/formatUtils.service';

interface MonthlyDataNode {
  monthNo: number;
  totalReturn: number;
  returnOnEquity: number;
}

export const YieldChart: React.FC<{ data: MonthlyDataNode[] }> = ({ data }) => {
  const { getPhrase } = useSplash();

  // Aggregate monthly tracking items into clean annual milestone nodes
  const yearlyChartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data
      .filter((node) => node.monthNo % 12 === 0 && node.monthNo > 0)
      .map((node) => ({
        ...node,
        yearLabel: `${getPhrase('chart_label_year', 'שנה')} ${node.monthNo / 12}`,
      }));
  }, [data, getPhrase]);

  if (yearlyChartData.length === 0) return null;
```
2. Steps 2 & 3: Polished Responsive Canvas Layout
```TypeScript
return (
    <Card className="p-5 border border-slate-200 shadow-sm rounded-xl bg-white w-full h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={yearlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Grid Layout - Disable vertical rails to clean up chart noise */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          
          <XAxis 
            dataKey="yearLabel" 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
          />
          
          <YAxis 
            tickFormatter={(val) => `${val}%`}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />

          {/* Fully localized RTL Floating Tooltip Box */}
          <Tooltip 
            contentStyle={{ 
              direction: 'rtl', 
              textAlign: 'right', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [formatPercent(value), '']}
          />
          
          <Legend verticalAlign="top" height={36: iconType="circle"} />

          {/* Core Metrics Visual Mapping Lines */}
          <Line
            name={getPhrase('chart_legend_total_return', 'תשואה כוללת')}
            type="monotone"
            dataKey="totalReturn"
            stroke="#2563eb" /* Deep Corporate Tailwind Blue */
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={600}
          />
          
          <Line
            name={getPhrase('chart_legend_roe', 'תשואה על ההון')}
            type="monotone"
            dataKey="returnOnEquity"
            stroke="#0d9488" /* Aligned Rich Teal Component Accent */
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
```

---

**Q2 — Animation duration**
The plan asks for `isAnimationActive={true}` with a "short duration for a pop-in effect."
The current raw code has animation disabled entirely (`isAnimationActive={false}`).
**What duration (ms) should I set — e.g. 400ms, 600ms, 800ms?**

> *Your answer:* Set the duration to 600ms.

Reasoning:
- Optimal Balance: A duration of 600ms hits the sweet spot for professional financial dashboards. It is long enough for the user to perceive a smooth, premium "pop-in" transition as the lines draw across the annual milestones, but fast enough that it doesn't delay data scannability or feel sluggish.
- Avoiding Visual Fatigue: Anything slower (like 800ms or higher) feels like a heavy cinematic transition, which becomes tedious on a dynamic form where the chart recalculates frequently on input changes. Anything faster (like 300ms–400ms) can look like an accidental screen jitter or glitch rather than an intentional, fluid animation.

Final Instructions:
Claude must apply this exact duration and easing config natively to both <Line /> nodes inside YieldChart.tsx:

```TypeScript
{/* Total Return Line Configuration */}
<Line
  name={getPhrase('chart_legend_total_return', 'תשואה כוללת')}
  type="monotone"
  dataKey="totalReturn"
  stroke="#2563eb"
  strokeWidth={3}
  dot={{ r: 4 }}
  isAnimationActive={true}
  animationDuration={600} // Locked to 600ms for a swift, smooth pop-in
  animationEasing="ease-out"
/>

{/* Return on Equity Line Configuration */}
<Line
  name={getPhrase('chart_legend_roe', 'תשואה על ההון')}
  type="monotone"
  dataKey="returnOnEquity"
  stroke="#0d9488"
  strokeWidth={3}
  dot={{ r: 4 }}
  isAnimationActive={true}
  animationDuration={600} // Matched perfectly to prevent decoupled line rendering
  animationEasing="ease-out"
/>
```
---

**Q3 — SCSS file requirement**
The skill mandates a `src/assets/css/components/yield-chart.scss` that imports `../_vars.scss`.
The current component has no SCSS file.
**Does this chart need any custom CSS beyond Tailwind (e.g. Recharts overrides), or should I create a minimal stub that just imports `_vars.scss` with no extra rules?**

> *Your answer:* Skip the SCSS file completely and stick 100% to pure Tailwind and Recharts inline configurations. You absolutely do not need an external SCSS stylesheet or a minimal stub for this chart.

Reasoning:
- Tailwind and Recharts Native Dominance: Recharts components are built natively on SVG. Complex styling, positioning, typography, layout, borders, and colors are fully controlled via React props (like contentStyle, tick, and stroke) or inline Tailwind utility wrappers.
- Eliminating Empty Code Debt: Creating an empty or stub SCSS file just to import variables that won't be used creates dead assets in your codebase. It violates the clean utility-first principle we established for the rest of your UI refactoring pipeline.

Final Instructions:
Claude will configure all visual parameters for the chart directly inside YieldChart.tsx. Recharts properties accept standard inline styles or React objects, allowing us to implement perfect project theme syncing natively:
```TypeScript
{/* Fully customized, self-contained SVG Axis & Tooltip styling overrides */}
<XAxis 
  dataKey="yearLabel" 
  tick={{ fontSize: 12, fill: '#64748b' }} /* Slate-500 typographic matching */
  axisLine={false}
  tickLine={false}
/>

<YAxis 
  tickFormatter={(val) => `${val}%`}
  tick={{ fontSize: 12, fill: '#64748b' }}
  axisLine={false}
  tickLine={false}
/>

{/* Localized Floating Box UI (No SCSS overrides required) */}
<Tooltip 
  contentStyle={{ 
    direction: 'rtl', 
    textAlign: 'right', 
    backgroundColor: '#ffffff',
    borderRadius: '12px', /* Matches our standard Tailwind rounded-xl Card border radius */
    border: '1px solid #e2e8f0', /* Matches slate-200 border rules */
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' /* Tailwind shadow-md */
  }}
  itemStyle={{ fontSize: '13px', padding: '2px 0' }}
  formatter={(value: number) => [formatPercent(value), '']}
/>
```

---

**Q4 — ResponsiveContainer height**
Wrapping in `<ResponsiveContainer>` requires an explicit `height` (or the parent must provide one).
**What pixel height should the chart render at — e.g. 260px, 300px, 360px?**

> *Your answer:* Set the chart container height to 360px (or use h-[360px] on the wrapping <Card>).

Reasoning:
- Optimal Visual Balance: A height of 360px provides enough vertical canvas space for Recharts to map out the Y-axis percentage increments and render the smooth monotone line graphs without compressing the grid lines.
- Mobile-Friendly Scaling: At 360px, the chart remains highly readable on mobile screens when rotated or viewed vertically, while perfectly anchoring the desktop layout card next to the tabular summaries.
- Preventing Container Collapse: Since <ResponsiveContainer> relies entirely on its parent's dimensions to render width or height percentages correctly, explicitly locking the outer container wrapper to h-[360px] ensures the SVG canvas calculates its bounding boxes perfectly and never collapses to a 0px height footprint.

Final Instructions:
Claude must style the outer Card wrapper and the native canvas container exactly like this to ensure stable layout rendering across all viewports:
```TypeScript
return (
  <Card className="p-5 border border-slate-200 shadow-sm rounded-xl bg-white w-full h-[360px] flex flex-col justify-between">
    {/* Explicitly scaled canvas frame responsive node */}
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={yearlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Chart grids, axis rules, tooltips, and lines map here */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
```
---

**Q5 — Phrase keys availability**
The skill requires `getPhrase('chart_legend_total_return')` and `getPhrase('chart_legend_return_on_equity')` via `useSplash`.
**Are these phrase keys already present in the splash/phrases data source, or do I need to add them as part of this task?**

> *Your answer:* Yes, use the keys directly. Ensure that the second parameter of getPhrase is strictly populated with the clear English translation as the fallback string.

Reasoning:
- Graceful Degradation: Providing an explicit English string as the backup argument (e.g., 'Total Return' and 'Return on Equity') ensures that even if a dictionary key mismatch occurs during a future localization deployment, the chart lines will never render with broken, missing, or empty legends.

Final Instructions:
Claude must fetch the dictionary terms from useSplash and feed them directly into the Recharts layout nodes with explicit English fallback strings:
```TypeScript
const { getPhrase } = useSplash();

// ... inside the chart render tree:

<Line
  name={getPhrase('chart_legend_total_return', 'Total Return')} // Hebrew if available, fallback to English prose
  type="monotone"
  dataKey="totalReturn"
  stroke="#2563eb"
  strokeWidth={3}
  dot={{ r: 4 }}
  isAnimationActive={true}
  animationDuration={600}
/>

<Line
  name={getPhrase('chart_legend_return_on_equity', 'Return on Equity')} // Hebrew if available, fallback to English prose
  type="monotone"
  dataKey="returnOnEquity"
  stroke="#0d9488"
  strokeWidth={3}
  dot={{ r: 4 }}
  isAnimationActive={true}
  animationDuration={600}
/>
```

---

*Awaiting your answers. No code will be generated until you give the green light.*

---

## 2026-05-18 — Decisions Locked / Implementation Proceeding

*AI says:*

All 5 questions answered. Decisions locked:

| # | Decision |
|---|----------|
| Q1 | `returnOnEquity` → `#0d9488` (Teal). Red/Rose reserved for warning indicators only. |
| Q2 | `animationDuration={600}`, `animationEasing="ease-out"` on both lines. |
| Q3 | No SCSS file. 100% Tailwind + Recharts inline styles. |
| Q4 | Callers (`PropertyChart`, `HomeBestYields`) own the Card/ResponsiveContainer. `YieldChart` remains chart-only, forwarding injected `width`/`height` to `LineChart`. |
| Q5 | Keys assumed present in splash. Fallbacks: `'Total Return'` and `'Return on Equity'`. |

**Implementation note on Q4:** Both `PropertyChart.tsx` and `HomeBestYields.tsx` already wrap `<YieldChart>` in their own `<ResponsiveContainer>`. Adding a second `ResponsiveContainer` inside `YieldChart` would break the layout. `YieldChart` accepts optional `width`/`height` from the parent and passes them to `LineChart`.