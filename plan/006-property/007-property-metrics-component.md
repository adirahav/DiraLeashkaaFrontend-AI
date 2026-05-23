# Plan: PropertyMetrics - Extraction & Refactor

## Task Overview
Refactor `PropertyMetrics` into a high-performance, Read-Only Data Component. It serves as the primary financial anchor, providing immediate feedback on the property's investment viability.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-metrics-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Guard**
- *Component Definition:* Pure component receiving 6 specific props (yield, mortgage, percents, repayment, isScrolled).

- *Visibility Guard:* Ensure the Parent component handles the conditional rendering based on mandatory fields (`price`, `apartmentType`, etc.) to keep this component clean.

- *Phrases:* Access `phrases` via `useSplash`.

**Step 2: Component Refactor (PropertyMetrics.tsx)**
- Apply the structure from @property-metrics-component.md.

- *Composition:*
    - Container: Use `grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4`.
    - Scroll Logic: Apply `transition-all duration-300` and use the cn utility to toggle scaling/padding based on the `isScrolled`+ prop.

- *Metric Rendering:*
    - Map the data points to the `MetricCard` component (reusing the logic from @metric-card-component.md).
    - Dynamic Variants: Pass the correct variant (`emerald`, `blue`, `indigo`, `slate`, or `rose`) based on the financial threshold logic.

**Step 3: Data Mapping & Formatting**
- *Formatting:* Strictly use the imported `formatCurrency` and `formatPercent` from `utilService`.

- *Logic:* Ensure no formatting happens inside `PropertyMetrics`; it simply passes formatted `ReactNode` or raw numbers to the `MetricCard`.

**Step 4: Styling & RTL (Tailwind)**
- *Layout:* Ensure `grid-cols-2` on mobile to maintain readability, jumping to `grid-cols-4` on desktop.

- *RTL:* Rely on the `dir="rtl"` at the root and Tailwind's logical properties.

## State Management Check (Zustand)
- *Data Flow:* The component is purely "Driven by Props".

- *Parent Responsibility:* The Parent component (e.g., `PropertyDetails`) must select the specific data points from the `property.slice`:
    - `totalYield10y` should be derived from `calcYieldForecast[119].yieldOnEquity`.
    - `isScrolled` should be derived from the UI layout state.


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
    
*AI says:* [2026-05-20]

## Pre-Flight Clarifying Questions

Before generating any code, I need answers to the following questions. **I will not proceed until you give explicit approval.**

---

### Q1 — Phrase Keys: Do they exist in splash data?

The spec references 4 phrase keys:
- `property_yield_label`
- `property_mortgage_required_label`
- `property_financing_percentage_label`
- `property_monthly_repayment_label`

The **current** `PropertyMetrics.tsx` uses hardcoded Hebrew strings (`"תשואה (10 שנים)"`, `"משכנתא נדרשת"`, etc.).

**Question:** Are these phrase keys already registered in the backend splash data?
- **(A)** Yes — they exist, use `getPhrase('key')` directly.
- **(B)** No — use `getPhrase('key', 'Hebrew fallback')` pattern with the current Hebrew as the fallback.
- **(C)** Skip `useSplash` for now — labels stay hardcoded until phrase keys are provisioned.

> *Your answer:* (A) Yes — they exist! Use getPhrase('key', 'English fallback') directly with a clean English string as the fallback parameter, matching our established localization pipeline strategy.

Reasoning:
- Since the system has already provisioned these keys in the backend localization dictionaries, we can immediately swap out the old hardcoded strings ("משכנתא נדרשת", etc.) for dynamic translation hooks.
- Fallback Alignment: In line with our core architectural decisions for the graphs and media sections, we will pass an explicit English translation string as the secondary parameter to getPhrase. This guarantees that if a dictionary token fails to load, the metric widgets will still display clean, fallback labels instead of breaking.

---

### Q2 — Field Name Mismatch: `yieldOnEquity` vs `returnOnEquity`

The spec says:
> `totalYield10y` should be derived from `calcYieldForecast[119].yieldOnEquity`

But in `YieldForecastRow` (property.types.ts:29) the field is **`returnOnEquity`**, and `PropertyPage` already correctly reads `forecastData[119].returnOnEquity`.

**Question:** Which is the source of truth?
- **(A)** Keep `returnOnEquity` — the spec has a stale field name, no rename needed.
- **(B)** Rename `returnOnEquity` → `yieldOnEquity` everywhere (type, PropertyPage, forecast logic).

> *Your answer:* (A) Maintain returnOnEquity as the absolute source of truth. The specification contains a stale field reference; no broad system renames are required.

Reasoning:
- Mitigating Regression Risks: Altering a core mathematical calculation key like returnOnEquity $\rightarrow$ yieldOnEquity across types, analytical data parsers, and API engines introduces high technical debt and severe regression risks.
- Seamless Field Alignment: The parent page component (PropertyPage.tsx) and the TypeScript dictionary structures are already perfectly integrated and operating on returnOnEquity. Choosing Option A enables an immediate, clean data bridge straight into the metrics dashboard layer without unnecessary structural engineering.

