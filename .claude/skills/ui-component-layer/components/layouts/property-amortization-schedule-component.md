---
name: property-amortization-schedule-component
description: Standard mortgage amortization schedule (Luach Silukin) tracking monthly principal and interest breakdown. Focuses on loan balance reduction and debt service over the loan term.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Section Architecture & Layout**
- *Visibility:* 
    - Desktop: Visible if `amortizationSchedule !== null`.
    - Mobile: Visible ONLY if `activeResultTab === 'amortization'`.

- *Header:* SectionHeader with label `property_disposal_schedule_header`, Icon: `List`, Variant: `indigo`.

- *Table Behavior:* Sticky header for long schedules (up to 360 rows), scrollable container.

- *Loading State:* Apply `backdrop-blur` overlay when `isCalculating` is true.

- *Visuals:* Hover effect on rows for better scannability.

2. **Column Mapping & Formatting**
- *Column 1 - Month*:
    - Header Phrase Key: `amortization_schedule_month_label`. 
    - Data Key: `monthNo`.
    - Formatting/Logic: `Default`.
- *Column 2 - Opening Principal Balance*:
    - Header Phrase Key: `amortization_schedule_bop_fund_label`. 
    - Data Key: `fundBop`.
    - Formatting/Logic: `Currency`.
- *Column 3 - Interest*:
    - Header Phrase Key: `amortization_schedule_interest_label`. 
    - Data Key: `interest`.
    - Formatting/Logic: `Percent`.
- *Column 4 - Monthly Payment*:
    - Header Phrase Key: `amortization_schedule_monthly_repayments_label`. 
    - Data Key: `monthlyRepayments`.
    - Formatting/Logic: `Currency`.
- *Column 5 - Principal Payment*:
    - Header Phrase Key: `amortization_schedule_fund_refund_label`. 
    - Data Key: `fundRefund`.
    - Formatting/Logic: `Currency`.
- *Column 6 - Interest Payment*:
    - Header Phrase Key: `amortization_schedule_interest_repayment_label`. 
    - Data Key: `interestRepayment`.
    - Formatting/Logic: `Currency`.
- *Column 7 - Closing Principal Balance*:
    - Header Phrase Key: `amortization_schedule_eop_fund_label`. 
    - Data Key: `fundEop`.
    - Formatting/Logic: `Currency`.

# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── PropertyAmortizationSchedule.tsx    # Pure data visualization component
    ├── store/
    │   └── slices/
    │       └── app.slice.ts                    # State: isCalculating 
    ├── models/
    │   └── PropertyData.ts                     # Interface for AmortizationSchedule objects
    └── assets/
        └── css/
            └── main.css                        # Tailwind Theme (@theme) 


# Component Specification
```TypeScript

<PropertyAmortizationSchedule 
  amortizationSchedule={property.calcAmortizationSchedule}   // Array of amortization schedule objects (monthNo, fundBop, interest, etc.)
  activeResultTab={activeResultTab}            // Mobile-only: 'amortization' string triggers visibility
  isCalculating={isCalculating}                // Boolean: toggles backdrop-blur overlay during API sync
/>
