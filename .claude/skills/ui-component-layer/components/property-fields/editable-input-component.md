---
name: editable-input-component
description: A sophisticated input component designed for simulation fields. It supports interactive labels (drag/slide to change), a rollback mechanism for modified values, and toggling between editable and read-only states.
references:
    - @ui-component-layer/SKILL.md  
    - @css-layer/SKILL.md
    - @interactive-label-component.md (Label Logic)
    - @rollback-button-component.md (Action Logic)
    - @tooltip-component.md (Action Logic)
    - @services/formatUtils.service.tsx (Formatting Engine) 
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create an editable rent input with a slider label"
     output: "<EditableInput label='שכירות' value={formatNumber(rent)} interactiveProps={{ percent: 3.5, min: 1, max: 10 }} isModified={true} onRollback={reset} />"
---

# Requirements
1. **Visuals**:
- *Border:* Uses a slightly thicker `border-2` for emphasis compared to standard inputs.

- *Focus State:* Transitions to `border-blue-400` on focus.

- *Rollback Placement:* The `RollbackButton` is positioned `absolute` at `left-3`.

- *Placeholder:* Uses a specific `text-blue-200` color for placeholders to distinguish simulation fields.

2. **Behavior**:
- *Interactive Label:* If `interactiveProps` are provided, it renders `InteractiveLabel` instead of a static `label`.

- *Read-Only Mode:* Supports `isEditable={false}` which adds `bg-slate-50/50` and `cursor-default`.

- *Modification Tracking:* Shows the rollback UI only when `isModified` is true and an `onRollback` function is provided.

3. **Props Definition (Component API)**:
- `value`: string (required)
- `onChange`: (e: ChangeEvent<HTMLInputElement>) => void (required)
- `isModified`: boolean (optional, triggers rollback UI)
- `onRollback`: () => void (required if isModified is used)
- `interactiveProps`: Configuration for the smart label (min, max, percent, etc.)
- `isEditable`: boolean (default: true)
- Inherits: `label`, `tooltip`, `disabled`, `dir`, `placeholder`.

# Tailwind Implementation Logic
- *Conditional Styling:* 
```TypeScript
const containerClasses = cn(
  "relative border-2 rounded-xl transition-all",
  isEditable ? "bg-white border-slate-200 focus-within:border-blue-400" : "bg-slate-50/50 border-slate-100 cursor-default"
);
```

- *Logical Alignment:*
   - Uses `ps-4 pe-10` to leave space for icons/rollback buttons on the left.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── EditableInput.tsx
    ├── services/
    │   └── formatUtils.service.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<EditableInput
  label="תשואה צפויה"
  value={formatPercent(yield)}
  interactiveProps={{
    percent: yield,
    min: 2,
    max: 8,
    onPercentChange: (v) => setYield(v)
  }}
  isModified={isModified}
  onRollback={handleReset}
/>