import { jwtDecode } from 'jwt-decode'
import { httpService } from './http.service'
import { utilService } from './util.service'
import { User } from '../types'

const STORAGE_KEY_TOKEN = 'token'
const STORAGE_KEY_LAST_LOGGEDIN_EMAIL = 'last_email'

export const authService = {
    login,
    logout,
    getLastLoggedinEmail,
}

async function login(email: string, password: string): Promise<User> {
    const token = await httpService.post<string>(
        '/auth/login',
        { email: email.trim().toLowerCase(), password },
        undefined,
        { responseType: 'text' }
    )

    await utilService.saveToStorage(STORAGE_KEY_TOKEN, token)

    const user = jwtDecode<User>(token)

    await utilService.saveToStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL, user.email)

    return user
}

async function logout(): Promise<void> {
    await utilService.deleteFromStorage(STORAGE_KEY_TOKEN)
}

async function getLastLoggedinEmail(): Promise<string | null> {
    return utilService.getFromStorage(STORAGE_KEY_LAST_LOGGEDIN_EMAIL)
}
