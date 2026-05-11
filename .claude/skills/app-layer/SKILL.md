---
name: app-layer
description: The root orchestrator of the application. Manages global lifecycle, authentication hydration, and top-level UI components like Notifications and Modals.
references:
  - @auth-api.yaml
  - @state-management-layer/SKILL.md
  - @notification-component.md
---

# Requirements (Core Logic)

1. **Authentication Hydration:**
   - On mount: Call `userService.getLoggedInUser()`.
   - While fetching: Show a global `SplashLoader` (to prevent flickering or unauthorized redirects).
   - Once resolved: Populate the `userStore`.

2. **Global Component Hosting:**
   - Render the `Notification` and `Modal` components at the root.
   - Manage the visibility state of global Modals (e.g., Session Expired).

3. **Routing Strategy:**
   - **Public Routes:** `/login`, `/signup`, `/terms-of-use`.
   - **Private Routes:** `/`, `/home`, `/property`, `/calculators`, `/max-price-calculator`, `/compare-calculator`, `/personal-info`, `/financial-details`, `/accessibility-statement`. 
   - Guard Logic: If `!loggedinUser` and route is private -> Redirect to `/login`.

4. **Global Layout Wrapper:**
   - Manage the main viewport container (e.g., `min-h-screen`, `bg-slate-50`).
   - Handle RTL/LTR directionality at the HTML level.

# Tailwind Implementation Logic
- *Root Container:* `relative w-full min-h-screen overflow-x-hidden selection:bg-blue-100`.
- *Overlay Layer:* High `z-index` (e.g., `z-[9999]`) for the `Notification` container.

# Files Structure
ROOT-PROJ/
└── src/
│   ├── App.tsx                 # Main Logic & Routing
│   ├── AppProviders.tsx        # Context/Store Providers
│   └── main.tsx                # Entry point