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

---
### [2026-05-27] Pre-Flight Clarifying Questions

*AI says:*

After reviewing the existing codebase (`MaxPriceCalculatorPage.tsx`, `app.slice.ts`, `CalculatorsPage.tsx`, `App.tsx`, `PropertyForm` spec, `calculator-api.yaml`), I have the following blocking questions before writing any code:

---

**Q1 — Route & UUID (Blocking for Step 1)**

The plan says: *"Extract `uuid` from URL params → trigger `GET calculator/{uuid}`."*

But the current route is `/calculators/max-price` (no UUID param), and `CalculatorsPage` has the UUID **hardcoded** in its local array (`'42e67c8d-0768-4ab4-a243-0789220a4d7b'`). It does not pass the UUID to the next page.

**Which approach should I use?**
- **Option A** — Change the route to `/calculators/max-price/:uuid` and update `CalculatorsPage` to navigate with the UUID.
- **Option B** — Keep `/calculators/max-price` and pass the UUID as a query param (e.g., `?uuid=42e67c8d-...`), updating `CalculatorsPage` accordingly.
- **Option C** — Hardcode the max-price UUID inside `MaxPriceCalculatorPage` itself and skip extracting it from the URL (simplest, but deviates from the spec).

> *Preference / decision:* Ignore the URL UUID for the MaxPriceCalculatorPage. Use the calculator Type (MAX_PRICE) and the authenticated user context instead.

Context: The hardcoded UUID in the frontend was a placeholder. The backend identifies the specific calculator settings and user data based on the type MAX_PRICE. Once the session is established, the backend handles the persistence.

Implementation Directive:
1. Refined Guard Logic (Step 1):
    - Route: Use /calculators/max-price (no dynamic UUID param needed).
    - Validation: Instead of GET calculator/{uuid}, call GET calculator/maxPrice. The backend will use the loggedinUser session/token to identify the correct calculator state.
    - Logic: If the user is not logged in, redirect to /. If the initial fetch fails (404 or unauthorized), redirect to /home.
2. API Orchestration (Step 2):
    -Payloads: All subsequent PUT updates should target the /calculator/maxPrice endpoint.
    - Context: The backend is responsible for linking this request to the specific user's MAX_PRICE calculator instance.
    - Response: Expect the API to return the fully updated property object, which the page will then set into local state to refresh the UI.
3. UI Updates:
    - Remove any logic that attempts to parse a uuid from useParams().
    - The page header and metrics should reflect the data returned from the GET calculator/maxPrice call.

---

**Q2 — `isCalculating` vs `isLoading` in App Slice (Blocking for Steps 2 & 4)**

The plan references toggling `isCalculating` from the App Slice. But `app.slice.ts` currently only has `isLoading` — there is **no `isCalculating`** field.

**Which approach should I use?**
- **Option A** — Add a new `isCalculating: boolean` + `setIsCalculating` to `app.slice.ts`. (Matches the spec exactly, keeps the two states separate.)
- **Option B** — Reuse the existing `isLoading` / `setIsLoading` for both the initial load and the real-time PUT overlay. (Simpler, no slice changes needed.)
- **Option C** — Keep `isCalculating` as **local component state** only inside `MaxPriceCalculatorPage` (consistent with how `PropertyPage` currently manages it).

> *Preference / decision:* (C) Keep isCalculating as local component state within MaxPriceCalculatorPage.

Implementation Steps:
1. Local State: Initialize const [isCalculating, setIsCalculating] = useState(false) inside the MaxPriceCalculatorPage component.
2. API Hook:
    - Set setIsCalculating(true) immediately before the PUT calculator/maxPrice call.
    - Set setIsCalculating(false) in the finally block of the request.
3. UI Feedback:
    - Pass the isCalculating prop to the PropertyForm.
    - The PropertyForm should use this to trigger its internal backdrop-blur/loading overlay.
4. Initial Load vs. Update:
    - Continue using the global isLoading from the App Slice for the initial GET fetch (Step 1) to show the global page loader.
    - Use the local isCalculating only for the real-time updates (Step 2).

---

**Q3 — `PropertyForm` Interface: Object vs. Individual Props (Blocking for Step 3)**

The plan spec shows a clean `property={property}` single-object API for `PropertyForm`. But the **current `PropertyForm` component** (used in `PropertyPage`) accepts ~50 individual props (`equity`, `setEquity`, `incomes`, `setIncomes`, etc.) — there is no `property` prop today.

**Which approach should I use?**
- **Option A** — Refactor `PropertyForm` to accept a `property` object + a single `onUpdate(field, value)` callback, replacing all individual props. (Matches spec, cleaner, but requires updating `PropertyPage` too.)
- **Option B** — Keep `PropertyForm` as-is with individual props and adapt `MaxPriceCalculatorPage` to unpack the server `property` response into those individual props. (No changes to `PropertyForm` or `PropertyPage`.)

> *Preference / decision:* (B) Keep `PropertyForm` as-is with individual props and adapt `MaxPriceCalculatorPage` to unpack the server `property` response into those individual props. (No changes to `PropertyForm` or `PropertyPage`.)

---

**Q4 — Backend Readiness for `GET`/`PUT calculator/maxPrice` (Blocking for Step 2)**

The plan assumes `GET calculator/maxPrice` returns a `property`-shaped object and `PUT calculator/maxPrice` returns updated calculations.

**Is the backend API live and testable today?**
- **Yes** — I can wire up the real API calls and the page will be fully functional.
- **No / Not yet** — I should build the page structure with a mock service or stub the calls so the UI is complete but tolerates missing backend.

> *Preference / decision:* Yes, ypu can wire up the real API calls and the page will be fully functional.

---

**Q5 — `calculator.service.ts` (Blocking for Step 2)**

No `calculator.service.ts` exists in `src/services/`. The plan lists it in the file structure.

**Should I create it as part of this task?**
- **Yes** — Create `calculator.service.ts` with `getCalculator(uuid)`, `getMaxPrice()`, and `updateMaxPrice(fieldName, fieldValue)` methods, following the same HTTP pattern as `property.service.ts`.
- **No** — Inline the API calls directly in `MaxPriceCalculatorPage` for now.

> *Preference / decision:* yes

---

*Waiting for explicit approval and answers before proceeding to any code generation.*

---
### [2026-05-27] Decisions Summary & Implementation Green Light

*AI says:*

Answers received. Decisions locked:

| # | Decision |
|---|----------|
| Q1 | No UUID. Call `GET calculator/maxPrice`. Redirect `/` if not logged in, `/home` on fetch failure. |
| Q2 | `isCalculating` = local state. `isLoading` (global) for initial GET only. |
| Q3 | Keep `PropertyForm` individual props. Unpack server `property` response on the page. |
| Q4 | Backend is live — wire real API calls. |
| Q5 | Create `src/services/calculator.service.ts` with `getMaxPrice()` and `updateMaxPrice(field, value)`. |

*Proceeding to implementation.*