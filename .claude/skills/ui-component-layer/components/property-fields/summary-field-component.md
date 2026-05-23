---
name: summary-field-component
description: A read-only metric card layout used to display computed financial parameters, totals, and operational breakdowns. Supports 8 theme variations with micro-interactions and strict text-alignment orchestration.
references:
    - @ui-component-layer/SKILL.md  
    - @css-layer/SKILL.md
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                          
   - input: "Create an emerald total revenue summary row element"
     output: "<SummaryField label='סך הכנסות' value={formatCurrency(1250000)} variant='emerald' />"
---

# Requirements
1. **Visuals**:
- *Field Wrapper:* Absolute height forced to 54px (`h-[54px]`) to maintain visual alignment rhythm alongside standard `StringInput` and `Dropdown` view modules.
- *Color Palettes:* Dynamically supports 8 semantic token combinations (`slate`, `amber`, `emerald`, `blue`, `indigo`, `rose`, `orange`, `purple`) mapping background overlays, borders, and label colors.
- *Micro-interactions:* Transitions smoothly (`transition-all duration-300`) on container hover to reveal a lifted structural look (`hover:shadow-md shadow-none`).

2. **Behavior**:
- *Orchestrated Text Realignment:* Supports explicit directional adjustments (`left`, `center`, `right`). When centered, text color shifts cleanly to match the variant typography color; otherwise, it locks as a standard black bold style spanning full-width bounds.
- *Sub-component Agnosticism:* The `value` and `label` variables support raw React primitives (`React.ReactNode`) to easily render inline badge components or complex formatting layouts.

3. **Props Definition (Component API)**:
- `label`: React.ReactNode (required)
- `value`: React.ReactNode (required)
- `variant`: 'slate' | 'amber' | 'emerald' | 'blue' | 'indigo' | 'rose' | 'orange' | 'purple' (default: 'slate')
- `align`: 'center' | 'right' | 'left' (default: 'right')
- `className`: string (optional)
- `labelClassName`: string (optional)

# Tailwind Implementation Logic
- *Variant Mapping Dictionary:* Encapsulate styling presets in an absolute look-up configuration token structure outside the active layout lifecycle:
  ```typescript
  const VARIANT_MAPS = {
    slate: { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-700', label: 'text-slate-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', label: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', label: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', label: 'text-blue-600' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', label: 'text-indigo-600' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', label: 'text-rose-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', label: 'text-orange-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', label: 'text-purple-600' }
  };

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── SummaryField.tsx
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)

# Component Specification
<SummaryField 
    label="משכנתא נדרשת"
    value={formatCurrency(mortgageAmount)}
    variant="blue"
    align="right"
/>