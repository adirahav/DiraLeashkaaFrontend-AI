# Plan: Property Page - Extraction & Refactor

## Task Overview
Build a high-fidelity, data-intensive Property Analysis Page. The page serves as a "Smart Calculator" that orchestrates multi-stage form inputs, real-time financial modeling, and responsive result visualization. It must handle complex state synchronization between local inputs and the server-side analysis engine, including a guided user tour and a specialized mobile result mode.   

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @property-api.yaml
    - Individual Specs: 
        - @property-page.md (The Interface)
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: State Initialization & Persistence (Zustand & API)**
- *State Management*
    - Use `useStore` to access the `PropertySlice`.
    - Implement `currentProperty` state based on the `PropertyState` interface.

- *Initialization Flow*
    - On `useEffect` (mount): Check for `propertyUUID` in URL params.
    - If UUID exists: Fetch property data via `propertyService.getById`.
    - If no UUID: Initialize a clean state. Create a new entry on the server upon the first valid input change.

- *Auto-Save Logic*
    - Implement a debounced `useEffect` (500ms) that calls `propertyService.save` whenever a field in `currentProperty` changes.

- *Formatting Logic*
    - Use `utilService.formatCurrency` for Price, Equity, and Monthly Repayments.
    - Use `utilService.formatPercent` for Yields and Interest rates.
    - Use `utilService.formatNumber` for general numeric displays (like square meters or index points).

Ensure updatedByField is tracked to restore focus/cursor position after the async update cycles.

**Step 2: Refactor & Component Composition (The Evaluation Engine)**
- Apply the structure from @property-page.md. 

- *Sticky Dashboard Header*
    - Implement a sticky wrapper that transitions based on scroll (`isScrolled`).
    - Integrate `PropertyMetrics` to show real-time Yield, LTV, and Repayment.

- *Form Sections*
    - Part 1: Basic Info: Use `PropertyForm` for City, Price, Equity, and Income.
    - Part 2: Interests: Use `PropertyInterests` (collapsible section).
    - Logic: Map inputs to the `PropertyState` fields. Use `utilService.getPhrase` for all labels.

- *Media Handling*
    - Integrate `PropertyMedia`. Handle image uploads/removals via `propertyService.uploadMedia`.

**Step 3: Financial Calculation & Validation**
- *Validation Guard*
    - Calculate `isPart1Valid` based on mandatory fields (apartmentType, propertyPrice, equity, income).
    - If invalid: Show the "Missing Data" `overlay` with `iconMissingData`.

- *Calculated Data*
    - When `isCalculating` is true (during debounce/API wait): Show the global `Overlay` with the `animCalculating` Lottie animation.
    - Ensure `calcYieldForecast` and `calcAmortizationSchedule` from the server are passed to the results components.

**Step 4: Responsive Analysis Mode (Mobile UX)**
- *The "Results" Switch*
    - Implement `viewMode` state (`form` | `results`).
    - *Form View: Standard vertical scroll.
    - *Results View*: Apply `.simulated-landscape-mobile`. Hide the main form and show a 3-tab navigation (Yield, Amortization, Graph).

- *Navigation*
    - Implement a "Back" button in the results header to return to `viewMode: 'form'`.
    - Sync the `activeResultTab` state between the buttons and the rendered component.

**Step 5: Styling & Infrastructure (Tailwind)**
- *Dashboard*: Styles for the sticky header with backdrop-blur.

- *Results Layout*: Define the landscape simulation for mobile, ensuring charts utilize 100% of the available width/height.

- *Focus Management*: Ensure styles don't "flicker" when inputs are momentarily disabled during auto-save.

- RTL: Ensure proper alignment for Hebrew labels and currency symbols.

## State Management Check (Zustand Slices)
- *Property Slice*: 
    - `setField(name, value)`: Updates local state and triggers debounce.
    - `fetchProperty(uuid)`: Handles async loading from API.

- *App Slice*: - Toggle `isLoading` to trigger global calculation overlays.


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
### [2026-05-21] Pre-Flight Clarifying Questions

*AI says:*

After reading the current `src/pages/PropertyPage.tsx`, the existing store slices, `property.types.ts`, the API spec, and the raw AI Studio source, I have identified 5 decision points that will determine the scope and architecture of this implementation. Answers are required before any code is written.

---

**Q1 — State location: Zustand PropertySlice vs. local `useState`**

The plan says to "Use `useStore` to access the `PropertySlice`" but no `PropertySlice` exists yet. The current `PropertyPage.tsx` manages all property state via ~30 individual `useState` calls. Migrating them into a Zustand slice is a significant architectural change with real risk.

Two options:

- **Option A (Full Slice):** Create `src/store/slices/property.slice.ts` holding the full `currentProperty` object + `setField` / `fetchProperty` actions. All local `useState` calls are replaced.
- **Option B (API-only):** Keep local `useState` as-is. Add only the API save/load logic (on top of existing state), using the store only for the already-wired `showTour`, `isResultsMode`, etc.

