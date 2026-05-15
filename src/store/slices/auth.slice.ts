import { StateCreator } from 'zustand'
import { RootState } from '../store'
import { User } from '../../types'
import { authService } from '../../services/auth.service'

export interface AuthSlice {
  loggedinUser: User | null
  token: string | null
  setLoggedinUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

export const createAuthSlice: StateCreator<RootState, [], [], AuthSlice> = (set) => ({
  loggedinUser: null,
  token: null,

  setLoggedinUser: (user) => set({ loggedinUser: user }),

  setToken: (token) => set({ token }),

  login: async (email, password) => {
    const { user, token } = await authService.login(email, password)
    set({ loggedinUser: user, token })
    return user
  },

  logout: async () => {
    await authService.logout()
    set({ loggedinUser: null, token: null })
  },
})
