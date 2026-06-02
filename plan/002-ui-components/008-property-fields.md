# Plan: PropertyFields Component - Extraction & Refactor

*Objective:* Transform the raw PropertyFields into a production-ready component following the project's Skill layers.

*Reference:* Use the specialized knowledge in
  - @ui-component-layer/SKILL.md
  - @css-layer/SKILL.md
  - Individual Specs: 
        - @rollback-button-component.md
        - @animated-number-component.md       
        - @interactive-label-component.md 
        - @metric-card-component.md 
        - @suggested-number-input-component.md
        - @calc-input-component.md
        - @editable-input-component.md
        - @auto-fIll-input-component.md
        - @segmented-control-component.md
        - @financing-status-component.md
        - @summary-field-component.md
        - @additional-funding-sources-component.md
        - @additional-funding-sources-editor-component.md
        - @interest-control-component

## Import Layout from AI Studio
Refactor raw component PropertyFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Component Refactor

- *Refinement per Component:*
    1. RollbackButton
      - *File Placement:* Move the component to `components/propertyFields/RollbackButton.tsx`.
      - Apply @rollback-button-component.md.
      - Iconography: Use `RotateCcw` from `lucide-react`.
      - Interaction: Apply hover:bg-blue-50 hover:text-blue-600 transition-colors using Tailwind classes.
      - Integration Check: Verify that this component is correctly imported and used within `EditableInput`, `SuggestedNumberInput`, and `AutoFIllInput`.

    2. *AnimatedNumber*
      - File Placement: Move the component to `components/propertyFields/AnimatedNumber.tsx`.
      - Apply @animated-number-component.md.
      - Performance Optimization: Ensure `useRef` is used for `startTime` and `requestRef` to prevent side-effect loops.
      - Easing Accuracy: Verify the math for `easedProgress` to ensure it reaches exactly `1` at the end of the duration.
      - Formatter Integration: Ensure the component is used wherever a `CalcInput` or `SummaryField` requires dynamic numeric feedback.

    3. *InteractiveLabel*
      - File Placement: Move the component to `components/propertyFields/InteractiveLabel.tsx`.
      - Apply @interactive-label-component.md.
      - Slider Styling: Implement cross-browser range slider styles in Tailwind utilities (using `&::-webkit-slider-thumb` and `&::-moz-range-thumb`) to ensure consistent 12px blue circles.
      - Transitions: Use `transition-all duration-300` for the switch between label and slider to prevent "jumps" in the layout.
      - Directionality: Explicitly set `dir="ltr"` for the slider container to ensure the range moves correctly from left to right even in your RTL app.
      - Outside Click Logic: Ensure the `useEffect` and `useRef` container logic is preserved to handle closing the slider automatically.

    4. *MetricCard*
      - File Placement: Move the component to `components/propertyFields/MetricCard.tsx`.
      - Apply @metric-card-component.md.
      - Use the cn utility to toggle scale-90 and p-2 based on the isScrolled prop.

    5. *MetricTile*
      - File Placement: Move the component to `components/propertyFields/MetricTile.tsx`.
      - Apply @metric-tile-component.md.
      - Use the `cn` utility to map `variant` colors (`blue`, `teal`, `slate`) to their respective background and text styles.

    6. *SuggestedNumberInput*
      - File Placement: Move the component to `components/propertyFields/SuggestedNumberInput.tsx`.
      - Apply @suggested-number-input-component.md.
      - Number Handling: Ensure `handleNumericChange` correctly uses `parseInt` and strips commas before calling `onChange`.
      - State Sync: Verify that `formatNumber` is used to display the value as a localized string in the UI.
      - External Utils: Strictly use formatting functions from `@services/formtaUtils.service.tsx`. Do not redefine `formatNumber` locally.
      - Conditional Rendering: Implement the logic to show/hide `RollbackButton` based on the comparison between `value` and `defaultValue`.
      - Layout: Confirm that suffix and rollback icons are properly aligned on the left (`left-3`) within the `StringInput` children slot.

    7. *CalcInput*
      - File Placement: Move the component to `components/propertyFields/CalcInput.tsx`.
      - Apply @calc-input-component.md.
      - Structure Check: Ensure it is implemented as a `div` (not an `input`) for better accessibility semantics of read-only data.
      - External Utils: Strictly use formatting functions from `@services/formtaUtils.service.tsx`. Do not redefine `formatNumber` or `formatCurrency` locally.
      - Styling: Match the height (54px) and use `bg-slate-50` for the background to keep the form's visual rhythm.
      - `errorAsTooltip`: string (optional)

    8. *EditableInput*
      - File Placement: Move the component to `components/propertyFields/EditableInput.tsx`.
      - Apply @editable-input-component.md.
      - Smart Label Integration: Ensure the logic for switching between a standard `div` label and `InteractiveLabel` is preserved.
      - Rollback UI: Verify that the `RollbackButton` is correctly nested within the `StringInput` (or its equivalent structure) using the `children` prop or absolute positioning.
      - Border Scaling: Use the Tailwind class `border-2` to highlight the interactive state.
      - Read-Only Logic: Confirm that `readOnly={!isEditable}` is correctly applied to the input element along with the `bg-slate-50/50` class.  
      - External Utils: Strictly use formatting functions from `@services/formtaUtils.service.tsx`. Do not redefine `formatNumber` locally.

    9. *AutoFIllInput*
      - File Placement: Move the component to `components/propertyFields/AutoFIllInput.tsx`.
      - Apply @auto-fill-input-component.md.
      - Formatting Logic: Replace local `formatNumber` with the imported function from `@services/utils.tsx`.
      - Numeric Sanitization: Ensure `handleNumericChange` correctly strips commas and handles empty strings by returning `0`.
      - Icon Implementation: Use the `RotateCcw` icon from `lucide-react`. Ensure it's correctly positioned `absolute` on the left.
      - Modification Check: Double-check the logic: `const isModified = value !== defaultValue;` to trigger the rollback button.

    10. *SegmentedControl*
      - File Placement: Move the component to `components/propertyFields/SegmentedControl.tsx`.
      - Apply @segmented-control-component.md.
      - UI Alignment: Force the container height to `54px` to match `StringInput` and `Dropdown`.
      - Segment Logic: Ensure `flex: 1` is applied to each button so segments are perfectly equal in width.
      - State Transitions: Use `transition-all duration-200` and `flex-1` for equal segment distribution.
      - Error Handling: Sync the red border and error text style with the rest of the form components.

    11. *FinancingStatus*
      - File Placement: Move the component to `components/propertyFields/FinancingStatus.tsx`.
      - Apply @financing-status-component.md.
      - Progress Logic: Ensure the bar width is calculated as `Math.min(100, (actual / max) * 100)%` and handled via inline style for the `width` property.
      - Transitions: Use Tailwind's `animate-pulse` utility conditionally via `cn` when in an error state.
      - Status Animation: Move the `animate-pulse` logic to a clean Tailwind utilities keyframe animation within the `.financing-status__badge--error` class.
      - Overlay: Confirm the `isCalculating` overlay correctly covers the component with the blur effect.

    12. *SummaryField*
      - File Placement: Move the component to `components/propertyFields/SummaryField.tsx`.
      - Apply @summary-field-component.md.
      - Tailwind utilities Optimization: Define a constant mapping object in the TSX (similar to MetricCard) to handle the 8 color variants using Tailwind classes.
      - Alignment Logic: Handle alignment via cn and the `justify-*` classes.
      - Hover Effects: Implement the `shadow-md` transition in Tailwind utilities to keep the component "snappy".
      - Utils Integration: Ensure `value` uses formatting from `@services/utils.tsx`.

    13. *AdditionalFundingSources*
      - File Placement: Move the component to `components/propertyFields/AdditionalFundingSources.tsx`.
      - Apply @additional-funding-sources-component.md.
      - Dependency Check: Ensure @checkbox-component.md is applied first so `Checkbox` is available.
      - Scrollbar Styling: Use Tailwind utility. `overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200` (or a custom utility in index.css).
      - Data Formatting: Ensure the `description` string inside the map correctly formats numbers using localized strings or the `formatNumber` utility.
      - Conditional Logic: Verify the tooltip logic correctly switches based on the `sources.length`.

    14. *AdditionalFundingSourcesEditor*
      - File Placement: Move the component to `components/propertyFields/AdditionalFundingSourcesEditor.tsx`.
      - Apply @additional-funding-sources-editor-component.md.
      - Input Sync: Ensure `StringInput` and `NumericInput` inside the loop are correctly receiving values and their respective labels are hidden on desktop (`labelClassName="md:hidden"`).
      - Responsive Layout: Use Tailwind arbitrary grid template. `md:grid-cols-[1.5fr_1fr_1fr_auto]`.
      - UUID Logic: Verify that `crypto.randomUUID()` is used for new entries to ensure stable React keys.
      - Button Styling: Apply the `border-dashed` and `border-2` styles to the "Add" button via Tailwind utilities to maintain the "placeholder" look.

    15. *InterestControl*
    - File Placement: Move the component to `components/propertyFields/InterestControl.tsx`.
    - Apply @interest-control-component.md.
    - UI Audit: Ensure the main value box is centered and uses `bg-slate-50/30 with h-12 sm:h-14`.
      - Apply the `RollbackButton` on the left side (`left-2`) using absolute positioning within the value box relative container.
      - Directionality: Explicitly set `dir="ltr"` on the range slider container and the input itself to ensure correct numeric progression.
    - Styling: Use Tailwind arbitrary values for the `input[type="range"]` thumb: `[&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-blue-600`.
      - Implement the `disabled` state by applying `opacity-60 grayscale-[0.2]` to the main container and `cursor-not-allowed` to the inputs.
    - Logic & Utils: Strictly use `formatPercent` from  @services/formtaUtils.service.tsx  for the main display and the min/max labels.
      - Ensure the `isModified` logic (`value !== defaultValue`) correctly controls the visibility of the `RollbackButton`.
      

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
### [2026-05-17] STOP-AND-ASK Gate — Pre-Flight Clarifying Questions

