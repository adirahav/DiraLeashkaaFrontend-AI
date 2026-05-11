---
name: tab-component
description: A toggleable navigation element used in segmented controls or result switchers. Supports active/inactive states with smooth transitions.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Create a yield tab"                                         
     output: "<Tab isActive={true} onClick={handleSelect} icon={} label='תשואה' />"
---

# Requirements
1. **Visuals:**
    - *Interactive:* Executes the `onClick` callback on press.
    - *Transitions:* Smooth color and shadow shifts using transition-all.
    - *Layout:* Uses a `flex-col` layout with a small gap (`gap-0.5`) between the icon and the text label.

2. **Behavior:**
    - *Animations:* Uses `AnimatePresence` for smooth mounting/unmounting.
    - *Interactive:* The close button calls the `onClose` callback and provides visual hover feedback.
    - *Iconography:* 
        - `success`: `CheckCircle2` (Emerald-500).
        - `error`: `AlertCircle` (Red-500).

3. **Props Definition (Component API):**
    - `isActive`: boolean (required) - Determines the visual variant.
    - `onClick`: () => void (required) - Execution callback.
    - `icon`: ReactNode (required) - Usually a Lucide icon at size 16.
    - `label`: string (required) - The display text.

# Tailwind Implementation Logic
- *State Merging:* Use `cn` to toggle between active and inactive classes:
    - `active`: `bg-white text-blue-600 shadow-sm`
    -`inactive`: `text-slate-500 hover:text-slate-700 (added hover for better UX)`.

- *Layout Consistency:* Ensure `items-center` and `justify-center` are applied to the `button` to keep icons and labels perfectly aligned.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── Tab.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
import { Tab } from './Tab';
import { PieChart } from 'lucide-react';

<Tab 
  isActive={activeResultTab === 'yield'} 
  onClick={() => setActiveResultTab('yield')}
  icon={<PieChart size={16} />}
  label="תשואה"
/>