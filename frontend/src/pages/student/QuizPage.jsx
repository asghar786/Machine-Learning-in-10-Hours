import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { coursesApi, submissionsApi, certificatesApi } from '@/api/coursesApi'

export default function QuizPage() {
  const { slug } = useParams()

  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.getBySlug(slug).then(r => r.data),
  })

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions', 'mine'],
    queryFn: () => submissionsApi.mine().then(r => r.data),
  })

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates', 'mine'],
    queryFn: () => certificatesApi.mine().then(r => r.data),
  })

  // Flatten all exercises from all sessions
  const allExercises = course?.sessions
    ? course.sessions.flatMap((s) => s.exercises || [])
    : []

  // Map exercise IDs belonging to this course
  const exerciseIds = new Set(allExercises.map((e) => e.id))

  // Filter submissions to only those for this course's exercises
  const courseSubmissions = submissions.filter((s) => exerciseIds.has(s.exercise_id))

  // Stats
  const totalExercises = allExercises.length
  const submittedCount = courseSubmissions.length
  const gradedCount = courseSubmissions.filter((s) => s.status === 'graded').length
  const gradedScores = courseSubmissions.filter((s) => s.status === 'graded' && s.score !== null).map((s) => s.score)
  const averageScore = gradedScores.length > 0
    ? Math.round(gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length)
    : null

  const progressPct = totalExercises > 0 ? Math.round((submittedCount / totalExercises) * 100) : 0

  // Build a lookup map: exercise_id → submission
  const submissionMap = {}
  courseSubmissions.forEach((s) => {
    submissionMap[s.exercise_id] = s
  })

  // Check if certificate exists for this course
  const certificate = certificates.find(
    (c) => c.course_id === course?.id || c.course?.title === course?.title
  )

  if (loadingCourse) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="title-block">
                <h1>Course Assessment</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to={`/courses/${slug}`}>{course?.title || slug}</Link></li>
                  <li className="active">Assessment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              {/* Course Title */}
              <h3 className="mb-4">
                <i className="fa fa-graduation-cap me-2 text-color"></i>
                {course?.title || 'Loading…'}
              </h3>

              {/* Certificate Banner */}
              {certificate ? (
                <div className="alert alert-success d-flex align-items-center gap-3 mb-4" role="alert">
                  <i className="fa fa-certificate fa-2x text-success"></i>
                  <div className="flex-grow-1">
                    <strong>Certificate Issued!</strong> You have successfully completed this course.
                    {certificate.final_score !== null && (
                      <span className="ms-2 text-muted">Final Score: {certificate.final_score}%</span>
                    )}
                    <br />
                    <small className="text-muted">Issued: {new Date(certificate.issued_at).toLocaleDateString()}</small>
                  </div>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/certificates/${certificate.uuid}`}
                      className="btn btn-sm btn-success rounded"
                    >
                      <i className="fa fa-eye me-1"></i>View
                    </Link>
                    <a
                      href={`/api/v1/certificates/${certificate.uuid}/download`}
                      className="btn btn-sm btn-outline-success rounded"
                    >
                      <i className="fa fa-download me-1"></i>Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info d-flex align-items-start gap-3 mb-4" role="alert">
                  <i className="fa fa-info-circle fa-lg mt-1"></i>
                  <div>
                    <strong>Certificate Pending</strong><br />
                    Your instructor will review your submissions. Your certificate will be issued
                    automatically once all exercises are reviewed and your score meets the passing threshold.
                  </div>
                </div>
              )}

              {/* Progress Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="mb-4">
                    <i className="fa fa-tasks me-2 text-color"></i>Progress Overview
                  </h5>
                  <div className="row text-center mb-4">
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="p-3 bg-light rounded">
                        <h3 className="mb-0 text-primary">{totalExercises}</h3>
                        <p className="text-muted small mb-0">Total Exercises</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="p-3 bg-light rounded">
                        <h3 className="mb-0 text-info">{submittedCount}</h3>
                        <p className="text-muted small mb-0">Submitted</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="p-3 bg-light rounded">
                        <h3 className="mb-0 text-success">{gradedCount}</h3>
                        <p className="text-muted small mb-0">Graded</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="p-3 bg-light rounded">
                        <h3 className="mb-0 text-warning">{averageScore !== null ? `${averageScore}%` : '—'}</h3>
                        <p className="text-muted small mb-0">Avg Score</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>{submittedCount} of {totalExercises} exercises submitted</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${progressPct}%` }}
                      aria-valuenow={progressPct}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Exercises Table */}
              {allExercises.length > 0 && (
                <div className="card border-0 shadow-sm mb-5">
                  <div className="card-header bg-white py-3">
                    <h5 className="mb-0">
                      <i className="fa fa-list me-2 text-color"></i>Exercise Status
                    </h5>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Exercise</th>
                          <th>Session</th>
                          <th>Status</th>
                          <th>Score</th>
                          <th>Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {course.sessions.flatMap((session) =>
                          (session.exercises || []).map((exercise, idx) => {
                            const sub = submissionMap[exercise.id]
                            return (
                              <tr key={exercise.id}>
                                <td className="text-muted small">{idx + 1}</td>
                                <td>{exercise.title}</td>
                                <td className="text-muted small">Session {session.session_number}</td>
                                <td>
                                  {!sub ? (
                                    <span className="badge bg-light text-dark">Not submitted</span>
                                  ) : sub.status === 'graded' ? (
                                    <span className="badge bg-success">
                                      <i className="fa fa-check me-1"></i>Graded
                                    </span>
                                  ) : sub.status === 'resubmit' ? (
                                    <span className="badge bg-danger">Resubmit</span>
                                  ) : (
                                    <span className="badge bg-warning text-dark">
                                      <i className="fa fa-clock me-1"></i>Pending Review
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {sub?.status === 'graded' && sub.score !== null
                                    ? `${sub.score}%`
                                    : '—'}
                                </td>
                                <td className="text-muted small">
                                  {sub?.submitted_at
                                    ? new Date(sub.submitted_at).toLocaleDateString()
                                    : '—'}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="d-flex gap-3">
                <Link
                  to={`/learn/${slug}/session/1`}
                  className="btn btn-outline-secondary rounded"
                >
                  <i className="fa fa-arrow-left me-2"></i>Back to Sessions
                </Link>
                <Link to="/dashboard" className="btn btn-main rounded">
                  <i className="fa fa-tachometer-alt me-2"></i>My Dashboard
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
