import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const EMPTY_FORM = {
  name: '', email: '', password: '', bio: '', phone: '', location: '',
}

const EMPTY_EDIT = {
  name: '', email: '', bio: '', phone: '', location: '',
}

export default function AdminInstructors() {
  const qc = useQueryClient()
  const [modal, setModal]       = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [assignModal, setAssignModal] = useState(null) // instructor obj
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editForm, setEditForm] = useState(EMPTY_EDIT)
  const [errors, setErrors]     = useState({})
  const [assignCourse, setAssignCourse] = useState('')

  // ── Fetch instructors ───────────────────────────────────────────────────
  const { data: instructors = [], isLoading } = useQuery({
    queryKey: ['admin', 'instructors', 'full'],
    queryFn: () => axiosInstance.get('/admin/users').then(r => {
      const all = r.data?.data ?? []
      return all.filter(u => u.role === 'instructor')
    }),
  })

  // ── Fetch courses for assignment dropdown ───────────────────────────────
  const { data: courses = [] } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn:  () => axiosInstance.get('/admin/courses').then(r => r.data),
  })

  // ── Create instructor ───────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload) => axiosInstance.post('/admin/users', { ...payload, role: 'instructor' }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'instructors'] })
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      setModal(false)
      setForm(EMPTY_FORM)
      setErrors({})
    },
    onError: (err) => setErrors(err.response?.data?.errors ?? {}),
  })

  // ── Update instructor ───────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => axiosInstance.put(`/admin/users/${id}`, payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'instructors', 'full'] })
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      setEditModal(false)
      setEditing(null)
      setErrors({})
    },
    onError: (err) => setErrors(err.response?.data?.errors ?? {}),
  })

  // ── Assign course to instructor ─────────────────────────────────────────
  const assignMutation = useMutation({
    mutationFn: ({ courseId, instructorId }) =>
      axiosInstance.put(`/admin/courses/${courseId}`, { instructor_id: instructorId }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] })
      qc.invalidateQueries({ queryKey: ['admin', 'instructors', 'full'] })
      setAssignCourse('')
    },
  })

  // ── Unassign course ─────────────────────────────────────────────────────
  const unassignMutation = useMutation({
    mutationFn: (courseId) =>
      axiosInstance.put(`/admin/courses/${courseId}`, { instructor_id: null }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] })
      qc.invalidateQueries({ queryKey: ['admin', 'instructors', 'full'] })
    },
  })

  const openEdit = (inst) => {
    setEditing(inst)
    setEditForm({ name: inst.name ?? '', email: inst.email ?? '', bio: inst.bio ?? '', phone: inst.phone ?? '', location: inst.location ?? '' })
    setErrors({})
    setEditModal(true)
  }

  const handleField = (setter) => (e) => setter(f => ({ ...f, [e.target.name]: e.target.value }))

  // Courses assigned to the current assignModal instructor
  const assignedCourses = assignModal
    ? courses.filter(c => c.instructor_id === assignModal.id)
    : []
  const unassignedCourses = courses.filter(c => !c.instructor_id || c.instructor_id === assignModal?.id)

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="page-title mb-1">Instructors</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
              <li className="breadcrumb-item active">Instructors</li>
            </ol>
          </nav>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setErrors({}); setModal(true) }}>
          <i className="ti ti-plus me-1"></i>Add Instructor
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0"><i className="ti ti-chalkboard me-2"></i>All Instructors</h5>
          <span className="badge bg-primary">{instructors.length} total</span>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : instructors.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="ti ti-chalkboard-off fs-48 mb-3 d-block"></i>
              <h5>No instructors yet</h5>
              <p>Click <strong>Add Instructor</strong> to create one.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Instructor</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Courses Assigned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map(inst => {
                    const myCourses = courses.filter(c => c.instructor_id === inst.id)
                    return (
                      <tr key={inst.id}>
                        <td className="text-muted">{inst.id}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                              style={{ width: 38, height: 38, fontSize: 14 }}
                            >
                              {inst.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <div className="fw-semibold">{inst.name}</div>
                              {inst.bio && <div className="text-muted small" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inst.bio}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{inst.email}</div>
                          {inst.phone && <div className="text-muted small">{inst.phone}</div>}
                        </td>
                        <td className="text-muted small">{inst.location || '—'}</td>
                        <td>
                          {myCourses.length === 0 ? (
                            <span className="text-muted small">None</span>
                          ) : (
                            <div className="d-flex flex-wrap gap-1">
                              {myCourses.map(c => (
                                <span key={c.id} className="badge bg-primary-subtle text-primary">{c.title}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-success"
                              title="Assign Courses"
                              onClick={() => { setAssignModal(inst); setAssignCourse('') }}
                            >
                              <i className="ti ti-book-upload"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-primary" title="Edit" onClick={() => openEdit(inst)}>
                              <i className="ti ti-pencil"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Instructor Modal ──────────────────────────────────────────── */}
      {modal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="ti ti-chalkboard me-2"></i>Add Instructor</h5>
                <button className="btn-close" onClick={() => setModal(false)} type="button"></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form) }}>
                <div className="modal-body">
                  {createMutation.isError && !Object.keys(errors).length && (
                    <div className="alert alert-danger py-2">{createMutation.error?.response?.data?.message ?? 'Failed to create instructor.'}</div>
                  )}
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Full Name <span className="text-danger">*</span></label>
                      <input name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={form.name} onChange={handleField(setForm)} required placeholder="e.g. Dr. Sarah Ahmed" />
                      {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
                      <input name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={form.email} onChange={handleField(setForm)} required placeholder="instructor@example.com" />
                      {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Password <span className="text-danger">*</span></label>
                      <input name="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={form.password} onChange={handleField(setForm)} required placeholder="Min. 8 characters" />
                      {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Phone</label>
                      <input name="phone" className="form-control" value={form.phone} onChange={handleField(setForm)} placeholder="+92 300 0000000" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Location</label>
                      <input name="location" className="form-control" value={form.location} onChange={handleField(setForm)} placeholder="City, Country" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Bio</label>
                      <textarea name="bio" className="form-control" rows={3} value={form.bio} onChange={handleField(setForm)}
                        placeholder="Short professional biography..."></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
                    {createMutation.isPending ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating…</> : 'Create Instructor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Instructor Modal ─────────────────────────────────────────── */}
      {editModal && editing && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="ti ti-pencil me-2"></i>Edit — {editing.name}</h5>
                <button className="btn-close" onClick={() => setEditModal(false)} type="button"></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: editing.id, payload: editForm }) }}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Full Name</label>
                      <input name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={editForm.name} onChange={handleField(setEditForm)} />
                      {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Email</label>
                      <input name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={editForm.email} onChange={handleField(setEditForm)} />
                      {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Phone</label>
                      <input name="phone" className="form-control" value={editForm.phone} onChange={handleField(setEditForm)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Location</label>
                      <input name="location" className="form-control" value={editForm.location} onChange={handleField(setEditForm)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Bio</label>
                      <textarea name="bio" className="form-control" rows={3} value={editForm.bio} onChange={handleField(setEditForm)}></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Courses Modal ──────────────────────────────────────────── */}
      {assignModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="ti ti-book-upload me-2"></i>Assign Courses — {assignModal.name}</h5>
                <button className="btn-close" onClick={() => setAssignModal(null)} type="button"></button>
              </div>
              <div className="modal-body">
                {/* Currently assigned */}
                <div className="mb-4">
                  <label className="form-label fw-medium text-muted small text-uppercase">Currently Assigned</label>
                  {assignedCourses.length === 0 ? (
                    <p className="text-muted small mb-0">No courses assigned yet.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {assignedCourses.map(c => (
                        <div key={c.id} className="d-flex align-items-center justify-content-between p-2 border rounded">
                          <div>
                            <div className="fw-medium">{c.title}</div>
                            <small className="text-muted">{c.enrollments_count ?? 0} students enrolled</small>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => unassignMutation.mutate(c.id)}
                            disabled={unassignMutation.isPending}
                            title="Unassign"
                          >
                            <i className="ti ti-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assign new course */}
                <label className="form-label fw-medium text-muted small text-uppercase">Assign Another Course</label>
                <div className="d-flex gap-2">
                  <select
                    className="form-select"
                    value={assignCourse}
                    onChange={e => setAssignCourse(e.target.value)}
                  >
                    <option value="">— Select a course —</option>
                    {courses
                      .filter(c => !c.instructor_id)
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))
                    }
                  </select>
                  <button
                    className="btn btn-success flex-shrink-0"
                    disabled={!assignCourse || assignMutation.isPending}
                    onClick={() => assignMutation.mutate({ courseId: assignCourse, instructorId: assignModal.id })}
                  >
                    {assignMutation.isPending ? <span className="spinner-border spinner-border-sm"></span> : 'Assign'}
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-light" onClick={() => setAssignModal(null)}>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
