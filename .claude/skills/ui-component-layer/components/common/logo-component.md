---
name: logo-component
description: The core brand identity component. Renders an inline SVG icon with an optional text mark ("דירה להשקעה"). Supports dynamic sizing and maintains aspect ratio across different layouts.
allowed_model: [gemini-3-flash]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
examples:                                                           
  - input: "Large logo with text for landing page"
    output: "<Logo size={64} showText={true} />"
  - input: "Small icon-only logo for navigation bar"
    output: "<Logo size={32} showText={false} />"
---

# Requirements
1. **Visuals**:
   - *Format*: Rendered as an inline SVG for full scalability.
   - *Typography*: Text elements MUST use `font-family: 'Assistant', sans-serif`.
   - *Structure*: If `showText` is true, render two `<text>` elements stacked vertically.
   - *SVG Specs*: Maintain the `viewBox` logic to accommodate the icon and the dynamic text block.

2. **Behavior**:
   - *Dynamic Sizing*: Calculate `svgWidth` and `viewBoxWidth` based on the `showText` state.
   - *Directionality*: Explicitly wrap in `dir="ltr"` or set on SVG to ensure coordinate consistency in RTL environments.
   - *Alignment*: Shift the `__icon-group` using `transform` when text is present.

3. **Dynamic Text Logic**:
   - *Retrieval*: Use `getPhrase('drawer_logo_alt', 'Investment Property')`.
   - *Processing*: 
     - Split the string by the *first space*.
     - Handle edge cases: If no space exists, display the whole string in the first (Navy) slot.
   - *Coloring*: 
     - Part 1 (First word): Navy Blue (`#1E3A8A`).
     - Part 2 (Rest of string): Royal Blue (`#2563EB`).

4. **Props Definition**:
   - `size`: number (Default: 32).
   - `showText`: boolean (Default: false).
   - `className`: string (Optional).

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── animations/
    │       └── Logo.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  


# Component Specification
```TypeScript
import { Logo } from './Logo';

// Usage in Layout<Logo size={64} className="mb-4" showText={true} />