*AI says:*

After exploring the codebase, I found the following state before starting:
- All 14 components already exist in both `raw_from_ai_studio/components/propertyFields/` and `src/components/propertyFields/`.
- No `propertyFields` component currently uses the `cn` utility (all use template-literal string concatenation).
- Two services exist: `src/services/formatUtils.service.tsx` (the real one) and `src/services/utils.tsx` (a re-export barrel). Components currently import from `utils.tsx`.
- `MetricTile` component is listed in the plan (Step 5) but does **not** exist in either folder.
- The spec `@summary-field-component.md` is referenced but **not found** in the skills directory.

**I have 5 clarifying questions before I proceed:**

---

**Q1 — MetricTile (Step 5):**
The plan references a `MetricTile` component at `components/propertyFields/MetricTile.tsx`, but it does not exist in `raw_from_ai_studio` or `src`, and no `@metric-tile-component.md` spec was found in the skills folder. Should I:
- **(A)** Skip MetricTile for this session?
- **(B)** Create it from scratch — if so, please provide the design spec or a raw implementation to base it on.

> *Your answer:* (B) Implement MetricTile inside src/components/common/MetricTile.tsx following your established common library conventions.

Reasoning:
- Centralization over Fragmentation: Moving MetricTile to the common folder is the correct architectural choice. Since metric cards and summary tiles are global application indicators (often used across dashboards, profiles, and property pages), keeping it generic and shared prevents domain locking.
- Preserving Implementation Intent: We will not skip this module. Since it already exists as a component or placeholder in your common layer, we will refactor it to adhere strictly to your Tailwind utility-first configuration and handle its runtime style variations elegantly using your cn engine.

