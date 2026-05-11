---
name: user-financial-details-component
description: Form component for collecting/editing user financial data (Equity, Income, Commitments). Supports dynamic addition of funding sources and integration with SplashContext phrases.
references:
  - @ui-component-layer/SKILL.md
  - @state-management-layer/SKILL.md
  - @phrase-usage.md
  - @api-layer/SKILL.md
---

# Requirements (Product Logic)

1. **Variants**:
    - `wizard` (default): Linear flow, fields and button are stacked.
    - `profile`: Fields are wrapped in a `Card`, and the action button is centered below.

2. **Field Specifications**:
    - **Equity (@numeric-input-component.md)**:
     - Label: `signup_equity_label`. Placeholder: `signup_equity_placeholder`. Tooltip: `signup_equity_tooltip`.
     - Validation: Required. Positive number. Error: `signup_equity_error`.
    - **Income (@numeric-input-component.md)**:
     - Label: `signup_incomes_label`. Placeholder: `signup_incomes_placeholder`. Tooltip: `signup_incomes_tooltip`.
      - Validation: Required. Positive number. Error: `signup_incomes_error`.
    - **Commitments (@numeric-input-component.md)**:
     - Label: `signup_commitments_label`. Placeholder: `signup_commitments_placeholder`. Tooltip: `signup_commitments_tooltip`.
      - Validation: Required. Can be 0. Error: `signup_commitments_error`.
    - **Additional Funding Sources (@additional-funding-sources-editor-component.md)**:
      - Display Logic: Controlled via `showAdditionalFunding` prop.
      
3. **Action Buttons**:
    - **Next/Save**: `Button`. Text from `nextButtonText` prop. Disabled if form is invalid.
    - **Prev/Back**: `Button` (Optional). Text from `prevButtonText` prop.

4. **Global Integration**:
   - All labels, placeholders, and tooltips MUST use `getPhrase(key, phrases)`.
   - Use `useSplash` to get the current `phrases`.

# Business Logic Constraints
- **Number Parsing**: Ensure all values are parsed from strings/formatted numbers to pure integers before triggering `onChange`.
- **RTL Support**: Full right-to-left alignment for labels, tooltips, and inputs.
- **Validation**: Form is valid only if all required numeric fields are filled and `AdditionalFundingSources` (if any) are valid.

# Files Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── UserFinancialDetails.tsx   # Smart component with editor integration
    ├── store/
    │   └── slices/
    │       ├── auth.slice.ts          # State: user financial data, Action: updateUser
    │       └── app.slice.ts           # State: isLoading, Action: setLoading
    ├── models/
    │   └── UserData.ts                # Interface for user personal data
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)                


# Component Specification
```TypeScript

import { UserPersonalInfo } from '../components/layouts/UserFinancialDetails';

<UserFinancialDetails
  formData={formData}
  setFormData={setFormData}
  onNext={handleNext}
  onPrev={handlePrev}
  nextButtonText="המשך לשלב הבא"
  prevButtonText="חזור לשלב הקודם"
  variant="wizard"
/>

<UserFinancialDetails
  formData={formData}
  initialData={initialData}
  setFormData={setFormData}
  showAdditionalFunding={true}
  onNext={handleSave}
  nextButtonText={isSaving ? 'שומר...' : 'שמור שינויים'}
  buttonIcon={Save}
  variant="profile"
/>