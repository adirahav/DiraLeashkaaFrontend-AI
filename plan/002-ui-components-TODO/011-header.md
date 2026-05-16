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

---
### [2026-05-16] — AI Pre-Flight Questions (STOP-AND-ASK Gate)

*AI says:*

I have read the full plan, the `header-component.md` spec, the existing `Header.tsx`, `Footer.tsx`, `auth.slice.ts`, `platform.utils.ts`, and `App.tsx`. Here are my clarifying questions before I touch any code.

---

**Q1 — Logout navigation target**

The plan (Step 5) says: after logout, navigate to `/login`.
The current `Header.tsx` does: check `authService.getLastLoggedinEmail()` → navigate to `/login` if an email exists, or `/signup` if not.

**Which behavior should the refactored header use?**
- (A) Always navigate to `/login` (as the plan states), discarding the last-email check.
- (B) Keep the existing "smart" routing: `/login` if a last-email exists, otherwise `/signup`.

> *Your answer:* (B) Keep the existing "smart" routing: `/login` if a last-email exists, otherwise `/signup`

---

**Q2 — `isLoggedinUserCompleted` — does this field exist?**

Step 1 says to pull `isLoggedinUserCompleted` from `userModule`. This field does **not** exist in the current `AuthSlice` (`src/store/slices/auth.slice.ts`). The slice only has `loggedinUser` and `token`.

**What should I do?**
- (A) Add `isLoggedinUserCompleted: boolean` to `AuthSlice` and set it based on profile completeness (e.g., user has financial details). If yes — what is the completeness condition?
- (B) Ignore this field for now; it is not needed by the Header's current feature set.
- (C) Other — please specify.

> *Your answer:* (A/C Hybrid) — Derive the completeness state directly inside the Header using the existing getNextOnboardingStep utility, without modifying the Zustand store structure.

