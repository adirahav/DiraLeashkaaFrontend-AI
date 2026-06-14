import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createAuthSlice, AuthSlice } from './slices/auth.slice'
import { createAppSlice, AppSlice } from './slices/app.slice'
import { createPropertySlice, PropertySlice } from './slices/property.slice'
import { createUserSlice, UserSlice } from './slices/user.slice'
import { createHomeSlice, HomeSlice } from './slices/home.slice'
import { createTrackerSlice, TrackerSlice } from './slices/tracker.slice'

export type RootState = AuthSlice & AppSlice & PropertySlice & UserSlice & HomeSlice & TrackerSlice

export const useStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createAppSlice(...a),
      ...createPropertySlice(...a),
      ...createUserSlice(...a),
      ...createHomeSlice(...a),
      ...createTrackerSlice(...a),
    }),
    {
      name: 'diraleashkaa-store',
      partialize: (state) => ({
        loggedinUser: state.loggedinUser,
        token: state.token,
        lang: state.lang,
      }),
    }
  )
)
