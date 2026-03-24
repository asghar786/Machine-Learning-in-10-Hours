import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const STATUS_FILTERS = ['', 'pending', 'graded', 'resubmit']
const FILTER_LABELS  = { '': 'All', pending: 'Pending', graded: 'Graded', resubmit: 'Resubmit' }

const STATUS_COLOR = {
  graded:   'success',
  pending:  'warning',
  resubmit: 'info',
  failed:   'danger',
}

export default function AdminSubmissions() {
  const [statusFilter, setStatusFilter] = useState('')
  const [grading, setGrading]           = useState(null)
  const [form, setForm]                  = useState({ score: '', feedback: '' })
  const [submitting, setSubmitting]      = useState(false)
  const [autoGrading, setAutoGrading]    = useState(null) // submission id being auto-graded

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'submissions', statusFilter],
    queryFn: () => axiosInstance.get('/admin/submissions', { params: { status: statusFilter || undefined } }),
    select: (res) => res.data,
  })
  const submissions = data?.data || []

  const openGrade = (s) => {
    setGrading(s)
    setForm({ score: s.score ?? '', feedback: s.feedback ?? '' })
  }

  const handleAutoGrade = async (s) => {
    if (!s.notebook_url) return alert('This submission has no notebook URL.')
    setAutoGrading(s.id)
    try {
      const res = await axiosInstance.post(`/admin/submissions/${s.id}/auto-grade`)
      const data = res.data
      if (data.success) {
        await refetch()
        alert(`Auto-graded: ${data.data?.score ?? '?'}/100\n\n${data.data?.feedback ?? ''}`)
      } else {
        alert(data.message || 'Auto-grade failed.')
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'ML grader service unavailable. Is it running on port 8001?')
    } finally {
      setAutoGrading(null)
    }
  }

  const submitGrade = async () => {
    if (!form.score) return
    setSubmitting(true)
    try {
      await axiosInstance.post(`/admin/submissions/${grading.id}/grade`, {
        score:    form.score,
        feedback: form.feedback,
      })
      setGrading(null)
      await refetch()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title mb-1">Submissions</h4>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
            <li className="breadcrumb-item active">Submissions</li>
          </ol></nav>
        </div>
      </div>

      {/* Status Filters */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill`}
          >
            {FILTER_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Exercise</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Submitted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                ) : submissions.length === 0 ? (
                  <tr><td colSpan="7" className="text-center text-muted py-4">No submissions</td></tr>
                ) : submissions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.user?.name ?? '—'}</td>
                    <td>{s.exercise?.session?.title ?? s.exercise?.title ?? '—'}</td>
                    <td>
                      <span className={`badge bg-${STATUS_COLOR[s.status] ?? 'secondary'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.score !== null && s.score !== undefined ? `${s.score}%` : '—'}</td>
                    <td>{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <button className="btn btn-sm btn-primary" onClick={() => openGrade(s)}>
                          Grade
                        </button>
                        {s.notebook_url && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            title="Auto-grade with ML service"
                            disabled={autoGrading === s.id}
                            onClick={() => handleAutoGrade(s)}
                          >
                            {autoGrading === s.id
                              ? <span className="spinner-border spinner-border-sm" />
                              : <><i className="fa fa-robot me-1"></i>Auto</>
                            }
                          </button>
                        )}
                        {s.notebook_url && (
                          <a
                            href={s.notebook_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-secondary"
                            title="View notebook"
                          >
                            <i className="fa fa-external-link-alt"></i>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grade Modal */}
      {grading && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Grade Submission #{grading.id}</h5>
                <button className="btn-close" onClick={() => setGrading(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Student: {grading.user?.name ?? '—'} | Exercise: {grading.exercise?.session?.title ?? grading.exercise?.title ?? '—'}
                </p>
                {grading.notebook_url && (
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    <a
                      href={grading.notebook_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="fa fa-external-link-alt me-1"></i>View Notebook
                    </a>
                    <button
                      className="btn btn-sm btn-outline-success"
                      disabled={autoGrading === grading.id}
                      onClick={async () => {
                        await handleAutoGrade(grading)
                        setGrading(null)
                      }}
                    >
                      {autoGrading === grading.id
                        ? <><span className="spinner-border spinner-border-sm me-1" />Grading…</>
                        : <><i className="fa fa-robot me-1"></i>Auto Grade</>
                      }
                    </button>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-medium">Score (0–100) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={form.score}
                    onChange={(e) => setForm(f => ({ ...f, score: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Feedback</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={form.feedback}
                    onChange={(e) => setForm(f => ({ ...f, feedback: e.target.value }))}
                    placeholder="Optional feedback for the student…"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setGrading(null)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  disabled={!form.score || submitting}
                  onClick={submitGrade}
                >
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : 'Save Grade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
