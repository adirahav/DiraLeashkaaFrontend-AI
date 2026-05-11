---
name: Checkbox-component
description: A custom-styled checkbox input. Replaces the native browser checkbox with a stylized 6x6 box, supporting labels, sub-descriptions, and hover effects.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Create a simple checkbox with a label"                                         
     output: "<Checkbox label='אני מסכים לתנאים' checked={agree} onChange={setAgree} />"
---

# Requirements
1. **Visuals**:
   - **Custom Box:** 24x24px (`w-6 h-6`), `border-2`, `rounded-lg`. 
   - **Checked State:** Background and border switch to `blue-600`.
   - **Icon:** A white checkmark SVG that fades in when checked.
   - **Typography:** Bold `slate-700` label with an optional `slate-400` description.
2. **Behavior**:
   - **Interaction:** The entire label (including text) is clickable (`cursor-pointer`).
   - **Accessibility:** Uses a hidden native input (`sr-only`) with `React.useId()` for proper `htmlFor` linking.
   - **Hover:** Both the box border and the label text transition to `blue` on hover (unless disabled).
3. **Props Definition (Component API)**:
   - `label`: string (required).
   - `checked`: boolean (required).
   - `onChange`: (checked: boolean) => void (required).
   - `description`: string (optional).
   - `disabled`: boolean (default: false).

# CSS Structure
- Modifiers: 
    - `is-checked`: To trigger background/opacity changes.
    - `is-disabled`: Grayscale/Opacity suppression.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── Checkbox.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<Checkbox 
  label="ביטוח חיים" 
  checked={hasInsurance} 
  onChange={setHasInsurance}
  description="עלות משוערת: 150 ₪ בחודש"
/>