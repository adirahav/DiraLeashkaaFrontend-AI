# Plan: Property Page - Extraction & Refactor

## Task Overview
Build a high-fidelity, data-intensive Property Analysis Page. The page serves as a "Smart Calculator" that orchestrates multi-stage form inputs, real-time financial modeling, and responsive result visualization. It must handle complex state synchronization between local inputs and the server-side analysis engine, including a guided user tour and a specialized mobile result mode.   

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @property-api.yaml
    - Individual Specs: 
        - @property-page.md (The Interface)
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: State Initialization & Persistence (Zustand & API)**
- *State Management*
    - Use `useStore` to access the `PropertySlice`.
    - Implement `currentProperty` state based on the `PropertyState` interface.

- *Initialization Flow*
    - On `useEffect` (mount): Check for `propertyUUID` in URL params.
    - If UUID exists: Fetch property data via `propertyService.getById`.
    - If no UUID: Initialize a clean state. Create a new entry on the server upon the first valid input change.

- *Auto-Save Logic*
    - Implement a debounced `useEffect` (500ms) that calls `propertyService.save` whenever a field in `currentProperty` changes.

- *Formatting Logic*
    - Use `utilService.formatCurrency` for Price, Equity, and Monthly Repayments.
    - Use `utilService.formatPercent` for Yields and Interest rates.
    - Use `utilService.formatNumber` for general numeric displays (like square meters or index points).

Ensure updatedByField is tracked to restore focus/cursor position after the async update cycles.

**Step 2: Refactor & Component Composition (The Evaluation Engine)**
- Apply the structure from @property-page.md. 

- *Sticky Dashboard Header*
    - Implement a sticky wrapper that transitions based on scroll (`isScrolled`).
    - Integrate `PropertyMetrics` to show real-time Yield, LTV, and Repayment.

- *Form Sections*
    - Part 1: Basic Info: Use `PropertyForm` for City, Price, Equity, and Income.
    - Part 2: Interests: Use `PropertyInterests` (collapsible section).
    - Logic: Map inputs to the `PropertyState` fields. Use `utilService.getPhrase` for all labels.

- *Media Handling*
    - Integrate `PropertyMedia`. Handle image uploads/removals via `propertyService.uploadMedia`.

**Step 3: Financial Calculation & Validation**
- *Validation Guard*
    - Calculate `isPart1Valid` based on mandatory fields (apartmentType, propertyPrice, equity, income).
    - If invalid: Show the "Missing Data" `overlay` with `iconMissingData`.

- *Calculated Data*
    - When `isCalculating` is true (during debounce/API wait): Show the global `Overlay` with the `animCalculating` Lottie animation.
    - Ensure `calcYieldForecast` and `calcAmortizationSchedule` from the server are passed to the results components.

**Step 4: Responsive Analysis Mode (Mobile UX)**
- *The "Results" Switch*
    - Implement `viewMode` state (`form` | `results`).
    - *Form View: Standard vertical scroll.
    - *Results View*: Apply `.simulated-landscape-mobile`. Hide the main form and show a 3-tab navigation (Yield, Amortization, Graph).

- *Navigation*
    - Implement a "Back" button in the results header to return to `viewMode: 'form'`.
    - Sync the `activeResultTab` state between the buttons and the rendered component.

**Step 5: Styling & Infrastructure (Tailwind)**
- *Dashboard*: Styles for the sticky header with backdrop-blur.

- *Results Layout*: Define the landscape simulation for mobile, ensuring charts utilize 100% of the available width/height.

- *Focus Management*: Ensure styles don't "flicker" when inputs are momentarily disabled during auto-save.

- RTL: Ensure proper alignment for Hebrew labels and currency symbols.

## State Management Check (Zustand Slices)
- *Property Slice*: 
    - `setField(name, value)`: Updates local state and triggers debounce.
    - `fetchProperty(uuid)`: Handles async loading from API.

- *App Slice*: - Toggle `isLoading` to trigger global calculation overlays.


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