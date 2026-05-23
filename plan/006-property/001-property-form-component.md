# Plan: PropertyForm - Extraction & Refactor

## Task Overview
Refactor the `PropertyForm` into a high-fidelity, centralized component driven by `Zustand`. It must handle complex real estate calculations, multi-section layouts, and a guided `Tour Mode`, while maintaining high performance through debounced API syncs.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-form-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (Zustand & Sync)**
- *State Selection (Zustand)*
    - Use `useStore` to access the `property` object (Property Slice) and `isCalculating` (App Slice).
    - Access `fixedParameters` (cities, types, ranges) from `useSplash`.

- *Real-time Sync & Debounce*
    - Implement a `handleFieldChange` function that:
        1. Performs an **Optimistic Update** in the local Zustand state for immediate UI response.
        2. Triggers a **Debounced API Call** (e.g., 500ms) to the server for recalculation.
    - Ensure `isCalculating` is toggled during the server-side calculation phase.

- *Tour Mode Engine*
    - Implement logic to intercept `onUpdate` during `tour.isActive`.
    - Handle transitions: If `currentStep === 'CITY'`, update city -> trigger 1.2s mock loading -> set `pendingTourStep` to `'PRICE'`.

**Step 2: Component Refactor (PropertyForm.tsx)**
- Apply the structure from @property-form-component.md.

- *Composition*
    - Map the 6 spec sections using `SectionHeader` (with correct icons/variants) and `Card`.
    - Apply a global "Calculation Overlay" (`backdrop-blur`) to all cards when `isCalculating` is true.

- *Field Logic - Parts 1 & 2 (Basics & Income)*
    - **AutoFillInput:** Logic for `Equity`, `Incomes`, and `Commitments` to merge `loggedinUser` defaults with `property.calc` values.
    - **EditableInput (Desired Repayment):** Implement the custom vs. calculated toggle based on `possibleMonthlyRepaymentCustomValue`.

- *Field Logic - Parts 4 & 5 (Expenses & Rent)*
    - **Label:** Use a ternary or helper to choose between *..._label* and *..._label_without_value* based on whether customValue is null.
    - **Value:** Pass the full object *{calc, customValue, default}*.
    - **Interactive Source:** Pass the relevant range from *fixedParameters*.

- *Conditional Display - Parts 3 & 6 (Mortgage)*
    - Wrap Sections 3 and 6 in a conditional block: `{property.showMortgagePrepayment && (...)}`.
    - Warnings:
        - Apply `danger` variant to `Estimated Payment` if > `PossibleMonthlyRepayment`.
        - Show `property_mortgage_period_warning` if age + period exceeds limits.

**Step 3: Tour Mode Integration**
- Ref Management
    - Assign `refs` (cityRef, priceRef, etc.) to the specific field wrappers.

- Tour Logic
    - Use `tour.isActive` and `tour.currentStep` to apply high z-index classes.
    - When a field is updated during a tour, call `onTourAction` to allow the parent to manage the transition and mock loading.

**Step 4: Styling & RTL (Tailwind)**
- Layout: Responsive Grid (`gap: 1.25rem`).

- RTL: Ensure proper alignment for Hebrew labels and currency symbols.


## State Management Check (Zustand Slices Pattern)
- *App Slice:* Toggle `isCalculating` during the async process.

- *Selectors:* Strictly use atomic selectors (e.g., `state => state.user`) via `useStore` to ensure optimized re-renders and type safety.

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

## [2026-05-18] Pre-flight: Clarifying Questions

*AI says:*

After reviewing the existing codebase — `PropertyForm.tsx` (at `src/components/layout/`), `PropertyPage.tsx`, all `propertyFields/` sub-components, and the Zustand slices — I have identified the following critical ambiguities that must be resolved before writing any code.

---

### Q1 — File Location & Migration Strategy

**Context:** The spec says the standalone file is at `src/layouts/PropertyForm.tsx`. Currently it lives at `src/components/layout/PropertyForm.tsx`, and `PropertyPage.tsx` imports from that path.

**Question:** Should I:
- **(A) Replace in-place** — Rewrite `src/components/layout/PropertyForm.tsx` directly (no path change, no import update needed in `PropertyPage.tsx`).
- **(B) Move to `src/layouts/`** — Create `src/layouts/PropertyForm.tsx` and update all import sites (`PropertyPage.tsx`, etc.).
- **(C) Create a new file at `src/layouts/` and keep the old one** — The old one stays as-is; only new usage points to `src/layouts/`.

