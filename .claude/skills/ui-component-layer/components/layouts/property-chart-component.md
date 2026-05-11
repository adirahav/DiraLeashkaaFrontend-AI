---
name: property-chart-component
description: Wrapper component for the yield forecast visualization. Manages the section header, card container, and responsive visibility for the YieldChart.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Section Architecture & Layout**
- *Visibility:* 
    - Desktop: Visible if `yieldForecast !== null`.
    - Mobile: Visible ONLY if `activeResultTab === 'graph'`.

- *Header:* SectionHeader with label `property_yield_forecast_graph_view_header`, Icon: `TrendingUp`, Variant: `blue`.

- *Container:* Uses `Card` component. On mobile, height is relative to viewport (`calc(100dvw - 40px)`), on desktop fixed at `500px`.

- *Chart:* YieldChart with data `property.calcYieldForecast`.

- *Loading State:* Apply `backdrop-blur` overlay when `isCalculating` is true.

2. **Integration**
- *Child Component:* Renders `YieldChart`.
- *Forward Ref:* Supports `forwardRef` for potential scroll-to-view functionality from parent components.

# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── PropertyChart.tsx          # Wrapper for responsive graph container 
    ├── models/
    │   └── PropertyData.ts            # Interface for YieldForecast objects
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript

<YieldChart 
  data={property.calcYieldForecast}         // Array of investment forecast schedule objects (monthNo, totalReturn, returnOnEquity)
  activeResultTab={activeResultTab}         // Mobile-only: 'graph' string triggers visibility
  isCalculating={isCalculating}             // Boolean: toggles backdrop-blur overlay during API sync
/>
