# Plan: Footer - Extraction & Refactor

## Task Overview
Refactor the Footer to be fully dynamic, integrating with SplashContext and Capacitor for environment-specific features.

*Reference:* Use the specialized knowledge in
    - @footer-component.md 

## Import Layout from AI Studio
Refactor raw component FormFields from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps

**Step 1: Logic Extraction (Helper Utility)**
- Update `src/utils/platform.utils.ts` (or create if missing).
- Implement `getFooterData(phrases, params)`:
    - Detect platform via `@capacitor/core`.
    - Extract versioning from `fixedParameters` (keys: `appVersion`, `webVersion`).
    - Construct the WhatsApp share string using `getPhrase`.
    - Return a structured object: `{ version, shareUrl, moreUrl, isNative }`.

**Step 2: Component Refactor (`Footer.tsx`)**
- *File Placement:* `src/components/common/Footer.tsx`.

- Apply the structure from @footer-component.md.

- *Hooks Integration*
    - Use `useSplash()` to get `getPhrase` and `getParam`.
    - Use `useLocation()` from `react-router-dom` to detect current route.

- *Conditional Rendering*
    - Implement `isTermsPage` check to toggle between full and minimal footer.
    - Wrap the entire return in a conditional check for `loggedinUser`.

- *Event Handlers*
    - Implement `handleExternalLink`: Use `@capacitor/browser`'s `Browser.open` for native external navigation.

**Step 3: Styling (Tailwind)**
- Ensure the footer is a "full-bleed" container (`full` class).
- Style the `nav ul` as a flex-wrap container with pipes (`|`) as separators where required.
- Maintain RTL alignment for Hebrew text and icons.

**Step 4: Version & Copyright**
- Implement dynamic year: `new Date().getFullYear()`.
- Format the version string using `.replace("%1$s", version)`.


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.


**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:

---
### [2026-05-15] AI Pre-Flight Questions

*AI says:*

Before generating any code, I need answers to the following questions:

---

**Q1 — Styling: SCSS file or Tailwind-only?**

The `ui-component-layer` skill requires a scoped SCSS file at `src/assets/css/components/footer.scss`. However:
- The plan says *"Strictly follow Tailwind Utility-First principles"*.
- There are currently **no SCSS files** anywhere in `src/assets/css/components/` — the directory doesn't even exist.
- The existing `Footer.tsx` is 100% Tailwind with no SCSS import.

**Options:**
- A) Create `footer.scss` (imports `_vars.scss`) + import it in the component — matching the skill contract.
- B) Stay Tailwind-only — skip the SCSS file entirely, consistent with how every other component in the project is built.

Which approach should I follow?

> *Your answer:* (B) Tailwind-only approach (Skip the SCSS file).

Reasoning:
While general skills might mention SCSS, this specific project environment is built 100% on Tailwind Utility-First principles. To maintain consistency with all other components and avoid creating a fragmented styling architecture, the Footer should remain purely Tailwind.

Implementation Note:
- Do not create src/assets/css/components/footer.scss.
- Implement all styling (flex-wrap, separators, spacing) using Tailwind classes and the cn utility.
- Ensure RTL support (e.g., use space-x-reverse if using space-between or handle margins correctly for Hebrew).

---

**Q2 — `getParam` returns `number`, but version is a string (e.g., `"1.0.4"`)**

`useSplash`'s `getParam` signature is `(key: string, defaultValue: number): number`. But version values like `appLastVersion.lastVersion` are strings (the current footer hardcodes `"1.0.4"`).

**Options:**
- A) Use `getParam` anyway and `.toString()` the result — works only if the API stores versions as numbers (e.g., `1` not `"1.0.4"`).
- B) Use `getPhrase` for version strings instead of `getParam`.
- C) Read the value directly from `context?.fixedParameters` with a type cast.

What is the actual type of `appLastVersion.lastVersion` and `webLastVersion.lastVersion` in the API response — number or string?

> *Your answer:* (C) Read the value directly from fixedParameters with a type cast.

