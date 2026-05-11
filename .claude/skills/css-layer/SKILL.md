---
name: css-layer
description: Use this skill for all UI/UX implementation tasks. Enforces a 100% Tailwind CSS (Utility-first) workflow. Focuses on pure functional CSS for layout, branding, and responsiveness. Ensures RTL-ready designs (Hebrew support) using logical properties and a config-driven architecture.
allowed_tools: [read_file]
examples:                                                           
   - input: "Create a primary button"                                         
     output: "<Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">Complete Lesson</Button>"
---

# CSS Layer - 100% Tailwind CSS Architecture
*Objective:* Build high-fidelity, responsive, and RTL-ready UI using a pure Tailwind CSS architecture. Custom CSS/SCSS files, `@apply` directives, and BEM naming conventions are strictly prohibited.

**Key Focus Areas:**
- *Utility-First:* 100% styling via Tailwind classes directly in the JSX/TSX.

- *Config-Driven:* Branding (colors, spacing, shadows, radius) must be defined in `main.css`.

- *Logical Properties:* Full Hebrew support using `ps-*`, `pe-*`, `start-*`, `end-*` to ensure native RTL behavior.

- *Dynamic Merging:* Use the cn utility to handle conditional styles and class conflicts.

## Core Principles

### 1. Style Standardization
- **Zero-CSS Policy:** Do not create `.css `or `.scss` files. All styling logic belongs in the component's `className`.

- **Config as Truth:** Every custom design token (e.g., `blue-800`, `shadow-heavy`, `radius-xl`) must be registered in the Tailwind configuration. Never use "magic numbers" or arbitrary hex codes in the component unless they are truly one-off exceptions (using the `[... ]` syntax).

- **No @apply:** Avoid using `@apply` in CSS files to create "fake" components. Instead, create real React components that encapsulate their Tailwind classes.

### 2. Layout & Grid
- **Flex & Grid:** Use `flex`, `grid`, `grid-cols-*`, and `gap-*` for all layouts.
- **Main Layout:** Implement page-level constraints using `container mx-auto px-4`.
- **Spacing:** Use consistent spacing scales (e.g., `p-4`, `m-6`) to maintain vertical and horizontal rhythm.

### 3. RTL (Hebrew) Support
- **Mandatory Logical Properties:** Use logical utilities to support RTL without extra code:
  - `ps-*` / `pe-*` (Padding Start/End) instead of `pl`/`pr`.
  - `ms-*` / `me-*` (Margin Start/End) instead of `ml`/`mr`.
  - `start-*` / `end-*` for positioning.
  - `rounded-s-*` / `rounded-e-*` for corners.

- **Natural Flow:** Rely on `text-start` and `flex-row`. When the parent container has `dir="rtl"`, these will automatically align correctly for Hebrew.

- **Bi-Directional Icons:** Use the `rtl:rotate-180` modifier for icons that must flip direction (like arrows).

### 4. Responsiveness & Interaction (Rewrite)
- **Mobile-First:** Classes without a prefix are for mobile. Use `md:` for tablets/desktop.

- **State Utilities:** Use `hover:`, `focus-visible:`, `active:`, and `disabled:` for all interactive feedback.

- **Group/Peer Logic:** Leverage `group` and `peer` classes for complex parent-child or sibling-based interactions (e.g., highlighting a checkbox label on hover).

### 5. Implementation Pattern (The 'cn' Utility)
Every component must use the `cn` helper for class merging to ensure that Tailwind utilities override each other correctly according to the specificity rules of `tailwind-merge`.


## Implementation Example
```typescript
// Example of the standard 'cn' utility
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
