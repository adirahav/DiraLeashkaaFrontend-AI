---
name: test-layer
description: Mandatory strict guidelines for creating and maintaining automated tests in the JavaScript Backend. Every code change must be accompanied by corresponding tests in the defined structure.
allowed-tools: Read, Glob, Bash
rules:
  - "NEVER attempt to modify project configuration files (like vitest.config.js) or component source code to fix environment issues without explicit user approval."
  - "Before using 'cd', check the current directory using 'pwd' to avoid nested path errors (e.g., frontend/frontend)."
  - "If a command fails 2 times with the same error, STOP and ask the user for guidance. Do not loop."
  - "Use individual commands instead of long chained strings to isolate failures."
  - "Always check if a test process is still running before starting a new one."
  - "If a 'spawn error' occurs, wait 2 seconds, verify the directory with 'pwd', and retry once."
  - "Never chain more than 2 test commands in a single terminal execution."
  - "To get the current timestamp, always run the terminal command date (or Get-Date in PowerShell) and use the actual output. Never guess the time."
---

# Test Layer Guidelines

## General Principle
You are a test-driven developer. For every feature, bug fix, or refactor in the microservices, you MUST create or update the relevant tests. No code is complete without its test layer.

## Backend Tests Structure
The project follows a distributed microservice architecture. Tests must be placed in a dedicated `__tests__/<entity>` folder within each microservice:

backend/
└── <microService>/
    ├── app/
    │   └── routes/
    │       └── <entity>.js                     # Routes & Validation (Yup Schemas)
    ├── controllers/
    │   └── <entity>.js                         # Business Logic & DB Aggregations
    └── __tests__/   
        └── <entity>/                        
            ├── <entity>.controller.test.js     # Integration tests: Logic validation & DB results
            ├── <entity>.schema.test.js         # Unit tests: Validation rules (Yup) & Input sanitization
            ├── <entity>.auth-security.test.js  # Auth & Permission Tests
            └── <entity>.e2e.test.js            # E2E tests: Full API flow (Auth -> Validation -> DB)

## Frontend Tests Structure
Tests must be co-located with their components/services. Follow these naming and location conventions:

src/
├── pages/app/<domain>/<module>/
│   ├── <PageName>.vue          
│   │   └── __tests__/
│   │        └── <PageName>.page.test.js    # UI & Page integration tests
├── common/components/
│   ├── <ComponentName>.vue
│   └── __tests__/
│       └── <ComponentName>.test.js         # Component unit tests (Rendering/Props)
├── common/stores/
│   ├── <storeName>.js
│   └── __tests__/
│       └── <storeName>.service.test.js     # Service logic & API call mocks
│       └── <storeName>.state.test.js       # state logic 
e2e/
└── <userStory>.spec.js                     # e2e spec 


## Technical Stack & Tools
Use the following tools for all test implementations:
- **Test Runner:** Vitest (Modern, Vite-native)
- **Language:** JavaScript (CommonJS/ESM as per service)
- **Backend Testing:** 
    - `supertest` for E2E/Route testing.
    - `vi.mock()` for mocking Common Services (dbService, authorization, logger).
- **Frontend Testing:** 
    - `Vitest` as the runner.
    - `Testing Library` (React or Vue version based on the project).
    - `jsdom` for the browser environment.

### 1. Test Pattern: Arrange-Act-Assert (AAA)
All tests MUST follow the AAA pattern within `describe` and `it` blocks:
- **Describe:** The name of the method, schema, or endpoint being tested.
- **It:** A clear description of the expected behavior (e.g., "should throw 409 when email exists").
- **Arrange:** Set up mocks, environment variables, and test data.
- **Act:** Execute the function or trigger the API request.
- **Assert:** Use `expect()` to verify status codes, data structures, and DB side-effects.

### 2. Schema Testing (`<entity>.schema.test.js`)
- **Focus:** Validate Yup schemas defined in the routes file.
- **Goal:** Ensure `CreateSchema` and `UpdateSchema` correctly permit/block data.
- **Requirement:** Test edge cases for required fields and `oneOf` enums (e.g., language codes).

### 3. Controller Testing (`<entity>.controller.test.js`)
- **Focus:** Test Controller methods. Mock all DAOs and Common System utilities.
- **Assertions:** Verify `CommonResponses` structure (e.g., `expect(res.status).toBe('OK')`).

### 4. E2E Testing (`<entity>.e2e.test.js`)
- **Focus:** Real HTTP requests via `supertest(app)`.
- **Database:** Use `emlo_db_test`. Clear collections in `beforeEach` using `deleteMany({})`.
- **Auth:** Mock the `authorization` middleware to simulate specific permissions.

## Code Example (Template)

```javascript
const { describe, it, expect, vi, beforeEach } = require('vitest');
// File: backend/globalService/__tests__/messageTemplate/messageTemplate.schema.test.js

describe('MessageTemplate Schema Validation', () => {
  it('should fail if required fields are missing', async () => {
    // Arrange: Define invalid data
    // Act: Validate against schema
    // Assert: Expect error
  });
});
```

# LLM Execution Workflow
1.  The "Test-First" Requirement
Whenever you are asked to create a new feature, component, or endpoint, you MUST generate the implementation and the corresponding test files simultaneously in one response. Do not wait for a separate request to add tests.

2.  Implementation Steps
    2.1 Analyze Scope: Identify if the change is Backend (API), Frontend (UI), or both.
    2.2 Generate Core Logic: Write the Service, Controller, or Component code.
    2.3 Generate Tests: Immediately create the matching .test.js file in the locations defined in the Structure section.
    2.4 Verify Imports: Ensure all imports in the test files correctly point to the relative path of the source file.

3.  Handling Modifications (Refactoring)
If modifying existing code:
    3.1 Update the existing test file to reflect the logic change.
    3.2 Ensure that existing tests still pass (Regression Check).
    3.3 If a new edge case is introduced, add a new it() block for it.

4.  Response Format
Always provide the file path as a header for each code block, for example:

    - File: backend/api/item/item.service.js
      [Code Block]

    - File: backend/api/item/__tests__/item.service.test.js
      [Code Block]