import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore, useUIStore } from '@/store/authStore'
import { authApi } from '@/api/authApi'
import { queryClient } from '@/api/queryClient'

export default function AdminTopbar() {
  const { user, logout } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      queryClient.clear()
      navigate('/')
    },
  })

  return (
    <header className="app-topbar">
      <div className="page-container topbar-menu">
        <div className="d-flex align-items-center gap-2">
          {/* Sidebar toggle */}
          <button className="sidenav-toggle-button px-2" onClick={toggleSidebar}>
            <i className="ti ti-menu-deep fs-24"></i>
          </button>

          <span className="fw-semibold d-none d-md-block">ML in 10 Hours — Admin</span>

          <div className="ms-auto d-flex align-items-center gap-3">
            {/* Public site link */}
            <a href="/" target="_blank" rel="noreferrer" className="text-muted d-none d-md-inline" title="View Public Site">
              <i className="ti ti-external-link fs-18"></i>
            </a>

            {/* User dropdown */}
            <div className="dropdown">
              <button className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: 13 }}>
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="d-none d-md-inline">{user?.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="/dashboard"><i className="ti ti-user me-2"></i>My Profile</a></li>
                <li><a className="dropdown-item" href="/admin/settings"><i className="ti ti-settings me-2"></i>Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={() => logoutMutation.mutate()}>
                    <i className="ti ti-logout me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
