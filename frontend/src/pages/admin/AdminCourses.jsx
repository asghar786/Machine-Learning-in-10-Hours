import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const LEVELS      = ['beginner', 'intermediate', 'advanced']
const CATEGORIES  = ['machine-learning', 'data-science', 'python', 'deep-learning', 'statistics', 'other']

const EMPTY_FORM = {
  title: '', slug: '', short_description: '', description: '',
  category: '', level: 'beginner', price: '', original_price: '',
  duration_hours: '', thumbnail: '', is_published: false,
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminCourses() {
  const qc = useQueryClient()
  const [modal, setModal]   = useState(false)   // open/close
  const [editing, setEditing] = useState(null)  // course obj or null for new
  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [deleting, setDeleting] = useState(null)

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn:  () => axiosInstance.get('/admin/courses').then(r => r.data),
  })

  // ── Mutations ─────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing
        ? axiosInstance.put(`/admin/courses/${editing.id}`, payload).then(r => r.data)
        : axiosInstance.post('/admin/courses', payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] })
      closeModal()
    },
    onError: (err) => {
      const apiErrors = err.response?.data?.errors ?? {}
      setErrors(apiErrors)
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_published }) =>
      axiosInstance.put(`/admin/courses/${id}`, { is_published }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'courses'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/courses/${id}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] })
      setDeleting(null)
    },
  })

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setModal(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      title:             c.title             ?? '',
      slug:              c.slug              ?? '',
      short_description: c.short_description ?? '',
      description:       c.description       ?? '',
      category:          c.category          ?? '',
      level:             c.level             ?? 'beginner',
      price:             c.price             ?? '',
      original_price:    c.original_price    ?? '',
      duration_hours:    c.duration_hours    ?? '',
      thumbnail:         c.thumbnail         ?? '',
      is_published:      c.is_published      ?? false,
    })
    setErrors({})
    setModal(true)
  }

  const closeModal = () => { setModal(false); setEditing(null); setErrors({}) }

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => {
      const updated = { ...f, [name]: type === 'checkbox' ? checked : value }
      if (name === 'title' && !editing) updated.slug = slugify(value)
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    const payload = {
      ...form,
      price:          form.price          !== '' ? parseFloat(form.price)          : null,
      original_price: form.original_price !== '' ? parseFloat(form.original_price) : null,
      duration_hours: form.duration_hours !== '' ? parseInt(form.duration_hours)   : null,
    }
    saveMutation.mutate(payload)
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="page-title mb-1">Courses</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
              <li className="breadcrumb-item active">Courses</li>
            </ol>
          </nav>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="ti ti-plus me-1"></i>Add Course
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Price</th>
                  <th>Sessions</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="8" className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td></tr>
                ) : courses.length === 0 ? (
                  <tr><td colSpan="8" className="text-center text-muted py-4">
                    No courses yet.{' '}
                    <button className="btn btn-link p-0" onClick={openCreate}>Add the first course</button>
                  </td></tr>
                ) : courses.map((c) => (
                  <tr key={c.id}>
                    <td className="text-muted">{c.id}</td>
                    <td>
                      <div className="fw-medium">{c.title}</div>
                      <small className="text-muted">{c.slug}</small>
                    </td>
                    <td>{c.category
                      ? <span className="badge bg-info-subtle text-info">{c.category}</span>
                      : '—'}
                    </td>
                    <td>{c.level
                      ? <span className="badge bg-secondary-subtle text-secondary text-capitalize">{c.level}</span>
                      : '—'}
                    </td>
                    <td>
                      {c.price
                        ? <><span className="fw-medium">${c.price}</span>{c.original_price && <s className="text-muted ms-1 fs-12">${c.original_price}</s>}</>
                        : <span className="badge bg-success-subtle text-success">Free</span>}
                    </td>
                    <td>{c.sessions_count ?? '—'}</td>
                    <td>
                      <button
                        className={`badge border-0 bg-${c.is_published ? 'success' : 'secondary'}`}
                        disabled={toggleMutation.isPending}
                        onClick={() => toggleMutation.mutate({ id: c.id, is_published: !c.is_published })}
                        title="Click to toggle"
                        type="button"
                      >
                        {c.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(c)}>
                          <i className="ti ti-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleting(c)}>
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Modal ─────────────────────────────────────────── */}
      {modal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? `Edit — ${editing.title}` : 'Add New Course'}
                </h5>
                <button className="btn-close" onClick={closeModal} type="button"></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {saveMutation.isError && !Object.keys(errors).length && (
                    <div className="alert alert-danger py-2">
                      {saveMutation.error?.response?.data?.message ?? 'Failed to save course.'}
                    </div>
                  )}

                  <div className="row g-3">
                    {/* Title */}
                    <div className="col-12">
                      <label className="form-label fw-medium">Title <span className="text-danger">*</span></label>
                      <input name="title" className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={form.title} onChange={handleField} required placeholder="e.g. Machine Learning in 10 Hours" />
                      {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
                    </div>

                    {/* Slug */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Slug <span className="text-danger">*</span></label>
                      <input name="slug" className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                        value={form.slug} onChange={handleField} required placeholder="machine-learning-in-10-hours" />
                      {errors.slug && <div className="invalid-feedback">{errors.slug[0]}</div>}
                    </div>

                    {/* Duration */}
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Duration (hours)</label>
                      <input name="duration_hours" type="number" min="0" className="form-control"
                        value={form.duration_hours} onChange={handleField} placeholder="10" />
                    </div>

                    {/* Level */}
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Level</label>
                      <select name="level" className="form-select" value={form.level} onChange={handleField}>
                        {LEVELS.map(l => <option key={l} value={l} className="text-capitalize">{l}</option>)}
                      </select>
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Category</label>
                      <select name="category" className="form-select" value={form.category} onChange={handleField}>
                        <option value="">— Select —</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
                      </select>
                    </div>

                    {/* Price */}
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Price ($)</label>
                      <input name="price" type="number" min="0" step="0.01" className="form-control"
                        value={form.price} onChange={handleField} placeholder="99.00" />
                    </div>

                    {/* Original Price */}
                    <div className="col-md-3">
                      <label className="form-label fw-medium">Original Price ($)</label>
                      <input name="original_price" type="number" min="0" step="0.01" className="form-control"
                        value={form.original_price} onChange={handleField} placeholder="149.00" />
                    </div>

                    {/* Short Description */}
                    <div className="col-12">
                      <label className="form-label fw-medium">Short Description</label>
                      <input name="short_description" className="form-control"
                        value={form.short_description} onChange={handleField}
                        placeholder="One-line summary (max 500 chars)" maxLength={500} />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-medium">Full Description</label>
                      <textarea name="description" className="form-control" rows={4}
                        value={form.description} onChange={handleField}
                        placeholder="Detailed course description..."></textarea>
                    </div>

                    {/* Thumbnail */}
                    <div className="col-12">
                      <label className="form-label fw-medium">Thumbnail URL</label>
                      <input name="thumbnail" className="form-control"
                        value={form.thumbnail} onChange={handleField}
                        placeholder="https://... or /assets/images/course.jpg" />
                    </div>

                    {/* Published */}
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="is_published"
                          name="is_published" checked={form.is_published} onChange={handleField} />
                        <label className="form-check-label fw-medium" htmlFor="is_published">
                          Publish immediately
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>
                    {saveMutation.isPending
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                      : editing ? 'Save Changes' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ──────────────────────────────────────────────── */}
      {deleting && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title text-danger"><i className="ti ti-alert-triangle me-2"></i>Delete Course</h5>
                <button className="btn-close" onClick={() => setDeleting(null)} type="button"></button>
              </div>
              <div className="modal-body text-center py-3">
                <p className="mb-0">Delete <strong>{deleting.title}</strong>?</p>
                <small className="text-muted">This will remove all sessions and exercises.</small>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light btn-sm" onClick={() => setDeleting(null)}>Cancel</button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(deleting.id)}
                >
                  {deleteMutation.isPending
                    ? <span className="spinner-border spinner-border-sm"></span>
                    : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
