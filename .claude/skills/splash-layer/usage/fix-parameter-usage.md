---
name: fix-parameter-usage-skill
description: Guidelines for retrieving financial constants and fixed parameters (interest rates, tax brackets) from the global SplashContext.
references:
  - @splash-layer/SKILL.md
  - @fixed-parameter-api.yaml
example:
  - input: "Calculate monthly interest based on prime rate"
    output: |
      const { getParam } = useSplash();
      const primeRate = getParam('prime_rate', 6.25); // 6.25 is the safety default
      const monthlyRate = primeRate / 12 / 100;
  - input: "Get purchase tax threshold"
    output: "const threshold = getParam('tax_threshold_level_1', 1978745);"
---

# Standards
1. **Source of Truth**: Never hardcode financial constants (e.g., 6.0, 0.08) directly in calculation functions.
2. **Access Method**: Always use `const { getParam } = useSplash();`.
3. **The Default Rule**: Every `getParam` call MUST include a `defaultValue` as the second argument. This acts as a "Sanity Guard" if the API is unreachable.
4. **Two-Tier Parameter Resolution (Category + Key):**
  - If the parameter is nested within a categorized object (e.g., the appVersion object from DB), the hook must support a "Dot Notation" or "Double Argument" lookup:
    - Logic: Find the object where type === category (e.g., appVersion), then search its data array for the entry where key === requestedKey (e.g., lastVersion).
    - Usage Example: getParam('appVersion.lastVersion', 1.0).

# Why the Default Value?
Financial calculations must never result in `NaN` or `undefined`. The default value ensures that even during initial loading or a network failure, the calculators provide a logical (though perhaps slightly outdated) result instead of crashing.