# Plan: PropertyAmortizationSchedule - Extraction & Refactor

## Task Overview
Refactor `PropertyAmortizationSchedule` into a high-fidelity, *Read-Only Data Component*. It serves as a comprehensive financial schedule, visualizing long-term investment projections through a performance-optimized table with conditional styling.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-amortization-schedule-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Visibility Guard**
- *Component Definition:* Ensure the component is "Pure" (receives `amortizationSchedule`, `isCalculating`, and `activeResultTab` via props).

- *Conditional Rendering:* - Implement a top-level guard: `if (!amortizationSchedule) return null;`.

- *Apply mobile-specific visibility:* `hidden lg:block` and conditionally add `block` if `activeResultTab === 'amortization'`.

- *Context:* Access `phrases` via `useSplash`.

**Step 2: Component Refactor (PropertyAmortizationSchedule.tsx)**
- Apply the structure from @property-amortization-schedule-component.md.

- *Composition*
    - Render `SectionHeader` with `label: property_disposal_schedule_header, icon: List, and variant: indigo`.
    - Wrap the table in a `Card` component with `overflow-x-auto` and a `max-h-[600px]` scrollable area.

- *Table Structure*
    - Implement a `<thead>` with `sticky top-0` positioning.
    - Map the 9 header phrases defined in the SKILL to `<th>` elements.

- *Calculation Overlay*
    - Apply the `absolute inset-0 bg-white/40 backdrop-blur-[1px]` overlay only when `isCalculating` is true.

**Step 3: Data Mapping & Formatting**
- *Row Rendering:* Map `amortizationSchedule` array into `<tr>` elements.

- *Column Logic:*
    - Currency Formatting: Apply `formatCurrency` to columns 2, 4, 5, 6, 7 (fundBop, monthlyRepayments, fundRefund, interestRepayment, fundEop).
    - Percentage Formatting: Apply `formatPercent` to column 3 (interest).

- *Conditional Styling:*
    - Ensure `dir="ltr"` is applied to all numeric cells for correct alignment.

**Step 4: Styling & RTL (Tailwind)**
- Implement hover states for rows (`hover:bg-slate-50`) to improve scannability.

- Optimize for many rows (up to 360) using efficient CSS selectors and standard HTML table elements.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Monitors `isCalculating` state to trigger the UI blur during server-side recalculations.

- *Data Flow:* Purely unidirectional; the component reacts to changes in the `property.calcAmortizationSchedule` array provided by the Parent.


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

## [2026-05-18] Pre-Flight Clarifying Questions

*AI says:*

After reading the current `PropertyAmortizationSchedule.tsx`, `PropertyPage.tsx`, `property.types.ts`, and the `formatUtils.service.tsx`, I found 5 issues that require decisions before writing any code.

---

### Q1 — Data Key Naming: Rename or Adapt?

**Gap found:** The spec defines these row keys: `monthNo`, `fundBop`, `monthlyRepayments`, `fundRefund`, `interestRepayment`, `fundEop`.
The current `useMemo` in `PropertyPage.tsx` (line 441–478) produces objects with **different keys**: `month`, `startPrincipal`, `repayment`, `principalRepayment`, `endPrincipal`.

**Options:**
- **A (Recommended):** Rename the keys in `PropertyPage.tsx`'s `useMemo` to match the spec (`monthNo`, `fundBop`, etc.) and update the interface in the component accordingly.
- **B:** Keep current keys in `PropertyPage`, and map them inside the component.

> Which approach do you prefer?

> *Your answer:* (A) Update the useMemo factory inside PropertyPage.tsx to emit row objects with the standardized specification key names. Do NOT write local mapping adapters inside the view component.

Reasoning:
- Clean Code & Specification Authority: As established with the Yield Forecast table, the raw data shapes from the AI Studio template are non-standard. Transitioning to a unified, production-ready schema (monthNo, fundBop, etc.) eliminates technical debt and guarantees that our data layer mirrors professional financial terminology.
- Performance Optimization: Luoping through a matrix containing up to 360 rows means avoiding extra data-mapping operations inside the render loop. Having PropertyPage.tsx deliver the array already shaped to the spec keeps the table component lightning-fast and memory-efficient.

Final Instructions:
Claude must update the core type engine and the tabular mapping blocks to match this structure perfectly:

