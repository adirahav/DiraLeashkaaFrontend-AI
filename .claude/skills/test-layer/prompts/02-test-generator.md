*Role:* Act as a Senior QA Architect.

*Task:* Execute the test generation process by iterating through all Markdown plans located in the **$PLAN_FOLDER**.

*Reference:* Use the specialized knowledge in @test-layer/SKILL.md.


## 1. System Reset & Initial Start:
For this session, ignore all previous discussions, patterns, or file versions you may have in your context. We are starting a fresh execution based strictly on the current rules.

## 2. Parameters (Input Variables)
- $PLAN_FOLDER: `customer_support_new_ticket` (All generated files MUST be placed in this folder).

## 3. Execution Protocol
- *Strict Order:* Execute .md plan files from plan/$PLAN_FOLDER/ in numerical order (001.1, 002.1, etc.). Skip files that not start with number.

- *Output Only:* Generate and save the file. DO NOT run terminal commands.

- *The Technical "Iron Rules" (Mandatory):*

    1. **Hoisting & Isolation (The Golden Rule):**

        - *STRICT IMPORT ORDER (Mandatory):*
            1. `import { vi } from 'vitest';` (Must be Line 1).
            2. `vi.hoisted(() => ({ ... }))` (Define all shared mock objects here).
            3. `vi.mock('path', () => ({ ... }))` (All mocks using the hoisted variables).
            4. All other imports (`mount`, `describe`, components, etc.) MUST come after the mocks.

        - *Non-negotiable Rule:* You MUST mock Common/stores/systemStore in the hoisting block for EVERY page test. Global components (BaseInput, etc.) access this store at the top-level, and failing to mock it causes getActivePinia() errors during import.

        - *ZERO external variables in vi.mock.* All mock objects MUST be defined directly inside the factory.

        - *Mock Reference & Skill Selection:* 
            - If .page.test.js: Use @global-vi-mock-library.md (Infrastructure) + @page-vi-mock-library.md (UI/Stubs).

            - If .service.test.js: Use @global-vi-mock-library.md (Infrastructure) + @service-api-mock-library.md (Network/Payloads).

            - If .state-management.test.js: Use @global-vi-mock-library.md (Infrastructure) + @state-management-vi-mock-library.md (Pinia/Reactivity). 

        - *Autonomous Path Calculation:*
            - *Identify your location:* You are generating a test file inside a __tests__ folder.
            - *Identify the Project Root:* The project root is the folder containing frontend/.
            - *Calculate Relative Paths:*
                - To import the Component: Go one level up (../).
                - To import Stores: Calculate the path from your current location to frontend/common/stores/.
                - To import Routes/Constants: Calculate the path to frontend/src/routes/.
            - *Validation:* Before outputting, mentally trace the ../ steps. If you are n levels deep from the root, you need n ../ to reach it.

    2. **Component Stubs (PascalCase):**

        - *Every mount MUST include these global stubs:* Svg: { template: '<svg />' }, Icon: { template: '<i />' }, T: { template: '<span><slot /></span>' }.

        - All other stubs must use PascalCase (e.g., Modal, BaseButton).

    3. **Store & Lifecycle:**

        - *Setup:* Use createTestingPinia({ createSpy: vi.fn, stubActions: false }).

        - *The "BeforeEach" Sequence (Mandatory):*
            1. Initialize Pinia and Store variables (e.g., userStore = useUserStore()).

            2. Define store variables (e.g., feelGPTStore = useFeelGPTStore()).

            3. Mock store responses (e.g., mockResolvedValue) BEFORE mounting.

            4. Mount the component last.
   
        - *Async:* Always await flushPromises() immediately after mount in beforeEach.

    4. **Failure Fixes**

        - *Find Component Safely:* If wrapper.findComponent({ name: 'ModalName' }) fails, search by class assigned in the stub (e.g., wrapper.find('.modal-stub')).

        - *Triggering Base Components:* When clicking a BaseButton stub, use await btn.trigger('click'). If it's a stubbed component, you may need await btn.vm.$emit('click').

        - *Admin State:* When testing admin-only features, ensure you set userStore.user.roles = ['system_admin'] and then await nextTick() before searching for the button.

        - *BadgeNotify Assertions:* Since stubActions: false, ensure you use expect(badgeNotify.show).toHaveBeenCalledWith(expect.objectContaining({ error: true })).

    5. **The "Visibility" Fixes**
        - Ensure Render: If the root element or sub-components aren't found, check if the component has a v-if based on Store data. In beforeEach, ensure the Store state is initialized to a "ready" state (e.g., loading: false).

        - *Stub Selection:* When using findComponent, if the name fails, use the stub's HTML class (e.g., wrapper.find('.enter-prompt-stub')).

        - *Breadcrumbs Name:* Ensure the stub name matches exactly what is in the component. If the component uses v-breadcrumbs, the stub must be VBreadcrumbs.

        - *Async Waiting:* Use await wrapper.vm.$nextTick() immediately after mount and after any event that changes the UI state.

- *Updated Execution Protocol (per plan) - Discussion Log Integration:*
As you execute each plan from the $PLAN_FOLDER, you must update the # Discussion Log section within the generated Markdown file (or the version you are outputting) with the following *Required Summary*:

Format to append to # Discussion Log:
```
*AI says:*

- Plan Executed: [e.g., 001.1-frontend-generate_advisor-page-test.md]

- Test File Location: [e.g., frontend/src/pages/app/analyze-now/feel-gpt/__tests__/generate_advisor.page.test.js]

- Execution Command: [e.g., npx vitest generate_advisor.page.test]
```

- *Pre-requisite Check:* Before generating code, assume the environment has @vitejs/plugin-vue installed. If an "Invalid JS syntax" error occurs, it means the Vue transformer is missing.

## 4. The Mandatory "STOP-AND-ASK" Gate
To ensure 100% logic coverage, you must STRICTLY STOP after populating 
the # Discussion Log in Phase 1 and wait for my "APPROVE" command before 
writing any code (Phase 2).

Do NOT write or generate the test file until I have answered the 
Clarifying Questions and explicitly approved the generation.

## 5. Initialization
- Start execution. Begin with `001.1-frontend-ENTITY_NAME-page-test.md` now.
- I have already provided all the answers to your Clarifying Questions within the plan discussion. Unless there is a critical missing piece, you may proceed directly to generating the first test file and then stop and wait for my "APPROVE".
