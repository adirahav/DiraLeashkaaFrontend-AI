---
name: financing-status-component
description: A visual health-check component for mortgage financing. Displays a progress bar, current vs. max percentages, and dynamic status badges (Success/Warning) based on the financing limit.
references:
    - @ui-component-layer/SKILL.md  
    - @css-layer/SKILL.md
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Show financing progress for 60% out of 75% limit"
     output: "<FinancingStatus actualFinancingPercent={60} maxFinancingPercent={75} />"
---

# Requirements
1. **Visuals**:
- *Progress Bar:* Height 12px (`h-3`), rounded-full, with a transition duration of 1000ms.

- *Colors:* `emerald-500` for normal state, `red-500` for exceeded state.

- *Status Badges:* Rounded-xl with subtle borders and icon-text alignment.

- *Max Marker:* A vertical 2px line at the 100% mark of the progress bar.

2. **Behavior**:
- *IsExceeded Logic:* Calculated as `actual > max`. Triggers red color scheme and "Pulse" animation on the warning badge.

- *Loading State:* An absolute overlay with `backdrop-blur-[1px]` and `bg-white/40` when `isLoading` is true.

- *Responsiveness:* Switches from `flex-row` (desktop) to `flex-col` (mobile) with a gap of 32px (`gap-8`).

3. **Props Definition (Component API)**:
- `actualFinancingPercent`: number (required)
- `maxFinancingPercent`: number (required)
- `isLoading`: boolean (required)
- `showSuccessStatus`: boolean (default: true)
- `className`: string (optional)

# Tailwind Implementation Logic
- *State Management:* Use the `cn` utility to toggle classes:
   - `barFillClasses:` `isExceeded ? 'bg-red-500' : 'bg-emerald-500'`.
   - `badgeClasses:` isExceeded ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'.

- *Progress Calculation:* Apply `style={{ width: \${Math.min(100, (actual / max) * 100)}% }}` directly to the fill element.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── FinancingStatus.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<FinancingStatus 
  isLoading={isLoading}
  actualFinancingPercent={78} // Current mortgage %
  maxFinancingPercent={75}    // Bank limit %
  showSuccessStatus={true}    // Whether to show the green badge if valid
  className="my-6"            // Layout override
/>