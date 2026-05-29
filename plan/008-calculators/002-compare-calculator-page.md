# Plan: CompareCalculatorPage - Implementation

## Task Overview
Build the CompareCalculator page, a multi-property controller that synchronizes multiple PropertyForm instances. It must handle authorization, dynamic property hydration based on the comparison store, and manage a horizontal scrolling interface for side-by-side analysis.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @property-form-component.md
    - @phrase-usage.md
    - @calculator-api.yaml
    - Individual Specs: 
        - @compare-calculator-page.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Guard & Auth Logic (The Entrance)**
- *Authorization Check:* Use `useStore` to check `loggedinUser`. If null, `Maps('/')`.

- *Calculator Validation:* - Extract `uuid` from URL params.
    - On mount, trigger `GET calculator/{uuid}`.
    - Logic: If response is `!isActive`, `isComingSoon`, or permission is denied, `Maps('/')`.

- *Initial Comparison Fetch:* Call `GET calculator/compare` to retrieve the list of selected property UUIDs.

**Step 2: Data Orchestration (Multi-Property Sync)**
- *Hydration:* - Implement a `fetchComparedProperties` function.
    - For each UUID, call `GET property/{propertyUUID}?calcYields=true`.
    - Update the local `properties` array with the full objects.

- *Real-time Update Handler:*
    - Implement an `updatePropertyField` function.
    - Trigger `PUT property/` for the specific asset.
    - On success, update only that specific index in the local `properties` state to maintain UI sync across the grid.

- *Filter Integration:* - Use `PUT calculator/compare` to add/remove properties.
    - Re-trigger the hydration flow on every change to the selection list.

**Step 3: Refactor & UI Composition (Layout & Scroll)**
- Apply the structure from @compare-calculator-page.md. 

- *Header:* Render `ScreenHeader` using `calculator_compare_title` and `calculator_compare_subtitle`.

- *Actions Area:* Render the "Property Selection UI" (for adding/removing properties).
    - Render a "Reset" button to clear the comparison.

- *Comparison Grid:*
    - Map through the `properties` array to render multiple `PropertyForm` instances side-by-side.
    - Scroll Controls: Implement `ScrollArrowRightIcon` and `ScrollArrowLeftIcon`.
    - Logic: Use a `ref` on the container to calculate `scrollLeft` and toggle arrow visibility based on overflow.

**Step 4: User Experience & Polish**
- *Empty State:* If `properties.length === 0`, show the `chooseApartments` illustration with the `calculator_compare_no_apartments` phrase.

- *Calculating Overlay:* Toggle `showOverlay` during all `GET` and `PUT` operations to prevent mid-calculation inputs.

- *Scroll UX:* Ensure `scrollBy` uses `{ behavior: 'smooth' }` and handle RTL direction correctly (scrolling "left" to go forward in Hebrew).

**Step 5: Styling (Tailwind)**
- *Grid Layout:* Use `display: flex` or `grid-flow: column` for the main container to ensure forms stay in a single row.

- *Responsive:* Ensure the `main-content` container allows native touch scrolling on mobile while using the arrow buttons on desktop.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Use `isCalculating` / `isLoading` for global overlays.

- *Property/Compare Slice:* Track the current list of compared UUIDs to ensure the filter stays in sync with the displayed forms.

- *Selectors:* Use atomic selectors for `loggedinUser` and `comparedUUIDs` to minimize unnecessary re-renders of the entire grid.


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

After reviewing `CompareCalculatorPage.tsx` (current mock), `MaxPriceCalculatorPage.tsx` (live reference), `calculator.service.ts`, `property.service.ts`, `PropertyForm.tsx` props interface, `calculator-api.yaml`, `store/store.ts`, and the `compare-calculator-page.md` spec, I have the following blocking questions before writing any code:

---

**Q1 — Route & UUID guard (Blocking for Step 1)**

The plan says: *"Extract `uuid` from URL params → trigger `GET calculator/{uuid}`."*

