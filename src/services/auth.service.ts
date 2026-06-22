import { jwtDecode } from 'jwt-decode'
import { httpService } from './http.service'
import { utilService } from './util.service'
import { User } from '../types'

const USER_MANAGEMENT_API_URL: string = import.meta.env.VITE_USER_MANAGEMENT_API_URL
const STORAGE_KEY_LAST_LOGGEDIN_EMAIL = 'last_email'

export interface SignupCredentials {
    fullname: string
    email: string
    password: string
    yearOfBirth: string
}

export const authService = {
    login,
    logout,
    signup,
    getLastLoggedinEmail,
}

async function login(email: string, password: string): Promise<{ user: User; token: string }> {
    console.log(`[LOGIN] Call API POST '/auth/login' — email: ${email.trim().toLowerCase()}`)
    const raw = await httpService.post<string>(
        `${USER_MANAGEMENT_API_URL}/auth/login`,
        { email: email.trim().toLowerCase(), password },
        undefined,
        { responseType: 'text' }
    )
    const token = raw.replace(/^"|"$/g, '')
    const user = jwtDecode<User>(token)
    await utilService.saveToStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL, user.email)
    console.log(`[LOGIN] API POST '/auth/login' response: user=${user.email}`)
    return { user, token }
}

async function signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
    console.log(`[SIGNUP] Call API POST '/auth/signup' — email: ${credentials.email}`)
    await httpService.post(`${USER_MANAGEMENT_API_URL}/auth/signup`, {
        fullname: credentials.fullname,
        email: credentials.email,
        password: credentials.password,
        yearOfBirth: credentials.yearOfBirth,
    })
    console.log(`[SIGNUP] API POST '/auth/signup' response: account created`)

    console.log(`[SIGNUP] Call API POST '/auth/login' (auto-login)`)
    const raw = await httpService.post<string>(
        `${USER_MANAGEMENT_API_URL}/auth/login`,
        { email: credentials.email, password: credentials.password },
        undefined,
        { responseType: 'text' }
    )
    const token = raw.replace(/^"|"$/g, '')
    const user = jwtDecode<User>(token)
    await utilService.saveToStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL, user.email)
    console.log(`[SIGNUP] API POST '/auth/login' response: user=${user.email}`)
    return { user, token }
}

async function logout(): Promise<void> {
    // Token is cleared from diraleashkaa-store by the Zustand logout action
}

async function getLastLoggedinEmail(): Promise<string | null> {
    return utilService.getFromStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL)
}
