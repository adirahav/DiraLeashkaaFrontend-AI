# Plan: MaxPriceCalculatorPage - Implementation

## Task Overview
Build the MaxPriceCalculator page, leveraging the PropertyForm in a specialized "result-mode." This page must act as a controller that handles security (Guards), fetches initial calculator data, and manages real-time updates through a dedicated calculator API.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @property-form-component.md
    - @phrase-usage.md
    - @calculator-api.yaml
    - Individual Specs: 
        - @max-price-calculator-page.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Guard & Auth Logic (The Entrance)**
- *Authorization Check:* - Use `useStore` to check `loggedinUser`. If null, `Maps('/')`.

- *Calculator Validation:* - Extract `uuid` from URL params.
    - On mount, trigger GET calculator/{uuid}.
    - Logic: If response is `!isActive` or `isComingSoon`, or permission is denied, `Maps('/')`.

- *Loading State:* Show a global loader until the validation and initial data fetch are complete.

**Step 2: Data Orchestration (API Integration)**
- *Initial Data Fetch:*
    - Call `GET calculator/maxPrice` to retrieve the initial `property` object (specifically for the max-price scenario).

- *Update Handler:*
    - Implement an `updateCalculator` function.
    - This function must call `PUT calculator/maxPrice` with the changed field.
    - *Note:* This bypasses the standard property store and uses the calculator's real-time engine.
    - On response, update the local `property` state to reflect new calculations.

**Step 3: Refactor & UI Composition (Layout)**
- Apply the structure from @max-price-calculator-page.md. 

- *Header:* - Render `SectionHeader` with `calculator_title_max_price` and the `Calculator` icon.

- *The "Result" Metric:* - Implement the `MetricCard` at the top.
    - Bind it to `property.price`.
    - Apply `variant="emerald"` and the `formatCurrency` formatter.

- *Form Configuration:* - Render `PropertyForm` using the specific calculator flags:
    - `hideLocationFields`, `hidePropertyPrice`, `hideAdditionalInfo`, `hideMortgageRepayment` set to `true`.
    - `isCompact={true}` to strip borders for a cleaner look.
    - `section1GridClassName="lg:grid-cols-4"`.

**Step 4: User Experience & Polish**
- *Calculating Overlay:* - Ensure the `isCalculating` flag from the `App Slice` is toggled during the `PUT` request to trigger the form's backdrop-blur.

- *Error Resilience:* - Wrap API calls in a try-catch that redirects to `/home` on critical failure to prevent the user from seeing a broken UI.

**Step 5: Styling (Tailwind)**
- *Layout:* Focus on the "Result Banner" styling to make the maximum price stand out.

- *Responsive:* Ensure the sticky behavior of the `MetricCard` on mobile for constant visibility of the result.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Toggle `isCalculating` (or `isLoading`) during `GET` and `PUT` requests to trigger UI overlays.

- *Auth Slice:* Ensure `loggedinUser` is available for the Guard logic and default values (Equity/Income).

- *Selectors:* Strictly use atomic selectors (e.g., `state => state.isCalculating`) via `useStore` to ensure optimized re-renders.


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