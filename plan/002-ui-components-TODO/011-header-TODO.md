# Plan: Header & Mobile Drawer - Extraction & Refactor

## Task Overview
Refactor the `Header` into a fully responsive, state-aware component. It must handle Desktop navigation, a complex Mobile Drawer, and `Auth` states using `Zustand` and `SplashContext`.

*Reference:* Use the specialized knowledge in
    - @state-management-layer
    - @service-layer/SKILL.md
    - @footer-component.md
    - @logo-component.md
    - @button-component.md
    - Individual Specs: 
        - @header-component.md

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Logic & Auth Integration**
- *State Selection (Zustand)*
    - Pull `loggedinUser` and `isLoggedinUserCompleted` from `userModule`.
    - Pull `phrases` and `fixedParameters` from `useSplash`.

- *UI State Management*
    - Implement `isMenuOpen` local state (or a specialized `useUiStore`).
    - Auto-Close Logic: Use `useEffect` with `useLocation` to set `isMenuOpen(false)` on route changes.

- *Visibility Logic*
    - Implement the showNavigation check to hide the header on `LOGIN`, `SIGNUP`, and `FORGOT_PASSWORD` pages.  

**Step 2: Component Refactor (`Header.tsx`)**
- *File Placement:* `src/components/common/Header.tsx`.

- Apply the structure from @header-component.md.

- *Desktop View*
    - *Right:* Logo with showText={true}.
    - *Center:* Navigation buttons (Add Property, etc.) using the Button component from FormFields.
    - *Left:* User greeting (dynamic phrase) and Logout button.

- *Mobile View (The Drawer)*
    - Implement isMenuOpen state with useEffect to lock body scroll.

    - *Drawer Content:*
        - Section 1: helloUser string.
        - Section 2: Main Nav links.
        - Section 3: Footer Integration: Move "Contact Us", "Share", "Accessibility", and "Terms" into the drawer (Grid layout).
        - Section 4: Logout.
        - Section 5: Version (from fixedParameters) & Copyright (Dynamic year).

**Step 3: Platform & Navigation Logic**
- *Capacitor Integration*
    - Use @capacitor/browser for external links (Share/App store) inside the mobile drawer.

- *Routing*
    - Use useNavigate for internal routing.
    - Ensure "Add Property" handles the /property replace logic as per existing code.

**Step 4: Styling (Tailwind)**
- Implement backdrop-blur-md and sticky positioning.

- Use animate-in Tailwind-like classes for the Mobile Drawer slide-down effect.

- Ensure RTL support for all flex and grid containers.

**Step 5: API & Store Infrastructure (The Engine)**
- Zustand Store Actions

- Logout Flow:
    1. Call `authService.logout()` (API).
    2. Call `userStore.logout()` (Client state reset).
    3. `utilService.deleteFromStorage('token')`.
    4. Navigate to `/login`.

- Service Layer Helpers
    - Ensure `http.service.ts` correctly pulls the token from `localStorage` for every request.
     

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