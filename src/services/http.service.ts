import { Capacitor } from '@capacitor/core'
import Axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { utilService } from './util.service'
import { pendingActionService } from './pending-action.service'
import { useStore } from '../store/store'

const BASE_URL: string = import.meta.env.VITE_API_URL

const axios = Axios.create({
    withCredentials: true
})

type ApiData = Record<string, any> | null;

export const httpService = {
    get<T = any>(endpoint: string, data?: ApiData, token?: string, options?: Partial<AxiosRequestConfig>): Promise<T> {
        return ajax<T>(endpoint, 'GET', data, token, options)
    },
    post<T = any>(endpoint: string, data?: ApiData, token?: string, options?: Partial<AxiosRequestConfig>): Promise<T> {
        return ajax<T>(endpoint, 'POST', data, token, options)
    },
    put<T = any>(endpoint: string, data?: ApiData, token?: string, options?: Partial<AxiosRequestConfig>): Promise<T> {
        return ajax<T>(endpoint, 'PUT', data, token, options)
    },
    patch<T = any>(endpoint: string, data?: ApiData, token?: string, options?: Partial<AxiosRequestConfig>): Promise<T> {
        return ajax<T>(endpoint, 'PATCH', data, token, options)
    },
    delete<T = any>(endpoint: string, data?: ApiData, token?: string, options?: Partial<AxiosRequestConfig>): Promise<T> {
        return ajax<T>(endpoint, 'DELETE', data, token, options)
    }
}

async function ajax<T>(
    endpoint: string,
    method: Method = 'GET',
    data: ApiData = null,
    token: string | null = null,
    options: Partial<AxiosRequestConfig> = {}
): Promise<T> {

    const platform = Capacitor.isNativePlatform() ? "android" : "web"
    const jwtToken = token || useStore.getState().token
    console.log(`[API] Call API ${method} '${endpoint}'`)

    const config: AxiosRequestConfig = {
        url: `${endpoint}`,
        method,
        params: method === 'GET' ? { ...data, platform } : null,
        data: method !== 'GET' ? { ...data, platform } : null,
        headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
        ...options,
    }

    try {
        const res: AxiosResponse<T> = await axios(config)
        return res.data
    } catch (err: any) {
        console.log(`[ERROR] ${method} '${endpoint}' failed — status: ${err.response?.status ?? 'network'}`)

        if (err.response && err.response.status === 401) {
            if (typeof window !== 'undefined') {
                const returnPath = window.location.pathname + window.location.search
                await pendingActionService.save({
                    returnPath,
                    ...(method !== 'GET' && data ? { apiCall: { method: method as string, endpoint, data } } : {}),
                })
            }
            console.log(`[API] 401 — clearing auth, redirecting to /login`)
            useStore.setState({ loggedinUser: null, token: null })
            await utilService.deleteFromStorage('token')
            if (typeof window !== 'undefined') {
                window.location.assign('/login')
            }
        }
        throw err
    }
}
