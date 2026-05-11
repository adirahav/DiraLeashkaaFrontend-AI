  ---
  name: splash-layer
  description: Global data provider for static phrases and fixed financial parameters. Implements a "Stale-While-Revalidate" pattern using LocalStorage with a 24-hour expiration TTL.
  references:
    - @logic-layer/SKILL.md
    - @user-api.yaml
    - @phrase-api.yaml
    - @fixed-parameter-api.yaml
  allowed_model: [gemini-3-flash]
  ---

  # Requirements (Product Logic)

  1. **Hydration Strategy:**
    - **Priority 1:** Load from `localStorage` immediately on mount (Zero flicker).
    - **Priority 2:** Check "Last Updated" timestamp. If > 24 hours OR data is missing, fetch from `userService.splash()`.
    - **Priority 3:** Update `localStorage` and State simultaneously.

  2. **Data Structure (Strict Types):**
    - `phrases`: Key-Value pair of UI strings (e.g., `HE: { welcome: "ברוכים הבאים" }`).
    - `fixedParameters`: Numerical constants (Mortgage rates, tax brackets, inflation targets).
    - `metadata`: `lastUpdated` (timestamp).

  3. **Global Accessibility:**
    - Must be accessible via `useSplash()` hook.
    - Components should gracefully handle the `null` state during the very first fetch (Loading skeleton).

  # Business Logic Constraints
  - **TTL (Time To Live):** 24 hours (86,400,000 ms).
  - **Error Handling:** If Backend fails, fallback to existing LocalStorage data (even if stale) to keep the app functional.