---
name: auto-fill-input-component
description: A numeric input that displays a rollback (RotateCcw) button when the value differs from a provided default. Designed for financial fields with preset defaults.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @string-input-component.md (UI Wrapper)
  - @services/utils.tsx (Formatting Engine)

allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]

examples:                                                           
   - input: "Create an equity input with a financial default"                                         
     output: "<AutoFIllInput label='הון עצמי' value={equity} defaultValue={500000} onChange={setEquity} />"
---

# Requirements
1. **Visuals**:
- *Action Button:* A circular button with `RotateCcw` icon (size 14), positioned `absolute` at `left-3`.

- *Hover State:* Button transitions to `text-blue-600` and `bg-blue-50` on hover.

- *Input Direction:* Forced `dir="ltr"` for numeric clarity.

2. **Behavior**:
- *Rollback Logic:* The button only appears if `value !== defaultValue`.

- *Data Conversion:* Must strip commas from input before `parseInt` and call `onChange` with a `number`.

- *Formatting:* Uses `formatNumber(value, true)` from utils.tsx to display thousands separators.

3. **Props Definition (Component API)**:
- `value`: number (required)
- `defaultValue`: number (required)
- `onChange`: (val: number) => void (required)
- Inherits: `label`, `disabled`, `tooltip`, `error`, `placeholder`, `required`.

# Tailwind Implementation Logic
- *Positioning:* The container uses `relative flex items-center` to center the rollback button vertically against the input height.

- *Merge Utility:* Use `cn` to handle the conditional rendering and potential `disabled` styles (e.g., `pointer-events-none opacity-50`).

- *Input Padding:* Ensure the input has enough left padding (`ps-10`) so the text doesn't overlap with the rollback button

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── AutoFIllInput.tsx
    ├── services/
    │   └── utils.service.tsx
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)   

# Component Specification
```TypeScript
import { formatNumber } from '../services/utils.service';

<AutoFIllInput
  label="הון עצמי (₪)"
  value={equity}
  defaultValue={FINANCIAL_DEFAULTS.equity}
  onChange={setEquity}
  required
/>