Final Instructions:
1. File Redirection: * Implement or overwrite src/components/common/MetricTile.tsx using the unified design specification above.
  - Update any consuming property layouts to import it via @components/common/MetricTile rather than the old propertyFields local workspace path.
2. Strict Utility Standardization:
  - Ensure all formatting pipelines within these 15 components explicitly drop local math helpers. Import tools like formatNumber, formatCurrency, and formatPercent directly from @services/formtaUtils.service.tsx or @services/utils.tsx.
  - Enforce dir="ltr" natively via Tailwind classes directly on interactive slider wrappers (InteractiveLabel and InterestControl) to keep slider thumb increments predictable regardless of application view RTL shifts.
3. Cross-Component Dependencies:
  - Ensure RollbackButton handles standard styling states natively and is cleanly mapped into SuggestedNumberInput, EditableInput, and AutoFIllInput to clear customized values back to their fallback defaults.

---

**Q2 — Scope: Delta fix vs. full rewrite:**
The `src/components/propertyFields/` files already exist and were partially refactored (e.g., `EditableInput`, `RollbackButton` look well-structured). The main gaps are:
  - No `cn` usage (template literals instead)
  - `AutoFIllInput` has inline rollback button code instead of using the `RollbackButton` component
  - Some components use deprecated local formatting helpers

