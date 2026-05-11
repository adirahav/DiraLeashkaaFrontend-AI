---
name: html-content-component
description: A semantic wrapper for rendering rich text, HTML strings, or injected React nodes. Ensures consistent spacing, line-height, and typography across the application's content areas.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Render content with a legal checkbox"
     output: "<HtmlContent content={<>Terms...</>} />"
---

# Requirements
1. **Visuals**:
- *Typography:* Uses `leading-relaxed` for optimal readability and `text-slate-600` as the default body color.

- *Spacing:* Implements `space-y-6` to ensure consistent vertical gaps between paragraphs or injected blocks.

- *Flexibility:* Supports external `className` for specific font sizes or color overrides depending on the context (e.g., modals vs. property pages).

2. **Behavior**:
- *Wrapper:* Acts as a `div` container.

- *Content Support:* Accepts `ReactNode`, allowing it to render both raw strings and complex JSX trees (like the checkbox example).

- *Clean Layout:* Handles the `pt-6 border-t` logic internally if passed within the content fragment to maintain structural integrity.

3. **Props Definition (Component API)**:
- `content`: ReactNode (required) - The main text or elements to display.

- `className`: string (optional) - Additional Tailwind classes for styling overrides.

# CSS Structure
- *Container Styling:* Base classes include `space-y-6 text-slate-600 leading-relaxed`.

- *Merging:* Use the `cn` utility to merge the base styles with the optional `className` prop.

- *RTL Support:* Ensures text alignment follows the parent container's directionality (defaults to start).

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── HtmlContent.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
import { HtmlContent } from './HtmlContent';
import { Checkbox } from './Checkbox';

<HtmlContent 
  className="text-base"
  content={(
    <>
      <p>זהו טקסט ארוך שמגיע עם ריווח מובנה בין פסקאות.</p>
      <div className="pt-6 border-t border-slate-100 mt-8">
        <Checkbox label="אני מאשר את תנאי השימוש" checked={true} />
      </div>
    </>
  )} 
/>