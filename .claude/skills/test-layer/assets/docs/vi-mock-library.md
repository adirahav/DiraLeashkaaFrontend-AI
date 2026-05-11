---
name: vi-mock-library
description: A comprehensive reference library of Vitest mocking standards and UI stubs.
  This skill provides the mandatory patterns for handling Pinia stores, 
  hoisting singletons, mocking SVG assets, and managing Vue-i18n scopes 
  to prevent environment crashes and ensure test stability.
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Test Mock Library & Standards 

**Execution Rules for AI**
1. *Identify Test Type:* 
- If the file ends in .page.test.js: use Infrastructure + Page Tests blocks. 
- If the file ends in .state-management.test.js: use Infrastructure + State Management blocks.
- If the file ends in .service.test.js: Use Infrastructure + Frontend Services (API).

2. *Singleton Compliance:* Always define shared state objects (e.g., sharedUserStore) at the top level of the file, outside the vi.mock factory.

3. *Admin Testing:* To test Admin logic:
Object.assign(sharedUserStore.user, { roles: ['system_admin'] });

4. *Imports:* Always import nextTick from 'vue', NEVER from 'vitest'.

await nextTick();

5. *Hoisting Logic:* NEVER call vi.hoisted() inside a vi.mock() factory.

    - Step 1: Define variables using destructuring from vi.hoisted() at the very top.

    - Step 2: Use those variables directly inside the mock factory.

    Example: const { mockStore } = vi.hoisted(() => ({ mockStore: { ... } })); followed by vi.mock('path', () => ({ useStore: () => mockStore }));

6. *File Upload Rule:* NEVER assign files directly to wrapper.vm.file. ALWAYS simulate a file change event:
    ```
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [mockFile] });
    await input.trigger('change');
    ```

## Global Infrastructure (Core)

- Required for almost all frontend tests to prevent environment crashes.

**System & UI Context**
- *Hoisting Rule:- Extract variables from vi.hoisted to the top-level scope before using them in mocks.
- *Why:* Prevents "getActivePinia()" errors when components import stores at the top level.

const { mockSystemStore, mockBadgeNotify } = vi.hoisted(() => ({
    mockSystemStore: { isRTL: false, state: {} },
    mockBadgeNotify: { show: vi.fn() }
}));

vi.mock('Common/stores/systemStore', () => ({
    useSystemStore: () => mockSystemStore
}));

vi.mock('Common/stores/badgeNotify', () => ({
    useBadgeNotify: () => mockBadgeNotify
}));

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key) => key,
        te: () => true
    })
}));

**Network & API**
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

**Translations & I18n**
vi.mock('Common/components/translations/translationScope', () => ({ 
    provideTextScope: vi.fn(), 
    getCurrentScope: vi.fn(() => 'test-scope') 
}));

**UI Assets & Env**
- *Rule:* Always mock SVG inline imports at the top of the test file
to prevent InvalidCharacterError in jsdom.

- *SVG/Inline Mocks:* If a component imports SVGs with ?inline, you MUST mock them at the very top of the test file (before the component import) to avoid InvalidCharacterError.

vi.mock('Common/components/renderers/Svg', () => ({
    default: {
        name: 'Svg',
        props: ['name'],
        template: '<div class="svg-stub" :data-name="name"></div>'
    }
}));

vi.mock('Common/assets/icons/error.svg?inline', () => ({
  default: { name: 'IconError', template: '<div class="icon-error-stub"></div>' }
}));

vi.mock('Common/assets/icons/resize.svg?inline', () => ({
  default: { name: 'IconResize', template: '<div class="icon-resize-stub"></div>' }
}));

vi.mock('Common/assets/icons/close.svg?inline', () => ({
  default: { name: 'IconClose', template: '<div class="icon-resize-stub"></div>' }
}));

vi.mock('Common/environments/environment', () => ({
    environment: { customerSupportService: 'http://test-api.com' }
}));

**Third-Party Components (Multiselect)**
- *Rule:* Always stub `@vueform/multiselect` to prevent SVG rendering errors in JSDOM.
- *Stub Pattern:*
Multiselect: {
  name: 'Multiselect',
  props: ['options', 'modelValue', 'multipleLabel', 'mode'],
  template: '<div class="multiselect-stub"><slot name="singlelabel" :value="{label: modelValue}" /><slot name="option" :option="{label: modelValue}" /></div>'
}

## State Management (Store Logic)

- Focus: Data reactivity, Getters, and internal store state.

**The Singleton Pattern (Cross-Store Reactivity)** 
- To ensure that changes in the UserStore (like Admin roles) are detected by the TargetStore, a shared reference must be used:

*Define OUTSIDE the mock factory* 
const sharedUserStore = { user: { roles: [] } };
vi.mock('Common/stores/userStore', () => ({
    useUserStore: vi.fn(() => sharedUserStore)
}));

