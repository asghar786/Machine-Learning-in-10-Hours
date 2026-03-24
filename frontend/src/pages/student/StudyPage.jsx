import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { enrollmentsApi, submissionsApi, certificatesApi } from '@/api/coursesApi'

const STATUS_BADGE = {
  pending:   'bg-warning text-dark',
  graded:    'bg-success',
  resubmit:  'bg-danger',
}

export default function StudyPage() {
  const { data: enrollments = [], isLoading: loadingEnrollments } = useQuery({
    queryKey: ['enrollments', 'mine'],
    queryFn: () => enrollmentsApi.mine().then(r => r.data),
  })

  const { data: submissions = [], isLoading: loadingSubmissions } = useQuery({
    queryKey: ['submissions', 'mine'],
    queryFn: () => submissionsApi.mine().then(r => r.data),
  })

  const { data: certificates = [], isLoading: loadingCertificates } = useQuery({
    queryKey: ['certificates', 'mine'],
    queryFn: () => certificatesApi.mine().then(r => r.data),
  })

  const recentSubmissions = submissions.slice(0, 4)

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="title-block">
            <h1>Study Hub</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Study Hub</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row">

            {/* Main Column */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm p-4">
                <h5 className="mb-4">
                  <i className="fa fa-book-open me-2 text-primary"></i>
                  My Active Courses
                </h5>

                {loadingEnrollments && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {!loadingEnrollments && enrollments.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    <i className="fa fa-graduation-cap fa-3x mb-3 d-block"></i>
                    <p className="mb-3">You are not enrolled in any courses yet.</p>
                    <Link to="/courses" className="btn btn-main rounded">
                      <i className="fa fa-search me-2"></i>Browse Courses
                    </Link>
                  </div>
                )}

                {!loadingEnrollments && enrollments.length > 0 && (
                  <div className="row g-3">
                    {enrollments.map((enrollment) => {
                      const course = enrollment.course
                      const sessionCount = course?.sessions_count ?? course?.sessions?.length ?? null

                      return (
                        <div key={enrollment.id} className="col-12">
                          <div className="card border rounded-3 h-100">
                            <div className="card-body">
                              <div className="d-flex align-items-start justify-content-between gap-3">
                                <div className="flex-grow-1">
                                  <div className="mb-1">
                                    <span className="badge bg-primary-subtle text-primary small">
                                      {course?.category || 'Course'}
                                    </span>
                                  </div>
                                  <h6 className="card-title mb-1">{course?.title}</h6>
                                  {sessionCount !== null && (
                                    <p className="text-muted small mb-0">
                                      <i className="fa fa-play-circle me-1"></i>
                                      {sessionCount} session{sessionCount !== 1 ? 's' : ''} available
                                    </p>
                                  )}
                                </div>
                                <div className="d-flex flex-column gap-2 flex-shrink-0">
                                  <Link
                                    to={`/learn/${course?.slug}/session/1`}
                                    className="btn btn-sm btn-main rounded"
                                  >
                                    <i className="fa fa-play me-1"></i>Continue Learning
                                  </Link>
                                  <Link
                                    to={`/learn/${course?.slug}/quiz`}
                                    className="btn btn-sm btn-outline-primary rounded"
                                  >
                                    <i className="fa fa-chart-bar me-1"></i>View Progress
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="col-lg-4">

              {/* My Submissions */}
              <div className="card border-0 shadow-sm p-4 mb-4">
                <h6 className="mb-3">
                  <i className="fa fa-paper-plane me-2 text-info"></i>
                  My Submissions
                </h6>

                {loadingSubmissions && (
                  <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {!loadingSubmissions && submissions.length === 0 && (
                  <p className="text-muted small mb-0">No submissions yet.</p>
                )}

                {!loadingSubmissions && submissions.length > 0 && (
                  <>
                    <ul className="list-unstyled mb-2">
                      {recentSubmissions.map((s) => (
                        <li key={s.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                          <div className="flex-grow-1 me-2 overflow-hidden">
                            <p className="mb-0 small text-truncate">
                              {s.exercise?.title || `Exercise #${s.exercise_id}`}
                            </p>
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-shrink-0">
                            <span className={`badge ${STATUS_BADGE[s.status] ?? 'bg-secondary'}`}>
                              {s.status}
                            </span>
                            <span className="text-muted small">
                              {s.score !== null ? `${s.score}%` : '—'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Link to="/dashboard" className="btn btn-sm btn-outline-secondary rounded w-100">
                      View All Submissions
                    </Link>
                  </>
                )}
              </div>

              {/* My Certificates */}
              <div className="card border-0 shadow-sm p-4 mb-4">
                <h6 className="mb-3">
                  <i className="fa fa-certificate me-2 text-warning"></i>
                  My Certificates
                </h6>

                {loadingCertificates && (
                  <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {!loadingCertificates && certificates.length === 0 && (
                  <p className="text-muted small mb-0">
                    Complete a course to earn your certificate.
                  </p>
                )}

                {!loadingCertificates && certificates.length > 0 && (
                  <>
                    <p className="text-muted small mb-2">
                      You have <strong>{certificates.length}</strong> certificate{certificates.length !== 1 ? 's' : ''}.
                    </p>
                    <ul className="list-unstyled mb-2">
                      {certificates.map((cert) => (
                        <li key={cert.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                          <span className="small text-truncate me-2 flex-grow-1">
                            {cert.course?.title || cert.course_title}
                          </span>
                          <a
                            href={`/api/v1/certificates/${cert.uuid}/download`}
                            className="btn btn-sm btn-outline-warning rounded flex-shrink-0"
                            title="Download certificate"
                          >
                            <i className="fa fa-download"></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <Link to="/my-certificates" className="btn btn-sm btn-outline-secondary rounded w-100">
                      View All Certificates
                    </Link>
                  </>
                )}
              </div>

              {/* Quick Links */}
              <div className="card border-0 shadow-sm p-4">
                <h6 className="mb-3">
                  <i className="fa fa-link me-2 text-secondary"></i>
                  Quick Links
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <Link to="/profile" className="text-decoration-none">
                      <i className="fa fa-user me-2 text-primary"></i>My Profile
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/account" className="text-decoration-none">
                      <i className="fa fa-cog me-2 text-secondary"></i>Account Settings
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/dashboard" className="text-decoration-none">
                      <i className="fa fa-th-large me-2 text-info"></i>My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses" className="text-decoration-none">
                      <i className="fa fa-search me-2 text-success"></i>Browse More Courses
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