Which approach do you want?

> *Your answer:* (A - Full Slice) is the absolute best approach and the most responsible decision for long-term project stability. Managing ~30 individual useState hooks inside a single core page element is an anti-pattern that creates spaghetti data flow, unexpected race conditions, and heavy re-render cycles during auto-saves.

Architectural Breakdown: Why Option A is Necessary
1. State Synchronicity & Debouncing: With ~30 individual useState hooks, setting up a unified, debounced auto-save pipeline requires complex dependency arrays inside useEffect. Centralizing the state into a structured currentProperty object inside a Zustand slice allows a single, clean observer to look at the store and fire the debounced propertyService.save API call safely.
2. Cursor Focus Preservation (updatedByField): When asynchronous auto-saves complete and refresh the calculation matrix, local hooks often trigger component re-mounts that steal focus from the input the user is currently typing in. A Zustand slice cleanly updates data pointers behind the scenes without breaking the HTML DOM cursor position.
3. Clean Presentation Components: By moving input state management into a store, child components like PropertyForm and PropertyInterests don't need to be drowned in drill-down props (setCity, setPrice, setEquity, etc.). They can cleanly consume their values and fire updates via a unified setField(name, value) action.

---

**Q2 — Server-driven vs. client-side financial calculations**

The plan says "Ensure `calcYieldForecast` and `calcAmortizationSchedule` from the server are passed to the results components." Currently both are computed client-side via `useMemo`. The API spec confirms the server re-calculates after every field change.

Two options:

- **Option A (Server-driven):** After each debounced save (`PUT /api/property`), the server response returns `calcYieldForecast` and `calcAmortizationSchedule`; the client renders these. All client-side `useMemo` forecast / amortization logic is removed.
- **Option B (Hybrid / Optimistic):** Keep client-side `useMemo` as the live preview (fast, no flicker). Use server data only as a fallback or for validation. Both coexist.

Is the backend ready to return these calculated fields on every PUT? Which option?

> *Your answer:* (A - Server-driven) is the correct and architecturally sound pattern to follow. The system should rely entirely on the backend as the single source of truth for all complex financial modeling, completely removing the client-side useMemo calculation code.

Architectural Reasoning: Why Server-Driven is Essential
1. Eliminating Logic Duplication (Single Source of Truth): Financial models involving 10-year yield projections and complex mortgage amortization schedules require strict mathematical precision. Maintaining two parallel implementations of these formulas (one in the backend engine and an optimistic preview layer in frontend useMemo hooks) is a massive technical debt trap. Even a tiny rounding mismatch between the frontend and backend will cause numbers to jump or flicker when the async auto-save settles, leading to a broken user experience.
2. Deterministic Layout States: By waiting for the server's authoritative response payload, we guarantee that the charts (YieldChart), tables (PropertyAmortization), and summary metrics (PropertyMetrics) are perfectly synchronized with the exact data saved on the server database.
3. Background Sync Experience: Our 500ms auto-save debounce pipeline combined with the layout-isolated absolute loading blocker ensures that server processing overhead is masked elegantly. The user gets a smooth, predictable calculation cycle without UI jitter.

---

**Q3 — Initial state / `FINANCIAL_DEFAULTS` source**

Currently `FINANCIAL_DEFAULTS` is hardcoded in the page (equity: 1410453, income: 40001, etc.). The `User` interface already carries `equity`, `incomes`, `commitments`, and `additionalFundingSources`. The plan says "If no UUID: Initialize a clean state."

Two options:

- **Option A (From user profile):** Seed the initial property state from `loggedinUser` (equity → `calcEquity`, incomes → `income`, etc.). `additionalFundingSources` comes from `loggedinUser.additionalFundingSources`.
- **Option B (Empty defaults):** Initialize all numeric fields to `0` / empty. The user fills them in manually. No seeding from the user profile.

Which behaviour is intended?

> *Your answer:* (A - From user profile) is the intended behavior. Seeding the initial clean state with the logged-in user's profile data provides a personalized experience, serving as a smart, contextual jumping-off point instead of forcing the user to re-type their baseline financial profile from scratch every time they open a new property analysis session.

UX & Engineering Reasoning
1. Contextual Onboarding: In property investment workflows, an individual’s available equity and monthly household income are typically fixed constraints during a single session. Seeding these fields immediately from the active user object eliminates repetitive form filling, allowing the user to focus strictly on changing property-specific variables like City and Price.
2. Explicit Resets Over Empty States: Setting fields to a hard 0 (Option B) forces the user to manually enter universal data they already submitted during their profile registration. If a user truly wants a blank calculation matrix, they can zero out fields dynamically, but starting with their registered background provides an elite, modern software touch.
3. Graceful Fallbacks: If the logged-in user profile lacks these financial parameters, the system will gracefully fallback to an initialized zero-state (0 or an empty array), ensuring compilation handles safely either way.

