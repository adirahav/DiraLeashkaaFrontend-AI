# PLAN: Create HTTP Service

## Instructions
Create a new file at `src/services/http.service.ts`.
Use the exact code provided below. Do not modify the logic, the environment-based BASE_URL constants, or the platform detection. Ensure that the imports are resolved correctly according to the project structure.

*File Content:*

```TypeScript
import { Capacitor } from '@capacitor/core'
import Axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { userService } from './user.service'
import { utilService } from './util.service'

const BASE_URL: string = import.meta.env.VITE_API_URL

const axios = Axios.create({
    withCredentials: true
})

type ApiData = Record<string, any> | null;

export const httpService = {
    get<T = any>(endpoint: string, data?: ApiData, token?: string): Promise<T> {
        return ajax<T>(endpoint, 'GET', data, token)
    },
    post<T = any>(endpoint: string, data?: ApiData, token?: string): Promise<T> {
        return ajax<T>(endpoint, 'POST', data, token)
    },
    put<T = any>(endpoint: string, data?: ApiData, token?: string): Promise<T> {
        return ajax<T>(endpoint, 'PUT', data, token)
    },
    patch<T = any>(endpoint: string, data?: ApiData, token?: string): Promise<T> {
        return ajax<T>(endpoint, 'PATCH', data, token)
    },
    delete<T = any>(endpoint: string, data?: ApiData, token?: string): Promise<T> {
        return ajax<T>(endpoint, 'DELETE', data, token)
    }
}

async function ajax<T>(
    endpoint: string, 
    method: Method = 'GET', 
    data: ApiData = null, 
    token: string | null = null
): Promise<T> {
    
    const requestData = {
        ...data,
        platform: Capacitor.isNativePlatform() ? "android" : "web",
    }

    const jwtToken = token || await userService.getLocalUser()
    
    const config: AxiosRequestConfig = {
        url: `${BASE_URL}${endpoint}`,
        method,
        data: requestData,
        params: (method === 'GET') ? requestData : null,
        headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
    }

    try {
        const res: AxiosResponse<T> = await axios(config)
        return res.data
    } catch (err: any) {
        console.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, requestData)
        console.dir(err)
        
        if (err.response && err.response.status === 401) {
            await utilService.deleteFromStorage("token")
            const email = await utilService.getFromStorage("email")
            if (typeof window !== 'undefined') {
                window.location.assign(email ? '/login' : '/landing')
            }
        }
        throw err
    }
}
```


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:

## [2026-05-11] AI Pre-Flight Questions

*AI says:*

After exploring the project, I found 3 blockers that need answers before I can write any code.

---

**Q1 — `user.service.ts` does not exist**

The plan imports `userService` from `./user.service` and calls `userService.getLocalUser()`, which is expected to return a JWT token. However, `src/services/user.service.ts` does not exist in the project yet.

Options:
- **A)** Create a minimal `user.service.ts` stub alongside this file (e.g., `getLocalUser()` reads `"token"` from `utilService.getFromStorage("token")`).
- **B)** The `user.service.ts` will be created in a separate plan step — I should leave the import as-is and the file will compile once that step runs.
- **C)** Replace `userService.getLocalUser()` with a direct `utilService.getFromStorage("token")` call to avoid the dependency.

> Which option should I follow? If A, what should `getLocalUser()` return — the raw token string from storage?

> *Your answer:*
(A) Instead of relying on a missing user.service.ts, we should pull the token directly from our Zustand authStore.

Please refactor the provided code to:

1. Remove the import of userService.

2. Replace const jwtToken = token || await userService.getLocalUser() with a call to our Zustand store:
const jwtToken = token || useAuthStore.getState().token;

3. If the authStore is not yet fully initialized, you can create a minimal user.service.ts stub that reads from utilService, but the preferred way is to use the Zustand state we've already planned.

Regarding getLocalUser(): Yes, it should return the raw JWT token string.

---

**Q2 — Environment variable mismatch between environments**

`.env.development` defines `VITE_API_URL=http://localhost:3032/api`, but `.env.production` does **not** have `VITE_API_URL` — it uses `VITE_BASE_URL=https://diraleashkaa.onrender.com/api/` instead.

The plan code uses `import.meta.env.VITE_API_URL`, which will be `undefined` in production builds.

Options:
- **A)** Add `VITE_API_URL` to `.env.production` pointing to the production URL (and keep the plan code as-is).
- **B)** Rename the variable consistently to `VITE_BASE_URL` in both env files and update the plan code to use `VITE_BASE_URL`.
- **C)** Use a fallback: `import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL`.

> Which option is correct? (The plan says "Do not modify the environment-based BASE_URL constants" — clarifying whether a fix to the env files counts as modifying the constant.)

> *Your answer:*
(A) Add `VITE_API_URL` to `.env.production` pointing to the production URL (and keep the plan code as-is).

---

**Q3 — `src/services/http.service.ts` already exists**

The plan says to "create a new file" at `src/services/http.service.ts`, but that file already exists in the project.

Options:
- **A)** Overwrite it entirely with the code in this plan.
- **B)** Compare the existing file with the plan code and merge only the differences.
- **C)** The existing file is already correct — confirm before touching it.

> Should I overwrite, merge, or skip?

> *Your answer:*
(A) Overwrite it entirely with the code in this plan.

---

**Q4 — `platform` field injected on every GET request**

The `requestData` object (which includes `platform: "android" | "web"`) is passed as query params on GET requests (`params: (method === 'GET') ? requestData : null`). This means every GET request to the backend will include `?platform=web` (or `android`).

> Is the backend expecting this `platform` query param on all GET endpoints, or should `platform` be excluded from GET params and only sent in the request body for POST/PUT/PATCH?

> *Your answer:*
Yes, the backend expects the platform field for all requests. 
However, to clean up the redundancy in the ajax function, please refactor the logic as follows:

1. Define the platform constant once: >    const platform = Capacitor.isNativePlatform() ? "android" : "web";

2. For GET requests: The platform must be added to params.

3. For POST/PUT/PATCH/DELETE requests: The platform should be merged into the data (the request body).

Updated logic suggestion for the ajax function:
```TypeScript
const platform = Capacitor.isNativePlatform() ? "android" : "web";

const config: AxiosRequestConfig = {
    url: `${BASE_URL}${endpoint}`,
    method,
    params: method === 'GET' ? { ...data, platform } : null,
    data: method !== 'GET' ? { ...data, platform } : null,
    headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
};
---

*Awaiting your answers before proceeding.*

---

## [2026-05-11] Implementation — Decisions & Outcome

**Decisions recorded:**
- Q1: Token sourced from `useStore.getState().token` (actual store name is `useStore` from `../store/store`, not `useAuthStore`). `userService` import removed entirely.
- Q2: Added `VITE_API_URL=https://diraleashkaa.onrender.com/api/` to `.env.production`.
- Q3: `src/services/http.service.ts` overwritten entirely.
- Q4: `platform` defined once as a const; injected into `params` for GET, into `data` body for all other methods.

**Files changed:**
- `src/services/http.service.ts` — overwritten with plan code + all refactors applied
- `.env.production` — added `VITE_API_URL` pointing to production URL

**Status: DONE**
