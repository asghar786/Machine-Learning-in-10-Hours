import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore, useUIStore } from '@/store/authStore'
import { authApi } from '@/api/authApi'
import { queryClient } from '@/api/queryClient'

export default function AdminTopbar() {
  const { user, logout, lock } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Close on outside click
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
    logout()                    // clear Zustand store immediately
    queryClient.clear()         // wipe cached queries
    navigate('/admin/login', { replace: true })
    try { await authApi.logout() } catch (_) {} // best-effort server-side token revoke
  }

  const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <header className="app-topbar">
        <div className="page-container topbar-menu">
          <div className="d-flex align-items-center gap-2 w-100">

            {/* Sidebar toggle */}
            <button className="sidenav-toggle-button px-2" onClick={toggleSidebar} type="button">
              <i className="ti ti-menu-deep fs-24"></i>
            </button>

            {/* Search trigger */}
            <div
              className="topbar-search text-muted d-none d-xl-flex gap-2 align-items-center"
              data-bs-target="#searchModal"
              data-bs-toggle="modal"
              role="button"
            >
              <i className="ti ti-search fs-18"></i>
              <span className="me-2">Search something..</span>
              <span className="ms-auto fw-medium">⌘K</span>
            </div>

            <div className="ms-auto d-flex align-items-center gap-1">

              {/* Public site link */}
              <div className="topbar-item">
                <a
                  className="topbar-link px-2"
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  title="View Public Site"
                >
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

              {/* Notifications */}
              <div className="topbar-item">
                <div className="dropdown">
                  <button
                    className="topbar-link btn btn-link px-2 dropdown-toggle drop-arrow-none"
                    data-bs-toggle="dropdown"
                    data-bs-offset="0,19"
                    aria-expanded="false"
                    type="button"
                  >
                    <i className="ti ti-bell animate-ring fs-22"></i>
                    <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                      3
                    </span>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end dropdown-menu-lg py-0">
                    <div className="p-3 border-bottom">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="mb-0">Notifications</h5>
                        <span className="badge bg-danger rounded-pill">3 New</span>
                      </div>
                    </div>
                    <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                      {[
                        { icon: 'ti ti-file-upload text-primary', text: 'New submission from Layla Hassan', time: '4d ago' },
                        { icon: 'ti ti-user-plus text-success',   text: 'Omar Farouq just registered',      time: '1d ago' },
                        { icon: 'ti ti-file-upload text-warning', text: 'Nadia Patel submitted Session 1',  time: '2d ago' },
                      ].map((n, i) => (
                        <div key={i} className="dropdown-item notification-item py-2">
                          <div className="d-flex align-items-start gap-2">
                            <div className="flex-shrink-0 avatar-sm">
                              <span className="avatar-title bg-primary-subtle rounded-circle fs-18">
                                <i className={n.icon}></i>
                              </span>
                            </div>
                            <div className="flex-grow-1">
                              <p className="mb-0 fs-13">{n.text}</p>
                              <small className="text-muted"><i className="ti ti-clock me-1"></i>{n.time}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-top text-center">
                      <Link className="btn btn-sm btn-link fw-semibold" to="/admin/submissions">
                        View All <i className="ti ti-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="topbar-item d-none d-md-flex">
                <Link className="topbar-link px-2" to="/admin/settings" title="Settings">
                  <i className="ti ti-settings fs-22"></i>
                </Link>
              </div>

              {/* User dropdown — React-controlled (Bootstrap JS not yet loaded) */}
              <div className="topbar-item nav-user" ref={userMenuRef}>
                <div className={`dropdown${userMenuOpen ? ' show' : ''}`}>
                  <button
                    className="topbar-link drop-arrow-none px-2 btn btn-link d-flex align-items-center gap-2"
                    onClick={() => setUserMenuOpen(o => !o)}
                    aria-expanded={userMenuOpen}
                    type="button"
                  >
                    <span
                      className="avatar-title rounded-circle bg-primary text-white fs-13 d-flex align-items-center justify-content-center"
                      style={{ width: 32, height: 32, flexShrink: 0 }}
                    >
                      {initials(user?.name)}
                    </span>
                    <span className="d-lg-flex flex-column gap-1 d-none text-start">
                      <span className="fw-semibold fs-14 lh-1">{user?.name}</span>
                      <span className="fw-normal fs-12 text-muted lh-1">Administrator</span>
                    </span>
                    <i className="ti ti-chevron-down d-none d-lg-block align-middle ms-1"></i>
                  </button>
                  <div className={`dropdown-menu dropdown-menu-end${userMenuOpen ? ' show' : ''}`}
                       style={{ minWidth: 200 }}>
                    <div className="dropdown-header noti-title">
                      <h6 className="text-overflow m-0">Welcome !</h6>
                    </div>
                    <Link className="dropdown-item" to="/dashboard" onClick={() => setUserMenuOpen(false)}>
                      <i className="ti ti-user-hexagon me-1 fs-17 align-middle"></i>
                      <span className="align-middle">My Account</span>
                    </Link>
                    <Link className="dropdown-item" to="/admin/settings" onClick={() => setUserMenuOpen(false)}>
                      <i className="ti ti-settings me-1 fs-17 align-middle"></i>
                      <span className="align-middle">Settings</span>
                    </Link>
                    <a className="dropdown-item" href="/" target="_blank" rel="noreferrer" onClick={() => setUserMenuOpen(false)}>
                      <i className="ti ti-lifebuoy me-1 fs-17 align-middle"></i>
                      <span className="align-middle">View Site</span>
                    </a>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => { setUserMenuOpen(false); lock(); navigate('/admin/lock') }}
                    >
                      <i className="ti ti-lock-square-rounded me-1 fs-17 align-middle"></i>
                      <span className="align-middle">Lock Screen</span>
                    </button>
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

      {/* Search Modal */}
      <div
        aria-hidden="true"
        aria-labelledby="searchModalLabel"
        className="modal fade"
        id="searchModal"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-transparent">
            <div className="card mb-1">
              <div className="px-3 py-2 d-flex flex-row align-items-center" id="top-search">
                <i className="ti ti-search fs-22"></i>
                <input
                  className="form-control border-0 shadow-none"
                  placeholder="Search pages, users, courses..."
                  type="search"
                />
                <button className="btn p-0 text-muted" data-bs-dismiss="modal" type="button">
                  [esc]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
