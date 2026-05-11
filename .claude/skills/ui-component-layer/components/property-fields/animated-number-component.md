---
name: animated-number-component
description: A high-performance logic component that animates numeric transitions using requestAnimationFrame and exponential easing. It ensures smooth visual feedback when financial data updates.
reference:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @services/utils.tsx (Formatting Engine)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Animate a currency value change"                                         
     output: "<AnimatedNumber value={total} formatter={formatCurrency} />"
---

# Requirements
1. **Logic**:
- *Easing:* Uses an exponential out easing function (`1 - Math.pow(2, -10 * progress)`) for a "premium" feel.

- *Precision:* Handles decimal preservation during animation to prevent flickering.

- *Performance:* Uses `requestAnimationFrame` and `useRef` to avoid unnecessary re-renders of the logic, only updating the `displayValue` state.

2. **Behavior**:
- *Cleanup:* Must cancel the animation frame on unmount to prevent memory leaks.

- *Sync:* Resets the `startTimeRef` and updates `valueRef` immediately upon animation completion.

3. **Props Definition (Component API)**:
- `value`: number (the target end value).

- `formatter`: (val: number) => ReactNode (function to style the number, e.g., adding ₪ or commas).

- `duration`: number (default: 1500ms).

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── AnimatedNumber.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)   

# Component Specification
```TypeScript
<AnimatedNumber 
  value={currentEquity} 
  formatter={(v) => <strong>{formatCurrency(v)}</strong>} 
  duration={2000} 
/>