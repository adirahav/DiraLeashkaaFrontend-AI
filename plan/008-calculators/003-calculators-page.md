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

---
### [2026-05-27] AI Pre-Flight — Clarifying Questions

*AI says:*

I've reviewed the existing `CalculatorsPage.tsx` (hardcoded data), `calculatorService.ts`, `store.ts`, `app.slice.ts`, and the other calculator pages for patterns. Before writing any code, I need answers to the following:

---

**Q1 — API Endpoint: Does `GET /api/calculator` (the list endpoint) already exist in the backend?**

The current `calculator.service.ts` only exposes `getMaxPrice`, `updateMaxPrice`, `getCompareList`, and `updateCompareList`. There is no `getAll` / list function. The plan calls for triggering `GET /api/calculator` on mount.
- **(a)** The endpoint exists — I should add a `getAll(): Promise<CalculatorItem[]>` function to `calculatorService`.
- **(b)** The endpoint does NOT exist yet — I should keep the hardcoded data array (already in the page) and skip the fetch for now, wiring the API call once the backend is ready.
- **(c)** Other — please specify.

> *Preference / decision:* (A) The endpoint exists.

---

**Q2 — State Storage: Local state vs. new `calculator.slice`?**

The plan says "local state or a specialized `calculator.slice`." Adding a slice requires touching `store.ts` and `RootState`. The calculators list is only used on this one page.
- **(a)** Local `useState` inside `CalculatorsPage` — simpler, no store changes.
- **(b)** New `calculator.slice` in the Zustand store — consistent with the existing pattern, needed if other pages will read this data.

> *Preference / decision:* (A) Use local useState inside CalculatorsPage.

Reasoning:
The calculators list is a specialized set of metadata used exclusively as a gateway on this specific page. Since this data is not shared with other features (like the Navbar or Profile) and does not require persistence across the entire app session, adding a global Zustand slice would introduce unnecessary "boilerplate" and complexity. Keeping it as local state adheres to the principle of "keeping state as close to the consumer as possible," ensuring cleaner code and optimized performance.

---

**Q3 — Route Prefix & Pattern: What are the correct navigation paths?**

The current code navigates to `/calculators/max-price` and `/calculators/compare`. The plan says to generate routes as `utilService.toKebabCase(calculator.type) + "-calculator"`, which would produce `max-price-calculator` and `compare-calculator`.
- **(a)** Keep existing routes: `/calculators/max-price` and `/calculators/compare` (no `-calculator` suffix).
- **(b)** Use the plan's pattern: `/calculators/max-price-calculator`, `/calculators/compare-calculator`, etc. (implies route definitions also need updating).

> *Preference / decision:* (A) Keep existing routes: `/calculators/max-price` and `/calculators/compare`

---

**Q4 — Description Phrase Key: How should the card description be resolved?**

The plan specifies `calculator_title_${snakeCaseType}` for the title phrase, but does not mention a phrase key for the description text.
- **(a)** Use `calculator_description_${snakeCaseType}` — symmetric with the title pattern.
- **(b)** The description comes from the API response and is used as-is (no phrase lookup for description).
- **(c)** Skip description entirely — the card only shows the title.

> *Preference / decision:* (A) Use `calculator_description_${snakeCaseType}

---

**Q5 — Image Fallback: What to show when the API returns no image?**

The current hardcoded data uses Unsplash URLs. If the API-driven `image` field is null/undefined:
- **(a)** Show a placeholder/gradient background (no `<img>` tag).
- **(b)** Fall back to a local asset from `/src/assets/`.
- **(c)** Keep Unsplash URLs in the service as defaults when the API returns none.

> *Preference / decision:* (A) Show a placeholder/gradient background (no `<img>` tag).

---

*Waiting for your answers before writing any code.*

---
### [2026-05-27] AI — Decisions Logged & Implementation Started

*AI says:*

**Decisions confirmed:**
- Q1 → `getAll()` added to `calculatorService` hitting `GET /calculator`
- Q2 → Local `useState<CalculatorItem[]>` in `CalculatorsPage` (no new Zustand slice)
- Q3 → Route: `/calculators/${toKebabCase(type)}` — produces `/calculators/max-price`, `/calculators/compare`
- Q4 → Phrase keys: `calculator_title_${toSnakeCase(type)}` and `calculator_description_${toSnakeCase(type)}`
- Q5 → Gradient `div` placeholder rendered when `image` is null/undefined

**Files changed:**
1. `src/types/index.ts` — added `CalculatorItem` interface
2. `src/services/calculator.service.ts` — added `getAll()` function
3. `src/pages/CalculatorsPage.tsx` — full rewrite: auth guard, API fetch, `CalculatorCard` internal component, phrase-driven text, gradient fallback