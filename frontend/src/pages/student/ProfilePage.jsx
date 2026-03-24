import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '@/api/profileApi'

export default function ProfilePage() {
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedin_url: '',
    website_url: '',
    avatar_url: '',
  })
  const [successMsg, setSuccessMsg] = useState('')
  const [apiErrors, setApiErrors] = useState({})
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef(null)

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get().then(r => r.data),
  })

  useEffect(() => {
    if (profileData) {
      setForm({
        name:         profileData.name         ?? '',
        email:        profileData.email        ?? '',
        phone:        profileData.phone        ?? '',
        location:     profileData.location     ?? '',
        bio:          profileData.bio          ?? '',
        linkedin_url: profileData.linkedin_url ?? '',
        website_url:  profileData.website_url  ?? '',
        avatar_url:   profileData.avatar_url   ?? '',
      })
      setAvatarPreview(profileData.avatar_url ?? '')
    }
  }, [profileData])

  const updateMutation = useMutation({
    mutationFn: (data) => profileApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setApiErrors({})
      setSuccessMsg('Profile updated successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    },
    onError: (err) => {
      const data = err.response?.data
      if (data?.errors) {
        setApiErrors(data.errors)
      }
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const res = await profileApi.uploadAvatar(file)
      const url = res.data?.avatar_url
      setForm((prev) => ({ ...prev, avatar_url: url }))
      setAvatarPreview(url)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setSuccessMsg('Profile picture updated.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setApiErrors({ avatar_url: ['Upload failed. Max 2 MB, image files only.'] })
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setApiErrors({})
    updateMutation.mutate(form)
  }

  const initials = profileData?.name
    ? profileData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const memberSince = profileData?.created_at
    ? new Date(profileData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  const group = profileData?.group
    ? `Group ${profileData.group.toUpperCase()}`
    : null

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="title-block">
            <h1>My Profile</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">My Profile</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="row">
              {/* Left: Avatar Card */}
              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm text-center p-4">
                  {/* Avatar with upload overlay */}
                  <div
                    className="position-relative mx-auto mb-3"
                    style={{ width: 100, height: 100, cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to change photo"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={profileData?.name}
                        className="rounded-circle"
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                        onError={() => setAvatarPreview('')}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fs-4 fw-bold"
                        style={{ width: 100, height: 100 }}
                      >
                        {initials}
                      </div>
                    )}
                    {/* Camera overlay */}
                    <div
                      className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 30, height: 30, background: 'var(--theme-primary-color, #F14D5D)', border: '2px solid #fff' }}
                    >
                      {avatarUploading
                        ? <span className="spinner-border spinner-border-sm text-white" style={{ width: 14, height: 14, borderWidth: 2 }} />
                        : <i className="fa fa-camera text-white" style={{ fontSize: 12 }}></i>
                      }
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleAvatarFile}
                  />

                  <h5 className="mb-1">{profileData?.name}</h5>
                  <p className="text-muted small mb-2">{profileData?.email}</p>

                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <span className="badge bg-primary-subtle text-primary">
                      {profileData?.role ?? 'student'}
                    </span>
                    {group && (
                      <span className="badge bg-secondary-subtle text-secondary">
                        {group}
                      </span>
                    )}
                  </div>

                  <hr />
                  <p className="text-muted small mb-0">
                    <i className="fa fa-calendar-alt me-1"></i>
                    Member since {memberSince}
                  </p>
                </div>
              </div>

              {/* Right: Edit Form */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm p-4">
                  <h5 className="mb-4">
                    <i className="fa fa-user-edit me-2 text-primary"></i>
                    Edit Profile
                  </h5>

                  {successMsg && (
                    <div className="alert alert-success alert-dismissible" role="alert">
                      <i className="fa fa-check-circle me-2"></i>{successMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                      {/* Full Name */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className={`form-control ${apiErrors.name ? 'is-invalid' : ''}`}
                          required
                        />
                        {apiErrors.name && (
                          <div className="invalid-feedback">{apiErrors.name[0]}</div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className={`form-control ${apiErrors.email ? 'is-invalid' : ''}`}
                          required
                        />
                        {apiErrors.email && (
                          <div className="invalid-feedback">{apiErrors.email[0]}</div>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className={`form-control ${apiErrors.phone ? 'is-invalid' : ''}`}
                        />
                        {apiErrors.phone && (
                          <div className="invalid-feedback">{apiErrors.phone[0]}</div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          className={`form-control ${apiErrors.location ? 'is-invalid' : ''}`}
                        />
                        {apiErrors.location && (
                          <div className="invalid-feedback">{apiErrors.location[0]}</div>
                        )}
                      </div>

                      {/* Bio */}
                      <div className="col-12 mb-3">
                        <label className="form-label fw-semibold">Bio</label>
                        <textarea
                          name="bio"
                          rows={4}
                          value={form.bio}
                          onChange={handleChange}
                          className={`form-control ${apiErrors.bio ? 'is-invalid' : ''}`}
                          placeholder="Tell us a bit about yourself..."
                        />
                        {apiErrors.bio && (
                          <div className="invalid-feedback">{apiErrors.bio[0]}</div>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fab fa-linkedin me-1"></i>LinkedIn URL
                        </label>
                        <input
                          type="url"
                          name="linkedin_url"
                          value={form.linkedin_url}
                          onChange={handleChange}
                          className={`form-control ${apiErrors.linkedin_url ? 'is-invalid' : ''}`}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                        {apiErrors.linkedin_url && (
                          <div className="invalid-feedback">{apiErrors.linkedin_url[0]}</div>
                        )}
                      </div>

                      {/* Website */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fa fa-globe me-1"></i>Website URL
                        </label>
                        <input
                          type="url"
                          name="website_url"
                          value={form.website_url}
                          onChange={handleChange}
                          className={`form-control ${apiErrors.website_url ? 'is-invalid' : ''}`}
                          placeholder="https://yourwebsite.com"
                        />
                        {apiErrors.website_url && (
                          <div className="invalid-feedback">{apiErrors.website_url[0]}</div>
                        )}
                      </div>

                      {/* Avatar upload hint */}
                      {apiErrors.avatar_url && (
                        <div className="col-12 mb-2">
                          <div className="alert alert-danger py-2 mb-0">{apiErrors.avatar_url[0]}</div>
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      <button
                        type="submit"
                        className="btn btn-main rounded"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending
                          ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</>
                          : <><i className="fa fa-save me-2"></i>Save Changes</>
                        }
                      </button>
                      <Link to="/dashboard" className="btn btn-outline-secondary rounded">
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
