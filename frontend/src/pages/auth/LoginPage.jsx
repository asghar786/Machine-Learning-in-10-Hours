import { useState, useActionState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      const destination = location.state?.from?.pathname
        || (data.user.role === 'admin' ? '/admin' : '/dashboard')
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
    <div id="top-header">
      {/* Minimal header */}
      <header className="header-style-1">
        <div className="header-navbar navbar-sticky">
          <div className="container">
            <div className="d-flex align-items-center">
              <div className="site-logo">
                <Link to="/">
                  <img src="/assets/images/logo.png" alt="ML in 10 Hours" className="img-fluid" style={{ maxHeight: 50 }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <section className="page-wrapper woocommerce single" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-xl-5">
              <div className="login-form">
                <div className="form-header mb-4">
                  <h2 className="font-weight-bold mb-2">Welcome Back</h2>
                  <p>
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-underline">Sign Up for Free</Link>
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address <span className="required text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      autoComplete="email"
                      className="form-control"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password <span className="required text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      autoComplete="current-password"
                      className="form-control"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between py-2 mb-3">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="rememberme" />
                      <label className="form-check-label" htmlFor="rememberme">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="text-muted small">Forgot password?</Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-main rounded w-100"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</>
                    ) : 'Log In'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