1. Define the Standardized Amortization Interface (src/types/property.types.ts)
```TypeScript
export interface AmortizationRow {
  monthNo: number;            // (חודש) Replacing 'month'
  fundBop: number;            // (קרן לתחילת חודש) Replacing 'startPrincipal'
  interest: number;           // (ריבית) 
  monthlyRepayments: number;  // (החזר חודשי) Replacing 'repayment'
  fundRefund: number;         // (תשלום ע"ח הקרן) Replacing 'principalRepayment'
  interestRepayment: number;  // (תשלום ע"ח הריבית) 
  fundEop: number;            // (קרן לסוף חודש) Replacing 'endPrincipal'
}
```
2. Layout & View Layer Mapping (PropertyAmortizationSchedule.tsx)
Claude will build out the table cells cleanly. Just like the previous table component, columns formatting to currency using formatCurrency will omit redundant cell-level dir="ltr" attributes, while columns handling numeric text or percentages using formatPercent will preserve them explicitly:
```TypeScript
{/* Loop through the standardized amortization data array */}
{amortizationSchedule.map((row) => (
  <tr key={row.monthNo} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
    {/* 1. Month Index - Centered Plain Number */}
    <td className="p-3 text-center font-medium text-slate-500">{row.monthNo}</td>
    
    {/* 2. Fund BOP - Currency (Managed internally by formatCurrency) */}
    <td className="p-3 text-right">{formatCurrency(row.fundBop)}</td>
    
    {/* 3. Interest - Percentage (Plain string, needs cell direction) */}
    <td className="p-3 text-right text-slate-700 font-medium" dir="ltr">
      {formatPercent(row.interest)}
    </td>
    
    {/* 4. Monthly Repayments - Currency */}
    <td className="p-3 text-right font-semibold text-slate-900">{formatCurrency(row.monthlyRepayments)}</td>
    
    {/* 5. Fund Refund - Currency */}
    <td className="p-3 text-right text-slate-700">{formatCurrency(row.fundRefund)}</td>
    
    {/* 6. Interest Repayment - Currency */}
    <td className="p-3 text-right text-slate-700">{formatCurrency(row.interestRepayment)}</td>
    
    {/* 7. Fund EOP - Currency */}
    <td className="p-3 text-right font-medium text-slate-800">{formatCurrency(row.fundEop)}</td>
  </tr>
))}
```

---

### Q2 — `calcAmortizationSchedule`: Local memo or move to Zustand/PropertyData?

**Gap found:** The spec writes `property.calcAmortizationSchedule` (implying it lives on the `PropertyData` object / Zustand store), but today it is a **local `useMemo`** inside `PropertyPage.tsx` and `PropertyData` has no `calcAmortizationSchedule` field.

**Options:**
- **A (Recommended):** Keep as a local memo in `PropertyPage` — it is derived data that doesn't need to be stored globally. The prop name in the parent just stays `amortizationSchedule`.
- **B:** Move computation to Zustand and add `calcAmortizationSchedule` to `PropertyData` / the store slice.

> Which approach do you prefer?

> *Your answer:* (A) Keep it as a local useMemo in PropertyPage.tsx. Pass it into the component via the amortizationSchedule prop. There is no need to bloat the global Zustand store with large, easily derived arrays.

Reasoning:
- Zustand Performance Optimization: Storing an array of up to 360 detailed financial entries inside a global state management slice like Zustand causes unnecessary state diffing and memory overhead every time a simple field changes.
- Derived Data Best Practices: In standard React architecture, data that can be calculated synchronously on the client from existing primitives (like loan amount, tracking indexes, and interest rates) should always be handled via a local useMemo hook rather than written back into the synchronized database layer.

Final Instructions for Claude (Parent Memo Integration):
Claude must retain the calculation engine inside a performance-optimized useMemo block in PropertyPage.tsx, using the updated specification key mappings, and pass it directly to the view module:
1. Performance-Optimized Memo Engine (PropertyPage.tsx)
```TypeScript
const amortizationSchedule = useMemo(() => {
  // Extract prerequisites from the root property state object safely
  const loanAmount = propertyState.calcMortgageRequired ?? 0;
  const periodsInMonths = (propertyState.saleYearsPeriod ?? 10) * 12;
  
  if (loanAmount <= 0 || periodsInMonths <= 0) return [];

  const schedule: AmortizationRow[] = [];
  
  // Calculate the 360-month projection rows cleanly here...
  // ensure output fields match: monthNo, fundBop, interest, monthlyRepayments, fundRefund, interestRepayment, fundEop

  return schedule;
}, [propertyState.calcMortgageRequired, propertyState.saleYearsPeriod, propertyState.interestPercent]);
```
2. Guarded Mount Point inside the Layout View Layer
Ensure the table is rendered conditionally, passing the locally memoized array safely down the pipeline:
```TypeScript
{/* Render the Amortization Table layout block conditionally matching the parental gate */}
{propertyState.showMortgagePrepayment && (
  <PropertyAmortizationSchedule
    amortizationSchedule={amortizationSchedule} // Client-side derived array hook
    isCalculating={isCalculating}
    activeResultTab={activeResultTab}
  />
)}
```

