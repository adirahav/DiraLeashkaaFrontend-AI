# Plan: Splash Infrastructure & Data Hydration

## Task Overview
Create a robust, type-safe global provider that manages static phrases and financial parameters with a 24-hour caching strategy.

*Reference:* 
    - @splash-layer/SKILL.md
    - @phrase-api.yaml
    - @fixed-parameter-api.yaml
    
## Step 1: Type Definitions (The Contract)
- Create src/types/splash.ts.

- Define interface *Phrases* (Key-Value pairs for UI strings).

- Define interface *FixedParameters* (Mortgage floors, tax brackets, etc.).

- Define interface *SplashData* which includes both, plus a timestamp: number.

## Step 2: Storage Utility Enhancement
- Update src/services/util.service.ts.

- Implement saveWithExpiry(key, data, ttl) and getWithExpiry(key).

- This ensures the "once a day" logic is encapsulated in the utility, not the component.

## Step 3: SplashProvider Implementation (The Engine)
- Create src/context/SplashContext.tsx in TypeScript.

- **Initialization Logic:**

1. On Mount: Check localStorage for app_splash.

2. If exists AND not expired: setSplash(cachedData).

3. If missing OR expired: Trigger userService.fetchSplash().

- **Background Refresh:** Even if data is found in cache, if it's "stale" (e.g., older than 12 hours but less than 24), perform a silent fetch in the background to update for the next session.

- *Loading State:* Provide an isLoading boolean to prevent components from rendering with empty strings/zeros.

## Step 4: Data Access Layer & Consumer Hook (useSplash)
*Objective:* Create a high-level interface for components to consume localized strings and financial constants safely, ensuring the app never crashes due to missing keys or loading states.

1. **Interface Definition**
    The hook must return a structured object:

    - *phrases: Record<string, string>*: The raw dictionary.

    - *params: Record<string, number>*: The raw financial constants.

    - *isReady: boolean*: True only after the first successful hydration (from Cache or API).

    - *isLoading: boolean*: True during active API fetching.

2. **Implementation Logic: getPhrase**
    - *Signature:* getPhrase(key: string, fallback?: string): string

    - *Logic:* * Search for key in the phrases state.
        - If found, return the value.

        - If not found, return the fallback string.

        - If no fallback is provided, return the key string itself (wrapped in brackets like [key_missing] for easier debugging during development).

        - *Safety:* Must handle null or undefined states of the Splash context gracefully.

3. **Implementation Logic: getParam**
    - *Signature:* getParam(key: string, defaultValue: number): number

    - *Logic:* * Search for key in fixedParameters.
        - Return the value as a number.

        - If the key is missing or the value is not a number, return the defaultValue.

        - *Context:* Crucial for financial engines (e.g., getParam('prime_rate', 6.0)).

4. **DX (Developer Experience) Enhancements**
    - *Strong Typing:* Generate a TypeScript Union Type (e.g., type PhraseKey = 'welcome' | 'submit' | ...) based on the phrase-api.yaml. This enables Autocomplete in the IDE and prevents typos like getPhrase("welcom").

    - *Error Logging:* In non-production environments, log a warning to the console if a requested key is missing from the dictionary.

## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

**AI Agent Implementation Instructions:**
"When generating the useSplash hook, ensure it is exported from @/hooks/useSplash. Use a Memoized approach (e.g., useCallback) for getPhrase and getParam to prevent unnecessary re-renders in consumer components that use these functions in dependency arrays."

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:
    
*AI says:* 