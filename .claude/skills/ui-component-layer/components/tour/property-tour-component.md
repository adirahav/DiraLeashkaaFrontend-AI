---
name: property-tour-component
description: A multi-step (6 steps) guided experience within the Property Page. Manages spotlight synchronization across dynamic form inputs, simulates server-side calculations, and handles the final transition to the results view.
references:
  - @tour-workflow.md
  - @tour-spotlight-component.md
  - @css-layer/SKILL.md
  - @ui-component-layer/SKILL.md
  - @phrase-usage.md
  - @state-management-layer/SKILL.md
  - @service-layer/SKILL.md
  - @api-layer/SKILL.md
  - @user-api.yaml
allowed_model: [gemini-3-flash]
---

# Requirements (Product Logic)

1. **Step Flow (The Sequence):**
- *Steps:* `CITY` -> `PRICE` -> `EQUITY` -> `TYPE` -> `INCOME` -> `COMMITMENTS`.

- *Transitions:* Each step transition must:
  1. Set `isCalculating(true)` (simulate server lag for 1200ms).
  2. Scroll the next target `Ref` into the center of the viewport.
  3. Update the `tourStep` after the scroll and calculation are complete.

2. **Spotlight Tracking:**
- *Real-time Sync:* Uses `requestAnimationFrame` to track the `activeRect` of the current step's Ref.

- *Visibility Guard:* The spotlight must disappear during "Calculation" (`isCalculating === true`) or during "Pending transitions" to avoid visual jumps.

3. **Input Interaction (Focus Management):**
- When a step becomes active, the component must find the inner `input` or `button` of the target Ref and focus it.

- *For text inputs:* Move the cursor to the end of the text (`setSelectionRange`).

4. **Localization & Content:**
- Maps each `tourStep` to its corresponding title and text from the phrase library (e.g., `tour_city_title`, `tour_price_text`).

- *Action Button:* Displays `tour_button_next` for intermediate steps and `tour_button_finish` for the final step.

5. **Completion Logic:**
- *Final Step Action:* 
  1. Trigger `PATCH /api/user/tourCompleted`.
  2. Update local `loggedinUser` state.
  3. Switch `viewMode` to 'results'.
  4. Set `activeResultTab` to `'graph'`.
  5. Scroll to the `graphRef`.

# Props Definition (Component API)
- `showTour`: boolean
- `tourStep`: Enum (CITY...COMMITMENTS)
- `isCalculating`: boolean
- `cityRef`, `priceRef`, `equityRef`, `typeRef`, `incomeRef`, `commitmentsRef`, `graphRef`: React.RefObject
- `setViewMode`, setActiveResultTab, setIsTourEnding: State setters.

# Interaction Design
- *Overlay:* High contrast backdrop (`bg-slate-900/70`).

- *Smoothness:* Uses `behavior: 'smooth'` for all `scrollIntoView` calls with a `1000ms` buffer to allow the browser to finish scrolling before re-enabling the spotlight.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── tour/
    │       ├── PropertyTour.tsx
    │       └── TourSpotlight.tsx
    ├── pages/
    │   └── PropertyPage.tsx            # The parent using this component
    ├── services/
    │   ├── http.service.ts
    │   └── user.service.ts             # API call: PATCH /api/user/tourCompleted
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)   
              

# Component Specification
```TypeScript
<PropertyTour 
    showTour={showTour}
    setShowTour={setShowTour}
    tourStep={tourStep}
    setTourStep={setTourStep}
    pendingTourStep={pendingTourStep}
    setPendingTourStep={setPendingTourStep}
    isCalculating={isCalculating}
    setIsCalculating={setIsCalculating}
    setIsTourEnding={setIsTourEnding}
    setViewMode={setViewMode}
    setActiveResultTab={setActiveResultTab}
    cityRef={cityRef}
    priceRef={priceRef}
    equityRef={equityRef}
    typeRef={typeRef}
    incomeRef={incomeRef}
    commitmentsRef={commitmentsRef}
    graphRef={graphRef}
  />