But `CalculatorsPage` navigates to `/calculators/compare` with no UUID param. The compare UUID (`265de569-...`) lives only in the `CalculatorsPage` hardcoded array and is never passed forward.

The max-price plan resolved this identically (Q1 there): skip the UUID-based guard, call the type-specific endpoint directly.

**Which approach should I use?**
- **Option A** — Skip `GET calculator/{uuid}`. Guard only with `loggedinUser` check. Call `GET calculator/compare` directly on mount; redirect to `/home` on failure.
- **Option B** — Change the route to `/calculators/compare/:uuid` and update `CalculatorsPage` to navigate with the UUID, then call `GET calculator/{uuid}` for validation before loading compare data.

> *Preference / decision:*  (A) — Skip `GET calculator/{uuid}`. Guard only with `loggedinUser` check. Call `GET calculator/compare` directly on mount; redirect to `/home` on failure.

---

**Q2 — `GET calculator/compare` response shape (Blocking for Step 2)**

The API doc describes the response as *"Object containing all properties and selected UUIDs for comparison"* — this is ambiguous.

**Does the response include:**
- **Option A** — Both the full available properties list (all user properties, for the selection checkbox panel) **and** the currently selected UUID list, so no separate `GET property/{uuid}?calcYields=true` hydration calls are needed?
- **Option B** — Only the selected UUID list; the page must then hydrate each UUID individually with `GET property/{propertyUUID}?calcYields=true`.
- **Option C** — The full property objects for selected properties only, but the checkbox panel must separately call the property list from another endpoint.

> *Preference / decision:* (C) The GET calculator/compare call returns the full property objects for the selected properties only. The list of all available properties for the selection panel should be pulled from the existing Property Store.

Reasoning:
- Performance: Hydrating each property individually (Option B) creates a "waterfall" of network requests ($N$ requests for $N$ properties), which slows down the initial load of the comparison table.
- Data Integrity: By returning the full objects (including calcYields) for the compared items in one go, the backend ensures all calculations are synchronized.
- State Management: The "Selection UI" (the checkbox panel to add/remove properties) should use the existing properties already available in the homeState.properties (Zustand), avoiding redundant data fetching.

Implementation Directive:
1. Primary Fetch (Step 1 & 2): * Call GET calculator/compare.
    - Map the response directly to the local properties state. This array will contain the full objects needed for the side-by-side PropertyForm instances.
2. Selection UI (The Filter):
    - Use the properties from the global Property Store to populate the selection list (the "add/remove" panel).
    - When a property is toggled, call PUT calculator/compare with the new list of UUIDs.
3. Refresh Flow:
    - On a successful PUT (adding/removing), re-trigger the GET calculator/compare call to get the updated set of full objects.
4. Real-time Updates (Step 2):
    - When a specific field is changed in one of the forms, call PUT property/.
    - Instead of re-fetching the whole comparison, update that specific property in the local array using the response from the PUT to keep the UI snappy.

---

**Q3 — `PUT calculator/compare` payload: `propertiesIds` vs `uuid` (Blocking for Step 2)**

The API spec payload is `{ propertiesIds: string[] }` — the field name suggests MongoDB `_id` values. But `PropertyData` only has a `uuid` field.

**Which identifier should I send?**
- **Option A** — Use `property.uuid` (the UUID field already on `PropertyData`).
- **Option B** — The backend `propertiesIds` refers to MongoDB `_id`; I should use a different field (e.g., `property._id` or `property.id`) — if so, what is the field name in `PropertyData`?

> *Preference / decision:* (A) — Use `property.uuid` (the UUID field already on `PropertyData`).

---

**Q4 — `compare.slice.ts` (Blocking for Step 2 / State Management)**

The plan calls for a new Zustand `compare.slice.ts` to track `comparedUUIDs`. The backend is the source of truth via `GET calculator/compare`.

**Is a persisted Zustand slice truly needed, or is local component state sufficient?**
- **Option A** — Create `compare.slice.ts` with `comparedUUIDs: string[]` + setters, registered in `store.ts`. Use it so cross-page navigation preserves selected state without a refetch.
- **Option B** — Keep `comparedUUIDs` as local state only inside `CompareCalculatorPage`. The backend is always refetched on mount, so persistence isn't needed.

