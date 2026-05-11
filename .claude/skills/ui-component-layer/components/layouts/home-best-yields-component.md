---
name: home-best-yields-component
description: A featured section highlighting the single most profitable property. Features a rich data grid of yield metrics and a dual-line chart for long-term forecasts.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
  - @state-management-layer/SKILL.md
  - @service-layer/SKILL.md
---

# Requirements (Product Logic)
1. **Featured Layout**
- *Header:* Uses `SectionHeader` with `Trophy` icon, `amber` variant, and the phrase `home_best_yield_header`.

- *Container:* A single prominent `Card` with a 2-column layout on desktop (`grid-cols-1 lg:grid-cols-2`).

2. **Metrics Grid (SimpleMetric)**
Displays 4 key performance indicators using the `SimpleMetric` component:

- *Average Return:* `home_best_yield_average_return` | Value: `utilService.percentFormat` | Variant: `amber`.

- *Equity Return:* `home_best_yield_average_return_on_equity` | Value: `utilService.percentFormat` | Variant: `teal`.

- *Total Profit:* `home_best_yield_total_profit` | Value: `utilService.priceFormat` | Variant: `slate`.

- *NPV Profit:* `home_best_yield_total_profit_npv` | Value: `utilService.priceFormat` | Variant: `slate`.

3. **Visual Forecast (YieldChart)**
- *Data Source:* `JSON.parse(bestProperty.calcYields.yieldForecast)`.

- *Integration:* Renders a `YieldChart` showing "Total Yield" vs "Yield on Equity" over time.

- *Styling:* Encapsulated in a white background container with a subtle border.

4. **Data Handling (Source of Truth)**
- *Input:* Receives `bestProperty` object.

- *Guard Clause:* If `bestProperty` or `bestProperty.calcYields` is missing, the component returns `null`.

- *Formatting:* All numbers must pass through `utilService` formatters to ensure currency/percent consistency.


# User Experience & Animations
- **Entrance:** Use `motion.div` for a smooth fade-in and slight upward slide when the section appears.

- **Visual Hierarchy:** The property address and city should be high-contrast (`text-3xl font-black`) to anchor the section.


# Business Logic Constraints
- **RTL Support:** The entire section must be `dir="rtl"`.

- **Chart Layout:** Ensure the chart container has a fixed height or `aspect-ratio` to prevent layout shift during loading.


# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   ├── HomeBestYields.tsx
    │   ├── SectionHeader.tsx
    │   ├── SimpleMetric.tsx
    │   └── YieldChart.tsx
    ├── services/
    │   └── util.service.ts            # Methods: percentFormat, priceFormat
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<HomeBestYields bestProperty={bestProperty} />