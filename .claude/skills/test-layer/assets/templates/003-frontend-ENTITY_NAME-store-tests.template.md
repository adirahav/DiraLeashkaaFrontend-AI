---
name: 003-frontend-ENTITY_NAME-store-test.template
description: A template for generating a structured Test Plan for Zustand stores.
  It serves as the blueprint for defining test logic, mocks, and scenarios. 
  The output is a Markdown Plan file, not executable test code. 
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Plan: [STORE_NAME] State Management - State & Async Logic Coverage

1. **Execution Plan: Test Layer Implementation**  
    - *Target File:* **[STORE_FILE_PATH]** (Zustand Store).

    - *Testing Stack:* Vitest.

    - *Environment:* Node.js (Unit Test).

2. **Technical Challenges & Side Effects**
    - *State Reset:* Zustand stores persist state in memory. We must implement a reset mechanism (or call a reset action) in `beforeEach` to ensure test isolation.
    
    - *Async State Transitions:* Verifying how loading flags (e.g., `isLoading`) toggle during the lifecycle of an async action.
    
    - *Side-Effect Mocking:* If an action calls an API service or `useNavigate`, these must be mocked to focus solely on the **State Change**.

3. **Core Test Scenarios**
    - *Initial State:* Verify all state variables (e.g., arrays, booleans) initialize with their default values.

    - *Action Logic:* Verify that calling a specific action (e.g., `updateUser`) updates the state correctly.

    - *Derived State (Selectors):* Verify that logic used to select or filter data from the store returns correct results.

    - *Async Success:* Verify the store saves the returned data after a successful API call.
    
    - *Async Failure:* Verify the store handles errors (e.g., sets `error: true`) and resets loading flags on failure.

    - *Data Persistence:* Verify that multiple calls to the same action handle state accumulation or overwriting correctly.

4. **Final Prompt for Execution**
Command: Act as a Frontend Engineer. Generate the state test **src/state/__tests__/[FILE_NAME].state.test.tsx** using Vitest and React Testing Library.
[LLM Instruction for this section: ensure the test file name end with `state.test.js`]

**Strict Rules:**
1. *Pattern:* Follow the Arrange-Act-Assert (AAA) pattern.

2. *Framework:* Test the Zustand store as a hook or via its `getState()` API.

3. *Isolation:* Do not render React components. This is a pure logic test.

4. *Cleanup:* Ensure the store state is reset after each test to prevent data leakage.

5. *Execution Command (For User Reference Only - DO NOT RUN `npx vitest` Command):*
[LLM Instruction: Do NOT generate code now. Only populate the command below. If multiple components are being tested, you MUST provide a separate command line for each file created/updated. List them one after another.]
Command: **npx vitest [FILE_NAME].state.test**

## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.

1. **Analyze the Service:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Map Store Schema: List all State properties, Getters, and Actions found in the Pinia store.`]

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