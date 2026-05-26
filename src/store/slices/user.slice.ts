import { StateCreator } from 'zustand'
import { RootState } from '../store'

export interface UserSlice {
  completeTour: () => void
}

export const createUserSlice: StateCreator<RootState, [], [], UserSlice> = (set, get) => ({
  completeTour: () => {
    const user = get().loggedinUser
    if (!user) return
    set({ loggedinUser: { ...user, tourCompletedTime: new Date().toISOString() } })
  },
})
