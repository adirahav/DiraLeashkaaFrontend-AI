---
name: calc-input-component
description: A read-only display field styled to match the form's input theme. Used for showing static calculated results or automated outputs where user editing is disabled. Supports multiple color variants.

# References & Dependencies
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @services/formatUtils.service.tsx (Formatting Engine) 
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Show calculated purchase tax value"
     output: "<CalcInput label='מס רכישה' value={formatCurrency(tax)} variant='danger' />"
---

# Requirements
1. **Visuals**:
- *Background:* Always uses `bg-slate-50` to clearly indicate a read-only state.

- *Height:* Fixed 54px to maintain vertical alignment with editable `StringInput` fields.

- *Border:* Standard light border (`oklch(0.929_0.013_255.50)`) with `rounded-xl`.

- *Typography:* Text is aligned to the right (`text-right`) and uses a normal font weight.

- *Variants:* 2 color themes (default, danger). Each affects background, border, text colors, and error tooltip.

2. **Behavior**:
- *Non-Interactive:* Implemented as a `div` to ensure no focus, selection (optional), or keyboard interaction.

- *Formatting:* Expects pre-formatted strings (usually via `formatCurrency` or `formatNumber` from utils.tsx).

- *Prop Flexibility:* The `value` prop accepts `ReactNode`, but is typically used with pre-formatted strings (e.g., via `formatCurrency`).

3. **Props Definition (Component API)**:
- `value`: ReactNode (required)
- `label`: ReactNode (optional)
- `tooltip`: string (optional)
- `errorAsTooltip`: string (optional)
- `id`: string (optional)
- `className`: string (optional)
- `variant`: string (optional)
   
# Tailwind Implementation Logic
- *Variant Mapping:* Use a mapping object inside the component to apply conditional classes:

```TypeScript
const variants = {
  default: "bg-slate-50 border-[oklch(0.929_0.013_255.50)] text-slate-900",
  danger: "bg-red-50/50 border-red-200 text-red-700"
};
```

- *Container Layout:* `flex flex-col gap-1.5` to separate the label and the display box.

- *Display Box:* `flex items-center px-4 transition-colors duration-200`. Use `cn` to merge base classes with the variant-specific ones.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── CalcInput.tsx
    ├── services/
    │   └── formatUtils.service.tsx
    ├── lib/
    │   └── utils.ts                          # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
<CalcInput
  label="סה״כ עלות נכס"
  value={formatCurrency(totalCost)}
  tooltip="הסכום הסופי לאחר כל העמלות"
/>