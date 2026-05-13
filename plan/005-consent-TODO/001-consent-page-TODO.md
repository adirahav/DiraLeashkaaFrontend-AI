# Plan: Terms of Use Page - Refactor & Integration

## Task Overview
Implement a standalone, public Terms of Use page that renders legal content dynamically from localized phrases. The page must support clean typography for long-form text, integrate with the existing ScreenHeader, and handle navigation history correctly.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @splash-layer/SKILL.md
    - @phrase-usage.md
    - @user-consent-component.md
    - Individual Specs:
        - @user-consent-page.md
        
  
## Import Layout from AI Studio
Refactor the provided ConsentPage logic into a professional, store-connected component. Ensure strict separation between global state (Zustand) and local form state to optimize performance.
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Content & Context Integration**
- *Mode Detection*
    - Check `loggedinUser` from `useStore`.
    - Determine `isActionMode`: `true` if user is logged in but `!user.termsOfUseAccept`.

- *State Selection*
    - Pull `phrases` from `useSplash` context.
    - Use `utilService.getPhrase` to retrieve `user_terms_of_use_text`.

- *HTML Rendering*
    - Since the legal text comes as a formatted string, implement `dangerouslySetInnerHTML` within a protected container to render the HTML tags correctly.

**Step 2: Navigation & UX Hooks**
- *Native Back Button*
    - Implement the `useNativeBackButton` hook.
    - Logic: Check `document.referrer`. If exists, go back; otherwise, navigate to the landing page.

- *Scroll Handling*
    - Implement a scroll listener to toggle the `isScrolled` state for the `ScreenHeader`, ensuring the title remains readable as the user scrolls through the long document.

**Step 3: Refactor & Visual Composition**
- Apply the structure from @concent-page.md.

- *Header Configuration*
    - Use `ScreenHeader` with:
        - Title: `user_terms_of_use_title`.
        - Subtitle: `user_terms_of_use_subtitle` (e.g., "Last Updated").

- *Dynamic UserConsent Integration*
    - Pass props based on `isActionMode`:
        - If `false`: `showCheckbox={false}`, `showButtons={false}`.
        - If `true`:
            - `showCheckbox={true}`, `showButtons={true}`.
            - `onAccept`: Execute `userService.updateUser({ termsOfUseAccept: true })`.
            - Post-Accept Navigation: Call `getNextOnboardingStep(updatedUser)` to funnel the user to the next station (Personal Info).

- *Component Wrapper*
    - Wrap the content in a `Card` for desktop views.
    - Pass `showCheckbox={false}` and `showButtons={false}` to the `UserConsent` component to use it in "View Only" mode.

**Step 4: Styling & Typography (Tailwind)**
- *Legal Typography*

    - Use the `.prose` class to handle:

        - Line height (1.6+ for readability).

        - Paragraph spacing.

        - Bold/Header tags within the dynamic HTML.

- *RTL Alignment*

    - Ensure `direction: rtl` and `text-align: right` are applied globally to the container.


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