> *Your answer:* (A) Replace in-place — Rewrite src/components/layout/PropertyForm.tsx directly.

Reasoning:
- Prevent Unnecessary Path Churn: Moving the file to src/layouts/ (Option B or C) would break existing relative imports inside your router configs, page shells (PropertyPage.tsx), or test files without adding any structural value.
- Maintain Single Source of Truth: Keeping the old file while creating a new one (Option C) is highly dangerous, as it introduces duplicate component definitions, leading to dead code and split-state bugs during the refactor. Refactoring the file in-place guarantees a smooth, zero-downtime migration.

Final Instructions:
Claude must overwrite src/components/layout/PropertyForm.tsx natively, keeping its current export signature intact but completely upgrading the internals according to the following architectural pillars:
1. Atomic Store Selection & Performance Optimization
To prevent massive re-render cycles across this large multi-section form, Claude must completely avoid wholesale store destructuring (const { property, isCalculating } = useStore()). Instead, strictly implement isolated atomic selector pairs:
```TypeScript
const property = useStore(state => state.property.currentProperty);
const updatePropertyField = useStore(state => state.property.updateField);
const isCalculating = useStore(state => state.app.isCalculating);
const setIsCalculating = useStore(state => state.app.setIsCalculating);
```
2. Optimistic Update + Debounced Recalculation Engine
When a user modifies a field (e.g., changing the property purchase price or expected rent), the form layout must react instantly. Implement the following dual-phase synchronization execution pipeline:
- Phase 1 (Instant): Perform an optimistic UI state sync by dispatching the changed value straight into the client-side Zustand state via updatePropertyField.
- Phase 2 (Debounced API Call): Fire a debounced wrapper (500ms fallback window) that sets setIsCalculating(true), fires the remote calculation service API endpoint, updates the final computed metrics slice payload, and safely forces setIsCalculating(false).
3. Guided Tour Mode Interception Pipeline
If the workspace is active inside the onboarding tutorial framework (tour.isActive === true), standard field updates must be dynamically hijacked to control the script flow:
- If the user is currently completing the CITY step and chooses a town, intercept the event, lock down the interface to trigger a 1.2s localized artificial simulation delay, and invoke the shared tracking state action hook onTourAction to advance the guide wrapper cleanly to the PRICE node anchor.
4. Absolute Structural Grid & Calculation Backdrop Overlay
- Composition Structure: Map the 6 functional domains out into structural grid segments utilizing your atomic <Card /> containers and <SectionHeader /> modules.
- Global Calculation Guard: Wrap the primary grid shell layout inside a relative anchor point. When isCalculating resolves to true, dynamically mount a full-scale pointer-lock viewport shield featuring a smooth backdrop utility class (className="absolute inset-0 z-50 bg-slate-50/20 backdrop-blur-[1px] cursor-wait transition-all"). This keeps the input fields perfectly visible to the user while cleanly locking them down against rapid multi-click mutation side-effects.

---

### Q2 — Smart vs. Presentational Architecture (Most Critical)

**Context:** The current `PropertyForm` is a pure presentational component — all 40+ state values and all setters are drilled as props from `PropertyPage.tsx`. The spec says it should be a **"standalone smart component"** that reads from Zustand (a `property` slice) and calls `onUpdate(field, value)`.

However, **there is no `property` Zustand slice** in the current codebase — only `auth.slice.ts` and `app.slice.ts`. The `property` data is entirely local state in `PropertyPage.tsx`.

**Question:** Which approach should I take?
- **(A) Keep prop-drilling, add `getPhrase` strings** — Do NOT refactor the architecture. Only replace hardcoded Hebrew strings with `getPhrase()` calls and minor spec alignment. The existing prop interface remains intact.
- **(B) Create a property Zustand slice** — Build a new `property.slice.ts` with the full `PropertyData` model (all `calcXxx` fields), then refactor `PropertyForm` to be truly smart (reads from store, emits `onUpdate`). This is a large change.
- **(C) Hybrid** — `PropertyForm` remains prop-driven but accepts a single `property` object + single `onUpdate(field, value)` callback (collapsing the 40+ props). `PropertyPage` handles the internal state mapping. No new Zustand slice.

> *Your answer:* (C) Hybrid Approach — Keep local state in PropertyPage, but collapse the 40+ individual props into a single clean state object (property) and a single unified updater callback (onUpdate(field, value)). Do NOT create a new Zustand slice at this time.

