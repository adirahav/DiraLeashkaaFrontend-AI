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
    
*AI says:*