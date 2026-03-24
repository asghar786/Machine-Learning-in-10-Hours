import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore, useUIStore } from '@/store/authStore'
import { authApi } from '@/api/authApi'
import { queryClient } from '@/api/queryClient'

export default function InstructorTopbar() {
  const { user, logout } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    logout()
    queryClient.clear()
    navigate('/login', { replace: true })
    try { await authApi.logout() } catch (_) {}
  }

  const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="app-topbar">
      <div className="page-container topbar-menu">
        <div className="d-flex align-items-center gap-2 w-100">

          <button className="sidenav-toggle-button px-2" onClick={toggleSidebar} type="button">
            <i className="ti ti-menu-deep fs-24"></i>
          </button>

          <div className="ms-auto d-flex align-items-center gap-1">

            {/* Public site link */}
            <div className="topbar-item">
              <a className="topbar-link px-2" href="/" target="_blank" rel="noreferrer" title="View Public Site">
                <i className="ti ti-external-link fs-22"></i>
              </a>
            </div>

            {/* Fullscreen */}
            <div className="topbar-item d-none d-md-flex">
              <button
                className="topbar-link btn btn-link px-2"
                onClick={() => {
                  if (!document.fullscreenElement) document.documentElement.requestFullscreen()
                  else document.exitFullscreen()
                }}
                title="Fullscreen"
                type="button"
              >
                <i className="ti ti-maximize fs-22"></i>
              </button>
            </div>

            {/* User dropdown */}
            <div className="topbar-item nav-user" ref={userMenuRef}>
              <div className={`dropdown${userMenuOpen ? ' show' : ''}`}>
                <button
                  className="topbar-link drop-arrow-none px-2 btn btn-link d-flex align-items-center gap-2"
                  onClick={() => setUserMenuOpen(o => !o)}
                  aria-expanded={userMenuOpen}
                  type="button"
                >
                  <span
                    className="avatar-title rounded-circle bg-success text-white fs-13 d-flex align-items-center justify-content-center"
                    style={{ width: 32, height: 32, flexShrink: 0 }}
                  >
                    {initials(user?.name)}
                  </span>
                  <span className="d-lg-flex flex-column gap-1 d-none text-start">
                    <span className="fw-semibold fs-14 lh-1">{user?.name}</span>
                    <span className="fw-normal fs-12 text-muted lh-1">Instructor</span>
                  </span>
                  <i className="ti ti-chevron-down d-none d-lg-block align-middle ms-1"></i>
                </button>
                <div className={`dropdown-menu dropdown-menu-end${userMenuOpen ? ' show' : ''}`} style={{ minWidth: 200 }}>
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </div>
                  <Link className="dropdown-item" to="/profile" onClick={() => setUserMenuOpen(false)}>
                    <i className="ti ti-user me-1 fs-17 align-middle"></i>
                    <span className="align-middle">My Profile</span>
                  </Link>
                  <Link className="dropdown-item" to="/account" onClick={() => setUserMenuOpen(false)}>
                    <i className="ti ti-settings me-1 fs-17 align-middle"></i>
                    <span className="align-middle">Account Settings</span>
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item fw-semibold text-danger"
                    onClick={() => { setUserMenuOpen(false); handleLogout() }}
                    type="button"
                  >
                    <i className="ti ti-logout me-1 fs-17 align-middle"></i>
                    <span className="align-middle">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}
