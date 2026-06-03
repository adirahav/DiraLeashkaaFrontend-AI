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
   - Hydration Flow:
      - On mount: Call `userService.getLoggedInUser()`.
      - Splash State: While `isHydrating`, show `SplashLoader`.
      - Post-Hydration: Once the user is in the store, execute the Onboarding Check before rendering any private component.

2. **Global Component Hosting:**
   - Render the `Notification` and `Modal` components at the root.
   - Manage the visibility state of global Modals (e.g., Session Expired).

3. **Routing Strategy (The Funnel Guard):**
   - **Public Routes:** `/login`, `/signup`, `/concent`.
   - **Private Routes:** `/`, `/home`, `/property`, `/calculators`, `/max-price-calculator`, `/compare-calculator`, `/personal-info`, `/financial-details`, `/accessibility-statement`. 
   - Guard Logic: 
      - Auth Check: If `!loggedinUser` and route is private ⮕ Redirect to `/login`.
      - Onboarding Check (The Funnel):
         - If `loggedinUser` exists but `!isLoggedinUserCompleted`:
            - Calculate `targetPath = getNextOnboardingStep(user)`.
            - If current path != `targetPath` ⮕ Redirect to `targetPath`.
            - Note: This ensures users must complete Consent ⮕ Personal ⮕ Financial before reaching `/home`.

4. **Global Layout Wrapper:**
   - Manage the main viewport container (e.g., `min-h-screen`, `bg-slate-50`).
   - Handle RTL/LTR directionality at the HTML level.

5. **Onboarding Guard Implementation:**
   - Create a wrapper component `OnboardingGuard` for private routes.
   - Inside the guard:
      - Get user and `isLoggedinUserCompleted` from store.
      - Use the `getNextOnboardingStep(user)` helper.
      - If the user is incomplete and trying to access a page they aren't ready for (like `/home`), redirect them to their current required step (`/consent`, `/personal-info`, or `/financial-details`).

6. **Version Governance & Upgrade Orchestration**
   - Version Source: Comparison between `localAppVersion` (from `package.json` / build config) and `storeAppVersion` (fetched via userService.getAppMetadata()).

   - Semantic Parsing: Implement a version parser that breaks strings into [`Major, Minor, Patch`].
      - Example logic:
         - `isMandatory:` If `store.Major > local.Major` OR `store.Minor > local.Minor`.
         - `isRecommended:` If `store.Major == local.Major` AND `store.Minor == local.Minor` AND `store.Patch > local.Patch`.

   - UI Execution:
      - Mandatory (High Priority): If `isMandatory`, render `UpgradeRequired` as a terminal root component, blocking all other app hydration and routing.

      - Recommended (Low Priority): If `isRecommended`, render `UpgradeRecommended` as a non-blocking banner at the top of the main layout.

   - Dismissal Logic: Manage a `hasDismissedRecommended` flag in the local state to ensure the banner stays hidden after the user clicks close for the duration of the session.

# Tailwind Implementation Logic
- *Root Container:* `relative w-full min-h-screen overflow-x-hidden selection:bg-blue-100`.
- *Overlay Layer:* High `z-index` (e.g., `z-[9999]`) for the `Notification` container.
- *Version Layer:* Ensure the `UpgradeRequired` component occupies `z-[10000]` to sit even above global notifications, ensuring no bypass is possible.

# Files Structure
ROOT-PROJ/
└── src/
│   ├── App.tsx                 # Main Logic & Routing
│   ├── AppProviders.tsx        # Context/Store Providers
│   └── main.tsx                # Entry point