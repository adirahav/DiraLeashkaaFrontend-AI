---
name: property-interests-component
description: Controlled component for managing mortgage interests, price indexes, and tax-related percentages. Features dynamic defaults based on base interest and real-time backend synchronization.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Section Architecture & Layout**
- *Visibility:* Render ONLY if `property.showMortgagePrepayment === true`.

- *Grid:* Responsive grid (2 cols mobile, 3 cols md, 5 cols lg) for optimal percentage control display.

- *Calculating State:* When isCalculating is true, apply a backdrop-blur overlay on cards to prevent interaction.


2. **Field Specifications**
- *Header (@section-header-component.md)*:
    - Label: `property_interest_and_indexes_header`. 
    - Icon: `PieChart`. 
    - Variant: `slate`.
- *Interest Rate (@interest-control-component.md)*:
    - Label: `property_interest_label`. 
    - Calculated Value: `property.calcInterestPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.interestPercent` (defines min/max/step/default/delta for the slider).
- *Interest Rate in 5 Years (@interest-control-component.md)*:
    - Label: `property_interest_in_5_years_label`. 
    - Calculated Value: `property.calcInterestIn5YearsPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.interestIn5YearsPercent` (defines min/max/step/default/delta for the slider). Default: property.calcInterestPercent + delta.
- *Interest Rate in 10 Years (@interest-control-component.md)*:
    - Label: `property_interest_in_10_years_label`. 
    - Calculated Value: `property.calcInterestIn10YearsPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.interestIn10YearsPercent` (defines min/max/step/default/delta for the slider). Default: property.calcInterestPercent + delta.
- *Average Interest Rate at Loan Origination (@interest-control-component.md)*:
    - Label: `property_average_interest_at_taking_label`. 
    - Calculated Value: `property.calcAverageInterestAtTakingPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.averageInterestAtTakingPercent` (defines min/max/step/default/delta for the slider)
- *Average Interest Rate at Maturity (@interest-control-component.md)*:
    - Label: `property_average_interest_at_maturity_label`. 
    - Calculated Value: `property.calcAverageInterestAtMaturityPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.averageInterestAtMaturityPercent` (defines min/max/step/default/delta for the slider)
- *Consumer Price Index (@interest-control-component.md)*:
    - Label: `property_index_label`. 
    - Calculated Value: `property.calcIndexPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.indexPercent` (defines min/max/step/default/delta for the slider)
- *Projected Annual Return (@interest-control-component.md)*:
    - Label: `property_forecast_annual_price_increase_label`. 
    - Calculated Value: `property.calcForecastAnnualPriceIncreasePercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.forecastAnnualPriceIncreasePercent` (defines min/max/step/default/delta for the slider)
- *Selling Costs (@interest-control-component.md)*:
    - Label: `property_sales_costs_label`. 
    - Calculated Value: `property.calcSalesCostsPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.salesCostsPercent` (defines min/max/step/default/delta for the slider)
- *Depreciation for Tax Purposes (@interest-control-component.md)*:
    - Label: `property_depreciation_for_tax_purposes_label`. 
    - Calculated Value: `property.calcDepreciationForTaxPurposesPercent`.
    - Interactive Source: `fixedParameters.indexesAndInterests.depreciationForTaxPurposesPercent` (defines min/max/step/default/delta for the slider)

3. **Integration Logic**
- *Sync:* Every change triggers an onUpdate to the parent/store (debounced API call).

# CSS Structure
- Modifiers: `is-loading`.

# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── PropertyInterests.tsx      # Standalone smart component
    ├── store/
    │   └── slices/
    │       └── app.slice.ts           # State: isCalculating, Action: setCalculating
    ├── models/
    │   └── PropertyData.ts            # Interface for data mapping
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript

<PropertyInterests 
  property={property}               // Property object
  isCalculating={isCalculating}     // Calculating state
  onUpdate={handleFieldChange}      // (field, value) => void
/>
