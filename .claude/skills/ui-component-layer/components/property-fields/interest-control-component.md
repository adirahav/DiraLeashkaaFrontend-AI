---
name: interest-control-component
description: A specialized financial input for interest rates and index adjustments. Combines a prominent value display, a rollback trigger, and an inline range slider for rapid simulations.
references:
   - @ui-component-layer/SKILL.md  
   - @css-layer/SKILL.md
   - @rollback-button-component.md
allowed_model: [gemini-3-flash]
examples:                                                           
   - input: "Create an interest rate control with value and defaultValue 4.69%, and range {min: 0, max: 10, step: 0.1}"
     output: "<InterestControl label="ריבית" value={4.69} onChange={setInterest} onRollback={() => setInterest(4.69)} defaultValue={4.69} min={0} max={10} step={0.1} disabled={isCalculating} />"
---

# Requirements
1. **Visuals**
- *Container:* White background, `rounded-2xl`, with a subtle `slate-200` border. Uses `overflow-hidden` to maintain the rounded aesthetic.

- *Display Unit:* The main value is housed in a `slate-50/30` box, centered, with `font-black text-blue-600` and responsive sizing (`text-xl sm:text-2xl`).

- *Slider (Range):* - Track: Thin `bg-slate-200 height` `h-1`.
   - Thumb: Blue (`bg-blue-600`), sized at `3.5` units (`14px`), perfectly rounded.

- *Disabled State:* Applies `opacity-60 grayscale-[0.2]` to the entire container and `cursor-not-allowed` to the inputs.

2. **Behavior**
- *Rollback Logic:* The `RollbackButton` is absolutely positioned within the value box. It only renders if `value !== defaultValue` and the component is not `disabled`.

- *Range Slider:*
   - Must force `dir="ltr"` and `style={{ direction: 'ltr' }}` to ensure the slider moves correctly from left to right regardless of the application's RTL state.
   - Displays min/max values as small, bold labels (`text-[9px] font-black`) at the slider ends.

- *Accessibility:* Uses `React.useId` for unique ID generation for the range input and rollback button.

3. **Props Definition (Component API)**
- `label`: string (The title, e.g., "ריבית").
- `value`: number (The current value).
- `defaultValue`: number (The original value for comparison).
- `onChange`: (val: number) => void.
- `onRollback`: () => void.
- `min/max/step`: number (Optional, defaults: 0, 10, 0.1).
- `disabled`: boolean (Optional).

# Tailwind Implementation Logic
- *Custom Slider:* Use arbitrary variants to style the browser-specific range thumb:
   - `[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600`.

- *Merging:* Use the `cn` utility to handle the `disabled` state on the container.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   ├── property-fields/
    │   │   └── InterestControl.tsx
    ├── services/
    │   └── formatUtils.service.tsx           # Dependency
    ├── lib/
    │   └── utils.ts                          # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)   

# Component Specification
```TypeScript
import { InterestControl } from './InterestControl';

<InterestControl 
  label="ריבית" 
  value={4.8} 
  defaultValue={4.69} 
  min={2}
  max={8}
  step={0.1}
  onChange={(val) => setInterest(val)} 
  onRollback={() => setInterest(4.69)} 
/>