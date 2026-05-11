---
name: profile-page
description: Unified profile management screen for editing personal and financial data. Supports conditional rendering based on mode (PERSONAL/FINANCIAL) and integration with Zustand and SplashContext.
references:
  - @page-layer/SKILL.md
  - @state-management-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @service-layer/SKILL.md
  - @api-layer/SKILL.md
  - @user-api.yaml
  - @ui-component-layer/SKILL.md
  - @section-header-component.md
  - @user-personal-info-component.md
  - @user-financial-details-component.md
  - @notification-component.md
---

# Requirements (Product Logic)

1. **Initial State & Permissions**:
- *Auth Guard*: Accessible only to `loggedinUser`. If no user session, navigate to `/login`.

- *Data Fetching*: On mount, sync `formData` with `loggedinUser` from the global store.

2. **Visual Structure & Routing**:
- *Mode Switching*: Based on URL or prop (`PERSONAL` or `FINANCIAL`).
  - `/personal-info` -> `mode: PERSONAL`.
  - `/financial-details` -> `mode: FINANCIAL`.

- *Notification*: Show `Notification` component only after API response (success or error).

- *Header*: `SectionHeader` with dynamic config:
  - PERSONAL: Icon: `User`, Title: `user_personal_details`, Variant: `blue`.
  - FINANCIAL: Icon: `Wallet`, Title: `user_financial_details`, Variant: `teal`.

3. **Form Logic**:
- *Step 1: UserPersonalInfo (Mode: PERSONAL)*:
  - Variant: MUST use `profile`.
  - Read-only: Email and Password fields are disabled (`isEmailReadOnly`, `isPasswordReadOnly`).
  - Action: `button_save`.

- *Step 2: UserFinancialDetails (Mode: FINANCIAL)*:
  - Variant: MUST use `profile`.
  - Action: `button_save`.

4. **Persistence Logic (Submit)**:
- *Trigger*: `handleSave` function.

- *API Call*: Call `updateUser(data)` (via `user.actions.js`).

- *Loading State*: Toggle `isLoading` during the PUT request.

- *Feedback*: 
  - Success: Show `user_save_success`. 
  - Error: Show `dialog_data_error_title`.

# Business Logic Constraints
- **Validation**: Re-use internal validation from sub-components. Disable "Save" button if `!isValid` or `!hasChanges`.
- **RTL Support**: Full Hebrew alignment.
- **Micro-animations**: Use `animate-in fade-in` for smooth transition when switching modes.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── ProfilePage.tsx                   # Main Component (Personal/Financial switcher)
    ├── components/
    │   ├── layouts/
    │   │   ├── UserPersonalInfo.tsx          # Using variant="profile"               
    │   │   └── UserFinancialDetails.tsx      # Using variant="profile"         
    │   └── common/
    │       └── Notification.tsx              # Floating feedback component                 
    ├── services/
    │   ├── http.service.ts
    │   └── user.service.ts                   # API call: PUT /user
    ├── store/
    │   └── slices/
    │       ├── auth.slice.ts                 # Action: updateUser (updates local store)
    │       └── app.slice.ts                  # Action: setLoading
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)


# Component Specification
```TypeScript
// Usage in Router
<Route path="/personal-info" element={<ProfilePage mode="PERSONAL" />} />
<Route path="/financial-details" element={<ProfilePage mode="FINANCIAL" />} />