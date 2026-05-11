---
name: terms-of-use-page
description: Static information page displaying the legal terms of use. Content is dynamic and fetched from SplashContext phrases as HTML.
references:
  - @page-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @ui-component-layer/SKILL.md  
  - @screen-header-component.md
  - @user-consent-component.md
---

# Requirements (Product Logic)

1. **Initial State & Persistence**:
- *Public Access*: This page is accessible to all users (logged in or guests).
- *Navigation*: Supports native back button behavior to return to the previous screen or the home page.

2. **Visual Structure**:
   - *Header*: Use `ScreenHeader` component:
     - Title: `getPhrase('user_terms_of_use_title', 'Terms of Use')`.
     - Subtitle: `getPhrase('user_terms_of_use_subtitle', 'Last updated...')`.
   - *Content Container*: A centered `Card` or wrapper that holds the legal text.
   - *Body*: Render the phrase `user_terms_of_use_text` using `dangerouslySetInnerHTML` (since it usually contains HTML formatting like `<p>`, `<b>`, etc.).

3. **Component Interaction**:
   - *UserConsent Wrapper*: Integrate the specialized component with the following configuration:
     - `showCheckbox={false}`: In this standalone page, agreement is not required (informative mode).
     - `showButtons={false}`: Hide action buttons (Accept/Decline).

# Business Logic Constraints
- **Responsiveness**: The text must be readable on mobile with proper horizontal padding.
- **RTL Support**: All text, including dynamic HTML content, must align to the right.
- **Micro-animations**: Use `animate-in fade-in slide-in-from-bottom-4` for the content entrance.

ROOT-PROJ
└── src/
    ├── pages/
    │   └── ConsentPage.tsx            # Main Page component    
    ├── components/                     
    │   ├── animations/
    │   │   └── ScreenHeader.tsx          # Standard header with scroll support
    │   ├── common/
    │   │   └── Card.tsx                  # Content wrapper
    │   └── layouts/                    
    │       └── UserConsent.tsx        # Re-used in read-only mode      
    ├── hooks/      
    │   └── useNativeBackButton.ts        # History management
    └── assets/
        └── css/
            └── main.css                  # Tailwind Theme (@theme)  


# Component Specification
```TypeScript
// Usage in Router
<Route path="/terms-of-use" element={<ConsentPage />} />