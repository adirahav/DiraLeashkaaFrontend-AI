---
name: yield-chart-component
description: Interactive line chart visualizing the projected Return on Equity (ROE) and Total Return over time. Aggregates monthly forecast data into yearly milestones for better readability.
references:
  - @ui-component-layer/SKILL.md  
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Data Processing**
- Input: Array of monthly yield objects (`monthNo`, `totalReturn`, `returnOnEquity`).
- Logic: Filter data to show only yearly intervals (`monthNo % 12 === 0`) to prevent chart clutter.
- X-Axis Labels: Convert `monthNo` to years (`monthNo / 12`).

2. **Graph Specifications (Recharts)**
- Type: `LineChart` (ResponsiveContainer).
- Lines: 
    - Line 1: `totalReturn` | Name Phrase: `chart_legend_total_return` | Color: `#2563eb` (Blue).
    - Line 2: `returnOnEquity` | Name Phrase: `chart_legend_return_on_equity` | Color: `#ef4444` (Red/Rose).
- X-Axis: `yearNo` (derived).
- Y-Axis: Percentage format (`%`).
- Features: Tooltip (RTL support), Legend (top-aligned), CartesianGrid (horizontal only).

3. UI/UX
- Visibility: Hidden during initial load if data is empty.

# File Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── YieldChart.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript

<YieldChart 
  data={graphData}                               // Array of investment forecast schedule objects 
/>
