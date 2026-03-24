import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/authApi'

const GREEVA_CSS = ['/admin/css/icons.min.css', '/admin/css/app.min.css']

function injectGreeva() {
  GREEVA_CSS.forEach((src) => {
    const id = `greeva-${src.split('/').pop().replace('.', '-')}`
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id; link.rel = 'stylesheet'; link.href = src
    document.head.appendChild(link)
  })
}
function removeGreeva() {
  GREEVA_CSS.forEach((src) => {
    document.getElementById(`greeva-${src.split('/').pop().replace('.', '-')}`)?.remove()
  })
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function LockScreenPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, locked, unlock } = useAuthStore()
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    injectGreeva()
    return () => removeGreeva()
  }, [])

  // If not authenticated at all, go to login
  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login', { replace: true })
  }, [isAuthenticated, navigate])

  // If not locked (navigated here directly), still show the screen but allow unlock
  const displayName = user?.name ?? 'Admin'

  const handleUnlock = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.login({ email: user.email, password })
      unlock()
      navigate('/admin', { replace: true })
    } catch {
      setError('Incorrect password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <div className="row g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <div className="col-xl-4 col-lg-5 col-md-6">
          <div className="card overflow-hidden text-center h-100 p-xxl-4 p-4 mb-0">

            {/* Logo */}
            <Link className="auth-brand mb-4" to="/admin">
              <img alt="Logo" height="36" src="/assets/images/logo.png" />
            </Link>

            {/* User avatar */}
            <div className="text-center mb-3">
              <div
                className="avatar-title rounded-circle bg-primary text-white fs-24 mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: 80, height: 80 }}
              >
                {initials(displayName)}
              </div>
              <h4 className="fw-semibold text-dark mb-1">Hi! {displayName}</h4>
              <p className="text-muted mb-0 fst-italic">
                Enter your password to unlock the screen.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 text-start mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleUnlock} className="text-start mb-3">
              <div className="mb-3">
                <label className="form-label" htmlFor="lock-password">Password</label>
                <input
                  id="lock-password"
                  className="form-control"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="d-grid">
                <button
                  className="btn btn-primary fw-semibold"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Unlocking…</>
                    : 'Access Screen'}
                </button>
              </div>
            </form>

            <p className="text-muted fs-14 mb-4">
              Not you?{' '}
              <Link className="fw-semibold text-danger ms-1" to="/admin/login">
                Sign in as different user
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
