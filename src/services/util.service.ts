import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

export const utilService = {
  saveToStorage,
  getFromStorage,
  deleteFromStorage,
  saveWithExpiry,
  getWithExpiry,
  percentFormat,
  priceFormat,
  getAppEnv,
}

export function getAppEnv(): string {
  return (import.meta.env.VITE_APP_ENV as string | undefined) ?? import.meta.env.MODE ?? 'development'
}

export function percentFormat(value: number | null | undefined, decimals = 1): string {
  if (value == null) return '-'
  return `${value.toFixed(decimals)}%`
}

export function priceFormat(value: number | null | undefined): string {
  if (value == null) return '-'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ₪`
  if (value >= 1_000) return `${Math.floor(value / 1_000)}k ₪`
  return `${value.toLocaleString('he-IL')} ₪`
}


interface StoredWithExpiry<T> {
  data: T
  expiry: number
}

export async function saveToStorage(key: string, value: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key, value })
  } else {
    localStorage.setItem(key, value)
  }
}

export async function getFromStorage(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key })
    return value
  } else {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key)
  }
}

export async function deleteFromStorage(key: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Preferences.remove({ key })
  } else {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  }
}

export async function saveWithExpiry<T>(key: string, data: T, ttl: number): Promise<void> {
  const payload: StoredWithExpiry<T> = {
    data,
    expiry: Date.now() + ttl,
  }
  await saveToStorage(key, JSON.stringify(payload))
}

export async function getWithExpiry<T>(key: string): Promise<{ data: T; isExpired: boolean } | null> {
  const raw = await getFromStorage(key)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredWithExpiry<T>
    return {
      data: parsed.data,
      isExpired: Date.now() > parsed.expiry,
    }
  } catch {
    return null
  }
}
