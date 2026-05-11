---
name: metric-card-component
description: Use this component to highlight key financial KPIs or high-level investment metrics (like Yield, ROI, or Price). Use it when you need a visually prominent, animated summary card that responds to scroll depth by scaling down.
references:
    - @ui-component-layer/SKILL.md  
    - @css-layer/SKILL.md
    - @animated-number-component.md (Core Engine & Logic)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
	- input: "Create a MetricCard for annual yield of 5.2%"
     output: "<MetricCard value={5.2} label='Annual Yield' isScrolled={isScrolled} formatter={formatPercent} variant='emerald' />"
   - input: "Refactor raw MetricCard from studio"
     output: "I will implement the variants and scroll-based scaling using Tailwind's dynamic classes and the cn utility, ensuring smooth transitions."
---

# Requirements
1. **Visuals**
- Supports 4 variants: emerald, blue, indigo, slate.

- Must handle a "scrolled" state by scaling down.

- High emphasis on typography (font-black for labels).

2. **Behavior**
- Must use `AnimatedNumber` for the value display.

- Must accept a `formatter` function for currency/percent logic.

3. **Props Definition (Component API)**
- `value`: number (required)

- `label`: string (required)

- `isScrolled`: boolean (affects scale)

- `formatter`: (val: number) => ReactNode

- `variant`: MetricVariant (default: 'emerald')

4. **Scrolled State**: When `isScrolled` is true, the card should scale down (e.g., `scale-90` or `scale-75`) and potentially reduce padding/text-size for a compact header-look.

# Tailwind Implementation Logic
- *Variant Mapping:* Use a constant object to map variants to specific Tailwind background, text, and border colors:
   - `emerald:` `bg-emerald-50 text-emerald-700 border-emerald-100`
   - `blue:` `bg-blue-50 text-blue-700 border-blue-100`
   - `indigo:` `bg-indigo-50 text-indigo-700 border-indigo-100`
   - `slate:` `bg-slate-50 text-slate-700 border-slate-100`

- *Scroll Transition:* Apply `transition-all duration-300 ease-in-out` to the main container. Use the `cn` utility to toggle `scale-90 p-2 shadow-sm` (when `isScrolled` is true) vs `scale-100 p-4 shadow-md` (when false).

- *Typography:* Use `font-black` for the metric value and `text-xs uppercase tracking-wider` for the label to ensure high-end financial UI look.

# Files Structure
ROOT-PROJ
└── src/
    ├── components/
    │   └── PropertyFields/
    │       └── MetricCard.tsx         # Pure Tailwind component
    ├── lib/
    │   └── utils.ts                   # cn utility
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
import { MetricTile } from './PropertyFields/MetricCard';

<MetricCard 
  value={val} 
  label="My Label"
  isScrolled={isScrolled} 
  formatter={formatCurrency} 
  variant="emerald"
/>
```