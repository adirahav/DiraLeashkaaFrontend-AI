---
name: 002-frontend-ENTITY_NAME-service-test.template
description: A template for generating a structured Test Plan specifically for the service layer. 
  It serves as the blueprint for defining test logic, mocks, and scenarios. 
  The output is a Markdown Plan file, not executable test code. 
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Plan: [SERVICE_NAME] Service - Logic & API Coverage

1. **Execution Plan: Test Layer Implementation**   
    - *Target:* **[SERVICE_FILE_PATH]**

    - *Testing Stack:* Vitest + Axios Mock (vi.mock).

    - *Environment:* Node.js (Pure Logic Testing).

2. **Technical Challenges & Side Effects**
    - *API Mocking:* Mocking `axios` (or fetch) to simulate backend responses (200 OK, 400/500 Errors).

    - *Async Logic:* Handling `async/await` to ensure tests wait for the Service to resolve before asserting.

    - *State Updates:* If the service is integrated into a Zustand store, verify that the store's state reflects the API response correctly.

3. **Core Test Scenarios**
    - *Successful Fetch:* Verify that the method calls the correct URL and returns the expected data.
    
    - *Data Transformation:* Verify that the service formats the raw API data correctly for the frontend.
    
    - *Error Handling:* Verify that a failed API call (e.g., 500 Server Error) triggers the correct error logic/message.
    
    - *Payload Validation:* For POST/PUT requests, verify the correct data object is sent to the server.
    
    - *Edge Cases:* Handle empty responses, emlty lists, null values, malformed JSON, or network timeouts from the backend.
    
    - *Loading States:* (Optional) Verify that loading flags are toggled correctly during the request lifecycle.

4. **Final Prompt for Execution**
Command: Act as a Senior Frontend Developer. Generate the service test **src/services/__tests__/[FILE_NAME].service.test.tsx** using Vitest and React Testing Library.
[LLM Instruction for this section: ensure the test file name end with `service.test.js`]

**Strict Rules:**
1. *Pattern:* Follow the Arrange-Act-Assert (AAA) pattern.

2. *Mocks:* Mock axios globally using vi.mock('axios').

3. *Naming:* Ensure the test file name ends with `service.test.tsx`.

4. *Isolation:* Test logic and API calls in isolation. Do not render any React components.

5. *Error Handling:* Explicitly test the .catch blocks to ensure they return the expected error objects.

6. *Execution Command (For User Reference Only - DO NOT RUN `npx vitest` Command):*
- [LLM Instruction: Do NOT generate code now. Only populate the command below. If multiple components are being tested, you MUST provide a separate command line for each file created/updated. List them one after another.]
Command: **npx vitest [FILE_NAME].service.test**

## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.

1. **Analyze the Service:** 
[LLM Instruction for this section:
Inside the generated .md file, leave this section EMPTY. The only text should be:
`Map API Contracts: List all methods, their endpoints (URL), and required payloads.`]

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
