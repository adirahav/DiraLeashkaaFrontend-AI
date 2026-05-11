# Plan: Signup Page - Refactor & Integration

## Task Overview
Build a robust, state-managed multi-step registration wizard. The component must handle dynamic step navigation based on user completion, integrate with authService for both Signup (POST) and Update (PUT) operations, and provide visual feedback via progress indicators and localized phrases.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @auth-api.yaml
    - @user-api.yaml
    - @user-personal-info-component.md
    - @user-financial-details-component.md
    - @user-consent-component.md    
    - Individual Specs: 
        - @signup-page.md


## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure and implementing SignUpPage.tsx with a multi-step Wizard (Step 1: Auth, Step 2: Economics, Step 3: Terms) . 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Logic & State Integration (Zustand & Auth Guard)**
- *State Selection*
    - Use `useStore` to pull `loggedinUser` and `isLoggedinUserCompleted` from the Auth Slice.
    - Pull `phrases` from `useSplash`.
    - Pull `isLoading` from the App Slice to manage button states.
    
- *Auth Guard & Initialization*
    - Implement `shouldJumpToStep()` logic on mount:
        - If `isLoggedinUserCompleted` is true: Navigate to `/`.
        - Calculate initial step: 
            - Step 1 (missing basics) 
            - Step 2 (missing finance) 
            - Step 3 (missing terms)
        
    - Set local `step` state based on this calculation.
    
- *Form Data Sync*
    - Initialize local `formData` state from `loggedinUser` if it exists, ensuring consistent data flow between steps.

**Step 2: Visual Composition & Progress Indicators**
- Apply the structure from @signup-page.md.

- *Branding & Headers*
    - Use `Logo` and `ScreenHeader` with phrases: `registration_title` and `registration_subtitle`.
    
- *Step Tracking*
    - Verbal: Render `registration_steps_indicator` using `utilService.getPhrase` with `%1$d` (current step) and `%2$d` (total 3).

    - Visual: Implement Progress Bar with current percentage (step/3 X 100).

**Step 3: Step-by-Step Navigation & API Workflow**
- *Centralized Save Function (`saveUser`)
    - Create an internal async function that prepares the payload.
    
    - Logic: If `!loggedinUser` call `authService.signup`, else call `userService.updateUser`.
    
- *The Wizard Flow*
    - Step 1 (Personal): On `handleNext`, trigger `saveUser`. If success, move to step 2. Handle "Email taken" error specifically for this step.
    
    - Step 2 (Financial): On `handleNext`, trigger `saveUser`. If success, move to step 3.
    
    - Step 3 (Terms): On `handleFinish`, update `termsOfUseAccept` with a timestamp via `saveUser`.
    
    - Post-Completion: Call `setForceFetchSplash(true)` to refresh user permissions and navigate to `/`.
    
- *Global Error Handling*
    - Implement a `serverError` state that displays a `motion.div` alert if any API call fails with `signup_server_error`.

**Step 4: Styling & RTL (Tailwind)**
- *Layout*
    - Apply a centered card layout using `max-w-2xl mx-auto`.
    
    - RTL Logic: Use Tailwind logical properties (`text-start`, `space-x-reverse`) and ensure `dir="rtl"` is respected without hardcoded "right" alignments.
    
- *Animations*
    - Implement smooth step transitions using Tailwind's `animate-in fade-in slide-in-from-left-4 duration-500` (or right, depending on the direction).

- *Visual Feedback* 
    - Progress Bar: Use a `div` with `h-1.5 bg-slate-100 rounded-full overflow-hidden`, containing a child `div` with `bg-blue-600 transition-all duration-500 ease-out` for the width.

**Step 5: API & Infrastructure (The Engine)**
- *Auth Service Integration* 
    - `signup(details)`: POST to `/auth/signup`, save token, and decode user.
    
    - `updateUser(details)`: PUT to `/user/`, update local Zustand store with the returned user object.
    
- *Data Sanitization*
    - Ensure all numeric values (Equity, Incomes) are parsed via `utilService.parseNumber` within the `saveUser` function before sending the payload.

- *Tailwind Config Sync*:
    - Ensure `blue-600` and `slate-100` are defined in the config to match the progress bar and branding.


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