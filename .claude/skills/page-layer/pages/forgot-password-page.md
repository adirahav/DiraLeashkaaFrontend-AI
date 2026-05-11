---
name: forgot-password-page
description: A three-step password recovery flow (Email -> Verify Code -> Reset Password). Manages complex local states, API transitions, and multi-step UI feedback.
references:
  - @page-layer/SKILL.md
  - @css-layer/SKILL.md
  - @state-management-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @api-layer/SKILL.md
  - @forgot-password-api.yaml
  - @ui-component-layer/SKILL.md
  - @email-input-component.md
  - @password-input-component.md
  - @button-component.md
  - @screen-header-component.md
  - @logo-component.md
  - @notification-component.md
---

# Requirements (Product Logic)

1. **Step Management (The Flow)**:
- *Step 1: EMAIL*
  - Input: `EmailInput`.
  - API: `POST /forgotPassword/generateCode`.
  - Success: Advance to `VERIFY`.

- *Step 2: VERIFY* 
  - Input: 4-digit manual code input (HTML inputs with auto-focus logic).
  - Subtitle: `getPhrase('forgot_password_subtitle2')` replacing `%1$` with the entered email.
  - API: `POST /forgotPassword/validateCode`.
  - Success: Advance to `RESET`.
  - Action: "Send again" returns user to `EMAIL` step.

- *Step 3: RESET*
  - Inputs: `PasswordInput` (New) + `PasswordInput` (Confirm).
  - Validation: Must match and meet complexity rules.
  - API: `PUT /forgotPassword/changePassword`.
  - Success: Navigate to `/login`.

2. **UI Components per Step**:
- *StepIcon (Internal)*: Displays a specific icon (Envelope, Lock, Shield) based on the current step.
    
- *ScreenHeader*: Renders dynamic title/subtitle from phrases.
    
- *Global Error/Note*: A persistent area for server-side errors (e.g., `forgot_password_code_error`).

3. **Validation & State**:
- *Email*: Must pass regex check to enable the "Send Code" button.

- *Reset*: Button disabled if fields are empty; error shown if passwords don't match.

- *Loading State*: Block interactions and show spinner on buttons during API calls.

# Business Logic Constraints
- **Session Persistence**: The email must be remembered across steps 1 and 2.
- **RTL Support**: Full support for Hebrew alignment.
- **Security**: Use `Notification` (Toast) for critical server errors during the final Reset step.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── ForgotPasswordPage.tsx      # Main page controller
    ├── components/
    │   ├── animations/
    │   │   └── Logo.tsx                # Branding component (showText={true}).
    │   ├── common/
    │   │   └── Notification.tsx        # Error Notification components
    │   └── formFields/
    │       ├── Button.tsx              
    │       ├── EmailInput.tsx              
    │       ├── PasswordInput.tsx              
    │       └── components.tsx              
    ├── services/
    │   ├── http.service.ts
    │   └── forgotPassword.service.ts   # API Layer for recovery flow
    ├── store/
    │   ├── store.ts                    # Root Store: Using RTK (Zustand Toolkit) pattern.
    │   └── slices/
    │       └── app.slice.ts            # Global loading/calculating state
    ├── contexts/
    │   └── SplashContext.tsx           # Content Source: Provides Phrases and FixedParameters.
    └── assets/
        └── css/
            └── main.css                # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
// Usage in Router
<Route path="/forgot-password" element={<ForgotPasswordPage />} />