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

### [2026-05-24] AI Pre-Flight Questions — STOP-AND-ASK Gate

*AI says:*

After reading `HomePage.tsx`, `userService`, `propertyService`, `user.slice.ts`, `types/index.ts`, and all sub-component files, I identified the following gaps that must be resolved before writing any code.

---

**Q1 — `userService.getHome` — API method & response shape**

The plan calls `userService.getHome(false)` (light) and `userService.getHome(true)` (full), but this method **does not exist** in `user.service.ts` today. The service only has `fetchSplash` and `updateUser`.

- What is the backend endpoint? (e.g. `GET /user/home?full=true`)
- What does the response look like? Does it return `{ properties: Property[], cities: string[], bestYields: Property[] }` or something else?
- Should `getHome` be added to `user.service.ts`, or does it belong in a new `home.service.ts`?

> *Your answer:* Keep this in user.service.ts as it represents the user's personalized dashboard.

API Endpoint: GET /api/user/home?fullData={boolean}&platform=web

Implementation Details:
1. Response Handling: The API returns a large object where the most important keys for the UI are:
- properties: An array of property objects.
- bestYields: (Only in fullData=true) An array of properties sorted by performance.
- fullData: Boolean indicating the fetch phase.
2. Data Model for Property: Note that when fullData=true, the property objects are enriched with calc... fields (e.g., calcRentPercent, calcEquity, calcAmortizationSchedule). Your interfaces must support these optional calculated fields.
3. Service Logic:
```TypeScript
async getHome(fullData: boolean) {
  const response = await httpService.get(`/user/home`, { 
    params: { fullData, platform: 'web' } 
  });

  // Update the Zustand store using setHome
  store.setHome(response.data);

  return response.data;
}
```
4. Zustand Store (user.slice.ts): - Ensure the setHome action handles the merging logic.
- When fullData: false arrives, it populates the basic list.
- When fullData: true arrives, it should update the properties with their calculated values and populate the bestYields array.

UI Strategy:
- In Phase 1 (fullData=false), render the list and the city filter using the basic city field in each property.
- In Phase 2 (fullData=true), the UI should reactively update to show the yields, charts, and the "Best Yields" section once the calculated data arrives.

---

**Q2 — `Property` shape: `id` vs `uuid`, and `city` display name**

Two sub-questions:

a) The plan says navigate to `/property?propertyUUID={uuid}`, but the `Property` type (and current code) uses `id`, not `uuid`. Current navigation in `HomePage` is `/property/${propertyId}` (path param). Which is correct going forward — query param `?propertyUUID=` or path param `/:propertyId`? Should `Property.id` be renamed to `Property.uuid`?

b) The plan says to display `bestProperty.city` in `HomeBestYields` — but `city` is a key like `"ashdod"`, not a Hebrew label. Should the city key be resolved to a Hebrew display name using `useSplash` / `fixedParameters.cities` in `HomeBestYields`, or is the raw key acceptable there?

> *Your answer:* a) `?propertyUUID=`; b) `fixedParameters.cities[bestProperty.city]`

---

**Q3 — `UserSlice` / store shape for `home` data**

The plan says:
- User Slice: `home` stores `{ properties, cities, bestYields }`; `setHome(data)` updates state and sets a `fullData` flag.
- App Slice: `setLoading(boolean)` tracks global Phase 1 loading.

Currently `user.slice.ts` only has `completeTour`. `app.slice.ts` presumably has `isLoading` / `setLoading` (used in `HomePage` today).

- Should I add `home`, `setHome`, and a `fullData` boolean to `user.slice.ts`?
- Or should a new `home.slice.ts` be created (to keep home-specific state isolated)?
- Is `cities` in the store a `string[]` of city keys, or a richer `{ key, value }[]` shape?

> *Your answer:* 1. Store Location: Create a dedicated home.slice.ts.

Since the home data (properties, best yields, and forecasts) is the core feature of the app and is distinct from profile/auth metadata, isolating it into its own slice follows our Separation of Concerns principle and prevents the user.slice from becoming a "mega-slice."

