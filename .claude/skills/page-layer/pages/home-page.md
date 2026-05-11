---
name: home-page
description: The primary investment dashboard. Manages state for multi-city property portfolios, high-level financial forecasts, and best-yield discovery. Supports dual loading states (Light/Full data) for performance optimization.
references:
  - @page-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @state-management-layer/SKILL.md  
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @fixed-paramaetrs-usage.md
  - @api-layer/SKILL.md
  - @user-api.yaml
  - @ui-component-layer/SKILL.md  
  - @tab-component.md
  - @screen-header-component.md
  - @metric-card-component.md
  - @modal-component.md
  - @home-cities-component.md
  - @home-city-properties-component.md
  - @home-best-yields-component.md
  - @home-welcome-component.md
---

# Requirements (Product Logic)

1. **Auth & Permissions:**
- *Auth Guard:* Only `loggedinUser` can access. Non-logged-in users navigate to `/login`.

2. **Data Fetching Strategy (Performance):**
- *Phase 1 (Mount):* Call `getHome(false)`. Displays basic property list and city navigation.

- *Phase 2 (Background):* Immediately follow with `getHome(true)` to fetch heavy calculations (Best Yield, 10-year forecasts).

- Note: Use `fullData` flag in the UI to show skeletons/loading states for heavy components while basic data is visible.

3. **Visual States:**
- *State A: Empty Portfolio & New User (Tour Mode):*
  - Trigger: `properties.length === 0` AND `loggedinUser.tourCompletedTime === null`.
  - Action: Activate `HomeWelcome` with `showTour={true}`.
  - Logic: The tour should start after a short delay (2.5s) to allow entry animations to finish.

- *State B: Empty Portfolio (Manual Mode):*
  - Trigger: `properties.length === 0` AND `loggedinUser.tourCompletedTime !== null`.
  - Action: Render `HomeWelcome` without the spotlight overlay.

- *State C:* Active Portfolio:
  - Trigger: `properties.length > 0`.
  - Header: `ScreenHeader` with `title: home_title` and `subtitle: home_subtitle`.
  - Forecast Banner: Display 10-year forecast tag using `home_future_field_tag` (span) and `home_future_field_text` (p).

4. **Component Orchestration:**
- *HomeCities:*
  - Prop `cities`: Unique sorted keys of `property.city`.
  - Special Case: Properties without a city key are grouped under "else".
  - Selection: Default to the first city in the sorted list.

- *HomeCityProperties:*
  - Filtered properties based on `selectedCity`.
  - Logic: Calculate `maxYieldInCity` dynamically to highlight the top-performer in that city.

- *HomeBestYield:*
  - Displays `bestYields` data once `fullData` is loaded.

5. **Actions & Navigation:**
- *Edit:* Navigate to /property?propertyUUID={uuid}.

- *Delete:*
  - Trigger `Modal` for confirmation (`home_delete_confirm_title`).
  - API: Call `PATCH /api/property/:uuid/archive`.
  - Local Update: Refresh the home data or remove the item from state.

# Tailwind Implementation Logic
- *Layout:* Centered container `max-w-7xl mx-auto px-4 py-8`.

- *Forecast Banner:* `flex items-center gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100`.

- *Animations:* Use `AnimatePresence` for transitioning between "Welcome" and "Dashboard" states.

- *Transitions:* Apply `animate-in fade-in slide-in-from-bottom-4` for property cards.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── HomePage.tsx                    # Main Orchestrator
    ├── components/
    │   ├── layouts/
    │   │   ├── HomeWelcome.tsx             # Empty state UI        
    │   │   ├── HomeCities.tsx              # City navigation tabs          
    │   │   ├── HomeCityProperties.tsx      # Property grid/list                       
    │   │   └── HomeBestYields.tsx          # Top investment highlight
    │   └── common/
    │       ├── ScreenHeader.tsx        
    │       └── Modal.tsx                   # For delete confirmation                          
    ├── services/
    │   ├── http.service.ts
    │   └── home.service.ts                 # API call: PUT /user
    ├── store/
    │   └── slices/
    │       └── user.slice.ts               # Action: getHome (supports fullData param) 
    └── assets/
        └── css/
            └── main.css                    # Tailwind Theme (@theme)       


# Component Specification
```TypeScript
// Usage in Router
<Route path="/" element={<HomePage />} />
<Route path="/home" element={<HomePage />} />
