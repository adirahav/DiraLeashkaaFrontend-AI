import { Capacitor } from '@capacitor/core'
import Axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { utilService } from './util.service'
import { useStore } from '../store/store'

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

    const platform = Capacitor.isNativePlatform() ? "android" : "web"
    const jwtToken = token || useStore.getState().token

    const config: AxiosRequestConfig = {
        url: `${BASE_URL}${endpoint}`,
        method,
        params: method === 'GET' ? { ...data, platform } : null,
        data: method !== 'GET' ? { ...data, platform } : null,
        headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
    }

    try {
        const res: AxiosResponse<T> = await axios(config)
        return res.data
    } catch (err: any) {
        console.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
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
