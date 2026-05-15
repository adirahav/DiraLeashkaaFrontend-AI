# Plan: UserConsent - Refactoring & Refactor

## Task Overview
Refactor the `UserConsent` logic into a high-fidelity, standalone component. It must support both the `Signup Wizard` (multi-step) and the `User Consent page`, integrated with `Zustand` Slices and `SplashContext`.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - Individual Specs: 
        - @user-consent-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (Clean Interface)**
- *Prop-Driven Logic*
    - Define a strict TypeScript interface for:
        - `content`: Raw HTML string for the terms.
        - `checkboxLabel`: The text for the agreement.
        - `checked` & `onChange`: For the checkbox state.
        - `onNext` & `onPrev`: Navigation handlers.
        - `isNextDisabled`: Boolean to control button state.
        - `isLoading`: Boolean for the submission spinner.

**Step 2: Component Refactor (UserConsent.tsx)**
- Apply the structure from @user-consent-component.md

- *Composition*
    - Use atomic components: `HtmlContent` (for terms), `Checkbox` (for consent), and `Button` (for navigation).
    - Ensure the `HtmlContent` is wrapped in a container that allows specific styling for the legal text.

- *Props & Mapping*
    - Implement as a Pure Component that only re-renders when props change.
    - Map the onNext handler to the "Primary" button and onPrev to the "Outline" button.

- *UI Structure*
    - *Top:* Terms of Use text area.
    - *Middle:* Checkbox with label.
    - *Bottom:* Action buttons (Grid layout).

**Step 3: Styling & RTL (Tailwind)**
- RTL Support: Force `direction: rtl` for the terms container and ensure the checkbox label is correctly padded on the left/right.

- Animation: Add `animate-in fade-in slide-in-from-bottom-4` for a professional transition.

**Step 4: API & Store Infrastructure (The Engine)**
- *Note:* Since this is a presentational component, the "Engine" resides in the Parent Wizard.

- Ensure the component correctly passes the `isLoading` prop to the `Button` component to trigger loading UI during the final API call.

## State Management Check (Zustand Slices Pattern)
- *Selectors:* The parent should use atomic selectors (e.g., state => state.isLoading) to pass down to this component, ensuring it only re-renders when necessary.


## *Required "STOP-AND-ASK" Milestone*
You must strictly follow the "STOP-AND-ASK" Milestone before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:

## [2026-05-13] Pre-Flight Clarifying Questions

*AI says:*

After reading the raw `UserConsent.tsx`, the existing refactored `UserPersonalInfo` and `UserFinancialDetails` patterns, the `user-consent-component.md` spec, and the `SignupPage` usage, I have the following questions before writing a single line of code:

---

### Q1 — `content` prop type: `React.ReactNode` vs raw HTML string

The spec says `content` is a *"Raw HTML string"* (implying `dangerouslySetInnerHTML`), but the raw AI Studio source uses `React.ReactNode` (JSX). The existing `src/constants/termsContent.tsx` exports a JSX tree (not a string).

**Which should the refactored component accept?**
- **(A) `React.ReactNode`** — keep the current JSX-based `TERMS_CONTENT`. No `dangerouslySetInnerHTML`, no XSS risk. Consistent with what is already in `src/constants/termsContent.tsx`.
- **(B) Raw HTML string** — requires `dangerouslySetInnerHTML` in `HtmlContent`. Needed only if the content will come from an API/CMS as a serialized HTML string.

> *My recommendation:* Option A, unless the Terms content will be fetched dynamically from a backend API.

> *Your answer:* (B) Raw HTML string using dangerouslySetInnerHTML.

Reasoning:
1. Dynamic Content Source: Because the terms are stored in the phrases system (to allow for easy updates and localization), they arrive as a string containing HTML tags (like <b>, <p>, <ul>, etc.).
2. Infrastructure Compatibility: The project already has an HtmlContent component designed specifically for this purpose. It uses dangerouslySetInnerHTML internally to transform these strings into rendered UI.
3. Phrase-Driven Logic: We cannot use React.ReactNode (JSX) because the translation engine returns strings. Hardcoding the terms as JSX in the code would break the "No hardcoded Hebrew/English" and "Backoffice-controlled phrases" rules.

Implementation Note:
- The UserConsent component will receive the content prop as a string.
- It will pass this string to the HtmlContent component.
- Ensure the HtmlContent component is styled with text-start leading-relaxed to make the legal text readable in RTL.

