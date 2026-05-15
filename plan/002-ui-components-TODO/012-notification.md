# Plan: Notification Component - Extraction & Refactor

*Objective:* Transform the raw Notification logic into a production-ready feedback component using Framer Motion (motion/react) and Tailwind CSS.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @notification-component.md

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Style Configuration (Tailwind)**
- *Variant Refinement:* 
    - Instead of hardcoded strings in the JSX, define a mapping for `success` and `error` types to ensure consistent branding (bg, border, and text colors).
    
- *Elevation & Presence:*
    - Shadow Precision: Use `shadow-2xl` or a custom high-elevation shadow in `main.css` to ensure the notification "pops" above the UI layers.
    - Z-Index Strategy: Use `z-[1000]` or higher to guarantee it stays above headers and cards.

**Step 2: Component Refactor**
- *File Placement:* Move the component to `components/common/Notification.tsx`.

- *Logic & Structure:*
    - Apply the structure from @notification-component.md.
    - *Animation Integration:* Wrap the component in `AnimatePresence` and use `motion.div` for entry/exit (y-axis slide and scale effect).
    - *Dynamic Iconography:* Use a conditional switch to render `CheckCircle2` for success and `AlertCircle` for error. Use `shrink-0` to protect icon dimensions.
    - *Close Action:* Implement the button using a simple icon wrapper. Ensure it triggers the `onClose` callback passed from the parent.

- *Accessibility:* Ensure `aria-label` is localized for the close button and the component uses the correct role (e.g., `role="status"` or `alert`).

**Step 3: Layout & RTL**
- *Alignment:* Use `inset-x-0` with `flex justify-center` to center the notification at the top of the screen.

- *RTL Support:* Ensure the message text uses `text-start` and the padding/gap logic uses logical properties (`gap-3`, `px-6`).        

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
### 2026-05-13 — AI Pre-Flight Questions

*AI says:*

After reading the raw component (`raw_from_ai_studio/components/common/Notification.tsx`), the spec (`@notification-component.md`), and the existing project structure, I have identified **4 issues that need your decision before I write a single line of code.**

---

**Q1 — Auto-Dismiss Duration (Bug in Raw Code)**

The raw component has `setTimeout(..., 1000)` — that is **1 second**, which is far too short for a user to read a message.
The spec (`@notification-component.md`) states it must auto-dismiss after **5 seconds**.

> **Which value should I use: 1 second (keep raw) or 5 seconds (follow spec)?**
> My recommendation: 5 seconds (`5000`), per the spec.

> *Your answer:* Use 5 seconds (5000ms), following the official spec.

Reasoning:
1. Readability & UX: 5 seconds is the industry standard for a "toast" notification. it allows the user to notice the pop-up, read the message (especially in Hebrew which might be longer), and react if necessary.
2. Accessibility: Users with lower reading speeds or those using assistive technologies need sufficient time to process the information before it disappears.
3. Spec Priority: The specification (@notification-component.md) is the "source of truth" for business requirements. The raw code is just a scaffolding and should be corrected to match the spec.

Implementation Detail: Ensure the useEffect that handles the onClose trigger uses 5000. Also, make sure that if a user manually clicks the "Close" button, the timer is cleared (clearTimeout) to prevent memory leaks or unexpected behavior.

---

**Q2 — SCSS File Requirement vs. Project Reality**

The `ui-component-layer` SKILL mandates a scoped SCSS file at `src/assets/css/components/notification.scss` (importing `../_vars.scss`).
However, after searching the entire project, **there are zero `.scss` files** — the project uses only `src/main.css` with Tailwind `@theme` (v4 approach, no SCSS pipeline).

> **Should I:**
> **(a)** Skip the SCSS file — the Notification has no custom CSS beyond Tailwind classes, so no SCSS file is needed here.
> **(b)** Create `src/assets/css/components/notification.scss` and set up SCSS support (requires installing `sass` and configuring Vite)?
>
> My recommendation: **(a)** — the component is 100% Tailwind. Creating an empty SCSS file just to satisfy the rule adds no value and would require infrastructure changes.

> *Your answer:* (A) Skip the SCSS file completely.
Reasoning:
1. Infrastructure Consistency: The project is built on Tailwind CSS (v4) using a single-entry main.css. Introducing SCSS now would require unnecessary infrastructure changes (sass installation, Vite configuration) and break the current architectural pattern.
2. Tailwind-First: All styling requirements for the Notification (elevation, presence, variants, and RTL) can and should be handled 100% via Tailwind utility classes and the cn utility.
3. No Legacy Bloat: We will not create empty or redundant CSS files just to satisfy a legacy rule. If a specific complex animation is needed that isn't covered by Tailwind, it will be added to the global @theme in main.css as a custom utility.

