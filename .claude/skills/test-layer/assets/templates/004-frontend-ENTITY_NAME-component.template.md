---
name: 004-frontend-ENTITY_NAME-component.template
description: A template for generating a structured Test Plan for React UI Components (Atoms/Molecules).
  It serves as the blueprint for defining test logic, mocks, and scenarios. 
  The output is a Markdown Plan file, not executable test code. 
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Plan: [COMPONENT_NAME] - UI Component Rendering & Interaction

1. **Execution Plan: Test Layer Implementation**
    - *Target:* **[COMPONENT_FILE_PATH]**

    - *Testing Stack:* Vitest + React Testing Library (RTL).

    - *Environment:* jsdom (Browser simulation).

2. **Technical Challenges & Side Effects**
    - *Prop-Driven UI:* Ensuring the component reflects changes in props (e.g., `disabled`, `isLoading`, `variant`) in the DOM.
    
    - *Callback Execution:* Verifying that user events (Click, Change) trigger the correct functions passed via props (e.g., `onClick`, `onChange`).
    
    - *Global Mocking:* Mocking external assets like Icons, SVGs, or phrases (`utilService.getPhrase`) to isolate the component.
    
    - *Accessibility (A11y):* Ensuring that elements are findable by their roles (e.g., `role="button"`) rather than CSS classes.
    
    - *Conditional Rendering:* Testing that sub-elements appear or disappear based on boolean props.

    - *Class & Attribute Binding:* Validating the dynamic application of CSS classes (like disabled, active, or loading) and HTML attributes based on the component's internal logic.

3. **Core Test Scenarios (The Checklist)**
    - *Default Rendering:* Verify the component renders with its base style and content.
    
    - *Prop Reactivity:* Verify that changing a prop (e.g., `label="Submit"`) updates the displayed text.
    
    - *User Interaction:* Simulate a click and verify that the `onClick` handler is called once.
    
    - *Disabled State:* Verify that when `disabled={true}`, the element is not clickable and has the correct attribute.
    
    - *Loading State:* Verify that a spinner or loading text appears when `isLoading` is true.
    
    - *Children/Slots:* Verify that nested content (children) is rendered correctly inside the component.
    
    - *Snapshot (Optional):* Ensure the component's HTML structure remains consistent.

4. **Final Prompt for Execution**
Command: Act as a Frontend Engineer. Generate the component test **src/components/__tests__/[FILE_NAME].component.test.tsx** using Vitest and React Testing Library.
[LLM Instruction for this section: ensure the test file name end with `component.test.js`]

**Strict Rules:**
1. *Pattern:* Follow the Arrange-Act-Assert (AAA) pattern.

2. *Queries:* Use `screen.getBy...` and `userEvent` for simulations (standard RTL practice).

3. *Mocks:* Mock all SVG imports and external Icon libraries.

4. *Stubs:* If the component uses other complex UI components, mock them simply.

5. *Execution Command (For User Reference Only - DO NOT RUN `npx vitest` Command):*
[LLM Instruction: Do NOT generate code now. Only populate the command below. If multiple components are being tested, you MUST provide a separate command line for each file created/updated. List them one after another.]
Command: **npx vitest [FILE_NAME].component.test**

## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.

1. **Analyze the Service:** 
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Map Component Interface: List all Props, Emits, and Slots for each identified component.`]

2. **Clarifying Questions:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Clarifying Questions: Ask at least 3+ questions.`]

3. **Proposed Test Cases:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Expanded Test Cases: Propose at least 10+ specific test cases.`]

**CRITICAL INSTRUCTION:** After presenting your questions, you must STOP and wait for explicit approval. Do not proceed to code generation.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** 
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file.`]

---
# Discussion Log:
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`*AI says:*
(Waiting for component source code to generate specific questions and cases...)`]