Reasoning:
- Single Source of Truth: Your application already has a robust utility (getNextOnboardingStep) that evaluates whether a user has filled out their personal info, financial details, and consent. Re-implementing a new boolean flag in Zustand would create redundant state sync management.
- Header Context: If a user is currently stuck in the onboarding funnel (e.g., they haven't finished filling out their financial details), they should not see the main navigation buttons in the Header (like "Add Property" or calculators). The header should remain clean and minimal until they reach /home.
- Clean State: Keeping this derived state inside the component or as a simple local memoized value (useMemo) keeps the AuthSlice lean and focused strictly on the core primitives: loggedinUser and token.

Implementation Instructions for Claude (Header Implementation):
1. Derive the Completeness State:
    Inside Header.tsx, import getNextOnboardingStep from src/utils/user.utils.
    ```TypeScript
    const loggedinUser = useStore((state) => state.loggedinUser);

    // The user is fully completed if the next onboarding step is the home screen
    const isLoggedinUserCompleted = loggedinUser ? getNextOnboardingStep(loggedinUser) === '/home' : false;
    ```

2. Conditional Navigation Rendering:
    - If isLoggedinUserCompleted is true: Render the full desktop navigation center actions and all links in the Mobile Drawer.
    - If isLoggedinUserCompleted is false: Hide the internal functional links (Calculators, Data, Add Property). Render only the Logo, User Greeting, and the Logout button. This ensures a user cannot bypass the onboarding screen via header buttons.

3. Visibility Guard (Auth Screens):
    Ensure the main visibility check utilizes the location pathname:
    ```TypeScript
    const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
    if (isAuthPage) return null;
    ```

4. RTL and Drawer Architecture:
    - Use the cn utility to toggle body scrolling via isMenuOpen inside a useEffect.
    - Build the responsive wrapper using Tailwind's interactive state utilities (backdrop-blur-md sticky top-0 z-50 bg-white/80).

---

**Q3 — `showNavigation` guard: redundant or intentional?**

Step 1 says to hide the header on `/login`, `/signup`, and `/forgot-password`. However, those three routes live **outside** `<AppLayout>` in `App.tsx` — `<Header>` never renders there to begin with.

**Should I still add an internal pathname check inside `Header.tsx`?**
- (A) Yes — add a defensive check (`if (isAuthRoute) return null`) as a safety net.
- (B) No — the routing already handles this; no check needed inside the component.

> *Your answer:* (A) Yes — Include defensive routing guards inside Header.tsx.

Reasoning:
- Defensive Architecture: While the current router configuration layout cleanly separates auth pages from the authenticated app layout, relying solely on layout structure for visibility constraints introduces fragile dependencies.
- Self-Contained Logic: A robust component should know its own constraints. Adding a simple condition checking location.pathname guarantees that even if the high-level application layout shifts in future refactors, the header will remain safely hidden on core onboarding/auth gateways.

What Claude should implement:
1. Use useLocation() from react-router-dom to grab the current path.
2. At the very top of the render block, evaluate if the route is an auth view:
    ```TypeScript
    const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
    if (isAuthPage) return null;
    ```

---

**Q4 — Mobile Drawer footer section: reuse `<Footer>` or inline `getFooterData`?**

Step 2 says to move "Contact Us, Share, Accessibility, Terms" into the mobile drawer (Section 3). The existing desktop `<Footer>` already renders those via `getFooterData` + `useSplash`.

**How should the drawer consume this data?**
- (A) Import and call `getFooterData` directly inside `Header.tsx` (same pattern as `Footer.tsx`) — keeps Header self-contained.
- (B) Extract a shared `<FooterLinks>` sub-component that both `Footer.tsx` and `Header.tsx` use — avoids duplication.
- (C) Keep them independent (copy logic inline in Header) — simplest but duplicates code.

**Also:** after adding them to the drawer, should the desktop `<Footer>` **remove** those links (since they're now in the drawer on mobile), or should it keep them unchanged?

> *Your answer:*
1. Data Retrieval: Choose (A) — Import and execute the getFooterData utility function inside Header.tsx to handle the Drawer’s footer items. Do not create a shared UI sub-component, as the visual layouts (Desktop row vs. Mobile drawer grid) are inherently different.
2. Desktop Footer Status: Keep the desktop <Footer> component completely unchanged. Since the Footer uses hidden md:block and is entirely omitted on mobile screen sizes, there is no visual redundancy or conflict for the end-user.

Final Instructions:
- Call getFooterData(phrases, fixedParameters) within the mobile view logic inside Header.tsx.
- Layout the extracted links ("Contact Us", "Share", "Accessibility", "Terms") in a neat Grid/Flex layout matching the mobile design design system inside the slide-down/slide-in drawer structure.
- Render the dynamic copyright year and version string at the very bottom of the drawer sheet.

---

**Q5 — SCSS file required or Tailwind-only?**

The `ui-component-layer` SKILL says styles must live in `src/assets/css/components/header.scss`. But the current `Header.tsx` (and `Footer.tsx`) are 100% Tailwind with no separate SCSS file.

**Should I create `src/assets/css/components/header.scss`?**
- (A) Yes — create the SCSS file and move the modifier classes (`is-open`, `is-scrolled`) there as per the spec.
- (B) No — stay Tailwind-only, consistent with what Footer already does. SCSS creation is out of scope for this task.

> *Your answer:* (B) Stay Tailwind-only.

Reasoning:
- Architecture Consistency: Just like the decision made for the Footer component, creating a standalone SCSS file for the Header would fragment the layout styling approach. Since the rest of the existing application layers utilize standard utility classes and the cn orchestration helper, keeping the component 100% Tailwind is the ideal path forward.
- Modern State-Handling: Dynamic styles such as is-open or is-scrolled are cleanly implemented natively in Tailwind via conditional strings inside cn(...), standard boolean conditions, or inline layout state attributes, which negates the structural need for an external stylesheet.

Final Instructions:
1. Tailwind Selection: * Do not create any .scss file.
    - Orchestrate state-driven styling dynamically via the standard utility composition pattern:
    ```TypeScript
    className={cn(
    "sticky top-0 z-50 w-full transition-all duration-200",
    isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}
    ```
2. State Extraction (Zustand & Context Integration):
    - Fetch authenticated user information (loggedinUser) from the useStore core hook.
    - Parse application translations (getPhrase) and platform parameters (fixedParameters) using the reactive application hook layer (useSplash).
    - Use useLocation() to detect current routes and auto-close the mobile sheet via a clean React hook layout interaction.
3. Completeness & Guard Logic (Derived via Q2 & Q3):
    - Determine user state completion locally by evaluating getNextOnboardingStep(loggedinUser) === '/home'.
    - Hide all interactive system navigation elements if the user is stuck in the onboarding sequence.
    - Add defensive path matching to instantly return null if the user hits auth entry nodes (/login, /register, /forgot-password).
4. Mobile Sheet Footer Mechanics (From Q4):
    - Extract structural variables dynamically using the logical data parsing tier (getFooterData(phrases, fixedParameters)).
    - When rendering the responsive grid at the bottom section of the interactive sheet wrapper, place the external trigger configurations directly inline. Use @capacitor/browser for safe native target system browser triggers.
    - Keep the standalone desktop <Footer /> layout unchanged.

---

**Q6 — "Add Property" replace-navigation logic**

Step 3 mentions: *"Ensure 'Add Property' handles the `/property` replace logic as per existing code."*  
The current `Header.tsx` navigates to `/property/new` with a plain `navigate('/property/new')`. `App.tsx` defines routes `/property/new` and `/property/:id`.

**What is the intended "replace logic"?**
- (A) Use `navigate('/property/new', { replace: true })` so it replaces the current history entry.
- (B) Something else — please describe the intended behavior.

> *Your answer:* (A) Use Maps('/property/new', { replace: true }) for the "Add Property" action.

Reasoning:
- History Stack Integrity: Utilizing { replace: true } prevents the user from getting trapped in an accidental back-button loop. When creating or starting a new form session, replacing the current history entry ensures that sub-navigation inside the wizard or subsequent redirect to the newly created property profile (/property/:id) cleanly overrides the entry node.

What Claude should implement inside Header.tsx:
- For the "Add Property" action click handler, explicitly implement the navigation payload with the replace configuration state:
```TypeScript
const handleAddProperty = () => {
  navigate('/property/new', { replace: true });
  if (isMenuOpen) setIsMenuOpen(false); // Make sure to close mobile drawer if clicked from there
};
```


---

*Waiting for your answers before writing any code.*

---
### [2026-05-16] — Implementation Complete

*AI says:*

All 6 decisions locked in and applied. `src/components/common/Header.tsx` has been fully rewritten.

**What changed from the old Header:**

| Area | Before | After |
|---|---|---|
| UI strings | Hardcoded Hebrew | `getPhrase(key, fallback)` via `useSplash` |
| Onboarding guard | None | `isLoggedinUserCompleted` via `getNextOnboardingStep` — hides nav links during onboarding |
| Auth page guard | Relied on routing alone | Defensive `if (AUTH_PAGES.includes(pathname)) return null` |
| Route auto-close | None | `useEffect` on `location.pathname` closes drawer |
| Share action | `navigator.share` / clipboard fallback | `getFooterData` + `Browser.open` via `@capacitor/browser` |
| App/Web link | Placeholder button | Dynamic `moreUrl` / `moreLabel` from `getFooterData` |
| Version/Copyright | Hardcoded `"גירסה 1.0.4"` | `getPhrase('drawer_version')` + `getParam` via `getFooterData` |
| Add Property nav | `navigate('/property/new')` | `navigate('/property/new', { replace: true })` |
| Logout routing | Smart email check ✅ kept | Same — checks `getLastLoggedinEmail()` → `/login` or `/signup` |
| SCSS | None | None — Tailwind-only (consistent with Footer) |

**Architecture decisions honored:**
- Q1: Smart logout routing kept
- Q2: `isLoggedinUserCompleted` derived locally via `getNextOnboardingStep`
- Q3: Defensive auth guard added inside component
- Q4: `getFooterData` called inline; `Footer.tsx` unchanged
- Q5: Tailwind-only
- Q6: `{ replace: true }` on Add Property