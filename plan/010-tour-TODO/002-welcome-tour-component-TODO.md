# Plan: WelcomeTour - Implementation

## Task Overview
Build the entry point of the onboarding journey. This component handles the "Start" step by highlighting the "Add Property" button on the Welcome screen. It must synchronize with the entry animations of the HomeWelcome component to ensure the spotlight lands perfectly on the target.

*Reference:* Use the specialized knowledge in
    - @tour-workflow.md
    - @tour-spotlight-component.md
    - Individual Specs: 
        - @welcome-tour-component.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Orchestration & State (The Trigger)**
- *Activation Logic:* In `HomeWelcome`, implement a `useEffect` that checks `canStartTour`.

- *Delayed Start:* Set a `2000ms` timeout to allow the house and button animations to settle before triggering `setShowTour(true)`.

- *Scroll-to-View:* Ensure the button is centered in the viewport using` buttonRef.current.scrollIntoView()` before the spotlight appears.

**Step 2: Dynamic Positioning (The Tracker)**
- *Ref Tracking:* The component receives `buttonRef`.

- *Frame-Perfect Accuracy:* Use `requestAnimationFrame` inside a `useEffect` to continuously call `getBoundingClientRect()` on the button.

- *State Sync:* Map the rect data (`top`, `left`, `width`, `height`) to the `buttonRect` local state. This ensures that if the window resizes or the button shifts slightly during its "bounce" animation, the spotlight follows it.

**Step 3: Component Refactor (`WelcomeTour.tsx`)**
- *File Placement:* `src/components/tour/WelcomeTour.tsx`.

- Apply the structure from @welcome-tour-component

**Step 4: Component Composition (The UI)**
- *Engine:* Render the `TourSpotlight` component.

- *Phrase Integration:* - Title: `utilService.getPhrase('tour_start_button_title')`.
    - Description: `utilService.getPhrase('tour_start_button_text')`.

- *Backdrop Handling:* Bind `onClose` to `setShowTour(false)` to allow users to skip/close the tour by clicking the overlay.

**Step 5: Layout & Interaction (Body Lock)**
- *Scrolling Prevention:* When `showTour` is active, apply `overflow: hidden` to the `document.body` to prevent the user from scrolling away from the spotlighted area.

- *Cleanup:* Ensure the body overflow is reset to `unset` when the component unmounts or the tour closes.

**Step 6: Visual Feedback (Elevation)**
- *Z-Index Management:* Ensure the container of the "Add Property" button in `HomeWelcome` receives `z-[110]` (higher than the overlay) only when `showTour` is true.

- *Styling:* Apply a subtle `ring-4 ring-blue-500` to the button while it's being spotlighted to create a double-highlight effect.

## Styling (Tailwind Checklist)
- [ ] `z-[110]` for the target button during tour.

- [ ] `animate-in fade-in` for the spotlight entrance.

- [ ] Transition duration: `duration-500` for smooth spotlight scaling.

## State Management Check
- *Auth Data:* Verify `user.tourCompletedTime` is indeed `null` before any of this logic executes.

- *Cleanup:* Ensure `cancelAnimationFrame` is called in the `useEffect` return to prevent memory leaks.

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