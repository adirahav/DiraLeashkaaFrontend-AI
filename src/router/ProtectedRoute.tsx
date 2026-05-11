import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../store/store'

export const ProtectedRoute = () => {
  const loggedinUser = useStore((state) => state.loggedinUser)

  if (!loggedinUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
