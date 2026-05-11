---
name: state-management-layer
description: Global state architecture using Zustand with a sliced pattern. Handles modular state, hydration, and direct integration with services.
---

# Zustand Slices Architecture Guidelines
*Goal:* Maintain a "Single Source of Truth" by organizing the application state into scalable, feature-based slices, combined into a unified store.

**Core Principles:**
- **Modular Slices:** Each feature (auth, app, properties) must have its own dedicated slice file.
- **StateCreator Pattern:** Slices are defined as functions that receive `set` and `get`.
- **Atomic Updates:** Define clear, predictable actions within the slice to update the state.
- **No Direct Mutations:** Use Zustand's functional updates to ensure immutability.

# Responsibility & Logic Separation
**Global State (app.slice.ts):** Application-wide data (e.g., global `isLoading`, notifications, `isMenuOpen`).
**Feature State (<feature>.slice.ts):** Feature-specific business logic and data (e.g., `auth`, `properties`).

## Files Structure
src/store/
├── slices/      
│   ├── app.slice.ts       # Global UI/App state
│   ├── auth.slice.ts      # Authentication & User state
│   └── <feature>.slice.ts # Feature-specific slices
└── store.ts               # Root Store (Unified Hook)

## Slice Pattern (The "Slices" Way)
A slice encapsulates the interface, initial state, and actions in a single functional creator.

```typescript
// src/store/slices/feature.slice.ts
import { StateCreator } from 'zustand'
import { RootState } from '../store'

export interface FeatureSlice {
  prop1: boolean
  setProp1: (val: boolean) => void
  resetFeature: () => void
}

export const createFeatureSlice: StateCreator<RootState, [], [], FeatureSlice> = (set, get) => ({
  // State
  prop1: false,

  // Actions
  setProp1: (val) => set({ prop1: val }),
  
  resetFeature: () => set({ prop1: false })
})


## Root Store Integration
```TypeScript

// src/store/store.ts
import { create } from 'zustand'
import { createAuthSlice, AuthSlice } from './slices/auth.slice'
import { createAppSlice, AppSlice } from './slices/app.slice'

// Combined Type
export type RootState = AuthSlice & AppSlice

export const useStore = create<RootState>((...a) => ({
  ...createAuthSlice(...a),
  ...createAppSlice(...a),
}))

// Usage in components:
// const loggedinUser = useStore((state) => state.loggedinUser)


## Data Persistence
- Use localStorage for web and Preferences (Capacitor) for mobile.

- Auth Persistence: Tokens should be managed via utilService and synced with the auth.slice.

- For global state persistence, use Zustand's persist middleware only where strictly necessary.


## Utility Functions (src/services/util.service.ts)
Keep utilities pure. Use Capacitor-aware storage helpers for cross-platform compatibility.

``` TypeScript
import { Capacitor } from "@capacitor/core"
import { Preferences } from "@capacitor/preferences"

export const utilService = {
    async saveToStorage(key: string, value: any) {
        const strValue = JSON.stringify(value)
        if (Capacitor.isNativePlatform()) {
            await Preferences.set({ key, value: strValue })
        } else {
            localStorage.setItem(key, strValue)
        }
    },
    async getFromStorage(key: string) {
        let value
        if (Capacitor.isNativePlatform()) {
            const res = await Preferences.get({ key })
            value = res.value
        } else {
            value = localStorage.getItem(key)
        }
        try { return value ? JSON.parse(value) : null } catch { return value }
    }
}

## Type Safety & Integration Rules
- *Typed Selectors:* Always use selectors to prevent unnecessary re-renders.

- *Naming Convention:* Slices should be named create[Feature]Slice.

- *Backend Sync:* Ensure outgoing data is cleaned (e.g., stripping commas from numeric strings) before service calls.