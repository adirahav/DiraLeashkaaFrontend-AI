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

## [2026-05-17] Pre-Flight Clarifying Questions

*AI says:*

After reading the existing `ConsentPage.tsx`, `UserConsent.tsx`, the raw AI Studio source, `consent-page.md`, `user-consent-component.md`, `user.utils.ts`, `main.css`, and `package.json`, I have the following questions before writing a single line of code:

---

### Q1 — `UserConsent` interface: does this task require modifying `UserConsent.tsx` to add `showCheckbox` / `showButtons` props?

The plan's Step 3 says to pass `showCheckbox={false}` and `showButtons={false}` to `UserConsent`, but the current `src/components/layout/UserConsent.tsx` has no such props — it always renders the checkbox and buttons. The raw AI Studio source (`raw_from_ai_studio/components/layout/UserConsent.tsx`) already includes these props.

**Scope decision required:**
- **(A) Yes, extend `UserConsent.tsx`** — Add `showCheckbox` and `showButtons` as optional boolean props (defaulting to `true`). Make `checkboxLabel`, `checked`, `onChange`, `onNext`, and `isNextDisabled` optional (only required when their respective `show*` flag is true). This changes the component's TypeScript interface, so the call site in `SignupPage.tsx` must be verified.
- **(B) No, do not touch `UserConsent.tsx`** — Instead, `ConsentPage` renders the terms content directly (e.g., via `HtmlContent` or `dangerouslySetInnerHTML`) in Info Mode, and only renders `<UserConsent>` in Action Mode (with full props).

> *My recommendation:* Option A — it aligns with the plan and the AI Studio raw source, and "view-only" mode is a documented use case in `user-consent-component.md`.

> *Your answer:* (A) Extend UserConsent.tsx to support optional structural flags (showCheckbox, showButtons).

Reasoning:
- Component Reuse: Extending the existing component is much cleaner than replicating the HtmlContent viewport wrapper, overflow containers, custom scrollbars, and tailwind typography ([&_h3]:text-base...) inside a separate file.
- Safe Backward Compatibility: By making the new visibility props optional and defaulting them to true, no existing implementations (like the Signup wizard) will break. They don't even need to be modified.

Final Instructions:
1. Update UserConsent.tsx Implementation:
    - Extract the flags with default fallbacks:
        ```TypeScript
        showCheckbox = true,
        showButtons = true,
        ```
    - Conditionally wrap the markup segments using logical expressions:
        ```TypeScript
        {/* Render Checkbox wrapper only if showCheckbox is true */}
        {showCheckbox && checkboxLabel && onChange !== undefined && (
        <div className="pt-6 border-t border-slate-100">
            <Checkbox
            label={checkboxLabel}
            checked={checked ?? false}
            onChange={onChange}
            />
        </div>
        )}

        {/* Render Buttons grid wrapper only if showButtons is true */}
        {showButtons && onNext && (
        <div className={cn('grid gap-4', onPrev ? 'grid-cols-2' : 'grid-cols-1')}>
            {onPrev && (
            <Button variant="outline" onClick={onPrev} className="py-4">
                {prevButtonText}
            </Button>
            )}
            <Button
            variant="primary"
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            className="py-4"
            >
            {nextButtonText}
            </Button>
        </div>
        )}
        ```
2. Consume inside ConsentPage.tsx:
    - Pass the visibility props explicitly according to the active runtime state:
        ```TypeScript
        <UserConsent 
            content={termsTextString}
            showCheckbox={isActionMode}
            showButtons={isActionMode}
            // ... pass handlers only if isActionMode is true
        />
        ```
---

### Q2 — `.prose` class (Step 4 typography): `@tailwindcss/typography` is NOT installed

The plan says to use the `.prose` class for legal text, but `package.json` does not include `@tailwindcss/typography`. The current `UserConsent.tsx` already achieves the same result with targeted arbitrary Tailwind selectors (e.g., `[&_h3]:text-base [&_h3]:font-bold [&_p]:mb-3`).

**Two paths:**
- **(A) Install `@tailwindcss/typography`** — `npm install @tailwindcss/typography`, then use `prose prose-sm prose-slate` on the content container. Requires registering the plugin in the Tailwind v4 config.
- **(B) Skip the plugin, keep targeted Tailwind selectors** — Extend the existing `[&_tag]:utility` pattern on the `HtmlContent` wrapper. Zero new dependency.

