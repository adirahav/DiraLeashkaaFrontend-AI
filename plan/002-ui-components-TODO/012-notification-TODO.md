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
    
*AI says:*