Reasoning:
- Risk Mitigation & Scope Control: Creating a global Zustand slice for properties (Option B) right now is out-of-scope and highly risky. It would force massive rewrites across page wrappers and initialization hooks, potentially introducing severe architectural regressions.
- Dramatic Code Clean-up: The biggest pain point is the 40+ prop-drilling mess. Option C completely resolves this. By grouping everything into an interface like property: PropertyData and providing a single dispatcher, we clean up the interface visually and syntactically while keeping data state mutation safely contained where it currently works.
- Preparation for the Future: This architecture creates a perfect boundary. If you decide to migrate to Zustand later, all Claude (or you) will have to do is swap the source inside PropertyPage from a local hook to a store selector, without touching a single line of code inside PropertyForm.tsx or its 15 sub-fields!

Final Instructions:
1. Refactor the Component Prop Interface:
Completely remove the 40+ individual state/setter props from PropertyForm.tsx. Redefine its component contract strictly as follows:
```TypeScript
interface PropertyFormProps {
  property: PropertyData; // The unified property data model instance
  onUpdate: (field: keyof PropertyUpdatePayload, value: any) => void; // Single event pipeline
  isCalculating: boolean; // Direct application loader state
  // Tour and layout variants as needed...
}
```
2. State Upgrades Inside PropertyPage.tsx:
Update the parent page so it aggregates its individual useState hooks into a unified structural state object, feeding PropertyForm through the new collapsed interface contract:
```TypeScript
// Inside PropertyPage.tsx
const handleFieldUpdate = (field: string, value: any) => {
  // 1. Perform optimistic state update locally
  setPropertyState(prev => ({ ...prev, [field]: value }));

  // 2. Trigger debounced service calculation pipeline automatically
  triggerDebouncedCalculation(field, value);
};
```
3. UI Mapping and Field Dispatches:
Inside PropertyForm.tsx, fields will now read directly from the property prop (e.g., <AutoFillInput value={property.calcEquity} ... />) and propagate events upstream using the singular token callback: onChange={(val) => onUpdate('calcEquity', val)}.

---

### Q3 — `PropertyData` Model & `calcXxx` Fields

**Context:** The spec maps fields like `property.calcEquityCleaningExpenses`, `property.calcMortgageRequired`, `property.calcDisposableIncome`, etc. Currently these are inline `useMemo` calculations in `PropertyPage.tsx` — not part of any model.

**Question:**
- **(A)** Should I create `src/models/PropertyData.ts` as a TypeScript interface that matches all the `property.calcXxx` + `property.defaultXxx` + `property.customValueXxx` fields listed in the spec? This is needed before implementing Approach B or C in Q2.
- **(B)** Or is the model intentionally omitted from this task — i.e., we just align the component's UI/string layer without restructuring the data model?

> *Your answer:* (B) Align the component to directly consume the API's existing flat data object layout. Do NOT build a separate client-side calculation model.

Reasoning:
- Single Source of Truth (The Server): Since the server acts as the financial calculation engine and returns fully structured blocks (calcXxx, defaultXxx, and XxxCustomValue), our only job in the frontend is to map these existing database properties straight into the UI components.
- Simplifying the Interface Contract: By selecting this approach, the property object passed down from PropertyPage to PropertyForm will explicitly use the exact JSON schema returned by your API.

Final Instructions:
Claude must build or update the TypeScript contract (e.g., inside src/types/property.types.ts or inline if standard) to match your real API structure, and wire the PropertyForm fields to look up these properties explicitly:

1. AutoFillInput Mapping Layout
For core user financial profiles (equity, incomes, commitments), bind the fields so they display the active value, know the default backup, and fire corrections upstream:
```TypeScript
<AutoFillInput
  label="הון עצמי פנוי"
  value={property.equity}
  defaultValue={property.defaultEquity}
  calcValue={property.calcEquity}
  onChange={(val) => onUpdate('equity', val)}
/>
```
2. EditableInput / Custom Overrides Pipeline
For operational expenses (like legal fees or real estate agents), the component needs to know if the user input a manual override (CustomValue) or if it should dynamically fallback to the server's calculated percent/fixed rate:
```TypeScript
<EditableInput
  label="שכר טרחת עורך דין"
  value={property.lawyerCustomValue !== null ? property.lawyerCustomValue : property.calcLawyer}
  isCustom={property.lawyerCustomValue !== null}
  defaultValue={property.defaultLawyer}
  calculatedValue={property.calcLawyer}
  onChange={(val) => onUpdate('lawyerCustomValue', val)} // Sends null if rolled back
/>
```
3. Summary Fields & Real-time Server Sync
All metrics rendered inside read-only widgets (SummaryField or MetricTile) must pull directly from the server's static calcXxx variables (e.g., value={formatCurrency(property.calcMortgageRequired)}). When isCalculating is triggered via the debounced input hook, these fields will naturally show the global calculation blur until the fresh server response updates the payload.

