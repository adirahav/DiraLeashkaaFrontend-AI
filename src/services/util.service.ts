import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

export const utilService = {
  saveToStorage,
  getFromStorage,
  deleteFromStorage,
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
