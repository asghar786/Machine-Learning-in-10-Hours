import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const EMPTY_FORM = {
  title: '',
  slug: '',
  type: 'blog',
  excerpt: '',
  content: '',
  is_published: false,
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const TYPE_BADGE = {
  blog: 'primary',
  'case-study': 'purple',
  news: 'success',
}

const TYPE_LABEL = {
  blog: 'Blog',
  'case-study': 'Case Study',
  news: 'News',
}

export default function AdminPosts() {
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: () => axiosInstance.get('/admin/posts'),
    select: (res) => res.data.data,
  })

  const [showModal, setShowModal]   = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState(null)

  // --- Helpers ---
  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
    setShowModal(true)
  }

  const openEdit = (post) => {
    setEditingId(post.id)
    setForm({
      title:        post.title        ?? '',
      slug:         post.slug         ?? '',
      type:         post.type         ?? 'blog',
      excerpt:      post.excerpt      ?? '',
      content:      post.content      ?? '',
      is_published: !!post.is_published,
    })
    setError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value }
      // Auto-generate slug from title only when adding (not editing)
      if (name === 'title' && !editingId) {
        updated.slug = toSlug(value)
      }
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editingId) {
        await axiosInstance.put(`/admin/posts/${editingId}`, form)
      } else {
        await axiosInstance.post('/admin/posts', form)
      }
      await refetch()
      closeModal()
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete post "${post.title}"? This cannot be undone.`)) return
    try {
      await axiosInstance.delete(`/admin/posts/${post.id}`)
      await refetch()
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Delete failed.')
    }
  }

  return (
    <div className="container-fluid">
      {/* Page header */}
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title mb-1">Posts / Insights</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
              <li className="breadcrumb-item active">Posts</li>
            </ol>
          </nav>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="ti ti-plus me-1"></i>Add Post
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Published</th>
                  <th>Published At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary"></div>
                    </td>
                  </tr>
                ) : !posts || posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No posts yet.{' '}
                      <button className="btn btn-link p-0" onClick={openAdd}>
                        Add the first post
                      </button>
                    </td>
                  </tr>
                ) : posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td className="fw-medium">{post.title}</td>
                    <td>
                      <span
                        className={`badge bg-${TYPE_BADGE[post.type] ?? 'secondary'}`}
                        style={post.type === 'case-study' ? { backgroundColor: '#6f42c1' } : {}}
                      >
                        {TYPE_LABEL[post.type] ?? post.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${post.is_published ? 'success' : 'secondary'}`}>
                        {post.is_published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(post)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={closeModal}
          ></div>

          {/* Dialog */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingId ? 'Edit Post' : 'Add Post'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {error && (
                      <div className="alert alert-danger py-2">{error}</div>
                    )}

                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">Title <span className="text-danger">*</span></label>
                      <input
                        name="title"
                        type="text"
                        className="form-control"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="Post title"
                      />
                    </div>

                    {/* Slug */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">Slug <span className="text-danger">*</span></label>
                      <input
                        name="slug"
                        type="text"
                        className="form-control"
                        value={form.slug}
                        onChange={handleChange}
                        required
                        placeholder="post-url-slug"
                      />
                      <small className="text-muted">Auto-generated from title. You may edit it manually.</small>
                    </div>

                    {/* Type */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">Type <span className="text-danger">*</span></label>
                      <select
                        name="type"
                        className="form-select"
                        value={form.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="blog">Blog</option>
                        <option value="case-study">Case Study</option>
                        <option value="news">News</option>
                      </select>
                    </div>

                    {/* Excerpt */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">Excerpt</label>
                      <textarea
                        name="excerpt"
                        className="form-control"
                        rows="2"
                        value={form.excerpt}
                        onChange={handleChange}
                        placeholder="Short summary shown in listings"
                      ></textarea>
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">Content</label>
                      <textarea
                        name="content"
                        className="form-control"
                        rows="8"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Full post content (HTML or plain text)"
                      ></textarea>
                    </div>

                    {/* Published */}
                    <div className="form-check">
                      <input
                        id="is_published"
                        name="is_published"
                        type="checkbox"
                        className="form-check-input"
                        checked={form.is_published}
                        onChange={handleChange}
                      />
                      <label htmlFor="is_published" className="form-check-label fw-medium">
                        Publish immediately
                      </label>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                        : <><i className="ti ti-device-floppy me-1"></i>{editingId ? 'Update Post' : 'Create Post'}</>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
