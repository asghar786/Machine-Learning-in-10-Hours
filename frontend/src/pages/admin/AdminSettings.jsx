import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

export default function AdminSettings() {
  const queryClient = useQueryClient()
  const [saved, setSaved] = useState(false)

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings', 'site'],
    queryFn: () => axiosInstance.get('/admin/settings/site'),
    select: (res) => res.data.data,
  })

  const mutation = useMutation({
    mutationFn: (formData) => axiosInstance.post('/admin/settings/site', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      setSaved(true)
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings', 'site'] })
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    mutation.mutate(fd)
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title mb-1">Site Settings</h4>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
            <li className="breadcrumb-item active">Site Settings</li>
          </ol></nav>
        </div>
      </div>

      {saved && <div className="alert alert-success">Settings saved successfully!</div>}

      {isLoading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row g-4">

            {/* General */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-settings me-2"></i>General</h5></div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-medium">Site Name</label>
                    <input name="site_name" type="text" className="form-control" defaultValue={settings?.site_name ?? 'Machine Learning in 10 Hours'} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Tagline</label>
                    <input name="tagline" type="text" className="form-control" defaultValue={settings?.tagline ?? 'Learn. Practice. Get Certified.'} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Contact Email</label>
                    <input name="contact_email" type="email" className="form-control" defaultValue={settings?.contact_email ?? ''} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Support Phone</label>
                    <input name="support_phone" type="text" className="form-control" defaultValue={settings?.support_phone ?? ''} />
                  </div>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-palette me-2"></i>Branding</h5></div>
                <div className="card-body">
                  <div className="mb-4">
                    <label className="form-label fw-medium">Logo</label>
                    {settings?.logo_url && <img src={settings.logo_url} alt="Logo" className="d-block mb-2" style={{ maxHeight: 50 }} />}
                    <input name="logo" type="file" className="form-control" accept="image/*" />
                    <small className="text-muted">PNG or SVG recommended. Max 500KB.</small>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Favicon</label>
                    {settings?.favicon_url && <img src={settings.favicon_url} alt="Favicon" className="d-block mb-2" style={{ maxHeight: 32 }} />}
                    <input name="favicon" type="file" className="form-control" accept="image/x-icon,image/png,image/svg+xml" />
                    <small className="text-muted">.ico or 32×32 PNG.</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Primary Color</label>
                    <div className="d-flex align-items-center gap-2">
                      <input name="primary_color" type="color" className="form-control form-control-color" defaultValue={settings?.primary_color ?? '#2563eb'} style={{ width: 60 }} />
                      <input type="text" className="form-control" defaultValue={settings?.primary_color ?? '#2563eb'} readOnly style={{ maxWidth: 120 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-share me-2"></i>Social Media Links</h5></div>
                <div className="card-body">
                  {[
                    { name: 'facebook_url',  icon: 'fab fa-facebook',  label: 'Facebook' },
                    { name: 'twitter_url',   icon: 'fab fa-twitter',   label: 'Twitter / X' },
                    { name: 'linkedin_url',  icon: 'fab fa-linkedin',  label: 'LinkedIn' },
                    { name: 'youtube_url',   icon: 'fab fa-youtube',   label: 'YouTube' },
                    { name: 'instagram_url', icon: 'fab fa-instagram', label: 'Instagram' },
                  ].map(({ name, icon, label }) => (
                    <div key={name} className="mb-3 input-group">
                      <span className="input-group-text"><i className={icon}></i></span>
                      <input name={name} type="url" className="form-control" defaultValue={settings?.[name] ?? ''} placeholder={`https://${name.replace('_url', '')}.com/yourpage`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO / Meta */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-world me-2"></i>SEO / Meta Tags</h5></div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-medium">Meta Title</label>
                    <input name="meta_title" type="text" className="form-control" maxLength={70} defaultValue={settings?.meta_title ?? ''} placeholder="Page title for search engines (max 70 chars)" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Meta Description</label>
                    <textarea name="meta_description" className="form-control" rows="3" maxLength={160} defaultValue={settings?.meta_description ?? ''} placeholder="Search engine description (max 160 chars)"></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Meta Keywords</label>
                    <input name="meta_keywords" type="text" className="form-control" defaultValue={settings?.meta_keywords ?? ''} placeholder="machine learning, online course, certification" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Google Analytics ID</label>
                    <input name="ga_id" type="text" className="form-control" defaultValue={settings?.ga_id ?? ''} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Facebook Pixel ID</label>
                    <input name="fb_pixel_id" type="text" className="form-control" defaultValue={settings?.fb_pixel_id ?? ''} placeholder="1234567890" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                : <><i className="ti ti-device-floppy me-2"></i>Save Settings</>
              }
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