---

### Q2 — `variant` prop: does UserConsent need a `'wizard' | 'profile'` split like its siblings?

`UserPersonalInfo` and `UserFinancialDetails` both support a `variant` prop that changes layout (profile = `Card` wrapper + centered save button; wizard = flat + grid nav). The plan references two contexts:
1. **Signup Wizard** (step 3 of 3) — checkbox + prev/next buttons
2. **User Consent Page** (standalone page) — potentially read-only or with a single confirm button

**Should `UserConsent` also have a `variant` prop?**
- **(A) Yes** — `variant: 'wizard' | 'profile'` mirrors its siblings. The profile variant wraps content in a `Card` and shows a single confirm button.
- **(B) No** — keep it purely prop-driven (all layout controlled by `showCheckbox`, `showButtons`, etc.). The parent/page decides the wrapper.

> *My recommendation:* Option B — the component is already simple enough to be controlled entirely by props.

> *Your answer:* (B) No variant prop. Keep it purely prop-driven.

Reasoning:
1. The Funnel Logic: Since we decided that the Consent stage is a mandatory "gate" in the onboarding funnel, it doesn't need to behave like the other profile components. It has one specific job: getting that timestamp.
2. Sibling Differences: Unlike the Personal and Financial components, which live permanently in the "Edit Profile" tab (the profile variant), the Consent component is primarily used during the onboarding flow or as a standalone legal page.
3. Flexibility: Controlling it via props like showCheckbox and onNext is more than enough. The parent page (e.g., ConsentPage.tsx) will provide the necessary wrapper (like a Card or a specific Layout) without the component needing to know its own "identity."

Implementation Detail:
- The parent will handle the userService.updateUser({ termsOfUseAccept: Date.now() }) call.
- The component just renders the terms and notifies the parent when the "Accept" button is clicked.

---

### Q3 — `onNext` naming: the current interface uses `onSubmit` (not `onNext`)

The raw source and current `src/components/layout/UserConsent.tsx` both use `onSubmit?: () => void`. The plan spec renames it to `onNext`. The raw `SignupPage.tsx` calls it `onSubmit={handleSubmit}`.

**Which name should the refactored prop use?**
- **(A) `onNext`** — aligns with the plan spec and is semantically consistent with `onPrev`.
- **(B) `onSubmit`** — keeps backward compatibility with the existing wizard caller, no rename needed in `SignupPage`.

> *My note:* If we rename to `onNext`, I will need to update all call sites (currently only the `SignupPage` wizard step 3). Please confirm scope.

> *Your answer:* )A) onNext — for semantic consistency.

Reasoning:
1. Semantic Symmetry: Since the component already uses onPrev for backward navigation, using onNext creates a cleaner, more intuitive API. onSubmit usually implies a final form submission, but in a wizard context, this is often just a transition to the next step or a "confirm" action.
2. Plan Alignment: Our agreed-upon plan and the @user-consent-component.md spec both use onNext. Sticking to the plan ensures that when Claude generates the code, it follows the specialized knowledge we've established.
3. Clean Refactor: Renaming the call site in SignupPage.tsx is a minor task (one line change) compared to the long-term benefit of having a consistent prop naming convention across all wizard-ready components (UserPersonalInfo, UserFinancialDetails, and UserConsent).

Action:
- Rename the prop to onNext.
- Update the call site in SignupPage.tsx:

```TypeScript
<UserConsent 
  onNext={handleFinish} // instead of onSubmit
  onPrev={handleBack}
  ...
/>
```
---

### Q4 — Where does the terms content live? Does `TERMS_CONTENT` move to `useSplash` / `getPhrase`?

The skill mandates: *"All UI strings MUST be retrieved via `getPhrase` or `getParam` from `useSplash`. No hardcoded Hebrew/English in JSX."*

Currently the entire terms body is a hardcoded JSX constant in `src/constants/termsContent.tsx`. The checkbox label is also hardcoded Hebrew in the Signup wizard.

**How should strings be handled here?**
- **(A) Fully via `getPhrase`** — the checkbox label key is a `getPhrase` call; the `content` prop receives a `getPhrase`/`getParam` value from the parent. The `TERMS_CONTENT` constant is retired.
- **(B) Hybrid** — the checkbox label uses `getPhrase` inside the component; the full terms HTML/JSX remains passed as a prop (too large for a phrase key).
- **(C) Component is pure-presentational** — all strings (including checkbox label) are passed as props from the parent, which calls `getPhrase`. The component itself has zero `useSplash` dependency.