Reasoning:
- Legacy Logic Analysis: The previous code snippet parseFloat(share?.versionNumber).toFixed(1) confirms the system treats the version as a numeric value (or a string representing a number). It intentionally strips the third digit (e.g., turning 1.0.4 into 1.0) to keep the UI clean.
- Context Structure: In this architecture, technical metadata like appVersion or webVersion is typically stored in fixedParameters within the SplashContext, rather than the dynamic params array handled by getParam.
- Precision: Accessing the context directly allows us to handle the value safely, whether the API returns a string or a number, before applying the toFixed(1) formatting.

Final Instructions:
1. Version Retrieval:
    - Access the version via context?.fixedParameters.
    - Select the key based on the platform: appVersion for native (Capacitor) and webVersion for web.
    - Formatting: Convert to float and format to one decimal place to maintain the existing look: const displayVersion = parseFloat(version).toFixed(1);
2. String Interpolation:
    - Fetch the translation using getPhrase("drawer_version").
    - Perform the replacement: versionPhrase.replace("%1$s", displayVersion).
3. Component Logic:
    - Platform Detection: Use @capacitor/core to determine if the app is running natively.
    - External Links: Use @capacitor/browser for the "Contact" or "Share" links to ensure they open in the system browser on mobile.
    - Visibility: Ensure the Footer only renders when loggedinUser is present, and switches to a "minimal" mode on the Terms/Privacy pages.
    - Styling: Tailwind-only. Use cn for all class merges and stick to utility classes for the list separators (pipes).
---

**Q3 — `showForAnonymous` prop: which pages/routes use it?**

The spec says: *"Render only if `isLoggedIn` is true OR `showForAnonymous` prop is passed."*

The current `Footer.tsx` has no auth guard at all. I need to know:
- Which routes/pages should display the footer for logged-out users?
- Should `showForAnonymous` be a boolean prop, or is there a list of routes where anonymous rendering is always on (e.g., `/terms-of-use`)?

> *Your answer:* (B) Refining Footer Visibility (Auth Guard):

Requirement:
The Footer should not be visible on Auth-related screens but must remain accessible on legal pages even for logged-out users.

Implementation Logic:
1. Exclude Auth Screens: The Footer must not render if the current route is /login, /register, or /forgot-password.
2. Anonymous Whitelist: Create a constant ANONYMOUS_ROUTES = ['/terms-of-use', '/consent', '/privacy-policy'].
3. Rendering Condition:
```TypeScript
const isAuthScreen = ['/login', '/register', '/forgot-password'].includes(location.pathname);
const isAnonymousAllowed = ANONYMOUS_ROUTES.includes(location.pathname);

// Do not render anything on Auth screens
if (isAuthScreen) return null;

// Render only if user is logged in OR if it's a whitelisted anonymous page
if (!loggedinUser && !isAnonymousAllowed) return null;
```
4. Minimal Mode: On isAnonymousAllowed pages, the Footer should render in its minimal version (Version number and Copyright only, no navigation/share links), as these users shouldn't see internal app links.

---

**Q4 — Route paths: current vs. spec**

The current footer uses `/terms`, `/contact`, `/accessibility`. The component spec defines:
- `/terms-of-use`
- `/contact-us`
- `/accessibility-statement`

Are these the correct final routes, or should the old paths be kept? (This affects the `isTermsPage` detection logic.)

> *Your answer:* The correct routes:

```TypeScript
const isTermsPage = location.pathname === '/contact';
const isContactPage = location.pathname === '/contact-us';
const isAccessibilityPage = location.pathname === '/accessibility-statement';
```

---

**Q5 — Is `@capacitor/browser` installed?**

The plan requires `Browser.open()` from `@capacitor/browser` for native external navigation. Is this package already a dependency in `package.json`, or does it need to be added?

> *Your answer:* No, it needs to be added.

---

**Q6 — WhatsApp share URL format**

For the Share button, is the WhatsApp URL format `https://wa.me/?text=<encoded_phrase>+<app_url>`, or a different format? And what is the app URL to append — `webVersion.url` for web, `appVersion.url` for native?

> *Your answer:* Use the whatsapp://send?text= protocol and dynamic URL mapping based on platform.

