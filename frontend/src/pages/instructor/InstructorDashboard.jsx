import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { instructorApi } from '@/api/instructorApi'

export default function InstructorDashboard() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['instructor', 'dashboard'],
    queryFn: () => instructorApi.dashboard().then(r => r.data),
  })

  const stats = data?.stats ?? { total_courses: 0, published_courses: 0, total_students: 0, total_enrollments: 0 }
  const recentEnrollments = data?.recent_enrollments ?? []

  const STAT_CARDS = [
    { icon: 'ti ti-book',        label: 'My Courses',        value: stats.total_courses,     color: 'bg-primary' },
    { icon: 'ti ti-check-circle',label: 'Published',         value: stats.published_courses, color: 'bg-success' },
    { icon: 'ti ti-users',       label: 'Total Students',    value: stats.total_students,    color: 'bg-info'    },
    { icon: 'ti ti-trending-up', label: 'Total Enrollments', value: stats.total_enrollments, color: 'bg-warning' },
  ]

  return (
    <>
      {/* Page title */}
      <div className="page-title-box">
        <div className="page-title-right">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item"><Link to="/instructor">Instructor</Link></li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </div>
        <h4 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h4>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="col-xl-3 col-md-6">
            <div className="card mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted fw-medium mb-1">{s.label}</p>
                    <h3 className="mb-0 fw-bold">{isLoading ? '—' : s.value}</h3>
                  </div>
                  <div className={`avatar-md rounded ${s.color} bg-opacity-10 d-flex align-items-center justify-content-center`}>
                    <i className={`${s.icon} fs-24 ${s.color.replace('bg-', 'text-')}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* My Courses */}
        <div className="col-xl-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">My Courses</h5>
              <Link to="/instructor/courses" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {isLoading ? (
                <div className="text-center py-4"><div className="spinner-border text-primary spinner-border-sm"></div></div>
              ) : (data?.courses ?? []).length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="ti ti-book-off fs-36 mb-2 d-block"></i>
                  No courses assigned yet
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Course</th>
                        <th>Students</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.courses ?? []).map(c => (
                        <tr key={c.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {c.thumbnail && (
                                <img src={c.thumbnail} alt="" style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 4 }} />
                              )}
                              <span className="fw-medium">{c.title}</span>
                            </div>
                          </td>
                          <td>{c.enrollments_count}</td>
                          <td>
                            <span className={`badge ${c.is_published ? 'bg-success' : 'bg-secondary'}`}>
                              {c.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="col-xl-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Recent Enrollments</h5>
              <Link to="/instructor/students" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {isLoading ? (
                <div className="text-center py-4"><div className="spinner-border text-primary spinner-border-sm"></div></div>
              ) : recentEnrollments.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="ti ti-user-off fs-36 mb-2 d-block"></i>
                  No enrollments yet
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnrollments.map(e => (
                        <tr key={e.id}>
                          <td>
                            <span className="fw-medium">{e.user?.name}</span>
                            <div className="text-muted small">{e.user?.email}</div>
                          </td>
                          <td className="small">{e.course?.title}</td>
                          <td className="text-muted small">
                            {new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
