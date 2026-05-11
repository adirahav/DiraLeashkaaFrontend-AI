---
name: additional-funding-sources-editor-component
description: A dynamic form builder for managing additional funding sources. Supports adding, updating, and removing entries with a responsive grid layout that adapts between mobile cards and desktop rows.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @string-input-component.md
  - @numeric-input-component.md
  - @button-component.md
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create a funding sources editor for the settings page"
     output: "<AdditionalFundingSourcesEditor sources={sources} onChange={setSources} />"
---

# Requirements
1. **Visuals**:
- *Responsive Grid:* On desktop, uses a 4-column grid (`1.5fr 1fr 1fr auto`). On mobile, items stack as cards with `bg-slate-50`.

- *Empty State Button:* Large, dashed-border button for adding new sources with `Plus` icon.

- *Desktop Header:* Labels appear only once at the top for desktop; hidden on mobile via `md:hidden`.

- *Delete Action:* Red-themed button, compact on desktop (icon only) and full-width on mobile.

2. **Behavior**:
- *State Management:* Manages an array of objects. New items get a unique ID via `crypto.randomUUID()`.

- *Field Updates:* Updates specific fields (`source`, `amount`, `repayment`) by index.

- *Title/Intro:* Optional header section with educational text about liquid vs. optional equity.

3. **Props Definition (Component API)**:
- `sources`: any[] (Objects with id, source, amount, repayment).

- `onChange`: (sources: any[]) => void.

- `showTitle`: boolean (default: true).

# Tailwind Implementation Logic
- *Grid Layout:* Managed via `grid gap-4 items-end`.

- *Card Styling:* Mobile cards use `p-4 rounded-xl border border-slate-100 bg-slate-50/50 md:bg-transparent md:border-none md:p-0`.

- *Dynamic Transitions:* `transition-all duration-200` on the "Add" and "Delete" buttons for immediate interactive feedback.

- *Merge Utility:* Comprehensive use of `cn` to handle conditional visibility and spacing.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── AdditionalFundingSourcesEditor.tsx
    ├── lib/
    │   └── utils.ts                                  # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css                              # Tailwind Theme (@theme)   


# Component Specification
```TypeScript
<AdditionalFundingSourcesEditor 
  sources={formData.funding}
  onChange={(newSources) => updateFormData(newSources)}
  showTitle={true}
/>