Should I:
- **(A) Delta approach** — Read each existing `src/` file, compare against the spec, and only apply the missing changes?
- **(B) Full rewrite** — Rebuild each component from the raw version + spec, replacing `src/` entirely?

> *Your answer:* (A) Delta approach — Read each existing src/ file, compare against the spec, and target the specific gaps.

Reasoning:
- Preserving Existing Structural Work: Since components like EditableInput and RollbackButton are already well-structured and functioning within the active application lifecycle, a total rewrite (Option B) introduces severe regressions. It is highly inefficient to scrap working code only to rewrite identical component logic.
- Surgical Code Quality Injection: The delta approach acts as a precision refactoring layer. Claude will inspect the existing files to solve the identified compliance gaps: swapping out brittle template literals for the cn orchestration engine, modularizing the inline rollback layout inside AutoFillInput, and stripping local formatting duplication in favor of the centralized utility service.

Final Refactoring Target Instructions:
Claude must parse each existing component in src/components/propertyFields/ and execute these targeted technical upgrades:
1. Class Name Orchestration (cn Migration)
Identify all template literal string interpolations or rigid string conditions inside className attributes and replace them with the explicit cn(...) utility standard.
  - Before: className={flex rounded-3xl ${error ? 'border-red-500' : 'border-slate-200'}}
  - After: className={cn("flex rounded-3xl border", error ? "border-red-500" : "border-slate-200")}
2. Rollback Component Modularization
Open AutoFillInput.tsx and excise the inline, hardcoded RotateCcw button layout. Import and mount the newly standardized <RollbackButton /> component natively:
```TypeScript
{isModified && (
  <RollbackButton 
    onClick={handleRollback} 
    className="absolute left-3 top-1/2 -translate-y-1/2" 
  />
)}
```
3. Deprecated Formatter Elimination
Audit all formatting pipelines across the field suite. Delete any local mathematical sanitization, locally declared regex string expressions, or custom string pad tools. Force absolute utilization of the shared formatting ecosystem:
```TypeScript
// Replace local string hacking with the clean, imported utilities
import { formatNumber, formatCurrency, formatPercent } from '@services/formtaUtils.service';
```
Answer for Q2 — Refactor Execution Strategy
Decision: (A) Delta approach — Read each existing src/ file, compare against the spec, and target the specific gaps.

Reasoning:

Preserving Existing Structural Work: Since components like EditableInput and RollbackButton are already well-structured and functioning within the active application lifecycle, a total rewrite (Option B) introduces severe regressions. It is highly inefficient to scrap working code only to rewrite identical component logic.

Surgical Code Quality Injection: The delta approach acts as a precision refactoring layer. Claude will inspect the existing files to solve the identified compliance gaps: swapping out brittle template literals for the cn orchestration engine, modularizing the inline rollback layout inside AutoFillInput, and stripping local formatting duplication in favor of the centralized utility service.

