---
name: modal-component
description: A centered dialog overlay for critical interactions and confirmations. Features a blurred backdrop, responsive constraints, and dedicated header/content/footer sections.
allowed_model: [gemini-3-flash]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
examples:                                                           
   - input: "Create a delete confirmation modal"                                         
     output: |
        <Modal 
          isOpen={true} 
          onClose={handleClose} 
          title="אישור מחיקה"
          footer={<Button onClick={onDelete}>מחק</Button>}
        >
          <p>האם אתה בטוח?</p>
        </Modal>
---

# Requirements
1. **Visuals**:
   - **Backdrop:** `bg-slate-900/60` with `backdrop-blur-sm`.
   - **Container:** Max width `md` (448px), `rounded-[2rem]`, and `shadow-2xl`.
   - **Structure:** - Header: `bg-slate-50/50` with a close button and bold title.
     - Body: Padded (`p-8`) and scrollable via `custom-scrollbar`.
     - Footer: `bg-slate-50` with `flex-row-reverse` for RTL-compliant action alignment.
   - **Animations:** `fade-in` for backdrop; `zoom-in` and `slide-in-from-bottom` for the dialog.
2. **Behavior**:
   - **Closing:** Closes via the "X" button or clicking the backdrop overlay.
   - **Scroll Prevention:** Content area uses `overflow-y-auto` with a fixed header/footer (`flex-shrink-0`).
   - **Accessibility:** Uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` linked to `React.useId`.
3. **Props Definition (Component API)**:
   - `isOpen`: boolean (required).
   - `onClose`: () => void (required).
   - `title`: string (required).
   - `children`: ReactNode (The body content).
   - `footer`: ReactNode (Optional action buttons).
4. **Phrases**:
   - Close button: Use `getPhrase('modal_button_close', 'Close')`

# CSS Structure
- Modifiers: Standard BEM for states if needed.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── commom/
    │       └── Modal.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  


# Component Specification
```TypeScript
import { Modal } from './Modal';

<Modal
  isOpen={true}
  onClose={() => {}}
  title="כותרת המודאל"
  footer={<Button>אישור</Button>}
>
  תוכן המודאל כאן...
</Modal>