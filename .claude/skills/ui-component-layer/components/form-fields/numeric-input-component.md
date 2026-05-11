---
name: numeric-input-component
description: Use this component for numeric-only data entry. It automatically handles thousands separation (commas), restricts non-digit characters, and optimizes the mobile experience with the numeric input mode.
references: 
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @string-input-component.md (Core Engine)
  - @tooltip-component.md (Core Engine)
  - @services/formatUtils.service.tsx (Formatting Engine) 
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Add a price input with commas"                                         
     output: "<NumericInput label='מחיר נכס' value={price} onChange={setPrice} formatWithCommas={true} />"
   - input: "Refactor raw NumericInput from studio"
     output: "I will refactor the NumericInput to use Tailwind utility classes for all states (error, disabled, focus) and ensure the formatting logic is handled within the component's `onChange` handler."
---

# Requirements
1. **Visuals**:
   - Fixed height of 54px.
   - Consistent styling with `StringInput` for error and disabled states.
   - RTL alignment for text and placeholders by default.

2. **Behavior**:
   - **Regex Filtering:** Must strip any non-digit characters (`\D`) on change.
   - **Formatting:** Supports dynamic thousands separation using commas (e.g., 1,000,000) via `formatWithCommas` prop.
   - **Mobile Optimization:** Must include `inputMode="numeric"` to trigger the correct virtual keyboard.
   - **Max Length:** Supports a `maxLength` prop to limit digits before formatting.

3. **Props Definition (Component API)**:
   - `value`: string (required - stored as formatted string)
   - `onChange`: (value: string) => void (required)
   - `id`: string (required)
   - `label`: ReactNode (optional)
   - `formatWithCommas`: boolean (default: true)
   - `maxLength`: number (optional)
   - `required`: boolean (optional)
   - `disabled`: boolean (optional)
   - `error`: string (optional)
   - `tooltip`: string (optional)

# Tailwind Implementation Logic
- *Base Styling: Height `h-[54px]`, `rounded-xl`, and `border-slate-200`.

- *State Classes: Use `cn` to toggle:
  - Error: `border-red-500 bg-red-50` when the `error` prop is present.
  - Disabled: `opacity-50 cursor-not-allowed bg-slate-50`.
  - Focus: `focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── NumericInput.tsx
    ├── lib/
    │   └── utils.ts       # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
<NumericInput
  id="loan-amount"
  label="סכום הלוואה"
  value={amount}
  onChange={(val) => setAmount(val)}
  placeholder="0"
  formatWithCommas={true}
  maxLength={9}
  tooltip="הסכום הכולל בשקלים"
/>