---
name: notification-component
description: A floating feedback toast for system messages (success/error). Positioned at the top of the viewport with smooth entry/exit animations.
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
examples:                                                           
   - input: "Show success notification"                                         
     output: "<Notification type="success" message="הפעולה בוצעה בהצלחה" isVisible={showNotification} onClose={() => setShowNotification(false)} />"
   - input: "Show error notification"                                         
     output: "<Notification type="error" message="נכשלה בהצלחה" isVisible={showNotification} onClose={() => setShowNotification(false)} />"
---

# Requirements
1. **Visuals:**
- *Variants:* 
  - `success`: Emerald-50 background, Emerald-100 border, Emerald-800 text.
  - `error`: Red-50 background, Red-100 border, Red-800 text.

- *Shadow & Depth:* High elevation with `shadow-2xl` to separate from content.

- *Corners:* Large rounded corners (`rounded-2xl`).

- *Position:* Fixed at the top-center (`top-20`), with a max-width for readability.

2. **Behavior:**
- *Animations:* Uses `AnimatePresence` for smooth mounting/unmounting.

- *Auto-Dismiss:* The notification must automatically trigger the onClose callback after 5 seconds.

- *Interactive:* The close button calls the `onClose` callback and provides visual hover feedback.

- *Iconography:* 
  - `success`: `CheckCircle2` (Emerald-500).
  - `error`: `AlertCircle` (Red-500).

3. **Props Definition (Component API):**
- `type:` 'success' | 'error' (required).
- `message:` string (required).
- `onClose:` () => void (required).
- `isVisible:` boolean (required).

# Tailwind Implementation Logic
- *Container Merging:* Use cn to toggle classes based on the type prop:
    - `success`: `bg-emerald-50 border-emerald-100 text-emerald-800`
    - `error`: `bg-red-50 border-red-100 text-red-800`

- *Icon Sizing:* Icons are fixed at s`ize={24}` and marked as `shrink-0` to prevent distortion on long text.

# Files Structure
ROOT-PROJ/
└── src/
    ├── components/
    │   └── common/
    │       └── Notification.tsx
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
import { Notification } from './Notification';

<Notification 
    type="error"
    message={"שגיאת שרת פנימית (500): אירעה שגיאה בלתי צפויה בתקשורת עם ה-API. נא לנסות שוב מאוחר יותר."}
    isVisible={showNotification}
    onClose={() => setShowNotification(false)}
/>