Reasoning:
- Protocol: The legacy code uses whatsapp://send?text=. This is a classic deep-link protocol that triggers the app directly. While wa.me is common now, sticking to this protocol ensures full compatibility with the existing configuration and behavior expected by the backend parameters.
- Platform Specificity: * Native Users: Should share the android_share_text phrase along with the App Store/Google Play URL.
    - Web Users: Should share the web_share_text phrase along with the Website URL.
- Cross-Platform Promotion: The original logic includes a clever "More" feature. If a user is on Android, the footer offers a link to the Web version, and vice-versa. This is great for user retention across devices and should be preserved.

Final Instructions:
1. Platform Detection: Use Capacitor.isNativePlatform() to branch the logic.
2. WhatsApp URL Construction:
    - Construct the string using: whatsapp://send?text= + [Encoded Phrase] + [Encoded URL].
    - Native: Use android_share_text + appVersion.url.
    - Web: Use web_share_text + webVersion.url.
    - Crucial: Use encodeURIComponent() for the text and URL to ensure Hebrew characters and spaces don't break the link.
3. The "More" Promotion:
    - If isNative: Display the "Web Version" link using webVersion.url.
    - If !isNative: Display the "Android App" link using appVersion.url.
4. Auth & Visibility (Guard):
    - Hide entirely on /login, /register, and /forgot-password.
    - Minimal Mode: On legal pages (/terms-of-use, /consent), if the user is not logged in, show only the Copyright and Version number (hide navigation and share links).
5. Styling: Tailwind-only. Use flex-wrap and items-center for the navigation list. Ensure RTL support for the pipe separators (|).

---

**Q7 — Footer visibility: desktop-only or all screen sizes?**

The current footer has `hidden md:block` (hidden on mobile, visible on desktop only). Should the refactored footer keep this behavior, or should it be visible on all screen sizes?

> *Your answer:* Keep as-is — Hidden on mobile, visible only on desktop (hidden md:block).

Reasoning:
- UX Optimization: As shown in your second screenshot, mobile users access these links (Contact, Terms, Share, etc.) via the Side Menu (Drawer). Displaying a footer on mobile would be redundant and waste valuable screen space on smaller devices.
- Consistency with Source of Truth: The AI Studio code explicitly defines the footer with the hidden md:block utility. We should adhere to this design choice to ensure the desktop version "closes" the page visually, while the mobile version remains clean and focused on the bottom navigation or menu.

Final Instructions:
1. Responsive Visibility: Use the Tailwind class hidden md:block. The footer should not render/be visible below the 768px (md) breakpoint.
2. Layout & Placement: * Maintain the styling: bg-white border-t border-slate-100 py-12 px-4 mt-auto.
    - The mt-auto ensures the footer stays at the bottom of the page even on screens with minimal content.
3. Refined Logic Integration:
    - Desktop: Displays the full navigation, share links, and version info.
    - Mobile: The links are handled by the SideMenu component, so the footer remains hidden.
4. Auth & Security Guard: * Hide entirely on /login, /register, and /forgot-password.
    - Minimal Mode: On legal pages (/terms-of-use, etc.), if the user is not logged in, show only the Copyright and Version number (hide all other buttons).

---

*STOP — awaiting your answers before proceeding to code generation.*

---
### [2026-05-15] AI Implementation Log

**Decisions recorded:**
- Styling: Tailwind-only, no SCSS file created.
- Version: Read directly from `params` with `parseFloat(...).toFixed(1)` formatting.
- Auth guard: null on AUTH_SCREENS; null if not logged in and not on ANONYMOUS_ROUTES.
- Anonymous mode (not logged in + whitelist): version + copyright only, no nav.
- Terms page mode (logged in + `/terms-of-use`): terms + accessibility links only.
- Routes used: `/terms-of-use`, `/contact-us`, `/accessibility-statement`.
- WhatsApp: `whatsapp://send?text=` protocol with `encodeURIComponent`.
- External links: `Browser.open()` on native, `window.open` on web.
- Visibility: `hidden md:block` preserved.
- `@capacitor/browser` installed via `npm install --legacy-peer-deps`.

**Files created/updated:**
- `src/utils/platform.utils.ts` — new: `getFooterData(phrases, params)` utility.
- `src/components/common/Footer.tsx` — refactored: fully dynamic, platform-aware.

*TypeScript check: 0 errors.*