> *Preference / decision:* (B) Keep comparedUUIDs as local state inside CompareCalculatorPage.

Reasoning:
Since the backend acts as the single source of truth and we are refetching the comparison data via GET calculator/compare every time the page mounts, a global Zustand slice adds unnecessary complexity. Keeping the state local prevents "stale" data from being displayed if the user logs in from a different device or if the database changes between sessions. If persistence across navigation is required, the backend already handles it.

Implementation Directive:
Claude will simplify the state management for the comparison view:

1. Local State Orchestration:
- Define const [comparedProperties, setComparedProperties] = useState<Property[]>([]); inside the page.
- Define const [isLoading, setIsLoading] = useState(true); to handle the initial hydration.
2. Mount Logic:
- On useEffect (mount), call GET calculator/compare.
- Store the resulting full property objects in comparedProperties.
3. Syncing with Selection UI:
- The "Add/Remove" panel will use the list of IDs from comparedProperties.map(p => p.uuid) to determine which checkboxes are checked.
- When a user toggles a property, trigger the PUT calculator/compare call, and on success, refresh the local comparedProperties state.
4. Real-Time Form Updates:
- When an individual PropertyForm triggers an update, perform the PUT property/ call.
- Update the specific item in the comparedProperties array locally to reflect the new calculations immediately.

---

**Q5 — `property.service.ts` `getById` + `calcYields` (Blocking for Step 2)**

The plan says: *"For each UUID, call `GET property/{propertyUUID}?calcYields=true`."*

The current `propertyService.getById(uuid)` hits `/property/{uuid}` with no query params.

**How should I add `calcYields=true` support?**
- **Option A** — Add an optional `options?: { calcYields?: boolean }` parameter to the existing `getById` function.
- **Option B** — Create a new `getByIdWithYields(uuid)` method in `property.service.ts` that always appends `?calcYields=true`.
- **Option C** — `calcYields` is already applied server-side for this endpoint by default; no query param change is needed.

> *Preference / decision:* (A) Add an optional options?: { calcYields?: boolean } parameter to the existing getById function.

Reasoning:
This is the most architecturally sound approach. It maintains getById as the single entry point for fetching a property while providing the flexibility needed for the calculator's specialized requirements. It ensures backward compatibility for existing calls across the app while avoiding code duplication.

---

**Q6 — Drag-to-reorder (`Reorder.Group`) (Blocking for Step 3)**

The existing mock `CompareCalculatorPage` uses `framer-motion/Reorder.Group` for drag-to-reorder of compared properties. The spec does **not** mention this feature.

**Should I keep drag-to-reorder or drop it?**
- **Option A** — Drop it. The spec only calls for scroll arrows and property selection. Keep framer-motion only for the filter dropdown animation.
- **Option B** — Keep drag-to-reorder as a UX enhancement. Reordering must call `PUT calculator/compare` with the new order to persist it.

> *Preference / decision:* (B) Keep drag-to-reorder as a UX enhancement.

Reasoning:
If the AI Studio design included Reorder.Group, it signifies a core part of the intended "Comparison" experience. Being able to move properties side-by-side manually is a critical feature for users analyzing high-stakes financial data. To ensure this isn't just a UI gimmick, we must persist the new order to the backend so it remains consistent across sessions.

Implementation Directive for Claude:
1. Reorder Logic (CompareCalculatorPage):
- Use Reorder.Group (axis="x") and Reorder.Item from framer-motion (or motion/react) for the property grid.
- When the user finishes dragging (onReorder), update the local comparedProperties state immediately for a smooth UI feel.
2. Persistence:
- Immediately after the local state update, trigger a PUT calculator/compare call with the updated list of UUIDs in their new order.
- Handle potential API failures gracefully: if the PUT fails, revert the local state to the previous order and show a toast/notification.
3. Interaction Conflicts:
- Ensure the drag handle (usually the header of the PropertyForm) doesn't interfere with the horizontal scroll arrows.
- Disable reordering on mobile if it conflicts with native touch-scrolling, or provide a dedicated "drag handle" icon to initiate the move.
4. Performance:
- Since PropertyForm is a heavy component, use layout props and AnimatePresence to ensure that when properties switch places, the transition is fluid and doesn't trigger unnecessary full-form re-renders.

