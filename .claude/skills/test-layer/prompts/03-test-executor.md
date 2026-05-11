*Role:* Act as a Senior QA Architect.

*Task:* Execute automated test suite and generate a standardized report.

*Reference:* Use specialized knowledge in @test-layer/SKILL.md and follow @tests-log-template.md.

## 1. System Reset & Initial Start:
For this session, ignore all previous discussions, patterns, or file versions you may have in your context. We are starting a fresh execution based strictly on the current rules.

## 2. Parameters (Input Variables)
- $PLAN_FOLDER: `customer_support_new_ticket` 

## 3. Execution Protocol
**Step 1 (Run):** 
    - node .claude/skills/test-layer/assets/scripts/run-suite-test.js [PLAN_FOLDER]

    - *Timeout Management:*
        - Test execution may take longer than 30 seconds.

        - DO NOT re-run the script if a timeout occurs.

        - If the tool times out, wait for the background process to finish or check if raw-tests-data.json exists before taking any further action.

**Step 2 (Read):** Access TESTS_LOGS/[PLAN_FOLDER]/raw-tests-data.json.

**Step 3 (Metadata & Mapping):** 
    - *Time Truth:* Use sessionInfo.startTime from JSON for the report header and to name the file: test-results_[YYYY-MM-DD_HH-mm-ss].log.

    - *Calculations:* Sum up Total/Passed/Failed suites and tests from runs array to populate the Summary block. Calculate Pass Rate percentage.

**Step 4 (Strict Formatting & Logic):** 
    - *Template Enforcement:* Populate @tests-log-template.md exactly. No extra sections.

    - *Grouping:* Categorize results under "Vitest" and "Playwright" headers.

    - *Success:* Use concise rawOutput.

    - *Failure:* Analyze full rawOutput + provide actionable QA Recommendations. Use ✅ PASSED or ❌ FAILED.

**Step 5 (Cleanup):** rm TESTS_LOGS/[PLAN_FOLDER]/raw-tests-data.json.

## 4. Rules
- *Time Truth:* Use only the startTime from the JSON. Do not use the system clock.

- *Scope Check:* Account for all commands in plan/[PLAN_FOLDER]/execution-manifest.md.

- *Data Hygiene:* No ANSI codes. JSON must be deleted post-report.

- *Zero Improvisation:* If a data point is missing from the JSON, mark as "N/A" but keep the @tests-log-template.md structure intact.