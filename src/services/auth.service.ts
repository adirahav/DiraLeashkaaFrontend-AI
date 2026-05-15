import { jwtDecode } from 'jwt-decode'
import { httpService } from './http.service'
import { utilService } from './util.service'
import { User } from '../types'

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
    const raw = await httpService.post<string>(
        '/auth/login',
        { email: email.trim().toLowerCase(), password },
        undefined,
        { responseType: 'text' }
    )
    const token = raw.replace(/^"|"$/g, '')
    const user = jwtDecode<User>(token)
    await utilService.saveToStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL, user.email)
    return { user, token }
}

async function signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
    await httpService.post('/auth/signup', {
        fullname: credentials.fullname,
        email: credentials.email,
        password: credentials.password,
        yearOfBirth: credentials.yearOfBirth,
    })

    const raw = await httpService.post<string>(
        '/auth/login',
        { email: credentials.email, password: credentials.password },
        undefined,
        { responseType: 'text' }
    )
    const token = raw.replace(/^"|"$/g, '')
    const user = jwtDecode<User>(token)
    await utilService.saveToStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL, user.email)
    return { user, token }
}

async function logout(): Promise<void> {
    // Token is cleared from diraleashkaa-store by the Zustand logout action
}

async function getLastLoggedinEmail(): Promise<string | null> {
    return utilService.getFromStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL)
}
