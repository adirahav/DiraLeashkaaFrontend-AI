# Plan: React TypeScript Project Setup with Routing, Zustand and Capacitor

## Task Overview
Set up *React Router* for routing, *Zustand* for state management, and mobile deployment (*Capacitor*) in the existing React TypeScript + Vite project.

*Reference:* Use the specialized knowledge in
  - @state-management-layer/SKILL.md.
  - @service-layer/SKILL.md.

## Information Gathered

### Current Project State
- **Frontend Stack:** React 19.2.0 + TypeScript + Vite
- **Entry Point:** main.tsx renders App.tsx
- **Current Dependencies:** react, react-dom, vite, typescript, eslint
- **Missing Dependencies:** react-router-dom, @reduxjs/toolkit, react-redux
- **Current Structure:**
  - src/main.tsx (entry point)
  - src/App.tsx (main component with counter example)
  - src/App.css, src/index.css (styles)
  - src/assets/ (images)

### Project Guidelines (from copilot-instructions.md)
- Use the plan folder for planning
- No semicolons in JS unless necessary
- Use single quotes in JS
- Use double quotes in HTML
- All event handlers should be named like: `onSomething`
- Use skill cssLayer
- Use skill serviceLayer

## Plan

### Step 1: Environment & Dependency Setup
- [ ] Execute script: npx tsx install-deps.ts
- [ ] Verify package.json and capacitor.config.ts creation

### Step 3: Service Layer & API Integration
- [ ] Create `src/services/http.service.ts` using Axios
- [ ] Configure `BASE_URL` to point to the Express backend (handle localhost vs IP for mobile)

### Step 4: Routing & Pages
- [ ] Set up `BrowserRouter` in `main.tsx`
- [ ] Create Protected Route wrapper for the future Dashboard

### Step 5: Verify & Build APK
- [ ] Verify API calls work through the service layer
- [ ] Run `npx cap sync android` and generate APK via Android Studio

## Files to Modify
1. diraleashkaa-ai-frontend/package.json (dependencies - install via npm)
2. diraleashkaa-ai-frontend/src/main.tsx
3. diraleashkaa-ai-frontend/src/App.tsx


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

