---
name: email-input-component
description: A semantic wrapper for StringInput specifically for email addresses. It ensures the correct underlying input type and consistent prop forwarding.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @string-input-component.md (Core Engine & Logic)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create an email field for registration"
     output: "<EmailInput label='אימייל' value={email} onChange={setEmail} required />"
   - input: "User enters 'test@' and leaves the field"
     output: "Component triggers local error: 'כתובת אימייל לא תקינה'"
---

# Requirements
1. **Visuals**:
- Must be visually identical to `StringInput`.

- Inherits all BEM classes from `.string-input`.

2. **Internal Validation (The Regex Rule)**:
- *Pattern*: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

- *Trigger*: The validation should run `onBlur` (when the user leaves the field) to avoid annoying the user while typing.

- *Sanitization*: Automatically `.trim()` the value before validation and on change.

3. **Behavior**:
- *Type Enforcement*: `type="email"` for mobile keyboard optimization.
- *Attributes*: Include `autoComplete="email"` and `spellCheck="false"`.
- *Error Handling*: If the regex fails, set a local error state. If a parent `error` prop is passed, it takes priority over the local regex error.

4. **Props Definition**:
- Supports all `StringInput` props.
- `onValidationError`: Optional callback to notify the parent form when the regex fails.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── EmailInput.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification        
```TypeScript
<EmailInput
  label="כתובת אימייל"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="example@mail.com"
  error={errors.email}
  required
/>