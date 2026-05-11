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
    
*AI says:* 
