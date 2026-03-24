import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

export default function AdminSEO() {
  const queryClient = useQueryClient()
  const [saved, setSaved] = useState(false)

  const { data: seoSettings, isLoading } = useQuery({
    queryKey: ['admin', 'settings', 'seo'],
    queryFn: () => axiosInstance.get('/admin/settings/seo'),
    select: (res) => res.data.data,
  })

  const mutation = useMutation({
    mutationFn: (formData) => axiosInstance.post('/admin/settings/seo', formData),
    onSuccess: () => {
      setSaved(true)
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings', 'seo'] })
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    mutation.mutate(Object.fromEntries(fd))
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title mb-1">SEO &amp; Social Media Marketing</h4>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
            <li className="breadcrumb-item active">SEO / SMM</li>
          </ol></nav>
        </div>
      </div>

      {saved && <div className="alert alert-success">SEO settings saved!</div>}

      {isLoading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row g-4">

            {/* Global SEO */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-world me-2"></i>Global SEO</h5></div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-medium">Default Meta Title</label>
                    <input name="default_meta_title" type="text" className="form-control" defaultValue={seoSettings?.default_meta_title ?? ''} maxLength={70} />
                    <small className="text-muted">Max 70 characters. Shown in Google results.</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Default Meta Description</label>
                    <textarea name="default_meta_description" className="form-control" rows="3" defaultValue={seoSettings?.default_meta_description ?? ''} maxLength={160}></textarea>
                    <small className="text-muted">Max 160 characters.</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Canonical URL</label>
                    <input name="canonical_url" type="url" className="form-control" defaultValue={seoSettings?.canonical_url ?? ''} placeholder="https://yourdomain.com" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">robots.txt Content</label>
                    <textarea name="robots_txt" className="form-control" rows="4" defaultValue={seoSettings?.robots_txt ?? "User-agent: *\nAllow: /"}></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics & Tracking */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-chart-line me-2"></i>Analytics &amp; Tracking</h5></div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-medium">Google Analytics 4 (GA4) ID</label>
                    <input name="ga4_id" type="text" className="form-control" defaultValue={seoSettings?.ga4_id ?? ''} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Google Tag Manager ID</label>
                    <input name="gtm_id" type="text" className="form-control" defaultValue={seoSettings?.gtm_id ?? ''} placeholder="GTM-XXXXXXX" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Google Search Console Verification</label>
                    <input name="gsc_verification" type="text" className="form-control" defaultValue={seoSettings?.gsc_verification ?? ''} placeholder="meta content value" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Facebook Pixel ID</label>
                    <input name="fb_pixel_id" type="text" className="form-control" defaultValue={seoSettings?.fb_pixel_id ?? ''} placeholder="1234567890123456" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">TikTok Pixel ID</label>
                    <input name="tiktok_pixel_id" type="text" className="form-control" defaultValue={seoSettings?.tiktok_pixel_id ?? ''} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">LinkedIn Insight Tag</label>
                    <input name="linkedin_insight" type="text" className="form-control" defaultValue={seoSettings?.linkedin_insight ?? ''} />
                  </div>
                </div>
              </div>
            </div>

            {/* Open Graph / Social Cards */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-share me-2"></i>Open Graph / Social Sharing</h5></div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-medium">OG Title</label>
                    <input name="og_title" type="text" className="form-control" defaultValue={seoSettings?.og_title ?? ''} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">OG Description</label>
                    <textarea name="og_description" className="form-control" rows="2" defaultValue={seoSettings?.og_description ?? ''}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">OG Image URL</label>
                    <input name="og_image" type="text" className="form-control" defaultValue={seoSettings?.og_image ?? ''} placeholder="https://… (1200×630px recommended)" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Twitter Card Type</label>
                    <select name="twitter_card" className="form-select" defaultValue={seoSettings?.twitter_card ?? 'summary_large_image'}>
                      <option value="summary">summary</option>
                      <option value="summary_large_image">summary_large_image</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Twitter / X Handle</label>
                    <input name="twitter_handle" type="text" className="form-control" defaultValue={seoSettings?.twitter_handle ?? ''} placeholder="@yourhandle" />
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign UTM Builder */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0"><i className="ti ti-link me-2"></i>UTM Campaign Builder</h5></div>
                <div className="card-body">
                  <p className="text-muted small mb-3">Build UTM-tagged URLs for your marketing campaigns.</p>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Base URL</label>
                    <input id="utm_base" type="url" className="form-control" placeholder="https://yourdomain.com/courses" />
                  </div>
                  {[
                    ['utm_source',   'Source',   'e.g. facebook, google'],
                    ['utm_medium',   'Medium',   'e.g. cpc, email, social'],
                    ['utm_campaign', 'Campaign', 'e.g. ml-launch-2026'],
                    ['utm_content',  'Content',  'e.g. banner-A'],
                    ['utm_term',     'Term',     'e.g. machine+learning'],
                  ].map(([id, label, placeholder]) => (
                    <div key={id} className="mb-3">
                      <label className="form-label fw-medium">{label}</label>
                      <input id={id} type="text" className="form-control utm-field" placeholder={placeholder} />
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline-primary" onClick={() => {
                    const base = document.getElementById('utm_base')?.value
                    if (!base) return
                    const params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
                      .map(id => { const v = document.getElementById(id)?.value; return v ? `${id}=${encodeURIComponent(v)}` : null })
                      .filter(Boolean).join('&')
                    const url = `${base}?${params}`
                    navigator.clipboard?.writeText(url).then(() => alert(`Copied: ${url}`))
                  }}>
                    <i className="ti ti-copy me-1"></i>Generate &amp; Copy URL
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                : <><i className="ti ti-device-floppy me-2"></i>Save SEO Settings</>
              }
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
