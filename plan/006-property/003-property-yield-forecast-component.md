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

## [2026-05-18] AI Pre-Flight Questions — STOP-AND-ASK Gate

*AI says:*

After reading the current `PropertyYieldForecast.tsx`, `PropertyPage.tsx`, the spec, and `formatUtils.service.tsx`, I identified **5 critical discrepancies** that require your decisions before any code is written.

---

### Q1 — Data Shape Mismatch (CRITICAL)

The spec defines these data keys for the `yieldForecast` array:
`monthNo`, `propertyPrice`, `rent`, `financingCosts`, `valuationInRealization`, `commendationTax`, `profit`, `totalReturn`, `returnOnEquity`

But `PropertyPage.tsx` currently computes and passes an array with **different keys**:
`month`, `propertyValue`, `rent`, `expenses`, `financingCosts`, `valueAtRealization`, `bettermentTax`, `profit`, `yieldOnEquity`

**Which approach do you want?**
- **Option A:** Update `PropertyPage.tsx` to compute and pass data using the new spec key names (breaking change to the page).
- **Option B:** Keep `PropertyPage.tsx` as-is; adapt the component's internal `ForecastRow` interface to match what the page already provides.

> *Your answer:* (A) Update PropertyPage.tsx to align its calculation outputs with the new specification key names. Do NOT use the legacy raw AI Studio keys.

Reasoning:
- Specification Authority: Since the AI Studio code is purely boilerplate and doesn't dictate real business logic, the new high-fidelity specification serves as the source of truth for your data models.
- Eliminating Layout Adapters: Aligning the parent's data factory directly with the spec prevents the need for unneeded map-and-transform functions inside the read-only view layer, keeping row renders fast and performant for up to 360 data points.

Final Instructions:
Claude must update both the type architecture and the mounting implementation inside PropertyPage.tsx and PropertyYieldForecast.tsx:
1. Implement the Correct Row Contract (src/types/property.types.ts)
Define the strict layout object using the exact properties specified by the functional architecture:
```TypeScript
Claude must update both the type architecture and the mounting implementation inside PropertyPage.tsx and PropertyYieldForecast.tsx:

1. Implement the Correct Row Contract (src/types/property.types.ts)
Define the strict layout object using the exact properties specified by the functional architecture:
```
2. Clean Read-Only Component Structure
Inside PropertyYieldForecast.tsx, Claude will cleanly map the aligned array directly to rows with the proper formatting hooks and dir="ltr" guards to handle Hebrew/English layout numbers safely:
```TypeScript
{/* Rendering columns inside the row mapping function */}
{yieldForecast.map((row) => (
  <tr key={row.monthNo} className="hover:bg-slate-50 transition-colors">
    <td className="p-3 text-center">{row.monthNo}</td>
    <td className="p-3 text-right" dir="ltr">{formatCurrency(row.propertyPrice)}</td>
    <td className="p-3 text-right" dir="ltr">{formatCurrency(row.rent)}</td>
    <td className="p-3 text-right" dir="ltr">{formatCurrency(row.financingCosts)}</td>
    <td className="p-3 text-right" dir="ltr">{formatCurrency(row.valuationInRealization)}</td>
    <td className="p-3 text-right" dir="ltr">{formatCurrency(row.commendationTax)}</td>
    
    {/* Conditional formatting logic for financial metrics */}
    <td className={cn("p-3 text-right font-medium", row.profit < 0 ? "text-red-600" : "text-slate-900")} dir="ltr">
      {formatCurrency(row.profit)}
    </td>
    <td className={cn("p-3 text-right font-medium", row.totalReturn < 0 ? "text-red-600" : "text-slate-900")} dir="ltr">
      {formatPercent(row.totalReturn)}
    </td>
    <td className={cn("p-3 text-right font-medium", row.returnOnEquity < 0 ? "text-red-600" : "text-slate-900")} dir="ltr">
      {formatPercent(row.returnOnEquity)}
    </td>
  </tr>
))}
```

---

### Q2 — The `expenses` Column & `totalReturn` Column

The current component has an **`expenses`** column (col 4) that the spec does NOT include.  
The spec has a **`totalReturn`** column (col 8) that the current component does NOT have.

Regarding `expenses`: should it be **removed** entirely, or mapped to an existing spec column (e.g., as part of financing costs)?  
Regarding `totalReturn`: is this a **new computed field** coming from the backend, or should it be calculated client-side? If client-side, what is the formula?

> *Your answer:* Remove the expenses column completely to align with the production specification. Treat totalReturn as a direct server-computed property delivered within the flat payload, rather than calculating it on the client side.

