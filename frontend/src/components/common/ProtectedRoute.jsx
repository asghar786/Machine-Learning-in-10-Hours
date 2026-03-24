import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function ProtectedRoute({ children, adminOnly = false, instructorOnly = false }) {
  const { isAuthenticated, user, locked } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    const loginPath = adminOnly ? '/admin/login' : '/login'
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (adminOnly && locked) {
    return <Navigate to="/admin/lock" replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  if (instructorOnly && user?.role !== 'instructor') {
    return <Navigate to="/" replace />
  }

  return children
}
