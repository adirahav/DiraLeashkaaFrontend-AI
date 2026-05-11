---
name: tour-spotlight-component
description: A high-level layout component that renders a spotlight effect (using clip-path) over a specific DOM element. Handles popover positioning, backdrop blurring, and smooth entrance animations.
references:
  - @tour-workflow.md
  - @css-layer/SKILL.md
  - @ui-component-layer/SKILL.md
allowed_model: [gemini-3-flash]
---

# Requirements (Product Logic)

1. **Visual Masking (The "Hole")**:
- *Clip-Path Logic:* Must calculate a dynamic `clip-path` polygon that creates a transparent rectangle (the spotlight) inside a semi-transparent `bg-slate-900/70` overlay.

- *Padding:* The spotlight area should have a consistent padding (e.g., 25px) around the `targetRect` to prevent the highlight from touching the element edges.

2. **Popover Positioning**:
- *Anchoring:* The popover (the white card) must be positioned relative to the `targetRect`. Default behavior: Positioned above the target, centered horizontally.

- *Arrow:* Includes a visual arrow (triangle) pointing from the popover to the spotlight center.

3. **Animation & Motion**:
- *Transitions:* Use `framer-motion` for `opacity` (backdrop) and `scale/y-offset` (popover).

- *Micro-interactions:* Animate the `MousePointer2` icon with a continuous bounce to draw attention.

4. **Interactions**:
- *Backdrop Click:* Supports an `onClose` callback when the user clicks the darkened area.

- *Pointer Events:* The spotlight area must allow interactions with the underlying element, while the backdrop blocks them.

# Props Definition (Component API)
- `isOpen`: boolean (required)
- `targetRect`: { top, left, width, height } | null (required)
- `onClose`: () => void (required)
- `title`: string (required)
- `description`: string (required)
- `children`: ReactNode (optional - for buttons/actions inside the popover)

# Tailwind Implementation Logic
- *Overlay:* `fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-[2px]`.
- *Card:* `bg-white p-6 rounded-3xl shadow-2xl border-2 border-blue-500`.
- *Z-Index:* High hierarchy (`z-[100]+`) to ensure it covers all page content except the focus target.


# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── tour/
    │       └── TourSpotlight.tsx
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)   
              

# Component Specification
```TypeScript
<TourSpotlight 
    isOpen={showTour}
    targetRect={buttonRect}
    onClose={() => setShowTour(false)}
    title="בוא נתחיל!"
    description="כדי לראות את הקסם קורה, לחץ על הכפתור המודגש כדי להוסיף את הנכס הראשון שלך."
/>
