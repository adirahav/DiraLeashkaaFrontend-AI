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
    
*AI says:*
