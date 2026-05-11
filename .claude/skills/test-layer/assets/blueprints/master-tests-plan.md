---
name: master-tests-plan
description: Orchestrates a 5-layer test architecture (Page, Common UI, State, Service, E2E) for React/Zustand. It automates test discovery, plans execution strategy, and synchronizes the manifest while enforcing strict naming, directory isolation, and sub-numbered traceability. Use when initializing new features, refactoring existing components, or during CI/CD alignment to ensure every layer—from UI atoms to Zustand stores—has a documented and isolated test file.
allowed_model: [gemini-3-flash, claude-3-5-sonnet]
allowed_tools: [read_file, write_file, list_dir, run_terminal_command, make_dir]
hooks:
  - event: onFileCreate
    pattern: "plan/**/!(execution-manifest).md"
    action: "node ./.claude/skills/test-layer/assets/scripts/update-tests-manifest.js"
  - event: onFileChange
    pattern: "plan/**/!(execution-manifest).md"
    action: "node ./.claude/skills/test-layer/assets/scripts/update-tests-manifest.js"
---

# Plan: The Master Test-Plan Orchestrator (The "Mother" Plan)

*Objective:* Systematic generation of a 5-part test suite for a given module.

**Global Execution Rules**
1. *Context First:* Before starting any part, the AI must read the target file code provided by the user.

2. *Template Adherence:* Use the corresponding .template.md for each part.

3. *Target Directory (Strict):* All generated test plans must be organized under a root folder named after the $PLAN_FOLDER variable.

4. *Dynamic Naming Rule:* For every generated file, the [ENTITY_NAME] must be the actual filename of the source code being tested.
 Pattern: `/plan/[PLAN_FOLDER]/[PART].[SUB]-[ENTITY_NAME]-[TEST_TYPE]-test.md`

- [PART] - e.g., `001`, `002`.

- [SUB] - e.g., `1`, `2`. The SUB index is mandatory, even for sections containing a single plan.
  - *Important:* Even if a part name contains only one entity, you MUST include the suffix:
    - Incorrect: `001-property-page-test.md`
    - Correct: `001.1-property-page-test.md`

- [ENTITY_NAME]:
    - If testing a Page (PART = `001`): [ENTITY_NAME] = The tsx file name (e.g., `property`).
      Final Example: `/plan/property/001.1-property-page-test.md`

    - If testing a Service (PART = `002`): [ENTITY_NAME] = The Service file name (e.g., `propertyService`, `authStore`).
      Final Examples: `/plan/property/002.1-propertyService-service-test.md`
                      `/plan/property/002.2-authStore-service-test.md`

    - If testing a State Management (PART = `003`): [ENTITY_NAME] = The State Management file name (e.g., `propertyStore`, `authStore`).
      Final Examples: `/plan/property/003.1-propertyStore-store-test.md`
                      `/plan/property/003.2-authStore-store-test.md`

    - If testing a Component (PART = `004`): [ENTITY_NAME] = The Component name (e.g., `Button`).
      Final Example: `/plan/property/004.1-Button-component-test.md`

- [TEST_TYPE] - `page`, `service`, `store`, `component`, `e2e`).


5. *The Planning Gate:* * Before generating a Plan, the AI must complete the Mandatory "STOP-AND-ASK" Gate in the chat.

- *Important:* The questions and answers from this gate belong only in the chat discussion.

- The `# Discussion Log` section inside the generated .md file must remain EMPTY to be used later during the actual test coding phase.

6. *Isolation:* Mock external services unless specified in E2E parts.

7. Discovery & Sub-numbering: Scan provided files. If a part involves multiple entities (e.g., Part 4 has 3 components), you MUST generate a separate plan for each using sub-numbering (.1, .2, .3).

8. *Testing Environment:*: 
- Framework: Vitest with @vitejs/plugin-react.

9. *Mandatory*: Each segment of the 5-part architecture must yield at least one dedicated file. Should a part involve multiple entities (e.g., several components in Part 4), a separate file must be generated for each individual entity.

10. *The Execution Manifest Rule (STRICT MINIMALISM):*
- File Name: /plan/[PLAN_FOLDER]/execution-manifest.md

