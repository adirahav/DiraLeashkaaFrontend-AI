---
name: signup-page
description: Registration entry point. Handles initial account creation (POST) and hands off to the global onboarding funnel.
references:
  - @page-layer/SKILL.md
  - @state-management-layer/SKILL.md
  - @service-layer/SKILL.md
  - @ui-component-layer/SKILL.md
---

# Requirements (Product Logic)

1. **Initial State & Funnel Logic**:
- *Auth Guard*: If a `loggedinUser` exists, immediately call `getNextOnboardingStep(user)` and redirect. Do not allow a logged-in user to see the initial signup form.
- *Entry Point*: This page is primarily for guests (`!loggedinUser`). 

2. **Visual Structure**:
- *Branding*: `Logo` component (centered, `showText={true}`).
- *Header*: `ScreenHeader` with `registration_title` and `registration_subtitle`.
- *Step Indicator*: (Relevant only for Step 1 & 2) Shows progress using `registration_steps_indicator`.

3. **Step Logic & API Interaction**:
- *Step 1: UserPersonalInfo (The "Signup" Action)*:
  - **Action**: Call `authService.signup(data)` (POST /auth/signup).
  - **Success**: Once the user is created and logged in, call `getNextOnboardingStep(user)` to determine the next station (usually Financial Details).
  - **Variant**: `variant="wizard"`.

- *Step 2: UserFinancialDetails*:
  - **Action**: Call `userService.updateUser(data)` (PUT /user).
  - **Success**: Call `getNextOnboardingStep(user)` to navigate to the next station (usually Consent).
  - **Variant**: `variant="wizard"`.

4. **Secondary Actions**:
- *Login Link*: Redirects to `/login` using `signup_already_login`.

# Business Logic Constraints
- **Funnel Integration**: This page MUST NOT hardcode navigation to `/home`. All successful steps must resolve their destination via `getNextOnboardingStep(user)`.
- **Loading State**: Disable interactions while `isLoading` is true.
- **RTL Support**: Full Hebrew alignment.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── SignupPage.tsx            # Orchestrates Step 1 & 2
    ├── services/
    │   ├── auth.service.ts           # signup()
    │   └── user.service.ts           # updateUser()
    ├── store/
    │   └── slices/
    │       ├── auth.slice.ts         # loggedinUser state
    │       └── app.slice.ts          # isLoading state
    └── assets/
        └── css/
            └── main.css                # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
// Usage in Router
<Route path="/signup" element={SignupPage />} />