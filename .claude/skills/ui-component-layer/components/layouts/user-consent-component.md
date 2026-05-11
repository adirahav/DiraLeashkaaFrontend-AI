---
name: user-consent-component
description: A clean presentational component for rendering legal terms (HTML) and a consent checkbox. All content and validation logic are injected via props.
references:
  - @ui-component-layer/SKILL.md
  - @phrase-usage.md
  - @html-content-component.md
  - @checkbox-component.md
  - @button-component.md
---

# Requirements (Product Logic)

1. **Compositional Structure**:
    - **Legal Display (@html-content-component.md)**: 
      - Uses `HtmlContent` to render the `content` prop (HTML string).
    - **Consent (@checkbox-component.md)**: 
      - Uses `Checkbox` to reflect `checked` and trigger `onChange`.
    - **Actions (@button-component.md)**: 
      - A button row (Back/Next) whose state (text, disabled, onClick) is fully controlled by the parent.

2. **UI/UX Behavior**:
    - **Scrollable Viewport**: The legal text must be contained in a scrollable area to ensure the UI remains compact.
    - **RTL Support**: Full RTL support using Tailwind logical properties (`text-start`, `flex-row-reverse` for button order if needed, and `ps-*`/`pe-*` for spacing).

# Business Logic Constraints
- **Zero Local Logic**: The component does not calculate validity or fetch phrases internally. Everything is passed as a prop.
- **Styling Consistency**: Typography and spacing are strictly managed via Tailwind utility classes (e.g., `text-slate-700`, `leading-relaxed`, `space-y-4`). Legal text styling (HTML) is handled via the `prose` (Typography) plugin or targeted Tailwind classes.

# Tailwind Implementation Logic
- *Scroll Area:* Uses `max-h-[400px] overflow-y-auto pr-2 custom-scrollbar` (using the arbitrary scrollbar values we defined).

- *Legal Content Styling:* If using `HtmlContent`, use Tailwind's `[&_h3]:text-lg [&_h3]:font-bold [&_p]:mb-4` to style the injected HTML without external CSS.

- *Action Bar:* A `flex justify-between items-center gap-4 mt-8` container for the navigation buttons.

# Files Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── UserConsent.tsx         # Stateless presentational component
    ├── lib/
    │   └── utils.ts                   # cn utility
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)     

# Component Specification
```TypeScript
import { UserConsent } from '../components/layouts/UserConsent';

<UserConsent
    content={termsHtml}
    checkboxLabel={acceptLabel}
    checked={isAccepted}
    onChange={handleCheck}
    onNext={handleNext}
    onPrev={handlePrev}
    nextButtonText={nextText}
    prevButtonText={prevText}
    isNextDisabled={!isAccepted}
    isLoading={isLoading}
/>