> *My recommendation:* Option B — avoids a new dependency, and the existing pattern already works. The plan's mention of `.prose` is likely shorthand for "good legal typography," not a literal plugin requirement.

> *Your answer:* (B) Skip installing @tailwindcss/typography. Use targeted Tailwind arbitrary selectors passed dynamically via the AI Studio structure.

Reasoning:
- Zero Dependencies: Avoids bloating package.json and changing Tailwind config pipelines for a single long-form copy container.
- Adherence to AI Studio Mock: The AI Studio component contract introduces contentClassName, which allows the parent page component to govern the custom typography styling safely based on container context.
- Markup Sync Correction: Notice how the AI Studio markup refactor places the <Checkbox /> container inside the <HtmlContent /> component as part of a React Fragment. We will adopt this exact structure to guarantee layout pixel-perfection matching the design tool preview.

Final Instructions:
1. Update UserConsent.tsx Props & Structure:
Adopt the exact properties and layout design provided from your AI Studio snippet. Ensure all callbacks (onPrev, onSubmit) and indicators (isValid) match the contract cleanly.
2. Style Injection inside ConsentPage.tsx / TermsOfUse.tsx:
When invoking <UserConsent /> inside your legal routing views, apply the native target selector typography classes directly into the contentClassName prop:
```TypeScript
<UserConsent
  content={termsTextData}
  showCheckbox={isActionMode}
  showButtons={isActionMode}
  contentClassName="p-6 bg-blue-50 rounded-3xl max-h-[320px] overflow-y-auto text-sm text-blue-800 border border-blue-100 shadow-inner leading-relaxed text-right [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-3 [&_section]:mb-4 scrollbar-thin scrollbar-thumb-blue-200"
  // ... rest of structural actions
/>
```

---

### Q3 — Phrase keys: are `user_terms_of_use_title`, `user_terms_of_use_subtitle`, `user_terms_of_use_text` confirmed to exist in the backend splash/phrases data?

The current `ConsentPage.tsx` uses different keys:
- `registration_title` → plan wants `user_terms_of_use_title`
- `registration_subtitle` → plan wants `user_terms_of_use_subtitle`
- `signup_terms_of_use_text` → plan wants `user_terms_of_use_text`

Also, the existing `SignupPage` uses `signup_terms_of_use_text` for the UserConsent content. If the new page uses a **different** key (`user_terms_of_use_text`), they can hold different content (signup flow vs. standalone page). Is that intentional?

**Decision required:**
- **(A) Use the new keys** — `user_terms_of_use_*` keys exist (or will be added) in the backend. The content may differ from the signup wizard.
- **(B) Reuse existing keys** — `signup_terms_of_use_text`, `registration_title`, etc. No backend changes needed.

> *Your answer:* (B) Reuse existing keys** — `signup_terms_of_use_text`, `registration_title`, etc. No backend changes needed.

---

### Q4 — `useNativeBackButton` landing page: what URL for the "no referrer" fallback?

The plan says: *"If `document.referrer` exists, go back; otherwise, navigate to the landing page."*

In Info Mode (guest or already accepted), there's no ambiguity — just go back or go to landing. But what is "the landing page" in this project?

**Options:**
- **(A) `/` (root)** — React Router's root path, which likely redirects based on auth state.
- **(B) `/home`** — the main authenticated home page.
- **(C) `/login`** — the login/auth entry point, safest fallback for guests.

> *Your answer:* (A) Navigate to / (Root Path).

Reasoning:
- Dynamic Routing Intelligence: Your application already has structural routing intelligence set up at the root level (/), managed by components like your ProtectedRoute.
- State-Aware Redirection: If an unauthenticated guest hits the Terms of Use page from an external link and hits "Back," falling back to / will naturally drop them onto the login gateway. Conversely, if an authenticated user opens it in a new browser tab with an empty history, hitting / will seamlessly route them back to their /home workspace.
- Avoiding Broken Experience: Hardcoding /home (Option B) would cause route guard violations and unintended loops for logged-out users, while hardcoding /login (Option C) would force an active user out of their session context unnecessarily.

