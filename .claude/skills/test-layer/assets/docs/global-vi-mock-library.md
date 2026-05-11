---
name: global-vi-mock-library
description: Mandatory reference for Vitest global infrastructure. Defines the core environment: 1. Strict Hoisting & Destructuring (vi.hoisted). 2. Core Stores & I18n Mocks (System, Badge, Translations). 3. Network/API Mocks (Axios). 4. Asset handling to prevent JSDOM InvalidCharacterError (SVG/Icon mocks).
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Global Test Infrastructure & Standards

## Execution Rules for AI
1. **Hoisting Logic (Critical):** NEVER call `vi.hoisted()` inside a `vi.mock()` factory.
    - *Step 1:* Define variables using destructuring from `vi.hoisted()` at the very top.
    - *Step 2:* Use those variables directly inside the mock factory.
    - *Example:* `const { mockStore } = vi.hoisted(...);` -> `vi.mock('path', () => ({ useStore: () => mockStore }));`

2. **Singleton Compliance:** Always define shared state objects (e.g., `sharedUserStore`) at the top level of the file, outside the `vi.mock` factory.

3. **Async Imports:** Avoid `vi.importActual().then()` for internal stores. Use the hoisted variable pattern instead.

4. **Imports:** Always import `nextTick` from 'vue', NEVER from 'vitest'.

## System, Notifications & I18n
```javascript
const { mockSystemStore, mockBadgeNotify } = vi.hoisted(() => ({
    mockSystemStore: { isRTL: false, state: {} },
    mockBadgeNotify: { show: vi.fn() }
}));

const { mockSystemStore, mockBadgeNotify, mockI18n } = vi.hoisted(() => ({
    mockSystemStore: { isRTL: false, state: {} },
    mockBadgeNotify: { show: vi.fn() },
    mockI18n: {
        t: (key) => key,
        te: () => true,
        locale: { value: 'en' }
    }
}));

vi.mock('Common/stores/systemStore', () => ({ useSystemStore: () => mockSystemStore }));
vi.mock('Common/stores/badgeNotify', () => ({ useBadgeNotify: () => mockBadgeNotify }));
vi.mock('vue-i18n', () => ({ useI18n: () => mockI18n }));

vi.mock('Common/components/translations/translationScope', () => ({ 
    provideTextScope: vi.fn(),
    getCurrentScope: vi.fn(() => 'test-scope')
}));
```

## Network (Axios)
```JavaScript
vi.mock('axios', () => {
    const m = {
        get: vi.fn(() => Promise.resolve({ data: { success: true, data: {} } })),
        post: vi.fn(() => Promise.resolve({ data: { success: true, data: {} } })),
        put: vi.fn(() => Promise.resolve({ data: { success: true, data: {} } })),
        delete: vi.fn(() => Promise.resolve({ data: { success: true, data: {} } })),
        defaults: { headers: { common: {} } },
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
    };
    return { default: m, ...m };
});
```

## UI Assets (JSDOM Fixes)
Rule: Mock SVG inline imports at the top to prevent InvalidCharacterError.

```JavaScript
vi.mock('Common/components/renderers/Svg', () => ({
    default: {
        name: 'Svg',
        props: ['name'],
        template: '<div class="svg-stub" :data-name="name"></div>'
    }
}));

// Mock specific common icons if they cause crashes
vi.mock('Common/assets/icons/error.svg?inline', () => ({
  default: { name: 'IconError', template: '<div class="icon-error-stub"></div>' }
}));
```