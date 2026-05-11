*Role:* Act as a Senior QA Architect.

*Task:* Use @master-tests-plan.md Orchestrator Skill to generate a comprehensive testing roadmap for the provided module.

*Reference:* Use the specialized knowledge in @test-layer/SKILL.md.


## 1. System Reset & Initial Start:
For this session, ignore all previous discussions, patterns, or file versions you may have in your context. We are starting a fresh execution based strictly on the current rules.

## 2. Parameters (Input Variables)
- $MODULE_NAME: `supportRequests`

- $PLAN_FOLDER: `customer_support_new_ticket` (All generated files MUST be placed in this folder).

- $EXTERNAL_REPO: `systems-admin-src` 

- $SOURCE_FILES - Attached below:
    - `frontend/src/pages/customer-support/modals/CustomerSupportNewCaseModal.vue`
    - `frontend/src/common/stores/customerSupportStore.js`
    - `frontend/common/components/controls/BaseInputString.vue`
    - `frontend/common/components/controls/BaseDropdown.vue`
    - `frontend/common/components/controls/BaseTextarea.vue`
    - `frontend/common/components/controls/BaseButton.vue`
    - `../systems-admin-src/backend/customerSupportService/app/routes/supportRequests.js`
    - `../systems-admin-srcbackend/customerSupportService/controllers/supportRequests.js`


## 3. Execution Protocol
1. Full-Spectrum Discovery: Analyze all provided $SOURCE_FILES. Identify every entity that requires testing across the 9-part architecture.  (Pages, Services, Stores, UI Components, Schemas, Controllers, Routes, etc.).
**CRITICAL:** A single file may trigger multiple parts. For example, Pinia store.js files often handle BOTH API network calls and state. If a store imports axios, it MUST be tested under PART 002 (Services) AND PART 003 (State Management). Do not skip Part 002.

2. Hierarchical Generation: For each identified entity, generate a dedicated Markdown Plan based on the corresponding template.
**CRITICAL:** If a single Part contains multiple source files, you MUST treat **each file** as a distinct entity. You must generate a separate, dedicated Markdown plan for **each** file and increment the index (e.g., 004.1, 004.2, 004.3). NEVER group multiple source files into a single generated plan.

3. **CRITICAL:** Part 005 and Part 009 E2E test plans must **ALWAYS** be generated for the overall $MODULE_NAME.

4. **CRITICAL:** If a routes or controller file contains request validation schemas (e.g., yup or joi), it MUST trigger Part 006 (Schema Tests) to test the validation logic independently of the routes.

5. **Cross-Repo Access:** Note that backend files reside in $EXTERNAL_REPO. If you cannot access the sibling directory `../$EXTERNAL_REPO`, inform the user immediately that the external source code is not visible in the current workspace.

6. **Manifest Synchronization:** After generating or updating any Markdown Plan file (001.x to 009.x), you MUST execute the specialized script to keep the manifest in sync:
   `node $PROJECT_ROOT/.claude/skills/test-layer/assets/scripts/update-tests-manifest.js`
   **CRITICAL FALLBACK:** If the script fails to execute (e.g., "Aborted" or "Command failed"), you MUST immediately update the `execution-manifest.md` manually by extracting the `**npx ...**` commands from all generated plans. Do not stop the execution flow.
   **Note:** Always run this script from the `$PLAN_FOLDER` directory to ensure it captures the local plan files.

## 4. The Mandatory "STOP-AND-ASK" Gate
To ensure 100% logic coverage, you must pause for each part and provide the following here in the chat:

- *Detailed Analysis:* List all identified methods, props, models, or permission maps found in the code for this specific part.

- *Clarifying Questions:* Ask at least 3 targeted questions regarding business logic, edge cases, or specific environment behaviors.

*Constraint:* Do NOT generate the finalized Markdown Plan files until I have reviewed the Gate analysis and given explicit approval to proceed for that specific part.

## 5. Initialization
- Read this plan. We are starting Part `001-frontend-ENTITY_NAME-page-test.template.md` now.
- List the entities you discovered and present the first "STOP-AND-ASK" Gate.
- After approved:
    - First Task: Generate an empty `execution-manifest.md` file inside the $PLAN_FOLDER directory. Populate the file content strictly according to @tests-execution-manifest-template.md.

    - Second Task: Execute `001-frontend-ENTITY_NAME-page-test.template.md` and ensure you generate plan `001.1-frontend-[FILE_NAME]-page-test.md`
    - Third Task: **CRITICAL:** Run `update-tests-manifest.js` to populate the manifest with the exact execution commands from the generated plans.
    - Show me both files to confirm alignment.
