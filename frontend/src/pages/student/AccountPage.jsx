import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { profileApi } from '@/api/profileApi'
import { useAuthStore } from '@/store/authStore'

export default function AccountPage() {
  const { user } = useAuthStore()

  // Change password form state
  const [pwForm, setPwForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [showCurrent, setShowCurrent]   = useState(false)
  const [showNew, setShowNew]           = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [pwSuccess, setPwSuccess]       = useState('')
  const [pwError, setPwError]           = useState('')
  const [pwFieldErrors, setPwFieldErrors] = useState({})

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  const group = user?.group ? `Group ${user.group.toUpperCase()}` : '—'

  const changePasswordMutation = useMutation({
    mutationFn: (data) => profileApi.changePassword(data),
    onSuccess: () => {
      setPwForm({ current_password: '', password: '', password_confirmation: '' })
      setPwError('')
      setPwFieldErrors({})
      setPwSuccess('Password changed successfully.')
      setTimeout(() => setPwSuccess(''), 3000)
    },
    onError: (err) => {
      const data = err.response?.data
      if (data?.errors) {
        setPwFieldErrors(data.errors)
        setPwError('')
      } else if (data?.message) {
        setPwError(data.message)
        setPwFieldErrors({})
      } else {
        setPwError('An error occurred. Please try again.')
        setPwFieldErrors({})
      }
    },
  })

  const handlePwChange = (e) => {
    const { name, value } = e.target
    setPwForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePwSubmit = (e) => {
    e.preventDefault()
    setPwError('')
    setPwFieldErrors({})
    changePasswordMutation.mutate(pwForm)
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="title-block">
            <h1>Account Settings</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Account Settings</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">

              {/* Card 1: Change Password */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="card-title mb-4">
                    <i className="fa fa-lock me-2 text-primary"></i>
                    Change Password
                  </h5>

                  {pwSuccess && (
                    <div className="alert alert-success" role="alert">
                      <i className="fa fa-check-circle me-2"></i>{pwSuccess}
                    </div>
                  )}

                  {pwError && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fa fa-exclamation-circle me-2"></i>{pwError}
                    </div>
                  )}

                  <form onSubmit={handlePwSubmit} noValidate>
                    {/* Current Password */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Current Password</label>
                      <div className="input-group">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          name="current_password"
                          value={pwForm.current_password}
                          onChange={handlePwChange}
                          className={`form-control ${pwFieldErrors.current_password ? 'is-invalid' : ''}`}
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowCurrent((v) => !v)}
                          tabIndex={-1}
                        >
                          <i className={`fa ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        {pwFieldErrors.current_password && (
                          <div className="invalid-feedback">{pwFieldErrors.current_password[0]}</div>
                        )}
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <div className="input-group">
                        <input
                          type={showNew ? 'text' : 'password'}
                          name="password"
                          value={pwForm.password}
                          onChange={handlePwChange}
                          className={`form-control ${pwFieldErrors.password ? 'is-invalid' : ''}`}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowNew((v) => !v)}
                          tabIndex={-1}
                        >
                          <i className={`fa ${showNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        {pwFieldErrors.password && (
                          <div className="invalid-feedback">{pwFieldErrors.password[0]}</div>
                        )}
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Confirm New Password</label>
                      <div className="input-group">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          name="password_confirmation"
                          value={pwForm.password_confirmation}
                          onChange={handlePwChange}
                          className={`form-control ${pwFieldErrors.password_confirmation ? 'is-invalid' : ''}`}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirm((v) => !v)}
                          tabIndex={-1}
                        >
                          <i className={`fa ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        {pwFieldErrors.password_confirmation && (
                          <div className="invalid-feedback">{pwFieldErrors.password_confirmation[0]}</div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-main rounded"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending
                        ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Updating...</>
                        : <><i className="fa fa-key me-2"></i>Update Password</>
                      }
                    </button>
                  </form>
                </div>
              </div>

              {/* Card 2: Account Information */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="card-title mb-4">
                    <i className="fa fa-id-card me-2 text-primary"></i>
                    Account Information
                  </h5>

                  <dl className="row mb-0">
                    <dt className="col-sm-4 text-muted fw-normal">Account ID</dt>
                    <dd className="col-sm-8">
                      <span className="font-monospace">#{user?.id ?? '—'}</span>
                    </dd>

                    <dt className="col-sm-4 text-muted fw-normal">Email</dt>
                    <dd className="col-sm-8">{user?.email ?? '—'}</dd>

                    <dt className="col-sm-4 text-muted fw-normal">Role</dt>
                    <dd className="col-sm-8">
                      <span className="badge bg-primary-subtle text-primary text-capitalize">
                        {user?.role ?? '—'}
                      </span>
                    </dd>

                    <dt className="col-sm-4 text-muted fw-normal">Group</dt>
                    <dd className="col-sm-8">
                      <span className="badge bg-secondary-subtle text-secondary">
                        {group}
                      </span>
                    </dd>

                    <dt className="col-sm-4 text-muted fw-normal">Member Since</dt>
                    <dd className="col-sm-8 mb-0">{memberSince}</dd>
                  </dl>
                </div>
              </div>

              {/* Card 3: Danger Zone */}
              <div className="card border-danger mb-4">
                <div className="card-body p-4">
                  <h5 className="card-title text-danger mb-3">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    Danger Zone
                  </h5>
                  <p className="text-muted small mb-3">
                    Deleting your account is permanent and cannot be undone. All your data, enrollments, and certificates will be permanently removed.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-danger rounded"
                    disabled
                  >
                    <i className="fa fa-trash-alt me-2"></i>
                    Contact support to delete your account
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