2. Store Shape: Add the following to home.slice.ts:
- properties: Property[] - The main array of properties.
- bestYields: Property[] | null - Populated only during Phase 2.
- fullData: boolean - Initialized as false, set to true once the Phase 2 fetch completes.
- setHome(data: HomeResponse) - An action that merges data.
    - Note: It should intelligently merge Phase 2 calculations into existing Phase 1 properties (matching by uuid) to preserve UI state.

3. The cities Data Shape: Do not store cities as a pre-computed array in the store. Instead, compute uniqueCities as a derived state (selector) within the component or a hook.
- Logic: Extract unique city keys from the properties array.
- Format: Keep them as raw keys (e.g., "ashdod", "tel_aviv_yafo").
- Rendering: Use utilService.getPhrase(cityKey) inside the HomeCities component to render the human-readable Hebrew name. This ensures that if a property's city is updated, the filter list updates automatically.
4. Loading State: Continue using app.slice.ts for the global isLoading (Phase 1). Use the local fullData flag in home.slice.ts to manage the "Calculating..." overlays for Phase 2.

---

**Q4 — `propertyService.archive` — endpoint & optimistic update**

The plan says: *"On confirmation: Call `propertyService.archive` and optimistically update the local store."*

`propertyService` today has `getById`, `create`, `save` — no `archive`. The current code just filters state locally (no API call on delete).

- What HTTP method and endpoint does `archive` use? (e.g. `DELETE /property/{uuid}`, or `PUT /property/archive` with a body?)
- "Optimistically update the local store" — does this mean: remove from local properties list immediately on user confirm (before the API resolves), then roll back on error? Or fire-and-forget?

> *Your answer:* `router.patch('/:propertyId/archive', requireAuth, requireOwner, archiveProperty)` 

---

**Q5 — `HomeWelcome` props: `canStartTour` vs current `showTour` / `setShowTour`**

The plan says: `<HomeWelcome canStartTour={canStartTour} />` — a single prop.

But the current `HomeWelcome` signature is:
```ts
{ onAddPropertyPress, showTour, setShowTour }
```
It internally manages the tour timer, scroll, and `WelcomeTour` rendering.

- Should `HomeWelcome` be refactored to accept only `canStartTour` (and own all its tour state internally via Zustand)?
- Or should the current props remain and `canStartTour` be an additional prop?
- `onAddPropertyPress` currently navigates to `/property/new` — does this stay, or does the route change (see Q2)?

> *Your answer:* 1. Refactor Strategy:
Refactor HomeWelcome to be more self-contained. It should receive canStartTour as a prop, but manage its own internal "active" state.

2. Prop Signature:
The updated signature should be:

```TypeScript
{ onAddPropertyPress, canStartTour }
``` 

canStartTour: This is the logic-gate passed from HomePage (!user.tourCompletedTime).

Internal State: HomeWelcome should use a local useState (e.g., isTourActive) to control the visibility of the WelcomeTour overlay. It handles its own timer (2s delay) and scrolling logic internally.

Zustand Integration: When the tour is finished or dismissed, HomeWelcome should call the completeTour() action from your new user.slice (or home.slice) to persist the state.

3. Navigation (onAddPropertyPress):
The route stays /property/new.

Ensure that onAddPropertyPress is passed down from HomePage and correctly triggers the navigation.

Note: Even if the user is in "Tour Mode," clicking the button should trigger this same navigation, effectively ending the tour and moving the user into the creation flow.

4. Why this way?
By passing canStartTour instead of a raw showTour boolean, you allow HomeWelcome to decide when and how to start the sequence (handling the scroll-into-view and delay) without cluttering the HomePage with timer logic.

---

**Q6 — Delete confirmation: `Modal` component vs current inline overlay**

The plan says: *"Trigger the `Modal` component with `home_delete_confirm_title`."*

But the existing `HomeCityProperties` card already implements an inline overlay (confirm/deleting states) — no external `Modal` used.

