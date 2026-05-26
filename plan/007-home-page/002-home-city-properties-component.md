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

---
### 2026-05-23 — AI Pre-Flight Questions (STOP-AND-ASK Gate)

*AI says:*

Before writing any code I need answers to the following questions. I will not proceed until you explicitly give the green light.

---

**Q1 — Starting Point: Raw AI Studio code vs. existing file?**

The plan says "Import Layout from AI Studio" but `src/components/layout/HomeCityProperties.tsx` already exists with carousel, delete-confirm overlay, and grid logic. Do you have separate raw AI Studio output to migrate/merge, or should I refactor the **existing file** as the base?

- [ ] A — Refactor the existing `HomeCityProperties.tsx` (no raw file to merge)
- [ ] B — There is a separate raw AI Studio file; I will paste/attach it

> *Your answer:* (A) Refactor the existing HomeCityProperties.tsx as the base.

Context: The current file in the project structure was already initialized during the project setup. We will use this existing implementation as our foundation and apply the refactor plan to it to reach production-grade quality.

Refactor Objectives for Claude:
1. Alignment with Logic: Audit the existing file to ensure it strictly follows the Implementation Steps (Carousel intervals, deleteStatus logic, and financial formatting using utilService).
2. Clean Architecture: Replace any remaining local state that should be in the store (like the deletion trigger) with the property.slice actions where appropriate.
3. Tailwind Polish: Ensure the classes match the "High-Fidelity" requirement (RTL positioning, rounded-xl, snap-x for mobile, and scrollbar-hide).
4. Component Specs: Verify the Button component is used for the "Edit" and "Delete" actions instead of raw HTML buttons, following the @button-component.md spec.

---

**Q2 — `utilService.percentFormat` / `utilService.priceFormat` are missing**

The plan calls for `utilService.percentFormat` and `utilService.priceFormat`, but neither exists in `src/services/util.service.ts`. What should I do?

- [ ] A — Add `percentFormat` and `priceFormat` helpers to `util.service.ts` as part of this task
- [ ] B — Use inline formatting (e.g. `${value}%`, `${Math.floor(v/1000)}k ₪`) — skip the service methods
- [ ] C — The methods exist elsewhere; point me to the correct file

> *Your answer:* (A) Add percentFormat and priceFormat helpers to util.service.ts as part of this task.

Context: To maintain a "High-Fidelity" application, we must avoid scattered inline formatting. Centralizing these in the utilService ensures that currency symbols, thousands separators, and RTL-compliant percentage signs remain consistent across the entire platform.

---

**Q3 — `deleteStatus` 3-state machine: what does the `'deleting'` state show?**

The plan specifies `deleteStatus: 'idle' | 'confirm' | 'deleting'`. The current code uses a simple `showConfirm` boolean (no `'deleting'` phase). When the user clicks the final "מחק" button:

- [ ] A — Show a spinner/loading state on the card while the delete call completes, then remove the card
- [ ] B — The delete is instant (local state only, no async) — `'deleting'` is just a transient step before calling `onDeletePress`; keep it simple

> *Your answer:* (A) Show a spinner/loading state on the card while the delete call completes.

Context: To maintain a "High-Fidelity" experience, we must provide visual feedback that the system is processing the request. A "fire and forget" deletion can be jarring, especially if there is network latency. By using the 'deleting' state, we prevent the user from clicking the button multiple times and signal that the removal is in progress.

---

**Q4 — `missing_picture.png` fallback: does the asset exist?**

Step 2 says to handle missing images with `missing_picture.png`. I found no such file under `src/assets/`. The current code uses a lucide `<ImageIcon>` placeholder instead.

- [ ] A — I will add `missing_picture.png` to `src/assets/images/`; wait for it
- [ ] B — Keep the `<ImageIcon>` placeholder that's already there — don't use `missing_picture.png`

> *Your answer:* (B) Keep and enhance the <ImageIcon> placeholder based on the RAW AI Studio code.

Reasoning:
- Asset Reliability: Since missing_picture.png is not physically present in the project's assets folder, attempting to reference it would cause redundant 404 errors.
- High-Fidelity UI: Using a styled React component (SVG/Lucide) is superior to a static PNG. It allows for better scaling, consistent coloring with the theme, and removes an external dependency.
- Fidelity to RAW: The AI Studio raw output already provides a well-structured "Empty State" layout for the property card. We will leverage those Tailwind classes to ensure a premium look.

---

**Q5 — `isLoading` skeleton cards: who sets it and when?**

The plan says to render skeleton cards when `isLoading` is true (from `app.slice.ts`). Currently `HomePage.tsx` passes filtered local/mock data synchronously — there is no async fetch that would flip `isLoading`. Should I:

- [ ] A — Wire `isLoading` from the store into `HomeCityProperties` and render pulse-skeleton cards (I will also need to know where/when `setIsLoading(true/false)` is called)
- [ ] B — Skip the skeleton for now; implement it when real API fetching is added

