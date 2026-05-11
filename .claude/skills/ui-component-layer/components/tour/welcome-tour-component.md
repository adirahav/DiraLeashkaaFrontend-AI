---
name: welcome-tour-component
description: The first step of the onboarding tour. It highlights the "Add Property" button on the Welcome screen and coordinates the transition to the property wizard.    
references:
  - @tour-workflow.md
  - @tour-spotlight-component.md
  - @css-layer/SKILL.md
  - @ui-component-layer/SKILL.md
  - @phrase-usage.md
allowed_model: [gemini-3-flash]
---

# Requirements (Product Logic)

1. **Target Identification:**

- *DOM Tracking:* Must track the `buttonRef` of the "Add Property" button.

- *Dynamic Positioning:* Uses `getBoundingClientRect` within a `requestAnimationFrame` loop to ensure the spotlight follows the button even during entry animations or window resizing.

2. **Trigger & Timing:**

- *Delayed Activation:* The tour shouldn't pop up immediately. It waits for the `HomeWelcome` entry animations to finish (approx. 2-3 seconds) before set `showTour` to true.

- *Visibility:* Only renders when `showTour` is true and `loggedInUser.tourCompletedTime` is null.

3. **Content & Localization:**

- *Title:* `getPhrase('tour_start_button_title')`.

- *Description:* `getPhrase('tour_start_button_text')`.

4. **Interaction & Navigation:**

- *User Action:* Clicking the highlighted button (which is elevated via `z-[110]`) triggers the standard `onAddPropertiesPress` navigation.

- *State Persistence:* The tour state must persist in the `tour.slice` to ensure that once the user arrives at the `/property` page, the next step (PropertyTour) knows to take over.

5. **Layout Integration:**

- *Scroll Handling:* Automatically scrolls the target button into view before activating the spotlight.

- *Body Lock:* Disables document scrolling (`overflow: hidden`) while the tour is active to maintain spotlight alignment.

# Props Definition (Component API)
- `showTour`: boolean (required) - Controls visibility.
- `setShowTour`: (val: boolean) => void (required) - Updates visibility state.
- `buttonRef`: RefObject<HTMLDivElement> (required) - The anchor for the spotlight.

# Implementation Details
- *Component Wrapper:* Renders the `TourSpotlight` as its engine.

- *Z-Index Management:* Ensures the target button has a higher `z-index` than the tour overlay only when the tour is active.


# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   ├── tour/
    │   │   ├── WelcomeTour.tsx
    │   │   └── TourSpotlight.tsx
    │   └── layouts/
    │       └── HomeWelcome.tsx               # The parent using this component
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)         

# Component Specification
```TypeScript
<WelcomeTour 
    showTour={showTour}
    setShowTour={setShowTour}
    buttonRef={buttonRef}
/>
