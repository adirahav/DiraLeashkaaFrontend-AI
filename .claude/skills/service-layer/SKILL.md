---
name: service-layer
description: Use this skill when implementing business logic, managing data persistence, or creating reusable utility functions outside of React components.
---

# Service Layer Guidelines
*Goal:* Centralize the application's core logic and data management to keep components "lean" and focused only on UI.

**Core Responsibilities:**
- *Data Persistence:* Managing how data is saved and retrieved (e.g., Database/Local Storage).

- *Business Logic:* Implementing complex calculations or data transformations.

- *Utility Functions:* Creating reusable helpers (dates, strings, etc.) that aren't tied to a specific UI.

## File Location
- Place services in `src/services/`
- Name files with `.service.ts` suffix (e.g., `property.service.ts`)
- Create corresponding `.test.ts` file for tests

## Service Pattern
Services are pure functions, not classes. Export named functions:

```typescript
// property.service.ts
import { httpService } from "./http.service"

const BASE_URL = 'property/'

export interface Property {
    propertyUUID?: string
    // 👉 add the rest of your fields here
    [key: string]: any
}

export const propertyService = {
    getList,
    getById,
    save,
    delete,
    archive
}

async function getList(): Promise<Property[]> {
    try {
        const properties = await httpService.get<Property[]>(BASE_URL)
        return properties
    } catch (err) {
        console.error(`Had problems getting properties`)
        throw err
    }
}

async function getById(propertyUUID: string): Promise<Property> {
    try {
        const property = await httpService.get<Property>(`${BASE_URL}${propertyUUID}`)
        return property
    } catch (err) {
        console.error(`Had problems getting property ${propertyUUID}`)
        throw err
    }
}

async function save(propertyToSave: Property): Promise<Property> {
    propertyToSave.propertyUUID = propertyToSave.propertyUUID || ''

    const method: 'put' | 'post' = propertyToSave.propertyUUID ? 'put' : 'post'

    const savedProperty = await httpService[method]<Property>(
        BASE_URL,
        propertyToSave
    )

    return savedProperty
}

async function delete(propertyUUID: string): Promise<any> {
    const result = await httpService.delete<any>(`${BASE_URL}`, data)
    return result
}

async function archive(propertyUUID: string): Promise<any> {
    const result = await httpService.patch<any>(`${BASE_URL}${propertyUUID}/archive`, data)
    return result
}
```

## Data Persistence
- Use `localStorage` for client-side persistence in web applications, and use the native `Preferences` API for mobile/native platforms.
- Always handle JSON parse errors gracefully
- Return empty arrays/objects as defaults, never undefined

## Utility Functions
Place in `src/services/util.service.ts`:
- Local Storage helpers: `saveToStorage(key: string), getFromStorage(key: string,value: string), deleteFromStorage(key: string)`
- Keep utilities pure and stateless

```typescript
// util.service.ts
import { Capacitor } from "@capacitor/core"
import { Preferences } from "@capacitor/preferences"

export const utilService = {
    saveToStorage,
    getFromStorage,
    deleteFromStorage
}

export async function getFromStorage(key: string): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
        const { value } = await Preferences.get({ key })
        return value
    } else {
        return (
            localStorage.getItem(key) ??
            sessionStorage.getItem(key)
        )
    }
}

export async function saveToStorage(
    key: string,
    value: string
): Promise<void> {
    if (Capacitor.isNativePlatform()) {
        await Preferences.set({ key, value })
    } else {
        localStorage.setItem(key, value)
    }
}

export async function deleteFromStorage(
    key: string
): Promise<void> {
    if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key })
    } else {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key) // ✅ לא clear()
    }
}
```

## Testing Services
```typescript
// property.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveProperty, loadProperties } from './property.service'

describe('Property Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and load properties', () => {
    const properties = { id: '1', name: 'Test' }
    saveProperty(properties)
    expect(loadProperties()).toContainEqual(properties)
  })
})
```

## Type Safety
- Define types in `src/types/property.types.ts`
- Use strict typing for all function parameters and returns
- Avoid `any` type


## API Endpoints Mapping
Based on the existing backend routes
Connect the frontend services to the existing Express backend using these specific routes:

### Auth Service (/api/auth)
POST /login: Authenticate user (login).

POST /signup: Register new user (signup).

POST /logout: Logout loggedin user (logout).

### averageInterest.routes.js
GET /: Fetch all average interest (getAverageInterests).

### Calculation Service (/api/calculator)
GET /: Fetch all calculators (getCalculators).

GET /maxPrice: Calculate the maximum apartment price the user can afford (getCalcMaxPrice).

PUT /maxPrice: Update the form values and return a new maximum price calculation (updateCalcMaxPrice).

GET /compare: Compare 2–3 apartments (getComparedData).

PUT /compare: Update the form values and return updated comparison results (saveComparedData).

GET /:calculatorUUID: Get calculator details by UUID (getCalculator). 

### Common Service (/api/common)
GET /params: Fetch all params { fixedParameters, transferTaxes, formInputs, averageInterests } (getParams).

### ContactUs Service (/api/contactUs)
POST /: Submit a message to the system administrator (sendMessage).

### FixedParameter Service (/api/fixedParameter)
GET /: Fetch all params { vatPercent, mortgageMaxAge, mortgage30YearsMonthlyRepayment, etc } (getFixedParameters).

### ForgotPassword Service (/api/forgotPassword)
POST /generateCode: Generate a verification code (generateCode).

POST /validateCode: Validate the code entered by the user (validateCode).

PUT /changePassword: Change the user’s password (changePassword).

### FormInput Service (/api/formInput)
GET /: Fetch all form inputs { indexesAndInterests (indexPercent, interestPercent, etc), propertyInputs (possibleMonthlyRepaymentPercent, lawyerPercent) } (getFormInputs).
 
### phrase.routes.js

### Property Service (/api/property)
GET /: Fetch all properties for the logged-in user (getProperties).

POST /: Add a new property (addProperty). Requires full property data.

PUT /: Update existing property (updateProperty).

PATCH /:propertyId/archive: Archive a property instead of deleting.

GET /:propertyUUID: Fetch a specific property by its UUID (getProperty).

### registration.routes.js
### transferTax.routes.js
### user.routes.js


## Implementation Guidelines for the AI
Dynamic Parameters: Always use the :propertyUUID or :propertyId naming convention in service calls to match the backend controllers.

Middleware Awareness: Note that most property routes require requireAuth and requireOwner. Ensure the httpService includes the JWT token in the Authorization header.

Data Formatting:

Incoming: Convert backend snake_case or specific DB structures to the frontend's camelCase if necessary.

Outgoing: Ensure numeric strings with commas are cleaned (converted to pure numbers) before being sent to the calculator or property endpoints.