---

### Q4 — `fixedParameters` Shape for Property Inputs

**Context:** The spec references `fixedParameters.propertyInputs.possibleMonthlyRepaymentPercent`, `fixedParameters.propertyInputs.lawyerPercent`, etc. — **nested** objects with `{ min, max, step }`. The current `SplashData.fixedParameters` is a **flat** `Record<string, number>` (e.g., `{ lawyer_percent_min: 0, lawyer_percent_max: 2, lawyer_percent_step: 0.1, ... }`).

**Question:**
- **(A)** Should I build a `fixedParameters` adapter/selector that maps the flat API response into the nested `{ propertyInputs: { lawyerPercent: { min, max, step } } }` shape the spec expects?
- **(B)** Or should I keep using the current flat approach for the sliders — i.e., pass individual `min`/`max`/`step` values from `getParam()` calls directly in the component?
- **(C)** Or are these `fixedParameters.propertyInputs.*` values not yet coming from the API at all — and should I keep the current hardcoded slider ranges (0–2%, 0–4%, etc.)?

> *Your answer:* (A) Create a clean parameter-extraction utility service / selector to parse and structure the nested API JSON strings before feeding them into the inputs.

Reasoning:
- Native Structural Cleanliness: Hardcoding fallback values inside the components (Option C) or spraying multiple dangerous try-catch parsing blocks directly inside the slider view layers (Option B) breaks clean architectural separation.
- Production Reusability: Isolating this logic into a simple service/helper allows PropertyForm to securely pull dynamic step definitions, min thresholds, and max constraints directly from the server's cloud configuration natively without mutating layout code when parameters are adjusted in production.

Final Instructions:
Claude must create a dedicated parameter selector function inside src/components/layout/PropertyForm.tsx (or a global structural helper file) to seamlessly extract fields from params:
1. Implement the Structural Parameter Extractor
```TypeScript
interface ParamRange {
  name: string;
  min: number;
  max: number;
  step: number;
  default: number;
  delta: number | null;
}

export function extractPropertyRangeParam(
  params: Record<string, unknown>, 
  arrayKey: 'propertyInputs' | 'indexesAndInterests', 
  paramName: string,
  fallback: { min: number; max: number; step: number }
): { min: number; max: number; step: number } {
  try {
    const rawData = params[arrayKey];
    if (!rawData) return fallback;
    
    const arr: ParamRange[] = typeof rawData === 'string' ? JSON.parse(rawData) : (rawData as ParamRange[]);
    const found = arr.find(p => p.name === paramName);
    
    if (!found) return fallback;
    return {
      min: found.min,
      max: found.max,
      step: found.step
    };
  } catch {
    return fallback;
  }
}
```
2. Wire directly into Slider and Input Layout Blocks
Inside PropertyForm.tsx, extract the precise live server properties dynamically inside a useMemo block, passing them cleanly directly to your input modules:
```TypeScript
const { params } = useSplash();

const rangeParams = useMemo(() => {
  const rawParams = (params as Record<string, unknown>) || {};
  return {
    lawyerPercent: extractPropertyRangeParam(rawParams, 'propertyInputs', 'lawyerPercent', { min: 0, max: 2, step: 0.1 }),
    rentPercent: extractPropertyRangeParam(rawParams, 'propertyInputs', 'rentPercent', { min: 0, max: 10, step: 0.1 }),
    possibleRepaymentPercent: extractPropertyRangeParam(rawParams, 'propertyInputs', 'possibleMonthlyRepaymentPercent', { min: 0, max: 40, step: 1 }),
  };
}, [params]);

// Usage inside the layout:
<InterestControl
  label="אחוז משוער לעורך דיն"
  value={property.lawyerPercent}
  min={rangeParams.lawyerPercent.min}
  max={rangeParams.lawyerPercent.max}
  step={rangeParams.lawyerPercent.step}
  onChange={(val) => onUpdate('lawyerPercent', val)}
/>
```