Reasoning:
- Specification Fidelity: The expenses column from the raw AI Studio code is an unspec'd legacy property. Since your updated backend architecture natively packages macro-financial parameters into the single, flat data model, layout views should not inject unofficial columns that distort row alignment.
- Backend as the Financial Source of Truth: Financial metrics—including long-term yields like totalReturn—must remain synchronized across all calculation modules. Calculating it client-side risks compounding rounding errors or drift over a 360-month projection timeline. Your server-side engine computes this dynamically and populates the totalReturn property inside each ForecastRow.

Final Instructions:
Claude must structure the PropertyYieldForecast.tsx <thead> and row map mapping block to follow the 9-column spec exactly, removing the old expenses field:

1. Aligned Header Structure (<thead>)
```TypeScript
<thead>
  <tr className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
    <th className="p-3 text-center">{phrase('forecast_col_month', 'חודש')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_price', 'שווי נכס')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_rent', 'שכירות')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_financing', 'עלויות מימון')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_exit', 'שווי במימוש')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_tax', 'מס שבח')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_profit', 'רווח נקי')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_total_return', 'תשואה כוללת')}</th>
    <th className="p-3 text-right">{phrase('forecast_col_roe', 'תשואה על ההון')}</th>
  </tr>
</thead>
```
2. Synchronized Row Node Mapping
```TypeScript
{/* Loop directly through the sanitized yieldForecast structure */}
{yieldForecast.map((row) => (
  <tr key={row.monthNo} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
    <td className="p-3 text-center font-medium text-slate-500">{row.monthNo}</td>
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCurrency(row.propertyPrice)}</td>
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCurrency(row.rent)}</td>
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCurrency(row.financingCosts)}</td>
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCurrency(row.valuationInRealization)}</td>
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCurrency(row.commendationTax)}</td>
    
    {/* Financial Performance Indicator Nodes with Conditional Class Logic */}
    <td className={cn("p-3 text-right font-semibold", row.profit < 0 ? "text-red-600" : "text-emerald-700")} dir="ltr">
      {formatCurrency(row.profit)}
    </td>
    <td className={cn("p-3 text-right font-medium", row.totalReturn < 0 ? "text-red-600" : "text-slate-900")} dir="ltr">
      {formatPercent(row.totalReturn)}
    </td>
    <td className={cn("p-3 text-right font-medium", row.returnOnEquity < 0 ? "text-red-600" : "text-slate-900")} dir="ltr">
      {formatPercent(row.returnOnEquity)}
    </td>
  </tr>
))}

```

---

### Q3 — `isCalculating` Prop Wiring

The spec requires an `isCalculating` prop to trigger the blur overlay, but **`PropertyPage.tsx` currently does not pass this prop** to `PropertyYieldForecast`.

The plan references `app.slice.ts` as the source. Should I also update `PropertyPage.tsx` to read `isCalculating` from the Zustand app slice and pass it down? Or is this wiring already handled elsewhere?

> *Your answer:* Answer for Q3 — isCalculating Prop Wiring
Decision: Pass the isCalculating prop down directly from the parent (PropertyPage.tsx). The parent component is the single source of truth for managing this dynamic calculation state during debounced server-side updates.

Reasoning:
- Parental State Authority: Since PropertyPage handles the active data lifecycle, form updates, and debounced network calls to the server, it is the natural place to host the local isCalculating flag. This avoids coupling read-only presentational modules to global Zustand slice selectors.
- Component-Level Fluidity: Managing this at the parent page level allows us to apply the calculation backdrop blur layout cleanly across individual sections (like the form, interests grid, and yield forecast table) without freezing or locking the entire application interface with a heavy, global full-screen isLoading overlay.

Final Instructions:
Claude must wire the parent component's active calculation state straight down into <PropertyYieldForecast /> and implement the absolute guard overlay directly within the table layout container:

