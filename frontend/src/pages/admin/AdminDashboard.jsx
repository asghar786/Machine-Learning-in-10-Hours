import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

const STATUS_COLOR = { graded: 'success', pending: 'warning', resubmit: 'info', failed: 'danger' }
const STATUS_ICON  = { graded: 'solar:check-circle-bold-duotone', pending: 'solar:clock-circle-bold-duotone', resubmit: 'solar:refresh-circle-bold-duotone', failed: 'solar:close-circle-bold-duotone' }

const AVATAR_COLORS = ['primary','info','success','warning','danger','secondary']
function avatarColor(name = '') {
  const i = name.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[i]
}
function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function StatCard({ icon, bgIcon, label, value, color, trend, trendUp }) {
  return (
    <div className="col">
      <div className="card overflow-hidden">
        <div className="card-body">
          <h5 className="text-muted fs-13 text-uppercase fw-medium mb-0">{label}</h5>
          <div className="d-flex align-items-center gap-2 my-2 py-1">
            <div className="user-img fs-42 flex-shrink-0">
              <span className={`avatar-title text-bg-${color} rounded-circle fs-22`}>
                <iconify-icon icon={icon}></iconify-icon>
              </span>
            </div>
            <h3 className="mb-0 fw-bold">{value ?? <span className="placeholder col-3" />}</h3>
            <iconify-icon
              className="ms-auto display-1 position-absolute opacity-25 text-muted widget-icon"
              icon={bgIcon}
            ></iconify-icon>
          </div>
          {trend && (
            <p className="mb-0 text-muted fs-13">
              <span className={`text-${trendUp ? 'success' : 'danger'} me-1`}>
                <i className={`ti ti-caret-${trendUp ? 'up' : 'down'}-filled`}></i> {trend}
              </span>
              Since last month
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => axiosInstance.get('/admin/users').then(r => r.data),
  })

  const { data: coursesData } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => axiosInstance.get('/admin/courses').then(r => r.data),
  })

  const { data: submissionsData } = useQuery({
    queryKey: ['admin', 'submissions'],
    queryFn: () => axiosInstance.get('/admin/submissions').then(r => r.data),
  })

  const { data: pendingData } = useQuery({
    queryKey: ['admin', 'submissions', 'pending'],
    queryFn: () => axiosInstance.get('/admin/submissions', { params: { status: 'pending' } }).then(r => r.data),
  })

  const users       = usersData?.data       ?? usersData       ?? []
  const courses     = coursesData?.data      ?? coursesData     ?? []
  const submissions = submissionsData?.data  ?? submissionsData ?? []
  const pending     = pendingData?.data      ?? pendingData     ?? []

  const totalUsers       = usersData?.total       ?? users.length
  const totalSubmissions = submissionsData?.total  ?? submissions.length
  const pendingCount     = pendingData?.total      ?? pending.length
  const totalCourses     = coursesData?.total      ?? courses.length

  const recentSubmissions = [...submissions].slice(0, 6)
  const recentUsers       = [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6)

  // Build activity feed from submissions
  const activities = [...submissions]
    .sort((a, b) => new Date(b.submitted_at || b.created_at) - new Date(a.submitted_at || a.created_at))
    .slice(0, 8)
    .map(s => ({
      id:     s.id,
      user:   s.user?.name ?? 'Student',
      action: s.status === 'graded' ? 'submission graded' : 'submitted exercise',
      course: s.exercise?.session?.title ?? 'a session',
      time:   s.submitted_at || s.created_at,
      status: s.status,
    }))

  return (
    <div className="container-fluid">

      {/* Page title */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="page-title mb-1">Dashboard</h4>
          <p className="text-muted mb-0 fs-14">Welcome back, Admin — here's what's happening today.</p>
        </div>
        <span className="badge bg-primary-subtle text-primary fs-13 px-3 py-2">
          <i className="ti ti-calendar me-1"></i>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Stat cards */}
      <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1 g-3 mb-4">
        <StatCard
          icon="solar:users-group-rounded-bold-duotone"
          bgIcon="solar:users-group-two-rounded-line-duotone"
          label="Total Students" value={totalUsers}
          color="primary" trend="12.5%" trendUp={true}
        />
        <StatCard
          icon="solar:book-bold-duotone"
          bgIcon="solar:notebook-line-duotone"
          label="Total Courses" value={totalCourses}
          color="info" trend="2 new" trendUp={true}
        />
        <StatCard
          icon="solar:file-send-bold-duotone"
          bgIcon="solar:documents-line-duotone"
          label="Submissions" value={totalSubmissions}
          color="success" trend="8.3%" trendUp={true}
        />
        <StatCard
          icon="solar:hourglass-bold-duotone"
          bgIcon="solar:clock-square-line-duotone"
          label="Pending Grading" value={pendingCount}
          color="warning" trend={pendingCount > 3 ? 'Needs attention' : 'All good'} trendUp={pendingCount <= 3}
        />
      </div>

      {/* Main content row */}
      <div className="row g-3 mb-4">

        {/* Recent submissions table */}
        <div className="col-xl-8">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h4 className="header-title mb-0">Recent Submissions</h4>
              <a href="/admin/submissions" className="btn btn-sm btn-light">
                View All <i className="ti ti-arrow-right ms-1"></i>
              </a>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-custom table-centered table-sm table-nowrap table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Student</th>
                      <th>Session</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.length === 0 ? (
                      <tr><td colSpan="5" className="text-center text-muted py-4">No submissions yet</td></tr>
                    ) : recentSubmissions.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className={`avatar-title avatar-sm bg-${avatarColor(s.user?.name)} text-white rounded-circle fs-12`}>
                              {initials(s.user?.name)}
                            </span>
                            <span className="fw-medium">{s.user?.name ?? '—'}</span>
                          </div>
                        </td>
                        <td className="text-muted fs-13">{s.exercise?.session?.title ?? '—'}</td>
                        <td>
                          <span className={`badge bg-${STATUS_COLOR[s.status] ?? 'secondary'}-subtle text-${STATUS_COLOR[s.status] ?? 'secondary'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="fw-medium">
                          {s.score != null ? `${s.score}%` : <span className="text-muted">—</span>}
                        </td>
                        <td className="text-muted fs-13">{timeAgo(s.submitted_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="col-xl-4">
          <div className="card h-100">
            <div className="card-header">
              <h4 className="header-title mb-0">Recent Activity</h4>
            </div>
            <div className="card-body">
              {activities.length === 0 ? (
                <p className="text-muted text-center py-3">No activity yet</p>
              ) : (
                <div className="timeline-alt pb-0">
                  {activities.map((a, i) => (
                    <div key={a.id} className={`timeline-item${i === activities.length - 1 ? ' last' : ''}`}>
                      <i className={`mdi mdi-circle bg-${STATUS_COLOR[a.status] ?? 'primary'}-subtle text-${STATUS_COLOR[a.status] ?? 'primary'} timeline-icon`}></i>
                      <div className="timeline-item-info">
                        <span className="fw-semibold fs-14">{a.user}</span>
                        <small className="d-block text-muted mt-1">{a.action} — {a.course}</small>
                        <p className="mb-0 pb-2 text-muted fs-12">
                          <i className="ti ti-clock me-1"></i>{timeAgo(a.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h4 className="header-title mb-0">Recent Registrations</h4>
          <a href="/admin/users" className="btn btn-sm btn-light">
            All Users <i className="ti ti-arrow-right ms-1"></i>
          </a>
        </div>
        <div className="card-body p-0">
          <div className="bg-light bg-opacity-50 py-2 px-3">
            <p className="mb-0 fs-13">
              <strong>{totalUsers}</strong> total students enrolled
            </p>
          </div>
          <div className="table-responsive">
            <table className="table table-custom table-centered table-sm table-nowrap table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Group</th>
                  <th>Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted py-4">No users yet</td></tr>
                ) : recentUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`avatar-title avatar-sm bg-${avatarColor(u.name)} text-white rounded-circle fs-12`}>
                          {initials(u.name)}
                        </span>
                        <span className="fw-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-muted fs-13">{u.email}</td>
                    <td>
                      {u.group != null
                        ? <span className={`badge bg-${u.group === 0 ? 'primary' : 'info'}-subtle text-${u.group === 0 ? 'primary' : 'info'}`}>Group {u.group === 0 ? 'A' : 'B'}</span>
                        : <span className="text-muted">—</span>
                      }
                    </td>
                    <td className="text-muted fs-13">{timeAgo(u.created_at)}</td>
                    <td>
                      <span className="badge bg-success-subtle text-success">
                        <i className="ti ti-circle-filled fs-10 me-1"></i> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
