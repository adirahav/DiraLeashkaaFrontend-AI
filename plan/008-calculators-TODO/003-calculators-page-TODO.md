# Plan: CalculatorsPage - Implementation

## Task Overview
Build the main calculators hub that serves as a gateway to the platform's analytical tools. This page acts as a central controller for fetching available calculators, enforcing access permissions (Locked/Coming Soon), and providing a high-end, animated UI for tool selection.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @screen-header-component.md
    - @button-component.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @phrase-usage.md
    - @calculator-api.yaml
    - Individual Specs: 
        - @calculators-page.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Guard & Auth Logic (The Gatekeeper)**
- *Authorization Check:* Use `useStore` to check `loggedinUser`. If null, `Maps('/login')`.

- *Initial Fetch:* On mount, trigger `GET /api/calculator` to retrieve the list of calculator objects (containing `type`, `isLock`, `isComingSoon`, `image`, etc.).

- *Global Loading:* Toggle `isLoading` in the App Store during the initial fetch to show a skeleton or overlay.

**Step 2: Data Orchestration (Mapping & Transformation)**
- *Phrase Resolution:* Use `utilService.getPhrase` with the pattern `calculator_title_${snakeCaseType}` to map API data to multi-language strings.

- *Route Generation:* Create a helper to generate navigation paths using `utilService.toKebabCase(calculator.type) + "-calculator"`.

- *State Management:* Store the calculators array in local state or a specialized `calculator.slice`.

**Step 3: UI Composition (The Hub)**
- Apply the structure from @calculators-page.md. 

- *Header:* Render `ScreenHeader` with phrases `calculators_title` and `calculators_subtitle`.

- *Grid Layout:* Implement a responsive container using `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.

- *Calculator Card Component:* - Create aמ internal component `Calculator` for the individual card.
    - Visuals: Use `motion.div` from `framer-motion` for staggered entry animations.
    - Status Indicators: - If `isComingSoon`: Display the "Coming Soon" badge.
        - If `isLock`: Display the `Lock` icon in the footer.
        - If `active`: Display the "Enter" label and `ChevronLeft`.

**Step 4: User Experience & Polish**
- *Navigation Guard:* Implement an `onCalculatorClick` handler.
    - If `isLock` or `isComingSoon`, ignore the click.
    - Otherwise, navigate to the kebab-case route.

- *Hover Effects:* Apply Tailwind classes for image scaling (`group-hover:scale-110`) and depth (`hover:shadow-2xl`).

- *Accessibility:* Ensure `dir="rtl"` is applied to the main container for proper Hebrew alignment.

**Step 5: Styling (Tailwind Only)**
- *Card Design:* Use `rounded-[2.5rem]` and `bg-white` with `border-slate-100`.

- *Transitions:* Use `transition-all duration-500` for smooth hover states.

- *Grayscale Filter:* Apply `grayscale-[0.5]` and `opacity-75` to non-interactive cards.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Use `isLoading` to manage the entrance state.

- *Auth Slice:* Ensure `loggedinUser` is validated before any API calls.

- *Selectors:* Use atomic selectors for `calculators` data to prevent re-renders when other app state changes.


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