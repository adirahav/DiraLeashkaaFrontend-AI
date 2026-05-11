---
name: card-component
description: A high-level layout container with soft shadows and exaggerated rounded corners. Used to group related sections or form groups.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Create a 3-column grid card"                                         
     output: "<Card className='grid grid-cols-1 md:grid-cols-3 gap-6'>{children}</Card>"
---

# Requirements
1. **Visuals:**
   - *Corners:* Extremely rounded at `2rem` (32px).
   - *Shadow:* Very subtle depth using `0 8px 30px rgba(0,0,0,0.04)`.
   - *Padding:* Responsive padding—`p-6` (24px) on mobile, scaling to `p-10` (40px) on desktop.
   - *Border:* Light `slate-100` to define the edges against the background.

2. **Behavior:**
   - *Wrapper:* Renders as a `div`.
   - *Flexibility:* Accepts `className` to allow for grid/flex layouts (e.g., `grid-cols-3`).
   - *Children:* Pass-through for any React content.

3. **Props Definition (Component API):**
   - `children`: ReactNode (required).
   - `className`: string (optional, for layout overrides).


# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── Card.tsx
    └── assets/
        └── css/
            └── main.css                  # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
import { Card } from './Card';

<Card className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <section>Content A</section>
  <section>Content B</section>
</Card>