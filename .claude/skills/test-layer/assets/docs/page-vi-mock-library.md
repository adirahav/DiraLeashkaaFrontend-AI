---
name: page-ui-mock-library
description: Mandatory reference for Vue Page/Component tests (.page.test.js). Focuses on UI interaction standards: 1. BaseComponent Stubs (Modal, Input, Dropdown). 2. Scoped DOM searching (Modal children). 3. Vuelidate error assertions (toBeTruthy). 4. Async event handling (nextTick/flushPromises).
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Page & Component UI Test Standards

## Execution Rules for AI
1. **Validation Rule (Critical):** NEVER use `.toBe(true)` for validation errors. ALWAYS use `.toBeTruthy()`.
2. **Event Simulation:** To change a value in a stubbed component, ALWAYS use: 
   `await wrapper.findComponent(globalStubs.X).vm.$emit('update:modelValue', value);`
3. **File Uploads:** NEVER assign files to `wrapper.vm`. ALWAYS simulate the change event on the input.
4. **Imports:** Always import `nextTick` from 'vue', NEVER from 'vitest'.

## Page Tests (Component Interaction)

**Global UI Stubs**
- Use these in the `mount` options to avoid rendering heavy child trees.

```javascript
const globalStubs = {
  Svg: { name: 'Svg', template: '<div class="svg-stub" />' },
  Modal: { name: 'Modal', props: ['visible', 'show'], template: '<div v-if="visible || show" class="modal-stub"><slot /></div>'},
  T: { name: 'T', props: ['value', 'code'], template: '<span class="t-stub">{{value || code}}</span>' },
  THtml: { name: 'THtml', props: ['value'], template: '<span class="t-html-stub" v-html="value"></span>' },
  HtmlEditor: { name: 'HtmlEditor', props: ['modelValue'], template: '<div class="html-editor-stub">{{modelValue}}</div>'},
  BaseButton: { name: 'BaseButton', props: ['loading'], template: '<button class="base-button-stub"><slot /></button>' },
  BaseInput: { name: 'BaseInput', props: ['modelValue', 'error'], template: '<input class="base-input-stub" :data-error="!!error" :value="modelValue" />' },
  BaseDropdown: { name: 'BaseDropdown', props: ['modelValue', 'options', 'error'], template: '<div class="base-dropdown-stub" :data-error="!!error">{{modelValue}}</div>' },
};
```

## Component Interaction & Visibility

**Visibility & Race Conditions**
- If a component is behind a v-if, ensure state is set in beforeEach or use:
await wrapper.setProps({ show: true }); await flushPromises(); await nextTick();

**Scoped Searching (Modals/Containers)**
- When testing components inside a Modal, ALWAYS search from the Modal wrapper:
Correct: const modal = wrapper.findComponent(globalStubs.Modal);
expect(modal.findComponent(globalStubs.BaseInput).exists()).toBeTruthy();
Incorrect: wrapper.findComponent(globalStubs.BaseInput) (may find an input outside the modal).


## Assertion Strategy (Strict)

**Props vs Attributes**
- NEVER use wrapper.attributes('value') for BaseComponents.

- ALWAYS use wrapper.findComponent(globalStubs.T).props('value') or .props('error').

**Validation & Error Handling (Vuelidate)**
- Why: Vuelidate returns objects (e.g., { $error: true }), not simple booleans.

- *Assertion:*
Bad: expect(input.props('error')).toBe(true);
Good: expect(input.props('error')).toBeTruthy();
Alternative: expect(input.props('error')).not.toBeNull();

**Watchers & Async Logic**
- If an action triggers a watch, you MUST wait:
await textarea.setValue('text');
await nextTick(); // Wait for watcher logic

## File Upload Simulation

```JavaScript
const input = wrapper.find('input[type="file"]');
const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
Object.defineProperty(input.element, 'files', { value: [mockFile] });
await input.trigger('change');
```