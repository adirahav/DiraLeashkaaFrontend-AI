---
name: 001-frontend-ENTITY_NAME-page-test.template
description: A template for generating a structured Test Plan for React Page components. 
  It serves as the blueprint for defining test logic, mocks, and scenarios. 
  The output is a Markdown Plan file, not executable test code. 
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Plan: [PAGE_NAME] Page - Test Coverage

1. **Execution Plan: Test Layer Implementation**
    - *Target:* **[RELATIVE_FILE_PATH]**

    - *Testing Stack:* Vitest + React Testing Library (RTL).

    - *Environment:* JSDOM with Zustand Mocks.

2. **Technical Challenges: Environment Mocks**
The component interacts with Hooks, Context, and State. Analyze the following:
    - *State Mocks (Zustand):* Create simplified mocks for [REQUIRED_STORES]. Ensure the store is reset between tests to avoid state leakage.
    
    - *Asynchronous Flows:* Identify `useEffect` triggers (e.g., Initial Data Fetch). Use `waitFor` from RTL to handle async updates.
    
    - *Routing:* Mock `useNavigate` or `useParams` from `react-router-dom` if used.

3. **Test Scenarios**
    - *Initial Render:* Verify that the page renders and the main title/container is visible.
    
    - *Data Fetching:* Verify that the service/API call is triggered on component mount.
    
    - *Loading State:* Verify that a spinner or loading skeleton is shown while data is fetching.
    
    - *User Interaction:* Simulate a click on [ELEMENT] and verify the expected state change or UI update.
    
    - *Navigation:* Verify that clicking [BUTTON] triggers a redirect/navigation.
    
    - *Error Handling:* Verify that an error message appears if the Service call fails.

4. **Final Prompt for Execution**
Command: Act as a Frontend Engineer. Generate the component test **src/pages/[MODULE]/__tests__/[FILE_NAME].page.test.tsx** using Vitest and React Testing Library.
[LLM Instruction for this section: ensure the test file name end with `page.test.js`]

**Strict Rules:**
1. *Pattern:* Follow the Arrange-Act-Assert (AAA) pattern.

2. *Mocks:* Mock all identified Zustand stores and API services.

3. *Naming:* Ensure the test file name ends with `page.test.tsx`.

4. *Cleanup:* Ensure `cleanup()` is handled (standard in RTL) to keep tests isolated.

5. *Execution Command (For User Reference Only - DO NOT RUN `npx vitest` Command):*
- [LLM Instruction: Do NOT generate code now. Only populate the command below. If multiple components are being tested, you MUST provide a separate command line for each file created/updated. List them one after another.]
Command: **npx vitest [FILE_NAME].page.test**


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.

1. **Analyze the Service: **
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`List all Hooks (useEffect), State dependencies (Zustand), and Services`]

2. **Clarifying Questions:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Write at least 3+ clarifying questions.`]

3. **Proposed Test Cases:**
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Write at least 10+ core test cases based on the component's logic.`

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
