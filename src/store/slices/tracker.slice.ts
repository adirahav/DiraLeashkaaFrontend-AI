import { StateCreator } from 'zustand'
import { RootState } from '../store'

export interface TrackerSlice {
  trackerUUID: string | null
  isTracking: boolean
  startTracker: (uuid: string) => void
  stopTracker: () => void
}

export const createTrackerSlice: StateCreator<RootState, [], [], TrackerSlice> = (set) => ({
  trackerUUID: null,
  isTracking: false,

  startTracker: (uuid) => set({ trackerUUID: uuid, isTracking: true }),

  stopTracker: () => set({ trackerUUID: null, isTracking: false }),
})
