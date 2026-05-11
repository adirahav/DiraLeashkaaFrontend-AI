# Plan: Footer - Extraction & Refactor

## Task Overview
Refactor the Footer to be fully dynamic, integrating with SplashContext and Capacitor for environment-specific features.

*Reference:* Use the specialized knowledge in
    - @footer-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Logic Extraction (Helper Utility)**
- Update `src/utils/platform.utils.ts` (or create if missing).
- Implement `getFooterData(phrases, params)`:
    - Detect platform via `@capacitor/core`.
    - Extract versioning from `fixedParameters` (keys: `appVersion`, `webVersion`).
    - Construct the WhatsApp share string using `getPhrase`.
    - Return a structured object: `{ version, shareUrl, moreUrl, isNative }`.

**Step 2: Component Refactor (`Footer.tsx`)**
- *File Placement:* `src/components/common/Footer.tsx`.

- Apply the structure from @footer-component.md.

- *Hooks Integration*
    - Use `useSplash()` to get `getPhrase` and `getParam`.
    - Use `useLocation()` from `react-router-dom` to detect current route.

- *Conditional Rendering*
    - Implement `isTermsPage` check to toggle between full and minimal footer.
    - Wrap the entire return in a conditional check for `loggedinUser`.

- *Event Handlers*
    - Implement `handleExternalLink`: Use `@capacitor/browser`'s `Browser.open` for native external navigation.

**Step 3: Styling (Tailwind)**
- Ensure the footer is a "full-bleed" container (`full` class).
- Style the `nav ul` as a flex-wrap container with pipes (`|`) as separators where required.
- Maintain RTL alignment for Hebrew text and icons.

**Step 4: Version & Copyright**
- Implement dynamic year: `new Date().getFullYear()`.
- Format the version string using `.replace("%1$s", version)`.


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