1. Mount the Component with the Parent Flag in PropertyPage.tsx
Ensure the parent state token feeds directly into the view layout contract interface:
```TypeScript
{/* Render the Forecast Table layout block conditionally matching the parental gate */}
{propertyState.showMortgagePrepayment && (
  <PropertyYieldForecast
    yieldForecast={propertyState.calcYieldForecast || []}
    isCalculating={isCalculating} // Fed from the parent's ongoing API request state
    activeResultTab={activeResultTab}
  />
)}
```
2. Implement the Safe Micro-Overlay within PropertyYieldForecast.tsx
Instead of using a blocking element, apply the safe absolute pointer guard overlay to lock row updates visually while the server re-computes the financial rows:
```TypeScript
export const PropertyYieldForecast: React.FC<PropertyYieldForecastProps> = ({
  yieldForecast,
  isCalculating,
  activeResultTab
}) => {
  if (!yieldForecast || yieldForecast.length === 0) return null;

  // Handle responsive mobile visibility bindings matching the spec rules
  const responsiveVisibilityClass = cn(
    "hidden lg:block w-full", 
    activeResultTab === 'yield' && "block"
  );

  return (
    <div className={responsiveVisibilityClass}>
      <SectionHeader 
        label={phrase('property_financial_forecast_expected_return_header', 'תחזית תשואה פיננסית צפויה')} 
        icon={TableIcon} 
        variant="blue" 
      />
      
      {/* Relative container wrapper to contextually anchor the calculation glass guard */}
      <Card className="relative overflow-x-auto max-h-[600px] border border-slate-200 shadow-sm rounded-xl">
        <table className="w-full text-sm text-right text-slate-600 border-collapse">
          {/* Header and Row mapping structures here */}
        </table>

        {/* Localized Production Guard Backdrop Glass Layer */}
        {isCalculating && (
          <div className="absolute inset-0 z-50 bg-white/30 dark:bg-black/10 backdrop-blur-[1px] cursor-wait transition-all duration-200" />
        )}
      </Card>
    </div>
  );
};
```
---

### Q4 — `formatCurrency` vs `formatCompact` for Currency Cells

The plan says to use `formatCurrency` for columns 2–7. However, `formatCurrency` in `formatUtils.service.tsx` **returns JSX** (`<span>` with `₪` symbol), not a plain string.

Meanwhile the spec also says to apply `dir="ltr"` to all numeric `<td>` elements — but `formatCurrency` already wraps its number in a `dir="ltr"` span internally.

**Which formatter should be used for currency columns?**
- **Option A:** `formatCurrency` (full `₪` symbol + JSX) — `dir="ltr"` on `<td>` is then redundant/can be removed from those cells.
- **Option B:** `formatCompact` (compact `1.2M`/`450K` notation, plain string) — keep `dir="ltr"` on `<td>`. This is what the current implementation uses.

> *Your answer:* (A) Use formatCurrency. Drop the explicit dir="ltr" on the <td> layout cells where this formatter is applied, as it already handles the text-direction wrapper internally.

