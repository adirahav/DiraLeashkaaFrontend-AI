import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../store/store'

interface PermissionRouteProps {
  permissions: string[]
}

export const PermissionRoute = ({ permissions }: PermissionRouteProps) => {
  const loggedinUser = useStore((state) => state.loggedinUser)
  const token = useStore((state) => state.token)

  if (!loggedinUser || !token) {
    return <Navigate to="/login" replace />
  }

  const hasAll = permissions.every((p) => loggedinUser.permissions?.includes(p))
  if (!hasAll) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
