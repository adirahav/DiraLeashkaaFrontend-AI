import { StateCreator } from 'zustand'
import { RootState } from '../store'
import { userService } from '../../services/user.service'
import { utilService } from '../../services/util.service'
import { trackerService } from '../../services/tracker.service'

const TOUR_COMPLETED_KEY = 'tour_completed_time'

export interface UserSlice {
  completeTour: () => void
}

export const createUserSlice: StateCreator<RootState, [], [], UserSlice> = (set, get) => ({
  completeTour: () => {
    const user = get().loggedinUser
    if (!user) return
    const tourTime = new Date().toISOString()
    set({ loggedinUser: { ...user, tourCompletedTime: tourTime } })
    utilService.saveToStorage(TOUR_COMPLETED_KEY, tourTime)
    console.log(`[STORE] Tour completed at: ${tourTime}`)
    userService.completeTour().catch((err) => console.log(`[ERROR] Tour completion sync failed: ${err}`))

    const trackerUUID = get().trackerUUID
    if (trackerUUID) {
      trackerService.patchTracker(trackerUUID, { status: 'complete', endedAt: tourTime })
    }
    get().stopTracker()
  },
})

export { TOUR_COMPLETED_KEY }
