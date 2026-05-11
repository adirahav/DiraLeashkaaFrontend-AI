---
name: home-city-properties-component
description: A comprehensive property grid for the Home page. Manages property display, automated image carousels, yield indications (Best Yield), and administrative actions (Edit/Delete) with overlay confirmations.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
  - @state-management-layer/SKILL.md
---

# Requirements (Product Logic)
1. **Grid Architecture & Filtering**
- *Input:* Receives a list of `properties` filtered by the active city and the `maxYieldInCity` value for benchmarking.

- *Layout:* Responsive grid using `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with a standard gap (`gap-6`).

2. **Media Gallery (Carousel Logic)**
- *Source:* Renders images from `property.media`. If empty, displays a fallback "Missing Picture" state.

- *Carousel:* - Auto-rotate images every 4 seconds.
  - Manual navigation via `ChevronRight` (Back) and `ChevronLeft` (Forward) icons.
  - Visual indicators (dots) at the bottom for current index position.

- *Constraints:* Navigation icons and dots appear only if `images.length > 1`.

3. **Yield & Financial Data**
- *Best Yield Tag:* Display `home_properties_most_profitable` label only if `property.calcYields.averageReturn === maxYieldInCity`.

- *Missing Data:* If `property.calcYields === null`, show a warning label: `home_best_yields_missing_data`.

- *Formatting:* - Average Return: Displayed via `utilService.percentFormat` (e.g., `5.2%`).
  -Total Profit: Displayed via `utilService.priceFormat` (formatted currency, no decimals).

4. **Action Interactivity (Delegated Logic)**
- *Edit Action:* Triggers `onEditPress(propertyExternalId)` when the edit button is clicked.

- *Delete Workflow:* - Triggers `onDeletePress(propertyExternalId)` when the delete button is clicked.


# User Experience & Animations
- **Hover Effects:** Apply `shadow-md` and `scale-102` on the card container for interactivity.

- **Micro-animations:** Use `motion.div` for staggered entry of the properties list.

- **Skeleton State:** Render pulsing placeholders if the `isLoading` state is active.


# Business Logic Constraints
- **RTL Support:** Container and text (including address and notes) must be aligned to the right.

- **Note Rendering:** Supports multi-line notes by converting `\n` to `<br />` or using `whitespace-pre-line`.


# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── HomeCityProperties.tsx      # Unified component
    ├── services/
    │   └── util.service.ts             # Methods: percentFormat, priceFormat, getPhrase
    ├── store/
    │   └── slices/
    │       └── property.slice.ts       # Action: deleteProperty
    ├── assets/
    │   └── images/
    │       ├── missing_picture.png
    │       └── anim_delete.gif         # For the deleting state
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
<HomeCityProperties 
  properties={filteredProperties}             # Array of property objects
  maxYieldInCity={5.8}                        # Highest yield in current city for "Best Yield" badge
  onDeletePress={(propertyExternalId) => {}}  # Callback for deletion flow
  onEditPress={(propertyExternalId) => {}}    # Callback for edit/view flow
/>