---

### Q3 — `compact` prop: keep or remove?

`MetricCard` has two rendering modes: default (large card, used standalone) and `compact` (used inside the sticky header). `PropertyMetrics` currently always passes `compact={true}`.

The spec/plan does not mention `compact` at all.

**Question:** Should `compact` remain?
- **(A)** Keep as-is — `PropertyMetrics` always renders with `compact={true}`.
- **(B)** Remove `compact` entirely from `MetricCard` — fold the compact styling into `isScrolled` toggling only.
- **(C)** Rename `compact` to something clearer (e.g., `size="sm"`), keeping the two-mode rendering.

> *Your answer:* (B) Claude must purge the static compact flag from the mapping architecture and ensure MetricCard (or the direct inline card refactor inside PropertyMetrics) reacts solely to the active layout lifecycle variable:

---

### Q4 — `amber` variant: keep or align with spec?

`metric-card-component.md` documents only 4 variants: `emerald`, `blue`, `indigo`, `slate`.  
But Metric 4 (Monthly Repayment) currently uses **`amber`**, which is already implemented in `MetricCard.tsx`.

**Question:** What variant should Monthly Repayment use?
- **(A)** Keep `amber` — it's already in MetricCard, just not documented in the spec (update spec accordingly).
- **(B)** Change to `slate` or another documented variant.

> *Your answer:* (A) Retain the amber variant for the Monthly Repayment card. Treat the specification file documentation as outdated regarding the allowed variant type values.

Reasoning:
- Visual Hierarchy: Keeping the distinct warm amber tone highlights the property's ongoing operational liability, keeping it cleanly separated from initial structural leverage ratios or growth yields.
- Fidelity to Tested Code: The source layout configurations in AI Studio explicitly wire variant="amber". Overriding this back to slate downgrades the dashboard's design depth.

---

### Q5 — SCSS file: create or skip?

The ui-component-layer skill mandates `src/assets/css/components/[name].scss` for every component. No SCSS exists for `PropertyMetrics` or `MetricCard`. Both are pure Tailwind with no custom CSS needed.

**Question:** How should we handle this?
- **(A)** Create minimal SCSS stubs (just `@import '../vars';`) to satisfy the mandate.
- **(B)** Skip SCSS files for Tailwind-only components — the mandate applies only when custom CSS is needed.

> *Your answer:* (B) Skip creating SCSS files entirely for these Tailwind-only components. The layout mandate applies only when custom style rules are needed.

Reasoning:
- Eliminating Dead Files ("אין CSS"): You are 100% correct. If a component is entirely styled using responsive Tailwind utility classes, forcing an empty or stubbed .scss file into the asset tree creates unneeded file clutter and maintenance overhead.
- Tailwind-First Architecture: Modern component decoupling aims to keep styles embedded directly within the markup whenever possible. By skipping the unnecessary stylesheets, we ensure the project remains lightweight, readable, and strictly utility-driven.

---

### Q6 — Zustand migration: in scope?

The plan's "State Management Check" says parent should select data from `property.slice`, but `PropertyPage` uses local `useState` throughout (no Zustand property slice exists yet).

**Question:** Is migrating `PropertyPage` state to Zustand in scope for **this** task?
- **(A)** No — `PropertyMetrics` stays purely props-driven; Zustand migration is a separate task.
- **(B)** Yes — create `property.slice` and wire `PropertyPage` to Zustand as part of this task.

> *Your answer:* (A) — No! The Zustand migration is completely out of scope for this task. ### Architectural Reasoning

- Strict Separation of Concerns: Introducing an entire global property slice, refactoring the complex state lifecycle of PropertyPage.tsx, and migrating all calculation triggers to Zustand would completely alter the scope of this visual extraction.

- Clean Prop-Driven Strategy: As confirmed by the AI Studio source code, PropertyMetrics works perfectly as a pure presentation component driven entirely by raw props. We will keep this implementation lean, fast, and light. The parent component will manage and feed its local state values right down into it, keeping the codebase simple and ready for any future store migrations in a separate task.

---

**STOP — awaiting your answers before any code is written.**

---

*AI says:* [2026-05-21] — Green light received. Decisions locked:

| # | Decision |
|---|----------|
| Q1 | `getPhrase('key', 'English fallback')` — keys exist in backend |
| Q2 | Keep `returnOnEquity` — spec field name is stale |
| Q3 | Remove `compact` prop entirely — `isScrolled` is the single layout driver |
| Q4 | Keep `amber` variant for Monthly Repayment |
| Q5 | No SCSS files — Tailwind-only components exempt |
| Q6 | Zustand migration out of scope — props-driven only |

**Proceeding to implementation.**