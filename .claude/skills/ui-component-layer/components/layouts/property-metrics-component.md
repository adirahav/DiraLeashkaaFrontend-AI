---
name: property-metrics-component
description: A high-level summary dashboard for property financial health. Displays key performance indicators (KPIs) like yield, mortgage amount, and financing percentages in a responsive grid.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Visibility Logic (Mandatory Fields)**
- *Visibility:* 
    - Component renders ONLY if the following property fields exist: `apartmentType`, `price`, `calcEquity`, `calcIncomes`, `calcMortgagePeriod`.

2. **Metrics Definition**
- *Metric 1:* 10y Yield. Label: `property_yield_label`. Value: `totalYield10y` (Year 10 Forecast). Variant: `emerald`.

- *Metric 2:* Required Mortgage. Label: `property_mortgage_required_label`. Value: `mortgageAmount`. Variant: `indigo`.

- *Metric 3:* Financing %. Label: `property_financing_percentage_label`. Value: `actualFinancingPercent`. Variant Logic: `rose` if > `maxFinancingPercent`, else `slate`.

- *Metric 4:* Monthly Repayment. Label: `property_monthly_repayment_label`. Value: `monthlyMortgageRepayment`. Variant: `amber`.

# State Management
- *Data Source:* Consumes calculated fields from the global Property Store.

- *Reactivity:* Updates instantly when any input affecting mortgage or yield changes.

# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── PropertyMetrics.tsx        # Pure summary dashboard component
    ├── store/
    │   └── slices/
    │       └── property.slice.ts      # Source of calculated metrics
    ├── services/
    │   └── util.service.ts            # Source of formatCurrency/formatPercent
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript

<PropertyMetrics 
    totalYield10y={property.calcYieldForecast[119].yieldOnEquity}
    mortgageAmount={property.calcMortgageRequired}
    actualFinancingPercent={property.calcActualPercentOfFinancing}
    maxFinancingPercent={property.calcMaxPercentOfFinancing}
    monthlyMortgageRepayment={property.calcMortgageMonthlyRepayment}
    isScrolled={isScrolled}
/>