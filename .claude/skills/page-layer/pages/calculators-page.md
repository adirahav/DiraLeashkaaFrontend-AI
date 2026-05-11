---
name: calculators-page
description: Main hub for the platform's financial and investment calculators. Manages the list of available tools, access permissions (locked/coming soon), and user navigation.
references:
  - @page-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @service-layer/SKILL.md
  - @phrase-usage.md
  - @ui-component-layer/SKILL.md  
  - @screen-header-component.md
  - @api-layer/SKILL.md
  - @calculator-api.yaml
---

# Requirements (Product Logic)

1. **Guard & Authorization (Centralized Logic)**:
- *Auth Check:* Verify `loggedinUser` exists via `useStore`. If null, redirect immediately to `/login`.

- *Data Fetching:* On mount, fetch the master list of calculators via `GET /api/calculator`.

2. **Calculator Access Logic**
- *Navigation:* Redirect to `/${utilService.toKebabCase(calculator.type)}-calculator` only if:
    - `calculator.isLock === false`
    - `calculator.isComingSoon === false`

- *Locked State:* If `isLock` is true (and not "Coming Soon"), show the `Lock` icon and prevent navigation.

- *Coming Soon State:* If `isComingSoon` is true, show the "Coming Soon" label and prevent navigation.

3. **Layout & UI Structure**
- **Header Section:**
    - Component: `ScreenHeader`.
    - Title: `getPhrase('calculators_title', 'Useful Calculators')`.
    - Subtitle: `getPhrase('calculators_subtitle', 'All the tools you need for smart investment analysis')`.

- **Calculators Grid:**
    - Render a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

    - Card Structure (`CalculatorsCalculator`):
        - Media: `calculator.image`.
        - Content: - Title: `getPhrase('calculator_title_' + utilService.toSnakeCase(calculator.type))`
            - Description: `getPhrase('calculator_desc_' + utilService.toSnakeCase(calculator.type))`
        - Footer Actions:
            - If Available: Component: `ScreenHeader`. Label: `getPhrase('calculator_calculate_button', 'Enter to the calculator')`. Icon: `ChevronLeft`.
            - If Coming Soon: Label `getPhrase('calculator_coming_soon', 'In development')`.
            - If Locked: Label `getPhrase('calculator_coming_locked', 'Locked')`. Icon: Lock icon.

4. **User Experience**
- *Micro-animations:* Use `motion.div` for entry (fade-in-up) with staggered delays based on the calculator index.

- *Visual Feedback:* - Hover effect: Scale image and apply `shadow-2xl`.
    - Disabled state: Apply `grayscale` and `opacity-75` for locked or coming soon cards.

- *Loading State:* Show a skeleton loader or `showOverlay` while `GET /api/calculator` is in progress.

# Business Logic Constraints
- **Naming Conventions:** All routes must follow the Kebab-Case pattern (e.g., `max-price-calculator`).
- **RTL Support:** Container must have `dir="rtl"` with text alignment to the right.
- **Dynamic Assets:** Calculator icons/images should be resolved dynamically using `utilService.toSnakeCase(calculator.type)`.

# Styling
- **Utility-First:** Use Tailwind CSS classes exclusively.

- **Key Layouts:**
    - Card: `rounded-3xl` or `rounded-[2.5rem]` for a modern organic look.
    - Hover: `group-hover:scale-110` for the background image.
    - Transitions: `duration-500` for all hover/shadow transforms.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── CalculatorsPage.tsx         # Main page controller
    ├── components/
    │   ├── formFields/
    │   │   └── Button.tsx
    │   └── common/
    │       └── ScreenHeader.tsx
    ├── services/
    │   ├── http.service.ts
    │   ├── calculator.service.ts       # API: getCalculators
    │   ├── auth.service.ts
    │   └── util.service.ts             # Helpers: toSnakeCase, toKebabCase, getPhrase
    ├── store/
    │   └── slices/
    │       ├── auth.slice.ts           # State: loggedinUser, Action: updateUser
    │       └── app.slice.ts            # Global loading/calculating state
    └── assets/
        └── css/
            └── main.css                # Tailwind Theme (@theme) 


# Component Specification
```TypeScript

// Usage in Router
<Route path="/calculators" element={<CalculatorsPage />} />