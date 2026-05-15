import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../store/store'
import { getNextOnboardingStep } from '../utils/user.utils'

const ONBOARDING_PATHS = new Set(['/personal-info', '/financial-details', '/consent'])

export const ProtectedRoute = () => {
  const loggedinUser = useStore((state) => state.loggedinUser)
  const token = useStore((state) => state.token)
  const { pathname } = useLocation()

  if (!loggedinUser || !token) {
    return <Navigate to="/login" replace />
  }

  if (!ONBOARDING_PATHS.has(pathname)) {
    const next = getNextOnboardingStep(loggedinUser)
    if (next !== '/home') {
      return <Navigate to={next} replace />
    }
  }

  return <Outlet />
}
