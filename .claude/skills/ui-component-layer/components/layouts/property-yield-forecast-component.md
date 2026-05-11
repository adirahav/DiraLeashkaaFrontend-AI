---
name: property-yield-forecast-component
description: Monthly investment forecast schedule tracking property appreciation, rental income, and equity build-up. Distinct from a standard loan amortization schedule as it focuses on ROI and net profit at potential exit points.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Section Architecture & Layout**
- *Visibility:* 
    - Desktop: Visible if `yieldForecast !== null`.
    - Mobile: Visible ONLY if `activeResultTab === 'yield'`.

- *Header:* SectionHeader with label `property_financial_forecast_expected_return_header`, Icon: `TableIcon`, Variant: `blue`.

- *Table Behavior:* Sticky header for long schedules (up to 360 rows), scrollable container.

- *Loading State:* Apply `backdrop-blur` overlay when `isCalculating` is true.

- *Visuals:* Hover effect on rows for better scannability.

2. **Column Mapping & Formatting**
- *Column 1 - Month*:
    - Header Phrase Key: `amortization_schedule_month_label`. 
    - Data Key: `monthNo`.
    - Formatting/Logic: `Default`.
- *Column 2 - Property Value*:
    - Header Phrase Key: `yield_forecast_property_price_label`. 
    - Data Key: `propertyPrice`.
    - Formatting/Logic: `Currency`.
- *Column 3 - Rent*:
    - Header Phrase Key: `yield_forecast_rent_label`. 
    - Data Key: `rent`.
    - Formatting/Logic: `Currency`.
- *Column 4 - Cost of Financing*:
    - Header Phrase Key: `yield_forecast_financing_costs_label`. 
    - Data Key: `financingCosts`.
    - Formatting/Logic: `Currency`.
- *Column 5 - Exit Value*:
    - Header Phrase Key: `yield_forecast_valuation_in_realization_label`. 
    - Data Key: `valuationInRealization`.
    - Formatting/Logic: `Currency`.
- *Column 6 - Capital Gains Tax*:
    - Header Phrase Key: `yield_forecast_commendation_tax_label`. 
    - Data Key: `commendationTax`.
    - Formatting/Logic: `Currency`.
- *Column 7 - Profit*:
    - Header Phrase Key: `yield_forecast_profit_label`. 
    - Data Key: `profit`.
    - Formatting/Logic: `Currency`. Red if < 0.
- *Column 8 - Total Return*:
    - Header Phrase Key: `yield_forecast_total_return_label`. 
    - Data Key: `totalReturn`.
    - Formatting/Logic: `Percent`. Red if < 0.
- *Column 9 - Return on Equity (ROE)*:
    - Header Phrase Key: `yield_forecast_return_on_equity_label`. 
    - Data Key: `returnOnEquity`.
    - Formatting/Logic: `Percent`. Red if < 0.

# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── PropertyYieldForecast.tsx       # Pure data visualization component
    ├── store/
    │   └── slices/
    │       └── app.slice.ts                # State: isCalculating
    ├── models/
    │   └── PropertyData.ts                 # Interface for YieldForecast objects
    └── assets/
        └── css/
            └── main.css                    # Tailwind Theme (@theme) 


# Component Specification
```TypeScript

<PropertyYieldForecast 
  yieldForecast={property.calcYieldForecast}   // Array of investment forecast schedule objects (monthNo, rent, profit, etc.)
  activeResultTab={activeResultTab}            // Mobile-only: 'yield' string triggers visibility
  isCalculating={isCalculating}                // Boolean: toggles backdrop-blur overlay during API sync
/>
