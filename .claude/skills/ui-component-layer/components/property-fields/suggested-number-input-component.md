---
name: suggested-number-input-component
description: A high-level numeric input that supports a "rollback" to a default value and an optional unit suffix. It handles thousands separation internally while keeping the parent state as a pure number.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @string-input-component.md (UI Wrapper)
  - @rollback-button-component.md (Utility Action)
  - @services/formatUtils.service.tsx (Formatting Engine) 
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create a mortgage broker input with 8000 as default" 
     output: "<SuggestedNumberInput label='יועץ' value={val} onChange={setVal} defaultValue={8000} />"
---

# Requirements
1. **Visuals**:
- *Suffix:* Positioned absolutely on the left (`left-3`), bold and slate-400.

- *Rollback:* The `RollbackButton` should appear on the left only when `value !== defaultValue`.

- *Direction:* Uses `dir="ltr"` for the input field to ensure numeric readability.

2. **Behavior**:
- *Data Type:* Must convert the string input to a `number` before calling `onChange`.

- *Formatting:* Displays the number with US-style commas (`toLocaleString`) but strips them on change.

- *Rollback Logic:* Clicking the rollback icon sets the value back to `defaultValue`.

3. **Props Definition (Component API)**:
- `value`: number (required)
- `onChange`: (val: number) => void (required)
- `defaultValue`: number (optional)
- `suffix`: string (optional)
- Inherits: `label`, `disabled`, `tooltip`, `error`, etc.

# Tailwind Implementation Logic
- *Relative Container:* The wrapper uses `relative flex items-center` to act as the anchor for absolute children.

- *Left-Side Stack:* If both `suffix` and `RollbackButton` are present, they are managed within a flex container on the left (`left-3`) to maintain consistent alignment.

- *Dynamic Padding:* Use `cn` to conditionally apply `ps-8` or `ps-12` based on the presence of the suffix or rollback button to keep the numeric text clear of icons.

# Files Structure 
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── SuggestedNumberInput.tsx
    ├── lib/
    │   └── utils.ts                          # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)

# Component Specification
```TypeScript
<SuggestedNumberInput
  label="שכר טרחה"
  value={fee}
  onChange={setFee}
  defaultValue={5000}
  suffix="₪"
  tooltip="המחיר הממוצע בשוק"
/>