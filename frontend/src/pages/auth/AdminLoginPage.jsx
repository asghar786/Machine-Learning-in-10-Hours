import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

// Greeva admin CSS — injected only on this page
const GREEVA_CSS = [
  '/admin/css/icons.min.css',
  '/admin/css/app.min.css',
]

function injectGreeva() {
  GREEVA_CSS.forEach((src) => {
    const id = `greeva-${src.split('/').pop().replace('.', '-')}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = src
    document.head.appendChild(link)
  })
}

function removeGreeva() {
  GREEVA_CSS.forEach((src) => {
    const id = `greeva-${src.split('/').pop().replace('.', '-')}`
    const el = document.getElementById(id)
    if (el) el.remove()
  })
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, isAuthenticated, user } = useAuthStore()
  const [error, setError] = useState('')

  // Inject Greeva CSS on mount, clean up on unmount
  useEffect(() => {
    injectGreeva()
    return () => removeGreeva()
  }, [])

  // Already logged in as admin → go to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.user.role !== 'admin') {
        setError('Access denied. This login is for administrators only.')
        return
      }
      setAuth(data.user, data.token)
      const destination = location.state?.from?.pathname || '/admin'
      navigate(destination, { replace: true })
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    loginMutation.mutate({
      email: form.email.value,
      password: form.password.value,
    })
  }

  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <div className="row g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <div className="col-xl-4 col-lg-5 col-md-6">
          <div className="card overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">

            <Link className="auth-brand mb-4" to="/">
              <img alt="Logo" className="logo-dark" height="36" src="/assets/images/logo.png" />
              <img alt="Logo" className="logo-light" height="36" src="/assets/images/logo.png" />
            </Link>

            <h4 className="fw-semibold mb-2 fs-18">Admin Panel Login</h4>
            <p className="text-muted mb-4">Enter your credentials to access the admin panel.</p>

            {error && (
              <div className="alert alert-danger text-start py-2 mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="text-start mb-3">
              <div className="mb-3">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  className="form-control"
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  className="form-control"
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              <div className="d-flex justify-content-between mb-3">
                <div className="form-check">
                  <input className="form-check-input" id="rememberme" type="checkbox" />
                  <label className="form-check-label" htmlFor="rememberme">Remember me</label>
                </div>
                <Link className="text-muted border-bottom border-dashed" to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <div className="d-grid">
                <button
                  className="btn btn-primary fw-semibold"
                  type="submit"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</>
                  ) : 'Login'}
                </button>
              </div>
            </form>

            <p className="text-muted fs-14 mb-4">
              Student?{' '}
              <Link className="fw-semibold text-primary ms-1" to="/login">
                Go to Student Login
              </Link>
            </p>

            <p className="mt-auto mb-0 text-muted fs-12">
              &copy; {new Date().getFullYear()} ML in 10 Hours
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}