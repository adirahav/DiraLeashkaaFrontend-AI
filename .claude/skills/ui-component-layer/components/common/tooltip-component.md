---
name: tooltip-component
description: A floating informational bubble that appears on hover or focus. Uses React Portals to render outside the main DOM hierarchy and features dynamic positioning (top/bottom) with an arrow pointer.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Add a tooltip to a help icon"                                         
     output: |
        <Tooltip text="סכום ההחזר החודשי המקסימלי המותר">
          <HelpCircle size={14} className="text-slate-400" />
        </Tooltip>
   - input: "Tooltip positioned at the bottom"                                         
     output: "<Tooltip text='מידע נוסף' position='bottom'><button>Click me</button></Tooltip>"
---

# Requirements
1. **Visuals**:
   - **Container:** Width 280px (max 90vw), bg-white, rounded-2xl.
   - **Shadow:** Deep elevation using `shadow-[0_20px_50px_rgba(0,0,0,0.15)]`.
   - **Icon:** Includes a fixed blue info icon (`bg-blue-50`, `text-blue-600`) inside the bubble.
   - **Arrow:** A centered triangle pointing to the trigger, matching the bubble's position (top or bottom).
   - **Animations:** `fade-in` and `zoom-in` (200ms) for smooth appearance.
2. **Behavior**:
   - **Portal Rendering:** Must use `createPortal` to `document.body`.
   - **Positioning:** Calculated via `getBoundingClientRect` to align with the trigger element.
   - **Triggers:** Supports `onMouseEnter`, `onFocus`, and `onClick` (for mobile).
   - **Accessibility:** Uses `role="tooltip"` and `aria-describedby` linked via `React.useId`.
3. **Props Definition (Component API)**:
   - `text`: string (The content).
   - `children`: ReactNode (The trigger element, e.g., an icon).
   - `position`: 'top' | 'bottom' (default: 'top').

# CSS Structure
- Modifiers: 
    - `--top` / `--bottom`: Position-specific arrow and transform logic.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── commom/
    │       └── Tooltip.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
import { Tooltip } from './Tooltip';
import { HelpCircle } from 'lucide-react';

<Tooltip text="זהו הסבר על השדה" position="top">
  <HelpCircle size={14} className="text-slate-400" />
</Tooltip>