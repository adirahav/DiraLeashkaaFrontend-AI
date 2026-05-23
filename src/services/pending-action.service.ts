import { utilService } from './util.service'
import { PendingAction } from '../types'

const STORAGE_KEY = 'pending_action'

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password']

export const pendingActionService = {
    async save(action: PendingAction): Promise<void> {
        if (PUBLIC_ROUTES.some(r => action.returnPath.startsWith(r))) return
        await utilService.saveToStorage(STORAGE_KEY, JSON.stringify(action))
    },

    async get(): Promise<PendingAction | null> {
        const raw = await utilService.getFromStorage(STORAGE_KEY)
        if (!raw) return null
        try { return JSON.parse(raw) as PendingAction } catch { return null }
    },

    async clear(): Promise<void> {
        await utilService.deleteFromStorage(STORAGE_KEY)
    },
}
