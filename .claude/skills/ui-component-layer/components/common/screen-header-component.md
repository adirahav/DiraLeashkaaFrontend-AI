---
name: screen-header-component
description: A responsive, scroll-aware page header. It dynamically transitions font sizes and visibility of subtitles based on the scroll state to maximize screen real estate during navigation.
allowed_model: [gemini-3-flash]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Standard page header with scroll animation"                                         
     output: "<ScreenHeader title='הנכסים שלי' subtitle='ניהול ומעקב' isScrolled={isScrolled} />"
---

# Requirements
1. **Visuals**:
   - **Transitions:** Smooth `duration-300` ease-in-out for all changes (size, opacity, height).
   - **Typography:** - Idle: Large `text-4xl` font-black (`slate-800`).
     - Scrolled: Compact `text-xl` or `text-lg`.
   - **Subtitle:** Fades out (`opacity-0`) and collapses (`max-h-0`) when `isScrolled` is true.
2. **Behavior**:
   - **State-Driven:** Relies on the `isScrolled` boolean prop (usually passed from a scroll listener in the parent or a custom hook).
   - **Flexibility:** Supports an `absolute` positioning mode (default) or standard flow layout via `className`.
   - **Layout:** Uses `overflow-hidden` on the subtitle wrapper to ensure the collapse animation doesn't jitter.
3. **Props Definition (Component API)**:
   - `title`: string (Main page name).
   - `subtitle`: string (Description/Tagline).
   - `isScrolled`: boolean (Triggers the visual transition).
   - `className`: string (Optional override for layout logic).

# CSS Structure
- Modifiers: 
    - `is-scrolled`: Triggers the size reduction and opacity fade.
    - `is-absolute`: Applies the `-translate-y-1/2` positioning logic.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── commom/
    │       └── ScreenHeader.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
import { ScreenHeader } from './ScreenHeader';

// Typical usage inside a Layout component
<ScreenHeader 
  title="ניתוח עסקה" 
  subtitle="חישוב תשואה ומיסוי" 
  isScrolled={scrolled} 
/>