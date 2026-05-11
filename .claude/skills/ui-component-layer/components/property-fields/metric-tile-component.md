---
name: metric-tile-component
description: High-fidelity KPI tile for financial metrics. Supports color variants, logical typography, and responsive scaling. Essential for summarizing yields, profits, and equity data.
references:
    - @ui-component-layer/SKILL.md  
    - @css-layer/SKILL.md
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
	- input: "Create a blue yield metric tile"
     output: "<MetricTile label="תשואה ממוצעת" value={formatPercent(bestProperty.calcYields.averageReturn)} variant="blue" />"
---

# Requirements
1. **Visuals**
- *Variants:* Supports 3 core variants (expandable):
   - `blue`: `bg-blue-50/50 border-blue-100 text-blue-600`
   - `teal`: `bg-teal-50/50 border-teal-100 text-teal-600`
   - `slate`: `bg-slate-50/50 border-slate-100 text-slate-800`

- *Typography:*
   - Label: `text-slate-500 text-[10px] uppercase font-bold tracking-tight`.
   - Value: `font-black text-xl md:text-2xl tracking-tighter`.

- *Structure:* Rounded corners (`rounded-2xl`) and subtle border.

2. **Behavior**
- *Layout:* Flex-column to stack label and value.

- *Consistency:* Use logical properties (`text-start`) for RTL support.

- *Responsiveness:* Value text size should scale slightly for mobile vs desktop.


3. **Props Definition (Component API)**
- `label`: string (required) - The KPI title.

- `value`: string | number (required) - The formatted data to display.

- `variant`: 'blue' | 'teal' | 'slate' (default: 'slate').

- `className`: string (optional) - For custom grid/width overrides.


# Tailwind Implementation Logic
- *Variant Mapping:* Use a mapping object inside the component or a `cva` (if installed) to handle classes via `cn`.

- *Soft Backgrounds:* Use `/50` opacity on backgrounds (e.g., `bg-blue-50/50`) to create a modern, "glassy" financial look that isn't too heavy.

- *Alignment:* Ensure the container is `flex flex-col justify-between`.

# Files Structure
ROOT-PROJ
└── src/
    ├── components/
    │   └── PropertyFields/
    │       └── MetricTile.tsx   
    ├── lib/
    │   └── utils.ts                          # cn utility
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)   


# Component Specification
```TypeScript
import { MetricTile } from './PropertyFields/MetricTile';

<div className="grid grid-cols-2 gap-4">
  <MetricTile 
    label="תשואה ממוצעת" 
    value="5.8%" 
    variant="blue" 
  />
  <MetricTile 
    label="רווח נקי" 
    value="₪420,000" 
    variant="teal" 
  />
</div>
```