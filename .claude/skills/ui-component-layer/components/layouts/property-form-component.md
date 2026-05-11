---
name: property-form-component
description: Comprehensive investment property data entry controller. Manages 6 logical sections, real-time Zustand synchronization, and complex field dependencies (Tour mode, Auto-fills, and Editable calculations).
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Section Architecture & Layout**
- *Structure:* Render 6 distinct sections using SectionHeader and Card.

- *Loading State:* When isCalculating is true, apply a backdrop-blur overlay on cards to prevent interaction.

- *Responsive:* Grid layouts must adapt (1 col mobile, 2-3 cols desktop).

- *Layout Controls:* - `isCompact`: If true, remove card shadows, borders, and headers for nested displays.
    - `forceColumnLayout`: Force single column regardless of screen size.
    - `section1GridClassName`: Custom override for Part 1 grid (default: lg:grid-cols-3).

2. **Field Specifications**
    **Part 1 - Property details and equity**
        - *Header (@section-header-component.md)*:
            - Label: `property_details_and_equity_header`. 
            - Icon: `Building2`. 
            - Variant: `blue`.
        - *City (@dropdown-component.md)*:
            - Label: `property_city_label`. 
            - Validation: Required. 
            - Source / Logic: `fixedParameters.cities`. `property.city`.
        - *Settlement Name (@string-component.md)*:
            - Label: `property_city_else_label`. 
            - Validation: Required. 
            - Source / Logic: `property.cityElse`.
            - Display Logic: Controlled via `property.city === 'else'`.
        - *Address (@string-component.md)*:
            - Label: `property_address_label`. 
            - Source / Logic: `property.address`.
        - *Apartment Type (@segmented-control-component.md)*:
            - Label: `property_apartment_type_label`. 
            - Validation: Required. 
            - Source / Logic: `property.apartmentType`.
        - *Price (@suggested-number-component.md)*:
            - Label: `property_price_label`. 
            - Validation: Required. 
            - Source / Logic: `property.price`.
        - *Equity (@auto-fill-input-component.md)*:
            - Label: `property_equity_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Default: 
                    - Edit Property: `property.defaultEquity` 
                    - New Property: `loggedinUser.equity`
                - Value: 
                    - Edit Property: `property.calcEquity` 
                    - New Property: `loggedinUser.equity`
                - Read Only: `property.calcAdditionalFunding.totalAmount >  0` 
        - *Net Equity After Expenses (@calc-component.md)*:
            - Label: `property_equity_cleaning_expenses_label`. Tooltip: `property_equity_cleaning_expenses_tooltip`.
            - Source / Logic: `property.calcEquityCleaningExpenses`
        - *Mortgage required (@summary-component.md)*:
            - Label: `property_mortgage_required_label`. 
            - Source / Logic: `property.calcMortgageRequired``
            - Variant: `blue`.
        - *Note (@textarea-component.md)*:
            - Label: `property_note_label`. Placeholder: `property_note_placeholder`
            - Validation: Required. 
            - Source / Logic: `property.note`.
    **Part 2 - Monthly income and repayment**
        - *Header (@section-header-component.md)*:
            - Label: `property_income_and_monthly_return_header`. 
            - Icon: `DollarSign`. 
            - Variant: `teal`.
        - *Incomes (@auto-fill-input-component.md)*:
            - Label: `property_incomes_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Default:
                    - Edit Property: `property.calcIncomes` 
                    - New Property: `loggedinUser.incomes`
                - Value: 
                    - Edit Property: `property.defaultIncomes` 
                    - New Property: `loggedinUser.incomes`
        - *Commitments (@auto-fill-input-component.md)*:
            - Label: `property_commitments_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Default: 
                    - Edit Property: `property.calcCommitments` 
                    - New Property: `loggedinUser.commitments`
                - Value: 
                    - Edit Property: `property.defaultCommitments` 
                    - New Property: `loggedinUser.commitments`
                - Read Only: `property.calcAdditionalFunding.totalAmount >  0` 
        - *Additional funding sources (@additional-funding-sources-component.md)*:
            - Label: `property_additional_funding_sources_label`. Tooltip: `property_additional_funding_sources_tooltip`.
            - Validation: Required. 
            - Source / Logic: `loggedinUser.additionalFundingSources`.
        - *Disposable income (@calc-component.md)*:
            - Label: `property_disposable_income_label`. Tooltip: `property_disposable_income_tooltip`.
            - Source / Logic: `property.calcDisposableIncome`    
        - *Desired monthly repayment (@editable-input-component.md)*:
            - Label: `property_possible_monthly_payment_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Calculated Value: `property.calcPossibleMonthlyRepayment`.
                - Custom Value: `property.possibleMonthlyRepaymentCustomValue`.
                - Default: `property.defaultPossibleMonthlyRepayment` 
                - Interactive Source: `fixedParameters.propertyInputs.possibleMonthlyRepaymentPercent` (defines min/max/step for the slider)
    **Part 3 - Funding status (Visible if `property.showMortgagePrepayment === true`)**
        - *Header (@section-header-component.md)*:
            - Label: `property_financing_status_header`. 
            - Icon: `Check`. 
            - Variant: `indigo`.
        - *Funding status (@financing-status-component.md)*:
            - Label: `property_financing_status_header`. 
            - Source / Logic: 
                - Maximum financing percentage: `property.calcMaxPercentOfFinancing`.
                - Actual funding percentage: `property.calcActualPercentOfFinancing`. 
                - Display 
                    - Positive: `property.calcActualPercentOfFinancing <= property.calcMaxPercentOfFinancing`
                    - Negative: `property.calcActualPercentOfFinancing > property.calcMaxPercentOfFinancing`
    **Part 4 - Ancillary expenses**	
        - *Header (@section-header-component.md)*:
            - Label: `property_ancillary_expenses_header`. 
            - Icon: `Plus`. 
            - Variant: `amber`.
        - *Lawyer (@editable-input-component.md)*:
            - Label: 
                - When Slider is Active: `property_lawyer_label`. 
                - When Custom Input is Active: `property_lawyer_label_without_value`
            - Validation: Required. 
            - Source / Logic: 
                - Calculated Value: `property.calcLawyer`.
                - Custom Value: `property.lawyerCustomValue`.
                - Default: `property.defaultLawyer` 
                - Interactive Source: `fixedParameters.propertyInputs.lawyerPercent` (defines min/max/step for the slider)
            - Rollback: Clicking the reset icon sets lawyerCustomValue to null and returning the default calculated value.
        - *Real estate agent (@editable-input-component.md)*:
            - Label: 
                - When Slider is Active: `property_real_estate_agent_label`. 
                - When Custom Input is Active: `property_real_estate_agent_label_without_value`
            - Validation: Required. 
            - Source / Logic: 
                - Calculated Value: `property.calcRealEstateAgent`.
                - Custom Value: `property.realEstateAgentCustomValue`.
                - Default: `property.defaultRealEstateAgent` 
                - Interactive Source: `fixedParameters.propertyInputs.realEstateAgentPercent` (defines min/max/step for the slider)
            - Rollback: Clicking the reset icon sets realEstateAgentCustomValue to null and returning the default calculated value.
        - *Broker mortgage (@editable-input-component.md)*:
            - Label: `property_broker_mortgage_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Value: `property.calcBrokerMortgage`.
                - Default: `fixedParameters.propertyValues.brokerMortgage`.
        - *Repairing (@suggested-number-component.md)*:
            - Label: `property_repairing_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Value: `property.calcRepairing`.
                - Default: `fixedParameters.propertyValues.repairing`.
        - *Transfer tax (@calc-component.md)*:
            - Label: `property_transfer_tax_label`.
            - Source / Logic: `property.calcTransferTax`
        - *Total associated expenses (@summary-component.md)*:
            - Label: `property_incidentals_total_label`. 
            - Source / Logic: `property.calcIncidentalsTotal``
            - Variant: `amber`.
    **Part 5 - Expected Rental Income**    
        - *Header (@section-header-component.md)*:
            - Label: `property_expected_income_header`. 
            - Icon: `TrendingUp`. 
            - Variant: `emerald`.
        - *Projected Rent (@editable-input-component.md)*:
            - Label: 
                - When Slider is Active: `property_rent_label`. 
                - When Custom Input is Active: `property_rent_label_without_value`
            - Validation: Required. 
            - Source / Logic: 
                - Calculated Value: `property.calcRent`.
                - Custom Value: `property.rentCustomValue`.
                - Default: `property.defaultRent` 
                - Interactive Source: `fixedParameters.propertyInputs.rentPercent` (defines min/max/step for the slider)
            - Rollback: Clicking the reset icon sets rentCustomValue to null and returning the default calculated value.
        - *Life insurance (@suggested-number-component.md)*:
            - Label: `property_life_insurance_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Value: `property.calcLifeInsurance`.
                - Default: `fixedParameters.propertyValues.lifeInsurance`.
        - *Structure insurance (@suggested-number-component.md)*:
            - Label: `property_structure_insurance_label`. 
            - Validation: Required. 
            - Source / Logic: 
                - Value: `property.calcStructureInsurance`.
                - Default: `fixedParameters.propertyValues.structureInsurance`.
        - *Total associated expenses (@summary-component.md)*:
            - Label: `property_rent_cleaning_expenses_label`. 
            - Source / Logic: `property.calcRentCleaningExpenses``
            - Variant: `emerald`.
    **Part 6* - Mortgage Payment (Visible if `property.showMortgagePrepayment === true`)**
        - *Header (@section-header-component.md)*:
            - Label: `property_mortgage_repaying_header`. 
            - Icon: `Calendar`. 
            - Variant: `indigo`.
        - *Mortgage period (@segmented-control-component.md)*:
            - Label: `property_mortgage_period_label`. Warning: `property_mortgage_period_warning`.
            - Validation: Required. 
            - Source / Logic: 
                - Value: `property.calcMortgagePeriod`.
                - Default: `fixedParameters.propertyValues.mortgagePeriods`.
            - Warning condition: Mortgage period is too long relative to age. `loggedinUser.calcAge + property.calcMortgagePeriod > fixedParameters.mortgageMaxAge`
        - *Estimated Monthly Payment (@calc-component.md)*:
            - Label: `property_mortgage_monthly_repayment_label`. TOOLTIP: `property_mortgage_monthly_repayment_tooltip`. Error Tooltip: `property_mortgage_monthly_repayment_warning`
            - Source / Logic: `property.calcMortgageMonthlyRepayment`
            - Variant: `default`. If `property.calcMortgageMonthlyRepayment > property.calcPossibleMonthlyRepayment`.
        - *Monthly Return (@calc-component.md)*:
            - Label: `property_mortgage_monthly_yield_label`. Error Tooltip: `property_mortgage_monthly_yield_warning`. Warning: `property_mortgage_monthly_repayment_warning`
            - Source / Logic: `property.calcMortgageMonthlyYield`
            - Variant: `default`. If `property.calcMortgageMonthlyYield < 0` then `danger`.

