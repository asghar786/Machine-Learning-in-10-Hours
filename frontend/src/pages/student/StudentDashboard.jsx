import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { enrollmentsApi, submissionsApi, certificatesApi } from '@/api/coursesApi'
import { useAuthStore } from '@/store/authStore'

export default function StudentDashboard() {
  const { user } = useAuthStore()

  const { data: enrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['enrollments', 'mine'],
    queryFn: () => enrollmentsApi.mine().then(r => r.data),
  })

  const { data: submissions } = useQuery({
    queryKey: ['submissions', 'mine'],
    queryFn: () => submissionsApi.mine().then(r => r.data),
  })

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates', 'mine'],
    queryFn: () => certificatesApi.mine().then(r => r.data),
  })

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="title-block">
            <h1>My Dashboard</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <h4 className="mb-4">Welcome back, {user?.name} 👋</h4>

          {/* Stats */}
          <div className="row mb-5">
            {[
              { icon: 'fa-book-open', label: 'Enrolled Courses', value: enrollments?.length ?? '—', color: 'text-primary' },
              { icon: 'fa-paper-plane', label: 'Submissions', value: submissions?.length ?? '—', color: 'text-info' },
              { icon: 'fa-check-circle', label: 'Graded', value: submissions?.filter(s => s.status === 'graded').length ?? '—', color: 'text-success' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="col-md-4 mb-4">
                <div className="card border-0 shadow-sm p-4 text-center">
                  <i className={`fa ${icon} fa-2x ${color} mb-2`}></i>
                  <h3 className="mb-0">{value}</h3>
                  <p className="text-muted mb-0">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Enrolled Courses */}
          <div className="mb-5">
            <h5 className="mb-3">My Courses</h5>

            {loadingEnrollments && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {!loadingEnrollments && enrollments?.length === 0 && (
              <div className="text-center py-4 text-muted">
                <p>You are not enrolled in any courses yet.</p>
                <Link to="/courses" className="btn btn-main rounded">Browse Courses</Link>
              </div>
            )}

            {!loadingEnrollments && enrollments?.length > 0 && (
              <div className="row">
                {enrollments.map((enrollment) => {
                  const course = enrollment.course
                  return (
                    <div key={enrollment.id} className="col-md-4 mb-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                          <div className="mb-2">
                            <span className="badge bg-primary-subtle text-primary small">
                              {course?.category || 'Course'}
                            </span>
                          </div>
                          <h6 className="card-title flex-grow-1">{course?.title}</h6>
                          <Link
                            to={`/learn/${course?.slug}/session/1`}
                            className="btn btn-sm btn-main rounded mt-3"
                          >
                            Continue Learning
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          {submissions?.length > 0 && (
            <div className="mb-5">
              <h5 className="mb-3">Recent Submissions</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Exercise</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 5).map((s) => (
                      <tr key={s.id}>
                        <td>{s.exercise?.title || `Exercise #${s.exercise_id}`}</td>
                        <td>
                          <span className={`badge ${s.status === 'graded' ? 'bg-success' : s.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>{s.score !== null ? `${s.score}%` : '—'}</td>
                        <td>{new Date(s.submitted_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Certificates */}
          <div className="mb-5">
            <h5 className="mb-3">My Certificates</h5>
            {certificates.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="fa fa-certificate fa-2x mb-2"></i>
                <p className="mb-0">No certificates yet. Complete a course to earn your certificate.</p>
              </div>
            ) : (
              <div className="row">
                {certificates.map((cert) => (
                  <div key={cert.id} className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm text-center p-4">
                      <i className="fa fa-certificate fa-3x text-warning mb-3"></i>
                      <h6 className="mb-1">{cert.course?.title}</h6>
                      <p className="text-muted small mb-1">
                        Issued: {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                      {cert.final_score !== null && (
                        <p className="text-muted small mb-3">Score: {cert.final_score}%</p>
                      )}
                      <div className="d-flex gap-2 justify-content-center">
                        <Link
                          to={`/certificates/${cert.uuid}`}
                          className="btn btn-sm btn-outline-primary rounded"
                        >
                          <i className="fa fa-eye me-1"></i>View
                        </Link>
                        <a
                          href={`/api/v1/certificates/${cert.uuid}/download`}
                          className="btn btn-sm btn-main rounded"
                        >
                          <i className="fa fa-download me-1"></i>Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
