---
name: login-page
description: Authentication gateway screen. Handles user login, persistent email retrieval, error states, and conditional navigation based on user completion status.
references:
  - @page-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @state-management-layer/SKILL.md  
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @api-layer/SKILL.md
  - @auth-api.yaml
  - @ui-component-layer/SKILL.md  
  - @email-input-component.md
  - @password-input-component.md
  - @button-component.md
  - @logo-component.md
---

# Requirements (Product Logic)

1. **Initial State & Persistence**:
- *Persistence*: On mount, check `localStorage` (via `authService.getLastLoggedinEmail`) for a saved email. If exists, pre-fill the Email field.
- *Auth Guard*: If `loggedinUser` exists AND `isLoggedinUserCompleted` is true, auto-navigate to `/home`.

2. **Visual Structure**:
- *Branding*: `Logo` component (centered, `showText={true}`).
- *Header*: Large title using `getPhrase('login_header', 'Welcome Back')`.
- *Subheader*: Descriptive text using `getPhrase('login_subheader', 'Log in to manage your real estate investments')`.
- *Global Error*: A `motion.div` alert area displayed only when server-side errors occur (e.g., `login_credentials_error`).

3. **Form Fields**:
- *Email Input (@email-input-component.md)*:
  - Label: `login_email_label`. Placeholder: `login_email_placeholder`.
  - Validation: Required. Errors: `login_email_empty_error` (empty), `login_email_invalid_error` (format).
- *Password Input (@password-input-component.md)*:
  - Label: `login_password_label`. Placeholder: `login_password_placeholder`.
  - Validation: Required. Error: `login_password_empty_error`.
- *Forgot Password*: A `NavLink` to `/forgot-password` using `getPhrase('forgot_password_link', 'Forgot Password?')`.

4. **Authentication Logic (Submit)**:
- *Trigger*: Click on `Button` (@button-component.md) or 'Enter' key.
- *Validation*: Ensure both fields pass regex/empty checks before calling API.
- *API Call*: Call `login(email, password)` from `user.actions.js`.
- *Response Handling*:
  - `Success`: 
    - Set `setForceFetchSplash(true)` to refresh localized data.
    - Navigate to `/home` if `isLoggedinUserCompleted` is true.
    - Navigate to `/signup` if user is logged in but profile is incomplete.
  - `Failure`: Display `getPhrase('login_credentials_error', 'Login Error')` in the global error div.

5. **Secondary Actions**:
- *Signup Link*: A `motion.button` or `NavLink` styled as a call-to-action.
- *Text*: `getPhrase('login_goto_signup', 'Don't have an account yet? Sign up now')`.
- *Path*: `/signup`.

# Business Logic Constraints
- **Loading State**: While `isLoadingState` is true, disable all inputs and show a spinner/loading state on the primary button.
- **RTL Support**: The form layout must be right-aligned with proper spacing for Hebrew labels.
- **Micro-animations**: Use `framer-motion` (staggerChildren) to animate the entrance of the logo, header, and form fields.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── LoginPage.tsx               # Main Smart Component: Orchestrates components and Zustand logic.
    ├── components/
    │   ├── animations/
    │   │   └── Logo.tsx                # Branding component (showText={true}).
    │   └── formFields/
    │       ├── Button.tsx              
    │       ├── EmailInput.tsx              
    │       ├── PasswordInput.tsx              
    │       └── components.tsx              
    ├── models/      
    │   ├── UserData.ts
    │   ├── LoginCredentials.ts  
    ├── services/
    │   ├── http.service.ts
    │   ├── auth.service.ts             # API Layer: Communication with /api/auth (Login/Signup).
    │   └── util.service.ts             # Utility: LocalStorage & Capacitor Preferences (Persistence).
    ├── store/
    │   ├── store.ts                    # Root Store: Using RTK (Zustand Toolkit) pattern.
    │   └── slices/
    │       ├── user.slice.ts           # Auth State: Handles loggedinUser and isLoggedinUserCompleted.
    │       └── app.slice.ts            # Global UI State: Manages global isLoading and notifications.
    ├── contexts/
    │   └── SplashContext.tsx           # Content Source: Provides Phrases and FixedParameters.
    └── assets/
        └── css/
            └── main.css                # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
// Usage in Router
<Route path="/login" element={<LoginPage />} />