3. **Integration Logic**
- *Sync:* Every change triggers an onUpdate to the parent/store (debounced API call).

- *Tour Mode:*
    - Steps: CITY, PRICE, EQUITY, APARTMENT_TYPE, INCOME, COMMITMENTS.
    - Highlights targeted fields, handles 1.2s mock loading on transitions.

# CSS Structure
- Modifiers: `is-loading`, `is-tour-active`.

# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── PropertyForm.tsx           # Standalone smart component
    ├── store/
    │   └── slices/
    │       └── auth.slice.ts          # State: loggedinUser, Action: updateUser
    │       └── app.slice.ts           # State: isCalculating, Action: setCalculating 
    ├── models/
    │   └── PropertyData.ts            # Interface for data mapping
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript

<PropertyForm 
  // Data & State
  property={property}
  isCalculating={boolean}
  userEmail={string}
  
  // Layout Controls
  isCompact={boolean}
  hideLocationFields={boolean}
  hidePropertyPrice={boolean}
  hideAdditionalInfo={boolean}
  hideMortgageRepayment={boolean}
  forceColumnLayout={boolean}
  section1GridClassName={string}
  
  // Tour & Refs
  showTour={boolean}
  tourStep={string}
  setPendingTourStep={(step) => void}
  setIsTourEnding={(val) => void}
  cityRef={React.RefObject}
  priceRef={React.RefObject}
  equityRef={React.RefObject}
  typeRef={React.RefObject}
  incomeRef={React.RefObject}
  commitmentsRef={React.RefObject}
  graphRef={React.RefObject}
  
  // Actions
  onUpdate={(field, value) => void}
  setViewMode={(mode: 'form' | 'results') => void}
  setActiveResultTab={(tab) => void}
  
  // Constants
  CITY_OPTIONS={any[]}
  APARTMENT_TYPES={any[]}
  FINANCIAL_DEFAULTS={any}
  MORTGAGE_PERIODS={any[]}
/>
