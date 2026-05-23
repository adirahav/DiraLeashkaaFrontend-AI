# Plan: PropertyInterests - Extraction & Refactor

## Task Overview
Refactor `PropertyInterests` into a high-fidelity, *Controlled Component*. It serves as a specialized input group for financial percentages, delegating state persistence and API synchronization to the *Parent/Store*.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-interests-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Visibility Guard**
- *Component Definition:* Ensure the component is "Pure" (receives `property`, `isCalculating`, and `onUpdate` via props).

- *Conditional Rendering:* Implement a top-level guard: `if (!property.showMortgagePrepayment) return null;`.

- *Context:* Access `phrases` and `fixedParameters` via `useSplash`.

**Step 2: Component Refactor (PropertyInterests.tsx)**
- Apply the structure from @property-interests-component.md.

- *Composition*
    - Render `SectionHeader` with `label: property_interest_and_indexes_header, icon: PieChart, and variant: slate`.
    - Map the 9 `InterestControl` components into a responsive grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-5`).

- *Calculation Overlay*
    - Apply the `absolute inset-0 bg-white/40 backdrop-blur-[1px]` overlay only when `isCalculating` is true.

**Step 3: Advanced Field Logic (InterestControl Mapping)**
- *Dynamic Defaults (The Delta Engine)*
    - *Interest 5Y/10Y:* Calculate `defaultValue` on the fly:
`property.calcInterestPercent + fixedParameters.indexesAndInterests.[field].delta`.
    - *General Mapping:*
        - For each field, pass:
            - `label`: Corresponding phrase key.
            - `value`: `property.calc[FieldName]Percent`.
            - `config`: Relevant object from `fixedParameters.indexesAndInterests`.
    - *Event Handling:*
        - `onChange` triggers `onUpdate(fieldName, newValue)`.

**Step 4: Styling & RTL (Tailwind)**
- Ensure consistent spacing (`gap: 1rem`) and RTL support for labels and percentage symbols.

## State Management Check (Zustand Slices Pattern)
- Recalculation:* The Parent/Store handles the debounced API call to the server when `onUpdate` is fired.

- *Sync:* When the server returns new calculated values, they flow back into the component via the `property` prop.


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
### [2026-05-18] AI Pre-Flight Questions

*AI says:*

I've read the existing code in full — `PropertyInterests.tsx`, `PropertyPage.tsx`, `property.types.ts`, `SplashContext.tsx`, `useSplash.ts`, and the `interest-control-component.md` spec. Before writing any code I have the following blocking questions:

---

**Q1 — `fixedParameters.indexesAndInterests` shape (CRITICAL)**

The plan references `fixedParameters.indexesAndInterests.interestPercent.delta` and similar nested paths. However, `SplashContext` types `fixedParameters` as `Record<string, number>` — a **flat** map of number values. A nested object like `indexesAndInterests` cannot live there.

- Does the API actually return `indexesAndInterests` as a nested JSON object stored under a single key (e.g. as a stringified JSON value), similar to how `PropertyForm.tsx` uses `extractPropertyRangeParam` to parse JSON arrays?
- Or does each field come as a flat key like `indexesAndInterests_interestPercent_delta`, `indexesAndInterests_interestPercent_min`, etc.?
- Or should `SplashContextValue.fixedParameters` type be widened to `Record<string, unknown>` to support nested objects?

**The entire "Delta Engine" logic in Step 3 depends on the answer.** Please clarify the exact shape the API returns, or show a sample fixture.

> *Your answer:* Treat indexesAndInterests exactly like propertyInputs. It is a flat key containing a stringified JSON array of configuration records. We will use a safe parsing extractor utility to power the Delta Engine.

Reasoning:
- Consistent Architecture: Since we established the parsing utility strategy for PropertyForm, we will extend the exact same functional pattern here. This avoids changing global context models while safely unlocking nested dynamic configurations.
- Deterministic Delta Calculation: The values for "delta" in your JSON are strings (e.g., "0.1", "0.3"). The utility will parse them into floats, allowing the component to compute dynamic fallback values perfectly when user custom overrides are absent.

Final Instructions:
Claude must build or expand PropertyInterests.tsx using the exact parameter layout matching your active LocalStorage schema:

1. Parameter Parsing Core Selector
Implement or reuse the extractor to handle the parsed array where each item looks like { name: string, min: number, max: number, step: number, default: number, delta: string | null }:
```TypeScript
interface InterestConfig {
  name: string;
  min: number;
  max: number;
  step: number;
  default: number;
  delta: string | null;
}