Action: Implement the component using only Tailwind classes. Ensure the "Elevation" (shadows) and "Z-index" are handled via Tailwind's standard scales (e.g., shadow-2xl, z-[1000]).

---

**Q3 — `aria-label` Localization via `useSplash`**

The plan says the close button `aria-label` must be "localized." Currently it is a hardcoded Hebrew string `"סגור הודעה"`.
The `useSplash` hook exposes `getPhrase(key, fallback)` for i18n.

> **Should I:**
> **(a)** Fetch it via `getPhrase('notification.close', 'סגור הודעה')` — full i18n compliance, consistent with the skill rule ("No hardcoded Hebrew in JSX").
> **(b)** Keep the hardcoded string — the component's `message` prop is already passed from the caller (so the message itself is external), and the close label is purely structural/not user-visible content.
>
> My recommendation: **(a)** — the SKILL rule is explicit: no hardcoded Hebrew/English strings in JSX.
> **Follow-up:** What phrase key should I use? (e.g., `notification.close`)

> *Your answer:* (A) Use getPhrase for full i18n compliance.

Reasoning:
1. Strict Skill Compliance: As per our global architectural rules, no user-facing or accessibility-related strings (like aria-label) should be hardcoded in the JSX.
2. Screen Reader Experience: For users relying on assistive technologies, the aria-label is the only way they understand the button's purpose. It must be localized to match the rest of the UI language.

Implementation Detail:
- Phrase Key to use: common_close (or notification_close if you prefer specific scoping, but common_close is usually reusable across modals and alerts).
- Fallback: "Close" or "Close Notification".

```TypeScript
<button 
  onClick={onClose}
  aria-label={getPhrase('common_close', 'סגור')}
  className="..."
>
  <X className="w-4 h-4" />
</button>
```

---

**Q4 — `role` Attribute: `"status"` vs `"alert"` per Type**

The plan says to add `role="status"` or `role="alert"`. These have different screen-reader semantics:
- `role="alert"` — announces immediately and interrupts (appropriate for **errors**).
- `role="status"` — announces politely when idle (appropriate for **success**).

> **Should I:**
> **(a)** Use a **dynamic role** — `role={type === 'error' ? 'alert' : 'status'}` — so each type gets semantically correct accessibility behavior.
> **(b)** Use a **single static role** for simplicity (`role="status"` for both, or `role="alert"` for both).
>
> My recommendation: **(a)** — dynamic role is the accessible best practice and costs nothing extra.

> *Your answer:* (A) Use a dynamic role for proper accessibility (A11y) semantics.

Reasoning:
1. Semantic Accuracy: Screen readers treat these roles differently for a reason. An error is a critical piece of information that the user needs to know immediately (especially if it blocks progress), whereas a success message is a polite confirmation that should not disrupt the user's current flow.
2. User Experience: Using role="alert" for everything can be stressful for screen-reader users as it creates a sense of urgency for every minor update. Conversely, using role="status" for a critical error might result in the user missing the fact that their action failed.
3. Low Effort, High Value: Implementing role={type === 'error' ? 'alert' : 'status'} is a "zero-cost" implementation that significantly elevates the professional grade of your UI.

Implementation Detail:
Ensure that for role="alert", the component also includes aria-live="assertive", and for role="status", it uses aria-live="polite". (Framer Motion usually handles the DOM insertion well, but explicit roles are always safer).

Example:
```TypeScript
<motion.div 
  role={type === 'error' ? 'alert' : 'status'}
  aria-live={type === 'error' ? 'assertive' : 'polite'}
  className={cn("...", variants[type])}
>
  {/* Notification Content */}
</motion.div>
```

---

**STOP — Waiting for your answers to Q1–Q4 before proceeding.**

---
### 2026-05-13 — Decisions Summary & Implementation Green Light

| # | Decision |
|---|----------|
| Q1 | Auto-dismiss: **5000ms** |
| Q2 | SCSS: **Skip** — Tailwind-only |
| Q3 | `aria-label`: `getPhrase('common_close', 'סגור')` via `useSplash` |
| Q4 | Role: **dynamic** — `role={type === 'error' ? 'alert' : 'status'}` + matching `aria-live` |

**Status: Green light received. Proceeding to implementation.**