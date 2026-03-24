import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const DEVICE_COLORS  = { desktop: '#4154f1', mobile: '#f6c23e', tablet: '#1cc88a' }
const BROWSER_COLORS = ['#4154f1', '#1cc88a', '#f6c23e', '#e74a3b', '#36b9cc', '#858796']
const PERIOD_OPTIONS = [{ label: '7 days', value: 7 }, { label: '30 days', value: 30 }, { label: '90 days', value: 90 }]

export default function AdminVisits() {
  const [days, setDays] = useState(30)

  const trendRef        = useRef(null)
  const deviceRef       = useRef(null)
  const browserRef      = useRef(null)
  const trendInstance   = useRef(null)
  const deviceInstance  = useRef(null)
  const browserInstance = useRef(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'visits', days],
    queryFn: () => axiosInstance.get('/admin/visits', { params: { days } }),
    select: (res) => res.data.data,
    refetchInterval: 60_000,
  })

  // ── Trend chart ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!data?.trend || !trendRef.current || !window.ApexCharts) return
    trendInstance.current?.destroy()
    const dates    = data.trend.map(d => d.date)
    const visits   = data.trend.map(d => d.visits)
    const uniq     = data.trend.map(d => d.unique_visitors)
    trendInstance.current = new window.ApexCharts(trendRef.current, {
      chart: { type: 'area', height: 280, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [
        { name: 'Total Visits',      data: visits },
        { name: 'Unique Visitors',   data: uniq },
      ],
      xaxis: { categories: dates, labels: { rotate: -45, style: { fontSize: '10px' } } },
      colors: ['#4154f1', '#1cc88a'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02 } },
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      legend: { position: 'top' },
      tooltip: { x: { format: 'dd MMM yyyy' } },
    })
    trendInstance.current.render()
    return () => trendInstance.current?.destroy()
  }, [data?.trend])

  // ── Device donut ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!data?.devices || !deviceRef.current || !window.ApexCharts) return
    deviceInstance.current?.destroy()
    const labels = data.devices.map(d => d.device_type)
    const series = data.devices.map(d => d.count)
    deviceInstance.current = new window.ApexCharts(deviceRef.current, {
      chart: { type: 'donut', height: 240, fontFamily: 'inherit' },
      series,
      labels,
      colors: labels.map(l => DEVICE_COLORS[l] || '#858796'),
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
    })
    deviceInstance.current.render()
    return () => deviceInstance.current?.destroy()
  }, [data?.devices])

  // ── Browser bar chart ────────────────────────────────────────────────
  useEffect(() => {
    if (!data?.browsers || !browserRef.current || !window.ApexCharts) return
    browserInstance.current?.destroy()
    const browsers = data.browsers.map(b => b.browser)
    const counts   = data.browsers.map(b => b.count)
    browserInstance.current = new window.ApexCharts(browserRef.current, {
      chart: { type: 'bar', height: 240, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Visits', data: counts }],
      xaxis: { categories: browsers },
      colors: BROWSER_COLORS,
      plotOptions: { bar: { distributed: true, borderRadius: 4 } },
      legend: { show: false },
      dataLabels: { enabled: false },
    })
    browserInstance.current.render()
    return () => browserInstance.current?.destroy()
  }, [data?.browsers])

  const kpis = data?.kpis
  const fmt  = (n) => (n ?? 0).toLocaleString()

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h4 className="page-title mb-1">Visit Analytics</h4>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
            <li className="breadcrumb-item active">Visit Tracking</li>
          </ol></nav>
        </div>
        <div className="col-auto d-flex gap-2">
          {PERIOD_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => setDays(o.value)}
              className={`btn btn-sm rounded-pill ${days === o.value ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="row mb-4">
            {[
              { label: 'Total Visits (All Time)', value: fmt(kpis?.total_visits),     icon: 'fa-eye',         color: 'text-primary' },
              { label: 'Visits Today',            value: fmt(kpis?.visits_today),      icon: 'fa-calendar-day', color: 'text-success' },
              { label: 'This Week',               value: fmt(kpis?.visits_this_week),  icon: 'fa-calendar-week', color: 'text-info' },
              { label: `Last ${days} Days`,       value: fmt(kpis?.visits_period),     icon: 'fa-chart-line',  color: 'text-warning' },
              { label: 'Unique Visitors (All)',   value: fmt(kpis?.unique_visitors),   icon: 'fa-users',       color: 'text-danger' },
              { label: `Unique (${days}d)`,       value: fmt(kpis?.unique_period),     icon: 'fa-user-check',  color: 'text-secondary' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="col-xl-2 col-md-4 col-6 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center py-3">
                    <i className={`fa ${icon} fa-lg ${color} mb-1`}></i>
                    <h4 className="mb-0 fw-bold">{value}</h4>
                    <p className="text-muted mb-0" style={{ fontSize: 11 }}>{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trend Chart */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white fw-semibold py-3">
              Visits Over Time — Last {days} Days
            </div>
            <div className="card-body">
              <div ref={trendRef}></div>
            </div>
          </div>

          {/* Device + Browser row */}
          <div className="row mb-4">
            <div className="col-md-5 mb-4 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white fw-semibold py-3">Device Breakdown</div>
                <div className="card-body"><div ref={deviceRef}></div></div>
              </div>
            </div>
            <div className="col-md-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white fw-semibold py-3">Browser Breakdown</div>
                <div className="card-body"><div ref={browserRef}></div></div>
              </div>
            </div>
          </div>

          {/* Top Pages + Referrers row */}
          <div className="row mb-4">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white fw-semibold py-3">Top Pages</div>
                <div className="table-responsive">
                  <table className="table table-hover table-sm mb-0">
                    <thead className="table-light">
                      <tr><th>Page</th><th className="text-end">Visits</th></tr>
                    </thead>
                    <tbody>
                      {data?.top_pages?.map((p, i) => (
                        <tr key={i}>
                          <td className="text-truncate" style={{ maxWidth: 260 }}>
                            <span className="text-muted small me-1">{i + 1}.</span>
                            <span title={p.url}>{p.title || p.url}</span>
                            <div className="text-muted" style={{ fontSize: 11 }}>{p.url}</div>
                          </td>
                          <td className="text-end fw-semibold">{p.visits.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white fw-semibold py-3">Top Referrers</div>
                <div className="table-responsive">
                  <table className="table table-hover table-sm mb-0">
                    <thead className="table-light">
                      <tr><th>Referrer</th><th className="text-end">Visits</th></tr>
                    </thead>
                    <tbody>
                      {data?.referrers?.length === 0 && (
                        <tr><td colSpan="2" className="text-center text-muted py-3">No referrer data yet</td></tr>
                      )}
                      {data?.referrers?.map((r, i) => (
                        <tr key={i}>
                          <td>{r.referer || '(direct)'}</td>
                          <td className="text-end fw-semibold">{r.count.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* OS breakdown pills */}
          {data?.operating_systems?.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white fw-semibold py-3">Operating Systems</div>
              <div className="card-body d-flex flex-wrap gap-2">
                {data.operating_systems.map(o => (
                  <span key={o.os} className="badge rounded-pill bg-light text-dark border px-3 py-2" style={{ fontSize: 13 }}>
                    {o.os} — <strong>{o.count.toLocaleString()}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent visits table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold py-3">Recent Visits (Last 50)</div>
            <div className="table-responsive">
              <table className="table table-hover table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Page</th>
                    <th>IP Address</th>
                    <th>User</th>
                    <th>Device</th>
                    <th>Browser</th>
                    <th>OS</th>
                    <th>Referrer</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recent?.map(v => (
                    <tr key={v.id}>
                      <td className="text-truncate" style={{ maxWidth: 200 }} title={v.url}>
                        {v.url}
                      </td>
                      <td><code style={{ fontSize: 11 }}>{v.ip_address}</code></td>
                      <td>
                        {v.user
                          ? <span className="badge bg-primary-subtle text-primary">{v.user.name}</span>
                          : <span className="text-muted small">Guest</span>
                        }
                      </td>
                      <td>
                        <span className={`badge ${v.device_type === 'mobile' ? 'bg-warning text-dark' : v.device_type === 'tablet' ? 'bg-success' : 'bg-info text-dark'}`}>
                          {v.device_type}
                        </span>
                      </td>
                      <td><span className="small">{v.browser}</span></td>
                      <td><span className="small">{v.os}</span></td>
                      <td className="text-truncate" style={{ maxWidth: 150 }} title={v.referer || ''}>
                        <span className="small text-muted">{v.referer ? (new URL(v.referer.startsWith('http') ? v.referer : 'http://' + v.referer).hostname) : '—'}</span>
                      </td>
                      <td className="text-muted small text-nowrap">
                        {new Date(v.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