export function extractInterestParam(
  params: Record<string, unknown>,
  paramName: string,
  fallback: { min: number; max: number; step: number; delta: number }
) {
  try {
    const rawData = params['indexesAndInterests'];
    if (!rawData) return fallback;

    const arr: InterestConfig[] = typeof rawData === 'string' ? JSON.parse(rawData) : (rawData as InterestConfig[]);
    const found = arr.find(p => p.name === paramName);

    if (!found) return fallback;
    return {
      min: found.min,
      max: found.max,
      step: found.step,
      default: found.default,
      delta: found.delta ? parseFloat(found.delta) : 0
    };
  } catch {
    return fallback;
  }
}
```
2. Executing the Step 3 "Delta Engine"For fields like interestIn5YearsPercent and interestIn10YearsPercent, extract their dynamic config and apply the formula dynamically:Formula: $\text{computedDefault} = \text{property.calcInterestPercent} + \text{param.delta}$
```TypeScript
const { params } = useSplash();
const rawParams = (params as Record<string, unknown>) || {};

// 1. Extract raw configuration metadata safely
const interestBase = extractInterestParam(rawParams, 'interestPercent', { min: 0, max: 10, step: 0.1, delta: 0 });
const interest5Y = extractInterestParam(rawParams, 'interestIn5YearsPercent', { min: 0, max: 10, step: 0.1, delta: 0.1 });
const interest10Y = extractInterestParam(rawParams, 'interestIn10YearsPercent', { min: 0, max: 10, step: 0.1, delta: 0.3 });

// 2. Compute dynamic default thresholds on the fly
const dynamicDefault5Y = (property.interestPercent || interestBase.default) + interest5Y.delta;
const dynamicDefault10Y = (property.interestPercent || interestBase.default) + interest10Y.delta;
```

3. Injecting into InterestControl View Slots
Map the parsed layout variables directly to the responsive grid layout controls:
```TypeScript
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
  {/* Base Interest Rate */}
  <InterestControl
    label="ריבית ממוצעת בנטילה"
    value={property.interestPercent}
    min={interestBase.min}
    max={interestBase.max}
    step={interestBase.step}
    onChange={(val) => onUpdate('interestPercent', val)}
  />

  {/* 5 Years Delta Controlled Interest Node */}
  <InterestControl
    label="ריבית צפויה בעוד 5 שנים"
    value={property.interestIn5YearsPercent}
    placeholderValue={dynamicDefault5Y} // Display computed delta background value when null
    min={interest5Y.min}
    max={interest5Y.max}
    step={interest5Y.step}
    onChange={(val) => onUpdate('interestIn5YearsPercent', val)}
  />
</div>
```

---

**Q2 — `PropertyData` fields for interests (CRITICAL)**

The new component reads `property.calcInterestPercent`, `property.calcInterestIn5YearsPercent`, `property.calcAverageInterestAtTakingPercent`, etc. None of these exist in the current `PropertyData` interface (`src/types/property.types.ts`).

- Should I **add all 9 `calc*Percent` fields** to `PropertyData`?
- Or are the interests kept outside `PropertyData` entirely, and the component should receive them via a separate `interests` prop object?

> *Your answer:* Add all 9 fields directly into the existing PropertyData interface contract. Do NOT split them into a separate interests prop object.

Reasoning:
- Perfect API Payload Sync: As proven by your actual database response JSON, the backend returns calculation metrics like calcInterestPercent, calcInterestIn5YearsPercent, and calcAverageInterestAtTakingPercent on the exact same flat root level as core structural property fields (e.g., price, city, equity).
- Preserving the Single State Pipeline: According to the hybrid architectural design we locked in for the main PropertyForm, feeding the exact same property: PropertyData entity into PropertyInterests keeps the components clean, highly scannable, and strictly type-safe without inflating the parent container with redundant prop wrappers.

```TypeScript
export interface PropertyData {
  // ... existing core property data entries (userId, price, city, etc.)

