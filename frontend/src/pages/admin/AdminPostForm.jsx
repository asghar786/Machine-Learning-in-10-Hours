import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Editor } from '@tinymce/tinymce-react'
import axiosInstance from '@/api/axiosInstance'

const TYPES = ['blog', 'case-study', 'news']
const CATEGORIES = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Web Development', 'Networking', 'Productivity', 'Programming',
  'Cybersecurity', 'Cloud Computing', 'Other',
]

const EMPTY = {
  title: '', slug: '', type: 'blog', category: '', excerpt: '', content: '',
  thumbnail: '', feature_image: '', is_published: false, published_at: '',
  meta_title: '', meta_description: '',
  og_title: '', og_description: '', og_image: '', focus_keyword: '', canonical_url: '',
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function SeoScore({ form }) {
  const checks = [
    { label: 'Title (10–60 chars)',      ok: form.title.length >= 10 && form.title.length <= 60 },
    { label: 'Meta Title',               ok: form.meta_title.length >= 10 && form.meta_title.length <= 70 },
    { label: 'Meta Description',         ok: form.meta_description.length >= 50 && form.meta_description.length <= 160 },
    { label: 'Focus Keyword',            ok: form.focus_keyword.length > 0 },
    { label: 'OG Title',                 ok: form.og_title.length > 0 },
    { label: 'OG Description',           ok: form.og_description.length > 0 },
    { label: 'OG Image',                 ok: form.og_image.length > 0 },
    { label: 'Thumbnail',                ok: form.thumbnail.length > 0 },
    { label: 'Excerpt (50+ chars)',       ok: form.excerpt.length >= 50 },
    { label: 'Content (300+ chars)',      ok: form.content.length >= 300 },
  ]
  const score = checks.filter(c => c.ok).length
  const color = score >= 8 ? 'success' : score >= 5 ? 'warning' : 'danger'
  return (
    <div className="card border-0 bg-light mb-3">
      <div className="card-body py-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-semibold fs-13">SEO Score</span>
          <span className={`badge bg-${color} fs-12`}>{score}/{checks.length}</span>
        </div>
        <div className="progress mb-3" style={{ height: 6 }}>
          <div className={`progress-bar bg-${color}`} style={{ width: `${(score / checks.length) * 100}%` }}></div>
        </div>
        <div className="row g-1">
          {checks.map(c => (
            <div key={c.label} className="col-6">
              <small className={`d-flex align-items-center gap-1 text-${c.ok ? 'success' : 'muted'}`}>
                <i className={`ti ti-${c.ok ? 'circle-check' : 'circle-x'}`}></i>{c.label}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminPostForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const editorRef = useRef(null)

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [tab, setTab] = useState('content')

  // Load post if editing
  const { isLoading: loadingPost } = useQuery({
    queryKey: ['admin', 'post', id],
    queryFn: () => axiosInstance.get(`/admin/posts`).then(r => {
      const list = Array.isArray(r.data) ? r.data : []
      return list.find(p => String(p.id) === String(id)) ?? null
    }),
    enabled: isEdit,
    onSuccess: (p) => {
      if (!p) { navigate('/admin/posts'); return }
      setForm({
        title:            p.title ?? '',
        slug:             p.slug ?? '',
        type:             p.type ?? 'blog',
        category:         p.category ?? '',
        excerpt:          p.excerpt ?? '',
        content:          p.content ?? '',
        thumbnail:        p.thumbnail ?? '',
        feature_image:    p.feature_image ?? '',
        is_published:     !!p.is_published,
        published_at:     p.published_at ? p.published_at.slice(0, 10) : '',
        meta_title:       p.meta_title ?? '',
        meta_description: p.meta_description ?? '',
        og_title:         p.og_title ?? '',
        og_description:   p.og_description ?? '',
        og_image:         p.og_image ?? '',
        focus_keyword:    p.focus_keyword ?? '',
        canonical_url:    p.canonical_url ?? '',
      })
    },
  })

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      isEdit
        ? axiosInstance.put(`/admin/posts/${id}`, payload).then(r => r.data)
        : axiosInstance.post('/admin/posts', payload).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] })
      navigate('/admin/posts')
    },
    onError: (err) => {
      setErrors(err.response?.data?.errors ?? {})
      if (err.response?.data?.errors?.content) setTab('content')
    },
  })

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => {
      const updated = { ...f, [name]: type === 'checkbox' ? checked : value }
      if (name === 'title' && !isEdit) updated.slug = slugify(value)
      if (name === 'title' && !isEdit && !f.meta_title) updated.meta_title = value
      if (name === 'excerpt' && !isEdit && !f.og_description) updated.og_description = value
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    // Get content from TinyMCE
    const content = editorRef.current ? editorRef.current.getContent() : form.content
    saveMutation.mutate({
      ...form,
      content,
      published_at: form.is_published && !form.published_at ? new Date().toISOString() : form.published_at || null,
    })
  }

  if (loadingPost) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <span className="spinner-border text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="page-title mb-1">{isEdit ? 'Edit Post' : 'Add New Post'}</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
              <li className="breadcrumb-item"><a href="/admin/posts">Posts</a></li>
              <li className="breadcrumb-item active">{isEdit ? 'Edit' : 'New'}</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-light" onClick={() => navigate('/admin/posts')}>
            <i className="ti ti-arrow-left me-1"></i>Back
          </button>
          <button type="submit" form="post-form" className="btn btn-primary" disabled={saveMutation.isPending}>
            {saveMutation.isPending
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
              : <><i className="ti ti-device-floppy me-1"></i>{isEdit ? 'Save Changes' : 'Publish Post'}</>}
          </button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* ── Left Column (main editor) ── */}
          <div className="col-xl-8">

            {/* Error alert */}
            {saveMutation.isError && !Object.keys(errors).length && (
              <div className="alert alert-danger py-2 mb-3">
                {saveMutation.error?.response?.data?.message ?? 'Failed to save post.'}
              </div>
            )}

            {/* Tabs */}
            <ul className="nav nav-tabs mb-0" style={{ borderBottom: 'none' }}>
              <li className="nav-item">
                <button type="button"
                  className={`nav-link px-4 ${tab === 'content' ? 'active' : ''}`}
                  onClick={() => setTab('content')}>
                  <i className="ti ti-pencil me-1"></i>Content
                </button>
              </li>
              <li className="nav-item">
                <button type="button"
                  className={`nav-link px-4 ${tab === 'seo' ? 'active' : ''}`}
                  onClick={() => setTab('seo')}>
                  <i className="ti ti-world me-1"></i>SEO &amp; OG Tags
                  {(form.meta_title || form.og_title) &&
                    <span className="badge bg-success-subtle text-success ms-2 fs-11">filled</span>}
                </button>
              </li>
            </ul>

            {/* ── CONTENT TAB ── */}
            {tab === 'content' && (
              <div className="card border-top-0 rounded-top-0">
                <div className="card-body">
                  <div className="row g-3">
                    {/* Title */}
                    <div className="col-12">
                      <label className="form-label fw-medium">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        name="title"
                        className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                        value={form.title}
                        onChange={handleField}
                        required
                        placeholder="Enter post title…"
                      />
                      {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
                    </div>

                    {/* Slug + Type */}
                    <div className="col-md-8">
                      <label className="form-label fw-medium">Slug <span className="text-danger">*</span></label>
                      <input
                        name="slug"
                        className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                        value={form.slug}
                        onChange={handleField}
                        required
                        placeholder="url-friendly-slug"
                      />
                      {errors.slug
                        ? <div className="invalid-feedback">{errors.slug[0]}</div>
                        : <small className="text-muted">Auto-generated from title</small>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Type</label>
                      <select name="type" className="form-select" value={form.type} onChange={handleField}>
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* Excerpt */}
                    <div className="col-12">
                      <label className="form-label fw-medium">Excerpt</label>
                      <textarea
                        name="excerpt"
                        className="form-control"
                        rows={2}
                        value={form.excerpt}
                        onChange={handleField}
                        placeholder="Short summary shown in listings (50–160 chars recommended)"
                      />
                      <small className="text-muted">{form.excerpt.length} chars</small>
                    </div>

                    {/* TinyMCE Content */}
                    <div className="col-12">
                      <label className="form-label fw-medium">
                        Content <span className="text-danger">*</span>
                      </label>
                      <Editor
                        onInit={(_evt, editor) => { editorRef.current = editor }}
                        initialValue={form.content}
                        init={{
                          height: 480,
                          menubar: true,
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                            'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount',
                            'codesample',
                          ],
                          toolbar:
                            'undo redo | blocks | bold italic forecolor | ' +
                            'alignleft aligncenter alignright alignjustify | ' +
                            'bullist numlist outdent indent | ' +
                            'link image media codesample | ' +
                            'removeformat | fullscreen | help',
                          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Preformatted=pre',
                          content_style: 'body { font-family: -apple-system, sans-serif; font-size: 15px; line-height: 1.7; }',
                          branding: false,
                          promotion: false,
                          base_url: '/tinymce',
                          suffix: '.min',
                        }}
                        onEditorChange={(content) => setForm(f => ({ ...f, content }))}
                      />
                      {errors.content && (
                        <div className="text-danger small mt-1">{errors.content[0]}</div>
                      )}
                      <small className="text-muted">{form.content.length} chars</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SEO TAB ── */}
            {tab === 'seo' && (
              <div className="card border-top-0 rounded-top-0">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <SeoScore form={form} />
                    </div>

                    {/* Search Engine Meta */}
                    <div className="col-12">
                      <h6 className="fw-semibold text-uppercase text-muted fs-12 mb-3 border-bottom pb-2">
                        <i className="ti ti-search me-1"></i>Search Engine (Meta Tags)
                      </h6>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Meta Title</label>
                      <input
                        name="meta_title"
                        className="form-control"
                        value={form.meta_title}
                        onChange={handleField}
                        placeholder="SEO title (50–70 chars recommended)"
                        maxLength={70}
                      />
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Shown in search engine results</small>
                        <small className={form.meta_title.length > 65 ? 'text-warning' : 'text-muted'}>
                          {form.meta_title.length}/70
                        </small>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Meta Description</label>
                      <textarea
                        name="meta_description"
                        className="form-control"
                        rows={3}
                        value={form.meta_description}
                        onChange={handleField}
                        placeholder="Search result snippet (50–160 chars)"
                        maxLength={160}
                      />
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Shown below the title in search results</small>
                        <small className={form.meta_description.length > 155 ? 'text-warning' : 'text-muted'}>
                          {form.meta_description.length}/160
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Focus Keyword</label>
                      <input
                        name="focus_keyword"
                        className="form-control"
                        value={form.focus_keyword}
                        onChange={handleField}
                        placeholder="e.g. machine learning tutorial"
                      />
                      <small className="text-muted">Main keyword this post should rank for</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Canonical URL</label>
                      <input
                        name="canonical_url"
                        className="form-control"
                        value={form.canonical_url}
                        onChange={handleField}
                        placeholder="https://yourdomain.com/insights/slug"
                      />
                      <small className="text-muted">Leave blank to use default URL</small>
                    </div>

                    {/* Google SERP Preview */}
                    {(form.meta_title || form.title) && (
                      <div className="col-12">
                        <label className="form-label fw-medium">Google Preview</label>
                        <div className="p-3 border rounded bg-white">
                          <div className="text-success small mb-1">
                            machinelearning.local › insights › {form.slug || 'post-slug'}
                          </div>
                          <div className="fw-medium text-primary" style={{ fontSize: 18 }}>
                            {form.meta_title || form.title || 'Post Title'}
                          </div>
                          <div className="text-secondary small mt-1">
                            {form.meta_description || form.excerpt || 'Meta description will appear here…'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Open Graph */}
                    <div className="col-12 mt-2">
                      <h6 className="fw-semibold text-uppercase text-muted fs-12 mb-3 border-bottom pb-2">
                        <i className="ti ti-share me-1"></i>Open Graph (Social Media Preview)
                      </h6>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">OG Title</label>
                      <input
                        name="og_title"
                        className="form-control"
                        value={form.og_title}
                        onChange={handleField}
                        placeholder="Title shown when shared on Facebook, LinkedIn, Twitter"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">OG Description</label>
                      <textarea
                        name="og_description"
                        className="form-control"
                        rows={2}
                        value={form.og_description}
                        onChange={handleField}
                        placeholder="Description shown in social media link previews"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">OG Image URL</label>
                      <input
                        name="og_image"
                        className="form-control"
                        value={form.og_image}
                        onChange={handleField}
                        placeholder="https://… (1200×630px recommended)"
                      />
                    </div>

                    {/* Social preview card */}
                    {form.og_image && (
                      <div className="col-12">
                        <label className="form-label fw-medium">Social Preview</label>
                        <div className="border rounded overflow-hidden" style={{ maxWidth: 480 }}>
                          <img
                            src={form.og_image}
                            alt="OG preview"
                            className="w-100"
                            style={{ maxHeight: 200, objectFit: 'cover' }}
                            onError={e => e.target.style.display = 'none'}
                          />
                          <div className="p-2 bg-light border-top">
                            <div className="text-muted small text-uppercase">machinelearning.local</div>
                            <div className="fw-semibold">{form.og_title || form.title}</div>
                            <div className="text-secondary small">{form.og_description || form.excerpt}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column (sidebar) ── */}
          <div className="col-xl-4">

            {/* Publish Settings */}
            <div className="card mb-3">
              <div className="card-header py-2">
                <h6 className="mb-0 fw-semibold"><i className="ti ti-settings me-2"></i>Publish Settings</h6>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={form.is_published}
                    onChange={handleField}
                  />
                  <label className="form-check-label fw-medium" htmlFor="is_published">
                    Publish immediately
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Publish Date</label>
                  <input
                    name="published_at"
                    type="date"
                    className="form-control"
                    value={form.published_at}
                    onChange={handleField}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Category</label>
                  <select name="category" className="form-select" value={form.category} onChange={handleField}>
                    <option value="">— Select Category —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label fw-medium">Type</label>
                  <select name="type" className="form-select" value={form.type} onChange={handleField}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card mb-3">
              <div className="card-header py-2">
                <h6 className="mb-0 fw-semibold"><i className="ti ti-photo me-2"></i>Images</h6>
              </div>
              <div className="card-body">
                {/* Title / Listing Image */}
                <label className="form-label fw-medium">
                  Title Image
                  <small className="text-muted fw-normal ms-1">(shown in listing cards)</small>
                </label>
                <input
                  name="thumbnail"
                  className="form-control"
                  value={form.thumbnail}
                  onChange={handleField}
                  placeholder="https://images.unsplash.com/…"
                />
                {form.thumbnail ? (
                  <div className="mt-2">
                    <img
                      src={form.thumbnail}
                      alt="thumbnail preview"
                      className="rounded w-100"
                      style={{ maxHeight: 120, objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                ) : (
                  <div className="mt-2 border rounded d-flex align-items-center justify-content-center bg-light"
                    style={{ height: 80 }}>
                    <span className="text-muted fs-12"><i className="ti ti-photo me-1"></i>No title image</span>
                  </div>
                )}

                <hr className="my-3" />

                {/* Feature / Hero Image */}
                <label className="form-label fw-medium">
                  Feature Image
                  <small className="text-muted fw-normal ms-1">(hero banner on post page)</small>
                </label>
                <input
                  name="feature_image"
                  className="form-control"
                  value={form.feature_image}
                  onChange={handleField}
                  placeholder="https://images.unsplash.com/…?w=1200"
                />
                {form.feature_image ? (
                  <div className="mt-2">
                    <img
                      src={form.feature_image}
                      alt="feature image preview"
                      className="rounded w-100"
                      style={{ maxHeight: 120, objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                ) : (
                  <div className="mt-2 border rounded d-flex align-items-center justify-content-center bg-light"
                    style={{ height: 80 }}>
                    <span className="text-muted fs-12"><i className="ti ti-photo me-1"></i>No feature image</span>
                  </div>
                )}
                <small className="text-muted d-block mt-1">Paste any image URL (Unsplash, CDN, etc.)</small>
              </div>
            </div>

            {/* Quick SEO score in sidebar */}
            <div className="card">
              <div className="card-header py-2 d-flex align-items-center justify-content-between">
                <h6 className="mb-0 fw-semibold"><i className="ti ti-chart-bar me-2"></i>SEO Score</h6>
                <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setTab('seo')}>
                  Configure →
                </button>
              </div>
              <div className="card-body py-2">
                {(() => {
                  const checks = [
                    form.meta_title.length >= 10,
                    form.meta_description.length >= 50,
                    form.focus_keyword.length > 0,
                    form.og_image.length > 0,
                    form.thumbnail.length > 0 || form.feature_image.length > 0,
                  ]
                  const score = checks.filter(Boolean).length
                  const color = score >= 4 ? 'success' : score >= 2 ? 'warning' : 'danger'
                  return (
                    <>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <small className="text-muted">Quick score</small>
                        <span className={`badge bg-${color}`}>{score}/5</span>
                      </div>
                      <div className="progress" style={{ height: 6 }}>
                        <div className={`progress-bar bg-${color}`} style={{ width: `${(score / 5) * 100}%` }}></div>
                      </div>
                      <div className="mt-2">
                        {[
                          { label: 'Meta Title', ok: checks[0] },
                          { label: 'Meta Desc',  ok: checks[1] },
                          { label: 'Keyword',    ok: checks[2] },
                          { label: 'OG Image',   ok: checks[3] },
                          { label: 'Thumbnail',  ok: checks[4] },
                        ].map(c => (
                          <div key={c.label} className={`small text-${c.ok ? 'success' : 'muted'}`}>
                            <i className={`ti ti-${c.ok ? 'check' : 'x'} me-1`}></i>{c.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Save bar */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-2 p-3 bg-white border rounded">
          <button type="button" className="btn btn-light" onClick={() => navigate('/admin/posts')}>
            <i className="ti ti-arrow-left me-1"></i>Cancel
          </button>
          <div className="d-flex gap-2">
            {tab === 'content' && (
              <button type="button" className="btn btn-outline-primary" onClick={() => setTab('seo')}>
                Next: SEO Settings <i className="ti ti-arrow-right ms-1"></i>
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-lg px-4" disabled={saveMutation.isPending}>
              {saveMutation.isPending
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                : <><i className="ti ti-device-floppy me-2"></i>{isEdit ? 'Save Changes' : 'Publish Post'}</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
