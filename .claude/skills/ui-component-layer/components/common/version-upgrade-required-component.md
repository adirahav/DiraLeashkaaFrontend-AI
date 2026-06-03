---
name: version-upgrade-required-component
description: A full-screen, non-dismissible blocking overlay for mandatory app updates. Prevents user interaction with the application until the version is updated to a supported release (Major/Minor increments).
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file]
references:
  - @ui-component-layer/SKILL.md
  - @css-layer/SKILL.md
  - @app-layer/SKILL.md

examples:                                                           
   - input: "Render a mandatory blocking upgrade screen"         
     output: "<UpgradeRequired />"
   - input: "Call to action button with localized phrase"
     output: "<span>{useSplash().getParam('upgrade_required_cta', 'מעבר לגרסה החדשה')}</span>"
---

# Requirements
1. **Visuals:**
- *Blocking Surface:* Full-screen (`min-h-screen`) coverage with a clean `bg-slate-50` to completely replace the app UI.

- *Atmospheric Depth:* Decorative blurry background blobs (`blur-3xl`) in blue/indigo tones to provide a premium, modern feel.

- *The "Warning" Card:* A centered, large-radius card (`rounded-[2rem]`) with `shadow-2xl` to signify critical system importance.

- *Interactive Elements:*
  - `Primary CTA:` A large, high-contrast action button (`bg-blue-600`) spanning the full width of the card.
  - `No Exit:` Unlike the recommended banner, this component *strictly lacks a close button*, forcing the upgrade path.

2. **Behavior:**
- *Non-Dismissible:* The component does not accept an `onClose` prop and provides no escape route (Back button behavior is typically handled by the Native Navigation Layer).

- *Animated Severity:* Uses an amber `AlertTriangle` icon with an `animate-pulse` effect to communicate urgency and required action.

- *RTL Support:* Hardcoded `dir="rtl"` to ensure Hebrew text alignment, supporting the right-to-left flow of the warning message and icon positioning.

3. **Props Definition (Component API):**
Static Component: No props required as it represents a terminal application state.

# Tailwind Implementation Logic
- *Centering:* Use `flex items-center justify-center` on the parent container for perfect viewport alignment.

- *Typography:* Large, bold headers (`text-3xl font-extrabold`) followed by readable, medium-weight body text (`text-slate-600 font-medium`).

- *CTA Styling:* `py-4 px-8 rounded-2xl` for a "mobile-first" touch target that feels tactile and modern.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── UpgradeRequired.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
import { UpgradeRequired } from './components/common/UpgradeRequired';

// Conditional rendering in the App Root / Router Guard
if (isUpdateRequired) {
  return <UpgradeRequired />;
}