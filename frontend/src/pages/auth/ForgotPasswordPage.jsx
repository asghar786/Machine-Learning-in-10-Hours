import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => setSent(true),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(e.currentTarget.email.value)
  }

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
            <div className="col-md-5 col-xl-4">
              <div className="login-form">
                <h2 className="mb-2">Reset Password</h2>
                <p className="mb-4 text-muted">Enter your email and we'll send you a reset link.</p>
                {sent ? (
                  <div className="alert alert-success">
                    Check your inbox for the password reset link.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {mutation.isError && <div className="alert alert-danger">{mutation.error?.response?.data?.message || 'Error'}</div>}
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input type="email" name="email" required className="form-control" placeholder="your@email.com" />
                    </div>
                    <button type="submit" className="btn btn-main rounded w-100" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Sending…' : 'Send Reset Link'}
                    </button>
                  </form>
                )}
                <p className="mt-3 text-center"><Link to="/login">← Back to Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
