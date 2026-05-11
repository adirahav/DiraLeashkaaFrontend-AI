---
name: year-of-birth-input-component
description: A specialized wrapper for NumericInput designed specifically for birth year entry. It enforces a 4-digit limit, removes comma formatting, and features a unique circular blue tooltip style.
references: Use the specialized knowledge in:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @number-input-component.md (Core Engine)
  - @tooltip-component.md (Core Engine)
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
examples:                                                           
   - input: "Create a birth year field for the user"                                         
     output: "<YearOfBirth value={year} onChange={setYear} error={yearError} />"
   - input: "Refactor raw YearOfBirth from studio"
     output: "I will refactor the YearOfBirth component to wrap `NumericInput` with specific props (`formatWithCommas={false}`, `maxLength={4}`) and implement the custom circular tooltip using Tailwind's `rounded-full` and `bg-blue-50` classes."
---

# Requirements
1. **Visuals**:
   - **Unique Tooltip:** Features a 20px circular badge implemented with `w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold` featuring a "?" text instead of a standard icon.
   - **Label Styling:** Uses `text-sm font-bold` (slightly smaller than standard inputs) with a forced asterisk `*`.

2. **Behavior**:
   - **Composition:** Must wrap and utilize `NumericInput`.
   - **Validation Pattern**: `/^(19|20)\d{2}$/`
   - **Constraints:** Must set `maxLength={4}` and `formatWithCommas={false}` to ensure a valid year format (e.g., 1985).
   - **Default Label:** Defaults to "שנת לידה" if no label is provided.

3. **Props Definition (Component API)**:
   - `value`: string (required)
   - `onChange`: (val: string) => void (required)
   - `label`: string (default: 'שנת לידה')
   - `error`: string (optional)
   - `disabled`: boolean (optional)
   - `tooltip`: string (optional)
   - `placeholder`: string (optional)

# Tailwind Implementation Logic
- *Composition:* Passes `formatWithCommas={false}` and `maxLength={4}` to the underlying `NumericInput`.

- *Custom Badge:* Uses `flex items-center gap-1` for the label area to position the `rounded-full` badge.

- *Interactive State:* Applied via `transition-transform duration-200 hover:scale-110` directly on the badge.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── form-fields/
    │       ├── YearOfBirth.tsx
    │       └── NumericInput.tsx       # Dependency
    ├── lib/
    │   └── utils.ts                   # cn utility (twMerge + clsx)
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript
<YearOfBirth
  value={birthYear}
  onChange={(val) => setBirthYear(val)}
  tooltip="השנה בה נולדת, כפי שמופיע בתעודת הזהות"
  placeholder="YYYY"
  error={errors.birthYear}
/>