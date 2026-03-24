import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { queryClient } from '@/api/queryClient'

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin, isInstructor } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992)

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 992
      setIsMobile(mobile)
      if (!mobile) setMenuOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      queryClient.clear()
      navigate('/')
    },
  })

  const isActive = (path) => location.pathname === path ? 'current' : ''

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <>
    {menuOpen && (
      <div
        onClick={() => setMenuOpen(false)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
      />
    )}
    <header className="header-style-1">
      {/* Top Bar */}
      <div className="header-topbar topbar-style-2">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-8 col-lg-6 col-md-12">
              <div className="header-contact text-center text-lg-start d-none d-sm-block">
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <span className="text-color me-2"><i className="fa fa-envelope"></i></span>
                    <a href="mailto:info@ml10hours.com">info@ml10hours.com</a>
                  </li>
                  <li className="list-inline-item">
                    <span className="text-color me-2"><i className="fa fa-graduation-cap"></i></span>
                    <span>10 Hours · 5 Sessions · Certification</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-12">
              <div className="d-sm-flex justify-content-center justify-content-lg-end">
                <div className="header-socials text-center text-lg-end">
                  <ul className="list-inline">
                    <li className="list-inline-item"><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    <li className="list-inline-item"><a href="#"><i className="fab fa-twitter"></i></a></li>
                    <li className="list-inline-item"><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                    <li className="list-inline-item"><a href="#"><i className="fab fa-youtube"></i></a></li>
                  </ul>
                </div>
                <div className="header-btn text-center text-lg-end">
                  {isAuthenticated ? (
                    <span><i className="fa fa-user-alt"></i> {user?.name}</span>
                  ) : (
                    <Link to="/login"><i className="fa fa-user-alt"></i> Login/Register</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`header-navbar navbar-sticky${isMobile ? ' mobile-menu' : ''}`}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="site-logo">
              <Link to="/">
                <img src="/assets/images/logo.png" alt="ML in 10 Hours" className="img-fluid" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <div className="offcanvas-icon d-block d-lg-none">
              <a
                href="#"
                className="nav-toggler"
                onClick={(e) => { e.preventDefault(); setMenuOpen(true) }}
              >
                <i className="fal fa-bars"></i>
              </a>
            </div>

            {/* Category Menu */}
            <div className="header-category-menu d-none d-xl-block">
              <ul>
                <li className="has-submenu">
                  <a href="#"><i className="fa fa-th me-2"></i>Courses</a>
                  <ul className="submenu">
                    <li><Link to="/courses?category=machine-learning">Machine Learning</Link></li>
                    <li><Link to="/courses?category=ms-office">MS Office</Link></li>
                    <li><Link to="/courses?category=dbms">Database Management</Link></li>
                    <li><Link to="/courses?category=programming">Programming</Link></li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Primary Nav */}
            <nav className={`site-navbar ms-auto${menuOpen ? ' menu-on' : ''}`}>
              <ul className="primary-menu">
                <li className={isActive('/')}><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li className={isActive('/courses')}><Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link></li>
                <li className={isActive('/insights')}>
                  <Link to="/insights" onClick={() => setMenuOpen(false)}>Insights</Link>
                  <ul className="submenu">
                    <li><Link to="/insights" onClick={() => setMenuOpen(false)}>Blog</Link></li>
                    <li><Link to="/insights/case-studies" onClick={() => setMenuOpen(false)}>Case Studies</Link></li>
                  </ul>
                </li>
                <li className={isActive('/about')}><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
                <li className={isActive('/contact')}><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
                {/* Mobile-only account links — hidden on desktop (header-btn handles desktop) */}
                {isAuthenticated && isAdmin() && (
                  <li className="d-lg-none"><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
                )}
                {isAuthenticated && isInstructor() && (
                  <li className="d-lg-none"><Link to="/instructor" onClick={() => setMenuOpen(false)}>My Portal</Link></li>
                )}
                {isAuthenticated && !isAdmin() && !isInstructor() && (
                  <li className="d-lg-none" style={{ listStyle: 'none' }}>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                      <li style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 8, paddingTop: 8 }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 0', display: 'block' }}>My Account</span>
                      </li>
                      <li><Link to="/dashboard"  onClick={() => setMenuOpen(false)}>My Dashboard</Link></li>
                      <li><Link to="/study"      onClick={() => setMenuOpen(false)}>Study Hub</Link></li>
                      <li><Link to="/profile"    onClick={() => setMenuOpen(false)}>My Profile</Link></li>
                      <li><Link to="/account"    onClick={() => setMenuOpen(false)}>Account Settings</Link></li>
                      <li><Link to="/billing"    onClick={() => setMenuOpen(false)}>Billing &amp; Invoices</Link></li>
                      <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); logoutMutation.mutate() }}
                           style={{ color: '#ff6b6b' }}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                )}
                {!isAuthenticated && (
                  <>
                    <li className="d-lg-none" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 8, paddingTop: 8 }}>
                      <Link to="/login"    onClick={() => setMenuOpen(false)}>Login</Link>
                    </li>
                    <li className="d-lg-none"><Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
                  </>
                )}
              </ul>
              <a
                href="#"
                className="nav-close"
                onClick={(e) => { e.preventDefault(); setMenuOpen(false) }}
              >
                <i className="fal fa-times"></i>
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="header-btn d-none d-xl-block">
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-2">
                  {isInstructor() && (
                    <div className="dropdown">
                      <a
                        href="#"
                        className="login dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fa fa-chalkboard-teacher me-1"></i>{user?.name?.split(' ')[0]}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: 200 }}>
                        <li className="px-3 py-1">
                          <small className="text-muted">{user?.email}</small>
                        </li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        <li>
                          <Link to="/instructor" className="dropdown-item">
                            <i className="fa fa-tachometer-alt me-2" style={{ color: 'var(--theme-primary-color)' }}></i>Instructor Portal
                          </Link>
                        </li>
                        <li>
                          <Link to="/instructor/courses" className="dropdown-item">
                            <i className="fa fa-book me-2" style={{ color: 'var(--theme-primary-color)' }}></i>My Courses
                          </Link>
                        </li>
                        <li>
                          <Link to="/instructor/students" className="dropdown-item">
                            <i className="fa fa-users me-2" style={{ color: 'var(--theme-primary-color)' }}></i>My Students
                          </Link>
                        </li>
                        <li>
                          <Link to="/profile" className="dropdown-item">
                            <i className="fa fa-user me-2" style={{ color: 'var(--theme-primary-color)' }}></i>My Profile
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        <li>
                          <button
                            onClick={() => logoutMutation.mutate()}
                            className="dropdown-item text-danger"
                            disabled={logoutMutation.isPending}
                          >
                            <i className="fa fa-sign-out-alt me-2"></i>Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {!isAdmin() && !isInstructor() && (
                    <div className="dropdown">
                      <a
                        href="#"
                        className="login dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fa fa-user-circle me-1"></i>{user?.name?.split(' ')[0]}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: 200 }}>
                        <li className="px-3 py-1">
                          <small className="text-muted">{user?.email}</small>
                        </li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        <li>
                          <Link to="/dashboard" className="dropdown-item">
                            <i className="fa fa-tachometer-alt me-2" style={{ color: 'var(--theme-primary-color)' }}></i>My Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/study" className="dropdown-item">
                            <i className="fa fa-book-open me-2" style={{ color: 'var(--theme-primary-color)' }}></i>Study Hub
                          </Link>
                        </li>
                        <li>
                          <Link to="/profile" className="dropdown-item">
                            <i className="fa fa-user me-2" style={{ color: 'var(--theme-primary-color)' }}></i>My Profile
                          </Link>
                        </li>
                        <li>
                          <Link to="/account" className="dropdown-item">
                            <i className="fa fa-cog me-2" style={{ color: 'var(--theme-primary-color)' }}></i>Account Settings
                          </Link>
                        </li>
                        <li>
                          <Link to="/billing" className="dropdown-item">
                            <i className="fa fa-file-invoice-dollar me-2" style={{ color: 'var(--theme-primary-color)' }}></i>Billing &amp; Invoices
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider my-1" /></li>
                        <li>
                          <button
                            onClick={() => logoutMutation.mutate()}
                            className="dropdown-item text-danger"
                            disabled={logoutMutation.isPending}
                          >
                            <i className="fa fa-sign-out-alt me-2"></i>Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {isAdmin() && (
                    <button
                      onClick={() => logoutMutation.mutate()}
                      className="btn btn-main-2 btn-sm-2 rounded"
                      disabled={logoutMutation.isPending}
                    >
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="login">Login</Link>
                  <Link to="/register" className="btn btn-main-2 btn-sm-2 rounded">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
