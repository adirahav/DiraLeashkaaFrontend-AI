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

### [2026-05-19] Pre-Flight Clarifying Questions

*AI says:*

After reading the current `PropertyChart` implementation, `YieldChart`, `PropertyPage`, and the component spec, I have the following questions before writing any code:

---

**Q1 — Data prop & `PropertyPage` call-site**

The plan spec lists the new props as `yieldForecast`, `activeResultTab`, `isCalculating` — removing `graphData`, `forecastData`, and `viewMode`.

Currently `PropertyPage` passes both `graphData` (pre-filtered to yearly nodes) and `forecastData` to `PropertyChart`, and `YieldChart` already filters to yearly nodes internally (`node.monthNo % 12 === 0`). The plan says to pass `yieldForecast` straight to `YieldChart` as the `data` prop.

- **Option A** — Pass `forecastData` from `PropertyPage` as `yieldForecast`. Remove `graphData` from `PropertyPage` entirely. `YieldChart` owns the yearly-filter logic (it already does).
- **Option B** — Pass `graphData` (already filtered) as `yieldForecast` and keep the pre-filter in `PropertyPage`.

Which option is correct? _(Option A aligns with the spec but changes what `PropertyPage` passes.)_

> *Your answer:* (A) Pass the raw monthly array (forecastData) from PropertyPage.tsx as the yieldForecast prop. Completely clean out and remove graphData and its filtering logic from the parent page scope.

Reasoning:
- Encapsulated View Responsibility: The child presentation graph layer (YieldChart) already contains the explicit milestone filtering hook (monthNo % 12 === 0). Keeping processing snippets inside the parent page creates logic duplication and dirty dependencies.
- Streamlined Pipeline: Eliminating state derivations from the parent page keeps its render tree lightweight and prevents unneeded structural recalibrations on the root component node.

Final Instructions:
Claude must establish the forwardRef skeleton for PropertyChart.tsx and wire the clean, unfiltered pipeline straight from the parent wrapper down to the canvas target:

1. Clean Parental Mounting Configuration (PropertyPage.tsx)
Claude will purge the old props (graphData, viewMode, etc.) and supply the core fields seamlessly:
```TypeScript
{/* SECTION 9: Structural Financial Forecast Charts Node */}
{propertyState.showMortgagePrepayment && (
  <PropertyChart
    ref={propertyChartRef} // Provided to allow smooth internal anchor scrolling if needed
    yieldForecast={propertyState.calcYieldForecast || []} // Raw unified monthly feed array
    activeResultTab={activeResultTab}
    isCalculating={isCalculating}
  />
)}
```
2. The Smart Wrapper Blueprint (src/components/common/PropertyChart.tsx)
Claude must wrap the structural shell using standard forwardRef definitions, mapping responsive layout tokens exactly as defined by your visual guidelines:
```TypeScript
import React, { forwardRef } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Card } from '@/components/ui/card';
import { YieldChart } from '@/components/common/YieldChart';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSplash } from '@/context/SplashContext';

interface PropertyChartProps {
  yieldForecast: any[];
  activeResultTab: string;
  isCalculating: boolean;
}

export const PropertyChart = forwardRef<HTMLDivElement, PropertyChartProps>(
  ({ yieldForecast, activeResultTab, isCalculating }, ref) => {
    const { getPhrase } = useSplash();

    if (!yieldForecast || yieldForecast.length === 0) return null;

    // Handle responsive block visibility constraints
    const responsiveVisibilityClass = cn(
      "hidden lg:block w-full",
      activeResultTab === 'graph' && "block"
    );

    return (
      <section ref={ref} className={responsiveVisibilityClass}>
        {/* Header Block - Strictly desktop visibility matching AI Studio constraints */}
        <div className="hidden lg:block mb-4">
          <SectionHeader
            label={getPhrase('property_yield_forecast_graph_view_header', 'מגמת תשואה פיננסית')}
            icon={TrendingUp}
            variant="blue"
          />
        </div>

        {/* Outer Visual Container Card - Explicit mobile vs desktop responsive layout tokens */}
        <Card className={cn(
          "relative overflow-hidden w-full transition-all duration-300",
          "rounded-none border-0 shadow-none bg-transparent lg:bg-white", // Mobile rules
          "lg:rounded-[2rem] lg:border lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]" // Desktop rules
        )}>
          
          {/* Inner Canvas Container Wrapper - Essential for locking Recharts dimensions */}
          <div className="w-full h-full min-h-[300px]">
            <YieldChart data={yieldForecast} />
          </div>

          {/* Localized Parent Calculation Blur Overlay Shield */}
          {isCalculating && (
            <div className="absolute inset-0 z-50 bg-white/30 dark:bg-black/10 backdrop-blur-[1px] cursor-wait transition-all duration-200" />
          )}
        </Card>
      </section>
    );
  }
);

PropertyChart.displayName = 'PropertyChart';
```