  // Flat mapping of the 9 server calculation nodes
  calcIndexPercent: number;
  calcAverageInterestAtTakingPercent: number;
  calcInterestPercent: number;
  calcInterestIn5YearsPercent: number;
  calcInterestIn10YearsPercent: number;
  calcAverageInterestAtMaturityPercent: number;
  calcInterestToCapitalizePercent: number;
  calcForecastAnnualPriceIncreasePercent: number;
  calcSalesCostsPercent: number;
  calcDepreciationForTaxPurposesPercent: number;
  calcSaleYearsPeriod: number;
  calcTaxOnSale: number;

  // Matching user input overrides/null states
  indexPercent: number | null;
  interestPercent: number | null;
  interestIn5YearsPercent: number | null;
  interestIn10YearsPercent: number | null;
  forecastAnnualPriceIncreasePercent: number | null;
  salesCostsPercent: number | null;
  depreciationForTaxPurposesPercent: number | null;
  saleYearsPeriod: number | null;
}
```
Component Consumption Application Layer:
Inside PropertyInterests.tsx, fields will extract cleanly down the layout grid directly from the singular state model, sending updates back to the parent hook dispatcher smoothly:
```TypeScript
<InterestControl
  label={getPhrase('interest_taking_label', 'ריבית ממוצעת בנטילה')}
  value={property.interestPercent}
  calculatedValue={property.calcInterestPercent}
  onChange={(val) => onUpdate('interestPercent', val)}
/>
```

---

**Q3 — `PropertyPage` integration: individual state vs. property object**

Currently `PropertyPage.tsx` manages interests as 9 separate `useState` hooks (`interest`, `interest5y`, etc.) and passes them directly to `PropertyInterests`. The new controlled-component API is `property` + `onUpdate(field, value)`.

- Should I **migrate** the `PropertyPage` to fold the interest fields into the `property` / `PropertyData` object and route changes through `handleFieldChange` (same as `PropertyForm`)? 
- Or should `PropertyPage` keep its own interest state and a local adapter `onUpdate` is passed down that calls each individual setter?

This determines the scope of work: touching only `PropertyInterests.tsx`, or also updating `PropertyPage.tsx` and `property.types.ts`.

> *Your answer:* (A) Migrate PropertyPage to completely fold the individual interest states into the single unified property state object. Route all updates through the shared handleFieldUpdate pipeline. Eliminate the 9 separate useState hooks.

Reasoning:
- Architectural Consistency: We already decided in Q2 and Q3 of the main form to treat the property payload as a unified flat model that reflects the server's API structure. Keeping 9 detached useState hooks just for interests contradicts that design and leaves dirty legacy code in the parent.
- Streamlined Pipeline: By merging these states, a single update function in PropertyPage handles changes for both general fields (like price or city) and macro-financial fields (like interestPercent). This ensures that debouncing and recalculation requests sent to the backend are completely centralized.

Final Instructions:
Claude must refactor PropertyPage.tsx alongside PropertyInterests.tsx to unify the data management:
1. Clean up State Definitions in PropertyPage.tsx
Remove the 9 individual hooks and ensure they are part of the root component's singular state manager:
```TypeScript
// REMOVE THESE:
// const [interest, setInterest] = useState(...)
// const [indexPercent, setIndexPercent] = useState(...)

// RETAIN ONLY THE UNIFIED SCHEME:
const [propertyState, setPropertyState] = useState<PropertyData>(initialPropertyPayloadFromServer);
```
2. Route Updates Through the Unified Dispatcher
The same handler utilized by the main form will naturally accept interest keys since we extended PropertyData in the previous step:
```TypeScript
const handleFieldUpdate = (field: keyof PropertyData, value: any) => {
  // 1. Structural local update
  setPropertyState(prev => ({ ...prev, [field]: value }));
  
  // 2. Dispatch to server for financial recalculation (debounced)
  triggerBackendRecalculation(field, value);
};
```
3. Component Clean Mounting Interface
Mount the newly refactored component cleanly inside PropertyPage.tsx using the identical contract setup as the main form:
```TypeScript
<PropertyInterests
  property={propertyState}
  isCalculating={isCalculating}
  onUpdate={handleFieldUpdate}
