import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const TYPES = ['blog', 'case-study', 'news']
const CATEGORIES = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Web Development', 'Networking', 'Productivity', 'Programming',
  'Cybersecurity', 'Cloud Computing', 'Other',
]
const TYPE_COLOR = { blog: 'primary', 'case-study': 'purple', news: 'success' }

const EMPTY = {
  title: '', slug: '', type: 'blog', category: '', excerpt: '', content: '',
  thumbnail: '', is_published: false, published_at: '',
  meta_title: '', meta_description: '',
  og_title: '', og_description: '', og_image: '', focus_keyword: '', canonical_url: '',
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// SEO score indicator (simple keyword density check)
function SeoScore({ form }) {
  const checks = [
    { label: 'Title',            ok: form.title.length >= 10 && form.title.length <= 60 },
    { label: 'Meta Title',       ok: form.meta_title.length >= 10 && form.meta_title.length <= 70 },
    { label: 'Meta Description', ok: form.meta_description.length >= 50 && form.meta_description.length <= 160 },
    { label: 'Focus Keyword',    ok: form.focus_keyword.length > 0 },
    { label: 'OG Title',         ok: form.og_title.length > 0 },
    { label: 'OG Description',   ok: form.og_description.length > 0 },
    { label: 'OG Image',         ok: form.og_image.length > 0 },
    { label: 'Thumbnail',        ok: form.thumbnail.length > 0 },
    { label: 'Excerpt',          ok: form.excerpt.length >= 50 },
    { label: 'Content',          ok: form.content.length >= 300 },
  ]
  const score = checks.filter(c => c.ok).length
  const color = score >= 8 ? 'success' : score >= 5 ? 'warning' : 'danger'
  return (
    <div className="card border mb-3">
      <div className="card-body py-2 px-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-semibold fs-13">SEO Score</span>
          <span className={`badge bg-${color}`}>{score}/{checks.length}</span>
        </div>
        <div className="progress mb-2" style={{ height: 6 }}>
          <div className={`progress-bar bg-${color}`} style={{ width: `${(score / checks.length) * 100}%` }}></div>
        </div>
        <div className="row g-1">
          {checks.map(c => (
            <div key={c.label} className="col-6">
              <small className={`text-${c.ok ? 'success' : 'muted'}`}>
                <i className={`ti ti-${c.ok ? 'check' : 'x'} me-1`}></i>{c.label}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminPosts() {
  const qc = useQueryClient()
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [tab, setTab]         = useState('basic')   // basic | seo
  const [deleting, setDeleting] = useState(null)

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin', 'posts'],
    queryFn:  () => axiosInstance.get('/admin/posts').then(r => r.data),
  })

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing
        ? axiosInstance.put(`/admin/posts/${editing.id}`, payload).then(r => r.data)
        : axiosInstance.post('/admin/posts', payload).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'posts'] }); closeModal() },
    onError: (err) => setErrors(err.response?.data?.errors ?? {}),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/posts/${id}`).then(r => r.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin', 'posts'] }); setDeleting(null) },
  })

  const openAdd = () => {
    setEditing(null); setForm(EMPTY); setErrors({}); setTab('basic'); setModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      title: p.title ?? '', slug: p.slug ?? '', type: p.type ?? 'blog',
      category: p.category ?? '', excerpt: p.excerpt ?? '', content: p.content ?? '',
      thumbnail: p.thumbnail ?? '', is_published: !!p.is_published,
      published_at: p.published_at ? p.published_at.slice(0, 10) : '',
      meta_title: p.meta_title ?? '', meta_description: p.meta_description ?? '',
      og_title: p.og_title ?? '', og_description: p.og_description ?? '',
      og_image: p.og_image ?? '', focus_keyword: p.focus_keyword ?? '',
      canonical_url: p.canonical_url ?? '',
    })
    setErrors({}); setTab('basic'); setModal(true)
  }

  const closeModal = () => { setModal(false); setEditing(null); setErrors({}) }

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => {
      const updated = { ...f, [name]: type === 'checkbox' ? checked : value }
      if (name === 'title' && !editing) updated.slug = slugify(value)
      if (name === 'title' && !editing && !f.meta_title) updated.meta_title = value
      if (name === 'excerpt' && !editing && !f.og_description) updated.og_description = value
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault(); setErrors({})
    saveMutation.mutate({
      ...form,
      published_at: form.is_published && !form.published_at ? new Date().toISOString() : form.published_at || null,
    })
  }

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
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="ti ti-plus me-1"></i>Add Post
        </button>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Posts',     value: posts.length,                                      color: 'primary', icon: 'ti ti-pencil'       },
          { label: 'Published',       value: posts.filter(p => p.is_published).length,           color: 'success', icon: 'ti ti-check'        },
          { label: 'Drafts',          value: posts.filter(p => !p.is_published).length,          color: 'warning', icon: 'ti ti-clock'        },
          { label: 'Categories',      value: [...new Set(posts.map(p => p.category).filter(Boolean))].length, color: 'info', icon: 'ti ti-tag' },
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
                    No posts yet. <button className="btn btn-link p-0" onClick={openAdd}>Add the first post</button>
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
                          : <span className="avatar-title rounded bg-secondary-subtle text-secondary" style={{ width: 48, height: 36 }}><i className="ti ti-photo fs-18"></i></span>
                        }
                      </td>
                      <td>
                        <div className="fw-medium">{p.title}</div>
                        <small className="text-muted">{p.slug}</small>
                      </td>
                      <td>{p.category
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
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(p)} title="Edit">
                            <i className="ti ti-pencil"></i>
                          </button>
                          <a className="btn btn-sm btn-outline-info" href={`/insights/${p.slug}`} target="_blank" rel="noreferrer" title="Preview">
                            <i className="ti ti-external-link"></i>
                          </a>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleting(p)} title="Delete">
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

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {modal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? `Edit — ${editing.title}` : 'Add New Post'}
                </h5>
                <button className="btn-close" onClick={closeModal} type="button"></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Tabs */}
                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <button type="button" className={`nav-link${tab === 'basic' ? ' active' : ''}`}
                        onClick={() => setTab('basic')}>
                        <i className="ti ti-pencil me-1"></i>Content
                      </button>
                    </li>
                    <li className="nav-item">
                      <button type="button" className={`nav-link${tab === 'seo' ? ' active' : ''}`}
                        onClick={() => setTab('seo')}>
                        <i className="ti ti-world me-1"></i>SEO &amp; OG Tags
                        {(form.meta_title || form.og_title) &&
                          <span className="badge bg-success-subtle text-success ms-2 fs-11">filled</span>}
                      </button>
                    </li>
                  </ul>

                  {saveMutation.isError && !Object.keys(errors).length && (
                    <div className="alert alert-danger py-2">
                      {saveMutation.error?.response?.data?.message ?? 'Failed to save post.'}
                    </div>
                  )}

                  {/* ── BASIC TAB ── */}
                  {tab === 'basic' && (
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label fw-medium">Title <span className="text-danger">*</span></label>
                        <input name="title" className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          value={form.title} onChange={handleField} required placeholder="Post title" />
                        {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-medium">Type</label>
                        <select name="type" className="form-select" value={form.type} onChange={handleField}>
                          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Slug <span className="text-danger">*</span></label>
                        <input name="slug" className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                          value={form.slug} onChange={handleField} required placeholder="url-slug" />
                        {errors.slug && <div className="invalid-feedback">{errors.slug[0]}</div>}
                        <small className="text-muted">Auto-generated from title</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Category</label>
                        <select name="category" className="form-select" value={form.category} onChange={handleField}>
                          <option value="">— Select Category —</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">Thumbnail URL</label>
                        <input name="thumbnail" className="form-control" value={form.thumbnail}
                          onChange={handleField} placeholder="https://images.unsplash.com/..." />
                        {form.thumbnail && (
                          <div className="mt-2">
                            <img src={form.thumbnail} alt="preview" className="rounded"
                              style={{ height: 80, objectFit: 'cover' }}
                              onError={e => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">Excerpt</label>
                        <textarea name="excerpt" className="form-control" rows={2}
                          value={form.excerpt} onChange={handleField}
                          placeholder="Short summary shown in listings (50–160 chars recommended)" />
                        <small className="text-muted">{form.excerpt.length} chars</small>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">Content <span className="text-danger">*</span></label>
                        <textarea name="content" className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                          rows={10} value={form.content} onChange={handleField}
                          placeholder="Full post content (HTML supported)" required />
                        {errors.content && <div className="invalid-feedback">{errors.content[0]}</div>}
                        <small className="text-muted">{form.content.length} chars</small>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-switch mt-2">
                          <input className="form-check-input" type="checkbox" id="is_published"
                            name="is_published" checked={form.is_published} onChange={handleField} />
                          <label className="form-check-label fw-medium" htmlFor="is_published">
                            Publish immediately
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Publish Date</label>
                        <input name="published_at" type="date" className="form-control"
                          value={form.published_at} onChange={handleField} />
                      </div>
                    </div>
                  )}

                  {/* ── SEO TAB ── */}
                  {tab === 'seo' && (
                    <div className="row g-3">
                      <div className="col-12">
                        <SeoScore form={form} />
                      </div>

                      {/* Meta */}
                      <div className="col-12">
                        <h6 className="fw-semibold text-muted text-uppercase fs-12 mb-2">
                          <i className="ti ti-search me-1"></i>Search Engine (Meta)
                        </h6>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">Meta Title</label>
                        <input name="meta_title" className="form-control" value={form.meta_title}
                          onChange={handleField} placeholder="SEO title (50–70 chars recommended)" maxLength={70} />
                        <small className={`${form.meta_title.length > 70 ? 'text-danger' : 'text-muted'}`}>
                          {form.meta_title.length}/70
                        </small>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">Meta Description</label>
                        <textarea name="meta_description" className="form-control" rows={2}
                          value={form.meta_description} onChange={handleField}
                          placeholder="Search result snippet (50–160 chars)" maxLength={160} />
                        <small className={`${form.meta_description.length > 160 ? 'text-danger' : 'text-muted'}`}>
                          {form.meta_description.length}/160
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Focus Keyword</label>
                        <input name="focus_keyword" className="form-control" value={form.focus_keyword}
                          onChange={handleField} placeholder="e.g. machine learning tutorial" />
                        <small className="text-muted">Main keyword this post should rank for</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Canonical URL</label>
                        <input name="canonical_url" className="form-control" value={form.canonical_url}
                          onChange={handleField} placeholder="https://yourdomain.com/insights/slug" />
                        <small className="text-muted">Leave blank to use default URL</small>
                      </div>

                      {/* OG */}
                      <div className="col-12 mt-2">
                        <h6 className="fw-semibold text-muted text-uppercase fs-12 mb-2">
                          <i className="ti ti-share me-1"></i>Open Graph (Social Media Preview)
                        </h6>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">OG Title</label>
                        <input name="og_title" className="form-control" value={form.og_title}
                          onChange={handleField} placeholder="Title shown when shared on Facebook, LinkedIn, Twitter" />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">OG Description</label>
                        <textarea name="og_description" className="form-control" rows={2}
                          value={form.og_description} onChange={handleField}
                          placeholder="Description shown in social media link previews" />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-medium">OG Image URL</label>
                        <input name="og_image" className="form-control" value={form.og_image}
                          onChange={handleField} placeholder="https://... (1200×630px recommended)" />
                        {form.og_image && (
                          <div className="mt-2 p-2 border rounded bg-light">
                            <small className="text-muted d-block mb-1">Social preview:</small>
                            <img src={form.og_image} alt="OG preview" className="rounded w-100"
                              style={{ maxHeight: 120, objectFit: 'cover' }}
                              onError={e => e.target.style.display = 'none'} />
                            <small className="fw-semibold d-block mt-1">{form.og_title || form.title}</small>
                            <small className="text-muted">{form.og_description || form.excerpt}</small>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={closeModal}>Cancel</button>
                  {tab === 'basic' && (
                    <button type="button" className="btn btn-outline-primary" onClick={() => setTab('seo')}>
                      Next: SEO Settings <i className="ti ti-arrow-right ms-1"></i>
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>
                    {saveMutation.isPending
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                      : <><i className="ti ti-device-floppy me-1"></i>{editing ? 'Save Changes' : 'Publish Post'}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title text-danger"><i className="ti ti-alert-triangle me-2"></i>Delete Post</h5>
                <button className="btn-close" onClick={() => setDeleting(null)} type="button"></button>
              </div>
              <div className="modal-body text-center py-2">
                <p className="mb-1">Delete <strong>{deleting.title}</strong>?</p>
                <small className="text-muted">This action cannot be undone.</small>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light btn-sm" onClick={() => setDeleting(null)}>Cancel</button>
                <button className="btn btn-danger btn-sm" disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(deleting.id)}>
                  {deleteMutation.isPending ? <span className="spinner-border spinner-border-sm"></span> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
