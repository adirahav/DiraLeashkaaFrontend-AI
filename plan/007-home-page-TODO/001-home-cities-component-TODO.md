# Plan: HomeCities - Extraction & Refactor

## Task Overview
Refactor the city selection logic into the `HomeCities` component. This component serves as a dynamic filter bar, resolving city metadata from `fixedParameters` and managing local asset loading with robust fallback mechanisms.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @phrase-usage.md
    - @fixed-parameters-usage.md
    - @button-component.md
    - Individual Specs: 
        - @home-cities-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Props**
- *Store Integration:* Connect to `useStore` to pull `properties` and `selectedCity`.

- *Props:* Receive `cities` (array of keys), `selectedCity`, and `onSelectCity`.

- *Refactor Props:* Ensure the component can either receive values via props for reusability or connect directly to the store for the Home page context.

- *Data Mapping:* Use `fixedParameters.cities` to map the `cityKey` to its display `value`.

- *Container:* Implement a `flex` container with `overflow-x`-auto and `scrollbar-hide`.

**Step 2: Dynamic Asset & Fallback Logic**
- *Image Loading:* - Construct the path: `/assets/images/icon_city_${cityKey}.png`.
    - Implement a `useState` or `onError` handler to detect failed image loads per city.

- *Fallback:* If the image path is invalid or fails, render the `MapPin` icon from `lucide-react`.

**Step 3: Component Refactor (HomeCities.tsx)**
- Apply the structure from @home-cities-component.md.

- *Looping Logic:* Map through the `cities` array.

- *Button Integration:* Use the `Button` component:
    - `variant={selectedCity === cityKey ? 'primary' : 'outline'}`.
    - `className="whitespace-nowrap"`.

- *Animations:* Wrap each button in a `motion.div` for entry fade-in and tap scaling.


**Step 4: Styling & RTL (Tailwind)**
- Ensure `dir="rtl"` is hardcoded or inherited for correct horizontal scrolling.

- Apply `gap-3` for spacing and `!px-6 !py-3` to override default button padding for a "pill" look.

- Handle unselected button states with `bg-white` and `border-slate-200`.

## State Management Check (Zustand Slices Pattern)
- **Home/Property Slice:**
    - Selectors: Access `selectedCity` and the raw `properties` list to derive the current filter state.
    - Actions: Trigger `setSelectedCity(cityKey)` on click to update the global filter, which in turn orchestrates the filtering logic for the property grid.

- **App Slice:**
    - Loading State: Use the `isLoading` flag to render skeleton placeholders (empty pulsing buttons) during the initial properties fetch.

- **Sync Logic:** Ensure that when the city is changed, the scroll position of the property grid is reset to the top/right.
                  

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