> *My recommendation:* Option C — the spec says "Zero Local Logic". The parent (wizard/page) resolves all strings and passes them down. This component stays truly stateless and testable.

> *Your answer:* (C) Pure Presentational — Strings as Props.

Reasoning:
1. Zero Local Logic: Following the "Dumb Component" principle, UserConsent should not know about useSplash, phrases, or specific keys. It simply receives "what to show" and "what to do" from its parent.
2. Testability: By passing strings (like the checkbox label and terms content) as props, we can easily test the component in Storybook or unit tests with any dummy data without mocking contexts.
3. Phrase-Driven Data: The parent (Signup Wizard or Consent Page) will be responsible for calling getPhrase('signup_terms_content', ...) and getPhrase('signup_terms_checkbox_label', ...) and passing the results down.

What happens to TERMS_CONTENT?
- The constant in src/constants/termsContent.tsx is retired/deprecated.
- The content now lives in the SplashContext (Database/API). This ensures that legal terms can be updated by the business team without a new code deployment.

Implementation Flow:
- Parent: const terms = getPhrase('signup_terms_content', '');
- Parent: const label = getPhrase('signup_terms_checkbox_label', 'אני מאשר...');
- Component: Receives content={terms} and checkboxLabel={label}.

---

### Q5 — SCSS file: is a `UserConsent.scss` required, or is pure Tailwind sufficient?

The skill mandates a `.scss` file per component in `src/assets/css/components/`. However:
- `UserPersonalInfo` and `UserFinancialDetails` have **no** `.scss` files — they are pure Tailwind.
- The spec for this component also describes everything in Tailwind utilities.

**Should I create `src/assets/css/components/UserConsent.scss`?**
- **(A) Yes** — follow the skill mandate strictly; create a minimal file that imports `../_vars.scss` and defines the custom scrollbar styles for the terms container.
- **(B) No** — follow the established sibling pattern; use pure Tailwind. The scrollbar can use the `scrollbar-thin scrollbar-thumb-blue-200` utilities already present in the raw source.

> *My recommendation:* Option A (minimal SCSS, just for the scrollbar `custom-scrollbar` class), since the spec explicitly references it.

> *Your answer:* (B) No SCSS file. Pure Tailwind only.

Reasoning:
1. Consistency is King: Since UserPersonalInfo and UserFinancialDetails are 100% Tailwind, introducing a single SCSS file for UserConsent would break the project's architectural pattern and create "style fragmentation."
2. Tailwind Capabilities: Modern Tailwind (especially v4) handles everything we need, including custom scrollbars. We can use the existing scrollbar-thin utilities or define a one-liner custom utility in main.css if absolutely necessary.
3. Modern Pipeline: We are moving away from component-specific SCSS files to avoid CSS bloat and keep the styling logic scoped within the JSX via Tailwind classes.

Action:
- Do not create UserConsent.scss.
- Implement all styles, including the scrollable terms area, using Tailwind utility classes.
- If the spec mentions a custom-scrollbar class, simply apply it as a Tailwind utility or ensure it's defined globally in main.css.

---

## [2026-05-13] Implementation Complete

*AI says:*

All decisions locked. Three files changed, zero TS errors.

| File | Change |
|---|---|
| `src/components/formFields/HtmlContent.tsx` | `content: React.ReactNode` → `content: string`; renders via `dangerouslySetInnerHTML` |
| `src/components/layout/UserConsent.tsx` | Full refactor — new strict interface, RTL scroll area, `animate-in fade-in slide-in-from-bottom-4`, pure Tailwind |
| `src/pages/SignupPage.tsx` | Removed `TERMS_CONTENT`; added `useSplash`; updated `UserConsent` props (`onSubmit` → `onNext`, `isValid` → `isNextDisabled`, all strings via `getPhrase`) |

**Phrase keys used in SignupPage:**
- `signup_terms_content` — full HTML terms body
- `signup_terms_checkbox_label` — consent checkbox text
- `signup_terms_next_button` — "סיום ופתיחת החשבון"
- `wizard_prev_button` — "חזור"