---

### Q5 — `property.showMortgagePrepayment` Visibility for Parts 3 & 6

**Context:** The spec says Sections 3 (Funding Status) and 6 (Mortgage Repayment) are only shown when `property.showMortgagePrepayment === true`. Currently Section 6 is controlled by the `hideMortgageRepayment` prop; Section 3 always renders.

**Question:** What determines `showMortgagePrepayment`?
- **(A)** It is always `true` for now (show both sections always) — the prop is a future-facing design decision.
- **(B)** It maps to the inverse of the existing `hideMortgageRepayment` prop — i.e., `showMortgagePrepayment = !hideMortgageRepayment`.
- **(C)** It will be a computed field on the `property` object (future Zustand slice) — for this task, keep using the existing `hideMortgageRepayment` prop.

> *Your answer:* (C) Use the direct property.showMortgagePrepayment boolean property delivered from the server payload to conditionally render both Section 3 (Funding Status) and Section 6 (Mortgage Repayment). Drop the deprecated legacy hideMortgageRepayment prop.

Reasoning:
- Eliminating Duplicate State Definitions: Since your live database response explicitly serves showMortgagePrepayment, relying on an artificial local flag like hideMortgageRepayment creates synchronization lag and potential interface mismatches.
- Unified Visibility Boundary: The spec specifies that both sections are tethered to this single flag. Moving to this layout pattern guarantees that if a property layout does not require mortgage computations, both input groups collapse simultaneously.

Final Instructions:
Claude must wrap Section 3 and Section 6 inside a single declarative block inside PropertyForm.tsx, directly binding visibility to the API property token:
```TypeScript
{/* Sections 1 & 2 Render Regularly */}
<Card>...</Card> 

{/* Dynamic Mortgage Prepayment Gate for Sections 3 & 6 */}
{property.showMortgagePrepayment && (
  <>
    {/* SECTION 3: Funding Status (מצב מימון) */}
    <SectionHeader 
      title={getPhrase('section_funding_title', 'מצב מימון')} 
      icon="piggy-bank" 
    />
    <Card>
      {/* Content containing calcMortgageRequired, calcActualPercentOfFinancing, etc. */}
    </Card>
    
    {/* SECTIONS 4 & 5 Render Regularly Outside the Gate if needed, or inside based on flow */}
  </>
)}

{/* SECTION 6: Mortgage Repayment (החזר משכנתא חודשי) wrapped at the bottom */}
{property.showMortgagePrepayment && (
  <>
    <SectionHeader 
      title={getPhrase('section_repayment_title', 'החזר משכנתא חודשי')} 
      icon="trending-down" 
    />
    <Card>
      {/* Content containing calcMortgageMonthlyRepayment, calcMortgageMonthlyYield */}
    </Card>
  </>
)}
```
---

### Q6 — `loggedinUser.additionalFundingSources` vs. current `fundingSources` prop

**Context:** The spec says the `AdditionalFundingSources` field reads from `loggedinUser.additionalFundingSources` (from the auth Zustand slice). Currently, `PropertyForm` receives a `fundingSources: any[]` prop that is hardcoded in `PropertyPage.tsx` as `FINANCIAL_DEFAULTS.fundingSources`.

**Question:**
- **(A)** Should the `PropertyForm` access `useStore(state => state.loggedinUser?.additionalFundingSources)` directly (making it smart for this field)?
- **(B)** Keep the `fundingSources` prop as-is — the parent controls the data source.

> *Your answer:* (B) Keep the control in the parent — read the data directly from the unified property.additionalFundingSources payload or pass it through the parent interface. Do NOT read directly from the Auth Zustand store within the component.

Reasoning:
- Preserving the Hybrid Contract: To maintain a clean architectural boundary, PropertyForm shouldn't mix local state with global side-effects from the Auth slice.
- API Availability: Your server response already encapsulates additionalFundingSources inside the property object instance. This means the parent PropertyPage can simply feed the existing array directly into the form field, minimizing data-fetching logic inside the presentational layer.

Final Instructions:
Claude must map the multi-select input or checkboxes for additional funding sources to read directly from the unified property wrapper prop, updating it upstream through the central onUpdate dispatcher:

