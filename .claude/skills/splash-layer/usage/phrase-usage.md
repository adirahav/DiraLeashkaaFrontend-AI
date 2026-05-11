---
name: phrase-usage
description: Guidelines for retrieving and displaying localized UI strings using the useSplash hook.
references:
  - @splash-layer/SKILL.md
  - @phrase-api.yaml
exapmple:
  - input: "Create a label for a phone input"
    output: "getPhrase('phone_label', 'Phone Number')"
  - input: "Button for saving changes"
    output: "getPhrase('save_btn', 'Save')"
---

# Standards
1. **No Hardcoded Strings**: Never use raw Hebrew strings in TSX/JSX.
2. **Access Method**: Always use `const { getPhrase } = useSplash();`.
3. **The Fallback Rule**: Every `getPhrase` call MUST include a descriptive fallback string.

# Why the Fallback?
The second argument is the 'Developer Intent'. It ensures that even if the Splash data hasn't loaded yet or the key is missing in the DB, the UI remains functional and readable.