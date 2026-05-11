---
name: home-welcome-component
description: A high-impact onboarding and "Empty State" controller for the Home page. Manages transition between regular empty states and the interactive Tour mode, featuring complex SVG animations and staggered UI entry.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
  - @state-management-layer/SKILL.md
---

# Requirements (Product Logic)
1. **Conditional State Management**
- *Standard Empty State:* Active when `properties.length === 0` but `tourCompletedTime` is present in user state.

- *Tour Mode:* Active when `properties.length === 0` and `tourCompletedTime` is missing/null.

- *Pre-Tour Logic:* Includes a 2-second delay before auto-scrolling to the action button and triggering `setShowTour(true)`.

2. **Visual Architecture**
- *Hero Section:* - Header Badge: Displays `home_welcome_new_start` with a `Sparkles` icon.
    - Animated Core: Renders `AnimatedHouse` within a decorative, animated background (blur-blobs).

- *Content:*
    - Title: Displays `home_welcome_title`.
    - Body: Displays `home_welcome_text` with optimized line-height for RTL readability.

- *Footer:* Persistent branding slogan at the bottom with decorative dividers.

3. **Interactivity & Callbacks**
- *Primary Action:* A prominent `Button` with a `Plus` icon.

- *Event:* Triggers `onAddPropertiesPress()` passed from the parent.

- *Tour Focus:* If `showTour` is active, apply a high-z-index overlay (`z-[110]`) and a `ring-4` highlight to the primary button.

# User Experience & Animations
- *Staggered Entrance:* Use `containerVariants` to orchestrate a 0.15s stagger delay between children (Animations -> Title -> Text -> Button).

- *Micro-interactions:*
    - `whileHover`: Subtle scale-up (1.05) on the main card and button.
    - `whileTap`: Subtle compression (0.95).

- *Background Motion:* Constant low-opacity rotation and scaling of background decorative circles to create a "living" UI.

# Business Logic Constraints
- *RTL Support:* Container forced to `dir="rtl"` with `text-right` alignment.

- *Responsive:* Max-width restricted to `max-w-2xl` to maintain a "card" feel on desktop while remaining full-width on mobile.

# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   ├── HomeWelcome.tsx
    │   └── WelcomeTour.tsx                 # Placeholder/Stub. Prepared for future Tour implementation
    ├── store/
    │   └── slices/
    │       └── user.slice.ts               # Tracks loggedinUserState.tourCompletedTime
    ├── assets/
    │   └── anim/
    │       ├── AnimatedHouse.tsx
    │       └── AnimatedTrendingUp.tsx
    └── assets/
        └── css/
            └── main.css                    # Tailwind Theme (@theme) 
  

# Component Specification
```TypeScript

<HomeWelcome 
  onAddPropertiesPress={(screen) => {}}   # Navigation trigger
  showTour={boolean}                      # Controlled tour state
  setShowTour={(show) => {}}              # Tour state setter
/>
