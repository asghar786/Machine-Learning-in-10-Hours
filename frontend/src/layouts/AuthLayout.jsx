import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore()

  // Redirect already-authenticated users away from auth pages
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div id="top-header">
      <Outlet />
    </div>
  )
}