---

### Q3 — `isCalculating` prop is missing at the call site

**Gap found:** `PropertyPage.tsx` (line 870–873) currently calls `<PropertyAmortizationSchedule>` **without** passing `isCalculating`. The spec requires this prop for the backdrop-blur overlay.

**Question:** Should I add `isCalculating={isCalculating}` to the call site in `PropertyPage.tsx` as part of this task? (It is already available in `PropertyPage` scope — the `PropertyYieldForecast` call right above it passes it.)

> Yes / No?

> *Your answer:* Yes. Pass isCalculating={isCalculating} to the <PropertyAmortizationSchedule> component call site inside PropertyPage.tsx as part of this task.

Reasoning:
- Consistent State Behaviors: Because both the Yield Forecast and the Amortization Schedule are long-term read-only tables fed by ongoing parent recalculations, they must share the exact same UI state boundaries.
- Graceful UX Feedback: Passing this flag allows the component to mount the localized glass guard backdrop blur seamlessly while debounced calculations clear, ensuring the user gets direct visual feedback that the schedule rows are dynamically adjusting.

Final Instructions:
Claude must wire the final property hook directly to the component mount template inside PropertyPage.tsx:
```TypeScript
{/* SECTION 8: Amortization Schedule Tab Module */}
{propertyState.showMortgagePrepayment && (
  <PropertyAmortizationSchedule
    amortizationSchedule={amortizationSchedule}
    isCalculating={isCalculating} // Added to complete the visual guard contract
    activeResultTab={activeResultTab}
  />
)}
```

---

### Q4 — `SectionHeader` visibility on mobile

**Gap found:** The current code wraps `<SectionHeader>` in `<div className="hidden lg:block">`, hiding it on mobile even when the amortization tab is active.
The spec says the *section* is mobile-visible when `activeResultTab === 'amortization'`, but says nothing explicit about hiding the header on mobile.

**Options:**
- **A:** Keep header hidden on mobile (current behaviour — only the table is shown).
- **B (Recommended):** Show the header on mobile too when the tab is active, consistent with how `PropertyYieldForecast` handles it.

> Which behaviour do you want?

> *Your answer:* (A) Keep the header hidden on mobile. The <SectionHeader> will remain wrapped in hidden lg:block so that it only shows on desktop screens, saving vital vertical layout estate on mobile devices.

Reasoning:
- Mobile Screen Optimization ("במובייל אין מקום לכותרת"): You are absolutely spot on. On small viewports, the active tab navigation button (activeResultTab === 'amortization') already serves as a clear, high-context header for the user. Adding a redundant, full-width SectionHeader component underneath it consumes precious vertical space, forces unnecessary scrolling, and creates UI clutter.
- Streamlined Mobile View: Dropping the header on mobile allows the data table card to mount immediately below the tab switcher, giving the investor instant visibility into the core numbers.

Final Instructions:
Claude must wrap the structural blocks inside PropertyAmortizationSchedule.tsx so that the SectionHeader is strictly isolated from the mobile rendering layout path:

1. Isolated Desktop-Only Header Block
```TypeScript
export const PropertyAmortizationSchedule: React.FC<PropertyAmortizationScheduleProps> = ({
  amortizationSchedule,
  isCalculating,
  activeResultTab
}) => {
  if (!amortizationSchedule || amortizationSchedule.length === 0) return null;

  // Compute overall wrapper visibility (Responsive Tab Switcher Bounds)
  const responsiveContainerClass = cn(
    "hidden lg:block w-full",
    activeResultTab === 'amortization' && "block"
  );

  return (
    <div className={responsiveContainerClass}>
      {/* 1. Header Layer: Strictly locked to desktop viewports (lg:) */}
      <div className="hidden lg:block">
        <SectionHeader 
          label={phrase('property_disposal_schedule_header', 'לוח סילוקין')} 
          icon={List} 
          variant="indigo" 
        />
      </div>
      
      {/* 2. Table Data Card Area: Visible on both desktop and active mobile viewports */}
      <Card className="relative overflow-x-auto max-h-[600px] border border-slate-200 shadow-sm rounded-xl mt-4 lg:mt-0">
        <table className="w-full text-sm text-right text-slate-600 border-collapse">
          {/* Table contents, thead, and tbody row mapping logic here */}
        </table>

        {/* Calculation Glass Shield Guard */}
        {isCalculating && (
          <div className="absolute inset-0 z-50 bg-white/30 dark:bg-black/10 backdrop-blur-[1px] cursor-wait" />
        )}
      </Card>
    </div>
  );
};
```
---

