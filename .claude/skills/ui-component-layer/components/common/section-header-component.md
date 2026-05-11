---
name: section-header-component
description: A semantic divider for content sections. Features a colored icon badge with matching soft shadows and bold Hebrew typography.
allowed_model: [gemini-3-flash]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Create a blue header for property details"                                         
     output: "<SectionHeader icon={<Building2 />} title='פרטי הנכס' variant='blue' />"
   - input: "Create an orange header for taxes"                                         
     output: "<SectionHeader icon={<FileText />} title='מיסוי' variant='orange' />"
---

# Requirements
1. **Visuals**:
   - **Icon Badge:** 40x40px (`w-10 h-10`), `rounded-xl` (12px). 
   - **Shadows:** Each variant has a custom `shadow-lg` with a specific `rgba` or color variable (e.g., `shadow-blue-200`).
   - **Typography:** Bold `text-2xl` and `font-black` (`slate-800`).
   - **Icon Scaling:** Automatically forces the passed icon to `size={20}` using `React.cloneElement`.
2. **Behavior**:
   - **Variants:** Supports 9 predefined color themes (blue, emerald, indigo, orange, purple, slate, amber, rose, teal).
   - **Layout:** Flex container with `gap-3` and a bottom margin `mb-6`.
3. **Props Definition (Component API)**:
   - `icon`: ReactNode (Lucide icon recommended).
   - `title`: string (The section label).
   - `variant`: SectionHeaderVariant (default: 'blue').

# CSS Structure
- Modifiers: 
    - `--blue`, `--orange`, etc. (Handles `background-color` and `box-shadow`).

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── commom/
    │       └── SectionHeader.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
import { SectionHeader } from './SectionHeader';
import { Wallet } from 'lucide-react';

<SectionHeader 
  icon={<Wallet />} 
  title="מימון והלוואות" 
  variant="emerald" 
/>