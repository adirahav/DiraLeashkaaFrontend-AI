---
name: header-component
description: Global navigation controller. Manages responsive layouts (Desktop Nav vs. Mobile Drawer), user authentication states, and integrated footer links within the mobile menu.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @api-layer/SKILL.md
  - @footer-component.md
  - @logo-component.md
  - @button-component.md
examples:                                                           
   - input: "Show header for logged in user"                                         
     output: "<Header user={loggedinUser} isLoggedIn={true} />"
   - input: "Show header for guest on login page"                                         
     output: "<Header isLoggedIn={false} />"
---

# Requirements (Product Logic)

1. **Visibility & Layout**:
   - **Anonymous State**: Render ONLY the `Logo` (right-aligned).
   - **Authenticated State**: 
     - **Right**: `Logo` (linked to `/`).
     - **Center (Desktop)**: Navigation buttons (Add Property, Calculators, Personal Info, Financial Details).
     - **Left (Desktop)**: User Greeting + Logout button.
     - **Mobile**: `Logo` (right) and `Menu/X` toggle (left).

2. **Desktop Navigation Actions**:
   - *Add Property*: Button + `Building2` icon. Phrase: `getPhrase('home_add_property', 'Add a New Property')`. Path: `/property`.
   - *Calculators*: Button + `Calculator` icon. Phrase: `getPhrase('drawer_calculators', 'Calculators')`. Path: `/calculators`.
   - *Personal Details*: Button + `User` icon. Phrase: `getPhrase('drawer_personal_details', 'Personal Details')`. Path: `/personal-info`.
   - *Financial Details*: Button + `LineChart` icon. Phrase: `getPhrase('drawer_financial_details', 'Financial Details')`. Path: `/personal-info`.

3. **User & Auth Logic**:
   - **Greeting**: `getPhrase('drawer_hello_user', 'Hello %1$s')`. Replace `%1$s` with `user.fullname`.
   - **Logout**: 
     - Phrase: `getPhrase('drawer_logout', 'Logout')`.
     - Action: Call `authApi.logout()`, clear local state, and navigate to `/login`.

4. **Mobile Menu (Drawer) Structure**:
   - **Trigger**: Toggle button that switches between `Menu` and `X` icons.
   - **Section 1**: User Greeting.
   - **Section 2**: Navigation links (same as Desktop).
   - **Section 3**: Integrated Footer Actions (Ref: @footer-component.md).
     - Contact Us, Share, App Link, Accessibility, Terms.
   - **Section 4**: Logout (as defined in Auth Logic).
   - **Section 5**: Metadata (Copyright + Versioning).

# Business Logic Constraints
- **Responsive Guard**: Navigation links must be hidden on mobile screens behind the Hamburger menu.
- **Dynamic Content**: The Mobile Drawer must consume the same `getPhrase` and `getParam` logic as the Footer to ensure consistency.
- **Accessibility**: Use `aria-expanded` for the mobile menu state.

# CSS Structure
- Modifiers:
    - `is-open`: Applied when mobile drawer is active.
    - `is-scrolled`: Applied for sticky header styling.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── Header.tsx
    ├── store/
    │   ├── store.ts                   # Root Store: Using RTK (Zustand Toolkit) pattern.
    │   └── slices/
    │       ├── user.slice.ts          # Auth State: Handles loggedinUser and isLoggedinUserCompleted.
    │       └── app.slice.ts           # Global UI State: Manages global isLoading and notifications.
    ├── services/
    │   ├── auth.service.ts
    │   ├── http.service.ts            # API Layer: Communication with /api/auth (Logout).
    │   └── util.service.ts            # Utility: LocalStorage & Capacitor Preferences (Persistence).
    ├── contexts/
    │   └── SplashContext.tsx          # Content Source: Provides Phrases and FixedParameters.
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  


# Component Specification
```TypeScript
<Header onNavigate={onNavigate} />