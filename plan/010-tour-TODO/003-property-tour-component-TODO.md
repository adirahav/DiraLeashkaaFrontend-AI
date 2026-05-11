# Plan: PropertyTour - Implementation

## Task Overview
Implement the orchestration logic for the 6-step Property Tour. This component is responsible for "walking" the user through the input fields, handling automated focus, simulating calculation delays, and performing the final handshake with the server to mark completion.

*Reference:* Use the specialized knowledge in
    - @tour-workflow.md
    - @tour-spotlight-component.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @property-tour-component.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Step Coordination (The Brain)**
- *State Management:* Track `tourStep` and `pendingTourStep`.

- *Calculation Simulation:* Wrap step transitions in a 1200ms delay using `setIsCalculating(true)`. This prevents user interaction while the spotlight is moving and simulates "data processing".

- *Sequence:* `CITY` → `PRICE` → `EQUITY` → `TYPE` → `INCOME` → `COMMITMENTS`.

**Step 2: Smooth Navigation & Scrolling**
- *Centered Scroll:* For each new step, trigger `targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })`.

- *Spotlight Buffer:* Wait for the scroll to finish (approx `1000ms`) before setting the new `tourStep` and showing the spotlight. This avoids the "jittery" movement of the overlay.

**Step 3: Component Refactor (`PropertyTour.tsx`)**
- *File Placement:* `src/components/tour/PropertyTour.tsx`.

- Apply the structure from @property-tour-component

**Step 4: Advanced Focus Management**
- *Automated Focus:* Map `tourStep` to input IDs (e.g., `price-input`).

- *Input Handling:* - If the target is a standard input: Call `.focus()` and use `setSelectionRange` to move the cursor to the end.
    - If the target is a button group (like `ApartmentType`): Find the first button inside the Ref and focus it.

- *Timing:* Use a `100ms` timeout to ensure the element is enabled and visible before attempting focus.

**Step 5: Dynamic Content & Phrases**
- *Mapping:* Inject localized titles and descriptions based on the current step:
    - Example (Price): `tour_price_title` & `tour_price_text`.

- *Button Actions:* - Intermediate steps: Show `tour_button_next`.
    - Final step: Show `tour_button_finish` with a green (`bg-green-600`) color scheme.

**Step 6: Completion & Sync (The Handshake)**
- *Final Action Workflow:* 
    1. Call `PATCH /api/user/tourCompleted` via `userService`.
    2. Update `loggedinUser.tourCompletedTime` in the store immediately.
    3. Switch UI: `setViewMode('results')` and `setActiveResultTab('graph')`.
    4. Scroll to `graphRef` to show the final "Aha!" moment.

- *Cleanup:* Set `setIsTourEnding(true)` to disable global scroll locks and allow normal interaction with the results.

**Step 6: UI Resilience (Body Lock)**

- *Scroll Lock:* Ensure `overflow: hidden` is applied to `body` and `html` while `showTour` is true to keep the spotlight perfectly aligned.

- *Visual Guard:* If `isCalculating` is true, set `activeRect` to null to fade out the spotlight while the "loading" state is shown.

## Technical Checklist
- [ ] Implement `requestAnimationFrame` for `activeRect` tracking.

- [ ] Add `z-[110]` to focused inputs in `PropertyForm` when tour is active.

- [ ] Verify `tourCompleted` API call includes `auth` headers.

- [ ] Ensure `AnimatePresence` handles the transition between `form` and `results` modes.

## Styling & UI Checklist (Tailwind)
Since the spotlight moves across different types of inputs, the CSS must be dynamic:

- *Spotlight Precision:*
    - [ ] Use `transition-[clip-path]` or `transition-all` with `duration-500` on the `TourSpotlight` overlay for smooth movement between fields.
    - [ ] Ensure the "hole" in the overlay has a `rounded-2xl` (or matching the input's `border-radius`) to look integrated.

- *Target Elevation:*
    - [ ] Active Field: Apply `relative z-[110]` to the specific `formField` container being spotlighted.
    - [ ] Visual Glow: Add `ring-4 ring-blue-500/30` and `shadow-[0_0_20px_rgba(59,130,246,0.5)]` to the active input to make it pop against the dark backdrop.

- *The Popover (Tooltip):*
    - [ ] Positioning: Ensure the tooltip uses `fixed` or `absolute` positioning with a `z-[120]` to sit above the elevated input.
    - [ ] Animation: Use `animate-bounce-subtle` on the `MousePointer2` icon within the tooltip to draw the eye.

- *Responsiveness:*
    - [ ] Add a `max-h-[80vh] overflow-y-auto` to the tooltip text for small mobile screens so it doesn't get cut off.

## State Management Check (Zustand & Refs)
This ensures the data actually saves and the UI doesn't get stuck:

- *The "Handshake" (Server Sync):*
    - [ ] Optimistic Update: Update the `user.tourCompletedTime` in the Zustand store before the API call finishes so the UI doesn't "flicker" back to tour mode.
    - [ ] Error Handling: If the `PATCH` fails, log it but do not block the user from seeing their results. The "Aha!" moment is more important than the DB flag.

- *Calculation States:*
    - [ ] Input Lock: Verify that all `FormField`s are `disabled` when `isCalculating` is true to prevent double-submissions or race conditions during the tour.
    - [ ] Debounce Sync: Ensure the `useDebounce` hook in `PropertyPage` is set to at least `500ms` so the "Calculating..." spinner feels natural and doesn't jitter.

- *Navigation Persistence:*
    - [ ] Route Guard: If the user refreshes the page mid-tour, the state should ideally default back to the first incomplete step (or Step 0) rather than breaking the UI.

- *Ref Integrity:*
    - [ ] Check that all 7 Refs (`cityRef` through `graphRef`) are correctly attached to the outermost wrapper of the form components to ensure `getBoundingClientRect` captures the entire field, not just the label.

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