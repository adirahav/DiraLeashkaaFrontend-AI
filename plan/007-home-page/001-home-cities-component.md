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

### [2026-05-23] AI Pre-Flight Questions — STOP-AND-ASK Gate

*AI says:*

After reading the existing `HomeCities.tsx`, `HomePage.tsx`, `property.slice.ts`, and the component spec, I identified the following gaps that must be resolved before writing any code.

---

**Q1 — Store integration scope for `selectedCity` and `properties`**

The plan says to connect to `useStore` to pull both `properties` and `selectedCity`. However:
- `selectedCity` is currently a `useState` local to `HomePage`.
- `properties` is also a local `useState` in `HomePage` (seeded from mock data).
- The existing `property.slice.ts` has only `currentProperty` (a single property), not a list or a selected-city field.

**Options:**
- **A)** Keep the component purely prop-driven (`cities`, `selectedCity`, `onSelectCity` as props) — `HomePage` continues to own the state. Only the button-display logic lives in `HomeCities`. *(Minimal change, safest for now.)*
- **B)** Add `selectedCity` (and optionally a `properties` list) to `property.slice.ts`, then have `HomeCities` subscribe directly. *(Bigger store change; required if other pages need to read `selectedCity`.)*

**Which option?** Or should a new `home.slice.ts` be created?

> *Your answer:* (A) Keep the component purely prop-driven.

The component should act as a Stateless Presentational Component. It will not subscribe to the Zustand store directly. Instead, the HomePage will manage the selectedCity and properties state locally and pass them down via props.

Reasoning:
- Decoupling: Keeping the component "dumb" allows it to be reused in different contexts (like search modals or filters) without being hard-bound to the Home page logic.
- Architectural Consistency: Following the decision made for PropertyMetrics, we avoid bloating the property.slice with list-filtering logic, which is distinct from the "single property" focus of that slice.
- Performance: Local state updates for UI filtering are more efficient and prevent unnecessary global store re-renders.

---

**Q2 — City data shape: keys vs. Hebrew display names**

The plan says `HomeCities` receives city **keys** (e.g., `"ashdod"`) and resolves Hebrew labels via `fixedParameters.cities.find(c => c.key === cityKey).value`.

But in `HomePage.tsx` today, `cities` is derived as:
```ts
Array.from(new Set(properties.map((p) => p.city)))
```
…where `p.city` is a Hebrew string like `"תל אביב"`.

**Question:** Are `Property.city` values already **keys** (e.g., `"tel_aviv_yafo"`), or are they **Hebrew display names** (e.g., `"תל אביב"`)?

If they are Hebrew names, the fixedParameters mapping won't work as described — we'd be passing the label as the key. Please clarify the actual shape of `Property.city` so the mapping logic is correct.

> *Your answer:* `Property.city` values are already keys.

---

**Q3 — `fixedParameters.cities` — where does it come from?**

The plan references `fixedParameters.cities`, but `fix-parameter-usage.md` describes accessing parameters via `useSplash().getParam(key, default)`. There is no `fixedParameters` object imported directly in the current codebase.

**Question:** How is `fixedParameters.cities` accessed in this component?
- Via `useSplash().getParam('cities', [])`?
- Via a direct import from a constants file?
- Via some other context/hook?

Please clarify the exact API so the component uses the correct pattern.

> *Your answer:* `useSplash().getParam('cities', [])`

---

**Q4 — Local city icon assets**

The plan says to load icons from `/assets/images/icon_city_${cityKey}.png`. The raw component uses remote Render.com URLs instead.

**Question:** Do these `.png` files already exist in the local `src/assets/images/` folder? If not, should I:
- **A)** Default to `MapPin` fallback immediately (since images don't exist yet) and leave the path as a placeholder for later?
- **B)** Download/copy the remote images into the local assets folder as part of this task?

> *Your answer:* I added the images to the `src/assets/images/` folder.

---

**Q5 — Scroll reset when city changes**

The plan says: *"when the city is changed, the scroll position of the property grid is reset to the top/right."*

`HomeCityProperties` is a sibling component rendered in `HomePage`. There is no current scroll-reset mechanism.

**Question:** What is the preferred implementation strategy?
- **A)** A `key={selectedCity}` prop on `HomeCityProperties` (React unmount/remount resets scroll automatically)?
- **B)** A `ref` forwarded into `HomeCityProperties` with an imperative `scrollTo(0, 0)` call triggered from `onSelectCity`?
- **C)** A Zustand store action that a scroll listener inside `HomeCityProperties` watches?

> *Your answer:* (A) Use a key={selectedCity} prop on the HomeCityProperties component.

Reasoning:
- Declarative & Native: Changing the key is the most idiomatic way in React to signal that a component's identity has changed. This forces a clean unmount/remount, which natively resets the scroll position of the container to (0,0) without needing imperative refs or manual DOM manipulation.
- Predictability: It ensures that every time a user switches cities, they start from the very beginning of the new list, providing a consistent UX.
- Simplicity: Avoids the overhead of managing useImperativeHandle or adding scroll-logic listeners to the global Zustand store.

---

> **STOP.** I will not write any code until you answer the above questions and give the explicit green light.

---

### [2026-05-23] Implementation — Green Light Received

**Decisions locked from Q&A:**

| # | Decision |
|---|----------|
| Q1 | Purely prop-driven (`cities`, `selectedCity`, `onSelectCity`). No Zustand subscription. |
| Q2 | `Property.city` values are city keys (e.g. `"ashdod"`). Mock data in `HomePage.tsx` updated accordingly. |
| Q3 | `useSplash().params` — cast to `Record<string, unknown>` → read `params['cities']` (JSON array). `getParam` not used (it only handles numbers). |
| Q4 | Images exist in `src/assets/images/`. Loaded via `import.meta.glob` (Vite eagerly bundles all `icon_city_*.png`). `onError` + `brokenIcons` state provides `MapPin` fallback. |
| Q5 | `key={selectedCity ?? ''}` on `HomeCityProperties` — React unmount/remount resets scroll declaratively. |

**Files changed:**
- `src/components/layout/HomeCities.tsx` — full refactor
- `src/pages/HomePage.tsx` — mock city keys updated; `key=` added to `HomeCityProperties`

**Key implementation notes:**
- `import.meta.glob('../../assets/images/icon_city_*.png', { eager: true, import: 'default' })` at module level so Vite includes all city images in the bundle.
- A `CITY_ICONS: Record<string, string>` map is derived from the glob result by extracting the city key from the filename.
- City labels resolved via `params['cities']` (JSON `{ key, value }[]` from `fixedParameters`) inside a `useMemo`.
- `cn()` utility used for conditional class merging on the `Button`.
- `whileTap={{ scale: 0.98 }}` per spec; `whileHover` omitted (not listed in spec).
- No Zustand store changes required.