Final Refactoring Target Instructions for Claude:
Claude must parse each existing component in src/components/propertyFields/ and execute these targeted technical upgrades:

1. Class Name Orchestration (cn Migration)
Identify all template literal string interpolations or rigid string conditions inside className attributes and replace them with the explicit cn(...) utility standard.

Before: className={flex rounded-3xl ${error ? 'border-red-500' : 'border-slate-200'}}

After: className={cn("flex rounded-3xl border", error ? "border-red-500" : "border-slate-200")}

2. Rollback Component Modularization
Open AutoFillInput.tsx and excise the inline, hardcoded RotateCcw button layout. Import and mount the newly standardized <RollbackButton /> component natively:
```TypeScript
{isModified && (
  <RollbackButton 
    onClick={handleRollback} 
    className="absolute left-3 top-1/2 -translate-y-1/2" 
  />
)}
```
3. Deprecated Formatter Elimination
Audit all formatting pipelines across the field suite. Delete any local mathematical sanitization, locally declared regex string expressions, or custom string pad tools. Force absolute utilization of the shared formatting ecosystem:

```TypeScript
// Replace local string hacking with the clean, imported utilities
import { formatNumber, formatCurrency, formatPercent } from '@services/formtaUtils.service';
```
4. Range Slider Consistency (dir="ltr")
Verify that both InteractiveLabel.tsx and InterestControl.tsx explicitly include the dir="ltr" property wrapper directly around their slider tracks to guarantee predictable input thumb increments when operating under the global RTL layout viewport.

---

**Q3 — Service import path:**
The plan references `@services/formtaUtils.service.tsx` (note: "formta" appears to be a typo for "format"). The actual file is `src/services/formatUtils.service.tsx`. Components currently import from `../../services/utils` (which is a re-export barrel). Should I:
- **(A)** Update all imports to point directly to `../../services/formatUtils.service` (the real source)?
- **(B)** Keep `../../services/utils` as the import path (it re-exports everything, so it works)?
- **(C)** Use the `@services/` path alias if it's configured in `tsconfig.json`?

> *Your answer:* (A) Update all imports to point directly to `../../services/formatUtils.service`

---

**Q4 — Missing `@summary-field-component.md` spec:**
The spec for `SummaryField` is referenced in the plan but does not exist in the skills directory. `SummaryField.tsx` already exists in `src/`. Should I:
- **(A)** Apply the general rules from the plan body (color variant map, `cn`, alignment, `shadow-md`) and use the existing code as the baseline — no spec needed?
- **(B)** Pause this component until you provide the spec?

> *Your answer:* (A) Proceed immediately using the newly created skill specification as the authoritative baseline for the Delta refactor.

Reasoning:
- Unblocked Pipeline: With the complete Markdown specification now established, the asset gap is fully resolved. Claude has all the constraints required to bring the existing code up to framework standards.
- Targeted Delta Fixes: Claude will look at the existing SummaryField.tsx in src/ and refactor it to replace raw template strings with the clean cn composition model, align the 8 variant styles according to the spec, and enforce strict layout rhythm boundaries.

Final Instructions:
1. Stitch with cn Helper:
Completely remove the string interpolation syntax from the container wrappers. Merge layout properties, variants, and dynamic alignment matrices strictly using the unified helper:

```TypeScript
const v = VARIANT_MAPS[variant] || VARIANT_MAPS.slate;

const wrapperClasses = cn(
  "flex flex-col gap-1.5 w-full text-right",
  className
);

const containerClasses = cn(
  "border rounded-xl flex items-center h-[54px] px-4 transition-all duration-300 hover:shadow-md shadow-none relative",
  v.bg,
  v.border,
  align === 'center' ? 'justify-center' : align === 'right' ? 'justify-start' : 'justify-end'
);
```
2. Typography Mapping & Colors:
Ensure the alignment variable (align) controls the layout color parameters cleanly. As specified in the design, when align="center", the text color must dynamically adapt to the variant style rule (v.text). If it's left or right aligned, it stays securely anchored to a crisp text-black font format.
3. Logical Spacing Properties:
Verify the conditional label offsets utilize layout flags (mr-1 vs ml-1) natively to keep structural alignment predictable across various viewport responsive break-points.