---

**Q2 — `viewMode` prop removal & the `ResponsiveContainer` re-render key**

The plan removes `viewMode` from the props. Currently, the `ResponsiveContainer` uses a composite `key` (`graph-${activeResultTab}-${viewMode}-${graphData.length}-${forecastData.length}`) to force Recharts to resize when the user switches between form and results views.

Without `viewMode`, this resize trigger is lost — the chart may render at zero height on the first view switch.

- **Option A** — Remove the keyed `ResponsiveContainer` entirely (rely on CSS `w-full h-full` to size correctly).
- **Option B** — Keep a key using only `activeResultTab` (no `viewMode`).
- **Option C** — Keep `viewMode` in the component but not in the typed prop interface (internal via context or a `window.dispatchEvent('resize')` trick).

Which approach should I use?

> *Your answer:* (B) Retain a dynamic layout key on <ResponsiveContainer>, compositionally constructed using activeResultTab and the data tracking array length. Drop the deprecated viewMode reference from the key token string.

Reasoning:
- Defeating the Recharts 0px Collapse Bug: Recharts' SVG computation nodes require precise real-time container bounding calculations. When layout tabs shift states, the DOM footprint flickers. Changing the core React key attribute forces a target remount, ensuring the container samples the exact current dimensions of the parent Card framework immediately.
- Declarative Performance Sync: Utilizing data array length inside the key guarantees that whenever fresh server calculation cycles finish, the canvas redraws smoothly to reflect the updated charts without structural jitter.

Final Instructions:
Claude must construct the responsive chart container render block within YieldChart.tsx (or inside the target integration block) using this bulletproof structural layout key:
```TypeScript
export const YieldChart: React.FC<{ data: MonthlyDataNode[], activeResultTab: string }> = ({ data, activeResultTab }) => {
  const { getPhrase } = useSplash();

  const yearlyChartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data
      .filter((node) => node.monthNo % 12 === 0 && node.monthNo > 0)
      .map((node) => ({
        ...node,
        yearLabel: `${getPhrase('chart_label_year', 'Year')} ${node.monthNo / 12}`,
      }));
  }, [data, getPhrase]);

  if (yearlyChartData.length === 0) return null;

  // Composite Layout Lifecycle Target Key (Guarantees zero-height rendering safety)
  const chartResetKey = `chart-canvas-${activeResultTab}-${yearlyChartData.length}`;

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer key={chartResetKey} width="100%" height="100%">
        <LineChart data={yearlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Grid lines, Axes, Tooltips, Legends, and Lines here */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```
---

**Q3 — `ResponsiveContainer` ownership**

Step 3 says "Render `<YieldChart />` inside the card" and Step 4 mentions `w-full h-full min-h-[300px]` as "a stable container for the Recharts `ResponsiveContainer`" — but `YieldChart` currently uses a raw `LineChart` with fixed `width`/`height` props (no `ResponsiveContainer` inside it).

- **Option A** — Keep `ResponsiveContainer` in `PropertyChart` wrapping `YieldChart` (no changes to `YieldChart`). `isCalculating` prop to `YieldChart` is not needed since `PropertyChart` owns the overlay.
- **Option B** — Move `ResponsiveContainer` inside `YieldChart`, making it self-sizing. `PropertyChart` just renders `<YieldChart data={yieldForecast} />`.

The plan says to pass `isCalculating` down to `YieldChart`, which implies `YieldChart` would handle something internally. Does `YieldChart` need to change, or does `PropertyChart` own the overlay and `isCalculating` is not forwarded to `YieldChart`?

