---
name: signup-page
description: Multi-step onboarding process for investment account creation. Handles conditional step navigation, POST/PUT user synchronization, and progress persistence.
references:
  - @page-layer/SKILL.md
  - @state-management-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @api-layer/SKILL.md
  - @auth-api.yaml
  - @ui-component-layer/SKILL.md
  - @logo-component.md
  - @screen-header-component.md
  - @user-personal-info.md
  - @user-financial-details.md
  - @user-terms-of-use.md
---

# Requirements (Product Logic)

1. **Initial State & Permissions**:
- *Auth Guard (Completed)*: If `loggedinUser` exists AND `isLoggedinUserCompleted` is true (all steps done), navigate to `/`.
- *Resume Progress*: If user is logged in but incomplete, evaluate the starting step:
  - Missing `fullname/email/yearOfBirth` -> Step 1.
  - Missing `equity/incomes/commitments` -> Step 2.
  - Missing `termsOfUseAccept` -> Step 3.

2. **Visual Structure**:
- *Branding*: `Logo` component (centered, `showText={true}`).
- *Header*: `ScreenHeader`:
  - Title: `getPhrase('registration_title', 'Creating an investment account')`
  - Subtitle: `getPhrase('registration_subtitle', 'We would love to get to know you to match you with properties.')`.
- *Step Indicator*: 
  - Text: `getPhrase('registration_steps_indicator', 'Step %1$d of %2$d')` (Current vs. Total).
  - Progress Bar: With the same phrase and dynamic width.

3. **Step Logic & API Interaction**:
- *Step 1: UserPersonalInfo*:
  - Action: `button_next`.
  - Server: 
    - If `!loggedinUser`: POST `/auth/signup`. 
    - If `loggedinUser`: PUT `/user`.
  - Error: Show `signup_server_error` in a global alert area.
  - Variant Prop: Use variant="wizard" to ensure the UI remains a flat, step-based form without the Profile Card.

- *Step 2: UserFinancialDetails*:
  - Action 1 (Next): PUT `/user`. 
    - If email taken (400): show `signup_email_taken_error`. 
    - General error: `signup_server_error`.
  - Action 2 (Prev): Back to Step 1.
  - Variant Prop: Use variant="wizard" to ensure the UI remains a flat, step-based form without the Profile Card.

- *Step 3: UserConsent*: 
  - Checkbox: `signup_terms_of_use_agree`.
  - Action 1 (Finish): PUT `/user` (update `termsOfUseAccept`). 
    - On success: Navigate to `/`.
  - Action 2 (Prev): Back to Step 2.

4. **Secondary Actions**:
- *Login Link*: `getPhrase('signup_already_login', 'Already have an active profile? <U>Log in here</U>')`.

- *Path*: Navigate to `/login`.


# Business Logic Constraints
- **Loading State**: While isLoading is true, disable all buttons and inputs.
- **RTL Support**: Hebrew alignment for all labels and error messages.
- **Micro-animations**: Use AnimatePresence with direction (1 or -1) to animate transitions between steps.  

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── SignupPage.tsx              # Main Orchestrator
    ├── components/                     
    │   ├── animations/
    │   │   └── Logo.tsx                # Branding component (showText={true}).
    │   └── layouts/                    # Specialized Step Components
    │       ├── UserPersonalInfo.tsx              
    │       ├── UserFinancialDetails.tsx       
    │       └── UserConsent.tsx              
    ├── models/      
    │   ├── UserData.ts
    │   ├── LoginCredentials.ts  
    ├── services/
    │   ├── http.service.ts
    │   └── auth.service.ts             # API Layer: Communication with /api/auth (Login/Signup).
    ├── store/
    │   ├── store.ts                    # Root Store: Using RTK (Zustand Toolkit) pattern.
    │   └── slices/
    │       ├── user.slice.ts           # Tracks loggedinUser & completion status
    │       └── app.slice.ts            # Tracks global isLoading
    └── assets/
        └── css/
            └── main.css                # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
// Usage in Router
<Route path="/signup" element={SignupPage />} />