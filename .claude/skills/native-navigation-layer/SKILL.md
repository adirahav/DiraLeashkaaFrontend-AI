---
name: native-navigation-layer
description: Use this skill to orchestrate native back-button behavior and screen navigation stacks in mobile environments (Capacitor/Android). Enforces precise UX rules for multi-step flows, mandatory registration steps, and double-press app exit logic to ensure a predictable and non-frustrating user experience.
allowed_tools: [read_file]
references:
  - @routing-layer/SKILL.md
examples:                                           
   - input: "Handle native back button on the Home screen"
     output: "App.addListener('backButton', () => { moveAppToBackground(); });"
---

# Native Navigation & Back-Button Architecture (UX/Nav)
*Objective:* Control the native navigation ecosystem to ensure the hardware/gesture back-button mirrors the user's cognitive model. This layer prevents accidental app exits, eliminates navigation loops, and elegantly handles forced task flows like multi-step registration and mandatory states.

**Key Focus Areas:**
- *Stack Hygiene:* Ensuring strict linear tracking and stripping historical screens (like Auth/Login) from the history stack once passed.

- *Double-Press to Exit:* Intercepting the root back-button event to show user feedback before sending the app to the background.

- *Forced Task Flow (Locking):* Restricting escape routes in incomplete states while respecting user autonomy via structured background transitions.

- *Context-Aware Back Behavior:* Dynamic evaluation of the user's current route and authentication status before executing navigation.

## Core Principles

### 1. Root & Base Horizon
- *Login Horizon:* The Login screen serves as the initial entry root. Pressing the native back button from the main Login state must immediately trigger an app closure or exit.

- *Home Horizon:* The Home screen is the primary functional root. Pressing back from Home must never navigate backward; instead, it must invoke `Move App to Background`.

- *Static Statements:* Utility screens (e.g., Accessibility Statement, Calculators Statement, Contact Us) must return directly to the Home root, bypassing intermediate tabs or transient states.

### 2. Multi-Step & Linear Orchestration
- *Sequential Reversal:* Multi-step flows (e.g., Signup Steps 1-3, Forgot Password stages) must support strict step-by-step linear reversal (e.g., Step 3 --> Step 2 --> Step 1 --> Login).

- *Calculator Nesting:* Specialized calculator sub-screens must unwind cleanly to their parent menu (e.g., Max Price Calculator --> Calculators Menu) rather than dropping straight to Home.

- *Result-to-Form Mapping:* Analytical or result screens containing sub-views/tabs (e.g., Property Analysis tabs) must map their back event back to the parent data-entry form.

### 3. Guarded States & Mandatory Flows (Incomplete Signup)
- *The "Do Nothing"* Prohibition: Never ignore a native back-button press completely. Suppressing navigation without visual feedback creates a frozen UI perception.

- *Toast Feedback Interception:* When a user is locked in a mandatory configuration state (e.g., Incomplete Personal Info, Financial Details, or Consent), the first back press must show a non-modal Toast: "יש להשלים את הרישום כדי להשתמש באפליקציה".

- *Double-Press Background Escape:* If the user presses the native back button a second time within a 2-second threshold on a guarded state, the app must gracefully execute `Move App to Background`.

### 4. Authentication-Driven Branching
- *Conditional Stack Evaluation:* The back behavior for profile and legal components must dynamically check state flags:
  - Completed Registration: Route directly to `Home`.
  - Incomplete Registration (Logged In): Apply the Guarded State pattern (Toast --> Background).
  - Unauthenticated (Logged Out): Fall back immediately to `Move App to Background`.

### 5. Memory Stack Safety
- *Destructive Navigation:* When migrating from transient states (e.g., successful Login or completed Signup) to permanent roots, utilize `replace` or stack-reset routing mechanisms to wipe the previous state from memory.


## Implementation Checklist
- [ ] Root views (Home, Login) handle exit/background routines instead of standard history popping.

- [ ] Multi-step flows unwind in a predictable, linear step-by-step sequence.

- [ ] Guarded states implement the Double-Press to Background sequence with localized Toast warnings.

- [ ] Transient entry screens are actively wiped from the history stack upon successful task completion.

- [ ] Contextual checks are performed on state properties (e.g., `completedSignUp`, `isLoggedIn`) before resolving the destination.
