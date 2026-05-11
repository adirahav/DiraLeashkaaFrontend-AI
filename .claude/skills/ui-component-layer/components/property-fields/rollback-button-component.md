---
name: rollback-button-component
description: A compact utility button used to reset input values to their original or default state. Features a RotateCcw icon and standardized hover/disabled states.
references:
    - @ui-component-layer/SKILL.md  
    - @css-layer/SKILL.md
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create a reset button for a numeric field"                                         
     output: "<RollbackButton onClick={handleReset} />"
---

# Requirements
1. **Visuals**:
- *Icon:* `RotateCcw` from `lucide-react`, sized at 14px.

- *Padding:* Compact `p-1.5` for a square-like action area.

- *Color:* Starts as `slate-400`, transitions to `blue-600` text and `blue-50` background on hover.

- *Corners:* `rounded-lg` for a modern, soft look.

2. **Behavior**:
- *Type:* Must be `type="button"` to avoid triggering form submissions.

- *Disabled State:* 50% opacity, grayscale filter, and `cursor-not-allowed`.

- *Accessibility:* Includes a native `title` attribute ("חזור לערך המקורי") for screen readers and tooltips.

3. **Props Definition (Component API)**:
- `onClick`: () => void (required)
- `disabled`: boolean (default: false)
- `id`: string (optional)

# Tailwind Implementation Logic
- *Base Styling:* `inline-flex items-center justify-center transition-all duration-200`.

- *State Merging:* Use `cn` to toggle between:
   - Active: `hover:text-blue-600 hover:bg-blue-50 cursor-pointer`.
   - Disabled: `opacity-50 grayscale cursor-not-allowed pointer-events-none`.

- *Layout:* Usually placed inside an input's relative container using `absolute`.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── RollbackButton.tsx
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript

<RollbackButton 
  onClick={() => console.log('Resetting value...')} 
  disabled={isLoading} 
/>