Final Instructions:
1. Implement the Conditional Fallback:
Inside ConsentPage.tsx / TermsOfUse.tsx, configure your native back button subscription handler to evaluate the session history chain:
```TypeScript
const navigate = useNavigate();

const handleBackNavigation = () => {
  // Check if there is actual internal history to pop back into
  if (window.history.state && window.history.state.idx > 0) {
    navigate(-1);
  } else {
    // Safe, state-aware catch-all anchor
    navigate('/', { replace: true });
  }
};
```

(Note: Using window.history.state.idx > 0 or checking document.referrer within your routing bounds protects the viewport stack from escaping the app layout entirely).

2. Bind to ScreenHeader:
Pass this clean handleBackNavigation callback straight into the onBack trigger of your ScreenHeader layout container to ensure total consistency across native platform hardware triggers and visual header icons.

---

### Q5 — `Logo` component visibility: keep it in the standalone `ConsentPage` or remove it?

The current `ConsentPage.tsx` renders a `<Logo>` above `ScreenHeader` (inside a `Card`). The new spec (`consent-page.md`) shows `ScreenHeader` at the top with no Logo mention. Other standalone pages like `LoginPage`, `ForgotPasswordPage`, and `SignupPage` all show the Logo.

**Decision:**
- **(A) Keep the Logo** — consistent with all other auth/onboarding pages; the page feels branded.
- **(B) Remove the Logo** — cleaner for an Info-mode legal page; the `ScreenHeader` is sufficient branding.

> *Your answer:* (A) Keep the Logo in Onboarding/Action Mode, but dynamically hide it in View-Only/Info Mode.

Reasoning:
- Context-Driven Branding: This page serves two completely different audiences. When an unauthenticated user or a newly registered user lands here as part of the onboarding setup sequence, the layout behaves exactly like LoginPage or SignupPage—it is a core gateway entry gate, so maintaining the <Logo> branding is critical for visual continuity.
- Clutter-Free Information Architecture: However, if an active user opens the page from the mobile drawer or desktop footer after they've already completed their onboarding just to read the terms, the page shifts context into a standard application content sub-view. In this mode, the <ScreenHeader> provides more than enough visual context, and rendering a massive logo inside a desktop card would look out of place and visually redundant.

Final Instructions:
1. Determine Active State Context:
Inside ConsentPage.tsx / TermsOfUse.tsx, utilize your established state evaluation logic to check if the user is in an active signup pipeline flow:
```TypeScript
const isActionMode = loggedinUser ? !loggedinUser.termsOfUseAccept : false;
```

2. Conditional Markup Injection:
Place the <Logo /> import inside your layout tree wrapped directly within a conditional statement that evaluates the active workflow environment:
```TypeScript
return (
  <div className="flex flex-col gap-6 max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
    {/* Render branding logo strictly during onboarding setups */}
    {isActionMode && (
      <div className="flex justify-center mb-4">
        <Logo showText={true} />
      </div>
    )}

    <ScreenHeader 
      title="user_terms_of_use_title" 
      subtitle="user_terms_of_use_subtitle"
      onBack={handleBackNavigation}
    />

    {/* ... UserConsent Form block */}
  </div>
);
```

3. Desktop Card Structural Layout:
Ensure that if the components are nested inside a central <Card> primitive wrapper on desktop viewports, the padding values scale gracefully to preserve the responsive design system grids regardless of whether the logo element is actively mounted.

---

## [2026-05-17] Implementation Complete

*AI says:*

All decisions locked. Zero TypeScript errors. Three files changed, one created.

| File | Change |
|---|---|
| `src/hooks/useNativeBackButton.ts` | **New** — returns a back callback; uses `window.history.state?.idx > 0` to pop or fall back to `/` |
| `src/components/layout/UserConsent.tsx` | Extended — added optional `showCheckbox`, `showButtons`, `contentClassName` props (all default to their active state for backward compatibility); `SignupPage` call site untouched |
| `src/pages/ConsentPage.tsx` | Full refactor — dual-mode (Action/Info), `useScrolled` + `useNativeBackButton`, Logo visible only in Action Mode, `getNextOnboardingStep` post-accept navigation |

**Phrase keys used (reusing existing):**
- `registration_title` — page header title
- `registration_subtitle` — page header subtitle
- `signup_terms_of_use_text` — terms HTML body
- `signup_terms_of_use_agree` — checkbox label (Action Mode only)
- `wizard_terms_next_button` — accept button text (Action Mode only)
- `signup_server_error` — error message fallback
- `back_button` — Info Mode back link text