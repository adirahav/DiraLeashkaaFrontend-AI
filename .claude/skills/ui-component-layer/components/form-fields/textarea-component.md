---
name: textarea-component
description: A multi-line text input component. Designed for longer descriptions or comments, featuring a fixed-size or scrollable area with consistent labeling and error states.
reference:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @tooltip-component.md (Core Engine & Logic)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Add a comments field for the property"                                         
     output: "<Textarea label='הערות' value={notes} onChange={setNotes} placeholder='כתוב כאן...' />"
---

# Requirements
1. **Visuals**:
   - **Dimensions:** Minimum height of 120px (`min-h-[120px]`).
   - **Padding:** Internal padding of 14px (`p-3.5`) for better readability of multi-line text.
   - **Styling:** Consistent with `StringInput` regarding borders, focus rings, and error backgrounds.
2. **Behavior**:
   - **Resize Control:** Disabled by default (`resize-none`) to maintain layout integrity.
   - **Accessibility:** Uses `React.useId()` for labels and `aria-describedby` for error linking.
3. **Props Definition (Component API)**:
   - `value`: string (required)
   - `onChange`: (val: string) => void (required)
   - `label`: ReactNode (optional)
   - `placeholder`: string (optional)
   - `error`: string (optional)
   - `disabled`: boolean (default: false)
   - `required`: boolean (optional)
   - `className`: string (optional, applied to the container)

# CSS Structure
- Modifiers: 
    - `is-error`: Red border/bg state.
    - `is-disabled`: Grayscale/Opacity state.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── Textarea.tsx
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<Textarea
  label="מידע נוסף"
  value={text}
  onChange={setText}
  placeholder="פרטים נוספים..."
  minHeight="150px"
  error={formErrors.info}
/>