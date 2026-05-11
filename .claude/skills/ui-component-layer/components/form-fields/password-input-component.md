---
name: password-input-component
description: A secure wrapper for StringInput designed for password entry. It includes internal state management for toggling password visibility and injects a specialized 'Show/Hide' button into the input's absolute container.
reference:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @string-input-component.md (Core Engine & Logic)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create a password field with a visibility toggle"                                         
     output: "<PasswordInput label='סיסמה' value={password} onChange={setPass} />"
---

# Requirements
1. **Visuals**:
   - **Toggle Button:** Positioned absolutely on the left side (`left-4`) of the input field.
   - **Icons:** Uses SVG icons for Eye (Show) and Eye-Slash (Hide) with a 20px size (`w-5 h-5`).
   - **Interaction:** Button should change color on hover (`text-blue-600`) and have a clear focus ring for accessibility.

2. **Behavior**:
   - **State Management:** Must maintain a local `showPassword` boolean state.
   - **Type Switching:** Dynamically toggles the `type` prop of the underlying `StringInput` between `"password"` and `"text"`.
   - **Accessibility:** The button must have a dynamic `aria-label` based on the visibility state ("הצג סיסמה" / "הסתר סיסמה").
   - **Validation Pattern**: `/^.{8,}$/`

3. **Props Definition (Component API)**:
   - Inherits all props from `StringInput` (label, value, onChange, error, etc.).
   - Does NOT require a custom `type` prop (internally managed).
   - `disabled`: boolean (optional)

# CSS Structure
- Transition: Smooth color transition for the icon on hover.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       └── PasswordInput.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript
<PasswordInput
  label="סיסמה חדשה"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={errors.password}
  placeholder="מינימום 8 תווים"
  required
/>