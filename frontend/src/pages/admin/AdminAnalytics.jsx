import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

export default function AdminAnalytics() {
  const enrollmentChartRef = useRef(null)
  const submissionsChartRef = useRef(null)
  const groupChartRef = useRef(null)
  const enrollmentChartInstance = useRef(null)
  const submissionsChartInstance = useRef(null)
  const groupChartInstance = useRef(null)

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => axiosInstance.get('/admin/analytics'),
    select: (res) => res.data.data,
  })

  // Enrollment trend line chart
  useEffect(() => {
    if (!stats?.enrollment_trend || !enrollmentChartRef.current || !window.ApexCharts) return
    enrollmentChartInstance.current?.destroy()
    const dates = stats.enrollment_trend.map(d => d.date)
    const counts = stats.enrollment_trend.map(d => d.count)
    enrollmentChartInstance.current = new window.ApexCharts(enrollmentChartRef.current, {
      chart: { type: 'area', height: 280, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Enrollments', data: counts }],
      xaxis: { categories: dates, labels: { rotate: -45, style: { fontSize: '11px' } } },
      colors: ['#4154f1'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      tooltip: { x: { format: 'dd MMM' } },
    })
    enrollmentChartInstance.current.render()
    return () => enrollmentChartInstance.current?.destroy()
  }, [stats?.enrollment_trend])

  // Submissions by status donut chart
  useEffect(() => {
    if (!stats?.submissions_by_status || !submissionsChartRef.current || !window.ApexCharts) return
    submissionsChartInstance.current?.destroy()
    const labels = stats.submissions_by_status.map(s => s.status)
    const series = stats.submissions_by_status.map(s => s.count)
    submissionsChartInstance.current = new window.ApexCharts(submissionsChartRef.current, {
      chart: { type: 'donut', height: 280, fontFamily: 'inherit' },
      series,
      labels,
      colors: ['#f6c23e', '#1cc88a', '#e74a3b'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
    })
    submissionsChartInstance.current.render()
    return () => submissionsChartInstance.current?.destroy()
  }, [stats?.submissions_by_status])

  // Group A/B bar chart
  useEffect(() => {
    if (!stats?.group_distribution || !groupChartRef.current || !window.ApexCharts) return
    groupChartInstance.current?.destroy()
    const labels = stats.group_distribution.map(g => `Group ${g.group}`)
    const series = stats.group_distribution.map(g => g.count)
    groupChartInstance.current = new window.ApexCharts(groupChartRef.current, {
      chart: { type: 'bar', height: 280, toolbar: { show: false }, fontFamily: 'inherit' },
      series: [{ name: 'Students', data: series }],
      xaxis: { categories: labels },
      colors: ['#4154f1', '#2eca6a'],
      plotOptions: { bar: { borderRadius: 4, distributed: true } },
      legend: { show: false },
      dataLabels: { enabled: true },
    })
    groupChartInstance.current.render()
    return () => groupChartInstance.current?.destroy()
  }, [stats?.group_distribution])

  const statCards = [
    { label: 'Total Enrollments',   value: stats?.total_enrollments,                        icon: 'ti ti-users',       color: 'primary' },
    { label: 'Completion Rate',      value: stats?.completion_rate != null ? `${stats.completion_rate}%` : '—', icon: 'ti ti-chart-pie',   color: 'success' },
    { label: 'Avg. Score',           value: stats?.avg_score != null ? `${stats.avg_score}%` : '—',             icon: 'ti ti-star',        color: 'warning' },
    { label: 'Certificates Issued',  value: stats?.total_certificates,                       icon: 'ti ti-certificate', color: 'info'    },
    { label: 'Total Students',       value: stats?.total_students,                           icon: 'ti ti-user-check',  color: 'primary' },
    { label: 'Pending Grading',      value: stats?.pending_submissions,                      icon: 'ti ti-clock',       color: 'danger'  },
  ]

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title mb-1">Analytics</h4>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
            <li className="breadcrumb-item active">Analytics</li>
          </ol></nav>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="row g-3 mb-4">
            {statCards.map(({ label, value, icon, color }) => (
              <div key={label} className="col-xl-2 col-md-4 col-sm-6">
                <div className="card h-100">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1 fs-12">{label}</p>
                      <h4 className="mb-0">{value ?? '—'}</h4>
                    </div>
                    <div className={`bg-${color}-subtle rounded d-flex align-items-center justify-content-center`} style={{ width: 48, height: 48 }}>
                      <i className={`${icon} fs-22 text-${color}`}></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div className="row g-3 mb-3">
            <div className="col-xl-8">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0">Enrollment Trend — Last 30 Days</h5></div>
                <div className="card-body"><div ref={enrollmentChartRef} /></div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0">Submissions by Status</h5></div>
                <div className="card-body"><div ref={submissionsChartRef} /></div>
              </div>
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="row g-3">
            <div className="col-xl-4">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0">Student Group Distribution</h5></div>
                <div className="card-body"><div ref={groupChartRef} /></div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="card">
                <div className="card-header"><h5 className="card-title mb-0">Platform Summary</h5></div>
                <div className="card-body">
                  <table className="table table-sm table-bordered mb-0">
                    <tbody>
                      <tr><td className="text-muted">Total Students</td><td><strong>{stats?.total_students ?? '—'}</strong></td></tr>
                      <tr><td className="text-muted">Total Enrollments</td><td><strong>{stats?.total_enrollments ?? '—'}</strong></td></tr>
                      <tr><td className="text-muted">Completed Enrollments</td><td><strong>{stats?.completion_rate != null ? `${stats.completion_rate}% completion rate` : '—'}</strong></td></tr>
                      <tr><td className="text-muted">Certificates Issued</td><td><strong>{stats?.total_certificates ?? '—'}</strong></td></tr>
                      <tr><td className="text-muted">Average Score</td><td><strong>{stats?.avg_score != null ? `${stats.avg_score}%` : 'No graded submissions yet'}</strong></td></tr>
                      <tr><td className="text-muted">Pending Grading</td><td><strong>{stats?.pending_submissions ?? '—'} submissions</strong></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
