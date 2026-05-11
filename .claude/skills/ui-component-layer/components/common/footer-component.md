---
name: footer-component
description: Global footer controller. Handles navigation, dynamic versioning from fixedParameters, and platform-aware sharing logic (Web vs. Native).
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @fix-parameter-usage.md
---

# Requirements (Product Logic)

1. **Visibility & Access**:
   - **User State**: Render only if `isLoggedIn` is true or `showForAnonymous` prop is passed.
   - **Conditional Content**: 
     - On the `/terms-of-use` page: Show ONLY "Terms of Use" and "Accessibility Statement".
     - Everywhere else: Show the full menu.

2. **Platform-Aware Logic (Native vs. Web)**:
   - Use `Capacitor.isNativePlatform()` to detect environment.

3. **Navigation & Action Logic**:
   - *Terms of Use*: 
      - Route: `/terms-of-use`
      - Phrase: `getPhrase('drawer_terms_of_use', 'Terms of U9se')` 
   - *Contact Us*: 
      - Route: `/contact-us`
      - Phrase: `getPhrase('drawer_contact_us', 'Contact Us')`  
    - *Share Button*: 
     - If Native (Android): Opens WhatsApp with `getPhrase('android_share_text', 'Check which apartment will yield you the highest return! Click on the link to download the…')` + App URL
     - If Web: Opens WhatsApp with phrase: `getPhrase('web_share_text', 'Check which apartment will yield you the highest return! Click on the link to the account that...')` + App URL
     - Link text: `getPhrase('drawer_share', 'Share')` 
   - *App Link*: 
     - If Native (Android): hide
     - If Web: 
        - Open browser with `webVersion.url` fixed param
        - Link text: `getPhrase('drawer_share_android', 'App')` 
   - *Web Link*: 
     - If Native (Android): 
        - Open browser with `appVersion.url` fixed param
        - Link text: `getPhrase('drawer_share_web', 'Also on the website')` 
     - If Web: hide
   - *Accessibility Statement*: 
      - Route: `/accessibility-statement`
      - Text: `getPhrase('drawer_accessibility_statement', 'Accessibility Statement')`  
   - *Version*:
      - Text: `getPhrase('drawer_version', 'version %1$s')`
        - If Native (Android): Replcae `%1$s` with `getParam('appLastVersion.lastVersion', '1.0')`
        - If Web: Replcae `%1$s` with `getParam('webLastVersion.lastVersion', '1.0')` 
   - *Copyright*: 
      - Text: `getPhrase('drawer_copyright', 'Dirha Leashkaa - All rights reserved %1$s ©')` 
        - Replcae `%1$s` with current year dynamically

# Business Logic Constraints
- **Testing**: Verify that the share URL correctly toggles based on the platform.
- **Persistence**: Ensure `useSplash` data is ready before rendering version strings to avoid.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── Footer.tsx
    ├── contexts/
    │   └── SplashContext.tsx          # Content Source: Provides Phrases and FixedParameters.
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  


# Component Specification
```TypeScript
<Footer onNavigate={navigate} />