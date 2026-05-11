---
name: dropdown-component
description: A custom-styled dropdown selector. It handles open/close states, outside clicks, and features a scrollable options list with active state indicators and entry animations.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
examples:                                                           
   - input: "Create a city selector dropdown"                                         
     output: "<Dropdown label='עיר' value={city} options={CITY_OPTIONS} onChange={setCity} />"
   - input: "Refactor raw Dropdown from studio"
     output: "I will implement the absolute menu and scrollbar logic using Tailwind utility classes, handling the open/close animations via `framer-motion` or Tailwind's `transition` and `opacity` classes."
---

# Requirements
1. **Visuals**:
   - **Trigger:** Height of 54px, matches `StringInput` styling.
   - **Menu:** Rounded-2xl with a heavy shadow (`0 20px 50px rgba(0,0,0,0.15)`).
   - **Active State:** Selected option should be `font-black` with a `Check` icon.
   - **Animations:** Must use `animate-in fade-in zoom-in-95`, implemented via Tailwind transition classes or `framer-motion` for smooth entry/exit.

2. **Behavior**:
   - **Click Outside:** Must use a `ref` and `useEffect` to close the menu when clicking outside the component.
   - **Internal State:** Manages `isOpen` state for the menu toggle.
   - **Scrollbar:** Uses Tailwind's overflow classes (`overflow-y-auto max-h-[300px]`) and customizes the scrollbar using arbitrary values (e.g., `scrollbar-gutter-stable` or `[&::-webkit-scrollbar]:w-2`) to keep it clean and minimal.
   
3. **Props Definition (Component API)**:
   - `label`: string (optional)
   - `value`: string (required)
   - `options`: { label: string; value: string }[] (required)
   - `onChange`: (val: string) => void (required)
   - `disabled`: boolean (default: false)
   - `error`: string (optional)

4. **Phrases**:
   - Choose text: Use `getPhrase('dropdown_choose', 'Choose')`

# Tailwind Implementation Logic
- *Trigger Styling:* Standardized height (`h-[54px]`) and border logic using Tailwind classes.

- *Menu Positioning:* `absolute z-50` with `w-full` and `mt-2` to align with the trigger.

- *State-Driven Classes:* Use the `cn` utility to toggle classes for `isOpen` (e.g., rotating the chevron icon: `isOpen && "rotate-180"`) and `isError`.

- *Shadows:* Use arbitrary shadow values `shadow-[0_20_50px_rgba(0,0,0,0.15)]` directly in the component if not defined in the config.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── Dropdown.tsx
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<Dropdown
  label="בחר מסלול"
  value={selectedId}
  options={[{ label: 'מסלול א', value: '1' }, { label: 'מסלול ב', value: '2' }]}
  onChange={(val) => setSelectedId(val)}
  error={formErrors.route}
/>