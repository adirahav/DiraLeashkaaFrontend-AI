---
name: interactive-label-component
description: A dynamic label that toggles between a static text/button view and an inline range slider. Used for interactive financial simulations where users can adjust percentages via dragging. 
references:
   - @ui-component-layer/SKILL.md  
   - @css-layer/SKILL.md
allowed_model: [gemini-3-flash]
examples:                                                           
   - input: "Create a yield simulator label with 3.5% default"
     output: "<InteractiveLabel label='תשואה צפויה' percent={3.5} min={1} max={10} step={0.1} onPercentChange={setYield} />"
   - input: "Show interactive interest rate with manual override guard"
     output: "<InteractiveLabel label='ריבית' percent={4.2} min={0.5} max={15} onPercentChange={setRate} showPercent={isAutoCalc} />"
---

# Requirements
1. **Visuals**
- *Trigger State:* The percentage (e.g., "3.5%") appears as a blue, bold, underlined button.

- *Slider State:* An inline `input[type="range"]` with custom styling:
   - Track: `bg-slate-200`, height 4px (`h-1`).
   - Thumb: Blue (`blue-600`), 12x12px (`w-3 h-3`), fully rounded.

- *Animations:* Uses `animate-in fade-in` and `slide-in-from-left-2` for smooth transitions between label and slider.

2. **Behavior**
- *Toggle Logic:* Clicking the percentage button opens the slider. Clicking outside or selecting a value (via blur/outside click) closes it.

- *Manual Override Detection:* Hides the percent trigger if the current value doesn't match the calculated percentage (detected via `disposable` and `currentValue`).

- *Accessibility:* Uses `React.useId` for unique element linking and `type="button"` for the trigger.

3. **Props Definition (Component API)**
- `label`: string (The main text).
- `percent`: number (The current percentage value).
- `min/max/step`: number (Slider constraints).
- `onPercentChange`: (val: number) => void.
- `showPercent`: boolean (Optional override).

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── InteractiveLabel.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<InteractiveLabel 
  label="תשואה צפויה"
  percent={3.5}
  min={1}
  max={10}
  step={0.1}
  onPercentChange={(val) => setYield(val)}
/>