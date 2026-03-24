import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/dashboard', { replace: true })
    },
    onError: (err) => {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors)
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    const form = e.currentTarget
    registerMutation.mutate({
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      password_confirmation: form.password_confirmation.value,
    })
  }

  const fieldError = (field) => fieldErrors[field]?.[0]

  return (
    <div id="top-header">
      <header className="header-style-1">
        <div className="header-navbar navbar-sticky">
          <div className="container">
            <div className="d-flex align-items-center">
              <div className="site-logo">
                <Link to="/"><img src="/assets/images/logo.png" alt="ML in 10 Hours" className="img-fluid" style={{ maxHeight: 50 }} /></Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="page-wrapper woocommerce single" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 col-xl-6">
              <div className="login-form">
                <div className="form-header mb-4">
                  <h2 className="font-weight-bold mb-2">Create Your Account</h2>
                  <p>
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-underline">Sign In</Link>
                  </p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name <span className="text-danger">*</span></label>
                    <input type="text" name="name" required className={`form-control ${fieldError('name') ? 'is-invalid' : ''}`} placeholder="John Doe" />
                    {fieldError('name') && <div className="invalid-feedback">{fieldError('name')}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address <span className="text-danger">*</span></label>
                    <input type="email" name="email" required className={`form-control ${fieldError('email') ? 'is-invalid' : ''}`} placeholder="your@email.com" />
                    {fieldError('email') && <div className="invalid-feedback">{fieldError('email')}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password <span className="text-danger">*</span></label>
                    <input type="password" name="password" required minLength={8} className={`form-control ${fieldError('password') ? 'is-invalid' : ''}`} placeholder="Min. 8 characters" />
                    {fieldError('password') && <div className="invalid-feedback">{fieldError('password')}</div>}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                    <input type="password" name="password_confirmation" required className="form-control" placeholder="Repeat password" />
                  </div>

                  <div className="form-check mb-4">
                    <input type="checkbox" className="form-check-input" id="terms" required />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-main rounded w-100" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Creating account…</>
                    ) : 'Create Account'}
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
