import { StateCreator } from 'zustand'
import { RootState } from '../store'

export type NotificationType = 'success' | 'error' | 'info'

export interface Notification {
  message: string
  type: NotificationType
}

export interface AppSlice {
  isLoading: boolean
  isResultsMode: boolean
  showTour: boolean
  notification: Notification | null
  setIsLoading: (val: boolean) => void
  setIsResultsMode: (val: boolean) => void
  setShowTour: (val: boolean) => void
  setNotification: (notification: Notification | null) => void
  clearNotification: () => void
}

export const createAppSlice: StateCreator<RootState, [], [], AppSlice> = (set) => ({
  isLoading: false,
  isResultsMode: false,
  showTour: false,
  notification: null,

  setIsLoading: (val) => set({ isLoading: val }),

  setIsResultsMode: (val) => set({ isResultsMode: val }),

  setShowTour: (val) => set({ showTour: val }),

  setNotification: (notification) => set({ notification }),

  clearNotification: () => set({ notification: null }),
})