---

**Q5 — Batch vs. step-by-step review:**
There are 15 components to process. Should I:
- **(A)** Implement all 15 in one pass and report back when done?
- **(B)** Implement one component at a time, pause for your review, then continue?
- **(C)** Group them (e.g., primitives first: RollbackButton → AnimatedNumber → InteractiveLabel, then composites)?

> *Your answer:* (A) Implement all 15 in one pass and report back when done

---

**WAITING FOR YOUR ANSWERS. I will not generate any code until you respond above.**

---
### [2026-05-17] Implementation Complete — Delta Refactor Applied

*AI says:*

All 15 components have been implemented. TypeScript compilation passed with zero errors.

**Decisions applied from answers:**

| # | Decision |
|---|----------|
| Q1 | `MetricTile` implemented/updated in `src/components/common/MetricTile.tsx` with `cn` + `VARIANT_MAP` |
| Q2 | Delta approach — only targeted gaps fixed in each `src/` file |
| Q3 | All service imports updated to `../../services/formatUtils.service` directly |
| Q4 | `SummaryField` refactored using plan-body rules as the spec baseline |
| Q5 | All 15 implemented in one pass |

**Changes applied per component:**

1. **RollbackButton** — Added `cn`, converted `className` template literal to `cn(...)` composition.
2. **AnimatedNumber** — No changes. Already compliant: `useRef` for `startTime`/`requestRef`, correct easing math, no styling to migrate.
3. **InteractiveLabel** — Import updated to `formatUtils.service`. Added `cn`, converted container and trigger button `className` to `cn(...)`.
4. **MetricCard** — Added `cn`, extracted inline `variants` object to top-level `VARIANT_MAP` constant, converted all `className` template literals to `cn(...)`.
5. **MetricTile** (`common/`) — Added `cn`, extracted inline `variantClasses` to top-level `VARIANT_MAP` constant, converted `className` to `cn(...)`.
6. **SuggestedNumberInput** — Import updated to `formatUtils.service`. No conditional classNames (delegates all styling to `StringInput`).
7. **CalcInput** — Added `cn`, eliminated `variantClasses` string variable, merged variant conditions directly into `cn(...)` on the display `div`.
8. **EditableInput** — Added `cn`, converted all three conditional `className` blocks (`disabled`, `!isEditable`, outer wrapper) to `cn(...)`.
9. **AutoFIllInput** — Import updated to `formatUtils.service`. Removed inline `RotateCcw` button; replaced with `<RollbackButton>` component wrapped in positioned `div`.
10. **SegmentedControl** — Added `cn`, converted container border, button active/inactive states, and outer wrapper disabled state all to `cn(...)`.
11. **FinancingStatus** — Import updated to `formatUtils.service`. Added `cn`, converted all conditional `className` expressions to `cn(...)`. `animate-pulse` is now composable via `cn` on the error badge.
12. **SummaryField** — Added `cn`, extracted `variants` object to top-level `VARIANT_MAP` constant, converted all three `className` blocks (wrapper, label, container, value) to `cn(...)`.
13. **AdditionalFundingSources** — Added `cn`, added `formatNumber` import from `formatUtils.service`, replaced `source.amount.toLocaleString()` and `source.monthlyRepayment` with `formatNumber(...)`, replaced `custom-scrollbar` with `scrollbar-thin scrollbar-thumb-slate-200`.
14. **AdditionalFundingSourcesEditor** — Added `cn`, converted the row `className` template literal to a multi-line `cn(...)` call.
15. **InterestControl** — Import updated to `formatUtils.service`. Added `cn`, converted main container, value box, and range input `className` blocks to `cn(...)` (including Tailwind arbitrary selectors for thumb styling).