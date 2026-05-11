import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createAuthSlice, AuthSlice } from './slices/auth.slice'
import { createAppSlice, AppSlice } from './slices/app.slice'

export type RootState = AuthSlice & AppSlice

export const useStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createAppSlice(...a),
    }),
    {
      name: 'diraleashkaa-store',
      partialize: (state) => ({
        loggedinUser: state.loggedinUser,
        token: state.token,
      }),
    }
  )
)