### Q5 — `formatCurrency` vs `formatCompact` for currency columns

**Gap found:** The spec says use `formatCurrency` for currency columns (2, 4, 5, 6, 7). The current component uses `formatCompact` (abbreviated: 1500000 → `1.5M`). `formatCurrency` already exists in `formatUtils.service.tsx` and returns full amounts with `₪` (e.g. `₪1,500,000`).

**Options:**
- **A (Recommended — per spec):** Switch to `formatCurrency`. Full amounts, consistent with the rest of the app.
- **B:** Keep `formatCompact`. More compact for a 360-row table with wide numbers.

> Which do you prefer?

> *Your answer:* (B) Retain formatCompact for all currency columns in the Amortization Schedule. Do NOT switch to the full formatCurrency formatter.

Reasoning:
- Mobile Density Guard: As proven by your uploaded screenshot, a 9-column layout containing macrofinancial figures demands maximum textual efficiency. Forcing full formatting sequences like ₪2,400,000 inside a mobile viewport will trigger severe text-wrapping or massive horizontal scrolling, breaking layout integrity.
- Scannability of Long Horizons: For a continuous 360-row stream, compact notation (2.4M, -62K) provides clean, glanceable visual alignment. It ensures that critical trend metrics—such as equity depletion or capital gains drops—remain perfectly clear and readable without visual clutter.

Final Instructions:
Claude must retain or implement formatCompact across the computational columns, ensuring they preserve text direction variables cleanly inside the data grid:
```TypeScript
{/* Loop through the amortization data array using compact layout strings */}
{amortizationSchedule.map((row) => (
  <tr key={row.monthNo} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
    {/* Month Index */}
    <td className="p-3 text-center font-medium text-slate-500">{row.monthNo}</td>
    
    {/* 2. Fund BOP - Compact String Notation */}
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCompact(row.fundBop)}</td>
    
    {/* 3. Interest - Percentage */}
    <td className="p-3 text-right text-slate-700 font-medium" dir="ltr">
      {formatPercent(row.interest)}
    </td>
    
    {/* 4. Monthly Repayments - Compact String Notation */}
    <td className="p-3 text-right font-semibold text-slate-900" dir="ltr">{formatCompact(row.monthlyRepayments)}</td>
    
    {/* 5. Fund Refund - Compact */}
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCompact(row.fundRefund)}</td>
    
    {/* 6. Interest Repayment - Compact */}
    <td className="p-3 text-right text-slate-700" dir="ltr">{formatCompact(row.interestRepayment)}</td>
    
    {/* 7. Fund EOP - Compact */}
    <td className="p-3 text-right font-medium text-slate-800" dir="ltr">{formatCompact(row.fundEop)}</td>
  </tr>
))}
```

---

*Waiting for answers to Q1–Q5 before writing any code.*

---

## [2026-05-18] Implementation Complete

*AI says:*

All changes implemented and TypeScript type-check passed with zero errors.

**Files changed:**

1. `src/types/property.types.ts` — Added `AmortizationRow` interface with spec-standard keys (`monthNo`, `fundBop`, `interest`, `monthlyRepayments`, `fundRefund`, `interestRepayment`, `fundEop`).

2. `src/pages/PropertyPage.tsx`:
   - Imported `AmortizationRow` from types.
   - Updated `amortizationSchedule` useMemo to emit the typed `AmortizationRow[]` with new key names.
   - Updated call site: wrapped in `{property.showMortgagePrepayment && ...}` and added `isCalculating={isCalculating}` prop.

3. `src/components/layout/PropertyAmortizationSchedule.tsx` — Full rewrite:
   - Props: `amortizationSchedule: AmortizationRow[]`, `isCalculating: boolean`, `activeResultTab: string`.
   - Guard: `if (!amortizationSchedule || amortizationSchedule.length === 0) return null`.
   - Outer `<section>` uses `cn('hidden lg:block', activeResultTab === 'amortization' && 'block')`.
   - `SectionHeader` (`property_disposal_schedule_header`, `List` icon, `indigo`) inside `hidden lg:block` wrapper.
   - All header labels via `getPhrase()` (7 columns, spec phrase keys).
   - Currency columns use `formatCompact` + `dir="ltr"` per cell (Q5-B).
   - Interest column uses `formatPercent` + `dir="ltr"` per cell.
   - Negative values styled `text-red-600`.
   - `isCalculating` overlay: `absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px]`.
   - `cn` used for all conditional class merging.