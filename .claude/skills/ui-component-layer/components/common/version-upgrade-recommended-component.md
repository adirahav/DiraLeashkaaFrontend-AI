---
name: version-upgrade-recommended-component
description: A thin, high-priority announcement bar for non-breaking app updates (minor/patch). Notifies users of available improvements without blocking usage, providing a direct link to the store.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file]
references:
  - @ui-component-layer/SKILL.md
  - @css-layer/SKILL.md
  - @app-layer/SKILL.md

examples:                                                           
   - input: "Render a recommended update banner"                          
     output: "<UpgradeRecommended onClose={() => setVisible(false)} />"
---

# Requirements
1. **Visuals:**
- *Gradient Surface:* A vibrant `bg-gradient-to-r from-blue-600 to-indigo-600` to draw attention without the severity of an error.

- *Elevation:* Fixed or relative placement with `z-50` and a subtle `shadow-sm` for depth.

- *Typography:* Compact and authoritative (`text-xs` or `text-[10px]`) to maintain low-profile integration at the top/bottom of the layout.

- *Interactive Elements:*
    - `Call to Action:` A high-contrast pill button (`bg-white text-blue-700`) with an external link icon.
    - `Close Trigger:` A subtle X icon for dismissal, respecting user choice for non-mandatory updates.

2. **Behavior:**
- *Dismissibility:* The component must call the `onClose` callback to be removed from the DOM/View.

- *Animated Polish:* Uses an amber `Sparkles` icon with an `animate-pulse` effect to signify "new/shiny" content.

- *RTL Support:* Hardcoded `dir="rtl"` to ensure Hebrew text and icon alignment (Sparkles on right, Close on left).

3. **Props Definition (Component API):**
- `onClose:` () => void (required).

# Tailwind Implementation Logic
- *Layout:* `flex items-center justify-between` for a horizontal bar layout.

- *Responsive Padding:* `py-2 px-4` to ensure touch targets for the "Update" button are accessible but slim.

- *Transition States:* `hover:bg-blue-50` for the CTA and `hover:bg-white/10` for the close button to provide instant tactile feedback.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── UpgradeRecommended.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
import { UpgradeRecommended } from './components/common/UpgradeRecommended';

{showRecommendedBanner && (
  <UpgradeRecommended 
    onClose={() => setShowRecommendedBanner(false)} 
  />
)}