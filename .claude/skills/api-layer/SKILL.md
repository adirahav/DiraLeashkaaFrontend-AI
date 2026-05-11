---
name: api-layer
description: Use this skill when connecting frontend components to backend services, replacing mock data, or handling JWT authentication.
---

# API Guidelines
*Goal:* Transform static/mock interfaces into functional, data-driven components whenever a feature requires real-world data or secure authentication.

**Core Responsibilities:**
- *Mock Replacement:* Replacing dummy data with real asynchronous API calls.

- *Authentication:* Implementing secure flows using JWT handling.

- *Standardization:* Establishing an HTTP layer based strictly on the OpenAPI specification.

## API Integration Standard

**Protocol:** All frontend services must strictly follow the openapi.yaml specification located in the backend directory.

**Service Layer:** Use Axios for all HTTP requests. Create a dedicated service file for each API module (e.g., auth.service.js).

**Data Handling:** Replace all "Dummy/Mock" data with real async fetch calls. Ensure proper error handling for 4xx and 5xx status codes based on the OpenAPI error schemas.

**Typing:** Always create TypeScript interfaces in `src/models/` that match the schemas defined in the OpenAPI spec (e.g., `LoginCredentials`, `UserData`).

**JWT Handling:**
    - Use the jwt-decode library for parsing tokens.

    - Usage: import { jwtDecode } from 'jwt-decode'.

    - Always cast the decoded token to the relevant model, e.g., jwtDecode<UserData>(token).

**Constraints & Guardrails**
Do not use the native fetch API. Always use the provided httpService.

## Dependencies
Before implementing, ensure the following packages are installed:
- `axios` (for HTTP requests)
- `jwt-decode` (for parsing JWT tokens)

If missing, run:
`npm install axios jwt-decode`


## Implementation: http.service.ts
1. All API calls must use this centralized service to ensure consistent base URLs and error handling. It automatically attaches the JWT token from `sessionStorage` to every outgoing request.

```typescript
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

// Create an instance for centralized configuration
const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

// Authentication Headers Interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('jwt')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const httpService = {
    async get<T>(endpoint: string): Promise<T> {
        const response = await axiosInstance.get(endpoint)
        return response.data
    },
    async post<T>(endpoint: string, data: any): Promise<T> {
        const response = await axiosInstance.post(endpoint, data)
        return response.data
    },
    async put<T>(endpoint: string, data: any): Promise<T> {
        const response = await axiosInstance.put(endpoint, data)
        return response.data
    },
    async delete<T>(endpoint: string): Promise<T> {
        const response = await axiosInstance.delete(endpoint)
        return response.data
    },
    async patch<T>(endpoint: string, data: any): Promise<T> {
        const response = await axiosInstance.patch(endpoint, data)
        return response.data
    }
}
```

2. *Authentication Headers:*
    - Every request should automatically include the Authorization header if a token exists in sessionStorage.

    - Add an interceptor to httpService.ts to attach Authorization: Bearer <token>.