---
name: button-component
description: A multi-variant button component. It handles primary, secondary, outline, and success states with consistent shadows, scaling effects on click, and focus rings.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Create a primary submit button"                                         
     output: "<Button type='submit' variant='primary'>שלח טופס</Button>"
   - input: "Refactor raw Button from studio"
     output: "I will implement the Button using the `cn` utility to merge Tailwind classes, ensuring all variants are defined via a mapping object inside the component file."
---

# Requirements
1. **Visuals**:
   - **Variants**: 
     - `primary`: Blue-600 with shadow-blue-200.
     - `secondary`: Teal-600 with shadow-teal-200.
     - `outline`: Slate-200 border, slate-600 text.
     - `success`: Emerald-600 with shadow-emerald-200.
   - **Feedback**: Must have `active:scale-95` and `transition-all 200ms`.
   - **Focus**: `focus-within` or `focus` should trigger a `ring-4`, implemented via Tailwind `focus-visible:ring-4` classes.
2. **Behavior**:
   - Support for `disabled` state (50% opacity, `not-allowed` cursor).
   - Support for standard `button` and `submit` types.
   - Clean prop forwarding for `className` to allow layout-specific overrides.
3. **Props Definition (Component API)**:
   - `children`: ReactNode (required)
   - `variant`: 'primary' | 'secondary' | 'outline' | 'success' (default: 'primary')
   - `type`: 'button' | 'submit' (default: 'button')
   - `onClick`: () => void (optional)
   - `disabled`: boolean (optional)
   - `ariaLabel`: string (optional)

# Tailwind Implementation Logic
- *Base Classes:* Core sizing, transitions, and flex alignment.

- *Variant Mapping:* A constant object defining the specific utility classes for each variant (e.g., `primary: "bg-blue-600 shadow-blue-200 text-white"`).

- *Conflict Resolution:* Use the `cn` utility to allow `className` props to override default padding or margins.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── Button.tsx
    ├── lib/
    │   └── utils.ts       # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
<Button 
  variant="success" 
  onClick={handleSubmit} 
  ariaLabel="Confirm purchase"
>
  אישור ורכישה
</Button>