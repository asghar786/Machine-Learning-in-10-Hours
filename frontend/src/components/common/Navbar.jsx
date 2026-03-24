import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { queryClient } from '@/api/queryClient'

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      queryClient.clear()
      navigate('/')
    },
  })

  const isActive = (path) => location.pathname === path ? 'current' : ''

  return (
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
      <div className="header-navbar navbar-sticky">
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
              <a href="#" className="nav-toggler"><i className="fal fa-bars"></i></a>
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
            <nav className="site-navbar ms-auto">
              <ul className="primary-menu">
                <li className={isActive('/')}><Link to="/">Home</Link></li>
                <li className={isActive('/courses')}><Link to="/courses">Courses</Link></li>
                <li className={isActive('/insights')}>
                  <Link to="/insights">Insights</Link>
                  <ul className="submenu">
                    <li><Link to="/insights">Blog</Link></li>
                    <li><Link to="/insights/case-studies">Case Studies</Link></li>
                  </ul>
                </li>
                <li className={isActive('/about')}><Link to="/about">About</Link></li>
                <li className={isActive('/contact')}><Link to="/contact">Contact</Link></li>
                {isAuthenticated && !isAdmin() && (
                  <li className={isActive('/study')}><Link to="/study">Study Hub</Link></li>
                )}
                {isAuthenticated && isAdmin() && (
                  <li><Link to="/admin">Admin</Link></li>
                )}
              </ul>
              <a href="#" className="nav-close"><i className="fal fa-times"></i></a>
            </nav>

            {/* Auth Buttons */}
            <div className="header-btn d-none d-xl-block">
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/dashboard" className="login">Dashboard</Link>
                  {!isAdmin() && (
                    <>
                      <Link to="/study" className="login">
                        <i className="fa fa-book-open me-1"></i>Study Hub
                      </Link>
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
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                          <li>
                            <Link to="/profile" className="dropdown-item">
                              <i className="fa fa-user me-2 text-primary"></i>My Profile
                            </Link>
                          </li>
                          <li>
                            <Link to="/account" className="dropdown-item">
                              <i className="fa fa-cog me-2 text-secondary"></i>Account Settings
                            </Link>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
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
                    </>
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
  )
}