```TypeScript
{/* בתוך סעיף 3: מצב מימון */}
<FundingSourcesGroup
  label={getPhrase('additional_funding_sources_label', 'מקורות מימון נוספים')}
  // Reads directly from the property object array returned by your API
  selectedSources={property.additionalFundingSources || []} 
  // Dispatches the updated array upstream safely
  onChange={(updatedSources) => onUpdate('additionalFundingSources', updatedSources)}
/>
```
---

### Q7 — CSS / SCSS File

**Context:** The UI-component-layer skill requires a `src/assets/css/components/property-form.scss` file. The current `PropertyForm` is 100% inline Tailwind with no SCSS file.

**Question:**
- **(A)** Create `src/assets/css/components/property-form.scss` with the `is-loading` and `is-tour-active` BEM modifiers wired to Tailwind utilities.
- **(B)** Skip the SCSS file — Tailwind `cn()` conditionals are sufficient and match the rest of the codebase.

> *Your answer:* (B) Skip the SCSS file completely. Rely exclusively on inline Tailwind CSS utility classes and conditional rendering combined via the cn() utility.

Reasoning:
- Keep the Codebase Unified: Your app is built on a utility-first approach. Introducing custom BEM Sass layers inside src/assets/css/ goes against this principle and complicates build/compilation tracking.
- Native Tailwind Dynamic States: Tailwind can handle dynamic loading states (isCalculating) and structural changes (tour.isActive) natively inside the TSX file using template conditionals and helper compositions via cn().

Final Instructions:
Claude must build all active interaction layers, view toggles, and tour highlighting states directly within the React layout using Tailwind and cn:

1. Handling the Global Overlay Shield (isCalculating)
Instead of a CSS class modifier, lock and blur the screen using an absolute layout overlay injected inline based on state logic:
```TypeScript
<div className="relative w-full">
  {/* The core 6 form sections grid */}
  <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-300", isCalculating && "opacity-60 pointer-events-none select-none")}>
    {/* Form Cards and SectionHeaders here... */}
  </div>

  {/* Absolute Backdrop Glass Guard for real-time calculations */}
  {isCalculating && (
    <div className="absolute inset-0 z-50 bg-white/20 dark:bg-black/10 backdrop-blur-[1px] cursor-wait" />
  )}
</div>
```
2. Handling Guided Tour Mode Highlight Boundaries (tour.isActive)
When a specific input element matches the currently active tutorial checkpoint step, use cn() to elevate its stack visibility (z-index) and apply a localized drop-shadow pulse outline directly:
```TypeScript
const isCityStepActive = tour.isActive && tour.currentStep === 'CITY';

return (
  <div 
    ref={cityRef}
    className={cn(
      "transition-all duration-300 rounded-xl p-0.5",
      isCityStepActive ? "relative z-[100] ring-4 ring-blue-500 shadow-2xl bg-white scale-[1.01]" : "z-0"
    )}
  >
    {/* City Dropdown Input Widget */}
  </div>
);
```
---

**⛔ STOP — Awaiting your answers before any code is written.**

---

## [2026-05-18] Implementation — Decisions Applied & Code Written

*AI says:*

All 7 questions answered. Implementation complete. Summary of what was built:

| Decision | Outcome |
|---|---|
| Q1 File location | Replaced in-place at `src/components/layout/PropertyForm.tsx` |
| Q2 Architecture | Hybrid: 40+ props → single `property: PropertyData` + `onUpdate(field, value)` |
| Q3 PropertyData model | Created `src/types/property.types.ts` — all `calcXxx`, `defaultXxx`, `xxxCustomValue` fields |
| Q4 fixedParameters | `extractPropertyRangeParam()` utility inside PropertyForm; fallbacks to hardcoded defaults |
| Q5 showMortgagePrepayment | Sections 3 & 6 gated on `property.showMortgagePrepayment`; `hideMortgageRepayment` prop dropped |
| Q6 additionalFundingSources | Passed through `property.additionalFundingSources` from parent (no auth store read) |
| Q7 CSS | Tailwind + `cn()` only; no SCSS file |

**Files created/modified:**
- `src/types/property.types.ts` — new `PropertyData` interface
- `src/components/layout/PropertyForm.tsx` — complete rewrite; all strings via `getPhrase()`; `extractPropertyRangeParam` for slider ranges; 6 sections
- `src/pages/PropertyPage.tsx` — added `loggedinUserCalcAge`, `additionalFundingTotalAmount/Repayment` memos, `handleFieldUpdate` switch, `property` view-model object; PropertyForm call reduced from ~80 props to ~18

TypeScript: zero errors (`npx tsc --noEmit`).