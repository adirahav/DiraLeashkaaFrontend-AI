---
name: string-input-component
description: Use this component for standard text, password, or numeric string inputs. It provides a consistent structure for labels, tooltips, validation errors, and supports custom children (like icons or rollback buttons) inside the input container.
reference:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @tooltip-component.md (Core Engine & Logic)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Add a required text input for 'Full Name'"
     output: "<StringInput label='שם מלא' value={name} onChange={setName} required />"
   - input: "Refactor raw StringInput from studio"
     output: "I will implement the StringInput using Tailwind utility classes for all states (focus, error, disabled) and integrate the `cn` utility for clean conditional class merging."
---

# Requirements
1. **Visuals**:
   - Fixed height of 54px for the input field.
   - Support for error states (red border/background) and disabled states (grayscale/opacity).
   - Label typography matches the project's bold style (`text-slate-700 font-bold`).

2. **Behavior**:
   - Internal ID generation using `React.useId()` if no ID is provided via props.
   - Accessibility: Uses `aria-invalid`, `aria-describedby`, and `aria-hidden` for error and required indicators.
   - Support for `children` rendered inside the relative container (useful for absolute-positioned icons or buttons).
   
3. **Props Definition (Component API)**:
   - `value`: string (required)
   - `onChange`: (e: ChangeEvent<HTMLInputElement>) => void (required)
   - `label`: ReactNode (optional)
   - `type`: string (default: 'text')
   - `dir`: 'ltr' | 'rtl' (default: 'rtl')
   - `error`: string (optional, triggers error styles)
   - `tooltip`: string (optional, renders HelpCircle icon)
   - `required`: boolean (optional)
   - `disabled`: boolean (optional)

# Tailwind Implementation Logic
- *Input Field:* Use `h-[54px]`, `w-full`, `rounded-xl`, and transition-all.

- *Container:* Use `relative` for the wrapper to support absolute-positioned children (icons/buttons).

- *State Classes (via cn):*
  - Default: `border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`.
  - Error: `border-red-500 bg-red-50 focus:ring-red-500/10`.
  - Disabled: `bg-slate-50 text-slate-400 cursor-not-allowed`.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── StringInput.tsx
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
<StringInput
  label="שם פרטי"
  value={val}
  onChange={(e) => setVal(e.target.value)}
  placeholder="הכנס שם..."
  error={errors.name}
  required
  tooltip="כפי שמופיע בתעודת הזהות"
/>