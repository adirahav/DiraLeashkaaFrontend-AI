# Plan: HomeCityProperties - Extraction & Refactor

## Task Overview
Refactor the property grid and individual property cards into a unified, high-performance component `HomeCityProperties`. This includes managing a dynamic image carousel, yield indicators, and an interactive deletion flow with overlays.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @phrase-usage.md
    - @button-component.md
    - Individual Specs: 
        - @home-city-properties-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Grid & Infrastructurec**
- *Container:* Set up a responsive grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

- *Empty State:* Logic to show a centered `home_properties_empty_state` message if `properties.length === 0`.

**Step 2: Carousel Logic (Internal)**
- *State & Timing:* `currentImageIndex` state with a 4-second `setInterval` for auto-rotation.

- *Media Controls:* Logic for `ChevronRight/ChevronLeft` and dot indicators.

- *Fallback:* Handle missing images with `missing_picture.png`.

**Step 3: Financial Logic & Formatting**
- *Data Formatting:* Use `utilService.percentFormat` and `utilService.priceFormat`.

- *Alert States:* Logic for "Missing Data" (`calcYields === null`) and the "Most Profitable" condition.

**Step 4: Action & Overlay Logic**
- *Deletion Flow:* Logic for `deleteStatus` state ('idle' | 'confirm' | 'deleting') and the confirmation overlay.

- *Navigation:* Setup `onPropertyPress` triggers for the card and buttons.

**Step 5: Component Refactor (HomeCityProperties.tsx)**
- *Apply Structure:* Build according to @home-city-properties-component.md.

- *Looping Logic:* `properties.map()` to render individual cards.

- *Card Integration:* Wrap each item in a motion.article (entry fade-in + hover lift).

- *Button Specs:* Implementation of `Button` component: `variant="outline"`, `icon={Edit/Trash2}`, and `flex-1`.

**Step 6: Styling & RTL Finals (Tailwind)**
- *Card UI:* bg-white rounded-xl border border-slate-200 overflow-hidden.

- *Badge Styling:* rounded-full px-3 py-1 text-xs font-black.

- *RTL Support:* Absolute positioning (e.g., Yield badge at right-3) and text alignment for Hebrew.


## State Management Check (Zustand Slices Pattern)
- **Property Slice:**
    - *Actions:* Ensure `deleteProperty(id)` is called after confirmation.

- **App Slice:**
    - *Loading:* Use `isLoading` to render skeleton cards with a "pulsing" effect.
                

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