---

**Q7 — `fixedParameters.calculators.compareMaxProperties` key format (Blocking for Step 3)**

The spec says the max comparison limit comes from `fixedParameters.calculators.compareMaxProperties`. But `fixedParameters` in `SplashContext` is typed as `Record<string, number>` (flat, not nested).

**What is the actual key name in the flat `fixedParameters` object?**
- **Option A** — The key is literally the dot-notation string `"calculators.compareMaxProperties"` (e.g., `params["calculators.compareMaxProperties"]`).
- **Option B** — The key is something shorter (e.g., `"compareMaxProperties"`).
- **Option C** — This value doesn't exist yet in `fixedParameters`; default to `3` until it does.

> *Preference / decision:* Use getParam to retrieve the "calculators" string and parse it to find the "compareMaxProperties" key.

Reasoning:
The screenshot confirms that fixedParameters contains a key named "calculators". Its value is not a simple number but a stringified JSON array of key-value pairs. Using the getParam helper is the standard way in this project to access these values while maintaining clean code.

Implementation Directive:
1. Data Extraction via getParam:
Do not look for a flat key named compareMaxProperties. Instead, extract the "calculators" parameter and parse its contents.

```TypeScript
// Inside CompareCalculatorPage
const { getParam } = useSplash();

// 1. Get the raw stringified parameter
const calculatorsRaw = getParam('calculators', '[]'); 

// 2. Parse and find the specific limit
const calculatorsParsed = JSON.parse(calculatorsRaw);
const compareMaxProperties = calculatorsParsed.find(
  (item: { key: string; value: number }) => item.key === 'compareMaxProperties'
)?.value || 3; // Default to 3 if not found
```

2. Application Logic:
- Limit Selection: Use the compareMaxProperties variable to restrict how many properties a user can toggle in the selection panel.
- UI Feedback: If the user reaches the limit, disable the remaining checkboxes and show a tooltip or toast: "ניתן להשוות עד ${compareMaxProperties} נכסים".

3. Type Safety:
- Since getParam is being used, ensure you handle the potential for an empty string or malformed JSON gracefully to prevent the page from crashing.

---

*Waiting for explicit approval and answers before proceeding to any code generation.*

---
### [2026-05-27] Decisions Summary & Implementation Green Light

*AI says:*

Answers received. Decisions locked:

| # | Decision |
|---|----------|
| Q1 | No UUID guard. Call `GET /calculator/compare` directly on mount; redirect to `/home` on failure. |
| Q2 | `GET /calculator/compare` returns full `PropertyData[]` for selected properties. Selection panel uses `homeState.properties` (Zustand). |
| Q3 | Use `property.uuid` for `propertiesIds` in `PUT /calculator/compare`. |
| Q4 | Local state only inside `CompareCalculatorPage` — no `compare.slice.ts`. |
| Q5 | Add optional `options?: { calcYields?: boolean }` to existing `propertyService.getById`. |
| Q6 | Keep drag-to-reorder (`Reorder.Group`). Persist new order via `PUT calculator/compare` after each drag; revert + notification on failure. |
| Q7 | Use `params['calculators']` (raw), parse JSON, find `compareMaxProperties` key; default to `3`. |

**Files to change:**
1. `src/services/calculator.service.ts` — add `getCompareList()` and `updateCompareList(uuids)`.
2. `src/services/property.service.ts` — add `options?: { calcYields?: boolean }` to `getById`.
3. `src/pages/CompareCalculatorPage.tsx` — full rewrite replacing all mock data with real API + correct state.

*Proceeding to implementation.*