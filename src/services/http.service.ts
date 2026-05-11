import axios from 'axios'
import { useStore } from '../store/store'

const BASE_URL = import.meta.env.VITE_API_URL as string

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export const httpService = {
  get,
  post,
  put,
  patch,
  delete: _delete,
}

async function get<T>(endpoint: string): Promise<T> {
  const { data } = await api.get<T>(endpoint)
  return data
}

async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const { data } = await api.post<T>(endpoint, body)
  return data
}

async function put<T>(endpoint: string, body: unknown): Promise<T> {
  const { data } = await api.put<T>(endpoint, body)
  return data
}

async function patch<T>(endpoint: string, body: unknown): Promise<T> {
  const { data } = await api.patch<T>(endpoint, body)
  return data
}

async function _delete<T>(endpoint: string): Promise<T> {
  const { data } = await api.delete<T>(endpoint)
  return data
}
