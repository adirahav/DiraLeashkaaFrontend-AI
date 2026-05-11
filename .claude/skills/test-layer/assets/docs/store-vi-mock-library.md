---
name: state-management-mock-library
description: Mandatory reference for Pinia Store tests (.state-management.test.js). Focuses on reactive logic: 1. Action side-effects. 2. Cross-store dependencies (Singleton Pattern). 3. Dynamic LocalStorage keys (Versioning). 4. Getter reactivity.
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# State Management & Pinia Test Standards

**Execution Rules for AI**
1. **No UI Context:** Do not use `mount` or `globalStubs` in store tests. Focus strictly on the Store instance.
2. **Setup Pattern:** Always use `setActivePinia(createPinia())` in `beforeEach` to ensure a fresh state for every test.
3. **Singleton Compliance:** When a store depends on another (e.g., TargetStore depends on UserStore), use shared top-level objects to maintain reactivity.
4. **LocalStorage Rule:** Never use exact strings for keys if the store uses versioning (e.g., `store_v1_`). Use dynamic lookup.

## Cross-Store Reactivity (The Singleton Pattern)

- To test logic that depends on another store's state (like Admin roles):
*Rule:* Define the dependency state *outside* the `vi.mock` factory.

```javascript
// Top-level singleton
const sharedUserStore = { user: { roles: [] } };

vi.mock('Common/stores/userStore', () => ({
    useUserStore: vi.fn(() => sharedUserStore)
}));

it('should enable admin features if user has admin role', () => {
    const store = useTargetStore();
    sharedUserStore.user.roles = ['system_admin']; // Update singleton
    expect(store.isAdmin).toBeTruthy();
});
```

## LocalStorage & Persistence

**Dynamic Key Lookup**
Stores often append version suffixes. Use a helper to find the actual key.

```JavaScript
const getStoreKey = (partialKey) => 
    Object.keys(localStorage).find(k => k.includes(partialKey));

it('should persist data to localStorage', () => {
    const store = useTargetStore();
    store.setData({ id: 1 });
    
    const actualKey = getStoreKey('my_store_draft');
    expect(localStorage.getItem(actualKey)).toContain('"id":1');
});
```

## Action & Getter Testing

**Async Actions**
- Always await actions that perform API calls (even if mocked) to ensure the state update is finished.

**Getter Reactivity**
- Verify that Getters update automatically when the underlying state changes.

```JavaScript
it('should calculate derived state correctly', () => {
    const store = useTargetStore();
    store.items = [1, 2, 3];
    expect(store.itemsCount).toBe(3);
});
```

**Mocking External Services in Stores**
- When an action calls a Service/API, mock the service at the top of the file.

- *Rule:* Verify the action handles both success and failure (Promise resolve/reject) and updates the loading or error state accordingly.