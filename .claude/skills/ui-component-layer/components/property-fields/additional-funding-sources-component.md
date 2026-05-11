---
name: additional-funding-sources-component
description: A selection list for multiple financial funding sources. Features a scrollable container, dynamic checkbox generation, and conditional tooltips based on the availability of sources.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @tooltip-component.md
  - @checkbox-component.md (Required UI child)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Show funding sources list"                                         
     output: "<AdditionalFundingSources sources={DATA} selectedIds={active} onChange={setActive} />"
---

# Requirements
1. **Visuals**:
- *Container:* Background `slate-50`, border `slate-100`, and `rounded-xl`. 

- *Scrolling:* Max height of 160px with a `custom-scrollbar`.

- *Spacing:* `space-y-3` between source items.

- *Empty State:* Italic `slate-400` text when no sources are provided.

2. **Behavior**:
- *Multi-Select:* Manages an array of `selectedIds`.

- *Conditional Tooltip:* If `sources.length === 0`, it overrides the tooltip with a specific "Go to profile" message.

- *Disabled State:* Applies `opacity-60` to the entire container.

3. **Props Definition (Component API)**:
- `sources`: FundingSource[] (id, name, amount, monthlyRepayment).
- `selectedIds`: string[] (the currently checked items).
- `onChange`: (selectedIds: string[]) => void.
- `label`: string (default: "מקורות מימון נוספים").
- `tooltip`: string (optional).

# Tailwind Implementation Logic
- *Scrollbar Styling:* Use custom Tailwind utilities in the `className`: `scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent`.

- *State Merging:* Use the `cn` utility to apply `opacity-60 pointer-events-none` when the component is disabled.

- *List Mapping:* Dynamically render `Checkbox components for each source, ensuring each has a unique `key`.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── AdditionalFundingSources.tsx
    ├── lib/
    │   └── utils.ts                          # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)   


# Component Specification
```TypeScript
<AdditionalFundingSources 
  sources={[
    { id: '1', name: 'קרן השתלמות', amount: 50000, monthlyRepayment: 0 },
    { id: '2', name: 'הלוואה מהבנק', amount: 150000, monthlyRepayment: 1500 },
  ]}
  selectedIds={['1']}
  onChange={setSelectedFundingSources}
  label="מקורות נוספים"
/>