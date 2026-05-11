import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

export const utilService = {
  saveToStorage,
  getFromStorage,
  deleteFromStorage,
  saveWithExpiry,
  getWithExpiry,
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