> *Your answer:* (A) Implement the Skeleton infrastructure now.

Reasoning:
Since the parent component (HomePage) is about to implement real API fetching, providing the isLoading infrastructure in HomeCityProperties now is a proactive move. This prevents double-work and ensures the UI is "API-ready" the moment the backend integration is flipped on.

Implementation Directive for Claude:
1. Prop Injection: Add isLoading: boolean to the HomeCityProperties props.
2. Skeleton Logic: If isLoading is true, instead of mapping the properties, render a static loop (e.g., 3-6 items) of "Skeleton Cards."
3. Skeleton UI Styling: * Use the same grid layout: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3.
    - The skeleton card should mimic the real card's dimensions: a large gray block for the image, a header line, and two smaller lines for text.
    - Apply the animate-pulse Tailwind class to all gray blocks (bg-slate-200) to create the loading effect.
4. Clean Transition: Ensure that once isLoading becomes false, the skeletons unmount and the real properties.map() takes over seamlessly.

---

**Q6 — `onPropertyPress` / card-level navigation**

Step 4 mentions `onPropertyPress` triggers "for the card and buttons." Currently only the Edit button navigates to the property page. Should clicking anywhere on the card body also navigate?

- [ ] A — Yes, the whole card (excluding action buttons) is a clickable navigation target
- [ ] B — No, only the Edit button navigates; the card body is non-interactive

> *Your answer:* (A) Yes, the whole card (excluding action buttons) is a clickable navigation target.

Reasoning:
- User Intent: Clicking anywhere on the property image or info block signals a desire to view that property. Restricting navigation to the "Edit" button is a suboptimal UX pattern.
- Mobile Accessibility: A larger tap target (the entire card) is significantly more intuitive on mobile devices.
- Visual Consistency: The UI screenshot shows a high-quality card design; users naturally expect such cards to be interactive surfaces.

---

*Waiting for your answers before proceeding.*

---
### 2026-05-23 — Implementation Decisions (Green Light Received)

*AI says:*

All 6 answers received. Implementation complete. Decisions recorded below.

**Files changed:**
- `src/services/util.service.ts` — Added `percentFormat(value, decimals?)` and `priceFormat(value)` as named exports and added them to the `utilService` object. `priceFormat` outputs `M ₪` for millions, `k ₪` for thousands, and uses `toLocaleString('he-IL')` for small values.
- `src/components/layout/HomeCityProperties.tsx` — Full refactor (see breakdown below).
- `src/pages/HomePage.tsx` — Added `isLoading` selector from store; passed as `isLoading={isLoading}` prop.

**Q1 — Base:** Refactored existing file. No raw AI Studio file to merge.

**Q2 — Formatters:** `percentFormat` and `priceFormat` added to `util.service.ts`. Used in `PropertyCard` to replace all inline formatting.

**Q3 — `deleteStatus` 3-state machine:**
- `'idle'` → normal card, clickable
- `'confirm'` → full-card overlay with Trash icon, address, confirm/cancel buttons
- `'deleting'` → full-card overlay with `Loader2` spinner + "מוחק..." phrase. A 350ms artificial delay before `onDeletePress` is called so the spinner is visible even when the parent callback is synchronous. `isMounted` ref guards against state updates after unmount.

**Q4 — Image fallback:** Kept `<ImageIcon size={48}>` styled placeholder with Hebrew label from `getPhrase('home_property_no_image', 'אין תמונה')`. No `missing_picture.png` dependency.

**Q5 — Skeleton:** `isLoading?: boolean` prop added. Renders 3 `SkeletonCard` components with `animate-pulse` when true. Same grid layout. Driven by `app.slice.ts → isLoading` passed down from `HomePage`.

**Q6 — Card click:** `motion.article` has `onClick={() => onEditPress(property.id)}`. Action button row has `onClick={(e) => e.stopPropagation()}`. Carousel prev/next buttons also call `e.stopPropagation()`. Overlay divs call `e.stopPropagation()`. Card cursor is `cursor-pointer` only when `deleteStatus === 'idle'`.

**Phrase keys introduced:**
| Key | Default (Hebrew) |
|-----|-----------------|
| `home_properties_empty_state` | אין נכסים להצגה |
| `home_property_most_profitable` | הרווחית ביותר |
| `home_property_missing_data` | אין מספיק נתונים לביצוע חישוב |
| `home_property_avg_return_label` | תשואה ממוצעת |
| `home_property_total_profit_label` | רווח כולל |
| `home_property_delete_title` | מחיקת נכס |
| `home_property_delete_confirm_msg` | האם אתה בטוח שברצונך למחוק את %1$s? |
| `home_property_delete_confirm_btn` | מחק |
| `home_property_delete_cancel_btn` | ביטול |
| `home_property_edit_btn` | ערוך |
| `home_property_no_image` | אין תמונה |
| `home_property_deleting` | מוחק... |
| `home_property_delete_aria` | מחק נכס |

**Status: ✅ COMPLETE**