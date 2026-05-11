# Plan: ContactUsPage - Implementation

## Task Overview
Build the "Contact Us" orchestrator that serves as the platform's support gateway. This page manages a stateful form, validates user input against business rules, and communicates with the backend to deliver messages. It follows the "Smart Page" pattern by handling authorization, API life cycles, and global notifications while remaining 100% Tailwind-driven.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @css-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - @service-layer/SKILL.md
    - @screen-header-component.md
    - @dropdown-component.md
    - @textarea-component.md
    - @button-component.md
    - @notification-component.md
    - @phrase-usage.md
    - @contact-us-api.yaml
    - Individual Specs: 
        - @contact-us-page.md

## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Guard & Auth Logic (The Gatekeeper)**
- *Authorization Check:* Integrate `useStore` to verify `loggedinUser`. If unauthorized, redirect to `/login` using `react-router`.

- *Context Extraction:* Extract `phrases` and `fixedParameters` from the `SplashContext`.

- *Environment Metadata:* Use `utilService` to prepare `appEnv` and `platform` strings for the final payload.

**Step 2: Form Orchestration (State & Validation)**
- *Data Hydration:* Parse `fixedParameters.contactus` to populate the `Dropdown` options (targeting the `message_types` key).

- *Local State:* Initialize a `contactUs` object containing `subject` and `message` fields.

- *Validation Logic:* - Implement a `useEffect` or computed variable to track `isFormValid`.
    - Validate that a subject is selected (not "choose") and the message is not empty.
    - Map `contactus_type_error` and `contactus_message_error` to the respective field error props if touched.

**Step 3: Component Refactor (`ContactUsPage.tsx`)**
- *File Placement:* `src/pages/ContactUsPage.tsx`.

- Apply the structure from @contact-us-page.md. 

**Step 4: UI Composition (The Layout)**
- *Header:* Render `ScreenHeader` with the `contactus_title` phrase.

- *Form Shell:* Create a centered `main` container with `max-w-2xl mx-auto`.

- *Field Integration:* - Dropdown: Connect to `subject` state. Label: `contactus_type_label`.
    - Textarea: Connect to `message` state. Label: `contactus_message_label`. Placeholder: `contactus_message_placeholder`.

- *Feedback Component:* Place the `Notification` component at the root of the page to handle success/error toasts.

**Step 5: API Interaction & User Experience**
- *Submission Handler:* 
    - On `handleSubmit`, trigger `POST /api/contactUs` via `contactUsService`.
    - Toggle `isLoading` in the `app.slice` to show the global overlay and disable the submit button.

- *Response Handling:* 
    - On Success: Reset form state, trigger `Notification` with `contactus_message_send_success`.
    - On Error: Trigger `Notification` with `contactus_message_send_fail`.

- *Micro-interactions:* Add `animate-in fade-in slide-in-from-bottom-4` to the form card for a professional entrance.

**Step 6: Styling (Tailwind Only)**
- *Card Aesthetic:* Wrap the fields in a `bg-white p-8 rounded-3xl border border-slate-100 shadow-sm`.

- *Button Polish:* Use `button_send` phrase with the `Send` icon. Apply `shadow-lg` and `hover:translate-y-[-2px]` for depth.

- *RTL Alignment:* Ensure `dir="rtl"` is persistent and text alignment is consistently `text-right`.

## State Management Check (Zustand Slices Pattern)
- *App Slice:* Bind the `isLoading` state to the button's loading prop and global overlay.

- *Auth Slice:* Access `loggedinUser` to include the user ID in the API request context if available.

- *Splash Context:* Ensure `fixedParameters` are fully loaded before rendering the Dropdown options to prevent "empty" states.


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:
    
*AI says:*