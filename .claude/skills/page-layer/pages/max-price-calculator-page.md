---
name: max-price-calculator-page
description: Controller for the "Max Price" reverse-investment calculator. Manages authorization, dynamic data fetching from the calculator API, and orchestrates the PropertyForm in a specialized "result-driven" mode.
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
- *Initial State:* Load the property object representing the maximum price scenario via `GET calculator/maxPrice`.
- *Real-time Calculation:* Every user interaction in the form triggers a `PUT calculator/maxPrice` call with the field name and new value.
- *State Sync:* Update the local `property` state with the calculation results returned from the API to refresh all dependent fields and the main result.

3. **Layout & UI Structure**
- **Header Section:**
    - Component: `ScreenHeader`.
    - Title: `getPhrase('calculator_title_max_price', 'Maximum price calculator')`.
    - Subtitle: `getPhrase('calculator_title_max_price_subtitle', 'Economic feasibility study and purchase budget')`.
- **Primary Result Display (Sticky/Banner):**
    - Component: `MetricCard`.
    - Label: `getPhrase('calculator_maxprice_price_label', 'The most expensive apartment I could buy (approximately)')`.
    - Value: `property.price`.
    - Formatter: `formatCurrency`.
    - Variant: `emerald`.
- **Input Form (@property-form-component.md):**
    - Render `PropertyForm` with these specific overrides:
        - `hideLocationFields={true}`
        - `hidePropertyPrice={true}`
        - `hideAdditionalInfo={true}`
        - `hideMortgageRepayment={true}`
        - `isCompact={true}`
        - `section1GridClassName="lg:grid-cols-4"`

4. **User Experience**
- *Loading State:* Use `showOverlay` (backdrop blur) during any API communication (GET/PUT) to prevent interaction while calculating.
- *Error Handling:* On any critical API failure, redirect to `/home`.

# Business Logic Constraints
- **Responsiveness**: The text must be readable on mobile with proper horizontal padding.
- **RTL Support**: All text, including dynamic HTML content, must align to the right.
- **Micro-animations**: Use `animate-in fade-in slide-in-from-bottom-4` for the content entrance.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── MaxPriceCalculatorPage.tsx      # Main page controller
    ├── components/
    │   └── layouts/
    │       └── PropertyForm.tsx                       
    ├── services/
    │   ├── http.service.ts
    │   ├── auth.service.ts             # API Layer: Communication with /api/auth (Login/Signup).
    │   └── calculator.service.ts       # API: getCalculator, getMaxPrice, updateMaxPrice
    └── assets/
        └── css/
            └── main.css                # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
// Usage in Router
<Route path="/max-price-calculator" element={<MaxPriceCalculatorPage />} />