> *Your answer:* (B) Move the ResponsiveContainer inside the YieldChart component to make it entirely self-contained and fluid. Keep the calculation backdrop blur overlay inside the parent PropertyChart, meaning isCalculating does NOT need to be forwarded inside YieldChart for rendering purposes.

Reasoning:
- Encapsulated Layout Component: A chart component should be autonomous and layout-agnostic. By embedding the ResponsiveContainer inside YieldChart, it automatically fills whatever container or Card it gets placed in, keeping its own internal rendering logic isolated and highly reusable.
- Smart Wrapper Guard Duty: The parent component (PropertyChart) acts as the structural section wrapper. It already owns the HTML <section> tag, the SectionHeader, and the responsive Card style layer. Therefore, it is the absolute perfect place to host the absolute positioning backdrop blur overlay. Because the overlay blocks the entire card area, YieldChart doesn't need to know about isCalculating at all.

Final Instructions:
Claude must divide the structural layout boundaries cleanly between the wrapper and the visual presentation layer:

1. The Clean Outer Smart Wrapper (src/components/common/PropertyChart.tsx)
The wrapper provides the absolute context frame and drops the overlay natively over the child element:
```TypeScript
{/* Outer Visual Container Card */}
<Card className={cn(
  "relative overflow-hidden w-full transition-all duration-300",
  "rounded-none border-0 shadow-none bg-transparent lg:bg-white",
  "lg:rounded-[2rem] lg:border lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
)}>
  
  {/* The stable, explicitly sized DOM node required for ResponsiveContainer to calculate layout */}
  <div className="w-full h-full min-h-[300px] lg:min-h-[360px]">
    <YieldChart data={yieldForecast} activeResultTab={activeResultTab} />
  </div>

  {/* Localized Calculation Blur Overlay (Managed purely here by the parent wrapper) */}
  {isCalculating && (
    <div className="absolute inset-0 z-50 bg-white/30 dark:bg-black/10 backdrop-blur-[1px] cursor-wait transition-all duration-200" />
  )}
</Card>
```
2. The Pure Self-Sizing Graphic Presentation Layer (src/components/common/YieldChart.tsx)
The chart accepts the dimension data and wraps its structural layout rules in the responsive frame natively:
```TypeScript
export const YieldChart: React.FC<{ data: MonthlyDataNode[], activeResultTab: string }> = ({ data, activeResultTab }) => {
  const { getPhrase } = useSplash();

  const yearlyChartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data
      .filter((node) => node.monthNo % 12 === 0 && node.monthNo > 0)
      .map((node) => ({
        ...node,
        yearLabel: `${getPhrase('chart_label_year', 'Year')} ${node.monthNo / 12}`,
      }));
  }, [data, getPhrase]);

  if (yearlyChartData.length === 0) return null;

  const chartResetKey = `chart-canvas-${activeResultTab}-${yearlyChartData.length}`;

  return (
    <ResponsiveContainer key={chartResetKey} width="100%" height="100%">
      <LineChart data={yearlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* CartesianGrid, XAxis, YAxis, Tooltip, Legend, and Lines render fluently here */}
      </LineChart>
    </ResponsiveContainer>
  );
};
```

---

**Q4 — `isCalculating` blur overlay design**

The plan says to "implement the `isCalculating` blur overlay" on the Card. What should this look like?

- **Option A** — Absolute-positioned `div` inside the Card with `backdrop-blur-sm bg-white/30 inset-0 rounded-[2rem]` (matching the pattern used in `PropertyForm`).
- **Option B** — Apply `blur-sm` CSS filter directly to the chart's container div (no extra overlay element).

Which pattern matches the rest of the app?

> *Your answer:* (A) Implement an absolute-positioned overlay div inside the container card using absolute inset-0 bg-white/40 backdrop-blur-[1px] z-50 cursor-wait. Ensure its corner rounding dynamically matches the responsive rules of the Card wrapper.

Reasoning:
- UX/UI Interactivity Block: Applying a pure CSS filter blur directly to the canvas container (Option B) creates an unstable visual state where user pointer movements can still trigger active chart tooltips through the blur. A clean, layout-isolated absolute div layer physically swallows mouse events (cursor-wait), signaling a calculation lockout gracefully.
- Global Pattern Consistency: This matches the architectural design language running throughout your operational form blocks and spreadsheet panels, maintaining a unified application state experience.

