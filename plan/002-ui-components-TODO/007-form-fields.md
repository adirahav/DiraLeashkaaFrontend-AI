# Plan: FormFields Component - Extraction & Refactor

*Objective:* Transform the raw FormFields into a production-ready component following the project's Skill layers.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - Individual Specs: 
        - @string-input-component.md 
        - @numeric-input-component.md
        - @year-of-birth-input-component.md
        - @password-input-component.md
        - @email-input-component.md
        - @button-component.md
        - @textarea-component.md
        - @dropdown-component.md
        - @checkbox-component.md

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Component Refactor

- *Refinement per Component:*
    1. *StringInput*
        - File Placement: Move the component to `components/formFields/StringInput.tsx`.
        - Apply @string-input-component.md 
        - Ensure the input field (`__field`) correctly toggles between standard, error (`is-error`), and disabled (`is-disabled`) states.
        - Validate that `React.useId()` is correctly managing accessibility links between labels and inputs.
        
    2. *NumericInput*
        - File Placement: Move the component to `components/formFields/NumericInput.tsx`.
        - Apply @numeric-input-component.md
        - Ensure the `formatNumber` regex logic is preserved during the refactor.
        - Verify that `inputMode="numeric"` is present on the `__field` element for mobile UX.
        - Map the `formatWithCommas` prop to ensure the value remains a formatted string in the state.
        - External Utils: Strictly use formatting functions from `@services/formtaUtils.service.
        - Use shared constant tailwind classes for consistency with `StringInput`.
    
    3. *YearOfBirth*
        - File Placement: Move the component to `components/formFields/YearOfBirth.tsx`.
        - Apply @year-of-birth-input-component.md
        - Strict Dependency: Ensure it consumes @numeric-input-component.md 
        with `formatWithCommas={false}` and `maxLength={4}`
    
    4. *PasswordInput*
        - File Placement: Move the component to `components/formFields/PasswordInput.tsx`.
        - Apply @password-input-component.md
        - Composition Check: Ensure it wraps @string-input-component.md and correctly passes down all props using `{...props}`.
        - Internal State: Implement the `showPassword` toggle logic using `useState`.
        - Placement: Position the toggle button using `inset-inline-end-4` to ensure it stays on the correct side for RTL/LTR automatically.
        - Accessibility Audit: Ensure `aria-label` correctly updates when the password visibility is toggled.
    
    5. *EmailInput*
        - File Placement: Move the component to `components/formFields/EmailInput.tsx`.
        - Apply @email-input-component.md
        - Minimalism Check: Ensure it acts as a thin wrapper around @string-input-component.md.
        - Validation: Confirm it correctly forwards the `error` prop to display validation messages from the parent form.
    
    6. *Button*
        - File Placement: Move the component to `components/formFields/Button.tsx`.
        - Apply @button-component.md
        - Color Specs: Use `bg-emerald-600` for success and `bg-teal-600` for secondary.
        - Interactions: Implement `active:scale-95` and smooth transitions.
    
    7. *Dropdown*
        - File Placement: Move the component to `components/formFields/Dropdown.tsx`.
        - Apply @dropdown-component.md.
        - Logic Preservation: Ensure the `handleClickOutside` logic and `useRef` are correctly migrated.
        - UI Sync: Match the trigger height (54px) and border-radius (12px/xl) to the `StringInput` for form symmetry.
        - Menu Positioning: Style the menu with `absolute z-[100] bg-white shadow-heavy rounded-xl`.
        - Chevron Animation: Use `transition-transform` and toggle `rotate-180` via `cn`.

    8. *Textarea*
        - File Placement: Move the component to `components/formFields/Textarea.tsx`.
        - Apply @textarea-component.md.
        - UI Audit: Use Tailwind's `resize-none` class.
        - Spacing & Size: Apply `min-h-[120px]` and `p-[14px]` (or p-3.5) directly to the textarea element using Tailwind utility classes. Ensure `resize-none` is included to maintain layout integrity.
        - Type Check: Confirm the `onChange` handler correctly passes the string value (`e.target.value`) to the parent.

    9. *Checkbox*
        - File Placement: Move the component to `components/formFields/Checkbox.tsx`.
        - Apply @checkbox-component.md.
        - Input Hiding: Ensure the native input uses `sr-only` to remain accessible but invisible.
        - Peer Logic: Use Tailwind's `peer` class on the input and `peer-checked:bg-blue-600` on the custom box.
        - Hover States: Use Tailwind's `group` and `group-hover`s utility classes.
        - ID Linking: Verify `React.useId()` is used to prevent ID collisions when multiple checkboxes appear in the `AdditionalFundingSources` list.

    10. *HtmlContent*
        - File Placement: Move the component to `components/formFields/HtmlContent.tsx`.
        - Apply @html-content-component.md.
        - UI Audit: Use Tailwind's `space-y-6` for consistent vertical rhythm and `leading-relaxed` for typography.
        - Spacing & Styling: Apply `text-slate-600` and ensure the container uses the `cn` utility to merge base classes with the incoming `className`.
        - Flexibility Check: Confirm the component accepts `ReactNode` as `content` to allow nesting of strings, HTML tags, or other React components (like Checkbox).
            
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
### [2026-05-12] Pre-Flight — AI Clarifying Questions

*AI says:*

After reading all 10 component specs and their current implementations in `src/components/formFields/`, I found 6 decision points that require your explicit answer before I can begin. Each affects multiple components.

---

**Q1 — `cn` utility adoption scope (affects ALL components)**

The plan mandates `cn` for class merging, but every current component uses raw template-string concatenation (`${condition ? 'a' : 'b'}`). This is the most widespread gap.

- **Option A** — Full swap: Replace every template-string conditional with `cn()`. Clean and spec-compliant, but touches every file.
- **Option B** — New code only: Keep existing conditionals as-is; use `cn()` only for new class merges I introduce during this refactor.

Which scope do you want?

> *Your answer:*
(A) Full swap.
I want this refactor to be thorough. Since we are moving the components to a new structure anyway, please replace all template-string conditionals with the cn() utility.

Why:
1. Maintainability: It makes the class logic much easier to read and debug.
2. Tailwind-Merge: The cn utility (using tailwind-merge) is critical to prevent class conflicts (e.g., if a parent passes a p-4 to a component that already has p-2).
3. Consistency: I want a unified standard across the entire project. Let's do it right from the start.

---

**Q2 — `EmailInput` is near-empty (missing entire spec)**

The current `EmailInput` is only a thin `StringInput` wrapper with `type="text"`. The spec demands:
- `type="email"` (not `type="text"`)
- `onBlur` regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) with a local error state
- Parent `error` prop takes priority over local error
- `autoComplete="email"` + `spellCheck="false"`
- Optional `onValidationError` callback to the parent

Do you want the full spec implemented now, or keep the thin wrapper for a later task?

> *Your answer:*
Implement the full spec now.
I don't want a thin wrapper. The EmailInput should be a robust, self-validating component as described.

Specific Requirements:
1. Validation: Implement the local onBlur regex validation.
2. Error Priority: Ensure the error prop from the parent (external error) takes priority over the local validation error (internal error).
3. UX: Use type="email", autoComplete="email", and spellCheck="false" for proper mobile and browser behavior.
4. Sync: Include the onValidationError callback so the parent form is aware of the local validation state.

---

**Q3 — `formatUtils.service` path mismatch (affects `NumericInput`)**

The plan says: *"External Utils: Strictly use formatting functions from `@services/formtaUtils.service`"* (likely a typo for `formatUtils.service`).

The actual file is `src/services/utils.tsx` and the function `formatInputNumber` already exists there — imported correctly in the current component.

- **Option A** — The plan has a typo; keep importing from `src/services/utils.tsx` as-is.
- **Option B** — Create a dedicated `src/services/formatUtils.service.ts` that re-exports (or moves) the formatting functions there, and update the import.

Which is correct?

> *Your answer:*
(B). Let's clean this up.
1. Create src/services/formatUtils.service.ts: This should be the new, dedicated home for ALL formatting logic.
2. Move & Refactor: Move the formatting functions you found in utils.tsx (like formatNumber, formatInputNumber, formatCurrency, etc.) into this new service.
3. Clean utils.tsx: Remove these functions from the old file to avoid duplication.
4. Standardize: Ensure NumericInput and all other components import strictly from the new @services/formatUtils.service.

Important Note on formatCurrency and formatPercent: These functions currently return JSX (<span>). Please keep them that way if they are used as components, but if we need raw string versions for inputs, create a string-only version (e.g., formatCurrencyString) inside the same service.

---

**Q4 — `Dropdown` placeholder phrase integration (requires `useSplash`)**

The spec says the placeholder must use `getPhrase('dropdown_choose', 'Choose')` from `useSplash`. But the current component has a hardcoded Hebrew string `'בחר...'` and no splash integration.

- **Option A** — Integrate `useSplash` and use `getPhrase` as specified (requires the splash context to be wired up in the component tree).
- **Option B** — Keep the hardcoded string for now; splash integration is a separate concern.

Which approach for this refactor?

> *Your answer:*
(A) I want the Dropdown to be fully integrated with useSplash.
1. Remove the hardcoded Hebrew string ('בחר...').
2. Use the hook: Implement const { getPhrase } = useSplash();
3. The call: Set the default placeholder to getPhrase('dropdown_choose', 'בחר...').

Note: Using the Hebrew string as the fallback in the getPhrase function is fine, but the primary source must be the Splash context.

---

**Q5 — `PasswordInput` toggle button positioning: `left-4` vs `inset-inline-end-4`**

There's a contradiction:
- The **spec file** (`password-input-component.md`) says: `left-4`.
- The **plan** (007-form-fields.md line 52) says: use `inset-inline-end-4` for automatic RTL/LTR.

`inset-inline-end-4` means "right side" in LTR and "left side" in RTL, which is correct RTL-aware behavior. But `left-4` is always left (correct for RTL/Hebrew, wrong for LTR).

Which is authoritative — the plan's RTL-aware `inset-inline-end-4`, or the spec's `left-4`?

> *Your answer:*
The Plan is authoritative. Use inset-inline-end-4.

The reasoning:
1. Logical Properties: We are building a modern, RTL-aware application. Using left-4 is a "hard" value that breaks if we ever support LTR.
2. RTL Correctness: In an RTL (Hebrew) layout, inset-inline-end correctly points to the left side of the input, which is exactly where the eye/toggle icon should be.
3. Consistency: This aligns with our use of Tailwind v4 and logical properties across the rest of the project.

Please ignore the left-4 in the spec file and stick to the logical inset-inline-end-4 utility.

---

**Q6 — `StringInput` default border color: `border-slate-200` vs `border-[oklch(...)]`**

The spec says `border-slate-200`, but the current component and every other component use `border-[oklch(0.929_0.013_255.50)]`. This oklch value appears to be a custom Tailwind theme token.

- **Option A** — Replace with `border-slate-200` to strictly match the spec.
- **Option B** — Keep `border-[oklch(0.929_0.013_255.50)]` as the design token (assume the spec is outdated and the theme value is authoritative).

Which is correct?

> *Your answer:*
(B) Maintaining the exact visual fidelity from AI Studio is the priority. Please keep using the border-[oklch(0.929_0.013_255.50)] value as it is the authoritative design token.

Important: Since we are using Tailwind v4, I suggest you define this specific OKLCH value as a semantic variable in your @theme block (e.g., --color-border-subtle: oklch(0.929 0.013 255.5);) in main.css. This way, you can use border-border-subtle in the components instead of hardcoding the complex OKLCH string everywhere.

---

*Waiting for your answers. I will not generate any code until you give the green light.*

---
### [2026-05-12] Implementation — Decisions Locked & Changes Applied

**Decisions recorded:**
- Q1: Full `cn()` swap across all 10 components.
- Q2: Full `EmailInput` spec — onBlur validation, local/external error priority, `type="email"`, `autoComplete="email"`, `spellCheck={false}`, `onValidationError` callback.
- Q3: Created `src/services/formatUtils.service.tsx` as the new formatting home. `utils.tsx` is now a re-export barrel (non-breaking for existing callers outside formFields).
- Q4: `Dropdown` uses `useSplash` → `getPhrase('dropdown_choose', 'בחר...')`.
- Q5: `PasswordInput` toggle uses `inset-inline-end-4` (RTL-aware).
- Q6: Kept `border-[oklch(0.929 0.013 255.5)]` as `--color-border-subtle` CSS variable in `@theme`; components use `border-border-subtle`.

**Files changed:**
- `src/main.css` — Added `--color-border-subtle` to `@theme`; added `slide-in-from-top-1` animation utility.
- `src/services/formatUtils.service.tsx` — Created; all 5 formatting functions live here.
- `src/services/utils.tsx` — Converted to re-export barrel (`export * from './formatUtils.service'`).
- `src/components/formFields/StringInput.tsx` — cn(), border-border-subtle, added `onBlur`/`autoComplete`/`spellCheck` props, focus:ring-4.
- `src/components/formFields/NumericInput.tsx` — cn(), border-border-subtle, aria-invalid/aria-describedby added, import from formatUtils.service.
- `src/components/formFields/YearOfBirth.tsx` — Fixed hardcoded `id="yearOfBirth"` → `React.useId()`.
- `src/components/formFields/PasswordInput.tsx` — `inset-inline-end-4`, focus-visible ring on toggle.
- `src/components/formFields/EmailInput.tsx` — Full spec: validation, local error state, type/autoComplete/spellCheck.
- `src/components/formFields/Button.tsx` — cn(), `focus-visible:ring-4`.
- `src/components/formFields/Dropdown.tsx` — cn(), useSplash placeholder, border-border-subtle.
- `src/components/formFields/Textarea.tsx` — cn(), border-border-subtle, kept `minHeight` prop (ContactPage & PropertyForm use custom heights).
- `src/components/formFields/Checkbox.tsx` — cn().
- `src/components/formFields/HtmlContent.tsx` — cn().

