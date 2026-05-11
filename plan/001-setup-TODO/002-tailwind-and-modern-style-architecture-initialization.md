# Plan: Tailwind & Modern Style Architecture Initialization

## Task Overview
Initialize the project's styling infrastructure by establishing a utility-first Tailwind core. This replaces traditional SCSS hierarchies with a centralized configuration and a dynamic class-merging utility. All implementation must follow the updated Tailwind Pure Architecture principles.

*Reference:* Use the specialized knowledge in @css-layer/SKILL.md.

## Phase 1: Core Configuration (The "Engine")
1. **Style Infrastructure:** Initialize Tailwind v4 theme variables in main.css.
  - *Colors:*  Map --color-* variables to Emerald/Blue/Red palettes to match the component SKILLs.
  - *Custom Spacing/Sizes:* Define custom utility --spacing-input-h: 54px to ensure UI consistency across all inputs.
  - *Shadows:* Define the `heavy` shadow for dropdowns and cards.
  - *RTL Support:* Validate that logical properties are active for Hebrew support.

2. **The cn Utility:** Create `src/lib/utils.ts`.
  - Implement the `cn` helper using `clsx` and `tailwind-merge`. This is mandatory for merging conditional classes across all components.

3. **Global Stylesheet:** Create `src/index.css`.
  - Include `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`.
  - Set the default font family and ensure `box-sizing: border-box` is active globally.

## Phase 2: Layout & RTL Foundation
1. **Directional Setup:** Apply `dir="rtl"` at the root level (e.g., index.html or App.tsx).

2. **Main Layout Wrapper:** Create `src/components/layouts/MainLayout.tsx`.
  - Use Tailwind Grid utility classes (e.g., `grid grid-cols-12 gap-4`).
  - Set max-width containers and responsive padding.

## Phase 3: Integration & Verification
1. **App-Level Import:** Ensure `index.css` is imported only once in `main.tsx`.

2. **Verification Checklist:**
  - [ ] *Merging:* Test that `cn("default-class", props.className)` merges correctly without conflicts.
  - [ ] *RTL:* Verify that `ps-4` applies padding to the right in RTL mode.
  - [ ] *Theming:* Ensure `bg-primary` or` bg-emerald-600` pulls the correct color from the config.

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
