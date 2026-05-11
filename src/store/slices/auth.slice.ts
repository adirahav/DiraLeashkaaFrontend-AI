import { StateCreator } from 'zustand'
import { RootState } from '../store'
import { User } from '../../types'

export interface AuthSlice {
  loggedinUser: User | null
  token: string | null
  setLoggedinUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const createAuthSlice: StateCreator<RootState, [], [], AuthSlice> = (set) => ({
  loggedinUser: null,
  token: null,

  setLoggedinUser: (user) => set({ loggedinUser: user }),

  setToken: (token) => set({ token }),

  logout: () => set({ loggedinUser: null, token: null }),
})
