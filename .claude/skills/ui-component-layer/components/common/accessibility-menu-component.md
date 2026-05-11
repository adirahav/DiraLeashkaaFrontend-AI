---
name: accessibility-menu-component
description: A global floating accessibility controller. Manages font sizes, high contrast modes, and readability settings by injecting utility classes into the document body and persisting state via localStorage.
allowed_model: [gemini-3-flash]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Add global accessibility settings"
     output: "<AccessibilityMenu />"
---

# Requirements
1. **Visuals**:
   - **Trigger:** A floating action button (FAB) at the bottom-right corner.
   - **Panel:** 320px wide, `rounded-3xl`, features a fixed header and scrollable options body.
   - **Toggles:** Custom-styled toggle switches (blue when active, slate when inactive).
   - **Animations:** Slide-in from bottom and fade-in for the menu panel.
2. **Behavior**:
   - **Persistence:** All settings are saved to `localStorage` and re-applied on page load.
   - **DOM Injection:** Dynamically toggles classes on `document.body` (e.g., `.high-contrast`, `.font-size-xlarge`).
   - **Reset:** A "one-click" reset function to return all settings to default.
3. **Accessibility (Irony intended)**:
   - Uses proper `aria-label`, `aria-expanded`, and `role="dialog"` concepts.
   - Supports keyboard navigation (Tab-index).

# CSS Structure
- Global Modifiers (on body):
    - `.high-contrast`: Inverts/enhances colors.
    - `.grayscale-mode`: Applies `filter: grayscale(1)`.
    - `.underline-links`: Forces `text-decoration: underline` on all `<a>` tags.
    - `.readable-font`: Changes font-family to a high-legibility sans-serif.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── AccessibilityMenu.tsx
    └── assets/
        └── css/
            └── main.css                  # Tailwind Theme (@theme)  


# Component Specification
```TypeScript
import { AccessibilityMenu } from './AccessibilityMenu';

// In App.tsx
function App() {
  return (
    <>
      <Dashboard />
      <AccessibilityMenu />
    </>
  );
}