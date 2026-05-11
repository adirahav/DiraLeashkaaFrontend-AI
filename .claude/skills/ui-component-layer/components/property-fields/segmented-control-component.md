---
name: segmented-control-component
description: A toggle-like selection component for switching between mutual exclusive options. Features a rounded container with a sliding-white-background effect for the active state.
references:
    - @ui-component-layer/SKILL.md  
    - @css-layer/SKILL.md
    - @tooltip-component.md
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create an apartment type selector"
     output: "<SegmentedControl label='סוג דירה' value={type} options={TYPES} onChange={setType} />"
---

# Requirements
1. **Visuals**:
- *Container:* Height 54px, background `slate-100`, 12px padding/rounded corners (`rounded-xl`).

- *Active State:* The selected option has a `white` background, `blue-600` text, and a subtle `shadow-sm`.

- *Inactive State:* `slate-500` text, transitioning to `slate-700` on hover.

- *Error State:* Border becomes `red-400` and background `red-50`.

2. **Behavior**:
- *Flexibility:* Options should use `flex-1` to divide the space equally regardless of the number of segments.

- *Disabled State:* 60% opacity and `grayscale` effect on the entire container.

- *Accessibility:* Buttons must have `type="button"` to prevent accidental form submission.

3. **Props Definition (Component API)**:
- `value`: string (required)
- `onChange`: (val: string) => void (required)
- `options`: { value: string; label: string }[] (required)
- `label`: string (optional)
- `disabled`: boolean (default: false)
- `error`: string (optional)
- `errorAsTooltip`: string (optional)

# Tailwind Implementation Logic
- *Container Styling:* flex items-center p-1 relative. The padding ensures the active "pill" doesn't touch the container edges.

- *Segment State Merging:* Use cn to toggle classes for each option:
```TypeScript
const segmentClasses = cn(
  "flex-1 h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all",
  isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
);
```

- *Error Handling:* `cn` logic on the wrapper: `error ? "border-red-400 bg-red-50" : "border-transparent bg-slate-100"`.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── property-fields/
    │       └── SegmentedControl.tsx
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)

# Component Specification
```TypeScript
const OPTIONS = [
  { value: '1', label: 'אפשרות א' },
  { value: '2', label: 'אפשרות ב' }
];

<SegmentedControl
  label="בחירת מסלול"
  value={selected}
  options={OPTIONS}
  onChange={setSelected}
  error={errors.path}
/>