---

**Q4 — `PropertyState` spec vs. existing `PropertyData` type**

The plan's `PropertyState` interface (fields: `propertyPrice`, `equity`, `income`, `mortgagePeriod`, …) differs from the existing `PropertyData` type in `property.types.ts` (fields: `price`, `calcEquity`, `defaultIncomes`, `calcMortgagePeriod`, …). Both are in use today.

Two options:

- **Option A (Keep `PropertyData`):** `currentProperty` is typed as `PropertyData`. The plan spec's `PropertyState` is treated as a reference only; actual code follows the existing type contract.
- **Option B (Migrate to `PropertyState`):** Create the new `PropertyState` interface exactly as specified and update all usages throughout the codebase.

Which type should own `currentProperty`?

> *Your answer:* (A) Keep PropertyData as the absolute structural type contract. Treat the plan's PropertyState naming conventions as conceptual guidelines; actual production execution must strictly follow your existing, verified codebase contract.

Reasoning:
- Preventing System Breaking Changes: Forcing a migration from established production fields (price, calcEquity, defaultIncomes) to raw spec variations (propertyPrice, equity, income) across an active application creates a massive downstream refactoring trail. It risks breaking calculations, crashing database schema mappings, and causing validation errors.
- Preserving Technical Integrity: Keeping PropertyData ensures the new Zustand slice instantly integrates with existing calculation engines, serializers, and API services without requiring invasive code alterations.

---

**Q5 — Tour trigger: `tourCompletedTime` vs. `showTour` in store**

The plan says "If `loggedinUserState.tourCompletedTime` is null, initialize the `PropertyTour`." But the current `User` interface has no `tourCompletedTime` field, and the `AppSlice` already has a `showTour` boolean that drives the tour today.

Two options:

- **Option A (Add `tourCompletedTime` to `User`):** Add the field to the `User` interface and `AuthSlice`. On mount, set `showTour = true` if `loggedinUser.tourCompletedTime === null`. On tour completion, call the API to persist the timestamp.
- **Option B (Keep existing `showTour` flag):** The current `AppSlice.showTour` mechanism is sufficient. No user model changes are needed for this task.

Which approach?

> *Your answer:* (B - Keep existing showTour flag) is the most practical and efficient approach. The current AppSlice.showTour flag is already implemented and operating correctly within your production app, so there is no need to engineer a new user profile field or database migration just for this visual component task.

Architectural Reasoning
- Avoiding Database Bloat: Forcing an immediate backend schema extension (tourCompletedTime) and refactoring your authentication session models (User, AuthSlice) introduces unnecessary technical debt for a purely front-end presentation feature.
- Fidelity to Active Store Infrastructure: Since your layout system already responds directly to the AppSlice.showTour state flag, forcing a parallel onboarding observer path breaks the rule of a single source of truth. Keeping the current boolean flow isolates your components cleanly and prevents session sync bugs.

---

### [2026-05-21] Decisions Confirmed — Implementation Begins

| # | Decision |
|---|---------|
| Q1 | **Option A — Full PropertySlice.** Create `property.slice.ts`; replace all ~30 `useState` calls with `currentProperty: PropertyData \| null` + `setField / setFields / fetchProperty / initProperty`. |
| Q2 | **Option A — Server-driven.** Remove client-side `useMemo` forecast & amortization. Server returns `calcYieldForecast` and `calcAmortizationSchedule` on every PUT response. |
| Q3 | **Option A — Seed from user profile.** On new property: `calcEquity ← loggedinUser.equity`, `defaultIncomes ← loggedinUser.incomes`, `defaultCommitments ← loggedinUser.commitments`, `additionalFundingSources ← loggedinUser.additionalFundingSources` (mapped to `PropertyFundingSource`). Fallback to `0` / `[]` if profile fields are absent. |
| Q4 | **Option A — Keep `PropertyData`.** `currentProperty` is typed as `PropertyData`. The plan's `PropertyState` naming is a conceptual reference only. No field renames; existing type contract preserved. |
| Q5 | **Option B — Keep `AppSlice.showTour`.** No `tourCompletedTime` added to `User` or `AuthSlice`. Tour is driven exclusively by the existing `showTour` boolean. |

**Implementation scope:**
- `src/types/property.types.ts` — add `uuid?`, `updatedByField?`, `media?`, `calcYieldForecast?`, `calcAmortizationSchedule?`
- `src/services/property.service.ts` — new: `getById`, `create`, `save`
- `src/store/slices/property.slice.ts` — new: `currentProperty`, `isCalculating`, `setField`, `setFields`, `setCurrentProperty`, `initProperty`, `setCalculating`
- `src/store/store.ts` — add `PropertySlice` to `RootState` (not persisted)
- `src/pages/PropertyPage.tsx` — remove `useState`, add `useParams` + auth guard, debounced auto-save, server-driven results