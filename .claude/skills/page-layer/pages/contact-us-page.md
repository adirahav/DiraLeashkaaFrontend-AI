---
name: contact-us-page
description: Orchestrator for the Contact Us flow. Manages form state for support inquiries, handles API communication with the backend, and provides multi-step visual feedback via notifications.
references:
  - @page-layer/SKILL.md
  - @phrase-usage.md
  - @api-layer/SKILL.md
  - @contact-us-api.yaml
  - @ui-component-layer/SKILL.md
  - @dropdown-component.md
  - @textarea-component.md
  - @button-component.md
  - @screen-header-component.md
  - @notification-component.md
allowed_model: [gemini-3-flash]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
---

# Requirements (Product Logic)

1. **Guard & Authorization**:
- *Auth Check:* Verify `loggedinUser` exists via `useStore`. If null, redirect immediately to `/login`.

2. **Form Orchestration**
- *State Management:* Manages local state for `subject` (dropdown), `message` (textarea), and `errors`.

- *Data Source:* Options for the Dropdown are fetched from `fixedParameters.contactus` (specifically the `message_types` array).

- *Validation:* 
    - `subject` must not be empty/default.
    - `message` must meet minimum length requirements.
    - Display `contactus_type_error` and `contactus_message_error` respectively upon failure.

3. **API & Communication**
- *Submission:* On "Send", trigger `POST /api/contactUs` with the payload: `{ subject, message, appEnv, platform }`.

- *Loading State:* Utilize `app.slice` or local `isLoading` to disable the button and show a spinner during the request.

- *Feedback:* 
    - Success: Show `Notification` with `contactus_message_send_success`. Clear the form fields.
    - Error: Show `Notification` with `contactus_message_send_fail`.

4. **Layout & UI Structure**
- *Header:* Component `ScreenHeader` using `getPhrase('contactus_title')`.

- *Form Container:* A centered, narrow layout (`max-w-2xl`) for better readability.

- *Inputs:* 
    - `Dropdown`: Labeled `contactus_type_label`.
    - `Textarea`: Labeled `contactus_message_label` with placeholder `contactus_message_placeholder`.

- *Action:* `Button` with `text button_send` and Send icon.

5. **User Experience:**
- *Animations:* Use `animate-in fade-in slide-in-from-bottom-4` for the form container.

- *RTL*: Ensure all labels, placeholders, and error messages are right-aligned.

# Business Logic Constraints
- *Environment Context:* Automatically inject `appEnv` and `platform` (from `utilService`) into the API request.

- *Auto-Dismiss:* Notifications should disappear after 5 seconds or upon manual close.

# Tailwind Implementation Logic
- *Container:* `max-w-2xl mx-auto py-12 px-4 space-y-8`.

- *Card-like Wrapper:* `bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm`.

- *Spacing:* `flex flex-col gap-6` between form fields.

# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── ContactUsPage.tsx          # Main orchestrator
    ├── components/
    │   ├── formFields/
    │   │   ├── Dropdown.tsx
    │   │   ├── Textarea.tsx
    │   │   └── Button.tsx
    │   └── common/
    │       ├── ScreenHeader.tsx
    │       └── Notification.tsx
    ├── services/
    │   ├── http.service.ts
    │   ├── contactUs.service.ts       # API: sendMessage
    │   └── util.service.ts            # Helpers for platform/env detection
    ├── store/
    │   └── slices/
    │       ├── auth.slice.ts          # State: loggedinUser
    │       └── app.slice.ts           # Global loading state
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 

# Component Specification
```TypeScript

// Usage in Router
<Route path="/contact-us" element={<ContactUsPage />} />