Final Instructions:
Claude has now answered all edge cases across every financial module. Here is the final, production-ready blueprint for PropertyChart.tsx that Claude will compile, integrating your responsive layout rules, dynamic remount keys, and proper layout rounding for the calculation guard:

```TypeScript
import React, { forwardRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../common/Card';
import { YieldChart } from '../common/YieldChart';
import { useSplash } from '@/context/SplashContext';
import { cn } from '@/lib/utils';

interface PropertyChartProps {
  yieldForecast: any[];
  activeResultTab: string;
  isCalculating: boolean;
}

export const PropertyChart = forwardRef<HTMLDivElement, PropertyChartProps>(
  ({ yieldForecast, activeResultTab, isCalculating }, ref) => {
    const { getPhrase } = useSplash();

    if (!yieldForecast || yieldForecast.length === 0) return null;

    // Responsive Section Display Constraints
    const responsiveSectionClass = cn(
      "pt-0 lg:pt-4 w-full hidden lg:block",
      activeResultTab === 'graph' && "block"
    );

    return (
      <section ref={ref} className={responsiveSectionClass}>
        {/* Section Header - Strictly desktop-only context */}
        <div className="hidden lg:block mb-4">
          <SectionHeader 
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />} 
            title={getPhrase('property_yield_forecast_graph_view_header', 'תצוגת גרף - תחזית תשואה')} 
            variant="blue" 
          />
        </div>
        
        {/* Structural Smart Card - Flawlessly responsive from AI Studio specs */}
        <Card className={cn(
          "relative overflow-hidden w-full transition-all duration-300 !p-0",
          "h-[calc(100dvw-40px)] lg:h-[500px]", // AI Studio structural fixed constraints
          "rounded-none border-0 shadow-none bg-transparent lg:bg-white", // Mobile rules
          "lg:rounded-[2rem] lg:border lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]" // Desktop rules
        )}>
          
          {/* Inner Canvas Mount Frame */}
          <div className="w-full h-full min-h-[300px]">
            <YieldChart data={yieldForecast} activeResultTab={activeResultTab} />
          </div>

          {/* Absolute Calculation Glass Shield Guard (Option A) */}
          {isCalculating && (
            <div className={cn(
              "absolute inset-0 z-50 bg-white/30 dark:bg-black/10 backdrop-blur-[1px] cursor-wait transition-all duration-200",
              "rounded-none lg:rounded-[2rem]" // Border-radius must mirror the card layer exactly
            )} />
          )}
        </Card>
      </section>
    );
  }
);

PropertyChart.displayName = 'PropertyChart';
```
---

### [2026-05-19] Decisions Recorded — Proceeding to Implementation

| # | Decision |
|---|---|
| Q1 | Pass raw `forecastData` as `yieldForecast`. Remove `graphData` `useMemo` from `PropertyPage`. |
| Q2 | Key `ResponsiveContainer` on `chart-canvas-${activeResultTab}-${yearlyData.length}`. No `viewMode` prop. |
| Q3 | `ResponsiveContainer` moves inside `YieldChart`. `PropertyChart` owns the blur overlay. `isCalculating` is NOT passed to `YieldChart`. |
| Q4 | Overlay: `absolute inset-0 z-50 bg-white/30 backdrop-blur-[1px] cursor-wait`, rounding mirrors card (`rounded-none lg:rounded-[2rem]`). |

*Implementing now.*

---

### [2026-05-19] Implementation Complete

All decisions verified against the produced code:

| File | Status | Notes |
|------|--------|-------|
| `src/components/layout/PropertyChart.tsx` | ✅ Done | forwardRef, guard, responsive visibility, SectionHeader, Card, overlay |
| `src/components/common/YieldChart.tsx` | ✅ Done | ResponsiveContainer inside, useMemo yearly filter, composite chartKey |
| `src/pages/PropertyPage.tsx` | ✅ Done | Passes `yieldForecast={forecastData}`, no `graphData`, no `viewMode` to chart |