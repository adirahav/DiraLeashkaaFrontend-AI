# Plan: NativeNavigation - Implementation

## Task Overview
Engineer a high-performance, robust Native Back-Button and Navigation Stack Controller for the mobile ecosystem (Capacitor/Android). This system intercepts hardware and gesture back events, evaluates the application's current route and state flags, and executes context-aware actions—ranging from linear step-by-step reversals to double-press app containment mechanisms.

The implementation ensures that mobile hardware interaction perfectly aligns with user expectations, safeguarding incomplete transaction states and cleaning up transient authentication screens from memory to maintain absolute stack integrity.

*Reference:* Use the specialized knowledge in
    - @notification-component.md
    - Individual Specs: 
        - @native-navigation-layer/SKILL.md

## Implementation Steps

**Step 1: Native Event Interception & Listener Management**
- *Capacitor Setup:* `Import { App } from '@capacitor/app'` to hook into the native core.

- *Global Listener Initialization:* Implement a centralized `useNativeBack` hook or router-level listener that binds to the native `backButton` event on app mount.

- *Cleanup Lifecycle:* Ensure the listener returns a proper unbind routine (`listener.remove()`) to prevent multiple bridge allocations and memory leaks.

**Step 2: Authentication & Linear Multi-Step Unwinding**
- *Root Horizon:* Intercept the back event on the main Login screen to immediately invoke `App.exitApp()`, closing the app.

- *Linear Signup Reversal:* Map the Signup sequence steps to pop back sequentially (`Signup Step 3` --> `Step 2` --> `Step 1` --> `Login`).

- *Forgot Password Recovery Steps:* Direct the Password Reset stack step-by-step (`Change Password` --> `Code Verification` --> `Email Stage` --> `Login`).

**Step 3: Root Horizon Protection & Background Transition**
- *The Home Root:* When the user is on the main Home dashboard, prevent standard backward history popping.

- *Background Deflection:* Diverge the back-button event on Home to safely minimize the app and move it to the background, keeping the process warm in the Task Manager.

- *Utility Screen Routing:* Explicitly direct standalone utility modules (e.g., `Accessibility Statement`, `Calculators Statement`, `Contact Us`) to pop straight back to the Home root.

**Step 4: Guarded States & Double-Press Containment Engine**
- *State Evaluation:* Check application states for unfinished user profiles (`Personal Info`, `Financial Details`, or `Consent` configurations).

- *First-Press Feedback Interception:* If the user attempts to back out of a mandatory incomplete state, intercept the navigation event, block it, and display a non-modal localized Toast notification: "יש להשלים את הרישום כדי להשתמש באפליקציה".

- *Double-Press Threshold Trigger:* Track the timestamp of the first click. If a consecutive back press is detected within a `2000ms` window, bypass the lock and execute `Move App to Background`.

**Step 5: Calculator & Sub-View Nesting Refactor**
- *Calculator Menu Hierarchy:* Wire specialized calculator sub-screens (`Max Price Calculator`, `Compare Calculator`) to pop back cleanly into their parent `Calculators Menu` layer rather than dropping out to Home.

- *Tab-to-Form Mapping:* Configure analytical results containing multiple sub-tabs (`Property Analysis`) to point their native back event directly to the primary data-entry form.

**Step 6: Destructive Navigation & Memory Stack Purge**
- *Stack Cleansing:* Implement a destructive routing reset (e.g., `replace` or a stack-wipe action) upon successful login or registration completion.

- *Transient Elimination:* Ensure that authentication paths are completely dropped from the navigation memory stack so users can never re-enter registration states via a native back gesture.

## Technical Checklist
- [ ] Implement a `lastTimeBackPress` timestamp reference variable to handle time-interval checking.

- [ ] Ensure `App.exitApp()` is invoked dynamically based on target route parameters.

- [ ] Wrap route detection logic in a platform check to isolate Capacitor/Android behavior from standard web browser routing.

- [ ] Clear any active modal states or overlays before resolving the screen history backward move.


## Styling & UI Checklist (Tailwind/Toast)

- *Guarded Toast Alert:*
    - [ ] Use a subtle, non-intrusive bottom screen toast overlay for the registration-completion prompt.

    - [ ] Apply `fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999]` for clear mobile visibility.

    - [ ] Style with `bg-slate-900/90 text-white text-sm px-4 py-2 rounded-xl shadow-xl backdrop-blur-sm`.

    - [ ] Animation: Snappy mobile transitions (`animate-in fade-in slide-in-from-bottom-2` with a `200ms duration`). 

- *Screen Transitions:*
    - [ ] Match React Navigation / Router transition animations to respect native Android slide-in directions (Right-to-Left on forward, Left-to-Right on back).

## State Management Check (Persistence)
- [ ] Verify that context-aware back routines query live reactive states (`isLoggedIn`, `completedSignUp`) rather than cached or stale flags.

- [ ] Ensure that native event overrides do not block unexpected hardware behaviors on fully external or third-party web views.

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
*AI says:*
