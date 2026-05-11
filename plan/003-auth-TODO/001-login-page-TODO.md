# Plan: Login Page - Extraction & Refactor

## Task Overview
Build a high-fidelity, state-aware Login Page. The page must handle user authentication, form validation, persistent email retrieval, and conditional navigation. It will use the new atomic components while maintaining integration with the existing Zustand store and authService.

*Reference:* Use the specialized knowledge in
    - @.claude\skills\ui-component-layer\SKILL.md
    - @.claude\skills\state-management-layer\SKILL.md
    - @.claude\skills\api-layer\docs\auth-api.yaml
    - @.claude\skills\service-layer\SKILL.md
    - Individual Specs: 
        - @.claude\skills\page-layer\pages\login-page.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Logic & State Integration (Zustand & Services)**
- *State Selection*
    - Use the unified `useStore` hook to pull `loggedinUser` and `isLoggedinUserCompleted` from the Auth Slice.
    - Pull `phrases` from `useSplash` context.

- *Initialization*
    - On useEffect (mount): Call authService.getLastLoggedinEmail() to pre-fill the email state.
    - Implement the Auth Guard: If the user is already logged in and completed, redirect to /home.

- *Form Logic*
    - Use local state for email and password values.
    - Implement a useEffect to validate fields in real-time (Regex for email, min-length for password) and toggle the isDisabled state of the submit button.

**Step 2: Refactor & Visual Composition**
- Apply the structure from @login-page.md.

- *Layout Construction* 
    - Wrap everything in a motion.div for entrance animations (Stagger children).
    - *Header Group:* Display Logo (showText={true}) followed by h1 and p using phrases login_header and login_subheader.

- *Form Fields* 
    - *Email:* Use EmailInput. Pass value, onChange, and error phrases.
    - *Password:* Use PasswordInput.
    - *Global Error:* Implement a motion.div above the fields that renders ONLY if the error state is populated from a failed login attempt.

- *Actions*
    - *Submit:* Use Button component. Show loading spinner when isLoadingState is true.
    - *Links:* Implement NavLink for "Forgot Password" and "Sign up" using the specific phrase keys.

**Step 3: Auth & Navigation Workflow**
- *The Login Flow* 
    - On handleSubmit:
        1. Call `setLoading(true)` via the App Slice.
        2. Call the `login(email, password)` service/action.
        3. On Success:
            - Set `setForceFetchSplash(true)`.
            - Navigate based on `isLoggedinUserCompleted`.
        4. On Failure:
            - Set local error state.
            - Call `setLoading(false)`.

- *Persistence*
    - Ensure the login action correctly saves the token and updates the localStorage via utilService.saveToStorage.

**Step 4: Styling & RTL (Tailwind)**
- *Styles*
    - Implement a centered card layout (max-w-md) using Flexbox.
    - Apply text-align: right and direction: rtl to ensure Hebrew labels and placeholders align correctly.
    - Mobile: Ensure padding and font sizes adjust for small screens (using @mobile mixin or media queries).
    - Animations: Define the y: 20 -> 0 transition for form elements.

**Step 5: API & Infrastructure (The Auth Engine)**
- *Http Service Implementation*
    - Axios Instance: Create `src/services/http.service.ts` following the @api-layer template.

    - JWT Handling: Configure the interceptor to attach the Authorization: Bearer <token> header to every request if a token exists in localStorage.
        - Note: The Axios interceptor should fetch the token directly from localStorage or via utilService.getFromStorage to ensure it's always fresh.

- *Auth Service Refactor (auth.service.ts)*
    - Login Request:
        - Method: POST to `/auth/login`.
        - Crucial: The backend returns a raw JWT string, not a JSON object. The httpService must be instructed to treat the response as a string.

    - Post-Login Workflow:
        - Storage: Save the raw string to localStorage under the key 'token'.
        - Decoding: Use jwt-decode to extract the user object from the token.
        - Email Persistence: Save the user's email under `STORAGE_KEY_LAST_LOGGEDIN_EMAIL` for the "Welcome Back" pre-fill feature.
        - Return: The service must return the decoded user object to the Zustand action.

- *Zustand Action Mapping*
    - Action: In user.actions.js (or slice), call `authService.login()`.
    - State Update: Once the decoded user is received, update the `loggedinUser` in the store.
    - Splash Refresh: Immediately call `setForceFetchSplash(true)` to ensure the UI language and parameters match the newly logged-in user's profile.

- *Data Cleanup* 
    - Ensure the email is trimmed and lowercased before being sent to the httpService.

- *Error Handling & UI Cleanup*
    - Dynamic Error Reset: Implement a useEffect or an onChange handler that clears the global server error state as soon as the user starts typing in either the `Email` or `Password` fields. This ensures the red "Login Error" alert disappears once the user attempts to correct their credentials, providing a smoother UX.

- *Implementation Notes*
    - Backend Contract Warning: The `/auth/login` endpoint returns a plain text/string (JWT). Do NOT attempt to access response.data.token. Use the response.data directly as the token string.
    - Security: Ensure http.service.ts clears the localStorage and redirects to `/login` if a 401 Unauthorized response is intercepted.
    - Dependencies: Ensure jwt-decode is installed in package.json before implementation.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Toggle `isLoading` during the async login process.

- *Auth Slice:* Update `loggedinUser` state upon successful response.

- *Selectors:* Strictly use atomic selectors (e.g., `state => state.user`) via `useStore` to ensure optimized re-renders and type safety.


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

*AI says:*