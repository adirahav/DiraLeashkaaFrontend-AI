# Plan: Home Page - Extraction & Refactor

## Task Overview
Build a high-performance investment dashboard that serves as the central hub for property management. The page must handle a dual-loading strategy (Light/Full data), dynamic city-based filtering, and a conditional "Welcome" state for new users. It orchestrates complex calculations and provides a streamlined interface for monitoring property yields and portfolio growth.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @user-api.yaml
    - Individual Specs: 
        - @home-page.md (The Interface)
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Dual-Phase Data Loading (Zustand & Worker)**
- *Auth & Guarding*
    - On mount: Verify `loggedinUser`. If null, navigate to `/login`.

- *Phase 1: Initial Fetch (Light)*
    - Trigger `userService.getHome(false)`.
    - Populate `properties` and `cities` keys in the store to allow immediate interaction with the city filter and basic list.

- *Phase 2: Full Fetch (Heavy)*
    - Immediately trigger `userService.getHome(true)` to fetch calculated data (Best Yields, Forecasts).
    - Maintain an `isFullDataLoading` state to show localized skeletons/loading indicators on yield-sensitive components.
    - Ensure updatedByField is tracked to restore focus/cursor position after the async update cycles.

**Step 2: Component Composition & Layout (Tailwind)**
- Apply the structure from @home-page.md.

    - *Conditional Rendering (The Switch):*
        - if (properties.length === 0):
            - Identify Segment: const canStartTour = !user.tourCompletedTime;
            - Component: Render <HomeWelcome canStartTour={canStartTour} />.
            - Animation: Wrap in AnimatePresence with initial={{ opacity: 0 }} to ensure a smooth "fade-in" for the welcome screen.
        - Else: Render the Dashboard layout.

- *Branding & Headers:*
    - Integrate `ScreenHeader` using `home_title and home_subtitle`.
    - Implement the *Forecast Banner*: A sticky-ready `div` using `bg-blue-50/50 backdrop-blur border-blue-100` to highlight the 10-year projection parameters.

Navigation (HomeCities):
    - Compute `uniqueCities` from the property list, sorted alphabetically.
    - Handle the "else" (Other) city case for properties with missing city data.
    - Default `selectedCity` to the first available city.

**Step 3: Property Logic & Actions**
- *Filtered View (HomeCityProperties):*
    - Map `filteredProperties` based on the selected tab.
    - Logic: Pass `maxYieldInCity` (calculated via `Math.max`) to highlight the top-performing property card.

- *Portfolio Highlights (HomeBestYields):*
    - Render the top-performing properties globally. Use `isFullDataLoading` to manage the "Calculating..." overlay state.

- *Action Workflows:*
    - *Edit:* On press, navigate to `/property?propertyUUID={uuid}`.
    - *Delete:*
        - Trigger the `Modal` component with `home_delete_confirm_title`.
        - On confirmation: Call `propertyService.archive` and optimistically update the local store.

**Step 4: Mobile UX & Interaction**
- *Swipe to Refresh:*
    - Implement a touch-event listener for mobile to trigger `getHome(false)` when pulling down at `window.scrollY === 0`.

- *Responsive Grid:*
    - Ensure property cards use a single-column layout on mobile and `grid-cols-2` or `grid-cols-3` on larger screens.

- *Animations:*
    - Use Tailwind's `animate-in fade-in slide-in-from-bottom-4` for property cards to ensure a "staggered" entry feel.

**Step 5: Infrastructure & Cleanup (The Engine)**
- *Phrase Management:*
    - Use `utilService.getPhrase` for all dynamic titles. Handle `%1$s` replacements for city names in the list headers.

- *Formatting:*
    - Ensure all yield percentages in cards are passed through `utilService.formatPercent`.

## State Management Check (Zustand Slices)
- *User Slice:*
    - `home`: Stores properties, cities, and bestYields.
    - `setHome(data)`: Updates state and sets `fullData` flag.

- *App Slice:*
    - `setLoading(boolean)`: Tracks global loading for Phase 1.


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