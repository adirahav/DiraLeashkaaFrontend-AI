---
name: tour-workflow
description: Orchestrates a multi-page onboarding tour (Welcome -> Property). Manages spotlight positioning, step-by-step logic, and server synchronization.
references:
  - @ui-component-layer/SKILL.md
  - @state-management-layer/SKILL.md
  - @phrase-usage.md
  - @auth-api.yaml
  - @user-api.yaml
---

# Requirements (Product Logic)

1. **Activation Logic**:
- *Trigger:* If `loggedInUser.tourCompletedTime` is NULL.

- *Persistence:* Tracks progress across navigation (Welcome to Property).

2. **Component Roles**:
- *TourSpotlight:* The engine. Handles `clip-path` overlay, popover positioning relative to `targetRect`, and smooth animations.

- *WelcomeTour:* Handles the 'START' step. Targets the "Add Property" button.

- *PropertyTour:* Manages 6 steps [CITY, PRICE, EQUITY, TYPE, INCOME, COMMITMENTS].

3. **Async & Server Integration**:
- *Calculation Delay:* Each input change/button click triggers `setIsCalculating(true)` to simulate/handle server processing.

- *Persistence:* 
    - Each step update calls `propertyService.updateProperty`.
    - Final step triggers `PATCH /api/user/tourCompleted`.

- *Local Update:* Update `loggedInUser` state immediately upon completion to remove the overlay.

4. **Interaction Design**:
- *Focusing:* Automatically focuses inputs or buttons within the spotlight.

- *Navigation:* On city selection in Welcome, navigate to `/property`.

- *View Switching:* On tour completion, switch `viewMode` to 'results' and show 'graph' tab.

# CSS & UI Standards
- **Overlay:** `bg-slate-900/70` with `backdrop-blur`.
- **Popover:** White card, blue border, with a bounce-animated `MousePointer2` icon.
- **Responsive:** Recalculates `targetRect` on resize/scroll via `requestAnimationFrame`.

# Files Structure
ROOT-PROJ
└── src/
    ├── components/
    │   └── tour/
    │       ├── TourSpotlight.tsx
    │       ├── WelcomeTour.tsx
    │       └── PropertyTour.tsx
    ├── store/
    │   └── slices/
    │       └── tour.slice.ts
    └── assets/
        └── css/
            └── main.css                  # Tailwind Theme (@theme)  


# Component Specification
```TypeScript
<WelcomeTour 
    showTour={showTour}
    setShowTour={setShowTour}
    buttonRef={buttonRef}
/>

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
