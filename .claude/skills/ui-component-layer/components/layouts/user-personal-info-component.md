---
name: user-personal-info-component
description: Form component for collecting/editing user personal data (Name, Email, Password, Birth Year). Supports validation and integration with SplashContext phrases.
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
    - **Full Name (@string-component.md)**:
     - Label: `signup_fullname_label`. Placeholder: `signup_fullname_placeholder`.
     - Validation: Required. Min 2 chars. Errors: `signup_fullname_error`.
    - **Email (@email-component.md)**:
     - Label: `signup_email_label`. Placeholder: `signup_email_placeholder`.
     - Validation: Required. Errors: `signup_email_error`.
    - **Password (@password-component.md)**:
     - Label: `signup_password_label`. Placeholder: `signup_password_placeholder`.
     - Validation: Required in `Edit` mode. Min 8 chars. Errors: `signup_email_error`.
     - Disabled/Hidden in "Edit Profile" mode if applicable.
    - **Year of Birth (@year-of-birth-input-component.md)**:
     - Label: `signup_year_of_birth_hint`. Placeholder: `signup_year_of_birth_placeholder`. Tooltip: `signup_year_of_birth_tooltip`.
     - Validation: Required in `Edit` mode. Errors: `signup_year_of_birth_error`.
     - Range: 18-120 years from current year.
   
3. **Validation Logic**:
   - The "Next/Save" button must be `disabled` if any field is empty or fails validation.
   - Real-time validation: Show error messages only after the user interacts with the field (onBlur or dirty state).

4. **Global Integration**:
   - All labels, placeholders, and tooltips MUST use `getPhrase('forgot_password_link', 'Forgot Password?')`.
   - Use `useSplash` to get the current `phrases`.

# Business Logic Constraints
- **Data Trimming**: Full name and Email must be trimmed before submission.
- **RTL Support**: Labels and error messages must align to the right.
- **Read-only Mode**: Support `isPasswordReadOnly` and `isEmailReadOnly` prop for cases where the user is already logged in (e.g., Personal Info page).

# Files Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── UserPersonalInfo.tsx       # Standalone smart component
    ├── store/
    │   └── slices/
    │       ├── auth.slice.ts          # State: loggedinUser, Action: updateUser
    │       └── app.slice.ts           # State: isLoading, Action: setLoading
    ├── models/
    │   └── UserData.ts                # Interface for user personal data
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)     

# Component Specification
```TypeScript

import { UserPersonalInfo } from '../components/layouts/UserPersonalInfo';

<UserPersonalInfo
  formData={formData}
  setFormData={setFormData}
  onClick={handleNext}
  variant="wizard"
/>

<UserPersonalInfo
  formData={formData}
  initialData={initialData}
  setFormData={setFormData}
  isEmailReadOnly={true}
  isPasswordReadOnly={true}
  onClick={handleSave}
  buttonText={isSaving ? 'שומר...' : 'שמור שינויים'}
  buttonIcon={Save}
  variant="profile"
/>