- Should the inline overlay be **replaced** with the shared `Modal` component from `src/components/common/Modal.tsx`?
- Or is the existing inline overlay acceptable and the plan just described the UX intent (not a hard requirement to use `<Modal>`)?

> *Your answer:* Stick to the AI Studio design (Inline Overlay).

Do not replace the existing logic with the shared Modal component. The project requirement is to remain strictly aligned with the AI Studio visual language, which uses an inline confirmation overlay directly on the property card.
1. Preserve Inline Logic: Keep the confirm and deleting states within the property card component.
2. Visual Consistency: Ensure the overlay styling (colors, blur, and buttons) matches the raw AI Studio output exactly.
3. Phrase Integration: Even though it's an inline overlay, you must still use utilService.getPhrase for the confirmation text (e.g., home_delete_confirm_title) instead of hardcoded strings.

---

**Q7 — Swipe-to-refresh (Step 4) — in scope for this task?**

The plan includes a touch-event pull-to-refresh listener for mobile. This requires native touch event wiring and is fairly independent of the data-loading refactor.

- Is swipe-to-refresh in scope now, or deferred to a later mobile-focused task?

> *Your answer:* We want to ensure a high-end mobile experience from the start. Please implement the touch-event listener as planned:
1. Trigger: Detect a pull-down gesture when the user is at window.scrollY === 0.
2. Action: It should trigger the Phase 1 loading (userService.getHome(false)).
3. Visuals: Use a simple, clean Tailwind-styled indicator (like a rotating Loader2 icon or a subtle bounce effect) to show the refresh is active.
4. Optimization: Ensure the touch listeners are passive and cleaned up properly on component unmount to maintain performance.

---

> **STOP.** I will not write any code until you answer the above questions and give the explicit green light.

---

### [2026-05-24] Implementation — Green Light Received

**Decisions locked from Q&A:**

| # | Decision |
|---|----------|
| Q1 | `userService.getHome(fullData)` → `GET /user/home?fullData={bool}`. Service calls `setHome` on the store before returning. Added to `user.service.ts`. |
| Q2a | `Property.id` renamed to `Property.uuid` across all types and components. Navigation uses query param: `/property?propertyUUID={uuid}`. |
| Q2b | City key resolved to Hebrew label in `HomeBestYields` via `useSplash` params (`fixedParameters.cities` JSON array). |
| Q3 | New `home.slice.ts` with `properties`, `bestYields`, `fullData`, `setHome` (Phase 2 merges by uuid), `removeProperty`, `restoreProperty`. `cities` computed in component, not stored. |
| Q4 | `propertyService.archive(uuid)` → `PATCH /property/:uuid/archive`. Optimistic: remove from store immediately, roll back on error. |
| Q5 | `HomeWelcome` refactored to `{ onAddPropertyPress, canStartTour }`. Internal `isTourActive` state + timer. `setShowTour` removed from `AppSlice` dependency in `HomeWelcome`. |
| Q6 | Inline overlay kept (not `<Modal>`). All strings via `getPhrase`. |
| Q7 | Swipe-to-refresh implemented with passive `touchstart`/`touchend` listeners, 80px threshold, `Loader2` pull indicator. |

**Files changed:**

- `src/types/index.ts` — `Property.id` → `uuid`; added `HomeResponse`
- `src/store/slices/home.slice.ts` — NEW
- `src/store/store.ts` — `HomeSlice` composed into `RootState`
- `src/services/user.service.ts` — added `getHome`
- `src/services/property.service.ts` — added `archive`
- `src/components/layout/HomeWelcome.tsx` — props `{ onAddPropertyPress, canStartTour }`; internal `isTourActive`
- `src/components/layout/HomeBestYields.tsx` — city key resolved via `useSplash` params
- `src/components/layout/HomeCityProperties.tsx` — `uuid`, `isCalculating` prop, "מחשב..." state for Phase 2
- `src/pages/HomePage.tsx` — full refactor: dual-phase load, store-driven, swipe-to-refresh, optimistic delete, phrase-driven labels