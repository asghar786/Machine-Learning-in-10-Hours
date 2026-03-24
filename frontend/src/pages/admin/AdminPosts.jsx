import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const TYPE_COLOR = { blog: 'primary', 'case-study': 'purple', news: 'success' }

export default function AdminPosts() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [deleting, setDeleting] = useState(null)

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: () => axiosInstance.get('/admin/posts').then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/posts/${id}`).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'posts'] }); setDeleting(null) },
  })

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="page-title mb-1">Posts / Insights</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
              <li className="breadcrumb-item active">Posts</li>
            </ol>
          </nav>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/posts/new')}>
          <i className="ti ti-plus me-1"></i>Add Post
        </button>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Posts', value: posts.length,                                                       color: 'primary', icon: 'ti ti-pencil' },
          { label: 'Published',   value: posts.filter(p => p.is_published).length,                           color: 'success', icon: 'ti ti-check'  },
          { label: 'Drafts',      value: posts.filter(p => !p.is_published).length,                          color: 'warning', icon: 'ti ti-clock'  },
          { label: 'Categories',  value: [...new Set(posts.map(p => p.category).filter(Boolean))].length,    color: 'info',    icon: 'ti ti-tag'    },
        ].map(s => (
          <div key={s.label} className="col-xl-3 col-md-6">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <span className={`avatar-title rounded bg-${s.color}-subtle text-${s.color} fs-24`}
                  style={{ width: 48, height: 48 }}>
                  <i className={s.icon}></i>
                </span>
                <div>
                  <p className="text-muted fw-medium mb-0 fs-13">{s.label}</p>
                  <h4 className="mb-0">{s.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>SEO</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="8" className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  </td></tr>
                ) : posts.length === 0 ? (
                  <tr><td colSpan="8" className="text-center text-muted py-4">
                    No posts yet.{' '}
                    <button className="btn btn-link p-0" onClick={() => navigate('/admin/posts/new')}>
                      Add the first post
                    </button>
                  </td></tr>
                ) : posts.map(p => {
                  const seoFields = [p.meta_title, p.meta_description, p.og_title, p.og_image, p.focus_keyword]
                  const seoFilled = seoFields.filter(Boolean).length
                  const seoColor  = seoFilled >= 4 ? 'success' : seoFilled >= 2 ? 'warning' : 'danger'
                  return (
                    <tr key={p.id}>
                      <td>
                        {p.thumbnail
                          ? <img src={p.thumbnail} alt="" className="rounded" style={{ width: 48, height: 36, objectFit: 'cover' }} />
                          : <span className="avatar-title rounded bg-secondary-subtle text-secondary d-inline-flex align-items-center justify-content-center" style={{ width: 48, height: 36 }}>
                              <i className="ti ti-photo fs-18"></i>
                            </span>
                        }
                      </td>
                      <td>
                        <div className="fw-medium">{p.title}</div>
                        <small className="text-muted">{p.slug}</small>
                      </td>
                      <td>
                        {p.category
                          ? <span className="badge bg-info-subtle text-info">{p.category}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <span className={`badge bg-${TYPE_COLOR[p.type] ?? 'secondary'}`}
                          style={p.type === 'case-study' ? { backgroundColor: '#6f42c1' } : {}}>
                          {p.type}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${seoColor}-subtle text-${seoColor}`} title={`${seoFilled}/5 SEO fields filled`}>
                          {seoFilled}/5
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${p.is_published ? 'success' : 'secondary'}`}>
                          {p.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="text-muted fs-13">
                        {p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/admin/posts/${p.id}/edit`)}
                            title="Edit"
                          >
                            <i className="ti ti-pencil"></i>
                          </button>
                          <a
                            className="btn btn-sm btn-outline-info"
                            href={`/insights/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview"
                          >
                            <i className="ti ti-external-link"></i>
                          </a>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setDeleting(p)}
                            title="Delete"
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleting && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title text-danger">
                  <i className="ti ti-alert-triangle me-2"></i>Delete Post
                </h5>
                <button className="btn-close" onClick={() => setDeleting(null)} type="button"></button>
              </div>
              <div className="modal-body text-center py-2">
                <p className="mb-1">Delete <strong>{deleting.title}</strong>?</p>
                <small className="text-muted">This action cannot be undone.</small>
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