/>
```

---

**Q4 — `showMortgagePrepayment` guard placement**

The plan says to add a top-level guard `if (!property.showMortgagePrepayment) return null` inside `PropertyInterests`. But `PropertyPage` currently renders `<PropertyInterests>` **unconditionally**, outside `PropertyForm`, without any `property` prop.

- Should the visibility check stay **inside** `PropertyInterests` (and `PropertyPage` always renders it), or remain **in the caller** (PropertyPage only renders it when `property.showMortgagePrepayment` is true)?
- The current page already renders it unconditionally — is there a bug to fix here?

> *Your answer:* Keep the visibility guard inside the parent caller (PropertyPage.tsx). The parent decides whether to mount or unmount the <PropertyInterests> component entirely based on property.showMortgagePrepayment.

Reasoning:
- Parental Control ("האבא מחליט"): Following strict presentational component patterns, a child component should not contain self-destructive rendering logic (return null) based on global data if it can be avoided. Letting the parent manage the lifecycle prevents empty wrapper elements or unneeded hook executions from mounting.
- Fixing the Unconditional Render Bug: The current layout renders the interests module unconditionally outside the form wrapper. By shifting the guard to the parent level, we fix this architectural bug, making sure macroeconomic interest inputs disappear completely when a property does not require mortgage computations.

Final Instructions:
Claude must wrap the mounting point of <PropertyInterests /> inside PropertyPage.tsx using a clean short-circuit evaluation block:
1. Keep the Child Component Pure
Remove top-level structural null-returns inside PropertyInterests.tsx. Assume that if the component is mounted, the data is required:
```TypeScript
// inside PropertyInterests.tsx
export const PropertyInterests: React.FC<PropertyInterestsProps> = ({ property, isCalculating, onUpdate }) => {
  // Directly render the SectionHeader and the grid mapping layer safely...
};
```
2. Implement the Lifecyle Gate in PropertyPage.tsx
Bind the rendering contract inside the parent layout template file explicitly:
```TypeScript
{/* Main Property Configuration Layout Area */}
<PropertyForm 
  property={propertyState} 
  isCalculating={isCalculating} 
  onUpdate={handleFieldUpdate} 
/>

{/* Macroeconomic Interest Delta Engine Node - Controlled by Parent Guard */}
{propertyState.showMortgagePrepayment && (
  <PropertyInterests
    property={propertyState}
    isCalculating={isCalculating}
    onUpdate={handleFieldUpdate}
  />
)}
```

---

**Q5 — SCSS file**

The UI skill requires a scoped SCSS file at `src/assets/css/components/property-interests.scss`. No such file exists yet. Should I **create** it (with only the `is-loading` modifier as specified), or is styling Tailwind-only and the SCSS file can be skipped?

> *Your answer:* Skip the SCSS file completely. Use pure Tailwind CSS for all styling, layout, and state overrides (such as loading and calculating states).

Reasoning:
- Codebase Alignment: As established in Q7 of the main PropertyForm plan, the application relies entirely on utility-first Tailwind classes. Introducing a lone SCSS file for the interests section breaks style consistency and adds unnecessary build-overhead.
- Declarative Calculation Layout: Tailwind handles conditional states cleanly inside the TSX syntax using utility compositions and the cn() merger. We can render a secure, blurred absolute overlay directly in the layout when isCalculating is active, completely eliminating the need for a legacy CSS .is-loading modifier. 

Final Instructions:
Claude must build PropertyInterests.tsx with zero dependencies on external SCSS stylesheets. All layout properties, grid spacing, and calculation states must be managed directly via inline utilities:

1. Responsive Pure Tailwind Grid
Map the 9 interest fields into a robust, responsive grid layout that supports RTL and consistent element spacing natively:
```TypeScript
<div className="relative w-full">
  {/* The 9-Control Multi-Column Layout Grid */}
  <div className={cn(
    "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-all duration-300",
    isCalculating && "opacity-50 pointer-events-none select-none"
  )}>
    {/* 9 x <InterestControl /> mapping nodes go here */}
  </div>

  {/* Production-Grade Calculation Guard Overlay (Replacing the SCSS .is-loading layer) */}
  {isCalculating && (
    <div className="absolute inset-0 z-50 bg-white/30 dark:bg-black/10 backdrop-blur-[1px] cursor-wait rounded-xl" />
  )}
</div>
```

---

**→ STOP. Waiting for answers before generating any code.**