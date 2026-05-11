---
name: compare-calculator-page
description: Controller for the multi-property comparison engine. Manages selection, synchronization with the compare store, and orchestrates multiple PropertyForm instances in a side-by-side layout.
references:
  - @page-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @ui-component-layer/SKILL.md  
  - @screen-header-component.md
  - @property-form-component.md
  - @api-layer/SKILL.md
  - @calculator-api.yaml
---

# Requirements (Product Logic)

1. **Guard & Authorization (Centralized Logic)**:
- *Auth Check:* Verify `loggedinUser` exists; if not, redirect to home page `/login`.
- *Dynamic Validation:* On mount, fetch calculator metadata using the identifier from the URL: `GET calculator/{calculatorUUID}`.
- *Access Control:* - If the API returns `isActive: false` or `isComingSoon: true`, redirect to `/`.
    - If the user's permission level doesn't match the calculator requirements, redirect to `/`.
    - Only after a successful validation, proceed to load the property data.

2. **Data Orchestration**
- *Initial State:* On mount, fetch the list of properties marked for comparison via `GET calculator/compare`.
    - Validation: If the list of UUIDs is empty, display the "No properties selected" state.
- *Hydration:* Fetch full property details for each UUID in the comparison list using `GET property/{propertyUUID}?calcYields=true`. On every filter change, re-trigger these calls.
    - City Extraction: From the initial properties list, compute a unique list of cities to be used as tabs in the selection UI.
- *Real-time Update:* Any change within a PropertyForm triggers a save() call.
- *State Management:* Upon a successful save, update only the specific property in the local properties array to ensure UI consistency across all compared units.

3. **Layout & UI Structure**
- **Header Section:**
    - Component: `ScreenHeader`.
    - Title: `getPhrase('calculator_compare_title', 'Property comparison')`.
    - Subtitle: `getPhrase('calculator_compare_subtitle', 'Smart comparison between selected assets')`.
- **Filter & Actions:**
    - Tabs: Implement city filters (Frontend logic).
    - Checkboxes: Manage the selection state, enforcing the `compareMaxProperties` limit.
    - Actions: Trigger `PUT calculator/compare` on selection change.

- **Comparison Grid (Main Content):**
    - Render a horizontal scrollable container containing multiple `PropertyForm` instances.
        - Real-time Calculation: Every user interaction in a form triggers a `PUT property/` call with the field name and new value.
    - *Scroll Controls:* Floating navigation arrows (`ScrollArrowRightIcon`, `ScrollArrowLeftIcon`) that appear only when horizontal overflow is detected.
    
4. **User Experience**
- *Loading State:* Use `showOverlay` (backdrop blur) during any API communication (GET/PUT) to prevent interaction while calculating.
- *Scroll Logic:* - Smooth scroll functionality using scrollBy.
    - Dynamic visibility: Arrows should toggle based on `canScrollRight` / `canScrollLeft` states.
- *Empty State:* Display `getPhrase('calculator_compare_no_apartments', 'Select up to 3 properties from the list to start comparing')` and the `chooseApartments` illustration when the comparison list is empty.

# Business Logic Constraints
- **Maximum Units**: Limit comparison to the value defined in `fixedParameters.calculators.compareMaxProperties` (defaulting to 3).
- **Responsiveness**: The text must be readable on mobile with proper horizontal padding.
- **RTL Support**: All text, including dynamic HTML content, must align to the right.
- **Persistence**: Comparison state must be synced with the backend/store to survive page refreshes.


# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── CompareCalculatorPage.tsx   # Main page controller
    ├── components/
    │   └── layouts/
    │       └── PropertyForm.tsx
    ├── services/
    │   ├── http.service.ts
    │   ├── calculator.service.ts       # API: getCalculators, getCompareList, updateCompareList
    │   ├── property.service.ts         # API: getPropertyById, updateProperty
    │   └── auth.service.ts
    ├── store/
    │   └── slices/
    │       ├── compare.slice.ts        # State: comparedUUIDs list
    │       └── app.slice.ts            # Global loading/calculating state
    └── assets/
        └── css/
            └── main.css                # Tailwind Theme (@theme) 


# Component Specification
```TypeScript

// Usage in Router
<Route path="/compare-calculator" element={<CompareCalculatorPage />} />