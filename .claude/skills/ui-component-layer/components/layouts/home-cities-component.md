---
name: home-cities-component
description: A dynamic city selection bar for the Home page. Displays a scrollable list of unique cities with custom icons and integrates with the global search/filter state.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
---

# Requirements (Product Logic)
1. **Section Architecture & Layout**
- *Container:* Flex container with `overflow-x`-auto and `scrollbar-hide` for smooth mobile scrolling.

- *RTL Support:* Mandatory `dir="rtl"` to ensure the scroll and list order match Hebrew reading direction.

- *Spacing:* Responsive horizontal gap between city buttons (`gap-3`).

2. **City Selection Logic**
- *Input Data:* Receives a pre-sorted and unique list of city keys (e.g., `["ashdod", "tel_aviv_yafo"]`) from the parent component.

- *Label Resolution:* Resolves city names using `fixedParameters.cities.find(c => c.key === city).value`.

- *Selection State:* - Selected city uses `variant="primary"`.
  - Unselected cities use `variant="outline"` with specific hover states (`hover:bg-slate-50`).

- *Interaction:* Clicking a city triggers `onSelectCity(cityKey)`.

3. **Media & Iconography**
- *Dynamic Assets:* Attempts to load a local city icon from `/assets/images/icon_city_${cityKey}.png`.

- *Fallback Mechanism:* - If the image fails to load (`onError`) or the file is missing, the component must display the `MapPin` icon from `lucide-react`.

- *Image Optimization:* Icons should be rendered with `object-contain` and standard sizing (`w-6 h-6`).

4. **Interaction Design**
- *Micro-animations:* Use `motion.div` for entry (fade and slide from right) and click feedback (`whileTap={{ scale: 0.98 }}`).

- *Skeleton Loading:* (Optional) Support a loading state where placeholders are shown if `isLoading` is passed.


# Styling
- **Utility-First:** Use Tailwind CSS classes exclusively.

- **Button Styling:** Enforce `whitespace-nowrap` to prevent city names from breaking into two lines in the scrollbar.

- **Elevation:** Active city buttons may include a subtle shadow to stand out.


# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── HomeCities.tsx
    ├── store/
    │   └── slices/
    │       └── property.slice.ts
    ├── assets/
    │   └── images/
    │       └── icon_city_*.png        # City specific assets
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
<HomeCities 
  cities={["ashdod", "tel_aviv_yafo", "umm_el_fahm"]}     # Array of city keys
  selectedCity="ashdod"                                   # Currently active key
  onSelectCity={(cityKey) => handleCityChange(cityKey)}   # Selection callback
/>