**LocalStorage & Versioning Fix**
- Stores often append a version suffix to keys. Never use exact key matching.

*Rule: Use dynamic key lookup*
const getStoreKey = (partialKey) => Object.keys(localStorage).find(k => k.includes(partialKey));

*Assertion Example:*
expect(localStorage.getItem(getStoreKey('draft_'))).toBe(JSON.stringify(data));


## Frontend Services (API Logic)

- Focus: Network Payloads, Endpoint URLs, and HTTP Error Handling.

## Page Tests (Component Interaction)

**Global UI Stubs**
- When mounting a Page, always stub base components to avoid rendering deep trees.

const globalStubs = {
  Svg: { name: 'Svg', template: '<div class="svg-stub" />' },
  Modal: { name: 'Modal', props: ['visible', 'show'], template: '<div v-if="visible || show" class="modal-stub"><slot /></div>'},
  T: { name: 'T', props: ['value', 'code'], template: '<span class="t-stub">{{value || code}}</span>' },
  THtml: { name: 'THtml', props: ['value'], template: '<span class="t-html-stub" v-html="value"></span>' },
  HtmlEditor: { name: 'HtmlEditor', props: ['modelValue'], template: '<div class="html-editor-stub">{{modelValue}}</div>'},
  IconError: { name: 'IconError', template: '<div class="icon-error-stub"></div>' },
  IconResize: { name: 'IconResize', template: '<div class="icon-resize-stub"></div>' },
  Icon: { name: 'Icon', template: '<i />' },
  BaseButton: { name: 'BaseButton', props: ['loading'], template: '<button class="base-button-stub"><slot /></button>' },
  BaseInput: { name: 'BaseInput', props: ['modelValue', 'error'], template: '<input class="base-input-string-stub" :data-error="!!error" :value="modelValue" />' },
  BaseDropdown: { name: 'BaseDropdown', props: ['modelValue', 'options', 'error'], template: '<div class="base-dropdown-stub" :data-error="!!error">{{modelValue}}</div>' 
    },
};

*Usage in mount:*
const wrapper = mount(MyPage, {
  global: { stubs: globalStubs }
});

*Component Visibility Rule*
- If a component is hidden behind a v-if, ensure the store state (loading, permissions) is initialized in beforeEach before mounting.
- If a test fails on `exists()` after `setProps({ show: true })`:
  - ALWAYS use: `await wrapper.setProps({ show: true }); await flushPromises(); await nextTick();`
- Reason: This ensures Pinia stores and Vue watchers have finished updating the DOM.
- Child component visibility: When a parent uses v-if (like a Modal), search for children within the parent component wrapper:
wrapper.findComponent(globalStubs.Modal).findComponent(globalStubs.Child)

*Assertion Strategy (Props vs Attributes):*
- NEVER use `wrapper.attributes('value')` to check data passed to stubs (T, THtml, etc.).
- NEVER search for a component using a string name like wrapper.findComponent({ name: 'modal' }).
ALWAYS use the object reference from your stubs: wrapper.findComponent(globalStubs.Modal)."
- ALWAYS use `wrapper.findComponent(globalStubs.T).props('value')` to check data. 
- Reason: Searching by reference `globalStubs.Name` is more reliable than string names `{ name: 'T' }`.
- Scoped Searching: When testing components inside a Modal or any conditional parent (v-if), ALWAYS search from the parent's wrapper, not the global wrapper.
    Bad: wrapper.findComponent(globalStubs.BaseDropdown)
    Good: const modal = wrapper.findComponent(globalStubs.Modal); expect(modal.findComponent(globalStubs.BaseDropdown).exists()).toBe(true);

*Handling Async Logic (Watchers & NextTick):*
- If a test updates a value that is handled by a `watch` (like `maxLength` truncation or `increaseRowsUpTo`), you MUST call `await nextTick()` after the action.
- Example: 
    `await textarea.setValue('text');`
    `await nextTick(); // Wait for watcher`
    `expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['truncated']);`

*Event Emitting:*
- To simulate a change in a stubbed component (like a Dropdown), use:
    `await wrapper.findComponent(globalStubs.BaseDropdown).vm.$emit('update:modelValue', 'value');`

*Validation & Error Handling (Vuelidate):*
- *Rule:* When testing validation errors on BaseComponents (BaseInput, BaseDropdown, etc.), NEVER expect a boolean `true`.

- *Reason:* Vuelidate returns complex error objects (e.g., `{ $or: [...] }`), not booleans.

- *Assertion Strategy:* 
    - Use `toBeTruthy()` to check if an error exists. NEVER use .toBe(true)
    - Or use `expect(component.props('error')).not.toBeNull()`.
    - *Example:*
        expect(input.props('error')).toBe(true);        // Bad
        expect(input.props('error')).toBeTruthy();      // Good