Reasoning:
- Preserving Financial Density: Long-term financial schedules and cash-flow projection charts need exact figures. Using formatCompact (Option B) hides small but critical changes in costs or tax growth over a 30-year span (e.g., seeing a specific month's net cash flow change by a few hundred shekels gets buried if it always rounds to a flat K or M notation).
- DRY UI Elements: Since your core utility service formatCurrency natively emits a pre-styled <span> block complete with the currency symbol ($\unicode{x20AA}$) and the correct language alignment tokens, letting it handle the cell's interior avoids cluttering the table layout with redundant HTML attributes.

Final Instructions:
Claude must map columns 2 through 7 using the standard formatCurrency() service, while keeping standard text properties or numeric percentages cleanly formatted with plain strings and explicit direction properties:
```TypeScript
{/* Loop directly through the sanitized yieldForecast structure */}
{yieldForecast.map((row) => (
  <tr key={row.monthNo} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
    {/* Month column - Plain standard number */}
    <td className="p-3 text-center font-medium text-slate-500">{row.monthNo}</td>
    
    {/* Columns 2-7: Currency columns using formatCurrency (No redundant cell dir="ltr" needed) */}
    <td className="p-3 text-right">{formatCurrency(row.propertyPrice)}</td>
    <td className="p-3 text-right">{formatCurrency(row.rent)}</td>
    <td className="p-3 text-right">{formatCurrency(row.financingCosts)}</td>
    <td className="p-3 text-right">{formatCurrency(row.valuationInRealization)}</td>
    <td className="p-3 text-right">{formatCurrency(row.commendationTax)}</td>
    
    {/* Column 7: Profit Currency with a conditional text color container wrap */}
    <td className={cn("p-3 text-right font-semibold", row.profit < 0 ? "text-red-600" : "text-emerald-700")}>
      {formatCurrency(row.profit)}
    </td>
    
    {/* Columns 8 & 9: Percentage columns using plain string formatters (Retain dir="ltr" on cell) */}
    <td className={cn("p-3 text-right font-medium", row.totalReturn < 0 ? "text-red-600" : "text-slate-900")} dir="ltr">
      {formatPercent(row.totalReturn)}
    </td>
    <td className={cn("p-3 text-right font-medium", row.returnOnEquity < 0 ? "text-red-600" : "text-slate-900")} dir="ltr">
      {formatPercent(row.returnOnEquity)}
    </td>
  </tr>
))}
```

---

### Q5 — Red Coloring Scope

The spec says to apply `text-red-600` **only** to Profit, Total Return, and ROE if `< 0`.  
The current implementation applies red to **many more columns** (Property Value, Rent, Financing Costs, Exit Value, Tax as well).

Should I strictly follow the spec and **remove** the red conditional from all columns except Profit, Total Return, and ROE?

> *Your answer:* Strictly follow the specification. Apply the text-red-600 conditional formatting class only to the Profit, Total Return, and ROE (Return on Equity) columns when their values drop below zero ($\le 0$). Remove the conditional red styling from all other columns.

Reasoning:
- Visual Noise Reduction: In financial modeling charts with hundreds of rows, coloring baseline baseline metrics like property value, rent, or taxes in red causes visual fatigue and hides actual performance flags. If an asset's price grows or a tax is levied, it is standard operating overhead—not a portfolio deficit.
- Highlighting Real Performance Deficits: Red should be reserved strictly as a high-priority warning indicator for negative cash flow or equity losses. Limiting the color logic to Net Profit, Total Return, and ROE immediately guides the investor's eye to systemic stress points in their 30-year projection timeline.

Final Instructions:
Claude must strip the old conditional text markers from columns 2–6 and apply them exclusively to the final three computational blocks:
```TypeScript
{/* Loop directly through the sanitized yieldForecast structure */}
{yieldForecast.map((row) => (
  <tr key={row.monthNo} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
    <td className="p-3 text-center font-medium text-slate-500">{row.monthNo}</td>
    
    {/* Columns 2-6: Standard business figures with unified, steady styling */}
    <td className="p-3 text-right text-slate-700">{formatCurrency(row.propertyPrice)}</td>
    <td className="p-3 text-right text-slate-700">{formatCurrency(row.rent)}</td>
    <td className="p-3 text-right text-slate-700">{formatCurrency(row.financingCosts)}</td>
    <td className="p-3 text-right text-slate-700">{formatCurrency(row.valuationInRealization)}</td>
    <td className="p-3 text-right text-slate-700">{formatCurrency(row.commendationTax)}</td>
    
    {/* Column 7: Net Profit (Conditional Red text on deficit, steady emerald on profit) */}
    <td className={cn(
      "p-3 text-right font-semibold", 
      row.profit < 0 ? "text-red-600" : "text-emerald-700"
    )}>
      {formatCurrency(row.profit)}
    </td>
    
    {/* Column 8: Total Return Percentage (Conditional Red text on negative yield) */}
    <td className={cn(
      "p-3 text-right font-medium", 
      row.totalReturn < 0 ? "text-red-600" : "text-slate-900"
    )} dir="ltr">
      {formatPercent(row.totalReturn)}
    </td>
    
    {/* Column 9: Return on Equity Percentage (Conditional Red text on negative ROE) */}
    <td className={cn(
      "p-3 text-right font-medium", 
      row.returnOnEquity < 0 ? "text-red-600" : "text-slate-900"
    )} dir="ltr">
      {formatPercent(row.returnOnEquity)}
    </td>
  </tr>
))}
```

---

**Waiting for your answers to Q1–Q5 before writing any code.**

*You say:* Answered inline above (Q1–Q5).

---

## [2026-05-18] Implementation Complete

*AI says:*

All decisions applied. Files modified:

| File | Change |
|------|--------|
| `src/types/property.types.ts` | Added `YieldForecastRow` interface with 9 spec-aligned fields |
| `src/pages/PropertyPage.tsx` | Renamed `forecastData` computation to spec keys; added `YieldForecastRow` type; wired `isCalculating` into `<PropertyYieldForecast>`; updated `totalYield10y` to use `returnOnEquity` |
| `src/components/layout/PropertyYieldForecast.tsx` | Full refactor — `useSplash` for phrases, `formatCurrency` for cols 2–7, `formatPercent` for cols 8–9, red only on profit/totalReturn/returnOnEquity, blur overlay on `isCalculating`, null-guard on empty array |
| `src/components/common/YieldChart.tsx` | Updated `dataKey` from `month`→`monthNo`, `totalYield`→`totalReturn`, `yieldOnEquity`→`returnOnEquity` |

TypeScript: `tsc --noEmit` passes with zero errors.