- Initialization (CRITICAL): Before generating Part 001.1, you must check if /plan/[PLAN_FOLDER]/execution-manifest.md exists. If it does, DELETE its content.

- Sync Trigger: Append or update the corresponding line immediately after a Plan .md is created/modified.

- Strict Format: Each line MUST follow this pattern exactly:
[PART].[SUB] [TAB] [COMMAND]

- Example: 
```
001.1    `npx vitest propertyPage-page-test.js`
002.1    `npx vitest propertyService-service-test.js`
```

11. *Strict Requirement:* You are PROHIBITED from skipping any Part (001-005) if the relevant logic exists in any of the provided source files. If a Part is applicable, it must yield at least one .1 plan.

## Phase 1: Frontend Coverage (The User Experience)

**Part 1/5:** Page Logic (Based on 001-Template)
Instruction: 
1. Use @001-ENTITY_NAME-page-test.template.md.
2. Scan the provided page .tsx file(s) for this module.
3. Replace all [PLACEHOLDERS] (like [PAGE_NAME], [REQUIRED_SERVICES], [UI_ELEMENTS]) with actual values from the code.
4. Output the finalized Page Test Plan.
5. Discovery Rule: Scan the provided Source Files. If multiple entities are identified for this Part (e.g., multiple pages), generate a separate Plan file for each, using mandatory sub-numbering: 
`[PART].[SUB]-[PAGE_NAME]-page-test.md` (e.g., 001.1, 001.2).
For example: `001.1-PropertyPage-page-test.md`

**Part 2/5:** Service/API Logic (Based on 002-Template)
Instruction: 
1. Use @002-ENTITY_NAME-service-test.template.md.
2. Analyze the service .tsx files to identify Axios calls and API endpoints.
3. Populate the template by mapping all [ENDPOINT], [METHOD], and [PAYLOAD] placeholders.
4. Output the finalized Service Test Plan.
5. Discovery Rule: Scan the provided Source Files. If multiple entities are identified for this Part (e.g., multiple services), generate a separate Plan file for each, using mandatory sub-numbering: 
`[PART].[SUB]-[SERVICE_NAME]-service-test.md` (e.g., 002.1, 002.2).
For example: `002.1-propertyService-service-test.md`

**Part 3/5:** State Management (Based on 003-Template)
Instruction: 
1. Use @003-ENTITY_NAME-state-management-test.template.md.
2. Analyze the Pinia store's state, getters, and actions.
3. Replace placeholders like [INITIAL_STATE] and [ACTION_NAME] with the store's logic.
4. Output the finalized State Test Plan.
5. Discovery Rule: Scan the provided Source Files. If multiple entities are identified for this Part (e.g., multiple states), generate a separate Plan file for each, using mandatory sub-numbering: 
`[PART].[SUB]-[STORE_NAME]-store-test.md` (e.g., 003.1, 003.2).
For example: `003.1-propertyStore-store-test.md`

**Part 4/5:** Components Unit Tests (Based on 004-Template)
Instruction: 
1. Use @004-ENTITY_NAME-component.template.md.
2. For each small component in the module, verify its props and emits.
3. Fill in the [COMPONENT_NAME] and [EVENT_NAME] placeholders.
4. Output a combined Components Test Plan.
5. Discovery Rule: Scan the provided Source Files. If multiple entities are identified for this Part (e.g., multiple components), generate a separate Plan file for each, using mandatory sub-numbering: 
`[PART].[SUB]-[COMPONENT_NAME]-component-test.md` (e.g., 004.1, 004.2).
For example: `004.1-Button-component-test.md`

**Part 5/5:** E2E Journey (Based on 005-Template)
Instruction: 
1. Use @005-ENTITY_NAME-e2e-test.template.md.
2. Trace the navigation flow between all pages in the module.
3. Replace [SOURCE_ROUTE] and [DESTINATION_ROUTE] based on router.push logic.
4. Output the finalized E2E Plan.
5. Scan the routes and logic. If the module contains distinct user flows (e.g., 'Happy Path: Login to Dashboard' vs. 'Recovery Path: Forgot Password'), generate a separate Plan for each major flow, using mandatory sub-numbering: 
`[PART].[SUB]-[USER_STORY]-e2e-test.md` (005.1, 005.2).
For example: `005.1-create-property-e2e-test.md`