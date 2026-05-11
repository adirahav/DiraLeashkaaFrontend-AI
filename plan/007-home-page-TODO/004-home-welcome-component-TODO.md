# Plan: HomeWelcome - Extraction & Refactor

## Task Overview
Implement the `HomeWelcome` component as the primary landing state for users without properties. It manages the transition between a standard "Empty State" and an interactive "Tour Mode," using `framer-motion` for high-end visual feedback and `buttonRef` for tour targeting.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @phrase-usage.md
    - Individual Specs: 
        - @home-welcome-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Infrastructure & Props**
- *Props:* Receive `onAddPropertiesPress`, `showTour`, and `setShowTour`.

- *Ref Handling:* Initialize `buttonRef` using `useRef<HTMLDivElement>` to allow the Tour mode to "focus" on the button.

- *Store Logic:* Pull `loggedinUserState` to check for `tourCompletedTime`.

**Step 2: Tour Trigger & Timing Logic**
- *Effect Setup:* Implement a `useEffect` that runs only if `properties.length === 0` and !tourCompletedTime.

- *Delay & Scroll:* - Wait 2 seconds.
    - Execute `scrollIntoView` on the `buttonRef` with `behavior: 'smooth'`.
    - Set a secondary timeout (approx 1.8s) to trigger `setShowTour(true)`.

**Step 3: Component Refactor (HomeWelcome.tsx)**
- *Structure:* Implement the card container using the `max-w-2xl` and `rounded-[2.5rem]` styling.

- *Animations:* - Define `containerVariants` and `itemVariants` for the staggered entry of title, text, and button.
    - Integrate `AnimatedHouse` and `AnimatedTrendingUp` as the hero visual.

- *Header Badge:* Render the "New Start" badge with the `Sparkles` icon and `home_welcome_new_start` phrase.

**Step 4: Primary Action & Tour Integration**
- *Button Implementation:* Use the `Button` component with `variant="primary"`.

- *Tour Styling:* If `showTour` is true:
    - Add `relative z-[110]` to the button wrapper.
    - Apply `ring-4 ring-blue-500` and a pulse animation to the button to guide the user.

- *Callback:* Ensure `onClick` calls `onAddPropertiesPress()`.

**Step 5: Styling & RTL (Tailwind)**
- *RTL:* Force `dir="rtl"` on the root wrapper.

- *Visual Flourish:* Implement the background decorative elements (`blur-[100px]` blobs) with their respective reverse-repeat animations.

- *Footer Slogan:* Add the bottom slogan with the decorative dividers as per the AI Studio design.

## State Management Check (Zustand Slices Pattern)
- **User Slice:** Access `loggedinUserState.tourCompletedTime`.

- **Parent Interaction:** Ensure `HomePage` handles the `setShowTour` state and passes it down correctly.
                

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